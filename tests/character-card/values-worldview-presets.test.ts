import assert from "node:assert/strict";
import test from "node:test";

import {
  VALUES_WORLDVIEW_PRESET_CATEGORIES,
  VALUES_WORLDVIEW_PRESETS,
  ambitionEthicsSeeds,
  classAttitudeSeeds,
  compileValuesWorldviewPresetAdditions,
  ethicsSeeds,
  findValuesWorldviewPresetById,
  getValuesWorldviewPresetsByCategory,
  highValueValuesWorldviewSeeds,
  politicalWorldviewSeeds,
  relationshipPhilosophySeeds,
  spiritualityStyleSeeds,
  valuesWorldviewPresets,
  valuesWorldviewRomanceHooks,
  worldviewSeeds,
} from "../../data/valuesWorldviewPresets";

test("loads values and worldview presets across belief, ethics, class, ambition, and romance lanes", () => {
  assert.equal(VALUES_WORLDVIEW_PRESETS.length, 333);
  assert.deepEqual(VALUES_WORLDVIEW_PRESET_CATEGORIES, [
    "Ambition & Success Ethics",
    "Archetype",
    "Class & Economic Attitudes",
    "Ethics in Practice",
    "High-Value Seed",
    "Politics & Governance",
    "Relationship Philosophy",
    "Romance Hook",
    "Spirituality & Faith",
    "Worldview",
  ]);

  const ids = VALUES_WORLDVIEW_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(valuesWorldviewPresets.length, 20);
  assert.equal(worldviewSeeds.length, 40);
  assert.equal(politicalWorldviewSeeds.length, 35);
  assert.equal(spiritualityStyleSeeds.length, 38);
  assert.equal(ethicsSeeds.length, 40);
  assert.equal(classAttitudeSeeds.length, 40);
  assert.equal(ambitionEthicsSeeds.length, 40);
  assert.equal(relationshipPhilosophySeeds.length, 40);
  assert.equal(valuesWorldviewRomanceHooks.length, 20);
  assert.equal(highValueValuesWorldviewSeeds.length, 20);
  assert.equal(getValuesWorldviewPresetsByCategory("Worldview").length, 40);
  assert.equal(getValuesWorldviewPresetsByCategory("Politics & Governance").length, 35);
  assert.equal(getValuesWorldviewPresetsByCategory("Spirituality & Faith").length, 38);
  assert.equal(getValuesWorldviewPresetsByCategory("Class & Economic Attitudes").length, 40);
  assert.equal(getValuesWorldviewPresetsByCategory("Romance Hook").length, 20);
});

test("normalises values and worldview labels for readable prompt text", () => {
  const honourBound = findValuesWorldviewPresetById(
    "values_worldview_archetype_honour_bound_traditionalist",
  );
  const organisedReligion = findValuesWorldviewPresetById(
    "values_worldview_spirituality_organised_religion",
  );
  const respectForLabour = findValuesWorldviewPresetById(
    "values_worldview_class_respect_for_labour",
  );
  const manualLabour = findValuesWorldviewPresetById(
    "values_worldview_class_respects_manual_labour",
  );
  const visibleText = VALUES_WORLDVIEW_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(honourBound?.value, "Honour-Bound Traditionalist");
  assert.equal(honourBound?.triggerKeys.includes("Honor-Bound Traditionalist"), true);
  assert.equal(organisedReligion?.value, "organised religion");
  assert.equal(respectForLabour?.value, "respect for labour");
  assert.equal(manualLabour?.value, "respects manual labour");
  assert.doesNotMatch(visibleText, /\bHonor\b|\blabor\b|\borganized\b/i);
});

test("finds high-signal values and worldview seeds by stable ids", () => {
  assert.equal(
    findValuesWorldviewPresetById("values_worldview_worldview_believes_people_can_change")
      ?.value,
    "believes people can change",
  );
  assert.equal(
    findValuesWorldviewPresetById("values_worldview_politics_anti_authoritarian")?.value,
    "anti authoritarian",
  );
  assert.equal(
    findValuesWorldviewPresetById("values_worldview_spirituality_ethics_over_dogma")
      ?.value,
    "ethics over dogma",
  );
  assert.equal(
    findValuesWorldviewPresetById("values_worldview_ethics_honesty_first")?.value,
    "honesty first",
  );
  assert.equal(
    findValuesWorldviewPresetById("values_worldview_ambition_success_with_integrity")
      ?.value,
    "success with integrity",
  );
  assert.equal(
    findValuesWorldviewPresetById("values_worldview_relationship_love_as_choice")?.value,
    "love as choice",
  );
  assert.equal(
    findValuesWorldviewPresetById("values_worldview_romance_shared_values_create_bond")
      ?.value,
    "shared values create bond",
  );
  assert.equal(
    findValuesWorldviewPresetById(
      "values_worldview_high_value_believes_love_should_feel_safe",
    )?.value,
    "believes love should feel safe",
  );
});

test("compiles values and worldview presets as soft character context", () => {
  const preset = findValuesWorldviewPresetById(
    "values_worldview_romance_shared_values_create_bond",
  );
  assert.ok(preset);

  const additions = compileValuesWorldviewPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Values and worldview context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft values and worldview context/i);
  assert.match(additions.systemPromptAddition, /choices, boundaries, repair, and consequences/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} autonomy intact/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
