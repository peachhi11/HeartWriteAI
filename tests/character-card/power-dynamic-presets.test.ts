import assert from "node:assert/strict";
import test from "node:test";

import {
  POWER_DYNAMIC_PRESET_CATEGORIES,
  POWER_DYNAMIC_PRESETS,
  compilePowerDynamicPresetAdditions,
  findPowerDynamicPresetById,
  getPowerDynamicPresetsByCategory,
} from "../../data/powerDynamicPresets";

test("loads power dynamic presets across authority, status, conflict, gate, and dialogue lanes", () => {
  assert.equal(POWER_DYNAMIC_PRESETS.length, 263);
  assert.deepEqual(POWER_DYNAMIC_PRESET_CATEGORIES, [
    "Archetype",
    "Authority Power",
    "Competence Power",
    "Dialogue Seed",
    "Emotional Power",
    "Equal Partnership",
    "Gate",
    "High-Value Seed",
    "Power Conflict",
    "Power Dynamic",
    "Protective Power",
    "Romance Hook",
    "Social Status Power",
  ]);

  const ids = POWER_DYNAMIC_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getPowerDynamicPresetsByCategory("Archetype").length, 20);
  assert.equal(getPowerDynamicPresetsByCategory("Power Dynamic").length, 20);
  assert.equal(getPowerDynamicPresetsByCategory("Authority Power").length, 20);
  assert.equal(getPowerDynamicPresetsByCategory("Equal Partnership").length, 20);
  assert.equal(getPowerDynamicPresetsByCategory("Protective Power").length, 20);
  assert.equal(getPowerDynamicPresetsByCategory("Social Status Power").length, 20);
  assert.equal(getPowerDynamicPresetsByCategory("Emotional Power").length, 20);
  assert.equal(getPowerDynamicPresetsByCategory("Competence Power").length, 20);
  assert.equal(getPowerDynamicPresetsByCategory("Power Conflict").length, 20);
  assert.equal(getPowerDynamicPresetsByCategory("Romance Hook").length, 20);
  assert.equal(getPowerDynamicPresetsByCategory("Gate").length, 20);
  assert.equal(getPowerDynamicPresetsByCategory("Dialogue Seed").length, 23);
  assert.equal(getPowerDynamicPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises power dynamic values for visible prompt text", () => {
  const mentor = findPowerDynamicPresetById(
    "power_dynamic_archetype_mentor_adult_student",
  );
  const teacher = findPowerDynamicPresetById(
    "power_dynamic_archetype_teacher_adult_apprentice",
  );
  const judgement = findPowerDynamicPresetById(
    "power_dynamic_dialogue_i_trust_your_judgement",
  );
  const guidance = findPowerDynamicPresetById(
    "power_dynamic_conflict_guidance_versus_control",
  );
  const studentSurpasses = findPowerDynamicPresetById(
    "power_dynamic_romance_adult_student_surpasses_teacher",
  );

  assert.equal(mentor?.value, "Mentor / Adult Student");
  assert.equal(teacher?.value, "Teacher / Adult Apprentice");
  assert.equal(judgement?.value, "I trust your judgement.");
  assert.equal(guidance?.value, "guidance versus control");
  assert.equal(studentSurpasses?.value, "adult student surpasses teacher");

  const visibleText = POWER_DYNAMIC_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.doesNotMatch(
    visibleText,
    /Use code with caution|Mentor \/ Student|Teacher \/ Apprentice|judgment|\bvs\b|force prose|SYSTEM PROTOCOL/i,
  );
});

test("compiles power dynamic presets as soft consent-aware guidance", () => {
  const preset = findPowerDynamicPresetById(
    "power_dynamic_high_value_power_as_service_gate",
  );
  assert.ok(preset);

  const additions = compilePowerDynamicPresetAdditions(preset);

  assert.match(additions.relationshipAddition, /Power dynamic context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft power-dynamic context/i);
  assert.match(additions.systemPromptAddition, /mutual agency/i);
  assert.match(additions.systemPromptAddition, /adult context/i);
  assert.match(additions.systemPromptAddition, /avoid romanticising coercion/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps power gaps framed as ethical adult-context texture", () => {
  const coercionRisk = findPowerDynamicPresetById(
    "power_dynamic_conflict_power_without_consent",
  );
  const doctorPatient = findPowerDynamicPresetById(
    "power_dynamic_social_status_doctor_patient_context",
  );
  const adultStudent = findPowerDynamicPresetById(
    "power_dynamic_social_status_teacher_adult_student",
  );
  assert.ok(coercionRisk);
  assert.ok(doctorPatient);
  assert.ok(adultStudent);

  assert.match(coercionRisk.guidance, /conflict or danger to navigate/i);
  assert.match(coercionRisk.guidance, /not as a romance instruction/i);
  assert.match(doctorPatient.guidance, /ethics, boundaries/i);
  assert.match(adultStudent.guidance, /adult learning contexts/i);
});
