import {
  createRoutePhaseSeedPreset,
  createVocabularySeedPreset,
  type RoutePhaseSeed,
  type RoutePhaseSeedInput,
  type RoutePhaseSeedType,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export type RoutePhaseCategory =
  | "opening"
  | "attraction"
  | "contact"
  | "trust"
  | "vulnerability"
  | "reframing"
  | "investment"
  | "crisis"
  | "repair"
  | "confession"
  | "integration";

export const routePhaseSemanticChain = [
  "Wound",
  "Fear",
  "Desire",
  "Trigger",
  "Response",
  "Relationship Dynamic",
  "Romance Trope",
  "Route Phase",
  "Phase Gate",
  "Conflict Beat",
  "Repair Beat",
  "Milestone Memory",
  "Relationship Identity",
  "Growth Arc",
] as const;

export const routePhasePresets = [
  "Initial Dynamic",
  "Friction or Spark",
  "Repeated Contact",
  "Curiosity Phase",
  "Trust Testing Phase",
  "Softening Phase",
  "Vulnerability Leak",
  "Reframing Phase",
  "Emotional Investment",
  "Attachment Formation",
  "Denial Phase",
  "Mutual Pining Phase",
  "Crisis or Choice",
  "Rupture Phase",
  "Repair Phase",
  "Near-Loss Phase",
  "Confession or Escalation",
  "Commitment Choice",
  "Integration Phase",
  "Earned Happy Ending",
] as const;

export const routePhaseExpansionLogic = {
  wound_to_phase_pressure: {
    abandonment_wound: [
      "repeated_contact",
      "trust_testing_phase",
      "near_loss_phase",
    ],
    betrayal_wound: [
      "trust_testing_phase",
      "rupture_phase",
      "repair_phase",
    ],
    emotional_neglect_wound: [
      "softening_phase",
      "vulnerability_leak",
      "safe_to_need_phase",
    ],
    rejection_wound: [
      "denial_phase",
      "mutual_pining_phase",
      "confession_or_escalation",
    ],
  },
  fear_to_phase_blocker: {
    fear_of_abandonment: [
      "goodbye_gate",
      "distance_test_phase",
      "secure_return_gate",
    ],
    fear_of_vulnerability: [
      "vulnerability_leak",
      "truth_crisis_phase",
      "safe_to_be_seen_gate",
    ],
    fear_of_commitment: [
      "denial_phase",
      "commitment_choice",
      "relationship_identity_phase",
    ],
    fear_of_replacement: [
      "rival_attention_gate",
      "priority_shift_phase",
      "public_choice_phase",
    ],
  },
  desire_to_phase_pull: {
    desire_to_be_chosen: [
      "public_choice_phase",
      "commitment_choice",
      "chosen_without_competing_gate",
    ],
    desire_for_safety: [
      "safe_person_phase",
      "trust_testing_phase",
      "domestic_integration_phase",
    ],
    desire_for_devotion: [
      "mutual_pining_phase",
      "confession_or_escalation",
      "private_vow_phase",
    ],
    desire_for_understanding: [
      "reframing_phase",
      "enemy_to_person_phase",
      "truth_crisis_phase",
    ],
  },
  trope_to_phase_pattern: {
    slow_burn: [
      "initial_dynamic",
      "repeated_contact",
      "vulnerability_leak",
      "mutual_pining_phase",
      "confession_or_escalation",
    ],
    enemies_to_lovers: [
      "friction_or_spark",
      "forced_proximity_phase",
      "trust_testing_phase",
      "enemy_to_person_phase",
      "protective_choice_gate",
    ],
    fake_relationship: [
      "inciting_incident_phase",
      "fake_to_real_phase",
      "denial_phase",
      "public_choice_phase",
      "relationship_identity_phase",
    ],
    friends_to_lovers: [
      "established_baseline_phase",
      "friend_to_possible_love_phase",
      "mutual_pining_phase",
      "confession_or_escalation",
      "integration_phase",
    ],
  },
} as const;

export const routePhaseCategories = {
  opening: [
    "initial_dynamic",
    "first_meeting_phase",
    "established_baseline_phase",
    "inciting_incident_phase",
  ],
  attraction: [
    "friction_or_spark",
    "curiosity_phase",
    "chemistry_recognition_phase",
    "denial_phase",
  ],
  contact: [
    "repeated_contact",
    "forced_proximity_phase",
    "routine_building_phase",
    "shared_task_phase",
  ],
  trust: [
    "trust_testing_phase",
    "reliability_evidence_phase",
    "softening_phase",
    "safe_person_phase",
  ],
  vulnerability: [
    "vulnerability_leak",
    "secret_sharing_phase",
    "old_wound_reveal_phase",
    "safe_to_need_phase",
  ],
  reframing: [
    "reframing_phase",
    "enemy_to_person_phase",
    "friend_to_possible_love_phase",
    "fake_to_real_phase",
  ],
  investment: [
    "emotional_investment",
    "attachment_formation",
    "mutual_pining_phase",
    "priority_shift_phase",
  ],
  crisis: [
    "crisis_or_choice",
    "rupture_phase",
    "near_loss_phase",
    "truth_crisis_phase",
  ],
  repair: [
    "repair_phase",
    "accountability_phase",
    "trust_rebuilding_phase",
    "return_after_distance_phase",
  ],
  confession: [
    "confession_or_escalation",
    "commitment_choice",
    "public_choice_phase",
    "private_vow_phase",
  ],
  integration: [
    "integration_phase",
    "domestic_integration_phase",
    "relationship_identity_phase",
    "earned_happy_ending",
  ],
} as const satisfies Record<RoutePhaseCategory, readonly string[]>;

type RoutePhaseOverride = Partial<RoutePhaseSeedInput> & {
  label?: string;
};

const ROUTE_PHASE_OVERRIDES: Record<string, RoutePhaseOverride> = {
  initial_dynamic: {
    label: "Initial Dynamic",
    description:
      "The opening emotional arrangement between two characters before the romance route begins to actively move.",
    examples: [
      "They begin as strangers, rivals, friends, coworkers, protectors, or uneasy allies.",
      "The route establishes what feels safe, unsafe, attractive, forbidden, or unresolved.",
      "The first exchanges reveal the rules each character thinks they are living under.",
    ],
    tags: ["route_phase", "opening", "baseline", "romance_route"],
    relatedSeeds: [
      "relationship_dynamic",
      "first_meeting",
      "starting_conditions",
    ],
    oppositeSeeds: ["integration_phase", "earned_happy_ending"],
    romanceHooks: [
      "first_impression_with_subtext",
      "baseline_tension",
      "unspoken_interest",
    ],
    scenarioHooks: [
      "first_meeting_scene",
      "existing_relationship_setup",
      "inciting_contact",
    ],
    dialoguePatterns: [
      "I do not know what to make of you yet.",
      "That makes two of us.",
      "Then let us be careful.",
    ],
    phaseType: "opening",
    emotionalFunction:
      "Establishes the starting rules, power balance, emotional distance, and first route pressure.",
    phaseQuestion:
      "What is the bond before either person knows it is becoming a romance?",
    readinessSignals: [
      "clear_starting_dynamic",
      "visible_emotional_distance",
      "first_source_of_tension",
      "first_hint_of_want",
    ],
    blockingForces: [
      "stranger_distance",
      "status_gap",
      "mistrust",
      "existing_obligation",
    ],
    activatesWounds: [
      "abandonment_wound",
      "betrayal_wound",
      "rejection_wound",
    ],
    activatesFears: [
      "fear_of_vulnerability",
      "fear_of_rejection",
      "fear_of_being_used",
    ],
    activatesDesires: [
      "desire_to_be_seen",
      "desire_for_safety",
      "desire_for_respect",
    ],
    likelyTriggers: [
      "first_impression_trigger",
      "status_gap_trigger",
      "unexpected_kindness_trigger",
    ],
    likelyResponses: [
      "guarded_response",
      "curiosity_response",
      "masking_response",
    ],
    relationshipDynamics: [
      "rivals_dynamic",
      "safe_haven_dynamic",
      "protector_protected_dynamic",
    ],
    compatibleTropes: [
      "enemies_to_lovers",
      "slow_burn",
      "friends_to_lovers",
      "bodyguard_romance",
    ],
    conflictBeats: [
      "misread_first_intent",
      "status_gap_friction",
      "boundary_established",
    ],
    repairBeats: [
      "first_respectful_correction",
      "small_accountability",
      "early_boundary_respected",
    ],
    entryConditions: [
      "route_starts",
      "characters_share_scene",
      "initial_dynamic_named",
    ],
    exitConditions: [
      "spark_or_friction_visible",
      "reason_for_repeated_contact_exists",
      "first_emotional_rule_is_clear",
    ],
    routeGates: [
      "initial_dynamic_gate",
      "first_impression_gate",
      "first_boundary_gate",
    ],
    milestoneMemories: [
      "first_impression_memory",
      "first_meaningful_look",
      "first_rule_between_them",
    ],
    healthyVersion: [
      "starts_with_clear_agency",
      "tension_has_context",
      "boundaries_are_visible",
    ],
    unhealthyVersion: [
      "chemistry_replaces_character_logic",
      "power_gap_has_no_safeguards",
      "conflict_has_no_emotional_grounding",
    ],
    growthArcs: [
      "moves_from_assumption_to_curiosity",
      "recognizes_first_emotional_pattern",
      "allows_repeated_contact_to_matter",
    ],
    metadata: {
      category: "route_phase",
      order: 1,
      intensity: "low",
      burnPressure: "low",
      angstValue: 3,
      comfortValue: 4,
      chemistryValue: 5,
      healingValue: 4,
    },
  },
  vulnerability_leak: {
    label: "Vulnerability Leak",
    description:
      "A route phase where guarded emotion slips out before the character is ready to fully confess or explain it.",
    examples: [
      "A joke lands too close to the truth.",
      "A character admits fear, need, jealousy, or care and immediately tries to take it back.",
      "A quiet physical reaction reveals more than the spoken dialogue does.",
    ],
    tags: ["route_phase", "vulnerability", "truth_slip", "romance_route"],
    relatedSeeds: [
      "truth_slip_response",
      "fear_of_vulnerability",
      "safe_to_be_seen_gate",
    ],
    oppositeSeeds: ["emotional_shutdown_response", "composed_mask_response"],
    romanceHooks: [
      "accidental_confession",
      "soft_truth_after_joke",
      "guard_drops_for_one_second",
    ],
    scenarioHooks: [
      "late_night_conversation",
      "injury_reveals_care",
      "argument_turns_honest",
    ],
    dialoguePatterns: [
      "I did not mean to say that.",
      "Maybe you meant it anyway.",
      "Do not make me regret being honest.",
    ],
    phaseType: "vulnerability",
    emotionalFunction:
      "Lets the relationship witness a protected truth before full trust has stabilized.",
    phaseQuestion:
      "What slips out when the character cannot keep performing distance?",
    readinessSignals: [
      "repeated_contact_has_weight",
      "trust_has_some_evidence",
      "emotion_breaks_through_control",
      "the_other_person_notices_gently",
    ],
    blockingForces: [
      "fear_of_vulnerability",
      "fear_of_rejection",
      "pride",
      "old_wound_protection",
    ],
    activatesWounds: [
      "shame_wound",
      "betrayal_wound",
      "emotional_neglect_wound",
    ],
    activatesFears: [
      "fear_of_vulnerability",
      "fear_of_being_too_much",
      "fear_of_rejection",
    ],
    activatesDesires: [
      "desire_to_be_seen",
      "desire_for_safety",
      "desire_for_understanding",
    ],
    likelyTriggers: [
      "too_much_kindness_trigger",
      "direct_emotional_question_trigger",
      "injury_or_caretaking_trigger",
    ],
    likelyResponses: [
      "truth_slip_response",
      "humor_deflection_response",
      "emotional_withdrawal_response",
    ],
    relationshipDynamics: [
      "safe_vulnerability_dynamic",
      "safe_haven_dynamic",
      "challenge_growth_dynamic",
    ],
    compatibleTropes: [
      "slow_burn",
      "enemies_to_lovers",
      "hurt_comfort",
      "touch_starved_healing",
    ],
    conflictBeats: [
      "truth_immediately_denied",
      "partner_pushes_too_hard",
      "vulnerability_used_as_leverage",
    ],
    repairBeats: [
      "gentle_reassurance_repair",
      "boundary_respected_after_truth",
      "truth_held_safely",
    ],
    entryConditions: [
      "some_trust_exists",
      "emotional_pressure_has_built",
      "performance_mask_is_strained",
    ],
    exitConditions: [
      "truth_is_received",
      "new_trust_or_rupture_created",
      "relationship_cannot_return_to_old_distance",
    ],
    routeGates: [
      "first_vulnerability_leak_gate",
      "safe_to_be_seen_gate",
      "truth_held_safely_gate",
    ],
    milestoneMemories: [
      "first_accidental_truth_memory",
      "first_soft_aftercare_memory",
      "first_not_mocked_for_need_memory",
    ],
    healthyVersion: [
      "truth_is_received_without_pressure",
      "the_character_keeps_agency",
      "vulnerability_changes_the_bond",
    ],
    unhealthyVersion: [
      "truth_is_forced_out",
      "vulnerability_is_punished",
      "confession_pressure_replaces_care",
    ],
    growthArcs: [
      "learns_truth_can_survive_being_seen",
      "lets_one_person_witness_need",
      "moves_from_masking_to_named_feeling",
    ],
    metadata: {
      category: "route_phase",
      order: 5,
      intensity: "high",
      burnPressure: "high",
      angstValue: 8,
      comfortValue: 7,
      chemistryValue: 9,
      healingValue: 10,
    },
  },
};

export const ROUTE_PHASE_SEEDS = Object.freeze(
  getUniqueRoutePhaseIds().map((seed) =>
    createRoutePhaseSeedPreset(buildRoutePhaseInput(seed)),
  ),
) satisfies readonly RoutePhaseSeed[];

export const ROUTE_PHASE_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  ROUTE_PHASE_SEEDS.map((seed) =>
    createVocabularySeedPreset({
      seed: seed.seed,
      label: seed.label,
      description: [
        seed.description,
        `Emotional function: ${seed.emotionalFunction}`,
        `Phase question: ${seed.phaseQuestion}`,
      ].join(" "),
      examples: [
        ...seed.examples,
        ...seed.readinessSignals.slice(0, 2),
      ],
      tags: [
        "route_phase",
        seed.phaseType,
        ...seed.tags,
      ],
      relatedSeeds: [
        ...seed.relatedSeeds,
        ...seed.activatesWounds,
        ...seed.activatesFears,
        ...seed.activatesDesires,
        ...seed.relationshipDynamics,
        ...seed.compatibleTropes,
      ],
      oppositeSeeds: [
        ...seed.oppositeSeeds,
        ...seed.unhealthyVersion,
      ],
      romanceHooks: seed.romanceHooks,
      scenarioHooks: [
        ...seed.scenarioHooks,
        ...seed.likelyTriggers,
        ...seed.routeGates,
        ...seed.milestoneMemories,
        ...seed.conflictBeats,
        ...seed.repairBeats,
      ],
      dialoguePatterns: seed.dialoguePatterns,
      metadata: {
        rarity: seed.metadata.intensity === "low" ? "common" : "uncommon",
        romanceValue: seed.metadata.chemistryValue,
        conflictPotential: seed.metadata.angstValue,
      },
    }),
  ),
) satisfies readonly VocabularySeedPreset[];

