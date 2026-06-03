import assert from "node:assert/strict";
import test from "node:test";

import {
  JEALOUSY_PRESET_CATEGORIES,
  JEALOUSY_PRESETS,
  compileJealousyPresetAdditions,
  findJealousyPresetById,
  getJealousyPresetsByCategory,
} from "../../data/jealousyPresets";

test("loads jealousy presets across all useful relationship-pressure lanes", () => {
  assert.equal(JEALOUSY_PRESETS.length, 259);
  assert.deepEqual(JEALOUSY_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Dialogue Seed",
    "Emotional Flavour",
    "Gate",
    "Jealousy Type",
    "Method",
    "Motivation",
    "Romance Trope",
    "Trigger Event",
    "Wound",
  ]);

  const ids = JEALOUSY_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("jealousy_")));
  assert.equal(
    getJealousyPresetsByCategory("Behaviour").find(
      (preset) => preset.value === "overanalyses user words",
    )?.id,
    "jealousy_behaviour_overanalyses_user_words",
  );
});

test("normalises readable jealousy values and frames risky methods safely", () => {
  const allText = JSON.stringify(JEALOUSY_PRESETS);
  const valueText = JEALOUSY_PRESETS.map((preset) => preset.value).join("\n");
  const dialogue = findJealousyPresetById(
    "jealousy_dialogue_i_didn_t_realise_you_two_were_so_close",
  );
  const method = findJealousyPresetById("jealousy_method_rival_intimidation");

  assert.equal(dialogue?.value, "I didn't realise you two were so close.");
  assert.equal(method?.value, "rival intimidation");
  assert.match(method?.guidance ?? "", /consequence-aware/i);
  assert.match(method?.guidance ?? "", /\{\{user\}\}'s choices/i);
  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.doesNotMatch(
    valueText,
    /romantic_jealousy|quietly_wounded|coldly_controlled|overanalyzes|apologizes|overprotective_behavior|trust_gate_reached/i,
  );
});

test("compiles jealousy presets as soft relationship and event-gated guidance", () => {
  const preset = findJealousyPresetById(
    "jealousy_archetype_the_quietly_jealous_protector",
  );
  assert.ok(preset);

  const additions = compileJealousyPresetAdditions(preset);

  assert.match(
    additions.relationshipAddition,
    /Jealousy preset: Archetype - The Quietly Jealous Protector/,
  );
  assert.match(additions.personalityAddition, /Jealousy archetype texture/);
  assert.match(additions.systemPromptAddition, /Jealousy guidance/);
  assert.match(additions.systemPromptAddition, /soft relationship context/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /must|force|critical|completely overwrite/i,
  );
});
