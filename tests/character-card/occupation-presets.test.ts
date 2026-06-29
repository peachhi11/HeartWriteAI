import assert from "node:assert/strict";
import test from "node:test";

import {
  OCCUPATION_PRESET_CATEGORIES,
  OCCUPATION_PRESETS,
  compileOccupationPresetAdditions,
  findOccupationPresetById,
  getOccupationPresetsByCategory,
} from "../../data/occupationPresets";

test("loads occupation presets across role and romance hook lanes", () => {
  assert.equal(OCCUPATION_PRESETS.length, 449);
  assert.deepEqual(OCCUPATION_PRESET_CATEGORIES, [
    "Archetype",
    "High-Value Occupation Tag",
    "Occupation",
    "Romance Hook",
  ]);

  const ids = OCCUPATION_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getOccupationPresetsByCategory("Archetype").length, 90);
  assert.equal(getOccupationPresetsByCategory("Occupation").length, 279);
  assert.equal(getOccupationPresetsByCategory("Romance Hook").length, 40);
  assert.equal(getOccupationPresetsByCategory("High-Value Occupation Tag").length, 40);
});

test("normalises occupation values for visible prompt use", () => {
  const adviser = findOccupationPresetById("occupation_role_royal_adviser");
  const jeweller = findOccupationPresetById("occupation_role_jeweller");
  const artist = findOccupationPresetById("occupation_hook_artist_paints_user");
  const boss = findOccupationPresetById(
    "occupation_hook_criminal_boss_soft_for_user",
  );
  const allText = JSON.stringify(OCCUPATION_PRESETS);

  assert.equal(adviser?.value, "royal adviser");
  assert.equal(jeweller?.value, "jeweller");
  assert.equal(artist?.value, "artist paints {{user}}");
  assert.equal(boss?.value, "criminal boss soft for {{user}}");
  assert.doesNotMatch(allText, /Use code with caution|advisor|jeweler|artist paints user/i);
});

test("includes expanded character type source terms without dated raw wording", () => {
  const allText = JSON.stringify(OCCUPATION_PRESETS);

  assert.ok(findOccupationPresetById("occupation_archetype_the_action_hero"));
  assert.ok(
    findOccupationPresetById(
      "occupation_archetype_the_addiction_recovery_survivor",
    ),
  );
  assert.ok(findOccupationPresetById("occupation_role_anthropologist"));
  assert.ok(findOccupationPresetById("occupation_role_federal_agent"));
  assert.ok(findOccupationPresetById("occupation_role_mail_carrier"));
  assert.ok(findOccupationPresetById("occupation_role_postal_worker"));
  assert.ok(findOccupationPresetById("occupation_role_stunt_performer"));
  assert.ok(
    findOccupationPresetById("occupation_hook_workaholic_learns_to_come_home"),
  );
  assert.ok(findOccupationPresetById("occupation_high_value_forensic_scientist"));
  assert.doesNotMatch(allText, /mailman|postman|stuntman|drug addict/i);
});

test("compiles occupation presets as soft role context", () => {
  const preset = findOccupationPresetById("occupation_role_bodyguard");
  assert.ok(preset);

  const additions = compileOccupationPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Occupation context/);
  assert.match(additions.personalityAddition, /without replacing personality/i);
  assert.match(additions.systemPromptAddition, /soft role context/i);
  assert.match(additions.systemPromptAddition, /preserve consent, boundaries, and \{\{user\}\} autonomy/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
