import {
  createVocabularySeedPreset,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export type RelationshipStageTrajectory =
  | "ascent"
  | "rivalry"
  | "limbo"
  | "descent";

export interface RelationshipStageProgressionState {
  seed: string;
  label: string;
  trajectory: RelationshipStageTrajectory;
  description: string;
  behavior: string;
  metrics: readonly string[];
  promptGuidance: string;
  transitionSignals: readonly string[];
  blockedBy?: readonly string[];
  canTransitionTo: readonly string[];
  lifecycleState:
    | "potential"
    | "attraction"
    | "tension"
    | "pursuit"
    | "denial"
    | "attachment_formation"
    | "vulnerability"
    | "instability"
    | "obsession"
    | "devotional"
    | "domestic_integration"
    | "stable_partnership"
    | "plateau"
    | "drift"
    | "fracture"
    | "repair"
    | "reconnection"
    | "transformation"
    | "dissolution"
    | "post_attachment";
}

export const relationshipStageProgressionSemanticChain = [
  "Wound",
  "Fear",
  "Desire",
  "Trigger",
  "Response",
  "Relationship Dynamic",
  "Romance Trope",
  "Stage Progression State",
  "Conflict Beat",
  "Repair Beat",
  "Growth Arc",
  "Payoff Fantasy",
  "Relationship Identity",
] as const;

export const relationshipStageProgressionPresets = [
  "Strangers",
  "Acquaintances",
  "Casual Allies",
  "Confidants",
  "Unspoken Attraction",
  "Mutual Longing",
  "Confessed Affection",
  "Intimate Partners",
  "Active Adversaries",
  "Reluctant Partners",
  "Spiteful Fascination",
  "Frenemies",
  "Forbidden Partners",
  "Friendzoned",
  "Right Person, Wrong Time",
  "Situationship",
  "Unrequited",
  "Estranged",
  "Betrayed",
  "Indifferent",
  "Toxic Loop",
] as const;

export const relationshipStageProgressionStates = [
  {
    seed: "strangers",
    label: "Strangers",
    trajectory: "ascent",
    description:
      "A baseline state with no shared history, limited trust, and formal social distance.",
    behavior:
      "The character uses polite restraint, avoids assumptions, and relies on surface-level observation.",
    metrics: ["low_trust", "low_affection", "low_tension"],
    promptGuidance:
      "Keep tone guarded, courteous, and data-gathering; intimacy must be earned from context.",
    transitionSignals: ["recognition", "shared_context", "first_useful_exchange"],
    blockedBy: ["overfamiliarity", "unsupported_intimacy"],
    canTransitionTo: ["acquaintances", "active_adversaries"],
    lifecycleState: "potential",
  },
  {
    seed: "acquaintances",
    label: "Acquaintances",
    trajectory: "ascent",
    description:
      "A low-stakes recognition state where basic familiarity exists but social scripts still lead.",
    behavior:
      "The character remembers obvious details, makes careful small talk, and keeps boundaries visible.",
    metrics: ["basic_recognition", "low_trust", "surface_comfort"],
    promptGuidance:
      "Use mild familiarity without private claims, deep disclosure, or sudden romantic certainty.",
    transitionSignals: ["repeated_contact", "shared_task", "light_banter"],
    blockedBy: ["forced_confession", "instant_vulnerability"],
    canTransitionTo: ["casual_allies", "unspoken_attraction", "active_adversaries"],
    lifecycleState: "potential",
  },
  {
    seed: "casual_allies",
    label: "Casual Allies",
    trajectory: "ascent",
    description:
      "A practical cooperation state where mutual benefit creates basic comfort and low-pressure rapport.",
    behavior:
      "The character coordinates smoothly, jokes lightly, and shows small signs of reliability.",
    metrics: ["basic_trust", "shared_goal", "light_banter"],
    promptGuidance:
      "Let competence and repeated usefulness build warmth before deeper vulnerability appears.",
    transitionSignals: ["successful_teamwork", "private_joke", "small_reliability_proof"],
    canTransitionTo: ["confidants", "unspoken_attraction", "reluctant_partners"],
    lifecycleState: "attachment_formation",
  },
  {
    seed: "confidants",
    label: "Confidants",
    trajectory: "ascent",
    description:
      "A high-trust state where secrets, soft truths, and dropped social masks become possible.",
    behavior:
      "The character shares carefully held truths and treats the bond as emotionally meaningful.",
    metrics: ["high_trust", "emotional_safety", "private_disclosure"],
    promptGuidance:
      "Allow vulnerable honesty, but keep disclosures paced by prior trust and present safety.",
    transitionSignals: ["secret_shared", "emotional_repair", "protective_confidence"],
    canTransitionTo: ["unspoken_attraction", "mutual_longing", "intimate_partners", "betrayed"],
    lifecycleState: "vulnerability",
  },
  {
    seed: "unspoken_attraction",
    label: "Unspoken Attraction",
    trajectory: "ascent",
    description:
      "A charged awareness state where romantic possibility is present but unnamed.",
    behavior:
      "The character lingers, notices physical proximity, and lets subtext pull against restraint.",
    metrics: ["rising_tension", "romantic_subtext", "restraint"],
    promptGuidance:
      "Write tension through attention, pauses, and restraint rather than premature confession.",
    transitionSignals: ["lingering_glance", "near_touch", "jealousy_flicker"],
    blockedBy: ["instant_commitment", "unsupported_physical_escalation"],
    canTransitionTo: ["mutual_longing", "confessed_affection", "situationship"],
    lifecycleState: "attraction",
  },
  {
    seed: "mutual_longing",
    label: "Mutual Longing",
    trajectory: "ascent",
    description:
      "A high-tension state where attraction, jealousy, and proximity-seeking have become difficult to hide.",
    behavior:
      "The character speaks around the truth, watches for signs of return, and struggles to keep distance.",
    metrics: ["high_tension", "mutual_subtext", "proximity_seeking"],
    promptGuidance:
      "Let the unsaid shape pacing; longing should sharpen dialogue without skipping earned choice.",
    transitionSignals: ["near_confession", "protective_choice", "jealousy_admission"],
    canTransitionTo: ["confessed_affection", "forbidden_partners", "situationship", "betrayed"],
    lifecycleState: "pursuit",
  },
  {
    seed: "confessed_affection",
    label: "Confessed Affection",
    trajectory: "ascent",
    description:
      "A vulnerable confirmation state where feelings have been named and the bond is waiting for response or integration.",
    behavior:
      "The character is emotionally exposed, careful with pressure, and sensitive to the next answer.",
    metrics: ["named_feelings", "high_vulnerability", "decision_pressure"],
    promptGuidance:
      "Honor the confession as a route gate; do not erase the risk or force the other party's answer.",
    transitionSignals: ["clear_confession", "returned_affection", "choice_under_pressure"],
    canTransitionTo: ["intimate_partners", "right_person_wrong_time", "estranged"],
    lifecycleState: "vulnerability",
  },
  {
    seed: "intimate_partners",
    label: "Intimate Partners",
    trajectory: "ascent",
    description:
      "A stabilized bond state built on emotional transparency, affection, and shared future orientation.",
    behavior:
      "The character shows reliable intimacy, open care, physical ease, and long-range consideration.",
    metrics: ["high_trust", "stable_affection", "shared_future"],
    promptGuidance:
      "Write intimacy as lived familiarity, consistent respect, and mutual repair rather than static perfection.",
    transitionSignals: ["shared_future_mapping", "domestic_ritual", "secure_repair"],
    canTransitionTo: ["stable_partnership", "estranged", "toxic_loop", "betrayed"],
    lifecycleState: "stable_partnership",
  },
  {
    seed: "active_adversaries",
    label: "Active Adversaries",
    trajectory: "rivalry",
    description:
      "A hostile state where mutual dislike, aggressive boundaries, and zero trust dominate the interaction.",
    behavior:
      "The character mocks, challenges, withholds trust, and assumes motives must be tested.",
    metrics: ["zero_trust", "high_hostility", "hard_boundaries"],
    promptGuidance:
      "Keep conflict legible and accountable; do not mistake cruelty, fear, or coercion for romance.",
    transitionSignals: ["forced_alliance", "competence_recognition", "shared_threat"],
    blockedBy: ["instant_forgiveness", "unearned_softness"],
    canTransitionTo: ["reluctant_partners", "spiteful_fascination", "estranged"],
    lifecycleState: "tension",
  },
  {
    seed: "reluctant_partners",
    label: "Reluctant Partners",
    trajectory: "rivalry",
    description:
      "A forced cooperation state where practical necessity overrides distrust but friction remains active.",
    behavior:
      "The character complies with sarcasm, monitors the other person's choices, and protects against betrayal.",
    metrics: ["forced_cooperation", "low_trust", "high_monitoring"],
    promptGuidance:
      "Let shared work create evidence; warmth should arrive through competence, pressure, and repeated proof.",
    transitionSignals: ["mission_requires_trust", "unexpected_help", "shared_risk"],
    canTransitionTo: ["frenemies", "spiteful_fascination", "casual_allies"],
    lifecycleState: "tension",
  },
  {
    seed: "spiteful_fascination",
    label: "Spiteful Fascination",
    trajectory: "rivalry",
    description:
      "An enemies-to-lovers ignition state where attraction is high but respect and trust are still badly underdeveloped.",
    behavior:
      "The character notices too much, resents that attention, and turns attraction into sharper opposition.",
    metrics: ["high_attraction", "low_respect", "low_trust", "high_friction"],
    promptGuidance:
      "Write chemistry as unwanted attention and charged restraint; do not let attraction erase real harm.",
    transitionSignals: ["unwanted_protection", "argument_turns_honest", "near_touch_after_conflict"],
    canTransitionTo: ["frenemies", "mutual_longing", "toxic_loop"],
    lifecycleState: "tension",
  },
  {
    seed: "frenemies",
    label: "Frenemies",
    trajectory: "rivalry",
    description:
      "A competitive intimacy state that alternates between real support and sharp-tongued rivalry.",
    behavior:
      "The character helps while pretending not to care and competes while protecting the bond.",
    metrics: ["competitive_trust", "banter", "mixed_affection"],
    promptGuidance:
      "Balance bite with proof of care; rivalry should reveal intimacy instead of replacing it.",
    transitionSignals: ["private_support", "public_competition", "reluctant_defense"],
    canTransitionTo: ["mutual_longing", "confidants", "toxic_loop"],
    lifecycleState: "attachment_formation",
  },
  {
    seed: "forbidden_partners",
    label: "Forbidden Partners",
    trajectory: "rivalry",
    description:
      "A high-affection state where external rules, duty, factions, or danger force active resistance.",
    behavior:
      "The character wants closeness but calculates consequences, keeps exits, and chooses restraint under pressure.",
    metrics: ["high_affection", "external_barrier", "active_resistance"],
    promptGuidance:
      "Let the barrier remain real; romance should negotiate cost, secrecy, and agency instead of bypassing them.",
    transitionSignals: ["rule_breaking_choice", "secret_meeting", "duty_vs_love_choice"],
    blockedBy: ["barrier_erased_without_cost"],
    canTransitionTo: ["confessed_affection", "right_person_wrong_time", "intimate_partners"],
    lifecycleState: "denial",
  },
  {
    seed: "friendzoned",
    label: "Friendzoned",
    trajectory: "limbo",
    description:
      "A locked-platonic state where affection and trust are high but romantic escalation is actively refused.",
    behavior:
      "The character offers warmth, loyalty, and boundaries while redirecting romantic pressure.",
    metrics: ["high_affection", "high_trust", "romantic_lock"],
    promptGuidance:
      "Respect the boundary; provide non-romantic closeness and alternative connection rather than backsliding.",
    transitionSignals: ["boundary_named", "platonic_repair", "romantic_pressure_rejected"],
    blockedBy: ["ignored_boundary", "forced_romantic_escalation"],
    canTransitionTo: ["confidants", "estranged", "right_person_wrong_time"],
    lifecycleState: "plateau",
  },
  {
    seed: "right_person_wrong_time",
    label: "Right Person, Wrong Time",
    trajectory: "limbo",
    description:
      "A mutual-affection state where trauma, timing, duty, or plot pressure keeps emotional walls active.",
    behavior:
      "The character wants the bond but cannot safely choose it yet, so honesty arrives through restraint.",
    metrics: ["mutual_affection", "blocked_timing", "active_walls"],
    promptGuidance:
      "Make the restraint specific and consequential; do not use vague angst when a concrete barrier should guide pacing.",
    transitionSignals: ["almost_choice", "separation_for_safety", "unfinished_confession"],
    canTransitionTo: ["forbidden_partners", "confessed_affection", "estranged"],
    lifecycleState: "denial",
  },
  {
    seed: "situationship",
    label: "Situationship",
    trajectory: "limbo",
    description:
      "A stalled commitment state where attraction or intimacy has crossed a line but trust and definition lag behind.",
    behavior:
      "The character seeks closeness, avoids naming the bond, and reacts sharply when ambiguity is challenged.",
    metrics: ["high_attraction", "low_definition", "stalled_commitment"],
    promptGuidance:
      "Keep ambiguity emotionally costly; physical or romantic access should not replace clarity, consent, or repair.",
    transitionSignals: ["relationship_label_question", "jealousy_without_commitment", "boundary_due_to_ambiguity"],
    blockedBy: ["commitment_without_conversation", "ambiguity_romanticized_without_cost"],
    canTransitionTo: ["confessed_affection", "toxic_loop", "estranged"],
    lifecycleState: "instability",
  },
  {
    seed: "unrequited",
    label: "Unrequited",
    trajectory: "limbo",
    description:
      "A mismatched-feelings state where one side carries high affection while the other remains distant or unavailable.",
    behavior:
      "The character either protects an unreturned feeling quietly or sets firm boundaries around another person's desire.",
    metrics: ["asymmetric_affection", "uneven_tension", "boundary_pressure"],
    promptGuidance:
      "Preserve agency on both sides; longing may hurt, but it should not coerce reciprocation.",
    transitionSignals: ["rejected_confession", "one_sided_longing", "boundary_reaffirmed"],
    blockedBy: ["forced_reciprocation", "punishing_boundary"],
    canTransitionTo: ["friendzoned", "estranged", "mutual_longing"],
    lifecycleState: "plateau",
  },
  {
    seed: "estranged",
    label: "Estranged",
    trajectory: "descent",
    description:
      "A formerly close state now marked by distance, returned formality, avoidance, and heavy silence.",
    behavior:
      "The character speaks carefully, withholds old ease, and lets the absence of intimacy show.",
    metrics: ["history_present", "low_access", "cold_distance"],
    promptGuidance:
      "Let old familiarity haunt the distance; do not reset them to strangers or erase what was lost.",
    transitionSignals: ["formal_tone_returns", "missed_ritual", "avoidance_after_rupture"],
    canTransitionTo: ["repair", "betrayed", "indifferent"],
    lifecycleState: "drift",
  },
  {
    seed: "betrayed",
    label: "Betrayed",
    trajectory: "descent",
    description:
      "A rupture state where trust collapses suddenly while affection remains painfully alive.",
    behavior:
      "The character lashes out, questions motives, locks down emotionally, and struggles against wanting repair.",
    metrics: ["zero_trust", "high_affection", "high_wound_activation"],
    promptGuidance:
      "Hold the contradiction: hurt, anger, and attachment can coexist, but repair must require accountability.",
    transitionSignals: ["secret_revealed", "promise_broken", "trust_test_failed"],
    blockedBy: ["instant_forgiveness", "unearned_access"],
    canTransitionTo: ["estranged", "toxic_loop", "repair"],
    lifecycleState: "fracture",
  },
  {
    seed: "indifferent",
    label: "Indifferent",
    trajectory: "descent",
    description:
      "An emotional burnout state where investment, tension, and hope have collapsed into flat distance.",
    behavior:
      "The character offers minimal reaction, avoids emotional bids, and stops spending energy on the bond.",
    metrics: ["zero_investment", "low_tension", "emotional_burnout"],
    promptGuidance:
      "Write absence of investment, not secret longing; renewed care needs a major believable event.",
    transitionSignals: ["no_reaction_to_bid", "flat_reply", "no_longer_tracks_their_mood"],
    blockedBy: ["sudden_intense_longing", "unearned_reconnection"],
    canTransitionTo: ["post_attachment", "reconnection"],
    lifecycleState: "dissolution",
  },
  {
    seed: "toxic_loop",
    label: "Toxic Loop",
    trajectory: "descent",
    description:
      "A volatile cycle where attraction and hostility keep recreating brief intimacy followed by explosive rupture.",
    behavior:
      "The character swings between closeness and attack, using intensity as a substitute for trust.",
    metrics: ["high_attraction", "high_hostility", "low_repair", "cyclical_rupture"],
    promptGuidance:
      "Expose the pattern as unstable; route toward boundaries, accountability, or exit rather than glamorizing harm.",
    transitionSignals: ["make_up_fight_cycle", "jealousy_escalation", "repair_without_change"],
    blockedBy: ["harm_romanticized", "cycle_without_consequence"],
    canTransitionTo: ["repair", "estranged", "indifferent"],
    lifecycleState: "instability",
  },
] as const satisfies readonly RelationshipStageProgressionState[];

export const relationshipStageProgressionCategories = {
  ascent: relationshipStageProgressionStates
    .filter((state) => state.trajectory === "ascent")
    .map((state) => state.seed),
  rivalry: relationshipStageProgressionStates
    .filter((state) => state.trajectory === "rivalry")
    .map((state) => state.seed),
  limbo: relationshipStageProgressionStates
    .filter((state) => state.trajectory === "limbo")
    .map((state) => state.seed),
  descent: relationshipStageProgressionStates
    .filter((state) => state.trajectory === "descent")
    .map((state) => state.seed),
} as const;

export const relationshipStageProgressionTransitionMap = Object.freeze(
  Object.fromEntries(
    relationshipStageProgressionStates.map((state) => [
      state.seed,
      state.canTransitionTo,
    ]),
  ),
) as Readonly<Record<RelationshipStageProgressionState["seed"], readonly string[]>>;

export const relationshipStageProgressionLifecycleMap = Object.freeze(
  Object.fromEntries(
    relationshipStageProgressionStates.map((state) => [
      state.seed,
      state.lifecycleState,
    ]),
  ),
) as Readonly<Record<RelationshipStageProgressionState["seed"], RelationshipStageProgressionState["lifecycleState"]>>;

export type RelationshipStageKey = typeof relationshipStageProgressionStates[number]["seed"];

export type RelationshipStageMetricKey =
  | "affection"
  | "trust"
  | "romanticTension"
  | "respect"
  | "physicalAttraction"
  | "chatTurns";

export type RelationshipStageEventGateKey =
  | "gateFirstCrisis"
  | "gateSharedSecret"
  | "gateTheSeparation"
  | "gateMajorSacrifice";

export type RelationshipStageRuleKind =
  | "numeric_readiness"
  | "keyword_event_gate"
  | "emergency_override"
  | "decay";

export interface RelationshipStageSoftBuffer {
  all?: Partial<Record<RelationshipStageMetricKey, number>>;
  any?: Partial<Record<RelationshipStageMetricKey, number>>;
  allBelow?: Partial<Record<RelationshipStageMetricKey, number>>;
}

export interface RelationshipStageTransitionRule {
  id: string;
  from: RelationshipStageKey | readonly RelationshipStageKey[];
  to: RelationshipStageKey;
  kind: RelationshipStageRuleKind;
  softBuffer?: RelationshipStageSoftBuffer;
  eventGate?: RelationshipStageEventGateKey;
  keywordActionTriggers?: readonly string[];
  userInitiatedGate?: string;
  notes: string;
  blockedBehavior?: string;
}

export interface RelationshipStageTransitionInput {
  currentStage: RelationshipStageKey;
  metrics: Partial<Record<RelationshipStageMetricKey, number>>;
  eventGates?: Partial<Record<RelationshipStageEventGateKey, boolean>>;
  actionSignals?: readonly string[];
}

export interface RelationshipStageTransitionResult {
  currentStage: RelationshipStageKey;
  nextStage: RelationshipStageKey;
  transitioned: boolean;
  transitionId?: string;
  blockedBy?: "guard_clause" | "soft_buffer" | "event_gate" | "action_trigger";
  matchedActionTriggers: readonly string[];
  promptBehaviorHint: string;
}

export const relationshipStageEngineVariables = [
  "Affection",
  "Trust",
  "Romantic_Tension",
  "Respect",
  "Physical_Attraction",
  "Chat_Turns",
  "Current_Stage",
] as const;

export const relationshipStageWorldEventGates = {
  gateFirstCrisis: false,
  gateSharedSecret: false,
  gateTheSeparation: false,
  gateMajorSacrifice: false,
} as const satisfies Readonly<Record<RelationshipStageEventGateKey, boolean>>;

export const relationshipStageGuardClauses = [
  "A character cannot skip adjacent stages.",
  "If a metric calculation implies a multi-stage jump, settle on the immediate next logical node first.",
  "Numbers are a soft readiness buffer; keyword/action triggers and event gates execute narrative transitions.",
  "If a character cannot or should not perform an expected action, provide an alternative action route.",
] as const;

export const relationshipStageTransitionRules = [
  {
    id: "strangers_to_acquaintances",
    from: "strangers",
    to: "acquaintances",
    kind: "keyword_event_gate",
    softBuffer: { any: { trust: 3, affection: 20, chatTurns: 5 } },
    keywordActionTriggers: [
      "introduces_self",
      "shares_name",
      "formal_greeting",
      "asks_about_background",
    ],
    notes:
      "Recognition and basic social contact are enough to move from no context into surface familiarity.",
  },
  {
    id: "acquaintances_to_casual_allies",
    from: "acquaintances",
    to: "casual_allies",
    kind: "keyword_event_gate",
    softBuffer: { all: { trust: 3 } },
    eventGate: "gateFirstCrisis",
    keywordActionTriggers: [
      "fights_side_by_side",
      "offers_assistance",
      "devises_plan",
      "bandages_wound",
    ],
    notes:
      "The first crisis turns surface familiarity into practical cooperation only when the action proves reliability.",
    blockedBehavior:
      "If the crisis gate is closed, keep cooperation polite and provisional rather than alliance-coded.",
  },
  {
    id: "casual_allies_to_unspoken_attraction",
    from: "casual_allies",
    to: "unspoken_attraction",
    kind: "keyword_event_gate",
    softBuffer: { all: { romanticTension: 40, physicalAttraction: 5 } },
    eventGate: "gateSharedSecret",
    keywordActionTriggers: [
      "catches_eye",
      "lingering_look",
      "stands_close",
      "softens_tone",
      "comforts",
    ],
    notes:
      "Shared secrecy and visible attention let the relationship turn from useful alliance into charged awareness.",
    blockedBehavior:
      "If the shared-secret gate is closed, deflect romantic hints with friendly banter or practical focus.",
  },
  {
    id: "unspoken_attraction_to_mutual_longing",
    from: "unspoken_attraction",
    to: "mutual_longing",
    kind: "keyword_event_gate",
    softBuffer: { all: { romanticTension: 60, affection: 50 } },
    eventGate: "gateTheSeparation",
    keywordActionTriggers: [
      "confesses_worry",
      "embraces_tightly",
      "refuses_to_leave",
      "admits_fear_of_loss",
    ],
    notes:
      "A separation or near-loss turns subtext into undeniable longing when the action names fear or attachment.",
    blockedBehavior:
      "If the separation gate is closed, show internal tension but pull back before overt longing locks in.",
  },
  {
    id: "mutual_longing_to_confessed_affection",
    from: "mutual_longing",
    to: "confessed_affection",
    kind: "keyword_event_gate",
    softBuffer: { all: { romanticTension: 65, affection: 50 } },
    keywordActionTriggers: [
      "successful_confession",
      "intimate_event",
      "clear_romantic_choice",
    ],
    userInitiatedGate: "{{user}} initiates a successful confession/intimate event",
    notes:
      "The longing stage only advances once the feeling is acted on or named without taking away user agency.",
  },
  {
    id: "confessed_affection_to_intimate_partners",
    from: "confessed_affection",
    to: "intimate_partners",
    kind: "keyword_event_gate",
    softBuffer: { all: { trust: 8, affection: 75 } },
    keywordActionTriggers: [
      "returned_affection",
      "relationship_defined",
      "shared_future_named",
    ],
    notes:
      "A confession becomes partnership only after trust and affection have enough follow-through to stabilize it.",
  },
  {
    id: "mutual_longing_to_intimate_partners_event_gate",
    from: "mutual_longing",
    to: "intimate_partners",
    kind: "keyword_event_gate",
    softBuffer: { all: { trust: 7, affection: 70 } },
    eventGate: "gateMajorSacrifice",
    keywordActionTriggers: [
      "verbal_confession",
      "kiss",
      "pledges_loyalty",
      "chooses_them_over_external_goal",
    ],
    notes:
      "A major sacrifice can compress the confession and integration arc, but the guard clause still settles on confessed affection first.",
    blockedBehavior:
      "If the sacrifice gate is closed, the character may lean toward intimacy but should restrain themselves and name the unresolved cost.",
  },
  {
    id: "active_adversaries_to_spiteful_fascination",
    from: "active_adversaries",
    to: "spiteful_fascination",
    kind: "keyword_event_gate",
    softBuffer: { all: { romanticTension: 50, physicalAttraction: 6 } },
    keywordActionTriggers: [
      "charged_argument",
      "unwanted_attraction",
      "competence_recognition",
      "enemy_protects_user",
    ],
    notes:
      "Slow-burn hostility turns into fascination only when attraction is paired with a concrete moment of attention.",
  },
  {
    id: "spiteful_fascination_to_frenemies",
    from: "spiteful_fascination",
    to: "frenemies",
    kind: "keyword_event_gate",
    softBuffer: { all: { trust: 4, respect: 4 } },
    keywordActionTriggers: [
      "reluctant_respect",
      "private_support",
      "unexpected_help",
      "shared_enemy",
    ],
    notes:
      "Respect and a small proof of trust convert raw friction into competitive intimacy.",
  },
  {
    id: "frenemies_to_casual_allies",
    from: "frenemies",
    to: "casual_allies",
    kind: "keyword_event_gate",
    softBuffer: { all: { affection: 40, trust: 6 } },
    keywordActionTriggers: [
      "sincere_teamwork",
      "admits_respect",
      "chooses_cooperation",
    ],
    notes:
      "The rivalry route can rejoin the linear path once trust matters more than winning.",
  },
  {
    id: "betrayal_emergency_override",
    from: ["confidants", "mutual_longing", "intimate_partners"],
    to: "betrayed",
    kind: "emergency_override",
    softBuffer: { allBelow: { trust: 2 } },
    keywordActionTriggers: [
      "secret_revealed",
      "promise_broken",
      "trust_collapse",
      "protective_lie_exposed",
    ],
    notes:
      "A sudden trust collapse can override the current route, but only from stages that already had meaningful trust to rupture.",
  },
  {
    id: "betrayed_to_estranged",
    from: "betrayed",
    to: "estranged",
    kind: "decay",
    softBuffer: { allBelow: { affection: 10 } },
    keywordActionTriggers: [
      "affection_burnout",
      "repair_refused",
      "distance_chosen",
    ],
    notes:
      "When affection collapses after betrayal, the relationship cools into distance and returned formality.",
  },
  {
    id: "collapse_to_active_adversaries",
    from: [
      "strangers",
      "acquaintances",
      "casual_allies",
      "confidants",
      "unspoken_attraction",
      "mutual_longing",
      "confessed_affection",
      "intimate_partners",
      "reluctant_partners",
      "spiteful_fascination",
      "frenemies",
      "forbidden_partners",
      "friendzoned",
      "right_person_wrong_time",
      "situationship",
      "unrequited",
      "estranged",
      "betrayed",
      "indifferent",
      "toxic_loop",
    ],
    to: "active_adversaries",
    kind: "decay",
    softBuffer: { allBelow: { affection: -30, trust: 1 } },
    keywordActionTriggers: [
      "relationship_collapse",
      "open_hostility",
      "enemy_status_declared",
    ],
    notes:
      "A deep affection and trust collapse can route toward hostility, but the guard clause still chooses the closest legal node first.",
  },
] as const satisfies readonly RelationshipStageTransitionRule[];

export const relationshipStageEngineSystemNote = [
  "[State Engine: Keyword & Event Gates]",
  "At the end of each turn, evaluate whether {{user}}'s input contains a keyword/action matching the current stage transition.",
  "Numbers only determine readiness. A stage change requires a matching action trigger and any required event gate.",
  "If the soft buffer is too low, have {{char}} misunderstand, reject, or gently redirect the action.",
  "If the soft buffer is high but the event gate is locked, show internal tension while {{char}} restrains themself.",
  "Never skip non-adjacent stages; settle on the immediate next logical node first.",
] as const;

export function evaluateRelationshipStageTransition(
  input: RelationshipStageTransitionInput,
): RelationshipStageTransitionResult {
  const candidateRules = relationshipStageTransitionRules.filter((rule) =>
    ruleAppliesFrom(rule, input.currentStage),
  );

  for (const rule of candidateRules) {
    const softBufferMet = isSoftBufferMet(rule.softBuffer, input.metrics);
    if (!softBufferMet) {
      continue;
    }

    const matchedActionTriggers = getMatchedActionTriggers(
      rule.keywordActionTriggers ?? [],
      input.actionSignals ?? [],
    );
    if ((rule.keywordActionTriggers?.length ?? 0) > 0 && matchedActionTriggers.length === 0) {
      continue;
    }

    const eventGate = "eventGate" in rule ? rule.eventGate : undefined;
    if (eventGate && input.eventGates?.[eventGate] !== true) {
      return blockedTransition(input.currentStage, rule, "event_gate", matchedActionTriggers);
    }

    const guardedStage = settleOnAdjacentStage(input.currentStage, rule.to);
    if (guardedStage !== rule.to && guardedStage === input.currentStage) {
      return blockedTransition(input.currentStage, rule, "guard_clause", matchedActionTriggers);
    }

    return {
      currentStage: input.currentStage,
      nextStage: guardedStage,
      transitioned: guardedStage !== input.currentStage,
      transitionId: rule.id,
      matchedActionTriggers,
      promptBehaviorHint: guardedStage === rule.to
        ? rule.notes
        : `Guard clause applied. Move only to ${formatStageLabel(guardedStage)} before continuing toward ${formatStageLabel(rule.to)}.`,
    };
  }

  return {
    currentStage: input.currentStage,
    nextStage: input.currentStage,
    transitioned: false,
    blockedBy: "soft_buffer",
    matchedActionTriggers: [],
    promptBehaviorHint:
      "No route transition fired. Keep the current stage behavior and let the scene create clearer evidence.",
  };
}

export const RELATIONSHIP_STAGE_PROGRESSION_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  relationshipStageProgressionStates.map((state) =>
    createVocabularySeedPreset({
      seed: state.seed,
      label: state.label,
      description: state.description,
      examples: [state.behavior, state.promptGuidance],
      tags: [
        "relationship_stage_progression",
        "state_machine",
        "relationship_state",
        `trajectory:${state.trajectory}`,
        `lifecycle:${state.lifecycleState}`,
        ...state.metrics,
      ],
      relatedSeeds: [
        ...state.canTransitionTo,
        ...state.transitionSignals,
      ],
      oppositeSeeds: "blockedBy" in state ? state.blockedBy : [],
      romanceHooks: [
        `${state.seed}_state`,
        `${state.trajectory}_trajectory`,
        ...state.transitionSignals,
      ],
      scenarioHooks: [
        `${state.seed}_route_state`,
        ...state.transitionSignals,
      ],
      dialoguePatterns: [],
      metadata: {
        rarity: state.trajectory === "ascent" ? "common" : "uncommon",
        romanceValue: inferRomanceValue(state),
        conflictPotential: inferConflictPotential(state),
      },
    }),
  ),
) satisfies readonly VocabularySeedPreset[];

