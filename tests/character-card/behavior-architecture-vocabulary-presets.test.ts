import assert from "node:assert/strict";
import test from "node:test";

import {
  BEHAVIOR_ARCHITECTURE_VOCABULARY_STANDARD_SEEDS,
  behaviorArchitectureEventDomains,
  behaviorArchitectureLayers,
  behaviorArchitecturePrinciples,
  behaviorArchitectureStates,
  characterCardEngineeringLayers,
  characterCardLayerControls,
  evaluateBehaviorArchitectureState,
} from "../../data/behaviorArchitectureVocabularyPresets";
import { findSemanticSeedGraphNodeById } from "../../data/semanticSeedRegistry";
import {
  getRichStandardVocabularySeedsBySource,
  searchStandardVocabularySeeds,
} from "../../data/standardVocabularySeedRegistry";

test("defines the three-layer character-card engineering model", () => {
  assert.deepEqual(
    behaviorArchitectureLayers.map((layer) => layer.seed),
    ["character_layer", "writing_layer", "context_architecture_layer"],
  );
  assert.equal(
    behaviorArchitecturePrinciples.includes(
      "Metrics act as resistance and flavor, not absolute locks.",
    ),
    true,
  );
  assert.equal(
    behaviorArchitecturePrinciples.includes(
      "Concept matching should lead keyword matching; keyword lists are examples, not the full trigger surface.",
    ),
    true,
  );
});

test("separates character, writing, and context architecture controls", () => {
  const characterLayer = characterCardEngineeringLayers.find(
    (layer) => layer.seed === "character_layer",
  );
  const writingLayer = characterCardEngineeringLayers.find(
    (layer) => layer.seed === "writing_layer",
  );
  const contextLayer = characterCardEngineeringLayers.find(
    (layer) => layer.seed === "context_architecture_layer",
  );
  const writingControls = characterCardLayerControls.filter(
    (control) => control.layer === "writing_layer",
  );
  const contextControls = characterCardLayerControls.filter(
    (control) => control.layer === "context_architecture_layer",
  );

  assert.deepEqual(characterLayer?.controls, [
    "description",
    "personality",
    "history",
    "relationships",
    "motivations",
    "goals",
    "flaws",
    "examples",
    "character_books",
    "reinforcement",
    "behavior_architecture",
  ]);
  assert.deepEqual(writingLayer?.controls, [
    "pov",
    "tense",
    "agency",
    "formatting",
    "continuity",
    "scene_pacing",
    "npc_autonomy",
    "dialogue_style",
    "ooc_diagnostics",
  ]);
  assert.deepEqual(contextLayer?.controls, [
    "description_strategy",
    "solo_party_design",
    "attention_management",
    "field_visibility",
    "reinforcement_placement",
    "authors_notes",
    "post_history",
    "context_decay_mitigation",
    "entropy_management",
  ]);
  assert.equal(
    characterLayer?.description.includes("behavior architecture"),
    true,
  );
  assert.equal(
    writingLayer?.teachingGuidance.includes("presentation problems"),
    true,
  );
  assert.equal(writingControls.length, 9);
  assert.equal(contextControls.length, 9);
  assert.equal(
    writingControls.some((control) => control.seed === "agency_control"),
    true,
  );
  assert.equal(
    contextControls.some((control) => control.seed === "post_history_control"),
    true,
  );
});

test("mines concept-first event domains and observable behavior states", () => {
  const agencyThreat = behaviorArchitectureEventDomains.find(
    (domain) => domain.seed === "agency_threat",
  );
  const tacticalAlliance = behaviorArchitectureEventDomains.find(
    (domain) => domain.seed === "tactical_alliance",
  );
  const hostileDefiance = behaviorArchitectureStates.find(
    (state) => state.seed === "hostile_defiance",
  );

  assert.equal(behaviorArchitectureEventDomains.length, 4);
  assert.equal(behaviorArchitectureStates.length, 5);
  assert.match(agencyThreat?.conceptDescription ?? "", /autonomy/);
  assert.equal(tacticalAlliance?.activatesStates.includes("trusted_ally_during_crisis"), true);
  assert.equal(hostileDefiance?.observableActions.includes("sets a verbal boundary"), true);
});

test("evaluates metrics as delivery flavor instead of hard locks", () => {
  const lowTrustAlliance = evaluateBehaviorArchitectureState({
    conceptMatches: ["tactical_alliance"],
    trust: 10,
    stress: 35,
  });
  const vulnerableWithoutPartnership = evaluateBehaviorArchitectureState({
    conceptMatches: ["vulnerability_shared"],
    trust: 20,
    stress: 25,
    activePartnership: false,
  });
  const catharsisUnderStress = evaluateBehaviorArchitectureState({
    conceptMatches: ["vulnerability_shared"],
    trust: 20,
    stress: 70,
    activePartnership: false,
  });

  assert.equal(lowTrustAlliance.activeStates.includes("trusted_ally_during_crisis"), true);
  assert.match(lowTrustAlliance.behaviorGuidance, /Low trust|Trust is low/i);
  assert.equal(vulnerableWithoutPartnership.activeStates.includes("analytical_neutral"), true);
  assert.equal(vulnerableWithoutPartnership.activeStates.includes("catharsis_unlocked"), false);
  assert.equal(catharsisUnderStress.activeStates.includes("catharsis_unlocked"), true);
});

test("projects behavior architecture into standard vocabulary and semantic graph nodes", () => {
  const seeds = getRichStandardVocabularySeedsBySource(
    "behavior-architecture-vocabulary",
  );
  const searchResults = searchStandardVocabularySeeds("threat to autonomy", {
    sourceIds: ["behavior-architecture-vocabulary"],
    limit: 3,
  });
  const writingLayerResults = searchStandardVocabularySeeds("scene pacing", {
    sourceIds: ["behavior-architecture-vocabulary"],
    limit: 5,
  });
  const graphNode = findSemanticSeedGraphNodeById(
    "behavior-architecture-vocabulary:trusted_ally_during_crisis",
  );

  assert.equal(seeds.length, BEHAVIOR_ARCHITECTURE_VOCABULARY_STANDARD_SEEDS.length);
  assert.equal(searchResults[0]?.label, "Agency Threat");
  assert.equal(
    writingLayerResults.some((seed) => seed.label === "Scene Pacing Control"),
    true,
  );
  assert.equal(graphNode?.category, "responses");
  assert.equal(graphNode?.label, "Trusted Ally During Crisis");
});
