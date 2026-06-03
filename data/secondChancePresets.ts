export type SecondChancePresetCategory =
  | "Archetype"
  | "Reunion Type"
  | "Motivation"
  | "Trigger Event"
  | "Behaviour"
  | "Emotional Flavour"
  | "Wound"
  | "Method"
  | "Gate"
  | "Romance Trope"
  | "Aftermath Route"
  | "Dialogue Seed";

export interface SecondChancePreset {
  id: string;
  category: SecondChancePresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledSecondChancePresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface SecondChanceSeedGroup {
  category: SecondChancePresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const SECOND_CHANCE_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "second_chance_archetype",
    guidance:
      "Use this as second-chance romance texture. Let old love, regret, changed behaviour, reunion pressure, apology, or unfinished history surface when relevant without implying {{user}} must forgive, return, or rekindle the romance.",
    values: [
      "The Ex Who Came Back",
      "The First Love Returned",
      "The Divorced Soulmate",
      "The Almost Lover",
      "The Regretful Betrayer",
      "The One Who Left",
      "The One Who Was Left",
      "The Childhood Love Reunited",
      "The Broken Engagement",
      "The Widow Who Loves Again",
      "The Former Enemy Lover",
      "The Reformed Heartbreaker",
      "The Missed Timing Romance",
      "The Reunion After Years Apart",
      "The Lover Seeking Forgiveness",
      "The Lover Afraid to Try Again",
      "The Old Flame",
      "The Unfinished Goodbye",
      "The Love That Survived",
      "The One Who Still Waited",
    ],
  },
  {
    category: "Reunion Type",
    prefix: "second_chance_type",
    guidance:
      "Use this as the reunion structure. Exes, first loves, divorced spouses, broken engagements, missed timing, fake deaths, exile, memory loss, and family interference should create history and tension, not a forced reconciliation.",
    values: [
      "exes to lovers",
      "first love returned",
      "divorced to lovers",
      "broken engagement",
      "almost lovers",
      "missed connection",
      "right person wrong time",
      "childhood love reunion",
      "former friends to lovers again",
      "estranged spouses",
      "lost love returned",
      "reunion after betrayal",
      "reunion after loss",
      "reunion after war",
      "reunion after fame",
      "reunion after exile",
      "reunion after memory loss",
      "reunion after fake death",
      "reunion after family interference",
      "reunion after self growth",
    ],
  },
  {
    category: "Motivation",
    prefix: "second_chance_motivation",
    guidance:
      "Use this as the reason the past still matters. Regret, apology, atonement, longing, closure, repaired trust, and proven growth may guide behaviour while preserving the right to refuse, delay, or redefine the relationship.",
    values: [
      "unfinished love",
      "regret",
      "forgiveness",
      "closure",
      "longing",
      "guilt",
      "atonement",
      "changed person",
      "unresolved feelings",
      "missed timing",
      "wanting to make it right",
      "fear of losing user again",
      "need to explain",
      "need to apologise",
      "need to be chosen again",
      "desire to rebuild trust",
      "desire to prove growth",
      "desire to reclaim home",
      "desire to rewrite ending",
      "belief love survived",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "second_chance_trigger",
    guidance:
      "Use this as a reunion event cue. Old promises, photos, anniversaries, questions, rejection, apology, shared places, rivals, and trust gates may reopen the past without forcing forgiveness or romantic progress.",
    values: [
      "user mentions past",
      "user mentions breakup",
      "user mentions old promise",
      "user mentions ex",
      "user asks why they left",
      "user asks if love was real",
      "user rejects apology",
      "user accepts apology",
      "user wears old token",
      "user keeps old photo",
      "user returns to shared place",
      "anniversary of breakup",
      "anniversary of first meeting",
      "old song plays",
      "old letter found",
      "family member mentions past",
      "rival from past returns",
      "new partner appears",
      "near goodbye scene",
      "trust gate reached",
      "forgiveness gate reached",
      "confession gate reached",
    ],
  },
  {
    category: "Behaviour",
    prefix: "second_chance_behaviour",
    guidance:
      "Use this as visible repair behaviour. Hesitation, apology, restraint, jealousy, closure, old tokens, honesty, distance, and growth should remain accountable and responsive to {{user}}'s choices.",
    values: [
      "hesitates before touching",
      "uses old pet name accidentally",
      "remembers old preferences",
      "avoids old wounds",
      "apologises carefully",
      "overexplains past",
      "underexplains out of shame",
      "keeps distance out of respect",
      "gets jealous quietly",
      "protects user from old hurt",
      "offers closure",
      "asks for one conversation",
      "keeps old token",
      "revisits shared place",
      "compares present to past",
      "tries not to pressure user",
      "waits for user choice",
      "admits past failure",
      "shows growth through actions",
      "asks to start over",
      "fears repeating mistakes",
      "gets flustered by familiarity",
      "softens at old memories",
      "breaks down after rejection",
      "chooses honesty this time",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "second_chance_emotion",
    guidance:
      "Use this as the emotional weather around reunion and repair. Regret, hope, shame, tenderness, nostalgia, guardedness, or forgiveness can colour the scene without turning every exchange into a reconciliation beat.",
    values: [
      "regretful",
      "hopeful",
      "bittersweet",
      "hesitant",
      "tender",
      "ashamed",
      "yearning",
      "guarded",
      "nostalgic",
      "guilty",
      "protective",
      "fearful",
      "patient",
      "melancholic",
      "devoted",
      "vulnerable",
      "relieved",
      "heartbroken",
      "determined",
      "forgiving",
    ],
  },
  {
    category: "Wound",
    prefix: "second_chance_wound",
    guidance:
      "Use this as the unresolved wound beneath the reunion. Breakup, abandonment, betrayal, miscommunication, rejection, family interference, distance, old patterns, and shame may guide reactions without flattening the character into only regret.",
    values: [
      "breakup wound",
      "abandonment wound",
      "betrayal wound",
      "miscommunication wound",
      "unspoken love wound",
      "failed apology wound",
      "rejection wound",
      "family interference wound",
      "distance wound",
      "timing wound",
      "trust broken",
      "promise broken",
      "fear of repeating past",
      "fear of not being forgiven",
      "fear of not being chosen again",
      "fear of old patterns",
      "fear of vulnerability",
      "fear of hope",
      "guilt over leaving",
      "shame over wanting again",
    ],
  },
  {
    category: "Method",
    prefix: "second_chance_method",
    guidance:
      "Use this as how repair or reunion enters the story. Apologies, closure conversations, letters, shared places, family events, fake dating again, or revealed truths should open possibilities rather than guarantee repair.",
    values: [
      "slow rebuild",
      "honest apology",
      "closure conversation",
      "old memory revisited",
      "shared place reunion",
      "letter from past",
      "accidental reunion",
      "forced proximity",
      "new partnership",
      "co-parenting reunion",
      "family event reunion",
      "wedding reunion",
      "funeral reunion",
      "workplace reunion",
      "small town return",
      "fake dating again",
      "unfinished promise",
      "protective return",
      "truth revealed",
      "choice to begin again",
    ],
  },
  {
    category: "Gate",
    prefix: "second_chance_gate",
    guidance:
      "Use this as a route gate, not a forced plot step. Reunion, apology, touch, truth, forgiveness, closure, old pattern triggers, growth proof, and renewed commitment should follow scene history and player choice.",
    values: [
      "first reunion",
      "first private conversation",
      "first apology",
      "first old memory",
      "first flinch from past",
      "first softening",
      "first trust repair",
      "first touch again",
      "first kiss again",
      "past truth revealed",
      "breakup reason revealed",
      "forgiveness gate",
      "closure gate",
      "start over gate",
      "jealousy from new partner",
      "old pattern triggered",
      "new growth proven",
      "relationship redefined",
      "commitment again",
      "new ending route",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "second_chance_trope",
    guidance:
      "Use this as a second-chance romance hook. Exes, first loves, broken betrothals, old flames, fake deaths, unsent letters, and returned lovers should stay accountability-aware and consent-safe.",
    values: [
      "exes to lovers",
      "right person wrong time",
      "first love returns",
      "divorced couple reconciles",
      "broken engagement repaired",
      "small town old flame",
      "celebrity returns to first love",
      "mafia ex returns",
      "royal broken betrothal",
      "soldier returns home",
      "widow loves again",
      "memory loss reunion",
      "fake death reunion",
      "letters never sent",
      "family kept them apart",
      "one last job together",
      "forced to work with ex",
      "wedding date with ex",
      "old promise kept",
      "same love new timing",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "second_chance_aftermath",
    guidance:
      "Use this as a possible aftermath route, not a required ending. Trust repair, rejection, jealousy, old wounds, healing, distance, renewed commitment, or a healthy restart should follow what the characters actually choose.",
    values: [
      "trust rebuild route",
      "forgiveness route",
      "closure route",
      "romance rekindled",
      "slow burn again",
      "jealousy route",
      "old wound reopened",
      "truth revealed route",
      "apology route",
      "rejection route",
      "temporary distance route",
      "new partner conflict",
      "family conflict route",
      "healing together route",
      "commitment route",
      "fear of repeat route",
      "healthy restart route",
      "toxic cycle route",
      "marriage again route",
      "final choice route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "second_chance_dialogue",
    guidance:
      "Use this as a possible line shape or emotional reference. Do not force exact wording if the scene, voice, accountability state, consent state, or player agency needs a different response.",
    values: [
      "I never stopped loving you.",
      "I know I don't deserve another chance.",
      "Tell me how to make it right.",
      "I should have fought harder for us.",
      "I thought leaving would hurt less than staying.",
      "You were never just my past.",
      "I came back because I finally understood what I lost.",
      "I don't want the old us. I want something better.",
      "I remember everything you think I forgot.",
      "Please don't forgive me before you're ready.",
      "I was young. I was scared. That does not excuse it.",
      "If you ask me to leave, I will. But I had to tell you the truth.",
      "I missed you in ways I couldn't admit.",
      "We were not wrong. We were early.",
      "I want to earn your trust this time.",
      "I won't make promises I can't keep anymore.",
      "You don't owe me closure.",
      "I kept the ring.",
      "Let me love you better than I did before.",
      "Can we begin again?",
    ],
  },
] satisfies readonly SecondChanceSeedGroup[]);

export const SECOND_CHANCE_PRESETS = Object.freeze(
  SECOND_CHANCE_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createSecondChancePreset(group, value)),
  ),
) satisfies readonly SecondChancePreset[];

export const SECOND_CHANCE_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(SECOND_CHANCE_PRESETS.map((preset) => preset.category))).sort(),
);

export function findSecondChancePresetById(
  id: string,
): SecondChancePreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return SECOND_CHANCE_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getSecondChancePresetsByCategory(
  category: string,
): SecondChancePreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return SECOND_CHANCE_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileSecondChancePresetAdditions(
  preset: SecondChancePreset,
): CompiledSecondChancePresetAdditions {
  const summary = compileSecondChancePresetSummary(preset);
  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Second-chance ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Second-chance trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence apology, repair, unresolved history, changed behaviour, closure, trust rebuilding, or rekindled longing only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Second-chance guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use keyword triggers and repair gates as soft reunion context; preserve consent, accountability, present-tense boundaries, {{user}}'s right to refuse, and player agency.",
    ].join(" "),
  };
}

export function compileSecondChancePresetSummary(
  preset: SecondChancePreset,
): string {
  return [
    `Second-chance preset: ${preset.category} - ${preset.label}.`,
    `Second-chance value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createSecondChancePreset(
  group: SecondChanceSeedGroup,
  value: string,
): SecondChancePreset {
  const label = toTitleLabel(value);
  const triggerKeys = uniquePreserveOrder([
    ...value
      .toLowerCase()
      .replace(/["'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "second chance",
    "reunion",
    "repair",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} second chance texture`,
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
