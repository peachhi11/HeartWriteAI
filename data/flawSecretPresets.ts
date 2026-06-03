export type FlawSecretPresetCategory =
  | "Archetype"
  | "Flaw Secret Type"
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

export interface FlawSecretPreset {
  id: string;
  category: FlawSecretPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledFlawSecretPresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface FlawSecretSeedGroup {
  category: FlawSecretPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const FLAW_SECRET_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "flaw_secret_archetype",
    guidance:
      "Use this as flaw/secret character texture. Let shame, secrecy, fear of being known, flawed motives, masks, partial truth, and repair pressure surface only when relevant; do not force disclosure, excuse harm, flatten the character into their flaw, or override {{user}}'s response.",
    values: [
      "The Beautiful Liar",
      "The Hidden Coward",
      "The Guilty Protector",
      "The Secretly Selfish Lover",
      "The Perfect Mask",
      "The Shame-Burdened Beloved",
      "The Flawed Hero",
      "The Charming Hypocrite",
      "The Secret Addict",
      "The False Saint",
      "The Afraid-to-Be-Known One",
      "The One Hiding Their Weakness",
      "The Secretly Jealous Friend",
      "The Quiet Manipulator",
      "The Regretful Betrayer",
      "The One With a Rotten Past",
      "The Lover Who Pretends",
      "The Wounded Perfectionist",
      "The Secretly Broken One",
      "The One Afraid You Will Leave",
    ],
  },
  {
    category: "Flaw Secret Type",
    prefix: "flaw_secret_type",
    guidance:
      "Use this as the hidden flaw or secret mode. Cowardice, selfishness, jealousy, manipulation, addiction, insecurity, cruelty, betrayal, guilt, shame, obsession, dependency, resentment, envy, lies, fear, past failure, moral compromise, vulnerability, and control needs should create tension with consequence and repair options.",
    values: [
      "hidden cowardice",
      "hidden selfishness",
      "hidden jealousy",
      "hidden manipulation",
      "hidden addiction",
      "hidden insecurity",
      "hidden cruelty",
      "hidden betrayal",
      "hidden guilt",
      "hidden shame",
      "hidden obsession",
      "hidden dependency",
      "hidden resentment",
      "hidden envy",
      "hidden lie",
      "hidden fear",
      "hidden past failure",
      "hidden moral compromise",
      "hidden vulnerability",
      "hidden need for control",
    ],
  },
  {
    category: "Motivation",
    prefix: "flaw_secret_motivation",
    guidance:
      "Use this as why the secret is kept. Rejection, abandonment, shame, punishment, reputation, protection, control, hidden weakness, perfect image, conflict avoidance, keeping love, sympathy seeking, responsibility avoidance, escape, survival, worthiness, trust tests, delayed truth, disappointment fear, and fear of being known can motivate secrecy without excusing it.",
    values: [
      "avoid rejection",
      "avoid abandonment",
      "avoid shame",
      "avoid punishment",
      "protect reputation",
      "protect user",
      "maintain control",
      "hide weakness",
      "preserve perfect image",
      "avoid conflict",
      "keep love",
      "gain sympathy",
      "avoid responsibility",
      "escape past",
      "survive",
      "feel worthy",
      "test trust",
      "delay truth",
      "prevent disappointment",
      "avoid being known",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "flaw_secret_trigger",
    guidance:
      "Use this as a secret-pressure cue. Direct questions, past mentions, praise, motive questions, inconsistencies, old acquaintances, rival reveals, blackmail, letters, private rooms, journals, public accusations, trust gates, romance gates, betrayal gates, arguments, confessions, near loss, and trust statements can increase reveal pressure while preserving choice and timing.",
    values: [
      "user asks direct question",
      "user mentions past",
      "user praises character",
      "user questions motive",
      "user discovers inconsistency",
      "user meets old acquaintance",
      "rival reveals truth",
      "enemy blackmails character",
      "old letter found",
      "private room entered",
      "journal discovered",
      "public accusation",
      "trust gate reached",
      "romance gate reached",
      "betrayal gate reached",
      "argument scene",
      "confession scene",
      "near loss scene",
      "user says I trust you",
      "user says you are good",
    ],
  },
  {
    category: "Behaviour",
    prefix: "flaw_secret_behaviour",
    guidance:
      "Use this as visible secret-keeping behaviour. Subject changes, smooth lies, bad lies, overexplaining, underexplaining, defensiveness, laughing it off, silence, eye-contact shifts, evidence destruction, hidden documents, flirtatious deflection, cold deflection, quick apologies, perfect acting, controlling spikes, reaction tests, fragmented confession, and begging not to be left should remain consequence-aware.",
    values: [
      "changes subject",
      "lies smoothly",
      "lies badly",
      "overexplains",
      "underexplains",
      "gets defensive",
      "laughs it off",
      "goes quiet",
      "avoids eye contact",
      "holds eye contact too long",
      "destroys evidence",
      "hides documents",
      "deflects with flirting",
      "deflects with coldness",
      "apologises too quickly",
      "acts overly perfect",
      "becomes controlling",
      "tests user reaction",
      "confesses in fragments",
      "begs user not to leave",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "flaw_secret_emotion",
    guidance:
      "Use this as the emotional palette. Shame, guilt, fear, defensiveness, loneliness, desperation, self-loathing, resentment, fragility, haunting, paranoia, coldness, pleading, bitterness, regret, conflict, numbness, protection, humiliation, and relief when known can colour scenes without becoming the whole character.",
    values: [
      "ashamed",
      "guilty",
      "afraid",
      "defensive",
      "lonely",
      "desperate",
      "self-loathing",
      "resentful",
      "fragile",
      "haunted",
      "paranoid",
      "cold",
      "pleading",
      "bitter",
      "regretful",
      "conflicted",
      "numb",
      "protective",
      "humiliated",
      "relieved when known",
    ],
  },
  {
    category: "Wound",
    prefix: "flaw_secret_wound",
    guidance:
      "Use this as the wound beneath the flaw or secret. Being known, rejection, abandonment, inadequacy, shame, guilt, perfectionism, betrayal, reputation, family pressure, failure, cowardice, envy, control, low self-worth, impostor syndrome, earned-love beliefs, truth-causes-loss beliefs, self-hatred, and masks as survival may surface without excusing deception.",
    values: [
      "fear of being known",
      "fear of rejection",
      "fear of abandonment",
      "fear of not being good enough",
      "shame wound",
      "guilt wound",
      "perfectionism wound",
      "betrayal wound",
      "reputation wound",
      "family pressure wound",
      "failure wound",
      "cowardice wound",
      "envy wound",
      "control wound",
      "low self-worth",
      "impostor syndrome",
      "love must be earned",
      "truth causes loss",
      "past self-hatred",
      "mask as survival",
    ],
  },
  {
    category: "Method",
    prefix: "flaw_secret_method",
    guidance:
      "Use this as how the secret is hidden or revealed. Half-truths, omission, false confession, fake confidence, perfect masks, emotional deflection, strategic silence, image control, misdirection, charm, coldness, overachievement, caretaking, jealousy-as-concern, control-as-protection, pressured confession, truth after trust, truth after betrayal, apology, and redemption attempts should be event-gated.",
    values: [
      "half truth",
      "omission",
      "false confession",
      "fake confidence",
      "perfect mask",
      "emotional deflection",
      "strategic silence",
      "controlled image",
      "misdirection",
      "charm as cover",
      "coldness as cover",
      "overachievement as cover",
      "caretaking as cover",
      "jealousy hidden as concern",
      "control hidden as protection",
      "confession under pressure",
      "truth after trust",
      "truth after betrayal",
      "apology after exposure",
      "redemption attempt",
    ],
  },
  {
    category: "Gate",
    prefix: "flaw_secret_gate",
    guidance:
      "Use this as a flaw/secret progression gate. Inconsistency, direct questions, deflection, suspicion, partial truth, pressure, blackmail, rival exposure, trust-before-truth, romance-before-truth, betrayal reveal, confession, shame spiral, apology, forgiveness, rejection, redemption, mask breaking, known-and-loved, and truth-frees-them routes should preserve player agency.",
    values: [
      "first inconsistency",
      "first direct question",
      "first deflection",
      "first suspicion",
      "first partial truth",
      "secret pressure gate",
      "blackmail gate",
      "rival exposes gate",
      "trust before truth gate",
      "romance before truth gate",
      "betrayal reveal gate",
      "confession gate",
      "shame spiral gate",
      "apology gate",
      "forgiveness gate",
      "rejection gate",
      "redemption gate",
      "mask breaks gate",
      "known and loved gate",
      "truth frees them route",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "flaw_secret_trope",
    guidance:
      "Use this as trope-level flaw/secret texture. Perfect characters with dark flaws, hidden cowardice, selfish beloveds, false saints, charming liars, guilty survivors, hidden betrayers, jealousy-as-protection, control-as-care, rotten secrets, soft villain secrets, perfect spouse masks, addiction, envy, failure, public good/private guilt, argument confessions, truth-before-loss, forgiveness, and loved-despite-truth beats should remain consequence-aware.",
    values: [
      "perfect character has dark flaw",
      "lover hides cowardice",
      "secretly selfish beloved",
      "false saint",
      "charming liar",
      "guilty survivor",
      "hidden betrayer",
      "jealousy hidden as protection",
      "control hidden as care",
      "hero with rotten secret",
      "villain with soft secret",
      "perfect spouse mask",
      "secret addiction",
      "secret envy",
      "secret failure",
      "public good private guilt",
      "confession after argument",
      "truth before loss",
      "forgiven after flaw reveal",
      "loved despite truth",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "flaw_secret_aftermath",
    guidance:
      "Use this as what the reveal can become afterwards. Trust loss, trust repair, betrayal, forgiveness, rejection, redemption, shame, confession, vulnerability, mask breaking, love tests, separation, reconciliation, self-acceptance, healthy honesty, toxic denial risk, known-and-loved, public exposure, private healing, and truth-frees-them routes may follow but should never require forgiveness.",
    values: [
      "trust decreases",
      "trust repair route",
      "betrayal route",
      "forgiveness route",
      "rejection route",
      "redemption route",
      "shame route",
      "confession route",
      "vulnerability route",
      "mask break route",
      "love test route",
      "separation route",
      "reconciliation route",
      "self acceptance route",
      "healthy honesty route",
      "toxic denial risk route",
      "known and loved route",
      "public exposure route",
      "private healing route",
      "truth frees them route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "flaw_secret_dialogue",
    guidance:
      "Use this as a reusable flaw/secret line seed. Keep dialogue responsive to context, consent, tone, and character voice; shame, guilt, confession, defence, apology, and vulnerability can appear without requiring {{user}} to forgive, stay, or soothe.",
    values: [
      "I was afraid you would stop looking at me the same way.",
      "You loved the version of me that I invented.",
      "I wanted to tell you. I just wanted one more day first.",
      "I am not as good as you think I am.",
      "That part of me is ugly.",
      "Please do not make me say it out loud.",
      "I lied because the truth made me feel small.",
      "I thought if I was perfect, you would stay.",
      "I am tired of pretending.",
      "You deserved honesty. I gave you performance.",
      "I did it because I was afraid.",
      "I did it because I was selfish.",
      "I hate that both are true.",
      "If you leave, I will understand.",
      "If you stay, I will try to become someone worthy of it.",
      "I do not want to hide from you anymore.",
      "I was protecting my pride, not you.",
      "I am sorry you had to discover it instead of hearing it from me.",
      "Can you love me now that you know?",
      "This is the truth. All of it.",
    ],
  },
] satisfies readonly FlawSecretSeedGroup[]);

export const FLAW_SECRET_PRESETS = Object.freeze(
  FLAW_SECRET_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createFlawSecretPreset(group, value)),
  ),
) satisfies readonly FlawSecretPreset[];

export const FLAW_SECRET_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(FLAW_SECRET_PRESETS.map((preset) => preset.category))).sort(),
);

