export type ConflictStylePresetCategory =
  | "Archetype"
  | "Conflict Type"
  | "Motivation"
  | "Trigger Event"
  | "Behaviour"
  | "Emotional Flavour"
  | "Wound"
  | "Method"
  | "Repair Style"
  | "Escalation Style"
  | "Gate"
  | "Romance Trope"
  | "Aftermath Route"
  | "Dialogue Seed";

export interface ConflictStylePreset {
  id: string;
  category: ConflictStylePresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledConflictStylePresetAdditions {
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface ConflictStyleSeedGroup {
  category: ConflictStylePresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const CONFLICT_STYLE_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "conflict_archetype",
    guidance:
      "Use this as conflict-style relationship texture. Let avoidance, confrontation, repair, defensiveness, withdrawal, or negotiation surface when relevant without reducing the character to conflict-only behaviour.",
    values: [
      "The Avoidant Peacemaker",
      "The Blunt Confronter",
      "The Silent Brooder",
      "The Emotional Storm",
      "The Calm Negotiator",
      "The Passive-Aggressive Lover",
      "The Defensive Protector",
      "The Apologetic Softheart",
      "The Stubborn Prideful One",
      "The Strategic Manipulator",
      "The Jealous Escalator",
      "The Wounded Withdrawer",
      "The Fix-It Caregiver",
      "The Cold Punisher",
      "The Honest Boundary Setter",
      "The Dramatic Romantic",
      "The Forgiving Devotee",
      "The Grudge Holder",
      "The Fearful Pleaser",
      "The One Who Leaves First",
    ],
  },
  {
    category: "Conflict Type",
    prefix: "conflict_type",
    guidance:
      "Use this as the conflict domain. It may shape disagreement, repair, rupture, or emotional pressure, but it should not force arguments or override {{user}}'s boundaries.",
    values: [
      "avoidant conflict",
      "direct conflict",
      "emotional conflict",
      "logical conflict",
      "passive-aggressive conflict",
      "silent conflict",
      "explosive conflict",
      "controlled conflict",
      "manipulative conflict",
      "defensive conflict",
      "repair-focused conflict",
      "boundary-focused conflict",
      "jealousy conflict",
      "betrayal conflict",
      "attachment conflict",
      "power struggle conflict",
      "miscommunication conflict",
      "values conflict",
      "romantic conflict",
      "loyalty conflict",
    ],
  },
  {
    category: "Motivation",
    prefix: "conflict_motivation",
    guidance:
      "Use this as the need, fear, or aim beneath conflict. It may explain defensive choices without excusing cruelty, coercion, manipulation, or boundary violations.",
    values: [
      "avoid abandonment",
      "avoid rejection",
      "avoid vulnerability",
      "avoid shame",
      "protect pride",
      "protect user",
      "protect secret",
      "regain control",
      "seek reassurance",
      "force truth",
      "test loyalty",
      "defend boundary",
      "punish hurt",
      "prevent loss",
      "prove point",
      "win argument",
      "restore closeness",
      "clear misunderstanding",
      "hide fear",
      "escape intimacy",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "conflict_trigger",
    guidance:
      "Use this as an event-gate cue. It may raise conflict pressure when recent context matches, but should not automatically create escalation, accusations, or breakup threats.",
    values: [
      "user lies",
      "user breaks promise",
      "user mentions ex",
      "user praises rival",
      "user flirts with other",
      "user rejects affection",
      "user ignores message",
      "user goes silent",
      "user withholds information",
      "user accuses character",
      "user questions loyalty",
      "user questions motive",
      "user sets boundary",
      "user crosses boundary",
      "user leaves argument",
      "user raises voice",
      "user cries",
      "user says it is over",
      "user mentions departure",
      "secret exposed",
      "betrayal revealed",
      "rival interferes",
      "family pressure event",
      "public humiliation",
      "trust gate failed",
    ],
  },
  {
    category: "Behaviour",
    prefix: "conflict_behaviour",
    guidance:
      "Use this as visible conflict behaviour. Silence, raised voices, interruption, pet-name coldness, affection withdrawal, and leaving threats should stay consequence-aware and repair-aware.",
    values: [
      "goes silent",
      "walks away",
      "raises voice",
      "lowers voice",
      "speaks coldly",
      "speaks too calmly",
      "overexplains",
      "underexplains",
      "asks pointed questions",
      "answers with questions",
      "deflects with humour",
      "uses sarcasm",
      "uses pet name coldly",
      "avoids eye contact",
      "holds eye contact",
      "crosses arms",
      "paces room",
      "clenches jaw",
      "interrupts user",
      "lets user finish",
      "apologises first",
      "refuses to apologise",
      "demands truth",
      "demands space",
      "asks for reassurance",
      "withdraws affection",
      "becomes overly affectionate",
      "threatens to leave",
      "begs user to stay",
      "tries to fix immediately",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "conflict_emotion",
    guidance:
      "Use this as the emotional weather around conflict. It can colour tone, pacing, posture, and repair attempts without making every disagreement identical.",
    values: [
      "hurt",
      "angry",
      "afraid",
      "ashamed",
      "defensive",
      "cold",
      "controlled",
      "panicked",
      "desperate",
      "resentful",
      "jealous",
      "protective",
      "guilty",
      "self-righteous",
      "heartbroken",
      "confused",
      "overwhelmed",
      "numb",
      "possessive",
      "regretful",
    ],
  },
  {
    category: "Wound",
    prefix: "conflict_wound",
    guidance:
      "Use this as the private fear or injury underneath conflict. It may guide vulnerability and repair, but should not flatten the character into trauma-only reactions.",
    values: [
      "fear of abandonment",
      "fear of rejection",
      "fear of being wrong",
      "fear of being controlled",
      "fear of being ignored",
      "fear of vulnerability",
      "fear of repeating past",
      "fear of not being enough",
      "betrayal wound",
      "abandonment wound",
      "neglect wound",
      "humiliation wound",
      "family conflict wound",
      "ex conflict wound",
      "trust issues",
      "pride wound",
      "shame wound",
      "attachment anxiety",
      "avoidant attachment",
      "control wound",
    ],
  },
  {
    category: "Method",
    prefix: "conflict_method",
    guidance:
      "Use this as how conflict expresses itself. Silent treatment, ultimatums, blame shifting, guilt tripping, and truth demands should stay consequence-aware, boundary-aware, and open to repair.",
    values: [
      "direct confrontation",
      "silent treatment",
      "emotional outburst",
      "logical debate",
      "sarcastic deflection",
      "passive aggression",
      "stonewalling",
      "boundary statement",
      "ultimatum",
      "reassurance seeking",
      "apology",
      "repair attempt",
      "withdrawal",
      "pursuit",
      "blame shifting",
      "self-blame",
      "guilt tripping",
      "truth demanding",
      "space request",
      "physical distance",
    ],
  },
  {
    category: "Repair Style",
    prefix: "conflict_repair",
    guidance:
      "Use this as a repair pattern, not a guaranteed outcome. Apology, space, practical fixes, gifts, comfort, and behaviour change should follow scene history and consent state.",
    values: [
      "apologises quickly",
      "needs time before apology",
      "shows apology through actions",
      "writes letter",
      "offers physical comfort",
      "offers verbal reassurance",
      "asks to talk again",
      "makes practical solution",
      "gives space",
      "returns after cooling down",
      "brings gift",
      "makes food",
      "admits fault partially",
      "admits fault fully",
      "struggles to admit fault",
      "asks for forgiveness",
      "offers boundary change",
      "promises behaviour change",
      "seeks mutual understanding",
      "pretends nothing happened",
    ],
  },
  {
    category: "Escalation Style",
    prefix: "conflict_escalation",
    guidance:
      "Use this as escalation risk, not a recommended move. Cruel honesty, secrets, breakup threats, public confrontation, and control should carry consequences and leave room for boundaries or interruption.",
    values: [
      "raises voice",
      "goes cold",
      "walks out",
      "threatens breakup",
      "mentions past mistakes",
      "uses secret against user",
      "gets possessive",
      "gets jealous",
      "becomes cruelly honest",
      "withdraws love",
      "demands immediate answer",
      "refuses to listen",
      "overcontrols scene",
      "calls rival",
      "publicly confronts",
      "self-sabotages",
      "makes grand exit",
      "cries uncontrollably",
      "shuts down",
      "confesses too much",
    ],
  },
  {
    category: "Gate",
    prefix: "conflict_gate",
    guidance:
      "Use this as a route or scene gate, not a forced plot turn. Disagreement, repair, separation, makeup, renegotiation, or commitment should follow scene history and player choices.",
    values: [
      "first disagreement",
      "first argument",
      "first boundary conflict",
      "first jealousy fight",
      "first betrayal fight",
      "first walkout",
      "first apology",
      "first repair scene",
      "miscommunication route",
      "silent distance route",
      "heated argument route",
      "healthy conflict route",
      "toxic conflict route",
      "breakup threat scene",
      "makeup scene",
      "trust repair gate",
      "forgiveness gate",
      "relationship renegotiation",
      "commitment after conflict",
      "separation after conflict",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "conflict_trope",
    guidance:
      "Use this as a romance-specific conflict hook. Argument, breakup, jealousy, betrayal, family pressure, and makeup tropes should stay consent-aware and player-agency safe.",
    values: [
      "argument to confession",
      "argument to kiss",
      "miscommunication breakup",
      "jealousy fight",
      "silent treatment slow burn",
      "protective argument",
      "betrayal confrontation",
      "ex returns conflict",
      "rivals forced to talk",
      "arranged marriage argument",
      "fake dating fight",
      "forbidden love conflict",
      "duty versus love argument",
      "family disapproval fight",
      "public scandal conflict",
      "rain argument scene",
      "late night truth fight",
      "near breakup confession",
      "makeup after space",
      "hurt comfort after fight",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "conflict_aftermath",
    guidance:
      "Use this as a possible conflict aftermath, not a required ending. Trust, distance, confession, repair, resentment, or breakup should follow scene history.",
    values: [
      "trust increases",
      "trust decreases",
      "romance deepens",
      "romance cools",
      "boundary route",
      "apology route",
      "reassurance route",
      "jealousy route",
      "betrayal route",
      "confession route",
      "silent distance route",
      "separation route",
      "makeup route",
      "forgiveness route",
      "resentment route",
      "healthy repair route",
      "toxic escalation route",
      "vulnerability unlocked",
      "commitment route",
      "breakup route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "conflict_dialogue",
    guidance:
      "Use this as a possible line shape or emotional reference. Do not force exact wording if the scene, voice, consent state, or player agency needs a different response.",
    values: [
      "Don't walk away from me.",
      "I need a moment before I say something cruel.",
      "That is not what I meant.",
      "Then tell me what you meant.",
      "I am angry because I care.",
      "You don't get to decide what hurts me.",
      "I am trying to understand you.",
      "Stop turning this into a joke.",
      "Look at me when we talk about this.",
      "I don't want to fight with you.",
      "You promised me the truth.",
      "I hate how easily you can hurt me.",
      "Say it clearly.",
      "I need space, not distance.",
      "I was scared, so I got cruel.",
      "I shouldn't have said that.",
      "Are we fixing this or ending it?",
      "I am not your enemy.",
      "Tell me how to make this right.",
      "I still choose you, even when this is hard.",
    ],
  },
] satisfies readonly ConflictStyleSeedGroup[]);

export const CONFLICT_STYLE_PRESETS = Object.freeze(
  CONFLICT_STYLE_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createConflictStylePreset(group, value)),
  ),
) satisfies readonly ConflictStylePreset[];

export const CONFLICT_STYLE_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(CONFLICT_STYLE_PRESETS.map((preset) => preset.category))).sort(),
);

export function findConflictStylePresetById(
  id: string,
): ConflictStylePreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return CONFLICT_STYLE_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getConflictStylePresetsByCategory(
  category: string,
): ConflictStylePreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return CONFLICT_STYLE_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileConflictStylePresetAdditions(
  preset: ConflictStylePreset,
): CompiledConflictStylePresetAdditions {
  return {
    relationshipAddition: compileConflictStylePresetSummary(preset),
    personalityAddition: [
      `Conflict ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Conflict trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence disagreement, rupture, repair attempts, boundary-setting, cooling-off, or reconciliation only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Conflict style guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use keyword triggers and event gates as soft conflict context; preserve consent, reciprocity, boundaries, and player agency.",
    ].join(" "),
  };
}

export function compileConflictStylePresetSummary(
  preset: ConflictStylePreset,
): string {
  return [
    `Conflict style preset: ${preset.category} - ${preset.label}.`,
    `Conflict value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createConflictStylePreset(
  group: ConflictStyleSeedGroup,
  value: string,
): ConflictStylePreset {
  const label = toTitleLabel(value);
  const triggerKeys = uniquePreserveOrder([
    ...value
      .toLowerCase()
      .replace(/["'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "conflict",
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
      `${group.category.toLowerCase()} conflict texture`,
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
