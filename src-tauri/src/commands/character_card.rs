use crate::codecs::charx_card::{create_charx_bundle, extract_ccv3_from_charx};
use crate::codecs::image_asset::convert_to_standard_png;
use crate::codecs::png_card::{extract_ccv3_from_png, inject_ccv3_into_png};
use crate::models::character_card::{AppMacroExtensions, CharacterCardV3};
use crate::utils::universal_saver::save_changes_to_source_path;
use crate::AppState;
use tauri::Manager;

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
    let file_path = cards_dir.join(format!("{safe_filename}.json"));
    let json_string = serde_json::to_string_pretty(&card)
        .map_err(|error| format!("Failed to compile CCV3 card JSON: {error}"))?;

    std::fs::write(&file_path, json_string)
        .map_err(|error| format!("Disk IO write failure: {error}"))?;

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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn creates_safe_card_file_name() {
        assert_eq!(
            create_safe_card_file_name("Mara Vale: Route/A"),
            "Mara_Vale_Route_A"
        );
        assert_eq!(create_safe_card_file_name("!!!"), "untitled_card");
    }
}
