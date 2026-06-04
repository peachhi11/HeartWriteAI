import assert from "node:assert/strict";
import test from "node:test";

import {
  SOMATIC_DETAIL_PRESET_CATEGORIES,
  SOMATIC_DETAIL_PRESETS,
  compileSomaticDetailPresetAdditions,
  findSomaticDetailPresetById,
  getSomaticDetailPresetsByCategory,
} from "../../data/somaticDetailPresets";

test("loads somatic detail presets across body, breath, touch, safety, and dialogue lanes", () => {
  assert.equal(SOMATIC_DETAIL_PRESETS.length, 194);
  assert.deepEqual(SOMATIC_DETAIL_PRESET_CATEGORIES, [
    "Archetype",
    "Breath",
    "Dialogue Seed",
    "Distress",
    "Gate",
    "High-Value Seed",
    "Movement",
    "Romance Hook",
    "Safety",
    "Somatic Detail",
    "Tension",
    "Touch",
  ]);

  const ids = SOMATIC_DETAIL_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getSomaticDetailPresetsByCategory("Archetype").length, 20);
  assert.equal(getSomaticDetailPresetsByCategory("Somatic Detail").length, 20);
  assert.equal(getSomaticDetailPresetsByCategory("Breath").length, 15);
  assert.equal(getSomaticDetailPresetsByCategory("Tension").length, 15);
  assert.equal(getSomaticDetailPresetsByCategory("Touch").length, 15);
  assert.equal(getSomaticDetailPresetsByCategory("Movement").length, 15);
  assert.equal(getSomaticDetailPresetsByCategory("Safety").length, 15);
  assert.equal(getSomaticDetailPresetsByCategory("Distress").length, 15);
  assert.equal(getSomaticDetailPresetsByCategory("Romance Hook").length, 15);
  assert.equal(getSomaticDetailPresetsByCategory("Gate").length, 15);
  assert.equal(getSomaticDetailPresetsByCategory("Dialogue Seed").length, 18);
  assert.equal(getSomaticDetailPresetsByCategory("High-Value Seed").length, 16);
});

test("normalises somatic detail values for visible prompt text", () => {
  const relaxedType = findSomaticDetailPresetById(
    "somatic_detail_archetype_the_relaxed_around_user_type",
  );
  const physicalised = findSomaticDetailPresetById(
    "somatic_detail_seed_physicalised_feelings",
  );
  const breathNearUser = findSomaticDetailPresetById(
    "somatic_detail_breath_breathes_easier_near_user",
  );
  const safety = findSomaticDetailPresetById(
    "somatic_detail_safety_body_relaxes_near_user",
  );
  const recognisedSafety = findSomaticDetailPresetById(
    "somatic_detail_romance_nervous_system_recognises_safety",
  );

  assert.equal(relaxedType?.value, "The Relaxed Around {{user}} Type");
  assert.equal(physicalised?.value, "physicalised feelings");
  assert.equal(breathNearUser?.value, "breathes easier near {{user}}");
  assert.equal(safety?.value, "body relaxes near {{user}}");
  assert.equal(recognisedSafety?.value, "nervous system recognises safety");

  const visibleText = SOMATIC_DETAIL_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.doesNotMatch(
    visibleText,
    /Use code with caution|physicalized|recognizes|near user|matches user|sleep near user|force prose|SYSTEM PROTOCOL|body’s/i,
  );
});

test("compiles somatic detail presets as soft body-cue guidance", () => {
  const preset = findSomaticDetailPresetById(
    "somatic_detail_high_value_body_learns_safety_gate",
  );
  assert.ok(preset);

  const additions = compileSomaticDetailPresetAdditions(preset);

  assert.match(additions.descriptionAddition, /Somatic detail context/);
  assert.match(additions.personalityAddition, /without making the body cue absolute proof/i);
  assert.match(additions.systemPromptAddition, /soft somatic detail context/i);
  assert.match(additions.systemPromptAddition, /preserve \{\{user\}\} agency/i);
  assert.match(additions.systemPromptAddition, /avoid using panic, pain, or trauma response as romantic proof/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps touch and distress lanes consent-aware and recovery-focused", () => {
  const touch = findSomaticDetailPresetById("somatic_detail_touch_flinches_from_touch");
  const distress = findSomaticDetailPresetById("somatic_detail_distress_panic_in_body");
  assert.ok(touch);
  assert.ok(distress);

  assert.match(touch.guidance, /permission-aware, paced, and responsive/i);
  assert.match(distress.guidance, /grounding, boundaries, and recovery/i);
});
