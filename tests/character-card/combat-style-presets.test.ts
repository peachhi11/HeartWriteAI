import assert from "node:assert/strict";
import test from "node:test";

import {
  COMBAT_STYLE_PRESET_CATEGORIES,
  COMBAT_STYLE_PRESETS,
  compileCombatStylePresetAdditions,
  findCombatStylePresetById,
  getCombatStylePresetsByCategory,
} from "../../data/combatStylePresets";

test("loads combat style presets across style, approach, weakness, romance, and dialogue lanes", () => {
  assert.equal(COMBAT_STYLE_PRESETS.length, 205);
  assert.deepEqual(COMBAT_STYLE_PRESET_CATEGORIES, [
    "Approach",
    "Archetype",
    "Dialogue Seed",
    "Gate",
    "High-Value Seed",
    "Romance Hook",
    "Style",
    "Weakness",
  ]);

  const ids = COMBAT_STYLE_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getCombatStylePresetsByCategory("Style").length, 60);
  assert.equal(getCombatStylePresetsByCategory("Dialogue Seed").length, 25);
  assert.equal(getCombatStylePresetsByCategory("High-Value Seed").length, 20);
});

test("normalises combat style values for visible prompt text", () => {
  const honour = findCombatStylePresetById("combat_style_seed_honour_bound_style");
  const ritualised = findCombatStylePresetById("combat_style_seed_ritualised_style");
  const defence = findCombatStylePresetById("combat_style_seed_last_line_of_defence");
  const judgement = findCombatStylePresetById(
    "combat_style_weakness_anger_clouds_judgement",
  );
  const userFirst = findCombatStylePresetById("combat_style_seed_protect_user_first");
  const userCalms = findCombatStylePresetById(
    "combat_style_romance_user_calms_battle_rage",
  );
  const visibleText = COMBAT_STYLE_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(honour?.value, "honour-bound style");
  assert.equal(ritualised?.value, "ritualised style");
  assert.equal(defence?.value, "last line of defence");
  assert.equal(judgement?.value, "anger clouds judgement");
  assert.equal(userFirst?.value, "protect {{user}} first");
  assert.equal(userCalms?.value, "{{user}} calms battle rage");
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|honor|ritualized|last line of defense|judgment|protect user first|user calms battle rage|teaches user/i,
  );
});

test("compiles combat style presets as soft consequence-aware context", () => {
  const preset = findCombatStylePresetById("combat_style_romance_love_becomes_restraint");
  assert.ok(preset);

  const additions = compileCombatStylePresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Combat style context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft combat style context/i);
  assert.match(additions.systemPromptAddition, /protection should not become control/i);
  assert.match(additions.systemPromptAddition, /violence should not erase emotional cost/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps risky combat style framing boundary-aware", () => {
  const selfSacrifice = findCombatStylePresetById(
    "combat_style_weakness_cannot_fight_without_self_sacrifice",
  );
  const protective = findCombatStylePresetById(
    "combat_style_gate_protection_without_control_gate",
  );
  assert.ok(selfSacrifice);
  assert.ok(protective);

  assert.match(selfSacrifice.guidance, /consequence, growth, and care/i);
  assert.match(protective.value, /protection without control/i);
});
