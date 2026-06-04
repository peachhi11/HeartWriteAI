import assert from "node:assert/strict";
import test from "node:test";

import {
  HABIT_PRESET_CATEGORIES,
  HABIT_PRESETS,
  compileHabitPresetAdditions,
  findHabitPresetById,
  getHabitPresetsByCategory,
} from "../../data/habitPresets";

test("loads habit presets across habit, routine, romance, gate, and dialogue lanes", () => {
  assert.equal(HABIT_PRESETS.length, 196);
  assert.deepEqual(HABIT_PRESET_CATEGORIES, [
    "Archetype",
    "Dialogue Seed",
    "Gate",
    "Habit",
    "High-Value Seed",
    "Romance Hook",
    "Routine",
    "Weakness",
  ]);

  const ids = HABIT_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getHabitPresetsByCategory("Archetype").length, 20);
  assert.equal(getHabitPresetsByCategory("Habit").length, 60);
  assert.equal(getHabitPresetsByCategory("Routine").length, 20);
  assert.equal(getHabitPresetsByCategory("Weakness").length, 20);
  assert.equal(getHabitPresetsByCategory("Romance Hook").length, 20);
  assert.equal(getHabitPresetsByCategory("Gate").length, 16);
  assert.equal(getHabitPresetsByCategory("Dialogue Seed").length, 20);
  assert.equal(getHabitPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises habit values for visible prompt text", () => {
  const colourNotes = findHabitPresetById("habit_seed_colour_codes_notes");
  const knowsOrder = findHabitPresetById("habit_seed_knows_user_s_order");
  const deflects = findHabitPresetById("habit_seed_deflects_with_wit");
  const apologises = findHabitPresetById("habit_seed_apologises_too_much");
  const userRoutine = findHabitPresetById("habit_romance_user_notices_their_routine");
  const userGate = findHabitPresetById("habit_gate_first_user_added_to_routine_gate");

  assert.equal(colourNotes?.value, "colour-codes notes");
  assert.equal(knowsOrder?.value, "knows {{user}}'s order");
  assert.equal(deflects?.value, "deflects with wit");
  assert.equal(apologises?.value, "apologises too much");
  assert.equal(userRoutine?.value, "{{user}} notices their routine");
  assert.equal(userGate?.value, "first {{user}} added to routine gate");

  const visibleText = HABIT_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.doesNotMatch(
    visibleText,
    /Use code with caution|color|deflects with humor|apologizes|knows users order|walks user home|softens voice for user|checking on user|user notices|user disrupts|user teaches|user learns|first user|force prose|SYSTEM PROTOCOL/i,
  );
});

test("compiles habit presets as soft routine guidance", () => {
  const preset = findHabitPresetById("habit_high_value_ordinary_love_route");
  assert.ok(preset);

  const additions = compileHabitPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Habit context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft habit and routine context/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} agency intact/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps self-neglect and care habits boundary-aware", () => {
  const selfNeglect = findHabitPresetById("habit_weakness_self_neglect");
  const checkingOnUser = findHabitPresetById("habit_routine_checking_on_user");
  assert.ok(selfNeglect);
  assert.ok(checkingOnUser);

  assert.match(selfNeglect.guidance, /recovery, and growth/i);
  assert.match(checkingOnUser.value, /checking on \{\{user\}\}/);
});
