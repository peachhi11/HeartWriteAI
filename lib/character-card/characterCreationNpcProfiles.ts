import {
  CHARACTER_CREATION_NPC_PROFILE_TYPES,
  CharacterCreationNpcMiniProfileSchema,
  type CharacterCreationNpcMiniProfile,
  type CharacterCreationNpcProfileType,
} from "../../types/character-card/CharacterCreationForm";

export const NPC_MINI_PROFILE_TYPES = CHARACTER_CREATION_NPC_PROFILE_TYPES;

export const NPC_MINI_PROFILE_TYPE_LABELS = {
  family: "Family",
  ex: "Ex",
  rival: "Rival",
  love_interest: "Love Interest",
  friend: "Friend",
  mentor: "Mentor",
  dependant: "Dependant",
  enemy: "Enemy",
  patron: "Patron",
  employer: "Employer",
  wildcard: "Wildcard",
} as const satisfies Record<CharacterCreationNpcProfileType, string>;

interface CreateCharacterCreationNpcMiniProfileInput {
  characterName?: string;
  index?: number;
  name?: string;
  profileType: CharacterCreationNpcProfileType;
}

interface NpcMiniProfileTemplate {
  role: string;
  relationshipToCharacter: string;
  publicRole: string;
  privateHistory: string;
  storyFunction: string;
  emotionalPressure: string;
  behaviorShift: string;
  conflictHook: string;
  supportHook: string;
  boundaries: string;
}

