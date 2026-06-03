import assert from "node:assert/strict";
import test from "node:test";

import {
  CONFLICT_STYLE_PRESET_CATEGORIES,
  CONFLICT_STYLE_PRESETS,
  compileConflictStylePresetAdditions,
  findConflictStylePresetById,
  getConflictStylePresetsByCategory,
} from "../../data/conflictStylePresets";

test("loads conflict style presets across rupture and repair lanes", () => {
  assert.equal(CONFLICT_STYLE_PRESETS.length, 295);
  assert.deepEqual(CONFLICT_STYLE_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Conflict Type",
    "Dialogue Seed",
    "Emotional Flavour",
    "Escalation Style",
    "Gate",
    "Method",
    "Motivation",
    "Repair Style",
    "Romance Trope",
    "Trigger Event",
    "Wound",
  ]);

  const ids = CONFLICT_STYLE_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("conflict_")));
  assert.equal(
    getConflictStylePresetsByCategory("Behaviour").find(
      (preset) => preset.value === "deflects with humour",
    )?.id,
    "conflict_behaviour_deflects_with_humour",
  );
});

test("normalises readable conflict values and keeps escalation consequence-aware", () => {
  const allText = JSON.stringify(CONFLICT_STYLE_PRESETS);
  const valueText = CONFLICT_STYLE_PRESETS.map((preset) => preset.value).join("\n");
  const method = findConflictStylePresetById("conflict_method_guilt_tripping");
  const escalation = findConflictStylePresetById(
    "conflict_escalation_threatens_breakup",
  );
  const repair = findConflictStylePresetById(
    "conflict_repair_promises_behaviour_change",
  );

  assert.equal(method?.value, "guilt tripping");
  assert.match(method?.guidance ?? "", /consequence-aware/i);
  assert.equal(escalation?.value, "threatens breakup");
  assert.match(escalation?.guidance ?? "", /escalation risk/i);
  assert.equal(repair?.value, "promises behaviour change");
  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.doesNotMatch(
    valueText,
    /avoidant_conflict|deflects_with_humor|apologizes|refuses_to_apologize|self_righteous|silent_treatment_slow_burn|duty_vs_love_argument|trust_gate_failed/i,
  );
});

test("compiles conflict presets as soft relationship and repair guidance", () => {
  const preset = findConflictStylePresetById(
    "conflict_archetype_the_avoidant_peacemaker",
  );
  assert.ok(preset);

  const additions = compileConflictStylePresetAdditions(preset);

  assert.match(
    additions.relationshipAddition,
    /Conflict style preset: Archetype - The Avoidant Peacemaker/,
  );
  assert.match(additions.personalityAddition, /Conflict archetype texture/);
  assert.match(additions.systemPromptAddition, /Conflict style guidance/);
  assert.match(additions.systemPromptAddition, /soft conflict context/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /must|force|critical|completely overwrite/i,
  );
});
