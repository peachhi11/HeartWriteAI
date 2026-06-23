import assert from "node:assert/strict";
import test from "node:test";

import {
  DIALOGUE_CONTROL_VOCABULARY_STANDARD_SEEDS,
  compileDialogueControlProfile,
  dialogueArcPhaseDefinitions,
  dialogueControlConcepts,
  dialogueControlPrinciples,
  dialogueControlSemanticChain,
  dialogueFunctionDefinitions,
  dialogueStateModulations,
} from "../../data/dialogueControlVocabularyPresets";
import { findSemanticSeedGraphNodeById } from "../../data/semanticSeedRegistry";
import {
  getRichStandardVocabularySeedsBySource,
  searchStandardVocabularySeeds,
} from "../../data/standardVocabularySeedRegistry";

test("defines dialogue control as voice plus state plus arc plus variation", () => {
  assert.deepEqual(dialogueControlSemanticChain, [
    "Character Sheet",
    "Dynamic State System",
    "Narrative Arc Phase",
    "Variation Engine",
    "Subtext",
    "Dialogue Function",
    "Performed Dialogue",
  ]);
  assert.equal(
    dialogueControlPrinciples.includes(
      "Dialogue evolves from baseline voice, current emotional state, and route phase.",
    ),
    true,
  );
  assert.equal(
    dialogueControlPrinciples.includes(
      "Subtext should carry emotional truth when direct confession would flatten tension.",
    ),
    true,
  );
});

test("captures the expected dialogue control lanes", () => {
  assert.deepEqual(
    dialogueControlConcepts.map((concept) => concept.seed),
    [
      "voice_anchoring",
      "variation_engine",
      "state_based_modulation",
      "arc_based_dialogue_evolution",
      "subtext_layer",
      "dialogue_function_rotation",
      "quirk_deployment",
      "silence_and_negative_space",
      "dialogue_memory",
      "minimal_dialogue_control",
    ],
  );
  assert.equal(dialogueFunctionDefinitions.length, 6);
  assert.deepEqual(
    dialogueArcPhaseDefinitions.map((phase) => phase.seed),
    ["initiation", "development", "escalation", "crisis", "resolution"],
  );
  assert.equal(dialogueStateModulations.length, 6);
});

test("compiles dialogue control profiles into concise prompt routing", () => {
  const profile = compileDialogueControlProfile({
    baselineVoice: ["blunt", "short sentences", "minimal filler"],
    activeStates: ["low_trust", "high_attraction"],
    arcPhase: "escalation",
    recentFunctions: ["probe", "push"],
    repeatedPhrases: ["I do not care"],
  });

  assert.match(profile.voiceAnchor, /blunt/);
  assert.match(profile.stateGuidance, /Low Trust/);
  assert.match(profile.stateGuidance, /High Attraction/);
  assert.match(profile.arcGuidance, /Escalation phase/);
  assert.match(profile.functionGuidance, /pull|deflect|reveal/);
  assert.match(profile.variationGuidance, /Do not reuse: I do not care/);
  assert.match(profile.compactPrompt, /Use subtext, silence, and action beats/);
});

test("projects dialogue control into standard vocabulary and semantic graph nodes", () => {
  const seeds = getRichStandardVocabularySeedsBySource(
    "dialogue-control-vocabulary",
  );
  const subtextResults = searchStandardVocabularySeeds(
    "harder to ignore than you should be",
    {
      sourceIds: ["dialogue-control-vocabulary"],
      limit: 3,
    },
  );
  const antiRepeatResults = searchStandardVocabularySeeds("No repeated phrases", {
    sourceIds: ["dialogue-control-vocabulary"],
    limit: 3,
  });
  const graphNode = findSemanticSeedGraphNodeById(
    "dialogue-control-vocabulary:subtext_layer",
  );

  assert.equal(seeds.length, DIALOGUE_CONTROL_VOCABULARY_STANDARD_SEEDS.length);
  assert.equal(subtextResults[0]?.label, "Subtext Layer");
  assert.equal(
    antiRepeatResults.some((seed) => seed.label === "Minimal Dialogue Control"),
    true,
  );
  assert.equal(graphNode?.category, "speech_patterns");
  assert.equal(graphNode?.label, "Subtext Layer");
});
