use serde::Deserialize;
use std::fs::File;
use std::io::Write;
use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;

#[derive(Debug, Deserialize, Clone, PartialEq, Eq)]
pub struct IncomingExportMessage {
    pub role: String,
    pub text: String,
    pub timestamp: String,
    #[serde(rename = "detectedTrope")]
    pub detected_trope: String,
}

#[tauri::command]
pub async fn export_chat_log_to_file(
    app_handle: AppHandle,
    messages: Vec<IncomingExportMessage>,
) -> Result<String, String> {
    if messages.is_empty() {
        return Err("Cannot export an empty conversation log.".to_string());
    }

    let compiled_log = compile_chat_log(&messages);
    let file_picker = app_handle
        .dialog()
        .file()
        .add_filter("Text Document", &["txt"])
        .set_file_name("heartwriteai-story-transcript.txt")
        .set_title("Export Chat Log Transcript");

    let Some(chosen_file_path) = file_picker.blocking_save_file() else {
        return Err("Export aborted by player.".to_string());
    };

    let display_path = chosen_file_path.to_string();
    let path = chosen_file_path
        .into_path()
        .map_err(|error| format!("Invalid save destination: {error}"))?;
    let mut file = File::create(&path)
        .map_err(|error| format!("Failed to create transcript file: {error}"))?;

    file.write_all(compiled_log.as_bytes())
        .map_err(|error| format!("Transcript write failed: {error}"))?;
    file.sync_all()
        .map_err(|error| format!("Transcript sync failed: {error}"))?;

    Ok(format!("Log successfully exported to: {display_path}"))
}

fn compile_chat_log(messages: &[IncomingExportMessage]) -> String {
    let mut compiled_buffer = String::new();
    compiled_buffer.push_str("==================================================\n");
    compiled_buffer.push_str("             HEARTWRITEAI STORY LOG              \n");
    compiled_buffer.push_str(&format!(
        "          Export Generated: {}\n",
        chrono::Utc::now().format("%Y-%m-%d %H:%M UTC")
    ));
    compiled_buffer.push_str("==================================================\n\n");

    for message in messages {
        let speaker = match message.role.as_str() {
            "Player" => "YOU".to_string(),
            "NPC" => "CHARACTER".to_string(),
            other => other.to_uppercase(),
        };

        compiled_buffer.push_str(&format!(
            "[{}] {} (Mood: {})\n",
            message.timestamp,
            speaker,
            format_trope_label(&message.detected_trope)
        ));
        compiled_buffer.push_str(&format!("  {}\n\n", message.text.trim()));
    }

    compiled_buffer.push_str("--------------------------------------------------\n");
    compiled_buffer.push_str("End of Story Log. Built with HeartWriteAI.\n");
    compiled_buffer
}

fn format_trope_label(value: &str) -> String {
    value
        .split('_')
        .filter(|part| !part.is_empty())
        .map(|part| {
            let mut chars = part.chars();
            match chars.next() {
                Some(first) => format!("{}{}", first.to_uppercase(), chars.as_str()),
                None => String::new(),
            }
        })
        .collect::<Vec<_>>()
        .join(" ")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn compiles_chat_log_with_speakers_and_mood_labels() {
        let log = compile_chat_log(&[
            IncomingExportMessage {
                role: "Player".to_string(),
                text: "[steps closer] Back off.".to_string(),
                timestamp: "2026-05-29T01:00:00Z".to_string(),
                detected_trope: "protective".to_string(),
            },
            IncomingExportMessage {
                role: "NPC".to_string(),
                text: "*blushes* You came back.".to_string(),
                timestamp: "2026-05-29T01:00:05Z".to_string(),
                detected_trope: "slipped_mask".to_string(),
            },
        ]);

        assert!(log.contains("HEARTWRITEAI STORY LOG"));
        assert!(log.contains("[2026-05-29T01:00:00Z] YOU (Mood: Protective)"));
        assert!(log.contains("[2026-05-29T01:00:05Z] CHARACTER (Mood: Slipped Mask)"));
        assert!(log.contains("End of Story Log. Built with HeartWriteAI."));
    }
}
