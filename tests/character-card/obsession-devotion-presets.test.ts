import assert from "node:assert/strict";
import test from "node:test";

import {
  OBSESSION_DEVOTION_PRESET_CATEGORIES,
  OBSESSION_DEVOTION_PRESETS,
  compileObsessionDevotionPresetAdditions,
  findObsessionDevotionPresetById,
  getObsessionDevotionPresetsByCategory,
} from "../../data/obsessionDevotionPresets";

test("loads obsession/devotion presets across intensity and repair lanes", () => {
  assert.equal(OBSESSION_DEVOTION_PRESETS.length, 310);
  assert.deepEqual(OBSESSION_DEVOTION_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Conflict",
    "Core Seed",
    "Devotion Type",
    "Dialogue Seed",
    "Event Gate",
    "High-Value Obsession Devotion Tag",
    "Obsession Type",
    "Romance Hook",
  ]);

  const ids = OBSESSION_DEVOTION_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getObsessionDevotionPresetsByCategory("Core Seed").length, 60);
  assert.equal(getObsessionDevotionPresetsByCategory("Behaviour").length, 40);
  assert.equal(getObsessionDevotionPresetsByCategory("Conflict").length, 30);
  assert.equal(getObsessionDevotionPresetsByCategory("Dialogue Seed").length, 28);
});

test("normalises obsession/devotion values into consent and agency language", () => {
  const habit = findObsessionDevotionPresetById(
    "obsession_devotion_behaviour_memorises_user_habits",
  );
  const conflict = findObsessionDevotionPresetById(
    "obsession_devotion_conflict_obsession_against_consent",
  );
  const hook = findObsessionDevotionPresetById(
    "obsession_devotion_hook_villain_kneels_for_user",
  );
  const allText = JSON.stringify(OBSESSION_DEVOTION_PRESETS);

  assert.equal(habit?.value, "memorises {{user}} habits");
  assert.equal(conflict?.value, "obsession against consent");
  assert.equal(hook?.value, "villain kneels for {{user}}");
  assert.match(conflict?.guidance ?? "", /challenged, repaired, or refused/i);
  assert.doesNotMatch(
    allText,
    /Use code with caution|memorizes|apologizing|obsession_vs|protection_vs|villain kneels for user/i,
  );
});

test("compiles obsession/devotion as consent-checked dark-romance guidance", () => {
  const preset = findObsessionDevotionPresetById(
    "obsession_devotion_conflict_protection_against_control",
  );
  assert.ok(preset);

  const additions = compileObsessionDevotionPresetAdditions(preset);

  assert.match(additions.relationshipAddition, /protection against control/i);
  assert.match(additions.personalityAddition, /chosen devotion/i);
  assert.match(additions.systemPromptAddition, /soft dark-romance context/i);
  assert.match(additions.systemPromptAddition, /consent-checked, repair-gated, consequence-aware/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} boundaries and autonomy/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
