import assert from "node:assert/strict";
import test from "node:test";

import {
  MENTAL_EMOTIONAL_PATTERN_PRESET_CATEGORIES,
  MENTAL_EMOTIONAL_PATTERN_PRESETS,
  compileMentalEmotionalPatternPresetAdditions,
  copingStyleSeeds,
  findMentalEmotionalPatternPresetById,
  getMentalEmotionalPatternPresetsByCategory,
  highValueMentalEmotionalPatternSeeds,
  humorStyleSeeds,
  mentalEmotionalPatternDialogueSeeds,
  mentalEmotionalPatternGates,
  mentalEmotionalPatternHooks,
  mentalEmotionalPatternPresets,
  shameResponseSeeds,
  stressResponseSeeds,
  vulnerabilityHabitSeeds,
} from "../../data/mentalEmotionalPatternPresets";

test("loads mental and emotional pattern presets across coping, stress, vulnerability, and romance lanes", () => {
  assert.equal(MENTAL_EMOTIONAL_PATTERN_PRESETS.length, 177);
  assert.deepEqual(MENTAL_EMOTIONAL_PATTERN_PRESET_CATEGORIES, [
    "Archetype",
    "Coping Style",
    "Dialogue Seed",
    "Gate",
    "High-Value Seed",
    "Humour Style",
    "Romance Hook",
    "Shame Response",
    "Stress Response",
    "Vulnerability Habit",
  ]);

  const ids = MENTAL_EMOTIONAL_PATTERN_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(mentalEmotionalPatternPresets.length, 20);
  assert.equal(copingStyleSeeds.length, 20);
  assert.equal(stressResponseSeeds.length, 20);
  assert.equal(humorStyleSeeds.length, 15);
  assert.equal(shameResponseSeeds.length, 15);
  assert.equal(vulnerabilityHabitSeeds.length, 20);
  assert.equal(mentalEmotionalPatternHooks.length, 15);
  assert.equal(mentalEmotionalPatternGates.length, 15);
  assert.equal(mentalEmotionalPatternDialogueSeeds.length, 17);
  assert.equal(highValueMentalEmotionalPatternSeeds.length, 20);
  assert.equal(getMentalEmotionalPatternPresetsByCategory("Coping Style").length, 20);
  assert.equal(getMentalEmotionalPatternPresetsByCategory("Stress Response").length, 20);
  assert.equal(getMentalEmotionalPatternPresetsByCategory("Humour Style").length, 15);
  assert.equal(getMentalEmotionalPatternPresetsByCategory("Shame Response").length, 15);
  assert.equal(getMentalEmotionalPatternPresetsByCategory("Dialogue Seed").length, 17);
});

test("normalises mental and emotional pattern values for visible prompt text", () => {
  const humourDeflector = findMentalEmotionalPatternPresetById(
    "mental_emotional_pattern_archetype_the_humour_deflector",
  );
  const humourCoping = findMentalEmotionalPatternPresetById(
    "mental_emotional_pattern_coping_humour_coping",
  );
  const deescalates = findMentalEmotionalPatternPresetById(
    "mental_emotional_pattern_humour_uses_humour_to_de_escalate",
  );
  const apologises = findMentalEmotionalPatternPresetById(
    "mental_emotional_pattern_shame_apologises_too_much",
  );
  const userNotices = findMentalEmotionalPatternPresetById(
    "mental_emotional_pattern_romance_user_notices_coping_pattern",
  );
  const visibleText = MENTAL_EMOTIONAL_PATTERN_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(humourDeflector?.value, "The Humour Deflector");
  assert.equal(humourDeflector?.triggerKeys.includes("The Humor Deflector"), true);
  assert.equal(humourCoping?.value, "humour coping");
  assert.equal(deescalates?.value, "uses humour to de-escalate");
  assert.equal(apologises?.value, "apologises too much");
  assert.equal(userNotices?.value, "{{user}} notices coping pattern");
  assert.doesNotMatch(
    visibleText,
    /\bhumor\b|\bapologizes\b|\bapologize\b|\bdeescalate\b|user notices/i,
  );
});

test("finds high-signal mental and emotional pattern seeds by stable ids", () => {
  assert.equal(
    findMentalEmotionalPatternPresetById(
      "mental_emotional_pattern_stress_needs_reassurance_under_stress",
    )?.value,
    "needs reassurance under stress",
  );
  assert.equal(
    findMentalEmotionalPatternPresetById(
      "mental_emotional_pattern_humour_deflects_with_humour",
    )?.value,
    "deflects with humour",
  );
  assert.equal(
    findMentalEmotionalPatternPresetById(
      "mental_emotional_pattern_vulnerability_safe_person_required",
    )?.value,
    "safe person required",
  );
  assert.equal(
    findMentalEmotionalPatternPresetById(
      "mental_emotional_pattern_gate_safe_to_be_seen_gate",
    )?.value,
    "safe to be seen gate",
  );
  assert.equal(
    findMentalEmotionalPatternPresetById(
      "mental_emotional_pattern_dialogue_you_are_spiraling",
    )?.value,
    "You are spiraling.",
  );
  assert.equal(
    findMentalEmotionalPatternPresetById(
      "mental_emotional_pattern_high_value_safe_to_be_seen_gate",
    )?.value,
    "safe to be seen gate",
  );
});

test("compiles mental and emotional patterns as soft non-diagnostic context", () => {
  const preset = findMentalEmotionalPatternPresetById(
    "mental_emotional_pattern_vulnerability_safe_person_required",
  );
  assert.ok(preset);

  const additions = compileMentalEmotionalPatternPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Mental and emotional pattern context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft mental and emotional pattern context/i);
  assert.match(additions.systemPromptAddition, /grounding, reassurance, and repair/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} autonomy intact/i);
  assert.match(additions.systemPromptAddition, /avoid diagnosing, forcing distress/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
