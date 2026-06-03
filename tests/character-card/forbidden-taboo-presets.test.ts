import assert from "node:assert/strict";
import test from "node:test";

import {
  compileForbiddenTabooPresetAdditions,
  FORBIDDEN_TABOO_PRESET_CATEGORIES,
  FORBIDDEN_TABOO_PRESETS,
  findForbiddenTabooPresetById,
  getForbiddenTabooPresetsByCategory,
} from "../../data/forbiddenTabooPresets";

test("loads forbidden taboo presets as relationship intersection pressure", () => {
  assert.equal(FORBIDDEN_TABOO_PRESETS.length, 245);
  assert.deepEqual(FORBIDDEN_TABOO_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Barrier",
    "Behaviour",
    "Dialogue Seed",
    "Emotional Flavour",
    "Gate",
    "Motivation",
    "Relationship Type",
    "Romance Trope",
    "Trigger Event",
    "Wound",
  ]);

  const ids = FORBIDDEN_TABOO_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("forbidden_taboo_")));
  assert.equal(
    getForbiddenTabooPresetsByCategory("Behaviour").find(
      (preset) => preset.value === "honours oath despite pain",
    )?.id,
    "forbidden_taboo_behaviour_honours_oath_despite_pain",
  );
});

test("normalises readable forbidden values and keeps taboo as non-sexual taxonomy", () => {
  const allText = JSON.stringify(FORBIDDEN_TABOO_PRESETS);
  const valueText = FORBIDDEN_TABOO_PRESETS.map((preset) => preset.value).join("\n");
  const teacher = findForbiddenTabooPresetById(
    "forbidden_taboo_type_teacher_student_adult",
  );
  const wound = findForbiddenTabooPresetById(
    "forbidden_taboo_wound_love_versus_duty",
  );
  const trope = findForbiddenTabooPresetById(
    "forbidden_taboo_trope_best_friends_ex",
  );
  const behaviour = findForbiddenTabooPresetById(
    "forbidden_taboo_behaviour_honours_oath_despite_pain",
  );

  assert.equal(teacher?.value, "teacher student adult");
  assert.match(teacher?.guidance ?? "", /not coercion or guaranteed romance/i);
  assert.equal(wound?.value, "love versus duty");
  assert.equal(trope?.value, "best friend's ex");
  assert.equal(behaviour?.value, "honours oath despite pain");
  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.doesNotMatch(
    valueText,
    /enemy_factions|teacher_student_adult|best_friends_ex|love_vs_duty|honors_oath|behavioral/i,
  );
});

test("compiles forbidden taboo presets as soft intersection guidance", () => {
  const preset = findForbiddenTabooPresetById(
    "forbidden_taboo_archetype_the_forbidden_lover",
  );
  assert.ok(preset);

  const additions = compileForbiddenTabooPresetAdditions(preset);

  assert.match(
    additions.backgroundAddition,
    /Forbidden\/taboo intersection preset: Archetype - The Forbidden Lover/,
  );
  assert.match(
    additions.relationshipAddition,
    /Forbidden\/taboo intersection preset: Archetype - The Forbidden Lover/,
  );
  assert.match(
    additions.personalityAddition,
    /Forbidden\/taboo archetype intersection/,
  );
  assert.match(
    additions.systemPromptAddition,
    /Forbidden\/taboo intersection guidance/,
  );
  assert.match(additions.systemPromptAddition, /layered over other relationship systems/i);
  assert.match(additions.systemPromptAddition, /adult scope for power imbalances/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /force|critical|completely overwrite/i,
  );
});
