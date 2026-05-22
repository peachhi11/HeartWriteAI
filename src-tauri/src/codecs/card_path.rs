use std::fs::File;
use std::io::Read;
use std::path::Path;

use crate::codecs::charx_card::extract_ccv3_from_charx;
use crate::codecs::png_card::extract_ccv3_from_png;
use crate::models::character_card::CharacterCardV3;
use serde_json::Value;

pub fn parse_card_by_path<P: AsRef<Path>>(file_path: P) -> Result<CharacterCardV3, String> {
    let path = file_path.as_ref();

    if !path.exists() {
        return Err(format!("The file path does not exist on disk: {path:?}"));
    }

    let extension = path
        .extension()
        .and_then(|extension| extension.to_str())
        .map(str::to_ascii_lowercase)
        .ok_or_else(|| {
            "Could not determine file extension type from provided path registry string."
                .to_string()
        })?;

    match extension.as_str() {
        "png" | "apng" => {
            if let Some(pointer_error) = read_json_pointer_error(path)? {
                return Err(pointer_error);
            }

            extract_ccv3_from_png(path)
        }
        "charx" => extract_ccv3_from_charx(path).map(normalize_card_to_v3),
        "json" => parse_card_json_file(path),
        _ => Err(format!(
            "Unsupported file format validation error: '.{extension}'. Only .png, .apng, .charx, and .json files are handled by the CCV3 importer."
        )),
    }
}

fn read_json_pointer_error(path: &Path) -> Result<Option<String>, String> {
    let mut file = File::open(path)
        .map_err(|error| format!("Failed to open targeted file context: {error}"))?;
    let mut prefix_buffer = [0_u8; 512];
    let bytes_read = file
        .read(&mut prefix_buffer)
        .map_err(|error| format!("Disk IO read failure on file preflight: {error}"))?;
    let prefix = String::from_utf8_lossy(&prefix_buffer[..bytes_read])
        .trim_start()
        .to_string();

    if !prefix.starts_with('{') {
        return Ok(None);
    }

    let mut json_buffer = prefix;
    file.read_to_string(&mut json_buffer)
        .map_err(|error| format!("Disk IO read failure on JSON pointer preflight: {error}"))?;

    let Ok(parsed_value) = serde_json::from_str::<Value>(&json_buffer) else {
        return Ok(None);
    };

    Ok(parsed_value.get("url").and_then(Value::as_str).map(|url| {
        format!("This file is a download link, not a character card. Download the linked card image first: {url}")
    }))
}

fn parse_card_json_file(path: &Path) -> Result<CharacterCardV3, String> {
    let mut file = File::open(path)
        .map_err(|error| format!("Failed to open targeted plain JSON file context: {error}"))?;
    let mut json_buffer = String::new();
    file.read_to_string(&mut json_buffer)
        .map_err(|error| format!("Disk IO read failure on plaintext asset: {error}"))?;

    let parsed_value: Value = serde_json::from_str(&json_buffer).map_err(|error| {
        format!(
            "This file is not readable JSON. It may be an incomplete download or a non-card file: {error}"
        )
    })?;

    if let Some(url) = parsed_value.get("url").and_then(Value::as_str) {
        return Err(format!(
            "This file is a download link, not a character card. Download the linked card image first: {url}"
        ));
    }

    serde_json::from_value(parsed_value)
        .map(normalize_card_to_v3)
        .map_err(|error| {
        format!(
            "This JSON file is readable, but it does not match a supported character card layout: {error}"
        )
    })
}

pub fn normalize_card_to_v3(mut card: CharacterCardV3) -> CharacterCardV3 {
    card.spec = "chara_card_v3".to_string();
    card.spec_version = "3.0".to_string();
    repair_imported_card_layout(&mut card);
    card
}

fn repair_imported_card_layout(card: &mut CharacterCardV3) {
    if !card.data.personality.trim().is_empty() {
        return;
    }

    let Some(repaired) = split_imported_description(&card.data.description) else {
        return;
    };

    card.data.description = repaired.description;
    card.data.personality = join_blocks([&card.data.personality, &repaired.personality]);
    if card.data.scenario.trim().is_empty() && !repaired.scenario.trim().is_empty() {
        card.data.scenario = repaired.scenario;
    }
}

struct RepairedImportedDescription {
    description: String,
    personality: String,
    scenario: String,
}

