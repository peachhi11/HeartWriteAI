import assert from "node:assert/strict";
import test from "node:test";

import {
  HEARTWRITE_SEED_CATEGORIES,
  type HeartWriteSeed,
  type RelationshipDynamicSeed,
  type RomanceTropeSeed,
  type SeedBase,
  type WoundSeed,
} from "../../data/heartwriteSeedTypes";

const sampleBase = {
  id: "sample_seed",
  label: "Sample seed",
  category: "wound",
  aliases: ["sample"],
  description: "A sample seed used to verify the shared HeartWrite seed base.",
  tags: ["test"],
  romanceRelevant: true,
  adult: false,
  unsafe: false,
} satisfies SeedBase;

const sampleWound = {
  ...sampleBase,
  category: "wound",
  coreFear: "being left behind",
  internalBelief: "distance means danger",
  defensiveBehaviors: ["asks for reassurance"],
  triggers: ["silence"],
  misreadsAs: ["rejection"],
  healingSignals: ["consistent return"],
  growthPath: ["names the fear without accusing"],
} satisfies WoundSeed;

const sampleTrope = {
  id: "sample_trope",
  label: "Sample trope",
  category: "romance_trope",
  aliases: ["sample romance"],
  description: "A sample trope seed used to verify route-ready structure.",
  tags: ["test", "romance_trope"],
  romanceRelevant: true,
  adult: false,
  unsafe: false,
  premise: "Two people move from tension into trust.",
  emotionalArc: ["friction", "respect", "trust"],
  startingConditions: ["mutual tension"],
  commonConflicts: ["pride"],
  gates: ["trust gate"],
  payoffFantasy: "Trust earned through action.",
} satisfies RomanceTropeSeed;

const sampleRelationshipDynamic = {
  id: "sample_dynamic",
  label: "Sample dynamic",
  category: "relationship_dynamic",
  aliases: ["sample relationship"],
  description: "A sample relationship dynamic seed used to verify rapport-ready structure.",
  tags: ["test", "relationship_dynamic"],
  romanceRelevant: true,
  adult: false,
  unsafe: false,
  premise: "One person expresses care through steady protection.",
  affectionSignals: ["checks in"],
  misunderstandings: ["can seem controlling"],
  commonConflicts: ["overprotectiveness"],
  growthPath: ["asks before acting"],
  compatibleWith: ["caretaker", "hurt comfort"],
} satisfies RelationshipDynamicSeed;

test("defines the shared HeartWrite seed category union", () => {
  assert.deepEqual(HEARTWRITE_SEED_CATEGORIES, [
    "personality_trait",
    "strength",
    "weakness",
    "mood",
    "appearance",
    "clothing_aesthetic",
    "wound",
    "trigger",
    "response",
    "like",
    "dislike",
    "secret",
    "humor",
    "skill",
    "intelligence_style",
    "motivation",
    "short_term_goal",
    "long_term_goal",
    "relationship_dynamic",
    "romance_trope",
    "relationship_gate",
    "route",
    "safety_flag",
  ]);
});

test("supports category-specialized story psychology seed shapes", () => {
  const seeds: HeartWriteSeed[] = [sampleWound, sampleRelationshipDynamic, sampleTrope];

  assert.equal(sampleBase.category, "wound");
  assert.equal(seeds[0]?.category, "wound");
  assert.equal(seeds[1]?.category, "relationship_dynamic");
  assert.equal(seeds[2]?.category, "romance_trope");
  assert.equal(
    seeds.every((seed) => seed.description.length > 0 && seed.aliases.length > 0),
    true,
  );
  assert.equal(sampleWound.growthPath.includes("names the fear without accusing"), true);
  assert.equal(sampleRelationshipDynamic.affectionSignals.includes("checks in"), true);
  assert.equal(sampleTrope.emotionalArc.includes("trust"), true);
});
