import assert from "node:assert/strict";
import test from "node:test";

import { GroupChatRouter } from "../../lib/character-card/groupChatRouter";
import type { CharacterCardV3 } from "../../types/character-card/CharacterCardV3";
import type { GroupChatRoom } from "../../types/character-card/GroupChat";

test("selects the sequential speaker from the active room roster", () => {
  const room = createRoom({
    activeCharacterIds: ["Seraphina", "Garrick", "Aria"],
    currentTurnIndex: 4,
    routingMode: "sequential",
  });
  const speaker = GroupChatRouter.determineNextSpeaker(room, sampleRoster);

  assert.equal(speaker?.data.name, "Garrick");
});

test("honors a manual override when the requested character is active", () => {
  const room = createRoom({
    activeCharacterIds: ["Seraphina", "Garrick"],
    currentTurnIndex: 0,
    routingMode: "manual",
  });
  const speaker = GroupChatRouter.determineNextSpeaker(
    room,
    sampleRoster,
    "Garrick",
  );

  assert.equal(speaker?.data.name, "Garrick");
});

test("ignores manual override requests outside the active room roster", () => {
  const room = createRoom({
    activeCharacterIds: ["Seraphina"],
    currentTurnIndex: 0,
    routingMode: "manual",
  });
  const speaker = GroupChatRouter.determineNextSpeaker(room, sampleRoster, "Aria");

  assert.equal(speaker?.data.name, "Seraphina");
});

test("returns null when no active characters can be resolved", () => {
  const room = createRoom({
    activeCharacterIds: ["Missing"],
    currentTurnIndex: 0,
    routingMode: "sequential",
  });

  assert.equal(GroupChatRouter.determineNextSpeaker(room, sampleRoster), null);
});

test("creates turn payloads with isolation directives", () => {
  const room = createRoom({
    activeCharacterIds: ["Seraphina", "Garrick"],
    currentTurnIndex: 1,
    routingMode: "sequential",
  });
  const payload = GroupChatRouter.createSpeakerTurnPayload(room, sampleRoster);

  assert.equal(payload?.targetCharacter.data.name, "Garrick");
  assert.match(payload?.routingDirectives ?? "", /EXCLUSIVELY as the character/);
  assert.match(payload?.routingDirectives ?? "", /Do not speak for these other characters: Seraphina, Aria/);
  assert.match(payload?.routingDirectives ?? "", /Do not write text.*for \{\{user\}\}/);
});

test("advances the room turn index without mutating the source room", () => {
  const room = createRoom({ currentTurnIndex: 2 });
  const next = GroupChatRouter.advanceTurn(room);

  assert.equal(room.currentTurnIndex, 2);
  assert.equal(next.currentTurnIndex, 3);
});

const sampleRoster: CharacterCardV3[] = [
  createCard("Seraphina", "Clinical combat medic.", "Guarding the infirmary."),
  createCard("Garrick", "Gruff veteran guard.", "Watching the broken exit."),
  createCard("Aria", "Optimistic engineer.", "Tracing a power fault."),
];

function createRoom(overrides: Partial<GroupChatRoom>): GroupChatRoom {
  return {
    activeCharacterIds: [],
    currentTurnIndex: 0,
    id: "room_1",
    name: "Outpost Alpha",
    routingMode: "sequential",
    ...overrides,
  };
}

function createCard(
  name: string,
  personality: string,
  scenario: string,
): CharacterCardV3 {
  return {
    data: {
      alternate_greetings: [],
      character_version: "1.0.0",
      creator: "HeartWriteAI",
      creator_notes: "",
      description: "",
      extensions: {},
      first_mes: "",
      group_only_greetings: [],
      mes_example: "",
      name,
      personality,
      post_history_instructions: "",
      scenario,
      system_prompt: "",
      tags: [],
    },
    spec: "chara_card_v3",
    spec_version: "3.0",
  };
}
