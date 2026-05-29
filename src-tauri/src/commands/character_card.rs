use crate::codecs::charx_card::{create_charx_bundle, extract_ccv3_from_charx};
use crate::codecs::image_asset::convert_to_standard_png;
use crate::codecs::png_card::{extract_ccv3_from_png, inject_ccv3_into_png};
use crate::models::character_card::{AppMacroExtensions, CharacterCardV3};
use crate::security::SecurityPipeline;
use crate::state_manager::CharacterCardModel;
use crate::utils::universal_saver::save_changes_to_source_path;
use crate::AppState;
use base64::{prelude::BASE64_STANDARD, Engine};
use serde::{Deserialize, Serialize};
use std::io::Read;
use tauri::Manager;
use tauri_plugin_dialog::DialogExt;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
pub struct CharacterCardMetadata {
    pub name: String,
    pub description: String,
    #[serde(rename = "forbiddenTones")]
    pub forbidden_tones: Vec<String>,
    #[serde(rename = "preferredTones")]
    pub preferred_tones: Vec<String>,
}

#[derive(Serialize, Clone, Debug, PartialEq, Eq)]
pub struct CharacterImportPayload {
    pub metadata: CharacterCardMetadata,
    #[serde(rename = "avatarDataUri")]
    pub avatar_data_uri: String,
}

#[tauri::command]
pub async fn save_ccv3_card(
    app_handle: tauri::AppHandle,
    state: tauri::State<'_, AppState>,
    card: CharacterCardV3,
) -> Result<String, String> {
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|_| "Failed to resolve application data directory path".to_string())?;
    let cards_dir = app_dir.join("character-cards");

    std::fs::create_dir_all(&cards_dir).map_err(|error| error.to_string())?;

    let safe_filename = create_safe_card_file_name(&card.data.name);
    let file_path = cards_dir.join(format!("{safe_filename}.charx"));
    create_charx_bundle(&file_path, &card, None::<&str>, None::<&str>)?;

    let saved_path = file_path.to_string_lossy().into_owned();
    upsert_saved_card_path(&state, &saved_path, &card)?;

    Ok(saved_path)
}

#[tauri::command]
pub async fn import_ccv3_card_from_png(path: String) -> Result<CharacterCardV3, String> {
    extract_ccv3_from_png(path)
}

#[tauri::command]
pub async fn import_png_card(file_path: String) -> Result<CharacterCardV3, String> {
    extract_ccv3_from_png(file_path)
}

#[tauri::command]
pub async fn pick_and_parse_character_card(
    app_handle: tauri::AppHandle,
) -> Result<CharacterCardMetadata, String> {
    let picker = app_handle
        .dialog()
        .file()
        .add_filter("Character Card PNG", &["png"])
        .set_title("Select Character Card PNG");

    let selected_path = picker
        .blocking_pick_file()
        .ok_or_else(|| "Picker cancelled by player.".to_string())?;

    let card = extract_ccv3_from_png(selected_path.to_string())?;
    let metadata = character_card_metadata_from_card(&card);
    sanitize_character_card_metadata(metadata)
}

#[tauri::command]
pub async fn pick_and_parse_character_card_with_avatar(
    app_handle: tauri::AppHandle,
) -> Result<CharacterImportPayload, String> {
    let picker = app_handle
        .dialog()
        .file()
        .add_filter("Character Card PNG", &["png"])
        .set_title("Import Character Card Asset");

    let selected_path = picker
        .blocking_pick_file()
        .ok_or_else(|| "Import aborted by player.".to_string())?;

    let mut raw_bytes = Vec::new();
    let mut raw_file_handle = std::fs::File::open(selected_path.to_string())
        .map_err(|error| format!("Failed to read raw image source: {error}"))?;
    raw_file_handle
        .read_to_end(&mut raw_bytes)
        .map_err(|error| format!("File stream read error: {error}"))?;

    let card = extract_ccv3_from_png(selected_path.to_string())?;
    secured_import_payload_from_card_and_bytes(&card, &raw_bytes)
}

#[tauri::command]
pub async fn import_charx_card(file_path: String) -> Result<CharacterCardV3, String> {
    extract_ccv3_from_charx(file_path)
}

#[tauri::command]
pub async fn extract_card_macro_extensions(
    card: CharacterCardV3,
) -> Result<Option<AppMacroExtensions>, String> {
    Ok(card.get_macro_extensions())
}

