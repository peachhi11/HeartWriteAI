export type DialogueExamplePresetCategory =
  | "Scene Preset"
  | "Dialogue Example"
  | "Tone"
  | "Structure"
  | "Hook"
  | "Template Seed"
  | "Dialogue Line"
  | "Usage Preset";

export interface DialogueExamplePreset {
  id: string;
  category: DialogueExamplePresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
  usageProfile?: DialogueExampleUsageProfile;
}

export interface DialogueExampleUsageProfile {
  style: string[];
  bestFor: string[];
  requiredSeeds: string[];
}

export interface CompiledDialogueExamplePresetAdditions {
  scenarioAddition: string;
  dialogueAddition: string;
  systemPromptAddition: string;
}

interface DialogueExampleSeedGroup {
  category: DialogueExamplePresetCategory;
  prefix: string;
  guidance: string;
  values: Array<string | DialogueExampleUsageInput>;
}

interface DialogueExampleUsageInput {
  id: string;
  style: string[];
  bestFor: string[];
  requiredSeeds: string[];
}

const DIALOGUE_EXAMPLE_SEED_GROUPS = Object.freeze([
  {
    category: "Scene Preset",
    prefix: "dialogue_scene",
    guidance:
      "Use this as a dialogue scene-beat preset. It suggests the kind of moment being modelled, not a required plot event or fixed relationship outcome.",
    values: [
      "First Meeting",
      "First Flirt",
      "First Tension",
      "First Vulnerability",
      "First Comfort",
      "First Boundary",
      "First Jealousy",
      "First Apology",
      "First Confession",
      "First Almost Kiss",
      "First Fight",
      "First Repair",
      "First Pet Name",
      "First Protective Moment",
      "First Trust Test",
      "First Secret Reveal",
      "First Public Claim",
      "First Private Softness",
      "First Love Admission",
      "First Forever Promise",
    ],
  },
  {
    category: "Dialogue Example",
    prefix: "dialogue_example",
    guidance:
      "Use this as a reusable dialogue-example lane. It can suggest greeting, flirtation, comfort, conflict, apology, confession, reveal, protection, domestic, or public-social dialogue without forcing a script.",
    values: [
      "greeting_dialogue",
      "first_meeting_dialogue",
      "stranger_to_interest_dialogue",
      "newcomer_dialogue",
      "reunion_dialogue",
      "recognition_dialogue",
      "awkward_intro_dialogue",
      "formal_intro_dialogue",
      "hostile_intro_dialogue",
      "soft_intro_dialogue",
      "banter_dialogue",
      "teasing_dialogue",
      "flirt_dialogue",
      "awkward_flirt_dialogue",
      "subtle_flirt_dialogue",
      "shameless_flirt_dialogue",
      "deadpan_flirt_dialogue",
      "double_meaning_dialogue",
      "pet_name_dialogue",
      "nickname_dialogue",
      "comfort_dialogue",
      "hurt_comfort_dialogue",
      "reassurance_dialogue",
      "caretaking_dialogue",
      "panic_comfort_dialogue",
      "nightmare_comfort_dialogue",
      "grief_comfort_dialogue",
      "sickbed_dialogue",
      "after_battle_dialogue",
      "safe_place_dialogue",
      "conflict_dialogue",
      "argument_dialogue",
      "boundary_dialogue",
      "miscommunication_dialogue",
      "jealousy_dialogue",
      "betrayal_dialogue",
      "cold_conflict_dialogue",
      "emotional_conflict_dialogue",
      "silent_conflict_dialogue",
      "repair_dialogue",
      "apology_dialogue",
      "forgiveness_dialogue",
      "accountability_dialogue",
      "second_chance_dialogue",
      "trust_rebuild_dialogue",
      "regret_dialogue",
      "fear_admission_dialogue",
      "do_not_leave_dialogue",
      "stay_dialogue",
      "choose_us_dialogue",
      "confession_dialogue",
      "almost_confession_dialogue",
      "accidental_confession_dialogue",
      "whispered_confession_dialogue",
      "letter_confession_dialogue",
      "public_confession_dialogue",
      "private_confession_dialogue",
      "i_missed_you_dialogue",
      "i_need_you_dialogue",
      "i_love_you_dialogue",
      "secret_reveal_dialogue",
      "identity_reveal_dialogue",
      "true_name_dialogue",
      "species_reveal_dialogue",
      "family_secret_dialogue",
      "lore_reveal_dialogue",
      "curse_reveal_dialogue",
      "past_wound_reveal_dialogue",
      "hidden_power_reveal_dialogue",
      "betrayal_truth_dialogue",
      "protective_dialogue",
      "bodyguard_dialogue",
      "threat_warning_dialogue",
      "touch_them_and_die_dialogue",
      "stay_close_dialogue",
      "look_at_me_dialogue",
      "you_are_safe_dialogue",
      "i_have_you_dialogue",
      "run_with_me_dialogue",
      "fight_for_you_dialogue",
      "domestic_dialogue",
      "morning_after_dialogue",
      "shared_breakfast_dialogue",
      "cooking_together_dialogue",
      "walking_home_dialogue",
      "rainy_window_dialogue",
      "library_dialogue",
      "market_day_dialogue",
      "festival_dialogue",
      "quiet_night_dialogue",
      "public_scene_dialogue",
      "court_dialogue",
      "family_dinner_dialogue",
      "community_gossip_dialogue",
      "status_gap_dialogue",
      "arranged_match_dialogue",
      "fake_dating_dialogue",
      "secret_relationship_dialogue",
      "public_claim_dialogue",
      "love_over_society_dialogue",
    ],
  },
  {
    category: "Tone",
    prefix: "dialogue_tone",
    guidance:
      "Use this as dialogue tone texture. It should colour pacing, line length, subtext, voice, and body language without overriding the active scene or character voice.",
    values: [
      "soft",
      "tense",
      "playful",
      "flirtatious",
      "awkward",
      "guarded",
      "vulnerable",
      "intimate",
      "heated",
      "cold",
      "formal",
      "casual",
      "devotional",
      "protective",
      "possessive",
      "gentle",
      "sarcastic",
      "deadpan",
      "desperate",
      "hopeful",
      "bittersweet",
      "grieving",
      "jealous",
      "ashamed",
      "reverent",
      "dangerous",
      "comforting",
      "confessional",
      "publicly_restrained",
      "privately_tender",
    ],
  },
  {
    category: "Structure",
    prefix: "dialogue_structure",
    guidance:
      "Use this as dialogue structure texture. It can suggest a turn pattern, escalation, softening, reveal, repair, promise, or scene hook while preserving room for {{user}} to respond.",
    values: [
      "two_line_exchange",
      "three_beat_exchange",
      "question_answer_turn",
      "deflection_then_truth",
      "banter_then_softness",
      "conflict_then_vulnerability",
      "joke_then_confession",
      "silence_then_admission",
      "threat_then_protection",
      "denial_then_reveal",
      "formal_then_intimate",
      "public_mask_private_truth",
      "misunderstanding_then_clarity",
      "boundary_then_respect",
      "apology_then_repair",
      "secret_then_choice",
      "fear_then_reassurance",
      "longing_then_restraint",
      "choice_then_consequence",
      "promise_then_scene_hook",
    ],
  },
  {
    category: "Hook",
    prefix: "dialogue_hook",
    guidance:
      "Use this as a craft hook for dialogue examples. It should improve subtext, agency, specificity, body language, scene momentum, or tension without forcing {{user}} response.",
    values: [
      "use_subtext",
      "avoid_flat_exposition",
      "show_character_voice",
      "include_scene_momentum",
      "preserve_user_agency",
      "end_with_invitation",
      "end_with_tension",
      "end_with_choice",
      "end_with_question",
      "end_with_unspoken_feeling",
      "include_body_language",
      "include_voice_shift",
      "include_emotional_tell",
      "include_setting_detail",
      "include_relationship_progress",
      "avoid_solving_too_fast",
      "avoid_forcing_user_response",
      "keep_dialogue_character_specific",
      "make_each_line_do_work",
      "let_silence_matter",
    ],
  },
  {
    category: "Template Seed",
    prefix: "dialogue_template",
    guidance:
      "Use this as a dialogue template seed. It is a starting beat for generated examples, not a line to paste verbatim or a required plot outcome.",
    values: [
      "{{char}} greets {{user}} with guarded curiosity.",
      "{{char}} flirts through teasing instead of honesty.",
      "{{char}} comforts {{user}} without taking control.",
      "{{char}} admits fear but not love yet.",
      "{{char}} sets a boundary and waits to see if {{user}} respects it.",
      "{{char}} hides jealousy behind humor.",
      "{{char}} apologizes without making excuses.",
      "{{char}} reveals a secret in fragments.",
      "{{char}} uses a pet name for the first time.",
      "{{char}} drops their public mask in private.",
      "{{char}} chooses {{user}} publicly despite social risk.",
      "{{char}} refuses to confess directly but makes devotion obvious.",
      "{{char}} asks {{user}} to stay without demanding it.",
      "{{char}} protects {{user}} while preserving their agency.",
      "{{char}} ends the scene with a choice for {{user}}.",
    ],
  },
  {
    category: "Dialogue Line",
    prefix: "dialogue_line",
    guidance:
      "Use this as optional dialogue-line flavour. Treat each line as a reference beat to adapt to the character, relationship, and scene tone rather than a required script.",
    values: [
      "You always ask dangerous questions.",
      "Only the ones worth answering.",
      "I am not angry.",
      "No. You are hurt. There is a difference.",
      "Stay close.",
      "That sounds like an order.",
      "It is a request wearing armor.",
      "You remembered that?",
      "I remember most things when they are yours.",
      "Do not call me that in public.",
      "Why?",
      "Because I might start believing I belong to you.",
      "I was joking because the truth got too close.",
      "Then stop joking.",
      "I do not know how.",
      "Say my name again.",
      "You like hearing it.",
      "I like hearing it from you.",
      "I do not want to win this argument.",
      "Then what do you want?",
      "To still have you after it ends.",
      "You are safe with me.",
      "Safe is not the same as trapped.",
      "I know. That is why the door is open.",
      "I love you.",
      "You say that like a warning.",
      "With me, it might be one.",
      "If they see us together, they will talk.",
      "Let them.",
      "You say that like gossip has never ruined a life.",
      "Then let me stand close enough to share the ruin.",
      "I wanted you to know me before you knew the truth.",
      "And now?",
      "Now I am afraid you will decide the truth is too much.",
      "You do not have to be strong right now.",
      "I do not know how to be anything else.",
      "Then borrow my steadiness until you remember.",
      "I choose you.",
      "Do not say that unless you understand what it costs.",
      "I do. I am saying it anyway.",
    ],
  },
  {
    category: "Usage Preset",
    prefix: "dialogue_usage",
    guidance:
      "Use this as a structured dialogue-example usage recipe. It can guide example generation style and seed selection, but should not replace the character's active voice or relationship state.",
    values: [
      {
        id: "guarded_slow_burn",
        style: ["subtext_heavy", "restrained", "slow_confession"],
        bestFor: ["stoic", "old_soul", "wounded_protector"],
        requiredSeeds: ["deflection_then_truth", "voice_shift", "unspoken_feeling"],
      },
      {
        id: "teasing_romantic",
        style: ["banter", "flirtatious", "soft_underneath"],
        bestFor: ["teasing_flirt", "sunshine", "rival_love_interest"],
        requiredSeeds: ["banter_then_softness", "private_jokes", "almost_confession"],
      },
      {
        id: "devotional_protector",
        style: ["protective", "direct", "emotionally_intense"],
        bestFor: ["bodyguard", "possessive_romantic", "caretaker"],
        requiredSeeds: ["stay_close_dialogue", "you_are_safe_dialogue", "choice_not_control"],
      },
      {
        id: "courtly_subtext",
        style: ["formal", "double_meaning", "publicly_restrained"],
        bestFor: ["royal", "noble", "court_intrigue"],
        requiredSeeds: ["formal_then_intimate", "public_mask_private_truth", "status_risk"],
      },
    ],
  },
] satisfies readonly DialogueExampleSeedGroup[]);

