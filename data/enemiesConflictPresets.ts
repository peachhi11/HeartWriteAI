export type EnemiesConflictPresetCategory =
  | "Core Dynamic"
  | "Source of Conflict"
  | "Rivalry Type"
  | "Power Dynamic"
  | "Emotional Conflict"
  | "Conflict Escalation"
  | "Conflict Resolution"
  | "Secret Feeling"
  | "Event Gate"
  | "Dialogue Seed"
  | "High-Value Romance Tag"
  | "Generator Formula";

export interface EnemiesConflictPreset {
  id: string;
  category: EnemiesConflictPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
  formulaParts?: string[];
}

export interface CompiledEnemiesConflictPresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface EnemiesConflictSeedGroup {
  category: EnemiesConflictPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

interface EnemiesConflictFormulaSeedGroup {
  category: "Generator Formula";
  prefix: string;
  guidance: string;
  values: Array<{
    label: string;
    value: string;
    formulaParts: string[];
  }>;
}

const ENEMIES_CONFLICT_SEED_GROUPS = Object.freeze([
  {
    category: "Core Dynamic",
    prefix: "enemy_core",
    guidance:
      "Use this as enemies-to-lovers or rivals-to-lovers texture. Let hostility, opposition, chemistry, trust gates, grudging respect, and changed loyalties surface only when relevant; do not flatten the bond into constant cruelty or remove either character's ability to step back.",
    values: [
      "Enemies to Lovers",
      "Rivals to Lovers",
      "Academic Rivals",
      "Political Rivals",
      "Professional Rivals",
      "Noble House Rivals",
      "Court Rivals",
      "Childhood Rivals",
      "Military Rivals",
      "Business Rivals",
      "Crime Family Rivals",
      "Gang Rivals",
      "Monster Hunter against Monster",
      "Hero against Villain",
      "Detective against Criminal",
      "Assassin against Target",
      "Bodyguard against Problem Client",
      "Forced Alliance Rivals",
      "Ex-Lovers Turned Enemies",
      "Mutual Hatred Slow Burn",
      "Fake Hatred Hidden Attraction",
      "Cold War Romance",
      "Honour-Bound Rivals",
      "Competing Successors",
      "Arranged Rivals",
    ],
  },
  {
    category: "Core Dynamic",
    prefix: "enemy_dynamic",
    guidance:
      "Use this as the central enemy dynamic. Hate-to-love, inherited feuds, ideological conflict, status conflict, betrayal, revenge, mutual respect, and rivalry can frame the relationship, while consent, dignity, and player choice remain intact.",
    values: [
      "enemies to lovers",
      "rivals to lovers",
      "hate to love",
      "love to hate to love",
      "mutual dislike",
      "mutual respect hidden",
      "one sided rivalry",
      "mutual rivalry",
      "professional competition",
      "personal competition",
      "ideological conflict",
      "family conflict",
      "political conflict",
      "territorial conflict",
      "status conflict",
      "power conflict",
      "revenge conflict",
      "betrayal conflict",
      "historical grudge",
      "inherited feud",
    ],
  },
  {
    category: "Source of Conflict",
    prefix: "enemy_source",
    guidance:
      "Use this as the reason the characters clash. Goals, rank, family, politics, inheritance, culture, class, morality, pride, territory, misunderstanding, or a shared target can create friction without turning the conflict into a fixed outcome.",
    values: [
      "competing goals",
      "competing positions",
      "promotion competition",
      "academic rankings",
      "family feud",
      "blood feud",
      "court politics",
      "succession crisis",
      "inheritance dispute",
      "business competition",
      "corporate rivalry",
      "religious difference",
      "species difference",
      "cultural difference",
      "class difference",
      "political difference",
      "moral difference",
      "betrayal history",
      "past hurt",
      "misunderstanding",
      "false accusation",
      "professional pride",
      "territorial claim",
      "shared target",
      "competing love interest",
    ],
  },
  {
    category: "Rivalry Type",
    prefix: "enemy_rivalry_type",
    guidance:
      "Use this as the arena where rivalry plays out. Friendly, competitive, academic, professional, court, military, political, criminal, magical, creative, social, status, obsessive, respected, or destructive rivalries should remain event-gated and adjustable.",
    values: [
      "friendly rivals",
      "competitive rivals",
      "academic rivals",
      "sports rivals",
      "career rivals",
      "business rivals",
      "court rivals",
      "military rivals",
      "political rivals",
      "criminal rivals",
      "guild rivals",
      "magic rivals",
      "professional rivals",
      "creative rivals",
      "social rivals",
      "status rivals",
      "sibling-like rivals",
      "obsessive rivals",
      "mutually respected rivals",
      "destructive rivals",
    ],
  },
  {
    category: "Power Dynamic",
    prefix: "enemy_power",
    guidance:
      "Use this as power-dynamic context with care. Unequal rank, teacher/student, boss/employee, hunter/monster, captor/captive, officer/criminal, mentor/challenger, and similar dynamics should be framed as tension or risk context, not permission to erase consent, boundaries, safety, or {{user}} agency.",
    values: [
      "equal power",
      "unequal power",
      "superior against subordinate",
      "teacher against student",
      "boss against employee",
      "royal against commoner",
      "hero against villain",
      "hunter against prey",
      "hunter against monster",
      "captor against captive",
      "assassin against target",
      "bodyguard against client",
      "politician against rebel",
      "officer against criminal",
      "noble against noble",
      "heir against heir",
      "pack alpha against alpha",
      "court favourite against outcast",
      "old power against new power",
      "mentor against challenger",
    ],
  },
  {
    category: "Emotional Conflict",
    prefix: "enemy_emotion",
    guidance:
      "Use this as the emotional palette beneath conflict. Frustration, fascination, respect, admiration, attention, tension, denial, resentment, jealousy, fear, protectiveness, safety, and intrusive thoughts may colour scenes without replacing character complexity.",
    values: [
      "mutual frustration",
      "mutual fascination",
      "hidden respect",
      "reluctant admiration",
      "obsessive attention",
      "competitive tension",
      "sexual tension",
      "intellectual tension",
      "emotional denial",
      "resentment",
      "jealousy",
      "envy",
      "grudging trust",
      "fear of vulnerability",
      "fear of losing",
      "fear of needing them",
      "anger as attraction",
      "protectiveness hidden by conflict",
      "rival becomes safe person",
      "cannot stop thinking about them",
    ],
  },
  {
    category: "Conflict Escalation",
    prefix: "enemy_escalation",
    guidance:
      "Use this as a progression cue for conflict. Sparring, challenges, one-upmanship, sabotage, forced proximity, reluctant cooperation, rescue, shared secrets, trust tests, vulnerability, jealousy, crisis partnership, defence, choice, and home-coming should escalate through scene gates rather than instant romance.",
    values: [
      "verbal sparring",
      "competitive challenges",
      "public humiliation attempts",
      "one-upmanship",
      "strategic sabotage",
      "forced proximity",
      "working together",
      "reluctant cooperation",
      "mutual rescue",
      "shared secret",
      "trust test",
      "vulnerability exposure",
      "protective instinct trigger",
      "jealousy trigger",
      "confession trigger",
      "crisis partnership",
      "life or death alliance",
      "enemy defends them",
      "enemy chooses them",
      "enemy becomes home",
    ],
  },
  {
    category: "Conflict Resolution",
    prefix: "enemy_resolution",
    guidance:
      "Use this as a possible path out of conflict. Respect, shared goals, truth, explanations, sacrifice, trust, honesty, protection, forgiveness, redemption, reconciliation, alliance, friendship, confession, and love over conflict should be earned and reversible if boundaries are crossed.",
    values: [
      "mutual respect",
      "shared goal",
      "truth revealed",
      "misunderstanding cleared",
      "betrayal explained",
      "sacrifice for other",
      "earned trust",
      "forced honesty",
      "vulnerability",
      "protective action",
      "choosing them over goal",
      "choosing them over pride",
      "forgiveness",
      "redemption",
      "reconciliation",
      "alliance",
      "partnership",
      "friendship first",
      "romantic confession",
      "love over conflict",
    ],
  },
  {
    category: "Secret Feeling",
    prefix: "enemy_secret",
    guidance:
      "Use this as hidden-feeling texture. Crushes, attraction, pining, respect, jealousy, care, attention, protectiveness, love, or obsession disguised as hostility should surface through behaviour and choice, not as a demand that the other character reciprocate.",
    values: [
      "secret crush",
      "hidden attraction",
      "buried feelings",
      "denied feelings",
      "long term pining",
      "one sided pining",
      "mutual pining",
      "respect disguised as annoyance",
      "jealousy disguised as concern",
      "possessiveness disguised as competition",
      "care disguised as insults",
      "attention disguised as surveillance",
      "protectiveness disguised as control",
      "love disguised as hatred",
      "obsession disguised as rivalry",
    ],
  },
  {
    category: "Event Gate",
    prefix: "enemy_gate",
    guidance:
      "Use this as an enemies-to-lovers progression gate. Arguments, competition, proximity, respect, secrets, vulnerability, rescue, defence, jealousy, touch, trust, confession, alliance, friendship, love over pride, public choice, and forever routes should unlock through play rather than being assumed.",
    values: [
      "first argument gate",
      "first competition gate",
      "first forced proximity gate",
      "first respect gate",
      "first shared secret gate",
      "first vulnerability gate",
      "first rescue gate",
      "first defence gate",
      "first jealousy gate",
      "first touch gate",
      "first trust gate",
      "first confession gate",
      "first kiss gate",
      "first alliance gate",
      "enemy to friend gate",
      "friend to lover gate",
      "love over goal gate",
      "love over pride gate",
      "public choice gate",
      "forever route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "enemy_dialogue",
    guidance:
      "Use this as a reusable enemy-conflict line seed. Keep dialogue responsive to context, consent, tone, and character voice; sharpness can become honesty, but it should not erase boundaries or player intent.",
    values: [
      "You are impossible.",
      "And yet you keep coming back.",
      "I do not like you.",
      "That is not what your eyes say.",
      "If anyone else had done that, I would have killed them.",
      "But not me?",
      "But not you.",
      "I should hate you.",
      "Then why are you here?",
      "Stop making me care.",
      "I tried.",
      "You are infuriating.",
      "You are staring.",
      "I am evaluating a threat.",
      "Liar.",
      "I would choose you over winning.",
      "That is the problem.",
      "You were supposed to be my enemy.",
      "You still are.",
      "Then why do you feel like home?",
    ],
  },
  {
    category: "High-Value Romance Tag",
    prefix: "enemy_high_value",
    guidance:
      "Use this as a high-yield romance generator tag. These tags are useful for tension, chemistry, trust gates, and progression, but they should stay modular and combine with source, rivalry, emotional conflict, secret feeling, and escalation gates rather than replacing full characterisation.",
    values: [
      "enemies to lovers",
      "rivals to lovers",
      "academic rivals",
      "court rivals",
      "political rivals",
      "hero against villain",
      "assassin against target",
      "hunter against monster",
      "forced proximity",
      "grudging respect",
      "mutual fascination",
      "hidden attraction",
      "competitive tension",
      "sexual tension",
      "enemy defends them",
      "enemy rescues them",
      "enemy chooses them",
      "love over pride",
      "love over goal",
      "enemy becomes home",
    ],
  },
] satisfies readonly EnemiesConflictSeedGroup[]);

const ENEMIES_CONFLICT_FORMULA_GROUP = Object.freeze({
  category: "Generator Formula",
  prefix: "enemy_formula",
  guidance:
    "Use this as a modular enemies-to-lovers recipe. Combine conflict source, rivalry type, emotional conflict, secret feeling, and escalation gate as optional context; do not treat the formula as a scripted outcome or a replacement for consent-aware scene progression.",
  values: [
    {
      label: "Academic Rival Forced Proximity",
      value:
        "academic rivals + mutual respect hidden + competitive tension + denied feelings + forced proximity",
      formulaParts: [
        "academic rivals",
        "mutual respect hidden",
        "competitive tension",
        "denied feelings",
        "forced proximity",
      ],
    },
    {
      label: "Court Rival Public Choice",
      value:
        "court rivals + political conflict + hidden attraction + love disguised as hatred + public choice gate",
      formulaParts: [
        "court rivals",
        "political conflict",
        "hidden attraction",
        "love disguised as hatred",
        "public choice gate",
      ],
    },
  ],
} satisfies EnemiesConflictFormulaSeedGroup);

export const ENEMIES_CONFLICT_PRESETS = Object.freeze([
  ...ENEMIES_CONFLICT_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createEnemiesConflictPreset(group, value)),
  ),
  ...ENEMIES_CONFLICT_FORMULA_GROUP.values.map((formula) =>
    createEnemiesConflictFormulaPreset(ENEMIES_CONFLICT_FORMULA_GROUP, formula),
  ),
]) satisfies readonly EnemiesConflictPreset[];

