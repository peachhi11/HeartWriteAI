use serde::Serialize;
use std::fs::{copy, create_dir_all, rename, File};
use std::path::{Path, PathBuf};
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::{AppHandle, Manager};

use crate::utils::assets::{is_supported_expression_path, local_asset_uri_for_path};

const AVATAR_STORAGE_DIR: &str = "user_profiles/avatars";
const MAX_AVATAR_SOURCE_BYTES: u64 = 20 * 1024 * 1024;

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
pub struct RegisteredAvatarAsset {
    #[serde(rename = "assetProtocolUrl")]
    pub asset_protocol_url: String,
    #[serde(rename = "internalSandboxPath")]
    pub internal_sandbox_path: String,
}

#[tauri::command]
pub async fn register_user_avatar(
    app_handle: AppHandle,
    source_path: String,
) -> Result<RegisteredAvatarAsset, String> {
    let source_path = PathBuf::from(source_path);
    let target_dir = avatar_storage_dir(&app_handle)?;

    tauri::async_runtime::spawn_blocking(move || register_avatar_to_dir(&source_path, &target_dir))
        .await
        .map_err(|error| format!("Avatar asset copy worker failed: {error}"))?
}

fn register_avatar_to_dir(
    source_path: &Path,
    target_dir: &Path,
) -> Result<RegisteredAvatarAsset, String> {
    validate_avatar_source(source_path)?;
    create_dir_all(target_dir)
        .map_err(|error| format!("Avatar asset directory create failed: {error}"))?;

    let target_path = unique_avatar_path(source_path, target_dir)?;
    let tmp_path = target_path.with_extension(format!(
        "{}.tmp",
        target_path
            .extension()
            .and_then(|extension| extension.to_str())
            .unwrap_or("asset")
    ));

    copy(source_path, &tmp_path).map_err(|error| format!("Avatar asset copy failed: {error}"))?;

    File::open(&tmp_path)
        .and_then(|file| file.sync_all())
        .map_err(|error| format!("Avatar asset sync failed: {error}"))?;

    rename(&tmp_path, &target_path)
        .map_err(|error| format!("Avatar asset finalize failed: {error}"))?;

    registered_avatar_for_path(&target_path)
}

fn registered_avatar_for_path(path: &Path) -> Result<RegisteredAvatarAsset, String> {
    if !path.is_file() {
        return Err("Registered avatar file is missing from app storage.".to_string());
    }

    if !is_supported_expression_path(path) {
        return Err("Registered avatars must be PNG, JPG, JPEG, WebP, or AVIF images.".to_string());
    }

    let canonical_path = path.canonicalize().unwrap_or_else(|_| path.to_path_buf());

    Ok(RegisteredAvatarAsset {
        asset_protocol_url: local_asset_uri_for_path(&canonical_path),
        internal_sandbox_path: canonical_path.to_string_lossy().into_owned(),
    })
}

fn validate_avatar_source(source_path: &Path) -> Result<(), String> {
    if !source_path.is_file() {
        return Err("Selected avatar source file does not exist on disk.".to_string());
    }

    if !is_supported_expression_path(source_path) {
        return Err("Avatars must be PNG, JPG, JPEG, WebP, or AVIF images.".to_string());
    }

    let metadata = source_path
        .metadata()
        .map_err(|error| format!("Avatar source metadata read failed: {error}"))?;

    if metadata.len() > MAX_AVATAR_SOURCE_BYTES {
        return Err(format!(
            "Avatar source is too large to copy safely ({:.2} MB).",
            metadata.len() as f64 / (1024.0 * 1024.0)
        ));
    }

    Ok(())
}

fn unique_avatar_path(source_path: &Path, target_dir: &Path) -> Result<PathBuf, String> {
    let extension = source_path
        .extension()
        .and_then(|extension| extension.to_str())
        .map(|extension| extension.to_ascii_lowercase())
        .ok_or_else(|| "Avatar source file has no extension.".to_string())?;

    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_nanos())
        .unwrap_or(0);

    for attempt in 0..1000_u16 {
        let candidate = target_dir.join(format!("avatar_{timestamp}_{attempt}.{extension}"));
        if !candidate.exists() {
            return Ok(candidate);
        }
    }

    Err("Could not allocate a collision-free avatar filename.".to_string())
}

fn avatar_storage_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let mut path = app
        .path()
        .app_data_dir()
        .map_err(|_| "Failed to resolve sandboxed runtime data directory".to_string())?;
    path.push(AVATAR_STORAGE_DIR);
    Ok(path)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn copies_avatar_into_app_data_directory() {
        let source_path = unique_test_path("source avatar.png");
        let target_dir = unique_test_dir("avatar-storage");
        std::fs::write(&source_path, b"png placeholder").expect("fixture should write");

        let payload = register_avatar_to_dir(&source_path, &target_dir).expect("register");

        assert!(payload.internal_sandbox_path.contains("avatar-storage"));
        assert!(payload.internal_sandbox_path.ends_with(".png"));
        assert!(payload
            .asset_protocol_url
            .starts_with("ccv3-asset://localhost/"));
        assert!(Path::new(&payload.internal_sandbox_path).is_file());
        assert!(source_path.is_file());

        let _ = std::fs::remove_file(source_path);
        let _ = std::fs::remove_dir_all(target_dir);
    }

    #[test]
    fn rejects_unsupported_avatar_extensions() {
        let source_path = unique_test_path("avatar.txt");
        let target_dir = unique_test_dir("avatar-storage-invalid");
        std::fs::write(&source_path, b"not an image").expect("fixture should write");

        let error = register_avatar_to_dir(&source_path, &target_dir).expect_err("reject");

        assert!(error.contains("Avatars must be"));
        let _ = std::fs::remove_file(source_path);
        let _ = std::fs::remove_dir_all(target_dir);
    }

    fn unique_test_path(file_name: &str) -> PathBuf {
        std::env::temp_dir().join(format!(
            "heartwriteai-avatar-{}-{file_name}",
            std::process::id()
        ))
    }

    fn unique_test_dir(name: &str) -> PathBuf {
        let path =
            std::env::temp_dir().join(format!("heartwriteai-avatar-{}-{name}", std::process::id()));
        let _ = std::fs::remove_dir_all(&path);
        path
    }
}
