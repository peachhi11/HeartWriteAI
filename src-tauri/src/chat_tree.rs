use serde_json::Value;
use std::fs::{create_dir_all, read_dir, rename, File};
use std::io::{Read, Write};
use std::path::{Path, PathBuf};
use tauri::{AppHandle, Manager};

const CHAT_TREES_DIR: &str = "chat-session-trees";
const MAX_CHAT_TREE_BYTES: usize = 10 * 1024 * 1024;
const MAX_SESSION_ID_LENGTH: usize = 80;

#[tauri::command]
pub async fn save_chat_tree_native(
    app_handle: AppHandle,
    session_id: String,
    json_tree_payload: String,
) -> Result<String, String> {
    if json_tree_payload.len() > MAX_CHAT_TREE_BYTES {
        return Err(format!(
            "Chat tree is too large to save safely ({:.2} MB).",
            json_tree_payload.len() as f64 / (1024.0 * 1024.0)
        ));
    }

    let safe_session_id = validate_session_id(&session_id)?;
    validate_chat_tree_payload(&json_tree_payload, &safe_session_id)?;
    let target_path = chat_tree_path(&app_handle, &safe_session_id)?;

    tauri::async_runtime::spawn_blocking(move || {
        persist_chat_tree_to_path(&target_path, &json_tree_payload)
    })
    .await
    .map_err(|error| format!("Chat tree persistence thread panicked: {error}"))??;

    Ok(safe_session_id)
}

#[tauri::command]
pub async fn load_chat_tree_native(
    app_handle: AppHandle,
    session_id: String,
) -> Result<String, String> {
    let safe_session_id = validate_session_id(&session_id)?;
    let path = chat_tree_path(&app_handle, &safe_session_id)?;

    load_chat_tree_from_path(&path)
}

#[tauri::command]
pub async fn list_chat_trees_native(app_handle: AppHandle) -> Result<Vec<String>, String> {
    let directory = chat_tree_directory(&app_handle)?;

    if !directory.exists() {
        return Ok(Vec::new());
    }

    let mut trees = Vec::new();

    for entry in read_dir(&directory)
        .map_err(|error| format!("Failed to read chat tree directory: {error}"))?
    {
        let entry = entry.map_err(|error| format!("Failed to inspect chat tree file: {error}"))?;
        let path = entry.path();

        if path.extension().and_then(|extension| extension.to_str()) != Some("json") {
            continue;
        }

        if let Ok(tree) = load_chat_tree_from_path(&path) {
            trees.push(tree);
        }
    }

    Ok(trees)
}

fn chat_tree_directory(app: &AppHandle) -> Result<PathBuf, String> {
    let mut path = app
        .path()
        .app_data_dir()
        .map_err(|_| "Failed to resolve native app data path".to_string())?;

    create_dir_all(&path)
        .map_err(|error| format!("Failed to prepare native app data directory: {error}"))?;
    path.push(CHAT_TREES_DIR);
    create_dir_all(&path)
        .map_err(|error| format!("Failed to prepare chat tree directory: {error}"))?;

    Ok(path)
}

fn chat_tree_path(app: &AppHandle, session_id: &str) -> Result<PathBuf, String> {
    let mut path = chat_tree_directory(app)?;
    path.push(format!("{session_id}.json"));
    Ok(path)
}

fn persist_chat_tree_to_path(path: &Path, json_tree_payload: &str) -> Result<(), String> {
    if let Some(parent) = path.parent() {
        create_dir_all(parent)
            .map_err(|error| format!("Failed to create chat tree directory: {error}"))?;
    }

    let temp_path = path.with_extension("json.tmp");
    let mut file = File::create(&temp_path)
        .map_err(|error| format!("Failed to create chat tree temp file: {error}"))?;

    file.write_all(json_tree_payload.as_bytes())
        .map_err(|error| format!("Failed to write chat tree temp file: {error}"))?;
    file.sync_all()
        .map_err(|error| format!("Failed to sync chat tree temp file: {error}"))?;
    drop(file);

    if path.exists() {
        std::fs::remove_file(path)
            .map_err(|error| format!("Failed to replace previous chat tree: {error}"))?;
    }

    rename(&temp_path, path).map_err(|error| format!("Failed to commit chat tree: {error}"))?;

    Ok(())
}

fn load_chat_tree_from_path(path: &Path) -> Result<String, String> {
    let metadata = std::fs::metadata(path)
        .map_err(|error| format!("Chat tree metadata read failed: {error}"))?;

    if metadata.len() as usize > MAX_CHAT_TREE_BYTES {
        return Err(format!(
            "Chat tree is too large to load safely ({:.2} MB).",
            metadata.len() as f64 / (1024.0 * 1024.0)
        ));
    }

    let mut file = File::open(path).map_err(|error| format!("Chat tree open failed: {error}"))?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)
        .map_err(|error| format!("Chat tree read failed: {error}"))?;

    Ok(contents)
}

fn validate_session_id(session_id: &str) -> Result<String, String> {
    let trimmed = session_id.trim();

    if trimmed.is_empty() {
        return Err("Chat session id cannot be empty.".to_string());
    }

    if trimmed.len() > MAX_SESSION_ID_LENGTH {
        return Err("Chat session id is too long.".to_string());
    }

    if !trimmed
        .chars()
        .all(|character| character.is_ascii_alphanumeric() || character == '-' || character == '_')
    {
        return Err("Chat session id contains unsafe path characters.".to_string());
    }

    Ok(trimmed.to_string())
}

fn validate_chat_tree_payload(payload: &str, expected_session_id: &str) -> Result<(), String> {
    let value: Value = serde_json::from_str(payload)
        .map_err(|error| format!("Chat tree JSON invalid: {error}"))?;
    let Some(record) = value.as_object() else {
        return Err("Chat tree payload must be a JSON object.".to_string());
    };

    let Some(session_id) = record.get("sessionId").and_then(Value::as_str) else {
        return Err("Chat tree payload is missing sessionId.".to_string());
    };

    if session_id != expected_session_id {
        return Err("Chat tree session id mismatch.".to_string());
    }

    if !record.get("nodes").is_some_and(Value::is_object) {
        return Err("Chat tree payload is missing its node dictionary.".to_string());
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn validates_safe_session_ids() {
        assert_eq!(validate_session_id("chat_01-abc").unwrap(), "chat_01-abc");
        assert!(validate_session_id("../escape").is_err());
        assert!(validate_session_id("").is_err());
    }

    #[test]
    fn rejects_payload_session_mismatch() {
        let payload = r#"{"sessionId":"other","nodes":{}}"#;

        assert!(validate_chat_tree_payload(payload, "expected").is_err());
    }

    #[test]
    fn persists_and_loads_chat_tree_atomically() {
        let root = std::env::temp_dir().join(format!(
            "heartwriteai_chat_tree_test_{}_{}",
            std::process::id(),
            chrono::Utc::now().timestamp_nanos_opt().unwrap_or_default()
        ));
        let path = root.join("session_1.json");
        let payload =
            r#"{"sessionId":"session_1","roomName":"Room","nodes":{},"activeBranchHeadId":null}"#;

        persist_chat_tree_to_path(&path, payload).unwrap();

        assert_eq!(load_chat_tree_from_path(&path).unwrap(), payload);

        let _ = std::fs::remove_dir_all(root);
    }
}
