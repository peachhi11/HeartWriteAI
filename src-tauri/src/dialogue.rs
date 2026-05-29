use crate::ActiveSessionStore;
use serde::Serialize;
use tauri::State;

#[derive(Debug, Clone, Copy)]
pub struct DialogueLineVariants {
    pub base_casual: &'static str,
    pub magnetic_opposites: &'static str,
    pub soulmate_mirror: &'static str,
    pub unrequited_distance: &'static str,
    pub volatile_friction: &'static str,
}

#[derive(Debug, Clone, Copy)]
pub struct DialogueNodeManifest {
    pub id: &'static str,
    pub lucas_responses: DialogueLineVariants,
}

#[derive(Debug, Serialize)]
pub struct DialoguePayloadResponse {
    pub applied_archetype: String,
    pub speaker: String,
    pub transformed_text: String,
}

pub const SCENE_1_MEET_CUTE: DialogueNodeManifest = DialogueNodeManifest {
    id: "scene_01_alley_encounter",
    lucas_responses: DialogueLineVariants {
        base_casual: "Hello there. Are you lost?",
        soulmate_mirror: "[He unbuttons his collar, a rare warm smile softening his gaze.] I felt you coming from down the block. Stay here by the fire, you're shivering.",
        magnetic_opposites: "[He stands tall, blocking the wind, studying your flustered expression with quiet curiosity.] You look out of your depth. Let me help you carry those crates.",
        volatile_friction: "[He clenches his fists, crossing his arms as his stare sharpens.] You again? Don't test my patience tonight. I am on official guard duty.",
        unrequited_distance: "[He nods with rigid, polite courtesy, stepping back immediately to maintain social distance.] Safe travels, traveler. The roads out of the capital are dangerous for strangers.",
    },
};

#[tauri::command]
pub fn fetch_contextual_npc_dialogue(
    node_id: String,
    state: State<'_, ActiveSessionStore>,
) -> Result<DialoguePayloadResponse, String> {
    let session = state
        .profile
        .lock()
        .map_err(|_| "Failed to read active session profile".to_string())?;
    let active_archetype = session.dynamic_archetype.clone();
    drop(session);

    let node = dialogue_node_by_id(&node_id)
        .ok_or_else(|| format!("Story node '{}' was not found.", node_id))?;
    let final_text = select_lucas_variant(&node.lucas_responses, &active_archetype);

    Ok(DialoguePayloadResponse {
        applied_archetype: active_archetype,
        speaker: "Lucas".to_string(),
        transformed_text: final_text.to_string(),
    })
}

fn dialogue_node_by_id(node_id: &str) -> Option<&'static DialogueNodeManifest> {
    if node_id == SCENE_1_MEET_CUTE.id {
        Some(&SCENE_1_MEET_CUTE)
    } else {
        None
    }
}

fn select_lucas_variant(variants: &DialogueLineVariants, active_archetype: &str) -> &'static str {
    match active_archetype {
        "Soulmate Mirror" => variants.soulmate_mirror,
        "Magnetic Opposites" => variants.magnetic_opposites,
        "Volatile Friction" => variants.volatile_friction,
        "Unrequited Distance" => variants.unrequited_distance,
        _ => variants.base_casual,
    }
}

#[cfg(test)]
mod tests {
    use super::{select_lucas_variant, SCENE_1_MEET_CUTE};

    #[test]
    fn selects_archetype_specific_lucas_variant() {
        let variants = &SCENE_1_MEET_CUTE.lucas_responses;

        assert_eq!(
            select_lucas_variant(variants, "Volatile Friction"),
            variants.volatile_friction
        );
        assert_eq!(
            select_lucas_variant(variants, "Soulmate Mirror"),
            variants.soulmate_mirror
        );
    }

    #[test]
    fn unknown_archetypes_fall_back_to_base_dialogue() {
        let variants = &SCENE_1_MEET_CUTE.lucas_responses;

        assert_eq!(select_lucas_variant(variants, ""), variants.base_casual);
    }
}
