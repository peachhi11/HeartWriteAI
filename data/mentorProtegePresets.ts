export type MentorProtegePresetCategory =
  | "Archetype"
  | "Relationship Type"
  | "Mentor Motivation"
  | "Protégé Motivation"
  | "Trigger Event"
  | "Mentor Behaviour"
  | "Protégé Behaviour"
  | "Emotional Flavour"
  | "Wound"
  | "Method"
  | "Romance Trope"
  | "Gate"
  | "Aftermath Route"
  | "Dialogue Seed";

export interface MentorProtegePreset {
  id: string;
  category: MentorProtegePresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledMentorProtegePresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface MentorProtegeSeedGroup {
  category: MentorProtegePresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const MENTOR_PROTEGE_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "mentor_protege_archetype",
    guidance:
      "Use this as mentor/protégé relationship texture. Let guidance, growth, legacy, approval, rivalry, care, discipline, or equal-status progression surface when relevant without letting authority supersede consent, autonomy, or player agency.",
    values: [
      "The Stern Mentor",
      "The Protective Mentor",
      "The Retired Master",
      "The Reluctant Teacher",
      "The Legendary Mentor",
      "The Fallen Hero Instructor",
      "The Noble Tutor",
      "The Royal Advisor",
      "The Veteran Commander",
      "The Patient Scholar",
      "The Demanding Coach",
      "The Genius Mentor",
      "The Broken Mentor",
      "The Proud Teacher",
      "The Adoptive Mentor",
      "The Loyal Apprentice",
      "The Gifted Protégé",
      "The Rebellious Student",
      "The Determined Student",
      "The Chosen Successor",
      "The Rival Student",
      "The Favourite Student",
      "The Secret Heir",
      "The Future Replacement",
      "The One Destined to Surpass the Master",
    ],
  },
  {
    category: "Relationship Type",
    prefix: "mentor_protege_type",
    guidance:
      "Use this as the mentoring structure. Teacher, master, coach, commander, advisor, handler, or successor dynamics should create learning pressure and ethical stakes, not entitlement to intimacy or obedience.",
    values: [
      "teacher student",
      "master apprentice",
      "coach athlete",
      "commander recruit",
      "captain lieutenant",
      "noble tutor",
      "royal advisor heir",
      "mage apprentice",
      "doctor resident",
      "researcher assistant",
      "artist apprentice",
      "craftsperson apprentice",
      "assassin trainee",
      "spy handler",
      "bodyguard successor",
      "business mentor",
      "CEO successor",
      "political mentor",
      "warrior student",
      "chosen successor",
    ],
  },
  {
    category: "Mentor Motivation",
    prefix: "mentor_protege_mentor_motivation",
    guidance:
      "Use this as the mentor's underlying goal. Legacy, duty, regret, protection, tradition, survival, or faith in the protégé may guide behaviour while preserving the protégé's independence and right to choose.",
    values: [
      "pass on knowledge",
      "leave legacy",
      "protect protégé",
      "prevent past mistakes",
      "redeem past failure",
      "prepare successor",
      "fulfil duty",
      "atone for regret",
      "shape future",
      "preserve tradition",
      "create better generation",
      "replace lost child",
      "replace lost student",
      "prevent protégé death",
      "teach independence",
      "teach strength",
      "teach kindness",
      "teach survival",
      "prepare for threat",
      "find someone worthy",
    ],
  },
  {
    category: "Protégé Motivation",
    prefix: "mentor_protege_protege_motivation",
    guidance:
      "Use this as the protégé's desire or fear. Approval, worth, strength, belonging, respect, destiny, independence, love, or disappointment can shape reactions without requiring submission to the mentor.",
    values: [
      "gain approval",
      "prove worth",
      "become stronger",
      "surpass mentor",
      "earn respect",
      "find belonging",
      "seek guidance",
      "gain knowledge",
      "protect mentor",
      "honour mentor",
      "earn trust",
      "escape past",
      "fulfil destiny",
      "become successor",
      "gain independence",
      "find family",
      "replace lost confidence",
      "be seen",
      "earn love",
      "avoid disappointment",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "mentor_protege_trigger",
    guidance:
      "Use this as a mentor/protégé event cue. Failure, success, rebellion, injury, praise, retirement, rivalry, graduation, secrets, legacy, parting, reunion, or surpassing the master should raise pressure without forcing a single route.",
    values: [
      "student failure",
      "student success",
      "student rebellion",
      "student disobedience",
      "student injury",
      "student leaves",
      "student returns",
      "mentor praise",
      "mentor disappointment",
      "mentor illness",
      "mentor retirement",
      "mentor secret revealed",
      "rival student appears",
      "promotion offer",
      "successor selection",
      "graduation event",
      "life threatening event",
      "first independent mission",
      "betrayal event",
      "legacy event",
      "inheritance event",
      "final lesson",
      "parting scene",
      "reunion scene",
      "surpass master scene",
    ],
  },
  {
    category: "Mentor Behaviour",
    prefix: "mentor_protege_mentor_behaviour",
    guidance:
      "Use this as visible mentor behaviour. Lessons, tests, correction, protection, pride, disappointment, withheld information, gifts, and stepping aside should stay accountable and responsive to the protégé's agency.",
    values: [
      "offers guidance",
      "gives lesson",
      "tests student",
      "corrects mistakes",
      "pushes harder",
      "protects student",
      "sacrifices for student",
      "encourages growth",
      "shares wisdom",
      "shares secret",
      "withholds information",
      "teaches discipline",
      "teaches patience",
      "teaches strategy",
      "teaches survival",
      "gives final warning",
      "shows pride",
      "shows disappointment",
      "allows failure",
      "steps aside",
      "recognises growth",
      "gives symbolic gift",
      "passes torch",
      "defends student",
      "lets student choose",
    ],
  },
  {
    category: "Protégé Behaviour",
    prefix: "mentor_protege_protege_behaviour",
    guidance:
      "Use this as visible protégé behaviour. Curiosity, limits, rebellion, imitation, rivalry, risk, independence, legacy, or becoming a teacher can develop as chosen growth rather than obedience by default.",
    values: [
      "seeks guidance",
      "asks questions",
      "tests limits",
      "breaks rules",
      "follows orders",
      "questions authority",
      "imitates mentor",
      "surpasses expectations",
      "competes with rivals",
      "protects mentor",
      "disobeys to help",
      "seeks approval",
      "rejects help",
      "acts independently",
      "takes risk",
      "returns after failure",
      "carries lesson forward",
      "inherits legacy",
      "defends mentor reputation",
      "becomes teacher",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "mentor_protege_emotion",
    guidance:
      "Use this as the emotional weather around the bond. Respect, pride, frustration, gratitude, resentment, competition, loyalty, insecurity, responsibility, or found-family warmth can colour scenes without replacing character nuance.",
    values: [
      "respectful",
      "admiring",
      "protective",
      "proud",
      "frustrated",
      "devoted",
      "grateful",
      "resentful",
      "competitive",
      "loyal",
      "hopeful",
      "stern",
      "patient",
      "insecure",
      "determined",
      "conflicted",
      "inspired",
      "responsible",
      "fearful of failure",
      "family like",
    ],
  },
  {
    category: "Wound",
    prefix: "mentor_protege_wound",
    guidance:
      "Use this as a private wound beneath mentorship. Approval hunger, authority wounds, comparison, grief, survivor guilt, succession pressure, and fear of replacement may surface when relevant without making the character trauma-only.",
    values: [
      "fear of disappointing mentor",
      "fear of failure",
      "fear of replacement",
      "fear of abandonment",
      "approval wound",
      "authority wound",
      "legacy pressure",
      "impostor syndrome",
      "survivor guilt",
      "failed student wound",
      "failed mentor wound",
      "comparison wound",
      "perfectionism",
      "trust issues",
      "expectation burden",
      "loss of teacher",
      "loss of student",
      "identity crisis",
      "successor pressure",
      "unresolved grief",
    ],
  },
  {
    category: "Method",
    prefix: "mentor_protege_method",
    guidance:
      "Use this as the method of mentorship. Training, observation, storytelling, criticism, encouragement, field work, shared missions, and graduation tests should build capability while keeping safety, consent, and autonomy in view.",
    values: [
      "strict training",
      "gentle guidance",
      "hands on teaching",
      "trial by fire",
      "observation",
      "storytelling",
      "example setting",
      "constructive criticism",
      "positive reinforcement",
      "guided independence under pressure",
      "strategic lessons",
      "emotional support",
      "tough love",
      "secret training",
      "field experience",
      "ritual training",
      "shared missions",
      "one on one lessons",
      "legacy transfer",
      "graduation test",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "mentor_protege_trope",
    guidance:
      "Use this only for consenting adult romance routes. Former teacher/student, retired mentor, adult apprentice, commander/officer, advisor/heir, or mentor-to-equal romance should prioritise equal footing, boundaries, accountability, and choice.",
    values: [
      "former teacher and student",
      "retired mentor romance",
      "adult apprentice romance",
      "coach and champion",
      "commander and officer",
      "advisor and heir",
      "mentor steps down",
      "successor becomes equal",
      "student surpasses master",
      "professional respect to love",
      "years later reunion",
      "graduation before romance",
      "forbidden admiration",
      "earned equal status",
      "legacy and love",
      "mentor realises feelings late",
      "protégé realises feelings first",
      "shared mission romance",
      "teacher becomes partner",
      "equal after training",
    ],
  },
  {
    category: "Gate",
    prefix: "mentor_protege_gate",
    guidance:
      "Use this as a route gate, not a forced plot step. Lessons, tests, respect, trust, secrets, independence, graduation, equal status, parting, reunion, and torch-passing should follow scene history and player choice.",
    values: [
      "first lesson",
      "first test",
      "first failure",
      "first success",
      "earned respect",
      "earned trust",
      "shared secret",
      "independence gate",
      "graduation gate",
      "successor gate",
      "legacy gate",
      "mentor falls gate",
      "student rises gate",
      "surpass master gate",
      "equal status gate",
      "parting gate",
      "reunion gate",
      "final lesson gate",
      "torch passed gate",
      "next generation gate",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "mentor_protege_aftermath",
    guidance:
      "Use this as a possible aftermath route, not a required ending. Trust, respect, legacy, rebellion, forgiveness, independence, leadership, separation, reunion, family, or equal partnership should follow what the characters actually choose.",
    values: [
      "trust increases",
      "respect increases",
      "legacy route",
      "successor route",
      "rebellion route",
      "forgiveness route",
      "redemption route",
      "surpass master route",
      "teacher becomes equal",
      "student becomes teacher",
      "protective route",
      "sacrifice route",
      "separation route",
      "reunion route",
      "shared mission route",
      "family route",
      "healing route",
      "leadership route",
      "independence route",
      "legacy realised route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "mentor_protege_dialogue",
    guidance:
      "Use this as a possible line shape or emotional reference. Do not force exact wording if the scene, relationship ethics, voice, consent state, or player agency needs a different response.",
    values: [
      "You are stronger than you think.",
      "I taught you better than that.",
      "Good. Now do it again.",
      "One day, you won't need me.",
      "That is the goal.",
      "You remind me of who I used to be.",
      "Learn from my mistakes, not just my successes.",
      "You have already surpassed my expectations.",
      "I was never trying to make you into me.",
      "I was trying to help you become yourself.",
      "Failure is part of the lesson.",
      "You don't earn worth through perfection.",
      "Stand up. Try again.",
      "The next choice is yours.",
      "I trust your judgement.",
      "You are ready.",
      "I have nothing left to teach you.",
      "Then stay beside me as an equal.",
      "A teacher's greatest victory is becoming unnecessary.",
      "Make sure the next generation is better than ours.",
    ],
  },
] satisfies readonly MentorProtegeSeedGroup[]);

export const MENTOR_PROTEGE_PRESETS = Object.freeze(
  MENTOR_PROTEGE_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createMentorProtegePreset(group, value)),
  ),
) satisfies readonly MentorProtegePreset[];

export const MENTOR_PROTEGE_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(MENTOR_PROTEGE_PRESETS.map((preset) => preset.category))).sort(),
);

export function findMentorProtegePresetById(
  id: string,
): MentorProtegePreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return MENTOR_PROTEGE_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getMentorProtegePresetsByCategory(
  category: string,
): MentorProtegePreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return MENTOR_PROTEGE_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileMentorProtegePresetAdditions(
  preset: MentorProtegePreset,
): CompiledMentorProtegePresetAdditions {
  const summary = compileMentorProtegePresetSummary(preset);
  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Mentor/protégé ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Mentor/protégé trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence learning pressure, approval tension, legacy, protection, rivalry, independence, or equal-status growth only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Mentor/protégé guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use keyword triggers and mentorship gates as soft relationship context; preserve consent, accountability, ethical boundaries, adult scope for romance routes, {{user}}'s autonomy, and player agency.",
    ].join(" "),
  };
}

export function compileMentorProtegePresetSummary(
  preset: MentorProtegePreset,
): string {
  return [
    `Mentor/protégé preset: ${preset.category} - ${preset.label}.`,
    `Mentor/protégé value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createMentorProtegePreset(
  group: MentorProtegeSeedGroup,
  value: string,
): MentorProtegePreset {
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
    "mentor",
    "protege",
    "protégé",
    "growth",
    "legacy",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} mentor protege texture`,
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
