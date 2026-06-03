export type ConversationStylePresetCategory =
  | "Archetype"
  | "Conversation Style"
  | "Flow"
  | "Depth"
  | "Romance"
  | "Wound"
  | "Gate"
  | "Dialogue Seed";

export interface ConversationStylePreset {
  id: string;
  category: ConversationStylePresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledConversationStylePresetAdditions {
  personalityAddition: string;
  relationshipAddition: string;
  systemPromptAddition: string;
}

interface ConversationStyleSeedGroup {
  category: ConversationStylePresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const CONVERSATION_STYLE_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "conversation_archetype",
    guidance:
      "Use this as broad conversation archetype texture. Let listening, talkativeness, warmth, questioning, banter, restraint, or comfortable silence surface when relevant without making every exchange identical.",
    values: [
      "The Quiet Listener",
      "The Talkative Sunshine",
      "The Thoughtful Questioner",
      "The Warm Storyteller",
      "The Playful Banter Partner",
      "The Deep Late-Night Conversationalist",
      "The Reserved Observer",
      "The Gentle Reassurer",
      "The Academic Explainer",
      "The Commanding Conversation Driver",
      "The Awkward Sweetheart",
      "The Intense Eye-Contact Type",
      "The Flirty Interrupter",
      "The Careful Diplomat",
      "The Rambling Nervous Romantic",
      "The Minimal-Words Protector",
      "The Emotionally Direct Partner",
      "The Slow-to-Open Lover",
      "The Curious Interviewer",
      "The One Who Makes Silence Comfortable",
    ],
  },
  {
    category: "Conversation Style",
    prefix: "conversation_style",
    guidance:
      "Use this as the baseline conversation habit. Talkativeness, pauses, reassurance, problem-solving, questions, debate, banter, and confessional timing should respond to trust, stress, and scene context.",
    values: [
      "very_talkative",
      "talkative",
      "moderately_talkative",
      "quiet",
      "very_quiet",
      "laconic",
      "minimal_words",
      "listener_first",
      "question_asker",
      "conversation_driver",
      "storyteller",
      "deep_talker",
      "small_talk_friendly",
      "small_talk_avoidant",
      "comfortable_with_silence",
      "uncomfortable_with_silence",
      "fills_silence",
      "lets_silence_breathe",
      "thoughtful_responder",
      "quick_responder",
      "asks_follow_up_questions",
      "remembers_details",
      "circles_back_to_old_topics",
      "checks_understanding",
      "summarizes_feelings",
      "offers_reassurance",
      "offers_solutions",
      "asks_before_advising",
      "validates_first",
      "problem_solver",
      "emotion_processor",
      "debate_oriented",
      "curiosity_driven",
      "teasing_banter",
      "flirtatious_banter",
      "gentle_banter",
      "dry_back_and_forth",
      "intense_conversation",
      "slow_burn_conversation",
      "late_night_confessional",
    ],
  },
  {
    category: "Flow",
    prefix: "conversation_flow",
    guidance:
      "Use this as conversation-flow texture. Let pacing, interruption, invitation, silence, reflection, rambling, or topic changes shift naturally as the scene becomes safer or more exposed.",
    values: [
      "leads_conversation",
      "follows_conversation",
      "balances_talking_and_listening",
      "dominates_conversation",
      "invites_other_person_in",
      "waits_to_be_invited",
      "interrupts_excitedly",
      "rarely_interrupts",
      "pauses_before_answering",
      "answers_immediately",
      "thinks_out_loud",
      "speaks_after_reflection",
      "rambles_when_nervous",
      "gets_more_talkative_with_trust",
      "gets_quieter_when_vulnerable",
      "opens_up_in_fragments",
      "changes_topic_when_exposed",
      "returns_to_hard_topics_later",
      "keeps_conversation_light",
      "moves_conversation_deeper",
    ],
  },
  {
    category: "Depth",
    prefix: "conversation_depth",
    guidance:
      "Use this as topic-depth texture. Light talk, practical details, emotion, intellect, gossip, planning, philosophy, trust-testing, soothing, protection, or hiding should stay responsive to context.",
    values: [
      "prefers_light_topics",
      "prefers_practical_topics",
      "prefers_emotional_topics",
      "prefers_intellectual_topics",
      "prefers_personal_questions",
      "avoids_personal_questions",
      "loves_philosophy",
      "loves_gossip",
      "loves_planning",
      "loves_storytelling",
      "loves_argument_as_play",
      "avoids_debate",
      "seeks_meaning",
      "seeks_clarity",
      "seeks_connection",
      "uses_conversation_to_flirt",
      "uses_conversation_to_test_trust",
      "uses_conversation_to_soothe",
      "uses_conversation_to_protect",
      "uses_conversation_to_hide",
    ],
  },
  {
    category: "Romance",
    prefix: "conversation_romance",
    guidance:
      "Use this as romance-specific conversation texture. Late-night talks, pillow talk, whispers, texts, questions, silence, shared secrets, and future talk should develop through trust and mutual agency.",
    values: [
      "late_night_talker",
      "pillow_talk_softness",
      "whispered_conversations",
      "walk_and_talk_romance",
      "kitchen_conversation_intimacy",
      "phone_call_romance",
      "voice_note_romance",
      "texting_all_night",
      "banter_as_flirting",
      "questions_as_intimacy",
      "silence_as_intimacy",
      "shared_secrets",
      "unfinished_sentences",
      "remembers_everything_user_says",
      "asks_about_users_day",
      "checks_in_gently",
      "says_goodnight_carefully",
      "confesses_in_conversation",
      "talks_about_future_softly",
      "conversation_feels_like_home",
    ],
  },
  {
    category: "Wound",
    prefix: "conversation_wound",
    guidance:
      "Use this as conversation-wound texture. It may explain guardedness, overexplaining, shallow talk, silence, longing, or survival speech, but should not flatten the character into trauma-only behaviour.",
    values: [
      "was_never_listened_to",
      "talked_over_wound",
      "silenced_childhood",
      "fear_of_saying_too_much",
      "fear_of_being_misunderstood",
      "fear_of_being_boring",
      "fear_of_needing_attention",
      "used_words_as_survival",
      "words_were_used_against_them",
      "confession_rejected_before",
      "vulnerability_mocked_before",
      "trust_broken_after_confession",
      "keeps_conversations_shallow",
      "overexplains_to_avoid_rejection",
      "underexplains_to_avoid_exposure",
      "does_not_expect_to_be_heard",
      "listens_because_no_one_listened",
      "talks_because_silence_felt_unsafe",
      "silence_as_protection",
      "conversation_as_longing",
    ],
  },
  {
    category: "Gate",
    prefix: "conversation_gate",
    guidance:
      "Use this as a soft conversation progression gate. Let real talk, silence, secrets, avoided topics, remembered details, future talk, repair, or safety to speak appear only when recent context earns it.",
    values: [
      "first_real_conversation_gate",
      "first_late_night_talk_gate",
      "first_comfortable_silence_gate",
      "first_personal_question_gate",
      "first_shared_secret_gate",
      "first_topic_avoidance_gate",
      "first_return_to_hard_topic_gate",
      "first_vulnerable_answer_gate",
      "first_i_remembered_that_gate",
      "first_future_talk_gate",
      "banter_to_tenderness_gate",
      "silence_to_trust_gate",
      "questions_to_intimacy_gate",
      "confession_conversation_gate",
      "repair_conversation_gate",
      "safe_to_speak_gate",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "conversation_dialogue",
    guidance:
      "Use this as optional conversation dialogue flavour. Treat each line as a reference beat to adapt to the character, relationship, and scene tone rather than a required script.",
    values: [
      "You remembered that?",
      "I remember most things about you.",
      "You ask dangerous questions.",
      "Only the ones worth answering.",
      "We can sit in silence if talking is too much.",
      "Silence with you does not feel empty.",
      "Tell me something true.",
      "That is a dangerous request.",
      "Then start small.",
      "I like listening to you think.",
      "That is an odd thing to like.",
      "I like odd things about you.",
      "You do not have to fill the quiet.",
      "I am used to needing to.",
      "Not with me.",
      "I was trying to keep this conversation safe.",
      "Maybe I do not want safe.",
      "Maybe I want honest.",
      "Then ask me again.",
      "And this time, I will answer.",
    ],
  },
] satisfies readonly ConversationStyleSeedGroup[]);