export function getRoutePhaseSeedsByCategory(
  category: RoutePhaseCategory,
): readonly RoutePhaseSeed[] {
  const ids = new Set<string>(routePhaseCategories[category]);
  return ROUTE_PHASE_SEEDS.filter((seed) => ids.has(seed.seed));
}

export function getRoutePhaseSeedsByType(
  phaseType: RoutePhaseSeedType,
): readonly RoutePhaseSeed[] {
  return ROUTE_PHASE_SEEDS.filter((seed) => seed.phaseType === phaseType);
}

export function findRoutePhaseSeedBySeed(
  seedId: string,
): RoutePhaseSeed | undefined {
  const normalizedSeedId = seedId.trim().toLowerCase();
  return ROUTE_PHASE_SEEDS.find(
    (seed) => seed.seed.toLowerCase() === normalizedSeedId,
  );
}

function getUniqueRoutePhaseIds(): readonly string[] {
  return Array.from(new Set(Object.values(routePhaseCategories).flat()));
}

function buildRoutePhaseInput(seed: string): RoutePhaseSeedInput {
  const phaseType = inferRoutePhaseType(seed);
  const label = routePhaseLabel(seed);
  const category = inferRoutePhaseCategory(seed);
  const order = inferRoutePhaseOrder(category);
  const override = ROUTE_PHASE_OVERRIDES[seed] ?? {};
  const base: RoutePhaseSeedInput = {
    seed,
    label,
    description:
      "A romance route phase that marks what the relationship is emotionally ready to test, reveal, break, repair, or integrate.",
    examples: [
      "The phase gives the route a clear emotional job rather than a vague chapter label.",
      "It converts wounds, fears, desires, triggers, and responses into usable story movement.",
    ],
    tags: ["route_phase", phaseType, category, seed],
    relatedSeeds: defaultRelatedSeeds(phaseType),
    oppositeSeeds: defaultOppositeSeeds(phaseType),
    romanceHooks: defaultRomanceHooks(seed, phaseType),
    scenarioHooks: defaultScenarioHooks(seed, phaseType),
    dialoguePatterns: defaultDialoguePatterns(phaseType),
    phaseType,
    emotionalFunction: defaultEmotionalFunction(phaseType),
    phaseQuestion: defaultPhaseQuestion(phaseType),
    readinessSignals: defaultReadinessSignals(phaseType),
    blockingForces: defaultBlockingForces(phaseType),
    activatesWounds: defaultActivatesWounds(phaseType),
    activatesFears: defaultActivatesFears(phaseType),
    activatesDesires: defaultActivatesDesires(phaseType),
    likelyTriggers: defaultLikelyTriggers(phaseType),
    likelyResponses: defaultLikelyResponses(phaseType),
    relationshipDynamics: defaultRelationshipDynamics(phaseType),
    compatibleTropes: defaultCompatibleTropes(phaseType),
    conflictBeats: defaultConflictBeats(phaseType),
    repairBeats: defaultRepairBeats(phaseType),
    entryConditions: defaultEntryConditions(phaseType),
    exitConditions: defaultExitConditions(phaseType),
    routeGates: [`${seed}_gate`, `first_${seed}_gate`],
    milestoneMemories: [`${seed}_memory`, `${seed}_turning_point_memory`],
    healthyVersion: defaultHealthyVersion(phaseType),
    unhealthyVersion: defaultUnhealthyVersion(phaseType),
    growthArcs: defaultGrowthArcs(phaseType),
    metadata: {
      category: "route_phase",
      order,
      intensity: defaultIntensity(phaseType),
      burnPressure: defaultBurnPressure(phaseType),
      angstValue: defaultAngstValue(phaseType),
      comfortValue: defaultComfortValue(phaseType),
      chemistryValue: defaultChemistryValue(phaseType),
      healingValue: defaultHealingValue(phaseType),
    },
  };

  return {
    ...base,
    ...override,
    metadata: {
      ...base.metadata,
      ...override.metadata,
    },
  };
}

