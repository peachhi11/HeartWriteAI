import assert from "node:assert/strict";
import test from "node:test";

import {
  MATURE_INTIMACY_PRESET_CATEGORIES,
  MATURE_INTIMACY_PRESETS,
  compileMatureIntimacyPresetAdditions,
  findMatureIntimacyPresetById,
  getMatureIntimacyPresetsByCategory,
} from "../../data/matureIntimacyPresets";

test("loads mature intimacy presets across attraction, tension, desire, gate, and dialogue lanes", () => {
  assert.equal(MATURE_INTIMACY_PRESETS.length, 212);
  assert.deepEqual(MATURE_INTIMACY_PRESET_CATEGORIES, [
    "Affection Intensity",
    "Archetype",
    "Attraction Style",
    "Desire Expression",
    "Dialogue Seed",
    "Gate",
    "High-Value Seed",
    "Intimacy Style",
    "Mature Intimacy",
    "Romance Hook",
    "Romantic Tension",
  ]);

  const ids = MATURE_INTIMACY_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getMatureIntimacyPresetsByCategory("Archetype").length, 20);
  assert.equal(getMatureIntimacyPresetsByCategory("Mature Intimacy").length, 20);
  assert.equal(getMatureIntimacyPresetsByCategory("Attraction Style").length, 20);
  assert.equal(getMatureIntimacyPresetsByCategory("Intimacy Style").length, 20);
  assert.equal(getMatureIntimacyPresetsByCategory("Romantic Tension").length, 20);
  assert.equal(getMatureIntimacyPresetsByCategory("Affection Intensity").length, 20);
  assert.equal(getMatureIntimacyPresetsByCategory("Desire Expression").length, 20);
  assert.equal(getMatureIntimacyPresetsByCategory("Romance Hook").length, 20);
  assert.equal(getMatureIntimacyPresetsByCategory("Gate").length, 15);
  assert.equal(getMatureIntimacyPresetsByCategory("Dialogue Seed").length, 17);
  assert.equal(getMatureIntimacyPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises mature intimacy values for visible prompt text", () => {
  const realisation = findMatureIntimacyPresetById(
    "mature_intimacy_tension_jealousy_realisation",
  );
  const firstRealisation = findMatureIntimacyPresetById(
    "mature_intimacy_romance_first_realisation_of_attraction",
  );
  const adultTension = findMatureIntimacyPresetById(
    "mature_intimacy_seed_adult_sexual_tension",
  );
  const consentDesire = findMatureIntimacyPresetById(
    "mature_intimacy_desire_consent_focused_desire",
  );

  assert.equal(realisation?.value, "jealousy realisation");
  assert.equal(firstRealisation?.value, "first realisation of attraction");
  assert.equal(adultTension?.value, "adult sexual tension");
  assert.equal(consentDesire?.value, "consent focused desire");

  const visibleText = MATURE_INTIMACY_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.doesNotMatch(
    visibleText,
    /Use code with caution|realization|first user|force prose|SYSTEM PROTOCOL|entitlement as proof/i,
  );
});

test("compiles mature intimacy presets as soft adult consent-aware guidance", () => {
  const preset = findMatureIntimacyPresetById(
    "mature_intimacy_high_value_consent_focused_desire",
  );
  assert.ok(preset);

  const additions = compileMatureIntimacyPresetAdditions(preset);

  assert.match(additions.relationshipAddition, /Adult romantic-intimacy context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.personalityAddition, /reducing the bond to physical escalation/i);
  assert.match(additions.systemPromptAddition, /soft adult romantic-intimacy context/i);
  assert.match(additions.systemPromptAddition, /mutually invited/i);
  assert.match(additions.systemPromptAddition, /consent, boundaries, pacing/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} agency/i);
  assert.match(additions.systemPromptAddition, /avoid treating attraction, jealousy, exclusivity, or desire as entitlement/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps desire, tension, and affection lanes paced and boundary-aware", () => {
  const desire = findMatureIntimacyPresetById(
    "mature_intimacy_desire_possessive_desire",
  );
  const tension = findMatureIntimacyPresetById(
    "mature_intimacy_tension_almost_touch",
  );
  const affection = findMatureIntimacyPresetById(
    "mature_intimacy_affection_intense_affection",
  );
  assert.ok(desire);
  assert.ok(tension);
  assert.ok(affection);

  assert.match(desire.guidance, /consent-focused, context-sensitive/i);
  assert.match(desire.guidance, /rather than assumed access or pressure/i);
  assert.match(tension.guidance, /without forcing confession, touch, or escalation/i);
  assert.match(affection.guidance, /paced, reciprocal/i);
});
