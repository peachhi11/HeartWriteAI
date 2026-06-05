import assert from "node:assert/strict";
import test from "node:test";

import {
  PERSONA_PLAYER_SIDE_PRESET_CATEGORIES,
  PERSONA_PLAYER_SIDE_PRESETS,
  compilePersonaPlayerSidePresetAdditions,
  findPersonaPlayerSidePresetById,
  getPersonaPlayerSidePresetsByCategory,
  highValuePersonaPlayerSideSeeds,
  personaPlayerSideDialogueSeeds,
  personaPlayerSideGates,
  personaPlayerSideHooks,
  personaPlayerSidePresets,
  playerAgencySeeds,
  playerBoundarySeeds,
  playerGoalSeeds,
  playerOpeningPreferenceSeeds,
  preferredDynamicSeeds,
  preferredPacingSeeds,
  selfInsertToneSeeds,
  userPersonaArchetypeSeeds,
} from "../../data/personaPlayerSidePresets";

test("loads persona player-side presets across persona, goal, safety, pacing, and agency lanes", () => {
  assert.equal(PERSONA_PLAYER_SIDE_PRESETS.length, 241);
  assert.deepEqual(PERSONA_PLAYER_SIDE_PRESET_CATEGORIES, [
    "Dialogue Seed",
    "High-Value Seed",
    "Opening Preference",
    "Persona Gate",
    "Persona Hook",
    "Persona Preset",
    "Player Agency",
    "Player Boundary",
    "Player Goal",
    "Preferred Dynamic",
    "Preferred Pacing",
    "Self-Insert Tone",
    "User Persona Archetype",
  ]);

  const ids = PERSONA_PLAYER_SIDE_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(personaPlayerSidePresets.length, 20);
  assert.equal(userPersonaArchetypeSeeds.length, 20);
  assert.equal(playerGoalSeeds.length, 20);
  assert.equal(preferredDynamicSeeds.length, 20);
  assert.equal(playerBoundarySeeds.length, 20);
  assert.equal(preferredPacingSeeds.length, 20);
  assert.equal(selfInsertToneSeeds.length, 20);
  assert.equal(playerOpeningPreferenceSeeds.length, 20);
  assert.equal(playerAgencySeeds.length, 20);
  assert.equal(personaPlayerSideHooks.length, 15);
  assert.equal(personaPlayerSideGates.length, 12);
  assert.equal(personaPlayerSideDialogueSeeds.length, 14);
  assert.equal(highValuePersonaPlayerSideSeeds.length, 20);
  assert.equal(getPersonaPlayerSidePresetsByCategory("Player Boundary").length, 20);
  assert.equal(getPersonaPlayerSidePresetsByCategory("Player Agency").length, 20);
  assert.equal(getPersonaPlayerSidePresetsByCategory("Dialogue Seed").length, 14);
});

test("normalises player-side values for visible prompt text", () => {
  const personalisedTone = findPersonaPlayerSidePresetById(
    "persona_player_tone_highly_personalised_tone",
  );
  const fulfilmentTone = findPersonaPlayerSidePresetById(
    "persona_player_tone_wish_fulfilment_tone",
  );
  const nonConsent = findPersonaPlayerSidePresetById(
    "persona_player_boundary_no_non_consent",
  );
  const npcTone = findPersonaPlayerSidePresetById(
    "persona_player_hook_npc_adapts_to_user_tone",
  );
  const personalisedRoute = findPersonaPlayerSidePresetById(
    "persona_player_gate_personalised_route_gate",
  );
  const visibleText = PERSONA_PLAYER_SIDE_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(personalisedTone?.value, "highly personalised tone");
  assert.equal(personalisedTone?.triggerKeys.includes("highly_personalized_tone"), true);
  assert.equal(fulfilmentTone?.value, "wish fulfilment tone");
  assert.equal(fulfilmentTone?.triggerKeys.includes("wish_fulfillment_tone"), true);
  assert.equal(nonConsent?.value, "no non-consent");
  assert.equal(nonConsent?.triggerKeys.includes("no_nonconsent"), true);
  assert.equal(npcTone?.value, "NPC adapts to user tone");
  assert.equal(personalisedRoute?.value, "personalised route gate");
  assert.doesNotMatch(
    visibleText,
    /\bpersonalized\b|\bpersonalization\b|\bfulfillment\b|\bnonconsent\b/i,
  );
});

test("finds high-signal persona player-side seeds by stable ids", () => {
  assert.equal(
    findPersonaPlayerSidePresetById("persona_player_preset_soft_self_insert")?.value,
    "Soft Self-Insert",
  );
  assert.equal(
    findPersonaPlayerSidePresetById("persona_player_archetype_blank_slate_user")
      ?.value,
    "blank slate user",
  );
  assert.equal(
    findPersonaPlayerSidePresetById("persona_player_goal_hurt_comfort_goal")?.value,
    "hurt comfort goal",
  );
  assert.equal(
    findPersonaPlayerSidePresetById(
      "persona_player_dynamic_equal_partners_preference",
    )?.value,
    "equal partners preference",
  );
  assert.equal(
    findPersonaPlayerSidePresetById("persona_player_boundary_fade_to_black")?.value,
    "fade to black",
  );
  assert.equal(
    findPersonaPlayerSidePresetById("persona_player_pacing_slow_burn_pacing")?.value,
    "slow burn pacing",
  );
  assert.equal(
    findPersonaPlayerSidePresetById("persona_player_tone_immersive_second_person")
      ?.value,
    "immersive second person",
  );
  assert.equal(
    findPersonaPlayerSidePresetById("persona_player_agency_high_player_agency")?.value,
    "high player agency",
  );
  assert.equal(
    findPersonaPlayerSidePresetById("persona_player_high_value_player_trust_route")
      ?.value,
    "player trust route",
  );
});

test("compiles player-side presets as soft preference context", () => {
  const preset = findPersonaPlayerSidePresetById(
    "persona_player_agency_avoid_user_dialogue_written",
  );
  assert.ok(preset);

  const additions = compilePersonaPlayerSidePresetAdditions(preset);

  assert.match(additions.personaAddition, /Player-side persona context/);
  assert.match(additions.scenarioAddition, /leaving \{\{user\}\} room to choose/i);
  assert.match(additions.systemPromptAddition, /soft player-side preference context/i);
  assert.match(additions.systemPromptAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /Do not write actions, dialogue/i);
  assert.match(additions.systemPromptAddition, /for \{\{user\}\}/i);
  assert.match(additions.systemPromptAddition, /keep player boundaries above plot momentum/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps boundaries, escalation, and dialogue under player control", () => {
  const boundary = findPersonaPlayerSidePresetById(
    "persona_player_boundary_player_agency_priority",
  );
  const consentEscalation = findPersonaPlayerSidePresetById(
    "persona_player_agency_consent_to_escalation",
  );
  const dialogue = findPersonaPlayerSidePresetById(
    "persona_player_dialogue_i_will_not_decide_your_heart_for_you",
  );
  assert.ok(boundary);
  assert.ok(consentEscalation);
  assert.ok(dialogue);

  assert.match(boundary.guidance, /Boundaries should override plot escalation/i);
  assert.match(consentEscalation.guidance, /ask before controlling, escalating, or assuming/i);
  assert.match(dialogue.guidance, /without being forced verbatim/i);
  assert.match(dialogue.guidance, /written as \{\{user\}\} speech/i);
});