function inferRoutePhaseCategory(seed: string): RoutePhaseCategory {
  for (const [category, seeds] of Object.entries(routePhaseCategories)) {
    if ((seeds as readonly string[]).includes(seed)) {
      return category as RoutePhaseCategory;
    }
  }

  return "opening";
}

function inferRoutePhaseType(seed: string): RoutePhaseSeedType {
  const category = inferRoutePhaseCategory(seed);

  switch (category) {
    case "attraction":
      return "spark";
    case "opening":
    case "contact":
    case "trust":
    case "vulnerability":
    case "reframing":
    case "investment":
    case "crisis":
    case "repair":
    case "confession":
    case "integration":
      return category;
  }
}

function inferRoutePhaseOrder(category: RoutePhaseCategory): number {
  return [
    "opening",
    "attraction",
    "contact",
    "trust",
    "vulnerability",
    "reframing",
    "investment",
    "crisis",
    "repair",
    "confession",
    "integration",
  ].indexOf(category) + 1;
}

function routePhaseLabel(seed: string): string {
  const customLabels: Record<string, string> = {
    crisis_or_choice: "Crisis or Choice",
    friction_or_spark: "Friction or Spark",
    confession_or_escalation: "Confession or Escalation",
    near_loss_phase: "Near-Loss Phase",
  };

  return customLabels[seed] ?? seed
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
    .replace("To", "to")
    .replace("Or", "or");
}