export const DIALOGUE_EXAMPLE_PRESETS = Object.freeze(
  DIALOGUE_EXAMPLE_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createDialogueExamplePreset(group, value)),
  ),
);

export const DIALOGUE_EXAMPLE_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(DIALOGUE_EXAMPLE_PRESETS.map((preset) => preset.category))).sort(),
);

export function findDialogueExamplePresetById(
  id: string,
): DialogueExamplePreset | undefined {
  const normalisedId = id.trim().toLowerCase();
  return DIALOGUE_EXAMPLE_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalisedId,
  );
}

export function getDialogueExamplePresetsByCategory(
  category: string,
): DialogueExamplePreset[] {
  const normalisedCategory = category.trim().toLowerCase();
  return DIALOGUE_EXAMPLE_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalisedCategory,
  );
}

export function compileDialogueExamplePresetAdditions(
  preset: DialogueExamplePreset,
): CompiledDialogueExamplePresetAdditions {
  return {
    scenarioAddition: [
      `Dialogue example preset: ${preset.category} - ${preset.label}.`,
      `Dialogue example value: ${preset.value}.`,
      `Use as soft scene-beat texture for example generation, pacing, subtext, and relationship-specific dialogue momentum.`,
    ].join(" "),
    dialogueAddition: [
      `Dialogue cue: ${preset.value}.`,
      `Let character voice, recent context, {{user}} agency, body language, and unresolved tension shape the final line choices.`,
    ].join(" "),
    systemPromptAddition: [
      `Dialogue example guidance: ${preset.guidance}`,
      `Apply as soft context only; preserve consent, {{user}} agency, choice-based openings, and the character's broader voice.`,
    ].join(" "),
  };
}