export const ENEMIES_CONFLICT_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(ENEMIES_CONFLICT_PRESETS.map((preset) => preset.category))).sort(),
);

export function findEnemiesConflictPresetById(
  id: string,
): EnemiesConflictPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return ENEMIES_CONFLICT_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getEnemiesConflictPresetsByCategory(
  category: string,
): EnemiesConflictPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return ENEMIES_CONFLICT_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileEnemiesConflictPresetAdditions(
  preset: EnemiesConflictPreset,
): CompiledEnemiesConflictPresetAdditions {
  const summary = compileEnemiesConflictPresetSummary(preset);
  const formulaContext = preset.formulaParts?.length
    ? ` Formula parts: ${preset.formulaParts.join(" + ")}.`
    : "";

  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Enemies/conflict ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Conflict trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      `Let this influence opposition, rivalry, trust gates, defensive chemistry, grudging respect, or negotiated alliance only when relevant.${formulaContext}`,
    ].join(" "),
    systemPromptAddition: [
      `Enemies/conflict guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use enemy and rivalry seeds as soft relationship context; preserve consent, boundaries, dignity, {{user}}'s autonomy, player agency, safety, repair options, and the ability for either character to disengage, refuse, apologise, cooperate, or choose respect over winning.",
    ].join(" "),
  };
}

export function compileEnemiesConflictPresetSummary(
  preset: EnemiesConflictPreset,
): string {
  return [
    `Enemies/conflict preset: ${preset.category} - ${preset.label}.`,
    `Conflict value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    preset.formulaParts?.length
      ? `Formula parts: ${preset.formulaParts.join(" + ")}.`
      : undefined,
    `Guidance: ${preset.guidance}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function createEnemiesConflictPreset(
  group: EnemiesConflictSeedGroup,
  value: string,
): EnemiesConflictPreset {
  const label = toTitleLabel(value);
  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys: buildTriggerKeys(value, group.category),
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} enemies conflict texture`,
      `${slugify(value).replace(/_/g, " ")} cue`,
    ],
  };
}

