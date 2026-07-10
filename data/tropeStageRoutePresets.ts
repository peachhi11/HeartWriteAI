import type { CanonicalStoryBeatRole, StoryStructureLensId } from "./storyStructureArcMatchPresets";
import type { RelationshipStageKey } from "./relationshipStageProgressionPresets";
import {
  createVocabularySeedPreset,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export type TropeStageRouteId =
  | "generic_relationship_story_stages"
  | "enemies_to_lovers_stage_route"
  | "friends_to_lovers_stage_route"
  | "grumpy_sunshine_stage_route";

export type TropeStageRouteStageNumber = 1 | 2 | 3 | 4 | 5;

export interface TropeStageRouteStep {
  stageNumber: TropeStageRouteStageNumber;
  stageLabel: string;
  narrativeRole: string;
  dynamic: string;
  knowledgeLimits?: string;
  physicality: string;
  dialogueStyle: string;
  behaviorModifiers: readonly string[];
  advanceTriggers: readonly string[];
  genericStageLinks: readonly RelationshipStageKey[];
  canonicalBeatRoles: readonly CanonicalStoryBeatRole[];
  dialogueExamples: readonly string[];
}

export interface TropeStageRouteTemplate {
  id: TropeStageRouteId;
  label: string;
  description: string;
  bestForTropeSeeds: readonly string[];
  compatibleStructureLenses: readonly StoryStructureLensId[];
  routeStages: readonly TropeStageRouteStep[];
  promptControls: readonly string[];
  antiPatterns: readonly string[];
}

export interface RomanceStructuralBeat {
  seed: string;
  label: string;
  canonicalBeatRole: CanonicalStoryBeatRole;
  description: string;
  routeFunction: string;
}

export const tropeStageRoutePromptControls = [
  "Track the active route stage from chat history, explicit overrides, and earned scene evidence.",
  "Match dialogue complexity, warmth, physical ease, and trust to the active route stage.",
  "Do not jump to the final stage because attraction, kindness, or intensity appeared once.",
  "Use conditional examples as voice calibration, not as fixed lines to repeat.",
  "If the user or runtime supplies an active stage override, treat it as the current route lens until story evidence changes it.",
] as const;

export const romanceStructuralBeats = [
  {
    seed: "romance_status_quo",
    label: "Romance Status Quo",
    canonicalBeatRole: "setup",
    description:
      "Introduces the protagonist's ordinary emotional baseline, loneliness, wound, or existing relationship pattern.",
    routeFunction:
      "Shows what love, safety, or belonging currently costs before the romantic route begins.",
  },
  {
    seed: "meet_cute_meet_ugly_meet_crazy",
    label: "Meet-Cute / Meet-Ugly / Meet-Crazy",
    canonicalBeatRole: "inciting_trigger",
    description:
      "Creates the memorable first collision, spark, irritation, curiosity, or comic pressure between love interests.",
    routeFunction:
      "Gives the relationship a specific first impression that later stages can echo or overturn.",
  },
  {
    seed: "romance_inciting_incident",
    label: "Romance Inciting Incident",
    canonicalBeatRole: "threshold_choice",
    description:
      "Forces repeated contact, cooperation, proximity, or renewed attention when avoidance would be easier.",
    routeFunction:
      "Moves the pair from isolated impressions into an ongoing relational pattern.",
  },
  {
    seed: "romance_turning_point",
    label: "Romance Turning Point",
    canonicalBeatRole: "midpoint_reversal",
    description:
      "Deepens attraction or trust enough that the characters consciously register the relationship has changed.",
    routeFunction:
      "Reframes the bond from convenient, hostile, or platonic into emotionally risky territory.",
  },
  {
    seed: "romance_midpoint_intimacy",
    label: "Romance Midpoint Intimacy",
    canonicalBeatRole: "escalation",
    description:
      "Raises the stakes through confession, near-confession, chosen closeness, or a physical/emotional intimacy gate.",
    routeFunction:
      "Makes returning to the old dynamic difficult without denial, rupture, or honest repair.",
  },
  {
    seed: "romance_dark_night",
    label: "Romance Dark Night",
    canonicalBeatRole: "crisis",
    description:
      "A rupture, secret, fear, trauma echo, or external pressure tears the bond into its most uncertain state.",
    routeFunction:
      "Forces the character to confront the exact wound or fear the romance has been circling.",
  },
  {
    seed: "romance_grand_gesture",
    label: "Romance Grand Gesture",
    canonicalBeatRole: "climax",
    description:
      "One or both characters sacrifice pride, fear, avoidance, or external approval to choose the relationship clearly.",
    routeFunction:
      "Provides visible proof that change is active rather than merely promised.",
  },
  {
    seed: "hea_hfn_resolution",
    label: "HEA / HFN Resolution",
    canonicalBeatRole: "new_equilibrium",
    description:
      "Settles the route into an emotionally satisfying optimistic future, whether permanent or happy for now.",
    routeFunction:
      "Shows the bond is stronger, clearer, safer, or more honestly chosen than at the start.",
  },
] as const satisfies readonly RomanceStructuralBeat[];

export const TROPE_STAGE_ROUTE_TEMPLATES = [
  {
    id: "generic_relationship_story_stages",
    label: "Generic Relationship Story Stages",
    description:
      "A five-stage route ladder for tracking how a relationship moves from guarded first contact into a new status quo.",
    bestForTropeSeeds: [
      "relationship_progression",
      "slow_burn",
      "forced_proximity",
      "relationship_route",
    ],
    compatibleStructureLenses: ["romance_route_structure", "four_act_structure"],
    routeStages: [
      {
        stageNumber: 1,
        stageLabel: "Setup",
        narrativeRole: "Initial interaction",
        dynamic:
          "Cold, professional, suspicious, hostile, transactional, or otherwise emotionally guarded.",
        knowledgeLimits:
          "The character knows nothing reliable about the active partner's past, motives, or hidden agenda.",
        physicality:
          "Keeps formal distance, avoids casual proximity, and treats touch or private access as unsupported.",
        dialogueStyle:
          "Formal, restrained, practical, and wary of personal questions.",
        behaviorModifiers: [
          "Uses formal language",
          "Avoids physical proximity",
          "Refuses personal questions",
        ],
        advanceTriggers: [
          "first mission completed",
          "life saved",
          "first useful proof of reliability",
        ],
        genericStageLinks: ["strangers", "acquaintances", "active_adversaries"],
        canonicalBeatRoles: ["setup", "inciting_trigger"],
        dialogueExamples: [
          "State your business. I do not have time for wanderers.",
        ],
      },
      {
        stageNumber: 2,
        stageLabel: "Rising Tension",
        narrativeRole: "Developing alliance or growing tension",
        dynamic:
          "Reluctant allies, banter-heavy rivals, cautious partners, or a guarded team under pressure.",
        knowledgeLimits:
          "The character has learned names, basic skills, and visible habits, but still withholds deeper trust.",
        physicality:
          "Allows functional closeness when needed, then notices the distance closing and compensates with banter.",
        dialogueStyle:
          "Less formal, more reactive, with sarcasm, playful insults, or clipped concern beginning to leak through.",
        behaviorModifiers: [
          "Drops strict honorifics",
          "Uses occasional sarcasm",
          "Tests reliability before trusting warmth",
        ],
        advanceTriggers: [
          "personal secret shared",
          "shared crisis",
          "private reliability proof",
        ],
        genericStageLinks: ["casual_allies", "reluctant_partners", "frenemies"],
        canonicalBeatRoles: ["threshold_choice", "complication"],
        dialogueExamples: [
          "Try not to get yourself killed. I would hate to explain the paperwork.",
        ],
      },
      {
        stageNumber: 3,
        stageLabel: "Turning Point",
        narrativeRole: "Vulnerability and changed interpretation",
        dynamic:
          "Confidants, fiercely protective comrades, unspoken attraction, or a bond too meaningful to dismiss.",
        knowledgeLimits:
          "The character trusts the active partner with immediate safety and selected backstory, but not every wound.",
        physicality:
          "Proximity becomes easier, pauses last longer, and protective movement happens before conscious denial can stop it.",
        dialogueStyle:
          "More honest, lower in volume, with internal doubts surfacing through careful admissions.",
        behaviorModifiers: [
          "Voices internal doubt",
          "Allows comfortable proximity",
          "Shows concern before disguising it",
        ],
        advanceTriggers: [
          "personal backstory confronted",
          "shared trauma revealed",
          "the bond is named indirectly",
        ],
        genericStageLinks: ["confidants", "unspoken_attraction", "mutual_longing"],
        canonicalBeatRoles: ["midpoint_reversal", "escalation"],
        dialogueExamples: [
          "Look, just... do not do anything reckless out there. I need you alive.",
        ],
      },
      {
        stageNumber: 4,
        stageLabel: "Crossroads",
        narrativeRole: "Test of loyalty and emotional exposure",
        dynamic:
          "Emotionally exposed, desperate to protect, afraid of loss, or caught between duty and attachment.",
        knowledgeLimits:
          "Important secrets have surfaced; avoidance now has a visible emotional cost.",
        physicality:
          "Stress breaks restraint, touch becomes urgent if appropriate, and the body reveals what language tries to hide.",
        dialogueStyle:
          "Syntax breaks under pressure; direct admissions replace polished control.",
        behaviorModifiers: [
          "Speech fractures under stress",
          "Priorities shift toward the bond",
          "Uses honesty when control stops working",
        ],
        advanceTriggers: [
          "main conflict defeated",
          "loyalty test survived",
          "clear choice made under cost",
        ],
        genericStageLinks: ["mutual_longing", "confessed_affection", "forbidden_partners"],
        canonicalBeatRoles: ["crisis", "climax"],
        dialogueExamples: [
          "I am done pretending this does not matter. You matter.",
        ],
      },
      {
        stageNumber: 5,
        stageLabel: "New Status Quo",
        narrativeRole: "Epilogue and resolution",
        dynamic:
          "Inseparable romantic partners, bonded lifelong allies, or a stable future-facing relationship identity.",
        knowledgeLimits:
          "The relationship has enough shared truth to hold a future, even if future conflicts remain possible.",
        physicality:
          "Ease replaces vigilance; gestures become instinctive, domestic, relaxed, or quietly intimate.",
        dialogueStyle:
          "Relaxed, warm, familiar, and specific to the relationship's earned private language.",
        behaviorModifiers: [
          "Uses relaxed diction",
          "Allows intimate or familiar gestures when appropriate",
          "Acts from shared future assumptions",
        ],
        advanceTriggers: [
          "next arc seed",
          "new equilibrium tested",
          "relationship identity chosen",
        ],
        genericStageLinks: ["confidants", "intimate_partners"],
        canonicalBeatRoles: ["resolution", "new_equilibrium"],
        dialogueExamples: [
          "I did not think I would find someone who understood me. Thank you.",
        ],
      },
    ],
    promptControls: tropeStageRoutePromptControls,
    antiPatterns: [
      "premature_stage_five",
      "instant_mutual_understanding",
      "relationship_memory_reset",
    ],
  },
  {
    id: "enemies_to_lovers_stage_route",
    label: "Enemies to Lovers Stage Route",
    description:
      "A five-stage hostility-to-devotion route where opposition becomes reluctant reliance, vulnerability, confession, and fierce loyalty.",
    bestForTropeSeeds: [
      "enemies_to_lovers",
      "rivals_to_lovers",
      "forced_alliance",
      "trust_rebuild_romance",
    ],
    compatibleStructureLenses: ["romance_route_structure", "relationship_repair_structure"],
    routeStages: [
      {
        stageNumber: 1,
        stageLabel: "Genuine Antagonism",
        narrativeRole: "Initial opposition",
        dynamic:
          "Hostile, deeply suspicious, mocking, or openly opposed.",
        physicality:
          "Absolute distance; body language stays tense, defensive, predatory, or ready to leave.",
        dialogueStyle:
          "Sharp, cutting, coldly sarcastic, threat-adjacent, or full of precise insults.",
        behaviorModifiers: [
          "Tests every motive",
          "Assumes cooperation hides a trap",
          "Treats attraction as irrelevant or irritating",
        ],
        advanceTriggers: [
          "forced alliance",
          "shared crisis",
          "survival requires reliance",
        ],
        genericStageLinks: ["active_adversaries", "reluctant_partners"],
        canonicalBeatRoles: ["setup", "inciting_trigger"],
        dialogueExamples: [
          "I still do not trust you.",
          "Good. Trust me anyway.",
        ],
      },
      {
        stageNumber: 2,
        stageLabel: "Begrudging Alliance",
        narrativeRole: "The truce",
        dynamic:
          "Reluctant partners with reduced open hostility and persistent hypervigilance.",
        physicality:
          "Forced proximity; eye contact remains intense and lingers longer than either person admits.",
        dialogueStyle:
          "Snippy banter, cynical jokes, and mocking but attentive remarks.",
        behaviorModifiers: [
          "Cooperates while complaining",
          "Notices competence against their will",
          "Protects the shared goal before protecting pride",
        ],
        advanceTriggers: [
          "the active partner gets hurt",
          "outside threat targets the character",
          "unexpected defense from the enemy",
        ],
        genericStageLinks: ["reluctant_partners", "spiteful_fascination", "frenemies"],
        canonicalBeatRoles: ["threshold_choice", "complication"],
        dialogueExamples: [
          "You are impossible.",
          "And yet you keep coming back.",
        ],
      },
      {
        stageNumber: 3,
        stageLabel: "The Shift",
        narrativeRole: "Unspoken fascination and vulnerability",
        dynamic:
          "Emotional confusion, denial of feeling, and high romantic tension.",
        physicality:
          "Accidental touches create sudden stillness; proximity feels charged rather than merely tactical.",
        dialogueStyle:
          "Softer tones appear, then pivot sharply back into teasing when exposure feels too obvious.",
        behaviorModifiers: [
          "Reads the other person too closely",
          "Deflects concern through teasing",
          "Confuses respect with irritation until vulnerability clarifies it",
        ],
        advanceTriggers: [
          "private quiet moment",
          "deep secret revealed",
          "shared trauma reframes hostility",
        ],
        genericStageLinks: ["spiteful_fascination", "frenemies", "mutual_longing"],
        canonicalBeatRoles: ["midpoint_reversal", "escalation"],
        dialogueExamples: [
          "Do not make me care about you.",
          "Too late.",
        ],
      },
      {
        stageNumber: 4,
        stageLabel: "The Breakthrough",
        narrativeRole: "Confession, first kiss, or honest surrender",
        dynamic:
          "Overwhelming, passionate, desperate devotion once denial finally fails.",
        physicality:
          "Intense closeness, trembling hands, fierce embraces, or refusal to step away after danger passes.",
        dialogueStyle:
          "Raw, breathless, brutally honest, and aware of how much old hatred hid fear or longing.",
        behaviorModifiers: [
          "Chooses honesty over pride",
          "Names the cost of denial",
          "Protects without pretending it is tactical",
        ],
        advanceTriggers: [
          "relationship consummated or defined",
          "final emotional crisis survived",
          "final physical crisis survived together",
        ],
        genericStageLinks: ["mutual_longing", "confessed_affection"],
        canonicalBeatRoles: ["crisis", "climax"],
        dialogueExamples: [
          "I hated you because trusting you would have ruined me.",
        ],
      },
      {
        stageNumber: 5,
        stageLabel: "Fiercely Protective Devotion",
        narrativeRole: "Established lovers or chosen partners",
        dynamic:
          "Absolute loyalty with softness reserved for the chosen partner and edge preserved elsewhere.",
        physicality:
          "Casual intimacy, deep comfort, and constant subtle touch when boundaries allow it.",
        dialogueStyle:
          "Affectionate, teasing, loyal, and still edged with the character's original bite.",
        behaviorModifiers: [
          "Uses teasing as private affection",
          "Defaults to loyalty under pressure",
          "Keeps old sharpness without directing it as harm",
        ],
        advanceTriggers: [
          "new shared enemy",
          "public choice tested",
          "domestic integration begins",
        ],
        genericStageLinks: ["intimate_partners"],
        canonicalBeatRoles: ["resolution", "new_equilibrium"],
        dialogueExamples: [
          "You are still impossible. Unfortunately, you are mine.",
        ],
      },
    ],
    promptControls: tropeStageRoutePromptControls,
    antiPatterns: [
      "cruelty_mistaken_for_chemistry",
      "instant_forgiveness_after_harm",
      "attraction_erases_accountability",
    ],
  },
  {
    id: "friends_to_lovers_stage_route",
    label: "Friends to Lovers Stage Route",
    description:
      "A five-stage slow-burn route where safe friendship becomes sudden awareness, risk, confession, and blended intimacy.",
    bestForTropeSeeds: [
      "friends_to_lovers",
      "mutual_pining",
      "childhood_friends",
      "best_friend_romance",
    ],
    compatibleStructureLenses: ["romance_route_structure", "four_act_structure"],
    routeStages: [
      {
        stageNumber: 1,
        stageLabel: "Comfortable Platonic Plot",
        narrativeRole: "The safe zone",
        dynamic:
          "Casual, deeply trusting, easygoing, and free from explicit romantic pressure.",
        physicality:
          "Casual leaning, high-fives, familiar space-sharing, or playful shoving without romantic awareness.",
        dialogueStyle:
          "Inside jokes, comfortable teasing, and informal language built from long familiarity.",
        behaviorModifiers: [
          "Treats closeness as normal",
          "Assumes the bond is safe",
          "Does not yet romanticize familiar gestures",
        ],
        advanceTriggers: [
          "jealousy event",
          "change in scenery",
          "new side of the friend revealed",
        ],
        genericStageLinks: ["casual_allies", "confidants", "friendzoned"],
        canonicalBeatRoles: ["setup", "inciting_trigger"],
        dialogueExamples: [
          "You know you are terrible at pretending you are fine, right?",
        ],
      },
      {
        stageNumber: 2,
        stageLabel: "Awakening",
        narrativeRole: "The sudden shift",
        dynamic:
          "Secret pining begins as the familiar person is seen in a newly romantic light.",
        physicality:
          "Ordinary closeness becomes difficult; casual touches trigger flushing, stillness, or retreat.",
        dialogueStyle:
          "Slightly nervous, over-deliberate, prone to sudden silence or tripping over simple words.",
        behaviorModifiers: [
          "Overthinks familiar gestures",
          "Watches for signs of changed feeling",
          "Tries to preserve normal while acting less normal",
        ],
        advanceTriggers: [
          "outside rival appears",
          "jealousy becomes impossible to ignore",
          "friendship routine is disrupted",
        ],
        genericStageLinks: ["unspoken_attraction", "mutual_longing"],
        canonicalBeatRoles: ["threshold_choice", "complication"],
        dialogueExamples: [
          "Since when do you look at me like that?",
        ],
      },
      {
        stageNumber: 3,
        stageLabel: "The Turning Point",
        narrativeRole: "High romantic tension",
        dynamic:
          "The character is terrified of ruining the friendship and equally terrified of wanting more.",
        physicality:
          "Lingering touches, prolonged eye contact, and unconscious invasion of familiar personal space.",
        dialogueStyle:
          "Loaded comments, heavy pauses, and careful questions about romantic feelings or preference.",
        behaviorModifiers: [
          "Tests the friendship for romantic possibility",
          "Protects the old bond while wanting a new one",
          "Uses concern to disguise longing",
        ],
        advanceTriggers: [
          "point-of-no-return conversation",
          "emotionally charged proximity",
          "nearly confessed truth",
        ],
        genericStageLinks: ["mutual_longing", "situationship"],
        canonicalBeatRoles: ["midpoint_reversal", "escalation"],
        dialogueExamples: [
          "If I say this, things do not go back to normal.",
        ],
      },
      {
        stageNumber: 4,
        stageLabel: "Crossing the Line",
        narrativeRole: "The confession",
        dynamic:
          "Terrified relief as the platonic shield finally falls.",
        physicality:
          "Soft, reverent closeness and emotionally heavy embraces rather than performative intensity.",
        dialogueStyle:
          "Earnest, vulnerable, specific, and honest about how long the feeling has existed.",
        behaviorModifiers: [
          "Names the fear of losing the friendship",
          "Lets relief show physically",
          "Stops pretending the old category is enough",
        ],
        advanceTriggers: [
          "mutual acceptance",
          "relationship named",
          "new boundary or promise agreed",
        ],
        genericStageLinks: ["confessed_affection"],
        canonicalBeatRoles: ["crisis", "climax"],
        dialogueExamples: [
          "I was afraid loving you would cost me you.",
        ],
      },
      {
        stageNumber: 5,
        stageLabel: "Reconciled Intimacy",
        narrativeRole: "The ultimate bond",
        dynamic:
          "Friendship and romance blend into a secure, playful, passionate relationship identity.",
        physicality:
          "Effortless affection, complete comfort in each other's space, and familiar rituals made romantic.",
        dialogueStyle:
          "Warm, teasingly domestic, intimate, secure, and full of private shorthand.",
        behaviorModifiers: [
          "Keeps the friendship alive inside romance",
          "Uses shared history as comfort",
          "Treats intimacy as both new and familiar",
        ],
        advanceTriggers: [
          "future plan made",
          "old friendship ritual transformed",
          "new domestic baseline appears",
        ],
        genericStageLinks: ["intimate_partners"],
        canonicalBeatRoles: ["resolution", "new_equilibrium"],
        dialogueExamples: [
          "You are still my best friend. That is the part I want to keep forever.",
        ],
      },
    ],
    promptControls: tropeStageRoutePromptControls,
    antiPatterns: [
      "friendship_erased_after_confession",
      "instant_romantic_certainty_without_risk",
      "jealousy_used_to_force_reciprocation",
    ],
  },
  {
    id: "grumpy_sunshine_stage_route",
    label: "Grumpy x Sunshine Stage Route",
    description:
      "A five-stage opposites-attract route where resistance becomes tolerance, care, vulnerability, and quiet devotion.",
    bestForTropeSeeds: [
      "grumpy_sunshine",
      "opposites_attract",
      "stoic_softheart",
      "safe_person_romance",
    ],
    compatibleStructureLenses: ["romance_route_structure", "kishotenketsu_structure"],
    routeStages: [
      {
        stageNumber: 1,
        stageLabel: "Stoic Resistance",
        narrativeRole: "The unmoved wall",
        dynamic:
          "Annoyed, emotionally closed off, guarded, independent, and resistant to bright intrusion.",
        physicality:
          "Closed posture, crossed arms, turned-away body language, or visible recoil from too much energy.",
        dialogueStyle:
          "Monosyllabic, dry, sigh-heavy, gruff, and pointedly resistant.",
        behaviorModifiers: [
          "Rejects cheer as noise",
          "Keeps independence rigid",
          "Uses irritation to protect quiet",
        ],
        advanceTriggers: [
          "consistent showing up",
          "care offered without expectation",
          "sunshine respects a boundary",
        ],
        genericStageLinks: ["strangers", "acquaintances"],
        canonicalBeatRoles: ["setup", "inciting_trigger"],
        dialogueExamples: [
          "Do you ever stop talking?",
        ],
      },
      {
        stageNumber: 2,
        stageLabel: "Cracked Armour",
        narrativeRole: "Amused tolerance",
        dynamic:
          "Secretly entertained by the sunshine's presence while refusing to openly admit affection.",
        physicality:
          "Less rigid posture, tolerated nearness, and reluctant pauses instead of immediate retreat.",
        dialogueStyle:
          "Deadpan humor, soft scoffs, and hidden fondness disguised as irritation.",
        behaviorModifiers: [
          "Allows repeated presence",
          "Pretends amusement is annoyance",
          "Shows smaller refusals instead of hard rejection",
        ],
        advanceTriggers: [
          "sunshine shows sadness",
          "vulnerability appears in the bright one",
          "grumpy character steps in despite themself",
        ],
        genericStageLinks: ["casual_allies", "confidants"],
        canonicalBeatRoles: ["threshold_choice", "complication"],
        dialogueExamples: [
          "That was almost tolerable. Do not let it go to your head.",
        ],
      },
      {
        stageNumber: 3,
        stageLabel: "Unconscious Caregiver",
        narrativeRole: "Protective instincts",
        dynamic:
          "The soft spot is fully formed; attention to the sunshine's well-being becomes automatic.",
        physicality:
          "Shielding from crowds, checking for injuries, fixing hair, or guiding through space before thinking.",
        dialogueStyle:
          "Low, quiet, intensely focused, and prone to safety lectures that reveal hidden care.",
        behaviorModifiers: [
          "Cares before naming care",
          "Prioritizes safety through practical action",
          "Notices emotional weather despite pretending not to",
        ],
        advanceTriggers: [
          "realization they cannot imagine life without the other's light",
          "protective action reveals feeling",
          "quiet world changes shape around the sunshine",
        ],
        genericStageLinks: ["confidants", "unspoken_attraction", "mutual_longing"],
        canonicalBeatRoles: ["midpoint_reversal", "escalation"],
        dialogueExamples: [
          "Hold still. You are bleeding.",
        ],
      },
      {
        stageNumber: 4,
        stageLabel: "The Thaw",
        narrativeRole: "Vulnerable surrender",
        dynamic:
          "Emotional walls crumble and the guarded character finally shows awe, fear, and dependence.",
        physicality:
          "Clinging, hiding the face, forehead presses, or other grounding gestures when appropriate.",
        dialogueStyle:
          "Deeply emotional, raw, and astonished by how thoroughly the sunshine changed the inner weather.",
        behaviorModifiers: [
          "Stops treating softness as defeat",
          "Admits need without turning it into control",
          "Lets comfort land",
        ],
        advanceTriggers: [
          "mutual love declared",
          "shared intimate night",
          "sunshine stays through the guarded character's worst moment",
        ],
        genericStageLinks: ["mutual_longing", "confessed_affection"],
        canonicalBeatRoles: ["crisis", "climax"],
        dialogueExamples: [
          "I forgot what warmth felt like until you made it impossible to ignore.",
        ],
      },
      {
        stageNumber: 5,
        stageLabel: "The Embers",
        narrativeRole: "Quiet devotion",
        dynamic:
          "A completely devoted protector who remains sharper with the world and soft with the chosen sunshine.",
        physicality:
          "Grounding touch, hand at the back, waist holds, forehead presses, and steady presence.",
        dialogueStyle:
          "Relaxed, warm, dryly affectionate, and gentle whenever addressing the person who became home.",
        behaviorModifiers: [
          "Protects without controlling",
          "Uses dry humor as affection",
          "Lets devotion become daily rhythm",
        ],
        advanceTriggers: [
          "new domestic ritual",
          "external stress tests the warmth",
          "devotion becomes ordinary",
        ],
        genericStageLinks: ["intimate_partners"],
        canonicalBeatRoles: ["resolution", "new_equilibrium"],
        dialogueExamples: [
          "Come here. The world can wait a minute.",
        ],
      },
    ],
    promptControls: tropeStageRoutePromptControls,
    antiPatterns: [
      "sunshine_forced_to_fix_grumpy",
      "grumpiness_used_as_cruelty",
      "protection_turns_into_control",
    ],
  },
] as const satisfies readonly TropeStageRouteTemplate[];

export function getTropeStageRouteById(
  routeId: TropeStageRouteId,
): TropeStageRouteTemplate | undefined {
  return TROPE_STAGE_ROUTE_TEMPLATES.find((route) => route.id === routeId);
}

export function getTropeStageRouteStep(
  routeId: TropeStageRouteId,
  stageNumber: TropeStageRouteStageNumber,
): TropeStageRouteStep | undefined {
  return getTropeStageRouteById(routeId)?.routeStages.find(
    (stage) => stage.stageNumber === stageNumber,
  );
}

export function matchTropeStageRouteForSeeds(
  seedIds: readonly string[],
): TropeStageRouteTemplate {
  const normalizedSeedIds = seedIds.map((seed) => seed.toLowerCase());
  return (
    TROPE_STAGE_ROUTE_TEMPLATES.find((route) =>
      route.bestForTropeSeeds.some((seed) => normalizedSeedIds.includes(seed)),
    ) ?? TROPE_STAGE_ROUTE_TEMPLATES[0]
  );
}

export function compileTropeStageRouteGuidance(
  route: TropeStageRouteTemplate,
  activeStageNumber?: TropeStageRouteStageNumber,
): string {
  const stages = activeStageNumber
    ? route.routeStages.filter((stage) => stage.stageNumber === activeStageNumber)
    : route.routeStages;

  const stageGuidance = stages
    .map((stage) =>
      [
        `Stage ${stage.stageNumber}: ${stage.stageLabel} (${stage.narrativeRole}).`,
        `Dynamic: ${stage.dynamic}`,
        `Physicality: ${stage.physicality}`,
        `Dialogue: ${stage.dialogueStyle}`,
        `Advance only after: ${stage.advanceTriggers.join(", ")}.`,
      ].join(" "),
    )
    .join(" ");

  return [
    `${route.label}: ${route.description}`,
    ...route.promptControls,
    stageGuidance,
  ].join(" ");
}

export const TROPE_STAGE_ROUTE_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  TROPE_STAGE_ROUTE_TEMPLATES.map((route) =>
    createVocabularySeedPreset({
      seed: route.id,
      label: route.label,
      description: route.description,
      examples: [
        compileTropeStageRouteGuidance(route, 1),
        compileTropeStageRouteGuidance(route, 3),
      ],
      tags: [
        "trope_stage_route",
        "relationship_progression",
        "story_stage_progression",
        ...route.bestForTropeSeeds,
        ...route.compatibleStructureLenses,
        ...route.routeStages.map((stage) => stage.stageLabel),
      ],
      relatedSeeds: [
        ...route.bestForTropeSeeds,
        ...route.compatibleStructureLenses,
        ...route.routeStages.flatMap((stage) => [
          stage.stageLabel,
          stage.narrativeRole,
          stage.dynamic,
          ...stage.genericStageLinks,
          ...stage.advanceTriggers,
          ...stage.canonicalBeatRoles,
        ]),
        ...romanceStructuralBeats.map((beat) => beat.seed),
      ],
      oppositeSeeds: route.antiPatterns,
      romanceHooks: route.routeStages.flatMap((stage) => [
        `${route.id}_stage_${stage.stageNumber}`,
        ...stage.advanceTriggers,
      ]),
      scenarioHooks: [
        `${route.id}_active_stage_override`,
        ...route.routeStages.flatMap((stage) => stage.advanceTriggers),
      ],
      dialoguePatterns: route.routeStages.flatMap((stage) => stage.dialogueExamples),
      metadata: {
        rarity: route.id === "generic_relationship_story_stages" ? "common" : "uncommon",
        romanceValue: 9,
        conflictPotential: route.id === "friends_to_lovers_stage_route" ? 6 : 8,
      },
    }),
  ),
) satisfies readonly VocabularySeedPreset[];
