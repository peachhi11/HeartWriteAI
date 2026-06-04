import assert from "node:assert/strict";
import test from "node:test";

import {
  ACADEMIC_DISCIPLINE_PRESET_CATEGORIES,
  ACADEMIC_DISCIPLINE_PRESETS,
  compileAcademicDisciplinePresetAdditions,
  findAcademicDisciplinePresetById,
  getAcademicDisciplinePresetsByCategory,
} from "../../data/academicDisciplinePresets";

test("loads academic discipline presets across study, romance, gates, and dialogue lanes", () => {
  assert.equal(ACADEMIC_DISCIPLINE_PRESETS.length, 227);
  assert.deepEqual(ACADEMIC_DISCIPLINE_PRESET_CATEGORIES, [
    "Archetype",
    "Dialogue Seed",
    "Discipline",
    "Gate",
    "High-Value Seed",
    "Romance Hook",
  ]);

  const ids = ACADEMIC_DISCIPLINE_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getAcademicDisciplinePresetsByCategory("Discipline").length, 129);
  assert.equal(getAcademicDisciplinePresetsByCategory("Dialogue Seed").length, 18);
  assert.equal(getAcademicDisciplinePresetsByCategory("High-Value Seed").length, 20);
});

test("normalises academic discipline values for visible prompt text", () => {
  const palaeontology = findAcademicDisciplinePresetById(
    "academic_discipline_seed_palaeontology",
  );
  const userRespect = findAcademicDisciplinePresetById(
    "academic_discipline_romance_brilliant_rival_respects_user",
  );
  const visibleText = ACADEMIC_DISCIPLINE_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(palaeontology?.value, "palaeontology");
  assert.equal(userRespect?.value, "brilliant rival respects {{user}}");
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|paleontology|respects user|force prose|SYSTEM PROTOCOL/i,
  );
});

test("compiles academic discipline presets as soft ethics-aware context", () => {
  const preset = findAcademicDisciplinePresetById("academic_discipline_seed_psychology");
  assert.ok(preset);

  const additions = compileAcademicDisciplinePresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Academic discipline context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft academic discipline context/i);
  assert.match(additions.systemPromptAddition, /academic ethics, humility, and \{\{user\}\} autonomy/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
