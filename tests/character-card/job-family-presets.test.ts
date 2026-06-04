import assert from "node:assert/strict";
import test from "node:test";

import {
  JOB_FAMILY_PRESET_CATEGORIES,
  JOB_FAMILY_PRESETS,
  compileJobFamilyPresetAdditions,
  findJobFamilyPresetById,
  getJobFamilyPresetsByCategory,
} from "../../data/jobFamilyPresets";

test("loads job family presets across modern, historical, fantasy, sci-fi, and romance lanes", () => {
  assert.equal(JOB_FAMILY_PRESETS.length, 312);
  assert.deepEqual(JOB_FAMILY_PRESET_CATEGORIES, [
    "Archetype",
    "Conflict",
    "Fantasy Job",
    "Gate",
    "High-Value Seed",
    "Historical Job",
    "Job Family",
    "Modern Job",
    "Romance Hook",
    "Sci-Fi Job",
  ]);

  const ids = JOB_FAMILY_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getJobFamilyPresetsByCategory("Job Family").length, 132);
  assert.equal(getJobFamilyPresetsByCategory("Modern Job").length, 25);
  assert.equal(getJobFamilyPresetsByCategory("Gate").length, 15);
});

test("normalises job family values for visible prompt text", () => {
  const defence = findJobFamilyPresetById("job_family_archetype_military_and_defence");
  const labour = findJobFamilyPresetById("job_family_seed_manual_labour");
  const organised = findJobFamilyPresetById("job_family_seed_organised_crime");
  const userEngineer = findJobFamilyPresetById("job_family_romance_engineer_saves_user");
  const career = findJobFamilyPresetById("job_family_conflict_career_against_love");
  const visibleText = JOB_FAMILY_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(defence?.value, "Military and Defence");
  assert.equal(labour?.value, "manual labour");
  assert.equal(organised?.value, "organised crime");
  assert.equal(userEngineer?.value, "engineer saves {{user}}");
  assert.equal(career?.value, "career against love");
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|Defense|manual labor|organized crime|engineer saves user|career_vs_love|\bvs\b/i,
  );
});

test("compiles job family presets as soft workplace-aware context", () => {
  const preset = findJobFamilyPresetById("job_family_conflict_professional_boundaries");
  assert.ok(preset);

  const additions = compileJobFamilyPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Job family context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft job family context/i);
  assert.match(additions.systemPromptAddition, /workplace ethics, consequence, and \{\{user\}\} autonomy/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
