import assert from "node:assert/strict";
import test from "node:test";

import {
  ACADEMIC_RIVAL_PRESET_CATEGORIES,
  ACADEMIC_RIVAL_PRESETS,
  compileAcademicRivalPresetAdditions,
  compileAcademicRivalPresetSummary,
  findAcademicRivalPresetById,
  getAcademicRivalPresetsByCategory,
} from "../../data/academicRivalPresets";

test("loads academic/rival presets across competition and respect lanes", () => {
  assert.equal(ACADEMIC_RIVAL_PRESETS.length, 250);
  assert.deepEqual(ACADEMIC_RIVAL_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Dialogue Seed",
    "Dynamic Type",
    "Emotional Flavour",
    "Gate",
    "Method",
    "Motivation",
    "Romance Trope",
    "Trigger Event",
    "Wound",
  ]);

  assert.equal(getAcademicRivalPresetsByCategory("archetype").length, 20);
  assert.equal(getAcademicRivalPresetsByCategory("trigger event").length, 25);
  assert.equal(getAcademicRivalPresetsByCategory("behaviour").length, 25);
});

test("normalises readable academic/rival values and UK spelling", () => {
  const topStudent = findAcademicRivalPresetById(
    "academic_rival_archetype_the_top_student_rival",
  );
  const favourite = findAcademicRivalPresetById(
    "academic_rival_archetype_the_professors_favourite",
  );
  const defence = findAcademicRivalPresetById(
    "academic_rival_trigger_thesis_defence",
  );
  const rivalry = findAcademicRivalPresetById(
    "academic_rival_type_professor_favourite_rivalry",
  );

  assert.equal(topStudent?.label, "The Top Student Rival");
  assert.equal(favourite?.value, "The Professor's Favourite");
  assert.equal(defence?.value, "thesis defence");
  assert.equal(rivalry?.value, "professor favourite rivalry");

  const readableText = JSON.stringify(
    ACADEMIC_RIVAL_PRESETS.map((preset) => ({
      category: preset.category,
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
    })),
  );
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /professor's favorite|favorites|defense|academic_rivals|slow_burn/i);
});

test("compiles academic/rival presets as soft competition and respect guidance", () => {
  const preset = findAcademicRivalPresetById(
    "academic_rival_archetype_the_academic_nemesis",
  );
  assert.ok(preset);

  const summary = compileAcademicRivalPresetSummary(preset);
  const additions = compileAcademicRivalPresetAdditions(preset);

  assert.match(summary, /Academic\/rival preset: Archetype - The Academic Nemesis/);
  assert.match(additions.relationshipAddition, /mutual respect/i);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /rivalry to remain healthy or de-escalate/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force|override/i);
});
