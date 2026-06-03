import assert from "node:assert/strict";
import test from "node:test";

import {
  compileFatedReincarnationPresetAdditions,
  FATED_REINCARNATION_PRESET_CATEGORIES,
  FATED_REINCARNATION_PRESETS,
  findFatedReincarnationPresetById,
  getFatedReincarnationPresetsByCategory,
} from "../../data/fatedReincarnationPresets";

test("loads fated reincarnation presets across fate and memory lanes", () => {
  assert.equal(FATED_REINCARNATION_PRESETS.length, 245);
  assert.deepEqual(FATED_REINCARNATION_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Bond Type",
    "Dialogue Seed",
    "Emotional Flavour",
    "Gate",
    "Method",
    "Motivation",
    "Romance Trope",
    "Trigger Event",
    "Wound",
  ]);

  const ids = FATED_REINCARNATION_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("fated_reincarnation_")));
  assert.equal(
    getFatedReincarnationPresetsByCategory("Behaviour").find(
      (preset) => preset.value === "stares like recognising user",
    )?.id,
    "fated_reincarnation_behaviour_stares_like_recognising_user",
  );
});

test("normalises readable fate values and keeps destiny choice-safe", () => {
  const allText = JSON.stringify(FATED_REINCARNATION_PRESETS);
  const valueText = FATED_REINCARNATION_PRESETS.map(
    (preset) => preset.value,
  ).join("\n");
  const motivation = findFatedReincarnationPresetById(
    "fated_reincarnation_motivation_fulfil_promise",
  );
  const method = findFatedReincarnationPresetById(
    "fated_reincarnation_method_past_life_artefacts",
  );
  const trigger = findFatedReincarnationPresetById(
    "fated_reincarnation_trigger_user_recognises_place",
  );
  const route = findFatedReincarnationPresetById(
    "fated_reincarnation_aftermath_destiny_versus_choice_route",
  );

  assert.equal(motivation?.value, "fulfil promise");
  assert.equal(method?.value, "past life artefacts");
  assert.match(method?.guidance ?? "", /not coercive proof/i);
  assert.equal(trigger?.value, "user recognises place");
  assert.equal(route?.value, "destiny versus choice route");
  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.doesNotMatch(
    valueText,
    /reincarnated_lovers|fulfill|recognizes|recognizing|artifacts|choice_vs_fate|destiny_vs_choice|red_string_of_fate/i,
  );
});

test("compiles fated reincarnation presets as soft fate and memory guidance", () => {
  const preset = findFatedReincarnationPresetById(
    "fated_reincarnation_archetype_the_reincarnated_soulmate",
  );
  assert.ok(preset);

  const additions = compileFatedReincarnationPresetAdditions(preset);

  assert.match(
    additions.backgroundAddition,
    /Fated\/reincarnation preset: Archetype - The Reincarnated Soulmate/,
  );
  assert.match(
    additions.relationshipAddition,
    /Fated\/reincarnation preset: Archetype - The Reincarnated Soulmate/,
  );
  assert.match(
    additions.personalityAddition,
    /Fated\/reincarnation archetype texture/,
  );
  assert.match(additions.systemPromptAddition, /Fated\/reincarnation guidance/);
  assert.match(additions.systemPromptAddition, /soft fate-and-memory context/i);
  assert.match(additions.systemPromptAddition, /present-life choice/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /must|force|critical|completely overwrite/i,
  );
});
