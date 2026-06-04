import assert from "node:assert/strict";
import test from "node:test";

import {
  SETTING_SUBTYPE_PRESET_CATEGORIES,
  SETTING_SUBTYPE_PRESETS,
  compileSettingSubtypePresetAdditions,
  findSettingSubtypePresetById,
  getSettingSubtypePresetsByCategory,
} from "../../data/settingSubtypePresets";

test("loads setting subtype presets across place, conflict, romance, and gate lanes", () => {
  assert.equal(SETTING_SUBTYPE_PRESETS.length, 257);
  assert.deepEqual(SETTING_SUBTYPE_PRESET_CATEGORIES, [
    "Conflict Pressure",
    "Fantasy Subtype",
    "Gate",
    "High-Value Setting Tag",
    "Institutional Subtype",
    "Preset",
    "Romance Hook",
    "Romance Location",
    "Sci-Fi Subtype",
    "Setting Subtype",
    "Settlement Subtype",
  ]);

  const ids = SETTING_SUBTYPE_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getSettingSubtypePresetsByCategory("Preset").length, 20);
  assert.equal(getSettingSubtypePresetsByCategory("Setting Subtype").length, 62);
  assert.equal(getSettingSubtypePresetsByCategory("Conflict Pressure").length, 20);
  assert.equal(getSettingSubtypePresetsByCategory("Romance Hook").length, 20);
  assert.equal(getSettingSubtypePresetsByCategory("Gate").length, 15);
});

test("normalises setting subtype values for visible prompt text", () => {
  const theatre = findSettingSubtypePresetById("setting_subtype_theatre");
  const lifeSupport = findSettingSubtypePresetById(
    "setting_subtype_hook_space_station_life_support_confession",
  );
  const safehouse = findSettingSubtypePresetById("setting_subtype_high_value_safehouse");
  const visibleText = SETTING_SUBTYPE_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(theatre?.value, "theatre");
  assert.equal(lifeSupport?.value, "space station life-support confession");
  assert.equal(safehouse?.value, "safehouse");
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|life_support|storm_shelter_one_bed|force prose|SYSTEM PROTOCOL/i,
  );
});

test("compiles setting subtype presets as soft place context", () => {
  const preset = findSettingSubtypePresetById("setting_subtype_safehouse");
  assert.ok(preset);

  const additions = compileSettingSubtypePresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Setting context/);
  assert.match(additions.scenarioAddition, /without trapping the scene/i);
  assert.match(additions.systemPromptAddition, /soft setting context/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} agency intact/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
