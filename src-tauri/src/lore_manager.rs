use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::fs::{create_dir_all, remove_file, File};
use std::io::Write;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
pub struct RustLorebook {
    pub id: String,
    pub title: String,
    pub description: String,
    #[serde(rename = "entryCount")]
    pub entry_count: u32,
    #[serde(rename = "fileSizeKb")]
    pub file_size_kb: u32,
    pub status: String,
}

#[tauri::command]
pub async fn import_and_compile_lorebook(
    app: AppHandle,
    book_id: Option<String>,
    raw_json_payload: String,
) -> Result<RustLorebook, String> {
    let parsed_value: Value = serde_json::from_str(&raw_json_payload)
        .map_err(|error| format!("Invalid lorebook structural payload: {error}"))?;
    let mut summary = parse_lorebook_summary(&parsed_value, raw_json_payload.len())?;

    if let Some(book_id) = book_id {
        if !is_safe_lorebook_id(&book_id) {
            return Err("Invalid lorebook id for sandboxed compilation.".to_string());
        }

        summary.id = book_id;
    }

    let mut path = resolve_lorebook_dir(&app)?;
    path.push(format!("{}.json", summary.id));

    let serialized = serde_json::to_string_pretty(&parsed_value)
        .map_err(|error| format!("Lorebook serialization failed: {error}"))?;
    let mut file =
        File::create(path).map_err(|error| format!("Lorebook file write failed: {error}"))?;
    file.write_all(serialized.as_bytes())
        .map_err(|error| format!("Lorebook file sync failed: {error}"))?;

    Ok(summary)
}

#[tauri::command]
pub fn toggle_lorebook_active_state(
    app: AppHandle,
    book_id: String,
    is_enabled: bool,
) -> Result<(), String> {
    let path = resolve_lorebook_file(&app, &book_id)?;

    if !path.exists() {
        return Err("Target lorebook file does not exist on disk.".to_string());
    }

    let file = File::open(&path).map_err(|error| format!("Lorebook read failed: {error}"))?;
    let mut json_value: Value = serde_json::from_reader(file)
        .map_err(|error| format!("Lorebook JSON parse failed: {error}"))?;

    json_value["enabled"] = Value::from(is_enabled);

    let serialized = serde_json::to_string_pretty(&json_value)
        .map_err(|error| format!("Lorebook serialization failed: {error}"))?;
    let mut output =
        File::create(path).map_err(|error| format!("Lorebook write failed: {error}"))?;
    output
        .write_all(serialized.as_bytes())
        .map_err(|error| format!("Lorebook sync failed: {error}"))?;

    Ok(())
}

#[tauri::command]
pub fn remove_lorebook_file(app: AppHandle, book_id: String) -> Result<(), String> {
    let path = resolve_lorebook_file(&app, &book_id)?;

    if path.exists() {
        remove_file(path).map_err(|error| format!("Disk unlinking error: {error}"))?;
    }

    Ok(())
}

fn resolve_lorebook_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let mut path = app
        .path()
        .app_data_dir()
        .map_err(|_| "Failed to resolve sandboxed runtime folder".to_string())?;
    path.push("lorebooks");
    create_dir_all(&path)
        .map_err(|error| format!("Lorebook directory allocation failed: {error}"))?;
    Ok(path)
}

fn resolve_lorebook_file(app: &AppHandle, book_id: &str) -> Result<PathBuf, String> {
    if !is_safe_lorebook_id(book_id) {
        return Err("Invalid lorebook id for sandboxed file operation.".to_string());
    }

    let mut path = resolve_lorebook_dir(app)?;
    path.push(format!("{book_id}.json"));
    Ok(path)
}

