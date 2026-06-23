import assert from "node:assert/strict";
import test from "node:test";

import {
  FIRST_MESSAGE_GENERATOR_VOCABULARY_STANDARD_SEEDS,
  compileFirstMessageDraft,
  firstMessageConstraints,
  firstMessageGeneratorPrinciples,
  firstMessageGeneratorSemanticChain,
  firstMessageOutputTemplate,
  firstMessageSheetInputs,
  firstMessageStructure,
  firstMessageVariations,
} from "../../data/firstMessageGeneratorVocabularyPresets";
import { findSemanticSeedGraphNodeById } from "../../data/semanticSeedRegistry";
import {
  getRichStandardVocabularySeedsBySource,
  searchStandardVocabularySeeds,
} from "../../data/standardVocabularySeedRegistry";

test("defines first message generation as sheet-to-starter structure", () => {
  assert.deepEqual(firstMessageGeneratorSemanticChain, [
    "Character Sheet",
    "Core Traits",
    "Speech Profile",
    "Behavior Profile",
    "Motivational Drivers",
    "Worldview",
    "Opening Hook",
    "Character Action",
    "Interpretation Layer",
    "Dialogue",
    "Subtext",
    "Tension or Invitation",
  ]);
  assert.equal(
    firstMessageGeneratorPrinciples.includes(
      "The opener should imply personality, power dynamic, and emotional stance.",
    ),
    true,
  );
  assert.equal(
    firstMessageConstraints.includes(
      "No generic greetings such as hi or hello.",
    ),
    true,
  );
});

test("pulls first message inputs from the character sheet", () => {
  assert.deepEqual(
    firstMessageSheetInputs.map((input) => input.seed),
    [
      "core_traits",
      "speech_profile",
      "behavior_profile",
      "motivational_drivers",
      "worldview",
    ],
  );
  assert.equal(
    firstMessageSheetInputs.find((input) => input.seed === "speech_profile")?.controls,
    "Voice and quirks.",
  );
  assert.match(
    firstMessageSheetInputs.find((input) => input.seed === "motivational_drivers")
      ?.promptUse ?? "",
    /unspoken want/,
  );
});

test("stores hook, action, interpretation, dialogue, and subtext structure", () => {
  const hook = firstMessageStructure.find((part) => part.seed === "hook");
  const action = firstMessageStructure.find(
    (part) => part.seed === "character_action",
  );
  const interpretation = firstMessageStructure.find(
    (part) => part.seed === "interpretation_layer",
  );
  const dialogue = firstMessageStructure.find((part) => part.seed === "dialogue");

  assert.match(hook?.purpose ?? "", /sensory or situational anchor/);
  assert.equal(
    action?.antiPatterns.includes("smiles vaguely"),
    true,
  );
  assert.equal(
    interpretation?.requirements.includes(
      "avoid writing {{user}}'s thoughts, choices, or reaction",
    ),
    true,
  );
  assert.equal(
    dialogue?.requirements.includes("avoid hi and hello as default openers"),
    true,
  );
});

test("captures starter variation types", () => {
  assert.deepEqual(
    firstMessageVariations.map((variation) => variation.seed),
    [
      "dominant_entry",
      "reactive_entry",
      "slow_burn_entry",
      "high_tension_entry",
    ],
  );
  assert.match(
    firstMessageVariations.find((variation) => variation.seed === "dominant_entry")
      ?.openingBehavior ?? "",
    /resist/,
  );
  assert.match(
    firstMessageVariations.find((variation) => variation.seed === "slow_burn_entry")
      ?.openingBehavior ?? "",
    /immediate confession/,
  );
});

test("compiles a compact first message draft without generic greeting drift", () => {
  const draft = compileFirstMessageDraft({
    variation: "high_tension_entry",
    hook: "Rain ticked against the safehouse windows.",
    action: "Julian slid the deadbolt into place without looking away.",
    dialogue: "\"You picked a dangerous hour to find me.\"",
    interpretation:
      "He measured the distance to the door, then the steadiness of {{user}}'s breathing.",
    tensionHook: "The question he did not ask sat between them anyway.",
  });

  assert.equal(draft.variation.label, "High-Tension Entry");
  assert.equal(draft.template.length, 4);
  assert.match(draft.template[1], /^"You picked/);
  assert.match(draft.compactPrompt, /Avoid generic greetings/);
  assert.deepEqual(firstMessageOutputTemplate.slice(0, 3), [
    "*<environmental or physical action>*",
    "\"<dialogue line>\"",
    "*<micro-reaction or internal interpretation>*",
  ]);
});

test("projects first message seeds into standard vocabulary and semantic graph scenario tags", () => {
  const seeds = getRichStandardVocabularySeedsBySource(
    "first-message-generator-vocabulary",
  );
  const greetingResults = searchStandardVocabularySeeds(
    "No generic greetings such as hi or hello",
    {
      sourceIds: ["first-message-generator-vocabulary"],
      limit: 3,
    },
  );
  const slowBurnResults = searchStandardVocabularySeeds(
    "low intensity while loading the scene with subtext",
    {
      sourceIds: ["first-message-generator-vocabulary"],
      limit: 3,
    },
  );
  const graphNode = findSemanticSeedGraphNodeById(
    "first-message-generator-vocabulary:dialogue_first_message_structure",
  );

  assert.equal(seeds.length, FIRST_MESSAGE_GENERATOR_VOCABULARY_STANDARD_SEEDS.length);
  assert.equal(greetingResults[0]?.label, "Dialogue First Message Structure");
  assert.equal(slowBurnResults[0]?.label, "Slow-Burn Entry");
  assert.equal(graphNode?.category, "scenario_tags");
  assert.equal(graphNode?.label, "Dialogue First Message Structure");
});
