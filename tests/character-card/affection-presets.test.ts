import assert from "node:assert/strict";
import test from "node:test";

import {
  AFFECTION_PRESET_CATEGORIES,
  AFFECTION_PRESETS,
  compileAffectionPresetAdditions,
  findAffectionPresetById,
  getAffectionPresetsByCategory,
} from "../../data/affectionPresets";

test("loads affection presets across all useful relationship-comfort lanes", () => {
  assert.equal(AFFECTION_PRESETS.length, 255);
  assert.deepEqual(AFFECTION_PRESET_CATEGORIES, [
    "Affection Type",
    "Aftermath Route",
    "Archetype",
    "Barrier",
    "Behaviour",
    "Dialogue Seed",
    "Emotional Flavour",
    "Gate",
    "Method",
    "Motivation",
    "Romance Trope",
    "Trigger Event",
  ]);

  const ids = AFFECTION_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("affection_")));
  assert.equal(
    getAffectionPresetsByCategory("Behaviour").find(
      (preset) => preset.value === "whispers reassurance",
    )?.id,
    "affection_behaviour_whispers_reassurance",
  );
});

test("normalises readable affection values and frames physical intimacy safely", () => {
  const allText = JSON.stringify(AFFECTION_PRESETS);
  const valueText = AFFECTION_PRESETS.map((preset) => preset.value).join("\n");
  const dialogue = findAffectionPresetById(
    "affection_dialogue_you_are_my_favourite_place_to_come_home_to",
  );
  const method = findAffectionPresetById("affection_method_public_claiming");
  const trope = findAffectionPresetById("affection_trope_slow_burn_touch");

  assert.equal(dialogue?.value, "You are my favourite place to come home to.");
  assert.equal(method?.value, "public claiming");
  assert.equal(trope?.value, "slow-burn touch");
  assert.match(method?.guidance ?? "", /consent-aware/i);
  assert.match(method?.guidance ?? "", /open to refusal/i);
  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.doesNotMatch(
    valueText,
    /physical_affection|fear_of_loss|slow_burn_touch|favorite place|touch_starvation/i,
  );
});

test("compiles affection presets as soft comfort and event-gated guidance", () => {
  const preset = findAffectionPresetById(
    "affection_archetype_the_tender_devotee",
  );
  assert.ok(preset);

  const additions = compileAffectionPresetAdditions(preset);

  assert.match(
    additions.relationshipAddition,
    /Affection preset: Archetype - The Tender Devotee/,
  );
  assert.match(additions.personalityAddition, /Affection archetype texture/);
  assert.match(additions.systemPromptAddition, /Affection guidance/);
  assert.match(additions.systemPromptAddition, /soft relationship context/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /must|force|critical|completely overwrite/i,
  );
});
