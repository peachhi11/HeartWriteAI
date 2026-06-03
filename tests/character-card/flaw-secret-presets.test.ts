import assert from "node:assert/strict";
import test from "node:test";

import {
  FLAW_SECRET_PRESET_CATEGORIES,
  FLAW_SECRET_PRESETS,
  compileFlawSecretPresetAdditions,
  compileFlawSecretPresetSummary,
  findFlawSecretPresetById,
  getFlawSecretPresetsByCategory,
} from "../../data/flawSecretPresets";

test("loads flaw/secret presets across hidden flaw and reveal lanes", () => {
  assert.equal(FLAW_SECRET_PRESETS.length, 240);
  assert.deepEqual(FLAW_SECRET_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Dialogue Seed",
    "Emotional Flavour",
    "Flaw Secret Type",
    "Gate",
    "Method",
    "Motivation",
    "Romance Trope",
    "Trigger Event",
    "Wound",
  ]);

  assert.equal(getFlawSecretPresetsByCategory("archetype").length, 20);
  assert.equal(getFlawSecretPresetsByCategory("behaviour").length, 20);
  assert.equal(getFlawSecretPresetsByCategory("dialogue seed").length, 20);
});

test("normalises readable flaw/secret values and reveal-risk routes", () => {
  const liar = findFlawSecretPresetById("flaw_secret_archetype_the_beautiful_liar");
  const apology = findFlawSecretPresetById(
    "flaw_secret_behaviour_apologises_too_quickly",
  );
  const toxicRisk = findFlawSecretPresetById(
    "flaw_secret_aftermath_toxic_denial_risk_route",
  );
  const hiddenControl = findFlawSecretPresetById(
    "flaw_secret_type_hidden_need_for_control",
  );

  assert.equal(liar?.label, "The Beautiful Liar");
  assert.equal(apology?.value, "apologises too quickly");
  assert.equal(toxicRisk?.value, "toxic denial risk route");
  assert.equal(hiddenControl?.value, "hidden need for control");

  const readableText = JSON.stringify(
    FLAW_SECRET_PRESETS.map((preset) => ({
      category: preset.category,
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
    })),
  );
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /apologizes|hidden_cowardice|toxic_denial_route/i);
  assert.doesNotMatch(readableText, /must confess/i);
});

test("compiles flaw/secret presets as soft character-depth and agency guidance", () => {
  const preset = findFlawSecretPresetById("flaw_secret_archetype_the_beautiful_liar");
  assert.ok(preset);

  const summary = compileFlawSecretPresetSummary(preset);
  const additions = compileFlawSecretPresetAdditions(preset);

  assert.match(summary, /Flaw\/secret preset: Archetype - The Beautiful Liar/);
  assert.match(additions.relationshipAddition, /do not force disclosure/i);
  assert.match(additions.personalityAddition, /healthier honesty only when relevant/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.match(additions.systemPromptAddition, /demand accountability/i);
  assert.match(additions.systemPromptAddition, /never resolve the secret/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must/i);
});
