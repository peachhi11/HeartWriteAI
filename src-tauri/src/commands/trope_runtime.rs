use serde::{Deserialize, Serialize};
use std::fs::{copy, remove_file};
use tauri::{AppHandle, State};

use crate::security::SecurityPipeline;
use crate::state_manager::{
    current_timestamp, CharacterCardModel, PersistentEngineStore, ProfileSaveData,
    RelationshipStats, RustDialogueEntry, SlotMetadata,
};

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum RomanceTropeClass {
    Protective,
    Flustered,
    Yearning,
    Antagonistic,
    Bantering,
    Recognized,
    Grudging,
    Thawing,
    Trucetaking,
    Performative,
    SlippedMask,
    Bound,
    Smothered,
    Haunted,
    Familiar,
    Estranged,
    Reclaiming,
    Deferential,
    Commanding,
    Forbidden,
    Secretive,
    Defeating,
    Grumpy,
    Sunshine,
    Casual,
}

#[derive(Debug, Serialize)]
pub struct InteractionPayload {
    pub active_slot: u32,
    pub active_character: Option<CharacterCardModel>,
    pub current_stats: RelationshipStats,
    pub active_trope_milestones: Vec<String>,
    pub active_vignette: String,
    pub dialogue_history: Vec<RustDialogueEntry>,
    pub total_turns_played: u64,
    pub triggered_event_flag: Option<String>,
}

#[tauri::command]
pub fn sync_trope_interaction(
    detected_trope: RomanceTropeClass,
    app_handle: AppHandle,
    state: State<'_, PersistentEngineStore>,
) -> Result<InteractionPayload, String> {
    let mut profile = state
        .runtime_data
        .lock()
        .map_err(|_| "Failed to lock trope runtime state".to_string())?;

    profile.total_turns_played = profile.total_turns_played.saturating_add(1);
    profile.last_updated = current_timestamp();
    let (active_vignette, triggered_event_flag) =
        apply_trope_interaction(&mut profile, detected_trope);
    let current_stats = profile.stats.clone();
    let active_trope_milestones = profile.active_trope_milestones.clone();
    let dialogue_history = profile.dialogue_history.clone();
    let total_turns_played = profile.total_turns_played;
    let active_character = profile.active_character.clone();
    let active_slot = state.active_slot()?;
    drop(profile);

    state.trigger_save_to_active_slot(app_handle)?;

    Ok(InteractionPayload {
        active_slot,
        active_character,
        current_stats,
        active_trope_milestones,
        active_vignette,
        dialogue_history,
        total_turns_played,
        triggered_event_flag,
    })
}

#[tauri::command]
pub fn get_save_slots_manifest(app_handle: AppHandle) -> Vec<SlotMetadata> {
    PersistentEngineStore::fetch_all_slots_metadata(&app_handle)
}

#[tauri::command]
pub fn load_game_slot(
    slot: u32,
    app_handle: AppHandle,
    state: State<'_, PersistentEngineStore>,
) -> Result<InteractionPayload, String> {
    let profile = state.load_slot_into_memory(&app_handle, slot)?;

    Ok(InteractionPayload {
        active_slot: slot,
        active_character: profile.active_character,
        current_stats: profile.stats,
        active_trope_milestones: profile.active_trope_milestones,
        active_vignette: "from-transparent".to_string(),
        dialogue_history: profile.dialogue_history,
        total_turns_played: profile.total_turns_played,
        triggered_event_flag: None,
    })
}

#[tauri::command]
pub fn commit_character_card_to_active_slot(
    card_data: CharacterCardModel,
    app_handle: AppHandle,
    state: State<'_, PersistentEngineStore>,
) -> Result<InteractionPayload, String> {
    let secured_card_data = SecurityPipeline::sanitize_and_verify_model(card_data)?;
    let mut profile = state
        .runtime_data
        .lock()
        .map_err(|_| "Failed to lock active profile character state".to_string())?;

    profile.last_updated = current_timestamp();
    profile.active_character = Some(secured_card_data);
    profile.stats.trust = 10;
    profile.stats.affection = 0;
    profile.stats.rivalry = 30;

    let payload = build_payload_from_profile(state.active_slot()?, &profile);
    drop(profile);

    state.trigger_save_to_active_slot(app_handle)?;

    Ok(payload)
}

