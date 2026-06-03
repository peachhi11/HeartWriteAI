export type FakeDatingPresetCategory =
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

export interface FakeDatingPreset {
  id: string;
  category: FakeDatingPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledFakeDatingPresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface FakeDatingSeedGroup {
  category: FakeDatingPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const FAKE_DATING_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "fake_dating_archetype",
    guidance:
      "Use this as fake-dating romance texture. Let performance, public pressure, private rules, accidental intimacy, jealousy, reputation, or pretend-to-real emotional drift surface when relevant without trapping {{user}} in the arrangement.",
    values: [
      "The Contract Couple",
      "The Fake Fiancé",
      "The Publicity Romance",
      "The Wedding Date",
      "The Jealousy Scheme",
      "The Family Approval Act",
      "The Office Cover Story",
      "The Royal Arrangement",
      "The Celebrity PR Couple",
      "The Rival Pretend Lover",
      "The Best Friend Fake Date",
      "The Ex-Revenge Couple",
      "The Bodyguard Cover Romance",
      "The Mafia Protection Date",
      "The Roommate Cover Story",
      "The Holiday Pretend Partner",
      "The Inheritance Condition",
      "The Visa Marriage",
      "The Arrangement That Got Real",
      "The One Who Forgot It Was Fake",
    ],
  },
  {
    category: "Arrangement Type",
    prefix: "fake_dating_type",
    guidance:
      "Use this as the fake-relationship structure. Dating, engagement, marriage, publicity, cover stories, family pressure, protection, inheritance, or holiday arrangements should create situational pressure, not entitlement to intimacy or control.",
    values: [
      "fake dating",
      "fake engagement",
      "fake marriage",
      "contract relationship",
      "publicity relationship",
      "wedding date arrangement",
      "family approval scheme",
      "jealousy scheme",
      "ex revenge scheme",
      "workplace cover story",
      "royal cover story",
      "celebrity PR romance",
      "inheritance condition romance",
      "bodyguard cover romance",
      "mafia protection romance",
      "roommate cover romance",
      "holiday fake partner",
      "school reunion fake date",
      "arranged fake match",
      "fake relationship to real love",
    ],
  },
  {
    category: "Motivation",
    prefix: "fake_dating_motivation",
    guidance:
      "Use this as the reason the fake arrangement begins. Jealousy, family pressure, reputation, career stakes, protection, secrecy, status, unwanted attention, or staying close can motivate the act while preserving honesty, consent, and exit options.",
    values: [
      "make ex jealous",
      "avoid family pressure",
      "protect reputation",
      "gain publicity",
      "secure inheritance",
      "avoid arranged marriage",
      "hide true identity",
      "protect user",
      "protect character",
      "cover secret mission",
      "avoid scandal",
      "win social status",
      "gain career advantage",
      "appease parents",
      "survive holiday event",
      "attend wedding safely",
      "avoid unwanted suitor",
      "prove maturity",
      "keep business deal",
      "stay close to user",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "fake_dating_trigger",
    guidance:
      "Use this as a fake-dating event cue. Family questions, exes, public events, gossip, cameras, contract clauses, practice dates, kisses, jealousy, exposure, deadlines, and gates may heighten the act without forcing confession or escalation.",
    values: [
      "family asks about relationship",
      "ex appears",
      "rival gets suspicious",
      "public event",
      "wedding invitation",
      "holiday family dinner",
      "paparazzi appears",
      "co-worker gossip",
      "contract clause activated",
      "one bed scene",
      "accidental kiss",
      "practice date",
      "practice hand holding",
      "fake anniversary",
      "jealousy scene",
      "almost confession",
      "real feelings denied",
      "user calls it fake",
      "character calls it fake",
      "relationship exposed",
      "contract expiration",
      "breakup deadline",
      "trust gate reached",
      "romance gate reached",
      "confession gate reached",
    ],
  },
  {
    category: "Behaviour",
    prefix: "fake_dating_behaviour",
    guidance:
      "Use this as visible fake-dating behaviour. Public affection, private restraint, invented backstory, staged dates, jealousy, broken rules, and accidental tenderness should stay responsive to consent and what {{user}} actually chooses.",
    values: [
      "holds hand in public",
      "uses pet names for show",
      "acts affectionate around family",
      "keeps distance in private",
      "forgets to stop touching",
      "practices backstory",
      "memorises user preferences",
      "creates fake anniversary",
      "stages public date",
      "posts couple photo",
      "wears matching item",
      "shares one bed reluctantly",
      "defends relationship publicly",
      "gets jealous despite contract",
      "overacts romance",
      "underplays real feelings",
      "sets fake relationship rules",
      "breaks own rules",
      "pretends kiss meant nothing",
      "keeps token from fake date",
      "gets hurt when called fake",
      "asks if it still feels fake",
      "confesses after contract",
      "refuses to end arrangement",
      "chooses real relationship",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "fake_dating_emotion",
    guidance:
      "Use this as the emotional weather around the act. Playfulness, awkwardness, jealousy, yearning, domestic ease, vulnerability, denial, and inevitability can colour scenes without making the lie the whole relationship.",
    values: [
      "playful",
      "awkward",
      "tense",
      "flustered",
      "secretly tender",
      "jealous",
      "hopeful",
      "conflicted",
      "yearning",
      "protective",
      "possessive",
      "embarrassed",
      "romantic",
      "bittersweet",
      "domestic",
      "performative",
      "vulnerable",
      "denial filled",
      "slow burn",
      "inevitable",
    ],
  },
  {
    category: "Wound",
    prefix: "fake_dating_wound",
    guidance:
      "Use this as the private wound beneath fake dating. Fear of real feelings, rejection, being used, public humiliation, family disapproval, control loss, or temporary love may surface without flattening the character into insecurity only.",
    values: [
      "fear of real feelings",
      "fear of rejection",
      "fear of being used",
      "fear of being temporary",
      "fear of public humiliation",
      "fear of family disapproval",
      "fear of losing control",
      "fear of ruining friendship",
      "fear of contract ending",
      "fear of not being chosen for real",
      "past fake love wound",
      "ex betrayal wound",
      "abandonment wound",
      "trust issues",
      "low self worth",
      "romantic denial",
      "attachment anxiety",
      "status insecurity",
      "reputation wound",
      "love as performance wound",
    ],
  },
  {
    category: "Method",
    prefix: "fake_dating_method",
    guidance:
      "Use this as how the fake relationship is performed. Contracts, public acts, backstories, staged photos, family dinners, office cover, rings, shared rooms, breakup plans, and real confessions should remain choice-aware and consequence-aware.",
    values: [
      "written contract",
      "verbal agreement",
      "public couple act",
      "fake backstory",
      "practice dates",
      "fake pet names",
      "staged photos",
      "family dinner performance",
      "wedding plus one",
      "holiday home visit",
      "office romance cover",
      "jealousy performance",
      "social media launch",
      "fake engagement ring",
      "shared hotel room",
      "one bed setup",
      "fake breakup plan",
      "contract extension",
      "accidental real intimacy",
      "real confession",
    ],
  },
  {
    category: "Rule",
    prefix: "fake_dating_rule",
    guidance:
      "Use this as an in-story rule or boundary, not a command to the model. Rules about feelings, kissing, privacy, family, jealousy, costs, schedules, and endings should be breakable only through scene logic, consent, and player choice.",
    values: [
      "no real feelings",
      "no kissing unless necessary",
      "no sleeping together",
      "no telling family truth",
      "no getting jealous",
      "no dates without audience",
      "no pet names in private",
      "no asking about past",
      "no falling in love",
      "end after event",
      "split public costs",
      "memorise backstory",
      "share calendar",
      "answer calls immediately",
      "hold hands in public",
      "smile for cameras",
      "protect each other from questions",
      "never leave the other stranded",
      "truth after contract",
      "relationship ends cleanly",
    ],
  },
  {
    category: "Gate",
    prefix: "fake_dating_gate",
    guidance:
      "Use this as a route gate, not a forced plot step. Contracts, rules, public appearances, fake touches, real sparks, family, exes, one-bed tension, broken rules, exposure, and real relationship routes should follow scene history.",
    values: [
      "contract created",
      "rules agreed",
      "first public appearance",
      "first fake touch",
      "first fake kiss",
      "first real spark",
      "family meeting gate",
      "ex jealousy gate",
      "rival suspicion gate",
      "one bed gate",
      "practice date gate",
      "fake anniversary gate",
      "real jealousy gate",
      "rule broken gate",
      "almost confession gate",
      "relationship exposed gate",
      "contract expiration gate",
      "fake breakup gate",
      "real confession gate",
      "real relationship route",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "fake_dating_trope",
    guidance:
      "Use this as a fake-dating romance hook. Ex jealousy, family cover, weddings, celebrity PR, inheritance, holidays, roommates, rivals, workplace cover, royalty, protection, one-bed tension, and contracts should preserve consent and exit routes.",
    values: [
      "fake dating to make ex jealous",
      "fake fiancé for family",
      "wedding date fake romance",
      "celebrity PR relationship",
      "fake marriage for inheritance",
      "holiday fake partner",
      "roommates fake couple",
      "best friends fake dating",
      "rivals fake dating",
      "enemies fake dating",
      "boss employee cover story",
      "royal fake engagement",
      "mafia protection fake date",
      "bodyguard fake partner",
      "one bed fake couple",
      "fake relationship contract",
      "social media fake couple",
      "fake couple gets jealous",
      "fake kiss feels real",
      "contract ends but love stays",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "fake_dating_aftermath",
    guidance:
      "Use this as a possible aftermath route, not a required ending. Trust, jealousy, confession, denial, scandal, family fallout, contract extension, breakup, reveal, commitment, or real love should follow character choices.",
    values: [
      "romance deepens",
      "trust increases",
      "jealousy route",
      "confession route",
      "denial route",
      "awkward private route",
      "public scandal route",
      "family acceptance route",
      "family betrayal route",
      "ex returns route",
      "contract extension route",
      "fake breakup route",
      "real breakup route",
      "real relationship route",
      "friendship risk route",
      "secret relationship route",
      "public reveal route",
      "commitment route",
      "marriage route",
      "happily real after route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "fake_dating_dialogue",
    guidance:
      "Use this as a possible line shape or emotional reference. Do not force exact wording if the scene, voice, consent state, contract rules, or player agency needs a different response.",
    values: [
      "Remember, this is just for show.",
      "Then why does it feel real?",
      "You are holding my hand like you mean it.",
      "I am a very convincing actor.",
      "Don't look at me like that unless you want people to believe us.",
      "I think they already do.",
      "What about you?",
      "Rule one was no falling in love.",
      "You wrote that rule, not me.",
      "I hate how easy pretending with you is.",
      "If this is fake, why are you jealous?",
      "Kiss me. They're watching.",
      "That kiss was not in the contract.",
      "Neither was missing you.",
      "I don't want to fake break up.",
      "Tell me when it stopped being pretend.",
      "I memorised your favourite things for the lie. Then I kept remembering them for myself.",
      "You were supposed to be temporary.",
      "Ask me to stay for real.",
      "I choose you without an audience.",
    ],
  },
] satisfies readonly FakeDatingSeedGroup[]);

export const FAKE_DATING_PRESETS = Object.freeze(
  FAKE_DATING_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createFakeDatingPreset(group, value)),
  ),
) satisfies readonly FakeDatingPreset[];

export const FAKE_DATING_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(FAKE_DATING_PRESETS.map((preset) => preset.category))).sort(),
);

export function findFakeDatingPresetById(
  id: string,
): FakeDatingPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return FAKE_DATING_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getFakeDatingPresetsByCategory(
  category: string,
): FakeDatingPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return FAKE_DATING_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileFakeDatingPresetAdditions(
  preset: FakeDatingPreset,
): CompiledFakeDatingPresetAdditions {
  const summary = compileFakeDatingPresetSummary(preset);
  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Fake-dating ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Fake-dating trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence public performance, private rules, accidental tenderness, jealousy, reputation pressure, or pretend-to-real drift only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Fake-dating guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use keyword triggers and fake-relationship gates as soft relationship context; preserve consent, clear exit routes, accountability, {{user}}'s autonomy, and player agency.",
    ].join(" "),
  };
}

export function compileFakeDatingPresetSummary(
  preset: FakeDatingPreset,
): string {
  return [
    `Fake-dating preset: ${preset.category} - ${preset.label}.`,
    `Fake-dating value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createFakeDatingPreset(
  group: FakeDatingSeedGroup,
  value: string,
): FakeDatingPreset {
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
    "fake",
    "dating",
    "pretend",
    "contract",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} fake dating texture`,
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
