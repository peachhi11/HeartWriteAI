import assert from "node:assert/strict";
import test from "node:test";

import {
  compileMentorProtegePresetAdditions,
  compileMentorProtegePresetSummary,
  findMentorProtegePresetById,
  getMentorProtegePresetsByCategory,
  MENTOR_PROTEGE_PRESET_CATEGORIES,
  MENTOR_PROTEGE_PRESETS,
} from "../../data/mentorProtegePresets";

test("loads mentor/protege presets across growth and equal-status lanes", () => {
  assert.equal(MENTOR_PROTEGE_PRESETS.length, 295);
  assert.deepEqual(MENTOR_PROTEGE_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Dialogue Seed",
    "Emotional Flavour",
    "Gate",
    "Mentor Behaviour",
    "Mentor Motivation",
    "Method",
    "Protégé Behaviour",
    "Protégé Motivation",
    "Relationship Type",
    "Romance Trope",
    "Trigger Event",
    "Wound",
  ]);

  assert.equal(getMentorProtegePresetsByCategory("archetype").length, 25);
  assert.equal(getMentorProtegePresetsByCategory("mentor behaviour").length, 25);
});

test("normalises readable mentor/protege values and keeps authority routes ethical", () => {
  const giftedProtege = findMentorProtegePresetById(
    "mentor_protege_archetype_the_gifted_protege",
  );
  const teacherStudent = findMentorProtegePresetById(
    "mentor_protege_type_teacher_student",
  );
  const equalAfterTraining = findMentorProtegePresetById(
    "mentor_protege_trope_equal_after_training",
  );
  const honoursMentor = findMentorProtegePresetById(
    "mentor_protege_protege_motivation_honour_mentor",
  );
  const recognisesGrowth = findMentorProtegePresetById(
    "mentor_protege_mentor_behaviour_recognises_growth",
  );

  assert.equal(giftedProtege?.label, "The Gifted Protégé");
  assert.equal(teacherStudent?.value, "teacher student");
  assert.match(teacherStudent?.guidance ?? "", /not entitlement to intimacy or obedience/i);
  assert.match(equalAfterTraining?.guidance ?? "", /consenting adult romance routes/i);
  assert.equal(honoursMentor?.value, "honour mentor");
  assert.equal(recognisesGrowth?.value, "recognises growth");

  const readableText = JSON.stringify(
    MENTOR_PROTEGE_PRESETS.map((preset) => ({
      category: preset.category,
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
    })),
  );
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /teacher_student|honor_mentor|favorite|fulfill|recognizes/i);
});

test("compiles mentor/protege presets as soft growth and agency guidance", () => {
  const preset = findMentorProtegePresetById(
    "mentor_protege_archetype_the_stern_mentor",
  );
  assert.ok(preset);

  const summary = compileMentorProtegePresetSummary(preset);
  const additions = compileMentorProtegePresetAdditions(preset);

  assert.match(summary, /Mentor\/protégé preset: Archetype - The Stern Mentor/);
  assert.match(additions.relationshipAddition, /growth/);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force|override/i);
});
