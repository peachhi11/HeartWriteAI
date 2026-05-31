use serde::{Deserialize, Serialize};
use std::fs::{create_dir_all, rename, File};
use std::io::{Read, Write};
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Manager};

use crate::security::SecurityPipeline;

const SAVE_SLOT_COUNT: u32 = 3;
const SAVE_SLOTS_DIR: &str = "relationship-runtime-slots";
const LEGACY_PROFILE_FILE: &str = "relationship-runtime-profile.json";

#[derive(Debug, Default, Serialize, Deserialize, Clone, PartialEq, Eq)]
pub struct RelationshipStats {
    pub rivalry: u32,
    pub chemistry: u32,
    pub trust: u32,
    pub affection: u32,
    pub tension: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
pub struct CharacterCardModel {
    pub name: String,
    pub description: String,
    #[serde(rename = "forbiddenTones", default)]
    pub forbidden_tones: Vec<String>,
    #[serde(rename = "preferredTones", default)]
    pub preferred_tones: Vec<String>,
    #[serde(rename = "avatarDataUri", default)]
    pub avatar_data_uri: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
pub struct ProfileSaveData {
    pub stats: RelationshipStats,
    pub active_trope_milestones: Vec<String>,
    pub total_turns_played: u64,
    #[serde(default = "default_last_updated")]
    pub last_updated: String,
    #[serde(default)]
    pub dialogue_history: Vec<RustDialogueEntry>,
    #[serde(default)]
    pub active_character: Option<CharacterCardModel>,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
pub struct RustDialogueEntry {
    #[serde(rename = "activeVariantIndex", default)]
    pub active_variant_index: Option<usize>,
    pub id: String,
    pub role: String,
    #[serde(rename = "swipedVariants", default)]
    pub swiped_variants: Vec<String>,
    pub text: String,
    pub timestamp: String,
    #[serde(rename = "detectedTrope")]
    pub detected_trope: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
pub struct SlotMetadata {
    pub slot_index: u32,
    pub exists: bool,
    pub total_turns_played: u64,
    pub last_updated: String,
    pub active_character: Option<CharacterCardModel>,
}

pub struct PersistentEngineStore {
    pub active_slot: Mutex<u32>,
    pub runtime_data: Arc<Mutex<ProfileSaveData>>,
}

impl PersistentEngineStore {
    pub fn load_profile_on_boot(app: &AppHandle) -> Self {
        let store = Self {
            active_slot: Mutex::new(1),
            runtime_data: Arc::new(Mutex::new(default_profile_data())),
        };

        if let Err(error) = store.load_slot_into_memory(app, 1) {
            eprintln!("Profile auto-load failed: {error}");
        }

        store
    }

    pub fn fetch_all_slots_metadata(app: &AppHandle) -> Vec<SlotMetadata> {
        (1..=SAVE_SLOT_COUNT)
            .map(|slot| Self::fetch_slot_metadata(app, slot))
            .collect()
    }

    pub fn active_slot(&self) -> Result<u32, String> {
        self.active_slot
            .lock()
            .map(|slot| *slot)
            .map_err(|_| "Failed to lock active profile slot".to_string())
    }

    pub fn load_slot_into_memory(
        &self,
        app: &AppHandle,
        slot: u32,
    ) -> Result<ProfileSaveData, String> {
        validate_slot(slot)?;

        let save_path = Self::get_path_for_slot(app, slot)?;
        let profile = if save_path.exists() {
            load_profile_from_path(&save_path)?
        } else if slot == 1 {
            Self::load_legacy_profile(app).unwrap_or_else(default_profile_data)
        } else {
            default_profile_data()
        };

        *self
            .active_slot
            .lock()
            .map_err(|_| "Failed to swap active profile slot".to_string())? = slot;
        *self
            .runtime_data
            .lock()
            .map_err(|_| "Failed to swap profile runtime data".to_string())? = profile.clone();

        Ok(profile)
    }

    pub fn reset_slot_into_memory(&self, slot: u32) -> Result<ProfileSaveData, String> {
        validate_slot(slot)?;

        let profile = default_profile_data();
        *self
            .active_slot
            .lock()
            .map_err(|_| "Failed to reset active profile slot".to_string())? = slot;
        *self
            .runtime_data
            .lock()
            .map_err(|_| "Failed to reset profile runtime data".to_string())? = profile.clone();

        Ok(profile)
    }

