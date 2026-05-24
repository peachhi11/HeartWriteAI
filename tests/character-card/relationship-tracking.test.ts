import assert from "node:assert/strict";
import test from "node:test";

import { createDefaultRelationshipState } from "../../lib/chat/relationshipState.schema";
import {
  buildTrackedEventsFromReasons,
  buildTrajectorySnapshot,
  createRelationshipTrackingFromUpdate,
  shouldPromoteToMemory,
  trackRelationshipUpdate,
} from "../../lib/chat/relationshipTracking";
import { updateRelationshipFromMessages } from "../../lib/chat/relationshipUpdater";

test("promotes only emotionally meaningful tracked events", () => {
  const lowImportance = buildTrackedEventsFromReasons(
    [
      {
        key: "momentum.attachment",
        delta: 2,
        reason: "positive attachment momentum",
      },
    ],
    10,
  )[0];
  const confession = buildTrackedEventsFromReasons(
    [
      {
        key: "intimacy.vulnerability",
        delta: 10,
        reason: "confession increased vulnerability",
      },
    ],
    10,
  )[0];

  assert.equal(shouldPromoteToMemory(lowImportance), false);
  assert.equal(shouldPromoteToMemory(confession), true);
});

test("builds tracked events from updater reasons", () => {
  const events = buildTrackedEventsFromReasons(
    [
      {
        key: "trust.emotional",
        delta: 8,
        reason: "reassurance restored emotional safety",
      },
      {
        key: "rupture",
        delta: 4,
        reason: "betrayal rupture detected",
      },
    ],
    200,
  );

  assert.equal(events.length, 2);
  assert.equal(events[0]?.id, "event_200_0_reassurance");
  assert.equal(events[0]?.type, "reassurance");
  assert.equal(events[0]?.effects.trust, 8);
  assert.equal(events[1]?.type, "betrayal");
  assert.equal(events[1]?.effects.rupture, 4);
});

test("tracks state deltas and trajectory from a relationship update", () => {
  const state = createDefaultRelationshipState({
    id: "pair-a",
    aId: "a",
    bId: "b",
  });
  const update = updateRelationshipFromMessages(state, [
    {
      role: "assistant",
      content: "I love you. I'm here. You matter.",
      createdAt: 300,
    },
  ]);
  const tracking = createRelationshipTrackingFromUpdate(state, update, 300);

  assert.equal(tracking.previousState.id, "pair-a");
  assert.equal(tracking.currentState.flags.confessionOccurred, true);
  assert.ok(
    tracking.deltas.some(
      (delta) =>
        delta.path === "trust.emotional" &&
        delta.before === 30 &&
        delta.after === 38,
    ),
  );
  assert.ok(
    tracking.deltas.some(
      (delta) =>
        delta.path === "flags.confessionOccurred" &&
        delta.before === false &&
        delta.after === true,
    ),
  );
  assert.ok(
    tracking.recentEvents.some((event) => event.type === "confession"),
  );
  assert.equal(
    tracking.recentEvents.some(
      (event) => event.summary === "abandonment fear soothed" &&
        event.type === "abandonment",
    ),
    false,
  );
  assert.equal(tracking.trajectory.currentLifecycle, "potential");
});

test("projects fracturing trajectory from an unresolved betrayal", () => {
  const state = createDefaultRelationshipState({
    id: "pair-a",
    aId: "a",
    bId: "b",
  });
  const update = updateRelationshipFromMessages(state, [
    {
      role: "user",
      content: "You lied and betrayed me behind my back.",
      createdAt: 400,
    },
  ]);
  const trajectory = buildTrajectorySnapshot(update.state);

  assert.equal(trajectory.currentLifecycle, "fracture");
  assert.equal(trajectory.dominantMomentum, "fracturing");
  assert.ok(trajectory.ruptureRisk > trajectory.survivability);
  assert.ok(trajectory.predictedNextStates.includes("dissolution"));
});

test("caps recent tracked events at thirty", () => {
  const state = createDefaultRelationshipState({
    id: "pair-a",
    aId: "a",
    bId: "b",
  });
  const events = Array.from({ length: 35 }, (_, index) => ({
    id: `event-${index}`,
    timestamp: index,
    source: "message" as const,
    type: "routine" as const,
    summary: `Routine event ${index}`,
    importance: 10,
    emotionalWeight: 10,
    effects: {},
    tags: ["routine"],
  }));
  const tracking = trackRelationshipUpdate(state, state, events);

  assert.equal(tracking.recentEvents.length, 30);
  assert.equal(tracking.recentEvents[0]?.id, "event-5");
});