#[tauri::command]
pub fn boot_gameplay_loop_instance(
    slot: u32,
    state: State<'_, PersistentEngineStore>,
) -> Result<String, String> {
    let active_slot = state.active_slot()?;
    let profile = state
        .runtime_data
        .lock()
        .map_err(|_| "System Memory Error: Mutex validation deadlock".to_string())?;

    validate_boot_profile(slot, active_slot, &profile)
}

#[tauri::command]
pub fn append_message_to_history(
    message: RustDialogueEntry,
    app_handle: AppHandle,
    state: State<'_, PersistentEngineStore>,
) -> Result<InteractionPayload, String> {
    let mut profile = state
        .runtime_data
        .lock()
        .map_err(|_| "Failed to lock dialogue history state".to_string())?;

    profile.dialogue_history.push(message);
    profile.total_turns_played = profile.total_turns_played.saturating_add(1);
    profile.last_updated = current_timestamp();

    let payload = build_payload_from_profile(state.active_slot()?, &profile);
    drop(profile);

    state.trigger_save_to_active_slot(app_handle)?;

    Ok(payload)
}

#[tauri::command]
pub fn replace_dialogue_history(
    messages: Vec<RustDialogueEntry>,
    app_handle: AppHandle,
    state: State<'_, PersistentEngineStore>,
) -> Result<InteractionPayload, String> {
    let mut profile = state
        .runtime_data
        .lock()
        .map_err(|_| "Failed to lock dialogue history state".to_string())?;

    profile.dialogue_history = messages;
    profile.last_updated = current_timestamp();

    let payload = build_payload_from_profile(state.active_slot()?, &profile);
    drop(profile);

    state.trigger_save_to_active_slot(app_handle)?;

    Ok(payload)
}

#[tauri::command]
pub fn clear_game_slot(
    slot: u32,
    app_handle: AppHandle,
    state: State<'_, PersistentEngineStore>,
) -> Result<(), String> {
    let save_path = PersistentEngineStore::get_path_for_slot(&app_handle, slot)?;
    if save_path.exists() {
        remove_file(&save_path)
            .map_err(|error| format!("Failed to delete save profile: {error}"))?;
    }

    if state.active_slot()? == slot {
        state.reset_slot_into_memory(slot)?;
    }

    Ok(())
}

#[tauri::command]
pub fn clone_game_slot(
    source_slot: u32,
    target_slot: u32,
    app_handle: AppHandle,
    state: State<'_, PersistentEngineStore>,
) -> Result<(), String> {
    if source_slot == target_slot {
        return Err("Source and target slots cannot be the same.".to_string());
    }

    let source_path = PersistentEngineStore::get_path_for_slot(&app_handle, source_slot)?;
    let target_path = PersistentEngineStore::get_path_for_slot(&app_handle, target_slot)?;

    if !source_path.exists() {
        return Err("Source profile data does not exist.".to_string());
    }

    copy(&source_path, &target_path)
        .map_err(|error| format!("Disk copy operation failure: {error}"))?;

    if state.active_slot()? == target_slot {
        state.load_slot_into_memory(&app_handle, target_slot)?;
    }

    Ok(())
}

