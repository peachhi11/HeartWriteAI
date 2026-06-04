import assert from "node:assert/strict";
import test from "node:test";

import {
  PHYSICAL_TELL_PRESET_CATEGORIES,
  PHYSICAL_TELL_PRESETS,
  compilePhysicalTellPresetAdditions,
  findPhysicalTellPresetById,
  getPhysicalTellPresetsByCategory,
} from "../../data/physicalTellPresets";

test("loads physical tell presets across tells, emotional tells, hooks, gates, and dialogue", () => {
  assert.equal(PHYSICAL_TELL_PRESETS.length, 213);
  assert.deepEqual(PHYSICAL_TELL_PRESET_CATEGORIES, [
    "Archetype",
    "Dialogue Seed",
    "Emotional Tell",
    "Gate",
    "High-Value Seed",
    "Physical Tell",
    "Romance Hook",
  ]);

  const ids = PHYSICAL_TELL_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getPhysicalTellPresetsByCategory("Archetype").length, 20);
  assert.equal(getPhysicalTellPresetsByCategory("Physical Tell").length, 100);
  assert.equal(getPhysicalTellPresetsByCategory("Emotional Tell").length, 15);
  assert.equal(getPhysicalTellPresetsByCategory("Romance Hook").length, 20);
  assert.equal(getPhysicalTellPresetsByCategory("Gate").length, 15);
  assert.equal(getPhysicalTellPresetsByCategory("Dialogue Seed").length, 23);
  assert.equal(getPhysicalTellPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises physical tell values for visible prompt text", () => {
  const archetype = findPhysicalTellPresetById(
    "physical_tell_archetype_the_one_whose_guard_drops_around_user",
  );
  const lips = findPhysicalTellPresetById("physical_tell_seed_glances_at_user_s_lips");
  const tracks = findPhysicalTellPresetById("physical_tell_seed_tracks_user_in_crowd");
  const userName = findPhysicalTellPresetById(
    "physical_tell_seed_says_user_s_name_differently",
  );
  const userGate = findPhysicalTellPresetById(
    "physical_tell_gate_first_user_calls_out_tell_gate",
  );

  assert.equal(archetype?.value, "The One Whose Guard Drops Around {{user}}");
  assert.equal(lips?.value, "glances at {{user}}'s lips");
  assert.equal(tracks?.value, "tracks {{user}} in crowd");
  assert.equal(userName?.value, "says {{user}}'s name differently");
  assert.equal(userGate?.value, "first {{user}} calls out tell gate");

  const visibleText = PHYSICAL_TELL_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.doesNotMatch(
    visibleText,
    /Use code with caution|glances at users|tracks user|checks user|looks at user|relaxes near user|leans toward user|hovers near user|keeps user|moves user|turns body toward user|says user|user notices|user learns|user calls|relaxed near user|force prose|SYSTEM PROTOCOL/i,
  );
});

test("compiles physical tell presets as soft ambiguous subtext", () => {
  const preset = findPhysicalTellPresetById(
    "physical_tell_high_value_known_without_words_gate",
  );
  assert.ok(preset);

  const additions = compilePhysicalTellPresetAdditions(preset);

  assert.match(additions.scenarioAddition, /Physical tell context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft physical-tell context/i);
  assert.match(additions.systemPromptAddition, /without proving it or scripting outcomes/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps physical tells context-dependent rather than proof", () => {
  const tells = [
    findPhysicalTellPresetById("physical_tell_seed_hands_shake"),
    findPhysicalTellPresetById("physical_tell_emotional_love_shows_in_eyes"),
    findPhysicalTellPresetById("physical_tell_romance_tell_reveals_hidden_feelings"),
  ];

  assert.ok(tells.every(Boolean));
  for (const tell of tells) {
    assert.match(tell?.guidance ?? "", /context|subtext|misreading|earned/i);
  }
});
