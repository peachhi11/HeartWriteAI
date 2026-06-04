import assert from "node:assert/strict";
import test from "node:test";

import {
  PHYSICAL_DESCRIPTION_PRESET_CATEGORIES,
  PHYSICAL_DESCRIPTION_PRESETS,
  compilePhysicalDescriptionPresetAdditions,
  findPhysicalDescriptionPresetById,
  getPhysicalDescriptionPresetsByCategory,
} from "../../data/physicalDescriptionPresets";

test("loads physical description presets across appearance, romance, gates, and dialogue lanes", () => {
  assert.equal(PHYSICAL_DESCRIPTION_PRESETS.length, 236);
  assert.deepEqual(PHYSICAL_DESCRIPTION_PRESET_CATEGORIES, [
    "Archetype",
    "Dialogue Seed",
    "Gate",
    "High-Value Seed",
    "Physical Description",
    "Romance Hook",
  ]);

  const ids = PHYSICAL_DESCRIPTION_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getPhysicalDescriptionPresetsByCategory("Archetype").length, 20);
  assert.equal(getPhysicalDescriptionPresetsByCategory("Physical Description").length, 140);
  assert.equal(getPhysicalDescriptionPresetsByCategory("Romance Hook").length, 20);
  assert.equal(getPhysicalDescriptionPresetsByCategory("Gate").length, 13);
  assert.equal(getPhysicalDescriptionPresetsByCategory("Dialogue Seed").length, 19);
  assert.equal(getPhysicalDescriptionPresetsByCategory("High-Value Seed").length, 24);
});

test("normalises physical description values for visible prompt text", () => {
  const userSmile = findPhysicalDescriptionPresetById(
    "physical_description_romance_user_notices_their_smile",
  );
  const greyEyes = findPhysicalDescriptionPresetById("physical_description_seed_grey_eyes");
  const eyeColour = findPhysicalDescriptionPresetById(
    "physical_description_seed_unnatural_eye_colour",
  );
  const duplicateDialogueFix = findPhysicalDescriptionPresetById(
    "physical_description_dialogue_how_did_i_smile",
  );

  assert.equal(userSmile?.value, "{{user}} notices their smile");
  assert.equal(greyEyes?.value, "grey eyes");
  assert.equal(eyeColour?.value, "unnatural eye colour");
  assert.equal(duplicateDialogueFix?.value, "How did I smile?");

  const visibleText = PHYSICAL_DESCRIPTION_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.doesNotMatch(
    visibleText,
    /Use code with caution|gray eyes|gray_eyes|eye color|user notices|user sees them unmasked|force prose|SYSTEM PROTOCOL/i,
  );
});

test("compiles physical description presets as soft body-neutral context", () => {
  const preset = findPhysicalDescriptionPresetById(
    "physical_description_high_value_beauty_seen_without_performance_gate",
  );
  assert.ok(preset);

  const additions = compilePhysicalDescriptionPresetAdditions(preset);

  assert.match(additions.appearanceAddition, /Physical description context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft physical description context/i);
  assert.match(additions.systemPromptAddition, /body neutrality, and \{\{user\}\} agency intact/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps scar and touch hooks boundary-aware", () => {
  const scarTouch = findPhysicalDescriptionPresetById(
    "physical_description_romance_scar_touch_intimacy",
  );
  const hairTouchGate = findPhysicalDescriptionPresetById(
    "physical_description_gate_first_hair_touch_gate",
  );
  assert.ok(scarTouch);
  assert.ok(hairTouchGate);

  assert.match(scarTouch.guidance, /boundaries intact/i);
  assert.match(hairTouchGate.guidance, /trust, intimacy, history/i);
});
