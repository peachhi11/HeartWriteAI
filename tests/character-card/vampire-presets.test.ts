import assert from "node:assert/strict";
import test from "node:test";

import {
  VAMPIRE_PRESET_CATEGORIES,
  VAMPIRE_PRESETS,
  compileVampirePresetAdditions,
  compileVampirePresetSummary,
  findVampirePresetById,
  getVampirePresetsByCategory,
} from "../../data/vampirePresets";

test("loads vampire presets across gothic romance and lore lanes", () => {
  assert.equal(VAMPIRE_PRESETS.length, 484);
  assert.deepEqual(VAMPIRE_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Behaviour",
    "Bloodline",
    "Court / Coven Affiliation",
    "Dialogue Seed",
    "Emotional Flavour",
    "Feeding Style",
    "Gate",
    "Humanity Level",
    "Lore Hook",
    "Method",
    "Motivation",
    "Physiology",
    "Romance Trope",
    "Secret Hook",
    "Strength",
    "Trigger Event",
    "Vampire Archetype",
    "Vampire Type",
    "Weakness",
    "Wound",
  ]);

  assert.equal(getVampirePresetsByCategory("vampire archetype").length, 42);
  assert.equal(getVampirePresetsByCategory("bloodline").length, 20);
  assert.equal(getVampirePresetsByCategory("physiology").length, 38);
  assert.equal(getVampirePresetsByCategory("feeding style").length, 20);
  assert.equal(getVampirePresetsByCategory("lore hook").length, 40);
  assert.equal(getVampirePresetsByCategory("method").length, 20);
  assert.equal(getVampirePresetsByCategory("romance trope").length, 34);
  assert.equal(getVampirePresetsByCategory("dialogue seed").length, 20);
});

test("normalises readable vampire values and UK spelling", () => {
  const archetype = findVampirePresetById("vampire_archetype_the_vampire_noble");
  const civilised = findVampirePresetById("vampire_type_civilised_vampire");
  const flavour = findVampirePresetById("vampire_emotion_melancholic");
  const cruellest = findVampirePresetById(
    "vampire_dialogue_your_pulse_is_the_cruellest_temptation",
  );
  const hunterBeloved = findVampirePresetById(
    "vampire_archetype_the_hunters_forbidden_beloved",
  );
  const bloodline = findVampirePresetById("vampire_bloodline_sun_cursed_bloodline");
  const feeder = findVampirePresetById("vampire_feeding_consensual_feeder");
  const humanity = findVampirePresetById("vampire_humanity_clinging_to_humanity");

  assert.equal(archetype?.label, "The Vampire Noble");
  assert.equal(civilised?.value, "civilised vampire");
  assert.equal(flavour?.category, "Emotional Flavour");
  assert.equal(cruellest?.value, "Your pulse is the cruellest temptation.");
  assert.equal(hunterBeloved?.label, "The Hunter's Forbidden Beloved");
  assert.equal(bloodline?.value, "sun-cursed bloodline");
  assert.equal(feeder?.value, "consensual feeder");
  assert.equal(humanity?.value, "clinging to humanity");

  const readableText = JSON.stringify(
    VAMPIRE_PRESETS.map((preset) => ({
      category: preset.category,
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
    })),
  );
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /born_vampire|cold_skin|blood_bonding/i);
  assert.doesNotMatch(readableText, /sun_cursed|human_blood_only|secret_daywalker/i);
  assert.doesNotMatch(readableText, /civilized|cruelest|Flavor/i);
});

test("compiles vampire presets as soft dark-romance and consent guidance", () => {
  const preset = findVampirePresetById("vampire_trope_blood_bond_romance");
  assert.ok(preset);

  const summary = compileVampirePresetSummary(preset);
  const additions = compileVampirePresetAdditions(preset);

  assert.match(summary, /Vampire preset: Romance Trope - Blood Bond Romance/);
  assert.match(additions.relationshipAddition, /preserve informed choice/i);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /soft dark-romance context/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /refuse feeding/i);
  assert.match(additions.systemPromptAddition, /reject blood bonds/i);
  assert.match(additions.systemPromptAddition, /refuse turning/i);
  assert.match(additions.systemPromptAddition, /demand restraint/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|override/i);
});
