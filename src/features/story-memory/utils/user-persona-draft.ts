import type { UserPersonaDraft, UserPersonaGender } from "@/features/story-memory/types/user-persona";
import { compactSentence, type LoadedCharacterCard } from "@/features/story-memory/utils/character-card-parser";

type UserGenderFrame = {
  adjective: Exclude<UserPersonaGender, "infer">;
  possessive: "her" | "his" | "their";
  pronoun: "she" | "he" | "they";
};

export function buildUserPersonaDraftFromCard(
  card: LoadedCharacterCard,
  personaGender: UserPersonaGender = "female",
): UserPersonaDraft {
  const characterName = card.name ?? "{{char}}";
  const sourceText = getCardSourceText(card);
  const userFrame = getUserGenderFrame(personaGender, sourceText);
  const personaFit = inferPersonaFit(sourceText, characterName, userFrame);

  return {
    boundaries: [
      "Do not write {{user}}'s thoughts, dialogue, consent, or choices.",
      "Do not copy the character card into the persona; use the card only as context around {{char}} and the setup.",
      "{{user}} should have their own motives, history, boundaries, and secrets for the player to fill in or revise.",
      "{{user}} should reveal personal history through play, not through omniscient preload.",
      `Keep ${characterName}'s established autonomy intact.`,
    ].join("\n"),
    cardFitNotes: [
      `${characterName}'s card controls {{char}}'s voice, motives, memories, scenario pressure, and opening narration.`,
      `Detected persona fit: ${personaFit.fitCues}.`,
      card.description
        ? `Card definition to fit around: ${compactSentence(card.description, "character definition and behavior")}`
        : "",
      card.personality ? `Personality pressure to fit around: ${compactSentence(card.personality, "card personality")}` : "",
      card.tags.length ? `Relevant card tags: ${card.tags.join(", ")}.` : "No card tags were imported.",
      "Keep the generated persona concise: summarize only what {{user}} can plausibly know, want, hide, or choose.",
    ]
      .filter(Boolean)
      .join("\n"),
    connectionToCharacter: personaFit.connectionToCharacter,
    displayName: "{{user}}",
    openingAngle: personaFit.openingAngle,
    roleInStory: personaFit.roleInStory,
    selfConcept: personaFit.selfConcept,
    whatUserKnows: personaFit.whatUserKnows,
  };
}

function getCardSourceText(card: LoadedCharacterCard) {
  return [
    card.description,
    card.personality,
    card.scenario,
    card.firstMessage,
    ...card.alternateGreetings,
    card.exampleDialog,
    card.creatorNotes,
  ]
    .filter(Boolean)
    .join("\n")
    .replace(/\s+/g, " ")
    .trim();
}

function getUserGenderFrame(personaGender: UserPersonaGender, sourceText: string): UserGenderFrame {
  if (personaGender === "female") return { adjective: "female", possessive: "her", pronoun: "she" };
  if (personaGender === "male") return { adjective: "male", possessive: "his", pronoun: "he" };
  if (personaGender === "neutral") return { adjective: "neutral", possessive: "their", pronoun: "they" };

  return inferUserGenderFrame(sourceText);
}

function inferUserGenderFrame(sourceText: string): UserGenderFrame {
  if (hasNearUser(sourceText, /\b(she|her|hers|girl|woman|female)\b/i)) {
    return { adjective: "female", possessive: "her", pronoun: "she" };
  }

  if (hasNearUser(sourceText, /\b(he|him|his|boy|man|male)\b/i)) {
    return { adjective: "male", possessive: "his", pronoun: "he" };
  }

  return { adjective: "neutral", possessive: "their", pronoun: "they" };
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

function inferPersonaFit(sourceText: string, characterName: string, userFrame: UserGenderFrame) {
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
        hasDormFamiliarity
          ? `{{user}} is familiar enough with his space to treat the dorm, bed, hoodies, and mess like shared territory, which makes the scene feel lived-in instead of newly introduced.`
          : `Their history should feel lived-in, casual, and hard for ${characterName} to neatly explain away.`,
        hasBlurredPhysicalLine
          ? `Their boundary is already blurred by a private hookup or near-hookup, but the persona should leave what it meant to {{user}} open for the player.`
          : "Their boundary can be emotionally charged without deciding the player's exact desire up front.",
        `${partnerName} sees {{user}} as the line ${characterName} keeps crossing, so {{user}}'s presence creates immediate consequence rather than automatic specialness.`,
      ].join(" "),
      fitCues: joinNaturalList(fitCueItems),
      openingAngle: [
        `Begin with {{user}} still in the room after ${partnerName}'s ultimatum lands and ${characterName} pulls back or changes posture around ${objectFor(userFrame)}.`,
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

  return inferGeneralPersonaFit(sourceText, characterName, userFrame, fitCueItems);
}

function inferGeneralPersonaFit(
  sourceText: string,
  characterName: string,
  userFrame: UserGenderFrame,
  fitCueItems: string[],
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
    connectionToCharacter: `{{user}} connects to ${characterName} through ${joinNaturalList(details)}. The persona should make ${userFrame.possessive} reason to stay, leave, confront, or hide something specific enough for play, while keeping the player's choices open.`,
    fitCues: joinNaturalList(fitCueItems),
    openingAngle: `Start from {{user}}'s immediate response to ${inferOpeningPressure(sourceText, characterName)}. Give the player room to choose whether ${userFrame.pronoun} deflects, confronts, flirts, withdraws, or sets a boundary.`,
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
