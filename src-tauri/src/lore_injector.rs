use regex::{Regex, RegexBuilder};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::fs::File;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

#[derive(Serialize, Clone, Debug, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct LoreActivationMatch {
    pub entry_id: String,
    pub entry_title: String,
    pub injected_snippet: String,
    pub matched_keys: Vec<String>,
}

#[derive(Serialize, Clone, Debug, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct LoreActivationPayload {
    pub lore_injection_chunk: String,
    pub has_matches: bool,
    pub matches: Vec<LoreActivationMatch>,
}

#[derive(Deserialize, Clone, Debug)]
struct LoreEntryRow {
    #[serde(default)]
    content: String,
    #[serde(default = "default_true")]
    enabled: bool,
    id: Option<Value>,
    #[serde(default)]
    keys: Vec<String>,
    name: Option<String>,
    title: Option<String>,
    #[serde(default)]
    use_regex: bool,
}

pub struct LoreActivationHandler;

impl LoreActivationHandler {
    pub fn scan_and_compile_injection(
        app: &AppHandle,
        book_id: &str,
        player_text: &str,
    ) -> Result<LoreActivationPayload, String> {
        let path = resolve_lorebook_file(app, book_id)?;

        if !path.exists() {
            return Ok(empty_activation_payload());
        }

        let file = File::open(path).map_err(|error| format!("Lorebook read failed: {error}"))?;
        let value: Value = serde_json::from_reader(file)
            .map_err(|error| format!("Lorebook JSON parse failed: {error}"))?;

        scan_lorebook_value(&value, player_text)
    }
}

#[tauri::command]
pub async fn execute_lore_context_scan(
    app: AppHandle,
    book_id: String,
    user_input_text: String,
) -> Result<LoreActivationPayload, String> {
    LoreActivationHandler::scan_and_compile_injection(&app, &book_id, &user_input_text)
}

fn scan_lorebook_value(value: &Value, player_text: &str) -> Result<LoreActivationPayload, String> {
    if value
        .as_object()
        .and_then(|record| record.get("enabled"))
        .and_then(Value::as_bool)
        == Some(false)
    {
        return Ok(empty_activation_payload());
    }

    let entries = read_lore_entries(value)?;
    let mut matches = Vec::new();

    for (index, entry) in entries.into_iter().enumerate() {
        if !entry.enabled || entry.content.trim().is_empty() {
            continue;
        }

        let matched_keys = entry
            .keys
            .iter()
            .filter(|key| activation_key_matches(player_text, key, entry.use_regex))
            .cloned()
            .collect::<Vec<_>>();

        if matched_keys.is_empty() {
            continue;
        }

        let fallback_id = format!("entry-{}", index + 1);
        matches.push(LoreActivationMatch {
            entry_id: value_id_to_string(entry.id).unwrap_or(fallback_id),
            entry_title: entry
                .title
                .or(entry.name)
                .unwrap_or_else(|| "Lore entry".to_string()),
            injected_snippet: entry.content.trim().to_string(),
            matched_keys,
        });
    }

    let lore_injection_chunk = matches
        .iter()
        .map(|entry_match| {
            format!(
                "[LORE RECALL: {}]\nMatched keys: {}\n{}",
                entry_match.entry_title,
                entry_match.matched_keys.join(", "),
                entry_match.injected_snippet
            )
        })
        .collect::<Vec<_>>()
        .join("\n\n");

    Ok(LoreActivationPayload {
        has_matches: !matches.is_empty(),
        lore_injection_chunk,
        matches,
    })
}

fn read_lore_entries(value: &Value) -> Result<Vec<LoreEntryRow>, String> {
    let data = value.get("data").unwrap_or(value);
    let entries = data
        .get("entries")
        .or_else(|| value.get("entries"))
        .ok_or_else(|| "Lorebook JSON is missing entries.".to_string())?;

    if let Some(rows) = entries.as_array() {
        return rows
            .iter()
            .cloned()
            .map(|row| serde_json::from_value(row).map_err(|error| error.to_string()))
            .collect::<Result<Vec<_>, _>>();
    }

    if let Some(rows) = entries.as_object() {
        return rows
            .values()
            .cloned()
            .map(|row| serde_json::from_value(row).map_err(|error| error.to_string()))
            .collect::<Result<Vec<_>, _>>();
    }

    Err("Lorebook entries must be an array or object.".to_string())
}

