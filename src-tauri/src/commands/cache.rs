use crate::codecs::card_path::{normalize_card_to_v3, parse_card_by_path};
use crate::codecs::charx_card::create_charx_bundle;
use crate::models::character_card::CharacterCardV3;
use crate::models::search::{PaginatedResponse, SearchFilters};
use crate::synthesis::mock_card::generate_random_mock_ccv3;
use crate::utils::charx_exporter::compile_full_charx_bundle;
use crate::AppState;
use serde::Serialize;
use serde_json::Value;
use std::ffi::OsStr;
use std::path::{Path, PathBuf};
use tauri::Manager;

#[derive(Serialize, Debug, Clone, PartialEq)]
pub struct FolderIntakeItem {
    pub file_path: String,
    pub file_name: String,
    pub status: String,
    pub format: String,
    pub card_name: Option<String>,
    pub spec: Option<String>,
    pub tags: Vec<String>,
    pub importable: bool,
    pub reason: Option<String>,
}

#[derive(Serialize, Debug, Clone, PartialEq)]
pub struct FolderIntakeScanResult {
    pub folder_path: String,
    pub items: Vec<FolderIntakeItem>,
    pub total_count: usize,
    pub importable_count: usize,
}

#[derive(Serialize, Debug, Clone, PartialEq)]
pub struct FolderIntakeImportResult {
    pub imported_count: usize,
    pub skipped_count: usize,
    pub output_paths: Vec<String>,
    pub errors: Vec<String>,
}

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
pub async fn scan_character_card_folder(
    folder_path: String,
) -> Result<FolderIntakeScanResult, String> {
    scan_character_card_folder_path(folder_path)
}

#[tauri::command]
pub async fn import_folder_cards_as_charx(
    app_handle: tauri::AppHandle,
    state: tauri::State<'_, AppState>,
    file_paths: Vec<String>,
) -> Result<FolderIntakeImportResult, String> {
    import_folder_cards_as_charx_with_state(app_handle, &state, file_paths)
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

fn scan_character_card_folder_path(folder_path: String) -> Result<FolderIntakeScanResult, String> {
    let folder = PathBuf::from(&folder_path);
    if !folder.is_dir() {
        return Err(format!(
            "Choose a folder that exists on disk: {folder_path}"
        ));
    }

    let mut items = Vec::new();
    for file_path in collect_folder_files(&folder)? {
        items.push(classify_intake_path(&file_path));
    }

    items.sort_by(|left, right| {
        left.file_name
            .to_lowercase()
            .cmp(&right.file_name.to_lowercase())
    });
    let importable_count = items.iter().filter(|item| item.importable).count();

    Ok(FolderIntakeScanResult {
        folder_path,
        total_count: items.len(),
        importable_count,
        items,
    })
}

fn import_folder_cards_as_charx_with_state(
    app_handle: tauri::AppHandle,
    state: &tauri::State<'_, AppState>,
    file_paths: Vec<String>,
) -> Result<FolderIntakeImportResult, String> {
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|_| "Failed to resolve application data directory path".to_string())?;
    let cards_dir = app_dir.join("character-cards");
    std::fs::create_dir_all(&cards_dir)
        .map_err(|error| format!("Failed creating CHARX library directory: {error}"))?;

    let mut output_paths = Vec::new();
    let mut errors = Vec::new();
    let mut skipped_count = 0;

    for file_path in file_paths {
        let source_path = PathBuf::from(&file_path);
        match parse_card_by_path(&source_path) {
            Ok(card) => {
                let card = normalize_card_to_v3(card);
                match import_one_card_as_charx(&cards_dir, &source_path, &card) {
                    Ok(output_path) => {
                        let output_path_string = output_path.to_string_lossy().into_owned();
                        if let Err(error) =
                            upsert_imported_card_path(state, &output_path_string, &card)
                        {
                            errors.push(format!("{}: {error}", source_path.display()));
                        } else {
                            output_paths.push(output_path_string);
                        }
                    }
                    Err(error) => errors.push(format!("{}: {error}", source_path.display())),
                }
            }
            Err(error) => {
                skipped_count += 1;
                errors.push(format!("{}: {error}", source_path.display()));
            }
        }
    }

    Ok(FolderIntakeImportResult {
        imported_count: output_paths.len(),
        skipped_count,
        output_paths,
        errors,
    })
}

