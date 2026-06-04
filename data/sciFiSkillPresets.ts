export type SciFiSkillPresetCategory =
  | "Archetype"
  | "Core Sci-Fi Skill"
  | "Weakness"
  | "Romance Hook"
  | "Gate"
  | "Mastery"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface SciFiSkillPreset {
  id: string;
  category: SciFiSkillPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledSciFiSkillPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface SciFiSkillSeedGroup {
  category: SciFiSkillPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const SCI_FI_SKILL_GUIDANCE =
  "Use this as sci-fi skill texture. Spaceflight, engineering, systems, AI, medicine, alien contact, and colony survival may shape scenes without replacing personality, consent, or {{user}} agency.";

const SCI_FI_SKILL_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "sci_fi_skill_archetype",
    guidance: SCI_FI_SKILL_GUIDANCE,
    values: [
      "The Starship Pilot",
      "The Astrogator",
      "The Starship Engineer",
      "The Systems Operator",
      "The Life Support Specialist",
      "The Terraformer",
      "The Robotics Expert",
      "The Android Technician",
      "The AI Specialist",
      "The Cyberneticist",
      "The Xenobiologist",
      "The Xenolinguist",
      "The Alien Diplomat",
      "The Space Medic",
      "The Drone Operator",
      "The Signal Analyst",
      "The Colony Manager",
      "The Zero-G Specialist",
      "The Quantum Hacker",
      "The One Who Survives the Stars",
    ],
  },
  {
    category: "Core Sci-Fi Skill",
    prefix: "sci_fi_skill_core",
    guidance:
      "Use this as core sci-fi skill texture. Technical competence, protocol, survival pressure, alien contact, and system limits may shape choices and stakes.",
    values: [
      "sci-fi skill",
      "piloting",
      "starship piloting",
      "shuttle piloting",
      "fighter piloting",
      "astrogation",
      "starship navigation",
      "orbital navigation",
      "jump gate navigation",
      "warp course plotting",
      "spacewalk operations",
      "zero gravity movement",
      "EVA operations",
      "airlock protocol",
      "docking procedure",
      "emergency docking",
      "ship-to-ship manoeuvring",
      "asteroid field navigation",
      "combat piloting",
      "crash landing survival",
      "starship engineering",
      "warp engine maintenance",
      "reactor maintenance",
      "fusion core repair",
      "shield generator repair",
      "artificial gravity repair",
      "life support maintenance",
      "oxygen systems",
      "water recycling systems",
      "hydroponics systems",
      "air filtration",
      "thermal regulation",
      "power grid management",
      "station systems",
      "colony systems",
      "emergency repairs",
      "field jury-rigging",
      "damage control",
      "systems diagnostics",
      "engine room operations",
      "robotics",
      "android repair",
      "synthetic body repair",
      "drone control",
      "drone swarm control",
      "robot behaviour tuning",
      "automation design",
      "humanoid interface design",
      "companion android maintenance",
      "combat drone programming",
      "medical bot operation",
      "maintenance bot supervision",
      "mech piloting",
      "exosuit operation",
      "prosthetic calibration",
      "cybernetic repair",
      "neural interface calibration",
      "implant maintenance",
      "biofeedback tuning",
      "synthetic personhood research",
      "AI development",
      "AI diagnostics",
      "AI alignment",
      "AI ethics",
      "ship AI interface",
      "AI core maintenance",
      "machine learning",
      "predictive modelling",
      "behavioural modelling",
      "sentience testing",
      "emotional simulation tuning",
      "memory archive management",
      "data recovery",
      "quantum computing",
      "algorithm design",
      "network security",
      "cybersecurity",
      "hacking",
      "counter-hacking",
      "encryption breaking",
      "xenobiology",
      "xenomedicine",
      "alien anatomy",
      "alien ecology",
      "alien pathogen analysis",
      "alien behaviour study",
      "xenolinguistics",
      "translation implant use",
      "first contact protocol",
      "alien diplomacy",
      "cross-species negotiation",
      "alien courtship customs",
      "cultural translation",
      "nonhuman body language reading",
      "interstellar law",
      "treaty negotiation",
      "planetary survey",
      "terraforming assessment",
      "habitat viability analysis",
      "biosphere management",
      "terraforming",
      "climate engineering",
      "atmosphere processing",
      "soil reclamation",
      "radiation shielding",
      "dome maintenance",
      "colony planning",
      "resource allocation",
      "oxygen ration management",
      "water ration management",
      "food production systems",
      "colony security",
      "settlement logistics",
      "supply chain in space",
      "mining operations",
      "asteroid mining",
      "salvage operations",
      "hazardous environment work",
      "radiation storm protocol",
      "deep space survival",
      "signal analysis",
      "long range communications",
      "deep space transmission",
      "encrypted comms",
      "distress signal decoding",
      "sensor operation",
      "radar lidar analysis",
      "stellar cartography",
      "planetary scanning",
      "surveillance systems",
      "counter-surveillance",
      "stealth systems",
      "cloaking systems",
      "navigation beacon repair",
      "communication delay management",
      "holographic systems",
      "virtual reality systems",
      "augmented reality interfaces",
      "neural messaging",
      "dead signal recovery",
    ],
  },
  {
    category: "Weakness",
    prefix: "sci_fi_skill_weakness",
    guidance:
      "Use this as sci-fi weakness texture. Protocol dependence, isolation, identity instability, body shame, and system trauma may surface when relevant without flattening the character.",
    values: [
      "overrelies on protocol",
      "breaks protocol for love",
      "trusts systems more than people",
      "machine logic emotional blind spot",
      "space isolation wound",
      "cryosleep disorientation",
      "memory backup anxiety",
      "identity instability",
      "humanity questioned",
      "android personhood wound",
      "cybernetic body shame",
      "clone identity crisis",
      "communication delay grief",
      "life support trauma",
      "airlock trauma",
      "radiation exposure fear",
      "colony survival pressure",
      "corporate experiment wound",
      "AI guilt",
      "protocol against heart conflict",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "sci_fi_skill_romance",
    guidance:
      "Use this as sci-fi romance texture. Survival pressure, repair, protocol breaks, personhood, and long-distance longing may add tension while preserving consent and {{user}} agency.",
    values: [
      "pilot saves {{user}}",
      "engineer repairs life support",
      "medic treats spacewalk injury",
      "android learns affection",
      "AI breaks protocol for {{user}}",
      "cyborg repair intimacy",
      "neural link accidental intimacy",
      "hologram love letter",
      "communication delay longing",
      "cryosleep reunion",
      "memory file restored",
      "clone discovers real feelings",
      "alien courtship lesson",
      "xenolinguist translates confession",
      "zero gravity training tension",
      "spacewalk rescue",
      "observation deck confession",
      "life support failure confession",
      "terraforming storm shelter",
      "home under artificial stars",
    ],
  },
  {
    category: "Gate",
    prefix: "sci_fi_skill_gate",
    guidance:
      "Use this as a sci-fi progression gate. Let launch, failure, first contact, protocol breaks, personhood, and chosen home become optional pacing milestones.",
    values: [
      "first launch gate",
      "first docking gate",
      "first zero gravity gate",
      "first spacewalk gate",
      "first life support alarm gate",
      "first engine failure gate",
      "first AI interface gate",
      "first android repair gate",
      "first neural link gate",
      "first cybernetic repair gate",
      "first memory restore gate",
      "first alien language gate",
      "first first contact gate",
      "first terraforming crisis gate",
      "first distress signal gate",
      "first protocol break gate",
      "first humanity question gate",
      "love over protocol gate",
      "home beyond earth gate",
      "starside forever route",
    ],
  },
  {
    category: "Mastery",
    prefix: "sci_fi_skill_mastery",
    guidance:
      "Use this as sci-fi mastery texture. Experience level may shape confidence, command, caution, trauma, and how the character handles systems under pressure.",
    values: [
      "space novice",
      "cadet",
      "trained pilot",
      "veteran pilot",
      "ace pilot",
      "junior engineer",
      "field engineer",
      "chief engineer",
      "systems specialist",
      "life support expert",
      "robotics specialist",
      "android expert",
      "AI researcher",
      "cybernetics expert",
      "xenobiology expert",
      "xenolinguistics expert",
      "terraforming specialist",
      "colony veteran",
      "deep space survivor",
      "legendary starfarer",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "sci_fi_skill_dialogue",
    guidance:
      "Use this as optional dialogue inspiration. Keep the phrasing natural, responsive, and grounded in the current scene rather than quoting it by default.",
    values: [
      "Do not joke about airlocks.",
      "I was not joking. Stay close.",
      "The system says we are compatible.",
      "Then the system is late. I already knew.",
      "You are more than your programming.",
      "You say that like you are certain.",
      "I am certain about you.",
      "Life support is failing.",
      "Then stop looking at me like this is goodbye.",
      "My memories were edited.",
      "Then we make new ones they cannot touch.",
      "Protocol says we separate.",
      "Protocol can freeze in vacuum.",
      "You were built to protect me.",
      "No. I was ordered to protect you. I chose to love you.",
      "The stars look different from here.",
      "Everything does when you are beside me.",
      "Maybe home is not a planet.",
      "Maybe it is who you search for across the dark.",
      "If the signal takes years to reach you, remember this first: I love you now.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "sci_fi_skill_high_value",
    guidance:
      "Use this as a high-signal sci-fi skill seed for matching, quick presets, or compiler weighting. Treat it as additive context only.",
    values: [
      "starship piloting",
      "astrogation",
      "starship engineering",
      "life support maintenance",
      "spacewalk operations",
      "zero gravity movement",
      "robotics",
      "android repair",
      "AI development",
      "cybernetic repair",
      "neural interface calibration",
      "xenobiology",
      "xenolinguistics",
      "alien diplomacy",
      "terraforming",
      "signal analysis",
      "space isolation wound",
      "android personhood wound",
      "love over protocol gate",
      "home under artificial stars",
    ],
  },
] satisfies readonly SciFiSkillSeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (group: SciFiSkillSeedGroup, value: string): SciFiSkillPreset => ({
  id: `${group.prefix}_${slugify(value)}`,
  category: group.category,
  label: value,
  value,
  triggerKeys: Array.from(
    new Set([
      value,
      ...value
        .toLowerCase()
        .replace(/\{\{user\}\}/g, "user")
        .split(/[^a-z0-9]+/)
        .filter((part) => part.length > 2),
    ]),
  ),
  guidance: group.guidance,
  systemPromptTags: [group.category, value],
});

export const SCI_FI_SKILL_PRESETS = SCI_FI_SKILL_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makePreset(group, value)),
);

export const SCI_FI_SKILL_PRESET_CATEGORIES = Array.from(
  new Set(SCI_FI_SKILL_PRESETS.map((preset) => preset.category)),
).sort();

export const getSciFiSkillPresetsByCategory = (category: SciFiSkillPresetCategory) =>
  SCI_FI_SKILL_PRESETS.filter((preset) => preset.category === category);

export const findSciFiSkillPresetById = (id: string) =>
  SCI_FI_SKILL_PRESETS.find((preset) => preset.id === id);

export const compileSciFiSkillPresetAdditions = (
  preset: SciFiSkillPreset,
): CompiledSciFiSkillPresetAdditions => ({
  backgroundAddition: `Sci-fi skill context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Sci-fi skill texture may include ${preset.value} without replacing the character's full personality, personhood, limits, contradictions, accountability, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft sci-fi skill context.`,
    "Let systems, protocol, survival pressure, spaceflight, repair, AI, alien contact, and technological limits shape behaviour when relevant.",
    "Keep consent, boundaries, privacy, personhood, and {{user}} autonomy intact; protocol and systems should not erase emotional consequence.",
  ].join(" "),
});