fn split_imported_description(description: &str) -> Option<RepairedImportedDescription> {
    let sections = collect_import_sections(description);
    if sections.len() < 2 {
        return None;
    }

    let mut description_blocks = Vec::new();
    let mut personality_blocks = Vec::new();
    let mut scenario_blocks = Vec::new();
    let mut moved_any_section = false;

    for section in sections {
        match section.label.as_deref() {
            Some(label) if is_behavior_section_label(label) => {
                personality_blocks.push(section.content);
                moved_any_section = true;
            }
            Some(label) if is_scenario_section_label(label) => {
                scenario_blocks.push(section.content);
                moved_any_section = true;
            }
            _ => description_blocks.push(section.content),
        }
    }

    if !moved_any_section || personality_blocks.is_empty() {
        return None;
    }

    let repaired_description = join_owned_blocks(description_blocks);
    Some(RepairedImportedDescription {
        description: if repaired_description.is_empty() {
            description.to_string()
        } else {
            repaired_description
        },
        personality: join_owned_blocks(personality_blocks),
        scenario: join_owned_blocks(scenario_blocks),
    })
}

struct ImportSection {
    label: Option<String>,
    content: String,
}

fn collect_import_sections(input: &str) -> Vec<ImportSection> {
    let mut sections = Vec::new();
    let mut current_label: Option<String> = None;
    let mut current_lines: Vec<String> = Vec::new();

    for line in input.replace("\r\n", "\n").split('\n') {
        if let Some(heading) = read_section_heading(line) {
            push_import_section(&mut sections, current_label.take(), &current_lines);
            current_label = Some(heading);
            current_lines = vec![line.trim().to_string()];
        } else {
            current_lines.push(line.to_string());
        }
    }

    push_import_section(&mut sections, current_label, &current_lines);
    sections
}

fn push_import_section(sections: &mut Vec<ImportSection>, label: Option<String>, lines: &[String]) {
    let content = lines.join("\n").trim().to_string();
    if !content.is_empty() {
        sections.push(ImportSection { label, content });
    }
}

fn read_section_heading(line: &str) -> Option<String> {
    let normalized = line
        .trim()
        .trim_start_matches(|character: char| matches!(character, '#' | '*' | ' ' | '[' | '('))
        .trim_end_matches(|character: char| matches!(character, ')' | ']'))
        .trim_end_matches(|character: char| matches!(character, ':' | '：'))
        .trim()
        .split_whitespace()
        .collect::<Vec<_>>()
        .join(" ")
        .to_lowercase();

    if normalized.is_empty() || normalized.len() > 48 {
        return None;
    }

    if is_behavior_section_label(&normalized)
        || is_description_section_label(&normalized)
        || is_scenario_section_label(&normalized)
    {
        Some(normalized)
    } else {
        None
    }
}

fn is_behavior_section_label(label: &str) -> bool {
    matches!(
        label,
        "appearance"
            | "backstory"
            | "background"
            | "behavior"
            | "behaviour"
            | "core personality"
            | "dialogue style"
            | "dynamic with user"
            | "dynamic with {{user}}"
            | "intimacy"
            | "kinks"
            | "likes"
            | "mannerisms"
            | "personality"
            | "quirks"
            | "relationships"
            | "sexual behavior"
            | "sexual behaviour"
            | "speech"
            | "speech style"
    )
}

fn is_description_section_label(label: &str) -> bool {
    matches!(label, "basic information" | "character profile" | "profile")
}

fn is_scenario_section_label(label: &str) -> bool {
    matches!(label, "scenario" | "setting")
}

fn join_blocks<const N: usize>(blocks: [&str; N]) -> String {
    blocks
        .into_iter()
        .filter_map(|block| {
            let trimmed = block.trim();
            if trimmed.is_empty() {
                None
            } else {
                Some(trimmed)
            }
        })
        .collect::<Vec<_>>()
        .join("\n\n")
}

