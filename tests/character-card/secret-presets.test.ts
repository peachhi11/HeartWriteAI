import assert from "node:assert/strict";
import test from "node:test";

import {
  SECRET_PRESET_CATEGORIES,
  SECRET_PRESETS,
  compileSecretPresetAdditions,
  findSecretPresetById,
  getSecretPresetsByCategory,
} from "../../data/secretPresets";

test("loads secret presets across all useful vocabulary lanes", () => {
  assert.equal(SECRET_PRESETS.length, 217);
  assert.deepEqual(SECRET_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Dialogue Seed",
    "Discovery Trigger",
    "Emotional Flavour",
    "Motivation",
    "Romance Trope",
    "Secret Type",
    "Severity",
  ]);

  const ids = SECRET_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("secret_")));
  assert.equal(
    getSecretPresetsByCategory("Romance Trope").find((preset) => preset.value === "secret admirer")?.id,
    "secret_trope_secret_admirer",
  );
});

test("normalises readable secret values and frames risky hooks safely", () => {
  const allText = JSON.stringify(SECRET_PRESETS);
  const valueText = SECRET_PRESETS.map((preset) => preset.value).join("\n");
  const behaviour = findSecretPresetById("secret_behaviour_uses_humour");
  const trope = findSecretPresetById("secret_trope_secret_stalker_protector");
  const motivation = findSecretPresetById("secret_motivation_self_preservation");

  assert.equal(behaviour?.value, "uses humour");
  assert.equal(motivation?.value, "self-preservation");
  assert.equal(trope?.value, "secret stalker protector");
  assert.match(trope?.guidance ?? "", /consent-aware, consequence-aware, and bounded by player agency/i);
  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.doesNotMatch(valueText, /hidden_identity|trust_gate_reached|self_loathing|forgiveness_route/i);
});

test("compiles secret presets as soft reveal and event-gated guidance", () => {
  const preset = findSecretPresetById("secret_archetype_the_confession_avoider");
  assert.ok(preset);

  const additions = compileSecretPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Secret preset: Archetype - The Confession Avoider/);
  assert.match(additions.personalityAddition, /Secret archetype texture/);
  assert.match(additions.systemPromptAddition, /Secret guidance/);
  assert.match(additions.systemPromptAddition, /keyword triggers and event gates as soft context/i);
  assert.match(additions.systemPromptAddition, /do not override player agency/i);
  assert.match(additions.systemPromptAddition, /avoid reducing the character to secrecy-only behaviour/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force|critical|completely overwrite/i);
});
