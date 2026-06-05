export type PersonaPlayerSidePresetCategory =
  | "Persona Preset"
  | "User Persona Archetype"
  | "Player Goal"
  | "Preferred Dynamic"
  | "Player Boundary"
  | "Preferred Pacing"
  | "Self-Insert Tone"
  | "Opening Preference"
  | "Player Agency"
  | "Persona Hook"
  | "Persona Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface PersonaPlayerSidePreset {
  id: string;
  category: PersonaPlayerSidePresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledPersonaPlayerSidePresetAdditions {
  personaAddition: string;
  scenarioAddition: string;
  systemPromptAddition: string;
}

interface PersonaPlayerSideSeedGroup {
  category: PersonaPlayerSidePresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const PERSONA_PLAYER_SIDE_GUIDANCE =
  "Use this as optional player-side preference context. It may guide persona fit, tone, pacing, romance goals, comfort level, and scene setup without writing actions, dialogue, feelings, or consent decisions for {{user}}.";

const PERSONA_PLAYER_SIDE_BOUNDARY_GUIDANCE =
  "Use this as player boundary and safety preference context. Boundaries should override plot escalation, romance pressure, genre expectation, and character impulse while keeping refusal, redirection, and repair available.";

export const personaPlayerSidePresets = [
  "Soft Self-Insert",
  "Bold Romantic Lead",
  "Shy Newcomer",
  "Competent Equal",
  "Chaos Magnet",
  "Wounded Healer",
  "Protected Civilian",
  "Rival Player",
  "Best Friend Player",
  "Secret Royal",
  "Underworld Survivor",
  "Academy Student",
  "Workplace Partner",
  "Chosen One",
  "Reluctant Hero",
  "Curious Outsider",
  "Touch-Starved User",
  "Slow Burn Seeker",
  "Drama-Friendly Player",
  "Comfort-First Player",
];

export const userPersonaArchetypeSeeds = [
  "soft_self_insert",
  "blank_slate_user",
  "defined_persona_user",
  "shy_user",
  "bold_user",
  "chaotic_user",
  "competent_user",
  "vulnerable_user",
  "guarded_user",
  "flirtatious_user",
  "romantic_user",
  "skeptical_user",
  "innocent_outsider",
  "experienced_partner",
  "protected_civilian",
  "rival_user",
  "friend_user",
  "student_user",
  "royal_user",
  "survivor_user",
];

export const playerGoalSeeds = [
  "romance_goal",
  "comfort_goal",
  "healing_goal",
  "slow_burn_goal",
  "angst_goal",
  "adventure_goal",
  "mystery_goal",
  "domestic_goal",
  "friendship_goal",
  "trust_building_goal",
  "confession_goal",
  "relationship_repair_goal",
  "protective_romance_goal",
  "found_family_goal",
  "character_growth_goal",
  "world_exploration_goal",
  "drama_goal",
  "fluff_goal",
  "hurt_comfort_goal",
  "earned_happy_ending_goal",
];

export const preferredDynamicSeeds = [
  "grumpy_sunshine_preference",
  "black_cat_golden_retriever_preference",
  "protector_protected_preference",
  "equal_partners_preference",
  "caretaker_user_preference",
  "being_caretaken_preference",
  "rivals_to_lovers_preference",
  "friends_to_lovers_preference",
  "slow_burn_preference",
  "mutual_pining_preference",
  "safe_person_preference",
  "devotional_romance_preference",
  "banter_preference",
  "domestic_softness_preference",
  "high_angst_preference",
  "low_angst_preference",
  "emotional_intimacy_preference",
  "protective_but_not_controlling_preference",
  "chosen_not_owned_preference",
  "healthy_communication_preference",
];

export const playerBoundarySeeds = [
  "clear_boundaries",
  "fade_to_black",
  "no_explicit_content",
  "no_nonconsent",
  "no_cheating",
  "no_public_humiliation",
  "no_extreme_violence",
  "no_permanent_character_death",
  "no_forced_romance",
  "no_rushed_intimacy",
  "ask_before_major_plot_twists",
  "avoid_real_world_politics",
  "avoid_family_abuse_themes",
  "avoid_substance_abuse_themes",
  "avoid_horror_intensity",
  "comfort_after_angst_required",
  "consent_focused_romance",
  "player_agency_priority",
  "respect_user_no",
  "soft_safety_preferred",
];

export const preferredPacingSeeds = [
  "slow_burn_pacing",
  "medium_burn_pacing",
  "fast_burn_pacing",
  "episodic_pacing",
  "slice_of_life_pacing",
  "plot_heavy_pacing",
  "romance_forward_pacing",
  "relationship_first_pacing",
  "conflict_heavy_pacing",
  "comfort_heavy_pacing",
  "gradual_trust_pacing",
  "quick_chemistry_slow_commitment",
  "instant_attraction_slow_love",
  "friends_first_pacing",
  "domestic_after_tension_pacing",
  "angst_then_comfort_pacing",
  "short_scene_pacing",
  "long_scene_pacing",
  "open_world_pacing",
  "guided_story_pacing",
];

export const selfInsertToneSeeds = [
  "soft_self_insert_tone",
  "cinematic_self_insert_tone",
  "novelistic_self_insert_tone",
  "casual_roleplay_tone",
  "immersive_second_person",
  "first_person_user_tone",
  "blank_slate_tone",
  "highly_personalized_tone",
  "comfort_fantasy_tone",
  "wish_fulfillment_tone",
  "grounded_realistic_tone",
  "dramatic_romance_tone",
  "cozy_domestic_tone",
  "angsty_poetic_tone",
  "playful_banter_tone",
  "dark_romantic_tone",
  "hopeful_healing_tone",
  "low_pressure_tone",
  "agency_forward_tone",
  "emotionally_safe_tone",
];

export const playerOpeningPreferenceSeeds = [
  "user_starts_scene",
  "character_starts_scene",
  "guided_opening",
  "open_ended_opening",
  "inciting_incident_opening",
  "domestic_opening",
  "danger_opening",
  "emotional_opening",
  "first_meeting_opening",
  "established_relationship_opening",
  "slow_context_build",
  "start_in_media_res",
  "minimal_backstory_needed",
  "rich_backstory_intro",
  "choice_based_opening",
  "soft_landing_opening",
  "high_tension_opening",
  "banter_opening",
  "hurt_comfort_opening",
  "mystery_hook_opening",
];

export const playerAgencySeeds = [
  "high_player_agency",
  "medium_player_agency",
  "guided_choices",
  "open_ended_choices",
  "npc_leads_plot",
  "player_leads_plot",
  "collaborative_storytelling",
  "ask_before_control",
  "avoid_user_actions_assumed",
  "avoid_user_dialogue_written",
  "offer_choices",
  "respect_silence",
  "respect_refusal",
  "branching_paths",
  "player_choice_changes_story",
  "player_boundaries_override_plot",
  "soft_railroading_allowed",
  "no_railroading",
  "npc_initiative_allowed",
  "consent_to_escalation",
];

export const personaPlayerSideHooks = [
  "user_defines_boundaries_first",
  "user_sets_pacing",
  "npc_adapts_to_user_tone",
  "dynamic_matches_player_goal",
  "player_agency_is_respected",
  "comfort_after_conflict",
  "slow_burn_respects_user_choice",
  "character_checks_in_softly",
  "user_can_redirect_scene",
  "romance_escalates_by_mutual_choice",
  "domesticity_matches_user_preference",
  "danger_never_removes_agency",
  "confession_waits_for_trust",
  "relationship_style_personalized",
  "self_insert_feels_seen",
];

export const personaPlayerSideGates = [
  "first_user_preference_gate",
  "first_boundary_gate",
  "first_pacing_gate",
  "first_dynamic_choice_gate",
  "first_agency_respected_gate",
  "first_comfort_check_gate",
  "first_romance_escalation_gate",
  "first_player_redirect_gate",
  "first_safe_no_gate",
  "first_chosen_tone_gate",
  "personalized_route_gate",
  "player_trust_route",
];

export const personaPlayerSideDialogueSeeds = [
  "We can go slowly.",
  "Good. I want this to feel like a choice.",

  "Tell me what you want from this.",
  "A story where I do not have to fight to be heard.",

  "You can say no.",
  "And you will listen?",
  "Every time.",

  "Do you want comfort or honesty?",
  "Both, if you can manage it.",
  "For you, I can try.",

  "This is your story too.",
  "Then let me choose where I stand.",

  "I will not decide your heart for you.",
  "Then stay while I figure it out.",
];

export const highValuePersonaPlayerSideSeeds = [
  "soft_self_insert",
  "blank_slate_user",
  "competent_user",
  "touch_starved_user",
  "romance_goal",
  "comfort_goal",
  "slow_burn_goal",
  "hurt_comfort_goal",
  "equal_partners_preference",
  "protector_protected_preference",
  "safe_person_preference",
  "clear_boundaries",
  "fade_to_black",
  "player_agency_priority",
  "slow_burn_pacing",
  "comfort_heavy_pacing",
  "immersive_second_person",
  "emotionally_safe_tone",
  "high_player_agency",
  "player_trust_route",
];

const PERSONA_PLAYER_SIDE_SEED_GROUPS = Object.freeze([
  {
    category: "Persona Preset",
    prefix: "persona_player_preset",
    guidance: PERSONA_PLAYER_SIDE_GUIDANCE,
    values: personaPlayerSidePresets,
  },
  {
    category: "User Persona Archetype",
    prefix: "persona_player_archetype",
    guidance:
      "Use this as optional {{user}} persona framing. It can help match scenario tone and relationship expectations without assuming hidden facts or replacing live user choices.",
    values: userPersonaArchetypeSeeds,
  },
  {
    category: "Player Goal",
    prefix: "persona_player_goal",
    guidance:
      "Use this as desired experience context. Player goals can guide romance, comfort, plot, mystery, healing, friendship, drama, and ending shape without guaranteeing a fixed outcome.",
    values: playerGoalSeeds,
  },
  {
    category: "Preferred Dynamic",
    prefix: "persona_player_dynamic",
    guidance:
      "Use this as preferred relationship dynamic context. Dynamics should inform chemistry, pacing, reciprocity, and conflict style while preserving boundaries, mutual choice, and repair.",
    values: preferredDynamicSeeds,
  },
  {
    category: "Player Boundary",
    prefix: "persona_player_boundary",
    guidance: PERSONA_PLAYER_SIDE_BOUNDARY_GUIDANCE,
    values: playerBoundarySeeds,
  },
  {
    category: "Preferred Pacing",
    prefix: "persona_player_pacing",
    guidance:
      "Use this as pacing preference context. Burn speed, scene length, plot density, comfort, conflict, trust, and commitment timing should adapt to player preference and in-scene feedback.",
    values: preferredPacingSeeds,
  },
  {
    category: "Self-Insert Tone",
    prefix: "persona_player_tone",
    guidance:
      "Use this as self-insert tone context. Tone can tune narration style, intimacy, comfort, drama, realism, wish fulfilment, and pressure level without deciding {{user}}'s inner life.",
    values: selfInsertToneSeeds,
  },
  {
    category: "Opening Preference",
    prefix: "persona_player_opening",
    guidance:
      "Use this as opening preference context. Scene starts may be guided, open, domestic, tense, emotional, mystery-driven, or choice-based while leaving {{user}} room to answer.",
    values: playerOpeningPreferenceSeeds,
  },
  {
    category: "Player Agency",
    prefix: "persona_player_agency",
    guidance:
      "Use this as player agency context. Agency settings should define how much the NPC initiates, how choices are offered, and when to ask before controlling, escalating, or assuming.",
    values: playerAgencySeeds,
  },
  {
    category: "Persona Hook",
    prefix: "persona_player_hook",
    guidance:
      "Use this as player-side hook context. Hooks can help scenes respond to preferences, boundaries, comfort checks, redirect options, and mutual escalation without scripting {{user}}.",
    values: personaPlayerSideHooks,
  },
  {
    category: "Persona Gate",
    prefix: "persona_player_gate",
    guidance:
      "Use this as player-side gate context. Gates should unlock when preference, boundary, trust, pacing, comfort, tone, redirection, or route choices have been established in-scene.",
    values: personaPlayerSideGates,
  },
  {
    category: "Dialogue Seed",
    prefix: "persona_player_dialogue",
    guidance:
      "Use this as dialogue inspiration only. Lines should reinforce choice, listening, comfort, honesty, and agency without being forced verbatim or written as {{user}} speech.",
    values: personaPlayerSideDialogueSeeds,
  },
  {
    category: "High-Value Seed",
    prefix: "persona_player_high_value",
    guidance:
      "Use this as a high-signal player-side seed for persona matching, safety preferences, route planning, opening defaults, preset search, and scene personalisation.",
    values: highValuePersonaPlayerSideSeeds,
  },
] satisfies readonly PersonaPlayerSideSeedGroup[]);

function normalizeReadablePersonaPlayerSideValue(value: string): string {
  const readable = value.includes("_") ? value.replace(/_/g, " ") : value;

  return readable
    .replace(/\b[Nn]pc\b/g, "NPC")
    .replace(/\b[Nn]onconsent\b/g, "non-consent")
    .replace(/\b[Pp]ersonalized\b/g, (match) =>
      match === "Personalized" ? "Personalised" : "personalised",
    )
    .replace(/\b[Ff]ulfillment\b/g, (match) =>
      match === "Fulfillment" ? "Fulfilment" : "fulfilment",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyPersonaPlayerSide(value: string) {
  return value
    .toLowerCase()
    .replace(/\{\{user\}\}'s/g, "user_s")
    .replace(/\{\{user\}\}/g, "user")
    .replace(/&/g, " and ")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function makePersonaPlayerSidePreset(
  group: PersonaPlayerSideSeedGroup,
  rawValue: string,
): PersonaPlayerSidePreset {
  const value = normalizeReadablePersonaPlayerSideValue(rawValue);

  return {
    id: `${group.prefix}_${slugifyPersonaPlayerSide(value)}`,
    category: group.category,
    label: value,
    value,
    triggerKeys: Array.from(
      new Set([
        rawValue,
        value,
        slugifyPersonaPlayerSide(value),
        ...value
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter((part) => part.length > 2),
      ]),
    ),
    guidance: group.guidance,
    systemPromptTags: [group.category, value],
  };
}

export const PERSONA_PLAYER_SIDE_PRESETS = PERSONA_PLAYER_SIDE_SEED_GROUPS.flatMap(
  (group) => group.values.map((value) => makePersonaPlayerSidePreset(group, value)),
);

export const PERSONA_PLAYER_SIDE_PRESET_CATEGORIES = Array.from(
  new Set(PERSONA_PLAYER_SIDE_PRESETS.map((preset) => preset.category)),
).sort();

export const getPersonaPlayerSidePresetsByCategory = (
  category: PersonaPlayerSidePresetCategory,
) => PERSONA_PLAYER_SIDE_PRESETS.filter((preset) => preset.category === category);

export const findPersonaPlayerSidePresetById = (id: string) =>
  PERSONA_PLAYER_SIDE_PRESETS.find((preset) => preset.id === id);

export const compilePersonaPlayerSidePresetAdditions = (
  preset: PersonaPlayerSidePreset,
): CompiledPersonaPlayerSidePresetAdditions => ({
  personaAddition: `Player-side persona context: ${preset.value}. ${preset.guidance}`,
  scenarioAddition: `Player preference texture may include ${preset.value}, shaping opening style, pacing, comfort level, romance dynamic, safety boundaries, and route defaults while leaving {{user}} room to choose.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft player-side preference context.`,
    "Let it influence tone, pacing, comfort checks, dynamic fit, opening structure, safety boundaries, and escalation only when relevant.",
    "Do not write actions, dialogue, inner feelings, consent decisions, or irreversible choices for {{user}}; ask, offer options, respect refusal, and keep player boundaries above plot momentum.",
  ].join(" "),
});
