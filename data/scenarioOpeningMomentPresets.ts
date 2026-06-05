export type ScenarioOpeningMomentPresetCategory =
  | "Archetype"
  | "Opening Seed"
  | "First Meeting Mode"
  | "Inciting Incident"
  | "Conflict Starter"
  | "Confession Trigger"
  | "Domestic Opener"
  | "Danger Opener"
  | "Emotional Opener"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface ScenarioOpeningMomentPreset {
  id: string;
  category: ScenarioOpeningMomentPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledScenarioOpeningMomentPresetAdditions {
  scenarioAddition: string;
  firstMessageAddition: string;
  systemPromptAddition: string;
}

interface ScenarioOpeningMomentSeedGroup {
  category: ScenarioOpeningMomentPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const SCENARIO_OPENING_MOMENT_GUIDANCE =
  "Use this as scenario opening texture. First meetings, inciting incidents, conflict starters, confession triggers, domestic openers, danger, and emotional hooks may launch a scene without forcing {{user}} response, romance, danger, or escalation.";

const CONSENT_SAFE_TROPE_GUIDANCE =
  "One-bed, forced proximity, fake relationship, soulmark, and mate-bond openers are fictional trope pressure only. Preserve consent, choice, boundaries, refusal, and the option to slow down or reject the premise.";

const DANGER_OPENER_GUIDANCE =
  "Use this as fictional danger-opener texture. Danger can create urgency, protection, fear, rescue, or investigation while preserving {{user}} agency, escape routes, consent, and de-escalation.";

const EMOTIONAL_OPENER_GUIDANCE =
  "Use this as emotional opening texture. Panic, grief, shame, exhaustion, kindness, apology, and trust tests should stay non-diagnostic, supportive, boundary-aware, and responsive to {{user}} agency.";

export const scenarioOpeningMomentPresets = [
  "Meet Cute",
  "Meet Disaster",
  "Rescue First Meeting",
  "Mistaken Identity",
  "Forced Proximity Opening",
  "Enemies First Clash",
  "Rivals First Challenge",
  "Fake Relationship Inciting Incident",
  "Secret Assignment",
  "One Bed Arrival",
  "Domestic Morning Opener",
  "Rainstorm Shelter",
  "Danger at the Door",
  "Injury Care Opener",
  "Confession Under Pressure",
  "Jealousy Trigger",
  "Old Flame Returns",
  "Safehouse Arrival",
  "Public Scandal",
  "Life-or-Death Choice",
];

export const scenarioOpeningMomentSeeds = [
  "scenario_opening",
  "opening_moment",
  "first_scene",
  "inciting_incident",
  "first_meeting",
  "conflict_starter",
  "romance_starter",
  "danger_opener",
  "domestic_opener",
  "confession_trigger",
  "forced_proximity_start",
  "relationship_shift_start",
  "plot_hook",
  "scene_prompt",
  "roleplay_opener",
  "character_card_opening",
  "first_message_seed",
  "tension_starter",
  "emotional_hook",
  "story_launch",
];

export const firstMeetingModeSeeds = [
  "meet_cute",
  "meet_disaster",
  "rescue_meeting",
  "mistaken_identity",
  "wrong_room_meeting",
  "shared_table_meeting",
  "coffee_spill_meeting",
  "bookstore_meeting",
  "library_meeting",
  "market_meeting",
  "train_station_meeting",
  "airport_meeting",
  "rainstorm_meeting",
  "masked_ball_meeting",
  "court_introduction",
  "academy_first_day",
  "workplace_first_day",
  "new_neighbor_meeting",
  "bodyguard_assignment_meeting",
  "enemy_across_battlefield_meeting",
  "rival_introduction",
  "arranged_match_first_meeting",
  "fake_date_first_meeting",
  "safehouse_first_meeting",
  "hospital_bedside_meeting",
  "accidental_roommates_meeting",
  "undercover_identity_meeting",
  "summoning_circle_meeting",
  "crash_landing_meeting",
  "distress_signal_meeting",
];

export const incitingIncidentSeeds = [
  "unexpected_assignment",
  "forced_partnership",
  "arranged_marriage_order",
  "fake_relationship_request",
  "inheritance_condition",
  "public_scandal",
  "secret_revealed",
  "dangerous_debt_called_in",
  "enemy_attack",
  "missing_person_case",
  "murder_investigation",
  "stolen_artifact",
  "prophecy_activated",
  "soulmark_revealed",
  "mate_bond_triggered",
  "curse_begins",
  "safehouse_needed",
  "storm_traps_them",
  "last_room_available",
  "one_bed_problem",
  "car_breakdown",
  "ship_malfunction",
  "life_support_alarm",
  "job_offer_changes_everything",
  "ex_returns",
  "family_demands_choice",
  "rival_challenge",
  "public_proposal_fake_or_real",
  "witness_protection_start",
  "escape_plan_goes_wrong",
];

export const conflictStarterSeeds = [
  "misunderstanding_starts_conflict",
  "opposing_goals",
  "competing_for_same_prize",
  "secret_agenda",
  "bad_first_impression",
  "old_grudge",
  "professional_rivalry",
  "family_rivalry",
  "class_gap_tension",
  "status_gap_tension",
  "power_gap_tension",
  "forbidden_rule",
  "broken_promise",
  "hidden_identity",
  "protective_lie",
  "jealousy_misread",
  "public_insult",
  "private_betrayal",
  "boundary_crossed",
  "trust_test_failed",
  "mission_conflict",
  "duty_vs_desire",
  "love_vs_reputation",
  "enemy_threatens_user",
  "patron_demands_separation",
  "employer_forbids_romance",
  "family_disapproves",
  "rival_interferes",
  "ex_complication",
  "secret_relationship_nearly_exposed",
];

export const confessionTriggerSeeds = [
  "near_loss_confession",
  "jealousy_breaks_denial",
  "injury_confession",
  "nightmare_confession",
  "rain_confession",
  "late_night_confession",
  "argument_confession",
  "forced_separation_confession",
  "fake_relationship_feels_real",
  "secret_almost_exposed",
  "public_choice_confession",
  "private_vow_confession",
  "truth_spell_confession",
  "soul_bond_confession",
  "one_bed_confession",
  "dance_confession",
  "letter_found_confession",
  "playlist_confession",
  "gift_reveals_feelings",
  "caretaking_breaks_wall",
  "protector_gets_protected",
  "user_asks_do_you_love_me",
  "character_says_stay",
  "final_battle_confession",
  "goodbye_confession",
];

export const domesticOpenerSeeds = [
  "morning_after_storm",
  "shared_breakfast",
  "coffee_made_wrong_but_sweet",
  "tea_after_bad_day",
  "cooking_together",
  "burnt_dinner_rescue",
  "laundry_day",
  "grocery_run",
  "apartment_power_outage",
  "fixing_leaky_sink",
  "cleaning_after_party",
  "sick_day_caretaking",
  "nightmare_comfort",
  "blanket_on_couch",
  "rainy_day_reading",
  "movie_night",
  "pet_escape_opener",
  "plant_watering_opener",
  "first_spare_key",
  "left_drawer_empty",
  "shared_chore_tension",
  "sleepy_kitchen_confession",
  "accidental_domesticity",
  "home_feels_too_real",
  "ordinary_morning_after_extraordinary_night",
];

export const dangerOpenerSeeds = [
  "danger_at_the_door",
  "blood_on_the_doorstep",
  "injured_character_arrives",
  "user_is_followed",
  "ambush_in_alley",
  "safehouse_compromised",
  "assassin_attack",
  "monster_attack",
  "enemy_siege",
  "poisoning_attempt",
  "kidnapping_attempt",
  "car_chase",
  "storm_traps_them",
  "ship_alarm",
  "life_support_failure",
  "spacewalk_accident",
  "curse_flare",
  "magic_backfire",
  "prophecy_warning",
  "rival_duel_challenge",
  "explosion_nearby",
  "blackout_with_threat",
  "witness_in_danger",
  "secret_identity_exposed",
  "final_warning_message",
];

export const emotionalOpenerSeeds = [
  "found_crying_in_private",
  "panic_attack_opener",
  "grief_anniversary",
  "old_letter_found",
  "unsent_message_discovered",
  "public_mask_slips",
  "character_returns_changed",
  "user_notices_they_are_not_fine",
  "quiet_breakdown",
  "first_time_asking_for_help",
  "too_tired_to_pretend",
  "lonely_holiday",
  "birthday_no_one_remembers",
  "homecoming_feels_wrong",
  "old_wound_reopened",
  "unexpected_kindness_breaks_them",
  "soft_touch_triggers_memory",
  "trust_test_opener",
  "apology_needed",
  "forgiveness_not_yet_possible",
];

export const scenarioOpeningGates = [
  "first_meeting_gate",
  "inciting_incident_gate",
  "first_conflict_gate",
  "first_forced_proximity_gate",
  "first_danger_gate",
  "first_domesticity_gate",
  "first_secret_gate",
  "first_confession_trigger_gate",
  "first_trust_test_gate",
  "first_safehouse_gate",
  "first_one_bed_gate",
  "first_public_scandal_gate",
  "first_emotional_break_gate",
  "first_choice_gate",
  "story_begins_route",
];

export const scenarioOpeningDialogueSeeds = [
  "You are not supposed to be here.",
  "Neither are you.",
  "This is a terrible first impression.",
  "I have had worse.",
  "That is not comforting.",
  "We have one room.",
  "Of course we do.",
  "Who did this to you?",
  "Do not start a war.",
  "Then give me a better option.",
  "I need you to pretend to love me.",
  "That sounds dangerously easy.",
  "You are bleeding on my floor.",
  "I missed you too.",
  "If we survive this, we talk.",
  "If we survive this, I am confessing badly.",
  "You made breakfast.",
  "You looked like someone who needed one kind thing today.",
];

export const highValueScenarioOpeningMomentSeeds = [
  "meet_cute",
  "meet_disaster",
  "rescue_meeting",
  "forced_partnership",
  "fake_relationship_request",
  "one_bed_problem",
  "safehouse_needed",
  "storm_traps_them",
  "bad_first_impression",
  "secret_agenda",
  "near_loss_confession",
  "jealousy_breaks_denial",
  "shared_breakfast",
  "sick_day_caretaking",
  "danger_at_the_door",
  "injured_character_arrives",
  "panic_attack_opener",
  "too_tired_to_pretend",
  "inciting_incident_gate",
  "story_begins_route",
];

const SCENARIO_OPENING_MOMENT_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "scenario_opening_archetype",
    guidance: SCENARIO_OPENING_MOMENT_GUIDANCE,
    values: scenarioOpeningMomentPresets,
  },
  {
    category: "Opening Seed",
    prefix: "scenario_opening_seed",
    guidance:
      "Use this as broad opening-scene vocabulary. Openers can define the first message, scene prompt, roleplay launch, tension starter, emotional hook, or story start without scripting {{user}}.",
    values: scenarioOpeningMomentSeeds,
  },
  {
    category: "First Meeting Mode",
    prefix: "scenario_opening_first_meeting",
    guidance: `${CONSENT_SAFE_TROPE_GUIDANCE} Use this as first-meeting texture. Meeting modes can set location, mistake, rescue, role, rivalry, assignment, or genre without deciding attraction for {{user}}.`,
    values: firstMeetingModeSeeds,
  },
  {
    category: "Inciting Incident",
    prefix: "scenario_opening_inciting",
    guidance: `${CONSENT_SAFE_TROPE_GUIDANCE} Use this as inciting-incident texture. Assignments, debts, scandals, bonds, curses, storms, rooms, alarms, exes, and choices should launch pressure without forcing compliance.`,
    values: incitingIncidentSeeds,
  },
  {
    category: "Conflict Starter",
    prefix: "scenario_opening_conflict",
    guidance:
      "Use this as conflict-starter texture. Misunderstandings, secrets, rivalries, gaps, rules, lies, betrayal, boundaries, duty, reputation, enemies, patrons, employers, family, and exes can create tension while preserving repair and choice.",
    values: conflictStarterSeeds,
  },
  {
    category: "Confession Trigger",
    prefix: "scenario_opening_confession",
    guidance: `${CONSENT_SAFE_TROPE_GUIDANCE} Use this as confession-trigger texture. Near loss, jealousy, injury, truth, letters, gifts, caretaking, protection, and goodbye scenes can loosen denial without forcing {{user}} to reciprocate.`,
    values: confessionTriggerSeeds,
  },
  {
    category: "Domestic Opener",
    prefix: "scenario_opening_domestic",
    guidance:
      "Use this as domestic opener texture. Ordinary routines, chores, sick days, food, keys, couches, rain, movies, and shared homes can make softness feel lived-in without removing boundaries.",
    values: domesticOpenerSeeds,
  },
  {
    category: "Danger Opener",
    prefix: "scenario_opening_danger",
    guidance: DANGER_OPENER_GUIDANCE,
    values: dangerOpenerSeeds,
  },
  {
    category: "Emotional Opener",
    prefix: "scenario_opening_emotional",
    guidance: EMOTIONAL_OPENER_GUIDANCE,
    values: emotionalOpenerSeeds,
  },
  {
    category: "Gate",
    prefix: "scenario_opening_gate",
    guidance:
      "Use this as an opening-scene event gate. Gates should mark first meetings, incidents, conflict, proximity, danger, domesticity, secrets, confession triggers, trust tests, safehouses, choices, and story launch only when earned.",
    values: scenarioOpeningGates,
  },
  {
    category: "Dialogue Seed",
    prefix: "scenario_opening_dialogue",
    guidance:
      "Use this as optional opening dialogue inspiration. Dialogue seeds should be adapted to character voice, genre, stakes, and consent context rather than pasted as fixed lines.",
    values: scenarioOpeningDialogueSeeds,
  },
  {
    category: "High-Value Seed",
    prefix: "scenario_opening_high_value",
    guidance:
      "Use this as a high-signal scenario opening seed for character creation, route planning, first-message generation, and preset search.",
    values: highValueScenarioOpeningMomentSeeds,
  },
] satisfies readonly ScenarioOpeningMomentSeedGroup[]);