fn apply_trope_interaction(
    profile: &mut ProfileSaveData,
    detected_trope: RomanceTropeClass,
) -> (String, Option<String>) {
    let stats = &mut profile.stats;
    let mut event_flag = None;
    let vignette = match detected_trope {
        RomanceTropeClass::Protective => {
            stats.trust = add_capped(stats.trust, 8);
            stats.rivalry = stats.rivalry.saturating_sub(5);

            if stats.trust > 75 {
                event_flag = push_milestone_once(profile, "UNLOCKED_SWORN_DEFENDER");
            }

            "from-red-950/40 via-transparent"
        }
        RomanceTropeClass::Flustered => {
            stats.tension = add_capped(stats.tension, 12);
            stats.chemistry = add_capped(stats.chemistry, 4);
            "from-purple-950/20 via-transparent"
        }
        RomanceTropeClass::Yearning => {
            stats.chemistry = add_capped(stats.chemistry, 6);
            stats.affection = add_capped(stats.affection, 3);
            "from-fuchsia-950/30 via-transparent font-serif"
        }
        RomanceTropeClass::Antagonistic => {
            stats.rivalry = add_capped(stats.rivalry, 10);
            stats.tension = add_capped(stats.tension, 5);
            "from-red-950/20 via-transparent"
        }
        RomanceTropeClass::Bantering => {
            stats.chemistry = add_capped(stats.chemistry, 5);
            stats.tension = add_capped(stats.tension, 2);
            "from-orange-950/15 via-transparent"
        }
        RomanceTropeClass::Recognized => {
            stats.affection = add_capped(stats.affection, 10);
            stats.chemistry = add_capped(stats.chemistry, 8);
            stats.tension = add_capped(stats.tension, 3);
            if stats.affection > 50 && stats.chemistry > 50 {
                event_flag = push_milestone_once(profile, "SOUL_RECOGNITION_LOCKED");
            }
            "from-violet-950/25 via-transparent"
        }
        _ => "from-transparent",
    };

    (vignette.to_string(), event_flag)
}

fn build_payload_from_profile(active_slot: u32, profile: &ProfileSaveData) -> InteractionPayload {
    InteractionPayload {
        active_slot,
        active_character: profile.active_character.clone(),
        current_stats: profile.stats.clone(),
        active_trope_milestones: profile.active_trope_milestones.clone(),
        active_vignette: "from-transparent".to_string(),
        dialogue_history: profile.dialogue_history.clone(),
        total_turns_played: profile.total_turns_played,
        triggered_event_flag: None,
    }
}

fn add_capped(value: u32, delta: u32) -> u32 {
    std::cmp::min(100, value + delta)
}

fn push_milestone_once(profile: &mut ProfileSaveData, milestone: &str) -> Option<String> {
    if profile
        .active_trope_milestones
        .iter()
        .any(|existing| existing == milestone)
    {
        return None;
    }

    let marker = milestone.to_string();
    profile.active_trope_milestones.push(marker.clone());
    Some(marker)
}