function defaultRelatedSeeds(phaseType: RoutePhaseSeedType): readonly string[] {
  return [
    ...defaultActivatesWounds(phaseType),
    ...defaultActivatesFears(phaseType),
    ...defaultActivatesDesires(phaseType),
    ...defaultRelationshipDynamics(phaseType),
  ];
}

function defaultOppositeSeeds(phaseType: RoutePhaseSeedType): readonly string[] {
  switch (phaseType) {
    case "opening":
      return ["integration_phase", "earned_happy_ending"];
    case "spark":
      return ["emotional_flatness", "no_visible_tension"];
    case "contact":
      return ["permanent_separation", "no_shared_context"];
    case "trust":
      return ["betrayal_without_repair", "inconsistent_presence"];
    case "vulnerability":
      return ["composed_mask_response", "emotional_shutdown_response"];
    case "reframing":
      return ["fixed_assumption", "refusal_to_reconsider"];
    case "investment":
      return ["casual_detachment", "low_stakes_connection"];
    case "crisis":
      return ["avoided_choice", "conflict_without_consequence"];
    case "repair":
      return ["no_accountability", "permanent_rupture"];
    case "confession":
      return ["denial_phase", "unspoken_feelings"];
    case "integration":
      return ["relationship_instability", "hidden_commitment"];
    case "aftermath":
      return ["unprocessed_crisis", "no_growth"];
  }
}