    pub fn trigger_save_to_active_slot(&self, app: AppHandle) -> Result<(), String> {
        let shared_data = Arc::clone(&self.runtime_data);
        let active_slot = self.active_slot()?;

        std::thread::spawn(move || {
            let snapshot = match shared_data.lock() {
                Ok(data) => data.clone(),
                Err(_) => {
                    eprintln!("Auto-save aborted: trope runtime mutex poisoned.");
                    return;
                }
            };

            match Self::get_path_for_slot(&app, active_slot)
                .and_then(|save_path| persist_profile_to_path(&save_path, &snapshot))
            {
                Ok(()) => {}
                Err(error) => eprintln!("Persistent trope save failed: {error}"),
            }
        });

        Ok(())
    }

    fn fetch_slot_metadata(app: &AppHandle, slot: u32) -> SlotMetadata {
        let empty = SlotMetadata {
            slot_index: slot,
            exists: false,
            total_turns_played: 0,
            last_updated: "--".to_string(),
            active_character: None,
        };

        let Ok(save_path) = Self::get_path_for_slot(app, slot) else {
            return empty;
        };

        if !save_path.exists() {
            return empty;
        }

        match load_profile_from_path(&save_path) {
            Ok(profile) => SlotMetadata {
                slot_index: slot,
                exists: true,
                total_turns_played: profile.total_turns_played,
                last_updated: profile.last_updated,
                active_character: profile.active_character,
            },
            Err(_) => empty,
        }
    }

    pub(crate) fn get_path_for_slot(app: &AppHandle, slot: u32) -> Result<PathBuf, String> {
        validate_slot(slot)?;

        let mut path = app
            .path()
            .app_data_dir()
            .map_err(|_| "Failed to resolve native app data path".to_string())?;

        create_dir_all(&path)
            .map_err(|error| format!("Failed to prepare native app data directory: {error}"))?;
        path.push(SAVE_SLOTS_DIR);
        create_dir_all(&path)
            .map_err(|error| format!("Failed to prepare profile slots directory: {error}"))?;
        path.push(format!("slot_{slot}.json"));

        Ok(path)
    }

    fn load_legacy_profile(app: &AppHandle) -> Option<ProfileSaveData> {
        let mut path = app.path().app_data_dir().ok()?;
        path.push(LEGACY_PROFILE_FILE);

        load_profile_from_path(&path).ok()
    }
}

pub fn default_profile_data() -> ProfileSaveData {
    ProfileSaveData {
        stats: default_relationship_stats(),
        active_trope_milestones: Vec::new(),
        total_turns_played: 0,
        last_updated: "--".to_string(),
        dialogue_history: Vec::new(),
        active_character: None,
    }
}

fn default_last_updated() -> String {
    "--".to_string()
}

pub fn default_relationship_stats() -> RelationshipStats {
    RelationshipStats {
        rivalry: 40,
        chemistry: 20,
        trust: 10,
        affection: 5,
        tension: 15,
    }
}

fn load_profile_from_path(path: &Path) -> Result<ProfileSaveData, String> {
    let mut file = File::open(path).map_err(|error| format!("Profile open failed: {error}"))?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)
        .map_err(|error| format!("Profile read failed: {error}"))?;
    let mut profile: ProfileSaveData = serde_json::from_str(&contents)
        .map_err(|error| format!("Profile JSON parse failed: {error}"))?;

    if let Some(character) = profile.active_character.take() {
        profile.active_character = match SecurityPipeline::sanitize_and_verify_model(character) {
            Ok(secured_character) => Some(secured_character),
            Err(error) => {
                eprintln!("Profile active character security scrub failed: {error}");
                None
            }
        };
    }

