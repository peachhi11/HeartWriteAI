use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::fs::{read_dir, remove_file, File};
use tauri::{AppHandle, Manager};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
pub struct PersonaSummary {
    pub charm: u32,
    #[serde(rename = "coreClass")]
    pub core_class: String,
    pub id: String,
    #[serde(rename = "lastUsed")]
    pub last_used: String,
    pub name: String,
    pub vulnerability: u32,
    pub willpower: u32,
}

#[tauri::command]
pub fn fetch_saved_personas_list(app: AppHandle) -> Result<Vec<PersonaSummary>, String> {
    let mut path = app
        .path()
        .app_data_dir()
        .map_err(|_| "Failed to resolve sandboxed runtime folder".to_string())?;
    path.push("personas");

    if !path.exists() {
        return Ok(Vec::new());
    }

    let entries = read_dir(path).map_err(|error| format!("Persona scan failed: {error}"))?;
    let mut personas = Vec::new();

    for entry in entries.flatten() {
        let file_path = entry.path();
        if file_path
            .extension()
            .and_then(|extension| extension.to_str())
            != Some("json")
        {
            continue;
        }

        if let Ok(file) = File::open(file_path) {
            if let Ok(value) = serde_json::from_reader::<_, Value>(file) {
                if let Some(summary) = parse_persona_summary(value) {
                    personas.push(summary);
                }
            }
        }
    }

    personas.sort_by(|a, b| b.last_used.cmp(&a.last_used));
    Ok(personas)
}

#[tauri::command]
pub fn delete_saved_persona_file(app: AppHandle, persona_id: String) -> Result<(), String> {
    if !is_safe_persona_id(&persona_id) {
        return Err("Invalid persona id for deletion.".to_string());
    }

    let mut path = app
        .path()
        .app_data_dir()
        .map_err(|_| "Failed to resolve sandboxed application data directory".to_string())?;
    path.push("personas");
    path.push(format!("{persona_id}.json"));

    if !path.exists() {
        return Err("Target profile template file does not exist on disk.".to_string());
    }

    remove_file(path).map_err(|error| format!("Native OS filesystem deletion failure: {error}"))?;
    Ok(())
}

fn is_safe_persona_id(persona_id: &str) -> bool {
    !persona_id.trim().is_empty()
        && !persona_id.contains('/')
        && !persona_id.contains('\\')
        && !persona_id.contains("..")
}

fn parse_persona_summary(value: Value) -> Option<PersonaSummary> {
    let record = value.as_object()?;
    let id = read_string(record.get("id"))?;
    let name = read_string(record.get("name"))?;

    Some(PersonaSummary {
        charm: read_score(record.get("charm")).unwrap_or(50),
        core_class: read_string(record.get("coreClass"))
            .or_else(|| read_string(record.get("core_class")))
            .unwrap_or_else(|| infer_core_class(record)),
        id,
        last_used: read_string(record.get("lastUsed"))
            .or_else(|| read_string(record.get("last_used")))
            .or_else(|| read_string(record.get("updatedAt")))
            .unwrap_or_else(|| "--".to_string()),
        name,
        vulnerability: read_score(record.get("vulnerability")).unwrap_or(50),
        willpower: read_score(record.get("willpower")).unwrap_or(50),
    })
}

fn read_string(value: Option<&Value>) -> Option<String> {
    match value? {
        Value::String(text) if !text.trim().is_empty() => Some(text.trim().to_string()),
        Value::Number(number) => Some(number.to_string()),
        _ => None,
    }
}

fn read_score(value: Option<&Value>) -> Option<u32> {
    let score = match value? {
        Value::Number(number) => number.as_u64()? as u32,
        Value::String(text) => text.parse::<u32>().ok()?,
        _ => return None,
    };

    Some(score.min(100))
}

fn infer_core_class(record: &serde_json::Map<String, Value>) -> String {
    let haystack = ["tags", "summary", "prompt"]
        .iter()
        .filter_map(|key| record.get(*key))
        .map(|value| value.to_string().to_lowercase())
        .collect::<Vec<_>>()
        .join(" ");

    for class_name in [
        "protective",
        "flustered",
        "yearning",
        "antagonistic",
        "bantering",
        "recognized",
        "grumpy",
        "sunshine",
        "forbidden",
    ] {
        if haystack.contains(class_name) {
            return class_name.to_string();
        }
    }

    "casual".to_string()
}

#[cfg(test)]
mod tests {
    use super::{is_safe_persona_id, parse_persona_summary};
    use serde_json::json;

    #[test]
    fn parses_exact_persona_summary_payloads() {
        let summary = parse_persona_summary(json!({
            "id": "persona-1",
            "name": "Megan",
            "coreClass": "bantering",
            "charm": 72,
            "willpower": 64,
            "vulnerability": 44,
            "lastUsed": "2026-05-29T09:00:00Z"
        }))
        .expect("expected summary");

        assert_eq!(summary.core_class, "bantering");
        assert_eq!(summary.charm, 72);
    }

    #[test]
    fn infers_class_and_clamps_scores_from_loose_persona_payloads() {
        let summary = parse_persona_summary(json!({
            "id": "persona-2",
            "name": "Rival POV",
            "tags": ["forbidden", "slow burn"],
            "charm": 140,
            "updatedAt": 1234
        }))
        .expect("expected summary");

        assert_eq!(summary.core_class, "forbidden");
        assert_eq!(summary.charm, 100);
        assert_eq!(summary.willpower, 50);
    }

    #[test]
    fn rejects_unsafe_persona_ids_before_deletion_path_resolution() {
        for unsafe_id in ["", "../other", "nested/profile", "nested\\profile"] {
            assert!(!is_safe_persona_id(unsafe_id));
        }

        assert!(is_safe_persona_id("persona-test-1"));
    }
}
