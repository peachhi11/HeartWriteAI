use std::fs::File;
use std::io::Read;
use std::path::Path;

use crate::codecs::charx_card::extract_ccv3_from_charx;
use crate::codecs::png_card::extract_ccv3_from_png;
use crate::models::character_card::CharacterCardV3;

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
        "png" | "apng" => extract_ccv3_from_png(path),
        "charx" => extract_ccv3_from_charx(path),
        "json" => parse_card_json_file(path),
        _ => Err(format!(
            "Unsupported file format validation error: '.{extension}'. Only .png, .apng, .charx, and .json files are handled by the CCV3 importer."
        )),
    }
}

fn parse_card_json_file(path: &Path) -> Result<CharacterCardV3, String> {
    let mut file = File::open(path)
        .map_err(|error| format!("Failed to open targeted plain JSON file context: {error}"))?;
    let mut json_buffer = String::new();
    file.read_to_string(&mut json_buffer)
        .map_err(|error| format!("Disk IO read failure on plaintext asset: {error}"))?;

    serde_json::from_str(&json_buffer).map_err(|error| {
        format!(
            "JSON file context does not match expected CCV3 layout structural specification: {error}"
        )
    })
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