function normalizeReadableScenarioOpeningMomentValue(value: string): string {
  const readable = value.includes("_")
    ? value
        .replace(/users_/g, "{{user}}_s_")
        .replace(/_for_user\b/g, "_for_{{user}}")
        .replace(/_with_user\b/g, "_with_{{user}}")
        .replace(/_user_/g, "_{{user}}_")
        .replace(/\buser_/g, "{{user}}_")
        .replace(/_user\b/g, "_{{user}}")
        .replace(/_/g, " ")
        .replace(/\{\{user\}\} s/g, "{{user}}'s")
    : value;

  return readable
    .replace(/\b[Nn]eighbor\b/g, (match) =>
      match === "Neighbor" ? "Neighbour" : "neighbour",
    )
    .replace(/\b[Aa]rtifact\b/g, (match) =>
      match === "Artifact" ? "Artefact" : "artefact",
    )
    .replace(/\bone bed\b/gi, "one-bed")
    .replace(/\blife support\b/gi, "life-support")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyScenarioOpeningMoment(value: string) {
  return value
    .toLowerCase()
    .replace(/\{\{user\}\}'s/g, "user_s")
    .replace(/\{\{user\}\}/g, "user")
    .replace(/&/g, " and ")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function makeScenarioOpeningMomentPreset(
  group: ScenarioOpeningMomentSeedGroup,
  rawValue: string,
): ScenarioOpeningMomentPreset {
  const value = normalizeReadableScenarioOpeningMomentValue(rawValue);
  const normalizedTriggerValue = value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user");

  return {
    id: `${group.prefix}_${slugifyScenarioOpeningMoment(value)}`,
    category: group.category,
    label: value,
    value,
    triggerKeys: Array.from(
      new Set([
        rawValue,
        value,
        slugifyScenarioOpeningMoment(value),
        ...normalizedTriggerValue
          .split(/[^a-z0-9]+/)
          .filter((part) => part.length > 2),
      ]),
    ),
    guidance: group.guidance,
    systemPromptTags: [group.category, value],
  };
}

export const SCENARIO_OPENING_MOMENT_PRESETS = SCENARIO_OPENING_MOMENT_SEED_GROUPS.flatMap(
  (group) => group.values.map((value) => makeScenarioOpeningMomentPreset(group, value)),
);

export const SCENARIO_OPENING_MOMENT_PRESET_CATEGORIES = Array.from(
  new Set(SCENARIO_OPENING_MOMENT_PRESETS.map((preset) => preset.category)),
).sort();

export const getScenarioOpeningMomentPresetsByCategory = (
  category: ScenarioOpeningMomentPresetCategory,
) => SCENARIO_OPENING_MOMENT_PRESETS.filter((preset) => preset.category === category);

export const findScenarioOpeningMomentPresetById = (id: string) =>
  SCENARIO_OPENING_MOMENT_PRESETS.find((preset) => preset.id === id);

export const compileScenarioOpeningMomentPresetAdditions = (
  preset: ScenarioOpeningMomentPreset,
): CompiledScenarioOpeningMomentPresetAdditions => ({
  scenarioAddition: `Scenario opening context: ${preset.value}. ${preset.guidance}`,
  firstMessageAddition: `Opening moment texture may include ${preset.value} as a launch point without scripting {{user}}'s feelings, actions, consent, or response.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft scenario opening context.`,
    "Let first meetings, inciting incidents, conflict, confession pressure, domestic detail, danger, emotional vulnerability, and gates shape the initial scene when relevant.",
    "Preserve consent, boundaries, pacing, de-escalation, mental safety, and {{user}} autonomy; do not force romance, danger, mate bonds, one-bed intimacy, fake affection, panic, harm, or reciprocation.",
  ].join(" "),
});
