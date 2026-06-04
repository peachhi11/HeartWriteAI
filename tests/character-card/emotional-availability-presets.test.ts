import assert from "node:assert/strict";
import test from "node:test";

import {
  EMOTIONAL_AVAILABILITY_PRESET_CATEGORIES,
  EMOTIONAL_AVAILABILITY_PRESETS,
  compileEmotionalAvailabilityPresetAdditions,
  findEmotionalAvailabilityPresetById,
  getEmotionalAvailabilityPresetsByCategory,
} from "../../data/emotionalAvailabilityPresets";

test("loads emotional availability presets across openness, conflict, romance, and dialogue lanes", () => {
  assert.equal(EMOTIONAL_AVAILABILITY_PRESETS.length, 161);
  assert.deepEqual(EMOTIONAL_AVAILABILITY_PRESET_CATEGORIES, [
    "Archetype",
    "Availability",
    "Conflict",
    "Dialogue Seed",
    "Gate",
    "High-Value Seed",
    "Romance Hook",
    "Style",
  ]);

  const ids = EMOTIONAL_AVAILABILITY_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getEmotionalAvailabilityPresetsByCategory("Archetype").length, 20);
  assert.equal(getEmotionalAvailabilityPresetsByCategory("Availability").length, 20);
  assert.equal(getEmotionalAvailabilityPresetsByCategory("Style").length, 20);
  assert.equal(getEmotionalAvailabilityPresetsByCategory("Conflict").length, 20);
  assert.equal(getEmotionalAvailabilityPresetsByCategory("Romance Hook").length, 20);
  assert.equal(getEmotionalAvailabilityPresetsByCategory("Gate").length, 20);
  assert.equal(getEmotionalAvailabilityPresetsByCategory("Dialogue Seed").length, 21);
  assert.equal(getEmotionalAvailabilityPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises emotional availability values for visible prompt text", () => {
  const wit = findEmotionalAvailabilityPresetById(
    "emotional_availability_archetype_deflects_with_wit",
  );
  const opensForUser = findEmotionalAvailabilityPresetById(
    "emotional_availability_style_opens_up_when_user_is_gentle",
  );
  const truthHandled = findEmotionalAvailabilityPresetById(
    "emotional_availability_romance_first_user_handles_truth_gently",
  );

  assert.equal(wit?.value, "Deflects With Wit");
  assert.equal(opensForUser?.value, "opens up when {{user}} is gentle");
  assert.equal(truthHandled?.value, "first {{user}} handles truth gently");

  const visibleText = EMOTIONAL_AVAILABILITY_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.doesNotMatch(
    visibleText,
    /Use code with caution|Deflects With Humor|opens up when user|first user handles|force prose|SYSTEM PROTOCOL/i,
  );
});

test("compiles emotional availability presets as soft vulnerability guidance", () => {
  const preset = findEmotionalAvailabilityPresetById(
    "emotional_availability_high_value_trust_over_fear_gate",
  );
  assert.ok(preset);

  const additions = compileEmotionalAvailabilityPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Emotional availability context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft emotional availability context/i);
  assert.match(additions.systemPromptAddition, /preserve \{\{user\}\} agency/i);
  assert.match(additions.systemPromptAddition, /avoid turning fear or avoidance into a fixed identity/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps emotional conflict repairable and disclosure consent-aware", () => {
  const panic = findEmotionalAvailabilityPresetById(
    "emotional_availability_conflict_intimacy_triggers_panic",
  );
  const unsafeLove = findEmotionalAvailabilityPresetById(
    "emotional_availability_conflict_love_felt_unsafe_before",
  );
  assert.ok(panic);
  assert.ok(unsafeLove);

  assert.match(panic.guidance, /context-dependent and repairable/i);
  assert.match(unsafeLove.guidance, /boundaries, growth, and accountability/i);
});
