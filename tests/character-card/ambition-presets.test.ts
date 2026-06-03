import assert from "node:assert/strict";
import test from "node:test";

import {
  AMBITION_PRESET_CATEGORIES,
  AMBITION_PRESETS,
  compileAmbitionPresetAdditions,
  findAmbitionPresetById,
  getAmbitionPresetsByCategory,
} from "../../data/ambitionPresets";

test("loads ambition presets across all useful vocabulary lanes", () => {
  assert.equal(AMBITION_PRESETS.length, 275);
  assert.deepEqual(AMBITION_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Ambition Type",
    "Archetype",
    "Behaviour",
    "Dialogue Seed",
    "Emotional Flavour",
    "Gate",
    "Method",
    "Motivation",
    "Romance Trope",
    "Trigger Event",
    "Wound",
  ]);

  const ids = AMBITION_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("ambition_")));
  assert.equal(
    getAmbitionPresetsByCategory("Method").find((preset) => preset.value === "political manoeuvring")?.id,
    "ambition_method_political_manoeuvring",
  );
});

test("normalises readable ambition values and frames risky methods safely", () => {
  const allText = JSON.stringify(AMBITION_PRESETS);
  const valueText = AMBITION_PRESETS.map((preset) => preset.value).join("\n");
  const method = findAmbitionPresetById("ambition_method_blackmail");
  const behaviour = findAmbitionPresetById("ambition_behaviour_prioritises_goal_over_feelings");
  const motivation = findAmbitionPresetById("ambition_motivation_fulfil_legacy");

  assert.equal(method?.value, "blackmail");
  assert.equal(behaviour?.value, "prioritises goal over feelings");
  assert.equal(motivation?.value, "fulfil legacy");
  assert.match(method?.guidance ?? "", /consequence-aware and consent-aware/i);
  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.doesNotMatch(valueText, /power_ambition|hard_work|self_denying|trust_gate_reached/i);
});

test("compiles ambition presets as soft goal and event-gated guidance", () => {
  const preset = findAmbitionPresetById("ambition_archetype_the_power_couple_dreamer");
  assert.ok(preset);

  const additions = compileAmbitionPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Ambition preset: Archetype - The Power Couple Dreamer/);
  assert.match(additions.personalityAddition, /Ambition archetype texture/);
  assert.match(additions.systemPromptAddition, /Ambition guidance/);
  assert.match(additions.systemPromptAddition, /keyword triggers and event gates as soft context/i);
  assert.match(additions.systemPromptAddition, /do not override player agency/i);
  assert.match(additions.systemPromptAddition, /avoid reducing the character to ambition-only behaviour/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force|critical|completely overwrite/i);
});
