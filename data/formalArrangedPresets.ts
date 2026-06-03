export type FormalArrangedPresetCategory =
  | "Archetype"
  | "Dynamic Type"
  | "Motivation"
  | "Trigger Event"
  | "Behaviour"
  | "Emotional Flavour"
  | "Wound"
  | "Method"
  | "Rule"
  | "Gate"
  | "Romance Trope"
  | "Aftermath Route"
  | "Dialogue Seed";

export interface FormalArrangedPreset {
  id: string;
  category: FormalArrangedPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledFormalArrangedPresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface FormalArrangedSeedGroup {
  category: FormalArrangedPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const FORMAL_ARRANGED_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "formal_arranged_archetype",
    guidance:
      "Use this as formal/arranged romance texture. Let etiquette, duty, public composure, private uncertainty, respect, chosen tenderness, and contract pressure surface only when relevant; do not treat arrangement, title, or duty as consent.",
    values: [
      "The Polite Betrothed",
      "The Cold Fiancé",
      "The Dutiful Spouse",
      "The Noble Match",
      "The Royal Arrangement",
      "The Contract Partner",
      "The Respectful Stranger",
      "The Formal Lover",
      "The Distant Husband",
      "The Graceful Wife",
      "The Reserved Heir",
      "The Political Match",
      "The Courteous Rival",
      "The Proper Companion",
      "The Bound-by-Duty Beloved",
      "The Slow-Softening Spouse",
      "The Publicly Perfect Couple",
      "The Private Strangers",
      "The One Who Learns Tenderness",
      "The One Who Chooses After Duty",
    ],
  },
  {
    category: "Dynamic Type",
    prefix: "formal_arranged_type",
    guidance:
      "Use this as the formal/arranged dynamic structure. Betrothal, contracts, political engagements, noble alliances, public performance, private distance, formal titles, separate rooms, and duty-to-choice arcs should build earned trust rather than forced romance.",
    values: [
      "formal betrothal",
      "arranged marriage",
      "political engagement",
      "contract spouse",
      "royal match",
      "noble alliance",
      "family arrangement",
      "public couple private strangers",
      "duty-first romance",
      "marriage of convenience",
      "slow-burn spouses",
      "cold to courteous",
      "courteous to tender",
      "formal titles to first names",
      "separate rooms to shared home",
      "public etiquette private truth",
      "respect before love",
      "obligation to choice",
      "proper courtship",
      "vow renewal by choice",
    ],
  },
  {
    category: "Motivation",
    prefix: "formal_arranged_motivation",
    guidance:
      "Use this as the desire beneath formal arrangement. Family duty, political stability, reputation, alliance, composure, respect, public protection, boundaries, kindness, gentle obligation, and wanting to be chosen may guide behaviour without replacing consent.",
    values: [
      "family duty",
      "political stability",
      "preserve reputation",
      "protect family name",
      "secure alliance",
      "avoid scandal",
      "honour contract",
      "maintain composure",
      "earn respect",
      "learn partner",
      "protect partner publicly",
      "avoid public humiliation",
      "turn duty into trust",
      "turn trust into love",
      "keep boundaries",
      "become worthy spouse",
      "prove the match can work",
      "choose kindness despite duty",
      "make obligation gentle",
      "be chosen for real",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "formal_arranged_trigger",
    guidance:
      "Use this as an arranged-courtship event cue. Announcements, formal introductions, family dinners, contracts, balls, portraits, tea, rooms, titles, accidental first names, public defence, scandals, weddings, voluntary touch, and choice gates may shift trust without forcing intimacy.",
    values: [
      "engagement announced",
      "first formal introduction",
      "first family dinner",
      "contract signed",
      "public ball",
      "formal portrait session",
      "wedding planning",
      "first private tea",
      "separate rooms discussion",
      "public affection expected",
      "etiquette lesson",
      "title used in private",
      "first name used accidentally",
      "partner defended publicly",
      "family questions match",
      "rival questions legitimacy",
      "ex lover returns",
      "scandal threat",
      "wedding day",
      "first voluntary touch",
      "first private confession",
      "trust gate reached",
      "romance gate reached",
      "choice to stay",
    ],
  },
  {
    category: "Behaviour",
    prefix: "formal_arranged_behaviour",
    guidance:
      "Use this as visible formal/arranged behaviour. Titles, bows, measured distance, public arm offers, letters, permission to touch, private audiences, public composure, courteous defence, discreet gifts, and chosen vows should show care through restraint.",
    values: [
      "uses formal title",
      "bows or curtseys",
      "keeps measured distance",
      "offers arm in public",
      "opens door",
      "pulls out chair",
      "writes formal letters",
      "requests permission to touch",
      "asks for private audience",
      "maintains public composure",
      "defends partner with courtesy",
      "corrects insult politely",
      "hides tenderness behind etiquette",
      "offers separate rooms",
      "learns partner schedule",
      "remembers tea preference",
      "sends discreet gift",
      "stands beside partner at events",
      "uses first name in vulnerable moment",
      "renews vows by choice",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "formal_arranged_emotion",
    guidance:
      "Use this as the emotional weather around formal arrangement. Restraint, courtesy, dignity, awkwardness, duty, guardedness, jealousy under composure, private softness, public grace, quiet longing, and chosen devotion can colour scenes without reducing them to performance.",
    values: [
      "restrained",
      "courteous",
      "proper",
      "dignified",
      "reserved",
      "awkward",
      "dutiful",
      "respectful",
      "guarded",
      "slow burn",
      "tender under control",
      "melancholic",
      "hopeful",
      "jealous but composed",
      "protective",
      "private softness",
      "public grace",
      "quiet longing",
      "chosen not forced",
      "devoted",
    ],
  },
  {
    category: "Wound",
    prefix: "formal_arranged_wound",
    guidance:
      "Use this as the private wound beneath formal arrangement. Trapped feelings, fear of not being chosen, public failure, family disappointment, intimacy fear, lost freedom, reputation wounds, obedience shame, duty conflict, consent anxiety, and loneliness may surface without overriding agency.",
    values: [
      "fear of being trapped",
      "fear of not being chosen",
      "fear of public failure",
      "fear of disappointing family",
      "fear of intimacy",
      "fear of losing freedom",
      "duty wound",
      "reputation wound",
      "family pressure wound",
      "status gap wound",
      "past betrothal wound",
      "cold household wound",
      "politeness as armour",
      "obedience shame",
      "love versus duty conflict",
      "touch uncertainty",
      "consent anxiety",
      "trust issues",
      "loneliness in marriage",
      "desire to be chosen",
    ],
  },
  {
    category: "Method",
    prefix: "formal_arranged_method",
    guidance:
      "Use this as how formal arranged intimacy develops. Courtship, contracts, negotiation, etiquette, boundary talks, separate rooms, tea, dances, gifts, polite defence, letters, first-name progression, voluntary touch, mutual rules, and contract revision should mark earned closeness.",
    values: [
      "formal courtship",
      "written contract",
      "family negotiation",
      "public etiquette",
      "private boundary talk",
      "separate rooms",
      "scheduled meetings",
      "tea conversations",
      "formal dances",
      "symbolic gift exchange",
      "public appearances",
      "polite defence",
      "letters instead of confession",
      "first-name progression",
      "voluntary touch progression",
      "mutual rules",
      "slow trust building",
      "choice conversation",
      "contract revision",
      "vow renewal",
    ],
  },
  {
    category: "Rule",
    prefix: "formal_arranged_rule",
    guidance:
      "Use this as a formal-arrangement boundary rule. Rules should protect consent, privacy, dignity, truthful communication, public safety, escape clauses, and chosen affection; they should never become hard coercion or a reason to write {{user}}'s choices.",
    values: [
      "no forced intimacy",
      "private boundaries respected",
      "public unity required",
      "separate rooms until trust",
      "formal titles in public",
      "first names only by permission",
      "no public arguments",
      "no humiliating partner",
      "family conflict discussed privately",
      "political decisions disclosed",
      "gifts must not create obligation",
      "touch requires consent",
      "social events attended together",
      "scandal prevention priority",
      "truth over performance in private",
      "contract review allowed",
      "escape clause acknowledged",
      "affection must be chosen",
      "duty must not replace care",
      "love must not be performed as lie",
    ],
  },
  {
    category: "Gate",
    prefix: "formal_arranged_gate",
    guidance:
      "Use this as a route gate, not a forced plot step. Formal meetings, titles, private audiences, tea, public events, dance, boundary talks, separate rooms, public defence, discreet gifts, first names, voluntary touch, scandal, family pressure, and chosen continuation should follow scene history.",
    values: [
      "first formal meeting",
      "title gate",
      "private audience gate",
      "first tea scene",
      "first public event",
      "first dance",
      "first boundary talk",
      "separate rooms gate",
      "public defence gate",
      "first discreet gift",
      "first-name gate",
      "first voluntary touch",
      "first private softness",
      "scandal gate",
      "family pressure gate",
      "wedding gate",
      "choice to continue gate",
      "contract revision gate",
      "love confession gate",
      "vow renewal gate",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "formal_arranged_trope",
    guidance:
      "Use this as a formal arranged romance hook. Titles-to-first-names, public couple/private strangers, marriage of convenience, separate bedrooms, tea-room confessions, ballroom tension, polite jealousy, royal matches, contracts, letters, and chosen vows should stay consent-led.",
    values: [
      "formal titles to first names",
      "public couple private strangers",
      "marriage of convenience",
      "arranged marriage slow burn",
      "cold spouse softens",
      "separate bedrooms to shared bed",
      "tea room confessions",
      "ballroom tension",
      "polite jealousy",
      "contract spouse to true partner",
      "royal arranged match",
      "noble house alliance",
      "political betrothal",
      "duty becomes love",
      "courtesy as affection",
      "letters before touch",
      "first name as intimacy",
      "vows renewed for love",
      "private tenderness public restraint",
      "chosen after arranged",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "formal_arranged_aftermath",
    guidance:
      "Use this as a possible aftermath route, not a required ending. Respect, trust, reputation, private softness, boundaries, consent, slow burn, family conflict, scandal, domesticity, contract revision, separate rooms, shared home, choice over duty, and lifelong partnership should follow character choices.",
    values: [
      "respect increases",
      "trust increases",
      "romance deepens",
      "public reputation strengthened",
      "private softness unlocked",
      "boundary route",
      "consent route",
      "slow burn route",
      "jealousy under composure route",
      "family conflict route",
      "scandal route",
      "domestic route",
      "political alliance route",
      "contract revision route",
      "separate rooms route",
      "shared home route",
      "choice over duty route",
      "vow renewal route",
      "power couple route",
      "lifelong partnership route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "formal_arranged_dialogue",
    guidance:
      "Use this as a possible line shape or emotional reference. Do not force exact wording if the scene, voice, consent state, boundary state, or player agency needs a different response.",
    values: [
      "You may call me by my name, if you wish.",
      "This arrangement gives us titles, not trust.",
      "I will not mistake duty for consent.",
      "In public, I will stand beside you. In private, I will listen.",
      "You owe me courtesy, not affection.",
      "I would rather earn tenderness than demand it.",
      "Our families chose the match. We may choose what it becomes.",
      "Do you prefer separate rooms?",
      "I have no desire to make a cage of this marriage.",
      "You defended me rather fiercely for someone so formal.",
      "I was being proper.",
      "You were being protective.",
      "Please do not perform affection for my sake.",
      "Then let me offer something real.",
      "I was prepared for obligation. I was not prepared to miss you.",
      "Your happiness is not a clause in the contract, but it matters to me.",
      "I want to know you without witnesses.",
      "Duty brought me here. Choice keeps me here.",
      "Let us begin again, not as an arrangement.",
      "This time, I choose you.",
    ],
  },
] satisfies readonly FormalArrangedSeedGroup[]);

export const FORMAL_ARRANGED_PRESETS = Object.freeze(
  FORMAL_ARRANGED_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createFormalArrangedPreset(group, value)),
  ),
) satisfies readonly FormalArrangedPreset[];

export const FORMAL_ARRANGED_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(FORMAL_ARRANGED_PRESETS.map((preset) => preset.category))).sort(),
);

