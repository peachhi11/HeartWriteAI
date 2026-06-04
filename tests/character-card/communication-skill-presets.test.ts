import assert from "node:assert/strict";
import test from "node:test";

import {
  COMMUNICATION_SKILL_PRESET_CATEGORIES,
  COMMUNICATION_SKILL_PRESETS,
  compileCommunicationSkillPresetAdditions,
  findCommunicationSkillPresetById,
  getCommunicationSkillPresetsByCategory,
} from "../../data/communicationSkillPresets";

test("loads communication skill presets across speaking, writing, listening, and romance lanes", () => {
  assert.equal(COMMUNICATION_SKILL_PRESETS.length, 292);
  assert.deepEqual(COMMUNICATION_SKILL_PRESET_CATEGORIES, [
    "Archetype",
    "Core Skill",
    "Dialogue Seed",
    "Investigative Skill",
    "Language Skill",
    "Listening Skill",
    "Mastery",
    "Non-Verbal Skill",
    "Persuasion Skill",
    "Romantic Communication Skill",
    "Speaking Skill",
    "Teaching Skill",
    "Weakness",
    "Writing Skill",
  ]);

  const ids = COMMUNICATION_SKILL_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getCommunicationSkillPresetsByCategory("Speaking Skill").length, 30);
  assert.equal(getCommunicationSkillPresetsByCategory("Writing Skill").length, 30);
  assert.equal(getCommunicationSkillPresetsByCategory("Dialogue Seed").length, 12);
});

test("normalises communication skill values for visible prompt text", () => {
  const counsellor = findCommunicationSkillPresetById(
    "communication_skill_archetype_the_gentle_counsellor",
  );
  const nonVerbal = findCommunicationSkillPresetById(
    "communication_skill_core_non_verbal_communication",
  );
  const judgement = findCommunicationSkillPresetById(
    "communication_skill_listening_non_judgemental_listening",
  );
  const signalling = findCommunicationSkillPresetById(
    "communication_skill_non_verbal_emotional_signalling",
  );
  const organisation = findCommunicationSkillPresetById(
    "communication_skill_teaching_knowledge_organisation",
  );
  const defence = findCommunicationSkillPresetById(
    "communication_skill_weakness_silence_as_defence",
  );
  const allText = JSON.stringify(COMMUNICATION_SKILL_PRESETS);

  assert.equal(counsellor?.value, "The Gentle Counsellor");
  assert.equal(nonVerbal?.value, "non-verbal communication");
  assert.equal(judgement?.value, "non-judgemental listening");
  assert.equal(signalling?.value, "emotional signalling");
  assert.equal(organisation?.value, "knowledge organisation");
  assert.equal(defence?.value, "silence as defence");
  assert.doesNotMatch(
    allText,
    /Use code with caution|Counselor|nonverbal|nonjudgmental|signaling|organization|defense/i,
  );
});

test("compiles communication skill presets as soft interpersonal context", () => {
  const preset = findCommunicationSkillPresetById(
    "communication_skill_romantic_boundary_discussion",
  );
  assert.ok(preset);

  const additions = compileCommunicationSkillPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Communication skill context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft interpersonal context/i);
  assert.match(additions.systemPromptAddition, /preserve consent, boundaries, and \{\{user\}\} autonomy/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps investigative communication ethical and consequence-aware", () => {
  const preset = findCommunicationSkillPresetById(
    "communication_skill_investigative_sensitive_topic_navigation",
  );
  assert.ok(preset);

  const additions = compileCommunicationSkillPresetAdditions(preset);

  assert.match(preset.guidance, /ethical pressure/i);
  assert.match(additions.systemPromptAddition, /limits, and consequences surface/i);
  assert.doesNotMatch(additions.systemPromptAddition, /override|ignore consent/i);
});