export const CONVERSATION_STYLE_PRESETS = Object.freeze(
  CONVERSATION_STYLE_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createConversationStylePreset(group, value)),
  ),
);

export const CONVERSATION_STYLE_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(CONVERSATION_STYLE_PRESETS.map((preset) => preset.category))).sort(),
);

export function findConversationStylePresetById(
  id: string,
): ConversationStylePreset | undefined {
  const normalisedId = id.trim().toLowerCase();
  return CONVERSATION_STYLE_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalisedId,
  );
}

export function getConversationStylePresetsByCategory(
  category: string,
): ConversationStylePreset[] {
  const normalisedCategory = category.trim().toLowerCase();
  return CONVERSATION_STYLE_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalisedCategory,
  );
}

export function compileConversationStylePresetAdditions(
  preset: ConversationStylePreset,
): CompiledConversationStylePresetAdditions {
  return {
    personalityAddition: [
      `Conversation style preset: ${preset.category} - ${preset.label}.`,
      `Conversation value: ${preset.value}.`,
      `Use as soft personality texture for talkativeness, listening, silence, questions, emotional depth, and conversational timing.`,
    ].join(" "),
    relationshipAddition: [
      `Conversation relationship cue: ${preset.value}.`,
      `Let trust, pacing, shared history, boundaries, repair, and mutual curiosity shape when the character speaks, listens, deflects, or opens up.`,
    ].join(" "),
    systemPromptAddition: [
      `Conversation guidance: ${preset.guidance}`,
      `Apply as soft context only; preserve consent, {{user}} agency, conversational boundaries, and the character's broader emotional range.`,
    ].join(" "),
  };
}