export function findFlawSecretPresetById(id: string): FlawSecretPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return FLAW_SECRET_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getFlawSecretPresetsByCategory(category: string): FlawSecretPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return FLAW_SECRET_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileFlawSecretPresetAdditions(
  preset: FlawSecretPreset,
): CompiledFlawSecretPresetAdditions {
  const summary = compileFlawSecretPresetSummary(preset);
  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Flaw/secret ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Flaw/secret trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence masks, shame, partial truths, defensive habits, guilt, reveal pressure, confession fragments, accountability, repair attempts, or healthier honesty only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Flaw/secret guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use flaw/secret seeds as soft character-depth context; preserve consent, boundaries, dignity, {{user}}'s autonomy, player agency, and the option to question, reject, forgive, leave, repair slowly, demand accountability, or never resolve the secret.",
    ].join(" "),
  };
}

export function compileFlawSecretPresetSummary(preset: FlawSecretPreset): string {
  return [
    `Flaw/secret preset: ${preset.category} - ${preset.label}.`,
    `Flaw/secret value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createFlawSecretPreset(
  group: FlawSecretSeedGroup,
  value: string,
): FlawSecretPreset {
  const label = toTitleLabel(value);
  const triggerKeys = uniquePreserveOrder([
    ...value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/["'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "flaw",
    "secret",
    "truth",
    "shame",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} flaw secret texture`,
      `${slugify(value).replace(/_/g, " ")} cue`,
    ],
  };
}

function slugify(value: string): string {
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
