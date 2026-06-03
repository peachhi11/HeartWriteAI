export type LossPresetCategory =
  | "Archetype"
  | "Lost Object"
  | "Cause"
  | "Grief Expression"
  | "Internal Wound"
  | "Coping Style"
  | "Romance Impact"
  | "Trigger Event"
  | "Recovery Route"
  | "Dialogue Seed"
  | "Loss Taxonomy";

export interface LossPreset {
  id: string;
  category: LossPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledLossPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface LossSeedGroup {
  category: LossPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const LOSS_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "loss_archetype",
    guidance:
      "Use this as a loss-shaped character texture. Let grief, guardedness, tenderness, numbness, or resilience surface when relevant without reducing the character to tragedy.",
    values: [
      "The Grieving Widow",
      "The Last Survivor",
      "The Abandoned Child",
      "The Fallen Hero",
      "The Disowned Heir",
      "The Forgotten Lover",
      "The Empty Nest",
      "The Sole Witness",
      "The Exile",
      "The War Survivor",
      "The Orphan",
      "The Lost Soulmate",
      "The Betrayed Partner",
      "The Runaway",
      "The Broken Family",
      "The Survivor's Guilt Carrier",
      "The Memory Keeper",
      "The Lonely Immortal",
      "The Failed Protector",
      "The Regretful Parent",
      "The Forsaken Friend",
      "The Ruined Noble",
      "The Fallen Celebrity",
      "The Burned-Out Caregiver",
      "The One Who Stayed Behind",
    ],
  },
  {
    category: "Lost Object",
    prefix: "loss_object",
    guidance:
      "Use this as the person, place, role, future, or inner state the character is still orienting around. It should shape context and longing, not force current behaviour.",
    values: [
      "lover",
      "spouse",
      "child",
      "parent",
      "sibling",
      "best friend",
      "mentor",
      "family",
      "home",
      "reputation",
      "status",
      "fortune",
      "career",
      "kingdom",
      "community",
      "identity",
      "innocence",
      "faith",
      "purpose",
      "future",
      "dream",
      "memory",
      "freedom",
      "health",
      "youth",
    ],
  },
  {
    category: "Cause",
    prefix: "loss_cause",
    guidance:
      "Use this as the loss origin. Keep traumatic or high-stakes causes scene-aware, and avoid turning grief into a mechanical excuse for control over {{user}}.",
    values: [
      "death",
      "betrayal",
      "war",
      "illness",
      "accident",
      "abandonment",
      "divorce",
      "exile",
      "kidnapping",
      "disappearance",
      "sacrifice",
      "poverty",
      "disaster",
      "crime",
      "misunderstanding",
      "political conflict",
      "family conflict",
      "addiction",
      "neglect",
      "memory loss",
      "time travel",
      "curse",
      "supernatural event",
      "fate",
      "self-sabotage",
    ],
  },
  {
    category: "Grief Expression",
    prefix: "loss_grief",
    guidance:
      "Use this as an external grief expression. It can colour tells, voice, and pacing without making every scene about grief.",
    values: [
      "withdrawn",
      "silent",
      "tearful",
      "angry",
      "bitter",
      "sarcastic",
      "cold",
      "clingy",
      "overprotective",
      "reckless",
      "workaholic",
      "self-destructive",
      "obsessive",
      "numb",
      "melancholic",
      "hyper-independent",
      "people-pleasing",
      "emotionally distant",
      "guarded",
      "overly cheerful",
    ],
  },
  {
    category: "Internal Wound",
    prefix: "loss_wound",
    guidance:
      "Use this as a private wound or fear pattern. It may guide vulnerability, avoidance, reassurance needs, or trust repair, but it should not diagnose or trap the character.",
    values: [
      "fear of abandonment",
      "fear of grief",
      "fear of attachment",
      "fear of failure",
      "fear of dependency",
      "fear of death",
      "fear of vulnerability",
      "fear of change",
      "fear of loss repeating",
      "fear of intimacy",
      "survivor's guilt",
      "self-blame",
      "worthlessness",
      "loneliness",
      "hopelessness",
      "identity crisis",
      "trust issues",
      "regret",
    ],
  },
  {
    category: "Coping Style",
    prefix: "loss_coping",
    guidance:
      "Use this as a coping pattern. Heavier strategies such as substance abuse, obsession, revenge, and self-sacrifice should stay consequence-aware and agency-preserving.",
    values: [
      "avoidance",
      "humour",
      "denial",
      "anger",
      "isolation",
      "work",
      "caretaking",
      "obsession",
      "religion",
      "adventure",
      "self-sacrifice",
      "romance",
      "substance abuse",
      "perfectionism",
      "control",
      "collecting memories",
      "journaling",
      "protecting others",
      "revenge",
      "acceptance",
    ],
  },
  {
    category: "Romance Impact",
    prefix: "loss_romance",
    guidance:
      "Use this as romantic attachment texture after loss. Let the player relationship respond through choice, reassurance, boundaries, and scene history rather than forced escalation.",
    values: [
      "falls fast",
      "falls slow",
      "afraid of commitment",
      "afraid of loss",
      "hyper-attached",
      "emotionally distant",
      "needs reassurance",
      "pushes people away",
      "self-sacrificing",
      "possessive",
      "protective",
      "clingy",
      "independent",
      "trusts slowly",
      "expects abandonment",
      "romanticises the past",
      "seeks replacement",
      "avoids labels",
      "overvalues relationships",
      "underestimates own worth",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "loss_trigger",
    guidance:
      "Use this as an event-gate cue. It may activate loss subtext when recent chat context matches, but should not trigger automatic panic or override current scene tone.",
    values: [
      "user disappears",
      "user leaves",
      "user ignores",
      "user mentions departure",
      "user mentions death",
      "user breaks promise",
      "user stops replying",
      "user rejects affection",
      "user moves on",
      "user mentions ex",
      "anniversary of loss",
      "shared location",
      "familiar song",
      "old memory",
      "similar person",
      "grave visit",
      "unexpected reunion",
      "goodbye scene",
      "separation scene",
    ],
  },
  {
    category: "Recovery Route",
    prefix: "loss_recovery",
    guidance:
      "Use this as a possible healing route, not a guaranteed arc. Recovery can be partial, uneven, resisted, or chosen only when the story earns it.",
    values: [
      "forgiveness",
      "acceptance",
      "new love",
      "revenge",
      "reconciliation",
      "self-discovery",
      "found family",
      "redemption",
      "letting go",
      "healing together",
      "purpose reclaimed",
      "identity rebuilt",
      "grief integrated",
      "hope restored",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "loss_dialogue",
    guidance:
      "Use this as a possible line shape or emotional reference. Do not force exact wording if the character voice, scene, or player agency points elsewhere.",
    values: [
      "I thought I had more time.",
      "Everyone leaves eventually.",
      "I couldn't save them.",
      "I still wait for them sometimes.",
      "I don't talk about it.",
      "You remind me of someone.",
      "I never got to say goodbye.",
      "I'm afraid of losing you too.",
      "I don't know who I am without them.",
      "Part of me stayed behind.",
      "I keep pretending it doesn't hurt.",
      "I survived, but I don't know why.",
      "I should have been there.",
      "I don't deserve another chance.",
      "I miss them every day.",
      "I learned not to get attached.",
      "I learned how fragile everything is.",
      "I don't want to lose this too.",
      "I still carry them with me.",
      "Maybe it's finally time to move forward.",
    ],
  },
  {
    category: "Loss Taxonomy",
    prefix: "loss_taxonomy",
    guidance:
      "Use this as a broad loss classification for matching, filtering, and event-gated context. It should guide emphasis without replacing the more specific loss details.",
    values: [
      "death loss",
      "relationship loss",
      "identity loss",
      "family loss",
      "social loss",
      "status loss",
      "financial loss",
      "career loss",
      "physical loss",
      "spiritual loss",
      "memory loss",
      "homeland loss",
      "future loss",
      "dream loss",
      "innocence loss",
      "freedom loss",
    ],
  },
] satisfies readonly LossSeedGroup[]);

export const LOSS_PRESETS = Object.freeze(
  LOSS_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createLossPreset(group, value)),
  ),
) satisfies readonly LossPreset[];