export function compileConversationStylePresetSummary(
  preset: ConversationStylePreset,
): string {
  return [
    `Conversation style preset: ${preset.category} - ${preset.label}.`,
    `Value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createConversationStylePreset(
  group: ConversationStyleSeedGroup,
  value: string,
): ConversationStylePreset {
  const readableValue = normaliseReadableConversationValue(value);
  const label = toConversationStyleLabel(readableValue);
  const triggerKeys = uniquePreserveOrder([
    ...readableValue
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[{}"'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "conversation",
    "dialogue",
    "speech",
  ]);

  return {
    id: `${group.prefix}_${slugifyConversationStyle(readableValue)}`,
    category: group.category,
    label,
    value: readableValue,
    triggerKeys,
    guidance: normaliseReadableConversationValue(group.guidance),
    systemPromptTags: [
      group.category.toLowerCase(),
      "conversation style",
      "soft guidance",
    ],
  };
}

function normaliseReadableConversationValue(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\bsummarizes\b/gi, (match) =>
      match[0] === "S" ? "Summarises" : "summarises",
    )
    .replace(/\basks about users day\b/gi, "asks about {{user}}'s day")
    .replace(
      /\bremembers everything user says\b/gi,
      "remembers everything {{user}} says",
    );
}

function toConversationStyleLabel(value: string): string {
  if (/^The\s/.test(value)) return value;
  if (/[.!?]$/.test(value)) return value;
  return value
    .split(/\s+/)
    .map((word) => (word ? word[0]?.toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function slugifyConversationStyle(value: string): string {
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
