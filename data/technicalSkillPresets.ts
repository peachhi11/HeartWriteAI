export type TechnicalSkillPresetCategory =
  | "Archetype"
  | "Core Skill"
  | "Software Skill"
  | "Cybersecurity Skill"
  | "Hardware Engineering Skill"
  | "Robotics And AI Skill"
  | "Data Skill"
  | "Infrastructure Skill"
  | "Sci-Fi Technical Skill"
  | "Fantasy Technical Skill"
  | "Weakness"
  | "Romance Hook"
  | "Gate"
  | "Mastery"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface TechnicalSkillPreset {
  id: string;
  category: TechnicalSkillPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledTechnicalSkillPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface TechnicalSkillSeedGroup {
  category: TechnicalSkillPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const TECHNICAL_SKILL_GUIDANCE =
  "Use this as technical skill texture. Engineering, systems, code, repair, data, security, robotics, and infrastructure may shape scenes without replacing personality, consent, or {{user}} agency.";

const TECHNICAL_SKILL_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "technical_skill_archetype",
    guidance: TECHNICAL_SKILL_GUIDANCE,
    values: [
      "The Engineer",
      "The Hacker",
      "The Programmer",
      "The Mechanic",
      "The Roboticist",
      "The Cybersecurity Expert",
      "The Data Scientist",
      "The AI Specialist",
      "The Systems Operator",
      "The Starship Engineer",
      "The Android Technician",
      "The Inventor",
      "The Hardware Repairer",
      "The Drone Operator",
      "The Network Architect",
      "The Automation Expert",
      "The Cyberpunk Techie",
      "The Lab Technician",
      "The Field Troubleshooter",
      "The One Who Fixes What Everyone Else Breaks",
    ],
  },
  {
    category: "Core Skill",
    prefix: "technical_skill_core",
    guidance:
      "Use this as core technical texture. Engineering, programming, networking, automation, systems work, and troubleshooting may ground competence and pressure.",
    values: [
      "technical skill",
      "engineering",
      "mechanics",
      "electronics",
      "programming",
      "software engineering",
      "hardware engineering",
      "systems engineering",
      "networking",
      "cybersecurity",
      "hacking",
      "robotics",
      "automation",
      "data science",
      "machine learning",
      "AI development",
      "database design",
      "systems administration",
      "technical troubleshooting",
      "technical design",
    ],
  },
  {
    category: "Software Skill",
    prefix: "technical_skill_software",
    guidance:
      "Use this as software skill texture. Development, debugging, review, APIs, automation, and legacy repair may shape how the character thinks and solves problems.",
    values: [
      "programming",
      "coding",
      "software development",
      "web development",
      "app development",
      "game development",
      "backend development",
      "frontend development",
      "full-stack development",
      "scripting",
      "debugging",
      "code review",
      "API design",
      "database programming",
      "cloud development",
      "DevOps",
      "version control",
      "automation scripts",
      "security programming",
      "legacy code repair",
    ],
  },
  {
    category: "Cybersecurity Skill",
    prefix: "technical_skill_cybersecurity",
    guidance:
      "Use this as cybersecurity texture. Security, privacy, forensics, incident response, and countermeasures may create stakes while remaining ethical and consequence-aware.",
    values: [
      "cybersecurity",
      "ethical hacking",
      "penetration testing",
      "network security",
      "cryptography",
      "digital forensics",
      "malware analysis",
      "threat modelling",
      "security auditing",
      "incident response",
      "exploit research",
      "social engineering defence",
      "firewall management",
      "identity access management",
      "secure coding",
      "data privacy",
      "surveillance countermeasures",
      "system hardening",
      "breach response",
      "black-hat past",
    ],
  },
  {
    category: "Hardware Engineering Skill",
    prefix: "technical_skill_hardware",
    guidance:
      "Use this as hardware and field engineering texture. Repair, soldering, calibration, vehicles, power, and improvised fixes may ground tactile competence.",
    values: [
      "hardware repair",
      "electronics repair",
      "circuit design",
      "soldering",
      "microcontroller programming",
      "embedded systems",
      "sensor calibration",
      "device maintenance",
      "machine repair",
      "mechanical engineering",
      "electrical engineering",
      "prototype building",
      "tool fabrication",
      "power systems",
      "generator repair",
      "vehicle repair",
      "engine repair",
      "communications equipment repair",
      "field repair",
      "jury-rigging",
    ],
  },
  {
    category: "Robotics And AI Skill",
    prefix: "technical_skill_robotics_ai",
    guidance:
      "Use this as robotics and AI texture. Design, repair, autonomy, personhood, diagnostics, and emotional simulation may shape sci-fi ethics and intimacy.",
    values: [
      "robotics",
      "robot design",
      "robot repair",
      "android repair",
      "drone engineering",
      "automation design",
      "AI development",
      "machine learning",
      "neural networks",
      "natural language processing",
      "computer vision",
      "robot behaviour tuning",
      "autonomous systems",
      "humanoid interface design",
      "synthetic personhood research",
      "AI alignment",
      "AI ethics",
      "AI diagnostics",
      "companion android maintenance",
      "emotional simulation tuning",
    ],
  },
  {
    category: "Data Skill",
    prefix: "technical_skill_data",
    guidance:
      "Use this as data skill texture. Analysis, visualisation, archives, metadata, prediction, and recovery may shape pattern recognition and responsibility.",
    values: [
      "data analysis",
      "data science",
      "statistics",
      "database design",
      "data engineering",
      "data visualisation",
      "predictive modelling",
      "pattern detection",
      "signal analysis",
      "data cleaning",
      "data mining",
      "information architecture",
      "metadata management",
      "business intelligence",
      "research data management",
      "surveillance data analysis",
      "forensic data recovery",
      "memory archive analysis",
      "behavioural data modelling",
      "risk prediction",
    ],
  },
  {
    category: "Infrastructure Skill",
    prefix: "technical_skill_infrastructure",
    guidance:
      "Use this as infrastructure texture. Networks, servers, backups, monitoring, access, power grids, ships, colonies, and life support may shape systems-level stakes.",
    values: [
      "systems administration",
      "network administration",
      "server maintenance",
      "cloud infrastructure",
      "distributed systems",
      "load balancing",
      "backup management",
      "disaster recovery",
      "monitoring systems",
      "network architecture",
      "communications networks",
      "secure infrastructure",
      "access control systems",
      "industrial control systems",
      "life support systems",
      "colony systems",
      "station systems",
      "ship systems",
      "power grid management",
      "infrastructure resilience",
    ],
  },
  {
    category: "Sci-Fi Technical Skill",
    prefix: "technical_skill_scifi",
    guidance:
      "Use this as sci-fi technical texture. Starships, reactors, cybernetics, AI cores, stations, and alien technology may ground high-concept stakes.",
    values: [
      "starship engineering",
      "warp engine maintenance",
      "life support maintenance",
      "artificial gravity repair",
      "shield generator repair",
      "reactor maintenance",
      "terraforming systems",
      "cryosleep pod maintenance",
      "hologram systems",
      "translation implant repair",
      "cybernetic repair",
      "neural interface calibration",
      "android body repair",
      "AI core maintenance",
      "space station systems",
      "airlock systems",
      "drone swarm control",
      "mech repair",
      "quantum computing",
      "alien technology reverse engineering",
    ],
  },
  {
    category: "Fantasy Technical Skill",
    prefix: "technical_skill_fantasy",
    guidance:
      "Use this as fantasy technical texture. Magitech, runes, portals, wards, clockwork, artefacts, and relic analysis may blend craft with wonder.",
    values: [
      "magitech engineering",
      "rune circuitry",
      "mana engine repair",
      "crystal power systems",
      "golem maintenance",
      "automaton repair",
      "enchanted device repair",
      "spell circuit design",
      "portal gate maintenance",
      "ward system installation",
      "alchemy apparatus repair",
      "magical clockwork",
      "arcane instrument calibration",
      "sigil mechanics",
      "artefact restoration",
      "anti-magic device design",
      "scrying network maintenance",
      "floating city engineering",
      "spell storage devices",
      "forbidden relic analysis",
    ],
  },
  {
    category: "Weakness",
    prefix: "technical_skill_weakness",
    guidance:
      "Use this as technical vulnerability texture. Logic, overwork, secrecy, burnout, guilt, and emotional blind spots may surface without flattening the character into a machine.",
    values: [
      "overrelies on logic",
      "poor people skills",
      "works too much",
      "sleeps too little",
      "debugs feelings badly",
      "uses work to avoid emotion",
      "obsessive troubleshooting",
      "perfectionism",
      "cannot leave problem unsolved",
      "forgets basic needs",
      "trusts machines more than people",
      "hates unpredictability",
      "improvises recklessly",
      "breaks rules to fix systems",
      "keeps secret backups",
      "paranoid about security",
      "burnout",
      "impostor syndrome",
      "technology guilt",
      "created something dangerous",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "technical_skill_romance",
    guidance:
      "Use this as technical romance texture. Repair, alarms, lab work, care through devices, and logic failing around love may deepen connection without replacing consent.",
    values: [
      "engineer saves everyone",
      "hacker protects {{user}} data",
      "mechanic fixes {{user}} vehicle",
      "programmer builds private app",
      "android technician repairs heart",
      "AI specialist teaches machine love",
      "starship engineer confession during alarm",
      "life support failure hurt-comfort",
      "late-night lab romance",
      "debugging together",
      "teaching {{user}} how to fix machine",
      "{{user}} teaches them emotional language",
      "cybernetic repair intimacy",
      "hands brush over control panel",
      "builds protective device for {{user}}",
      "creates gift with hidden message",
      "security system names {{user}} safe",
      "tech failure forces honesty",
      "logic fails against love",
      "building a future together",
    ],
  },
  {
    category: "Gate",
    prefix: "technical_skill_gate",
    guidance:
      "Use this as technical progression texture. Repair, failure, breach, burnout, emotional blind spots, and trust over control may mark relationship development.",
    values: [
      "first repair scene gate",
      "first debugging gate",
      "first system failure gate",
      "first security breach gate",
      "first hack gate",
      "first lab scene gate",
      "first engine room gate",
      "first teaches {{user}} gate",
      "first {{user}} interrupts work gate",
      "first technical failure gate",
      "first saves {{user}} with tech gate",
      "first emotional blind spot gate",
      "first burnout reveal gate",
      "first dangerous invention gate",
      "first machine as metaphor gate",
      "logic fails gate",
      "trust over control gate",
      "human connection gate",
      "build future gate",
      "home in the system route",
    ],
  },
  {
    category: "Mastery",
    prefix: "technical_skill_mastery",
    guidance:
      "Use this as technical mastery texture. Training, specialisation, seniority, reputation, exhaustion, and underground expertise may calibrate competence and cost.",
    values: [
      "technical novice",
      "self-taught tinkerer",
      "trained technician",
      "field engineer",
      "software specialist",
      "hardware specialist",
      "cybersecurity expert",
      "systems expert",
      "robotics expert",
      "AI specialist",
      "senior engineer",
      "chief engineer",
      "master hacker",
      "legendary inventor",
      "genius engineer",
      "burnt-out expert",
      "retired specialist",
      "dangerous technologist",
      "underground techie",
      "one-person repair crew",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "technical_skill_dialogue",
    guidance:
      "Use this as dialogue inspiration. Keep lines natural, context-sensitive, and responsive rather than copied as fixed script.",
    values: [
      "I can fix it.",
      "You say that about machines and people.",
      "Machines are easier.",
      "Step away from the console.",
      "That sounds like concern.",
      "That sounds like you ignoring an alarm again.",
      "You have not slept.",
      "The system needed me.",
      "So do you. Apparently someone has to maintain you too.",
      "Logic says this should work.",
      "And if it does not?",
      "Then I improvise and pretend that was the plan.",
      "You built this for me?",
      "It tracks danger.",
      "That is not an answer.",
      "Yes. I built it for you.",
      "You understand machines better than feelings.",
      "Machines tell me where they are broken.",
      "So do people, if you listen differently.",
      "The lights are failing.",
      "Stay close. I know the system by sound.",
      "I thought love would be complicated.",
      "It is.",
      "Then why does it make everything else clearer?",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "technical_skill_high_value",
    guidance:
      "Use this as a high-signal technical seed for matching, quick presets, or compiler weighting. Treat it as additive context only.",
    values: [
      "programming",
      "software engineering",
      "cybersecurity",
      "hacking",
      "engineering",
      "mechanics",
      "robotics",
      "AI development",
      "data analysis",
      "systems administration",
      "hardware repair",
      "life support maintenance",
      "starship engineering",
      "cybernetic repair",
      "magitech engineering",
      "technical troubleshooting",
      "works too much",
      "logic fails against love",
      "human connection gate",
      "building a future together",
    ],
  },
] satisfies readonly TechnicalSkillSeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (
  group: TechnicalSkillSeedGroup,
  value: string,
): TechnicalSkillPreset => ({
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

export const TECHNICAL_SKILL_PRESETS = TECHNICAL_SKILL_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makePreset(group, value)),
);

export const TECHNICAL_SKILL_PRESET_CATEGORIES = Array.from(
  new Set(TECHNICAL_SKILL_PRESETS.map((preset) => preset.category)),
).sort();

export const getTechnicalSkillPresetsByCategory = (
  category: TechnicalSkillPresetCategory,
) => TECHNICAL_SKILL_PRESETS.filter((preset) => preset.category === category);

export const findTechnicalSkillPresetById = (id: string) =>
  TECHNICAL_SKILL_PRESETS.find((preset) => preset.id === id);

export const compileTechnicalSkillPresetAdditions = (
  preset: TechnicalSkillPreset,
): CompiledTechnicalSkillPresetAdditions => ({
  backgroundAddition: `Technical skill context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Technical texture may include ${preset.value} without replacing the character's full personality, feelings, limits, contradictions, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft technical context.`,
    "Let engineering, repair, code, systems, security, data, or technical pressure shape behaviour when relevant.",
    "Keep consent, boundaries, privacy ethics, and {{user}} autonomy intact; competence should not erase emotional consequence.",
  ].join(" "),
});