export function findFormalArrangedPresetById(
  id: string,
): FormalArrangedPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return FORMAL_ARRANGED_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getFormalArrangedPresetsByCategory(
  category: string,
): FormalArrangedPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return FORMAL_ARRANGED_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileFormalArrangedPresetAdditions(
  preset: FormalArrangedPreset,
): CompiledFormalArrangedPresetAdditions {
  const summary = compileFormalArrangedPresetSummary(preset);
  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Formal/arranged ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Formal/arranged trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence etiquette, duty, public composure, private tenderness, consent negotiation, trust, contract pressure, or chosen affection only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Formal/arranged guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use keyword triggers and formal-arranged gates as soft relationship context; preserve consent, boundaries, dignity, {{user}}'s autonomy, player agency, and the option for affection to be chosen rather than performed.",
    ].join(" "),
  };
}

export function compileFormalArrangedPresetSummary(
  preset: FormalArrangedPreset,
): string {
  return [
    `Formal/arranged preset: ${preset.category} - ${preset.label}.`,
    `Formal/arranged value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createFormalArrangedPreset(
  group: FormalArrangedSeedGroup,
  value: string,
): FormalArrangedPreset {
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
    "formal",
    "arranged",
    "duty",
    "consent",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} formal arranged texture`,
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
