import assert from "node:assert/strict";
import test from "node:test";

import {
  OCCUPATION_PRESET_CATEGORIES,
  OCCUPATION_PRESETS,
  compileOccupationPresetAdditions,
  findOccupationPresetById,
  getOccupationPresetsByCategory,
} from "../../data/occupationPresets";

test("loads occupation presets across role and romance hook lanes", () => {
  assert.equal(OCCUPATION_PRESETS.length, 242);
  assert.deepEqual(OCCUPATION_PRESET_CATEGORIES, [
    "Archetype",
    "High-Value Occupation Tag",
    "Occupation",
    "Romance Hook",
  ]);

  const ids = OCCUPATION_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getOccupationPresetsByCategory("Archetype").length, 30);
  assert.equal(getOccupationPresetsByCategory("Occupation").length, 172);
  assert.equal(getOccupationPresetsByCategory("Romance Hook").length, 20);
  assert.equal(getOccupationPresetsByCategory("High-Value Occupation Tag").length, 20);
});

test("normalises occupation values for visible prompt use", () => {
  const adviser = findOccupationPresetById("occupation_role_royal_adviser");
  const jeweller = findOccupationPresetById("occupation_role_jeweller");
  const artist = findOccupationPresetById("occupation_hook_artist_paints_user");
  const boss = findOccupationPresetById(
    "occupation_hook_criminal_boss_soft_for_user",
  );
  const allText = JSON.stringify(OCCUPATION_PRESETS);

  assert.equal(adviser?.value, "royal adviser");
  assert.equal(jeweller?.value, "jeweller");
  assert.equal(artist?.value, "artist paints {{user}}");
  assert.equal(boss?.value, "criminal boss soft for {{user}}");
  assert.doesNotMatch(allText, /Use code with caution|advisor|jeweler|artist paints user/i);
});

test("compiles occupation presets as soft role context", () => {
  const preset = findOccupationPresetById("occupation_role_bodyguard");
  assert.ok(preset);

  const additions = compileOccupationPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Occupation context/);
  assert.match(additions.personalityAddition, /without replacing personality/i);
  assert.match(additions.systemPromptAddition, /soft role context/i);
  assert.match(additions.systemPromptAddition, /preserve consent, boundaries, and \{\{user\}\} autonomy/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
