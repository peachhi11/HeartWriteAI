import assert from "node:assert/strict";
import test from "node:test";

import {
  createAttachmentStyleSeedPreset,
  createConflictBeatSeedPreset,
  createConflictStyleSeedPreset,
  createConsequenceSeedPreset,
  createDesireSeedPreset,
  createEmotionalMeaningSeedPreset,
  createFearSeedPreset,
  createGrowthArcSeedPreset,
  createHiddenNeedSeedPreset,
  createLoveLanguageSeedPreset,
  createPayoffFantasySeedPreset,
  createRelationshipDynamicSeedPreset,
  createRelationshipIdentitySeedPreset,
  createRepairNeedSeedPreset,
  createRouteGateSeedPreset,
  createRepairBeatSeedPreset,
  createRomanceTropeSeedPreset,
  createRoutePhaseSeedPreset,
  createRuptureTypeSeedPreset,
  createVisibleBehaviorSeedPreset,
  type AttachmentStyleSeed,
  type ConflictBeatSeed,
  type ConflictStyleSeed,
  type ConsequenceSeed,
  type DesireSeed,
  type EmotionalMeaningSeed,
  type FearSeed,
  type GrowthArcSeed,
  type HiddenNeedSeed,
  type LoveLanguageSeed,
  type PayoffFantasySeed,
  type RelationshipDynamicSeed,
  type RelationshipIdentitySeed,
  type RepairNeedSeed,
  type RouteGateSeed,
  type RepairBeatSeed,
  type RomanceTropeSeed,
  type RoutePhaseSeed,
  type RuptureTypeSeed,
  type VisibleBehaviorSeed,
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

test("creates hidden need seed presets with route psychology fields", () => {
  const need = createHiddenNeedSeedPreset({
    seed: "need_for_reassurance",
    label: "Need for Reassurance",
    description: "Needs clear confirmation that care has not disappeared.",
    examples: [
      "Needs to hear conflict does not mean abandonment.",
      "Softens when care is stated directly.",
      "Needs to hear conflict does not mean abandonment.",
    ],
    tags: ["hidden_need", "attachment"],
    relatedSeeds: ["fear_of_abandonment"],
    oppositeSeeds: ["silent_treatment"],
    romanceHooks: ["i_am_not_leaving_scene"],
    scenarioHooks: ["post_argument_check_in"],
    dialoguePatterns: ["I need to know we are okay."],
    needType: "attachment",
    masksAs: ["overthinking", "testing_love"],
    createdByWounds: ["abandonment_wound"],
    drivenByFears: ["fear_of_abandonment"],
    expressedAsDesires: ["desire_for_reliable_love"],
    activatedByTriggers: ["unanswered_message_trigger"],
    commonResponses: ["reassurance_seeking_response"],
    loveLanguages: ["words_of_affirmation"],
    compatibleRepairStyles: ["verbal_reassurance_repair"],
    growthArcs: ["learning_to_trust"],
    unmetConsequences: ["attachment_damage_consequence"],
    fulfillmentSignals: ["asks_directly_instead_of_testing"],
    routeGates: ["first_reassurance_gate"],
    milestoneMemories: ["first_i_am_not_leaving_memory"],
    metadata: {
      urgency: "core",
      romanceValue: 12,
      conflictPotential: 8,
      healingValue: 10,
      pacingPressure: "high",
    },
  }) satisfies HiddenNeedSeed;

  assert.equal(need.metadata.category, "hidden_need");
  assert.equal(need.metadata.urgency, "core");
  assert.equal(need.metadata.romanceValue, 10);
  assert.equal(need.metadata.pacingPressure, "high");
  assert.deepEqual(need.examples, [
    "Needs to hear conflict does not mean abandonment.",
    "Softens when care is stated directly.",
  ]);
  assert.equal(need.needType, "attachment");
  assert.equal(need.masksAs.includes("testing_love"), true);
  assert.equal(need.compatibleRepairStyles.includes("verbal_reassurance_repair"), true);
});

test("creates emotional meaning seed presets with subtext routing fields", () => {
  const meaning = createEmotionalMeaningSeedPreset({
    seed: "i_notice_you",
    label: "I Notice You",
    description: "Pays attention to small needs, mood shifts, and quiet distress.",
    examples: [
      "Remembers how they take their tea.",
      "Recognizes a fake smile.",
      "Remembers how they take their tea.",
    ],
    tags: ["emotional_meaning", "attention"],
    relatedSeeds: ["desire_to_be_seen"],
    oppositeSeeds: ["emotional_neglect"],
    romanceHooks: ["seen_through_the_mask"],
    scenarioHooks: ["fake_smile_called_out"],
    dialoguePatterns: ["I noticed."],
    meaningType: "attention",
    expressedThrough: ["remembers_preferences", "remembers_preferences"],
    oftenMisreadAs: ["being_watched"],
    hiddenNeedMet: ["need_to_be_seen"],
    associatedWounds: ["emotional_neglect_wound"],
    associatedFears: ["fear_of_not_mattering"],
    associatedDesires: ["desire_to_be_seen"],
    compatibleLoveLanguages: ["acts_of_service"],
    compatibleVisibleBehaviors: ["makes_tea_when_worried"],
    triggerWhenAbsent: ["being_overlooked_trigger"],
    likelyResponsesWhenAbsent: ["withdrawal_response"],
    repairStyles: ["validation_repair"],
    growthArcs: ["learning_to_be_seen"],
    payoffFantasies: ["seen_and_still_loved"],
    relationshipIdentities: ["safe_haven_relationship"],
    routeGates: ["first_noticed_gate"],
    milestoneMemories: ["first_time_they_noticed_memory"],
    metadata: {
      subtlety: "high",
      romanceValue: 12,
      healingValue: 10,
      conflictPotential: 4,
      intimacyValue: 9,
    },
  }) satisfies EmotionalMeaningSeed;

  assert.equal(meaning.metadata.category, "emotional_meaning");
  assert.equal(meaning.metadata.subtlety, "high");
  assert.equal(meaning.metadata.romanceValue, 10);
  assert.equal(meaning.metadata.healingValue, 10);
  assert.deepEqual(meaning.examples, [
    "Remembers how they take their tea.",
    "Recognizes a fake smile.",
  ]);
  assert.deepEqual(meaning.expressedThrough, ["remembers_preferences"]);
  assert.equal(meaning.meaningType, "attention");
  assert.equal(meaning.hiddenNeedMet.includes("need_to_be_seen"), true);
  assert.equal(
    meaning.compatibleVisibleBehaviors.includes("makes_tea_when_worried"),
    true,
  );
});

test("creates repair need seed presets with consequence and rupture routing fields", () => {
  const need = createRepairNeedSeedPreset({
    seed: "need_for_accountability",
    label: "Need for Accountability",
    description: "Requires the harm to be owned without excuses.",
    examples: [
      "Needs the broken promise acknowledged.",
      "Cannot move forward while the harm is explained away.",
      "Needs the broken promise acknowledged.",
    ],
    tags: ["repair_need", "accountability"],
    relatedSeeds: ["accountability_repair"],
    oppositeSeeds: ["excuse_making"],
    romanceHooks: ["owning_the_hurt"],
    scenarioHooks: ["after_the_lie"],
    dialoguePatterns: ["An apology is not the same as accountability."],
    needType: "accountability",
    repairsConsequences: ["trust_damage_consequence", "trust_damage_consequence"],
    repairsRuptures: ["betrayal_rupture"],
    activatedByWounds: ["betrayal_wound"],
    activatedByFears: ["fear_of_betrayal"],
    frustratedDesires: ["desire_for_truth"],
    compatibleRepairStyles: ["accountability_repair"],
    compatibleRepairBeats: ["accountability_beat"],
    incompatibleRepairs: ["empty_apology"],
    requiredConditions: ["specific_admission"],
    fulfillmentSignals: ["responsibility_is_accepted"],
    failureModes: ["accountability_without_change"],
    growthArcs: ["learning_safe_conflict"],
    routeGates: ["first_accountability_gate"],
    milestoneMemories: ["first_real_accountability_memory"],
    metadata: {
      urgency: "high",
      repairPower: 11,
      trustRepairValue: 10,
      attachmentRepairValue: 6,
      healingValue: 9,
    },
  }) satisfies RepairNeedSeed;

  assert.equal(need.metadata.category, "repair_need");
  assert.equal(need.metadata.urgency, "high");
  assert.equal(need.metadata.repairPower, 10);
  assert.equal(need.metadata.trustRepairValue, 10);
  assert.deepEqual(need.examples, [
    "Needs the broken promise acknowledged.",
    "Cannot move forward while the harm is explained away.",
  ]);
  assert.deepEqual(need.repairsConsequences, ["trust_damage_consequence"]);
  assert.equal(need.needType, "accountability");
  assert.equal(need.compatibleRepairStyles.includes("accountability_repair"), true);
  assert.equal(need.compatibleRepairBeats.includes("accountability_beat"), true);
});

test("creates route gate seed presets with route progress fields", () => {
  const gate = createRouteGateSeedPreset({
    seed: "first_reassurance_gate",
    label: "First Reassurance Gate",
    description:
      "Receives clear emotional reassurance and begins to believe the bond may be safer than expected.",
    examples: [
      "After panic, the partner says they are not leaving.",
      "A delayed reply is repaired with clear care.",
      "After panic, the partner says they are not leaving.",
    ],
    tags: ["route_gate", "reassurance"],
    relatedSeeds: ["need_for_reassurance"],
    oppositeSeeds: ["silent_treatment"],
    romanceHooks: ["i_am_not_leaving_scene"],
    scenarioHooks: ["delayed_reply_spiral"],
    dialoguePatterns: ["You do not have to guess where you stand with me."],
    gateType: "reassurance",
    unlocksRoutePhases: ["vulnerability_leak", "trust_rebuilding_phase"],
    requiredBefore: ["safe_to_need_gate"],
    blockedBy: ["mocked_need_for_reassurance"],
    activatedByWounds: ["abandonment_wound"],
    activatedByFears: ["fear_of_abandonment"],
    fulfillsDesires: ["desire_for_reliable_love"],
    satisfiesHiddenNeeds: ["need_for_reassurance"],
    likelyTriggers: ["unanswered_message_trigger"],
    likelyResponses: ["panic_spiral_response"],
    compatibleRepairBeats: ["i_am_not_leaving_beat"],
    compatibleGrowthArcs: ["learning_secure_attachment"],
    successSignals: ["panic_deescalates"],
    failureSignals: ["words_are_not_followed_by_consistency"],
    milestoneMemories: ["first_reassurance_received_memory"],
    metadata: {
      importance: "major",
      romanceValue: 12,
      angstValue: 7,
      healingValue: 10,
      routeProgressValue: 9,
    },
  }) satisfies RouteGateSeed;

  assert.equal(gate.metadata.category, "route_gate");
  assert.equal(gate.metadata.importance, "major");
  assert.equal(gate.metadata.romanceValue, 10);
  assert.equal(gate.metadata.routeProgressValue, 9);
  assert.deepEqual(gate.examples, [
    "After panic, the partner says they are not leaving.",
    "A delayed reply is repaired with clear care.",
  ]);
  assert.equal(gate.gateType, "reassurance");
  assert.equal(gate.satisfiesHiddenNeeds.includes("need_for_reassurance"), true);
  assert.equal(gate.compatibleRepairBeats.includes("i_am_not_leaving_beat"), true);
});

test("creates visible behavior seed presets with action-level romance fields", () => {
  const behavior = createVisibleBehaviorSeedPreset({
    seed: "makes_tea_when_worried",
    label: "Makes Tea When Worried",
    description: "Turns worry into a small domestic action.",
    examples: [
      "Starts the kettle after noticing silence.",
      "Brings the cup without forcing a conversation.",
      "Starts the kettle after noticing silence.",
    ],
    tags: ["visible_behavior", "acts_of_service"],
    relatedSeeds: ["acts_of_service"],
    oppositeSeeds: ["neglect"],
    romanceHooks: ["tea_after_argument"],
    scenarioHooks: ["post_conflict_kitchen_scene"],
    dialoguePatterns: ["I made it how you like it."],
    behaviorType: "domestic",
    emotionalMeaning: "I noticed you were hurting.",
    hiddenMotivation: "To offer care without crowding the hurt.",
    loveLanguageSource: ["acts_of_service", "domestic_care"],
    associatedWounds: ["emotional_neglect_wound"],
    associatedFears: ["fear_of_vulnerability"],
    associatedDesires: ["desire_to_be_seen"],
    associatedDynamics: ["soft_domestic_relationship"],
    activatedBy: ["stressful_silence"],
    fulfillmentSignals: ["drink_is_accepted"],
    misreadRisks: ["care_mistaken_for_avoidance"],
    conflictRisks: ["service_replaces_words_too_often"],
    repairStyles: ["acts_of_service_repair"],
    growthArcs: ["learns_to_pair_action_with_honesty"],
    routeGates: ["first_wordless_care_gate"],
    milestoneMemories: ["first_tea_when_worried_memory"],
    metadata: {
      subtlety: "high",
      romanceValue: 11,
      intimacyValue: 8,
      healingValue: 9,
      conflictPotential: 3,
      repeatability: "ritual",
    },
  }) satisfies VisibleBehaviorSeed;

  assert.equal(behavior.metadata.category, "visible_behavior");
  assert.equal(behavior.metadata.subtlety, "high");
  assert.equal(behavior.metadata.romanceValue, 10);
  assert.equal(behavior.metadata.repeatability, "ritual");
  assert.deepEqual(behavior.examples, [
    "Starts the kettle after noticing silence.",
    "Brings the cup without forcing a conversation.",
  ]);
  assert.equal(behavior.behaviorType, "domestic");
  assert.equal(behavior.loveLanguageSource.includes("acts_of_service"), true);
  assert.equal(behavior.repairStyles.includes("acts_of_service_repair"), true);
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

test("creates relationship dynamic seed presets with chemistry and repair metadata", () => {
  const dynamic = createRelationshipDynamicSeedPreset({
    seed: "safe_haven_dynamic",
    label: "Safe Haven Dynamic",
    description: "A relationship where both people become a reliable source of return.",
    examples: [
      "One partner comes back after distance instead of making the other guess.",
      "Comfort is offered without turning into control.",
      "Comfort is offered without turning into control.",
    ],
    tags: ["relationship_dynamic", "attachment"],
    relatedSeeds: ["fear_of_abandonment"],
    oppositeSeeds: ["inconsistent_presence"],
    romanceHooks: ["safe_haven_romance"],
    scenarioHooks: ["delayed_reply_trigger"],
    dialoguePatterns: ["You can come back here."],
    dynamicType: "attachment",
    emotionalCore: "You can come back here and still be loved.",
    primaryNeeds: ["consistency", "clear return"],
    primaryFears: ["being left"],
    typicalTriggers: ["goodbye_trigger"],
    commonResponses: ["reassurance_seeking_response"],
    conflictPatterns: ["distance_feels_threatening"],
    repairPatterns: ["verbal_reassurance_repair"],
    associatedWounds: ["abandonment_wound"],
    associatedFears: ["fear_of_abandonment"],
    associatedDesires: ["desire_for_safety"],
    evolutionPath: ["recognition", "repair", "secure rhythm"],
    unhealthyVersion: ["dependency_without_boundaries"],
    healthyVersion: ["secure_attachment"],
    routeGates: ["safe_haven_gate"],
    metadata: {
      chemistryValue: 12,
      conflictPotential: 6,
      healingPotential: 10,
      intensity: "high",
    },
  }) satisfies RelationshipDynamicSeed;

  assert.equal(dynamic.metadata.category, "relationship_dynamic");
  assert.equal(dynamic.metadata.chemistryValue, 10);
  assert.equal(dynamic.metadata.healingPotential, 10);
  assert.equal(dynamic.metadata.intensity, "high");
  assert.deepEqual(dynamic.examples, [
    "One partner comes back after distance instead of making the other guess.",
    "Comfort is offered without turning into control.",
  ]);
  assert.equal(dynamic.dynamicType, "attachment");
  assert.equal(dynamic.emotionalCore.includes("still be loved"), true);
  assert.equal(dynamic.repairPatterns.includes("verbal_reassurance_repair"), true);
});

test("defaults relationship dynamic metadata for broad catalogue generation", () => {
  const dynamic = createRelationshipDynamicSeedPreset({
    seed: "quiet_domesticity_dynamic",
    label: "Quiet Domesticity Dynamic",
    description: "Ordinary life becomes a reliable expression of love.",
    dynamicType: "domestic",
    emotionalCore: "Love stays visible in small daily rituals.",
  });

  assert.equal(dynamic.metadata.category, "relationship_dynamic");
  assert.equal(dynamic.metadata.chemistryValue, 8);
  assert.equal(dynamic.metadata.conflictPotential, 6);
  assert.equal(dynamic.metadata.healingPotential, 7);
  assert.equal(dynamic.metadata.intensity, "medium");
  assert.deepEqual(dynamic.primaryNeeds, []);
  assert.deepEqual(dynamic.routeGates, []);
});

test("creates romance trope seed presets with route and payoff metadata", () => {
  const trope = createRomanceTropeSeedPreset({
    seed: "enemies_to_lovers",
    label: "Enemies to Lovers",
    description: "Hostility gradually transforms into respect, vulnerability, and love.",
    examples: [
      "Two people on opposing sides are forced to work together.",
      "A former enemy protects them at personal cost.",
      "A former enemy protects them at personal cost.",
    ],
    tags: ["romance_trope", "conflict"],
    relatedSeeds: ["rivals_dynamic"],
    oppositeSeeds: ["instant_love"],
    romanceHooks: ["enemy_protects_user"],
    scenarioHooks: ["forced_alliance"],
    dialoguePatterns: ["I still do not trust you."],
    tropeType: "conflict_based",
    emotionalCore: "The person who felt unsafe becomes the person who understands them most.",
    payoffFantasy: "Being loved by someone who saw the worst first and chose them anyway.",
    startingConditions: ["opposing_goals"],
    emotionalBarriers: ["pride"],
    commonTriggers: ["forced_partnership"],
    commonResponses: ["defensive_anger_response"],
    associatedWounds: ["betrayal_wound"],
    associatedFears: ["fear_of_betrayal"],
    associatedDesires: ["desire_for_respect"],
    relationshipDynamics: ["rivals_dynamic"],
    routePhases: ["hostility", "reluctant_trust"],
    conflictBeats: ["misread_motive"],
    repairBeats: ["truth_telling_repair"],
    intimacyGates: ["enemy_to_partner_gate"],
    healthyVersion: ["trust_is_earned"],
    unhealthyVersion: ["cruelty_mistaken_for_chemistry"],
    antiPatterns: ["no_accountability_for_harm"],
    compatibleSettings: ["academy"],
    compatibleOpeners: ["rival_challenge"],
    metadata: {
      intensity: "high",
      burnSpeed: "slow",
      angstValue: 9,
      comfortValue: 6,
      chemistryValue: 11,
      conflictPotential: 10,
      healingPotential: 8,
    },
  }) satisfies RomanceTropeSeed;

  assert.equal(trope.metadata.category, "romance_trope");
  assert.equal(trope.metadata.chemistryValue, 10);
  assert.equal(trope.metadata.burnSpeed, "slow");
  assert.deepEqual(trope.examples, [
    "Two people on opposing sides are forced to work together.",
    "A former enemy protects them at personal cost.",
  ]);
  assert.equal(trope.tropeType, "conflict_based");
  assert.equal(trope.payoffFantasy.includes("worst first"), true);
  assert.equal(trope.relationshipDynamics.includes("rivals_dynamic"), true);
});

test("defaults romance trope metadata for broad catalogue generation", () => {
  const trope = createRomanceTropeSeedPreset({
    seed: "quiet_domesticity",
    label: "Quiet Domesticity",
    description: "Ordinary routine becomes the route into love.",
    tropeType: "domestic",
    emotionalCore: "Love becomes visible in small daily rituals.",
    payoffFantasy: "Being chosen in breakfast, keys, and coming home.",
  });

  assert.equal(trope.metadata.category, "romance_trope");
  assert.equal(trope.metadata.intensity, "medium");
  assert.equal(trope.metadata.burnSpeed, "variable");
  assert.equal(trope.metadata.angstValue, 6);
  assert.equal(trope.metadata.comfortValue, 6);
  assert.equal(trope.metadata.chemistryValue, 8);
  assert.deepEqual(trope.routePhases, []);
  assert.deepEqual(trope.antiPatterns, []);
});

test("creates route phase seed presets with phase pressure and route metadata", () => {
  const phase = createRoutePhaseSeedPreset({
    seed: "vulnerability_leak",
    label: "Vulnerability Leak",
    description: "Guarded emotion slips out before full confession is safe.",
    examples: [
      "A joke lands too close to the truth.",
      "A character admits fear and tries to take it back.",
      "A joke lands too close to the truth.",
    ],
    tags: ["route_phase", "vulnerability"],
    relatedSeeds: ["fear_of_vulnerability"],
    oppositeSeeds: ["emotional_shutdown_response"],
    romanceHooks: ["accidental_confession"],
    scenarioHooks: ["late_night_conversation"],
    dialoguePatterns: ["I did not mean to say that."],
    phaseType: "vulnerability",
    emotionalFunction: "Lets protected truth appear before full trust is complete.",
    phaseQuestion: "What slips out when distance can no longer be performed?",
    readinessSignals: ["mask_strained", "truth_nearly_spoken", "mask_strained"],
    blockingForces: ["fear_of_rejection"],
    activatesWounds: ["shame_wound"],
    activatesFears: ["fear_of_vulnerability"],
    activatesDesires: ["desire_to_be_seen"],
    likelyTriggers: ["too_much_kindness_trigger"],
    likelyResponses: ["truth_slip_response"],
    relationshipDynamics: ["safe_vulnerability_dynamic"],
    compatibleTropes: ["slow_burn"],
    conflictBeats: ["truth_immediately_denied"],
    repairBeats: ["gentle_reassurance_repair"],
    entryConditions: ["some_trust_exists"],
    exitConditions: ["truth_is_received"],
    routeGates: ["safe_to_be_seen_gate"],
    milestoneMemories: ["first_accidental_truth_memory"],
    healthyVersion: ["truth_is_received_without_pressure"],
    unhealthyVersion: ["truth_is_forced_out"],
    growthArcs: ["learns_truth_can_survive_being_seen"],
    metadata: {
      order: 5,
      intensity: "high",
      burnPressure: "high",
      angstValue: 8,
      comfortValue: 7,
      chemistryValue: 12,
      healingValue: 10,
    },
  }) satisfies RoutePhaseSeed;

  assert.equal(phase.metadata.category, "route_phase");
  assert.equal(phase.metadata.order, 5);
  assert.equal(phase.metadata.intensity, "high");
  assert.equal(phase.metadata.chemistryValue, 10);
  assert.deepEqual(phase.examples, [
    "A joke lands too close to the truth.",
    "A character admits fear and tries to take it back.",
  ]);
  assert.deepEqual(phase.readinessSignals, [
    "mask_strained",
    "truth_nearly_spoken",
  ]);
  assert.equal(phase.phaseType, "vulnerability");
  assert.equal(phase.phaseQuestion.includes("slips out"), true);
  assert.equal(phase.routeGates.includes("safe_to_be_seen_gate"), true);
});

test("defaults route phase metadata for broad catalogue generation", () => {
  const phase = createRoutePhaseSeedPreset({
    seed: "opening_phase",
    label: "Opening Phase",
    description: "Establishes the starting emotional rules.",
    phaseType: "opening",
    emotionalFunction: "Names the starting distance and route pressure.",
    phaseQuestion: "What are they before love starts moving?",
  });

  assert.equal(phase.metadata.category, "route_phase");
  assert.equal(phase.metadata.order, 0);
  assert.equal(phase.metadata.intensity, "medium");
  assert.equal(phase.metadata.burnPressure, "medium");
  assert.equal(phase.metadata.angstValue, 6);
  assert.equal(phase.metadata.comfortValue, 6);
  assert.equal(phase.metadata.chemistryValue, 7);
  assert.equal(phase.metadata.healingValue, 7);
  assert.deepEqual(phase.readinessSignals, []);
  assert.deepEqual(phase.routeGates, []);
});

test("creates payoff fantasy seed presets with catharsis and ending metadata", () => {
  const payoff = createPayoffFantasySeedPreset({
    seed: "chosen_above_everyone",
    label: "Chosen Above Everyone",
    description: "The love interest clearly chooses the character above alternatives.",
    examples: [
      "They choose the character publicly despite social consequences.",
      "They reject a rival or safer option.",
      "They choose the character publicly despite social consequences.",
    ],
    tags: ["payoff_fantasy", "chosen"],
    relatedSeeds: ["desire_to_be_chosen"],
    oppositeSeeds: ["emotional_ambiguity"],
    romanceHooks: ["public_choice_confession"],
    scenarioHooks: ["rival_forces_choice"],
    dialoguePatterns: ["I choose you."],
    payoffType: "chosen",
    fulfillsDesires: ["desire_to_be_chosen", "desire_to_be_chosen"],
    resolvesFears: ["fear_of_replacement"],
    healsWounds: ["rejection_wound"],
    compatibleTropes: ["fake_relationship"],
    compatibleDynamics: ["devotional_dynamic"],
    compatibleGrowthArcs: ["learning_to_receive_devotion"],
    requiredRoutePhases: ["crisis_or_choice"],
    payoffScenes: ["public_side_taken_scene"],
    emotionalProofs: ["choice_has_cost"],
    endingFlavors: ["earned_happy_ending"],
    antiPatterns: ["choice_used_as_ownership"],
    routeGates: ["public_choice_gate"],
    milestoneMemories: ["first_public_choice_memory"],
    metadata: {
      intensity: "high",
      comfortValue: 9,
      romanceValue: 12,
      healingValue: 10,
      catharsisValue: 10,
    },
  }) satisfies PayoffFantasySeed;

  assert.equal(payoff.metadata.category, "payoff_fantasy");
  assert.equal(payoff.metadata.intensity, "high");
  assert.equal(payoff.metadata.romanceValue, 10);
  assert.deepEqual(payoff.examples, [
    "They choose the character publicly despite social consequences.",
    "They reject a rival or safer option.",
  ]);
  assert.deepEqual(payoff.fulfillsDesires, ["desire_to_be_chosen"]);
  assert.equal(payoff.payoffType, "chosen");
  assert.equal(payoff.emotionalProofs.includes("choice_has_cost"), true);
  assert.equal(payoff.routeGates.includes("public_choice_gate"), true);
});

test("defaults payoff fantasy metadata for broad catalogue generation", () => {
  const payoff = createPayoffFantasySeedPreset({
    seed: "domestic_happiness",
    label: "Domestic Happiness",
    description: "The relationship becomes safe enough for ordinary life.",
    payoffType: "domestic",
  });

  assert.equal(payoff.metadata.category, "payoff_fantasy");
  assert.equal(payoff.metadata.intensity, "medium");
  assert.equal(payoff.metadata.comfortValue, 7);
  assert.equal(payoff.metadata.romanceValue, 8);
  assert.equal(payoff.metadata.healingValue, 7);
  assert.equal(payoff.metadata.catharsisValue, 7);
  assert.deepEqual(payoff.fulfillsDesires, []);
  assert.deepEqual(payoff.routeGates, []);
});

test("creates relationship identity seed presets with ending and daily-expression metadata", () => {
  const identity = createRelationshipIdentitySeedPreset({
    seed: "safe_haven_relationship",
    label: "Safe Haven Relationship",
    description: "A bond where conflict does not erase love.",
    examples: [
      "Arguments end with repair instead of abandonment.",
      "Both people know they can be vulnerable without punishment.",
      "Arguments end with repair instead of abandonment.",
    ],
    tags: ["relationship_identity", "safety"],
    relatedSeeds: ["safe_haven_dynamic"],
    oppositeSeeds: ["hot_cold_relationship"],
    romanceHooks: ["i_am_not_leaving_scene"],
    scenarioHooks: ["post_conflict_repair"],
    dialoguePatterns: ["A fight is not the end of us."],
    identityType: "safety",
    fulfillsDesires: ["desire_for_reliable_love", "desire_for_reliable_love"],
    resolvesFears: ["fear_of_abandonment"],
    healsWounds: ["abandonment_wound"],
    compatibleDynamics: ["safe_haven_dynamic"],
    compatibleTropes: ["hurt_comfort"],
    compatiblePayoffFantasies: ["someone_finally_stays"],
    requiredGrowthArcs: ["learning_secure_attachment"],
    relationshipRules: ["conflict_requires_return"],
    emotionalProofs: ["returns_after_conflict"],
    dailyExpressions: ["ordinary_reliability", "ordinary_reliability"],
    conflictRisks: ["overdependence"],
    repairNeeds: ["presence_based_repair"],
    routeGates: ["safe_haven_identity_gate"],
    milestoneMemories: ["first_conflict_repaired_memory"],
    metadata: {
      stabilityValue: 12,
      romanceValue: 10,
      healingValue: 10,
      conflictPotential: 4,
      endingStrength: "transformational",
    },
  }) satisfies RelationshipIdentitySeed;

  assert.equal(identity.metadata.category, "relationship_identity");
  assert.equal(identity.metadata.stabilityValue, 10);
  assert.equal(identity.metadata.endingStrength, "transformational");
  assert.deepEqual(identity.examples, [
    "Arguments end with repair instead of abandonment.",
    "Both people know they can be vulnerable without punishment.",
  ]);
  assert.deepEqual(identity.fulfillsDesires, ["desire_for_reliable_love"]);
  assert.deepEqual(identity.dailyExpressions, ["ordinary_reliability"]);
  assert.equal(identity.identityType, "safety");
  assert.equal(identity.routeGates.includes("safe_haven_identity_gate"), true);
});

test("defaults relationship identity metadata for broad catalogue generation", () => {
  const identity = createRelationshipIdentitySeedPreset({
    seed: "quiet_love_relationship",
    label: "Quiet Love Relationship",
    description: "A private, steady bond that does not need performance to feel real.",
    identityType: "quiet_love",
  });

  assert.equal(identity.metadata.category, "relationship_identity");
  assert.equal(identity.metadata.stabilityValue, 8);
  assert.equal(identity.metadata.romanceValue, 8);
  assert.equal(identity.metadata.healingValue, 8);
  assert.equal(identity.metadata.conflictPotential, 5);
  assert.equal(identity.metadata.endingStrength, "solid");
  assert.deepEqual(identity.fulfillsDesires, []);
  assert.deepEqual(identity.routeGates, []);
});

test("creates attachment style seed presets with intimacy and repair metadata", () => {
  const attachment = createAttachmentStyleSeedPreset({
    seed: "anxious_attachment",
    label: "Anxious Attachment",
    description: "An attachment pattern marked by fear of abandonment.",
    examples: [
      "Panics when messages go unanswered.",
      "Needs conflict resolved quickly.",
      "Panics when messages go unanswered.",
    ],
    tags: ["attachment_style", "anxious"],
    relatedSeeds: ["abandonment_wound"],
    oppositeSeeds: ["secure_attachment"],
    romanceHooks: ["i_am_not_leaving_scene"],
    scenarioHooks: ["delayed_reply_spiral"],
    dialoguePatterns: ["I need to know we are okay."],
    attachmentType: "anxious",
    coreBelief: "Love can disappear if they are not constantly attentive to it.",
    coreFear: "Being abandoned or emotionally deprioritized.",
    coreDesire: "Reliable love and clear reassurance.",
    associatedWounds: ["abandonment_wound", "abandonment_wound"],
    associatedFears: ["fear_of_abandonment"],
    associatedDesires: ["desire_for_reliable_love"],
    commonTriggers: ["unanswered_message_trigger"],
    commonResponses: ["reassurance_seeking_response"],
    intimacyPattern: ["moves_toward_closeness_under_stress"],
    conflictPattern: ["pursuer_conflict_style"],
    repairNeeds: ["verbal_reassurance"],
    compatibleRepairStyles: ["return_and_stay_repair"],
    healthyVersion: ["asks_directly_for_reassurance"],
    unhealthyVersion: ["tests_love_repeatedly"],
    growthArcs: ["learning_secure_attachment"],
    routeGates: ["first_reassurance_gate"],
    metadata: {
      romanceValue: 9,
      angstValue: 12,
      conflictPotential: 9,
      healingValue: 10,
      securityLevel: "low",
    },
  }) satisfies AttachmentStyleSeed;

  assert.equal(attachment.metadata.category, "attachment_style");
  assert.equal(attachment.metadata.securityLevel, "low");
  assert.equal(attachment.metadata.angstValue, 10);
  assert.deepEqual(attachment.examples, [
    "Panics when messages go unanswered.",
    "Needs conflict resolved quickly.",
  ]);
  assert.deepEqual(attachment.associatedWounds, ["abandonment_wound"]);
  assert.equal(attachment.attachmentType, "anxious");
  assert.equal(attachment.coreBelief.includes("Love can disappear"), true);
  assert.equal(attachment.repairNeeds.includes("verbal_reassurance"), true);
});

test("defaults attachment style metadata for broad catalogue generation", () => {
  const attachment = createAttachmentStyleSeedPreset({
    seed: "secure_attachment",
    label: "Secure Attachment",
    description: "An attachment pattern grounded in trust and repair.",
    attachmentType: "secure",
    coreBelief: "Closeness can hold honesty.",
    coreFear: "Letting old patterns speak louder than present trust.",
    coreDesire: "Mutual trust and respectful closeness.",
  });

  assert.equal(attachment.metadata.category, "attachment_style");
  assert.equal(attachment.metadata.securityLevel, "medium");
  assert.equal(attachment.metadata.romanceValue, 8);
  assert.equal(attachment.metadata.angstValue, 7);
  assert.equal(attachment.metadata.conflictPotential, 7);
  assert.equal(attachment.metadata.healingValue, 8);
  assert.deepEqual(attachment.associatedWounds, []);
  assert.deepEqual(attachment.routeGates, []);
});

test("creates love language seed presets with visible behavior and repair metadata", () => {
  const loveLanguage = createLoveLanguageSeedPreset({
    seed: "acts_of_service",
    label: "Acts of Service",
    description: "Care is expressed through practical support.",
    examples: [
      "Makes tea before a difficult conversation.",
      "Handles chores when the other person is overwhelmed.",
      "Makes tea before a difficult conversation.",
    ],
    tags: ["love_language", "service"],
    relatedSeeds: ["quiet_devotion"],
    oppositeSeeds: ["performative_care"],
    romanceHooks: ["service_as_love_confession"],
    scenarioHooks: ["post_conflict_service"],
    dialoguePatterns: ["Let me make this easier for you."],
    loveLanguageType: "service",
    emotionalMeaning: "I notice what burdens you.",
    hiddenNeed: "To feel useful and trusted.",
    commonMisread: "Can be misread as control.",
    associatedWounds: ["conditional_love_wound", "conditional_love_wound"],
    associatedFears: ["fear_of_being_useless"],
    associatedDesires: ["desire_to_be_needed"],
    compatibleAttachmentStyles: ["caretaker_attachment"],
    compatibleDynamics: ["mutual_caretaking_dynamic"],
    visibleBehaviors: ["makes_tea", "handles_chores", "makes_tea"],
    fulfillmentSignals: ["effort_is_noticed"],
    deprivationSignals: ["feels_unneeded"],
    conflictRisks: ["help_becomes_control"],
    repairStyles: ["acts_of_service_repair"],
    growthArcs: ["learns_to_receive_care"],
    routeGates: ["first_service_as_love_gate"],
    metadata: {
      romanceValue: 9,
      intimacyValue: 8,
      healingValue: 12,
      conflictPotential: 5,
      pacingPressure: "medium",
    },
  }) satisfies LoveLanguageSeed;

  assert.equal(loveLanguage.metadata.category, "love_language");
  assert.equal(loveLanguage.metadata.healingValue, 10);
  assert.deepEqual(loveLanguage.examples, [
    "Makes tea before a difficult conversation.",
    "Handles chores when the other person is overwhelmed.",
  ]);
  assert.deepEqual(loveLanguage.associatedWounds, ["conditional_love_wound"]);
  assert.deepEqual(loveLanguage.visibleBehaviors, ["makes_tea", "handles_chores"]);
  assert.equal(loveLanguage.loveLanguageType, "service");
  assert.equal(loveLanguage.routeGates.includes("first_service_as_love_gate"), true);
});

test("defaults love language metadata for broad catalogue generation", () => {
  const loveLanguage = createLoveLanguageSeedPreset({
    seed: "emotional_presence",
    label: "Emotional Presence",
    description: "Care is expressed through steady attention.",
    loveLanguageType: "presence",
    emotionalMeaning: "I am here with you.",
    hiddenNeed: "To be met without performing.",
    commonMisread: "Can be missed when the other person expects grand gestures.",
  });

  assert.equal(loveLanguage.metadata.category, "love_language");
  assert.equal(loveLanguage.metadata.romanceValue, 8);
  assert.equal(loveLanguage.metadata.intimacyValue, 8);
  assert.equal(loveLanguage.metadata.healingValue, 8);
  assert.equal(loveLanguage.metadata.conflictPotential, 5);
  assert.equal(loveLanguage.metadata.pacingPressure, "medium");
  assert.deepEqual(loveLanguage.visibleBehaviors, []);
  assert.deepEqual(loveLanguage.repairStyles, []);
});

test("creates growth arc seed presets with route, repair, and milestone metadata", () => {
  const growthArc = createGrowthArcSeedPreset({
    seed: "learning_to_trust",
    label: "Learning to Trust",
    description: "Learns that trust can be earned through consistency and repair.",
    examples: [
      "They stop assuming every promise is empty.",
      "They accept help without immediately testing it.",
      "They stop assuming every promise is empty.",
    ],
    tags: ["growth_arc", "trust"],
    relatedSeeds: ["betrayal_wound"],
    oppositeSeeds: ["emotional_lockdown"],
    romanceHooks: ["earned_trust_slow_burn"],
    scenarioHooks: ["promise_kept_after_doubt"],
    dialoguePatterns: ["You keep showing up. I noticed."],
    arcType: "trust",
    startingWounds: ["betrayal_wound", "betrayal_wound"],
    startingFears: ["fear_of_betrayal"],
    coreDesires: ["desire_for_reliable_love"],
    commonTriggers: ["broken_promise_trigger"],
    oldResponses: ["trust_testing_response"],
    newResponses: ["asks_directly_for_truth"],
    requiredRepairBeats: ["promise_kept_beat"],
    milestoneMemories: ["first_kept_promise_memory"],
    routeGates: ["earned_trust_gate"],
    regressionRisks: ["empty_promises"],
    healthyOutcome: ["trusts_evidence_over_fear"],
    relationshipEffects: ["deepens_emotional_safety"],
    metadata: {
      intensity: "transformational",
      healingValue: 10,
      angstValue: 8,
      romanceValue: 12,
      pacingPressure: "high",
    },
  }) satisfies GrowthArcSeed;

  assert.equal(growthArc.metadata.category, "growth_arc");
  assert.equal(growthArc.metadata.intensity, "transformational");
  assert.equal(growthArc.metadata.romanceValue, 10);
  assert.equal(growthArc.metadata.pacingPressure, "high");
  assert.deepEqual(growthArc.examples, [
    "They stop assuming every promise is empty.",
    "They accept help without immediately testing it.",
  ]);
  assert.deepEqual(growthArc.startingWounds, ["betrayal_wound"]);
  assert.equal(growthArc.arcType, "trust");
  assert.equal(growthArc.requiredRepairBeats.includes("promise_kept_beat"), true);
  assert.equal(growthArc.milestoneMemories.includes("first_kept_promise_memory"), true);
});

test("defaults growth arc metadata for broad catalogue generation", () => {
  const growthArc = createGrowthArcSeedPreset({
    seed: "learning_to_rest",
    label: "Learning to Rest",
    description: "Learns that love does not require constant usefulness.",
    arcType: "rest",
  });

  assert.equal(growthArc.metadata.category, "growth_arc");
  assert.equal(growthArc.metadata.intensity, "medium");
  assert.equal(growthArc.metadata.healingValue, 7);
  assert.equal(growthArc.metadata.angstValue, 6);
  assert.equal(growthArc.metadata.romanceValue, 7);
  assert.equal(growthArc.metadata.pacingPressure, "medium");
  assert.deepEqual(growthArc.commonTriggers, []);
  assert.deepEqual(growthArc.routeGates, []);
});

test("creates repair beat seed presets with repair effect metadata", () => {
  const repairBeat = createRepairBeatSeedPreset({
    seed: "accountability_beat",
    label: "Accountability Beat",
    description: "Names the harm and accepts responsibility without defending it.",
    examples: [
      "They admit the lie without minimizing it.",
      "They stop explaining long enough to acknowledge the hurt.",
      "They admit the lie without minimizing it.",
    ],
    tags: ["repair_beat", "accountability"],
    relatedSeeds: ["accountability_repair"],
    oppositeSeeds: ["blame_shifting"],
    romanceHooks: ["owning_the_hurt"],
    scenarioHooks: ["post_argument_repair"],
    dialoguePatterns: ["That was on me."],
    beatType: "accountability",
    emotionalFunction: "Creates believable ground for repair.",
    repairQuestion: "Can harm be faced without defensiveness?",
    repairsConsequences: ["trust_damage_consequence", "trust_damage_consequence"],
    repairsRuptures: ["betrayal_rupture"],
    compatibleRepairStyles: ["accountability_repair"],
    requiredConditions: ["specific_admission"],
    likelyResistance: ["shame_spiral"],
    failureModes: ["accountability_without_change"],
    successSignals: ["changed_behavior_plan_exists"],
    relationshipEffects: ["opens_repair_path"],
    milestoneMemories: ["first_real_accountability_memory"],
    growthPotential: ["learning_repair"],
    metadata: {
      intensity: "high",
      repairPower: 9,
      trustRepairValue: 12,
      attachmentRepairValue: 7,
      healingValue: 9,
      pacingPressure: "medium",
    },
  }) satisfies RepairBeatSeed;

  assert.equal(repairBeat.metadata.category, "repair_beat");
  assert.equal(repairBeat.metadata.intensity, "high");
  assert.equal(repairBeat.metadata.trustRepairValue, 10);
  assert.equal(repairBeat.metadata.pacingPressure, "medium");
  assert.deepEqual(repairBeat.examples, [
    "They admit the lie without minimizing it.",
    "They stop explaining long enough to acknowledge the hurt.",
  ]);
  assert.deepEqual(repairBeat.repairsConsequences, ["trust_damage_consequence"]);
  assert.equal(repairBeat.beatType, "accountability");
  assert.equal(repairBeat.successSignals.includes("changed_behavior_plan_exists"), true);
  assert.equal(repairBeat.growthPotential.includes("learning_repair"), true);
});

test("defaults repair beat metadata for broad catalogue generation", () => {
  const repairBeat = createRepairBeatSeedPreset({
    seed: "shared_silence_beat",
    label: "Shared Silence Beat",
    description: "Restores safety by staying present without demanding speech.",
    beatType: "comfort",
    emotionalFunction: "Lets presence repair what words cannot reach yet.",
    repairQuestion: "Can they sit together without rushing closure?",
  });

  assert.equal(repairBeat.metadata.category, "repair_beat");
  assert.equal(repairBeat.metadata.intensity, "medium");
  assert.equal(repairBeat.metadata.repairPower, 7);
  assert.equal(repairBeat.metadata.trustRepairValue, 7);
  assert.equal(repairBeat.metadata.attachmentRepairValue, 7);
  assert.equal(repairBeat.metadata.healingValue, 7);
  assert.equal(repairBeat.metadata.pacingPressure, "medium");
  assert.deepEqual(repairBeat.repairsConsequences, []);
  assert.deepEqual(repairBeat.milestoneMemories, []);
});

test("creates consequence seed presets with aftermath and repair metadata", () => {
  const consequence = createConsequenceSeedPreset({
    seed: "trust_damage_consequence",
    label: "Trust Damage Consequence",
    description:
      "The relationship loses reliability, emotional faith, or confidence after a rupture.",
    examples: [
      "A character stops believing promises.",
      "Future reassurances are treated as uncertain.",
      "A character stops believing promises.",
    ],
    tags: ["consequence", "trust"],
    relatedSeeds: ["betrayal_rupture"],
    oppositeSeeds: ["earned_trust"],
    romanceHooks: ["trust_must_be_earned_again"],
    scenarioHooks: ["after_the_lie"],
    dialoguePatterns: ["Words are easy."],
    consequenceType: "trust_damage",
    causedBy: ["betrayal_rupture", "betrayal_rupture"],
    affectsTrustLayers: ["reliability_trust", "emotional_trust"],
    likelyResponses: ["emotional_lockdown_response"],
    repairNeeds: ["truth", "changed_behavior"],
    compatibleRepairStyles: ["truth_and_accountability_repair"],
    growthPotential: ["distinguishes_words_from_evidence"],
    milestoneMemories: ["trust_broken_memory"],
    metadata: {
      severity: "major",
      persistence: "arc_level",
      angstValue: 9,
      healingValue: 12,
      repairDifficulty: 11,
    },
  }) satisfies ConsequenceSeed;

  assert.equal(consequence.metadata.category, "consequence");
  assert.equal(consequence.metadata.severity, "major");
  assert.equal(consequence.metadata.persistence, "arc_level");
  assert.equal(consequence.metadata.healingValue, 10);
  assert.equal(consequence.metadata.repairDifficulty, 10);
  assert.deepEqual(consequence.examples, [
    "A character stops believing promises.",
    "Future reassurances are treated as uncertain.",
  ]);
  assert.deepEqual(consequence.causedBy, ["betrayal_rupture"]);
  assert.equal(consequence.consequenceType, "trust_damage");
  assert.equal(consequence.repairNeeds.includes("truth"), true);
});

test("defaults consequence seed metadata for broad catalogue generation", () => {
  const consequence = createConsequenceSeedPreset({
    seed: "emotional_distance_consequence",
    label: "Emotional Distance Consequence",
    description: "A rupture leaves one or both characters farther from easy closeness.",
    consequenceType: "distance",
  });

  assert.equal(consequence.metadata.category, "consequence");
  assert.equal(consequence.metadata.severity, "moderate");
  assert.equal(consequence.metadata.persistence, "scene_level");
  assert.equal(consequence.metadata.angstValue, 7);
  assert.equal(consequence.metadata.healingValue, 7);
  assert.equal(consequence.metadata.repairDifficulty, 7);
  assert.deepEqual(consequence.causedBy, []);
  assert.deepEqual(consequence.milestoneMemories, []);
});

test("creates rupture type seed presets with damaged trust layer metadata", () => {
  const rupture = createRuptureTypeSeedPreset({
    seed: "abandonment_rupture",
    label: "Abandonment Rupture",
    description:
      "One character experiences the other as leaving, disappearing, or failing to return.",
    examples: [
      "A promised return does not happen.",
      "Silence after conflict feels like being left.",
      "A promised return does not happen.",
    ],
    tags: ["rupture_type", "attachment"],
    relatedSeeds: ["abandonment_wound"],
    oppositeSeeds: ["secure_return"],
    romanceHooks: ["i_came_back_scene"],
    scenarioHooks: ["missed_check_in"],
    dialoguePatterns: ["You left."],
    ruptureType: "abandonment",
    emotionalDamage:
      "Damages emotional permanence and confidence that conflict will not end the bond.",
    damagedTrustLayer: ["emotional_trust", "emotional_trust", "attachment_trust"],
    activatesWounds: ["abandonment_wound"],
    activatesFears: ["fear_of_abandonment"],
    frustratesDesires: ["desire_for_reliable_love"],
    commonTriggers: ["goodbye_trigger"],
    commonResponses: ["panic_spiral_response"],
    compatibleConflictBeats: ["delayed_reply_spiral"],
    repairNeeds: ["return", "presence"],
    compatibleRepairStyles: ["presence_based_repair"],
    incompatibleRepairStyles: ["vague_apology_without_return"],
    consequencePatterns: ["attachment_damage_consequence"],
    memoryEffects: ["marks_absence_as_evidence"],
    growthPotential: ["learns_to_name_needs_before_spiraling"],
    routeGates: ["first_return_after_absence_gate"],
    milestoneMemories: ["first_time_they_came_back_memory"],
    metadata: {
      severityBias: "major",
      trustDamage: 8,
      attachmentDamage: 12,
      repairDifficulty: 9,
      angstValue: 9,
      healingValue: 10,
    },
  }) satisfies RuptureTypeSeed;

  assert.equal(rupture.metadata.category, "rupture_type");
  assert.equal(rupture.metadata.severityBias, "major");
  assert.equal(rupture.metadata.attachmentDamage, 10);
  assert.deepEqual(rupture.examples, [
    "A promised return does not happen.",
    "Silence after conflict feels like being left.",
  ]);
  assert.deepEqual(rupture.damagedTrustLayer, [
    "emotional_trust",
    "attachment_trust",
  ]);
  assert.equal(rupture.ruptureType, "abandonment");
  assert.equal(rupture.compatibleConflictBeats.includes("delayed_reply_spiral"), true);
});

test("defaults rupture type metadata for broad catalogue generation", () => {
  const rupture = createRuptureTypeSeedPreset({
    seed: "emotional_invalidation_rupture",
    label: "Emotional Invalidation Rupture",
    description: "A character's feeling is dismissed, minimized, or made inconvenient.",
    ruptureType: "invalidation",
    emotionalDamage: "Damages confidence that vulnerability will be received with care.",
  });

  assert.equal(rupture.metadata.category, "rupture_type");
  assert.equal(rupture.metadata.severityBias, "moderate");
  assert.equal(rupture.metadata.trustDamage, 7);
  assert.equal(rupture.metadata.attachmentDamage, 7);
  assert.equal(rupture.metadata.repairDifficulty, 7);
  assert.deepEqual(rupture.damagedTrustLayer, []);
  assert.deepEqual(rupture.routeGates, []);
});

test("creates conflict beat seed presets with route and rupture metadata", () => {
  const conflictBeat = createConflictBeatSeedPreset({
    seed: "delayed_reply_spiral",
    label: "Delayed Reply Spiral",
    description:
      "A delayed reply becomes emotionally charged because silence is interpreted as rejection, abandonment, or loss of priority.",
    examples: [
      "A character checks their phone until ordinary distance becomes emotional evidence.",
      "A late answer triggers an argument neither person meant to start.",
      "A character checks their phone until ordinary distance becomes emotional evidence.",
    ],
    tags: ["conflict_beat", "attachment"],
    relatedSeeds: ["unanswered_message_trigger"],
    oppositeSeeds: ["secure_waiting"],
    romanceHooks: ["late_reply_reassurance"],
    scenarioHooks: ["missed_goodnight_text"],
    dialoguePatterns: ["I know it was only a few hours."],
    beatType: "separation",
    emotionalFunction:
      "Turns absence into a test of emotional permanence and reliable return.",
    hiddenQuestion: "Do I still matter when I am not immediately answered?",
    activatesWounds: ["abandonment_wound"],
    activatesFears: ["fear_of_abandonment"],
    activatesDesires: ["desire_for_reliable_love"],
    commonTriggers: ["unanswered_message_trigger", "unanswered_message_trigger"],
    likelyResponses: ["panic_spiral_response"],
    compatibleConflictStyles: ["pursuer_conflict_style"],
    compatibleRepairStyles: ["verbal_reassurance_repair"],
    compatibleRoutePhases: ["early_trust_phase"],
    compatibleTropes: ["slow_burn"],
    escalationPath: ["notices_silence", "conflict_or_shutdown"],
    ruptureRisks: ["abandonment_rupture"],
    repairNeeds: ["clear_context", "return_ritual"],
    growthPotential: ["learns_distance_is_not_abandonment"],
    routeGates: ["first_silence_trigger_gate"],
    milestoneMemories: ["first_repair_after_delay_memory"],
    metadata: {
      intensity: "high",
      ruptureRisk: 12,
      angstValue: 9,
      chemistryValue: 8,
      healingValue: 10,
      pacingPressure: "high",
    },
  }) satisfies ConflictBeatSeed;

  assert.equal(conflictBeat.metadata.category, "conflict_beat");
  assert.equal(conflictBeat.metadata.intensity, "high");
  assert.equal(conflictBeat.metadata.ruptureRisk, 10);
  assert.deepEqual(conflictBeat.examples, [
    "A character checks their phone until ordinary distance becomes emotional evidence.",
    "A late answer triggers an argument neither person meant to start.",
  ]);
  assert.deepEqual(conflictBeat.commonTriggers, ["unanswered_message_trigger"]);
  assert.equal(conflictBeat.beatType, "separation");
  assert.equal(conflictBeat.routeGates.includes("first_silence_trigger_gate"), true);
});

test("defaults conflict beat metadata for broad catalogue generation", () => {
  const conflictBeat = createConflictBeatSeedPreset({
    seed: "misread_motive",
    label: "Misread Motive",
    description: "A character reads harm into an action whose motive is still unknown.",
    beatType: "misunderstanding",
    emotionalFunction: "Lets history distort the meaning of a present action.",
    hiddenQuestion: "Was this care, control, indifference, or betrayal?",
  });

  assert.equal(conflictBeat.metadata.category, "conflict_beat");
  assert.equal(conflictBeat.metadata.intensity, "medium");
  assert.equal(conflictBeat.metadata.ruptureRisk, 7);
  assert.equal(conflictBeat.metadata.angstValue, 7);
  assert.equal(conflictBeat.metadata.chemistryValue, 6);
  assert.equal(conflictBeat.metadata.healingValue, 7);
  assert.equal(conflictBeat.metadata.pacingPressure, "medium");
  assert.deepEqual(conflictBeat.commonTriggers, []);
  assert.deepEqual(conflictBeat.milestoneMemories, []);
});

test("creates conflict style seed presets with rupture and repair metadata", () => {
  const conflictStyle = createConflictStyleSeedPreset({
    seed: "pursuer_conflict_style",
    label: "Pursuer Conflict Style",
    description: "Moves closer in conflict to restore connection quickly.",
    examples: [
      "Needs to talk immediately after an argument.",
      "Feels worse when the other person asks for space.",
      "Needs to talk immediately after an argument.",
    ],
    tags: ["conflict_style", "pursuer"],
    relatedSeeds: ["fear_of_abandonment"],
    oppositeSeeds: ["withdrawer_conflict_style"],
    romanceHooks: ["reassurance_after_argument"],
    scenarioHooks: ["post_argument_text_spiral"],
    dialoguePatterns: ["I need to know we are okay."],
    conflictType: "pursuer",
    emotionalCore: "Conflict feels like abandonment until connection returns.",
    hiddenFear: "Leaving the conversation means leaving the relationship.",
    hiddenNeed: "Reassurance that conflict does not erase love.",
    commonTriggers: ["silence_after_argument"],
    stressResponses: ["reassurance_seeking_response"],
    escalationPattern: ["detects_distance", "pushes_for_contact"],
    attachmentEffects: ["increases_reassurance_need"],
    intimacyEffects: ["may accelerate emotional honesty"],
    ruptureRisks: ["pressure_after_conflict"],
    likelyRepairStyles: ["verbal_reassurance_repair"],
    incompatibleRepairStyles: ["space_based_repair_without_return_promise"],
    associatedWounds: ["abandonment_wound"],
    associatedFears: ["fear_of_abandonment"],
    associatedDesires: ["desire_for_reliable_love"],
    associatedResponses: ["reassurance_seeking_response"],
    healthyVersion: ["asks directly for reassurance"],
    unhealthyVersion: ["pressures immediate resolution"],
    growthArcs: ["learns_space_is_not_abandonment"],
    routeGates: ["secure_conflict_gate"],
    metadata: {
      ruptureRisk: 12,
      repairDifficulty: 6,
      angstValue: 9,
      romanceValue: 8,
      healingPotential: 10,
      intensity: "high",
    },
  }) satisfies ConflictStyleSeed;

  assert.equal(conflictStyle.metadata.category, "conflict_style");
  assert.equal(conflictStyle.metadata.intensity, "high");
  assert.equal(conflictStyle.metadata.ruptureRisk, 10);
  assert.equal(conflictStyle.metadata.healingPotential, 10);
  assert.deepEqual(conflictStyle.examples, [
    "Needs to talk immediately after an argument.",
    "Feels worse when the other person asks for space.",
  ]);
  assert.equal(conflictStyle.conflictType, "pursuer");
  assert.equal(conflictStyle.hiddenNeed.includes("Reassurance"), true);
  assert.equal(
    conflictStyle.likelyRepairStyles.includes("verbal_reassurance_repair"),
    true,
  );
});

test("defaults conflict style metadata for broad catalogue generation", () => {
  const conflictStyle = createConflictStyleSeedPreset({
    seed: "repair_oriented_conflict_style",
    label: "Repair-Oriented Conflict Style",
    description: "Prioritises returning to honest repair over winning.",
    conflictType: "repair_oriented",
    emotionalCore: "The bond matters more than being right.",
    hiddenFear: "Pride will cost them the relationship.",
    hiddenNeed: "Mutual willingness to return and fix the rupture.",
  });

  assert.equal(conflictStyle.metadata.category, "conflict_style");
  assert.equal(conflictStyle.metadata.intensity, "medium");
  assert.equal(conflictStyle.metadata.ruptureRisk, 6);
  assert.equal(conflictStyle.metadata.repairDifficulty, 6);
  assert.equal(conflictStyle.metadata.angstValue, 7);
  assert.equal(conflictStyle.metadata.romanceValue, 6);
  assert.equal(conflictStyle.metadata.healingPotential, 7);
  assert.deepEqual(conflictStyle.commonTriggers, []);
  assert.deepEqual(conflictStyle.routeGates, []);
});
