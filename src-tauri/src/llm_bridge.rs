use serde::{Deserialize, Serialize};
use serde_json::Value;
use tauri::{ipc::Channel, State};

use crate::inference_manager::AppInferenceSettingsState;
use crate::state_manager::{CharacterCardModel, PersistentEngineStore, RelationshipStats};

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct GenerationPromptPayload {
    pub prompt_text: String,
    pub story_node_id: String,
    #[serde(default)]
    pub context_messages: Vec<LocalChatMessage>,
}

#[derive(Deserialize, Serialize, Clone, Debug, PartialEq, Eq)]
pub struct LocalChatMessage {
    pub role: String,
    pub content: String,
}

#[derive(Serialize, Clone, Debug, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct TokenStreamFragment {
    pub token: String,
    pub done: bool,
}

#[tauri::command]
pub async fn stream_local_llm_response(
    payload: GenerationPromptPayload,
    state_store: State<'_, PersistentEngineStore>,
    inference_settings: State<'_, AppInferenceSettingsState>,
    on_token: Channel<TokenStreamFragment>,
) -> Result<(), String> {
    LocalLlmBroker::stream_inference(payload, state_store, inference_settings, on_token).await
}

pub struct LocalLlmBroker;

impl LocalLlmBroker {
    pub async fn stream_inference(
        payload: GenerationPromptPayload,
        state_store: State<'_, PersistentEngineStore>,
        inference_settings: State<'_, AppInferenceSettingsState>,
        on_token: Channel<TokenStreamFragment>,
    ) -> Result<(), String> {
        let (active_character, stats) = {
            let session = state_store
                .runtime_data
                .lock()
                .map_err(|_| "System Memory Error: Mutex registry poisoned".to_string())?;

            (session.active_character.clone(), session.stats.clone())
        };

        let inference_config = inference_settings.snapshot()?;
        if inference_config.provider != "ollama" {
            return Err(
                "Native local LLM bridge is only available for the Ollama provider.".to_string(),
            );
        }

        let system_prompt =
            build_system_prompt(active_character.as_ref(), &stats, &payload.story_node_id);
        let messages = build_ollama_messages(system_prompt, &payload);

        let request_body = serde_json::json!({
            "model": inference_config.selected_model,
            "messages": messages,
            "stream": true,
            "options": {
                "temperature": inference_config.temperature,
                "top_p": inference_config.top_p,
                "num_predict": inference_config.max_tokens,
                "repeat_penalty": 1.0 + inference_config.frequency_penalty
            }
        });

        let mut response = reqwest::Client::new()
            .post(&inference_config.local_endpoint)
            .json(&request_body)
            .send()
            .await
            .map_err(|error| {
                format!("Failed to establish contact with local LLM engine: {error}")
            })?;

        if !response.status().is_success() {
            return Err(format!(
                "Local LLM engine returned HTTP {}",
                response.status()
            ));
        }

        let mut buffered_chunk = String::new();
        let mut sent_done = false;

        while let Some(chunk) = response
            .chunk()
            .await
            .map_err(|error| format!("Local LLM stream read failed: {error}"))?
        {
            buffered_chunk.push_str(&String::from_utf8_lossy(&chunk));
            let lines: Vec<&str> = buffered_chunk.split('\n').collect();
            let complete_line_count = lines.len().saturating_sub(1);

            for line in lines.iter().take(complete_line_count) {
                if let Some(fragment) = parse_ollama_stream_line(line)? {
                    sent_done = sent_done || fragment.done;
                    on_token
                        .send(fragment)
                        .map_err(|error| format!("Failed to send token fragment: {error}"))?;
                }
            }

            buffered_chunk = lines.last().copied().unwrap_or_default().to_string();
        }

        if !buffered_chunk.trim().is_empty() {
            if let Some(fragment) = parse_ollama_stream_line(&buffered_chunk)? {
                sent_done = sent_done || fragment.done;
                on_token
                    .send(fragment)
                    .map_err(|error| format!("Failed to send token fragment: {error}"))?;
            }
        }

        if !sent_done {
            on_token
                .send(TokenStreamFragment {
                    done: true,
                    token: String::new(),
                })
                .map_err(|error| format!("Failed to send stream completion: {error}"))?;
        }

        Ok(())
    }
}

