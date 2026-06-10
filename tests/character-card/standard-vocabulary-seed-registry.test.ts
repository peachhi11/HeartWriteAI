import assert from "node:assert/strict";
import test from "node:test";

import { ACTS_OF_SERVICE_VOCABULARY_SEEDS } from "../../data/actsOfServiceVocabularyPresets";
import { ATTACHMENT_STYLE_VOCABULARY_STANDARD_SEEDS } from "../../data/attachmentStyleVocabularyPresets";
import { COMPLEMENT_VOCABULARY_SEEDS } from "../../data/complementPresets";
import { CONFLICT_BEAT_VOCABULARY_STANDARD_SEEDS } from "../../data/conflictBeatVocabularyPresets";
import { CONFLICT_STYLE_VOCABULARY_STANDARD_SEEDS } from "../../data/conflictStyleVocabularyPresets";
import { CONSEQUENCE_VOCABULARY_STANDARD_SEEDS } from "../../data/consequenceVocabularyPresets";
import { DESIRE_VOCABULARY_STANDARD_SEEDS } from "../../data/desireVocabularyPresets";
import { FEAR_VOCABULARY_STANDARD_SEEDS } from "../../data/fearVocabularyPresets";
import { GROWTH_ARC_VOCABULARY_STANDARD_SEEDS } from "../../data/growthArcVocabularyPresets";
import { IMAGE_PROMPT_VOCABULARY_SEEDS } from "../../data/imagePromptVocabPresets";
import { LOVE_LANGUAGE_VOCABULARY_STANDARD_SEEDS } from "../../data/loveLanguageVocabularyPresets";
import { MORAL_FRAMEWORK_VOCABULARY_SEEDS } from "../../data/moralFrameworkVocabularyPresets";
import { ORIGIN_WOUND_VOCABULARY_SEEDS } from "../../data/originWoundVocabularyPresets";
import { PAYOFF_FANTASY_VOCABULARY_STANDARD_SEEDS } from "../../data/payoffFantasyVocabularyPresets";
import { PERSONALITY_ENGINE_VOCABULARY_SEEDS } from "../../data/personalityEngineVocabularyPresets";
import { RELATIONSHIP_DYNAMIC_VOCABULARY_STANDARD_SEEDS } from "../../data/relationshipDynamicVocabularyPresets";
import { RELATIONSHIP_IDENTITY_VOCABULARY_STANDARD_SEEDS } from "../../data/relationshipIdentityVocabularyPresets";
import { ROMANCE_TROPE_VOCABULARY_STANDARD_SEEDS } from "../../data/romanceTropeVocabularyPresets";
import { ROUTE_PHASE_VOCABULARY_STANDARD_SEEDS } from "../../data/routePhaseVocabularyPresets";
import { REPAIR_BEAT_VOCABULARY_STANDARD_SEEDS } from "../../data/repairBeatVocabularyPresets";
import { REPAIR_STYLE_VOCABULARY_STANDARD_SEEDS } from "../../data/repairStyleVocabularyPresets";
import { RESPONSE_VOCABULARY_STANDARD_SEEDS } from "../../data/responseVocabularyPresets";
import { RUPTURE_TYPE_VOCABULARY_STANDARD_SEEDS } from "../../data/ruptureTypeVocabularyPresets";
import { SEED_PRESET_REGISTRY } from "../../data/seedPresetRegistry";
import { TRIGGER_VOCABULARY_STANDARD_SEEDS } from "../../data/triggerVocabularyPresets";
import {
  ALL_STANDARD_VOCABULARY_SEEDS,
  REGISTRY_STANDARD_VOCABULARY_SEEDS,
  RICH_STANDARD_VOCABULARY_SEED_COLLECTIONS,
  RICH_STANDARD_VOCABULARY_SEEDS,
  STANDARD_VOCABULARY_SEED_COUNTS,
  getRichStandardVocabularySeedsBySource,
  getStandardVocabularySeedsByLane,
  compileStandardVocabularySeedPrompt,
  findStandardVocabularySeedBySeed,
  searchStandardVocabularySeeds,
} from "../../data/standardVocabularySeedRegistry";
import {
  VOICE_SEED_VOCABULARY_SEEDS,
  VOICE_VOCABULARY_SEEDS,
} from "../../data/voiceVocabularyPresets";
import { WOUND_VOCABULARY_STANDARD_SEEDS } from "../../data/woundVocabularyPresets";
import type { VocabularySeedPreset } from "../../data/vocabularySeedTypes";