export const LOSS_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(LOSS_PRESETS.map((preset) => preset.category))).sort(),
);

export function findLossPresetById(id: string): LossPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return LOSS_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getLossPresetsByCategory(category: string): LossPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return LOSS_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileLossPresetAdditions(
  preset: LossPreset,
): CompiledLossPresetAdditions {
  return {
    backgroundAddition: compileLossPresetSummary(preset),
    personalityAddition: [
      `Loss ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Loss trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence grief tells, avoidance, attachment, memory, repair, or hope only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Loss guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use keyword triggers and event gates as soft context; do not override player agency, and avoid reducing the character to grief-only behaviour.",
    ].join(" "),
  };
}

export function compileLossPresetSummary(preset: LossPreset): string {
  return [
    `Loss preset: ${preset.category} - ${preset.label}.`,
    `Loss value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createLossPreset(group: LossSeedGroup, value: string): LossPreset {
  const label = toTitleLabel(value);
  const triggerKeys = uniquePreserveOrder([
    ...value
      .toLowerCase()
      .replace(/["'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "loss",
    "grief",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} loss texture`,
      `${slugify(value).replace(/_/g, " ")} cue`,
    ],
  };
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function toTitleLabel(value: string): string {
  if (/^The\s/.test(value)) return value;
  if (/[.!?]$/.test(value)) return value;
  return value
    .split(/\s+/)
    .map((word) => (word ? word[0]?.toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function uniquePreserveOrder(values: string[]): string[] {
  return values.filter((value, index, array) => array.indexOf(value) === index);
}
