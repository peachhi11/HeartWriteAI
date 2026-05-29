use serde::Serialize;
use sha2::{Digest, Sha256};
use std::io::{Cursor, Write};
use std::time::Duration;
use tauri::{AppHandle, State};
use zip::write::SimpleFileOptions;
use zip::ZipWriter;

use crate::state_manager::{PersistentEngineStore, ProfileSaveData};

const CLOUD_SYNC_TIMEOUT_SECONDS: u64 = 20;
const CLOUD_SYNC_MAX_ENDPOINT_LENGTH: usize = 2048;
const CLOUD_SYNC_MAX_TOKEN_LENGTH: usize = 4096;

#[derive(Serialize, Debug, Clone, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CloudSyncResponse {
    pub success: bool,
    pub remote_checksum: String,
    pub local_checksum: String,
    pub uploaded_bytes: usize,
    pub server_message: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct CloudSyncManifest {
    active_slot: u32,
    app_version: String,
    archive_kind: &'static str,
    client_timestamp: String,
    dialogue_entries: usize,
    milestone_count: usize,
    total_turns_played: u64,
}

#[tauri::command]
pub async fn push_save_to_cloud_repository(
    endpoint: String,
    token: String,
    app: AppHandle,
    state_store: State<'_, PersistentEngineStore>,
) -> Result<CloudSyncResponse, String> {
    CloudSyncBroker::execute_backup_upload(app, state_store, endpoint, token).await
}

pub struct CloudSyncBroker;

impl CloudSyncBroker {
    pub async fn execute_backup_upload(
        app: AppHandle,
        state_store: State<'_, PersistentEngineStore>,
        remote_endpoint: String,
        access_token: String,
    ) -> Result<CloudSyncResponse, String> {
        validate_cloud_sync_endpoint(&remote_endpoint)?;
        validate_cloud_sync_token(&access_token)?;

        let active_slot = state_store.active_slot()?;
        let profile_data = state_store
            .runtime_data
            .lock()
            .map_err(|_| "Could not read the active playthrough save.".to_string())?
            .clone();

        let app_version = app.package_info().version.to_string();
        let archive_bytes = build_backup_archive(active_slot, &app_version, &profile_data)?;
        let local_checksum = checksum_hex(&archive_bytes);
        let uploaded_bytes = archive_bytes.len();

        let client = reqwest::Client::builder()
            .timeout(Duration::from_secs(CLOUD_SYNC_TIMEOUT_SECONDS))
            .build()
            .map_err(|error| format!("Could not prepare cloud backup request: {error}"))?;

        let response = client
            .post(remote_endpoint)
            .bearer_auth(access_token)
            .header("Content-Type", "application/zip")
            .header("X-HeartWriteAI-Slot", active_slot.to_string())
            .header("X-HeartWriteAI-Checksum", &local_checksum)
            .body(archive_bytes)
            .send()
            .await
            .map_err(|error| format!("Cloud backup could not connect: {error}"))?;

        let status = response.status();
        if !status.is_success() {
            return Err(format!("Cloud backup was rejected with status {status}."));
        }

        let server_payload: serde_json::Value = response.json().await.unwrap_or_else(|_| {
            serde_json::json!({
                "message": "Backup uploaded. The server did not return JSON details."
            })
        });
        let remote_checksum = server_payload
            .get("checksum")
            .or_else(|| server_payload.get("remoteChecksum"))
            .and_then(serde_json::Value::as_str)
            .unwrap_or(&local_checksum)
            .to_string();
        let server_message = server_payload
            .get("message")
            .or_else(|| server_payload.get("serverMessage"))
            .and_then(serde_json::Value::as_str)
            .unwrap_or("Backup uploaded successfully.")
            .to_string();

        Ok(CloudSyncResponse {
            success: true,
            remote_checksum,
            local_checksum,
            uploaded_bytes,
            server_message,
        })
    }
}

fn build_backup_archive(
    active_slot: u32,
    app_version: &str,
    profile_data: &ProfileSaveData,
) -> Result<Vec<u8>, String> {
    let manifest = CloudSyncManifest {
        active_slot,
        app_version: app_version.to_string(),
        archive_kind: "heartwriteai-playthrough-backup",
        client_timestamp: chrono::Utc::now().to_rfc3339(),
        dialogue_entries: profile_data.dialogue_history.len(),
        milestone_count: profile_data.active_trope_milestones.len(),
        total_turns_played: profile_data.total_turns_played,
    };
    let mut cursor = Cursor::new(Vec::new());
    let mut zip = ZipWriter::new(&mut cursor);
    let options = SimpleFileOptions::default()
        .compression_method(zip::CompressionMethod::Deflated)
        .unix_permissions(0o600);

    zip.start_file("manifest.json", options)
        .map_err(|error| format!("Could not create backup manifest: {error}"))?;
    write_json(&mut zip, &manifest)?;

    zip.start_file("active-playthrough.json", options)
        .map_err(|error| format!("Could not create backup save payload: {error}"))?;
    write_json(&mut zip, profile_data)?;

    zip.finish()
        .map_err(|error| format!("Could not finish backup archive: {error}"))?;

    Ok(cursor.into_inner())
}

