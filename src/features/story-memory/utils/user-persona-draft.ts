import type { UserPersonaDraft, UserPersonaGender } from "@/features/story-memory/types/user-persona";
import type {
  Character,
  CorePromptPack,
  RelationshipThread,
  SceneMemory,
  SecretOrReveal,
} from "@/features/story-memory/types/story-memory";
import { compactSentence, type LoadedCharacterCard } from "@/features/story-memory/utils/character-card-parser";

type UserGenderFrame = {
  adjective: Exclude<UserPersonaGender, "infer">;
  ageLabel: string;
  genderLabel: string;
  possessive: "her" | "his" | "their";
  pronoun: "she" | "he" | "they";
};

type PersonaMatchContext = {
  conflictDriver: string;
  relationshipDynamic: string;
  tropeAlignment: string;
  worldContext: string;
};

type CardPersonaFacts = {
  age?: string;
  charBeliefFacts: string[];
  hasAgeGap: boolean;
  identityFacts: string[];
  isLivingTogether: boolean;
  isOmega: boolean;
  isOmegaverse: boolean;
  isStepSibling: boolean;
  isUniversityStudent: boolean;
  relationshipFacts: string[];
  settingFacts: string[];
  summaryFacts: string[];
  worldFacts: string[];
};

type PersonaSeedProfile = {
  appearance: string[];
  backstory: string[];
  compatibility: string[];
  interaction: string[];
  knowledge: string[];
  opening: string[];
  psychology: string[];
  role: string[];
  romance: string[];
  scenes: string[];
  selfConcept: string[];
  sourceLabels: string[];
  voice: string[];
};

export type UserPersonaGenerationContext = {
  activeCorePack?: CorePromptPack;
  activeRelationship?: RelationshipThread;
  activeScene?: SceneMemory;
  activeSecret?: SecretOrReveal;
  characters?: Character[];
  selectedTagLabels?: string[];
  selectedTagSlugs?: string[];
};

export const romanticRoleplayUserPersonaPrompt = `Romantic Roleplay User Persona Character Prompt (Matched for Character Card)

Purpose: Generate a user persona designed specifically for romantic narrative roleplay that aligns with a pre-existing character card. This persona should embody narrative conflict, emotional depth, and complementary traits that ultimately lead to a well-matched romantic pairing where the characters fall in love.

Instructions:
Create a cohesive, psychologically realistic persona. Each detail should logically connect to the character's emotional needs, backstory, and romantic arc. Focus on traits that create initial tension and facilitate eventual romantic compatibility.

Required sections:
1. Persona Identity & Role
2. Physical Appearance & Presentation
3. Relational Backstory & Emotional Triggers
4. Psychology & Internal Conflict
5. Romantic and Intimate Dynamics
6. Interaction Style in Roleplay
7. Narrative and Romantic Arc Potential
8. Voice, Dialogue & Emotional Expression
9. Compatibility Architecture
10. Long-Term Scene Opportunities

Output should be richly descriptive narrative prose that makes {{user}} feel alive and ready for romantic roleplay, while preserving {{user}} agency and never rewriting {{char}}.`;

export function buildUserPersonaDraftFromCard(
  card: LoadedCharacterCard,
  personaGender: UserPersonaGender = "female",
  generationContext: UserPersonaGenerationContext = {},
): UserPersonaDraft {
  const characterName = card.name ?? "{{char}}";
  const sourceText = getCardSourceText(card, generationContext);
  const userFrame = getUserGenderFrame(personaGender, sourceText);
  const matchContext = inferPersonaMatchContext(card, sourceText, characterName);
  const personaFit = inferPersonaFit(sourceText, characterName, userFrame, matchContext);
  const seedProfile = buildPersonaSeedProfile(generationContext);
  const contextNotes = buildGenerationContextNotes(generationContext);

  return {
    appearancePresentation: appendSeedLines(
      buildAppearancePresentation(characterName, userFrame, personaFit),
      seedProfile.appearance,
    ),
    boundaries: [
      "{{user}}'s thoughts, dialogue, consent, and choices remain controlled by the human user.",
      "The character card stays source context for {{char}} and the setup, not content to copy into {{user}}.",
      "{{user}} has their own motives, history, boundaries, and secrets that can be filled in or revised.",
      "{{user}} reveals personal history through play, not through omniscient preload.",
      "{{user}} has independent goals, relationships, routines, responsibilities, and stakes that exist even when {{char}} is not present.",
      `${characterName}'s established autonomy stays intact.`,
    ].join("\n"),
    cardFitNotes: [
      `${characterName}'s card controls {{char}}'s voice, motives, memories, scenario pressure, and opening narration.`,
      `Persona fit: ${personaFit.fitCues}.`,
      `Trope alignment: ${matchContext.tropeAlignment}.`,
      `Relationship dynamic: ${matchContext.relationshipDynamic}.`,
      `World context: ${matchContext.worldContext}.`,
      `Conflict driver: ${matchContext.conflictDriver}.`,
      card.description
        ? `Card definition to fit around: ${compactSentence(card.description, "character definition and behavior")}`
        : "",
      card.personality ? `Personality pressure to fit around: ${compactSentence(card.personality, "card personality")}` : "",
      card.tags.length ? `Relevant card tags: ${card.tags.join(", ")}.` : "No card tags were imported.",
      personaFit.facts.summaryFacts.length ? `Card-derived persona facts: ${personaFit.facts.summaryFacts.join(", ")}.` : "",
      seedProfile.sourceLabels.length ? `Persona source patterns: ${seedProfile.sourceLabels.join(", ")}.` : "",
      ...contextNotes,
      "{{user}} fills the missing emotional, thematic, moral, social, professional, ideological, or structural gap in the existing card dynamic.",
      "The persona keeps to what {{user}} can plausibly know, want, hide, or choose.",
    ]
      .filter(Boolean)
      .join("\n"),
    compatibilityArchitecture: appendSeedLines(
      buildCompatibilityArchitecture(characterName, userFrame, personaFit),
      seedProfile.compatibility,
    ),
    connectionToCharacter: appendSeedLines(personaFit.connectionToCharacter, seedProfile.role),
    displayName: "{{user}}",
    interactionStyle: appendSeedLines(buildInteractionStyle(characterName, userFrame, personaFit), seedProfile.interaction),
    narrativeArc: appendSeedLines(buildNarrativeArc(characterName, userFrame, personaFit), seedProfile.scenes),
    openingAngle: appendSeedLines(personaFit.openingAngle, seedProfile.opening),
    psychologyInternalConflict: appendSeedLines(
      buildPsychologyInternalConflict(characterName, userFrame, personaFit),
      seedProfile.psychology,
    ),
    relationalBackstory: appendSeedLines(
      buildRelationalBackstory(characterName, userFrame, personaFit),
      seedProfile.backstory,
    ),
    romanticIntimateDynamics: appendSeedLines(
      buildRomanticIntimateDynamics(characterName, userFrame, personaFit),
      seedProfile.romance,
    ),
    roleInStory: appendSeedLines(personaFit.roleInStory, seedProfile.role),
    sceneOpportunities: appendSeedLines(buildSceneOpportunities(characterName, userFrame, personaFit), seedProfile.scenes),
    selfConcept: prioritizeSeedLines(personaFit.selfConcept, seedProfile.selfConcept),
    tropeRelationshipWorldContext: buildTropeRelationshipWorldContext(characterName, matchContext, personaFit.facts),
    voiceDialogue: appendSeedLines(buildVoiceDialogue(characterName, userFrame, personaFit), seedProfile.voice),
    whatUserKnows: appendSeedLines(personaFit.whatUserKnows, seedProfile.knowledge),
  };
}

