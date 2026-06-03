import assert from "node:assert/strict";
import test from "node:test";

import {
  COMMUNICATION_STYLE_PRESET_CATEGORIES,
  COMMUNICATION_STYLE_PRESETS,
  compileCommunicationStylePresetAdditions,
  findCommunicationStylePresetById,
  getCommunicationStylePresetsByCategory,
} from "../../data/communicationStylePresets";

test("loads communication style presets across all useful dialogue lanes", () => {
  assert.equal(COMMUNICATION_STYLE_PRESETS.length, 265);
  assert.deepEqual(COMMUNICATION_STYLE_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Communication Type",
    "Conflict Style",
    "Dialogue Seed",
    "Emotional Flavour",
    "Gate",
    "Method",
    "Motivation",
    "Romance Trope",
    "Trigger Event",
    "Wound",
  ]);

  const ids = COMMUNICATION_STYLE_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("comm_")));
  assert.equal(
    getCommunicationStylePresetsByCategory("Behaviour").find(
      (preset) => preset.value === "deflects with humour",
    )?.id,
    "comm_behaviour_deflects_with_humour",
  );
});

test("normalises readable communication values and repairs obvious wording", () => {
  const allText = JSON.stringify(COMMUNICATION_STYLE_PRESETS);
  const valueText = COMMUNICATION_STYLE_PRESETS.map((preset) => preset.value).join("\n");
  const behaviour = findCommunicationStylePresetById(
    "comm_behaviour_struggles_to_apologise",
  );
  const conflict = findCommunicationStylePresetById(
    "comm_conflict_uses_humour_to_de_escalate",
  );
  const method = findCommunicationStylePresetById("comm_method_half_truth");

  assert.equal(behaviour?.value, "struggles to apologise");
  assert.equal(conflict?.value, "uses humour to de-escalate");
  assert.equal(method?.value, "half-truth");
  assert.match(method?.guidance ?? "", /consequence-aware/i);
  assert.match(method?.guidance ?? "", /agency-safe/i);
  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.doesNotMatch(
    valueText,
    /avoid_conflict|deflects_with_humor|apologizes|sarcasm_as_armor|truth_or_dare_confession|trust_gate_reached/i,
  );
});

test("compiles communication presets as soft dialogue and conflict guidance", () => {
  const preset = findCommunicationStylePresetById(
    "comm_archetype_the_direct_confessor",
  );
  assert.ok(preset);

  const additions = compileCommunicationStylePresetAdditions(preset);

  assert.match(
    additions.speechStyleAddition,
    /Communication style preset: Archetype - The Direct Confessor/,
  );
  assert.match(additions.personalityAddition, /Communication archetype texture/);
  assert.match(additions.systemPromptAddition, /Communication style guidance/);
  assert.match(additions.systemPromptAddition, /soft communication context/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /must|force|critical|completely overwrite/i,
  );
});
