import assert from "node:assert/strict";
import test from "node:test";

import {
  createDesireSeedPreset,
  createFearSeedPreset,
  type DesireSeed,
  type FearSeed,
} from "../../data/vocabularySeedTypes";

test("creates fear seed presets with fear-specific story psychology fields", () => {
  const fear = createFearSeedPreset({
    seed: "fear_of_replacement",
    label: "Fear of replacement",
    description: "Watches for signs that affection is shifting away.",
    examples: [
      "Tracks whether attention feels less consistent than before.",
      "Looks for proof they still matter when someone new appears.",
      "Tracks whether attention feels less consistent than before.",
    ],
    tags: ["fear", "attachment", "romance_pressure"],
    relatedSeeds: ["jealousy", "reassurance_seeking"],
    oppositeSeeds: ["secure_attachment"],
    romanceHooks: ["jealousy_reassurance_scene"],
    scenarioHooks: ["rival_arrives"],
    dialoguePatterns: [
      "You looked happier with them.",
      "I just wanted to know if I still mattered.",
    ],
    fearType: "attachment",
    coreBelief: "Divided attention means they are becoming temporary.",
    hiddenNeed: "Consistent presence without having to beg for it.",
    perceivedThreat: "A rival, ex, or new priority taking their place.",
    triggers: ["mentioning_an_ex", "appearance_of_a_rival"],
    earlyWarnings: ["freezes_when_others_are_praised"],
    escalationPattern: ["notices_distance", "tests_attention", "asks_indirectly"],
    defenseMechanisms: ["protective_control", "emotional_withdrawal"],
    copingBehaviors: ["stays_close", "checks_for_returned_attention"],
    avoidancePatterns: ["avoids_directly_naming_jealousy"],
    attachmentEffects: ["anxious_activation"],
    intimacyEffects: ["needs_exclusivity_to_feel_safe"],
    conflictEffects: ["mistakes_distance_for_replacement"],
    misreadSignals: ["busy_schedule_as_loss_of_interest"],
    reassuranceNeeds: ["clear_return_after_distance"],
    repairMethods: ["names_the_fear_without_accusing"],
    healingNeeds: ["consistent_presence"],
    growthArcs: ["trusts_bonds_can_survive_outside_connections"],
    routeGates: ["first_jealousy_repair_gate"],
    compatibleWounds: ["replacement_wound"],
    incompatibleDynamics: ["intentional_ambiguity"],
    metadata: {
      severity: "core",
      romanceValue: 11,
      angstValue: 9,
      conflictPotential: 8,
      healingValue: 10,
      pacingPressure: "high",
    },
  }) satisfies FearSeed;

  assert.equal(fear.metadata.category, "fear");
  assert.equal(fear.metadata.severity, "core");
  assert.equal(fear.metadata.romanceValue, 10);
  assert.equal(fear.metadata.angstValue, 9);
  assert.equal(fear.metadata.pacingPressure, "high");
  assert.deepEqual(fear.examples, [
    "Tracks whether attention feels less consistent than before.",
    "Looks for proof they still matter when someone new appears.",
  ]);
  assert.deepEqual(fear.escalationPattern, [
    "notices_distance",
    "tests_attention",
    "asks_indirectly",
  ]);
  assert.equal(fear.coreBelief.includes("temporary"), true);
  assert.equal(fear.hiddenNeed.includes("Consistent presence"), true);
  assert.equal(fear.compatibleWounds.includes("replacement_wound"), true);
});

test("defaults fear seed metadata for broad catalogue generation", () => {
  const fear = createFearSeedPreset({
    seed: "fear_of_failure",
    label: "Fear of failure",
    description: "Reads mistakes as proof that affection or respect may be withdrawn.",
    fearType: "self_worth",
    coreBelief: "Mistakes make them less lovable.",
    hiddenNeed: "Room to be imperfect without losing belonging.",
    perceivedThreat: "Visible failure in front of someone whose opinion matters.",
  });

  assert.equal(fear.metadata.category, "fear");
  assert.equal(fear.metadata.severity, "moderate");
  assert.equal(fear.metadata.romanceValue, 7);
  assert.equal(fear.metadata.angstValue, 7);
  assert.equal(fear.metadata.conflictPotential, 7);
  assert.equal(fear.metadata.healingValue, 7);
  assert.equal(fear.metadata.pacingPressure, "medium");
  assert.deepEqual(fear.tags, []);
  assert.deepEqual(fear.routeGates, []);
});

test("creates lean desire seed presets with category and route pressure metadata", () => {
  const desire = createDesireSeedPreset({
    seed: "desire_to_be_chosen",
    label: "Desire to Be Chosen",
    description: "Longs to be intentionally chosen and prioritised.",
    examples: [
      "Softens when a partner chooses them in public.",
      "Tests whether they are a priority.",
      "Softens when a partner chooses them in public.",
    ],
    tags: ["desire", "attachment"],
    relatedSeeds: ["never_chosen_wound"],
    oppositeSeeds: ["avoidant_attachment"],
    romanceHooks: ["public_choice_confession"],
    scenarioHooks: ["rival_forces_choice"],
    dialoguePatterns: ["I want to be wanted."],
    metadata: {
      category: "attachment",
      intensity: "overwhelming",
      romanceValue: 12,
      angstValue: 9,
      conflictPotential: 8,
      healingValue: 10,
      pacingPressure: "high",
    },
  }) satisfies DesireSeed;

  assert.equal(desire.metadata.category, "attachment");
  assert.equal(desire.metadata.intensity, "overwhelming");
  assert.equal(desire.metadata.romanceValue, 10);
  assert.equal(desire.metadata.pacingPressure, "high");
  assert.deepEqual(desire.examples, [
    "Softens when a partner chooses them in public.",
    "Tests whether they are a priority.",
  ]);
  assert.equal("coreLonging" in desire, false);
  assert.equal("fulfillmentNeeds" in desire, false);
  assert.equal("routeGates" in desire, false);
});

test("defaults desire seed metadata for future broad catalogue generation", () => {
  const desire = createDesireSeedPreset({
    seed: "desire_for_peace",
    label: "Desire for Peace",
    description: "Longs for a quiet life where safety does not have to be earned.",
  });

  assert.equal(desire.metadata.category, "romantic");
  assert.equal(desire.metadata.intensity, "moderate");
  assert.equal(desire.metadata.romanceValue, 7);
  assert.equal(desire.metadata.angstValue, 6);
  assert.equal(desire.metadata.conflictPotential, 6);
  assert.equal(desire.metadata.healingValue, 7);
  assert.equal(desire.metadata.pacingPressure, "medium");
  assert.deepEqual(desire.tags, []);
});
