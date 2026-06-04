import assert from "node:assert/strict";
import test from "node:test";

import {
  TRADE_SKILL_PRESET_CATEGORIES,
  TRADE_SKILL_PRESETS,
  compileTradeSkillPresetAdditions,
  findTradeSkillPresetById,
  getTradeSkillPresetsByCategory,
} from "../../data/tradeSkillPresets";

test("loads trade skill presets across trades, romance, gates, mastery, and dialogue lanes", () => {
  assert.equal(TRADE_SKILL_PRESETS.length, 259);
  assert.deepEqual(TRADE_SKILL_PRESET_CATEGORIES, [
    "Archetype",
    "Dialogue Seed",
    "Gate",
    "High-Value Seed",
    "Mastery",
    "Romance Hook",
    "Trade Skill",
  ]);

  const ids = TRADE_SKILL_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getTradeSkillPresetsByCategory("Trade Skill").length, 140);
  assert.equal(getTradeSkillPresetsByCategory("Dialogue Seed").length, 19);
  assert.equal(getTradeSkillPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises trade skill values for visible prompt text", () => {
  const labour = findTradeSkillPresetById("trade_skill_seed_construction_labour");
  const armour = findTradeSkillPresetById("trade_skill_seed_armoursmithing");
  const jewellery = findTradeSkillPresetById("trade_skill_seed_jewellery_repair");
  const userHome = findTradeSkillPresetById("trade_skill_romance_repairs_user_home");
  const userGate = findTradeSkillPresetById("trade_skill_gate_first_user_admires_work_gate");
  const visibleText = TRADE_SKILL_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(labour?.value, "construction labour");
  assert.equal(armour?.value, "armoursmithing");
  assert.equal(jewellery?.value, "jewellery repair");
  assert.equal(userHome?.value, "repairs {{user}} home");
  assert.equal(userGate?.value, "first {{user}} admires work gate");
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|construction labor|armorsmithing|jewelry|repairs user|first user admires/i,
  );
});

test("compiles trade skill presets as soft safety-aware context", () => {
  const preset = findTradeSkillPresetById("trade_skill_seed_electrical_work");
  assert.ok(preset);

  const additions = compileTradeSkillPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Trade skill context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft trade skill context/i);
  assert.match(additions.systemPromptAddition, /safety, and \{\{user\}\} autonomy/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
