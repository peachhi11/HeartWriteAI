use serde::Serialize;
use tauri::AppHandle;
use tauri_plugin_updater::UpdaterExt;

#[derive(Serialize, Clone, Debug, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct UpdateCheckPayload {
    pub current_version: String,
    pub latest_version: String,
    pub release_notes: Option<String>,
    pub status_message: String,
    pub update_available: bool,
}

#[tauri::command]
pub async fn execute_app_update_check(app: AppHandle) -> Result<UpdateCheckPayload, String> {
    let current_version = app.package_info().version.to_string();
    let updater = app
        .updater()
        .map_err(|error| format!("App updates are not configured yet: {error}"))?;

    match updater.check().await {
        Ok(Some(update)) => Ok(UpdateCheckPayload {
            current_version,
            latest_version: update.version.to_string(),
            release_notes: update.body.clone(),
            status_message: "A new HeartWriteAI update is ready.".to_string(),
            update_available: true,
        }),
        Ok(None) => Ok(UpdateCheckPayload {
            latest_version: current_version.clone(),
            current_version,
            release_notes: None,
            status_message: "HeartWriteAI is up to date.".to_string(),
            update_available: false,
        }),
        Err(error) => Err(format!("Could not check for app updates: {error}")),
    }
}

#[cfg(test)]
mod tests {
    use super::UpdateCheckPayload;

    #[test]
    fn update_check_payload_uses_player_facing_status_text() {
        let payload = UpdateCheckPayload {
            current_version: "0.1.0".to_string(),
            latest_version: "0.2.0".to_string(),
            release_notes: Some("New relationship map polish.".to_string()),
            status_message: "A new HeartWriteAI update is ready.".to_string(),
            update_available: true,
        };

        assert!(payload.update_available);
        assert!(payload.status_message.contains("update"));
        assert!(!payload.status_message.contains("firmware"));
    }
}