const EXPECTED_VOCABULARY_SEED_KEYS = [
  "seed",
  "label",
  "description",
  "examples",
  "tags",
  "relatedSeeds",
  "oppositeSeeds",
  "romanceHooks",
  "scenarioHooks",
  "dialoguePatterns",
  "metadata",
].sort();

test("standardises every registry seed preset into the canonical vocabulary seed shape", () => {
  assert.equal(REGISTRY_STANDARD_VOCABULARY_SEEDS.length, SEED_PRESET_REGISTRY.length);
  assert.equal(STANDARD_VOCABULARY_SEED_COUNTS.registry, SEED_PRESET_REGISTRY.length);

  const registryKeys = REGISTRY_STANDARD_VOCABULARY_SEEDS.map((seed) => seed.seed);
  assert.equal(new Set(registryKeys).size, registryKeys.length);

  for (const seed of REGISTRY_STANDARD_VOCABULARY_SEEDS) {
    assertVocabularySeedShape(seed);
    assert.equal(seed.tags.includes("registry"), true);
    assert.equal(seed.tags.some((tag) => tag.startsWith("lane:")), true);
    assert.equal(seed.tags.some((tag) => tag.startsWith("source:")), true);
  }
});

test("collects rich vocabulary seed collections across explicit vocabulary modules", () => {
  const expectedRichCount =
    ACTS_OF_SERVICE_VOCABULARY_SEEDS.length +
    ATTACHMENT_STYLE_VOCABULARY_STANDARD_SEEDS.length +
    COMPLEMENT_VOCABULARY_SEEDS.length +
    CONFLICT_BEAT_VOCABULARY_STANDARD_SEEDS.length +
    CONFLICT_STYLE_VOCABULARY_STANDARD_SEEDS.length +
    CONSEQUENCE_VOCABULARY_STANDARD_SEEDS.length +
    DESIRE_VOCABULARY_STANDARD_SEEDS.length +
    FEAR_VOCABULARY_STANDARD_SEEDS.length +
    GROWTH_ARC_VOCABULARY_STANDARD_SEEDS.length +
    IMAGE_PROMPT_VOCABULARY_SEEDS.length +
    LOVE_LANGUAGE_VOCABULARY_STANDARD_SEEDS.length +
    MORAL_FRAMEWORK_VOCABULARY_SEEDS.length +
    ORIGIN_WOUND_VOCABULARY_SEEDS.length +
    PAYOFF_FANTASY_VOCABULARY_STANDARD_SEEDS.length +
    PERSONALITY_ENGINE_VOCABULARY_SEEDS.length +
    RELATIONSHIP_DYNAMIC_VOCABULARY_STANDARD_SEEDS.length +
    RELATIONSHIP_IDENTITY_VOCABULARY_STANDARD_SEEDS.length +
    ROMANCE_TROPE_VOCABULARY_STANDARD_SEEDS.length +
    ROUTE_PHASE_VOCABULARY_STANDARD_SEEDS.length +
    REPAIR_BEAT_VOCABULARY_STANDARD_SEEDS.length +
    REPAIR_STYLE_VOCABULARY_STANDARD_SEEDS.length +
    RESPONSE_VOCABULARY_STANDARD_SEEDS.length +
    RUPTURE_TYPE_VOCABULARY_STANDARD_SEEDS.length +
    TRIGGER_VOCABULARY_STANDARD_SEEDS.length +
    VOICE_VOCABULARY_SEEDS.length +
    VOICE_SEED_VOCABULARY_SEEDS.length +
    WOUND_VOCABULARY_STANDARD_SEEDS.length;

  assert.equal(RICH_STANDARD_VOCABULARY_SEEDS.length, expectedRichCount);
  assert.equal(STANDARD_VOCABULARY_SEED_COUNTS.rich, expectedRichCount);
  assert.equal(
    STANDARD_VOCABULARY_SEED_COUNTS.all,
    REGISTRY_STANDARD_VOCABULARY_SEEDS.length + expectedRichCount,
  );
  assert.equal(ALL_STANDARD_VOCABULARY_SEEDS.length, STANDARD_VOCABULARY_SEED_COUNTS.all);
  assert.deepEqual(
    RICH_STANDARD_VOCABULARY_SEED_COLLECTIONS.map((collection) => collection.sourceId),
    [
      "acts-of-service-vocabulary",
      "attachment-style-vocabulary",
      "complement-vocabulary",
      "conflict-beat-vocabulary",
      "conflict-style-vocabulary",
      "consequence-vocabulary",
      "desire-vocabulary",
      "fear-vocabulary",
      "image-prompt-vocabulary",
      "love-language-vocabulary",
      "moral-framework-vocabulary",
      "origin-wound-vocabulary",
      "wound-vocabulary",
      "response-vocabulary",
      "repair-style-vocabulary",
      "repair-beat-vocabulary",
      "rupture-type-vocabulary",
      "trigger-vocabulary",
      "personality-engine-vocabulary",
      "relationship-dynamic-vocabulary",
      "relationship-identity-vocabulary",
      "romance-trope-vocabulary",
      "route-phase-vocabulary",
      "payoff-fantasy-vocabulary",
      "growth-arc-vocabulary",
      "voice-vocabulary",
      "voice-seed-vocabulary",
    ],
  );
});

