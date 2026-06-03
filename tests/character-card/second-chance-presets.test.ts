import assert from "node:assert/strict";
import test from "node:test";

import {
  compileSecondChancePresetAdditions,
  SECOND_CHANCE_PRESET_CATEGORIES,
  SECOND_CHANCE_PRESETS,
  findSecondChancePresetById,
  getSecondChancePresetsByCategory,
} from "../../data/secondChancePresets";

test("loads second-chance presets across reunion and repair lanes", () => {
  assert.equal(SECOND_CHANCE_PRESETS.length, 247);
  assert.deepEqual(SECOND_CHANCE_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Dialogue Seed",
    "Emotional Flavour",
    "Gate",
    "Method",
    "Motivation",
    "Reunion Type",
    "Romance Trope",
    "Trigger Event",
    "Wound",
  ]);

  const ids = SECOND_CHANCE_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("second_chance_")));
  assert.equal(
    getSecondChancePresetsByCategory("Behaviour").find(
      (preset) => preset.value === "apologises carefully",
    )?.id,
    "second_chance_behaviour_apologises_carefully",
  );
});

test("normalises readable second-chance values and keeps repair choice-safe", () => {
  const allText = JSON.stringify(SECOND_CHANCE_PRESETS);
  const valueText = SECOND_CHANCE_PRESETS.map((preset) => preset.value).join("\n");
  const motivation = findSecondChancePresetById(
    "second_chance_motivation_need_to_apologise",
  );
  const method = findSecondChancePresetById(
    "second_chance_method_co_parenting_reunion",
  );
  const behaviour = findSecondChancePresetById(
    "second_chance_behaviour_apologises_carefully",
  );
  const route = findSecondChancePresetById(
    "second_chance_aftermath_healthy_restart_route",
  );

  assert.equal(motivation?.value, "need to apologise");
  assert.equal(method?.value, "co-parenting reunion");
  assert.equal(behaviour?.value, "apologises carefully");
  assert.equal(route?.value, "healthy restart route");
  assert.match(route?.guidance ?? "", /not a required ending/i);
  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.doesNotMatch(
    valueText,
    /exes_to_lovers|need_to_apologize|apologizes|co_parenting|healthy_restart/i,
  );
});

test("compiles second-chance presets as soft repair and reunion guidance", () => {
  const preset = findSecondChancePresetById(
    "second_chance_archetype_the_ex_who_came_back",
  );
  assert.ok(preset);

  const additions = compileSecondChancePresetAdditions(preset);

  assert.match(
    additions.backgroundAddition,
    /Second-chance preset: Archetype - The Ex Who Came Back/,
  );
  assert.match(
    additions.relationshipAddition,
    /Second-chance preset: Archetype - The Ex Who Came Back/,
  );
  assert.match(additions.personalityAddition, /Second-chance archetype texture/);
  assert.match(additions.systemPromptAddition, /Second-chance guidance/);
  assert.match(additions.systemPromptAddition, /soft reunion context/i);
  assert.match(additions.systemPromptAddition, /right to refuse/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /force|critical|completely overwrite/i,
  );
});