#[tauri::command]
pub async fn inject_ccv3_card_into_png(
    state: tauri::State<'_, AppState>,
    source_image_path: String,
    output_png_path: String,
    card: CharacterCardV3,
) -> Result<String, String> {
    inject_ccv3_into_png(&source_image_path, &output_png_path, &card)?;
    upsert_saved_card_path(&state, &output_png_path, &card)?;

    Ok(output_png_path)
}

#[tauri::command]
pub async fn write_edited_card_to_png(
    state: tauri::State<'_, AppState>,
    source_img_path: String,
    target_save_path: String,
    updated_card_data: CharacterCardV3,
) -> Result<(), String> {
    inject_ccv3_into_png(&source_img_path, &target_save_path, &updated_card_data)?;
    upsert_saved_card_path(&state, &target_save_path, &updated_card_data)?;

    Ok(())
}

#[tauri::command]
pub async fn save_workspace_changes(
    state: tauri::State<'_, AppState>,
    active_session_path: String,
    current_workspace_card: CharacterCardV3,
) -> Result<String, String> {
    save_changes_to_source_path(&active_session_path, &current_workspace_card)?;
    upsert_saved_card_path(&state, &active_session_path, &current_workspace_card)?;

    Ok(format!(
        "Changes successfully committed back to: {active_session_path}"
    ))
}

#[tauri::command]
pub async fn export_ccv3_card_to_charx(
    state: tauri::State<'_, AppState>,
    output_path: String,
    card: CharacterCardV3,
    avatar_path: Option<String>,
    additional_assets_dir: Option<String>,
) -> Result<String, String> {
    create_charx_bundle(
        &output_path,
        &card,
        avatar_path.as_deref(),
        additional_assets_dir.as_deref(),
    )?;

    upsert_saved_card_path(&state, &output_path, &card)?;

    Ok(output_path)
}

#[tauri::command]
pub async fn export_charx_card(
    state: tauri::State<'_, AppState>,
    destination_zip: String,
    card: CharacterCardV3,
    avatar_src: Option<String>,
    assets_src: Option<String>,
) -> Result<(), String> {
    create_charx_bundle(
        &destination_zip,
        &card,
        avatar_src.as_deref(),
        assets_src.as_deref(),
    )?;
    upsert_saved_card_path(&state, &destination_zip, &card)?;

    Ok(())
}

#[tauri::command]
pub async fn convert_asset_to_standard_png(
    input_path: String,
    output_path: String,
) -> Result<String, String> {
    convert_to_standard_png(&input_path, &output_path)?;

    Ok(output_path)
}

#[tauri::command]
pub async fn transcode_asset_to_png(
    source_path: String,
    destination_path: String,
) -> Result<(), String> {
    convert_to_standard_png(source_path, destination_path)
}

fn create_safe_card_file_name(name: &str) -> String {
    let safe_name = name
        .chars()
        .map(|character| {
            if character.is_ascii_alphanumeric() {
                character
            } else {
                '_'
            }
        })
        .collect::<String>()
        .split('_')
        .filter(|part| !part.is_empty())
        .collect::<Vec<_>>()
        .join("_");

    if safe_name.is_empty() {
        "untitled_card".to_string()
    } else {
        safe_name
    }
}

fn upsert_saved_card_path(
    state: &tauri::State<'_, AppState>,
    file_path: &str,
    card: &CharacterCardV3,
) -> Result<(), String> {
    let db_guard = state
        .db
        .lock()
        .map_err(|_| "Failed capturing database mutex lock context".to_string())?;

    if let Some(db) = db_guard.as_ref() {
        db.upsert_card(file_path, card)?;
    }

    Ok(())
}

fn character_card_metadata_from_card(card: &CharacterCardV3) -> CharacterCardMetadata {
    let forbidden_tones = forbidden_tones_from_card(card);
    let mut preferred_tones = preferred_tones_from_card(card);
    preferred_tones.retain(|tone| !forbidden_tones.contains(tone));

    CharacterCardMetadata {
        name: card.data.name.clone(),
        description: card.data.description.clone(),
        forbidden_tones,
        preferred_tones,
    }
}

