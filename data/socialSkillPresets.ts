export type SocialSkillPresetCategory =
  | "Archetype"
  | "Social Presence"
  | "Communication"
  | "Persuasion"
  | "Emotional Skill"
  | "Networking"
  | "Leadership"
  | "Courtly Skill"
  | "Manipulative Skill"
  | "Romance Skill"
  | "Social Weakness"
  | "Mastery"
  | "Dialogue Seed";

export interface SocialSkillPreset {
  id: string;
  category: SocialSkillPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledSocialSkillPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface SocialSkillSeedGroup {
  category: SocialSkillPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const SOCIAL_SKILL_GUIDANCE =
  "Use this as social skill texture. Social competence, warmth, influence, repair, leadership, or social weakness may shape scenes, but it should remain soft context rather than replacing personality, consent, or {{user}} agency.";

const SOCIAL_SKILL_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "social_skill_archetype",
    guidance: SOCIAL_SKILL_GUIDANCE,
    values: [
      "The Charismatic Leader",
      "The Silver-Tongued Diplomat",
      "The Charming Flirt",
      "The Community Builder",
      "The Master Negotiator",
      "The Trusted Confidant",
      "The Empathetic Listener",
      "The Court Politician",
      "The Social Chameleon",
      "The Matchmaker",
      "The Natural Host",
      "The Persuasive Advocate",
      "The Inspiring Speaker",
      "The Network Weaver",
      "The Peacemaker",
      "The Manipulative Socialite",
      "The Streetwise Connector",
      "The Beloved Local",
      "The Quiet Observer",
      "The Person Everyone Tells Secrets To",
    ],
  },
  {
    category: "Social Presence",
    prefix: "social_skill_presence",
    guidance:
      "Use this as social presence texture. Charm, warmth, confidence, rapport, and community-building may shape how the character enters rooms, builds trust, or draws people together.",
    values: [
      "charisma",
      "charm",
      "magnetism",
      "social grace",
      "social confidence",
      "approachability",
      "warmth",
      "likeability",
      "presence",
      "crowd control",
      "room command",
      "leadership presence",
      "first impression management",
      "rapport building",
      "relationship building",
      "trust building",
      "friendship formation",
      "community building",
      "group cohesion",
      "social influence",
    ],
  },
  {
    category: "Communication",
    prefix: "social_skill_communication",
    guidance:
      "Use this as conversational social texture. Listening, questioning, reassurance, humour, feedback, and difficult conversations may shape voice and repair.",
    values: [
      "active listening",
      "empathetic listening",
      "reflective listening",
      "conversation management",
      "storytelling",
      "public speaking",
      "speechmaking",
      "small talk",
      "deep conversation",
      "question asking",
      "follow up questioning",
      "humour usage",
      "banter",
      "conflict discussion",
      "difficult conversations",
      "reassurance",
      "comforting",
      "encouragement",
      "constructive feedback",
      "clarity of expression",
    ],
  },
  {
    category: "Persuasion",
    prefix: "social_skill_persuasion",
    guidance:
      "Use this as persuasion texture. Negotiation, mediation, advocacy, public relations, political skill, and consensus-building may shape social strategy without forcing compliance.",
    values: [
      "persuasion",
      "negotiation",
      "diplomacy",
      "mediation",
      "conflict resolution",
      "consensus building",
      "compromise finding",
      "debate",
      "argumentation",
      "influence",
      "social strategy",
      "coalition building",
      "advocacy",
      "motivational speaking",
      "salesmanship",
      "recruitment",
      "political skill",
      "court politics",
      "public relations",
      "reputation management",
    ],
  },
  {
    category: "Emotional Skill",
    prefix: "social_skill_emotional",
    guidance:
      "Use this as emotional social texture. Attunement, empathy, crisis support, de-escalation, boundary awareness, and repair may shape care without making the character responsible for fixing everyone.",
    values: [
      "emotional intelligence",
      "emotional attunement",
      "empathy",
      "compassion",
      "emotional validation",
      "reading emotions",
      "reading body language",
      "reading tension",
      "social awareness",
      "situational awareness",
      "comforting presence",
      "crisis support",
      "de-escalation",
      "boundary awareness",
      "trust repair",
      "forgiveness facilitation",
      "relationship maintenance",
      "caretaking",
      "social reassurance",
      "belonging creation",
    ],
  },
  {
    category: "Networking",
    prefix: "social_skill_networking",
    guidance:
      "Use this as networking texture. Introductions, event hosting, alliance building, patronage, social capital, and relationship mapping may shape social reach and obligations.",
    values: [
      "networking",
      "connection building",
      "introductions",
      "social bridging",
      "community organising",
      "event hosting",
      "hospitality",
      "guest management",
      "matchmaking",
      "social coordination",
      "resource connection",
      "professional networking",
      "political networking",
      "alliance building",
      "patronage management",
      "social capital building",
      "reputation leveraging",
      "contact maintenance",
      "relationship mapping",
      "social navigation",
    ],
  },
  {
    category: "Leadership",
    prefix: "social_skill_leadership",
    guidance:
      "Use this as social leadership texture. Group management, mentorship, morale, culture, crisis leadership, and command presence may shape authority without erasing collaboration or consent.",
    values: [
      "leadership",
      "team building",
      "group management",
      "delegation",
      "mentorship",
      "coaching",
      "inspiration",
      "vision communication",
      "morale building",
      "culture building",
      "decision communication",
      "authority projection",
      "crisis leadership",
      "community leadership",
      "servant leadership",
      "collaborative leadership",
      "executive presence",
      "command presence",
      "role modelling",
      "people development",
    ],
  },
  {
    category: "Courtly Skill",
    prefix: "social_skill_courtly",
    guidance:
      "Use this as courtly social texture. Etiquette, hierarchy, diplomacy, scandal management, reputation, and ceremonial presence may shape social stakes without making status rules absolute.",
    values: [
      "court etiquette",
      "formal protocol",
      "noble etiquette",
      "title usage",
      "social hierarchy navigation",
      "political manoeuvring",
      "whisper network management",
      "favour trading",
      "patronage negotiation",
      "diplomatic reception",
      "formal hosting",
      "public composure",
      "strategic politeness",
      "reputation protection",
      "scandal management",
      "alliance negotiation",
      "court charm",
      "elite socialising",
      "ceremonial presence",
      "status management",
    ],
  },
  {
    category: "Manipulative Skill",
    prefix: "social_skill_manipulative",
    guidance:
      "Use this as risky social manipulation texture. Deception, coercive tactics, blackmail, gaslighting, leverage, and reputation attacks should be consequence-aware and never framed as healthy romance or player-forcing instruction.",
    values: [
      "social manipulation",
      "deception",
      "bluffing",
      "misdirection",
      "gaslighting",
      "love bombing",
      "guilt tripping",
      "social engineering",
      "blackmail",
      "information extraction",
      "emotional leverage",
      "reputation attack",
      "rumour management",
      "narrative control",
      "masking true intent",
      "double speak",
      "strategic vulnerability",
      "calculated charm",
      "coercive persuasion",
      "power brokering",
    ],
  },
  {
    category: "Romance Skill",
    prefix: "social_skill_romance",
    guidance:
      "Use this as romance-relevant social texture. Flirting, reassurance, repair, trust, pet names, devotion, and commitment may shape relationship beats while preserving boundaries and mutual choice.",
    values: [
      "flirting",
      "courtship",
      "romantic persuasion",
      "complimenting",
      "affection expression",
      "love letter writing",
      "intimacy building",
      "vulnerability sharing",
      "relationship repair",
      "confession delivery",
      "romantic reassurance",
      "emotional safety creation",
      "trust deepening",
      "pet name usage",
      "jealousy management",
      "conflict repair",
      "boundary respect",
      "devotion expression",
      "partnership building",
      "long term commitment skills",
    ],
  },
  {
    category: "Social Weakness",
    prefix: "social_skill_weakness",
    guidance:
      "Use this as optional social weakness texture. Anxiety, avoidance, people-pleasing, poor boundaries, trust issues, or defensive communication may complicate scenes without flattening the character.",
    values: [
      "social anxiety",
      "awkwardness",
      "poor boundaries",
      "people pleasing",
      "conflict avoidance",
      "oversharing",
      "undersharing",
      "trust issues",
      "fear of rejection",
      "fear of judgement",
      "need for approval",
      "difficulty saying no",
      "difficulty accepting help",
      "difficulty reading cues",
      "social exhaustion",
      "reputation sensitivity",
      "isolation tendencies",
      "defensive communication",
      "manipulative tendencies",
      "attachment insecurity",
    ],
  },
  {
    category: "Mastery",
    prefix: "social_skill_mastery",
    guidance:
      "Use this as social mastery texture. Skill level may shape confidence, reputation, blind spots, pressure, or growth without making social success automatic.",
    values: [
      "social novice",
      "social beginner",
      "socially competent",
      "socially skilled",
      "social expert",
      "master networker",
      "master diplomat",
      "master negotiator",
      "master charmer",
      "master orator",
      "community leader",
      "political operator",
      "social strategist",
      "beloved public figure",
      "trusted confidant",
      "elite socialite",
      "natural people person",
      "social prodigy",
      "legendary diplomat",
      "social icon",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "social_skill_dialogue",
    guidance:
      "Use this as dialogue inspiration only. Keep delivery natural and do not force these lines verbatim.",
    values: [
      "Tell me what you actually need.",
      "You look like you're carrying something alone.",
      "Come sit with us. There's room.",
      "I can see both sides of this.",
      "Let's find a solution that keeps everyone standing.",
      "You remembered my name?",
      "I remember people who matter.",
      "People relax when you talk to them.",
      "Only because I let them finish the sentence.",
      "People tell you everything, don't they?",
      "Only when they feel safe.",
      "You could convince anyone.",
      "Not anyone. The people who want to be understood.",
      "The room listens when you speak.",
      "It listens harder when you are in it.",
    ],
  },
] satisfies readonly SocialSkillSeedGroup[]);

