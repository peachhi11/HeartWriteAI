use ammonia::Builder;
use jsonschema::JSONSchema;
use serde_json::{json, Value};
use std::collections::HashSet;

use crate::state_manager::CharacterCardModel;

const MAX_NAME_LENGTH: usize = 64;
const MAX_DESCRIPTION_LENGTH: usize = 2048;
const MAX_TONE_LENGTH: usize = 64;
const MAX_TONE_COUNT: usize = 32;
const MAX_AVATAR_DATA_URI_LENGTH: usize = 12 * 1024 * 1024;

const CARD_SCHEMA_MANIFEST: &str = r#"{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "HeartWriteAICharacterCardPayload",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "name": { "type": "string", "minLength": 1, "maxLength": 64 },
    "description": { "type": "string", "maxLength": 2048 },
    "forbiddenTones": {
      "type": "array",
      "maxItems": 32,
      "items": { "type": "string", "maxLength": 64 }
    },
    "preferredTones": {
      "type": "array",
      "maxItems": 32,
      "items": { "type": "string", "maxLength": 64 }
    },
    "avatarDataUri": {
      "type": "string",
      "maxLength": 12582912,
      "pattern": "^data:image/png;base64,[A-Za-z0-9+/]+={0,2}$"
    }
  },
  "required": ["name", "description", "forbiddenTones", "preferredTones", "avatarDataUri"]
}"#;

pub struct SecurityPipeline;

impl SecurityPipeline {
    pub fn sanitize_and_verify_payload(raw_json_str: &str) -> Result<CharacterCardModel, String> {
        let parsed_json: Value = serde_json::from_str(raw_json_str)
            .map_err(|error| format!("Malformed JSON payload structure: {error}"))?;

        validate_card_json(&parsed_json)?;

        let model = serde_json::from_value(parsed_json)
            .map_err(|error| format!("Data structural alignment failure: {error}"))?;

        Self::sanitize_and_verify_model(model)
    }

    pub fn sanitize_and_verify_model(
        model: CharacterCardModel,
    ) -> Result<CharacterCardModel, String> {
        let value = serde_json::to_value(&model)
            .map_err(|error| format!("Security serialization failure: {error}"))?;
        validate_card_json(&value)?;

        let name = sanitize_plain_text(&model.name);
        let description = sanitize_plain_text(&model.description);
        let forbidden_tones = sanitize_tones(model.forbidden_tones);
        let preferred_tones = sanitize_tones(model.preferred_tones);
        let avatar_data_uri = model.avatar_data_uri;

        let sanitized = CharacterCardModel {
            name: sanitize_name_for_storage(&name),
            description,
            forbidden_tones,
            preferred_tones,
            avatar_data_uri,
        };

        validate_sanitized_model(&sanitized)?;
        Ok(sanitized)
    }
}

#[tauri::command]
pub fn parse_secured_character_card(
    raw_unzipped_json: String,
) -> Result<CharacterCardModel, String> {
    let secured_card_model = SecurityPipeline::sanitize_and_verify_payload(&raw_unzipped_json)?;

    println!(
        "Security Pipeline: Card DNA approved. Passed verification for [{}]. Shifting to save context.",
        secured_card_model.name
    );

    Ok(secured_card_model)
}

fn validate_card_json(value: &Value) -> Result<(), String> {
    let schema_value = serde_json::from_str(CARD_SCHEMA_MANIFEST)
        .map_err(|error| format!("Failed to parse security schema: {error}"))?;
    let compiled_schema = JSONSchema::compile(&schema_value)
        .map_err(|error| format!("Failed to compile security schema: {error}"))?;

    if let Err(errors) = compiled_schema.validate(value) {
        let error_messages = errors
            .map(|error| error.to_string())
            .collect::<Vec<_>>()
            .join(", ");
        return Err(format!("Schema Violation: {error_messages}"));
    }

    Ok(())
}