fn secured_import_payload_from_card_and_bytes(
    card: &CharacterCardV3,
    raw_bytes: &[u8],
) -> Result<CharacterImportPayload, String> {
    let metadata = character_card_metadata_from_card(card);
    let secured_model = SecurityPipeline::sanitize_and_verify_model(CharacterCardModel {
        avatar_data_uri: avatar_data_uri_from_png_bytes(raw_bytes),
        description: metadata.description,
        forbidden_tones: metadata.forbidden_tones,
        name: metadata.name,
        preferred_tones: metadata.preferred_tones,
    })?;

    Ok(CharacterImportPayload {
        metadata: CharacterCardMetadata {
            description: secured_model.description,
            forbidden_tones: secured_model.forbidden_tones,
            name: secured_model.name,
            preferred_tones: secured_model.preferred_tones,
        },
        avatar_data_uri: secured_model.avatar_data_uri,
    })
}

fn sanitize_character_card_metadata(
    metadata: CharacterCardMetadata,
) -> Result<CharacterCardMetadata, String> {
    let placeholder_png_data_uri = "data:image/png;base64,iVBORw==".to_string();
    let secured = SecurityPipeline::sanitize_and_verify_model(CharacterCardModel {
        avatar_data_uri: placeholder_png_data_uri,
        description: metadata.description,
        forbidden_tones: metadata.forbidden_tones,
        name: metadata.name,
        preferred_tones: metadata.preferred_tones,
    })?;

    Ok(CharacterCardMetadata {
        description: secured.description,
        forbidden_tones: secured.forbidden_tones,
        name: secured.name,
        preferred_tones: secured.preferred_tones,
    })
}

fn avatar_data_uri_from_png_bytes(raw_bytes: &[u8]) -> String {
    format!(
        "data:image/png;base64,{}",
        BASE64_STANDARD.encode(raw_bytes)
    )
}

fn preferred_tones_from_card(card: &CharacterCardV3) -> Vec<String> {
    let mut tones = Vec::new();

    if let Some(macro_extensions) = card.get_macro_extensions() {
        push_tone_if_known(&mut tones, &macro_extensions.relationship);
        for tone in macro_extensions.tones {
            push_tone_if_known(&mut tones, &tone);
        }
        for micro_trope in macro_extensions.micro_tropes {
            push_tone_if_known(&mut tones, &micro_trope);
        }
    }

    for tag in &card.data.tags {
        push_tone_if_known(&mut tones, tag);
    }

    infer_tones_from_text(&mut tones, &card_search_text(card));
    tones
}

fn forbidden_tones_from_card(card: &CharacterCardV3) -> Vec<String> {
    let mut tones = Vec::new();
    let text = card_search_text(card);
    let lowered_text = text.to_lowercase();

    for trope in KNOWN_ROMANCE_TROPES {
        let label = trope.replace('_', " ");
        if lowered_text.contains(&format!("avoid {label}"))
            || lowered_text.contains(&format!("no {label}"))
            || lowered_text.contains(&format!("forbidden tone: {label}"))
            || lowered_text.contains(&format!("forbidden tones: {label}"))
        {
            push_unique(&mut tones, trope);
        }
    }

    tones
}

fn card_search_text(card: &CharacterCardV3) -> String {
    let mut segments = vec![
        card.data.name.as_str(),
        card.data.description.as_str(),
        card.data.personality.as_str(),
        card.data.scenario.as_str(),
        card.data.first_mes.as_str(),
        card.data.mes_example.as_str(),
        card.data.creator_notes.as_str(),
        card.data.system_prompt.as_str(),
        card.data.post_history_instructions.as_str(),
    ];

    segments.extend(card.data.tags.iter().map(String::as_str));
    segments.join("\n")
}

fn infer_tones_from_text(tones: &mut Vec<String>, text: &str) {
    let lowered_text = text.to_lowercase();

    for (tone, markers) in TONE_MARKERS {
        if markers.iter().any(|marker| lowered_text.contains(marker)) {
            push_unique(tones, tone);
        }
    }
}

fn push_tone_if_known(tones: &mut Vec<String>, raw_tone: &str) {
    let normalized = raw_tone.trim().to_lowercase().replace([' ', '-'], "_");

    if KNOWN_ROMANCE_TROPES.contains(&normalized.as_str()) {
        push_unique(tones, &normalized);
    }
}