test("keeps canonical shape for explicit vocabulary seed exports", () => {
  const explicitSamples = [
    COMPLEMENT_VOCABULARY_SEEDS[0],
    ACTS_OF_SERVICE_VOCABULARY_SEEDS[0],
    ATTACHMENT_STYLE_VOCABULARY_STANDARD_SEEDS[0],
    CONFLICT_BEAT_VOCABULARY_STANDARD_SEEDS[0],
    CONFLICT_STYLE_VOCABULARY_STANDARD_SEEDS[0],
    CONSEQUENCE_VOCABULARY_STANDARD_SEEDS[0],
    DESIRE_VOCABULARY_STANDARD_SEEDS[0],
    FEAR_VOCABULARY_STANDARD_SEEDS[0],
    GROWTH_ARC_VOCABULARY_STANDARD_SEEDS[0],
    IMAGE_PROMPT_VOCABULARY_SEEDS[0],
    LOVE_LANGUAGE_VOCABULARY_STANDARD_SEEDS[0],
    MORAL_FRAMEWORK_VOCABULARY_SEEDS[0],
    ORIGIN_WOUND_VOCABULARY_SEEDS[0],
    WOUND_VOCABULARY_STANDARD_SEEDS[0],
    RESPONSE_VOCABULARY_STANDARD_SEEDS[0],
    REPAIR_STYLE_VOCABULARY_STANDARD_SEEDS[0],
    TRIGGER_VOCABULARY_STANDARD_SEEDS[0],
    PERSONALITY_ENGINE_VOCABULARY_SEEDS[0],
    RELATIONSHIP_DYNAMIC_VOCABULARY_STANDARD_SEEDS[0],
    RELATIONSHIP_IDENTITY_VOCABULARY_STANDARD_SEEDS[0],
    ROMANCE_TROPE_VOCABULARY_STANDARD_SEEDS[0],
    ROUTE_PHASE_VOCABULARY_STANDARD_SEEDS[0],
    PAYOFF_FANTASY_VOCABULARY_STANDARD_SEEDS[0],
    REPAIR_BEAT_VOCABULARY_STANDARD_SEEDS[0],
    RUPTURE_TYPE_VOCABULARY_STANDARD_SEEDS[0],
    VOICE_VOCABULARY_SEEDS[0],
    VOICE_SEED_VOCABULARY_SEEDS[0],
  ];

  for (const seed of explicitSamples) {
    assertVocabularySeedShape(seed);
    assert.equal(seed.examples.length > 0, true);
    assert.equal(seed.tags.length > 0, true);
  }
});