function inferRomanceValue(state: RelationshipStageProgressionState): number {
  if (state.seed === "indifferent" || state.seed === "active_adversaries") {
    return 3;
  }
  if (state.trajectory === "ascent") {
    return state.seed === "strangers" || state.seed === "acquaintances" ? 5 : 9;
  }
  if (state.trajectory === "limbo") {
    return 8;
  }
  if (state.trajectory === "rivalry") {
    return 7;
  }
  return 6;
}

function inferConflictPotential(state: RelationshipStageProgressionState): number {
  if (state.trajectory === "ascent") {
    return state.seed === "mutual_longing" || state.seed === "confessed_affection"
      ? 7
      : 4;
  }
  if (state.trajectory === "rivalry" || state.trajectory === "descent") {
    return state.seed === "indifferent" ? 5 : 9;
  }
  return 8;
}

function ruleAppliesFrom(
  rule: RelationshipStageTransitionRule,
  currentStage: RelationshipStageKey,
): boolean {
  return Array.isArray(rule.from)
    ? rule.from.includes(currentStage)
    : rule.from === currentStage;
}

function isSoftBufferMet(
  softBuffer: RelationshipStageSoftBuffer | undefined,
  metrics: Partial<Record<RelationshipStageMetricKey, number>>,
): boolean {
  if (!softBuffer) {
    return true;
  }

  const allMet = Object.entries(softBuffer.all ?? {}).every(([key, threshold]) =>
    compareMetricAtLeast(metrics[key as RelationshipStageMetricKey], threshold),
  );
  const anyEntries = Object.entries(softBuffer.any ?? {});
  const anyMet = anyEntries.length === 0
    ? true
    : anyEntries.some(([key, threshold]) =>
      compareMetricAtLeast(metrics[key as RelationshipStageMetricKey], threshold),
    );
  const allBelowMet = Object.entries(softBuffer.allBelow ?? {}).every(([key, threshold]) =>
    compareMetricAtMost(metrics[key as RelationshipStageMetricKey], threshold),
  );

  return allMet && anyMet && allBelowMet;
}

