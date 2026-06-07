import assert from "node:assert/strict";
import test from "node:test";

import {
  PERSONALITY_TYPOLOGY_PRESET_CATEGORIES,
  PERSONALITY_TYPOLOGY_PRESETS,
  agreeablenessSeeds,
  bigFivePresets,
  compilePersonalityTypologyPresetAdditions,
  conscientiousnessSeeds,
  emotionalitySeeds,
  enneagram1Seeds,
  enneagram2Seeds,
  enneagram3Seeds,
  enneagram4Seeds,
  enneagram5Seeds,
  enneagram6Seeds,
  enneagram7Seeds,
  enneagram8Seeds,
  enneagram9Seeds,
  enneagramTypePresets,
  enneagramTypeSeeds,
  enneagramWingSeeds,
  extraversionSeeds,
  findPersonalityTypologyPresetById,
  getPersonalityTypologyPresetsByCategory,
  hexacoAgreeablenessSeeds,
  hexacoConscientiousnessSeeds,
  hexacoExtraversionSeeds,
  hexacoOpennessSeeds,
  hexacoPresets,
  highValuePersonalityTypologySeeds,
  honestyHumilitySeeds,
  mbtiDimensionSeeds,
  mbtiSeeds,
  mbtiTypePresets,
  neuroticismSeeds,
  opennessSeeds,
} from "../../data/personalityTypologyPresets";

test("loads personality typology presets across Enneagram, Big Five, HEXACO, and MBTI lanes", () => {
  assert.equal(PERSONALITY_TYPOLOGY_PRESETS.length, 316);
  assert.deepEqual(PERSONALITY_TYPOLOGY_PRESET_CATEGORIES, [
    "Big Five Agreeableness",
    "Big Five Conscientiousness",
    "Big Five Extraversion",
    "Big Five Neuroticism",
    "Big Five Openness",
    "Big Five Preset",
    "Enneagram Trait",
    "Enneagram Type",
    "Enneagram Wing",
    "HEXACO Agreeableness",
    "HEXACO Conscientiousness",
    "HEXACO Emotionality",
    "HEXACO Extraversion",
    "HEXACO Honesty-Humility",
    "HEXACO Openness",
    "HEXACO Preset",
    "High-Value Seed",
    "MBTI Axis",
    "MBTI Type",
  ]);

  const ids = PERSONALITY_TYPOLOGY_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(enneagramTypePresets.length, 9);
  assert.equal(enneagramTypeSeeds.length, 9);
  assert.equal(enneagramWingSeeds.length, 18);
  assert.equal(
    [
      ...enneagram1Seeds,
      ...enneagram2Seeds,
      ...enneagram3Seeds,
      ...enneagram4Seeds,
      ...enneagram5Seeds,
      ...enneagram6Seeds,
      ...enneagram7Seeds,
      ...enneagram8Seeds,
      ...enneagram9Seeds,
    ].length,
    90,
  );
  assert.equal(bigFivePresets.length, 10);
  assert.equal(opennessSeeds.length, 10);
  assert.equal(conscientiousnessSeeds.length, 10);
  assert.equal(extraversionSeeds.length, 10);
  assert.equal(agreeablenessSeeds.length, 10);
  assert.equal(neuroticismSeeds.length, 10);
  assert.equal(hexacoPresets.length, 10);
  assert.equal(honestyHumilitySeeds.length, 10);
  assert.equal(emotionalitySeeds.length, 10);
  assert.equal(hexacoExtraversionSeeds.length, 10);
  assert.equal(hexacoAgreeablenessSeeds.length, 10);
  assert.equal(hexacoConscientiousnessSeeds.length, 10);
  assert.equal(hexacoOpennessSeeds.length, 10);
  assert.equal(mbtiTypePresets.length, 16);
  assert.equal(mbtiSeeds.length, 16);
  assert.equal(mbtiDimensionSeeds.length, 8);
  assert.equal(highValuePersonalityTypologySeeds.length, 20);
});

test("normalises personality typology values for visible prompt text", () => {
  const helper = findPersonalityTypologyPresetById(
    "personality_typology_enneagram_type_type_2_helper",
  );
  const wing = findPersonalityTypologyPresetById(
    "personality_typology_enneagram_wing_4w5",
  );
  const honesty = findPersonalityTypologyPresetById(
    "personality_typology_hexaco_honesty_humility_high_integrity",
  );
  const intj = findPersonalityTypologyPresetById(
    "personality_typology_mbti_type_intj_architect",
  );
  const visibleText = PERSONALITY_TYPOLOGY_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(helper?.value, "type 2 helper");
  assert.equal(helper?.triggerKeys.includes("type_2_helper"), true);
  assert.equal(wing?.value, "4w5");
  assert.equal(honesty?.value, "high integrity");
  assert.equal(intj?.value, "INTJ architect");
  assert.doesNotMatch(visibleText, /Use code with caution|force prose|must override/i);
});

test("finds typology presets by category and stable id", () => {
  assert.equal(getPersonalityTypologyPresetsByCategory("Enneagram Type").length, 18);
  assert.equal(getPersonalityTypologyPresetsByCategory("Enneagram Trait").length, 90);
  assert.equal(getPersonalityTypologyPresetsByCategory("Big Five Preset").length, 10);
  assert.equal(getPersonalityTypologyPresetsByCategory("HEXACO Preset").length, 10);
  assert.equal(getPersonalityTypologyPresetsByCategory("MBTI Type").length, 32);
  assert.equal(
    findPersonalityTypologyPresetById(
      "personality_typology_big_five_neuroticism_vulnerable_to_stress",
    )?.value,
    "vulnerable to stress",
  );
  assert.equal(
    findPersonalityTypologyPresetById(
      "personality_typology_high_value_infj_advocate",
    )?.value,
    "INFJ advocate",
  );
});

test("compiles personality typology as soft non-diagnostic context", () => {
  const preset = findPersonalityTypologyPresetById(
    "personality_typology_mbti_type_infp_mediator",
  );
  assert.ok(preset);

  const additions = compilePersonalityTypologyPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Personality typology context/);
  assert.match(additions.personalityAddition, /starting pattern/i);
  assert.match(additions.personalityAddition, /authored psychology/i);
  assert.match(additions.systemPromptAddition, /soft personality typology context/i);
  assert.match(additions.systemPromptAddition, /matching shortcut/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} agency/i);
  assert.match(additions.systemPromptAddition, /Do not diagnose/i);
  assert.doesNotMatch(additions.systemPromptAddition, /force prose|must override/i);
});
