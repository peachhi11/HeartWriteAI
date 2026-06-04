import assert from "node:assert/strict";
import test from "node:test";

import {
  SCENT_PRESET_CATEGORIES,
  SCENT_PRESETS,
  compileScentPresetAdditions,
  findScentPresetById,
  getScentPresetsByCategory,
} from "../../data/scentPresets";

test("loads scent presets across scent, mood, romance, gate, and dialogue lanes", () => {
  assert.equal(SCENT_PRESETS.length, 177);
  assert.deepEqual(SCENT_PRESET_CATEGORIES, [
    "Archetype",
    "Dialogue Seed",
    "Gate",
    "High-Value Seed",
    "Mood",
    "Romance Hook",
    "Scent",
  ]);

  const ids = SCENT_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getScentPresetsByCategory("Scent").length, 68);
  assert.equal(getScentPresetsByCategory("Romance Hook").length, 20);
  assert.equal(getScentPresetsByCategory("Dialogue Seed").length, 16);
  assert.equal(getScentPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises scent values for visible prompt text", () => {
  const userRecognises = findScentPresetById("scent_romance_user_recognises_scent");
  const shifterRecognises = findScentPresetById(
    "scent_romance_shifter_recognises_user_by_scent",
  );
  const homeLike = findScentPresetById("scent_mood_home_like_scent");
  const visibleText = SCENT_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(userRecognises?.value, "{{user}} recognises scent");
  assert.equal(shifterRecognises?.value, "shifter recognises {{user}} by scent");
  assert.equal(homeLike?.value, "home-like scent");
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|recognizes|user recognizes|shifter recognises user|force prose|SYSTEM PROTOCOL/i,
  );
});

test("compiles scent presets as soft sensory context", () => {
  const preset = findScentPresetById("scent_romance_love_remembered_by_scent");
  assert.ok(preset);

  const additions = compileScentPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Scent context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft scent context/i);
  assert.match(additions.systemPromptAddition, /without forcing intimacy or possession/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps intense scent hooks boundary-aware", () => {
  const blood = findScentPresetById("scent_romance_vampire_notices_blood_scent");
  const mateBond = findScentPresetById("scent_romance_scent_as_mate_bond");
  assert.ok(blood);
  assert.ok(mateBond);

  assert.match(blood.guidance, /boundaries intact/i);
  assert.match(mateBond.guidance, /boundaries intact/i);
});
