use serde::{Deserialize, Serialize};
use std::fs::{create_dir_all, rename, File};
use std::io::{Read, Write};
use std::path::{Path, PathBuf};
use std::sync::Mutex;
use tauri::{AppHandle, Manager, State};

const INFERENCE_SETTINGS_FILE: &str = "inference-settings.json";
const DEFAULT_LOCAL_ENDPOINT: &str = "http://127.0.0.1:11434/api/chat";
const MAX_MODEL_TAG_LENGTH: usize = 96;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct InferenceConfig {
    pub temperature: f64,
    #[serde(rename = "topP")]
    pub top_p: f64,
    #[serde(rename = "maxTokens")]
    pub max_tokens: u32,
    #[serde(rename = "frequencyPenalty")]
    pub frequency_penalty: f64,
    #[serde(rename = "localEndpoint", default = "default_local_endpoint")]
    pub local_endpoint: String,
    #[serde(rename = "selectedModel")]
    pub selected_model: String,
}

impl Default for InferenceConfig {
    fn default() -> Self {
        Self {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 256,
            frequency_penalty: 0.0,
            local_endpoint: DEFAULT_LOCAL_ENDPOINT.to_string(),
            selected_model: "llama3:8b".to_string(),
        }
    }
}

pub struct AppInferenceSettingsState {
    pub current_config: Mutex<InferenceConfig>,
}

impl AppInferenceSettingsState {
    pub fn load_on_boot(app: &AppHandle) -> Self {
        let current_config = Self::get_config_path(app)
            .and_then(|path| load_inference_from_path(&path))
            .unwrap_or_else(|error| {
                eprintln!("Inference settings boot load fell back to defaults: {error}");
                InferenceConfig::default()
            });

        Self {
            current_config: Mutex::new(current_config),
        }
    }

    pub fn snapshot(&self) -> Result<InferenceConfig, String> {
        self.current_config
            .lock()
            .map(|config| config.clone())
            .map_err(|_| "Inference settings read lock failure".to_string())
    }

    pub fn save_to_disk(
        &self,
        app: AppHandle,
        incoming_config: InferenceConfig,
    ) -> Result<InferenceConfig, String> {
        let safe_config = normalize_inference_config(incoming_config);

        *self
            .current_config
            .lock()
            .map_err(|_| "Inference settings mutex poisoned".to_string())? = safe_config.clone();

        let disk_snapshot = safe_config.clone();
        std::thread::spawn(move || {
            match Self::get_config_path(&app)
                .and_then(|target_path| persist_inference_to_path(&target_path, &disk_snapshot))
            {
                Ok(()) => {}
                Err(error) => eprintln!("Inference settings save failed: {error}"),
            }
        });

        Ok(safe_config)
    }

    fn get_config_path(app: &AppHandle) -> Result<PathBuf, String> {
        let mut path = app
            .path()
            .app_config_dir()
            .map_err(|_| "Failed to locate native OS app configuration path".to_string())?;

        create_dir_all(&path).map_err(|error| format!("OS directory allocation fault: {error}"))?;
        path.push(INFERENCE_SETTINGS_FILE);
        Ok(path)
    }
}

#[tauri::command]
pub fn export_user_inference_settings(
    incoming_config: InferenceConfig,
    app: AppHandle,
    settings: State<'_, AppInferenceSettingsState>,
) -> Result<InferenceConfig, String> {
    settings.save_to_disk(app, incoming_config)
}

#[tauri::command]
pub fn get_boot_inference_settings(
    settings: State<'_, AppInferenceSettingsState>,
) -> Result<InferenceConfig, String> {
    settings.snapshot()
}

fn load_inference_from_path(path: &Path) -> Result<InferenceConfig, String> {
    if !path.exists() {
        return Ok(InferenceConfig::default());
    }

    let mut file =
        File::open(path).map_err(|error| format!("Inference settings open failed: {error}"))?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)
        .map_err(|error| format!("Inference settings read failed: {error}"))?;
    let config: InferenceConfig = serde_json::from_str(&contents)
        .map_err(|error| format!("Inference settings JSON parse failed: {error}"))?;

    Ok(normalize_inference_config(config))
}

fn persist_inference_to_path(path: &Path, config: &InferenceConfig) -> Result<(), String> {
    if let Some(parent) = path.parent() {
        create_dir_all(parent)
            .map_err(|error| format!("Inference settings directory create failed: {error}"))?;
    }

    let tmp_path = path.with_extension("json.tmp");
    let serialized = serde_json::to_string_pretty(config)
        .map_err(|error| format!("Inference settings JSON serialization failed: {error}"))?;
    let mut file = File::create(&tmp_path)
        .map_err(|error| format!("Inference settings temp create failed: {error}"))?;

    file.write_all(serialized.as_bytes())
        .map_err(|error| format!("Inference settings temp write failed: {error}"))?;
    file.sync_all()
        .map_err(|error| format!("Inference settings temp sync failed: {error}"))?;
    drop(file);

    if path.exists() {
        std::fs::remove_file(path)
            .map_err(|error| format!("Existing inference settings replace failed: {error}"))?;
    }

    rename(&tmp_path, path)
        .map_err(|error| format!("Inference settings replace failed: {error}"))?;

    Ok(())
}

