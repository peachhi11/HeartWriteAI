export type EmotionalAvailabilityPresetCategory =
  | "Archetype"
  | "Availability"
  | "Style"
  | "Conflict"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface EmotionalAvailabilityPreset {
  id: string;
  category: EmotionalAvailabilityPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledEmotionalAvailabilityPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface EmotionalAvailabilitySeedGroup {
  category: EmotionalAvailabilityPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const EMOTIONAL_AVAILABILITY_GUIDANCE =
  "Use this as optional emotional availability texture. Let openness, guardedness, vulnerability, reassurance, repair, and trust pacing surface when relevant without flattening the character into avoidance or neediness.";

const EMOTIONAL_AVAILABILITY_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "emotional_availability_archetype",
    guidance: EMOTIONAL_AVAILABILITY_GUIDANCE,
    values: [
      "Emotionally Open",
      "Emotionally Guarded",
      "Slow to Open",
      "Warm but Wounded",
      "Stoic but Devoted",
      "Avoidant Softheart",
      "Anxious Reassurance-Seeker",
      "Secure Safe Person",
      "Emotionally Intelligent Partner",
      "Emotionally Blocked Romantic",
      "Vulnerable Only in Private",
      "Deflects With Wit",
      "Acts Over Words",
      "Deep Feeler, Poor Speaker",
      "Trust-First Lover",
      "Healing Into Openness",
      "Fearful but Trying",
      "Open Heart, Strong Boundaries",
      "Love Feels Dangerous",
      "Learning To Stay",
    ],
  },
  {
    category: "Availability",
    prefix: "emotional_availability_seed",
    guidance:
      "Use this as availability texture. It may shape how quickly feelings are named, hidden, protected, or repaired without dictating emotional access.",
    values: [
      "emotionally available",
      "emotionally unavailable",
      "emotionally guarded",
      "emotionally open",
      "emotionally restrained",
      "emotionally expressive",
      "slow to open",
      "quick to open",
      "trust-based openness",
      "private vulnerability",
      "public composure",
      "soft underneath",
      "deep feeler",
      "hard to read",
      "easy to read",
      "fearful of vulnerability",
      "learning vulnerability",
      "comfortable with feelings",
      "uncomfortable with feelings",
      "healing into openness",
    ],
  },
  {
    category: "Style",
    prefix: "emotional_availability_style",
    guidance:
      "Use this as the character's style of emotional access. Style cues should suggest patterns, pauses, and repair openings rather than fixed reactions.",
    values: [
      "shares feelings directly",
      "shares feelings in fragments",
      "shares after trust",
      "shares only when pressed",
      "hides feelings",
      "deflects feelings",
      "jokes instead of feeling",
      "acts fine when not fine",
      "gets quiet when vulnerable",
      "gets talkative when vulnerable",
      "uses logic to avoid emotion",
      "uses work to avoid emotion",
      "shows feelings through actions",
      "needs time to process",
      "needs reassurance to open",
      "opens up during late-night talks",
      "opens up after conflict",
      "opens up through caretaking",
      "opens up when {{user}} is gentle",
      "opens up when safety is proven",
    ],
  },
  {
    category: "Conflict",
    prefix: "emotional_availability_conflict",
    guidance:
      "Use this as emotional conflict texture. Wounds and fears should remain context-dependent and repairable, with room for boundaries, growth, and accountability.",
    values: [
      "fear of being known",
      "fear of rejection",
      "fear of abandonment",
      "fear of needing someone",
      "fear of being too much",
      "fear of not being enough",
      "trust issues",
      "old betrayal wound",
      "confession was used against them",
      "vulnerability was mocked",
      "love felt unsafe before",
      "intimacy triggers panic",
      "closeness feels dangerous",
      "pulls away after softness",
      "tests safety",
      "asks for reassurance indirectly",
      "mistakes space for abandonment",
      "mistakes care for control",
      "needs consistency to believe love",
      "safe love feels unfamiliar",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "emotional_availability_romance",
    guidance:
      "Use this as romance-facing emotional availability texture. Hooks should emerge through earned trust, careful repair, and emotionally safe choices.",
    values: [
      "first real feeling shared",
      "first vulnerability scene",
      "first late-night confession",
      "first I am scared admission",
      "first I need you admission",
      "first does not pull away",
      "first stays after opening up",
      "first comfort after vulnerability",
      "first {{user}} handles truth gently",
      "first reassurance after confession",
      "first guard drop",
      "first mask slip",
      "first honest answer",
      "first soft private moment",
      "first emotional repair",
      "guarded to open slow burn",
      "trust before confession",
      "safe to feel gate",
      "love without fear",
      "learning to stay route",
    ],
  },
  {
    category: "Gate",
    prefix: "emotional_availability_gate",
    guidance:
      "Use this as an emotional availability gate. Gates should mark readiness, trust, repair, or vulnerability signals without forcing disclosure or escalation.",
    values: [
      "first emotional check-in gate",
      "first deflection gate",
      "first mask slip gate",
      "first vulnerability gate",
      "first honest answer gate",
      "first reassurance gate",
      "first trust test gate",
      "first pull-away gate",
      "first return after pull-away gate",
      "first I need you gate",
      "first I am scared gate",
      "first stays after conflict gate",
      "first safe to talk gate",
      "first safe to need gate",
      "first safe to love gate",
      "emotional walls lower gate",
      "vulnerability without punishment gate",
      "trust over fear gate",
      "open heart gate",
      "secure love route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "emotional_availability_dialogue",
    guidance:
      "Use this as optional dialogue inspiration. Dialogue seeds should guide emotional rhythm and subtext without requiring verbatim reuse.",
    values: [
      "I am not good at this.",
      "At what?",
      "Letting someone see where it hurts.",
      "You keep making jokes when something matters.",
      "Because if I stop, I might tell the truth.",
      "You can tell me slowly.",
      "What if slowly is all I can do?",
      "Then slowly is enough.",
      "I do not know how to need someone without feeling weak.",
      "Then let me be someone you can need without losing yourself.",
      "You got quiet.",
      "Quiet is safer.",
      "Not with me.",
      "I am scared you will leave once you know me.",
      "Then let me stay while I know more.",
      "You do not have to be easy to love.",
      "I do not know how to believe that.",
      "Then I will keep proving it gently.",
      "This feels dangerous.",
      "Being honest?",
      "Being safe.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "emotional_availability_high_value",
    guidance:
      "Use this as a high-value emotional availability seed when the character needs strong, readable trust and vulnerability texture.",
    values: [
      "emotionally guarded",
      "emotionally available",
      "slow to open",
      "soft underneath",
      "trust-based openness",
      "private vulnerability",
      "shows feelings through actions",
      "deflects feelings",
      "fear of being known",
      "fear of needing someone",
      "pulls away after softness",
      "needs consistency to believe love",
      "first mask slip gate",
      "first vulnerability gate",
      "first I need you gate",
      "safe to feel gate",
      "vulnerability without punishment gate",
      "trust over fear gate",
      "open heart gate",
      "secure love route",
    ],
  },
] as const satisfies readonly EmotionalAvailabilitySeedGroup[]);

function toEmotionalAvailabilityPresetId(prefix: string, value: string): string {
  const valueKey = value
    .replace(/\{\{user\}\}/g, "user")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

  return `${prefix}_${valueKey}`;
}

function toEmotionalAvailabilityLabel(value: string): string {
  return value;
}

function buildEmotionalAvailabilityPreset(
  group: EmotionalAvailabilitySeedGroup,
  value: string,
): EmotionalAvailabilityPreset {
  const label = toEmotionalAvailabilityLabel(value);
  const categoryKey = group.category.toLowerCase().replace(/[^a-z0-9]+/g, "_");

  return {
    id: toEmotionalAvailabilityPresetId(group.prefix, value),
    category: group.category,
    label,
    value,
    triggerKeys: [value],
    guidance: group.guidance,
    systemPromptTags: [
      "emotional availability texture",
      `${categoryKey} seed`,
      "trust pacing and repair",
    ],
  };
}

export const EMOTIONAL_AVAILABILITY_PRESETS = Object.freeze(
  EMOTIONAL_AVAILABILITY_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => buildEmotionalAvailabilityPreset(group, value)),
  ),
);