const NPC_MINI_PROFILE_TEMPLATES = {
  family: {
    role: "Family member",
    relationshipToCharacter:
      "Carries inherited history, duty, resemblance, old loyalty, or old resentment.",
    publicRole: "Known family connection",
    privateHistory:
      "Knows the character before the current story role hardened into performance.",
    storyFunction:
      "Reveals origin pressure and the version of the character shaped by home.",
    emotionalPressure:
      "Activates obligation, shame, protectiveness, or the need to be seen as changed.",
    behaviorShift:
      "The character becomes more guarded, younger, dutiful, or sharply defensive.",
    conflictHook:
      "Family loyalty collides with the character's chosen life or chosen love.",
    supportHook:
      "Can offer old knowledge, practical help, and continuity when trust is earned.",
    boundaries:
      "Use as non-sexual family context; do not use family pressure to override consent.",
  },
  ex: {
    role: "Former partner",
    relationshipToCharacter:
      "Carries unfinished emotional history, regret, closure, temptation, or warning.",
    publicRole: "Known former relationship",
    privateHistory:
      "Knows a vulnerable or unhealed version the character may deny still exists.",
    storyFunction:
      "Tests whether the character has truly changed or is repeating an old pattern.",
    emotionalPressure:
      "Activates comparison, jealousy, avoidance, guilt, or fear of replacement.",
    behaviorShift:
      "The character becomes controlled, brittle, too polite, or unexpectedly honest.",
    conflictHook:
      "Old intimacy reappears before present trust has fully stabilized.",
    supportHook:
      "Can clarify old wounds, offer closure, or prove the current bond is different.",
    boundaries:
      "Do not treat jealousy as ownership; preserve the active partner's agency.",
  },
  rival: {
    role: "Rival",
    relationshipToCharacter:
      "Mirrors ambition, competence, desire, status, or a rejected part of the self.",
    publicRole: "Competitor or social equal",
    privateHistory:
      "Has a record of comparison, challenge, mutual recognition, or unresolved defeat.",
    storyFunction:
      "Sharpens stakes by forcing the character to define what they actually value.",
    emotionalPressure:
      "Activates competitiveness, envy, admiration, insecurity, or attraction pressure.",
    behaviorShift:
      "The character performs competence harder and becomes more precise or provocative.",
    conflictHook:
      "The rival wins attention, respect, resources, or emotional access first.",
    supportHook:
      "Can become a reluctant ally once respect outruns resentment.",
    boundaries:
      "Use rivalry as pressure, not as a tool to force humiliation or romantic outcomes.",
  },
  love_interest: {
    role: "Potential love interest",
    relationshipToCharacter:
      "Creates romantic contrast, temptation, route pressure, or an alternative future.",
    publicRole: "Romantic possibility",
    privateHistory:
      "May carry a quiet almost, an old spark, or a future the character has not chosen.",
    storyFunction:
      "Clarifies what kind of love the character seeks, fears, or refuses to name.",
    emotionalPressure:
      "Activates longing, choice anxiety, jealousy, tenderness, or commitment fear.",
    behaviorShift:
      "The character becomes more attentive, evasive, protective, or self-conscious.",
    conflictHook:
      "A choice between comfort, status, safety, desire, and truth becomes unavoidable.",
    supportHook:
      "Can reveal the character's romantic pattern without defining the final route.",
    boundaries:
      "Keep all romance adult, consensual, and non-coercive; do not predetermine choice.",
  },
  friend: {
    role: "Friend",
    relationshipToCharacter:
      "Offers familiarity, honesty, shared rituals, and a version of love without performance.",
    publicRole: "Trusted social tie",
    privateHistory:
      "Knows routines, tells, soft spots, bad habits, and what the character avoids saying.",
    storyFunction:
      "Makes the character feel socially real beyond the active scene.",
    emotionalPressure:
      "Activates loyalty, embarrassment, accountability, or the need to be protected from themself.",
    behaviorShift:
      "The character becomes less polished, more readable, or more openly irritated.",
    conflictHook:
      "The friend says the true thing the character has been avoiding.",
    supportHook:
      "Can stabilize scenes, provide history, and open low-stakes vulnerability.",
    boundaries:
      "Do not use a friend to puppet the user or solve the main relationship for them.",
  },
  mentor: {
    role: "Mentor",
    relationshipToCharacter:
      "Represents training, approval, inherited rules, disappointment, or a standard to surpass.",
    publicRole: "Guide or authority figure",
    privateHistory:
      "Helped shape the character's competence and the cost attached to it.",
    storyFunction:
      "Tests whether old instruction still serves the character's present life.",
    emotionalPressure:
      "Activates respect, rebellion, shame, duty, gratitude, or fear of failure.",
    behaviorShift:
      "The character becomes more formal, defensive, obedient, or sharply independent.",
    conflictHook:
      "The mentor demands old loyalty when the character needs new judgment.",
    supportHook:
      "Can provide wisdom, context, or a hard-earned blessing after accountability.",
    boundaries:
      "Keep mentorship non-exploitative; do not romanticize authority misuse.",
  },
  dependant: {
    role: "Dependant",
    relationshipToCharacter:
      "Represents care duty, vulnerability, protection, patience, or a daily reason to stay responsible.",
    publicRole: "Person, creature, or group under care",
    privateHistory:
      "Depends on the character's consistency and exposes their capacity for practical devotion.",
    storyFunction:
      "Shows how the character behaves when care is not glamorous.",
    emotionalPressure:
      "Activates protectiveness, fatigue, tenderness, guilt, or fear of failing someone vulnerable.",
    behaviorShift:
      "The character becomes gentler, more vigilant, more tired, or less performative.",
    conflictHook:
      "Duty to the dependant competes with romance, ambition, safety, or escape.",
    supportHook:
      "Can reveal tenderness, daily competence, and non-romantic love.",
    boundaries:
      "Use dependants as non-romantic and non-sexual context only.",
  },
  enemy: {
    role: "Enemy",
    relationshipToCharacter:
      "Holds threat, leverage, betrayal, ideological opposition, or a wound that still has teeth.",
    publicRole: "Opposition force",
    privateHistory:
      "Knows enough to endanger the character socially, emotionally, or materially.",
    storyFunction:
      "Forces the character to choose between survival habits and present values.",
    emotionalPressure:
      "Activates suspicion, rage, fear, cold strategy, or protective aggression.",
    behaviorShift:
      "The character becomes colder, quieter, tactical, or visibly less forgiving.",
    conflictHook:
      "The enemy weaponizes a past truth or threatens someone the character protects.",
    supportHook:
      "Can become a temporary pressure ally if the story needs uneasy cooperation.",
    boundaries:
      "Do not use enemy pressure to remove user agency or force an unsafe outcome.",
  },
  patron: {
    role: "Patron",
    relationshipToCharacter:
      "Controls resources, access, status, artistic opportunity, protection, or debt.",
    publicRole: "Sponsor or benefactor",
    privateHistory:
      "Has helped the character survive or rise, but may expect loyalty in return.",
    storyFunction:
      "Turns support into pressure and asks what the character owes for help.",
    emotionalPressure:
      "Activates gratitude, dependence fear, pride, ambition, or resentment.",
    behaviorShift:
      "The character becomes diplomatic, careful, strategic, or quietly resistant.",
    conflictHook:
      "Patronage comes with a condition that strains the relationship web.",
    supportHook:
      "Can provide rescue, opportunity, introductions, or material stakes.",
    boundaries:
      "Keep patron pressure explicit and resist coercive romance framing.",
  },
  employer: {
    role: "Employer",
    relationshipToCharacter:
      "Defines labor, hierarchy, reputation, obligation, leverage, or professional dependence.",
    publicRole: "Work authority",
    privateHistory:
      "Knows the character's competence, limits, performance mask, and professional risk.",
    storyFunction:
      "Tests the character's ethics when work pressure conflicts with private truth.",
    emotionalPressure:
      "Activates duty, resentment, fear of failure, class pressure, or rebellion.",
    behaviorShift:
      "The character becomes more contained, status-aware, or openly resistant.",
    conflictHook:
      "Professional orders collide with personal loyalty or moral boundaries.",
    supportHook:
      "Can supply workplace stakes, access, schedule pressure, and reputational risk.",
    boundaries:
      "Preserve workplace consent, ethics, and escape routes.",
  },
  wildcard: {
    role: "Wildcard connection",
    relationshipToCharacter:
      "Introduces an unexpected social tie that reframes the character's life.",
    publicRole: "Unstable or surprising connection",
    privateHistory:
      "Knows one highly specific truth that changes how others read the character.",
    storyFunction:
      "Prevents the cast web from feeling closed or predictable.",
    emotionalPressure:
      "Activates curiosity, caution, embarrassment, debt, or sudden protectiveness.",
    behaviorShift:
      "The character reveals a reaction their usual circle does not know how to provoke.",
    conflictHook:
      "A hidden connection appears at the worst possible moment.",
    supportHook:
      "Can open a new route, clue, alliance, or pressure valve.",
    boundaries:
      "Keep the wildcard connected to existing causes rather than random shock value.",
  },
} as const satisfies Record<CharacterCreationNpcProfileType, NpcMiniProfileTemplate>;

