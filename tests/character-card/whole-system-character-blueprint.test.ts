import assert from "node:assert/strict";
import test from "node:test";

import {
  compileWholeSystemLorebookScaffold,
  compileWholeSystemCharacterBlueprintPrompt,
  listWholeSystemCharacterBlueprintFields,
  wholeBrainCognitiveQuadrants,
  wholeSystemCharacterBlueprintPipeline,
  wholeSystemCharacterBlueprintSections,
  wholeSystemFeedbackLoop,
  wholeSystemReferenceAxes,
} from "../../data/wholeSystemCharacterBlueprint";

test("defines the whole-system character blueprint sections", () => {
  assert.deepEqual(
    wholeSystemCharacterBlueprintSections.map((section) => section.key),
    [
      "cognitive",
      "psychological",
      "affective_somatic",
      "interpersonal",
    ],
  );
  assert.deepEqual(
    wholeSystemCharacterBlueprintSections.map((section) => section.title),
    [
      "The Cognitive System",
      "The Psychological System",
      "The Affective-Somatic System",
      "The Interpersonal System",
    ],
  );
  assert.deepEqual(
    wholeSystemCharacterBlueprintSections.map((section) => section.fields.length),
    [5, 5, 6, 6],
  );
  assert.equal(listWholeSystemCharacterBlueprintFields().length, 22);
});

test("keeps blueprint fields tagged for future form and semantic routing", () => {
  const fieldKeys = new Set(
    listWholeSystemCharacterBlueprintFields().map((field) => field.key),
  );
  const tags = new Set(
    listWholeSystemCharacterBlueprintFields().flatMap((field) => field.tags),
  );

  assert.equal(fieldKeys.has("dominantQuadrant"), true);
  assert.equal(fieldKeys.has("coreWoundLie"), true);
  assert.equal(fieldKeys.has("autonomicHijackTell"), true);
  assert.equal(fieldKeys.has("repairProtocol"), true);
  assert.equal(tags.has("cognitive_driver"), true);
  assert.equal(tags.has("hidden_need"), true);
  assert.equal(tags.has("somatic"), true);
  assert.equal(tags.has("repair_style"), true);
});

test("compiles filled blueprint sections into concise prompt-safe prose", () => {
  const prompt = compileWholeSystemCharacterBlueprintPrompt({
    characterName: "Julian",
    cognitive: {
      dominantQuadrant: "Upper-left analytical; trusts patterns before feelings.",
      intellectualFrictionTrigger: "Contradictory emotional data with no clean source.",
    },
    psychological: {
      coreWoundLie: "If he is known fully, he will be left.",
      personaMask: "The composed professional who needs nothing.",
    },
    affectiveSomatic: {
      outlawedAffect: "Need.",
      transmutationMechanism: "Turns need into control and cold competence.",
    },
    interpersonal: {
      relationalPolarity: "Moves away first, then circles back when fear eases.",
      repairProtocol: "Fixes the practical problem before naming the hurt.",
    },
  });

  assert.match(prompt, /Whole-system character blueprint: Julian/);
  assert.match(prompt, /The Cognitive System \(The Brain Architecture\)/);
  assert.match(prompt, /Dominant Quadrant: Upper-left analytical/);
  assert.match(prompt, /The Psychological System \(The Core Psyche\)/);
  assert.match(prompt, /Core Wound: If he is known fully/);
  assert.match(prompt, /The Affective-Somatic System \(The Nervous System\)/);
  assert.match(prompt, /Transmutation Mechanism: Turns need into control/);
  assert.match(prompt, /The Interpersonal System \(The Behavioral Coupling\)/);
  assert.match(prompt, /Repair Protocol: Fixes the practical problem/);
  assert.doesNotMatch(prompt, /undefined/);
});

test("keeps the deployment pipeline ordered from wound to external behavior", () => {
  assert.deepEqual(wholeSystemCharacterBlueprintPipeline, [
    "An event hits the psychological wound.",
    "The cognitive system tries to rationalize, solve, or categorize the pressure.",
    "The affective-somatic system produces a visceral response the character cannot fully control.",
    "The interpersonal system discharges that pressure into a flawed external behavior.",
  ]);
});

test("captures cognitive quadrants and architecture reference axes from the SillyTavern card-generator note", () => {
  assert.deepEqual(
    wholeBrainCognitiveQuadrants.map((quadrant) => quadrant.key),
    ["analytical", "conceptual", "organisational", "relational"],
  );
  assert.deepEqual(
    wholeSystemReferenceAxes.map((axis) => axis.key),
    [
      "psychological_stack",
      "emotional_architecture",
      "somatic_anchor",
      "interpersonal_coupling",
    ],
  );
  assert.deepEqual(
    wholeSystemReferenceAxes.map((axis) => axis.entries.length),
    [4, 4, 4, 4],
  );
  assert.equal(
    wholeBrainCognitiveQuadrants
      .find((quadrant) => quadrant.key === "organisational")
      ?.tags.includes("security"),
    true,
  );
  assert.equal(
    wholeSystemReferenceAxes
      .find((axis) => axis.key === "somatic_anchor")
      ?.entries.some((entry) => entry.key === "physical_breakdown"),
    true,
  );
});

test("keeps the whole-system feedback loop closed for long-form roleplay routing", () => {
  assert.deepEqual(wholeSystemFeedbackLoop, [
    "Core wound",
    "Shadow conflict",
    "Ego defense",
    "Cognitive processing",
    "Emotional activation",
    "Somatic response",
    "Interpersonal behavior",
    "Social consequence",
    "Core wound reinforced or challenged",
  ]);
});

test("compiles a concise lorebook scaffold for future SillyTavern-style exports", () => {
  const scaffold = compileWholeSystemLorebookScaffold();

  assert.match(scaffold, /Whole-system character architecture/);
  assert.match(scaffold, /Cognitive quadrants: analytical truth/);
  assert.match(scaffold, /Psychological Stack: Core, Shadow, Ego, Persona/);
  assert.match(scaffold, /Somatic Anchor: Constant Constriction/);
  assert.match(scaffold, /Feedback loop: Core wound -> Shadow conflict/);
  assert.doesNotMatch(scaffold, /undefined/);
});
