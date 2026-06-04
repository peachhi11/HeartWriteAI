import assert from "node:assert/strict";
import test from "node:test";

import {
  APPEARANCE_PRESET_CATEGORIES,
  APPEARANCE_PRESETS,
  compileAppearancePresetAdditions,
  findAppearancePresetById,
  getAppearancePresetsByCategory,
} from "../../data/appearancePresets";

test("loads appearance presets across visual, romance, gate, and dialogue lanes", () => {
  assert.equal(APPEARANCE_PRESETS.length, 203);
  assert.deepEqual(APPEARANCE_PRESET_CATEGORIES, [
    "Appearance",
    "Archetype",
    "Dialogue Seed",
    "Gate",
    "High-Value Seed",
    "Romance Hook",
  ]);

  const ids = APPEARANCE_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getAppearancePresetsByCategory("Archetype").length, 20);
  assert.equal(getAppearancePresetsByCategory("Appearance").length, 120);
  assert.equal(getAppearancePresetsByCategory("Romance Hook").length, 16);
  assert.equal(getAppearancePresetsByCategory("Gate").length, 13);
  assert.equal(getAppearancePresetsByCategory("Dialogue Seed").length, 14);
  assert.equal(getAppearancePresetsByCategory("High-Value Seed").length, 20);
});

test("normalises appearance values for visible prompt text", () => {
  const userSmile = findAppearancePresetById("appearance_romance_user_notices_their_smile");
  const battleWorn = findAppearancePresetById("appearance_seed_battle_worn_beauty");
  const modelLike = findAppearancePresetById("appearance_archetype_model_like");
  const cleanCut = findAppearancePresetById("appearance_seed_clean_cut");
  const userUnmasked = findAppearancePresetById("appearance_romance_user_sees_them_unmasked");

  assert.equal(userSmile?.value, "{{user}} notices their smile");
  assert.equal(battleWorn?.value, "battle-worn beauty");
  assert.equal(modelLike?.value, "Model-Like");
  assert.equal(cleanCut?.value, "clean-cut");
  assert.equal(userUnmasked?.value, "{{user}} sees them unmasked");

  const visibleText = APPEARANCE_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.doesNotMatch(
    visibleText,
    /Use code with caution|user notices|user sees them unmasked|battle_worn|clean_cut|force prose|SYSTEM PROTOCOL/i,
  );
});

test("compiles appearance presets as soft visual-presence guidance", () => {
  const preset = findAppearancePresetById(
    "appearance_high_value_beauty_seen_without_performance_gate",
  );
  assert.ok(preset);

  const additions = compileAppearancePresetAdditions(preset);

  assert.match(additions.appearanceAddition, /Appearance context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft appearance context/i);
  assert.match(additions.systemPromptAddition, /body neutrality, boundaries, and \{\{user\}\} agency intact/i);
  assert.match(additions.systemPromptAddition, /avoid making appearance the character's whole value/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps scar and touch appearance hooks boundary-aware", () => {
  const scarTouch = findAppearancePresetById("appearance_romance_scar_touch_intimacy");
  const hairTouchGate = findAppearancePresetById("appearance_gate_first_hair_touch_gate");
  assert.ok(scarTouch);
  assert.ok(hairTouchGate);

  assert.match(scarTouch.guidance, /boundaries intact/i);
  assert.match(hairTouchGate.guidance, /without forcing attraction or touch/i);
});
