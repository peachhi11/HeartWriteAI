import assert from "node:assert/strict";
import test from "node:test";

import {
  MEDICAL_SKILL_PRESET_CATEGORIES,
  MEDICAL_SKILL_PRESETS,
  compileMedicalSkillPresetAdditions,
  findMedicalSkillPresetById,
  getMedicalSkillPresetsByCategory,
} from "../../data/medicalSkillPresets";

test("loads medical skill presets across clinical, emergency, healing, and romance lanes", () => {
  assert.equal(MEDICAL_SKILL_PRESETS.length, 340);
  assert.deepEqual(MEDICAL_SKILL_PRESET_CATEGORIES, [
    "Archetype",
    "Clinical Skill",
    "Core Skill",
    "Dialogue Seed",
    "Emergency Skill",
    "Fantasy Medical Skill",
    "Gate",
    "High-Value Seed",
    "Mastery",
    "Mental Health Skill",
    "Nursing Skill",
    "Pharmaceutical Skill",
    "Research Skill",
    "Romance Hook",
    "Sci-Fi Medical Skill",
    "Surgical Skill",
    "Weakness",
  ]);

  const ids = MEDICAL_SKILL_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getMedicalSkillPresetsByCategory("Clinical Skill").length, 20);
  assert.equal(getMedicalSkillPresetsByCategory("Dialogue Seed").length, 20);
  assert.equal(getMedicalSkillPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises medical values for visible prompt text", () => {
  const counselling = findMedicalSkillPresetById("medical_skill_mental_health_counselling");
  const behavioural = findMedicalSkillPresetById(
    "medical_skill_mental_health_behavioural_analysis",
  );
  const orthopaedic = findMedicalSkillPresetById(
    "medical_skill_surgical_orthopaedic_surgery",
  );
  const paediatric = findMedicalSkillPresetById("medical_skill_nursing_paediatric_care");
  const saviour = findMedicalSkillPresetById("medical_skill_weakness_saviour_complex");
  const optimisation = findMedicalSkillPresetById(
    "medical_skill_pharmaceutical_treatment_optimisation",
  );
  const allVisibleText = MEDICAL_SKILL_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(counselling?.value, "counselling");
  assert.equal(behavioural?.value, "behavioural analysis");
  assert.equal(orthopaedic?.value, "orthopaedic surgery");
  assert.equal(paediatric?.value, "paediatric care");
  assert.equal(saviour?.value, "saviour complex");
  assert.equal(optimisation?.value, "treatment optimisation");
  assert.doesNotMatch(
    allVisibleText,
    /Use code with caution|counseling|behavioral|orthopedic|pediatric|savior|optimization|stabilization/i,
  );
});

test("compiles medical presets as soft ethical care context", () => {
  const preset = findMedicalSkillPresetById("medical_skill_romance_injury_caretaking");
  assert.ok(preset);

  const additions = compileMedicalSkillPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Medical skill context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft medical or healing context/i);
  assert.match(additions.systemPromptAddition, /professional ethics, and \{\{user\}\} autonomy/i);
  assert.match(additions.systemPromptAddition, /support recovery rather than force a cure/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps medical romance and healer weakness boundary-aware", () => {
  const doctorPatient = findMedicalSkillPresetById(
    "medical_skill_romance_doctor_falls_for_patient_adult_ethical_context",
  );
  const saviour = findMedicalSkillPresetById("medical_skill_weakness_saviour_complex");
  assert.ok(doctorPatient);
  assert.ok(saviour);

  assert.match(doctorPatient.guidance, /adult-only ethical complications/i);
  assert.match(saviour.guidance, /without making the character responsible for fixing everyone/i);
});
