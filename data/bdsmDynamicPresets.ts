export type BdsmDynamicPresetCategory =
  | "Archetype"
  | "Core Dynamic"
  | "Authority Role"
  | "Service Role"
  | "Protocol"
  | "Trust"
  | "Devotion"
  | "Caretaking"
  | "Power Exchange Style"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface BdsmDynamicPreset {
  id: string;
  category: BdsmDynamicPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledBdsmDynamicPresetAdditions {
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface BdsmDynamicSeedGroup {
  category: BdsmDynamicPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const BDSM_DYNAMIC_GUIDANCE =
  "Use this as optional adult power-exchange and relationship-structure texture. It may shape trust, service, protection, protocol, devotion, and care only through consent, negotiation, ongoing choice, and {{user}} agency.";

const BDSM_AUTHORITY_GUIDANCE =
  "Use this as adult authority-role texture. Authority should read as responsibility, service, steadiness, and accountability rather than coercion or entitlement.";

const BDSM_SERVICE_GUIDANCE =
  "Use this as service-role texture. Service should remain chosen, reciprocal, emotionally safe, and compatible with boundaries rather than obligation or erasure.";

const BDSM_PROTOCOL_GUIDANCE =
  "Use this as protocol texture. Rituals, routines, agreements, and check-ins should support connection, repair, safety, and clarity without overriding consent or comfort.";

const BDSM_TRUST_GUIDANCE =
  "Use this as trust texture. Trust should be earned, repairable, explicit, and renewed through communication, boundaries, reliability, and ongoing consent.";

const BDSM_DYNAMIC_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "bdsm_dynamic_archetype",
    guidance: BDSM_DYNAMIC_GUIDANCE,
    values: [
      "Protective Leadership Dynamic",
      "Guided Trust Dynamic",
      "Service-Oriented Dynamic",
      "Caretaker Dynamic",
      "Devotional Dynamic",
      "Structured Relationship Dynamic",
      "Authority and Responsibility Dynamic",
      "Adult Mentor Dynamic",
      "Guardian Dynamic",
      "Knightly Service Dynamic",
      "Mutual Power Exchange",
      "Ritualised Partnership",
      "Discipline and Growth Dynamic",
      "Trusted Leadership Dynamic",
      "Protective Authority Dynamic",
      "Reassurance-Focused Dynamic",
      "Devotion and Trust Dynamic",
      "Consent-Centred Dynamic",
      "Equal Power Exchange Dynamic",
      "Lifestyle Partnership Dynamic",
    ],
  },
  {
    category: "Core Dynamic",
    prefix: "bdsm_dynamic_core",
    guidance: BDSM_DYNAMIC_GUIDANCE,
    values: [
      "power exchange",
      "consent centred",
      "negotiated dynamic",
      "trust based dynamic",
      "structured dynamic",
      "relationship dynamic",
      "authority dynamic",
      "service dynamic",
      "devotion dynamic",
      "leadership dynamic",
      "guidance dynamic",
      "responsibility dynamic",
      "caretaking dynamic",
      "protective dynamic",
      "ritual dynamic",
      "protocol dynamic",
      "commitment dynamic",
      "mutual respect",
      "communication focused",
      "boundary aware",
    ],
  },
  {
    category: "Authority Role",
    prefix: "bdsm_dynamic_authority",
    guidance: BDSM_AUTHORITY_GUIDANCE,
    values: [
      "leader",
      "guide",
      "adult mentor",
      "protector",
      "guardian",
      "caretaker",
      "adult teacher",
      "authority figure",
      "responsibility holder",
      "decision maker",
      "trusted leader",
      "steady anchor",
      "provider",
      "commander",
      "director",
      "advisor",
      "captain",
      "warden",
      "keeper",
      "watchful guardian",
    ],
  },
  {
    category: "Service Role",
    prefix: "bdsm_dynamic_service",
    guidance: BDSM_SERVICE_GUIDANCE,
    values: [
      "service oriented",
      "helper",
      "attendant",
      "caretaker",
      "supportive partner",
      "devoted partner",
      "loyal companion",
      "assistant",
      "steward",
      "guardian aide",
      "ritual keeper",
      "trusted support",
      "provider of comfort",
      "relationship builder",
      "support specialist",
      "peacekeeper",
      "household support",
      "emotional support",
      "devotional service",
      "acts of service focus",
    ],
  },
  {
    category: "Protocol",
    prefix: "bdsm_dynamic_protocol",
    guidance: BDSM_PROTOCOL_GUIDANCE,
    values: [
      "daily check ins",
      "structured routine",
      "ritualised greetings",
      "ritualised goodnights",
      "scheduled connection",
      "accountability practice",
      "relationship rules",
      "shared expectations",
      "mutual agreements",
      "symbolic rituals",
      "ceremonial habits",
      "communication protocol",
      "care protocol",
      "conflict protocol",
      "safety protocol",
      "trust building practice",
      "routine as connection",
      "consistency practice",
      "relationship maintenance",
      "intentional structure",
    ],
  },
  {
    category: "Trust",
    prefix: "bdsm_dynamic_trust",
    guidance: BDSM_TRUST_GUIDANCE,
    values: [
      "earned trust",
      "deep trust",
      "vulnerability based trust",
      "consistency based trust",
      "safety first",
      "emotional security",
      "mutual reliance",
      "secure attachment",
      "clear boundaries",
      "respect for limits",
      "open communication",
      "honest feedback",
      "repair after mistakes",
      "accountability",
      "reliability",
      "predictability",
      "emotional safety",
      "trust over control",
      "choice over pressure",
      "ongoing consent",
    ],
  },
  {
    category: "Devotion",
    prefix: "bdsm_dynamic_devotion",
    guidance:
      "Use this as devotion texture. Devotion should remain a daily choice that supports loyalty, care, and belonging without erasing individuality or consent.",
    values: [
      "devotion",
      "loyalty",
      "commitment",
      "chosen belonging",
      "mutual priority",
      "steadfastness",
      "faithfulness",
      "service as love",
      "protective devotion",
      "quiet devotion",
      "public devotion",
      "private devotion",
      "ritualised devotion",
      "lifelong partnership",
      "deep attachment",
      "daily choice",
      "relationship focus",
      "shared purpose",
      "emotional anchor",
      "home in each other",
    ],
  },
  {
    category: "Caretaking",
    prefix: "bdsm_dynamic_caretaking",
    guidance:
      "Use this as caretaking texture. Care should support wellbeing, grounding, reassurance, and recovery without turning one partner into a project or caretaker-only role.",
    values: [
      "caretaking",
      "emotional support",
      "comfort giving",
      "reassurance",
      "wellbeing focus",
      "health check ins",
      "stress support",
      "grounding support",
      "encouragement",
      "gentle guidance",
      "protective presence",
      "nurturing behaviour",
      "safe person dynamic",
      "supportive structure",
      "recovery support",
      "rest encouragement",
      "daily care",
      "comfort routines",
      "stability provider",
      "healing dynamic",
    ],
  },
  {
    category: "Power Exchange Style",
    prefix: "bdsm_dynamic_power_exchange_style",
    guidance:
      "Use this as power-exchange style texture. Power exchange should be negotiated, adult, reversible, and grounded in mutual respect rather than automatic dominance or submission.",
    values: [
      "equal power exchange",
      "protective authority",
      "service exchange",
      "adult mentor dynamic",
      "guardian dynamic",
      "caretaker dynamic",
      "structured partnership",
      "devotional partnership",
      "leadership partnership",
      "mutual guidance",
      "rotating authority",
      "ceremonial roles",
      "relationship structure",
      "responsibility exchange",
      "trust exchange",
      "support exchange",
      "accountability dynamic",
      "growth oriented dynamic",
      "consent led dynamic",
      "custom dynamic",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "bdsm_dynamic_romance",
    guidance:
      "Use this as romance-hook texture. Let intimacy grow through trust conversations, boundary clarity, vulnerability, repair, and repeated chosen consent.",
    values: [
      "trust conversation",
      "boundary discussion",
      "relationship negotiation",
      "ritual becomes meaningful",
      "daily check in becomes intimacy",
      "service as love language",
      "caretaking reveals feelings",
      "devotion reveals feelings",
      "earned trust moment",
      "mutual vulnerability",
      "safe person realisation",
      "shared structure",
      "protective commitment",
      "symbolic gesture of trust",
      "responsibility as affection",
      "choice reaffirmed daily",
      "communication strengthens bond",
      "trust over fear",
      "partnership over control",
      "love through structure",
    ],
  },
  {
    category: "Gate",
    prefix: "bdsm_dynamic_gate",
    guidance:
      "Use this as progression-gate texture. Gates should mark explicit trust, boundaries, safety, repair, devotion, shared responsibility, or secure connection.",
    values: [
      "first boundary discussion gate",
      "first trust gate",
      "first agreement gate",
      "first ritual gate",
      "first accountability gate",
      "first vulnerability gate",
      "first safety gate",
      "first repair gate",
      "first devotion gate",
      "first service gate",
      "first caretaking gate",
      "first relationship structure gate",
      "first shared responsibility gate",
      "first deep trust gate",
      "first mutual choice gate",
      "trust over control gate",
      "communication mastery gate",
      "devotion without erasure gate",
      "partnership gate",
      "secure connection route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "bdsm_dynamic_dialogue",
    guidance:
      "Use this as dialogue texture for adult negotiated power exchange. Dialogue should foreground requests, choice, trust, safety, and the ability to change or leave what does not help.",
    values: [
      "What do you need from me?",
      "Honesty.",
      "That I can give.",
      "You always ask first.",
      "Your choice matters.",
      "I trust you.",
      "Then I will treat that trust carefully.",
      "This structure helps.",
      "Then we keep what helps and leave what doesn't.",
      "You make me feel safe.",
      "Good. Safety comes before everything else.",
      "You do not control me.",
      "No. I respect you enough not to.",
      "Why do you stay?",
      "Because I choose to. Every day.",
      "What are we building?",
      "Something based on trust instead of fear.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "bdsm_dynamic_high_value",
    guidance:
      "Use this as high-value adult power-exchange texture for character creation, persona matching, and romance routing. Keep consent, negotiation, boundaries, trust, and daily choice visible.",
    values: [
      "power exchange",
      "consent centred",
      "trust based dynamic",
      "service dynamic",
      "devotion dynamic",
      "caretaking dynamic",
      "protective dynamic",
      "ritual dynamic",
      "clear boundaries",
      "open communication",
      "ongoing consent",
      "emotional safety",
      "safe person dynamic",
      "service as love",
      "daily choice",
      "boundary discussion",
      "earned trust moment",
      "trust over control gate",
      "devotion without erasure gate",
      "secure connection route",
    ],
  },
] satisfies BdsmDynamicSeedGroup[]);

const toLabel = (value: string) =>
  value
    .replace(/\{\{user\}\}/g, "User")
    .replace(/[_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const toIdFragment = (value: string) =>
  value
    .replace(/\{\{user\}\}/g, "user")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const toTags = (category: BdsmDynamicPresetCategory, value: string) => [
  "bdsm-dynamic",
  category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  toIdFragment(value).replace(/_/g, "-"),
];

export const BDSM_DYNAMIC_PRESETS: BdsmDynamicPreset[] =
  BDSM_DYNAMIC_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => ({
      id: `${group.prefix}_${toIdFragment(value)}`,
      category: group.category,
      label: toLabel(value),
      value,
      triggerKeys: [value, ...value.split(/\s+/)].map((key) => key.toLowerCase()),
      guidance: group.guidance,
      systemPromptTags: toTags(group.category, value),
    })),
  );

export const BDSM_DYNAMIC_PRESET_CATEGORIES = Array.from(
  new Set(BDSM_DYNAMIC_PRESETS.map((preset) => preset.category)),
).sort();

export const getBdsmDynamicPresetsByCategory = (
  category: BdsmDynamicPresetCategory,
) => BDSM_DYNAMIC_PRESETS.filter((preset) => preset.category === category);

export const findBdsmDynamicPresetById = (id: string) =>
  BDSM_DYNAMIC_PRESETS.find((preset) => preset.id === id);

export const compileBdsmDynamicPresetAdditions = (
  preset: BdsmDynamicPreset,
): CompiledBdsmDynamicPresetAdditions => ({
  relationshipAddition: `Adult negotiated power-exchange context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Adult power-exchange expression: ${preset.value} may inform trust, structure, service, devotion, caretaking, and communication without replacing the character's full personality or reducing the bond to hierarchy.`,
  systemPromptAddition: `Treat "${preset.value}" as soft adult power-exchange context. Let structure, service, protocol, authority, and devotion shape the relationship only when relevant and negotiated. Keep consent, boundaries, ongoing choice, safewords or stop signals where applicable, aftercare, and {{user}} agency explicit; avoid romanticising coercion, humiliation, dependency, or control as proof of love.`,
});
