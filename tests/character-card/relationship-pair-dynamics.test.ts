import assert from "node:assert/strict";
import test from "node:test";

import { RelationshipMeaningSystemsSchema } from "../../lib/chat/relationshipMeaningfulEvents";
import { resolveRelationshipPairDynamics } from "../../lib/chat/relationshipPairDynamics";

test("resolves secure secure pair dynamics from trust and repair fit", () => {
  const pair = resolveRelationshipPairDynamics({
    romantic: 45,
    platonic: 55,
    rivalry: 0,
    trust: 82,
    tension: 20,
    jealousy: 5,
    admiration: 50,
    dependency: 20,
    protectiveness: 45,
    ambiguity: 10,
    meaning: RelationshipMeaningSystemsSchema.parse({
      patterns: {
        pursue_withdraw: 0,
        tease_fluster_retreat: 0,
        jealousy_reassurance: 55,
        conflict_silence_apology: 50,
      },
    }),
  });

  assert.equal(pair.type, "secure_secure");
  assert.equal(pair.stabilityPotential > 60, true);
  assert.equal(pair.notes.includes("mutual emotional safety"), true);
});

test("resolves anxious avoidant from public distance and attachment friction", () => {
  const pair = resolveRelationshipPairDynamics({
    romantic: 55,
    platonic: 15,
    rivalry: 10,
    trust: 35,
    tension: 65,
    jealousy: 75,
    admiration: 30,
    dependency: 55,
    protectiveness: 10,
    ambiguity: 70,
    meaning: RelationshipMeaningSystemsSchema.parse({
      emotionalRank: {
        perceivedPriority: "replaceable",
        publiclyChosen: false,
        hidden: false,
        replaceabilityFear: 75,
      },
      treatment: {
        privateAffection: 45,
        publicAffection: 0,
        publicDistance: 70,
        privateNeglect: 0,
        publicTeasing: 0,
        insecurityPressure: 59,
        confusionPressure: 0,
        layeredIntimacy: 0,
      },
    }),
  });

  assert.equal(pair.type, "anxious_avoidant");
  assert.equal(pair.attachmentFriction >= 60, true);
});

test("resolves rival pair from competition and admiration", () => {
  const pair = resolveRelationshipPairDynamics({
    romantic: 30,
    platonic: 10,
    rivalry: 75,
    trust: 45,
    tension: 70,
    jealousy: 20,
    admiration: 65,
    dependency: 10,
    protectiveness: 0,
    ambiguity: 35,
    meaning: RelationshipMeaningSystemsSchema.parse({}),
  });

  assert.equal(pair.type, "rival_rival");
  assert.equal(pair.dominantLoop, "challenge_admiration_attraction");
  assert.equal(pair.pairChemistryDensity >= 35, true);
});
