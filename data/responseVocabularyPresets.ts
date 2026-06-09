import {
  createResponseSeedPreset,
  createVocabularySeedPreset,
  type ResponseSeed,
  type ResponseSeedIntensity,
  type ResponseSeedPacingPressure,
  type ResponseSeedType,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export type ResponseCategory =
  | "fight"
  | "flight"
  | "freeze"
  | "fawn"
  | "shutdown"
  | "masking"
  | "humor"
  | "control"
  | "attachment"
  | "repair";

type ResponseProfile = {
  responseType: ResponseSeedType;
  coreImpulse: string;
  hiddenFear: string;
  hiddenNeed: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  activators: readonly string[];
  earlySignals: readonly string[];
  escalationPattern: readonly string[];
  outwardBehaviors: readonly string[];
  internalExperience: readonly string[];
  bodyLanguage: readonly string[];
  attachmentEffects: readonly string[];
  intimacyEffects: readonly string[];
  conflictEffects: readonly string[];
  misreadByOthersAs: readonly string[];
  reassuranceNeeds: readonly string[];
  repairMethods: readonly string[];
  growthArcs: readonly string[];
  compatibleWounds: readonly string[];
  compatibleFears: readonly string[];
  compatibleDesires: readonly string[];
  metadata: {
    intensity: ResponseSeedIntensity;
    romanceValue: number;
    angstValue: number;
    conflictPotential: number;
    healingValue: number;
    pacingPressure: ResponseSeedPacingPressure;
  };
};

type ResponseOverride = Partial<ResponseProfile> & {
  label?: string;
  description?: string;
  routeGates?: readonly string[];
};

export const responseSeedPresets = [
  "Fight Response",
  "Flight Response",
  "Freeze Response",
  "Fawn Response",
  "Shutdown Response",
  "Panic Spiral Response",
  "Emotional Withdrawal Response",
  "Humor Deflection Response",
  "Intellectualizing Response",
  "People-Pleasing Response",
  "Caretaking Response",
  "Control Response",
  "Hyper-Independence Response",
  "Reassurance-Seeking Response",
  "Cling Response",
  "Trust-Testing Response",
  "Self-Sabotage Response",
  "Masking Response",
  "Protective Response",
  "Repair-Oriented Response",
] as const;

export const responseCategories = {
  fight: [
    "defensive_anger_response",
    "sharp_tongue_response",
    "argumentative_response",
    "protective_rage_response",
  ],
  flight: [
    "avoidance_response",
    "escape_response",
    "distance_seeking_response",
    "ghosting_response",
  ],
  freeze: [
    "freeze_response",
    "goes_still_response",
    "speechless_response",
    "decision_paralysis_response",
  ],
  fawn: [
    "people_pleasing_response",
    "appeasement_response",
    "over_apologizing_response",
    "self_erasure_response",
  ],
  shutdown: [
    "emotional_shutdown_response",
    "numb_response",
    "silent_response",
    "dissociation_like_response",
  ],
  masking: [
    "smiling_when_hurt_response",
    "performance_response",
    "composed_mask_response",
    "acts_fine_response",
  ],
  humor: [
    "humor_deflection_response",
    "sarcasm_response",
    "self_deprecating_response",
    "teasing_to_avoid_feeling_response",
  ],
  control: [
    "planning_response",
    "hypervigilance_response",
    "routine_control_response",
    "boundary_rigidity_response",
  ],
  attachment: [
    "reassurance_seeking_response",
    "cling_response",
    "testing_love_response",
    "pull_away_after_softness_response",
  ],
  repair: [
    "apology_response",
    "acts_of_service_repair_response",
    "vulnerability_repair_response",
    "changed_behavior_response",
  ],
} as const satisfies Record<ResponseCategory, readonly string[]>;

export const responseExpansionLogic = {
  wound_to_response: {
    abandonment_wound: [
      "reassurance_seeking_response",
      "cling_response",
      "preemptive_withdrawal_response",
    ],
    betrayal_wound: [
      "suspicion_response",
      "trust_testing_response",
      "emotional_lockdown_response",
    ],
    inadequacy_wound: [
      "overachievement_response",
      "people_pleasing_response",
      "self_deprecating_response",
    ],
    humiliation_wound: [
      "defensive_anger_response",
      "masking_response",
      "avoid_visibility_response",
    ],
    control_wound: [
      "rebellion_response",
      "distance_seeking_response",
      "boundary_rigidity_response",
    ],
  },
  fear_to_response: {
    fear_of_abandonment: [
      "cling_response",
      "panic_spiral_response",
      "testing_love_response",
    ],
    fear_of_rejection: [
      "avoid_confession_response",
      "people_pleasing_response",
      "self_sabotage_response",
    ],
    fear_of_vulnerability: [
      "humor_deflection_response",
      "intellectualizing_response",
      "emotional_withdrawal_response",
    ],
    fear_of_dependency: [
      "hyper_independence_response",
      "refusing_help_response",
      "pull_away_after_care_response",
    ],
  },
  desire_to_response: {
    desire_to_be_chosen: [
      "priority_testing_response",
      "jealousy_suppression_response",
      "devotional_response",
    ],
    desire_for_safety: [
      "control_response",
      "routine_seeking_response",
      "protective_response",
    ],
    desire_to_be_seen: [
      "vulnerability_leak_response",
      "attention_seeking_response",
      "truth_slip_response",
    ],
    desire_for_autonomy: [
      "boundary_assertion_response",
      "distance_response",
      "rebellion_response",
    ],
  },
} as const;

export const responseSemanticChain = [
  "wound",
  "fear",
  "desire",
  "trigger",
  "response",
  "consequence",
  "repair",
  "growth",
] as const;

export const abandonmentResponseChainExample = Object.freeze({
  wound: "abandonment_wound",
  fear: "fear_of_abandonment",
  desire: "desire_to_be_chosen",
  trigger: "unanswered_message",
  response: "panic_spiral_response",
  consequence: "conflict_or_reassurance_scene",
  repair: "consistent_return_repair",
  growth: "learns_distance_is_not_abandonment",
});

const RESPONSE_PROFILES = {
  fight: {
    responseType: "fight",
    coreImpulse: "Pushes back quickly to regain emotional ground.",
    hiddenFear: "If they do not defend themselves, they will be cornered or dismissed.",
    hiddenNeed: "Safety, respect, and room to be heard without escalation.",
    examples: [
      "Answers hurt with sharpness before naming the wound.",
      "Challenges pressure directly when vulnerability feels unsafe.",
      "Protects the bond clumsily by attacking the threat first.",
    ],
    tags: ["response", "fight", "conflict", "self_protection"],
    relatedSeeds: ["defensive_anger", "boundary_assertion", "protective_response"],
    oppositeSeeds: ["shutdown_response", "appeasement_response"],
    romanceHooks: ["argument_to_vulnerability", "protective_conflict", "anger_softens"],
    scenarioHooks: ["public_challenge", "boundary_crossed", "rival_confrontation"],
    dialoguePatterns: [
      "Do not put words in my mouth.",
      "I am not backing down because this matters.",
      "Stop making me the villain for reacting.",
    ],
    activators: ["being cornered", "feeling disrespected", "seeing someone threatened"],
    earlySignals: ["voice sharpens", "answers too fast", "posture squares"],
    escalationPattern: ["bristles", "argues", "overstates", "needs repair"],
    outwardBehaviors: ["interrupts", "uses sharper language", "takes a firm stance"],
    internalExperience: ["heat", "urgency", "fear disguised as certainty"],
    bodyLanguage: ["jaw tightens", "shoulders lift", "eyes hold too hard"],
    attachmentEffects: ["may test whether conflict causes abandonment"],
    intimacyEffects: ["softens when the fear beneath anger is named"],
    conflictEffects: ["can turn hurt into accusation"],
    misreadByOthersAs: ["cruelty", "dominance", "lack of care"],
    reassuranceNeeds: ["respect before correction", "proof disagreement is survivable"],
    repairMethods: ["slow the exchange", "name the hurt under the anger"],
    growthArcs: ["uses boundaries without attack", "lets fear be named before blame"],
    compatibleWounds: ["humiliation_wound", "control_wound", "betrayal_wound"],
    compatibleFears: ["fear_of_powerlessness", "fear_of_disrespect"],
    compatibleDesires: ["desire_for_autonomy", "desire_for_justice"],
    metadata: {
      intensity: "strong",
      romanceValue: 7,
      angstValue: 8,
      conflictPotential: 9,
      healingValue: 7,
      pacingPressure: "high",
    },
  },
  flight: {
    responseType: "flight",
    coreImpulse: "Creates distance before the situation can overwhelm them.",
    hiddenFear: "If they stay, they will be trapped, exposed, or forced into a choice.",
    hiddenNeed: "Space that does not become abandonment.",
    examples: [
      "Leaves the room before admitting they are scared.",
      "Changes the subject or disappears when closeness becomes too direct.",
      "Uses distance to keep control over emotional exposure.",
    ],
    tags: ["response", "flight", "avoidance", "distance"],
    relatedSeeds: ["avoidant_attachment", "withdrawal_response", "space_then_repair"],
    oppositeSeeds: ["cling_response", "pursuit_response"],
    romanceHooks: ["space_then_talk", "chased_but_not_cornered", "return_after_distance"],
    scenarioHooks: ["confession_pressure", "argument_aftercare", "doorway_pause"],
    dialoguePatterns: [
      "I need air.",
      "Do not follow me unless you can let me breathe.",
      "I am leaving the conversation, not you.",
    ],
    activators: ["intimacy pressure", "conflict escalation", "feeling trapped"],
    earlySignals: ["looks for exits", "shortens answers", "steps back"],
    escalationPattern: ["deflects", "backs away", "leaves", "avoids return"],
    outwardBehaviors: ["goes quiet", "physically withdraws", "delays replies"],
    internalExperience: ["tight chest", "racing thoughts", "need for distance"],
    bodyLanguage: ["turns toward the door", "hands retreat to pockets", "gaze cuts away"],
    attachmentEffects: ["may trigger pursuit in anxious partners"],
    intimacyEffects: ["needs chosen return to rebuild closeness"],
    conflictEffects: ["can make repair feel unfinished"],
    misreadByOthersAs: ["indifference", "cowardice", "punishment"],
    reassuranceNeeds: ["permission to pause", "clear path back to repair"],
    repairMethods: ["set a return time", "come back with one honest sentence"],
    growthArcs: ["asks for space clearly", "returns before distance hardens"],
    compatibleWounds: ["control_wound", "engulfment_wound"],
    compatibleFears: ["fear_of_dependency", "fear_of_vulnerability"],
    compatibleDesires: ["desire_for_autonomy", "desire_for_safety"],
    metadata: {
      intensity: "strong",
      romanceValue: 7,
      angstValue: 8,
      conflictPotential: 8,
      healingValue: 8,
      pacingPressure: "medium",
    },
  },
  freeze: {
    responseType: "freeze",
    coreImpulse: "Stops moving or speaking until the threat can be understood.",
    hiddenFear: "Any choice may make the situation worse.",
    hiddenNeed: "Gentle pacing, clear options, and no demand for instant performance.",
    examples: [
      "Goes still when a feeling becomes too large.",
      "Needs time before answering charged questions.",
      "Looks calm while internally losing access to language.",
    ],
    tags: ["response", "freeze", "stillness", "overwhelm"],
    relatedSeeds: ["nervous_system_reactivity", "decision_paralysis", "shutdown_response"],
    oppositeSeeds: ["fight_response", "argumentative_response"],
    romanceHooks: ["patient_partner_waits", "quiet_regulation", "soft_question_after_freeze"],
    scenarioHooks: ["sudden_confession", "public_pressure", "threat_arrives"],
    dialoguePatterns: [
      "I heard you. I just cannot answer yet.",
      "Give me a second.",
      "If I speak too fast, I will say it wrong.",
    ],
    activators: ["sudden pressure", "public attention", "conflicting choices"],
    earlySignals: ["blinks slowly", "stops moving", "breath becomes shallow"],
    escalationPattern: ["pauses", "locks up", "loses words", "needs grounding"],
    outwardBehaviors: ["stares", "goes silent", "delays decisions"],
    internalExperience: ["blankness", "overload", "disconnected urgency"],
    bodyLanguage: ["hands go still", "eyes fix on one point", "weight freezes in place"],
    attachmentEffects: ["may be misread as withholding"],
    intimacyEffects: ["softens when patience replaces pressure"],
    conflictEffects: ["delays repair unless given time"],
    misreadByOthersAs: ["refusal", "coldness", "lack of feeling"],
    reassuranceNeeds: ["time", "simple choices", "non-punitive patience"],
    repairMethods: ["ground the body", "ask one clear question", "wait without crowding"],
    growthArcs: ["names freeze response", "requests time before shutting down"],
    compatibleWounds: ["humiliation_wound", "shock_wound"],
    compatibleFears: ["fear_of_failure", "fear_of_rejection"],
    compatibleDesires: ["desire_for_safety", "desire_for_predictability"],
    metadata: {
      intensity: "strong",
      romanceValue: 6,
      angstValue: 8,
      conflictPotential: 6,
      healingValue: 8,
      pacingPressure: "medium",
    },
  },
  fawn: {
    responseType: "fawn",
    coreImpulse: "Keeps peace by becoming agreeable, useful, or small.",
    hiddenFear: "If they disappoint someone, affection or safety will vanish.",
    hiddenNeed: "Permission to have needs without earning care.",
    examples: [
      "Apologizes before knowing what they did wrong.",
      "Agrees too quickly to avoid tension.",
      "Tries to become easy to love by needing less.",
    ],
    tags: ["response", "fawn", "people_pleasing", "appeasement"],
    relatedSeeds: ["people_pleasing", "self_erasure", "approval_hunger"],
    oppositeSeeds: ["boundary_assertion_response", "direct_refusal"],
    romanceHooks: ["partner_notices_self_erasure", "learns_to_say_no", "care_without_earning"],
    scenarioHooks: ["family_pressure", "conflict_smoothing", "unequal_give_take"],
    dialoguePatterns: [
      "It is fine. Really.",
      "Tell me what you need and I will fix it.",
      "I did not want to make this harder.",
    ],
    activators: ["disapproval", "raised voices", "fear of rejection"],
    earlySignals: ["smiles too fast", "overexplains", "offers help immediately"],
    escalationPattern: ["appeases", "overextends", "resentment builds", "needs boundaries"],
    outwardBehaviors: ["apologizes often", "abandons preference", "soothes others first"],
    internalExperience: ["anxious scanning", "self-silencing", "fear of being too much"],
    bodyLanguage: ["shoulders fold inward", "smile stays fixed", "hands keep busy"],
    attachmentEffects: ["confuses being needed with being loved"],
    intimacyEffects: ["needs mutuality before vulnerability can feel real"],
    conflictEffects: ["prevents honest conflict until resentment leaks"],
    misreadByOthersAs: ["kindness", "ease", "lack of preference"],
    reassuranceNeeds: ["care after refusal", "approval that does not require performance"],
    repairMethods: ["ask what they want", "reward honesty instead of compliance"],
    growthArcs: ["practices refusal", "lets needs take up space"],
    compatibleWounds: ["inadequacy_wound", "neglect_wound", "family_expectation_wound"],
    compatibleFears: ["fear_of_rejection", "fear_of_not_being_enough"],
    compatibleDesires: ["desire_for_validation", "desire_to_belong"],
    metadata: {
      intensity: "core",
      romanceValue: 8,
      angstValue: 8,
      conflictPotential: 7,
      healingValue: 9,
      pacingPressure: "medium",
    },
  },
  shutdown: {
    responseType: "shutdown",
    coreImpulse: "Turns down emotional access to survive overload.",
    hiddenFear: "Feeling more will break them or expose too much.",
    hiddenNeed: "Low-pressure safety and gradual return.",
    examples: [
      "Answers flatly after being hurt.",
      "Stops asking for comfort once overwhelm peaks.",
      "Looks composed because the feeling has gone unreachable.",
    ],
    tags: ["response", "shutdown", "numbness", "overwhelm"],
    relatedSeeds: ["emotional_lockdown", "withdrawal_response", "dissociation_like_response"],
    oppositeSeeds: ["vulnerability_repair_response", "clear_confession"],
    romanceHooks: ["gentle_return", "safe_silence", "patient_aftercare"],
    scenarioHooks: ["betrayal_reveal", "argument_aftermath", "grief_trigger"],
    dialoguePatterns: [
      "I cannot feel this right now.",
      "Do not mistake quiet for okay.",
      "If I open this door, I do not know what comes out.",
    ],
    activators: ["emotional overload", "betrayal", "too much pressure"],
    earlySignals: ["voice flattens", "face goes blank", "stops asking questions"],
    escalationPattern: ["narrows", "numbs", "disconnects", "needs slow return"],
    outwardBehaviors: ["becomes flat", "withdraws affect", "answers minimally"],
    internalExperience: ["distance from feeling", "heavy blankness", "buried panic"],
    bodyLanguage: ["still face", "low eye contact", "movements become mechanical"],
    attachmentEffects: ["can feel like abandonment to partners"],
    intimacyEffects: ["requires trust before emotion returns"],
    conflictEffects: ["halts repair until nervous system settles"],
    misreadByOthersAs: ["coldness", "punishment", "not caring"],
    reassuranceNeeds: ["patience", "soft presence", "no forced confession"],
    repairMethods: ["reduce demand", "offer one concrete choice", "stay calm"],
    growthArcs: ["recognizes shutdown early", "returns with one true feeling"],
    compatibleWounds: ["betrayal_wound", "loss_wound", "trauma_wound"],
    compatibleFears: ["fear_of_vulnerability", "fear_of_being_overwhelmed"],
    compatibleDesires: ["desire_to_feel_safe_again", "desire_for_closure"],
    metadata: {
      intensity: "core",
      romanceValue: 7,
      angstValue: 9,
      conflictPotential: 7,
      healingValue: 8,
      pacingPressure: "medium",
    },
  },
  masking: {
    responseType: "masking",
    coreImpulse: "Performs composure so the hurt cannot be used against them.",
    hiddenFear: "If anyone sees the real feeling, they will judge, pity, or exploit it.",
    hiddenNeed: "Safety to be seen without spectacle.",
    examples: [
      "Smiles while absorbing a painful comment.",
      "Acts fine until privacy makes honesty possible.",
      "Keeps the mask polished because collapse feels humiliating.",
    ],
    tags: ["response", "masking", "composure", "shame"],
    relatedSeeds: ["shame_hiding", "self_editing_response", "public_composure"],
    oppositeSeeds: ["confident_vulnerability", "truth_slip_response"],
    romanceHooks: ["mask_cracks_in_private", "seen_behind_composure", "private_reassurance"],
    scenarioHooks: ["public_scandal", "family_dinner", "court_event"],
    dialoguePatterns: [
      "I am fine.",
      "This is not the place.",
      "Please do not look at me like you know.",
    ],
    activators: ["public scrutiny", "humiliation risk", "being pitied"],
    earlySignals: ["smile tightens", "voice becomes polished", "emotion gets edited"],
    escalationPattern: ["performs", "overcontrols", "cracks in private", "needs safe witness"],
    outwardBehaviors: ["smiles through hurt", "uses rehearsed manners", "redirects attention"],
    internalExperience: ["shame heat", "pressure behind the ribs", "fear of exposure"],
    bodyLanguage: ["perfect posture", "fixed smile", "hands clasp too tightly"],
    attachmentEffects: ["hides need until trust is proven"],
    intimacyEffects: ["deepens when someone notices gently"],
    conflictEffects: ["can deny hurt until it becomes harder to repair"],
    misreadByOthersAs: ["poise", "indifference", "strength"],
    reassuranceNeeds: ["privacy", "non-shaming attention", "permission to drop the act"],
    repairMethods: ["remove the audience", "name the mask gently", "do not force confession"],
    growthArcs: ["lets trusted people see the crack", "keeps dignity without hiding all pain"],
    compatibleWounds: ["humiliation_wound", "shame_wound", "public_image_wound"],
    compatibleFears: ["fear_of_judgment", "fear_of_being_too_much"],
    compatibleDesires: ["desire_for_authenticity", "desire_to_be_seen"],
    metadata: {
      intensity: "strong",
      romanceValue: 8,
      angstValue: 8,
      conflictPotential: 6,
      healingValue: 9,
      pacingPressure: "medium",
    },
  },
  humor: {
    responseType: "humor",
    coreImpulse: "Turns feeling into a joke before it can become a confession.",
    hiddenFear: "Sincerity will make them exposed, needy, or easy to reject.",
    hiddenNeed: "Permission to be serious without losing safety.",
    examples: [
      "Deflects a tender moment with a joke.",
      "Uses sarcasm to keep fear from showing.",
      "Lets humor carry the truth halfway into the room.",
    ],
    tags: ["response", "humor", "deflection", "banter"],
    relatedSeeds: ["humor_deflection", "banter_response", "sarcastic_when_hurt"],
    oppositeSeeds: ["plain_honesty_response", "clear_confession"],
    romanceHooks: ["joke_turns_serious", "banter_to_vulnerability", "laugh_then_confess"],
    scenarioHooks: ["almost_confession", "hurt_after_joke", "private_banter"],
    dialoguePatterns: [
      "I was going to be sincere, but you looked smug.",
      "Do not make me have feelings in this lighting.",
      "That joke had a point. Unfortunately.",
    ],
    activators: ["tenderness", "fear of sincerity", "awkward vulnerability"],
    earlySignals: ["smirks too quickly", "changes tone", "turns truth sideways"],
    escalationPattern: ["jokes", "dodges", "accidentally reveals", "must choose honesty"],
    outwardBehaviors: ["teases", "uses sarcasm", "makes self the punchline"],
    internalExperience: ["nervous hope", "heat under the skin", "fear of being obvious"],
    bodyLanguage: ["looks away while smiling", "fidgets", "laughs too lightly"],
    attachmentEffects: ["signals care indirectly"],
    intimacyEffects: ["can become a safe path into truth"],
    conflictEffects: ["may make hurt feel minimized"],
    misreadByOthersAs: ["not taking it seriously", "mockery", "emotional immaturity"],
    reassuranceNeeds: ["humor understood as fear", "space to try again seriously"],
    repairMethods: ["ask for the real sentence underneath", "accept awkward sincerity"],
    growthArcs: ["lets the joke drop", "says the true thing plainly"],
    compatibleWounds: ["vulnerability_wound", "shame_wound"],
    compatibleFears: ["fear_of_vulnerability", "fear_of_rejection"],
    compatibleDesires: ["desire_for_intimacy", "desire_for_authenticity"],
    metadata: {
      intensity: "moderate",
      romanceValue: 9,
      angstValue: 6,
      conflictPotential: 6,
      healingValue: 8,
      pacingPressure: "low",
    },
  },
  control: {
    responseType: "control",
    coreImpulse: "Manages variables so uncertainty cannot hurt them first.",
    hiddenFear: "If they stop controlling the shape of events, chaos will return.",
    hiddenNeed: "Trustworthy structure and consent-based flexibility.",
    examples: [
      "Makes plans when feelings become unpredictable.",
      "Controls routines to lower fear.",
      "Mistakes certainty for safety.",
    ],
    tags: ["response", "control", "planning", "hypervigilance"],
    relatedSeeds: ["hypervigilance", "routine_control", "boundary_rigidity"],
    oppositeSeeds: ["surrender_response", "trusting_flexibility"],
    romanceHooks: ["protector_learns_boundaries", "control_to_trust", "safe_plan_together"],
    scenarioHooks: ["crisis_planning", "routine_disrupted", "safety_negotiation"],
    dialoguePatterns: [
      "I need to know what happens next.",
      "Plans are how I stay calm.",
      "Do not call it control when I am trying to keep us safe.",
    ],
    activators: ["uncertainty", "danger", "broken promises"],
    earlySignals: ["asks logistical questions", "checks timing", "sets rules"],
    escalationPattern: ["plans", "tightens", "overreaches", "needs trust"],
    outwardBehaviors: ["organizes", "sets boundaries rigidly", "monitors risks"],
    internalExperience: ["vigilance", "pressure to prevent harm", "relief through structure"],
    bodyLanguage: ["checks exits", "keeps lists", "touches objects into place"],
    attachmentEffects: ["may become protective or restrictive"],
    intimacyEffects: ["relaxes when safety is co-created"],
    conflictEffects: ["can be read as mistrust or command"],
    misreadByOthersAs: ["domination", "lack of trust", "cold calculation"],
    reassuranceNeeds: ["shared plan", "reliable follow-through", "consent around boundaries"],
    repairMethods: ["separate safety from control", "agree on flexible structure"],
    growthArcs: ["shares control", "trusts repair after uncertainty"],
    compatibleWounds: ["unsafe_home_wound", "control_wound", "betrayal_wound"],
    compatibleFears: ["fear_of_chaos", "fear_of_harm"],
    compatibleDesires: ["desire_for_safety", "desire_for_stability"],
    metadata: {
      intensity: "strong",
      romanceValue: 7,
      angstValue: 7,
      conflictPotential: 8,
      healingValue: 8,
      pacingPressure: "medium",
    },
  },
  attachment: {
    responseType: "reassurance_seeking",
    coreImpulse: "Checks whether closeness is still secure.",
    hiddenFear: "The bond is already weakening and they are the last to know.",
    hiddenNeed: "Consistent return, clear affection, and clean reassurance.",
    examples: [
      "Asks for proof the relationship is intact.",
      "Moves closer when distance feels dangerous.",
      "Tests affection indirectly before admitting fear.",
    ],
    tags: ["response", "attachment", "reassurance", "anxious_activation"],
    relatedSeeds: ["fear_of_abandonment", "desire_to_be_chosen", "reassurance_seeking"],
    oppositeSeeds: ["hyper_independence_response", "avoidance_response"],
    romanceHooks: ["reassurance_scene", "chosen_again", "distance_is_not_abandonment"],
    scenarioHooks: ["unanswered_message", "rival_attention", "partner_withdraws"],
    dialoguePatterns: [
      "Are we okay?",
      "I know it sounds small. It did not feel small.",
      "Tell me if I still matter to you.",
    ],
    activators: ["silence", "divided attention", "unclear commitment"],
    earlySignals: ["checks tone", "asks indirect questions", "stays physically near"],
    escalationPattern: ["notices distance", "tests affection", "panics", "needs clean repair"],
    outwardBehaviors: ["asks for reassurance", "clings", "tests loyalty"],
    internalExperience: ["stomach drop", "alert scanning", "fear of being replaced"],
    bodyLanguage: ["hovers near exits", "watches faces", "reaches then stops"],
    attachmentEffects: ["activates anxious attachment patterns"],
    intimacyEffects: ["deepens with explicit secure return"],
    conflictEffects: ["may turn uncertainty into accusation"],
    misreadByOthersAs: ["neediness", "jealousy", "control"],
    reassuranceNeeds: ["clear affection", "reliable return", "specific commitment"],
    repairMethods: ["name the bond", "return consistently", "answer the fear directly"],
    growthArcs: ["asks directly", "accepts reassurance", "learns distance is not abandonment"],
    compatibleWounds: ["abandonment_wound", "replacement_wound", "neglect_wound"],
    compatibleFears: ["fear_of_abandonment", "fear_of_replacement"],
    compatibleDesires: ["desire_to_be_chosen", "desire_for_reliable_love"],
    metadata: {
      intensity: "core",
      romanceValue: 9,
      angstValue: 9,
      conflictPotential: 8,
      healingValue: 10,
      pacingPressure: "high",
    },
  },
  repair: {
    responseType: "repair",
    coreImpulse: "Moves toward accountability, reconnection, or changed behavior.",
    hiddenFear: "The harm may already be too large to mend.",
    hiddenNeed: "A path back that honors both apology and consequence.",
    examples: [
      "Names harm without demanding immediate forgiveness.",
      "Uses action to prove the apology has weight.",
      "Lets repair become a pattern rather than a performance.",
    ],
    tags: ["response", "repair", "accountability", "growth"],
    relatedSeeds: ["honest_repair", "accountability_repair", "trust_building"],
    oppositeSeeds: ["stonewalling_response", "self_justification_response"],
    romanceHooks: ["repair_after_argument", "changed_behavior_romance", "apology_to_intimacy"],
    scenarioHooks: ["argument_aftermath", "trust_gate", "second_chance"],
    dialoguePatterns: [
      "I hurt you. I understand that now.",
      "I am not asking you to be over it.",
      "Let me show you I heard you.",
    ],
    activators: ["harm recognized", "relationship rupture", "trust damaged"],
    earlySignals: ["slows down", "stops defending", "asks what repair requires"],
    escalationPattern: ["recognizes harm", "names it", "changes behavior", "rebuilds trust"],
    outwardBehaviors: ["apologizes cleanly", "changes habits", "checks impact"],
    internalExperience: ["guilt", "care", "fear of losing the bond"],
    bodyLanguage: ["uncrosses arms", "keeps voice low", "does not crowd the other person"],
    attachmentEffects: ["builds secure return after rupture"],
    intimacyEffects: ["turns conflict into earned trust"],
    conflictEffects: ["reduces defensiveness when sincere"],
    misreadByOthersAs: ["weakness", "performative guilt", "too late"],
    reassuranceNeeds: ["repair can be gradual", "accountability is not abandonment"],
    repairMethods: ["specific apology", "changed behavior", "patient follow-through"],
    growthArcs: ["repairs without self-erasure", "keeps changing after forgiveness"],
    compatibleWounds: ["betrayal_wound", "regret_wound", "shame_wound"],
    compatibleFears: ["fear_of_irredeemability", "fear_of_losing_trust"],
    compatibleDesires: ["desire_for_redemption", "desire_to_trust_again"],
    metadata: {
      intensity: "strong",
      romanceValue: 9,
      angstValue: 7,
      conflictPotential: 5,
      healingValue: 10,
      pacingPressure: "medium",
    },
  },
} as const satisfies Record<ResponseCategory, ResponseProfile>;

const RESPONSE_OVERRIDES: Record<string, ResponseOverride> = {
  protective_rage_response: {
    responseType: "protective",
    description:
      "Turns fear for someone else into fierce defense before checking whether defense is what they need.",
    tags: ["response", "protective", "fight", "boundary_check"],
    romanceHooks: ["protective_rage_softens", "touch_them_and_die_repaired"],
    dialoguePatterns: [
      "Step away from them.",
      "I am angry because I was scared.",
      "Tell me what you need before I make this worse.",
    ],
    compatibleDesires: ["desire_for_protection", "desire_for_safety"],
  },
  avoidance_response: {
    responseType: "avoidance",
  },
  ghosting_response: {
    responseType: "avoidance",
    metadata: {
      intensity: "strong",
      romanceValue: 4,
      angstValue: 9,
      conflictPotential: 9,
      healingValue: 5,
      pacingPressure: "high",
    },
    dialoguePatterns: [
      "I did not know how to come back.",
      "Silence felt safer until it started hurting you.",
    ],
  },
  people_pleasing_response: {
    description:
      "Tries to stay loved by becoming agreeable, useful, and easy to accommodate.",
    relatedSeeds: ["inadequacy_wound", "fear_of_rejection", "approval_hunger"],
  },
  emotional_shutdown_response: {
    label: "Emotional Shutdown Response",
  },
  dissociation_like_response: {
    label: "Dissociation-Like Response",
  },
  humor_deflection_response: {
    description:
      "Uses humor to keep tenderness, fear, or confession from landing too directly.",
    responseType: "humor",
  },
  self_deprecating_response: {
    responseType: "humor",
    relatedSeeds: ["inadequacy_wound", "fear_of_failure", "shame_hiding"],
  },
  hypervigilance_response: {
    responseType: "control",
    relatedSeeds: ["fear_of_harm", "unsafe_home_wound", "control_response"],
  },
  boundary_rigidity_response: {
    responseType: "control",
    relatedSeeds: ["control_wound", "fear_of_dependency", "direct_boundary_setting"],
  },
  cling_response: {
    responseType: "reassurance_seeking",
    description:
      "Moves closer, asks more, or holds tighter when separation feels like loss.",
    romanceHooks: ["cling_then_reassurance", "secure_return", "chosen_again"],
  },
  testing_love_response: {
    responseType: "reassurance_seeking",
    description:
      "Creates small tests of loyalty when asking for reassurance feels too exposing.",
    conflictEffects: ["can make reassurance feel like a trap"],
    growthArcs: ["asks for reassurance instead of staging tests"],
  },
  pull_away_after_softness_response: {
    responseType: "avoidance",
    description:
      "Creates distance after tenderness because being seen feels suddenly dangerous.",
    romanceHooks: ["softness_then_distance", "return_after_vulnerability"],
  },
  vulnerability_repair_response: {
    responseType: "vulnerability",
    description:
      "Repairs by naming the fear, hurt, or need that was hidden under the reaction.",
    romanceHooks: ["vulnerable_repair_scene", "conflict_to_intimacy"],
    dialoguePatterns: [
      "I was scared, and I made it your problem.",
      "The truth is uglier than the argument.",
    ],
  },
  changed_behavior_response: {
    description:
      "Treats repair as repeated changed behavior instead of one emotional apology.",
    romanceHooks: ["changed_behavior_romance", "trust_rebuilt_by_action"],
  },
};

export const RESPONSE_VOCABULARY_SEEDS = Object.freeze(
  Object.entries(responseCategories).flatMap(([category, seedIds]) =>
    seedIds.map((seed) => createResponseSeed(seed, category as ResponseCategory)),
  ),
) satisfies readonly ResponseSeed[];

export const RESPONSE_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  RESPONSE_VOCABULARY_SEEDS.map((seed) =>
    createVocabularySeedPreset({
      seed: seed.seed,
      label: seed.label,
      description: [
        seed.description,
        `Core impulse: ${seed.coreImpulse}`,
        `Hidden fear: ${seed.hiddenFear}`,
        `Hidden need: ${seed.hiddenNeed}`,
      ].join(" "),
      examples: [
        ...seed.examples,
        ...seed.internalExperience,
        ...seed.bodyLanguage,
      ],
      tags: [
        ...seed.tags,
        "response",
        seed.responseType,
        seed.metadata.intensity,
        `pacing:${seed.metadata.pacingPressure}`,
      ],
      relatedSeeds: [
        ...seed.relatedSeeds,
        ...seed.activators,
        ...seed.earlySignals,
        ...seed.compatibleWounds,
        ...seed.compatibleFears,
        ...seed.compatibleDesires,
        ...seed.growthArcs,
        ...seed.repairMethods,
      ],
      oppositeSeeds: [
        ...seed.oppositeSeeds,
        ...seed.misreadByOthersAs,
      ],
      romanceHooks: seed.romanceHooks,
      scenarioHooks: [
        ...seed.scenarioHooks,
        ...seed.routeGates,
      ],
      dialoguePatterns: seed.dialoguePatterns,
      metadata: {
        rarity: seed.metadata.intensity === "overwhelming" ? "rare" : "uncommon",
        romanceValue: seed.metadata.romanceValue,
        conflictPotential: seed.metadata.conflictPotential,
      },
    }),
  ),
) satisfies readonly VocabularySeedPreset[];

