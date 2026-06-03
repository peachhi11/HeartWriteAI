import assert from "node:assert/strict";
import test from "node:test";

import {
  MORALITY_PRESET_CATEGORIES,
  MORALITY_PRESETS,
  compileMoralityPresetAdditions,
  findMoralityPresetById,
  getMoralityPresetsByCategory,
} from "../../data/moralityPresets";

test("loads morality presets across moral compass lanes", () => {
  assert.equal(MORALITY_PRESETS.length, 245);
  assert.deepEqual(MORALITY_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Dialogue Seed",
    "Emotional Flavour",
    "Gate",
    "Method",
    "Morality Type",
    "Motivation",
    "Romance Trope",
    "Trigger Event",
    "Wound",
  ]);

  const ids = MORALITY_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("morality_")));
  assert.equal(
    getMoralityPresetsByCategory("Archetype").find(
      (preset) => preset.value === "The Morally Grey Lover",
    )?.id,
    "morality_archetype_the_morally_grey_lover",
  );
});

test("normalises readable morality values and frames risky methods safely", () => {
  const allText = JSON.stringify(MORALITY_PRESETS);
  const valueText = MORALITY_PRESETS.map((preset) => preset.value).join("\n");
  const method = findMoralityPresetById("morality_method_moral_blackmail");
  const trope = findMoralityPresetById("morality_trope_corrupted_saviour");
  const dialogue = findMoralityPresetById(
    "morality_dialogue_do_not_romanticise_what_i_have_done",
  );
  const behaviour = findMoralityPresetById(
    "morality_behaviour_keeps_code_of_honour",
  );

  assert.equal(method?.value, "moral blackmail");
  assert.match(method?.guidance ?? "", /consequence-aware/i);
  assert.match(method?.guidance ?? "", /player-agency safe/i);
  assert.equal(trope?.value, "corrupted saviour");
  assert.equal(dialogue?.value, "Do not romanticise what I have done.");
  assert.equal(behaviour?.value, "keeps code of honour");
  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.doesNotMatch(
    valueText,
    /morally_gray|uphold_honor|honorable|savior|self_serving|self_loathing|survivors_guilt|love_vs_principle|romanticize/i,
  );
});

test("compiles morality presets as soft moral compass guidance", () => {
  const preset = findMoralityPresetById(
    "morality_archetype_the_morally_grey_lover",
  );
  assert.ok(preset);

  const additions = compileMoralityPresetAdditions(preset);

  assert.match(
    additions.backgroundAddition,
    /Morality preset: Archetype - The Morally Grey Lover/,
  );
  assert.match(additions.personalityAddition, /Morality archetype texture/);
  assert.match(additions.systemPromptAddition, /Morality guidance/);
  assert.match(additions.systemPromptAddition, /soft moral context/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /must|force|critical|completely overwrite/i,
  );
});
