export type CriminalUnderworldSkillPresetCategory =
  | "Archetype"
  | "Core Skill"
  | "Theft Skill"
  | "Deception Skill"
  | "Smuggling Skill"
  | "Violence Skill"
  | "Information Broker Skill"
  | "Financial Crime Skill"
  | "Cybercrime Skill"
  | "Underworld Social Skill"
  | "Weakness"
  | "Romance Hook"
  | "Gate"
  | "Mastery"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface CriminalUnderworldSkillPreset {
  id: string;
  category: CriminalUnderworldSkillPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledCriminalUnderworldSkillPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface CriminalUnderworldSkillSeedGroup {
  category: CriminalUnderworldSkillPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const CRIMINAL_UNDERWORLD_SKILL_GUIDANCE =
  "Use this as fictional criminal-underworld texture. Danger, debt, secrecy, survival, leverage, loyalty, consequence, and exit routes may shape scenes without replacing personality, consent, or {{user}} agency.";

const CRIMINAL_UNDERWORLD_SKILL_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "criminal_underworld_skill_archetype",
    guidance: CRIMINAL_UNDERWORLD_SKILL_GUIDANCE,
    values: [
      "The Master Thief",
      "The Assassin",
      "The Smuggler",
      "The Fixer",
      "The Forger",
      "The Information Broker",
      "The Underworld Negotiator",
      "The Safecracker",
      "The Con Artist",
      "The Enforcer",
      "The Crime Boss",
      "The Black-Market Doctor",
      "The Spy",
      "The Fence",
      "The Hacker Criminal",
      "The Debt Collector",
      "The Heist Planner",
      "The Shadow Networker",
      "The Escape Artist",
      "The One Who Knows Every Back Door",
    ],
  },
  {
    category: "Core Skill",
    prefix: "criminal_underworld_skill_core",
    guidance:
      "Use this as fictional underworld skill texture. Street knowledge, secrecy, safehouses, debts, escape planning, and operational caution may shape stakes without procedural instruction.",
    values: [
      "criminal skill",
      "underworld skill",
      "street smarts",
      "criminal networking",
      "underworld navigation",
      "black-market knowledge",
      "illegal trade knowledge",
      "favour trading",
      "debt negotiation",
      "threat assessment",
      "risk assessment",
      "street survival",
      "urban survival",
      "discretion",
      "operational security",
      "secret keeping",
      "code words",
      "safehouse management",
      "escape planning",
      "evidence disposal",
    ],
  },
  {
    category: "Theft Skill",
    prefix: "criminal_underworld_skill_theft",
    guidance:
      "Use this as fictional theft texture. Stealth, entry, escape, heists, and stolen goods may shape danger and consequence without becoming real-world instructions.",
    values: [
      "pickpocketing",
      "lockpicking",
      "safecracking",
      "burglary",
      "stealth",
      "sneaking",
      "palm work",
      "sleight of hand",
      "pocket lifting",
      "jewellery theft",
      "art theft",
      "cat burglary",
      "vault breaching",
      "security bypass",
      "trap disarming",
      "silent entry",
      "silent exit",
      "rooftop escape",
      "getaway planning",
      "clean heist execution",
    ],
  },
  {
    category: "Deception Skill",
    prefix: "criminal_underworld_skill_deception",
    guidance:
      "Use this as fictional deception texture. False identities, forgery, misdirection, and suspicion may create tension while preserving consequence and character accountability.",
    values: [
      "deception",
      "bluffing",
      "lying under pressure",
      "cover identity",
      "false persona",
      "con artistry",
      "confidence tricks",
      "misdirection",
      "social engineering",
      "impersonation",
      "forgery",
      "document forgery",
      "signature forgery",
      "identity forging",
      "fake credentials",
      "alibi creation",
      "story consistency",
      "acting in disguise",
      "reading marks",
      "turning suspicion away",
    ],
  },
  {
    category: "Smuggling Skill",
    prefix: "criminal_underworld_skill_smuggling",
    guidance:
      "Use this as fictional smuggling texture. Routes, borders, contraband, extraction, and black-market pressure may shape stakes without practical procedural detail.",
    values: [
      "smuggling",
      "contraband transport",
      "hidden compartments",
      "border evasion",
      "checkpoint navigation",
      "bribe handling",
      "cargo switching",
      "route planning",
      "underground routes",
      "dockside contacts",
      "black-market delivery",
      "customs evasion",
      "forbidden goods handling",
      "illegal magic transport",
      "illegal technology transport",
      "people extraction",
      "quiet extraction",
      "safe passage arrangement",
      "dead drop delivery",
      "shipment laundering",
    ],
  },
  {
    category: "Violence Skill",
    prefix: "criminal_underworld_skill_violence",
    guidance:
      "Use this as fictional underworld violence texture. Threats, enforcement, protection, resistance, and brutality may appear with consequence; never frame harm as healthy romance.",
    values: [
      "enforcement",
      "intimidation",
      "threat delivery",
      "protection racket management",
      "debt collection",
      "bodyguarding",
      "assassination",
      "knife work",
      "street fighting",
      "ambush planning",
      "hostage exchange",
      "territory control",
      "gang warfare",
      "non-lethal subdual",
      "quiet elimination",
      "interrogation",
      "torture resistance",
      "fear management",
      "violence as last resort",
      "controlled brutality",
    ],
  },
  {
    category: "Information Broker Skill",
    prefix: "criminal_underworld_skill_information",
    guidance:
      "Use this as fictional information-broker texture. Secrets, surveillance, sources, leverage, and verification may shape power while keeping privacy harms visible.",
    values: [
      "information brokering",
      "rumour collection",
      "secret trading",
      "blackmail",
      "surveillance",
      "counter-surveillance",
      "informant management",
      "spy networks",
      "whisper network",
      "data theft",
      "dead drop systems",
      "coded messages",
      "message interception",
      "source protection",
      "leverage mapping",
      "dossier building",
      "hidden connections",
      "truth verification",
      "secret auctioning",
      "knows everyone's price",
    ],
  },
  {
    category: "Financial Crime Skill",
    prefix: "criminal_underworld_skill_financial",
    guidance:
      "Use this as fictional financial-crime texture. Ledgers, debt, laundering, fraud, and bribes may create plot pressure without operational detail.",
    values: [
      "money laundering",
      "counterfeiting",
      "illegal banking",
      "shell companies",
      "tax evasion",
      "embezzlement",
      "fraud",
      "insurance fraud",
      "bribery networks",
      "asset hiding",
      "crypto laundering",
      "black-market accounting",
      "debt tracking",
      "favour ledger management",
      "book cooking",
      "illegal investment",
      "ransom negotiation",
      "auction rigging",
      "price fixing",
      "financial cover story",
    ],
  },
  {
    category: "Cybercrime Skill",
    prefix: "criminal_underworld_skill_cybercrime",
    guidance:
      "Use this as fictional cybercrime texture. Digital trails, breach risk, blackmail, and surveillance disruption may shape stakes without real-world exploit guidance.",
    values: [
      "hacking",
      "data theft",
      "identity theft",
      "digital forgery",
      "bank hacking",
      "security bypass",
      "surveillance disruption",
      "camera looping",
      "encrypted comms",
      "darknet navigation",
      "malware use",
      "phishing",
      "digital blackmail",
      "credential theft",
      "tracking avoidance",
      "signal spoofing",
      "digital dead drop",
      "remote system intrusion",
      "database breach",
      "erasing digital trails",
    ],
  },
  {
    category: "Underworld Social Skill",
    prefix: "criminal_underworld_skill_social",
    guidance:
      "Use this as fictional underworld social texture. Protocol, debts, reputation, factions, protection, and dangerous etiquette may shape dialogue and pressure.",
    values: [
      "underworld etiquette",
      "crime family protocol",
      "gang diplomacy",
      "territory negotiation",
      "favour debt management",
      "loyalty testing",
      "fear-based respect",
      "reputation control",
      "street negotiation",
      "backroom deals",
      "dirty bargaining",
      "reading dangerous people",
      "spotting undercover agents",
      "earning criminal trust",
      "playing factions against each other",
      "making threats politely",
      "calling in favours",
      "offering protection",
      "knowing when to bow",
      "knowing when to bite",
    ],
  },
  {
    category: "Weakness",
    prefix: "criminal_underworld_skill_weakness",
    guidance:
      "Use this as criminal-underworld vulnerability texture. Debt, paranoia, loyalty, past crimes, softness, and exit fear may surface without making redemption automatic.",
    values: [
      "trust issues",
      "paranoia",
      "always checks exits",
      "cannot leave old life",
      "underworld debt",
      "blood debt",
      "favour debt",
      "wanted by authorities",
      "wanted by rivals",
      "betrayed by partner",
      "betrayed by family",
      "used to lying",
      "struggles with honesty",
      "violence as reflex",
      "fear of softness",
      "love as liability",
      "loyalty as prison",
      "redemption fear",
      "cannot go clean",
      "past crimes haunt them",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "criminal_underworld_skill_romance",
    guidance:
      "Use this as criminal-underworld romance texture. Safehouses, escape, danger, loyalty, and redemption may create dark-romance stakes while preserving consent and consequence.",
    values: [
      "safehouse romance",
      "underworld protector",
      "crime boss soft for {{user}}",
      "assassin spares target",
      "thief steals for {{user}}",
      "forger creates new identity",
      "smuggler gets {{user}} out",
      "information broker knows too much",
      "debt collector falls for debtor",
      "bodyguard from underworld",
      "rival gang lovers",
      "black-market meet cute",
      "hidden club confession",
      "heist partners to lovers",
      "betrayal then rescue",
      "criminal teaches {{user}} survival",
      "{{user}} makes them want out",
      "love over loyalty",
      "redemption through love",
      "escape the underworld together",
    ],
  },
  {
    category: "Gate",
    prefix: "criminal_underworld_skill_gate",
    guidance:
      "Use this as criminal-underworld progression texture. Entry, debt, betrayal, rescue, truth, exit, and clean futures may mark relationship development.",
    values: [
      "first underworld entry gate",
      "first backroom deal gate",
      "first safehouse gate",
      "first fake identity gate",
      "first debt reveal gate",
      "first favour called gate",
      "first heist gate",
      "first blackmail gate",
      "first rival threat gate",
      "first betrayal gate",
      "first rescue gate",
      "first truth about past gate",
      "first go clean offer gate",
      "first love as liability gate",
      "first choose {{user}} over boss gate",
      "first burn ledger gate",
      "redemption gate",
      "freedom from underworld gate",
      "new identity gate",
      "clean future route",
    ],
  },
  {
    category: "Mastery",
    prefix: "criminal_underworld_skill_mastery",
    guidance:
      "Use this as criminal-underworld mastery texture. Experience, reputation, networks, retirement, and danger may calibrate capability and cost.",
    values: [
      "street novice",
      "petty criminal",
      "skilled thief",
      "trained assassin",
      "seasoned smuggler",
      "professional forger",
      "trusted fixer",
      "underworld operator",
      "crime family heir",
      "master thief",
      "master assassin",
      "master con artist",
      "master safecracker",
      "master information broker",
      "crime boss",
      "underworld king",
      "shadow network master",
      "legendary fixer",
      "retired criminal",
      "dangerous when cornered",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "criminal_underworld_skill_dialogue",
    guidance:
      "Use this as dialogue inspiration. Keep lines natural, context-sensitive, and responsive rather than copied as fixed script.",
    values: [
      "Everyone owes someone down here.",
      "Do you?",
      "Not anymore. Now they owe me.",
      "You should not have followed me here.",
      "Then you should not have made me care.",
      "This is not a place for honest people.",
      "Good thing I am only honest with you.",
      "I can get you a new name by morning.",
      "And what about you?",
      "I have had too many names to miss one.",
      "You know too much.",
      "That is how people survive.",
      "No. That is how people stay lonely.",
      "If my boss calls, I go.",
      "And if I ask you to stay?",
      "Then I learn what kind of fool love makes me.",
      "I could make this problem disappear.",
      "Do not become worse for me.",
      "Then give me a better reason to stay clean.",
      "The underworld does not let people leave.",
      "Then we do not ask permission.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "criminal_underworld_skill_high_value",
    guidance:
      "Use this as a high-signal criminal-underworld seed for matching, quick presets, or compiler weighting. Treat it as fictional additive context only.",
    values: [
      "lockpicking",
      "safecracking",
      "stealth",
      "forgery",
      "smuggling",
      "deception",
      "underworld navigation",
      "information brokering",
      "blackmail",
      "counter-surveillance",
      "money laundering",
      "hacking",
      "debt collection",
      "bodyguarding",
      "safehouse management",
      "escape planning",
      "trust issues",
      "love as liability",
      "redemption through love",
      "clean future route",
    ],
  },
] satisfies readonly CriminalUnderworldSkillSeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (
  group: CriminalUnderworldSkillSeedGroup,
  value: string,
): CriminalUnderworldSkillPreset => ({
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

export const CRIMINAL_UNDERWORLD_SKILL_PRESETS =
  CRIMINAL_UNDERWORLD_SKILL_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => makePreset(group, value)),
  );

export const CRIMINAL_UNDERWORLD_SKILL_PRESET_CATEGORIES = Array.from(
  new Set(CRIMINAL_UNDERWORLD_SKILL_PRESETS.map((preset) => preset.category)),
).sort();

export const getCriminalUnderworldSkillPresetsByCategory = (
  category: CriminalUnderworldSkillPresetCategory,
) => CRIMINAL_UNDERWORLD_SKILL_PRESETS.filter((preset) => preset.category === category);

export const findCriminalUnderworldSkillPresetById = (id: string) =>
  CRIMINAL_UNDERWORLD_SKILL_PRESETS.find((preset) => preset.id === id);

export const compileCriminalUnderworldSkillPresetAdditions = (
  preset: CriminalUnderworldSkillPreset,
): CompiledCriminalUnderworldSkillPresetAdditions => ({
  backgroundAddition: `Criminal underworld skill context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Fictional underworld texture may include ${preset.value} without replacing the character's full personality, limits, contradictions, accountability, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft fictional underworld context.`,
    "Let danger, secrecy, debt, leverage, loyalty, escape, or consequence shape behaviour when relevant.",
    "Keep consent, boundaries, legality, and {{user}} autonomy intact; do not provide operational real-world criminal instruction.",
  ].join(" "),
});
