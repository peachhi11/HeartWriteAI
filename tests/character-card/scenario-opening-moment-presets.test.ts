import assert from "node:assert/strict";
import test from "node:test";

import {
  SCENARIO_OPENING_MOMENT_PRESET_CATEGORIES,
  SCENARIO_OPENING_MOMENT_PRESETS,
  compileScenarioOpeningMomentPresetAdditions,
  confessionTriggerSeeds,
  conflictStarterSeeds,
  dangerOpenerSeeds,
  domesticOpenerSeeds,
  emotionalOpenerSeeds,
  findScenarioOpeningMomentPresetById,
  firstMeetingModeSeeds,
  getScenarioOpeningMomentPresetsByCategory,
  highValueScenarioOpeningMomentSeeds,
  incitingIncidentSeeds,
  scenarioOpeningDialogueSeeds,
  scenarioOpeningGates,
  scenarioOpeningMomentPresets,
  scenarioOpeningMomentSeeds,
} from "../../data/scenarioOpeningMomentPresets";

test("loads scenario opening moment presets across meeting, incident, conflict, domestic, danger, and emotional lanes", () => {
  assert.equal(SCENARIO_OPENING_MOMENT_PRESETS.length, 478);
  assert.deepEqual(SCENARIO_OPENING_MOMENT_PRESET_CATEGORIES, [
    "Archetype",
    "Confession Trigger",
    "Conflict Starter",
    "Danger Opener",
    "Dialogue Seed",
    "Domestic Opener",
    "Emotional Opener",
    "First Meeting Mode",
    "Gate",
    "High-Value Seed",
    "Inciting Incident",
    "Opening Seed",
  ]);

  const ids = SCENARIO_OPENING_MOMENT_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(scenarioOpeningMomentPresets.length, 20);
  assert.equal(scenarioOpeningMomentSeeds.length, 20);
  assert.equal(firstMeetingModeSeeds.length, 230);
  assert.equal(incitingIncidentSeeds.length, 30);
  assert.equal(conflictStarterSeeds.length, 30);
  assert.equal(confessionTriggerSeeds.length, 25);
  assert.equal(domesticOpenerSeeds.length, 25);
  assert.equal(dangerOpenerSeeds.length, 25);
  assert.equal(emotionalOpenerSeeds.length, 20);
  assert.equal(scenarioOpeningGates.length, 15);
  assert.equal(scenarioOpeningDialogueSeeds.length, 18);
  assert.equal(highValueScenarioOpeningMomentSeeds.length, 20);
  assert.equal(getScenarioOpeningMomentPresetsByCategory("First Meeting Mode").length, 230);
  assert.equal(getScenarioOpeningMomentPresetsByCategory("Inciting Incident").length, 30);
  assert.equal(getScenarioOpeningMomentPresetsByCategory("Dialogue Seed").length, 18);
});

test("normalises scenario opening values for visible prompt text", () => {
  const neighbour = findScenarioOpeningMomentPresetById(
    "scenario_opening_first_meeting_new_neighbour_meeting",
  );
  const artefact = findScenarioOpeningMomentPresetById(
    "scenario_opening_inciting_stolen_artefact",
  );
  const oneBed = findScenarioOpeningMomentPresetById(
    "scenario_opening_inciting_one_bed_problem",
  );
  const lifeSupport = findScenarioOpeningMomentPresetById(
    "scenario_opening_inciting_life_support_alarm",
  );
  const enemyThreatens = findScenarioOpeningMomentPresetById(
    "scenario_opening_conflict_enemy_threatens_user",
  );
  const asksLove = findScenarioOpeningMomentPresetById(
    "scenario_opening_confession_user_asks_do_you_love_me",
  );
  const visibleText = SCENARIO_OPENING_MOMENT_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(neighbour?.value, "new neighbour meeting");
  assert.equal(neighbour?.triggerKeys.includes("new_neighbor_meeting"), true);
  assert.equal(artefact?.value, "stolen artefact");
  assert.equal(oneBed?.value, "one-bed problem");
  assert.equal(lifeSupport?.value, "life-support alarm");
  assert.equal(enemyThreatens?.value, "enemy threatens {{user}}");
  assert.equal(asksLove?.value, "{{user}} asks do you love me");
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|new neighbor|stolen artifact|\bone bed\b|life support alarm|enemy threatens user|user asks/i,
  );
});