function defaultRomanceHooks(
  seed: string,
  phaseType: RoutePhaseSeedType,
): readonly string[] {
  return [
    `${seed}_romance_hook`,
    `${phaseType}_route_pressure`,
    `${phaseType}_intimacy_gate`,
  ];
}

function defaultScenarioHooks(
  seed: string,
  phaseType: RoutePhaseSeedType,
): readonly string[] {
  switch (phaseType) {
    case "opening":
      return ["first_scene_setup", "inciting_contact", `${seed}_opener`];
    case "spark":
      return ["argument_with_subtext", "chemistry_notice", `${seed}_scene`];
    case "contact":
      return ["shared_task", "forced_return", `${seed}_routine`];
    case "trust":
      return ["small_reliability_test", "kept_promise", `${seed}_evidence`];
    case "vulnerability":
      return ["late_night_truth", "care_after_injury", `${seed}_truth_slip`];
    case "reframing":
      return ["new_information", "old_assumption_breaks", `${seed}_turn`];
    case "investment":
      return ["priority_shift", "almost_confession", `${seed}_pining`];
    case "crisis":
      return ["choice_under_pressure", "truth_crisis", `${seed}_rupture`];
    case "repair":
      return ["accountability_scene", "return_after_distance", `${seed}_repair`];
    case "confession":
      return ["explicit_choice", "public_claim", `${seed}_confession`];
    case "integration":
      return ["shared_home_ritual", "relationship_identity", `${seed}_payoff`];
    case "aftermath":
      return ["after_crisis_quiet", "new_normal", `${seed}_aftercare`];
  }
}

function defaultDialoguePatterns(phaseType: RoutePhaseSeedType): readonly string[] {
  switch (phaseType) {
    case "opening":
      return ["I do not know what to make of you yet.", "Then look closer."];
    case "spark":
      return ["You enjoy arguing with me.", "I enjoy when you keep up."];
    case "contact":
      return ["We keep ending up in the same room.", "Maybe stop calling it an accident."];
    case "trust":
      return ["You came back.", "I said I would."];
    case "vulnerability":
      return ["I did not mean to say that.", "Maybe you meant it anyway."];
    case "reframing":
      return ["I was wrong about you.", "That sounded painful. Try it again."];
    case "investment":
      return ["This matters more than it should.", "Then stop pretending it does not."];
    case "crisis":
      return ["Choose now.", "I already know what I cannot lose."];
    case "repair":
      return ["I am not asking you to forget.", "Good. I need you to understand."];
    case "confession":
      return ["Tell me this is real.", "It has been real longer than I knew how to say."];
    case "integration":
      return ["So what are we now?", "Something we both chose."];
    case "aftermath":
      return ["Everything is different.", "Then we learn the new shape together."];
  }
}