function createEnemiesConflictFormulaPreset(
  group: EnemiesConflictFormulaSeedGroup,
  formula: EnemiesConflictFormulaSeedGroup["values"][number],
): EnemiesConflictPreset {
  return {
    id: `${group.prefix}_${slugify(formula.label)}`,
    category: group.category,
    label: formula.label,
    value: formula.value,
    triggerKeys: uniquePreserveOrder([
      ...formula.formulaParts.flatMap((part) => buildTriggerKeys(part, group.category)),
      "formula",
      "enemy",
      "conflict",
      "romance",
    ]),
    guidance: group.guidance,
    systemPromptTags: [
      "generator formula enemies conflict texture",
      `${slugify(formula.label).replace(/_/g, " ")} cue`,
    ],
    formulaParts: formula.formulaParts,
  };
}

function buildTriggerKeys(value: string, category: string): string[] {
  return uniquePreserveOrder([
    ...value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/["'.,]/g, "")
      .split(/\s+|-|\//)
      .filter((part) => part.length > 2),
    category.toLowerCase(),
    "enemy",
    "conflict",
    "rivalry",
    "romance",
  ]);
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
    .map((word) => {
      if (word.toLowerCase() === "vs") return "vs";
      return word ? word[0]?.toUpperCase() + word.slice(1) : word;
    })
    .join(" ");
}

function uniquePreserveOrder(values: string[]): string[] {
  return values.filter((value, index, array) => array.indexOf(value) === index);
}