pub fn normalize_inference_config(config: InferenceConfig) -> InferenceConfig {
    InferenceConfig {
        temperature: clamp_f64(config.temperature, 0.0, 2.0, 0.7),
        top_p: clamp_f64(config.top_p, 0.0, 1.0, 0.9),
        max_tokens: config.max_tokens.clamp(16, 2048),
        frequency_penalty: clamp_f64(config.frequency_penalty, 0.0, 2.0, 0.0),
        local_endpoint: normalize_local_endpoint(&config.local_endpoint),
        selected_model: normalize_model_tag(&config.selected_model),
    }
}

fn default_local_endpoint() -> String {
    DEFAULT_LOCAL_ENDPOINT.to_string()
}

fn clamp_f64(value: f64, min: f64, max: f64, fallback: f64) -> f64 {
    if !value.is_finite() {
        return fallback;
    }

    let clamped = value.clamp(min, max);
    (clamped * 100.0).round() / 100.0
}

fn normalize_model_tag(value: &str) -> String {
    let candidate = value.trim();
    let is_safe = !candidate.is_empty()
        && candidate.len() <= MAX_MODEL_TAG_LENGTH
        && candidate.chars().all(|character| {
            character.is_ascii_alphanumeric() || matches!(character, '.' | '_' | ':' | '/' | '-')
        });

    if is_safe {
        candidate.to_string()
    } else {
        InferenceConfig::default().selected_model
    }
}

fn normalize_local_endpoint(value: &str) -> String {
    let candidate = value.trim();

    if candidate.len() > 128 {
        return DEFAULT_LOCAL_ENDPOINT.to_string();
    }

    let Ok(url) = reqwest::Url::parse(candidate) else {
        return DEFAULT_LOCAL_ENDPOINT.to_string();
    };

    let is_local_host = matches!(url.host_str(), Some("localhost" | "127.0.0.1" | "::1"));
    let is_safe =
        url.scheme() == "http"
            && is_local_host
            && url.path() == "/api/chat"
            && url.username().is_empty()
            && url.password().is_none();

    if is_safe {
        url.to_string()
    } else {
        DEFAULT_LOCAL_ENDPOINT.to_string()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn defaults_match_frontend_matrix() {
        let config = InferenceConfig::default();

        assert_eq!(config.temperature, 0.7);
        assert_eq!(config.top_p, 0.9);
        assert_eq!(config.max_tokens, 256);
        assert_eq!(config.frequency_penalty, 0.0);
        assert_eq!(config.local_endpoint, DEFAULT_LOCAL_ENDPOINT);
        assert_eq!(config.selected_model, "llama3:8b");
    }

    #[test]
    fn normalizes_untrusted_inference_values() {
        let config = normalize_inference_config(InferenceConfig {
            temperature: f64::NAN,
            top_p: 4.0,
            max_tokens: 9000,
            frequency_penalty: -3.0,
            local_endpoint: "https://example.com/api/chat".to_string(),
            selected_model: "../bad model".to_string(),
        });

        assert_eq!(config.temperature, 0.7);
        assert_eq!(config.top_p, 1.0);
        assert_eq!(config.max_tokens, 2048);
        assert_eq!(config.frequency_penalty, 0.0);
        assert_eq!(config.local_endpoint, DEFAULT_LOCAL_ENDPOINT);
        assert_eq!(config.selected_model, "llama3:8b");
    }

    #[test]
    fn preserves_safe_custom_model_tags() {
        let config = normalize_inference_config(InferenceConfig {
            temperature: 1.234,
            top_p: 0.876,
            max_tokens: 511,
            frequency_penalty: 1.49,
            local_endpoint: "http://localhost:11435/api/chat".to_string(),
            selected_model: "hf.co/local-author/model-q4_K_M:latest".to_string(),
        });

        assert_eq!(config.temperature, 1.23);
        assert_eq!(config.top_p, 0.88);
        assert_eq!(config.max_tokens, 511);
        assert_eq!(config.frequency_penalty, 1.49);
        assert_eq!(config.local_endpoint, "http://localhost:11435/api/chat");
        assert_eq!(
            config.selected_model,
            "hf.co/local-author/model-q4_K_M:latest"
        );
    }

    #[test]
    fn rejects_non_local_inference_endpoints() {
        for endpoint in [
            "https://127.0.0.1:11434/api/chat",
            "http://example.com/api/chat",
            "http://127.0.0.1:11434/other",
            "http://user:pass@127.0.0.1:11434/api/chat",
        ] {
            assert_eq!(normalize_local_endpoint(endpoint), DEFAULT_LOCAL_ENDPOINT);
        }
    }
}