fn build_ollama_messages(
    system_prompt: String,
    payload: &GenerationPromptPayload,
) -> Vec<LocalChatMessage> {
    let mut messages = Vec::with_capacity(payload.context_messages.len() + 2);
    messages.push(LocalChatMessage {
        role: "system".to_string(),
        content: system_prompt,
    });
    messages.extend(payload.context_messages.iter().cloned());
    messages.push(LocalChatMessage {
        role: "user".to_string(),
        content: payload.prompt_text.clone(),
    });
    messages
}

fn build_system_prompt(
    character: Option<&CharacterCardModel>,
    stats: &RelationshipStats,
    story_node_id: &str,
) -> String {
    let character_context = character.map_or_else(
        || {
            "No active character card is loaded. Use the supplied scenario, lore, and chat history as the authoritative context.".to_string()
        },
        |character| {
            format!(
                "You are roleplaying as {name}. Description: {description}. Forbidden behavior tones you must never express: {forbidden:?}. Preferred response behaviors: {preferred:?}.",
                name = character.name,
                description = character.description,
                forbidden = character.forbidden_tones,
                preferred = character.preferred_tones
            )
        },
    );

    format!(
        "{character_context}\nCurrent story node: {story_node_id}.\nRelationship metrics with the player: Trust={trust}/100, Affection={affection}/100, Chemistry={chemistry}/100, Tension={tension}/100, Rivalry={rivalry}/100.\nWrite in immersive visual novel prose. Include physical action clues in square brackets when useful, spoken dialogue in quotation marks, and never write the player's decisions, private thoughts, dialogue, consent, or actions.",
        trust = stats.trust,
        affection = stats.affection,
        chemistry = stats.chemistry,
        tension = stats.tension,
        rivalry = stats.rivalry,
    )
}

fn parse_ollama_stream_line(line: &str) -> Result<Option<TokenStreamFragment>, String> {
    let trimmed = line.trim();

    if trimmed.is_empty() {
        return Ok(None);
    }

    let parsed: Value = serde_json::from_str(trimmed)
        .map_err(|error| format!("Malformed local LLM stream payload: {error}"))?;
    let token = parsed
        .get("message")
        .and_then(|message| message.get("content"))
        .and_then(Value::as_str)
        .or_else(|| parsed.get("response").and_then(Value::as_str))
        .unwrap_or_default()
        .to_string();
    let done = parsed.get("done").and_then(Value::as_bool).unwrap_or(false);

    if token.is_empty() && !done {
        return Ok(None);
    }

    Ok(Some(TokenStreamFragment { token, done }))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_ollama_chat_stream_tokens() {
        let fragment = parse_ollama_stream_line(r#"{"message":{"content":"Hello"},"done":false}"#)
            .expect("line should parse")
            .expect("fragment should exist");

        assert_eq!(
            fragment,
            TokenStreamFragment {
                done: false,
                token: "Hello".to_string()
            }
        );
    }

    #[test]
    fn parses_ollama_generate_stream_tokens() {
        let fragment = parse_ollama_stream_line(r#"{"response":"there","done":false}"#)
            .expect("line should parse")
            .expect("fragment should exist");

        assert_eq!(fragment.token, "there");
        assert!(!fragment.done);
    }

    #[test]
    fn keeps_done_marker_without_token() {
        let fragment = parse_ollama_stream_line(r#"{"done":true}"#)
            .expect("line should parse")
            .expect("done fragment should exist");

        assert!(fragment.done);
        assert!(fragment.token.is_empty());
    }

    #[test]
    fn prompt_handles_missing_character_card() {
        let prompt = build_system_prompt(None, &RelationshipStats::default(), "node_a");

        assert!(prompt.contains("No active character card is loaded"));
        assert!(prompt.contains("node_a"));
    }
}
