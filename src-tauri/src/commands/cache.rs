use crate::codecs::card_path::parse_card_by_path;
use crate::models::character_card::CharacterCardV3;
use crate::models::search::{PaginatedResponse, SearchFilters};
use crate::synthesis::mock_card::generate_random_mock_ccv3;
use crate::utils::charx_exporter::compile_full_charx_bundle;
use crate::AppState;

#[tauri::command]
pub async fn seed_mock_library_cache(
    state: tauri::State<'_, AppState>,
    count: i32,
) -> Result<String, String> {
    seed_mock_library_cache_with_state(&state, count)
}

#[tauri::command]
pub async fn search_library_cache(
    state: tauri::State<'_, AppState>,
    filter: SearchFilters,
) -> Result<PaginatedResponse, String> {
    let db_guard = state
        .db
        .lock()
        .map_err(|_| "Failed capturing lock hook context".to_string())?;
    let db = db_guard
        .as_ref()
        .ok_or_else(|| "Database engine currently sleeping.".to_string())?;

    db.query_library_page(filter)
}

#[tauri::command]
pub async fn import_card_from_path(
    state: tauri::State<'_, AppState>,
    file_path: String,
) -> Result<CharacterCardV3, String> {
    let parsed_card = parse_card_by_path(&file_path)?;
    upsert_imported_card_path(&state, &file_path, &parsed_card)?;

    Ok(parsed_card)
}

#[tauri::command]
pub async fn export_character_to_charx(
    state: tauri::State<'_, AppState>,
    destination_charx_path: String,
    source_card_file_path: String,
    current_workspace_card: CharacterCardV3,
) -> Result<String, String> {
    compile_full_charx_bundle(
        &destination_charx_path,
        &current_workspace_card,
        &source_card_file_path,
    )?;

    upsert_imported_card_path(&state, &destination_charx_path, &current_workspace_card)?;

    Ok(format!(
        "Successfully packaged character configuration alongside alternative expressions to: {destination_charx_path}"
    ))
}

fn seed_mock_library_cache_with_state(
    state: &tauri::State<'_, AppState>,
    count: i32,
) -> Result<String, String> {
    if count < 0 {
        return Err("Mock cache seed count must be zero or greater.".to_string());
    }

    let db_guard = state
        .db
        .lock()
        .map_err(|_| "Failed lock orchestration structure".to_string())?;
    let db = db_guard
        .as_ref()
        .ok_or_else(|| "Local database execution stack uninitialized.".to_string())?;

    seed_mock_library_cache_in_db(db, count)
}

pub fn seed_mock_library_cache_in_db(
    db: &crate::cache::card_cache::CacheDatabase,
    count: i32,
) -> Result<String, String> {
    if count < 0 {
        return Err("Mock cache seed count must be zero or greater.".to_string());
    }

    for index in 0..count {
        let mock_card = generate_random_mock_ccv3();
        let simulated_path = format!("/mock/storage/location/card_{index}.png");
        db.upsert_card(&simulated_path, &mock_card)?;
    }

    Ok(format!(
        "Successfully provisioned and indexed {count} mock CCV3 characters inside cache engine."
    ))
}

fn upsert_imported_card_path(
    state: &tauri::State<'_, AppState>,
    file_path: &str,
    card: &CharacterCardV3,
) -> Result<(), String> {
    let db_guard = state
        .db
        .lock()
        .map_err(|_| "Failed lock orchestration structures".to_string())?;

    if let Some(db) = db_guard.as_ref() {
        db.upsert_card(file_path, card)?;
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::cache::card_cache::CacheDatabase;

    #[test]
    fn seeds_mock_cards_into_cache() {
        let temp_dir = create_temp_dir("seed-cache");
        let db_path = temp_dir.join("library_cache.db");
        let db = CacheDatabase::init(db_path).expect("cache should initialize");

        let message = seed_mock_library_cache_in_db(&db, 3).expect("seed should work");

        assert_eq!(
            message,
            "Successfully provisioned and indexed 3 mock CCV3 characters inside cache engine."
        );
        assert!(db
            .cached_card_for_path("/mock/storage/location/card_0.png")
            .expect("cache lookup should work")
            .is_some());
        assert!(db
            .cached_card_for_path("/mock/storage/location/card_2.png")
            .expect("cache lookup should work")
            .is_some());
    }

    #[test]
    fn rejects_negative_seed_counts() {
        let temp_dir = create_temp_dir("seed-cache-negative");
        let db_path = temp_dir.join("library_cache.db");
        let db = CacheDatabase::init(db_path).expect("cache should initialize");

        let error = seed_mock_library_cache_in_db(&db, -1).expect_err("negative count should fail");

        assert_eq!(error, "Mock cache seed count must be zero or greater.");
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
