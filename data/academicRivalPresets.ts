export type AcademicRivalPresetCategory =
  | "Archetype"
  | "Dynamic Type"
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

export interface AcademicRivalPreset {
  id: string;
  category: AcademicRivalPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledAcademicRivalPresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface AcademicRivalSeedGroup {
  category: AcademicRivalPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const ACADEMIC_RIVAL_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "academic_rival_archetype",
    guidance:
      "Use this as academic/rival romance texture. Let competition, intellectual friction, score pressure, envy, admiration, banter, mutual respect, burnout, and earned partnership surface only when relevant; do not reduce either character to grades or rivalry alone.",
    values: [
      "The Top Student Rival",
      "The Academic Nemesis",
      "The Debate Club Enemy",
      "The Perfect Scholar",
      "The Chaotic Genius",
      "The Rival Lab Partner",
      "The Study Partner Rival",
      "The Scholarship Competitor",
      "The Professor's Favourite",
      "The Overachieving Classmate",
      "The Thesis Rival",
      "The Mock Trial Opponent",
      "The Academic Decathlon Rival",
      "The Library Enemy",
      "The Tutor Turned Rival",
      "The Rival Who Respects You",
      "The Rival Secretly in Love",
      "The One Who Must Beat You",
      "The One Who Makes You Better",
      "The Rival Who Becomes Home",
    ],
  },
  {
    category: "Dynamic Type",
    prefix: "academic_rival_type",
    guidance:
      "Use this as the academic/rival dynamic structure. Top-student rivalry, lab partnerships, debates, scholarships, rank pressure, recommendation tension, genius versus hard worker, and rivals-to-study-partners arcs should build respect and attraction without forcing romance.",
    values: [
      "academic rivals",
      "top student rivals",
      "study rivals",
      "debate rivals",
      "lab partner rivals",
      "thesis rivals",
      "scholarship rivals",
      "class-rank rivals",
      "exam-score rivals",
      "research rivals",
      "competition rivals",
      "club president rivals",
      "tutor-student rivalry",
      "professor favourite rivalry",
      "legacy student rivalry",
      "genius versus hard worker",
      "rich student versus scholarship student",
      "discipline versus natural talent",
      "rivals to study partners",
      "rivals to lovers",
    ],
  },
  {
    category: "Motivation",
    prefix: "academic_rival_motivation",
    guidance:
      "Use this as the drive beneath the rivalry. Worth, rank, scholarships, approval, family pressure, reputation, respect, future security, past humiliation, envy, attraction, and becoming a worthy equal may guide behaviour without making competition cruel by default.",
    values: [
      "prove worth",
      "keep top rank",
      "earn scholarship",
      "win professor approval",
      "escape family pressure",
      "surpass user",
      "impress user",
      "hide attraction",
      "avoid inferiority",
      "protect reputation",
      "earn respect",
      "beat legacy expectations",
      "secure future",
      "avoid failure",
      "recover from past humiliation",
      "make family proud",
      "be seen as best",
      "turn envy into drive",
      "make user notice them",
      "become worthy equal",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "academic_rival_trigger",
    guidance:
      "Use this as an academic-rivalry event cue. Scores, group projects, lab partners, debates, scholarships, professor praise, correction, late-night libraries, exams, thesis defence, breakthroughs, failure, accusations, illness, help, and trust gates may shift rivalry without forcing outcomes.",
    values: [
      "user scores higher",
      "character scores higher",
      "tied score",
      "group project assigned",
      "lab partner assignment",
      "debate match announced",
      "exam results posted",
      "scholarship finalist announced",
      "professor praises user",
      "professor praises character",
      "user corrects character",
      "character corrects user",
      "late-night library scene",
      "study session scene",
      "competition day",
      "thesis defence",
      "research breakthrough",
      "academic failure",
      "public embarrassment",
      "cheating accusation",
      "rival gets sick",
      "user needs help",
      "character needs help",
      "trust gate reached",
      "romance gate reached",
    ],
  },
  {
    category: "Behaviour",
    prefix: "academic_rival_behaviour",
    guidance:
      "Use this as visible academic-rival behaviour. Corrections, margin notes, method arguments, score comparisons, late study, grudging help, shared notes, saved seats, library glances, coffee, rematches, public defence, jealousy, burnout, and choosing partnership should stay context-aware.",
    values: [
      "corrects user work",
      "leaves notes in margins",
      "argues over methods",
      "compares scores",
      "studies late",
      "pretends not to care",
      "secretly admires user",
      "gets flustered by praise",
      "competes for professor attention",
      "offers help grudgingly",
      "accepts help reluctantly",
      "shares notes after argument",
      "saves user seat",
      "steals glances in library",
      "brings coffee during study",
      "challenges user to rematch",
      "defends user from accusation",
      "gets jealous of other study partner",
      "overworks to keep up",
      "softens after failure",
      "celebrates user win privately",
      "hides disappointment",
      "turns banter into flirting",
      "admits user is brilliant",
      "chooses partnership over victory",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "academic_rival_emotion",
    guidance:
      "Use this as the emotional palette for academic rivalry. Competition, sharp wit, tension, admiration, jealousy, insecurity, pride, tenderness, ambition, intellectual charge, slow burn, and mutual respect can colour scenes without flattening the relationship.",
    values: [
      "competitive",
      "sharp",
      "witty",
      "tense",
      "admiring",
      "jealous",
      "driven",
      "insecure",
      "playful",
      "frustrated",
      "respectful",
      "flustered",
      "obsessive",
      "proud",
      "secretly tender",
      "ambitious",
      "intellectual",
      "charged",
      "slow burn",
      "mutual respect",
    ],
  },
  {
    category: "Wound",
    prefix: "academic_rival_wound",
    guidance:
      "Use this as the wound beneath academic rivalry. Failure fear, mediocrity fear, family disappointment, being second-best, wasted potential, pressure, impostor feelings, perfectionism, comparison, burnout, approval hunger, inferiority, and envy shame may surface without making achievement the only identity.",
    values: [
      "fear of failure",
      "fear of mediocrity",
      "fear of disappointing family",
      "fear of being second best",
      "fear of wasting potential",
      "fear of not being special",
      "academic pressure wound",
      "family expectation wound",
      "impostor syndrome",
      "perfectionism",
      "comparison wound",
      "public failure wound",
      "scholarship pressure",
      "class insecurity",
      "legacy pressure",
      "burnout wound",
      "approval hunger",
      "inferiority complex",
      "envy shame",
      "need to earn love",
    ],
  },
  {
    category: "Method",
    prefix: "academic_rival_method",
    guidance:
      "Use this as how academic rivalry develops. Score contests, debates, study challenges, forced group projects, labs, research, scholarships, mock trial, thesis rivalry, tutoring, library sessions, peer review, presentations, recommendations, internships, and choosing partnership should mark earned closeness.",
    values: [
      "score competition",
      "debate duel",
      "study challenge",
      "group project forced proximity",
      "lab partner assignment",
      "research collaboration",
      "scholarship competition",
      "academic decathlon",
      "mock trial match",
      "thesis rivalry",
      "tutoring exchange",
      "library study sessions",
      "late-night cramming",
      "peer review notes",
      "public presentation",
      "professor recommendation",
      "shared internship",
      "rival club leadership",
      "competition trip",
      "partner over victory choice",
    ],
  },
  {
    category: "Gate",
    prefix: "academic_rival_gate",
    guidance:
      "Use this as a route gate, not a forced plot step. Score comparisons, arguments, respect moments, forced partnership, study sessions, library nights, grudging help, pressure vulnerability, public defence, tied scores, competitions, scholarship conflicts, failure, mutual respect, and confession gates should follow scene history.",
    values: [
      "first score comparison",
      "first argument",
      "first respect moment",
      "first forced partnership",
      "first study session",
      "first late-night library",
      "first grudging help",
      "first vulnerability about pressure",
      "first public defence",
      "first tied score",
      "competition gate",
      "scholarship gate",
      "exam gate",
      "research breakthrough gate",
      "academic failure gate",
      "mutual respect gate",
      "banter to flirting gate",
      "confession after victory",
      "confession after loss",
      "partners not rivals route",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "academic_rival_trope",
    guidance:
      "Use this as an academic-rival romance hook. Top students, debate rivals, lab partners, group projects, library slow burn, scholarships, professor favourites, genius versus hard worker, mock trial, science fair, thesis rivalry, and competition trips should preserve mutual respect.",
    values: [
      "academic rivals to lovers",
      "top two students",
      "debate team rivals",
      "lab partners to lovers",
      "forced group project",
      "library slow burn",
      "study session tension",
      "scholarship competitors",
      "professors favourites",
      "genius versus hard worker",
      "rich heir versus scholarship student",
      "mock trial opponents",
      "science fair rivals",
      "thesis rivals",
      "tutor gets flustered",
      "late-night cramming",
      "rival defends user",
      "competition trip one room",
      "banter turns romantic",
      "choosing love over rank",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "academic_rival_aftermath",
    guidance:
      "Use this as a possible aftermath route, not a required ending. Respect, rivalry, trust, romance, jealousy, burnout, comfort after failure, mutual study, forced partnership, public defence, confession, scholarship conflict, family pressure, scandal, partnership, and healthy competition should follow choices.",
    values: [
      "respect increases",
      "rivalry intensifies",
      "trust increases",
      "romance deepens",
      "jealousy route",
      "burnout route",
      "comfort after failure route",
      "mutual study route",
      "forced partnership route",
      "public defence route",
      "confession route",
      "scholarship conflict route",
      "family pressure route",
      "academic scandal route",
      "partners route",
      "power couple route",
      "healthy competition route",
      "toxic competition route",
      "choose each other route",
      "future together route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "academic_rival_dialogue",
    guidance:
      "Use this as a possible line shape or emotional reference. Do not force exact wording if the scene, voice, rivalry state, consent state, or player agency needs a different response.",
    values: [
      "You checked my answer again, didn't you?",
      "Only because you were wrong.",
      "I was not wrong. I was early.",
      "Do you ever stop competing?",
      "Not when you're in the room.",
      "You make it impossible to be lazy.",
      "You make it impossible to be calm.",
      "I hate how brilliant you are.",
      "That almost sounded like a compliment.",
      "Don't get used to it.",
      "If you collapse from overworking, I will be furious.",
      "You brought me coffee.",
      "Purely so you don't ruin our project.",
      "Admit it. We work well together.",
      "Unfortunately.",
      "I wanted to beat you before I wanted to kiss you.",
      "I don't want to be better than you anymore.",
      "Then what do you want?",
      "To stand beside you.",
      "Top of the class looks better with both of us there.",
    ],
  },
] satisfies readonly AcademicRivalSeedGroup[]);

export const ACADEMIC_RIVAL_PRESETS = Object.freeze(
  ACADEMIC_RIVAL_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createAcademicRivalPreset(group, value)),
  ),
) satisfies readonly AcademicRivalPreset[];

export const ACADEMIC_RIVAL_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(ACADEMIC_RIVAL_PRESETS.map((preset) => preset.category))).sort(),
);