export function createCharacterCreationNpcMiniProfile({
  characterName,
  index = 0,
  name,
  profileType,
}: CreateCharacterCreationNpcMiniProfileInput): CharacterCreationNpcMiniProfile {
  const template = NPC_MINI_PROFILE_TEMPLATES[profileType];
  const label = NPC_MINI_PROFILE_TYPE_LABELS[profileType];
  const fallbackName = `Unnamed ${label} ${index + 1}`;
  const profileName = name?.trim() || fallbackName;
  const anchor = characterName?.trim() || "the character";

  return CharacterCreationNpcMiniProfileSchema.parse({
    id: `${profileType}_${index + 1}`,
    profileType,
    name: profileName,
    role: template.role,
    relationshipToCharacter: template.relationshipToCharacter.replaceAll(
      "the character",
      anchor,
    ),
    publicRole: template.publicRole,
    privateHistory: template.privateHistory.replaceAll("the character", anchor),
    storyFunction: template.storyFunction.replaceAll("the character", anchor),
    emotionalPressure: template.emotionalPressure,
    behaviorShift: template.behaviorShift.replaceAll("the character", anchor),
    conflictHook: template.conflictHook,
    supportHook: template.supportHook,
    boundaries: template.boundaries,
    lorebookKeys: [profileName, label, "NPC network", "relationship web"]
      .filter(Boolean)
      .join(", "),
  });
}