export function findResponseVocabularySeedBySeed(
  seedId: string,
): ResponseSeed | undefined {
  const normalizedSeedId = seedId.trim().toLowerCase();
  return RESPONSE_VOCABULARY_SEEDS.find(
    (seed) => seed.seed.toLowerCase() === normalizedSeedId,
  );
}

export function getResponseVocabularySeedsByType(
  responseType: ResponseSeedType,
): readonly ResponseSeed[] {
  return RESPONSE_VOCABULARY_SEEDS.filter(
    (seed) => seed.responseType === responseType,
  );
}

export function getResponseVocabularySeedsByCategory(
  category: ResponseCategory,
): readonly ResponseSeed[] {
  const seedIds = new Set<string>(responseCategories[category]);
  return RESPONSE_VOCABULARY_SEEDS.filter((seed) => seedIds.has(seed.seed));
}

function createResponseSeed(
  seed: string,
  category: ResponseCategory,
): ResponseSeed {
  const profile = RESPONSE_PROFILES[category];
  const override = RESPONSE_OVERRIDES[seed];
  const responseType = override?.responseType ?? profile.responseType;

  return createResponseSeedPreset({
    seed,
    label: override?.label ?? toResponseLabel(seed),
    description:
      override?.description ??
      `Responds to threat, closeness, or conflict through ${toReadableResponse(seed)}.`,
    examples: override?.examples ?? profile.examples,
    tags: unique([
      ...profile.tags,
      category,
      responseType,
      seed,
      ...(override?.tags ?? []),
    ]),
    relatedSeeds: override?.relatedSeeds ?? profile.relatedSeeds,
    oppositeSeeds: override?.oppositeSeeds ?? profile.oppositeSeeds,
    romanceHooks: override?.romanceHooks ?? profile.romanceHooks,
    scenarioHooks: override?.scenarioHooks ?? profile.scenarioHooks,
    dialoguePatterns: override?.dialoguePatterns ?? profile.dialoguePatterns,
    responseType,
    coreImpulse: override?.coreImpulse ?? profile.coreImpulse,
    hiddenFear: override?.hiddenFear ?? profile.hiddenFear,
    hiddenNeed: override?.hiddenNeed ?? profile.hiddenNeed,
    activators: override?.activators ?? profile.activators,
    earlySignals: override?.earlySignals ?? profile.earlySignals,
    escalationPattern: override?.escalationPattern ?? profile.escalationPattern,
    outwardBehaviors: override?.outwardBehaviors ?? profile.outwardBehaviors,
    internalExperience: override?.internalExperience ?? profile.internalExperience,
    bodyLanguage: override?.bodyLanguage ?? profile.bodyLanguage,
    attachmentEffects: override?.attachmentEffects ?? profile.attachmentEffects,
    intimacyEffects: override?.intimacyEffects ?? profile.intimacyEffects,
    conflictEffects: override?.conflictEffects ?? profile.conflictEffects,
    misreadByOthersAs: override?.misreadByOthersAs ?? profile.misreadByOthersAs,
    reassuranceNeeds: override?.reassuranceNeeds ?? profile.reassuranceNeeds,
    repairMethods: override?.repairMethods ?? profile.repairMethods,
    growthArcs: override?.growthArcs ?? profile.growthArcs,
    routeGates: override?.routeGates ?? [
      `${seed}_gate`,
      `${category}_response_route`,
    ],
    compatibleWounds: override?.compatibleWounds ?? profile.compatibleWounds,
    compatibleFears: override?.compatibleFears ?? profile.compatibleFears,
    compatibleDesires: override?.compatibleDesires ?? profile.compatibleDesires,
    metadata: {
      ...profile.metadata,
      ...override?.metadata,
    },
  });
}

function toResponseLabel(seed: string): string {
  return seed
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bResponse\b$/, "Response");
}

function toReadableResponse(seed: string): string {
  return seed.replace(/_response$/, "").replace(/_/g, " ");
}

function unique(values: readonly string[]): readonly string[] {
  return Array.from(new Set(values.filter((value) => value.trim().length > 0)));
}