fn validate_boot_profile(
    requested_slot: u32,
    active_slot: u32,
    profile: &ProfileSaveData,
) -> Result<String, String> {
    if requested_slot != active_slot {
        return Err(format!(
            "Boot Intercept: Profile Slot {requested_slot} is not mounted in active memory. Load the slot before launching."
        ));
    }

    let Some(character) = profile.active_character.as_ref() else {
        return Err(format!(
            "Boot Intercept: Cannot launch Profile Slot {requested_slot} because its character file registry block is blank."
        ));
    };

    println!(
        "Tauri Engine: Authorization approved. Booting session instance for character [{}] on slot allocation token [{}].",
        character.name, requested_slot
    );

    Ok("SUCCESS_LAUNCH_THREAD_INITIALISED".to_string())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::state_manager::{default_profile_data, default_relationship_stats};

    #[test]
    fn protective_interaction_increases_trust_and_reduces_rivalry() {
        let mut profile = default_profile_data();

        let (vignette, event_flag) =
            apply_trope_interaction(&mut profile, RomanceTropeClass::Protective);

        assert_eq!(profile.stats.trust, 18);
        assert_eq!(profile.stats.rivalry, 35);
        assert_eq!(vignette, "from-red-950/40 via-transparent");
        assert_eq!(event_flag, None);
    }

    #[test]
    fn protective_interaction_unlocks_sworn_defender_at_high_trust() {
        let mut profile = ProfileSaveData {
            stats: RelationshipStats {
                trust: 72,
                ..default_relationship_stats()
            },
            ..default_profile_data()
        };

        let (_, event_flag) = apply_trope_interaction(&mut profile, RomanceTropeClass::Protective);

        assert_eq!(profile.stats.trust, 80);
        assert_eq!(event_flag, Some("UNLOCKED_SWORN_DEFENDER".to_string()));
        assert_eq!(
            profile.active_trope_milestones,
            vec!["UNLOCKED_SWORN_DEFENDER".to_string()]
        );
    }

    #[test]
    fn protective_milestone_only_unlocks_once() {
        let mut profile = ProfileSaveData {
            stats: RelationshipStats {
                trust: 80,
                ..default_relationship_stats()
            },
            active_trope_milestones: vec!["UNLOCKED_SWORN_DEFENDER".to_string()],
            dialogue_history: Vec::new(),
            total_turns_played: 1,
            last_updated: "--".to_string(),
            active_character: None,
        };

        let (_, event_flag) = apply_trope_interaction(&mut profile, RomanceTropeClass::Protective);

        assert_eq!(profile.stats.trust, 88);
        assert_eq!(event_flag, None);
        assert_eq!(profile.active_trope_milestones.len(), 1);
    }

    #[test]
    fn recognized_interaction_updates_affection_chemistry_and_tension() {
        let mut profile = default_profile_data();

        let (vignette, event_flag) =
            apply_trope_interaction(&mut profile, RomanceTropeClass::Recognized);

        assert_eq!(profile.stats.affection, 15);
        assert_eq!(profile.stats.chemistry, 28);
        assert_eq!(profile.stats.tension, 18);
        assert_eq!(vignette, "from-violet-950/25 via-transparent");
        assert_eq!(event_flag, None);
    }

    #[test]
    fn build_payload_includes_active_character() {
        let mut profile = default_profile_data();
        profile.active_character = Some(CharacterCardModel {
            name: "Mara".to_string(),
            description: "A guarded thief.".to_string(),
            forbidden_tones: vec!["antagonistic".to_string()],
            preferred_tones: vec!["bantering".to_string()],
            avatar_data_uri: "data:image/png;base64,iVBORw==".to_string(),
        });

        let payload = build_payload_from_profile(1, &profile);

        assert_eq!(
            payload
                .active_character
                .as_ref()
                .map(|card| card.name.as_str()),
            Some("Mara")
        );
    }

    #[test]
    fn boot_validation_rejects_blank_character_slot() {
        let profile = default_profile_data();

        let result = validate_boot_profile(1, 1, &profile);

        assert!(result.is_err());
        assert!(result
            .unwrap_err()
            .contains("character file registry block is blank"));
    }

    #[test]
    fn boot_validation_rejects_unmounted_slot() {
        let mut profile = default_profile_data();
        profile.active_character = Some(CharacterCardModel {
            avatar_data_uri: "data:image/png;base64,iVBORw==".to_string(),
            description: "A guarded knight.".to_string(),
            forbidden_tones: Vec::new(),
            name: "Lucas".to_string(),
            preferred_tones: Vec::new(),
        });

        let result = validate_boot_profile(2, 1, &profile);

        assert!(result.is_err());
        assert!(result.unwrap_err().contains("not mounted in active memory"));
    }

    #[test]
    fn boot_validation_accepts_active_character_slot() {
        let mut profile = default_profile_data();
        profile.active_character = Some(CharacterCardModel {
            avatar_data_uri: "data:image/png;base64,iVBORw==".to_string(),
            description: "A guarded knight.".to_string(),
            forbidden_tones: Vec::new(),
            name: "Lucas".to_string(),
            preferred_tones: Vec::new(),
        });

        let result = validate_boot_profile(1, 1, &profile);

        assert_eq!(result, Ok("SUCCESS_LAUNCH_THREAD_INITIALISED".to_string()));
    }
}