fn push_unique(values: &mut Vec<String>, value: &str) {
    if !values.iter().any(|existing| existing == value) {
        values.push(value.to_string());
    }
}

const KNOWN_ROMANCE_TROPES: &[&str] = &[
    "protective",
    "flustered",
    "yearning",
    "antagonistic",
    "bantering",
    "recognized",
    "grudging",
    "thawing",
    "trucetaking",
    "performative",
    "slipped_mask",
    "bound",
    "smothered",
    "haunted",
    "familiar",
    "estranged",
    "reclaiming",
    "deferential",
    "commanding",
    "forbidden",
    "secretive",
    "defeating",
    "grumpy",
    "sunshine",
    "casual",
];

const TONE_MARKERS: &[(&str, &[&str])] = &[
    (
        "protective",
        &["protective", "protector", "guardian", "guard", "shield"],
    ),
    (
        "flustered",
        &["flustered", "blush", "stammer", "stutter", "shy"],
    ),
    (
        "yearning",
        &["yearning", "longing", "missed", "waiting", "always been"],
    ),
    (
        "antagonistic",
        &["antagonistic", "rival", "enemies", "hate", "hostile"],
    ),
    (
        "bantering",
        &["banter", "witty", "teasing", "playful", "sparring"],
    ),
    (
        "recognized",
        &["recognized", "soulmate", "fated", "coming home"],
    ),
    ("grumpy", &["grumpy", "brooding", "irritable", "surly"]),
    (
        "sunshine",
        &["sunshine", "cheerful", "optimistic", "bright"],
    ),
    (
        "forbidden",
        &["forbidden", "taboo", "secret romance", "cannot be together"],
    ),
    (
        "commanding",
        &["commanding", "authoritative", "strict", "orders"],
    ),
];

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::character_card::CardDataV3;
    use std::collections::HashMap;

    #[test]
    fn creates_safe_card_file_name() {
        assert_eq!(
            create_safe_card_file_name("Mara Vale: Route/A"),
            "Mara_Vale_Route_A"
        );
        assert_eq!(create_safe_card_file_name("!!!"), "untitled_card");
    }

    #[test]
    fn builds_studio_metadata_from_card_fields_and_tone_markers() {
        let card = CharacterCardV3 {
            spec: "chara_card_v3".to_string(),
            spec_version: "3.0".to_string(),
            data: CardDataV3 {
                name: "Lucas".to_string(),
                description: "A brooding royal guard with a protective streak.".to_string(),
                personality: "He enjoys witty banter but no forbidden tone routes.".to_string(),
                scenario: "Avoid antagonistic pressure when trust is low.".to_string(),
                tags: vec!["sunshine".to_string()],
                first_mes: String::new(),
                mes_example: String::new(),
                creator_notes: String::new(),
                system_prompt: String::new(),
                post_history_instructions: String::new(),
                alternate_greetings: Vec::new(),
                group_only_greetings: Vec::new(),
                creator: String::new(),
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
        };

        let metadata = character_card_metadata_from_card(&card);

        assert_eq!(metadata.name, "Lucas");
        assert_eq!(
            metadata.preferred_tones,
            vec!["sunshine", "protective", "bantering", "grumpy"]
        );
        assert_eq!(metadata.forbidden_tones, vec!["antagonistic", "forbidden"]);
    }

    #[test]
    fn encodes_png_avatar_bytes_as_browser_data_uri() {
        assert_eq!(
            avatar_data_uri_from_png_bytes(&[137, 80, 78, 71]),
            "data:image/png;base64,iVBORw=="
        );
    }

    #[test]
    fn secured_import_payload_strips_html_and_path_markers() {
        let card = CharacterCardV3 {
            spec: "chara_card_v3".to_string(),
            spec_version: "3.0".to_string(),
            data: CardDataV3 {
                name: "../Lu<script>alert(1)</script>/cas".to_string(),
                description: "<b>Royal guard</b><script>alert(1)</script>".to_string(),
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
                creator: String::new(),
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
        };

        let payload = secured_import_payload_from_card_and_bytes(&card, &[137, 80, 78, 71])
            .expect("secured payload should be produced");

        assert!(!payload.metadata.name.contains(".."));
        assert!(!payload.metadata.name.contains('/'));
        assert!(!payload.metadata.name.contains("<script"));
        assert_eq!(payload.metadata.description, "Royal guard");
    }
}
