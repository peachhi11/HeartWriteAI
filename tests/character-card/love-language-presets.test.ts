import assert from "node:assert/strict";
import test from "node:test";

import {
  LOVE_LANGUAGE_PRESET_CATEGORIES,
  LOVE_LANGUAGE_PRESETS,
  compileLoveLanguagePresetAdditions,
  findLoveLanguagePresetById,
  getLoveLanguagePresetsByCategory,
} from "../../data/loveLanguagePresets";

test("loads love language presets across all affection expression lanes", () => {
  assert.equal(LOVE_LANGUAGE_PRESETS.length, 302);
  assert.deepEqual(LOVE_LANGUAGE_PRESET_CATEGORIES, [
    "Acts of Service",
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Dialogue Seed",
    "Gate",
    "Gift Giving",
    "Love Language Type",
    "Motivation",
    "Physical Touch",
    "Quality Time",
    "Romance Trope",
    "Trigger Event",
    "Words of Affirmation",
    "Wound",
  ]);

  const ids = LOVE_LANGUAGE_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("love_language_")));
  assert.equal(
    getLoveLanguagePresetsByCategory("Gift Giving").find(
      (preset) => preset.value === "gives jewellery",
    )?.id,
    "love_language_gift_gives_jewellery",
  );
});

test("normalises readable love language values and keeps touch consent-aware", () => {
  const allText = JSON.stringify(LOVE_LANGUAGE_PRESETS);
  const valueText = LOVE_LANGUAGE_PRESETS.map((preset) => preset.value).join("\n");
  const touch = findLoveLanguagePresetById("love_language_touch_holds_hand");
  const service = findLoveLanguagePresetById(
    "love_language_service_does_unasked_favour",
  );
  const behaviour = findLoveLanguagePresetById(
    "love_language_behaviour_uses_affection_to_apologise",
  );
  const trope = findLoveLanguagePresetById(
    "love_language_trope_touch_starved_love",
  );

  assert.equal(touch?.value, "holds hand");
  assert.match(touch?.guidance ?? "", /consent/i);
  assert.match(touch?.guidance ?? "", /open to refusal/i);
  assert.equal(service?.value, "does unasked favour");
  assert.equal(behaviour?.value, "uses affection to apologise");
  assert.equal(trope?.value, "touch-starved love");
  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.doesNotMatch(
    valueText,
    /words_of_affirmation|favorite|jewelry|favor|apologize|touch_starved_love|first_i_love_you/i,
  );
});

test("compiles love language presets as soft affection and repair guidance", () => {
  const preset = findLoveLanguagePresetById(
    "love_language_archetype_the_words_of_affirmation_devotee",
  );
  assert.ok(preset);

  const additions = compileLoveLanguagePresetAdditions(preset);

  assert.match(
    additions.relationshipAddition,
    /Love language preset: Archetype - The Words-of-Affirmation Devotee/,
  );
  assert.match(additions.personalityAddition, /Love language archetype texture/);
  assert.match(additions.systemPromptAddition, /Love language guidance/);
  assert.match(additions.systemPromptAddition, /soft affection context/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /must|force|critical|completely overwrite/i,
  );
});
