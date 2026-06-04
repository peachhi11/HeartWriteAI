import assert from "node:assert/strict";
import test from "node:test";

import {
  SENSORY_PERCEPTION_PRESET_CATEGORIES,
  SENSORY_PERCEPTION_PRESETS,
  compileSensoryPerceptionPresetAdditions,
  findSensoryPerceptionPresetById,
  getSensoryPerceptionPresetsByCategory,
} from "../../data/sensoryPerceptionPresets";

test("loads sensory perception presets across mode, strength, weakness, romance, and dialogue lanes", () => {
  assert.equal(SENSORY_PERCEPTION_PRESETS.length, 209);
  assert.deepEqual(SENSORY_PERCEPTION_PRESET_CATEGORIES, [
    "Archetype",
    "Dialogue Seed",
    "Gate",
    "High-Value Seed",
    "Romance Hook",
    "Sensory Mode",
    "Sensory Perception",
    "Sensory Strength",
    "Sensory Weakness",
  ]);

  const ids = SENSORY_PERCEPTION_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getSensoryPerceptionPresetsByCategory("Archetype").length, 20);
  assert.equal(getSensoryPerceptionPresetsByCategory("Sensory Perception").length, 55);
  assert.equal(getSensoryPerceptionPresetsByCategory("Sensory Mode").length, 20);
  assert.equal(getSensoryPerceptionPresetsByCategory("Sensory Strength").length, 20);
  assert.equal(getSensoryPerceptionPresetsByCategory("Sensory Weakness").length, 20);
  assert.equal(getSensoryPerceptionPresetsByCategory("Romance Hook").length, 20);
  assert.equal(getSensoryPerceptionPresetsByCategory("Gate").length, 15);
  assert.equal(getSensoryPerceptionPresetsByCategory("Dialogue Seed").length, 19);
  assert.equal(getSensoryPerceptionPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises sensory perception values for visible prompt text", () => {
  const scent = findSensoryPerceptionPresetById(
    "sensory_perception_seed_notices_user_s_scent",
  );
  const footsteps = findSensoryPerceptionPresetById(
    "sensory_perception_romance_recognises_user_by_footsteps",
  );
  const colour = findSensoryPerceptionPresetById(
    "sensory_perception_strength_colour_sensitive",
  );
  const userGate = findSensoryPerceptionPresetById(
    "sensory_perception_gate_first_user_adjusts_environment_gate",
  );

  assert.equal(scent?.value, "notices {{user}}'s scent");
  assert.equal(footsteps?.value, "recognises {{user}} by footsteps");
  assert.equal(colour?.value, "colour sensitive");
  assert.equal(userGate?.value, "first {{user}} adjusts environment gate");

  const visibleText = SENSORY_PERCEPTION_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.doesNotMatch(
    visibleText,
    /Use code with caution|recognizes|color sensitive|notices user|detects user|first user|user becomes|force prose|SYSTEM PROTOCOL/i,
  );
});

test("compiles sensory perception presets as soft sensory guidance", () => {
  const preset = findSensoryPerceptionPresetById(
    "sensory_perception_high_value_love_as_nervous_system_safety",
  );
  assert.ok(preset);

  const additions = compileSensoryPerceptionPresetAdditions(preset);

  assert.match(additions.descriptionAddition, /Sensory perception context/);
  assert.match(additions.personalityAddition, /without making every inference certain/i);
  assert.match(additions.systemPromptAddition, /soft sensory perception context/i);
  assert.match(additions.systemPromptAddition, /preserve \{\{user\}\} agency/i);
  assert.match(additions.systemPromptAddition, /avoid treating sensory distress as romantic proof/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps overload and touch hooks consent-aware", () => {
  const overload = findSensoryPerceptionPresetById(
    "sensory_perception_weakness_sensory_overload",
  );
  const touch = findSensoryPerceptionPresetById(
    "sensory_perception_romance_touch_permission_scene",
  );
  assert.ok(overload);
  assert.ok(touch);

  assert.match(overload.guidance, /accommodation, consent-aware care, recovery/i);
  assert.match(touch.guidance, /consent-aware noticing, care, grounding/i);
});
