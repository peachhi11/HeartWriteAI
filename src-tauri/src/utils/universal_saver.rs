use std::fs::File;
use std::io::Write;
use std::path::Path;

use crate::codecs::png_card::inject_ccv3_into_png;
use crate::models::character_card::CharacterCardV3;
use crate::utils::charx_exporter::compile_full_charx_bundle;

pub fn save_changes_to_source_path<P: AsRef<Path>>(
    source_file_path: P,
    updated_card_data: &CharacterCardV3,
) -> Result<(), String> {
    let path = source_file_path.as_ref();

    if !path.exists() {
        return Err(format!(
            "Cannot locate target workspace session reference: {path:?}"
        ));
    }

    let extension = path
        .extension()
        .and_then(|extension| extension.to_str())
        .map(|extension| extension.to_ascii_lowercase())
        .ok_or_else(|| "Failed to verify file target format type.".to_string())?;

    match extension.as_str() {
        "apng" | "png" => inject_ccv3_into_png(path, path, updated_card_data),
        "json" => save_json_card(path, updated_card_data),
        "charx" => compile_full_charx_bundle(path, updated_card_data, path),
        _ => Err(format!(
            "Unsupported write execution target: '.{extension}'"
        )),
    }
}

fn save_json_card(path: &Path, updated_card_data: &CharacterCardV3) -> Result<(), String> {
    let json_string = serde_json::to_string_pretty(updated_card_data)
        .map_err(|error| format!("JSON encoding pass crashed unexpectedly: {error}"))?;
    let mut file = File::create(path)
        .map_err(|error| format!("Failed to open destination JSON stream: {error}"))?;

    file.write_all(json_string.as_bytes())
        .map_err(|error| format!("Disk IO write failure on JSON serialization output: {error}"))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::character_card::{CardDataV3, CharacterCardV3};
    use std::collections::HashMap;
    use std::fs;
    use std::path::PathBuf;

    #[test]
    fn saves_json_card_back_to_source_path() {
        let temp_dir = create_temp_dir("universal-json-save");
        let card_path = temp_dir.join("mara.json");
        let mut card = fixture_card("Mara");
        fs::write(&card_path, "{}").expect("fixture source should write");

        card.data.description = "Updated description".to_string();
        save_changes_to_source_path(&card_path, &card).expect("json card should save");

        let saved_text = fs::read_to_string(&card_path).expect("json card should read");
        let saved_card: CharacterCardV3 =
            serde_json::from_str(&saved_text).expect("saved card should parse");
        assert_eq!(saved_card.data.description, "Updated description");
    }

    #[test]
    fn rejects_missing_source_path() {
        let temp_dir = create_temp_dir("universal-missing-save");
        let card_path = temp_dir.join("missing.json");
        let card = fixture_card("Mara");

        let error =
            save_changes_to_source_path(&card_path, &card).expect_err("missing file should fail");

        assert!(error.contains("Cannot locate target workspace session reference"));
    }

    #[test]
    fn rejects_unsupported_save_extension() {
        let temp_dir = create_temp_dir("universal-unsupported-save");
        let card_path = temp_dir.join("mara.txt");
        let card = fixture_card("Mara");
        fs::write(&card_path, "nope").expect("fixture source should write");

        let error =
            save_changes_to_source_path(&card_path, &card).expect_err("txt file should fail");

        assert!(error.contains("Unsupported write execution target"));
    }

    fn fixture_card(name: &str) -> CharacterCardV3 {
        CharacterCardV3 {
            spec: "chara_card_v3".to_string(),
            spec_version: "3.0".to_string(),
            data: CardDataV3 {
                name: name.to_string(),
                description: String::new(),
                personality: String::new(),
                scenario: String::new(),
                first_mes: String::new(),
                mes_example: String::new(),
                creator_notes: String::new(),
                system_prompt: String::new(),
                post_history_instructions: String::new(),
                alternate_greetings: Vec::new(),
                group_only_greetings: Vec::new(),
                tags: Vec::new(),
                creator: "Test".to_string(),
                character_version: "1.0.0".to_string(),
                character_book: None,
                assets: Vec::new(),
                nickname: None,
                creator_notes_multilingual: HashMap::new(),
                source: Vec::new(),
                creation_date: None,
                modification_date: None,
                extra: HashMap::new(),
                extensions: HashMap::new(),
            },
        }
    }

    fn create_temp_dir(name: &str) -> PathBuf {
        let path = std::env::temp_dir().join(format!("amourai-{name}-{}", std::process::id()));
        if path.exists() {
            fs::remove_dir_all(&path).expect("old temp dir should be removable");
        }
        fs::create_dir_all(&path).expect("temp dir should be created");
        path
    }
}
