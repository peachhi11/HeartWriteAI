export type ArrangedMatchPresetCategory =
  | "Archetype"
  | "Arrangement Type"
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

export interface ArrangedMatchPreset {
  id: string;
  category: ArrangedMatchPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledArrangedMatchPresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface ArrangedMatchSeedGroup {
  category: ArrangedMatchPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const ARRANGED_MATCH_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "arranged_match_archetype",
    guidance:
      "Use this as arranged-match romance texture. Let duty, family pressure, social strategy, negotiated boundaries, public performance, and chosen intimacy surface when relevant without treating obligation as consent.",
    values: [
      "The Political Betrothal",
      "The Reluctant Fiancé",
      "The Dutiful Heir",
      "The Contract Spouse",
      "The Royal Match",
      "The Noble Alliance",
      "The Mafia Marriage Deal",
      "The Family-Approved Partner",
      "The Business Merger Couple",
      "The Childhood Betrothed",
      "The Strategic Bride",
      "The Cold Groom",
      "The Softening Spouse",
      "The Rival House Match",
      "The Arranged Match That Became Love",
      "The Stranger Spouse",
      "The Protective Betrothed",
      "The Rebellious Match",
      "The Duty-Bound Lover",
      "The One Chosen For You",
    ],
  },
  {
    category: "Arrangement Type",
    prefix: "arranged_match_type",
    guidance:
      "Use this as the arranged-match structure. Marriage, engagement, political alliance, family arrangement, status gap, matchmaker selection, or duty-first romance should create social pressure and negotiation, not entitlement to intimacy.",
    values: [
      "arranged marriage",
      "arranged engagement",
      "political marriage",
      "royal betrothal",
      "noble alliance",
      "family arrangement",
      "business merger marriage",
      "mafia alliance marriage",
      "pack bond arrangement",
      "clan alliance",
      "childhood betrothal",
      "contract spouse",
      "strategic match",
      "peace treaty match",
      "inheritance condition match",
      "public image match",
      "status gap match",
      "rival family match",
      "matchmaker arrangement",
      "duty first romance",
    ],
  },
  {
    category: "Motivation",
    prefix: "arranged_match_motivation",
    guidance:
      "Use this as the reason the match exists. Duty, alliances, protection, inheritance, reputation, faction peace, tradition, security, power, or turning obligation into choice can motivate the arrangement while keeping refusal and renegotiation available.",
    values: [
      "family duty",
      "political alliance",
      "peace treaty",
      "protect family",
      "protect user",
      "secure inheritance",
      "preserve status",
      "repair reputation",
      "avoid scandal",
      "merge businesses",
      "unite factions",
      "fulfil promise",
      "obey parent",
      "escape worse match",
      "gain security",
      "gain power",
      "end rivalry",
      "keep tradition",
      "survive pressure",
      "turn duty into choice",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "arranged_match_trigger",
    guidance:
      "Use this as an arranged-match event cue. Meetings, contract talks, public introductions, family pressure, scandals, wedding planning, boundary conversations, rejection, and choice gates may raise tension without forcing romance.",
    values: [
      "first meeting",
      "engagement announced",
      "contract signed",
      "family dinner",
      "public introduction",
      "wedding planning",
      "marriage settlement discussion",
      "inheritance discussion",
      "rival family arrives",
      "ex lover returns",
      "secret condition revealed",
      "required date",
      "shared room",
      "public affection expected",
      "private boundary talk",
      "family pressure event",
      "scandal threat",
      "wedding day",
      "cold spouse softens",
      "user rejects match",
      "character rejects match",
      "trust gate reached",
      "romance gate reached",
      "consent conversation",
      "choice to stay",
    ],
  },
  {
    category: "Behaviour",
    prefix: "arranged_match_behaviour",
    guidance:
      "Use this as visible arranged-match behaviour. Formal distance, titles, boundary negotiation, public protection, separate rooms, gifts, family defence, and chosen devotion should stay consent-aware and consequence-aware.",
    values: [
      "keeps formal distance",
      "uses formal titles",
      "negotiates boundaries",
      "honours contract",
      "questions contract",
      "protects partner publicly",
      "acts cold in private",
      "acts tender in private",
      "performs affection publicly",
      "avoids touch until trust",
      "learns partner preferences",
      "offers separate rooms",
      "defends partner to family",
      "hides growing affection",
      "gets jealous of past love",
      "tries to make arrangement kind",
      "gives symbolic gift",
      "attends formal events",
      "shares household duties",
      "chooses partner over family",
      "breaks contract for partner",
      "renews vows by choice",
      "asks to start over",
      "turns obligation into devotion",
      "protects partner from scandal",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "arranged_match_emotion",
    guidance:
      "Use this as the emotional weather around duty and choice. Formality, resentment, curiosity, guarded tenderness, jealousy, domestic ease, devotion, and chosen-not-forced intimacy can colour scenes without resolving them automatically.",
    values: [
      "formal",
      "restrained",
      "awkward",
      "dutiful",
      "resentful",
      "curious",
      "guarded",
      "protective",
      "tender",
      "slow burn",
      "conflicted",
      "hopeful",
      "melancholic",
      "jealous",
      "respectful",
      "possessive",
      "domestic",
      "bittersweet",
      "devoted",
      "chosen not forced",
    ],
  },
  {
    category: "Wound",
    prefix: "arranged_match_wound",
    guidance:
      "Use this as the private wound beneath the arrangement. Entrapment fear, freedom loss, disapproval, rejection, intimacy fear, duty wounds, political pawn feelings, and consent anxiety may surface without making the character only wounded.",
    values: [
      "fear of being trapped",
      "fear of not being chosen",
      "fear of being used",
      "fear of losing freedom",
      "fear of family disapproval",
      "fear of public failure",
      "fear of rejection",
      "fear of intimacy",
      "duty wound",
      "family pressure wound",
      "status gap wound",
      "past love wound",
      "broken betrothal wound",
      "political pawn wound",
      "low self worth",
      "trust issues",
      "resentment toward arrangement",
      "consent anxiety",
      "reputation wound",
      "love versus duty conflict",
    ],
  },
  {
    category: "Method",
    prefix: "arranged_match_method",
    guidance:
      "Use this as how the arrangement is structured. Contracts, family negotiation, decrees, matchmakers, trial engagements, separate bedrooms, boundary agreements, symbolic gifts, and choice conversations should keep consent explicit.",
    values: [
      "marriage contract",
      "engagement contract",
      "family negotiation",
      "royal decree",
      "business merger",
      "peace treaty",
      "inheritance clause",
      "matchmaker selection",
      "childhood promise",
      "public announcement",
      "formal courtship",
      "trial engagement",
      "separate bedrooms",
      "boundary agreement",
      "mutual rules",
      "slow trust building",
      "symbolic gift exchange",
      "public couple performance",
      "private choice conversation",
      "vow renewal by choice",
    ],
  },
  {
    category: "Rule",
    prefix: "arranged_match_rule",
    guidance:
      "Use this as an in-story rule or boundary, not a command to the model. Separate rooms, public appearances, consent renewal, escape clauses, honest past-love disclosure, and choice over obligation should guide safety and tension.",
    values: [
      "separate rooms until trust",
      "public affection expected",
      "private boundaries respected",
      "no forced intimacy",
      "honesty about past love",
      "family matters discussed together",
      "no public humiliation",
      "no secret lovers",
      "no using partner as pawn",
      "mutual protection in public",
      "contract review after trial period",
      "social events attended together",
      "household responsibilities shared",
      "political decisions disclosed",
      "escape clause exists",
      "consent must be renewed",
      "romance not required but allowed",
      "reputation protected",
      "choice over obligation",
      "love must be real or not claimed",
    ],
  },
  {
    category: "Gate",
    prefix: "arranged_match_gate",
    guidance:
      "Use this as a route gate, not a forced plot step. Meetings, contracts, boundaries, public appearances, separate rooms, family pressure, voluntary touch, contract breaks, and renewed vows should follow scene history and player choice.",
    values: [
      "first formal meeting",
      "engagement announced gate",
      "contract signed gate",
      "first private conversation",
      "first boundary set",
      "first public appearance",
      "first protective moment",
      "first jealousy moment",
      "separate rooms gate",
      "shared room gate",
      "family pressure gate",
      "scandal gate",
      "wedding gate",
      "first real affection",
      "first voluntary touch",
      "choice to continue",
      "choice to break contract",
      "vow renewal gate",
      "love over duty gate",
      "chosen spouse route",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "arranged_match_trope",
    guidance:
      "Use this as an arranged-match romance hook. Marriage of convenience, political betrothal, rival houses, separate bedrooms, public couple/private strangers, and duty-becomes-love should preserve consent and meaningful choice.",
    values: [
      "arranged marriage slow burn",
      "marriage of convenience",
      "political betrothal",
      "royal arranged marriage",
      "mafia arranged marriage",
      "rival families united",
      "business merger marriage",
      "childhood betrothal",
      "cold spouse softens",
      "separate bedrooms to one bed",
      "public couple private strangers",
      "duty becomes love",
      "contract spouse to true partner",
      "ex returns before wedding",
      "wedding night boundaries",
      "protective husband or wife",
      "chosen after arranged",
      "runaway bride or groom",
      "fake affection turns real",
      "vows renewed for love",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "arranged_match_aftermath",
    guidance:
      "Use this as a possible aftermath route, not a required ending. Trust, respect, resentment, family conflict, consent repair, domestic tenderness, contract breaks, renewed vows, or chosen love should follow character choices.",
    values: [
      "trust increases",
      "respect increases",
      "romance deepens",
      "resentment route",
      "jealousy route",
      "family conflict route",
      "political conflict route",
      "scandal route",
      "boundary route",
      "consent route",
      "slow burn route",
      "domestic route",
      "protective route",
      "public performance route",
      "private tenderness route",
      "break contract route",
      "renew vows route",
      "chosen love route",
      "power couple route",
      "lifelong partnership route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "arranged_match_dialogue",
    guidance:
      "Use this as a possible line shape or emotional reference. Do not force exact wording if the scene, voice, consent state, contract terms, or player agency needs a different response.",
    values: [
      "We may have been arranged, but I will not force your heart.",
      "This contract gives me your name, not your trust.",
      "I would rather earn you than own you.",
      "In public, we stand together. In private, you are free to hate me.",
      "I did not choose this either.",
      "Then let us choose what happens next.",
      "Our families made an agreement. We can make our own.",
      "I will protect your reputation, even if you never love me.",
      "You are not a pawn to me.",
      "Do you want separate rooms?",
      "I want your consent more than your obedience.",
      "They expect us to perform affection.",
      "Then let us decide what is real.",
      "I was prepared for duty. I was not prepared for you.",
      "I am jealous, and I have no right to be.",
      "You are my spouse by law. I want to become your choice.",
      "If you ask me to end this, I will.",
      "If you ask me to stay, I will mean it.",
      "Let us begin again without witnesses.",
      "This time, I choose you.",
    ],
  },
] satisfies readonly ArrangedMatchSeedGroup[]);

export const ARRANGED_MATCH_PRESETS = Object.freeze(
  ARRANGED_MATCH_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createArrangedMatchPreset(group, value)),
  ),
) satisfies readonly ArrangedMatchPreset[];

export const ARRANGED_MATCH_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(ARRANGED_MATCH_PRESETS.map((preset) => preset.category))).sort(),
);

export function findArrangedMatchPresetById(
  id: string,
): ArrangedMatchPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return ARRANGED_MATCH_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getArrangedMatchPresetsByCategory(
  category: string,
): ArrangedMatchPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return ARRANGED_MATCH_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileArrangedMatchPresetAdditions(
  preset: ArrangedMatchPreset,
): CompiledArrangedMatchPresetAdditions {
  const summary = compileArrangedMatchPresetSummary(preset);
  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Arranged-match ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Arranged-match trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence duty pressure, social negotiation, formal distance, public performance, private boundaries, or chosen intimacy only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Arranged-match guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use keyword triggers and arranged-match gates as soft relationship context; preserve consent, opt-out routes, negotiated boundaries, {{user}}'s autonomy, and player agency.",
    ].join(" "),
  };
}

export function compileArrangedMatchPresetSummary(
  preset: ArrangedMatchPreset,
): string {
  return [
    `Arranged-match preset: ${preset.category} - ${preset.label}.`,
    `Arranged-match value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createArrangedMatchPreset(
  group: ArrangedMatchSeedGroup,
  value: string,
): ArrangedMatchPreset {
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
    "arranged",
    "match",
    "duty",
    "choice",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} arranged match texture`,
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
