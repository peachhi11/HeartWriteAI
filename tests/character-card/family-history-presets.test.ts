import assert from "node:assert/strict";
import test from "node:test";

import {
  compileFamilyHistoryPresetAdditions,
  FAMILY_HISTORY_CATEGORIES,
  FAMILY_HISTORY_PRESETS,
  findFamilyHistoryPresetById,
  getFamilyHistoryPresetsByCategory,
} from "../../data/familyHistoryPresets";

test("loads family history presets with stable ids and categories", () => {
  assert.equal(FAMILY_HISTORY_PRESETS.length, 4);
  assert.deepEqual(FAMILY_HISTORY_CATEGORIES, [
    "Dark Romance/Noir",
    "Fantasy/Mythic",
    "Historical/Period",
    "Sci-Fi/Cyberpunk",
  ]);

  const ids = FAMILY_HISTORY_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("fam_")));
  assert.equal(
    getFamilyHistoryPresetsByCategory("Dark Romance/Noir")[0]?.id,
    "fam_dark_syndicate_dynasty",
  );
});

test("removes pasted boilerplate and fixes obvious typo", () => {
  const allText = JSON.stringify(FAMILY_HISTORY_PRESETS);
  const dark = findFamilyHistoryPresetById("fam_dark_syndicate_dynasty");

  assert.ok(dark?.lexicalTokens.dynasticVerbs.includes("launder"));
  assert.doesNotMatch(allText, /\blunder\b/);
  assert.doesNotMatch(allText, /must|enforce|forces the character card/i);
});

test("compiles family history as soft lineage guidance", () => {
  const preset = findFamilyHistoryPresetById("fam_hist_palace_coup");
  assert.ok(preset);

  const additions = compileFamilyHistoryPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Family history preset/);
  assert.match(additions.personalityAddition, /Family history behaviour texture/);
  assert.match(additions.systemPromptAddition, /Family history guidance/);
  assert.match(additions.systemPromptAddition, /soft lineage guidance/i);
  assert.match(additions.systemPromptAddition, /do not override player agency/i);
  assert.match(additions.systemPromptAddition, /avoid reducing the character to family history alone/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must adjust|force|replicate/i);
});
