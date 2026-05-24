import assert from "node:assert/strict";
import test from "node:test";

import { createDefaultRelationshipState } from "../../lib/chat/relationshipState.schema";
import {
  applyNPCImpact,
  applyNPCImpactWithTracking,
  mapRivalWinToNPCImpact,
  relationshipEdgeId,
  shouldPromoteNPCImpactToMemory,
  type NPCImpactEvent,
} from "../../lib/chat/relationshipNPCImpact";

test("tracks rival comfort as role displacement on the main relationship", () => {
  const state = createDefaultRelationshipState({
    id: "pair-a",
    aId: "user",
    bId: "char",
  });
  const event: NPCImpactEvent = {
    id: "evt_001",
    timestamp: 100,
    actorId: "rival_npc",
    targetId: "char",
    observerIds: ["user"],
    npcId: "rival_npc",
    type: "rival_outcompetes_user",
    summary: "The rival comforted the character before the user could.",
    visibility: "seen",
    emotionalWeight: 80,
    romanticThreat: 70,
    humiliationImpact: 55,
    replacementThreat: 75,
    affectedEdges: [
      relationshipEdgeId("user", "char"),
      relationshipEdgeId("rival_npc", "char"),
    ],
    tags: ["rivalry", "jealousy", "replacement_fear", "humiliation"],
  };
  const next = applyNPCImpact(state, event);

  assert.equal(next.chemistry.tension, 7);
  assert.equal(next.exclusivity.jealousyReactivity, 42);
  assert.equal(next.wounds.replacement, 11);
  assert.equal(next.momentum.conflict, 8);
  assert.equal(next.trust.loyalty, 27);
  assert.equal(next.npcDynamics.rivalries.length, 1);
  assert.equal(next.npcDynamics.rivalries[0]?.replacementFear, 14);
  assert.equal(next.memories[0]?.id, "mem_evt_001");
  assert.equal(next.memories[0]?.type, "jealousy");
});

test("maps rival comfort role wins into comfort role ownership", () => {
  const state = createDefaultRelationshipState({
    id: "pair-a",
    aId: "user",
    bId: "char",
  });
  const event = mapRivalWinToNPCImpact({
    id: "evt_002",
    timestamp: 200,
    rivalId: "rival_npc",
    charId: "char",
    userId: "user",
    winType: "rival_gets_comfort_role",
    summary: "The rival became the person the character leaned on.",
  });
  const result = applyNPCImpactWithTracking(state, event);

  assert.equal(event.type, "rival_comfort");
  assert.equal(result.state.npcDynamics.roleOwnership.comfortRoleOwner, "rival_npc");
  assert.equal(result.promotedToMemory, true);
  assert.equal(result.tracking.recentEvents[0]?.type, "comfort");
  assert.ok(
    result.tracking.deltas.some(
      (delta) =>
        delta.path === "npcDynamics.roleOwnership.comfortRoleOwner" &&
        delta.after === "rival_npc",
    ),
  );
});

test("uses char chooses rival naming and creates humiliation rupture pressure", () => {
  const state = createDefaultRelationshipState({
    id: "pair-a",
    aId: "user",
    bId: "char",
  });
  const event = mapRivalWinToNPCImpact({
    id: "evt_003",
    timestamp: 300,
    rivalId: "rival_npc",
    charId: "char",
    userId: "user",
    winType: "rival_gets_chosen_in_conflict",
    summary: "The character defended the rival over the user in public.",
  });
  const next = applyNPCImpact(state, event);

  assert.equal(event.type, "char_chooses_rival");
  assert.equal(next.rupture.active, true);
  assert.equal(next.rupture.type, "humiliation");
  assert.equal(next.rupture.severity, 3);
  assert.equal(next.trust.loyalty, 12);
  assert.equal(next.npcDynamics.roleOwnership.romanticPriorityOwner, "rival_npc");
});

test("char reassurance reduces rival threat and marks the user win", () => {
  const state = createDefaultRelationshipState({
    id: "pair-a",
    aId: "user",
    bId: "char",
  });
  state.exclusivity.jealousyReactivity = 60;
  state.wounds.replacement = 50;
  state.momentum.conflict = 20;
  state.npcDynamics.rivalries.push({
    rivalId: "rival_npc",
    targetId: "char",
    userId: "user",
    rivalThreatLevel: 60,
    userInsecurity: 55,
    targetResponsivenessToRival: 70,
    targetResponsivenessToUser: 20,
    publicHumiliation: 30,
    replacementFear: 65,
    jealousyMomentum: 45,
  });
  const event: NPCImpactEvent = {
    id: "evt_004",
    timestamp: 400,
    actorId: "char",
    targetId: "user",
    observerIds: ["user"],
    type: "char_reassures_user",
    summary: "The character rejected the rival and reassured the user.",
    visibility: "seen",
    emotionalWeight: 75,
    romanticThreat: 10,
    humiliationImpact: 0,
    replacementThreat: 60,
    affectedEdges: [relationshipEdgeId("user", "char")],
    tags: ["rivalry", "reassurance"],
  };
  const next = applyNPCImpact(state, event);

  assert.equal(next.trust.loyalty, 38);
  assert.equal(next.trust.emotional, 36);
  assert.equal(next.exclusivity.jealousyReactivity, 54);
  assert.equal(next.wounds.replacement, 44);
  assert.equal(next.momentum.conflict, 14);
  assert.equal(next.npcDynamics.rivalries[0]?.targetResponsivenessToUser, 32);
  assert.equal(next.npcDynamics.rivalries[0]?.lastUserWin, "evt_004");
  assert.equal(next.npcDynamics.roleOwnership.romanticPriorityOwner, "user");
});

test("ignores NPC impact events that do not affect this relationship edge", () => {
  const state = createDefaultRelationshipState({
    id: "pair-a",
    aId: "user",
    bId: "char",
  });
  const event = mapRivalWinToNPCImpact({
    id: "evt_005",
    timestamp: 500,
    rivalId: "rival_npc",
    charId: "other_char",
    userId: "other_user",
    winType: "rival_gets_kiss",
    summary: "A different relationship triangle had a kiss.",
  });
  const next = applyNPCImpact(state, event);

  assert.deepEqual(next, state);
});

test("promotes only meaningful NPC impact events into memory", () => {
  const minorEvent = mapRivalWinToNPCImpact({
    id: "evt_006",
    timestamp: 600,
    rivalId: "rival_npc",
    charId: "char",
    userId: "user",
    winType: "rival_gets_attention",
    summary: "The rival briefly got the character's attention.",
    visibility: "hidden",
  });
  const majorEvent = mapRivalWinToNPCImpact({
    id: "evt_007",
    timestamp: 700,
    rivalId: "rival_npc",
    charId: "char",
    userId: "user",
    winType: "rival_gets_kiss",
    summary: "The rival kissed the character.",
  });

  assert.equal(shouldPromoteNPCImpactToMemory(minorEvent), false);
  assert.equal(shouldPromoteNPCImpactToMemory(majorEvent), true);
});
