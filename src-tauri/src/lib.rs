pub mod cache;
mod codecs;
mod commands;
pub mod models;
pub mod synthesis;
pub mod utils;

use crate::cache::card_cache::CacheDatabase;
use crate::utils::assets::{
    decode_asset_uri_path, is_supported_expression_path, mime_type_for_expression_path,
};
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::Manager;

pub struct AppState {
    pub db: Mutex<Option<CacheDatabase>>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AppState {
            db: Mutex::new(None),
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
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

            let database_file_location = app_dir.join("library_cache.db");
            let initialised_db = CacheDatabase::init(database_file_location)
                .map_err(|error| std::io::Error::new(std::io::ErrorKind::Other, error))?;
            let state = app.state::<AppState>();
            *state.db.lock().map_err(|_| {
                std::io::Error::new(
                    std::io::ErrorKind::Other,
                    "Failed lock orchestration structure",
                )
            })? = Some(initialised_db);

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
            commands::cache::export_character_to_charx,
            commands::cache::import_card_from_path,
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
            commands::character_card::save_ccv3_card,
            commands::character_card::save_workspace_changes,
            commands::character_card::transcode_asset_to_png,
            commands::character_card::write_edited_card_to_png,
            utils::assets::attach_expression_sprite,
            utils::assets::remove_expression_sprite,
            utils::assets::scan_character_expressions
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