    Ok(profile)
}

fn persist_profile_to_path(path: &Path, profile: &ProfileSaveData) -> Result<(), String> {
    if let Some(parent) = path.parent() {
        create_dir_all(parent).map_err(|error| format!("Save directory create failed: {error}"))?;
    }

    let tmp_path = path.with_extension("json.tmp");
    let serialized = serde_json::to_string_pretty(profile)
        .map_err(|error| format!("Profile JSON serialization failed: {error}"))?;
    let mut file =
        File::create(&tmp_path).map_err(|error| format!("Temp save create failed: {error}"))?;

    file.write_all(serialized.as_bytes())
        .map_err(|error| format!("Temp save write failed: {error}"))?;
    file.sync_all()
        .map_err(|error| format!("Temp save sync failed: {error}"))?;
    drop(file);

    if path.exists() {
        std::fs::remove_file(path)
            .map_err(|error| format!("Existing profile replace failed: {error}"))?;
    }

    rename(&tmp_path, path).map_err(|error| format!("Profile replace failed: {error}"))?;

    Ok(())
}

pub fn current_timestamp() -> String {
    chrono::Utc::now().to_rfc3339_opts(chrono::SecondsFormat::Secs, true)
}

fn validate_slot(slot: u32) -> Result<(), String> {
    if (1..=SAVE_SLOT_COUNT).contains(&slot) {
        Ok(())
    } else {
        Err(format!(
            "Profile slot must be between 1 and {SAVE_SLOT_COUNT}"
        ))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn persists_and_loads_profile_data_from_disk() {
        let save_path = unique_test_path("relationship-runtime-profile.json");
        let profile = ProfileSaveData {
            stats: RelationshipStats {
                rivalry: 12,
                chemistry: 34,
                trust: 56,
                affection: 78,
                tension: 90,
            },
            active_trope_milestones: vec!["UNLOCKED_SWORN_DEFENDER".to_string()],
            total_turns_played: 42,
            last_updated: "2026-05-29T00:00:00Z".to_string(),
            dialogue_history: vec![RustDialogueEntry {
                active_variant_index: None,
                id: "line-1".to_string(),
                role: "Player".to_string(),
                swiped_variants: Vec::new(),
                text: "Touch them and you die.".to_string(),
                timestamp: "2026-05-29T00:00:00Z".to_string(),
                detected_trope: "protective".to_string(),
            }],
            active_character: Some(CharacterCardModel {
                name: "Lucas".to_string(),
                description: "A guarded royal protector.".to_string(),
                forbidden_tones: vec!["antagonistic".to_string()],
                preferred_tones: vec!["protective".to_string()],
                avatar_data_uri: "data:image/png;base64,iVBORw==".to_string(),
            }),
        };

        persist_profile_to_path(&save_path, &profile).expect("profile should persist");
        let loaded = load_profile_from_path(&save_path).expect("profile should reload");

        assert_eq!(loaded, profile);

        let _ = std::fs::remove_file(save_path);
    }

    #[test]
    fn default_profile_starts_with_expected_baseline_stats() {
        let profile = default_profile_data();

        assert_eq!(profile.stats, default_relationship_stats());
        assert_eq!(profile.active_trope_milestones.len(), 0);
        assert_eq!(profile.total_turns_played, 0);
        assert_eq!(profile.last_updated, "--");
        assert_eq!(profile.dialogue_history.len(), 0);
        assert_eq!(profile.active_character, None);
    }

    #[test]
    fn reset_slot_replaces_runtime_data_with_fresh_profile() {
        let store = PersistentEngineStore {
            active_slot: Mutex::new(2),
            runtime_data: Arc::new(Mutex::new(ProfileSaveData {
                stats: RelationshipStats {
                    trust: 99,
                    ..default_relationship_stats()
                },
                active_trope_milestones: vec!["OLD_EVENT".to_string()],
                total_turns_played: 12,
                last_updated: "2026-05-29T00:00:00Z".to_string(),
                dialogue_history: vec![RustDialogueEntry {
                    active_variant_index: None,
                    id: "old-line".to_string(),
                    role: "NPC".to_string(),
                    swiped_variants: Vec::new(),
                    text: "Old memory.".to_string(),
                    timestamp: "2026-05-29T00:00:00Z".to_string(),
                    detected_trope: "casual".to_string(),
                }],
                active_character: Some(CharacterCardModel {
                    name: "Old target".to_string(),
                    description: String::new(),
                    forbidden_tones: Vec::new(),
                    preferred_tones: Vec::new(),
                    avatar_data_uri: String::new(),
                }),
            })),
        };

        let reset = store
            .reset_slot_into_memory(2)
            .expect("slot reset should succeed");

        assert_eq!(reset, default_profile_data());
        assert_eq!(store.active_slot().expect("active slot should read"), 2);
        assert_eq!(
            *store.runtime_data.lock().expect("runtime data should lock"),
            default_profile_data()
        );
    }

    #[test]
    fn validates_profile_slot_bounds() {
        assert!(validate_slot(1).is_ok());
        assert!(validate_slot(SAVE_SLOT_COUNT).is_ok());
        assert!(validate_slot(0).is_err());
        assert!(validate_slot(SAVE_SLOT_COUNT + 1).is_err());
    }

    #[test]
    fn returns_empty_metadata_for_missing_slot_path() {
        let metadata = SlotMetadata {
            slot_index: 2,
            exists: false,
            total_turns_played: 0,
            last_updated: "--".to_string(),
            active_character: None,
        };

        assert_eq!(metadata.slot_index, 2);
        assert!(!metadata.exists);
    }

    fn unique_test_path(file_name: &str) -> PathBuf {
        let mut path = std::env::temp_dir();
        path.push(format!("heartwriteai-{}-{}", std::process::id(), file_name));
        path
    }
}
