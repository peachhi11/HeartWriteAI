export type CommunicationSkillPresetCategory =
  | "Archetype"
  | "Core Skill"
  | "Speaking Skill"
  | "Writing Skill"
  | "Listening Skill"
  | "Persuasion Skill"
  | "Language Skill"
  | "Non-Verbal Skill"
  | "Teaching Skill"
  | "Investigative Skill"
  | "Romantic Communication Skill"
  | "Weakness"
  | "Mastery"
  | "Dialogue Seed";

export interface CommunicationSkillPreset {
  id: string;
  category: CommunicationSkillPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledCommunicationSkillPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface CommunicationSkillSeedGroup {
  category: CommunicationSkillPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const COMMUNICATION_SKILL_GUIDANCE =
  "Use this as communication skill texture. Speaking, writing, listening, persuasion, non-verbal cues, language fluency, teaching, investigation, or romantic communication may shape scenes without replacing personality, consent, or {{user}} agency.";

const COMMUNICATION_SKILL_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "communication_skill_archetype",
    guidance: COMMUNICATION_SKILL_GUIDANCE,
    values: [
      "The Silver-Tongued Orator",
      "The Master Storyteller",
      "The Diplomatic Negotiator",
      "The Persuasive Advocate",
      "The Empathetic Listener",
      "The Sharp Debater",
      "The Gentle Counsellor",
      "The Inspiring Leader",
      "The Charming Conversationalist",
      "The Strategic Communicator",
      "The Court Diplomat",
      "The Investigative Interviewer",
      "The Love-Letter Writer",
      "The Public Relations Expert",
      "The Teacher and Explainer",
      "The Crisis Communicator",
      "The Poet Speaker",
      "The Multilingual Connector",
      "The Quiet Listener",
      "The One Who Always Finds the Right Words",
    ],
  },
  {
    category: "Core Skill",
    prefix: "communication_skill_core",
    guidance:
      "Use this as core communication skill texture. Public, private, professional, romantic, crisis, cross-cultural, and difficult-conversation skills may shape clarity and connection.",
    values: [
      "communication",
      "verbal communication",
      "written communication",
      "non-verbal communication",
      "interpersonal communication",
      "public communication",
      "private communication",
      "persuasive communication",
      "strategic communication",
      "cross-cultural communication",
      "crisis communication",
      "professional communication",
      "romantic communication",
      "difficult conversation management",
      "clarity of expression",
      "message delivery",
      "information sharing",
      "conversation facilitation",
      "social navigation",
      "connection building",
    ],
  },
  {
    category: "Speaking Skill",
    prefix: "communication_skill_speaking",
    guidance:
      "Use this as spoken communication texture. Speeches, explanation, debate, negotiation, performance, and public delivery may shape voice and scene strategy.",
    values: [
      "public speaking",
      "speechmaking",
      "oratory",
      "presentation skills",
      "conversation skills",
      "storytelling",
      "persuasion",
      "debate",
      "argumentation",
      "negotiation",
      "mediation",
      "diplomacy",
      "interviewing",
      "questioning",
      "active listening response",
      "improvisational speaking",
      "ceremonial speaking",
      "motivational speaking",
      "teaching",
      "lecturing",
      "briefing",
      "pitching",
      "sales presentations",
      "courtly speech",
      "political speaking",
      "leadership communication",
      "media interviews",
      "panel discussion",
      "story performance",
      "verbal explanation",
    ],
  },
  {
    category: "Writing Skill",
    prefix: "communication_skill_writing",
    guidance:
      "Use this as written communication texture. Creative, professional, romantic, academic, public, and technical writing may shape how the character records or frames truth.",
    values: [
      "creative writing",
      "fiction writing",
      "poetry",
      "screenwriting",
      "journalism",
      "technical writing",
      "academic writing",
      "business writing",
      "professional correspondence",
      "letter writing",
      "love letter writing",
      "persuasive writing",
      "speech writing",
      "copywriting",
      "editing",
      "proofreading",
      "report writing",
      "grant writing",
      "proposal writing",
      "documentation",
      "memo writing",
      "public statement writing",
      "social media writing",
      "ghostwriting",
      "worldbuilding writing",
      "memoir writing",
      "script writing",
      "translation writing",
      "calligraphy",
      "written storytelling",
    ],
  },
  {
    category: "Listening Skill",
    prefix: "communication_skill_listening",
    guidance:
      "Use this as listening texture. Deep listening, validation, silence tolerance, subtext, and crisis listening may shape care and conflict repair.",
    values: [
      "active listening",
      "empathetic listening",
      "reflective listening",
      "deep listening",
      "therapeutic listening",
      "conflict listening",
      "supportive listening",
      "non-judgemental listening",
      "information gathering",
      "emotional validation",
      "paraphrasing",
      "clarification",
      "follow up questioning",
      "silence tolerance",
      "attentive presence",
      "reading between the lines",
      "understanding subtext",
      "hearing unspoken needs",
      "crisis listening",
      "relationship listening",
    ],
  },
  {
    category: "Persuasion Skill",
    prefix: "communication_skill_persuasion",
    guidance:
      "Use this as persuasive communication texture. Influence, advocacy, mediation, campaigning, and reputation work may shape stakes without forcing agreement.",
    values: [
      "persuasion",
      "influence",
      "negotiation",
      "diplomacy",
      "mediation",
      "advocacy",
      "salesmanship",
      "coalition building",
      "consensus building",
      "motivational speaking",
      "public relations",
      "campaigning",
      "social influence",
      "leadership communication",
      "reputation management",
      "relationship management",
      "conflict resolution",
      "stakeholder management",
      "change management",
      "narrative building",
    ],
  },
  {
    category: "Language Skill",
    prefix: "communication_skill_language",
    guidance:
      "Use this as language and register texture. Translation, interpretation, dialect, jargon, and formal or poetic language may shape access, intimacy, and social codes.",
    values: [
      "multilingualism",
      "translation",
      "interpretation",
      "linguistics",
      "language learning",
      "sign language",
      "heritage language fluency",
      "cross-cultural fluency",
      "dialect switching",
      "accent adaptation",
      "formal language",
      "informal language",
      "technical jargon",
      "legal language",
      "medical terminology",
      "courtly language",
      "religious language",
      "military jargon",
      "business language",
      "poetic language",
    ],
  },
  {
    category: "Non-Verbal Skill",
    prefix: "communication_skill_non_verbal",
    guidance:
      "Use this as non-verbal communication texture. Body language, eye contact, tone, proximity, projection, and micro-expression reading may shape subtext without mind-reading certainty.",
    values: [
      "body language reading",
      "facial expression reading",
      "eye contact management",
      "gesture control",
      "presence projection",
      "posture awareness",
      "tone management",
      "voice control",
      "emotional signalling",
      "social awareness",
      "micro-expression reading",
      "spatial awareness",
      "proximity management",
      "comfort signalling",
      "confidence projection",
      "calming presence",
      "charismatic presence",
      "intimidation presence",
      "warmth projection",
      "trust signalling",
    ],
  },
  {
    category: "Teaching Skill",
    prefix: "communication_skill_teaching",
    guidance:
      "Use this as teaching communication texture. Instruction, coaching, feedback, simplification, and guided learning may shape patience, authority, or mentorship.",
    values: [
      "instruction",
      "coaching",
      "mentoring",
      "training",
      "education",
      "curriculum explanation",
      "feedback delivery",
      "concept simplification",
      "knowledge transfer",
      "guided learning",
      "question answering",
      "demonstration",
      "student engagement",
      "encouragement",
      "constructive criticism",
      "learning assessment",
      "knowledge organisation",
      "public education",
      "skill development",
      "intellectual guidance",
    ],
  },
  {
    category: "Investigative Skill",
    prefix: "communication_skill_investigative",
    guidance:
      "Use this as investigative communication texture. Interviewing, evidence gathering, interrogation, sensitive topics, and credibility assessment may shape truth-seeking scenes with ethical pressure.",
    values: [
      "interviewing",
      "interrogation",
      "fact finding",
      "evidence gathering",
      "source development",
      "question design",
      "truth detection",
      "rapport building for information",
      "witness interviewing",
      "journalistic interviewing",
      "research communication",
      "information extraction",
      "cross examination",
      "deposition skills",
      "investigative listening",
      "pattern questioning",
      "follow up inquiry",
      "credibility assessment",
      "confidential conversations",
      "sensitive topic navigation",
    ],
  },
  {
    category: "Romantic Communication Skill",
    prefix: "communication_skill_romantic",
    guidance:
      "Use this as romantic communication texture. Flirting, vulnerability, reassurance, repair, apology, boundaries, and long-term maintenance may shape relationship beats while preserving mutual choice.",
    values: [
      "flirting",
      "complimenting",
      "affection expression",
      "love letter writing",
      "confession delivery",
      "romantic storytelling",
      "vulnerability sharing",
      "relationship repair",
      "emotional reassurance",
      "conflict repair",
      "boundary discussion",
      "needs expression",
      "active romantic listening",
      "pet name usage",
      "romantic planning",
      "intimacy building",
      "trust building",
      "apology delivery",
      "devotion expression",
      "long term relationship maintenance",
    ],
  },
  {
    category: "Weakness",
    prefix: "communication_skill_weakness",
    guidance:
      "Use this as optional communication weakness texture. Avoidance, oversharing, defensiveness, unclear expression, fear, or silence may complicate scenes without defining the character entirely.",
    values: [
      "poor listener",
      "interrupts frequently",
      "avoids difficult conversations",
      "overshares",
      "undershares",
      "unclear expression",
      "conflict avoidance",
      "passive-aggressive communication",
      "blunt to a fault",
      "people pleasing",
      "fear of public speaking",
      "social anxiety",
      "difficulty expressing feelings",
      "difficulty asking for help",
      "difficulty setting boundaries",
      "defensive communication",
      "argumentative tendencies",
      "miscommunication prone",
      "trust issues in communication",
      "silence as defence",
    ],
  },
  {
    category: "Mastery",
    prefix: "communication_skill_mastery",
    guidance:
      "Use this as communication mastery texture. Skill level may shape reputation, confidence, pressure, blind spots, or growth without making every conversation effortless.",
    values: [
      "novice communicator",
      "competent communicator",
      "skilled communicator",
      "expert communicator",
      "master orator",
      "master storyteller",
      "master negotiator",
      "master diplomat",
      "master teacher",
      "master interviewer",
      "master writer",
      "master listener",
      "master persuader",
      "master mediator",
      "legendary speaker",
      "renowned author",
      "trusted confidant",
      "charismatic leader",
      "communication prodigy",
      "communication icon",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "communication_skill_dialogue",
    guidance:
      "Use this as dialogue inspiration only. Keep delivery natural and do not force these lines verbatim.",
    values: [
      "Help me understand what you're really saying.",
      "You explain difficult things in a way that makes sense.",
      "I hear the words. Tell me the feeling underneath them.",
      "You're not listening to respond. You're listening to understand.",
      "There are easier ways to persuade people.",
      "Maybe. But not better ones.",
      "You make silence feel less like a punishment.",
      "That is because I am not waiting to use it against you.",
      "Write it down if saying it feels impossible.",
      "Some truths need a quieter path.",
      "You make people feel heard.",
      "That's usually all they wanted.",
    ],
  },
] satisfies readonly CommunicationSkillSeedGroup[]);

