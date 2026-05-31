import type { CharacterCardV3 } from "@/types/character-card/CharacterCardV3";
import type {
  GroupChatRoom,
  SpeakerTurnPayload,
} from "@/types/character-card/GroupChat";

export class GroupChatRouter {
  public static determineNextSpeaker(
    room: GroupChatRoom,
    roster: readonly CharacterCardV3[],
    manualOverrideId?: string,
  ): CharacterCardV3 | null {
    const activeRoster = filterActiveRoster(room, roster);

    if (activeRoster.length === 0) {
      return null;
    }

    if (manualOverrideId) {
      const selected = activeRoster.find((card) =>
        doesCardMatchId(card, manualOverrideId),
      );

      if (selected) {
        return selected;
      }
    }

    if (room.routingMode === "sequential") {
      return activeRoster[readSequentialIndex(room.currentTurnIndex, activeRoster)];
    }

    return activeRoster[readSequentialIndex(room.currentTurnIndex, activeRoster)];
  }

  public static createSpeakerTurnPayload(
    room: GroupChatRoom,
    roster: readonly CharacterCardV3[],
    manualOverrideId?: string,
  ): SpeakerTurnPayload | null {
    const targetCharacter = this.determineNextSpeaker(
      room,
      roster,
      manualOverrideId,
    );

    if (!targetCharacter) {
      return null;
    }

    return {
      routingDirectives: this.compileTurnDirectives(targetCharacter, roster),
      targetCharacter,
    };
  }

  public static advanceTurn(room: GroupChatRoom): GroupChatRoom {
    return {
      ...room,
      currentTurnIndex: Math.max(0, room.currentTurnIndex + 1),
    };
  }

  public static compileTurnDirectives(
    activeCharacter: CharacterCardV3,
    fullRoster: readonly CharacterCardV3[],
  ): string {
    const activeName = readCharacterName(activeCharacter);
    const alternateNames = fullRoster
      .map(readCharacterName)
      .filter((name) => name && name !== activeName);
    const personality = activeCharacter.data.personality.trim();
    const scenario = activeCharacter.data.scenario.trim();

    return [
      "[CRITICAL GROUP CHAT ROUTING RULE]",
      `You are now roleplaying EXCLUSIVELY as the character: "${activeName}".`,
      personality
        ? `Personality reference for this response pass: ${personality}`
        : "",
      scenario ? `Current scenario alignment: ${scenario}` : "",
      "Do not write text, actions, thoughts, reactions, or dialogue for {{user}}.",
      alternateNames.length > 0
        ? `Do not speak for these other characters: ${alternateNames.join(", ")}.`
        : "",
      `Write only ${activeName}'s immediate sensory, physical, and verbal response.`,
      "Wait for every other participant to respond naturally in their own later turn.",
    ]
      .filter(Boolean)
      .join("\n");
  }
}

function filterActiveRoster(
  room: GroupChatRoom,
  roster: readonly CharacterCardV3[],
) {
  if (room.activeCharacterIds.length === 0) {
    return [...roster];
  }

  return roster.filter((card) =>
    room.activeCharacterIds.some((id) => doesCardMatchId(card, id)),
  );
}

function doesCardMatchId(card: CharacterCardV3, id: string) {
  const normalizedId = id.trim().toLowerCase();

  return [
    typeof card.id === "string" ? card.id : "",
    card.data.name,
    card.data.nickname ?? "",
  ]
    .map((value) => value.trim().toLowerCase())
    .some((value) => value === normalizedId);
}

function readSequentialIndex(index: number, roster: readonly CharacterCardV3[]) {
  if (roster.length === 0) {
    return 0;
  }

  return Math.abs(Math.trunc(index)) % roster.length;
}

function readCharacterName(card: CharacterCardV3) {
  return card.data.name.trim() || "Unnamed Character";
}
