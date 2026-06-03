import assert from "node:assert/strict";
import test from "node:test";

import {
  compileExilePresetAdditions,
  EXILE_PRESET_CATEGORIES,
  EXILE_PRESETS,
  findExilePresetById,
  getExilePresetsByCategory,
} from "../../data/exilePresets";

test("loads exile presets with stable ids and categories", () => {
  assert.equal(EXILE_PRESETS.length, 4);
  assert.deepEqual(EXILE_PRESET_CATEGORIES, [
    "Geographical Banishment",
    "Palace Outcast",
    "Social Excommunication",
    "Systemic Deletion",
  ]);

  const ids = EXILE_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("exile_")));
  assert.equal(
    getExilePresetsByCategory("Palace Outcast")[0]?.id,
    "exile_palace_outcast",
  );
});

test("removes pasted boilerplate and repairs malformed final object", () => {
  const allText = JSON.stringify(EXILE_PRESETS);
  const palace = findExilePresetById("exile_palace_outcast");
  const systemic = findExilePresetById("exile_systemic_deletion");

  assert.ok(palace?.lexicalTokens.isolationNouns.includes("courtly"));
  assert.ok(systemic?.lexicalTokens.signatureVerbs.includes("sanitise"));
  assert.doesNotMatch(allText, new RegExp(["Use", "code", "with", "caution"].join(" "), "i"));
  assert.doesNotMatch(allText, /ccv3Metadata|v3LorebookEntry|constant_memory/i);
  assert.doesNotMatch(allText, /CRITICAL|must completely|Enforce this|completely overwriting/i);
  assert.doesNotMatch(allText, /behavioral_block|prioritization|civilized|sanitize/i);
});

test("compiles exile presets as soft displacement guidance", () => {
  const preset = findExilePresetById("exile_social_excommunication");
  assert.ok(preset);

  const additions = compileExilePresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Exile preset/);
  assert.match(additions.personalityAddition, /Exile behaviour texture/);
  assert.match(additions.systemPromptAddition, /Exile guidance/);
  assert.match(additions.systemPromptAddition, /soft displacement guidance/i);
  assert.match(additions.systemPromptAddition, /do not override player agency/i);
  assert.match(additions.systemPromptAddition, /avoid reducing the character to exile-only behaviour/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must adjust|force|replicate|enforce/i);
});
