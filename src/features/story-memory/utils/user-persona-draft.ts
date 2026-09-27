import type { UserPersonaDraft, UserPersonaGender } from "@/features/story-memory/types/user-persona";
import type {
  Character,
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

export type UserPersonaGenerationContext = {
  activeRelationship?: RelationshipThread;
  activeScene?: SceneMemory;
  activeSecret?: SecretOrReveal;
  characters?: Character[];
  selectedTagLabels?: string[];
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
  const contextNotes = buildGenerationContextNotes(generationContext);

  return {
    appearancePresentation: buildAppearancePresentation(characterName, userFrame, personaFit),
    boundaries: [
      "{{user}}'s thoughts, dialogue, consent, and choices remain player-controlled.",
      "The character card stays source context for {{char}} and the setup, not content to copy into {{user}}.",
      "{{user}} has their own motives, history, boundaries, and secrets for the player to fill in or revise.",
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
      ...contextNotes,
      "{{user}} fills the missing emotional, thematic, moral, social, professional, ideological, or structural gap in the existing card dynamic.",
      "The persona keeps to what {{user}} can plausibly know, want, hide, or choose.",
    ]
      .filter(Boolean)
      .join("\n"),
    compatibilityArchitecture: buildCompatibilityArchitecture(characterName, userFrame, personaFit),
    connectionToCharacter: personaFit.connectionToCharacter,
    displayName: "{{user}}",
    interactionStyle: buildInteractionStyle(characterName, userFrame, personaFit),
    narrativeArc: buildNarrativeArc(characterName, userFrame, personaFit),
    openingAngle: personaFit.openingAngle,
    psychologyInternalConflict: buildPsychologyInternalConflict(characterName, userFrame, personaFit),
    relationalBackstory: buildRelationalBackstory(characterName, userFrame, personaFit),
    romanticIntimateDynamics: buildRomanticIntimateDynamics(characterName, userFrame, personaFit),
    roleInStory: personaFit.roleInStory,
    sceneOpportunities: buildSceneOpportunities(characterName, userFrame, personaFit),
    selfConcept: personaFit.selfConcept,
    tropeRelationshipWorldContext: buildTropeRelationshipWorldContext(characterName, matchContext),
    voiceDialogue: buildVoiceDialogue(characterName, userFrame, personaFit),
    whatUserKnows: personaFit.whatUserKnows,
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
          ? `Their boundary is already blurred by a private hookup or near-hookup, with the meaning left open for the player.`
          : "Their boundary can be emotionally charged without deciding the player's exact desire up front.",
        `${partnerName} sees {{user}} as the line ${characterName} keeps crossing, so {{user}}'s presence creates immediate consequence rather than automatic specialness.`,
      ].join(" "),
      fitCues: joinNaturalList(fitCueItems),
      matchContext,
      openingAngle: [
        `{{user}} is still in the room after ${partnerName}'s ultimatum lands and ${characterName} pulls back or changes posture around ${objectFor(userFrame)}.`,
        `The player can decide whether ${userFrame.pronoun} plays it cool, calls out the hypocrisy, protects ${reflexiveFor(userFrame)}, needles him, or admits the friendship has stopped being clean.`,
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

  return inferGeneralPersonaFit(sourceText, characterName, userFrame, fitCueItems, matchContext);
}

function inferGeneralPersonaFit(
  sourceText: string,
  characterName: string,
  userFrame: UserGenderFrame,
  fitCueItems: string[],
  matchContext: PersonaMatchContext,
) {
  const lower = sourceText.toLowerCase();
  const details: string[] = [];

  if (/\b(friend|friends|bestie|best friend)\b/.test(lower)) {
    details.push("existing friendship history");
  }

  if (/\b(fwb|friends with benefits|hooked up|hooking up|bathroom|suck|slept with|fucking|kissed)\b/.test(lower)) {
    details.push("a blurred private boundary the player can define");
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
    connectionToCharacter: `{{user}} connects to ${characterName} through ${joinNaturalList(details)}. The dynamic plays as ${matchContext.tropeAlignment} inside ${matchContext.worldContext}. ${toTitleCase(userFrame.possessive)} reason to stay, leave, confront, or hide something is specific enough for play while still leaving the player's choices open.`,
    fitCues: joinNaturalList(fitCueItems),
    matchContext,
    openingAngle: `{{user}}'s opening position is an immediate response to ${inferOpeningPressure(sourceText, characterName)}. The player has room to choose whether ${userFrame.pronoun} deflects, confronts, flirts, withdraws, or sets a boundary.`,
    roleInStory: `${toTitleCase(userFrame.adjective)} user player built as a distinct persona for ${characterName}'s established card, not a rewrite of ${characterName}.`,
    selfConcept: `{{user}} sees ${reflexiveFor(userFrame)} as ${possessiveArticle(userFrame)} own person in ${characterName}'s life: someone with a private want, a defensible reason to stay close, and at least one line ${userFrame.pronoun} tells ${reflexiveFor(userFrame)} not to cross.`,
    whatUserKnows: `{{user}} knows ${userFrame.possessive} own history with ${characterName}, what ${userFrame.pronoun} has directly witnessed, and what has been said in front of ${objectFor(userFrame)}. {{user}} may suspect more, but does not automatically know ${characterName}'s internal narration or another character's private thoughts.`,
  };
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
  return [
    `{{user}} is an ${userFrame.ageLabel} ${userFrame.genderLabel} whose presentation contrasts with ${characterName} without feeling engineered for him.`,
    `Memorable but editable physical anchors include expressive eyes, a style that signals independence, one distinguishing feature, and a scent or mannerism that can become scene memory.`,
    `The appearance supports ${personaFit.fitCues}: confident enough to create friction, human enough to carry insecurity, and specific enough for romantic roleplay without deciding how attractive {{user}} feels to the player.`,
    `Private vulnerability can sit in small tells: fussing with sleeves, going still when noticed, laughing too sharply, or dressing like ${userFrame.pronoun} is less affected than ${userFrame.pronoun} is.`,
  ].join(" ");
}

function buildTropeRelationshipWorldContext(characterName: string, matchContext: PersonaMatchContext) {
  return [
    `Trope alignment: ${matchContext.tropeAlignment}.`,
    `Relationship dynamic: ${matchContext.relationshipDynamic}.`,
    `World/setting logic: ${matchContext.worldContext}.`,
    `Primary conflict driver: ${matchContext.conflictDriver}.`,
    `{{user}} is a romantic counterweight to ${characterName}: not automatically perfect for him, but shaped so the active trope, relationship pressure, and world rules generate friction, choice, consequence, and eventual earned compatibility.`,
  ].join(" ");
}

function buildRelationalBackstory(
  characterName: string,
  userFrame: UserGenderFrame,
  personaFit: ReturnType<typeof inferPersonaFit>,
) {
  return [
    `{{user}}'s backstory gives ${objectFor(userFrame)} a reason to recognize both the best and worst parts of ${characterName}.`,
    `The backstory belongs inside the world container: ${personaFit.matchContext.worldContext}.`,
    `${toTitleCase(userFrame.pronoun)} learned early that closeness can become leverage, so ${userFrame.pronoun} tends to watch for changes in tone, loyalty, and who gets chosen in public.`,
    `A past romantic disappointment left ${objectFor(userFrame)} wary of being someone's convenient almost, secret, fallback, or emotional shelter.`,
    `The useful secret is not a solved tragedy; it is pressure the player can reveal later: why ${userFrame.pronoun} stayed close, what ${userFrame.pronoun} pretended did not hurt, and what line ${userFrame.pronoun} swore ${userFrame.pronoun} would not cross again.`,
    personaFit.connectionToCharacter,
  ].join(" ");
}

function buildPsychologyInternalConflict(
  characterName: string,
  userFrame: UserGenderFrame,
  personaFit: ReturnType<typeof inferPersonaFit>,
) {
  return [
    `Temperament: observant, guardedly affectionate, stubborn under pressure, and quicker to joke or challenge than admit need.`,
    `Core wound: {{user}} fears becoming emotionally optional to ${characterName}, even when ${userFrame.pronoun} acts like ${userFrame.pronoun} can take or leave the situation.`,
    `Coping pattern: ${userFrame.pronoun} hides vulnerability behind competence, banter, controlled distance, or a dare for ${characterName} to be honest first.`,
    `Moral code: {{user}} can want the messy thing without wanting to be cruel; ${userFrame.pronoun} will not knowingly erase ${userFrame.possessive} own dignity just to be chosen.`,
    `Blind spot: ${userFrame.pronoun} may mistake emotional self-protection for clarity, or treat jealousy as proof ${userFrame.pronoun} still has leverage.`,
    `Matched conflict: ${personaFit.fitCues} and ${personaFit.matchContext.conflictDriver} pressure both characters toward honesty without making love feel automatic.`,
  ].join(" ");
}

function buildRomanticIntimateDynamics(
  characterName: string,
  userFrame: UserGenderFrame,
  personaFit: ReturnType<typeof inferPersonaFit>,
) {
  return [
    `Romantic orientation and relationship style are player-editable; the generated default frames {{user}} as open to adult romantic and sexual tension with ${characterName} when the story earns it.`,
    `Attachment style: wary but intensely loyal once trust is proven; ${userFrame.pronoun} wants consistency, not performance.`,
    `Love languages: acts of practical loyalty, sharp private attention, remembered details, and physical closeness that feels chosen rather than claimed by default.`,
    `Power dynamic: responsive and self-possessed. {{user}} can be assertive, teasing, nurturing, guarded, or selectively submissive depending on the scene, but never becomes passive furniture for ${characterName}'s arc.`,
    `Attraction triggers: competence under stress, honesty that costs something, protectiveness without ownership, and ${characterName} noticing what ${userFrame.pronoun} tries to hide.`,
    `Jealousy and growth triggers come from ${personaFit.matchContext.relationshipDynamic}, not generic possessiveness.`,
  ].join(" ");
}

function buildCompatibilityArchitecture(
  characterName: string,
  userFrame: UserGenderFrame,
  personaFit: ReturnType<typeof inferPersonaFit>,
) {
  return [
    `Compatibility summary: {{user}} is useful for ${characterName}'s story because ${userFrame.pronoun} fills the missing dynamic space around ${personaFit.matchContext.conflictDriver}.`,
    `Enduring compatibility: shared history or pressure that keeps them in orbit; mutual recognition under stress; chemistry that sharpens through banter, competence, and privately noticed tenderness.`,
    `Enduring conflict: different coping styles, public versus private loyalty, and the cost of admitting the relationship matters inside ${personaFit.matchContext.worldContext}.`,
    `Emotional complementarity: if ${characterName} controls, deflects, or withholds, {{user}} does not simply soothe him; ${userFrame.pronoun} pressures him toward choice while protecting ${userFrame.possessive} own dignity.`,
    `What {{user}} thinks ${userFrame.pronoun} wants: clarity, leverage, and not being made foolish.`,
    `What {{user}} actually needs: proof that being wanted does not require shrinking, waiting silently, or becoming a secret convenience.`,
    `The dynamic creates scenes through values, wounds, responsibilities, communication styles, and life circumstances, not avoidable misunderstandings alone.`,
  ].join(" ");
}

function buildInteractionStyle(
  characterName: string,
  userFrame: UserGenderFrame,
  personaFit: ReturnType<typeof inferPersonaFit>,
) {
  return [
    `Flirtation style: controlled, observant, and a little dangerous when cornered; {{user}} tests whether ${characterName} will tell the truth or take the easy exit.`,
    `Communication style: banter first, sincerity when pushed, silence when hurt, and precise questions when ${userFrame.pronoun} wants to make ${characterName} choose his words carefully.`,
    `In groups, {{user}} can look composed and socially capable; one-on-one, the history has more room to show through small provocations, withheld softness, and unfinished sentences.`,
    `Conflict approach: ${userFrame.pronoun} may confront if the hypocrisy is obvious, withdraw if dignity feels threatened, or turn playful when direct vulnerability feels too costly.`,
    `The interaction keeps ${personaFit.matchContext.tropeAlignment} and ${personaFit.matchContext.relationshipDynamic} active while leaving the player room to decide each move.`,
  ].join(" ");
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
    `These lines are player-facing examples to adapt; they do not force {{user}}'s exact dialogue in play. The match target is ${characterName}, and the active pressure is ${personaFit.fitCues}.`,
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

function possessiveArticle(frame: UserGenderFrame) {
  if (frame.pronoun === "they") return "their";
  return `${frame.possessive}`;
}