fn import_one_card_as_charx(
    cards_dir: &Path,
    source_path: &Path,
    card: &CharacterCardV3,
) -> Result<PathBuf, String> {
    let destination_path = unique_destination_path(cards_dir, &card.data.name, "charx");

    if extension_is(source_path, "charx") {
        std::fs::copy(source_path, &destination_path)
            .map_err(|error| format!("Failed copying CHARX master package: {error}"))?;
        return Ok(destination_path);
    }

    let avatar_path = if is_supported_png_card(source_path) {
        Some(source_path)
    } else {
        None
    };

    create_charx_bundle(&destination_path, card, avatar_path, None::<&Path>)?;
    Ok(destination_path)
}

fn classify_intake_path(path: &Path) -> FolderIntakeItem {
    let file_name = path
        .file_name()
        .and_then(OsStr::to_str)
        .unwrap_or("unknown")
        .to_string();
    let extension = path
        .extension()
        .and_then(OsStr::to_str)
        .map(str::to_ascii_lowercase)
        .unwrap_or_default();

    if !is_reviewable_extension(&extension) {
        return FolderIntakeItem {
            file_path: path.to_string_lossy().into_owned(),
            file_name,
            status: if is_image_extension(&extension) {
                "empty_image".to_string()
            } else {
                "skipped".to_string()
            },
            format: extension,
            card_name: None,
            spec: None,
            tags: Vec::new(),
            importable: false,
            reason: Some("Not a supported character card import format.".to_string()),
        };
    }

    let raw_spec = raw_json_spec(path).ok().flatten();
    match parse_card_by_path(path) {
        Ok(card) => {
            let source_spec = raw_spec.unwrap_or_else(|| card.spec.clone());
            let format = match extension.as_str() {
                "png" | "apng" => {
                    if source_spec == "chara_card_v2" {
                        "v2_png"
                    } else {
                        "ccv3_png"
                    }
                }
                "json" => {
                    if source_spec == "chara_card_v2" {
                        "v2_json"
                    } else {
                        "ccv3_json"
                    }
                }
                "charx" => "charx",
                _ => "card",
            };
            let status = if source_spec == "chara_card_v2" {
                "ready_convert"
            } else {
                "ready"
            };

            FolderIntakeItem {
                file_path: path.to_string_lossy().into_owned(),
                file_name,
                status: status.to_string(),
                format: format.to_string(),
                card_name: Some(card.data.name),
                spec: Some(source_spec),
                tags: card.data.tags,
                importable: true,
                reason: None,
            }
        }
        Err(error) => FolderIntakeItem {
            file_path: path.to_string_lossy().into_owned(),
            file_name,
            status: if is_image_extension(&extension)
                && error.contains("No character card metadata")
            {
                "empty_image".to_string()
            } else if extension == "json" && looks_like_lorebook(path) {
                "lorebook".to_string()
            } else {
                "broken".to_string()
            },
            format: extension,
            card_name: None,
            spec: raw_spec,
            tags: Vec::new(),
            importable: false,
            reason: Some(error),
        },
    }
}

fn collect_folder_files(folder: &Path) -> Result<Vec<PathBuf>, String> {
    let mut pending = vec![folder.to_path_buf()];
    let mut files = Vec::new();

    while let Some(current) = pending.pop() {
        let entries = std::fs::read_dir(&current)
            .map_err(|error| format!("Failed reading folder {}: {error}", current.display()))?;
        for entry in entries {
            let entry = entry.map_err(|error| format!("Failed reading folder entry: {error}"))?;
            let path = entry.path();
            if path.is_dir() {
                pending.push(path);
            } else if path.is_file() && !is_hidden_file(&path) {
                files.push(path);
            }
        }
    }

    Ok(files)
}

fn raw_json_spec(path: &Path) -> Result<Option<String>, String> {
    if !extension_is(path, "json") {
        return Ok(None);
    }

    let buffer = std::fs::read_to_string(path)
        .map_err(|error| format!("Failed reading JSON preflight: {error}"))?;
    let parsed: Value = serde_json::from_str(&buffer)
        .map_err(|error| format!("Failed parsing JSON preflight: {error}"))?;

    Ok(parsed
        .get("spec")
        .and_then(Value::as_str)
        .map(str::to_string))
}

