import assert from "node:assert/strict";
import test from "node:test";

import {
  ENEMIES_CONFLICT_PRESET_CATEGORIES,
  ENEMIES_CONFLICT_PRESETS,
  compileEnemiesConflictPresetAdditions,
  compileEnemiesConflictPresetSummary,
  findEnemiesConflictPresetById,
  getEnemiesConflictPresetsByCategory,
} from "../../data/enemiesConflictPresets";

test("loads enemies conflict presets across conflict, gate, and formula lanes", () => {
  assert.equal(ENEMIES_CONFLICT_PRESETS.length, 247);
  assert.deepEqual(ENEMIES_CONFLICT_PRESET_CATEGORIES, [
    "Conflict Escalation",
    "Conflict Resolution",
    "Core Dynamic",
    "Dialogue Seed",
    "Emotional Conflict",
    "Event Gate",
    "Generator Formula",
    "High-Value Romance Tag",
    "Power Dynamic",
    "Rivalry Type",
    "Secret Feeling",
    "Source of Conflict",
  ]);

  assert.equal(getEnemiesConflictPresetsByCategory("core dynamic").length, 45);
  assert.equal(getEnemiesConflictPresetsByCategory("source of conflict").length, 25);
  assert.equal(getEnemiesConflictPresetsByCategory("generator formula").length, 2);
});

test("normalises readable enemies conflict values and preserves useful ids", () => {
  const honourBound = findEnemiesConflictPresetById(
    "enemy_core_honour_bound_rivals",
  );
  const favourite = findEnemiesConflictPresetById(
    "enemy_power_court_favourite_against_outcast",
  );
  const defenceGate = findEnemiesConflictPresetById("enemy_gate_first_defence_gate");
  const formula = findEnemiesConflictPresetById(
    "enemy_formula_court_rival_public_choice",
  );

  assert.equal(honourBound?.value, "Honour-Bound Rivals");
  assert.equal(favourite?.value, "court favourite against outcast");
  assert.equal(defenceGate?.value, "first defence gate");
  assert.deepEqual(formula?.formulaParts, [
    "court rivals",
    "political conflict",
    "hidden attraction",
    "love disguised as hatred",
    "public choice gate",
  ]);

  const readableText = JSON.stringify(
    ENEMIES_CONFLICT_PRESETS.map((preset) => ({
      category: preset.category,
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
      formulaParts: preset.formulaParts,
    })),
  );
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /\bhonor\b|\bfavorite\b|\bdefense\b/i);
  assert.doesNotMatch(readableText, /preserve user agency/i);
});

test("compiles enemies conflict presets as soft consent-aware guidance", () => {
  const preset = findEnemiesConflictPresetById("enemy_power_captor_against_captive");
  assert.ok(preset);

  const summary = compileEnemiesConflictPresetSummary(preset);
  const additions = compileEnemiesConflictPresetAdditions(preset);

  assert.match(
    summary,
    /Enemies\/conflict preset: Power Dynamic - Captor Against Captive/,
  );
  assert.match(additions.relationshipAddition, /captor against captive/);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /boundaries, dignity/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\}'s autonomy/i);
  assert.match(additions.systemPromptAddition, /ability for either character to disengage/i);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /must|force prose|force the|override/i,
  );
});

test("compiles generator formulas as modular recipes rather than scripted outcomes", () => {
  const formula = findEnemiesConflictPresetById(
    "enemy_formula_academic_rival_forced_proximity",
  );
  assert.ok(formula);

  const summary = compileEnemiesConflictPresetSummary(formula);
  const additions = compileEnemiesConflictPresetAdditions(formula);

  assert.match(summary, /Formula parts: academic rivals \+ mutual respect hidden/);
  assert.match(additions.personalityAddition, /Formula parts: academic rivals/);
  assert.match(additions.systemPromptAddition, /modular enemies-to-lovers recipe/i);
  assert.match(additions.systemPromptAddition, /do not treat the formula as a scripted outcome/i);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /must|force prose|force the|override/i,
  );
});