function compareMetricAtLeast(value: number | undefined, threshold: number): boolean {
  if (value === undefined) {
    return false;
  }

  return value >= threshold;
}

function compareMetricAtMost(value: number | undefined, threshold: number): boolean {
  if (value === undefined) {
    return false;
  }

  return value <= threshold;
}

function getMatchedActionTriggers(
  requiredTriggers: readonly string[],
  actionSignals: readonly string[],
): readonly string[] {
  const signalSet = new Set(actionSignals.map((signal) => normalizeSignal(signal)));
  return requiredTriggers.filter((trigger) => signalSet.has(normalizeSignal(trigger)));
}

function settleOnAdjacentStage(
  currentStage: RelationshipStageKey,
  requestedStage: RelationshipStageKey,
): RelationshipStageKey {
  if (currentStage === requestedStage) {
    return currentStage;
  }

  const neighbors = relationshipStageProgressionTransitionMap[currentStage] ?? [];
  if (neighbors.includes(requestedStage)) {
    return requestedStage;
  }

  return (neighbors[0] as RelationshipStageKey | undefined) ?? currentStage;
}

function blockedTransition(
  currentStage: RelationshipStageKey,
  rule: RelationshipStageTransitionRule,
  blockedBy: RelationshipStageTransitionResult["blockedBy"],
  matchedActionTriggers: readonly string[],
): RelationshipStageTransitionResult {
  return {
    currentStage,
    nextStage: currentStage,
    transitioned: false,
    transitionId: rule.id,
    blockedBy,
    matchedActionTriggers,
    promptBehaviorHint: rule.blockedBehavior ??
      "Readiness is present, but the required narrative gate is locked. Show restraint instead of advancing the state.",
  };
}

function normalizeSignal(signal: string): string {
  return signal.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function formatStageLabel(stage: RelationshipStageKey): string {
  return relationshipStageProgressionStates.find((state) => state.seed === stage)?.label ??
    stage;
}