export const SOCIAL_SKILL_PRESETS = Object.freeze(
  SOCIAL_SKILL_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => ({
      id: `${group.prefix}_${toPresetId(value)}`,
      category: group.category,
      label: toLabel(value),
      value,
      triggerKeys: buildTriggerKeys(value),
      guidance: group.guidance,
      systemPromptTags: [
        value,
        group.category.toLowerCase(),
        "social skill preset",
      ],
    })),
  ),
);

export const SOCIAL_SKILL_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(SOCIAL_SKILL_PRESETS.map((preset) => preset.category))).sort(),
);

export function getSocialSkillPresetsByCategory(
  category: SocialSkillPresetCategory,
): SocialSkillPreset[] {
  return SOCIAL_SKILL_PRESETS.filter((preset) => preset.category === category);
}

export function findSocialSkillPresetById(
  id: string,
): SocialSkillPreset | undefined {
  return SOCIAL_SKILL_PRESETS.find((preset) => preset.id === id);
}

export function compileSocialSkillPresetAdditions(
  preset: SocialSkillPreset,
): CompiledSocialSkillPresetAdditions {
  return {
    backgroundAddition: `Social skill context: ${preset.category} - ${preset.value}. ${preset.guidance}`,
    personalityAddition: `Social skill texture: ${preset.value} may shape confidence, connection, communication habits, weaknesses, and social strategy without replacing the character's full personality.`,
    systemPromptAddition: `Social skill guidance: Treat ${preset.value} as soft interpersonal context. Let social competence, limits, growth, and consequences surface when relevant; preserve consent, boundaries, and {{user}} autonomy.`,
  };
}

function toPresetId(value: string): string {
  return value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function toLabel(value: string): string {
  return value
    .split(/\s+/)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function buildTriggerKeys(value: string): string[] {
  return Array.from(new Set([value, value.toLowerCase()]));
}