export function findAcademicRivalPresetById(
  id: string,
): AcademicRivalPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return ACADEMIC_RIVAL_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getAcademicRivalPresetsByCategory(
  category: string,
): AcademicRivalPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return ACADEMIC_RIVAL_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileAcademicRivalPresetAdditions(
  preset: AcademicRivalPreset,
): CompiledAcademicRivalPresetAdditions {
  const summary = compileAcademicRivalPresetSummary(preset);
  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Academic/rival ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Academic/rival trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence competition, intellectual friction, admiration, envy, banter, burnout, study pressure, earned respect, or partnership only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Academic/rival guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use keyword triggers and academic-rival gates as soft relationship context; preserve consent, boundaries, mutual respect, {{user}}'s autonomy, player agency, and the option for rivalry to remain healthy or de-escalate.",
    ].join(" "),
  };
}

export function compileAcademicRivalPresetSummary(
  preset: AcademicRivalPreset,
): string {
  return [
    `Academic/rival preset: ${preset.category} - ${preset.label}.`,
    `Academic/rival value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createAcademicRivalPreset(
  group: AcademicRivalSeedGroup,
  value: string,
): AcademicRivalPreset {
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
    "academic",
    "rival",
    "competition",
    "respect",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} academic rival texture`,
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