function defaultEmotionalFunction(phaseType: RoutePhaseSeedType): string {
  switch (phaseType) {
    case "opening":
      return "Establishes the starting emotional rules and the first pressure point.";
    case "spark":
      return "Turns attention into tension, curiosity, chemistry, or denial.";
    case "contact":
      return "Creates repeated evidence that the relationship cannot stay theoretical.";
    case "trust":
      return "Tests whether care, return, and respect are reliable enough to matter.";
    case "vulnerability":
      return "Lets protected truth appear before full emotional safety is complete.";
    case "reframing":
      return "Forces one or both characters to reinterpret who the other person is.";
    case "investment":
      return "Marks the point where emotional stakes become harder to deny.";
    case "crisis":
      return "Presses the route into a choice, rupture, near-loss, or truth demand.";
    case "repair":
      return "Requires accountability, changed behavior, and renewed emotional safety.";
    case "confession":
      return "Turns subtext into direct choice, escalation, or commitment language.";
    case "integration":
      return "Gives the relationship a stable identity, rhythm, and future-facing shape.";
    case "aftermath":
      return "Processes what changed and lets the route settle into a new normal.";
  }
}

function defaultPhaseQuestion(phaseType: RoutePhaseSeedType): string {
  switch (phaseType) {
    case "opening":
      return "What is the bond before the romance route starts moving?";
    case "spark":
      return "What makes them notice each other as emotionally relevant?";
    case "contact":
      return "What keeps pulling them back into shared space?";
    case "trust":
      return "What proves the other person can be relied on?";
    case "vulnerability":
      return "What truth escapes before it is fully safe to say?";
    case "reframing":
      return "What new evidence changes the meaning of the bond?";
    case "investment":
      return "What makes walking away start to feel costly?";
    case "crisis":
      return "What choice forces the hidden stakes into the open?";
    case "repair":
      return "What must be understood, changed, or honored for trust to return?";
    case "confession":
      return "What needs to be said or chosen directly?";
    case "integration":
      return "How does love become a lived relationship instead of a route pressure?";
    case "aftermath":
      return "What remains after the choice, rupture, or confession changes them?";
  }
}

function defaultReadinessSignals(phaseType: RoutePhaseSeedType): readonly string[] {
  switch (phaseType) {
    case "opening":
      return ["starting_dynamic_clear", "first_boundary_visible"];
    case "spark":
      return ["attention_lingers", "tension_has_subtext"];
    case "contact":
      return ["shared_context_exists", "return_has_pattern"];
    case "trust":
      return ["promise_kept", "small_care_received"];
    case "vulnerability":
      return ["mask_strained", "truth_nearly_spoken"];
    case "reframing":
      return ["old_assumption_challenged", "new_respect_forms"];
    case "investment":
      return ["priority_shift_visible", "absence_has_weight"];
    case "crisis":
      return ["stakes_are_named", "avoidance_no_longer_works"];
    case "repair":
      return ["harm_acknowledged", "return_is_possible"];
    case "confession":
      return ["subtext_too_obvious", "choice_pressure_peaks"];
    case "integration":
      return ["commitment_has_language", "daily_life_can_hold_the_bond"];
    case "aftermath":
      return ["crisis_has_passed", "new_rules_are_needed"];
  }
}

function defaultBlockingForces(phaseType: RoutePhaseSeedType): readonly string[] {
  switch (phaseType) {
    case "opening":
      return ["unknown_history", "social_distance"];
    case "spark":
      return ["pride", "mistrust", "misread_attraction"];
    case "contact":
      return ["external_obligations", "avoidance"];
    case "trust":
      return ["old_betrayal", "inconsistent_presence"];
    case "vulnerability":
      return ["fear_of_rejection", "shame", "habitual_masking"];
    case "reframing":
      return ["fixed_story", "loyalty_conflict"];
    case "investment":
      return ["denial", "fear_of_commitment"];
    case "crisis":
      return ["external_threat", "truth_pressure", "near_loss"];
    case "repair":
      return ["defensiveness", "wounded_pride", "unmet_accountability"];
    case "confession":
      return ["timing_fear", "public_consequence", "rejection_risk"];
    case "integration":
      return ["old_roles", "social_pressure", "future_uncertainty"];
    case "aftermath":
      return ["emotional_exhaustion", "unprocessed_change"];
  }
}

function defaultActivatesWounds(phaseType: RoutePhaseSeedType): readonly string[] {
  switch (phaseType) {
    case "trust":
    case "repair":
      return ["betrayal_wound", "abandonment_wound"];
    case "vulnerability":
      return ["shame_wound", "emotional_neglect_wound"];
    case "crisis":
      return ["abandonment_wound", "control_wound"];
    default:
      return ["rejection_wound", "abandonment_wound"];
  }
}

function defaultActivatesFears(phaseType: RoutePhaseSeedType): readonly string[] {
  switch (phaseType) {
    case "confession":
    case "investment":
      return ["fear_of_rejection", "fear_of_commitment"];
    case "vulnerability":
      return ["fear_of_vulnerability", "fear_of_being_too_much"];
    case "trust":
    case "repair":
      return ["fear_of_betrayal", "fear_of_abandonment"];
    default:
      return ["fear_of_vulnerability", "fear_of_rejection"];
  }
}

function defaultActivatesDesires(phaseType: RoutePhaseSeedType): readonly string[] {
  switch (phaseType) {
    case "integration":
    case "aftermath":
      return ["desire_for_home", "desire_for_stable_love"];
    case "confession":
      return ["desire_to_be_chosen", "desire_for_devotion"];
    case "trust":
    case "repair":
      return ["desire_for_safety", "desire_for_reliable_love"];
    default:
      return ["desire_to_be_seen", "desire_for_understanding"];
  }
}

