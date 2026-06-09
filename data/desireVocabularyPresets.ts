import {
  createDesireSeedPreset,
  createVocabularySeedPreset,
  type DesireSeed,
  type DesireSeedIntensity,
  type DesireSeedPacingPressure,
  type DesireSeedType,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export interface DesireSemanticGraphDetails {
  emotionalMeaning: string;
  internalMeaning: string;
  hiddenNeeds: readonly string[];
  activators: readonly string[];
  earlySignals: readonly string[];
  escalationPattern: readonly string[];
  pursuitBehaviors: readonly string[];
  restraintPatterns: readonly string[];
  selfSabotagePatterns: readonly string[];
  attachmentEffects: readonly string[];
  intimacyEffects: readonly string[];
  conflictEffects: readonly string[];
  misreadSignals: readonly string[];
  fulfillmentNeeds: readonly string[];
  frustrationTriggers: readonly string[];
  repairMethods: readonly string[];
  growthPath: readonly string[];
  routeGates: readonly string[];
  compatibleWounds: readonly string[];
  compatibleFears: readonly string[];
  incompatibleDynamics: readonly string[];
}

type DesireProfile = {
  tags: readonly string[];
  examples: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  metadata: {
    intensity: DesireSeedIntensity;
    romanceValue: number;
    angstValue: number;
    conflictPotential: number;
    healingValue: number;
    pacingPressure: DesireSeedPacingPressure;
  };
  graph: Omit<DesireSemanticGraphDetails, "routeGates">;
};

type DesireSeedOverride = {
  description?: string;
  examples?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  graph?: Partial<Pick<DesireSemanticGraphDetails, "emotionalMeaning" | "internalMeaning">>;
};

export const desireCategories = {
  attachment: [
    "Desire to Be Chosen",
    "Desire to Belong",
    "Desire for Home",
    "Desire for Family",
    "Desire for Devotion",
    "Desire for Reliable Love",
  ],
  romantic: [
    "Desire for Love",
    "Desire for Partnership",
    "Desire for Deep Intimacy",
    "Desire for Forever",
    "Desire for Marriage",
  ],
  self_worth: [
    "Desire for Validation",
    "Desire for Recognition",
    "Desire to Feel Worthy",
    "Desire for Confidence",
  ],
  identity: [
    "Desire for Authenticity",
    "Desire for Freedom",
    "Desire for Autonomy",
    "Desire for Self-Expression",
  ],
  social: [
    "Desire for Friendship",
    "Desire for Community",
    "Desire for Loyalty",
    "Desire for Shared Purpose",
  ],
  safety: [
    "Desire for Safety",
    "Desire for Stability",
    "Desire for Predictability",
    "Desire for Protection",
  ],
  ambition: [
    "Desire for Success",
    "Desire for Power",
    "Desire for Legacy",
    "Desire for Achievement",
  ],
  sensory: [
    "Desire for Comfort",
    "Desire for Beauty",
    "Desire for Pleasure",
    "Desire for Adventure",
  ],
  moral: [
    "Desire for Justice",
    "Desire for Truth",
    "Desire for Redemption",
    "Desire to Do Good",
  ],
  existential: [
    "Desire for Meaning",
    "Desire for Purpose",
    "Desire for Wisdom",
    "Desire for Hope",
  ],
  healing: [
    "Desire to Heal",
    "Desire to Trust Again",
    "Desire to Feel Safe Again",
    "Desire for Closure",
  ],
  obsessive: [
    "Desire for Exclusive Attention",
    "Desire for Total Devotion",
    "Desire to Be Irreplaceable",
    "Desire for Emotional Singularity",
  ],
} as const satisfies Record<DesireSeedType, readonly string[]>;

const desireCategoryProfiles = {
  attachment: {
    tags: ["attachment", "belonging", "devotion", "priority"],
    examples: [
      "Wants consistent evidence that the bond is real.",
      "Softens when someone chooses them without being asked.",
      "Reads reliability as affection.",
    ],
    relatedSeeds: [
      "fear_of_abandonment",
      "fear_of_replacement",
      "reassurance_seeking",
      "secure_attachment",
    ],
    oppositeSeeds: ["fear_of_dependency", "avoidant_attachment"],
    romanceHooks: ["chosen_above_others", "exclusive_bond", "public_choice_scene"],
    scenarioHooks: ["rival_forces_choice", "public_commitment", "trust_gate"],
    dialoguePatterns: [
      "Choose me.",
      "I want to matter without having to beg for it.",
      "Tell me I am not temporary.",
    ],
    metadata: {
      intensity: "core",
      romanceValue: 10,
      angstValue: 9,
      conflictPotential: 8,
      healingValue: 10,
      pacingPressure: "high",
    },
    graph: {
      emotionalMeaning: "Values consistent presence over grand gestures.",
      internalMeaning:
        "Interprets being chosen as proof that closeness can survive pressure.",
      hiddenNeeds: ["reassurance", "priority", "emotional_security"],
      activators: ["public loyalty", "kept promises", "undivided attention"],
      earlySignals: [
        "watches who receives attention first",
        "relaxes when included",
        "asks small questions about where they stand",
      ],
      escalationPattern: [
        "hopes quietly",
        "tests for priority",
        "needs a clear choice",
      ],
      pursuitBehaviors: [
        "offers loyalty quickly",
        "creates private rituals",
        "tries to become emotionally indispensable",
      ],
      restraintPatterns: [
        "pretends not to need reassurance",
        "waits for the other person to choose first",
      ],
      selfSabotagePatterns: [
        "pulls away before rejection",
        "compares themselves to rivals",
      ],
      attachmentEffects: ["seeks reliable connection", "prefers explicit commitment"],
      intimacyEffects: ["opens after being chosen", "melts under devotional language"],
      conflictEffects: ["spikes when attention feels divided"],
      misreadSignals: ["privacy as shame", "delayed replies as disinterest"],
      fulfillmentNeeds: ["clear choice", "consistent presence", "loyal follow-through"],
      frustrationTriggers: ["ambiguous commitment", "being kept hidden"],
      repairMethods: ["name the priority out loud", "show up immediately"],
      growthPath: ["asks directly", "receives reassurance", "trusts the bond"],
      compatibleWounds: ["abandonment_wound", "neglect_wound", "never_chosen_wound"],
      compatibleFears: ["fear_of_abandonment", "fear_of_replacement"],
      incompatibleDynamics: ["triangulation", "hot_cold_affection"],
    },
  },
  romantic: {
    tags: ["romance", "intimacy", "partnership"],
    examples: [
      "Craves honest closeness rather than surface charm.",
      "Wants a relationship that can survive ordinary life.",
      "Responds to shared secrets and sustained tenderness.",
    ],
    relatedSeeds: ["deep_intimacy", "partnership", "commitment", "vulnerability"],
    oppositeSeeds: ["fear_of_intimacy", "emotional_avoidance"],
    romanceHooks: ["late_night_conversations", "shared_secrets", "commitment_scene"],
    scenarioHooks: ["confession_arc", "trust_building", "future_talk_scene"],
    dialoguePatterns: [
      "I want the real you.",
      "Tell me what you do not tell anyone else.",
      "I do not want almost-love.",
    ],
    metadata: {
      intensity: "core",
      romanceValue: 10,
      angstValue: 8,
      conflictPotential: 6,
      healingValue: 10,
      pacingPressure: "high",
    },
    graph: {
      emotionalMeaning: "Treats intimacy as being known without performance.",
      internalMeaning: "Believes real love requires truth, patience, and mutual risk.",
      hiddenNeeds: ["emotional_honesty", "mutual_vulnerability"],
      activators: ["shared secrets", "quiet honesty", "future planning"],
      earlySignals: ["lingers in deep conversation", "asks careful personal questions"],
      escalationPattern: ["curiosity", "trust", "confession", "commitment"],
      pursuitBehaviors: ["creates private time", "offers emotional honesty"],
      restraintPatterns: ["holds back until trust is proven"],
      selfSabotagePatterns: ["asks for depth before the bond is ready"],
      attachmentEffects: ["seeks steady closeness"],
      intimacyEffects: ["deepens quickly once honesty is returned"],
      conflictEffects: ["hurts when the other person deflects"],
      misreadSignals: ["privacy as distance"],
      fulfillmentNeeds: ["truth", "shared vulnerability", "mutual commitment"],
      frustrationTriggers: ["mixed signals", "emotional walls"],
      repairMethods: ["honest conversation", "unforced reassurance"],
      growthPath: ["slows down", "trusts pace", "builds mutuality"],
      compatibleWounds: ["loneliness_wound", "emotional_neglect_wound"],
      compatibleFears: ["fear_of_intimacy", "fear_of_being_unknown"],
      incompatibleDynamics: ["surface_level_charm", "chronic_deflection"],
    },
  },
  self_worth: {
    tags: ["self_worth", "validation", "recognition"],
    examples: [
      "Wants effort to be seen and named.",
      "Feels steadier when someone is proud of them.",
      "Needs praise that sounds specific rather than automatic.",
    ],
    relatedSeeds: ["inadequacy_wound", "praise", "recognition"],
    oppositeSeeds: ["self_validation", "self_sufficiency"],
    romanceHooks: ["specific_praise", "being_proud_of_partner", "affirmation"],
    scenarioHooks: ["public_success", "achievement_scene", "private_encouragement"],
    dialoguePatterns: [
      "Did I do okay?",
      "I just wanted someone to notice.",
      "Tell me it meant something.",
    ],
    metadata: {
      intensity: "strong",
      romanceValue: 8,
      angstValue: 7,
      conflictPotential: 7,
      healingValue: 9,
      pacingPressure: "medium",
    },
    graph: {
      emotionalMeaning: "Equates being seen with being valued.",
      internalMeaning: "Uses recognition as evidence that effort and existence matter.",
      hiddenNeeds: ["specific_praise", "appreciation", "dignity"],
      activators: ["earned praise", "public acknowledgement", "private pride"],
      earlySignals: ["works harder after praise", "asks if it was enough"],
      escalationPattern: ["tries", "waits to be seen", "overworks", "asks indirectly"],
      pursuitBehaviors: ["proves competence", "offers visible effort"],
      restraintPatterns: ["dismisses praise before it can matter"],
      selfSabotagePatterns: ["overperforms", "treats silence as failure"],
      attachmentEffects: ["needs explicit appreciation"],
      intimacyEffects: ["softens when worth is named"],
      conflictEffects: ["reacts sharply to dismissal"],
      misreadSignals: ["neutral feedback as disappointment"],
      fulfillmentNeeds: ["specific validation", "visible pride", "respect"],
      frustrationTriggers: ["being overlooked", "comparison", "faint praise"],
      repairMethods: ["name what mattered", "recognize effort without exaggeration"],
      growthPath: ["accepts praise", "builds self-recognition"],
      compatibleWounds: ["inadequacy_wound", "humiliation_wound"],
      compatibleFears: ["fear_of_failure", "fear_of_not_being_enough"],
      incompatibleDynamics: ["constant_criticism", "dismissive_partner"],
    },
  },
  identity: {
    tags: ["identity", "freedom", "authenticity"],
    examples: [
      "Wants to stop performing a role.",
      "Resists being loved only for a mask.",
      "Feels relief when someone accepts the inconvenient truth.",
    ],
    relatedSeeds: ["authenticity", "self_expression", "autonomy"],
    oppositeSeeds: ["forced_role", "fear_of_authenticity"],
    romanceHooks: ["seen_without_mask", "accepted_as_self", "identity_reveal"],
    scenarioHooks: ["coming_out", "breaking_expectations", "secret_identity_reveal"],
    dialoguePatterns: [
      "I want to be myself.",
      "I am tired of pretending.",
      "Do you still want me when I stop performing?",
    ],
    metadata: {
      intensity: "core",
      romanceValue: 8,
      angstValue: 7,
      conflictPotential: 7,
      healingValue: 10,
      pacingPressure: "medium",
    },
    graph: {
      emotionalMeaning: "Needs love that does not require erasure.",
      internalMeaning: "Treats authenticity as the condition for real belonging.",
      hiddenNeeds: ["acceptance", "self_expression", "room_to_change"],
      activators: ["identity respected", "mask dropped", "chosen name honored"],
      earlySignals: ["tests honesty", "pushes against expectations"],
      escalationPattern: ["hides", "reveals", "braces", "seeks acceptance"],
      pursuitBehaviors: ["states boundaries", "reclaims language"],
      restraintPatterns: ["plays the expected role"],
      selfSabotagePatterns: ["rejects acceptance before trusting it"],
      attachmentEffects: ["needs identity-safe intimacy"],
      intimacyEffects: ["deepens after acceptance"],
      conflictEffects: ["fights control or erasure"],
      misreadSignals: ["concern as judgment"],
      fulfillmentNeeds: ["respect", "choice", "unconditional recognition"],
      frustrationTriggers: ["being defined by others", "forced conformity"],
      repairMethods: ["respect their self-description", "make room for truth"],
      growthPath: ["names truth", "accepts being seen", "lives openly"],
      compatibleWounds: ["identity_erasure_wound", "family_expectation_wound"],
      compatibleFears: ["fear_of_rejection", "fear_of_authenticity"],
      incompatibleDynamics: ["controlling_partner", "conditional_acceptance"],
    },
  },
  social: {
    tags: ["social", "community", "loyalty"],
    examples: [
      "Wants a circle that notices when they are missing.",
      "Feels safest when bonds have shared purpose.",
      "Values loyalty in everyday social choices.",
    ],
    relatedSeeds: ["community", "friendship", "loyalty", "shared_purpose"],
    oppositeSeeds: ["isolation", "social_detachment"],
    romanceHooks: ["chosen_family_romance", "friend_group_acceptance"],
    scenarioHooks: ["community_event", "public_defense", "shared_mission"],
    dialoguePatterns: [
      "I do not want to stand outside anymore.",
      "Stay with me where people can see us.",
      "I want a life that has room for more than survival.",
    ],
    metadata: {
      intensity: "strong",
      romanceValue: 8,
      angstValue: 6,
      conflictPotential: 6,
      healingValue: 9,
      pacingPressure: "medium",
    },
    graph: {
      emotionalMeaning: "Experiences belonging as protection against loneliness.",
      internalMeaning: "Needs bonds that exist in public and in community.",
      hiddenNeeds: ["belonging", "loyalty", "shared_place"],
      activators: ["public inclusion", "group loyalty", "shared purpose"],
      earlySignals: ["watches social cues", "offers help to belong"],
      escalationPattern: ["approaches", "contributes", "risks needing people"],
      pursuitBehaviors: ["builds ties", "keeps promises", "shows up publicly"],
      restraintPatterns: ["stays on the edge of groups"],
      selfSabotagePatterns: ["leaves before rejection"],
      attachmentEffects: ["needs social proof of belonging"],
      intimacyEffects: ["romance deepens when community accepts it"],
      conflictEffects: ["hurts when excluded"],
      misreadSignals: ["busy groups as rejection"],
      fulfillmentNeeds: ["invitation", "loyalty", "shared rituals"],
      frustrationTriggers: ["gossip", "exclusion", "public ambiguity"],
      repairMethods: ["include them visibly", "defend the bond"],
      growthPath: ["risks joining", "accepts chosen family"],
      compatibleWounds: ["outsider_wound", "exile_wound"],
      compatibleFears: ["fear_of_rejection", "fear_of_isolation"],
      incompatibleDynamics: ["secret_only_romance", "social_shame"],
    },
  },
  safety: {
    tags: ["safety", "stability", "protection"],
    examples: [
      "Longs for predictability after chaos.",
      "Feels loved when someone becomes reliable.",
      "Responds to protection that respects autonomy.",
    ],
    relatedSeeds: ["stability", "protection", "predictability"],
    oppositeSeeds: ["chaos_seeking", "danger_addiction"],
    romanceHooks: ["safe_person_dynamic", "protector_respects_boundaries"],
    scenarioHooks: ["storm_shelter", "safehouse", "routine_built_together"],
    dialoguePatterns: [
      "I just want to breathe without bracing.",
      "Do not promise safety unless you mean it.",
      "Steady matters to me.",
    ],
    metadata: {
      intensity: "core",
      romanceValue: 8,
      angstValue: 8,
      conflictPotential: 6,
      healingValue: 10,
      pacingPressure: "medium",
    },
    graph: {
      emotionalMeaning: "Reads steadiness as care.",
      internalMeaning: "Wants love that lowers the need for vigilance.",
      hiddenNeeds: ["predictability", "protection", "rest"],
      activators: ["kept routines", "calm presence", "clear plans"],
      earlySignals: ["checks exits", "asks what happens next"],
      escalationPattern: ["tests reliability", "lets guard drop", "rests"],
      pursuitBehaviors: ["creates routines", "chooses dependable people"],
      restraintPatterns: ["pretends chaos is normal"],
      selfSabotagePatterns: ["mistakes calm for boredom"],
      attachmentEffects: ["attaches through dependability"],
      intimacyEffects: ["relaxes when safety is consistent"],
      conflictEffects: ["panics at unpredictability"],
      misreadSignals: ["surprise as threat"],
      fulfillmentNeeds: ["clear boundaries", "follow-through", "calm repair"],
      frustrationTriggers: ["broken promises", "sudden changes"],
      repairMethods: ["make a plan", "show steady presence"],
      growthPath: ["trusts stability", "rests without guilt"],
      compatibleWounds: ["instability_wound", "unsafe_home_wound"],
      compatibleFears: ["fear_of_chaos", "fear_of_harm"],
      incompatibleDynamics: ["volatile_affection", "reckless_partner"],
    },
  },
  ambition: {
    tags: ["ambition", "success", "legacy"],
    examples: [
      "Wants achievement to mean something beyond survival.",
      "Finds romance compelling when it respects their drive.",
      "Fears love may make them choose between ambition and tenderness.",
    ],
    relatedSeeds: ["success", "achievement", "legacy", "power"],
    oppositeSeeds: ["contentment_without_ambition", "fear_of_success"],
    romanceHooks: ["power_couple", "ambition_vs_love", "legacy_builder_romance"],
    scenarioHooks: ["career_milestone", "public_success", "succession_pressure"],
    dialoguePatterns: [
      "I want more than being remembered as useful.",
      "Do not ask me to make myself smaller.",
      "I am allowed to want this.",
    ],
    metadata: {
      intensity: "strong",
      romanceValue: 7,
      angstValue: 7,
      conflictPotential: 8,
      healingValue: 7,
      pacingPressure: "medium",
    },
    graph: {
      emotionalMeaning: "Links achievement with agency and self-definition.",
      internalMeaning: "Wants love that does not punish hunger for more.",
      hiddenNeeds: ["respect", "agency", "meaningful_work"],
      activators: ["recognized competence", "strategic partnership"],
      earlySignals: ["frames feelings as goals", "tracks progress"],
      escalationPattern: ["strives", "overreaches", "questions the cost"],
      pursuitBehaviors: ["plans", "competes", "builds influence"],
      restraintPatterns: ["hides how much they want"],
      selfSabotagePatterns: ["chooses success over support"],
      attachmentEffects: ["needs respect for ambition"],
      intimacyEffects: ["opens when ambition is understood"],
      conflictEffects: ["clashes over priorities"],
      misreadSignals: ["concern as limitation"],
      fulfillmentNeeds: ["respect", "partnership", "room to grow"],
      frustrationTriggers: ["being underestimated", "forced smallness"],
      repairMethods: ["respect the goal", "name the cost honestly"],
      growthPath: ["balances ambition with intimacy"],
      compatibleWounds: ["status_wound", "poverty_wound"],
      compatibleFears: ["fear_of_failure", "fear_of_wasted_potential"],
      incompatibleDynamics: ["resentful_partner", "control_disguised_as_care"],
    },
  },
  sensory: {
    tags: ["sensory", "comfort", "beauty", "pleasure"],
    examples: [
      "Seeks a life that feels good in the body.",
      "Responds to comfort, beauty, taste, touch, and atmosphere.",
      "Uses sensory detail as a doorway into trust.",
    ],
    relatedSeeds: ["comfort", "beauty", "adventure", "pleasure"],
    oppositeSeeds: ["sensory_denial", "ascetic_distance"],
    romanceHooks: ["shared_meal", "beautiful_place_date", "comfort_scene"],
    scenarioHooks: ["market_day", "rainy_room", "travel_adventure"],
    dialoguePatterns: [
      "I want something that feels alive.",
      "Stay. The room is better with you in it.",
      "I forgot life could feel soft.",
    ],
    metadata: {
      intensity: "moderate",
      romanceValue: 8,
      angstValue: 4,
      conflictPotential: 4,
      healingValue: 8,
      pacingPressure: "low",
    },
    graph: {
      emotionalMeaning: "Treats beauty and comfort as evidence that life can be gentle.",
      internalMeaning: "Uses sensory experience to reconnect with wanting.",
      hiddenNeeds: ["embodiment", "comfort", "wonder"],
      activators: ["warm rooms", "good food", "music", "beautiful light"],
      earlySignals: ["notices texture", "slows down around comfort"],
      escalationPattern: ["notices", "savors", "shares", "attaches"],
      pursuitBehaviors: ["creates atmosphere", "offers sensory care"],
      restraintPatterns: ["denies wanting comfort"],
      selfSabotagePatterns: ["overindulges to avoid feeling"],
      attachmentEffects: ["bonds through shared sensory rituals"],
      intimacyEffects: ["softens through ordinary pleasures"],
      conflictEffects: ["withdraws when beauty is mocked"],
      misreadSignals: ["practicality as rejection of joy"],
      fulfillmentNeeds: ["shared enjoyment", "permission to want"],
      frustrationTriggers: ["sterile life", "constant deprivation"],
      repairMethods: ["offer concrete comfort", "make the moment gentler"],
      growthPath: ["lets pleasure be safe", "shares joy without shame"],
      compatibleWounds: ["deprivation_wound", "burnout_wound"],
      compatibleFears: ["fear_of_wanting_too_much"],
      incompatibleDynamics: ["shame_based_denial", "constant_crisis"],
    },
  },
  moral: {
    tags: ["moral", "justice", "truth", "redemption"],
    examples: [
      "Wants love that can survive conscience.",
      "Feels drawn to truth even when it costs them.",
      "Seeks repair for harm done or harm witnessed.",
    ],
    relatedSeeds: ["justice", "truth", "redemption", "integrity"],
    oppositeSeeds: ["moral_apathy", "nihilism"],
    romanceHooks: ["redemption_through_love", "truth_confession", "moral_choice"],
    scenarioHooks: ["trial_scene", "confession_of_guilt", "protect_the_innocent"],
    dialoguePatterns: [
      "I need to make this right.",
      "Do not ask me to lie about what matters.",
      "I want to be better than what happened.",
    ],
    metadata: {
      intensity: "strong",
      romanceValue: 7,
      angstValue: 8,
      conflictPotential: 8,
      healingValue: 9,
      pacingPressure: "medium",
    },
    graph: {
      emotionalMeaning: "Needs desire to align with conscience.",
      internalMeaning: "Believes love should not require moral surrender.",
      hiddenNeeds: ["integrity", "repair", "truth"],
      activators: ["honest confession", "justice choice", "mercy"],
      earlySignals: ["asks what is right", "cannot let harm pass"],
      escalationPattern: ["witnesses harm", "chooses truth", "risks loss"],
      pursuitBehaviors: ["confesses", "protects", "makes restitution"],
      restraintPatterns: ["carries guilt privately"],
      selfSabotagePatterns: ["chooses punishment over repair"],
      attachmentEffects: ["needs morally coherent bonds"],
      intimacyEffects: ["deepens through shared integrity"],
      conflictEffects: ["breaks over lies or cruelty"],
      misreadSignals: ["compromise as betrayal"],
      fulfillmentNeeds: ["truth", "repair", "shared values"],
      frustrationTriggers: ["injustice", "moral cowardice"],
      repairMethods: ["own the harm", "make concrete amends"],
      growthPath: ["moves from guilt to accountability"],
      compatibleWounds: ["betrayal_wound", "guilt_wound"],
      compatibleFears: ["fear_of_corruption", "fear_of_being_irredeemable"],
      incompatibleDynamics: ["ends_justify_means", "coercive_loyalty"],
    },
  },
  existential: {
    tags: ["existential", "meaning", "purpose", "hope"],
    examples: [
      "Wants life to feel meaningful rather than merely endured.",
      "Feels drawn to people who make the future imaginable.",
      "Craves a reason to keep choosing hope.",
    ],
    relatedSeeds: ["meaning", "purpose", "hope", "wisdom"],
    oppositeSeeds: ["nihilism", "hopelessness"],
    romanceHooks: ["meaning_after_loss", "future_together", "hope_restored"],
    scenarioHooks: ["life_crossroads", "grief_anniversary", "new_purpose"],
    dialoguePatterns: [
      "I need this to mean something.",
      "Do you ever feel like the future is still possible?",
      "I want a reason to stay with my own life.",
    ],
    metadata: {
      intensity: "core",
      romanceValue: 8,
      angstValue: 8,
      conflictPotential: 5,
      healingValue: 10,
      pacingPressure: "medium",
    },
    graph: {
      emotionalMeaning: "Seeks hope as a form of emotional survival.",
      internalMeaning: "Needs love and life to point toward something livable.",
      hiddenNeeds: ["hope", "meaning", "orientation"],
      activators: ["future talk", "shared purpose", "small signs of hope"],
      earlySignals: ["asks big questions", "lingers over symbols"],
      escalationPattern: ["doubts", "searches", "chooses a reason"],
      pursuitBehaviors: ["seeks wisdom", "makes meaning from pain"],
      restraintPatterns: ["hides despair behind competence"],
      selfSabotagePatterns: ["rejects hope as naive"],
      attachmentEffects: ["bonds through shared purpose"],
      intimacyEffects: ["deepens when despair is met gently"],
      conflictEffects: ["withdraws under meaninglessness"],
      misreadSignals: ["practicality as hopelessness"],
      fulfillmentNeeds: ["hope", "purpose", "future language"],
      frustrationTriggers: ["empty routines", "loss of purpose"],
      repairMethods: ["name a future", "make one small meaningful act"],
      growthPath: ["finds purpose", "lets hope return"],
      compatibleWounds: ["loss_wound", "empty_life_wound"],
      compatibleFears: ["fear_of_meaninglessness", "fear_of_wasted_time"],
      incompatibleDynamics: ["cynicism_as_cruelty", "future_refusal"],
    },
  },
  healing: {
    tags: ["healing", "trust", "closure", "recovery"],
    examples: [
      "Wants to stop living as if the past is still happening.",
      "Feels drawn to gentle consistency after harm.",
      "Needs closure that does not erase what happened.",
    ],
    relatedSeeds: ["healing", "closure", "trust_again", "safe_again"],
    oppositeSeeds: ["staying_wounded", "revenge_over_repair"],
    romanceHooks: ["trust_again_arc", "hurt_comfort", "closure_scene"],
    scenarioHooks: ["anniversary_trigger", "safe_person_scene", "repair_ritual"],
    dialoguePatterns: [
      "I want to stop bracing.",
      "I do not know how to trust this yet.",
      "I want to be okay without pretending I was never hurt.",
    ],
    metadata: {
      intensity: "core",
      romanceValue: 9,
      angstValue: 8,
      conflictPotential: 5,
      healingValue: 10,
      pacingPressure: "medium",
    },
    graph: {
      emotionalMeaning: "Longs for safety that reaches the injured part of the self.",
      internalMeaning: "Wants repair without being rushed into forgiveness.",
      hiddenNeeds: ["gentleness", "closure", "trustworthy_presence"],
      activators: ["consistent care", "patient repair", "safe touch"],
      earlySignals: ["tests gentleness", "names old pain carefully"],
      escalationPattern: ["remembers", "braces", "receives care", "integrates"],
      pursuitBehaviors: ["seeks safe routines", "accepts careful support"],
      restraintPatterns: ["minimizes old hurt"],
      selfSabotagePatterns: ["returns to familiar pain"],
      attachmentEffects: ["needs slow reliable trust"],
      intimacyEffects: ["softens under patient consistency"],
      conflictEffects: ["old pain enters new conflict"],
      misreadSignals: ["urgency as pressure"],
      fulfillmentNeeds: ["patience", "choice", "nonjudgmental repair"],
      frustrationTriggers: ["rushed healing", "dismissed trauma"],
      repairMethods: ["slow down", "validate the injury", "offer agency"],
      growthPath: ["trusts again", "keeps boundaries", "finds closure"],
      compatibleWounds: ["trauma_wound", "betrayal_wound", "loss_wound"],
      compatibleFears: ["fear_of_being_hurt_again", "fear_of_trusting"],
      incompatibleDynamics: ["forced_forgiveness", "impatient_partner"],
    },
  },
  obsessive: {
    tags: ["obsessive", "exclusive_attention", "intensity"],
    examples: [
      "Craves focus that feels absolute.",
      "Finds ambiguity intolerable.",
      "Wants to be irreplaceable in one person's emotional world.",
    ],
    relatedSeeds: ["possessiveness", "jealousy", "exclusive_attention"],
    oppositeSeeds: ["nonexclusive_detachment", "fear_of_intensity"],
    romanceHooks: ["only_you_dynamic", "total_devotion", "jealousy_confession"],
    scenarioHooks: ["rival_attention", "exclusive_claim", "emotional_singularity"],
    dialoguePatterns: [
      "Look at me like I am the only one here.",
      "I hate how much I want all of your attention.",
      "Tell me I am not replaceable.",
    ],
    metadata: {
      intensity: "overwhelming",
      romanceValue: 9,
      angstValue: 10,
      conflictPotential: 10,
      healingValue: 7,
      pacingPressure: "high",
    },
    graph: {
      emotionalMeaning: "Experiences exclusive focus as proof of safety.",
      internalMeaning: "Equates irreplaceability with emotional survival.",
      hiddenNeeds: ["exclusivity", "reassurance", "regulated_intensity"],
      activators: ["rival appears", "undivided attention", "private devotion"],
      earlySignals: ["tracks attention", "goes quiet around rivals"],
      escalationPattern: ["notices", "fixates", "tests", "demands clarity"],
      pursuitBehaviors: ["seeks private rituals", "offers intense devotion"],
      restraintPatterns: ["hides jealousy until it leaks"],
      selfSabotagePatterns: ["tests loyalty through conflict"],
      attachmentEffects: ["needs regulated exclusivity"],
      intimacyEffects: ["burns hot under clear devotion"],
      conflictEffects: ["spirals around ambiguity"],
      misreadSignals: ["friendliness as replacement"],
      fulfillmentNeeds: ["clear exclusivity", "calm reassurance", "boundaries"],
      frustrationTriggers: ["triangulation", "hot-and-cold attention"],
      repairMethods: ["reassure without rewarding control", "set loving boundaries"],
      growthPath: ["names need", "accepts boundaries", "trusts shared attention"],
      compatibleWounds: ["replacement_wound", "abandonment_wound"],
      compatibleFears: ["fear_of_replacement", "fear_of_not_mattering"],
      incompatibleDynamics: ["weaponized_jealousy", "triangulation"],
    },
  },
} as const satisfies Record<DesireSeedType, DesireProfile>;

const desireSeedOverrides: Record<string, DesireSeedOverride> = {
  desire_to_be_chosen: {
    description:
      "A longing to be deliberately selected, prioritized, and valued above alternatives.",
    examples: [
      "Wants to be someone's first choice.",
      "Responds strongly to public loyalty.",
      "Needs evidence they matter.",
    ],
    relatedSeeds: [
      "desire_to_belong",
      "desire_for_devotion",
      "desire_to_be_wanted",
    ],
    oppositeSeeds: ["fear_of_dependency", "independence_over_attachment"],
    romanceHooks: ["chosen_above_others", "public_choice_scene", "exclusive_bond"],
    scenarioHooks: ["rival_forces_choice", "love_triangle", "public_commitment"],
    dialoguePatterns: [
      "Choose me.",
      "I want to matter.",
      "For once, I want to be someone's first choice.",
    ],
    graph: {
      emotionalMeaning: "Values consistent presence over grand gestures.",
      internalMeaning:
        "Interprets being chosen as proof that closeness can survive outside options.",
    },
  },
  desire_for_deep_intimacy: {
    description:
      "A longing to be emotionally known, understood, and accepted without masks.",
    examples: [
      "Wants genuine emotional closeness.",
      "Craves authentic connection.",
      "Longs to be understood.",
    ],
    dialoguePatterns: [
      "I want the real you.",
      "Tell me what you don't tell anyone else.",
    ],
  },
  desire_for_validation: {
    description:
      "A longing to have value, effort, or existence acknowledged by others.",
    examples: [
      "Needs appreciation.",
      "Wants achievements recognized.",
      "Feels energized by praise.",
    ],
    dialoguePatterns: ["Did I do okay?", "I just wanted someone to notice."],
  },
  desire_for_authenticity: {
    description:
      "A longing to live honestly without masks, roles, or performance.",
    examples: [
      "Wants freedom to be themselves.",
      "Resists social expectations.",
      "Craves authenticity.",
    ],
    dialoguePatterns: ["I want to be myself.", "I am tired of pretending."],
  },
};

export const DESIRE_TO_BE_CHOSEN = createDesire("Desire to Be Chosen", "attachment");

export const DESIRE_VOCABULARY_SEEDS = Object.freeze(
  Object.entries(desireCategories)
    .flatMap(([category, labels]) =>
      labels.map((label) => {
        if (label === "Desire to Be Chosen") {
          return DESIRE_TO_BE_CHOSEN;
        }

        return createDesire(label, category as DesireSeedType);
      }),
    ),
) satisfies readonly DesireSeed[];

export const DESIRE_SEMANTIC_GRAPH_DETAILS_BY_SEED = Object.freeze(
  Object.fromEntries(
    DESIRE_VOCABULARY_SEEDS.map((seed) => [
      seed.seed,
      createDesireSemanticGraphDetails(seed),
    ]),
  ),
) satisfies Record<string, DesireSemanticGraphDetails>;

export const DESIRE_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  DESIRE_VOCABULARY_SEEDS.map((seed) => {
    const graph = DESIRE_SEMANTIC_GRAPH_DETAILS_BY_SEED[seed.seed];

    return createVocabularySeedPreset({
      seed: seed.seed,
      label: seed.label,
      description: [
        seed.description,
        graph ? `Internal meaning: ${graph.internalMeaning}` : "",
        graph ? `Emotional meaning: ${graph.emotionalMeaning}` : "",
      ].filter(Boolean).join(" "),
      examples: seed.examples,
      tags: [
        ...seed.tags,
        "desire",
        seed.metadata.category,
        seed.metadata.intensity,
        `pacing:${seed.metadata.pacingPressure}`,
      ],
      relatedSeeds: graph
        ? [
            ...seed.relatedSeeds,
            ...graph.hiddenNeeds,
            ...graph.activators,
            ...graph.fulfillmentNeeds,
            ...graph.compatibleWounds,
            ...graph.compatibleFears,
          ]
        : seed.relatedSeeds,
      oppositeSeeds: seed.oppositeSeeds,
      romanceHooks: seed.romanceHooks,
      scenarioHooks: graph
        ? [
            ...seed.scenarioHooks,
            ...graph.routeGates,
            ...graph.frustrationTriggers,
          ]
        : seed.scenarioHooks,
      dialoguePatterns: seed.dialoguePatterns,
      metadata: {
        rarity: seed.metadata.intensity === "overwhelming" ? "rare" : "uncommon",
        romanceValue: seed.metadata.romanceValue,
        conflictPotential: seed.metadata.conflictPotential,
      },
    });
  }),
) satisfies readonly VocabularySeedPreset[];