function getCardSourceText(card: LoadedCharacterCard, generationContext: UserPersonaGenerationContext = {}) {
  return [
    card.tags.join(", "),
    card.description,
    card.personality,
    card.scenario,
    card.firstMessage,
    ...card.alternateGreetings,
    card.exampleDialog,
    card.creatorNotes,
    ...getGenerationContextSourceText(generationContext),
  ]
    .filter(Boolean)
    .join("\n")
    .replace(/\s+/g, " ")
    .trim();
}

function getGenerationContextSourceText({
  activeRelationship,
  activeScene,
  activeSecret,
  characters = [],
  selectedTagLabels = [],
}: UserPersonaGenerationContext) {
  return [
    selectedTagLabels.length ? `Selected story tags: ${selectedTagLabels.join(", ")}.` : "",
    activeRelationship
      ? [
          `Active relationship: ${activeRelationship.dynamic_label}.`,
          activeRelationship.current_state ? `Relationship state: ${activeRelationship.current_state}.` : "",
          activeRelationship.conflict_notes ? `Relationship conflict: ${activeRelationship.conflict_notes}.` : "",
          activeRelationship.next_pressure_point
            ? `Next relationship pressure: ${activeRelationship.next_pressure_point}.`
            : "",
          formatNames(activeRelationship.participants, characters)
            ? `Relationship participants: ${formatNames(activeRelationship.participants, characters)}.`
            : "",
        ].join(" ")
      : "",
    activeSecret
      ? [
          `Active secret: ${activeSecret.title ?? "Untitled secret"}.`,
          `Secret text: ${activeSecret.secret_text}.`,
          `Secret reveal status: ${activeSecret.reveal_status}.`,
          activeSecret.current_pressure ? `Secret pressure: ${activeSecret.current_pressure}.` : "",
          formatNames(activeSecret.who_knows, characters)
            ? `Known by: ${formatNames(activeSecret.who_knows, characters)}.`
            : "",
          formatNames(activeSecret.who_is_hiding_it, characters)
            ? `Hidden by: ${formatNames(activeSecret.who_is_hiding_it, characters)}.`
            : "",
          formatNames(activeSecret.who_is_pretending_not_to_know, characters)
            ? `Pretending not to know: ${formatNames(activeSecret.who_is_pretending_not_to_know, characters)}.`
            : "",
        ].join(" ")
      : "",
    activeScene
      ? [
          activeScene.scenario ? `Scenario: ${activeScene.scenario}.` : "",
          activeScene.setting ? `Setting: ${activeScene.setting}.` : "",
          activeScene.location ? `Location: ${activeScene.location}.` : "",
          activeScene.summary ? `Current scene: ${activeScene.summary}.` : "",
          activeScene.narrative_arc ? `Narrative arc: ${activeScene.narrative_arc}.` : "",
        ].join(" ")
      : "",
  ].filter(Boolean);
}

function buildGenerationContextNotes(context: UserPersonaGenerationContext) {
  return getGenerationContextSourceText(context).map((line) => `Story setup context: ${line}`);
}

