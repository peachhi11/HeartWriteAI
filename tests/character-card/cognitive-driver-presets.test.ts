import assert from "node:assert/strict";
import test from "node:test";

import {
  COGNITIVE_DRIVER_PRESET_CATEGORIES,
  COGNITIVE_DRIVER_PRESETS,
  cognitiveDistortionSeeds,
  cognitiveDriverPresets,
  cognitivePersonalityComplexSeeds,
  cognitiveSkillDriverSeeds,
  cognitiveValueSeeds,
  compileCognitiveDriverPresetAdditions,
  findCognitiveDriverPresetById,
  getCognitiveDriverPresetsByCategory,
  highValueCognitiveDriverSeeds,
  internalBeliefSeeds,
  internalDialogueSeeds,
  introversionExtroversionSeeds,
  moralFrameworkSeeds,
  neuroticismDriverSeeds,
  perceptionSeeds,
  reciprocalDeterminismSeeds,
} from "../../data/cognitiveDriverPresets";

test("loads cognitive driver presets across thinking, belief, perception, value, and ethics lanes", () => {
  assert.equal(COGNITIVE_DRIVER_PRESETS.length, 260);
  assert.deepEqual(COGNITIVE_DRIVER_PRESET_CATEGORIES, [
    "Archetype",
    "Cognitive Distortion",
    "Cognitive Personality Complex",
    "Emotional Stability",
    "High-Value Seed",
    "Internal Belief",
    "Internal Dialogue",
    "Moral Framework",
    "Perception Filter",
    "Reciprocal Determinism",
    "Skill Driver",
    "Social Energy",
    "Value Driver",
  ]);

  const ids = COGNITIVE_DRIVER_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(cognitiveDriverPresets.length, 20);
  assert.equal(cognitiveSkillDriverSeeds.length, 20);
  assert.equal(introversionExtroversionSeeds.length, 20);
  assert.equal(neuroticismDriverSeeds.length, 20);
  assert.equal(cognitivePersonalityComplexSeeds.length, 20);
  assert.equal(reciprocalDeterminismSeeds.length, 20);
  assert.equal(internalBeliefSeeds.length, 20);
  assert.equal(internalDialogueSeeds.length, 20);
  assert.equal(perceptionSeeds.length, 20);
  assert.equal(cognitiveDistortionSeeds.length, 20);
  assert.equal(cognitiveValueSeeds.length, 20);
  assert.equal(moralFrameworkSeeds.length, 20);
  assert.equal(highValueCognitiveDriverSeeds.length, 20);
});

test("normalises cognitive driver values while preserving raw trigger keys", () => {
  const relationshipThinker = findCognitiveDriverPresetById(
    "cognitive_driver_archetype_the_relationship_centred_thinker",
  );
  const behaviourLoop = findCognitiveDriverPresetById(
    "cognitive_driver_reciprocal_determinism_behaviour_shapes_environment",
  );
  const labelling = findCognitiveDriverPresetById(
    "cognitive_driver_distortion_labelling",
  );
  const honour = findCognitiveDriverPresetById(
    "cognitive_driver_moral_framework_honour_ethics",
  );
  const visibleText = COGNITIVE_DRIVER_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(relationshipThinker?.value, "The Relationship-Centred Thinker");
  assert.equal(relationshipThinker?.triggerKeys.includes("The Relationship-Centered Thinker"), true);
  assert.equal(behaviourLoop?.value, "behaviour shapes environment");
  assert.equal(behaviourLoop?.triggerKeys.includes("behavior_shapes_environment"), true);
  assert.equal(labelling?.value, "labelling");
  assert.equal(labelling?.triggerKeys.includes("labeling"), true);
  assert.equal(honour?.value, "honour ethics");
  assert.equal(honour?.triggerKeys.includes("honor_ethics"), true);
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|force prose|must override|behavior shapes|honor ethics|labeling/i,
  );
});

test("finds cognitive driver presets by category and stable id", () => {
  assert.equal(getCognitiveDriverPresetsByCategory("Archetype").length, 20);
  assert.equal(getCognitiveDriverPresetsByCategory("Skill Driver").length, 20);
  assert.equal(getCognitiveDriverPresetsByCategory("Internal Belief").length, 20);
  assert.equal(getCognitiveDriverPresetsByCategory("Cognitive Distortion").length, 20);
  assert.equal(getCognitiveDriverPresetsByCategory("Moral Framework").length, 20);
  assert.equal(
    findCognitiveDriverPresetById(
      "cognitive_driver_internal_belief_everyone_leaves",
    )?.value,
    "everyone leaves",
  );
  assert.equal(
    findCognitiveDriverPresetById(
      "cognitive_driver_high_value_care_ethics",
    )?.value,
    "care ethics",
  );
});

test("compiles cognitive drivers as soft non-diagnostic context", () => {
  const preset = findCognitiveDriverPresetById(
    "cognitive_driver_distortion_mind_reading",
  );
  assert.ok(preset);

  const additions = compileCognitiveDriverPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Cognitive driver context/);
  assert.match(additions.personalityAddition, /decision-making, belief, perception, or value pattern/i);
  assert.match(additions.personalityAddition, /authored psychology/i);
  assert.match(additions.systemPromptAddition, /soft cognitive-driver context/i);
  assert.match(additions.systemPromptAddition, /internal dialogue/i);
  assert.match(additions.systemPromptAddition, /Do not diagnose/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} agency/i);
  assert.doesNotMatch(additions.systemPromptAddition, /force prose|must override/i);
});