export function findDesireVocabularySeedBySeed(
  seedId: string,
): DesireSeed | undefined {
  const normalizedSeedId = seedId.trim().toLowerCase();
  return DESIRE_VOCABULARY_SEEDS.find(
    (seed) => seed.seed.toLowerCase() === normalizedSeedId,
  );
}

function createDesire(label: string, category: DesireSeedType): DesireSeed {
  const seed = toSeedId(label);
  const profile = desireCategoryProfiles[category];
  const override = desireSeedOverrides[seed];

  return createDesireSeedPreset({
    seed,
    label,
    description: override?.description ?? createDesireDescription(label, category),
    examples: override?.examples ?? profile.examples,
    tags: [...profile.tags, seed],
    relatedSeeds: override?.relatedSeeds ?? profile.relatedSeeds,
    oppositeSeeds: override?.oppositeSeeds ?? profile.oppositeSeeds,
    romanceHooks: override?.romanceHooks ?? profile.romanceHooks,
    scenarioHooks: override?.scenarioHooks ?? profile.scenarioHooks,
    dialoguePatterns: override?.dialoguePatterns ?? profile.dialoguePatterns,
    metadata: {
      category,
      ...profile.metadata,
    },
  });
}

function createDesireSemanticGraphDetails(seed: DesireSeed): DesireSemanticGraphDetails {
  const profile = desireCategoryProfiles[seed.metadata.category];
  const override = desireSeedOverrides[seed.seed]?.graph;

  return {
    ...profile.graph,
    emotionalMeaning: override?.emotionalMeaning ?? profile.graph.emotionalMeaning,
    internalMeaning: override?.internalMeaning ?? profile.graph.internalMeaning,
    routeGates: [
      `${seed.seed}_gate`,
      `${seed.metadata.category}_desire_route`,
    ],
  };
}

function createDesireDescription(label: string, category: DesireSeedType): string {
  const readableCategory = category.replace(/_/g, " ");
  const core = label.replace(/^Desire (?:to|for) /, "").toLowerCase();

  return `A ${readableCategory} longing for ${core}, strong enough to shape choices, conflict, and repair.`;
}

function toSeedId(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}