function defaultLikelyTriggers(phaseType: RoutePhaseSeedType): readonly string[] {
  switch (phaseType) {
    case "spark":
      return ["rival_challenge", "unexpected_kindness_trigger"];
    case "contact":
      return ["forced_proximity_trigger", "shared_task_trigger"];
    case "trust":
      return ["broken_promise_trigger", "kept_promise_trigger"];
    case "vulnerability":
      return ["too_much_kindness_trigger", "direct_emotional_question_trigger"];
    case "crisis":
      return ["near_loss_trigger", "truth_crisis_trigger"];
    case "repair":
      return ["return_after_distance_trigger", "accountability_trigger"];
    default:
      return ["emotional_distance_trigger", "romantic_ambiguity_trigger"];
  }
}

function defaultLikelyResponses(phaseType: RoutePhaseSeedType): readonly string[] {
  switch (phaseType) {
    case "spark":
      return ["defensive_anger_response", "humor_deflection_response"];
    case "trust":
      return ["trust_testing_response", "reassurance_seeking_response"];
    case "vulnerability":
      return ["truth_slip_response", "emotional_withdrawal_response"];
    case "crisis":
      return ["panic_spiral_response", "protective_response"];
    case "repair":
      return ["apology_response", "changed_behavior_response"];
    case "confession":
      return ["vulnerability_repair_response", "devotional_response"];
    default:
      return ["guarded_response", "curiosity_response"];
  }
}

function defaultRelationshipDynamics(phaseType: RoutePhaseSeedType): readonly string[] {
  switch (phaseType) {
    case "spark":
      return ["rivals_dynamic", "challenge_growth_dynamic"];
    case "trust":
    case "repair":
      return ["safe_haven_dynamic", "learning_to_trust_dynamic"];
    case "vulnerability":
      return ["safe_vulnerability_dynamic", "caretaker_receiver_dynamic"];
    case "confession":
    case "integration":
      return ["chosen_person_dynamic", "devotional_dynamic"];
    default:
      return ["safe_haven_dynamic", "equal_partners_dynamic"];
  }
}

function defaultCompatibleTropes(phaseType: RoutePhaseSeedType): readonly string[] {
  switch (phaseType) {
    case "spark":
      return ["enemies_to_lovers", "rivals_to_lovers"];
    case "contact":
      return ["forced_proximity", "fake_relationship"];
    case "vulnerability":
      return ["slow_burn", "hurt_comfort", "touch_starved_healing"];
    case "repair":
      return ["second_chance_romance", "trust_rebuild_romance"];
    case "confession":
      return ["mutual_pining", "friends_to_lovers"];
    default:
      return ["slow_burn", "safe_person_romance"];
  }
}

function defaultConflictBeats(phaseType: RoutePhaseSeedType): readonly string[] {
  switch (phaseType) {
    case "spark":
      return ["misread_motive", "argument_with_subtext"];
    case "trust":
      return ["trust_test_failed", "reliability_doubted"];
    case "vulnerability":
      return ["truth_immediately_denied", "partner_pushes_too_hard"];
    case "crisis":
      return ["choice_under_pressure", "rupture_or_near_loss"];
    case "repair":
      return ["defensiveness_blocks_accountability", "old_wound_returns"];
    default:
      return ["emotional_rule_challenged", "distance_misread"];
  }
}

function defaultRepairBeats(phaseType: RoutePhaseSeedType): readonly string[] {
  switch (phaseType) {
    case "trust":
      return ["kept_promise_repair", "reliable_return_repair"];
    case "vulnerability":
      return ["gentle_reassurance_repair", "truth_held_safely"];
    case "crisis":
    case "repair":
      return ["accountability_repair", "changed_behavior_response"];
    case "confession":
      return ["choice_named_clearly", "fear_received_gently"];
    default:
      return ["boundary_respected", "small_reassurance_repair"];
  }
}

function defaultEntryConditions(phaseType: RoutePhaseSeedType): readonly string[] {
  switch (phaseType) {
    case "opening":
      return ["route_starts", "characters_share_scene"];
    case "spark":
      return ["initial_dynamic_exists", "attention_has_landed"];
    case "contact":
      return ["reason_to_return_exists", "shared_context_is_active"];
    case "trust":
      return ["repeated_contact_has_pattern", "care_can_be_tested"];
    case "vulnerability":
      return ["trust_has_some_evidence", "mask_is_strained"];
    case "reframing":
      return ["new_information_arrives", "old_assumption_wobbles"];
    case "investment":
      return ["vulnerability_or_trust_has_mattered", "absence_has_weight"];
    case "crisis":
      return ["stakes_are_too_high_to_ignore", "avoidance_fails"];
    case "repair":
      return ["rupture_or_harm_has_occurred", "return_is_possible"];
    case "confession":
      return ["subtext_has_peaked", "choice_can_no_longer_be_delayed"];
    case "integration":
      return ["relationship_has_been_chosen", "future_shape_is_needed"];
    case "aftermath":
      return ["major_choice_has_resolved", "new_normal_is_forming"];
  }
}