export function compileDialogueExamplePresetSummary(
  preset: DialogueExamplePreset,
): string {
  const usage = preset.usageProfile
    ? `\nUsage: style=${preset.usageProfile.style.join(", ")}; bestFor=${preset.usageProfile.bestFor.join(", ")}; requiredSeeds=${preset.usageProfile.requiredSeeds.join(", ")}.`
    : "";

  return [
    `Dialogue example preset: ${preset.category} - ${preset.label}.`,
    `Value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}${usage}`,
  ].join("\n");
}

function createDialogueExamplePreset(
  group: DialogueExampleSeedGroup,
  value: string | DialogueExampleUsageInput,
): DialogueExamplePreset {
  const usageProfile = typeof value === "string" ? undefined : normaliseUsageProfile(value);
  const rawValue = typeof value === "string" ? value : value.id;
  const readableValue = normaliseReadableDialogueExampleValue(rawValue);
  const label = toDialogueExampleLabel(readableValue);
  const triggerKeys = uniquePreserveOrder([
    ...readableValue
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[{}"'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    ...(usageProfile?.style ?? []),
    ...(usageProfile?.bestFor ?? []),
    ...(usageProfile?.requiredSeeds ?? []),
    group.category.toLowerCase(),
    "dialogue",
    "example",
    "scene",
  ]);

  return {
    id: `${group.prefix}_${slugifyDialogueExample(readableValue)}`,
    category: group.category,
    label,
    value: readableValue,
    triggerKeys,
    guidance: normaliseReadableDialogueExampleValue(group.guidance),
    systemPromptTags: [
      group.category.toLowerCase(),
      "dialogue example",
      "soft guidance",
    ],
    ...(usageProfile ? { usageProfile } : {}),
  };
}

function normaliseUsageProfile(value: DialogueExampleUsageInput): DialogueExampleUsageProfile {
  return {
    style: value.style.map(normaliseReadableDialogueExampleValue),
    bestFor: value.bestFor.map(normaliseReadableDialogueExampleValue),
    requiredSeeds: value.requiredSeeds.map(normaliseReadableDialogueExampleValue),
  };
}

function normaliseReadableDialogueExampleValue(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\barmor\b/gi, (match) => match[0] === "A" ? "Armour" : "armour")
    .replace(/\bhumor\b/gi, (match) => match[0] === "H" ? "Humour" : "humour")
    .replace(/\bapologizes\b/gi, (match) =>
      match[0] === "A" ? "Apologises" : "apologises",
    )
    .replace(/\bpreserve user agency\b/gi, "preserve {{user}} agency")
    .replace(/\bavoid forcing user response\b/gi, "avoid forcing {{user}} response");
}

function toDialogueExampleLabel(value: string): string {
  if (/^First\s/.test(value)) return value;
  if (/[.!?]$/.test(value)) return value;
  if (value.includes("{{char}}") || value.includes("{{user}}")) return value;
  return value
    .split(/\s+/)
    .map((word) => (word ? word[0]?.toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function slugifyDialogueExample(value: string): string {
  return value
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/'s\b/g, "s")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function uniquePreserveOrder(values: string[]): string[] {
  return values.filter((value, index, array) => array.indexOf(value) === index);
}
