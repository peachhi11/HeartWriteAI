use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm, Nonce,
};
use ammonia::Builder;
use argon2::{Algorithm, Argon2, Params, Version};
use base64::{prelude::BASE64_STANDARD, Engine};
use jsonschema::JSONSchema;
use rand::RngCore;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::collections::HashSet;
use std::path::Path;
use zeroize::Zeroize;

use crate::state_manager::CharacterCardModel;

const SECURE_CARD_FORMAT: &str = "heartwriteai.secure_card";
const SECURE_CARD_VERSION: u8 = 1;
const SECURE_CARD_ALGORITHM: &str = "AES-256-GCM";
const SECURE_CARD_KDF: &str = "Argon2id";
const SECURE_CARD_MEMORY_KIB: u32 = 19_456;
const SECURE_CARD_ITERATIONS: u32 = 2;
const SECURE_CARD_PARALLELISM: u32 = 1;
const SECURE_CARD_KEY_BYTES: usize = 32;
const SECURE_CARD_SALT_BYTES: usize = 16;
const SECURE_CARD_NONCE_BYTES: usize = 12;
const SECURE_CARD_MIN_PASSWORD_CHARS: usize = 8;
const SECURE_CARD_MAX_PLAINTEXT_BYTES: usize = 16 * 1024 * 1024;
const SECURE_CARD_MAX_ENVELOPE_BYTES: u64 = 24 * 1024 * 1024;
const MAX_NAME_LENGTH: usize = 64;
const MAX_DESCRIPTION_LENGTH: usize = 2048;
const MAX_TONE_LENGTH: usize = 64;
const MAX_TONE_COUNT: usize = 32;
const MAX_AVATAR_DATA_URI_LENGTH: usize = 12 * 1024 * 1024;

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct SecureCardEnvelope {
    format: String,
    version: u8,
    kdf: SecureCardKdf,
    cipher: SecureCardCipher,
    payload: String,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct SecureCardKdf {
    name: String,
    memory_kib: u32,
    iterations: u32,
    parallelism: u32,
    salt: String,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct SecureCardCipher {
    name: String,
    nonce: String,
}

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

#[tauri::command]
pub async fn export_encrypted_character_card(
    target_save_path: String,
    card_json: Value,
    password: String,
) -> Result<String, String> {
    tauri::async_runtime::spawn_blocking(move || {
        let mut password = password;
        let result = (|| {
            if !has_secure_card_extension(Path::new(&target_save_path)) {
                return Err("Encrypted card exports must use the .hwcard extension.".to_string());
            }

            let mut serialized_card = serde_json::to_string(&card_json)
                .map_err(|error| format!("Failed to serialize secure card payload: {error}"))?;
            let envelope_result = encrypt_secure_card_payload(&serialized_card, &password);
            serialized_card.zeroize();
            let envelope = envelope_result?;

            Ok(envelope)
        })();
        password.zeroize();

        let envelope = result?;
        let mut envelope_json = serde_json::to_string_pretty(&envelope)
            .map_err(|error| format!("Failed to serialize secure card envelope: {error}"))?;

        let write_result = std::fs::write(&target_save_path, envelope_json.as_bytes())
            .map_err(|error| format!("Failed writing encrypted card file: {error}"));
        envelope_json.zeroize();
        write_result?;

        Ok(target_save_path)
    })
    .await
    .map_err(|error| format!("Secure export worker failed: {error}"))?
}

#[tauri::command]
pub async fn import_encrypted_character_card(
    file_path: String,
    password: String,
) -> Result<Value, String> {
    tauri::async_runtime::spawn_blocking(move || {
        if !has_secure_card_extension(Path::new(&file_path)) {
            return Err("Encrypted card imports must use the .hwcard extension.".to_string());
        }

        let metadata = std::fs::metadata(&file_path)
            .map_err(|error| format!("Failed reading secure card metadata: {error}"))?;
        if metadata.len() > SECURE_CARD_MAX_ENVELOPE_BYTES {
            return Err("Encrypted card file is too large for safe import.".to_string());
        }

        let envelope_json = std::fs::read_to_string(&file_path)
            .map_err(|error| format!("Failed reading encrypted card file: {error}"))?;
        let envelope: SecureCardEnvelope = serde_json::from_str(&envelope_json)
            .map_err(|error| format!("Invalid encrypted card envelope JSON: {error}"))?;
        let mut password = password;
        let decrypted_result = decrypt_secure_card_payload(&envelope, &password);
        password.zeroize();

        let mut decrypted_json = decrypted_result?;
        let card_json_result: Result<Value, String> = serde_json::from_str(&decrypted_json)
            .map_err(|error| format!("Decrypted card JSON is invalid: {error}"));
        decrypted_json.zeroize();
        let card_json = card_json_result?;

        Ok(card_json)
    })
    .await
    .map_err(|error| format!("Secure import worker failed: {error}"))?
}

fn encrypt_secure_card_payload(
    plaintext_json: &str,
    password: &str,
) -> Result<SecureCardEnvelope, String> {
    validate_secure_card_password(password)?;
    if plaintext_json.len() > SECURE_CARD_MAX_PLAINTEXT_BYTES {
        return Err("Card payload is too large for encrypted export.".to_string());
    }

    let mut salt = [0u8; SECURE_CARD_SALT_BYTES];
    let mut nonce = [0u8; SECURE_CARD_NONCE_BYTES];
    rand::thread_rng().fill_bytes(&mut salt);
    rand::thread_rng().fill_bytes(&mut nonce);

    let mut key = derive_secure_card_key(password, &salt)?;
    let cipher = Aes256Gcm::new_from_slice(&key)
        .map_err(|error| format!("Failed to initialize AES-256-GCM: {error}"))?;
    let ciphertext = cipher
        .encrypt(Nonce::from_slice(&nonce), plaintext_json.as_bytes())
        .map_err(|_| "Failed to encrypt secure card payload.".to_string())?;
    key.zeroize();

    Ok(SecureCardEnvelope {
        format: SECURE_CARD_FORMAT.to_string(),
        version: SECURE_CARD_VERSION,
        kdf: SecureCardKdf {
            name: SECURE_CARD_KDF.to_string(),
            memory_kib: SECURE_CARD_MEMORY_KIB,
            iterations: SECURE_CARD_ITERATIONS,
            parallelism: SECURE_CARD_PARALLELISM,
            salt: BASE64_STANDARD.encode(salt),
        },
        cipher: SecureCardCipher {
            name: SECURE_CARD_ALGORITHM.to_string(),
            nonce: BASE64_STANDARD.encode(nonce),
        },
        payload: BASE64_STANDARD.encode(ciphertext),
    })
}

fn decrypt_secure_card_payload(
    envelope: &SecureCardEnvelope,
    password: &str,
) -> Result<String, String> {
    validate_secure_card_password(password)?;
    validate_secure_card_envelope(envelope)?;

    let salt = BASE64_STANDARD
        .decode(&envelope.kdf.salt)
        .map_err(|_| "Encrypted card salt is not valid Base64.".to_string())?;
    let nonce = BASE64_STANDARD
        .decode(&envelope.cipher.nonce)
        .map_err(|_| "Encrypted card nonce is not valid Base64.".to_string())?;
    let ciphertext = BASE64_STANDARD
        .decode(&envelope.payload)
        .map_err(|_| "Encrypted card payload is not valid Base64.".to_string())?;

    if salt.len() != SECURE_CARD_SALT_BYTES {
        return Err("Encrypted card salt has invalid length.".to_string());
    }
    if nonce.len() != SECURE_CARD_NONCE_BYTES {
        return Err("Encrypted card nonce has invalid length.".to_string());
    }

    let mut key = derive_secure_card_key(password, &salt)?;
    let cipher = Aes256Gcm::new_from_slice(&key)
        .map_err(|error| format!("Failed to initialize AES-256-GCM: {error}"))?;
    let decrypted = cipher
        .decrypt(Nonce::from_slice(&nonce), ciphertext.as_ref())
        .map_err(|_| "Failed to decrypt card. Check the password or file integrity.".to_string())?;
    key.zeroize();

    if decrypted.len() > SECURE_CARD_MAX_PLAINTEXT_BYTES {
        return Err("Decrypted card payload is too large.".to_string());
    }

    String::from_utf8(decrypted)
        .map_err(|_| "Decrypted card payload is not valid UTF-8.".to_string())
}

fn validate_secure_card_envelope(envelope: &SecureCardEnvelope) -> Result<(), String> {
    if envelope.format != SECURE_CARD_FORMAT {
        return Err("Unsupported encrypted card format.".to_string());
    }
    if envelope.version != SECURE_CARD_VERSION {
        return Err("Unsupported encrypted card version.".to_string());
    }
    if envelope.kdf.name != SECURE_CARD_KDF {
        return Err("Unsupported encrypted card key derivation method.".to_string());
    }
    if envelope.kdf.memory_kib != SECURE_CARD_MEMORY_KIB
        || envelope.kdf.iterations != SECURE_CARD_ITERATIONS
        || envelope.kdf.parallelism != SECURE_CARD_PARALLELISM
    {
        return Err("Unsupported encrypted card key derivation parameters.".to_string());
    }
    if envelope.cipher.name != SECURE_CARD_ALGORITHM {
        return Err("Unsupported encrypted card cipher.".to_string());
    }
    if envelope.payload.is_empty() {
        return Err("Encrypted card payload is empty.".to_string());
    }

    Ok(())
}

fn validate_secure_card_password(password: &str) -> Result<(), String> {
    if password.chars().count() < SECURE_CARD_MIN_PASSWORD_CHARS {
        return Err(format!(
            "Secure card password must be at least {SECURE_CARD_MIN_PASSWORD_CHARS} characters."
        ));
    }

    Ok(())
}

fn derive_secure_card_key(
    password: &str,
    salt: &[u8],
) -> Result<[u8; SECURE_CARD_KEY_BYTES], String> {
    let params = Params::new(
        SECURE_CARD_MEMORY_KIB,
        SECURE_CARD_ITERATIONS,
        SECURE_CARD_PARALLELISM,
        Some(SECURE_CARD_KEY_BYTES),
    )
    .map_err(|error| format!("Failed to initialize Argon2id parameters: {error}"))?;
    let argon2 = Argon2::new(Algorithm::Argon2id, Version::V0x13, params);
    let mut key = [0u8; SECURE_CARD_KEY_BYTES];

    argon2
        .hash_password_into(password.as_bytes(), salt, &mut key)
        .map_err(|error| format!("Failed deriving secure card key: {error}"))?;

    Ok(key)
}

#[allow(dead_code)]
fn has_secure_card_extension(path: &Path) -> bool {
    path.extension()
        .and_then(|extension| extension.to_str())
        .is_some_and(|extension| extension.eq_ignore_ascii_case("hwcard"))
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

    #[test]
    fn encrypted_card_payload_roundtrips_with_password() {
        let raw_json =
            serde_json::to_string(&character_model_to_json_value(valid_model())).unwrap();

        let envelope =
            encrypt_secure_card_payload(&raw_json, "correct horse battery staple").unwrap();
        let decrypted =
            decrypt_secure_card_payload(&envelope, "correct horse battery staple").unwrap();

        assert_eq!(decrypted, raw_json);
        assert_eq!(envelope.format, SECURE_CARD_FORMAT);
        assert_eq!(envelope.cipher.name, SECURE_CARD_ALGORITHM);
        assert_eq!(envelope.kdf.name, SECURE_CARD_KDF);
    }

    #[test]
    fn encrypted_card_payload_rejects_wrong_password() {
        let raw_json =
            serde_json::to_string(&character_model_to_json_value(valid_model())).unwrap();
        let envelope = encrypt_secure_card_payload(&raw_json, "right-password").unwrap();

        let result = decrypt_secure_card_payload(&envelope, "wrong-password");

        assert!(result.is_err());
        assert!(result.unwrap_err().contains("Failed to decrypt card"));
    }

    #[test]
    fn encrypted_card_payload_rejects_short_passwords() {
        let raw_json =
            serde_json::to_string(&character_model_to_json_value(valid_model())).unwrap();

        let result = encrypt_secure_card_payload(&raw_json, "short");

        assert!(result.is_err());
        assert!(result.unwrap_err().contains("at least 8 characters"));
    }
}
