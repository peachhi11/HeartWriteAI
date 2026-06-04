import assert from "node:assert/strict";
import test from "node:test";

import {
  BODY_LANGUAGE_PRESET_CATEGORIES,
  BODY_LANGUAGE_PRESETS,
  compileBodyLanguagePresetAdditions,
  findBodyLanguagePresetById,
  getBodyLanguagePresetsByCategory,
} from "../../data/bodyLanguagePresets";

test("loads body language presets across posture, gesture, proximity, and romance lanes", () => {
  assert.equal(BODY_LANGUAGE_PRESETS.length, 289);
  assert.deepEqual(BODY_LANGUAGE_PRESET_CATEGORIES, [
    "Archetype",
    "Body Language",
    "Dialogue Seed",
    "Emotional Body Language",
    "Eye Contact",
    "Gate",
    "Gesture",
    "High-Value Seed",
    "Movement",
    "Posture",
    "Proximity",
    "Romance Hook",
    "Touch",
    "Weakness",
  ]);

  const ids = BODY_LANGUAGE_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getBodyLanguagePresetsByCategory("Archetype").length, 20);
  assert.equal(getBodyLanguagePresetsByCategory("Body Language").length, 20);
  assert.equal(getBodyLanguagePresetsByCategory("Posture").length, 30);
  assert.equal(getBodyLanguagePresetsByCategory("Eye Contact").length, 20);
  assert.equal(getBodyLanguagePresetsByCategory("Gesture").length, 25);
  assert.equal(getBodyLanguagePresetsByCategory("Movement").length, 20);
  assert.equal(getBodyLanguagePresetsByCategory("Proximity").length, 20);
  assert.equal(getBodyLanguagePresetsByCategory("Touch").length, 20);
  assert.equal(getBodyLanguagePresetsByCategory("Emotional Body Language").length, 20);
  assert.equal(getBodyLanguagePresetsByCategory("Romance Hook").length, 20);
  assert.equal(getBodyLanguagePresetsByCategory("Weakness").length, 20);
  assert.equal(getBodyLanguagePresetsByCategory("Gate").length, 15);
  assert.equal(getBodyLanguagePresetsByCategory("Dialogue Seed").length, 19);
  assert.equal(getBodyLanguagePresetsByCategory("High-Value Seed").length, 20);
});

test("normalises body language values for visible prompt text", () => {
  const hovers = findBodyLanguagePresetById("body_language_proximity_hovers_near_user");
  const centre = findBodyLanguagePresetById(
    "body_language_proximity_takes_centre_of_room",
  );
  const defence = findBodyLanguagePresetById(
    "body_language_weakness_uses_distance_as_defence",
  );
  const reaction = findBodyLanguagePresetById(
    "body_language_romance_checks_user_s_reaction",
  );
  const clothing = findBodyLanguagePresetById(
    "body_language_romance_adjusts_user_s_clothing",
  );

  assert.equal(hovers?.value, "hovers near {{user}}");
  assert.equal(centre?.value, "takes centre of room");
  assert.equal(defence?.value, "uses distance as defence");
  assert.equal(reaction?.value, "checks {{user}}'s reaction");
  assert.equal(clothing?.value, "adjusts {{user}}'s clothing");

  const visibleText = BODY_LANGUAGE_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.doesNotMatch(
    visibleText,
    /Use code with caution|takes center|defense|hovers near user|users reaction|users posture|user first|user in room|adjusts users|force prose|SYSTEM PROTOCOL/i,
  );
});

test("compiles body language presets as soft nonverbal guidance", () => {
  const preset = findBodyLanguagePresetById(
    "body_language_high_value_body_speaks_before_words_gate",
  );
  assert.ok(preset);

  const additions = compileBodyLanguagePresetAdditions(preset);

  assert.match(additions.descriptionAddition, /Body-language context/);
  assert.match(additions.personalityAddition, /without making body language absolute proof/i);
  assert.match(additions.systemPromptAddition, /soft body-language context/i);
  assert.match(additions.systemPromptAddition, /preserve \{\{user\}\} agency/i);
  assert.match(additions.systemPromptAddition, /avoid treating body language as mind-reading/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps touch and proximity lanes consent-aware", () => {
  const touch = findBodyLanguagePresetById("body_language_touch_asks_before_touching");
  const proximity = findBodyLanguagePresetById("body_language_proximity_crowds_when_jealous");
  assert.ok(touch);
  assert.ok(proximity);

  assert.match(touch.guidance, /consent-aware, permission-aware/i);
  assert.match(proximity.guidance, /respect boundaries/i);
});