function buildPersonaSeedProfile({
  activeCorePack,
  selectedTagLabels = [],
  selectedTagSlugs = [],
}: UserPersonaGenerationContext): PersonaSeedProfile {
  const seedText = [
    activeCorePack?.title,
    activeCorePack?.slug,
    activeCorePack?.category,
    activeCorePack?.description,
    activeCorePack?.base_prompt,
    ...(activeCorePack?.compatible_tag_slugs ?? []),
    ...selectedTagLabels,
    ...selectedTagSlugs,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const profile = emptyPersonaSeedProfile();

  if (hasSeed(seedText, ["enemies", "rival", "competitive"])) {
    addSeed(profile, "Rival/competitive", {
      compatibility: [
        "Core friction: {{user}} is not agreeable by default; respect grows through competence, clean losses, tactical honesty, and the moment rivalry costs more than it protects.",
      ],
      interaction: [
        "Interaction pattern: {{user}} challenges weak logic, notices tells, and treats banter as a duel where attraction leaks through precision rather than softness.",
      ],
      opening: [
        "{{user}} enters with a concrete win condition, a professional or social stake, and a reason not to give {{char}} the satisfaction of seeing vulnerability first.",
      ],
      psychology: [
        "Pride under pressure: {{user}} would rather look difficult than look needy, and vulnerability feels like giving the rival leverage.",
      ],
      role: ["Romantic rival/counterforce whose competence makes {{char}} react, adapt, and choose differently."],
      scenes: [
        "Scene pressure: a public competence test where {{user}} beats or saves {{char}}, changing the power balance without requiring a confession.",
      ],
      selfConcept: [
        "{{user}} believes composure is armor and that being underestimated is useful until the rivalry starts touching something personal.",
      ],
      voice: [
        'Voice pattern: clipped challenge, dry praise, and surgical honesty; e.g. "If you want me to fold, try earning it first."',
      ],
    });
  }

  if (hasSeed(seedText, ["friends-to-lovers", "friend", "best friend", "longtime"])) {
    addSeed(profile, "Friends-to-lovers", {
      backstory: [
        "{{user}} carries ordinary intimacy with {{char}}: old jokes, casual access, witnessed bad habits, and memories that make denial harder.",
      ],
      compatibility: [
        "Compatibility pattern: the romance grows from being known too well, not from mystery; conflict comes from risking the friendship's safe shape.",
      ],
      knowledge: [
        "{{user}} knows small, unglamorous facts about {{char}} that outsiders miss, but not {{char}}'s private motives unless they have appeared on-page.",
      ],
      scenes: [
        "Scene pressure: a familiar domestic or routine moment turns charged because both know exactly how normal it used to feel.",
      ],
      selfConcept: [
        "{{user}} sees the bond as something earned over time, which makes wanting more feel like both a temptation and a possible betrayal.",
      ],
    });
  }

  if (hasSeed(seedText, ["situationship", "fwb", "friends with benefits", "one-night", "undefined"])) {
    addSeed(profile, "Messy relationship/FWB", {
      compatibility: [
        "Messy dynamic: {{user}} can tolerate ambiguity in public while privately tracking every inconsistency, claim, touch, and avoidance.",
      ],
      interaction: [
        "Messy-relationship pattern: {{user}} uses plausible deniability, teasing, and selective withdrawal when the arrangement starts asking for emotional truth.",
      ],
      psychology: [
        "Core wound: {{user}} fears becoming convenient, not chosen; the sharper behavior often protects against feeling disposable.",
      ],
      romance: [
        "Intimacy pattern: physical closeness carries history, unfinished meaning, and aftermath; sex or flirtation increases the question instead of settling it.",
      ],
      scenes: [
        "Scene pressure: an almost-casual touch, hookup reference, or morning-after logistics beat forces both characters to define what they keep avoiding.",
      ],
    });
  }

  if (hasSeed(seedText, ["possessive", "obsessive", "dark romance", "morally grey"])) {
    addSeed(profile, "Dark romance/possessive", {
      compatibility: [
        "Dark-romance pattern: {{user}} is drawn to intensity but tests whether protection is care, control, possession, or fear wearing a romantic mask.",
      ],
      interaction: [
        "Possessive-dynamic pattern: {{user}} notices ownership language and answers it with boundaries, provocation, or conditional permission instead of automatic submission.",
      ],
      psychology: [
        "Boundary trait: {{user}} values autonomy enough that being wanted only matters when it does not erase their agency.",
      ],
      romance: [
        "Intimacy pattern: desire is charged by risk, protectiveness, jealousy, and restraint; the key question is what {{char}} can want without taking.",
      ],
    });
  }

  if (hasSeed(seedText, ["dominant", "submissive", "switch", "bdsm", "praise", "degradation", "ddlg", "daddy"])) {
    addSeed(profile, "BDSM/power dynamic", {
      compatibility: [
        "Power-dynamic pattern: compatibility depends on trust, negotiated control, correction, reward, refusal, and aftermath, not a fixed generic script.",
      ],
      interaction: [
        "Power-exchange interaction: {{user}} reads tone, permission, pressure, and restraint; control becomes meaningful only when both characters have something to risk.",
      ],
      romance: [
        "Intimacy pattern: {{user}} may enjoy power exchange, praise, teasing, correction, or surrender when the scene earns it, while consent and {{user}} agency remain explicit boundaries.",
      ],
      voice: [
        'Voice pattern: desire names the power move clearly; e.g. "Ask like you mean it, or stop pretending you are in control."',
      ],
    });
  }

  if (hasSeed(seedText, ["forbidden", "secret relationship", "sibling", "step", "age gap", "brother", "sister"])) {
    addSeed(profile, "Forbidden attraction", {
      backstory: [
        "Forbidden-attraction pressure: {{user}} understands the social map around the desire: who would be hurt, who would judge, and what must stay hidden.",
      ],
      compatibility: [
        "Forbidden compatibility: the romance becomes believable through restraint, cost, secrecy, and choices that prove the attraction is more than access.",
      ],
      knowledge: [
        "{{user}} knows the visible social risk and any public rule around the connection, but private guilt, longing, or justification still has to emerge in play.",
      ],
      scenes: [
        "Scene pressure: a public almost-slip or private near-confession makes the cost of being seen more dangerous than the desire itself.",
      ],
    });
  }

  if (hasSeed(seedText, ["fake dating", "marriage of convenience", "betrothal", "arranged"])) {
    addSeed(profile, "Arrangement/fake dating", {
      backstory: [
        "Arrangement pressure: {{user}} enters with terms, obligations, reputation stakes, or survival needs that make the performance useful before it becomes intimate.",
      ],
      compatibility: [
        "Arrangement compatibility: conflict lives in the gap between what is performed publicly, negotiated privately, and accidentally becomes real.",
      ],
      interaction: [
        "{{user}} tracks contracts, favors, public optics, and private tells; affection becomes suspicious because it was not part of the agreement.",
      ],
      scenes: [
        "Scene pressure: a public performance beat feels too convincing, leaving {{user}} to decide whether to call it strategy or admit it changed something.",
      ],
    });
  }

  if (hasSeed(seedText, ["vampire", "werewolf", "omegaverse", "alpha", "omega", "supernatural", "sci-fi"])) {
    addSeed(profile, "Supernatural/world rules", {
      appearance: [
        "World-specific presentation: {{user}} has visible adaptations to the setting: practical clothing, status markers, protective habits, or sensory tells that belong to the world.",
      ],
      compatibility: [
        "World-rule compatibility: attraction is shaped by biology, status, danger, law, species rules, technology, or social structure instead of floating as generic chemistry.",
      ],
      knowledge: [
        "{{user}} knows the public rules of the world and how those rules affect their body, safety, status, or access to {{char}}.",
      ],
      scenes: [
        "Scene pressure: a world rule interrupts desire at the worst possible time, forcing a choice between instinct, law, secrecy, and care.",
      ],
    });
  }

  if (hasSeed(seedText, ["grumpy", "sunshine", "opposites", "hurt comfort", "class disparity"])) {
    addSeed(profile, "Dynamic contrast", {
      compatibility: [
        "Dynamic contrast: {{user}} meets {{char}} through a meaningful difference in temperament, resources, social ease, class position, or coping style.",
      ],
      psychology: [
        "Contrast trait: {{user}}'s strength is not simple cheer or softness; it is the specific coping strategy that challenges {{char}}'s worldview.",
      ],
      scenes: [
        "Scene pressure: care arrives in the wrong emotional language first, forcing both characters to learn how the other recognizes comfort.",
      ],
    });
  }

  return profile;
}

function emptyPersonaSeedProfile(): PersonaSeedProfile {
  return {
    appearance: [],
    backstory: [],
    compatibility: [],
    interaction: [],
    knowledge: [],
    opening: [],
    psychology: [],
    role: [],
    romance: [],
    scenes: [],
    selfConcept: [],
    sourceLabels: [],
    voice: [],
  };
}

function hasSeed(seedText: string, needles: string[]) {
  return needles.some((needle) => seedText.includes(needle));
}

function addSeed(profile: PersonaSeedProfile, sourceLabel: string, seed: Partial<Omit<PersonaSeedProfile, "sourceLabels">>) {
  for (const [key, value] of Object.entries(seed) as [keyof Omit<PersonaSeedProfile, "sourceLabels">, string[]][]) {
    profile[key].push(...value);
  }
  profile.sourceLabels.push(sourceLabel);
}

function appendSeedLines(base: string, seedLines: string[]) {
  return [base, ...unique(seedLines)].filter(Boolean).join("\n");
}

function prioritizeSeedLines(base: string, seedLines: string[]) {
  return [...unique(seedLines), base].filter(Boolean).join("\n");
}

function formatNames(ids: string[], characters: Character[] = []) {
  return ids
    .map((id) => characters.find((character) => character.id === id)?.name ?? id)
    .filter(Boolean)
    .join(", ");
}

function getUserGenderFrame(personaGender: UserPersonaGender, sourceText: string): UserGenderFrame {
  if (personaGender === "female") {
    return { adjective: "female", ageLabel: "adult", genderLabel: "woman", possessive: "her", pronoun: "she" };
  }
  if (personaGender === "male") {
    return { adjective: "male", ageLabel: "adult", genderLabel: "man", possessive: "his", pronoun: "he" };
  }
  if (personaGender === "neutral") {
    return { adjective: "neutral", ageLabel: "adult", genderLabel: "person", possessive: "their", pronoun: "they" };
  }

  return inferUserGenderFrame(sourceText);
}

function inferUserGenderFrame(sourceText: string): UserGenderFrame {
  if (hasNearUser(sourceText, /\b(she|her|hers|girl|woman|female)\b/i)) {
    return { adjective: "female", ageLabel: "adult", genderLabel: "woman", possessive: "her", pronoun: "she" };
  }

  if (hasNearUser(sourceText, /\b(he|him|his|boy|man|male)\b/i)) {
    return { adjective: "male", ageLabel: "adult", genderLabel: "man", possessive: "his", pronoun: "he" };
  }

  return { adjective: "neutral", ageLabel: "adult", genderLabel: "person", possessive: "their", pronoun: "they" };
}

function hasNearUser(sourceText: string, pattern: RegExp) {
  const userTokenPattern = /\{\{user\}\}/gi;
  let match: RegExpExecArray | null;

  while ((match = userTokenPattern.exec(sourceText)) !== null) {
    const start = Math.max(0, match.index - 180);
    const end = Math.min(sourceText.length, match.index + 180);
    if (pattern.test(sourceText.slice(start, end))) return true;
  }

  return false;
}

function inferPersonaMatchContext(
  card: LoadedCharacterCard,
  sourceText: string,
  characterName: string,
): PersonaMatchContext {
  const lower = `${card.tags.join(" ")} ${sourceText}`.toLowerCase();
  const tropeSignals = unique([
    ...findSignals(lower, [
      [/enemies?\s*to\s*lovers?|rival|hate|enemy/, "enemies-to-lovers pressure"],
      [/friends?\s*to\s*lovers?|best friend|longtime friend|known (him|her|them) before/, "friends-to-lovers pressure"],
      [/ex(es)?\b|former lover|second chance/, "second-chance romance pressure"],
      [/forbidden|best friend'?s|sibling|step[-\s]?sibling|age gap|secret relationship/, "forbidden attraction pressure"],
      [/fake dating|fake relationship|pretend (date|girlfriend|boyfriend|partner)/, "fake-dating pressure"],
      [/arranged marriage|betroth|marriage of convenience/, "arranged-marriage pressure"],
      [/fwb|friends with benefits|situationship|undefined|hooked up|slept with|bathroom/, "messy situationship/FWB pressure"],
      [/unrequited|one[-\s]?sided|pining|mutual longing/, "longing/pining pressure"],
      [/possessive|obsessive|morally grey|mafia|gang|underworld|dark romance/, "dark-romance pressure"],
      [/dominant|submissive|switch|praise kink|degradation|ddlg|daddy kink|bdsm/, "power-dynamic/BDSM pressure"],
      [/vampire|werewolf|omegaverse|alpha|omega|supernatural/, "supernatural-romance pressure"],
    ]),
  ]);
  const relationshipSignals = unique([
    ...findSignals(lower, [
      [/best friend|friend|longtime|known (him|her|them) before/, "established friendship history"],
      [/girlfriend|boyfriend|partner|vanessa|jealous|pick|choose|stop seeing/, "active partner jealousy or triangle pressure"],
      [/fwb|friends with benefits|situationship|undefined|hooked up|slept with|kissed|bathroom/, "blurred physical or romantic boundary"],
      [/secret|lie|hiding|pretending|caught|video/, "secret-keeping and exposure risk"],
      [/rival|enemy|competitive|competition/, "competitive friction"],
      [/family|sibling|brother|sister|step/, "family/social-proximity complication"],
      [/boss|workplace|co-worker|coworker|employee|assistant/, "workplace/proximity power complication"],
    ]),
  ]);
  const worldSignals = unique([
    ...findSignals(lower, [
      [/college|campus|dorm|class|professor|frat|sorority/, "college/dorm contemporary world"],
      [/apartment|room|party|text|phone|hoodie|car|work|bar|club/, "contemporary reality world"],
      [/mafia|gang|cartel|underworld|crime|criminal/, "dark-romance underworld"],
      [/vampire|werewolf|witch|fae|demon|angel|supernatural/, "supernatural world"],
      [/omegaverse|alpha|omega|beta|heat|rut|pack/, "omegaverse world"],
      [/spaceship|android|alien|cyberpunk|sci[-\s]?fi|science fiction/, "science-fiction world"],
      [/kingdom|duke|lord|lady|historical|regency|court/, "historical or courtly world"],
      [/celebrity|rock star|band|idol|actor|tour/, "celebrity/rock-star world"],
      [/office|company|boss|coworker|co-worker|workplace/, "workplace world"],
    ]),
  ]);
  const conflictSignals = unique([
    ...findSignals(lower, [
      [/girlfriend|boyfriend|partner|vanessa|pick|choose|stop seeing/, "being chosen publicly versus kept privately"],
      [/secret|lie|hiding|pretending|caught|video/, "truth surfacing before either character controls it"],
      [/friend|best friend|longtime|known (him|her|them) before/, "history becoming impossible to keep casual"],
      [/forbidden|sibling|step|family|age gap/, "want colliding with social consequence"],
      [/mafia|gang|underworld|danger|threat/, "desire carrying external danger"],
      [/dominant|submissive|switch|bdsm|control/, "power and consent needing character-specific negotiation"],
      [/vampire|werewolf|omegaverse|alpha|omega|pack/, "instinct, status, or supernatural rules pressuring choice"],
    ]),
  ]);

  return {
    conflictDriver: conflictSignals[0] ?? `the unresolved pressure in ${characterName}'s opening scenario`,
    relationshipDynamic: relationshipSignals.length
      ? joinNaturalList(relationshipSignals)
      : `an emotionally charged dynamic with ${characterName}`,
    tropeAlignment: tropeSignals.length ? joinNaturalList(tropeSignals) : "character-card matched romantic tension",
    worldContext: worldSignals.length ? joinNaturalList(worldSignals) : "the card's established setting/world logic",
  };
}

function inferPersonaFit(
  sourceText: string,
  characterName: string,
  userFrame: UserGenderFrame,
  matchContext: PersonaMatchContext,
) {
  const lower = sourceText.toLowerCase();
  const facts = extractCardPersonaFacts(sourceText, characterName, userFrame);
  const partnerName = inferPartnerPressureName(sourceText);
  const hasLongHistory = /\b(before|way before|known him|known her|known them|grew up|childhood|longtime|long-time)\b/.test(
    lower,
  );
  const hasFriendship = /\b(friend|friends|bestie|best friend)\b/.test(lower);
  const hasBlurredPhysicalLine = /\b(fwb|friends with benefits|hooked up|hooking up|bathroom|suck|slept with|fucking|kissed)\b/.test(
    lower,
  );
  const hasPartnerConflict = /\b(vanessa|girlfriend|boyfriend|partner|pick|stop seeing|jealous)\b/.test(lower);
  const hasDormFamiliarity = /\b(dorm|bed|room|apartment|house|home|hoodie|hoodies|sheets)\b/.test(lower);
  const hasThighContact = /\b(thigh|knee|hand rested|fingers)\b/.test(lower);
  const fitCueItems = inferFitCueItems(lower, userFrame);

  if (hasFriendship && hasLongHistory && hasPartnerConflict) {
    return {
      connectionToCharacter: [
        `{{user}} is the ${userFrame.adjective === "neutral" ? "person" : `${userFrame.adjective} friend`} who was in ${characterName}'s life before ${partnerName} became the active relationship pressure.`,
        `The dynamic plays as ${matchContext.tropeAlignment} inside ${matchContext.worldContext}.`,
        hasDormFamiliarity
          ? `{{user}} is familiar enough with his space to treat the dorm, bed, hoodies, and mess like shared territory, which makes the scene feel lived-in instead of newly introduced.`
          : `Their history feels lived-in, casual, and hard for ${characterName} to neatly explain away.`,
        hasBlurredPhysicalLine
          ? "Their boundary is already blurred by a private hookup or near-hookup, and neither of them can treat the meaning as harmless anymore."
          : "Their boundary is emotionally charged without pretending {{user}}'s exact desire is already settled.",
        `${partnerName} sees {{user}} as the line ${characterName} keeps crossing, so {{user}}'s presence creates immediate consequence rather than automatic specialness.`,
      ].join(" "),
      facts,
      fitCues: joinNaturalList(fitCueItems),
      matchContext,
      openingAngle: [
        `{{user}} is still in the room after ${partnerName}'s ultimatum lands and ${characterName} pulls back or changes posture around ${objectFor(userFrame)}.`,
        `${toTitleCase(userFrame.pronoun)} is caught between playing it cool, calling out the hypocrisy, protecting ${reflexiveFor(userFrame)}, needling him, and admitting the friendship has stopped being clean.`,
      ].join(" "),
      roleInStory: `${toTitleCase(userFrame.adjective)} long-time friend and unresolved temptation in ${characterName}'s current relationship conflict, built as a distinct {{user}} persona rather than a rewrite of ${characterName}.`,
      selfConcept: [
        `{{user}} sees ${reflexiveFor(userFrame)} as the person who knew ${characterName} before ${partnerName} had a claim on him.`,
        hasDormFamiliarity
          ? `{{user}} is used to being casual in his space: stealing comfort, taking up room, and acting like the mess does not scare ${objectFor(userFrame)} off.`
          : `{{user}} is used to having a place in his life that other people struggle to name.`,
        hasBlurredPhysicalLine
          ? `{{user}} may tell ${reflexiveFor(userFrame)} the physical line between them is casual, but the card pressure suggests that line has consequences now.`
          : `{{user}} may tell ${reflexiveFor(userFrame)} the bond is simple, but the scene pressure asks whether that is still true.`,
      ].join(" "),
      whatUserKnows: [
        `{{user}} knows ${userFrame.possessive} own history with ${characterName}, that ${partnerName} is the current partner pressure, and that ${partnerName} wants distance between them.`,
        hasBlurredPhysicalLine
          ? `{{user}} knows what happened between them privately and knows the caught-on-video moment has made it harder for ${characterName} to pretend nothing happened.`
          : `{{user}} knows how close the friendship looks from the outside and what parts of it ${userFrame.pronoun} has chosen to keep private.`,
        hasThighContact
          ? `{{user}} can know the immediate physical facts of the room: his hand was on ${userFrame.possessive} thigh, then the message changed the air.`
          : "",
        `{{user}} does not automatically know ${characterName}'s private reasoning, what ${partnerName} thinks beyond the visible messages, or what choice ${characterName} will make.`,
      ]
        .filter(Boolean)
        .join(" "),
    };
  }

  return inferGeneralPersonaFit(sourceText, characterName, userFrame, fitCueItems, matchContext, facts);
}

function inferGeneralPersonaFit(
  sourceText: string,
  characterName: string,
  userFrame: UserGenderFrame,
  fitCueItems: string[],
  matchContext: PersonaMatchContext,
  facts: CardPersonaFacts,
) {
  const lower = sourceText.toLowerCase();
  const details: string[] = [];

  if (/\b(friend|friends|bestie|best friend)\b/.test(lower)) {
    details.push("existing friendship history");
  }

  if (/\b(fwb|friends with benefits|hooked up|hooking up|bathroom|suck|slept with|fucking|kissed)\b/.test(lower)) {
    details.push("a blurred private boundary with unresolved meaning");
  }

  if (/\b(girlfriend|boyfriend|partner|pick|stop seeing|jealous)\b/.test(lower)) {
    details.push("relationship conflict around {{user}}'s presence");
  }

  if (/\b(dorm|bed|room|apartment|house|home)\b/.test(lower)) {
    details.push("shared-space familiarity");
  }

  if (!details.length) {
    details.push(`the card's active scenario around ${characterName}`);
  }

  return {
    connectionToCharacter: [
      `{{user}} connects to ${characterName} through ${joinNaturalList(details)}.`,
      `The dynamic plays as ${matchContext.tropeAlignment} inside ${matchContext.worldContext}.`,
      facts.relationshipFacts.length ? facts.relationshipFacts.join(" ") : "",
      `${toTitleCase(userFrame.possessive)} reason to stay close is concrete enough to create pressure without pre-writing the outcome.`,
    ]
      .filter(Boolean)
      .join(" "),
    facts,
    fitCues: joinNaturalList(fitCueItems),
    matchContext,
    openingAngle: [
      `{{user}}'s opening position is an immediate response to ${inferOpeningPressure(sourceText, characterName)}.`,
      formatConcreteOpeningPressure(facts, userFrame, characterName),
    ]
      .filter(Boolean)
      .join(" "),
    roleInStory: facts.summaryFacts.length
      ? `{{user}} is the ${joinNaturalList(facts.summaryFacts)} whose presence makes ${characterName}'s established card pressure playable.`
      : `${toTitleCase(userFrame.adjective)} {{user}} persona built as a distinct romantic counterpart for ${characterName}'s established card, not a rewrite of ${characterName}.`,
    selfConcept: buildConcreteSelfConcept(facts, userFrame, matchContext),
    whatUserKnows: [
      `{{user}} knows ${userFrame.possessive} own history with ${characterName}, what ${userFrame.pronoun} has directly witnessed, and what has been said in front of ${objectFor(userFrame)}.`,
      facts.identityFacts.join(" "),
      facts.relationshipFacts.join(" "),
      facts.worldFacts.join(" "),
      facts.charBeliefFacts.join(" "),
      `{{user}} may suspect more, but does not automatically know ${characterName}'s internal narration or another character's private thoughts.`,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

function buildConcreteSelfConcept(
  facts: CardPersonaFacts,
  userFrame: UserGenderFrame,
  matchContext: PersonaMatchContext,
) {
  if (facts.summaryFacts.length) {
    return [
      `{{user}} understands ${reflexiveFor(userFrame)} as ${joinNaturalList(facts.summaryFacts)}.`,
      facts.isOmega ? "Being omega affects how {{user}} manages attention, scent, safety, bodily autonomy, and social assumptions." : "",
      facts.isUniversityStudent
        ? "University gives {{user}} an independent identity: studies, campus routines, ambitions, peers, and a future that is not owned by the household."
        : "",
      facts.isStepSibling
        ? "The step-sibling bond makes closeness socially dangerous because family language and forbidden attraction keep crossing wires."
        : "",
      facts.isLivingTogether
        ? "Living together makes distance difficult; {{user}} has to share ordinary space with the person who is becoming emotionally difficult to categorize."
        : "",
      facts.charBeliefFacts.length
        ? `The private self-concept is complicated by ${facts.charBeliefFacts.join(" ")}`
        : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  return `{{user}} understands ${reflexiveFor(userFrame)} through the active pressure of ${matchContext.tropeAlignment}: private want, hidden refusal, the cost of staying close, and the boundary being tempted or redrawn on-page.`;
}

function extractCardPersonaFacts(
  sourceText: string,
  characterName: string,
  userFrame: UserGenderFrame,
): CardPersonaFacts {
  const lower = sourceText.toLowerCase();
  const age = extractUserAge(sourceText);
  const isStepSibling = /\bstep[-\s]?(sibling|brother|sister)s?\b|\bstep\s*siblings?\b/.test(lower);
  const isOmega = /\bomega\b/.test(lower);
  const isOmegaverse = /\b(omegaverse|alpha|omega|beta|heat|rut|pack)\b/.test(lower);
  const isLivingTogether = /\b(living together|live together|lives together|same house|same home|same roof|under one roof|under the same roof|shared house|shared home|moved in|moves in|roommates?)\b/.test(
    lower,
  );
  const isUniversityStudent = /\b(university|college|campus|student|lecture|classmate|dorm)\b/.test(lower);
  const hasAgeGap = /\b(age[-\s]?gap|older|younger|protective older brother|older brother figure)\b/.test(lower);
  const hasIndifferentRead = /\b(indifferent|doesn'?t care|does not care|apathetic|unaffected)\b/.test(lower);
  const hasProtectiveOlderBrotherRead = /\b(protective older brother|older brother figure|brother figure)\b/.test(lower);
  const ageLabel = age ? `${age}-year-old` : userFrame.ageLabel;
  const identityFacts = [
    age ? `{{user}} is ${age} years old.` : "",
    isOmega ? `{{user}} is an omega, so body, status, scent, heat logic, and social expectation can matter in the omegaverse.` : "",
    isUniversityStudent ? `{{user}} is a university student with classes, campus routines, peers, deadlines, and a life outside the house.` : "",
  ].filter(Boolean);
  const relationshipFacts = [
    isStepSibling
      ? `{{user}} is ${characterName}'s step-sibling, making the attraction forbidden through family proximity, household history, and social consequence.`
      : "",
    isLivingTogether
      ? `{{user}} and ${characterName} live together or share a home, so privacy, accidental proximity, routines, overheard moments, and domestic boundaries are active pressure.`
      : "",
    hasAgeGap
      ? `An age-gap or older-protector dynamic shapes the imbalance: ${characterName} can be read as older, protective, or brother-like without making {{user}} passive.`
      : "",
  ].filter(Boolean);
  const worldFacts = [
    isOmegaverse
      ? "The world is omegaverse, so rank, scent, instinct, biology, household rules, and social stigma can shape attraction and conflict."
      : "",
  ].filter(Boolean);
  const settingFacts = [
    isUniversityStudent ? "University life gives {{user}} independent obligations, friends, schedule pressure, and reasons to leave the domestic bubble." : "",
    isLivingTogether ? "Living together turns ordinary spaces into scene anchors: kitchen, hallway, bedroom door, laundry, late-night noise, and shared routines." : "",
  ].filter(Boolean);
  const charBeliefFacts = [
    hasIndifferentRead
      ? `${characterName} believes {{user}} reads him as indifferent, detached, or emotionally unavailable, which gives him something to misread and overcorrect.`
      : "",
    hasProtectiveOlderBrotherRead
      ? `${characterName} believes {{user}} may see him as a protective older-brother figure, making desire feel harder to name and easier to disguise as care.`
      : "",
  ].filter(Boolean);
  const summaryFacts = [
    age ? `${ageLabel} ${userFrame.genderLabel}` : "",
    isOmega ? "omega" : "",
    isUniversityStudent ? "university student" : "",
    isStepSibling ? "step-sibling" : "",
    isLivingTogether ? `living with ${characterName}` : "",
    isOmegaverse ? "omegaverse" : "",
    hasAgeGap ? "age-gap/older-protector pressure" : "",
    hasIndifferentRead ? `${characterName} thinks {{user}} sees him as indifferent` : "",
    hasProtectiveOlderBrotherRead ? `${characterName} thinks {{user}} sees him as protective/brother-like` : "",
  ].filter(Boolean);

  return {
    age,
    charBeliefFacts,
    hasAgeGap,
    identityFacts,
    isLivingTogether,
    isOmega,
    isOmegaverse,
    isStepSibling,
    isUniversityStudent,
    relationshipFacts,
    settingFacts,
    summaryFacts,
    worldFacts,
  };
}

function extractUserAge(sourceText: string) {
  const patterns = [
    /\{\{user\}\}[^.!?]{0,80}\b(?:is|age|aged|around)?\s*(1[89]|[2-3]\d)\b/i,
    /\b(?:she|her|woman|girl|omega)\b[^.!?]{0,80}\b(?:is|age|aged|around)?\s*(1[89]|[2-3]\d)\b/i,
    /\b(1[89]|[2-3]\d)[-\s]*(?:year[-\s]?old|yo)\b[^.!?]{0,80}\b(?:\{\{user\}\}|she|her|woman|girl|omega)\b/i,
    /\b(?:\{\{user\}\}|she|her|woman|girl|omega)\b[^.!?]{0,80}\b(1[89]|[2-3]\d)[-\s]*(?:year[-\s]?old|yo)\b/i,
  ];

  for (const pattern of patterns) {
    const match = sourceText.match(pattern);
    if (match?.[1]) return match[1];
  }

  return undefined;
}

function formatConcreteOpeningPressure(facts: CardPersonaFacts, userFrame: UserGenderFrame, characterName: string) {
  if (facts.summaryFacts.length) {
    return `At the start of play, {{user}} is positioned as ${joinNaturalList(facts.summaryFacts)}. ${formatCharBeliefSentence(
      facts,
      characterName,
    )}`.trim();
  }

  return `${toTitleCase(userFrame.pronoun)} begins with a concrete stake, a private reason to stay close, and a boundary already under pressure.`;
}

function formatCharBeliefSentence(facts: CardPersonaFacts, characterName: string) {
  if (!facts.charBeliefFacts.length) return "";
  return `${characterName}'s read of {{user}} matters: ${facts.charBeliefFacts.join(" ")}`;
}

function inferOpeningPressure(sourceText: string, characterName: string) {
  const lower = sourceText.toLowerCase();

  if (/\b(vanessa|girlfriend|boyfriend|partner)\b/.test(lower) && /\b(pick|choose|stop seeing|stop bein'? friends|stop being friends)\b/.test(lower)) {
    return "the partner ultimatum about {{user}}'s place in the relationship";
  }

  if (/\b(video|filmed|caught|bathroom)\b/.test(lower)) {
    return "the fallout from being caught in a compromising moment";
  }

  if (/\b(secret|lie|hiding|pretending)\b/.test(lower)) {
    return "a secret or lie beginning to press against the scene";
  }

  if (/\b(argument|fight|confront)\b/.test(lower)) {
    return "the card's immediate confrontation";
  }

  return `${characterName}'s opening scenario without inheriting ${characterName}'s narration or choices`;
}

function inferFitCueItems(sourceText: string, userFrame: UserGenderFrame) {
  const cues: string[] = [];

  cues.push(`${userFrame.adjective} {{user}} framing`);

  if (/\b(friend|friends|best friend)\b/.test(sourceText)) cues.push("friendship history");
  if (/\b(vanessa|girlfriend|boyfriend|partner)\b/.test(sourceText)) cues.push("partner jealousy or triangle pressure");
  if (/\b(fwb|bathroom|hooked up|suck|fucking|slept with)\b/.test(sourceText)) {
    cues.push("blurred sexual or romantic boundaries");
  }
  if (/\b(dorm|room|bed|apartment|hoodie|hoodies)\b/.test(sourceText)) cues.push("shared-space intimacy");

  return cues;
}

function findSignals(sourceText: string, patterns: [RegExp, string][]) {
  return patterns.flatMap(([pattern, label]) => (pattern.test(sourceText) ? [label] : []));
}

function unique(items: string[]) {
  return [...new Set(items)];
}

function inferPartnerPressureName(sourceText: string) {
  const namedSpeaker = sourceText.match(/\b([A-Z][a-z]+):\s*(?:.*?\b(?:pick|stop seeing|stop bein'? friends|stop being friends|girlfriend|boyfriend|partner)\b)/);
  if (namedSpeaker?.[1]) return namedSpeaker[1];

  const namedPressure = sourceText.match(/\b([A-Z][a-z]+)\b(?=[^.]{0,80}\b(?:girlfriend|boyfriend|partner|wants|told you|pick|stop seeing)\b)/);
  if (namedPressure?.[1] && namedPressure[1] !== sourceText.match(/^([A-Z][a-z]+)/)?.[1]) {
    return namedPressure[1];
  }

  if (/\bvanessa\b/i.test(sourceText)) return "Vanessa";

  return "the partner";
}

function buildAppearancePresentation(
  characterName: string,
  userFrame: UserGenderFrame,
  personaFit: ReturnType<typeof inferPersonaFit>,
) {
  const identityLine = personaFit.facts.identityFacts.length
    ? personaFit.facts.identityFacts.join(" ")
    : `{{user}} is an ${userFrame.ageLabel} ${userFrame.genderLabel} whose presentation contrasts with ${characterName} without feeling engineered for him.`;

  return [
    identityLine,
    personaFit.facts.worldFacts.join(" "),
    `Memorable but editable physical anchors include expressive eyes, a style that signals independence, one distinguishing feature, and a scent or mannerism that can become scene memory.`,
    `The appearance supports ${personaFit.fitCues}: confident enough to create friction, human enough to carry insecurity, and specific enough for romantic roleplay while leaving exact beauty details editable.`,
    `Private vulnerability can sit in small tells: fussing with sleeves, going still when noticed, laughing too sharply, or dressing like ${userFrame.pronoun} is less affected than ${userFrame.pronoun} is.`,
  ]
    .filter(Boolean)
    .join(" ");
}

function buildTropeRelationshipWorldContext(
  characterName: string,
  matchContext: PersonaMatchContext,
  facts: CardPersonaFacts,
) {
  return [
    `Trope alignment: ${matchContext.tropeAlignment}.`,
    `Relationship dynamic: ${matchContext.relationshipDynamic}.`,
    `World/setting logic: ${matchContext.worldContext}.`,
    facts.summaryFacts.length ? `Card-derived user facts: ${facts.summaryFacts.join(", ")}.` : "",
    facts.relationshipFacts.join(" "),
    facts.settingFacts.join(" "),
    facts.charBeliefFacts.join(" "),
    `Primary conflict driver: ${matchContext.conflictDriver}.`,
    `{{user}} is a romantic counterweight to ${characterName}: not automatically perfect for him, but shaped so the active trope, relationship pressure, and world rules generate friction, choice, consequence, and eventual earned compatibility.`,
  ]
    .filter(Boolean)
    .join(" ");
}

function buildRelationalBackstory(
  characterName: string,
  userFrame: UserGenderFrame,
  personaFit: ReturnType<typeof inferPersonaFit>,
) {
  return [
    `{{user}}'s backstory gives ${objectFor(userFrame)} a reason to recognize both the best and worst parts of ${characterName}.`,
    `The backstory belongs inside the world container: ${personaFit.matchContext.worldContext}.`,
    personaFit.facts.identityFacts.join(" "),
    personaFit.facts.relationshipFacts.join(" "),
    personaFit.facts.settingFacts.join(" "),
    `${toTitleCase(userFrame.pronoun)} learned early that closeness can become leverage, so ${userFrame.pronoun} tends to watch for changes in tone, loyalty, and who gets chosen in public.`,
    `A past romantic disappointment left ${objectFor(userFrame)} wary of being someone's convenient almost, secret, fallback, or emotional shelter.`,
    `The useful secret pressure is personal and playable: why ${userFrame.pronoun} stayed close, what ${userFrame.pronoun} pretended did not hurt, and what line ${userFrame.pronoun} swore ${userFrame.pronoun} would not cross again.`,
    personaFit.connectionToCharacter,
  ]
    .filter(Boolean)
    .join(" ");
}

function buildPsychologyInternalConflict(
  characterName: string,
  userFrame: UserGenderFrame,
  personaFit: ReturnType<typeof inferPersonaFit>,
) {
  return [
    `Temperament: observant, guardedly affectionate, stubborn under pressure, and quicker to joke or challenge than admit need.`,
    personaFit.facts.charBeliefFacts.length
      ? `Pressure from ${characterName}'s misread: ${personaFit.facts.charBeliefFacts.join(" ")}`
      : "",
    `Core wound: {{user}} fears becoming emotionally optional to ${characterName}, even when ${userFrame.pronoun} acts like ${userFrame.pronoun} can take or leave the situation.`,
    `Coping pattern: ${userFrame.pronoun} hides vulnerability behind competence, banter, controlled distance, or a dare for ${characterName} to be honest first.`,
    `Moral code: {{user}} can want the messy thing without wanting to be cruel; ${userFrame.pronoun} will not knowingly erase ${userFrame.possessive} own dignity just to be chosen.`,
    `Blind spot: ${userFrame.pronoun} may mistake emotional self-protection for clarity, or treat jealousy as proof ${userFrame.pronoun} still has leverage.`,
    `Matched conflict: ${personaFit.fitCues} and ${personaFit.matchContext.conflictDriver} pressure both characters toward honesty without making love feel automatic.`,
  ]
    .filter(Boolean)
    .join(" ");
}

function buildRomanticIntimateDynamics(
  characterName: string,
  userFrame: UserGenderFrame,
  personaFit: ReturnType<typeof inferPersonaFit>,
) {
  return [
    `Romantic orientation and relationship style remain editable; the default frame makes {{user}} open to adult romantic and sexual tension with ${characterName} when the story earns it.`,
    personaFit.facts.isOmegaverse
      ? "Omegaverse intimacy carries biological, social, and scent/status pressure; desire is shaped by world rules rather than generic chemistry."
      : "",
    personaFit.facts.hasAgeGap
      ? "The age-gap or older-protector layer makes attraction feel charged by care, restraint, imbalance, and the risk of being mistaken for dependence."
      : "",
    `Attachment style: wary but intensely loyal once trust is proven; ${userFrame.pronoun} wants consistency, not performance.`,
    `Love languages: acts of practical loyalty, sharp private attention, remembered details, and physical closeness that feels chosen rather than claimed by default.`,
    `Power dynamic: responsive and self-possessed. {{user}} can be assertive, teasing, nurturing, guarded, or selectively submissive depending on the scene, but never becomes passive furniture for ${characterName}'s arc.`,
    `Attraction triggers: competence under stress, honesty that costs something, protectiveness without ownership, and ${characterName} noticing what ${userFrame.pronoun} tries to hide.`,
    `Jealousy and growth triggers come from ${personaFit.matchContext.relationshipDynamic}, not generic possessiveness.`,
  ]
    .filter(Boolean)
    .join(" ");
}

function buildCompatibilityArchitecture(
  characterName: string,
  userFrame: UserGenderFrame,
  personaFit: ReturnType<typeof inferPersonaFit>,
) {
  return [
    `Compatibility summary: {{user}} is useful for ${characterName}'s story because ${userFrame.pronoun} fills the missing dynamic space around ${personaFit.matchContext.conflictDriver}.`,
    personaFit.facts.relationshipFacts.join(" "),
    personaFit.facts.charBeliefFacts.join(" "),
    `Enduring compatibility: shared history or pressure that keeps them in orbit; mutual recognition under stress; chemistry that sharpens through banter, competence, and privately noticed tenderness.`,
    `Enduring conflict: different coping styles, public versus private loyalty, and the cost of admitting the relationship matters inside ${personaFit.matchContext.worldContext}.`,
    `Emotional complementarity: if ${characterName} controls, deflects, or withholds, {{user}} does not simply soothe him; ${userFrame.pronoun} pressures him toward choice while protecting ${userFrame.possessive} own dignity.`,
    `What {{user}} thinks ${userFrame.pronoun} wants: clarity, leverage, and not being made foolish.`,
    `What {{user}} actually needs: proof that being wanted does not require shrinking, waiting silently, or becoming a secret convenience.`,
    `The dynamic creates scenes through values, wounds, responsibilities, communication styles, and life circumstances, not avoidable misunderstandings alone.`,
  ]
    .filter(Boolean)
    .join(" ");
}

function buildInteractionStyle(
  characterName: string,
  userFrame: UserGenderFrame,
  personaFit: ReturnType<typeof inferPersonaFit>,
) {
  return [
    `Flirtation style: controlled, observant, and a little dangerous when cornered; {{user}} tests whether ${characterName} will tell the truth or take the easy exit.`,
    personaFit.facts.isUniversityStudent
      ? "{{user}}'s day-to-day interaction is shaped by university obligations: classes, study stress, campus friends, deadlines, and the need for a life beyond the house."
      : "",
    personaFit.facts.isLivingTogether
      ? "Living together makes interaction domestic and unavoidable: breakfast tension, hallway near-misses, overheard calls, shared chores, and silence through thin walls."
      : "",
    `Communication style: banter first, sincerity when pushed, silence when hurt, and precise questions when ${userFrame.pronoun} wants to make ${characterName} choose his words carefully.`,
    `In groups, {{user}} can look composed and socially capable; one-on-one, the history has more room to show through small provocations, withheld softness, and unfinished sentences.`,
    `Conflict approach: ${userFrame.pronoun} may confront if the hypocrisy is obvious, withdraw if dignity feels threatened, or turn playful when direct vulnerability feels too costly.`,
    `The interaction keeps ${personaFit.matchContext.tropeAlignment} and ${personaFit.matchContext.relationshipDynamic} active through observable behavior, not prewritten choices.`,
  ]
    .filter(Boolean)
    .join(" ");
}

function buildSceneOpportunities(
  characterName: string,
  userFrame: UserGenderFrame,
  personaFit: ReturnType<typeof inferPersonaFit>,
) {
  const context = personaFit.matchContext;

  return [
    `1. A private aftermath scene where {{user}} and ${characterName} disagree about what the last moment meant.`,
    `2. A public setting in ${context.worldContext} where their chemistry becomes visible to someone with stakes in the conflict.`,
    `3. A practical obligation forces them to cooperate while neither can safely name the romantic pressure.`,
    `4. ${toTitleCase(userFrame.pronoun)} catches ${characterName} choosing the easy lie and decides whether to challenge it.`,
    `5. A jealousy beat exposes ${context.relationshipDynamic} without granting either character a clean moral high ground.`,
    `6. A quiet competence scene lets attraction grow through trust rather than appearance alone.`,
    `7. A boundary scene where {{user}} refuses to be treated like a prop in ${characterName}'s conflict.`,
    `8. A vulnerability hangover where intimacy changes behavior the next day instead of resetting the dynamic.`,
    `9. A world-pressure interruption makes the romance cost something specific to ${context.worldContext}.`,
    `10. A turning-point scene where ${characterName} must act differently, not just explain himself better.`,
  ].join("\n");
}

function buildNarrativeArc(
  characterName: string,
  userFrame: UserGenderFrame,
  personaFit: ReturnType<typeof inferPersonaFit>,
) {
  return [
    `Initial mismatch: {{user}} and ${characterName} want closeness but disagree on what it costs, who has the right to ask for it, and what must be risked publicly.`,
    `Trope/world engine: ${personaFit.matchContext.tropeAlignment} in ${personaFit.matchContext.worldContext}.`,
    `Tension source: ${personaFit.connectionToCharacter}`,
    `Progression: conflict moves through testing, misread signals, visible loyalty, uncomfortable truth, chosen vulnerability, and earned trust.`,
    `Key vulnerability beats can include {{user}} admitting what ${userFrame.pronoun} has been pretending not to want, ${characterName} proving honesty through action, and both characters facing a cost instead of hiding in chemistry.`,
    `Romantic payoff: love feels believable when ${userFrame.pronoun} is not simply chosen, but understood; when ${characterName} wants {{user}} with consequence attached; and when {{user}} gets to choose back without being narrated into it.`,
  ].join(" ");
}

function buildVoiceDialogue(
  characterName: string,
  userFrame: UserGenderFrame,
  personaFit: ReturnType<typeof inferPersonaFit>,
) {
  return [
    `Voice: dry when defensive, warm when trust slips through, direct when ${userFrame.pronoun} refuses to be handled, and quieter when the truth matters too much.`,
    `Vocabulary feels modern, character-specific, and emotionally economical: less speechifying, more lines that reveal what {{user}} will not admit outright.`,
    `Tension line: "Careful. You only get to call this nothing if you stop acting like it costs you something."`,
    `Curiosity line: "Is that what you want, or just the answer that makes the least mess?"`,
    `Jealousy line: "I'm not jealous. I just hate watching you lie badly."`,
    `Vulnerability line: "I know exactly where I stand. That's the problem."`,
    `Confession line: "I didn't mean to become the person I looked for in every room. I just did."`,
    `Dialogue style stays adaptable; these examples show voice, pressure, and emotional angle without forcing {{user}}'s exact lines in play. The match target is ${characterName}, and the active pressure is ${personaFit.fitCues}.`,
  ].join("\n");
}

function joinNaturalList(items: string[]) {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function toTitleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function reflexiveFor(frame: UserGenderFrame) {
  if (frame.pronoun === "she") return "herself";
  if (frame.pronoun === "he") return "himself";
  return "themself";
}

function objectFor(frame: UserGenderFrame) {
  if (frame.pronoun === "she") return "her";
  if (frame.pronoun === "he") return "him";
  return "them";
}
