import assert from "node:assert/strict";
import test from "node:test";

import {
  EVENT_ENGINE_VOCABULARY_STANDARD_SEEDS,
  eventEngineCategories,
  eventEngineDefinitions,
  eventEnginePrinciples,
  eventEngineSemanticChain,
  eventEngineTiers,
  selectEventPressure,
} from "../../data/eventEngineVocabularyPresets";
import { findSemanticSeedGraphNodeById } from "../../data/semanticSeedRegistry";
import {
  getRichStandardVocabularySeedsBySource,
  searchStandardVocabularySeeds,
} from "../../data/standardVocabularySeedRegistry";

test("defines event engine as context-aware injected pressure", () => {
  assert.deepEqual(eventEngineSemanticChain, [
    "Context",
    "Current State",
    "Recent Interaction Pattern",
    "Narrative Fatigue",
    "Event Pressure",
    "Character Interpretation",
    "State Impact",
    "Behavioral Outcome",
  ]);
  assert.equal(
    eventEnginePrinciples.includes(
      "Events are injected pressures, not random incidents.",
    ),
    true,
  );
  assert.equal(
    eventEnginePrinciples.includes(
      "The same event should have different effects depending on fears, desires, values, and attachment style.",
    ),
    true,
  );
});

test("captures core event categories and escalation tiers", () => {
  assert.deepEqual(
    eventEngineCategories.map((category) => category.seed),
    ["interpersonal", "environmental", "internal", "relationship"],
  );
  assert.deepEqual(
    eventEngineTiers.map((tier) => tier.seed),
    ["micro_event", "meso_event", "major_event"],
  );
  assert.equal(
    eventEngineTiers.find((tier) => tier.seed === "major_event")?.eventExamples.includes(
      "forced separation",
    ),
    true,
  );
});

test("stores events with trigger, interpretation, state impact, and behavior", () => {
  const flirtation = eventEngineDefinitions.find(
    (event) => event.seed === "third_party_flirtation_event",
  );
  const lateTrustPressure = eventEngineDefinitions.find(
    (event) => event.seed === "slight_misunderstanding_event",
  );

  assert.equal(flirtation?.category, "relationship");
  assert.equal(flirtation?.tier, "micro_event");
  assert.match(flirtation?.interpretation ?? "", /replaced/);
  assert.equal(
    flirtation?.stateImpact.includes("replacement fear may rise"),
    true,
  );
  assert.match(flirtation?.behavioralOutcome ?? "", /sharper|attentive|quiet/);
  assert.equal(
    lateTrustPressure?.chainInto.includes("vulnerability_window_event"),
    true,
  );
});

test("selects event pressure from state and fatigue context", () => {
  const trustRising = selectEventPressure({
    currentStates: ["trust_rising", "low_conflict"],
    narrativeFatigueLevel: "too_stable",
    recentEventTypes: ["environmental"],
  });
  const tensionLoop = selectEventPressure({
    currentStates: ["high_tension"],
    narrativeFatigueLevel: "high_tension_loop",
    recentEventTypes: ["relationship"],
  });
  const moralMajor = selectEventPressure({
    currentStates: ["high_tension", "moral_pressure"],
    maxTier: "major_event",
  });

  assert.equal(trustRising.selectedCategory, "interpersonal");
  assert.equal(trustRising.selectedTier, "micro_event");
  assert.match(trustRising.guidance, /misunderstanding|external interruption/);
  assert.equal(tensionLoop.selectedTier, "meso_event");
  assert.match(tensionLoop.guidance, /vulnerability|forced cooperation/);
  assert.equal(moralMajor.selectedTier, "major_event");
  assert.match(moralMajor.compactPrompt, /trigger -> interpretation -> state impact -> behavioral outcome/);
});

test("projects event engine into standard vocabulary and semantic graph triggers", () => {
  const seeds = getRichStandardVocabularySeedsBySource("event-engine-vocabulary");
  const flirtationResults = searchStandardVocabularySeeds(
    "They might replace me",
    {
      sourceIds: ["event-engine-vocabulary"],
      limit: 3,
    },
  );
  const tierResults = searchStandardVocabularySeeds("Do not jump escalation tiers", {
    sourceIds: ["event-engine-vocabulary"],
    limit: 3,
  });
  const graphNode = findSemanticSeedGraphNodeById(
    "event-engine-vocabulary:third_party_flirtation_event",
  );

  assert.equal(seeds.length, EVENT_ENGINE_VOCABULARY_STANDARD_SEEDS.length);
  assert.equal(flirtationResults[0]?.label, "Third-Party Flirtation Event");
  assert.equal(
    tierResults.some((seed) => seed.label === "Tier 3 - Major Event"),
    true,
  );
  assert.equal(graphNode?.category, "triggers");
  assert.equal(graphNode?.label, "Third-Party Flirtation Event");
});