fn write_json<W: Write, T: Serialize>(writer: &mut W, value: &T) -> Result<(), String> {
    let json = serde_json::to_vec_pretty(value)
        .map_err(|error| format!("Could not serialize backup JSON: {error}"))?;
    writer
        .write_all(&json)
        .map_err(|error| format!("Could not write backup JSON: {error}"))
}

fn checksum_hex(bytes: &[u8]) -> String {
    format!("{:x}", Sha256::digest(bytes))
}

fn validate_cloud_sync_endpoint(endpoint: &str) -> Result<(), String> {
    let trimmed = endpoint.trim();
    if trimmed.is_empty() {
        return Err("Enter a cloud backup endpoint first.".to_string());
    }
    if trimmed.len() > CLOUD_SYNC_MAX_ENDPOINT_LENGTH {
        return Err("Cloud backup endpoint is too long.".to_string());
    }

    let parsed =
        reqwest::Url::parse(trimmed).map_err(|_| "Cloud backup endpoint must be a valid URL.")?;
    let host = parsed.host_str().unwrap_or_default();
    let is_local = matches!(host, "localhost" | "127.0.0.1" | "::1");
    if parsed.scheme() != "https" && !(is_local && parsed.scheme() == "http") {
        return Err(
            "Cloud backup endpoint must use HTTPS, except localhost during development."
                .to_string(),
        );
    }

    Ok(())
}

fn validate_cloud_sync_token(token: &str) -> Result<(), String> {
    let trimmed = token.trim();
    if trimmed.is_empty() {
        return Err("Enter a cloud backup access token first.".to_string());
    }
    if trimmed.len() > CLOUD_SYNC_MAX_TOKEN_LENGTH {
        return Err("Cloud backup access token is too long.".to_string());
    }
    if trimmed.chars().any(char::is_whitespace) {
        return Err("Cloud backup access token cannot contain spaces.".to_string());
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::state_manager::{default_relationship_stats, CharacterCardModel, RustDialogueEntry};
    use zip::ZipArchive;

    #[test]
    fn rejects_insecure_remote_endpoint() {
        assert!(validate_cloud_sync_endpoint("http://example.com/sync").is_err());
        assert!(validate_cloud_sync_endpoint("https://example.com/sync").is_ok());
        assert!(validate_cloud_sync_endpoint("http://localhost:8787/sync").is_ok());
    }

    #[test]
    fn rejects_blank_or_spaced_access_tokens() {
        assert!(validate_cloud_sync_token("").is_err());
        assert!(validate_cloud_sync_token("abc def").is_err());
        assert!(validate_cloud_sync_token("token_123").is_ok());
    }

    #[test]
    fn backup_archive_contains_manifest_and_playthrough_json() {
        let profile = ProfileSaveData {
            stats: default_relationship_stats(),
            active_trope_milestones: vec!["CONFESSION_ACCEPTED".to_string()],
            total_turns_played: 7,
            last_updated: "2026-05-29T00:00:00Z".to_string(),
            dialogue_history: vec![RustDialogueEntry {
                id: "line-1".to_string(),
                role: "Player".to_string(),
                text: "I choose you.".to_string(),
                timestamp: "2026-05-29T00:00:00Z".to_string(),
                detected_trope: "yearning".to_string(),
            }],
            active_character: Some(CharacterCardModel {
                name: "Mia".to_string(),
                description: "A soft-spoken romantic lead.".to_string(),
                forbidden_tones: Vec::new(),
                preferred_tones: vec!["yearning".to_string()],
                avatar_data_uri: String::new(),
            }),
        };

        let archive_bytes =
            build_backup_archive(2, "0.1.0", &profile).expect("archive should build");
        assert!(!archive_bytes.is_empty());
        assert_eq!(checksum_hex(&archive_bytes).len(), 64);

        let mut archive = ZipArchive::new(Cursor::new(archive_bytes)).expect("archive should read");
        assert!(archive.by_name("manifest.json").is_ok());
        assert!(archive.by_name("active-playthrough.json").is_ok());
    }
}
