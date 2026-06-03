export type WorkplaceHierarchyPresetCategory =
  | "Archetype"
  | "Hierarchy Type"
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

export interface WorkplaceHierarchyPreset {
  id: string;
  category: WorkplaceHierarchyPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledWorkplaceHierarchyPresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface WorkplaceHierarchySeedGroup {
  category: WorkplaceHierarchyPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const WORKPLACE_HIERARCHY_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "workplace_hierarchy_archetype",
    guidance:
      "Use this as adult workplace hierarchy romance texture. Let professional distance, status gaps, mentorship, authority, ethics, secrecy, ambition, or workplace scrutiny surface when relevant without allowing coercion, career punishment, or authority abuse.",
    values: [
      "The CEO and Assistant",
      "The Boss and Employee",
      "The Manager and Intern",
      "The Executive and Bodyguard",
      "The Rival Department Heads",
      "The Mentor and Protégé",
      "The Professor and Research Assistant",
      "The Doctor and Nurse",
      "The Captain and Lieutenant",
      "The Idol and Manager",
      "The Actor and Agent",
      "The Noble and Servant",
      "The Mafia Boss and Right Hand",
      "The Royal and Advisor",
      "The Commander and Soldier",
      "The Lawyer and Paralegal",
      "The Chef and Apprentice",
      "The Editor and Writer",
      "The Client and Contractor",
      "The Heir and Secretary",
    ],
  },
  {
    category: "Hierarchy Type",
    prefix: "workplace_hierarchy_type",
    guidance:
      "Use this as the adult hierarchy structure. Bosses, mentors, clients, commanders, nobles, doctors, celebrities, or founders should create workplace pressure and ethical stakes, not entitlement to intimacy or control.",
    values: [
      "boss employee",
      "CEO assistant",
      "manager subordinate",
      "mentor protégé",
      "senior junior",
      "client contractor",
      "celebrity manager",
      "idol staff",
      "doctor nurse",
      "professor assistant",
      "captain lieutenant",
      "commander soldier",
      "royal advisor",
      "noble servant",
      "mafia boss right hand",
      "lawyer paralegal",
      "editor writer",
      "chef apprentice",
      "artist patron",
      "founder employee",
    ],
  },
  {
    category: "Motivation",
    prefix: "workplace_hierarchy_motivation",
    guidance:
      "Use this as the desire or fear beneath the hierarchy. Attraction, respect, ambition, loyalty, approval, status gaps, scandal, and reputation pressure may guide behaviour while preserving consent, autonomy, and fair professional treatment.",
    values: [
      "forbidden attraction",
      "professional respect",
      "power imbalance tension",
      "ambition",
      "mentorship",
      "protection",
      "loyalty",
      "career advancement",
      "status gap",
      "secret crush",
      "mutual dependence",
      "admiration",
      "rivalry",
      "need for approval",
      "desire to impress",
      "desire to prove worth",
      "desire to be seen as equal",
      "fear of scandal",
      "fear of favouritism",
      "choosing love over reputation",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "workplace_hierarchy_trigger",
    guidance:
      "Use this as a workplace event cue. Reviews, trips, praise, reprimands, gossip, HR warnings, deadlines, resignations, leaked scandals, and gate moments may raise tension without forcing romance or retaliation.",
    values: [
      "late night work",
      "business trip",
      "office after hours",
      "performance review",
      "promotion offer",
      "demotion threat",
      "public praise",
      "public reprimand",
      "private meeting",
      "shared hotel room",
      "confidential assignment",
      "rival co-worker flirts",
      "co-worker gossip",
      "HR warning",
      "contract negotiation",
      "deadline crisis",
      "workplace accident",
      "mentor praises user",
      "boss defends user",
      "user resigns",
      "character resigns",
      "scandal leaks",
      "power dynamic called out",
      "trust gate reached",
      "romance gate reached",
    ],
  },
  {
    category: "Behaviour",
    prefix: "workplace_hierarchy_behaviour",
    guidance:
      "Use this as visible workplace behaviour. Formality, public restraint, private softness, guidance, favouritism risk, secrecy, boundaries, and resignation thoughts should stay consequence-aware and non-coercive.",
    values: [
      "keeps professional distance",
      "uses formal titles",
      "drops formality in private",
      "praises work publicly",
      "protects user from gossip",
      "assigns special task",
      "avoids favouritism",
      "shows subtle favouritism",
      "works late with user",
      "brings coffee",
      "fixes user mistake quietly",
      "takes blame professionally",
      "defends user in meeting",
      "gets jealous of co-worker",
      "maintains composure publicly",
      "loses composure privately",
      "sets boundaries",
      "breaks boundaries",
      "offers career guidance",
      "tests competence",
      "invites to private dinner",
      "keeps relationship secret",
      "considers resignation",
      "chooses ethics over desire",
      "chooses love over position",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "workplace_hierarchy_emotion",
    guidance:
      "Use this as the emotional weather around authority and work. Control, restraint, professionalism, jealousy, guilt, dominance, deference, secrecy, and private vulnerability can colour scenes without overriding ethics or consent.",
    values: [
      "controlled",
      "restrained",
      "forbidden",
      "charged",
      "professional",
      "protective",
      "ambitious",
      "admiring",
      "tense",
      "jealous",
      "guilty",
      "disciplined",
      "dominant",
      "deferential",
      "respectful",
      "conflicted",
      "secretive",
      "possessive",
      "polished",
      "vulnerable in private",
    ],
  },
  {
    category: "Wound",
    prefix: "workplace_hierarchy_wound",
    guidance:
      "Use this as the private wound beneath workplace hierarchy. Scandal, exploitation fear, favouritism fear, job loss, class gaps, authority wounds, ambition conflict, and dependency fear may guide reactions without making power abuse acceptable.",
    values: [
      "fear of scandal",
      "fear of exploitation",
      "fear of favouritism",
      "fear of losing job",
      "fear of losing authority",
      "fear of not being respected",
      "fear of being used",
      "fear of career damage",
      "class gap wound",
      "status gap wound",
      "mentor betrayal wound",
      "workplace humiliation wound",
      "impostor syndrome",
      "approval hunger",
      "powerlessness wound",
      "authority wound",
      "reputation wound",
      "ambition versus love conflict",
      "professional identity wound",
      "dependency fear",
    ],
  },
  {
    category: "Method",
    prefix: "workplace_hierarchy_method",
    guidance:
      "Use this as how workplace hierarchy enters the story. Secret relationships, boundaries, resignations, promotions, HR intervention, contract clauses, status transitions, and power reversals should open ethical tension rather than excuse exploitation.",
    values: [
      "secret relationship",
      "professional boundaries",
      "private confession",
      "resignation before romance",
      "promotion conflict",
      "mentor guidance",
      "workplace rivalry",
      "after-hours closeness",
      "business trip proximity",
      "public distance private tenderness",
      "contract clause tension",
      "office gossip pressure",
      "HR intervention",
      "career sacrifice",
      "equal status transition",
      "rival company offer",
      "conflict of interest",
      "protective authority",
      "power reversal",
      "mutual respect growth",
    ],
  },
  {
    category: "Gate",
    prefix: "workplace_hierarchy_gate",
    guidance:
      "Use this as a route gate, not a forced plot step. Private meetings, boundary warnings, praise, gossip, HR, resignation, status equality, and public reveals should follow scene history and player choice.",
    values: [
      "first private meeting",
      "first after-hours scene",
      "first boundary warning",
      "first public praise",
      "first private softness",
      "first workplace jealousy",
      "business trip gate",
      "shared hotel gate",
      "promotion conflict gate",
      "gossip gate",
      "scandal gate",
      "HR gate",
      "resignation gate",
      "equal status gate",
      "confession in office",
      "career versus love gate",
      "public relationship reveal",
      "professional boundaries route",
      "forbidden romance route",
      "power rebalanced route",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "workplace_hierarchy_trope",
    guidance:
      "Use this as an adult workplace hierarchy romance hook. Bosses, assistants, mentors, doctors, idols, agents, royals, nobles, and office trips should stay consent-aware, ethics-aware, and accountability-aware.",
    values: [
      "boss and assistant",
      "CEO romance",
      "office rivals",
      "mentor and protégé",
      "professor and research assistant",
      "doctor and nurse",
      "idol and manager",
      "actor and agent",
      "bodyguard and client",
      "royal and advisor",
      "noble and servant",
      "mafia boss and right hand",
      "captain and subordinate",
      "lawyer and paralegal",
      "chef and apprentice",
      "editor and writer",
      "business trip one bed",
      "late night office confession",
      "secret office romance",
      "promotion complicates love",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "workplace_hierarchy_aftermath",
    guidance:
      "Use this as a possible aftermath route, not a required ending. Trust, respect, distance, secrecy, gossip, scandal, career conflict, resignation, equal partnership, or boundary repair should follow what the characters actually choose.",
    values: [
      "trust increases",
      "respect increases",
      "romance deepens",
      "professional distance route",
      "secret relationship route",
      "gossip route",
      "scandal route",
      "career conflict route",
      "resignation route",
      "equal partner route",
      "promotion route",
      "jealousy route",
      "public reveal route",
      "boundary repair route",
      "power rebalance route",
      "betrayal by authority route",
      "protective boss route",
      "ambition route",
      "forbidden love route",
      "commitment after risk route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "workplace_hierarchy_dialogue",
    guidance:
      "Use this as a possible line shape or emotional reference. Do not force exact wording if the scene, workplace ethics, voice, consent state, or player agency needs a different response.",
    values: [
      "This conversation is dangerously unprofessional.",
      "Call me by my name when we are alone.",
      "I will not let them question your work because of me.",
      "You earned this. Not because I care about you.",
      "That is exactly the problem. I do care.",
      "I am your superior. I cannot pretend that does not matter.",
      "Then step down from the pedestal and talk to me.",
      "You make it very difficult to keep boundaries.",
      "I will not use my position to keep you close.",
      "If this costs me my title, so be it.",
      "I respect you too much to make this easy.",
      "They are watching us.",
      "Let them watch.",
      "I need to know this is not just admiration.",
      "You are not a mistake I made after office hours.",
      "I wanted you before I had any right to.",
      "Your career matters to me. So do you.",
      "I will resign before I let this ruin you.",
      "In public, I am careful. In private, I am yours.",
      "Choose me when we are equals.",
    ],
  },
] satisfies readonly WorkplaceHierarchySeedGroup[]);

export const WORKPLACE_HIERARCHY_PRESETS = Object.freeze(
  WORKPLACE_HIERARCHY_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createWorkplaceHierarchyPreset(group, value)),
  ),
) satisfies readonly WorkplaceHierarchyPreset[];

export const WORKPLACE_HIERARCHY_PRESET_CATEGORIES = Object.freeze(
  Array.from(
    new Set(WORKPLACE_HIERARCHY_PRESETS.map((preset) => preset.category)),
  ).sort(),
);

export function findWorkplaceHierarchyPresetById(
  id: string,
): WorkplaceHierarchyPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return WORKPLACE_HIERARCHY_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getWorkplaceHierarchyPresetsByCategory(
  category: string,
): WorkplaceHierarchyPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return WORKPLACE_HIERARCHY_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileWorkplaceHierarchyPresetAdditions(
  preset: WorkplaceHierarchyPreset,
): CompiledWorkplaceHierarchyPresetAdditions {
  const summary = compileWorkplaceHierarchyPresetSummary(preset);
  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Workplace hierarchy ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Workplace hierarchy trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence professional restraint, status pressure, ethical hesitation, private tenderness, ambition, workplace scrutiny, or boundary repair only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Workplace hierarchy guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use keyword triggers and workplace gates as soft hierarchy context; preserve consent, accountability, ethical boundaries, fair professional treatment, {{user}}'s autonomy, and player agency.",
    ].join(" "),
  };
}

export function compileWorkplaceHierarchyPresetSummary(
  preset: WorkplaceHierarchyPreset,
): string {
  return [
    `Workplace hierarchy preset: ${preset.category} - ${preset.label}.`,
    `Workplace hierarchy value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createWorkplaceHierarchyPreset(
  group: WorkplaceHierarchySeedGroup,
  value: string,
): WorkplaceHierarchyPreset {
  const label = toTitleLabel(value);
  const triggerKeys = uniquePreserveOrder([
    ...value
      .toLowerCase()
      .replace(/["'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "workplace",
    "hierarchy",
    "ethics",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} workplace hierarchy texture`,
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