fn activation_key_matches(player_text: &str, key: &str, use_regex: bool) -> bool {
    let trimmed_key = key.trim();

    if trimmed_key.is_empty() {
        return false;
    }

    if use_regex {
        if let Ok(pattern) = RegexBuilder::new(trimmed_key)
            .case_insensitive(true)
            .build()
        {
            return pattern.is_match(player_text);
        }
    }

    let escaped = regex::escape(trimmed_key);
    let pattern = format!(
        r"(?i)(^|[^\p{{L}}\p{{N}}_]){}($|[^\p{{L}}\p{{N}}_])",
        escaped
    );

    Regex::new(&pattern)
        .map(|pattern| pattern.is_match(player_text))
        .unwrap_or_else(|_| {
            player_text
                .to_lowercase()
                .contains(&trimmed_key.to_lowercase())
        })
}

fn resolve_lorebook_file(app: &AppHandle, book_id: &str) -> Result<PathBuf, String> {
    if !is_safe_lorebook_id(book_id) {
        return Err("Invalid lorebook id for sandboxed file operation.".to_string());
    }

    let mut path = app
        .path()
        .app_data_dir()
        .map_err(|_| "Failed to resolve sandboxed runtime folder".to_string())?;
    path.push("lorebooks");
    path.push(format!("{book_id}.json"));
    Ok(path)
}

fn is_safe_lorebook_id(lorebook_id: &str) -> bool {
    !lorebook_id.trim().is_empty()
        && !lorebook_id.contains('/')
        && !lorebook_id.contains('\\')
        && !lorebook_id.contains("..")
}

fn value_id_to_string(value: Option<Value>) -> Option<String> {
    match value? {
        Value::String(text) if !text.trim().is_empty() => Some(text),
        Value::Number(number) => Some(number.to_string()),
        _ => None,
    }
}

fn default_true() -> bool {
    true
}

fn empty_activation_payload() -> LoreActivationPayload {
    LoreActivationPayload {
        has_matches: false,
        lore_injection_chunk: String::new(),
        matches: Vec::new(),
    }
}

#[cfg(test)]
mod tests {
    use super::scan_lorebook_value;
    use serde_json::json;

    #[test]
    fn scans_v3_lorebook_entries_with_word_boundaries() {
        let payload = scan_lorebook_value(
            &json!({
                "spec": "lorebook_v3",
                "data": {
                    "entries": [
                        {
                            "id": "rain-entry",
                            "keys": ["rain"],
                            "content": "Rain changes the library mood.",
                            "enabled": true
                        },
                        {
                            "id": "ai-entry",
                            "keys": ["AI"],
                            "content": "Should not match inside said.",
                            "enabled": true
                        }
                    ]
                }
            }),
            "The rain keeps hitting the windows.",
        )
        .expect("scan should work");

        assert!(payload.has_matches);
        assert_eq!(payload.matches.len(), 1);
        assert_eq!(payload.matches[0].entry_id, "rain-entry");
        assert_eq!(payload.matches[0].matched_keys, vec!["rain"]);
        assert!(payload.lore_injection_chunk.contains("Rain changes"));
    }

    #[test]
    fn supports_regex_keys_when_enabled() {
        let payload = scan_lorebook_value(
            &json!({
                "data": {
                    "entries": [
                        {
                            "keys": ["Cael(um|ian)"],
                            "content": "Caelum rules are active.",
                            "enabled": true,
                            "use_regex": true
                        }
                    ]
                }
            }),
            "What does Caelian law say?",
        )
        .expect("scan should work");

        assert_eq!(payload.matches.len(), 1);
        assert_eq!(payload.matches[0].matched_keys, vec!["Cael(um|ian)"]);
    }

    #[test]
    fn regex_keys_match_case_insensitively() {
        let payload = scan_lorebook_value(
            &json!({
                "data": {
                    "entries": [
                        {
                            "keys": ["caelum"],
                            "content": "Caelum rules are active.",
                            "enabled": true,
                            "use_regex": true
                        }
                    ]
                }
            }),
            "What does CAELUM law say?",
        )
        .expect("scan should work");

        assert_eq!(payload.matches.len(), 1);
        assert_eq!(payload.matches[0].matched_keys, vec!["caelum"]);
    }

    #[test]
    fn skips_disabled_books_and_entries() {
        let payload = scan_lorebook_value(
            &json!({
                "enabled": false,
                "data": {
                    "entries": [
                        {
                            "keys": ["rain"],
                            "content": "Hidden.",
                            "enabled": true
                        }
                    ]
                }
            }),
            "rain",
        )
        .expect("scan should work");

        assert!(!payload.has_matches);
        assert!(payload.matches.is_empty());
    }
}