test("filters and searches standard vocabulary seeds across all categories", () => {
  const personalitySeeds = getStandardVocabularySeedsByLane("personality");
  const imageSeeds = getStandardVocabularySeedsByLane("image");
  const moralSeeds = getRichStandardVocabularySeedsBySource(
    "moral-framework-vocabulary",
  );
  const desireSeeds = getRichStandardVocabularySeedsBySource("desire-vocabulary");
  const conflictStyleSeeds = getRichStandardVocabularySeedsBySource(
    "conflict-style-vocabulary",
  );
  const conflictBeatSeeds = getRichStandardVocabularySeedsBySource(
    "conflict-beat-vocabulary",
  );
  const consequenceSeeds = getRichStandardVocabularySeedsBySource(
    "consequence-vocabulary",
  );
  const fearSeeds = getRichStandardVocabularySeedsBySource("fear-vocabulary");
  const growthArcSeeds = getRichStandardVocabularySeedsBySource(
    "growth-arc-vocabulary",
  );
  const loveLanguageSeeds = getRichStandardVocabularySeedsBySource(
    "love-language-vocabulary",
  );
  const responseSeeds = getRichStandardVocabularySeedsBySource("response-vocabulary");
  const repairStyleSeeds = getRichStandardVocabularySeedsBySource(
    "repair-style-vocabulary",
  );
  const repairBeatSeeds = getRichStandardVocabularySeedsBySource(
    "repair-beat-vocabulary",
  );
  const ruptureTypeSeeds = getRichStandardVocabularySeedsBySource(
    "rupture-type-vocabulary",
  );
  const actsOfServiceSeeds = getRichStandardVocabularySeedsBySource(
    "acts-of-service-vocabulary",
  );
  const attachmentStyleSeeds = getRichStandardVocabularySeedsBySource(
    "attachment-style-vocabulary",
  );
  const triggerSeeds = getRichStandardVocabularySeedsBySource("trigger-vocabulary");
  const relationshipDynamicSeeds = getRichStandardVocabularySeedsBySource(
    "relationship-dynamic-vocabulary",
  );
  const relationshipIdentitySeeds = getRichStandardVocabularySeedsBySource(
    "relationship-identity-vocabulary",
  );
  const romanceTropeSeeds = getRichStandardVocabularySeedsBySource(
    "romance-trope-vocabulary",
  );
  const routePhaseSeeds = getRichStandardVocabularySeedsBySource(
    "route-phase-vocabulary",
  );
  const payoffFantasySeeds = getRichStandardVocabularySeedsBySource(
    "payoff-fantasy-vocabulary",
  );
  const careResults = searchStandardVocabularySeeds("reducing suffering", {
    sourceIds: ["moral-framework-vocabulary"],
    limit: 3,
  });
  const fearResults = searchStandardVocabularySeeds("People eventually leave", {
    sourceIds: ["fear-vocabulary"],
    limit: 3,
  });
  const growthArcResults = searchStandardVocabularySeeds("trust can be earned", {
    sourceIds: ["growth-arc-vocabulary"],
    limit: 3,
  });
  const desireResults = searchStandardVocabularySeeds("consistent presence", {
    sourceIds: ["desire-vocabulary"],
    limit: 3,
  });
  const conflictStyleResults = searchStandardVocabularySeeds(
    "Conflict feels like abandonment",
    {
      sourceIds: ["conflict-style-vocabulary"],
      limit: 3,
    },
  );
  const conflictBeatResults = searchStandardVocabularySeeds(
    "ordinary distance",
    {
      sourceIds: ["conflict-beat-vocabulary"],
      limit: 3,
    },
  );
  const consequenceResults = searchStandardVocabularySeeds(
    "relationship loses reliability",
    {
      sourceIds: ["consequence-vocabulary"],
      limit: 3,
    },
  );
  const registryResults = searchStandardVocabularySeeds("guarded professional", {
    sourceIds: ["registry"],
    limit: 5,
  });
  const woundResults = searchStandardVocabularySeeds("all closeness ends", {
    sourceIds: ["wound-vocabulary"],
    limit: 3,
  });
  const responseResults = searchStandardVocabularySeeds("distance is not abandonment", {
    sourceIds: ["response-vocabulary"],
    limit: 3,
  });
  const repairStyleResults = searchStandardVocabularySeeds(
    "relationship is still safe",
    {
      sourceIds: ["repair-style-vocabulary"],
      limit: 3,
    },
  );
  const repairBeatResults = searchStandardVocabularySeeds("Stops the rupture", {
    sourceIds: ["repair-beat-vocabulary"],
    limit: 3,
  });
  const ruptureTypeResults = searchStandardVocabularySeeds(
    "leaving, disappearing",
    {
      sourceIds: ["rupture-type-vocabulary"],
      limit: 3,
    },
  );
  const actsOfServiceResults = searchStandardVocabularySeeds("Quiet Devotion", {
    sourceIds: ["acts-of-service-vocabulary"],
    limit: 3,
  });
  const attachmentStyleResults = searchStandardVocabularySeeds(
    "Love can disappear",
    {
      sourceIds: ["attachment-style-vocabulary"],
      limit: 3,
    },
  );
  const loveLanguageResults = searchStandardVocabularySeeds(
    "I notice what burdens you",
    {
      sourceIds: ["love-language-vocabulary"],
      limit: 3,
    },
  );
  const triggerResults = searchStandardVocabularySeeds("Silence feels like proof", {
    sourceIds: ["trigger-vocabulary"],
    limit: 3,
  });
  const relationshipDynamicResults = searchStandardVocabularySeeds(
    "reliable source of emotional safety",
    {
      sourceIds: ["relationship-dynamic-vocabulary"],
      limit: 3,
    },
  );
  const relationshipIdentityResults = searchStandardVocabularySeeds(
    "conflict does not erase love",
    {
      sourceIds: ["relationship-identity-vocabulary"],
      limit: 3,
    },
  );
  const romanceTropeResults = searchStandardVocabularySeeds(
    "saw the worst first",
    {
      sourceIds: ["romance-trope-vocabulary"],
      limit: 3,
    },
  );
  const routePhaseResults = searchStandardVocabularySeeds(
    "starting rules",
    {
      sourceIds: ["route-phase-vocabulary"],
      limit: 3,
    },
  );
  const payoffFantasyResults = searchStandardVocabularySeeds(
    "forced to choose",
    {
      sourceIds: ["payoff-fantasy-vocabulary"],
      limit: 3,
    },
  );

  assert.equal(personalitySeeds.length > imageSeeds.length, true);
  assert.equal(moralSeeds.length, MORAL_FRAMEWORK_VOCABULARY_SEEDS.length);
  assert.equal(desireSeeds.length, DESIRE_VOCABULARY_STANDARD_SEEDS.length);
  assert.equal(
    conflictStyleSeeds.length,
    CONFLICT_STYLE_VOCABULARY_STANDARD_SEEDS.length,
  );
  assert.equal(
    conflictBeatSeeds.length,
    CONFLICT_BEAT_VOCABULARY_STANDARD_SEEDS.length,
  );
  assert.equal(consequenceSeeds.length, CONSEQUENCE_VOCABULARY_STANDARD_SEEDS.length);
  assert.equal(fearSeeds.length, FEAR_VOCABULARY_STANDARD_SEEDS.length);
  assert.equal(growthArcSeeds.length, GROWTH_ARC_VOCABULARY_STANDARD_SEEDS.length);
  assert.equal(loveLanguageSeeds.length, LOVE_LANGUAGE_VOCABULARY_STANDARD_SEEDS.length);
  assert.equal(responseSeeds.length, RESPONSE_VOCABULARY_STANDARD_SEEDS.length);
  assert.equal(repairStyleSeeds.length, REPAIR_STYLE_VOCABULARY_STANDARD_SEEDS.length);
  assert.equal(repairBeatSeeds.length, REPAIR_BEAT_VOCABULARY_STANDARD_SEEDS.length);
  assert.equal(ruptureTypeSeeds.length, RUPTURE_TYPE_VOCABULARY_STANDARD_SEEDS.length);
  assert.equal(actsOfServiceSeeds.length, ACTS_OF_SERVICE_VOCABULARY_SEEDS.length);
  assert.equal(
    attachmentStyleSeeds.length,
    ATTACHMENT_STYLE_VOCABULARY_STANDARD_SEEDS.length,
  );
  assert.equal(triggerSeeds.length, TRIGGER_VOCABULARY_STANDARD_SEEDS.length);
  assert.equal(
    relationshipDynamicSeeds.length,
    RELATIONSHIP_DYNAMIC_VOCABULARY_STANDARD_SEEDS.length,
  );
  assert.equal(
    relationshipIdentitySeeds.length,
    RELATIONSHIP_IDENTITY_VOCABULARY_STANDARD_SEEDS.length,
  );
  assert.equal(romanceTropeSeeds.length, ROMANCE_TROPE_VOCABULARY_STANDARD_SEEDS.length);
  assert.equal(routePhaseSeeds.length, ROUTE_PHASE_VOCABULARY_STANDARD_SEEDS.length);
  assert.equal(
    payoffFantasySeeds.length,
    PAYOFF_FANTASY_VOCABULARY_STANDARD_SEEDS.length,
  );
  assert.equal(careResults[0]?.label, "Care Ethics");
  assert.equal(conflictStyleResults[0]?.label, "Pursuer Conflict Style");
  assert.equal(conflictBeatResults[0]?.label, "Delayed Reply Spiral");
  assert.equal(consequenceResults[0]?.label, "Trust Damage Consequence");
  assert.equal(desireResults[0]?.label, "Desire to Be Chosen");
  assert.equal(fearResults[0]?.label, "Fear of Abandonment");
  assert.equal(growthArcResults[0]?.label, "Learning to Trust");
  assert.equal(woundResults[0]?.label, "Everyone Leaves Wound");
  assert.equal(responseResults[0]?.label, "Reassurance Seeking Response");
  assert.equal(repairStyleResults[0]?.label, "Verbal Reassurance Repair");
  assert.equal(repairBeatResults[0]?.label, "Accountability Beat");
  assert.equal(ruptureTypeResults[0]?.label, "Abandonment Rupture");
  assert.equal(actsOfServiceResults[0]?.label, "Quiet Devotion");
  assert.equal(attachmentStyleResults[0]?.label, "Anxious Attachment");
  assert.equal(loveLanguageResults[0]?.label, "Acts of Service");
  assert.equal(triggerResults[0]?.label, "Unanswered Message Trigger");
  assert.equal(relationshipDynamicResults[0]?.label, "Safe Haven Dynamic");
  assert.equal(relationshipIdentityResults[0]?.label, "Safe Haven Relationship");
  assert.equal(romanceTropeResults[0]?.label, "Enemies to Lovers");
  assert.equal(routePhaseResults[0]?.label, "Initial Dynamic");
  assert.equal(payoffFantasyResults[0]?.label, "Chosen Above Everyone");
  assert.equal(registryResults.some((seed) => seed.tags.includes("registry")), true);
  assert.equal(searchStandardVocabularySeeds("").length, 0);
});

test("finds and compiles standard vocabulary seeds for app routing", () => {
  const care = findStandardVocabularySeedBySeed(
    "moral-framework-vocabulary:care_ethics",
  );

  assert.equal(care?.label, "Care Ethics");
  assert.match(
    compileStandardVocabularySeedPrompt(must(care), {
      header: "Vocabulary match profile",
    }),
    /Vocabulary match profile\n- Care Ethics:/,
  );
  assert.match(
    compileStandardVocabularySeedPrompt(must(care)),
    /Preserve character dimensionality, player agency/,
  );
});

function assertVocabularySeedShape(seed: VocabularySeedPreset | undefined) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_VOCABULARY_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "conflictPotential",
    "rarity",
    "romanceValue",
  ]);
  assert.equal(seed.metadata.romanceValue >= 1, true);
  assert.equal(seed.metadata.romanceValue <= 10, true);
  assert.equal(seed.metadata.conflictPotential >= 1, true);
  assert.equal(seed.metadata.conflictPotential <= 10, true);
}

function must<T>(value: T | undefined): T {
  assert.ok(value);
  return value;
}