export const COMMUNICATION_SKILL_PRESETS = Object.freeze(
  COMMUNICATION_SKILL_SEED_GROUPS.flatMap((group) =>
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
        "communication skill preset",
      ],
    })),
  ),
);

export const COMMUNICATION_SKILL_PRESET_CATEGORIES = Object.freeze(
  Array.from(
    new Set(COMMUNICATION_SKILL_PRESETS.map((preset) => preset.category)),
  ).sort(),
);

export function getCommunicationSkillPresetsByCategory(
  category: CommunicationSkillPresetCategory,
): CommunicationSkillPreset[] {
  return COMMUNICATION_SKILL_PRESETS.filter(
    (preset) => preset.category === category,
  );
}

export function findCommunicationSkillPresetById(
  id: string,
): CommunicationSkillPreset | undefined {
  return COMMUNICATION_SKILL_PRESETS.find((preset) => preset.id === id);
}

export function compileCommunicationSkillPresetAdditions(
  preset: CommunicationSkillPreset,
): CompiledCommunicationSkillPresetAdditions {
  return {
    backgroundAddition: `Communication skill context: ${preset.category} - ${preset.value}. ${preset.guidance}`,
    personalityAddition: `Communication skill texture: ${preset.value} may shape voice, listening habits, conflict style, confidence, blind spots, and repair without replacing the character's full personality.`,
    systemPromptAddition: `Communication skill guidance: Treat ${preset.value} as soft interpersonal context. Let expression, listening, subtext, limits, and consequences surface when relevant; preserve consent, boundaries, and {{user}} autonomy.`,
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