test("finds high-signal scenario opening seeds by stable ids", () => {
  assert.equal(
    findScenarioOpeningMomentPresetById("scenario_opening_first_meeting_meet_cute")
      ?.value,
    "meet cute",
  );
  assert.equal(
    findScenarioOpeningMomentPresetById(
      "scenario_opening_inciting_fake_relationship_request",
    )?.value,
    "fake relationship request",
  );
  assert.equal(
    findScenarioOpeningMomentPresetById("scenario_opening_conflict_secret_agenda")
      ?.value,
    "secret agenda",
  );
  assert.equal(
    findScenarioOpeningMomentPresetById(
      "scenario_opening_confession_jealousy_breaks_denial",
    )?.value,
    "jealousy breaks denial",
  );
  assert.equal(
    findScenarioOpeningMomentPresetById("scenario_opening_domestic_shared_breakfast")
      ?.value,
    "shared breakfast",
  );
  assert.equal(
    findScenarioOpeningMomentPresetById("scenario_opening_danger_danger_at_the_door")
      ?.value,
    "danger at the door",
  );
  assert.equal(
    findScenarioOpeningMomentPresetById(
      "scenario_opening_emotional_panic_attack_opener",
    )?.value,
    "panic attack opener",
  );
  assert.equal(
    findScenarioOpeningMomentPresetById("scenario_opening_gate_story_begins_route")
      ?.value,
    "story begins route",
  );
  assert.equal(
    findScenarioOpeningMomentPresetById("scenario_opening_high_value_story_begins_route")
      ?.value,
    "story begins route",
  );
});

test("compiles scenario opening moments as soft first-scene context", () => {
  const preset = findScenarioOpeningMomentPresetById(
    "scenario_opening_inciting_fake_relationship_request",
  );
  assert.ok(preset);

  const additions = compileScenarioOpeningMomentPresetAdditions(preset);

  assert.match(additions.scenarioAddition, /Scenario opening context/);
  assert.match(additions.firstMessageAddition, /without scripting \{\{user\}\}'s feelings/i);
  assert.match(additions.systemPromptAddition, /soft scenario opening context/i);
  assert.match(additions.systemPromptAddition, /initial scene when relevant/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} autonomy/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps pressured tropes, danger, and emotional crisis openers choice-safe", () => {
  const mateBond = findScenarioOpeningMomentPresetById(
    "scenario_opening_inciting_mate_bond_triggered",
  );
  const oneBedGate = findScenarioOpeningMomentPresetById(
    "scenario_opening_gate_first_one_bed_gate",
  );
  const kidnapping = findScenarioOpeningMomentPresetById(
    "scenario_opening_danger_kidnapping_attempt",
  );
  const panic = findScenarioOpeningMomentPresetById(
    "scenario_opening_emotional_panic_attack_opener",
  );
  assert.ok(mateBond);
  assert.ok(oneBedGate);
  assert.ok(kidnapping);
  assert.ok(panic);

  assert.match(mateBond.guidance, /Preserve consent, choice, boundaries/i);
  assert.match(oneBedGate.guidance, /only when earned/i);
  assert.match(kidnapping.guidance, /fictional danger-opener texture/i);
  assert.match(panic.guidance, /non-diagnostic, supportive, boundary-aware/i);

  const additions = compileScenarioOpeningMomentPresetAdditions(mateBond);
  assert.match(
    additions.systemPromptAddition,
    /do not force romance, danger, mate bonds, one-bed intimacy, fake affection, panic, harm, or reciprocation/i,
  );
});