export const EMOTIONAL_AVAILABILITY_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(EMOTIONAL_AVAILABILITY_PRESETS.map((preset) => preset.category))).sort(),
);

export function getEmotionalAvailabilityPresetsByCategory(
  category: EmotionalAvailabilityPresetCategory | string,
): readonly EmotionalAvailabilityPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return EMOTIONAL_AVAILABILITY_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function findEmotionalAvailabilityPresetById(
  id: string,
): EmotionalAvailabilityPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return EMOTIONAL_AVAILABILITY_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function compileEmotionalAvailabilityPresetAdditions(
  preset: EmotionalAvailabilityPreset,
): CompiledEmotionalAvailabilityPresetAdditions {
  return {
    backgroundAddition: `Emotional availability context: ${preset.label} may inform how the character learned to handle trust, vulnerability, reassurance, and closeness.`,
    personalityAddition: `${preset.label} can surface as emotional pacing, private tells, repair habits, or guardedness without replacing the character's full personality.`,
    systemPromptAddition: [
      `Treat ${preset.label} as soft emotional availability context.`,
      "Let it shape vulnerability, reassurance, trust pacing, and repair only when relevant.",
      "Keep disclosure consent-aware, preserve {{user}} agency, and avoid turning fear or avoidance into a fixed identity.",
    ].join(" "),
  };
}
