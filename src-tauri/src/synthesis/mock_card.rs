use crate::models::character_card::{CardDataV3, CharacterCardV3, AMOURAI_EXTENSION_NAMESPACE};
use rand::seq::SliceRandom;
use std::collections::HashMap;

const NAMES: &[&str] = &[
    "Alistair",
    "Seraphina",
    "Lysander",
    "Valerie",
    "Gideon",
    "Caelum",
    "Evelyn",
];
const TITLES: &[&str] = &[
    "Ruthless Commander",
    "Spurned Princess",
    "Silent Bodyguard",
    "Hidden Healer",
    "Arrogant CEO",
];
const FRAMEWORKS: &[&str] = &["Sandbox", "Narrative RPG", "Text Adventure", "Scene-Locked"];
const RELATIONSHIPS: &[&str] = &[
    "Symmetric",
    "Asymmetric (Bot Dominant)",
    "Asymmetric (User Dominant)",
    "Antagonistic",
];
const TONES: &[&str] = &[
    "Slow-Burn",
    "Dark Romance",
    "Angsty",
    "Fluff",
    "Cozy Romance",
];
const TROPES: &[&str] = &[
    "Enemies to Lovers",
    "Only One Bed",
    "Who Hurt You?",
    "Fake Dating",
    "Grumpy x Sunshine",
];

pub fn generate_random_mock_ccv3() -> CharacterCardV3 {
    let mut rng = rand::thread_rng();

    let name = NAMES
        .choose(&mut rng)
        .copied()
        .unwrap_or("Alistair")
        .to_string();
    let title = TITLES
        .choose(&mut rng)
        .copied()
        .unwrap_or("Ruthless Commander")
        .to_string();
    let framework = FRAMEWORKS
        .choose(&mut rng)
        .copied()
        .unwrap_or("Sandbox")
        .to_string();
    let relationship = RELATIONSHIPS
        .choose(&mut rng)
        .copied()
        .unwrap_or("Symmetric")
        .to_string();
    let selected_tones = TONES
        .choose_multiple(&mut rng, 2)
        .map(|value| (*value).to_string())
        .collect::<Vec<_>>();
    let selected_tropes = TROPES
        .choose_multiple(&mut rng, 2)
        .map(|value| (*value).to_string())
        .collect::<Vec<_>>();

    let mut extensions = HashMap::new();
    extensions.insert(
        AMOURAI_EXTENSION_NAMESPACE.to_string(),
        serde_json::json!({
            "macro": {
                "framework": framework,
                "formatting": "JSON",
                "relationship": relationship,
                "tones": selected_tones,
                "micro_tropes": selected_tropes
            }
        }),
    );

    CharacterCardV3 {
        spec: "chara_card_v3".to_string(),
        spec_version: "3.0".to_string(),
        data: CardDataV3 {
            name: format!("{name} ({title})"),
            description:
                "Automated generation template layout block for stress metrics validation."
                    .to_string(),
            personality: "Synthesised memory space array template.".to_string(),
            scenario: "Encounter scenario context bounds configured dynamically.".to_string(),
            first_mes:
                "*Clears throat casually while facing your direction.* \"Welcome to verification tests.\""
                    .to_string(),
            mes_example: String::new(),
            creator_notes: "Engine Core Testing Mock Generator Module Entry.".to_string(),
            system_prompt: "Impersonate the generated profile accurately.".to_string(),
            post_history_instructions: String::new(),
            alternate_greetings: Vec::new(),
            group_only_greetings: Vec::new(),
            tags: vec!["MockGenerated".to_string(), title],
            creator: "System Synthesis Mock Suite".to_string(),
            character_version: "1.0.0".to_string(),
            extensions,
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

#[cfg(test)]
mod tests {
    use super::*;
    use crate::cache::card_cache::CacheDatabase;

    #[test]
    fn generates_valid_mock_ccv3_with_macro_extensions() {
        let card = generate_random_mock_ccv3();
        let macro_data = card
            .get_macro_extensions()
            .expect("mock card should include macro metadata");

        assert_eq!(card.spec, "chara_card_v3");
        assert_eq!(card.spec_version, "3.0");
        assert!(!card.data.name.is_empty());
        assert!(card.data.tags.contains(&"MockGenerated".to_string()));
        assert_eq!(macro_data.formatting, "JSON");
        assert_eq!(macro_data.tones.len(), 2);
        assert_eq!(macro_data.micro_tropes.len(), 2);
    }

    #[test]
    fn generated_mock_card_indexes_into_cache() {
        let temp_dir = create_temp_dir("mock-card-cache");
        let db_path = temp_dir.join("cards.sqlite3");
        let cache = CacheDatabase::init(&db_path).expect("cache should initialize");
        let card = generate_random_mock_ccv3();
        let file_path = "/tmp/generated-mock.charx";

        cache
            .upsert_card(file_path, &card)
            .expect("generated mock should cache");

        let record = cache
            .cached_card_for_path(file_path)
            .expect("cache should query")
            .expect("record should exist");

        assert_eq!(record.file_path, file_path);
        assert_eq!(record.name, card.data.name);
        assert_eq!(record.tags, card.data.tags);
    }

    fn create_temp_dir(name: &str) -> std::path::PathBuf {
        let path = std::env::temp_dir().join(format!("amourai-{name}-{}", std::process::id()));
        if path.exists() {
            std::fs::remove_dir_all(&path).expect("old temp dir should be removable");
        }
        std::fs::create_dir_all(&path).expect("temp dir should be created");
        path
    }
}