function defaultExitConditions(phaseType: RoutePhaseSeedType): readonly string[] {
  switch (phaseType) {
    case "opening":
      return ["spark_or_friction_visible", "reason_for_contact_exists"];
    case "spark":
      return ["chemistry_is_visible", "denial_or_curiosity_escalates"];
    case "contact":
      return ["shared_pattern_forms", "trust_can_be_tested"];
    case "trust":
      return ["reliability_has_evidence", "guard_begins_to_soften"];
    case "vulnerability":
      return ["truth_is_received_or_rejected", "old_distance_changes"];
    case "reframing":
      return ["new_understanding_changes_choices", "respect_deepens"];
    case "investment":
      return ["priority_shift_is_visible", "loss_would_hurt"];
    case "crisis":
      return ["choice_has_consequence", "rupture_or_escalation_occurs"];
    case "repair":
      return ["accountability_lands", "trust_path_reopens"];
    case "confession":
      return ["choice_is_spoken", "relationship_identity_begins"];
    case "integration":
      return ["relationship_has_rhythm", "future_is_imagined"];
    case "aftermath":
      return ["new_rules_are_named", "growth_is_internalized"];
  }
}

function defaultHealthyVersion(phaseType: RoutePhaseSeedType): readonly string[] {
  switch (phaseType) {
    case "crisis":
      return ["stakes_are_real_but_agency_remains", "choice_has_accountability"];
    case "repair":
      return ["harm_is_named", "changed_behavior_follows_words"];
    case "confession":
      return ["choice_is_clear", "no_one_is_forced_to_answer_with_fear"];
    default:
      return ["agency_remains_visible", "emotion_has_context", "repair_is_possible"];
  }
}

function defaultUnhealthyVersion(phaseType: RoutePhaseSeedType): readonly string[] {
  switch (phaseType) {
    case "spark":
      return ["cruelty_mistaken_for_chemistry", "boundary_testing_without_care"];
    case "crisis":
      return ["pain_created_only_for_intensity", "choice_used_as_coercion"];
    case "repair":
      return ["apology_without_change", "forgiveness_demanded"];
    default:
      return ["route_pressure_replaces_character_logic", "agency_is_flattened"];
  }
}

function defaultGrowthArcs(phaseType: RoutePhaseSeedType): readonly string[] {
  switch (phaseType) {
    case "opening":
      return ["moves_from_assumption_to_curiosity"];
    case "spark":
      return ["recognizes_tension_without_weaponizing_it"];
    case "contact":
      return ["lets_repeated_presence_matter"];
    case "trust":
      return ["accepts_reliability_as_evidence"];
    case "vulnerability":
      return ["lets_truth_survive_being_seen"];
    case "reframing":
      return ["updates_old_story_with_new_evidence"];
    case "investment":
      return ["admits_the_bond_has_stakes"];
    case "crisis":
      return ["chooses_from_values_instead_of_fear"];
    case "repair":
      return ["learns_accountability_can_restore_safety"];
    case "confession":
      return ["names_want_without_erasing_choice"];
    case "integration":
      return ["builds_a_relationship_identity_that_can_hold_daily_life"];
    case "aftermath":
      return ["internalizes_the_new_secure_pattern"];
  }
}

function defaultIntensity(phaseType: RoutePhaseSeedType): "low" | "medium" | "high" | "peak" {
  switch (phaseType) {
    case "opening":
    case "contact":
      return "low";
    case "spark":
    case "trust":
    case "reframing":
    case "investment":
      return "medium";
    case "vulnerability":
    case "repair":
    case "confession":
      return "high";
    case "crisis":
      return "peak";
    case "integration":
    case "aftermath":
      return "medium";
  }
}

function defaultBurnPressure(phaseType: RoutePhaseSeedType): "low" | "medium" | "high" {
  return phaseType === "crisis" ||
    phaseType === "confession" ||
    phaseType === "vulnerability"
    ? "high"
    : phaseType === "opening" || phaseType === "contact"
      ? "low"
      : "medium";
}

function defaultAngstValue(phaseType: RoutePhaseSeedType): number {
  switch (phaseType) {
    case "crisis":
      return 10;
    case "vulnerability":
    case "repair":
    case "confession":
      return 8;
    case "spark":
    case "trust":
    case "investment":
      return 6;
    default:
      return 4;
  }
}

function defaultComfortValue(phaseType: RoutePhaseSeedType): number {
  switch (phaseType) {
    case "trust":
    case "repair":
    case "integration":
    case "aftermath":
      return 8;
    case "vulnerability":
    case "confession":
      return 7;
    default:
      return 5;
  }
}

function defaultChemistryValue(phaseType: RoutePhaseSeedType): number {
  switch (phaseType) {
    case "spark":
    case "investment":
    case "confession":
      return 9;
    case "vulnerability":
    case "crisis":
      return 8;
    default:
      return 6;
  }
}

function defaultHealingValue(phaseType: RoutePhaseSeedType): number {
  switch (phaseType) {
    case "repair":
    case "integration":
    case "aftermath":
      return 9;
    case "trust":
    case "vulnerability":
      return 8;
    default:
      return 6;
  }
}