fn join_owned_blocks(blocks: Vec<String>) -> String {
    blocks
        .into_iter()
        .filter_map(|block| {
            let trimmed = block.trim().to_string();
            if trimmed.is_empty() {
                None
            } else {
                Some(trimmed)
            }
        })
        .collect::<Vec<_>>()
        .join("\n\n")
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::codecs::charx_card::create_charx_bundle;
    use crate::models::character_card::{CardDataV3, CharacterCardV3};
    use std::collections::HashMap;
    use std::path::PathBuf;

    #[test]
    fn parses_plain_json_card_by_path() {
        let temp_dir = create_temp_dir("card-path-json");
        let card_path = temp_dir.join("mara.json");
        let card = fixture_card("Mara JSON");
        std::fs::write(
            &card_path,
            serde_json::to_string_pretty(&card).expect("card should serialize"),
        )
        .expect("fixture should write");

        let parsed = parse_card_by_path(&card_path).expect("JSON card should parse");

        assert_eq!(parsed.data.name, "Mara JSON");
    }

    #[test]
    fn parses_charx_card_by_path() {
        let temp_dir = create_temp_dir("card-path-charx");
        let card_path = temp_dir.join("mara.charx");
        let card = fixture_card("Mara CHARX");
        create_charx_bundle(&card_path, &card, None::<&PathBuf>, None::<&PathBuf>)
            .expect("CHARX fixture should write");

        let parsed = parse_card_by_path(&card_path).expect("CHARX card should parse");

        assert_eq!(parsed.data.name, "Mara CHARX");
    }

    #[test]
    fn repairs_imported_cards_that_dump_profile_sections_into_description() {
        let temp_dir = create_temp_dir("card-path-layout-repair");
        let card_path = temp_dir.join("chris.json");
        let mut card = fixture_card("Chris Henries");
        card.data.description = "### Chris's Profile\nSurname: Henries\nAge: 24\nRole: Brother's Best Friend\n\nAppearance:\n- Tall, athletic, dyed blonde hair.\n\nRelationships:\nLucas: {{user}}'s older brother.\n\nCore Personality:\nCocky, charismatic, and protective.\n\nDialogue Style:\nTeasing and casual.".to_string();
        card.data.personality = String::new();
        std::fs::write(
            &card_path,
            serde_json::to_string_pretty(&card).expect("card should serialize"),
        )
        .expect("fixture should write");

        let parsed = parse_card_by_path(&card_path).expect("JSON card should parse");

        assert!(parsed.data.description.contains("Chris's Profile"));
        assert!(parsed.data.description.contains("Age: 24"));
        assert!(!parsed.data.description.contains("Appearance:"));
        assert!(parsed.data.personality.contains("Appearance:"));
        assert!(parsed.data.personality.contains("Relationships:"));
        assert!(parsed.data.personality.contains("Core Personality:"));
        assert!(parsed.data.personality.contains("Dialogue Style:"));
    }

    #[test]
    fn rejects_missing_card_paths() {
        let error =
            parse_card_by_path("/not/a/real/card.json").expect_err("missing path should reject");

        assert!(error.contains("does not exist"));
    }

    #[test]
    fn rejects_unsupported_extensions() {
        let temp_dir = create_temp_dir("card-path-unsupported");
        let card_path = temp_dir.join("mara.txt");
        std::fs::write(&card_path, "not a card").expect("fixture should write");

        let error = parse_card_by_path(&card_path).expect_err("TXT card should reject");

        assert!(error.contains("Unsupported file format"));
    }

    #[test]
    fn explains_json_pointer_files() {
        let temp_dir = create_temp_dir("card-path-pointer-json");
        let card_path = temp_dir.join("emily.png");
        std::fs::write(
            &card_path,
            r#"{"url":"https://img.taverncard.com/cards/example.png","download_count":"2511"}"#,
        )
        .expect("fixture should write");

        let error = parse_card_by_path(&card_path).expect_err("pointer file should reject");

        assert!(error.contains("download link"));
        assert!(error.contains("https://img.taverncard.com/cards/example.png"));
    }

    fn fixture_card(name: &str) -> CharacterCardV3 {
        CharacterCardV3 {
            spec: "chara_card_v3".to_string(),
            spec_version: "3.0".to_string(),
            data: CardDataV3 {
                name: name.to_string(),
                description: "Fixture card".to_string(),
                personality: String::new(),
                scenario: String::new(),
                first_mes: String::new(),
                mes_example: String::new(),
                creator_notes: String::new(),
                system_prompt: String::new(),
                post_history_instructions: String::new(),
                alternate_greetings: Vec::new(),
                group_only_greetings: Vec::new(),
                tags: vec!["fixture".to_string()],
                creator: "test".to_string(),
                character_version: String::new(),
                extensions: HashMap::new(),
                character_book: None,
                assets: Vec::new(),
                nickname: None,
                creator_notes_multilingual: HashMap::new(),
                source: Vec::new(),
                creation_date: None,
                modification_date: None,
                extra: HashMap::new(),
            },
        }
    }

    fn create_temp_dir(name: &str) -> PathBuf {
        let path = std::env::temp_dir().join(format!("amourai-{name}-{}", std::process::id()));
        if path.exists() {
            std::fs::remove_dir_all(&path).expect("old temp dir should be removable");
        }
        std::fs::create_dir_all(&path).expect("temp dir should be created");
        path
    }
}
