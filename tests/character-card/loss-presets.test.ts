import assert from "node:assert/strict";
import test from "node:test";

import {
  LOSS_PRESET_CATEGORIES,
  LOSS_PRESETS,
  compileLossPresetAdditions,
  findLossPresetById,
  getLossPresetsByCategory,
} from "../../data/lossPresets";

test("loads loss presets across all useful vocabulary lanes", () => {
  assert.equal(LOSS_PRESETS.length, 222);
  assert.deepEqual(LOSS_PRESET_CATEGORIES, [
    "Archetype",
    "Cause",
    "Coping Style",
    "Dialogue Seed",
    "Grief Expression",
    "Internal Wound",
    "Loss Taxonomy",
    "Lost Object",
    "Recovery Route",
    "Romance Impact",
    "Trigger Event",
  ]);

  const ids = LOSS_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("loss_")));
  assert.equal(
    getLossPresetsByCategory("Romance Impact").find((preset) => preset.value === "trusts slowly")?.id,
    "loss_romance_trusts_slowly",
  );
});

test("removes pasted architecture notes and normalises readable loss values", () => {
  const allText = JSON.stringify(LOSS_PRESETS);
  const valueText = LOSS_PRESETS.map((preset) => preset.value).join("\n");
  const coping = findLossPresetById("loss_coping_humour");
  const wound = findLossPresetById("loss_wound_survivor_s_guilt");
  const romance = findLossPresetById("loss_romance_romanticises_the_past");

  assert.equal(coping?.value, "humour");
  assert.equal(wound?.value, "survivor's guilt");
  assert.equal(romance?.value, "romanticises the past");
  assert.match(coping?.guidance ?? "", /consequence-aware and agency-preserving/i);
  assert.doesNotMatch(allText, /activateRoute|sadness|Loss\s*\n├|Use code with caution/i);
  assert.doesNotMatch(valueText, /self_destructive|hyper_independent|death_loss|fear_of_loss_repeating/i);
});

test("compiles loss presets as soft grief and event-gated guidance", () => {
  const preset = findLossPresetById("loss_archetype_the_memory_keeper");
  assert.ok(preset);

  const additions = compileLossPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Loss preset: Archetype - The Memory Keeper/);
  assert.match(additions.personalityAddition, /Loss archetype texture/);
  assert.match(additions.systemPromptAddition, /Loss guidance/);
  assert.match(additions.systemPromptAddition, /keyword triggers and event gates as soft context/i);
  assert.match(additions.systemPromptAddition, /do not override player agency/i);
  assert.match(additions.systemPromptAddition, /avoid reducing the character to grief-only behaviour/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force|critical|completely overwrite/i);
});
