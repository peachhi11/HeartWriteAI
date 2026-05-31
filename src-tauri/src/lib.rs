pub mod cache;
pub mod chat_tree;
pub mod cloud_sync;
mod codecs;
mod commands;
pub mod dialogue;
pub mod inference_manager;
pub mod llm_bridge;
pub mod lore_injector;
pub mod lore_manager;
pub mod models;
pub mod regex_engine;
pub mod screenshot;
pub mod security;
pub mod state_manager;
pub mod studio;
pub mod synthesis;
pub mod theme_manager;
pub mod token_counter;
pub mod updater;
pub mod utils;
pub mod wallpaper;
pub mod wallpaper_compiler;

use crate::cache::card_cache::CacheDatabase;
use crate::inference_manager::AppInferenceSettingsState;
use crate::state_manager::PersistentEngineStore;
use crate::theme_manager::AppSettingsState;
use crate::utils::assets::{
    decode_asset_uri_path, is_supported_expression_path, mime_type_for_expression_path,
};
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::Manager;

pub struct AppState {
    pub db: Mutex<Option<CacheDatabase>>,
}

#[derive(Default, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct ActiveSessionProfile {
    pub dynamic_archetype: String,
    pub player_name: String,
    pub primary_bias: String,
    pub resonance_score: u32,
}

pub struct ActiveSessionStore {
    pub profile: Mutex<ActiveSessionProfile>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AppState {
            db: Mutex::new(None),
        })
        .manage(ActiveSessionStore {
            profile: Mutex::new(ActiveSessionProfile::default()),
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .register_asynchronous_uri_scheme_protocol("ccv3-asset", |_ctx, request, responder| {
            let native_file_path = decode_asset_uri_path(request.uri().path());
            std::thread::spawn(move || {
                let path = PathBuf::from(native_file_path);
                let response = if path.is_file() && is_supported_expression_path(&path) {
                    match std::fs::read(&path) {
                        Ok(image_bytes) => tauri::http::Response::builder()
                            .header("Content-Type", mime_type_for_expression_path(&path))
                            .body(image_bytes)
                            .unwrap_or_else(|_| tauri::http::Response::new(Vec::new())),
                        Err(_) => tauri::http::Response::builder()
                            .status(404)
                            .body(Vec::new())
                            .unwrap_or_else(|_| tauri::http::Response::new(Vec::new())),
                    }
                } else {
                    tauri::http::Response::builder()
                        .status(403)
                        .body(Vec::new())
                        .unwrap_or_else(|_| tauri::http::Response::new(Vec::new()))
                };

                responder.respond(response);
            });
        })
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            let app_dir = app.path().app_data_dir()?;
            std::fs::create_dir_all(&app_dir)?;
            app.manage(PersistentEngineStore::load_profile_on_boot(app.handle()));
            app.manage(AppSettingsState::load_on_boot(app.handle()));
            app.manage(AppInferenceSettingsState::load_on_boot(app.handle()));

            let database_file_location = app_dir.join("library_cache.db");
            let initialised_db =
                CacheDatabase::init(database_file_location).map_err(std::io::Error::other)?;
            let state = app.state::<AppState>();
            *state
                .db
                .lock()
                .map_err(|_| std::io::Error::other("Failed lock orchestration structure"))? =
                Some(initialised_db);

            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::app::greet,
            commands::app::get_app_version,
            commands::app::initialize_profile_with_resonance,
            commands::cache::export_character_to_charx,
            commands::cache::import_folder_cards_as_charx,
            commands::cache::import_card_from_path,
            commands::cache::scan_character_card_folder,
            commands::cache::search_library_cache,
            commands::cache::seed_mock_library_cache,
            commands::character_card::convert_asset_to_standard_png,
            commands::character_card::extract_card_macro_extensions,
            commands::character_card::export_ccv3_card_to_charx,
            commands::character_card::export_charx_card,
            commands::character_card::import_charx_card,
            commands::character_card::import_ccv3_card_from_png,
            commands::character_card::import_png_card,
            commands::character_card::inject_ccv3_card_into_png,
            commands::character_card::pick_and_parse_character_card,
            commands::character_card::pick_and_parse_character_card_with_avatar,
            commands::character_card::save_ccv3_card,
            commands::character_card::save_workspace_changes,
            commands::character_card::transcode_asset_to_png,
            commands::character_card::write_edited_card_to_png,
            commands::chat_export::export_chat_log_to_file,
            chat_tree::list_chat_trees_native,
            chat_tree::load_chat_tree_native,
            chat_tree::save_chat_tree_native,
            commands::trope_runtime::append_message_to_history,
            commands::trope_runtime::boot_gameplay_loop_instance,
            commands::trope_runtime::clear_game_slot,
            commands::trope_runtime::clone_game_slot,
            commands::trope_runtime::commit_character_card_to_active_slot,
            commands::trope_runtime::get_save_slots_manifest,
            commands::trope_runtime::load_game_slot,
            commands::trope_runtime::replace_dialogue_history,
            commands::trope_runtime::sync_trope_interaction,
            cloud_sync::push_save_to_cloud_repository,
            dialogue::fetch_contextual_npc_dialogue,
            inference_manager::export_user_inference_settings,
            inference_manager::get_boot_inference_settings,
            llm_bridge::stream_local_llm_response,
            lore_injector::execute_lore_context_scan,
            lore_manager::import_and_compile_lorebook,
            lore_manager::remove_lorebook_file,
            lore_manager::toggle_lorebook_active_state,
            regex_engine::apply_regex_native,
            regex_engine::execute_regex_native,
            security::export_encrypted_character_card,
            security::import_encrypted_character_card,
            screenshot::capture_viewport_screenshot,
            security::parse_secured_character_card,
            studio::delete_saved_persona_file,
            studio::fetch_saved_personas_list,
            theme_manager::export_user_theme_preferences,
            theme_manager::get_boot_theme_settings,
            token_counter::count_tokens,
            token_counter::count_tokens_native,
            updater::execute_app_update_check,
            utils::assets::attach_expression_sprite,
            utils::assets::remove_expression_sprite,
            utils::assets::scan_character_expressions,
            wallpaper::compile_and_register_wallpaper,
            wallpaper::pick_custom_wallpaper_asset
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
