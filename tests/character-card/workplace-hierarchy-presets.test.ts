import assert from "node:assert/strict";
import test from "node:test";

import {
  compileWorkplaceHierarchyPresetAdditions,
  WORKPLACE_HIERARCHY_PRESET_CATEGORIES,
  WORKPLACE_HIERARCHY_PRESETS,
  findWorkplaceHierarchyPresetById,
  getWorkplaceHierarchyPresetsByCategory,
} from "../../data/workplaceHierarchyPresets";

test("loads workplace hierarchy presets across authority and ethics lanes", () => {
  assert.equal(WORKPLACE_HIERARCHY_PRESETS.length, 250);
  assert.deepEqual(WORKPLACE_HIERARCHY_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Dialogue Seed",
    "Emotional Flavour",
    "Gate",
    "Hierarchy Type",
    "Method",
    "Motivation",
    "Romance Trope",
    "Trigger Event",
    "Wound",
  ]);

  const ids = WORKPLACE_HIERARCHY_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("workplace_hierarchy_")));
  assert.equal(
    getWorkplaceHierarchyPresetsByCategory("Behaviour").find(
      (preset) => preset.value === "avoids favouritism",
    )?.id,
    "workplace_hierarchy_behaviour_avoids_favouritism",
  );
});

test("normalises readable workplace values and keeps power dynamics ethical", () => {
  const allText = JSON.stringify(WORKPLACE_HIERARCHY_PRESETS);
  const valueText = WORKPLACE_HIERARCHY_PRESETS.map(
    (preset) => preset.value,
  ).join("\n");
  const motivation = findWorkplaceHierarchyPresetById(
    "workplace_hierarchy_motivation_fear_of_favouritism",
  );
  const trigger = findWorkplaceHierarchyPresetById(
    "workplace_hierarchy_trigger_rival_co_worker_flirts",
  );
  const behaviour = findWorkplaceHierarchyPresetById(
    "workplace_hierarchy_behaviour_avoids_favouritism",
  );
  const trope = findWorkplaceHierarchyPresetById(
    "workplace_hierarchy_trope_mentor_and_protege",
  );

  assert.equal(motivation?.value, "fear of favouritism");
  assert.equal(trigger?.value, "rival co-worker flirts");
  assert.equal(behaviour?.value, "avoids favouritism");
  assert.equal(trope?.value, "mentor and protégé");
  assert.match(trope?.guidance ?? "", /accountability-aware/i);
  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.doesNotMatch(
    valueText,
    /boss_employee|favoritism|coworker|mentor_protege|vulnerable_in_private|ambition_vs_love/i,
  );
});

test("compiles workplace hierarchy presets as soft authority and ethics guidance", () => {
  const preset = findWorkplaceHierarchyPresetById(
    "workplace_hierarchy_archetype_the_ceo_and_assistant",
  );
  assert.ok(preset);

  const additions = compileWorkplaceHierarchyPresetAdditions(preset);

  assert.match(
    additions.backgroundAddition,
    /Workplace hierarchy preset: Archetype - The CEO and Assistant/,
  );
  assert.match(
    additions.relationshipAddition,
    /Workplace hierarchy preset: Archetype - The CEO and Assistant/,
  );
  assert.match(
    additions.personalityAddition,
    /Workplace hierarchy archetype texture/,
  );
  assert.match(additions.systemPromptAddition, /Workplace hierarchy guidance/);
  assert.match(additions.systemPromptAddition, /soft hierarchy context/i);
  assert.match(additions.systemPromptAddition, /ethical boundaries/i);
  assert.match(additions.systemPromptAddition, /fair professional treatment/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /force|critical|completely overwrite/i,
  );
});
