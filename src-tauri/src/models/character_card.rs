#![allow(dead_code)]

use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;

pub const AMOURAI_EXTENSION_NAMESPACE: &str = "amourai";

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct CharacterCardV3 {
    pub spec: String,
    pub spec_version: String,
    pub data: CardDataV3,
}

impl CharacterCardV3 {
    /// Returns AmourAI's macro metadata from `data.extensions.amourai`.
    ///
    /// The app currently accepts either a direct macro payload at
    /// `extensions.amourai` or a nested payload at `extensions.amourai.macro`
    /// so imported/exported cards can remain stable while the extension shape
    /// settles.
    pub fn get_macro_extensions(&self) -> Option<AppMacroExtensions> {
        let extension_value = self.data.extensions.get(AMOURAI_EXTENSION_NAMESPACE)?;
        let macro_value = extension_value
            .get("macro")
            .cloned()
            .unwrap_or_else(|| extension_value.clone());

        serde_json::from_value(macro_value).ok()
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct AppMacroExtensions {
    pub framework: String,
    pub formatting: String,
    pub relationship: String,
    #[serde(default)]
    pub tones: Vec<String>,
    #[serde(default)]
    pub micro_tropes: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct CardDataV3 {
    pub name: String,
    #[serde(default)]
    pub description: String,
    #[serde(default)]
    pub personality: String,
    #[serde(default)]
    pub scenario: String,
    #[serde(default)]
    pub first_mes: String,
    #[serde(default)]
    pub mes_example: String,
    #[serde(default)]
    pub creator_notes: String,
    #[serde(default)]
    pub system_prompt: String,
    #[serde(default)]
    pub post_history_instructions: String,
    #[serde(default)]
    pub alternate_greetings: Vec<String>,
    #[serde(default)]
    pub group_only_greetings: Vec<String>,
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(default)]
    pub creator: String,
    #[serde(default)]
    pub character_version: String,
    #[serde(default)]
    pub extensions: HashMap<String, Value>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub character_book: Option<CharacterBookV3>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub assets: Vec<CharacterAssetV3>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub nickname: Option<String>,
    #[serde(default, skip_serializing_if = "HashMap::is_empty")]
    pub creator_notes_multilingual: HashMap<String, String>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub source: Vec<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub creation_date: Option<i64>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub modification_date: Option<i64>,
    #[serde(flatten)]
    pub extra: HashMap<String, Value>,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct CharacterAssetV3 {
    pub r#type: String,
    pub uri: String,
    pub name: String,
    pub ext: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct CharacterBookV3 {
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scan_depth: Option<i64>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub token_budget: Option<i64>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub recursive_scanning: Option<bool>,
    #[serde(default)]
    pub extensions: HashMap<String, Value>,
    #[serde(default)]
    pub entries: Vec<BookEntryV3>,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[serde(untagged)]
pub enum LorebookEntryId {
    Number(i64),
    Text(String),
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct BookEntryV3 {
    #[serde(default)]
    pub keys: Vec<String>,
    #[serde(default)]
    pub content: String,
    #[serde(default)]
    pub extensions: HashMap<String, Value>,
    #[serde(default = "default_enabled")]
    pub enabled: bool,
    #[serde(default)]
    pub insertion_order: i64,
    #[serde(default)]
    pub use_regex: bool,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub case_sensitive: Option<bool>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub constant: Option<bool>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub priority: Option<i64>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<LorebookEntryId>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub comment: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub selective: Option<bool>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub secondary_keys: Vec<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub position: Option<LorebookEntryPosition>,
    #[serde(flatten)]
    pub extra: HashMap<String, Value>,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum LorebookEntryPosition {
    BeforeChar,
    AfterChar,
}

fn default_enabled() -> bool {
    true
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn deserializes_ccv3_with_extensions_and_string_lorebook_ids() {
        let card: CharacterCardV3 = serde_json::from_value(json!({
            "spec": "chara_card_v3",
            "spec_version": "3.0",
            "data": {
                "name": "Mara",
                "description": "A guarded thief.",
                "extensions": {
                    AMOURAI_EXTENSION_NAMESPACE: {
                        "macro": {
                            "framework": "Narrative RPG",
                            "formatting": "Natural Language",
                            "relationship": "Antagonistic",
                            "tones": ["angsty"],
                            "micro_tropes": ["hurt/comfort"]
                        }
                    }
                },
                "character_book": {
                    "extensions": {},
                    "entries": [{
                        "id": "route-a",
                        "keys": ["Mara"],
                        "content": "Keeps a hidden safehouse.",
                        "extensions": {},
                        "enabled": true,
                        "insertion_order": 10,
                        "use_regex": false,
                        "position": "before_char"
                    }]
                }
            }
        }))
        .expect("ccv3 card should deserialize");

        assert_eq!(card.spec, "chara_card_v3");
        assert_eq!(card.data.name, "Mara");
        assert_eq!(
            card.data
                .extensions
                .get(AMOURAI_EXTENSION_NAMESPACE)
                .and_then(|value| value.get("macro"))
                .and_then(|value| value.get("framework")),
            Some(&json!("Narrative RPG"))
        );
        assert_eq!(
            card.get_macro_extensions(),
            Some(AppMacroExtensions {
                framework: "Narrative RPG".to_string(),
                formatting: "Natural Language".to_string(),
                relationship: "Antagonistic".to_string(),
                tones: vec!["angsty".to_string()],
                micro_tropes: vec!["hurt/comfort".to_string()],
            })
        );
        assert_eq!(
            card.data.character_book.unwrap().entries[0].id,
            Some(LorebookEntryId::Text("route-a".to_string()))
        );
    }

    #[test]
    fn reads_direct_macro_extensions_from_app_namespace() {
        let card: CharacterCardV3 = serde_json::from_value(json!({
            "spec": "chara_card_v3",
            "spec_version": "3.0",
            "data": {
                "name": "Mara",
                "extensions": {
                    AMOURAI_EXTENSION_NAMESPACE: {
                        "framework": "Sandbox",
                        "formatting": "W++",
                        "relationship": "Symmetric",
                        "tones": ["cozy romance"],
                        "micro_tropes": []
                    }
                }
            }
        }))
        .expect("ccv3 card should deserialize");

        assert_eq!(
            card.get_macro_extensions(),
            Some(AppMacroExtensions {
                framework: "Sandbox".to_string(),
                formatting: "W++".to_string(),
                relationship: "Symmetric".to_string(),
                tones: vec!["cozy romance".to_string()],
                micro_tropes: Vec::new(),
            })
        );
    }
}