fn parse_lorebook_summary(value: &Value, byte_size: usize) -> Result<RustLorebook, String> {
    let record = value
        .as_object()
        .ok_or_else(|| "Lorebook JSON must be an object.".to_string())?;
    let data_record = record
        .get("data")
        .and_then(Value::as_object)
        .unwrap_or(record);
    let id = read_string(record.get("id"))
        .or_else(|| read_string(data_record.get("id")))
        .unwrap_or_else(|| create_stable_lorebook_id(data_record));

    if !is_safe_lorebook_id(&id) {
        return Err("Invalid lorebook id for sandboxed compilation.".to_string());
    }

    let title = read_string(record.get("title"))
        .or_else(|| read_string(record.get("name")))
        .or_else(|| read_string(data_record.get("title")))
        .or_else(|| read_string(data_record.get("name")))
        .unwrap_or_else(|| "Imported Lorebook".to_string());
    let description = read_string(record.get("description"))
        .or_else(|| read_string(data_record.get("description")))
        .unwrap_or_else(|| "Compiled world info module.".to_string());
    let entry_count = read_entry_count(record, data_record);

    Ok(RustLorebook {
        description,
        entry_count,
        file_size_kb: ((byte_size as f64) / 1024.0).ceil().max(1.0) as u32,
        id,
        status: "compiled".to_string(),
        title,
    })
}

fn read_entry_count(
    record: &serde_json::Map<String, Value>,
    data_record: &serde_json::Map<String, Value>,
) -> u32 {
    read_u32(record.get("entryCount"))
        .or_else(|| read_u32(record.get("entry_count")))
        .or_else(|| read_u32(data_record.get("entryCount")))
        .or_else(|| read_u32(data_record.get("entry_count")))
        .or_else(|| data_record.get("entries").and_then(read_entries_len))
        .or_else(|| record.get("entries").and_then(read_entries_len))
        .unwrap_or(0)
}

fn read_entries_len(value: &Value) -> Option<u32> {
    if let Some(entries) = value.as_array() {
        return Some(entries.len() as u32);
    }

    value.as_object().map(|entries| entries.len() as u32)
}

fn read_string(value: Option<&Value>) -> Option<String> {
    match value? {
        Value::String(text) if !text.trim().is_empty() => Some(text.trim().to_string()),
        _ => None,
    }
}

fn read_u32(value: Option<&Value>) -> Option<u32> {
    match value? {
        Value::Number(number) => number
            .as_u64()
            .map(|value| value.min(u32::MAX as u64) as u32),
        Value::String(text) => text.trim().parse::<u32>().ok(),
        _ => None,
    }
}

fn create_stable_lorebook_id(record: &serde_json::Map<String, Value>) -> String {
    let title = read_string(record.get("name"))
        .or_else(|| read_string(record.get("title")))
        .unwrap_or_else(|| "imported-lorebook".to_string());

    title
        .to_lowercase()
        .chars()
        .map(|character| {
            if character.is_ascii_alphanumeric() {
                character
            } else {
                '-'
            }
        })
        .collect::<String>()
        .split('-')
        .filter(|part| !part.is_empty())
        .collect::<Vec<_>>()
        .join("-")
}

fn is_safe_lorebook_id(lorebook_id: &str) -> bool {
    !lorebook_id.trim().is_empty()
        && !lorebook_id.contains('/')
        && !lorebook_id.contains('\\')
        && !lorebook_id.contains("..")
}

#[cfg(test)]
mod tests {
    use super::{is_safe_lorebook_id, parse_lorebook_summary};
    use serde_json::json;

    #[test]
    fn parses_v3_lorebook_documents() {
        let summary = parse_lorebook_summary(
            &json!({
                "spec": "lorebook_v3",
                "data": {
                    "name": "Campus Canon",
                    "description": "University rules.",
                    "entries": [{ "keys": ["rain"], "content": "Rain matters." }]
                }
            }),
            2048,
        )
        .expect("expected summary");

        assert_eq!(summary.title, "Campus Canon");
        assert_eq!(summary.entry_count, 1);
        assert_eq!(summary.file_size_kb, 2);
    }

    #[test]
    fn rejects_unsafe_lorebook_ids() {
        let error = parse_lorebook_summary(
            &json!({
                "id": "../outside",
                "title": "Unsafe",
                "entryCount": 1
            }),
            10,
        )
        .expect_err("unsafe id should fail");

        assert!(error.contains("Invalid lorebook id"));
    }

    #[test]
    fn validates_safe_lorebook_ids_before_file_operations() {
        for unsafe_id in ["", "../outside", "nested/book", "nested\\book"] {
            assert!(!is_safe_lorebook_id(unsafe_id));
        }

        assert!(is_safe_lorebook_id("lorebook-campus-canon-123"));
    }
}