fn validate_sanitized_model(model: &CharacterCardModel) -> Result<(), String> {
    if model.name.trim().is_empty() {
        return Err("Sanitization rejected card: character name is empty.".to_string());
    }

    if model.name.chars().count() > MAX_NAME_LENGTH {
        return Err("Sanitization rejected card: character name is too long.".to_string());
    }

    if model.description.chars().count() > MAX_DESCRIPTION_LENGTH {
        return Err("Sanitization rejected card: description is too long.".to_string());
    }

    if model.avatar_data_uri.len() > MAX_AVATAR_DATA_URI_LENGTH {
        return Err("Sanitization rejected card: avatar data URI is too large.".to_string());
    }

    if !model.avatar_data_uri.starts_with("data:image/png;base64,") {
        return Err("Sanitization rejected card: avatar data must be a PNG data URI.".to_string());
    }

    Ok(())
}

fn sanitize_plain_text(value: &str) -> String {
    let mut cleaner = Builder::new();
    let strict_cleaner = cleaner
        .tags(HashSet::new())
        .generic_attributes(HashSet::new());

    strict_cleaner
        .clean(value)
        .to_string()
        .replace('\0', "")
        .trim()
        .to_string()
}

fn sanitize_name_for_storage(value: &str) -> String {
    value
        .replace(['/', '\\'], "")
        .replace("..", "")
        .trim()
        .to_string()
}

fn sanitize_tones(values: Vec<String>) -> Vec<String> {
    let mut sanitized = Vec::new();

    for tone in values.into_iter().take(MAX_TONE_COUNT) {
        let cleaned = sanitize_plain_text(&tone)
            .replace(['/', '\\'], "")
            .replace("..", "")
            .trim()
            .chars()
            .take(MAX_TONE_LENGTH)
            .collect::<String>();

        if !cleaned.is_empty() && !sanitized.iter().any(|existing| existing == &cleaned) {
            sanitized.push(cleaned);
        }
    }

    sanitized
}

pub fn character_model_to_json_value(model: CharacterCardModel) -> Value {
    json!({
        "name": model.name,
        "description": model.description,
        "forbiddenTones": model.forbidden_tones,
        "preferredTones": model.preferred_tones,
        "avatarDataUri": model.avatar_data_uri,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    fn valid_model() -> CharacterCardModel {
        CharacterCardModel {
            avatar_data_uri: "data:image/png;base64,iVBORw==".to_string(),
            description: "A guarded royal protector.".to_string(),
            forbidden_tones: vec!["antagonistic".to_string()],
            name: "Lucas".to_string(),
            preferred_tones: vec!["protective".to_string()],
        }
    }

    #[test]
    fn sanitizes_html_and_path_tokens_from_character_payloads() {
        let mut model = valid_model();
        model.name = "../Lu<script>alert(1)</script>/cas".to_string();
        model.description = "<img src=x onerror=alert(1)>A <b>guard</b>.".to_string();
        model.preferred_tones = vec!["protective<script>x</script>".to_string()];

        let secured = SecurityPipeline::sanitize_and_verify_model(model).unwrap();

        assert!(!secured.name.contains(".."));
        assert!(!secured.name.contains('/'));
        assert!(!secured.name.contains("<script"));
        assert!(!secured.description.contains("<img"));
        assert!(!secured.description.contains("<b>"));
        assert_eq!(secured.description, "A guard.");
    }

    #[test]
    fn rejects_non_png_avatar_data_uri() {
        let mut model = valid_model();
        model.avatar_data_uri = "javascript:alert(1)".to_string();

        let result = SecurityPipeline::sanitize_and_verify_model(model);

        assert!(result.is_err());
        assert!(result.unwrap_err().contains("Schema Violation"));
    }

    #[test]
    fn rejects_overlong_payloads_before_memory_commit() {
        let mut model = valid_model();
        model.description = "x".repeat(MAX_DESCRIPTION_LENGTH + 1);

        let result = SecurityPipeline::sanitize_and_verify_model(model);

        assert!(result.is_err());
        assert!(result.unwrap_err().contains("Schema Violation"));
    }

    #[test]
    fn parses_raw_json_payloads_into_secured_models() {
        let raw_json =
            serde_json::to_string(&character_model_to_json_value(valid_model())).unwrap();

        let secured = SecurityPipeline::sanitize_and_verify_payload(&raw_json).unwrap();

        assert_eq!(secured.name, "Lucas");
    }
}