fn looks_like_lorebook(path: &Path) -> bool {
    let Ok(buffer) = std::fs::read_to_string(path) else {
        return false;
    };
    let Ok(parsed) = serde_json::from_str::<Value>(&buffer) else {
        return false;
    };

    parsed.get("entries").is_some()
        || parsed.get("world_info").is_some()
        || parsed.get("lorebook").is_some()
        || parsed
            .get("data")
            .and_then(|data| data.get("entries"))
            .is_some()
}

fn unique_destination_path(cards_dir: &Path, card_name: &str, extension: &str) -> PathBuf {
    let safe_name = create_safe_card_file_name(card_name);
    let mut candidate = cards_dir.join(format!("{safe_name}.{extension}"));
    let mut counter = 2;

    while candidate.exists() {
        candidate = cards_dir.join(format!("{safe_name}_{counter}.{extension}"));
        counter += 1;
    }

    candidate
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

fn extension_is(path: &Path, expected: &str) -> bool {
    path.extension()
        .and_then(OsStr::to_str)
        .map(|extension| extension.eq_ignore_ascii_case(expected))
        .unwrap_or(false)
}

fn is_supported_png_card(path: &Path) -> bool {
    extension_is(path, "png") || extension_is(path, "apng")
}

fn is_reviewable_extension(extension: &str) -> bool {
    matches!(extension, "png" | "apng" | "json" | "charx")
}

fn is_image_extension(extension: &str) -> bool {
    matches!(extension, "png" | "apng" | "jpg" | "jpeg" | "webp")
}

fn is_hidden_file(path: &Path) -> bool {
    path.file_name()
        .and_then(OsStr::to_str)
        .map(|name| name.starts_with('.'))
        .unwrap_or(false)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::cache::card_cache::CacheDatabase;
    use crate::models::character_card::CardDataV3;
    use std::collections::HashMap;

    #[test]
    fn scans_mixed_intake_folder_into_review_states() {
        let temp_dir = create_temp_dir("folder-intake-scan");
        let ready_json = temp_dir.join("ready.json");
        let legacy_json = temp_dir.join("legacy.json");
        let lorebook_json = temp_dir.join("lorebook.json");
        let image_only = temp_dir.join("cover.jpg");
        let nested_dir = temp_dir.join("nested");
        std::fs::create_dir_all(&nested_dir).expect("nested dir should write");
        let broken_json = nested_dir.join("broken.json");

        std::fs::write(
            &ready_json,
            serde_json::to_string_pretty(&fixture_card("Ready Card"))
                .expect("ready fixture should serialize"),
        )
        .expect("ready fixture should write");
        std::fs::write(
            &legacy_json,
            r#"{"spec":"chara_card_v2","spec_version":"2.0","data":{"name":"Legacy Card","tags":["legacy"]}}"#,
        )
        .expect("legacy fixture should write");
        std::fs::write(
            &lorebook_json,
            r#"{"entries":[{"keys":["city"],"content":"Lore"}]}"#,
        )
        .expect("lorebook fixture should write");
        std::fs::write(&image_only, b"not a card").expect("image fixture should write");
        std::fs::write(&broken_json, "{").expect("broken fixture should write");

        let scan = scan_character_card_folder_path(temp_dir.to_string_lossy().into_owned())
            .expect("folder scan should work");

        assert_eq!(scan.total_count, 5);
        assert_eq!(scan.importable_count, 2);
        assert_scan_item(&scan, "ready.json", "ready", "ccv3_json", true);
        assert_scan_item(&scan, "legacy.json", "ready_convert", "v2_json", true);
        assert_scan_item(&scan, "lorebook.json", "lorebook", "json", false);
        assert_scan_item(&scan, "cover.jpg", "empty_image", "jpg", false);
        assert_scan_item(&scan, "broken.json", "broken", "json", false);
    }

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

    fn assert_scan_item(
        scan: &FolderIntakeScanResult,
        file_name: &str,
        status: &str,
        format: &str,
        importable: bool,
    ) {
        let item = scan
            .items
            .iter()
            .find(|item| item.file_name == file_name)
            .unwrap_or_else(|| panic!("{file_name} should be present in scan results"));

        assert_eq!(item.status, status);
        assert_eq!(item.format, format);
        assert_eq!(item.importable, importable);
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

    fn create_temp_dir(name: &str) -> std::path::PathBuf {
        let path = std::env::temp_dir().join(format!("amourai-{name}-{}", std::process::id()));
        if path.exists() {
            std::fs::remove_dir_all(&path).expect("old temp dir should be removable");
        }
        std::fs::create_dir_all(&path).expect("temp dir should be created");
        path
    }
}
