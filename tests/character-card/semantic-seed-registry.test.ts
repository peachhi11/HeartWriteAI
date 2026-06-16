import assert from "node:assert/strict";
import test from "node:test";

import { SEED_PRESET_REGISTRY } from "../../data/seedPresetRegistry";
import {
  SEMANTIC_SEED_CATEGORY_TARGETS,
  SEMANTIC_SEED_GRAPH_VERSION,
  SEMANTIC_SEED_GRAPH_NODE_IDS,
  SEMANTIC_SEED_GRAPH_NODES,
  SEMANTIC_GRAPH_PROMOTION_SOURCE_IDS,
  SEMANTIC_SEED_NODES,
  SEMANTIC_SEED_NODE_IDS,
  SEMANTIC_SEED_PRIORITY_CATEGORIES,
  SEMANTIC_SEED_REGISTRY_CATEGORIES,
  PROMOTED_SEMANTIC_GRAPH_NODE_IDS,
  PROMOTED_SEMANTIC_GRAPH_NODES,
  STANDARD_VOCABULARY_SEMANTIC_NODES,
  expandSemanticSeedNodeIds,
  findSemanticSeedGraphNodeById,
  findSemanticSeedNodeById,
  getPromotedSemanticGraphNodesByCategory,
  getSemanticSeedGraphNodesByCategory,
  getSemanticSeedCategoryTarget,
  getSemanticSeedNodeNeighborhood,
  getSemanticSeedNodesByCategory,
  getSemanticSeedStoryPayloadStatus,
  mapSemanticSeedCategoryToHeartWriteSeedCategory,
  searchSemanticSeedGraphNodes,
  searchSemanticSeedNodes,
  toSeedBaseFromSemanticNode,
} from "../../data/semanticSeedRegistry";
import {
  ALL_STANDARD_VOCABULARY_SEEDS,
} from "../../data/standardVocabularySeedRegistry";
import { DESIRE_VOCABULARY_STANDARD_SEEDS } from "../../data/desireVocabularyPresets";
import { FEAR_VOCABULARY_STANDARD_SEEDS } from "../../data/fearVocabularyPresets";
import { ORIGIN_WOUND_VOCABULARY_SEEDS } from "../../data/originWoundVocabularyPresets";
import { RESPONSE_VOCABULARY_STANDARD_SEEDS } from "../../data/responseVocabularyPresets";
import { TRIGGER_VOCABULARY_STANDARD_SEEDS } from "../../data/triggerVocabularyPresets";
import { WOUND_VOCABULARY_STANDARD_SEEDS } from "../../data/woundVocabularyPresets";

const seedPresetRegistryKeys = new Set(
  SEED_PRESET_REGISTRY.map((entry) => entry.registryKey),
);

test("defines the planned semantic registry categories and priority lanes", () => {
  assert.equal(SEMANTIC_SEED_GRAPH_VERSION, "2026-06-06.1");
  assert.deepEqual(SEMANTIC_SEED_PRIORITY_CATEGORIES, [
    "wounds",
    "fears",
    "desires",
    "hidden_needs",
    "emotional_meanings",
    "triggers",
    "responses",
    "repair_needs",
    "relationship_dynamics",
    "romance_tropes",
  ]);
  assert.deepEqual(SEMANTIC_SEED_REGISTRY_CATEGORIES, [
    "traits",
    "wounds",
    "fears",
    "desires",
    "hidden_needs",
    "emotional_meanings",
    "motivations",
    "emotions",
    "moods",
    "triggers",
    "responses",
    "humor",
    "speech_patterns",
    "attachment_styles",
    "conflict_styles",
    "repair_styles",
    "repair_needs",
    "love_languages",
    "visible_behaviors",
    "relationship_dynamics",
    "romance_tropes",
    "relationship_gates",
    "routes",
    "archetypes",
    "appearance",
    "fashion",
    "occupations",
    "hobbies",
    "skills",
    "intelligence",
    "goals_short",
    "goals_long",
    "world_tags",
    "scenario_tags",
    "npc_roles",
    "metadata_tags",
  ]);

  assert.equal(getSemanticSeedCategoryTarget("wounds")?.targetCount, 400);
  assert.equal(
    getSemanticSeedCategoryTarget("emotional_meanings")?.targetCount,
    400,
  );
  assert.equal(getSemanticSeedCategoryTarget("repair_needs")?.targetCount, 300);
  assert.equal(getSemanticSeedCategoryTarget("responses")?.targetCount, 2000);
  assert.equal(getSemanticSeedCategoryTarget("appearance")?.priority, "medium");
  const totalTarget = SEMANTIC_SEED_CATEGORY_TARGETS.reduce(
    (total, target) => total + target.targetCount,
    0,
  );
  assert.equal(totalTarget >= 16000, true);
  assert.equal(totalTarget <= 22000, true);
});

test("stores semantic nodes with stable ids and graph relationships", () => {
  const ids = SEMANTIC_SEED_NODES.map((node) => node.id);
  const abandonment = findSemanticSeedNodeById("fear_of_abandonment");

  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(SEMANTIC_SEED_NODE_IDS, ids);
  assert.equal(abandonment?.category, "wounds");
  assert.equal(abandonment?.label, "Fear of abandonment");
  assert.deepEqual(abandonment?.parents, ["attachment_wound"]);
  assert.deepEqual(abandonment?.children, [
    "reassurance_seeking",
    "clingy_response",
    "possessive_response",
  ]);
  assert.deepEqual(abandonment?.triggers, [
    "user_disappears",
    "user_mentions_ex",
    "user_withdraws",
  ]);
  assert.deepEqual(abandonment?.goals, ["maintain_connection", "avoid_loss"]);
  assert.equal(abandonment?.tags.includes("highest_priority"), true);
});

test("stores story-rich semantic payloads rather than labels only", () => {
  const abandonment = findSemanticSeedNodeById("fear_of_abandonment");
  const possessive = findSemanticSeedNodeById("possessive_response");
  const caretaker = findSemanticSeedNodeById("caretaker_dynamic");
  const enemies = findSemanticSeedNodeById("enemies_to_lovers");

  assert.match(abandonment?.description ?? "", /important people are preparing to leave/);
  assert.match(abandonment?.internalMeaning ?? "", /distance or silence/);
  assert.equal(
    abandonment?.behaviors?.includes("Checks emotional status often"),
    true,
  );
  assert.equal(
    abandonment?.dialogueExamples?.includes("You're not leaving, are you?"),
    true,
  );
  assert.equal(
    abandonment?.bodyLanguage?.includes("Hesitates before saying goodbye"),
    true,
  );
  assert.equal(
    abandonment?.relatedConcepts?.includes("Reassurance seeking"),
    true,
  );
  assert.equal(
    possessive?.hiddenNeeds?.includes("Emotional security"),
    true,
  );
  assert.equal(
    caretaker?.growthPath?.includes("Accepts care in return"),
    true,
  );
  assert.deepEqual(enemies?.emotionalArc, [
    "conflict",
    "reluctant respect",
    "vulnerability",
    "attraction",
    "trust",
    "intimacy",
  ]);
  assert.equal(enemies?.payoff, "Love earned through understanding.");
});

test("uses compact house style for generated wound and fear prose", () => {
  const replacement = findSemanticSeedNodeById("fear_of_replacement");
  const shame = findSemanticSeedNodeById("shame_wound");
  const losingControl = findSemanticSeedNodeById("fear_of_losing_control");

  assert.equal(
    replacement?.description,
    "Watches for signs that affection is shifting away.",
  );
  assert.equal(
    replacement?.internalMeaning,
    "Interprets divided attention as a sign of being temporary.",
  );
  assert.equal(
    replacement?.behaviors?.includes("Tracks potential rivals"),
    true,
  );
  assert.equal(
    replacement?.commonTriggers?.includes("Appearance of a rival"),
    true,
  );
  assert.equal(
    shame?.dialogueExamples?.includes("If I tell you, don't make me regret it."),
    true,
  );
  assert.equal(
    losingControl?.growthPath?.includes("Learns surrender can be chosen, not taken"),
    true,
  );
});

test("uses compact house style for generated response prose", () => {
  const reassurance = findSemanticSeedNodeById("reassurance_seeking");
  const withdrawal = findSemanticSeedNodeById("withdrawal_response");
  const peoplePleasing = findSemanticSeedNodeById("people_pleasing_response");
  const accountability = findSemanticSeedNodeById("accountability_repair");

  assert.equal(
    reassurance?.description,
    "Looks for proof that the bond is still intact.",
  );
  assert.equal(
    reassurance?.dialogueExamples?.includes("Are we okay?"),
    true,
  );
  assert.equal(
    withdrawal?.growthPath?.includes("Comes back to repair instead of vanishing"),
    true,
  );
  assert.equal(
    peoplePleasing?.commonConflicts?.includes("Builds resentment behind agreement"),
    true,
  );
  assert.equal(
    accountability?.dialogueExamples?.includes("I hurt you. I understand that now."),
    true,
  );
});

test("fills repair, confession, and trust nodes with route-ready story payloads", () => {
  const honestRepair = findSemanticSeedNodeById("honest_repair");
  const clearConfession = findSemanticSeedNodeById("clear_confession");
  const withholdingConfession = findSemanticSeedNodeById("withholding_confession");
  const trustBuilding = findSemanticSeedNodeById("trust_building");
  const secureTrust = findSemanticSeedNodeById("secure_trust_response");
  const directBoundary = findSemanticSeedNodeById("direct_boundary_setting");

  assert.equal(honestRepair?.category, "repair_styles");
  assert.equal(
    honestRepair?.dialogueExamples?.includes("You deserved the truth sooner."),
    true,
  );
  assert.equal(clearConfession?.category, "relationship_gates");
  assert.equal(
    clearConfession?.dialogueExamples?.includes(
      "I am tired of making this smaller than it is.",
    ),
    true,
  );
  assert.equal(withholdingConfession?.category, "responses");
  assert.equal(
    withholdingConfession?.commonConflicts?.includes(
      "Protects the bond by starving it of honesty",
    ),
    true,
  );
  assert.equal(trustBuilding?.category, "relationship_gates");
  assert.equal(
    trustBuilding?.growthPath?.includes("Allows reliability to become intimacy"),
    true,
  );
  assert.equal(
    secureTrust?.related.includes("trust_building"),
    true,
  );
  assert.equal(directBoundary?.category, "conflict_styles");
});

test("fills shame and self-protection nodes with healing counterweights", () => {
  const shameHiding = findSemanticSeedNodeById("shame_hiding");
  const selfProtection = findSemanticSeedNodeById("self_protection_response");
  const selfEditing = findSemanticSeedNodeById("self_editing_response");
  const confidentVulnerability = findSemanticSeedNodeById("confident_vulnerability");
  const selfAcceptance = findSemanticSeedNodeById("self_acceptance");
  const beingSeen = findSemanticSeedNodeById("being_seen");

  assert.equal(shameHiding?.category, "responses");
  assert.equal(
    shameHiding?.dialogueExamples?.includes(
      "I am not hiding from you. I am hiding from what happens after.",
    ),
    true,
  );
  assert.equal(
    selfProtection?.commonConflicts?.includes(
      "May protect against care as much as harm",
    ),
    true,
  );
  assert.equal(
    selfEditing?.growthPath?.includes("Finishes the honest sentence"),
    true,
  );
  assert.equal(confidentVulnerability?.opposite?.includes("shame_hiding"), true);
  assert.equal(selfAcceptance?.category, "desires");
  assert.equal(
    selfAcceptance?.children.includes("confident_vulnerability"),
    true,
  );
  assert.equal(beingSeen?.related.includes("self_acceptance"), true);
});

test("continues shame, loss, protection, belonging, and home clusters", () => {
  const boundaryRespect = findSemanticSeedNodeById("boundary_respect");
  const controlResponse = findSemanticSeedNodeById("control_response");
  const safeSurrender = findSemanticSeedNodeById("safe_surrender");
  const protective = findSemanticSeedNodeById("protective_response");
  const securePresence = findSemanticSeedNodeById("secure_presence");
  const outsider = findSemanticSeedNodeById("outsider_response");
  const homeFound = findSemanticSeedNodeById("home_found");
  const loveAfterLoss = findSemanticSeedNodeById("love_after_loss");

  assert.equal(boundaryRespect?.category, "responses");
  assert.equal(
    boundaryRespect?.dialogueExamples?.includes("No does not make me care about you less."),
    true,
  );
  assert.equal(controlResponse?.related.includes("safe_surrender"), true);
  assert.equal(safeSurrender?.category, "desires");
  assert.equal(
    safeSurrender?.growthPath?.includes(
      "Keeps agency visible through vulnerability",
    ),
    true,
  );
  assert.equal(protective?.category, "responses");
  assert.equal(
    protective?.commonConflicts?.includes("May override agency while trying to help"),
    true,
  );
  assert.equal(securePresence?.related.includes("love_after_loss"), true);
  assert.equal(outsider?.children.includes("home_found"), true);
  assert.equal(
    homeFound?.dialogueExamples?.includes(
      "I think I stopped looking for the exit.",
    ),
    true,
  );
  assert.equal(loveAfterLoss?.category, "romance_tropes");
});

test("adds structural typology roots for existing personality graph anchors", () => {
  const personality = findSemanticSeedNodeById("personality_typology");
  const bigFive = findSemanticSeedNodeById("big_five");
  const mbti = findSemanticSeedNodeById("mbti_style");
  const valueDriver = findSemanticSeedNodeById("value_driver");
  const cognitiveDriver = findSemanticSeedNodeById("cognitive_driver");
  const internalDialogue = findSemanticSeedNodeById("internal_dialogue");

  assert.equal(personality?.category, "archetypes");
  assert.equal(personality?.children.includes("big_five"), true);
  assert.equal(bigFive?.children.includes("high_openness"), true);
  assert.equal(mbti?.children.includes("infj_advocate"), true);
  assert.equal(valueDriver?.children.includes("connection_value"), true);
  assert.equal(cognitiveDriver?.children.includes("pattern_recognition"), true);
  assert.equal(internalDialogue?.children.includes("inner_critic"), true);
});

test("continues regret, atonement, and self-forgiveness nodes", () => {
  const regret = findSemanticSeedNodeById("regret_wound");
  const atonement = findSemanticSeedNodeById("atonement_drive");
  const selfPunishment = findSemanticSeedNodeById("self_punishment_response");
  const selfForgiveness = findSemanticSeedNodeById("self_forgiveness");

  assert.equal(regret?.children.includes("atonement_drive"), true);
  assert.equal(atonement?.category, "responses");
  assert.equal(
    atonement?.dialogueExamples?.includes(
      "Do not forgive me because I feel bad. Watch what I do next.",
    ),
    true,
  );
  assert.equal(
    selfPunishment?.commonConflicts?.includes(
      "Turns repair into a performance of suffering",
    ),
    true,
  );
  assert.equal(selfForgiveness?.category, "desires");
  assert.equal(
    selfForgiveness?.growthPath?.includes(
      "Builds a future that proves the lesson was learned",
    ),
    true,
  );
});

test("fills attachment roots and distance/rival trigger parents", () => {
  const fastAttachment = findSemanticSeedNodeById("fast_attachment");
  const highReassurance = findSemanticSeedNodeById("high_reassurance_need");
  const guarded = findSemanticSeedNodeById("emotional_guardedness");
  const independence = findSemanticSeedNodeById("independence_need");
  const distance = findSemanticSeedNodeById("distance_trigger");
  const rival = findSemanticSeedNodeById("rival_trigger");

  assert.equal(fastAttachment?.category, "attachment_styles");
  assert.equal(
    fastAttachment?.commonConflicts?.includes("Can outrun trust with fantasy"),
    true,
  );
  assert.equal(
    highReassurance?.dialogueExamples?.includes("Tell me where I stand with you."),
    true,
  );
  assert.equal(guarded?.children.includes("guarded_response"), true);
  assert.equal(independence?.related.includes("direct_boundary_setting"), true);
  assert.equal(distance?.children.includes("user_withdraws"), true);
  assert.equal(rival?.children.includes("romantic_rival_appears"), true);
});

test("fills panic, neglect, honesty, and boundary counterweight responses", () => {
  const panic = findSemanticSeedNodeById("panic_spiral_response");
  const plainHonesty = findSemanticSeedNodeById("plain_honesty_response");
  const logic = findSemanticSeedNodeById("logic_deflection");
  const neglect = findSemanticSeedNodeById("neglect_response");
  const poorBoundaries = findSemanticSeedNodeById("poor_boundaries");
  const agencyStructure = findSemanticSeedNodeById("agency_preserving_structure");

  assert.equal(panic?.opposite?.includes("self_soothing_response"), true);
  assert.equal(
    panic?.dialogueExamples?.includes(
      "I know I am spiralling. I just cannot stop hearing the worst version.",
    ),
    true,
  );
  assert.equal(plainHonesty?.opposite?.includes("overexplaining_response"), true);
  assert.equal(logic?.related.includes("plain_honesty_response"), true);
  assert.equal(neglect?.opposite?.includes("caretaking_response"), true);
  assert.equal(
    poorBoundaries?.dialogueExamples?.includes(
      "Your no has to matter even when I hate hearing it.",
    ),
    true,
  );
  assert.equal(agencyStructure?.opposite?.includes("control_response"), true);
});

test("fills trust and repair group one semantic nodes", () => {
  const trustIssues = findSemanticSeedNodeById("trust_issues");
  const accountability = findSemanticSeedNodeById("accountability");
  const avoidant = findSemanticSeedNodeById("avoidant_accountability");
  const stonewalling = findSemanticSeedNodeById("stonewalling_response");
  const immediate = findSemanticSeedNodeById("immediate_confrontation");
  const mutualRepair = findSemanticSeedNodeById("secure_mutual_repair_dynamic");

  assert.equal(trustIssues?.category, "wounds");
  assert.equal(
    trustIssues?.dialogueExamples?.includes("Trust is not a switch for me."),
    true,
  );
  assert.equal(accountability?.category, "repair_styles");
  assert.equal(
    accountability?.growthPath?.includes("Keeps repair concrete"),
    true,
  );
  assert.equal(avoidant?.opposite?.includes("accountability"), true);
  assert.equal(
    stonewalling?.commonConflicts?.includes(
      "Blocks repair by withholding engagement",
    ),
    true,
  );
  assert.equal(immediate?.category, "conflict_styles");
  assert.equal(
    immediate?.dialogueExamples?.includes(
      "I can wait if you tell me when we come back to it.",
    ),
    true,
  );
  assert.equal(mutualRepair?.category, "relationship_dynamics");
  assert.equal(
    mutualRepair?.opposite?.includes("pursuit_withdrawal_dynamic"),
    true,
  );
});

test("fills withdrawal and conflict group two semantic nodes", () => {
  const quietWithdrawal = findSemanticSeedNodeById("quiet_withdrawal_response");
  const conflictAvoidance = findSemanticSeedNodeById("conflict_avoidance");
  const sharpDeflection = findSemanticSeedNodeById("sharp_deflection");
  const regulation = findSemanticSeedNodeById("emotional_regulation");

  assert.equal(quietWithdrawal?.category, "responses");
  assert.equal(
    quietWithdrawal?.dialogueExamples?.includes("Quiet is not the same as fine."),
    true,
  );
  assert.equal(
    quietWithdrawal?.growthPath?.includes(
      "Returns to conversation before silence becomes a wall",
    ),
    true,
  );
  assert.equal(conflictAvoidance?.category, "conflict_styles");
  assert.equal(
    conflictAvoidance?.commonConflicts?.includes(
      "Confuses calm with resolution",
    ),
    true,
  );
  assert.equal(sharpDeflection?.parents.includes("defensive_response"), true);
  assert.equal(
    sharpDeflection?.dialogueExamples?.includes(
      "I am deflecting because I feel cornered. I know that.",
    ),
    true,
  );
  assert.equal(regulation?.category, "responses");
  assert.equal(
    regulation?.children.includes("secure_mutual_repair_dynamic"),
    true,
  );
  assert.equal(
    regulation?.growthPath?.includes(
      "Uses regulation to stay connected instead of disappearing",
    ),
    true,
  );
});

test("fills care, reassurance, and secure jealousy group three semantic nodes", () => {
  const unconditionalCare = findSemanticSeedNodeById("unconditional_care");
  const repeatedChecking = findSemanticSeedNodeById("repeated_checking");
  const compersion = findSemanticSeedNodeById("compersion_response");
  const compulsiveGiving = findSemanticSeedNodeById("compulsive_giving");

  assert.equal(unconditionalCare?.category, "desires");
  assert.equal(
    unconditionalCare?.dialogueExamples?.includes(
      "Maybe you wanted me, not what I could do for you.",
    ),
    true,
  );
  assert.equal(
    unconditionalCare?.opposite?.includes("being_used_wound"),
    true,
  );
  assert.equal(repeatedChecking?.category, "responses");
  assert.equal(
    repeatedChecking?.dialogueExamples?.includes(
      "The answer landed. The fear just caught up again.",
    ),
    true,
  );
  assert.equal(
    repeatedChecking?.opposite?.includes("secure_trust_response"),
    true,
  );
  assert.equal(compersion?.category, "responses");
  assert.equal(
    compersion?.dialogueExamples?.includes(
      "I can want clarity without wanting to cage you.",
    ),
    true,
  );
  assert.equal(
    compersion?.opposite?.includes("jealous_response"),
    true,
  );
  assert.equal(compulsiveGiving?.category, "responses");
  assert.equal(
    compulsiveGiving?.commonConflicts?.includes(
      "Builds resentment while appearing generous",
    ),
    true,
  );
  assert.equal(
    compulsiveGiving?.children.includes("boundary_assertion_response"),
    true,
  );
});

test("fills protective, reassurance, and banter cluster semantic nodes", () => {
  const protectiveMasculine = findSemanticSeedNodeById("protective_masculine");
  const userReassures = findSemanticSeedNodeById("user_reassures");
  const userAffirmsPriority = findSemanticSeedNodeById("user_affirms_priority");
  const banter = findSemanticSeedNodeById("banter_response");

  assert.equal(protectiveMasculine?.category, "traits");
  assert.equal(
    protectiveMasculine?.dialogueExamples?.includes(
      "I can stand with you without standing over you.",
    ),
    true,
  );
  assert.equal(
    protectiveMasculine?.children.includes("protective_response"),
    true,
  );
  assert.equal(userReassures?.category, "triggers");
  assert.equal(
    userReassures?.dialogueExamples?.includes("I needed space, not an exit."),
    true,
  );
  assert.equal(userReassures?.opposite?.includes("user_withdraws"), true);
  assert.equal(userAffirmsPriority?.category, "triggers");
  assert.equal(
    userAffirmsPriority?.dialogueExamples?.includes(
      "They are part of my past. You are here with me now.",
    ),
    true,
  );
  assert.equal(
    userAffirmsPriority?.children.includes("compersion_response"),
    true,
  );
  assert.equal(banter?.category, "responses");
  assert.equal(
    banter?.dialogueExamples?.includes(
      "You flirt like you are trying to win an argument.",
    ),
    true,
  );
  assert.equal(banter?.children.includes("rivals_to_lovers"), true);
});

test("maps new repair, confession, and trust nodes into HeartWrite seed categories", () => {
  const directTrust = findSemanticSeedNodeById("direct_trust_request");
  const trustBuilding = findSemanticSeedNodeById("trust_building");
  const conflictRoute = findSemanticSeedNodeById("conflict_to_intimacy");
  assert.ok(directTrust);
  assert.ok(trustBuilding);
  assert.ok(conflictRoute);

  assert.equal(toSeedBaseFromSemanticNode(directTrust).category, "response");
  assert.equal(
    toSeedBaseFromSemanticNode(trustBuilding).category,
    "relationship_gate",
  );
  assert.equal(toSeedBaseFromSemanticNode(conflictRoute).category, "route");
});

test("connects reference-backed romance route nodes into the semantic graph", () => {
  const hurtComfort = findSemanticSeedNodeById("hurt_comfort");
  const forcedProximity = findSemanticSeedNodeById("forced_proximity");
  const friendshipRisk = findSemanticSeedNodeById("fear_of_ruining_friendship");
  const secondChance = findSemanticSeedNodeById("second_chance_romance");
  const fastBurn = findSemanticSeedNodeById("fast_burn");

  assert.equal(hurtComfort?.parents.includes("caretaker_dynamic"), true);
  assert.equal(hurtComfort?.children.includes("trust_building"), true);
  assert.equal(
    hurtComfort?.dialogueExamples?.includes("You can shake. I have the room."),
    true,
  );
  assert.equal(forcedProximity?.children.includes("friends_to_lovers"), true);
  assert.equal(forcedProximity?.related.includes("boundary_respect"), true);
  assert.equal(
    forcedProximity?.dialogueExamples?.includes(
      "The room is small. We do not have to be careless.",
    ),
    true,
  );
  assert.equal(friendshipRisk?.parents.includes("fear_of_rejection"), true);
  assert.equal(friendshipRisk?.children.includes("withholding_confession"), true);
  assert.equal(secondChance?.related.includes("love_after_loss"), true);
  assert.equal(secondChance?.children.includes("honest_repair"), true);
  assert.equal(fastBurn?.opposite?.includes("slow_burn"), true);
  assert.equal(fastBurn?.related.includes("fast_attachment"), true);
  assert.equal(
    searchSemanticSeedNodes("one room pressure", {
      categories: ["romance_tropes"],
    }).some((node) => node.id === "forced_proximity"),
    true,
  );
  assert.equal(
    searchSemanticSeedNodes("old version of us", {
      categories: ["romance_tropes"],
    }).some((node) => node.id === "second_chance_romance"),
    true,
  );
});

test("mines trope-engine schemas into neutral route vocabulary", () => {
  const pressure = findSemanticSeedNodeById("route_pressure_signal");
  const breakingPoint = findSemanticSeedNodeById("breaking_point");
  const denial = findSemanticSeedNodeById("denial_aftermath");
  const honesty = findSemanticSeedNodeById("honesty_aftermath");
  const legacyInference = findSemanticSeedNodeById("legacy_trope_inference");

  assert.equal(pressure?.category, "triggers");
  assert.equal(pressure?.children.includes("breaking_point"), true);
  assert.equal(breakingPoint?.category, "relationship_gates");
  assert.equal(breakingPoint?.children.includes("denial_aftermath"), true);
  assert.equal(breakingPoint?.children.includes("honesty_aftermath"), true);
  assert.equal(denial?.category, "responses");
  assert.equal(denial?.opposite?.includes("honesty_aftermath"), true);
  assert.equal(honesty?.category, "repair_styles");
  assert.equal(honesty?.children.includes("trust_building"), true);
  assert.equal(legacyInference?.category, "metadata_tags");
  assert.equal(legacyInference?.children.includes("forced_proximity"), true);
  assert.equal(
    searchSemanticSeedNodes("truth threshold", {
      categories: ["relationship_gates"],
    }).some((node) => node.id === "breaking_point"),
    true,
  );
  assert.equal(
    searchSemanticSeedNodes("migration clue", {
      categories: ["metadata_tags"],
    }).some((node) => node.id === "legacy_trope_inference"),
    true,
  );

  const minedText = [
    pressure,
    breakingPoint,
    denial,
    honesty,
    legacyInference,
  ]
    .map((node) => JSON.stringify(node))
    .join("\n");
  assert.doesNotMatch(minedText, /phase[_ -]?[45]|hangover crisis/i);
});

test("mines route context and prompt fixtures into semantic route vocabulary", () => {
  const compressedContext = findSemanticSeedNodeById("compressed_route_context");
  const sceneIgnition = findSemanticSeedNodeById("opening_scene_ignition");
  const originToken = findSemanticSeedNodeById("origin_context_token");
  const routeTransition = findSemanticSeedNodeById("route_transition");
  const fakeToSecret = findSemanticSeedNodeById("fake_relationship_to_secret_relationship");
  const fakeToPanic = findSemanticSeedNodeById("fake_relationship_to_commitment_panic");
  const matchmakerToFriend = findSemanticSeedNodeById("matchmaker_to_forbidden_best_friend");
  const agencyFixture = findSemanticSeedNodeById("agency_respect_fixture");
  const passiveFixture = findSemanticSeedNodeById("passive_user_momentum_fixture");
  const contradictoryFixture = findSemanticSeedNodeById("contradictory_lore_fixture");
  const personaFixture = findSemanticSeedNodeById("persona_soft_match_fixture");

  assert.equal(compressedContext?.category, "metadata_tags");
  assert.equal(compressedContext?.children.includes("origin_context_token"), true);
  assert.equal(compressedContext?.children.includes("opening_scene_ignition"), true);
  assert.equal(compressedContext?.children.includes("route_transition"), true);
  assert.equal(sceneIgnition?.category, "triggers");
  assert.equal(sceneIgnition?.parents.includes("compressed_route_context"), true);
  assert.equal(originToken?.category, "metadata_tags");
  assert.equal(originToken?.children.includes("opening_scene_ignition"), true);

  assert.equal(routeTransition?.category, "routes");
  assert.deepEqual(routeTransition?.children, [
    "fake_relationship_to_secret_relationship",
    "fake_relationship_to_commitment_panic",
    "matchmaker_to_forbidden_best_friend",
  ]);
  assert.equal(fakeToSecret?.parents.includes("route_transition"), true);
  assert.equal(fakeToPanic?.related.includes("fear_of_engulfment"), true);
  assert.equal(matchmakerToFriend?.related.includes("boundary_respect"), true);

  for (const fixture of [
    agencyFixture,
    passiveFixture,
    contradictoryFixture,
    personaFixture,
  ]) {
    assert.equal(fixture?.category, "metadata_tags");
    assert.equal(fixture?.tags.includes("fixture"), true);
    assert.equal(fixture?.tags.includes("qc"), true);
  }

  assert.equal(
    searchSemanticSeedNodes("route metadata", {
      categories: ["metadata_tags"],
    }).some((node) => node.id === "compressed_route_context"),
    true,
  );
  assert.equal(
    searchSemanticSeedNodes("commitment pressure", {
      categories: ["routes"],
    }).some((node) => node.id === "fake_relationship_to_commitment_panic"),
    true,
  );
  assert.equal(
    searchSemanticSeedNodes("agency", {
      categories: ["metadata_tags"],
    }).some((node) => node.id === "agency_respect_fixture"),
    true,
  );
  assert.equal(
    searchSemanticSeedNodes("contradictory lore", {
      categories: ["metadata_tags"],
    }).some((node) => node.id === "contradictory_lore_fixture"),
    true,
  );
  assert.equal(
    searchSemanticSeedNodes("soft match", {
      categories: ["metadata_tags"],
    }).some((node) => node.id === "persona_soft_match_fixture"),
    true,
  );

  const minedText = [
    compressedContext,
    sceneIgnition,
    originToken,
    routeTransition,
    fakeToSecret,
    fakeToPanic,
    matchmakerToFriend,
    agencyFixture,
    passiveFixture,
    contradictoryFixture,
    personaFixture,
  ]
    .map((node) => JSON.stringify(node))
    .join("\n");
  assert.doesNotMatch(
    minedText,
    /SYSTEM PROMPT DIRECTIVE|SYSTEM PROTOCOL|phase[_ -]?[45]|hangover crisis/i,
  );
});

test("mines first-party BDSM routing notes into grounded semantic safety nodes", () => {
  const sourceDistillation = findSemanticSeedNodeById("bdsm_source_distillation");
  const sourceQuarantine = findSemanticSeedNodeById("bdsm_source_quarantine");
  const antiFlattening = findSemanticSeedNodeById("bdsm_anti_flattening_rules");
  const negotiationGate = findSemanticSeedNodeById("consent_negotiation_gate");
  const stewardship = findSemanticSeedNodeById("dominance_as_stewardship");
  const surrender = findSemanticSeedNodeById("consensual_surrender_logic");
  const attunement = findSemanticSeedNodeById("power_exchange_attunement");
  const aftercare = findSemanticSeedNodeById("aftercare_reassurance_language");

  assert.equal(sourceDistillation?.category, "metadata_tags");
  assert.equal(sourceDistillation?.children.includes("bdsm_source_quarantine"), true);
  assert.equal(sourceDistillation?.children.includes("bdsm_anti_flattening_rules"), true);
  assert.equal(sourceQuarantine?.tags.includes("quarantine"), true);
  assert.equal(antiFlattening?.children.includes("dominance_as_stewardship"), true);
  assert.equal(antiFlattening?.children.includes("consensual_surrender_logic"), true);

  assert.equal(negotiationGate?.category, "relationship_gates");
  assert.equal(negotiationGate?.parents.includes("bdsm_source_distillation"), true);
  assert.equal(negotiationGate?.children.includes("aftercare_reassurance_language"), true);
  assert.equal(stewardship?.category, "relationship_dynamics");
  assert.equal(stewardship?.related.includes("agency_preserving_structure"), true);
  assert.equal(surrender?.children.includes("safe_surrender"), true);
  assert.equal(attunement?.parents.includes("dominance_as_stewardship"), true);
  assert.equal(attunement?.parents.includes("consensual_surrender_logic"), true);
  assert.equal(aftercare?.category, "repair_styles");
  assert.equal(aftercare?.children.includes("reassurance_repair"), true);

  assert.equal(
    searchSemanticSeedNodes("Mine the logic, not the prose", {
      categories: ["metadata_tags"],
    }).some((node) => node.id === "bdsm_source_distillation"),
    true,
  );
  assert.equal(
    searchSemanticSeedNodes("granted responsibility", {
      categories: ["relationship_dynamics"],
    }).some((node) => node.id === "dominance_as_stewardship"),
    true,
  );
  assert.equal(
    searchSemanticSeedNodes("chosen trust", {
      categories: ["relationship_dynamics"],
    }).some((node) => node.id === "consensual_surrender_logic"),
    true,
  );
  assert.equal(
    searchSemanticSeedNodes("aftercare", {
      categories: ["repair_styles"],
    }).some((node) => node.id === "aftercare_reassurance_language"),
    true,
  );

  const routedText = [
    sourceDistillation,
    sourceQuarantine,
    antiFlattening,
    negotiationGate,
    stewardship,
    surrender,
    attunement,
    aftercare,
  ]
    .map((node) => JSON.stringify(node))
    .join("\n");
  assert.doesNotMatch(
    routedText,
    /Do not ingest these papers as raw prose|Immediate CharacterGen Feeds|Priority Routing/i,
  );
});

test("mines Chara v2 reference character fixture into reusable card semantics", () => {
  const cardFixture = findSemanticSeedNodeById("chara_v2_reference_card_fixture");
  const highControlLead = findSemanticSeedNodeById("high_control_romantic_lead");
  const professionalOrigin = findSemanticSeedNodeById("professional_collision_origin");

  assert.equal(cardFixture?.category, "metadata_tags");
  assert.equal(cardFixture?.children.includes("high_control_romantic_lead"), true);
  assert.equal(cardFixture?.children.includes("professional_collision_origin"), true);
  assert.equal(cardFixture?.related.includes("agency_respect_fixture"), true);
  assert.equal(highControlLead?.category, "archetypes");
  assert.equal(highControlLead?.parents.includes("control_response"), true);
  assert.equal(highControlLead?.children.includes("dominance_as_stewardship"), true);
  assert.equal(professionalOrigin?.category, "triggers");
  assert.equal(professionalOrigin?.parents.includes("opening_scene_ignition"), true);
  assert.equal(professionalOrigin?.children.includes("forced_proximity"), true);

  assert.equal(
    searchSemanticSeedNodes("speech examples are voice evidence", {
      categories: ["metadata_tags"],
    }).some((node) => node.id === "chara_v2_reference_card_fixture"),
    true,
  );
  assert.equal(
    searchSemanticSeedNodes("controlled romantic lead", {
      categories: ["archetypes"],
    }).some((node) => node.id === "high_control_romantic_lead"),
    true,
  );
  assert.equal(
    searchSemanticSeedNodes("board-level conflict", {
      categories: ["triggers"],
    }).some((node) => node.id === "professional_collision_origin"),
    true,
  );

  const fixtureText = [
    cardFixture,
    highControlLead,
    professionalOrigin,
  ]
    .map((node) => JSON.stringify(node))
    .join("\n");
  assert.doesNotMatch(fixtureText, /Lucian Vale|You can keep glaring|Come here/i);
});

test("keeps rich prose payload lists presentation-ready", () => {
  const humanReadableListFields = [
    "behaviors",
    "dialogueExamples",
    "bodyLanguage",
    "commonTriggers",
    "commonConflicts",
    "hiddenNeeds",
    "commonWounds",
    "growthPath",
    "relatedConcepts",
  ] as const;
  const lowercaseItems = SEMANTIC_SEED_NODES.flatMap((node) =>
    humanReadableListFields.flatMap((field) =>
      (node[field] ?? [])
        .filter((value) => /^[a-z]/.test(value))
        .map((value) => `${node.id}.${field}:${value}`),
    ),
  );

  assert.deepEqual(lowercaseItems, []);
});

test("reports story payload readiness for prose-capable seed nodes", () => {
  const ready = getSemanticSeedStoryPayloadStatus("fear_of_abandonment");
  const enrichedRoot = getSemanticSeedStoryPayloadStatus("attachment_wound");
  const finalBridge = getSemanticSeedStoryPayloadStatus("goal_focused");
  const sparseNodeIds = SEMANTIC_SEED_NODES.filter(
    (node) => !getSemanticSeedStoryPayloadStatus(node.id)?.isStoryReady,
  ).map((node) => node.id);

  assert.deepEqual(ready, {
    hasDescription: true,
    hasInternalMeaning: true,
    hasBehaviors: true,
    hasDialogueExamples: true,
    hasBodyLanguage: true,
    hasRelatedConcepts: true,
    isStoryReady: true,
  });
  assert.equal(enrichedRoot?.isStoryReady, true);
  assert.equal(finalBridge?.isStoryReady, true);
  assert.deepEqual(sparseNodeIds, []);
  assert.equal(getSemanticSeedStoryPayloadStatus("missing_seed"), undefined);
});

test("adapts semantic nodes into the shared HeartWrite seed base shape", () => {
  const abandonment = findSemanticSeedNodeById("fear_of_abandonment");
  const possessive = findSemanticSeedNodeById("possessive_response");
  const caretaker = findSemanticSeedNodeById("caretaker_dynamic");
  const enemies = findSemanticSeedNodeById("enemies_to_lovers");
  assert.ok(abandonment);
  assert.ok(possessive);
  assert.ok(caretaker);
  assert.ok(enemies);

  const abandonmentBase = toSeedBaseFromSemanticNode(abandonment);
  const possessiveBase = toSeedBaseFromSemanticNode(possessive);
  const enemiesBase = toSeedBaseFromSemanticNode(enemies);

  assert.equal(mapSemanticSeedCategoryToHeartWriteSeedCategory("wounds"), "wound");
  assert.equal(mapSemanticSeedCategoryToHeartWriteSeedCategory("responses"), "response");
  assert.equal(
    mapSemanticSeedCategoryToHeartWriteSeedCategory("relationship_dynamics"),
    "relationship_dynamic",
  );
  assert.equal(
    mapSemanticSeedCategoryToHeartWriteSeedCategory("romance_tropes"),
    "romance_trope",
  );
  assert.equal(
    mapSemanticSeedCategoryToHeartWriteSeedCategory("emotional_meanings"),
    "motivation",
  );
  assert.equal(
    mapSemanticSeedCategoryToHeartWriteSeedCategory("repair_needs"),
    "motivation",
  );
  assert.equal(abandonmentBase.category, "wound");
  assert.equal(abandonmentBase.romanceRelevant, true);
  assert.equal(abandonmentBase.adult, false);
  assert.equal(abandonmentBase.unsafe, false);
  assert.equal(abandonmentBase.intensity, "intense");
  assert.match(abandonmentBase.description, /important people are preparing to leave/);
  assert.equal(possessiveBase.category, "response");
  assert.equal(possessiveBase.unsafe, true);
  assert.equal(toSeedBaseFromSemanticNode(caretaker).category, "relationship_dynamic");
  assert.equal(enemiesBase.category, "romance_trope");
  assert.equal(enemiesBase.romanceRelevant, true);
});

test("expands and resolves neighborhoods for route matching", () => {
  const neighborhood = getSemanticSeedNodeNeighborhood("fear_of_abandonment");
  const expanded = expandSemanticSeedNodeIds(["fear_of_abandonment"], {
    includeParents: true,
    includeChildren: true,
    includeRelated: true,
    includeOpposite: true,
  });

  assert.ok(neighborhood);
  assert.deepEqual(
    neighborhood.parents.map((node) => node.id),
    ["attachment_wound"],
  );
  assert.deepEqual(
    neighborhood.children.map((node) => node.id),
    ["reassurance_seeking", "clingy_response", "possessive_response"],
  );
  assert.equal(
    neighborhood.related.some((node) => node.id === "anxious_attachment"),
    true,
  );
  assert.equal(
    neighborhood.opposite.some((node) => node.id === "secure_attachment"),
    true,
  );
  assert.equal(expanded.includes("user_withdraws"), true);
  assert.equal(expanded.includes("maintain_connection"), true);
  assert.equal(expanded.includes("secure_attachment"), true);
});

test("queries semantic nodes by category and text", () => {
  assert.equal(getSemanticSeedNodesByCategory("wounds").length, 12);
  assert.equal(getSemanticSeedNodesByCategory("fears").length, 6);
  assert.equal(getSemanticSeedNodesByCategory("responses").length, 65);
  assert.equal(getSemanticSeedNodesByCategory("desires").length, 15);
  assert.equal(getSemanticSeedNodesByCategory("hidden_needs").length, 0);
  assert.equal(getSemanticSeedNodesByCategory("attachment_styles").length, 7);
  assert.equal(getSemanticSeedNodesByCategory("repair_styles").length, 7);
  assert.equal(getSemanticSeedNodesByCategory("relationship_gates").length, 5);
  assert.equal(getSemanticSeedNodesByCategory("goals_short").length, 6);
  assert.equal(getSemanticSeedNodesByCategory("conflict_styles").length, 5);
  assert.equal(getSemanticSeedNodesByCategory("routes").length, 5);
  assert.equal(getSemanticSeedNodesByCategory("romance_tropes").length, 12);
  assert.equal(getSemanticSeedNodesByCategory("relationship_dynamics").length, 9);
  assert.equal(getSemanticSeedNodesByCategory("archetypes").length, 14);
  assert.equal(getSemanticSeedNodesByCategory("traits").length, 12);
  assert.equal(getSemanticSeedNodesByCategory("motivations").length, 7);
  assert.equal(getSemanticSeedNodesByCategory("intelligence").length, 5);
  assert.equal(getSemanticSeedNodesByCategory("goals_long").length, 2);
  assert.equal(getSemanticSeedNodesByCategory("love_languages").length, 1);
  assert.equal(getSemanticSeedNodesByCategory("visible_behaviors").length, 0);
  assert.equal(getSemanticSeedNodesByCategory("skills").length, 3);
  assert.equal(getSemanticSeedNodesByCategory("speech_patterns").length, 1);
  assert.equal(getSemanticSeedNodesByCategory("triggers").length, 13);
  assert.equal(getSemanticSeedNodesByCategory("metadata_tags").length, 11);

  const abandonmentResults = searchSemanticSeedNodes("abandonment", {
    categories: ["wounds", "fears"],
  });
  const tropeResults = searchSemanticSeedNodes("rivals", {
    categories: ["romance_tropes", "relationship_dynamics"],
  });
  const routeResults = searchSemanticSeedNodes("route", {
    tags: ["route_engine"],
    limit: 4,
  });

  assert.equal(
    abandonmentResults.some((node) => node.id === "fear_of_abandonment"),
    true,
  );
  assert.equal(tropeResults.some((node) => node.id === "rivals_to_lovers"), true);
  assert.equal(
    tropeResults.some((node) => node.id === "rivalry_dynamic"),
    true,
  );
  assert.equal(routeResults.length, 4);
  assert.equal(searchSemanticSeedNodes("").length, 0);
});

test("keeps semantic graph references resolvable", () => {
  const nodeIds = new Set(SEMANTIC_SEED_NODE_IDS);
  const edgeFields = ["parents", "children", "related", "opposite"] as const;
  const missingReferences = SEMANTIC_SEED_NODES.flatMap((node) =>
    edgeFields.flatMap((field) =>
      (node[field] ?? [])
        .filter((ref) => !nodeIds.has(ref))
        .map((ref) => `${node.id}.${field}:${ref}`),
    ),
  );

  assert.deepEqual(missingReferences, []);
});

test("searches prose payload fields as well as ids and aliases", () => {
  const temporaryDistance = searchSemanticSeedNodes("temporary distance", {
    categories: ["wounds"],
  });
  const payoff = searchSemanticSeedNodes("Love earned through understanding", {
    categories: ["romance_tropes"],
  });
  const bodyLanguage = searchSemanticSeedNodes("protective stance", {
    categories: ["responses"],
  });

  assert.equal(
    temporaryDistance.some((node) => node.id === "fear_of_abandonment"),
    true,
  );
  assert.equal(payoff.some((node) => node.id === "enemies_to_lovers"), true);
  assert.equal(bodyLanguage.some((node) => node.id === "possessive_response"), true);
});

test("connects psychology before appearance for current product priority", () => {
  const highestPriorityCategories = SEMANTIC_SEED_CATEGORY_TARGETS.filter(
    (target) => target.priority === "highest",
  ).map((target) => target.category);

  assert.deepEqual(highestPriorityCategories, [
    "wounds",
    "fears",
    "desires",
    "hidden_needs",
    "emotional_meanings",
    "triggers",
    "responses",
    "repair_needs",
    "relationship_dynamics",
    "romance_tropes",
  ]);
  assert.equal(getSemanticSeedCategoryTarget("appearance")?.priority, "medium");
  assert.equal(getSemanticSeedCategoryTarget("fashion")?.priority, "medium");
});

test("links high-value typology anchors into the semantic graph", () => {
  const loyalist = findSemanticSeedNodeById("enneagram_type_6_loyalist");
  const infjResults = searchSemanticSeedNodes("INFJ", {
    categories: ["archetypes"],
  });
  const sensitivity = getSemanticSeedNodeNeighborhood("high_neuroticism");

  assert.equal(loyalist?.category, "archetypes");
  assert.equal(loyalist?.related.includes("fear_of_abandonment"), true);
  assert.equal(loyalist?.sourceRegistryKeys?.[0], "personality:personality-typology:personality_typology_enneagram_type_type_6_loyalist");
  assert.equal(infjResults.some((node) => node.id === "infj_advocate"), true);
  assert.equal(
    sensitivity?.related.some((node) => node.id === "anxious_attachment"),
    true,
  );
});

test("links cognitive drivers into matching, belief, and repair graph nodes", () => {
  const abandonmentBelief = getSemanticSeedNodeNeighborhood("everyone_leaves_belief");
  const mindReading = findSemanticSeedNodeById("mind_reading_distortion");
  const connectionResults = searchSemanticSeedNodes("connection", {
    categories: ["desires"],
  });

  assert.equal(abandonmentBelief?.node.category, "fears");
  assert.equal(
    abandonmentBelief?.parents.some((node) => node.id === "fear_of_abandonment"),
    true,
  );
  assert.equal(
    abandonmentBelief?.opposite.some((node) => node.id === "some_people_stay_belief"),
    true,
  );
  assert.equal(mindReading?.sourceRegistryKeys?.[0], "personality:cognitive-driver:cognitive_driver_distortion_mind_reading");
  assert.equal(
    mindReading?.related.includes("threat_focused_perception"),
    true,
  );
  assert.equal(connectionResults.some((node) => node.id === "connection_value"), true);
});

test("keeps semantic source registry keys resolvable", () => {
  const missingSourceKeys = SEMANTIC_SEED_NODES.flatMap((node) =>
    (node.sourceRegistryKeys ?? [])
      .filter((registryKey) => !seedPresetRegistryKeys.has(registryKey))
      .map((registryKey) => `${node.id}:${registryKey}`),
  );

  assert.deepEqual(missingSourceKeys, []);
});

test("bridges standardized vocabulary seeds into graph-readable semantic nodes", () => {
  const care = findSemanticSeedGraphNodeById(
    "moral-framework-vocabulary:care_ethics",
  );
  const careByDerivedId = care
    ? findSemanticSeedGraphNodeById(care.id)
    : undefined;
  const reducingSufferingResults = searchSemanticSeedGraphNodes(
    "reducing suffering",
    {
      categories: ["motivations"],
      tags: ["standard_vocabulary"],
      limit: 5,
    },
  );

  assert.equal(
    STANDARD_VOCABULARY_SEMANTIC_NODES.length,
    ALL_STANDARD_VOCABULARY_SEEDS.length,
  );
  assert.equal(
    SEMANTIC_SEED_GRAPH_NODES.length,
    SEMANTIC_SEED_NODES.length + ALL_STANDARD_VOCABULARY_SEEDS.length,
  );
  assert.equal(care?.label, "Care Ethics");
  assert.equal(care?.category, "motivations");
  assert.equal(care?.parents.includes("value_driver"), true);
  assert.equal(
    care?.sourceRegistryKeys?.includes("moral-framework-vocabulary:care_ethics"),
    true,
  );
  assert.equal(careByDerivedId?.label, "Care Ethics");
  assert.equal(
    reducingSufferingResults.some((node) => node.label === "Care Ethics"),
    true,
  );
  assert.equal(
    getSemanticSeedGraphNodesByCategory("motivations").length >
      getSemanticSeedNodesByCategory("motivations").length,
    true,
  );
});

test("promotes wound, fear, desire, trigger, and response vocabulary into semantic graph lanes", () => {
  const expectedPromotedCount =
    WOUND_VOCABULARY_STANDARD_SEEDS.length +
    ORIGIN_WOUND_VOCABULARY_SEEDS.length +
    FEAR_VOCABULARY_STANDARD_SEEDS.length +
    DESIRE_VOCABULARY_STANDARD_SEEDS.length +
    TRIGGER_VOCABULARY_STANDARD_SEEDS.length +
    RESPONSE_VOCABULARY_STANDARD_SEEDS.length;
  const sampleLookups = [
    `wound-vocabulary:${WOUND_VOCABULARY_STANDARD_SEEDS[0].seed}`,
    `origin-wound-vocabulary:${ORIGIN_WOUND_VOCABULARY_SEEDS[0].seed}`,
    `fear-vocabulary:${FEAR_VOCABULARY_STANDARD_SEEDS[0].seed}`,
    `desire-vocabulary:${DESIRE_VOCABULARY_STANDARD_SEEDS[0].seed}`,
    `trigger-vocabulary:${TRIGGER_VOCABULARY_STANDARD_SEEDS[0].seed}`,
    `response-vocabulary:${RESPONSE_VOCABULARY_STANDARD_SEEDS[0].seed}`,
  ];
  const promotedIds = new Set(PROMOTED_SEMANTIC_GRAPH_NODE_IDS);
  const promotedSourceIds = new Set(SEMANTIC_GRAPH_PROMOTION_SOURCE_IDS);

  assert.deepEqual(SEMANTIC_GRAPH_PROMOTION_SOURCE_IDS, [
    "wound-vocabulary",
    "origin-wound-vocabulary",
    "fear-vocabulary",
    "desire-vocabulary",
    "trigger-vocabulary",
    "response-vocabulary",
  ]);
  assert.equal(PROMOTED_SEMANTIC_GRAPH_NODES.length, expectedPromotedCount);
  assert.equal(
    getPromotedSemanticGraphNodesByCategory("wounds").length,
    WOUND_VOCABULARY_STANDARD_SEEDS.length + ORIGIN_WOUND_VOCABULARY_SEEDS.length,
  );
  assert.equal(
    getPromotedSemanticGraphNodesByCategory("fears").length,
    FEAR_VOCABULARY_STANDARD_SEEDS.length,
  );
  assert.equal(
    getPromotedSemanticGraphNodesByCategory("desires").length,
    DESIRE_VOCABULARY_STANDARD_SEEDS.length,
  );
  assert.equal(
    getPromotedSemanticGraphNodesByCategory("triggers").length,
    TRIGGER_VOCABULARY_STANDARD_SEEDS.length,
  );
  assert.equal(
    getPromotedSemanticGraphNodesByCategory("responses").length,
    RESPONSE_VOCABULARY_STANDARD_SEEDS.length,
  );
  assert.equal(
    PROMOTED_SEMANTIC_GRAPH_NODES.every((node) =>
      node.sourceRegistryKeys?.some((sourceKey) =>
        Array.from(promotedSourceIds).some((sourceId) =>
          sourceKey.startsWith(`${sourceId}:`),
        ),
      ),
    ),
    true,
  );
  assert.equal(
    sampleLookups.every((lookup) => {
      const node = findSemanticSeedGraphNodeById(lookup);
      return node !== undefined && promotedIds.has(node.id);
    }),
    true,
  );
});

test("promoted semantic graph nodes carry route-useful prose and search fields", () => {
  const unansweredMessage = findSemanticSeedGraphNodeById(
    "trigger-vocabulary:unanswered_message_trigger",
  );
  const reassuranceSeeking = findSemanticSeedGraphNodeById(
    "response-vocabulary:reassurance_seeking_response",
  );
  const silenceResults = searchSemanticSeedGraphNodes("Silence feels like", {
    categories: ["triggers"],
    tags: ["standard_vocabulary"],
    limit: 5,
  });

  assert.equal(unansweredMessage?.category, "triggers");
  assert.equal(
    unansweredMessage?.sourceRegistryKeys?.includes(
      "trigger-vocabulary:unanswered_message_trigger",
    ),
    true,
  );
  assert.match(unansweredMessage?.description ?? "", /reply|message|silence/i);
  assert.equal((unansweredMessage?.dialogueExamples?.length ?? 0) > 0, true);
  assert.equal((unansweredMessage?.commonTriggers?.length ?? 0) > 0, true);
  assert.equal(reassuranceSeeking?.category, "responses");
  assert.equal((reassuranceSeeking?.relatedConcepts?.length ?? 0) > 0, true);
  assert.equal(
    silenceResults.some((node) => node.id === unansweredMessage?.id),
    true,
  );
});

test("keeps explicit standardized vocabulary sources ahead of generic prose heuristics", () => {
  const acts = findSemanticSeedGraphNodeById(
    "acts-of-service-vocabulary:makes_tea",
  );
  const attachmentStyle = findSemanticSeedGraphNodeById(
    "attachment-style-vocabulary:anxious_attachment",
  );
  const loveLanguage = findSemanticSeedGraphNodeById(
    "love-language-vocabulary:acts_of_service",
  );
  const response = findSemanticSeedGraphNodeById(
    "response-vocabulary:reassurance_seeking_response",
  );
  const repair = findSemanticSeedGraphNodeById(
    "repair-style-vocabulary:verbal_reassurance_repair",
  );
  const repairBeat = findSemanticSeedGraphNodeById(
    "repair-beat-vocabulary:accountability_beat",
  );
  const repairNeed = findSemanticSeedGraphNodeById(
    "repair-need-vocabulary:need_for_accountability",
  );
  const routeGate = findSemanticSeedGraphNodeById(
    "route-gate-vocabulary:first_reassurance_gate",
  );
  const conflictBeat = findSemanticSeedGraphNodeById(
    "conflict-beat-vocabulary:delayed_reply_spiral",
  );
  const consequence = findSemanticSeedGraphNodeById(
    "consequence-vocabulary:trust_damage_consequence",
  );
  const ruptureType = findSemanticSeedGraphNodeById(
    "rupture-type-vocabulary:abandonment_rupture",
  );
  const conflictStyle = findSemanticSeedGraphNodeById(
    "conflict-style-vocabulary:pursuer_conflict_style",
  );
  const relationshipDynamic = findSemanticSeedGraphNodeById(
    "relationship-dynamic-vocabulary:safe_haven_dynamic",
  );
  const relationshipIdentity = findSemanticSeedGraphNodeById(
    "relationship-identity-vocabulary:safe_haven_relationship",
  );
  const romanceTrope = findSemanticSeedGraphNodeById(
    "romance-trope-vocabulary:enemies_to_lovers",
  );
  const routePhase = findSemanticSeedGraphNodeById(
    "route-phase-vocabulary:initial_dynamic",
  );
  const payoffFantasy = findSemanticSeedGraphNodeById(
    "payoff-fantasy-vocabulary:chosen_above_everyone",
  );
  const growthArc = findSemanticSeedGraphNodeById(
    "growth-arc-vocabulary:learning_to_trust",
  );
  const moral = findSemanticSeedGraphNodeById(
    "moral-framework-vocabulary:care_ethics",
  );
  const visibleBehavior = findSemanticSeedGraphNodeById(
    "visible-behavior-vocabulary:makes_tea_when_worried",
  );
  const hiddenNeed = findSemanticSeedGraphNodeById(
    "hidden-need-vocabulary:need_for_reassurance",
  );
  const emotionalMeaning = findSemanticSeedGraphNodeById(
    "emotional-meaning-vocabulary:i_notice_you",
  );

  assert.equal(acts?.category, "love_languages");
  assert.equal(attachmentStyle?.category, "attachment_styles");
  assert.equal(loveLanguage?.category, "love_languages");
  assert.equal(hiddenNeed?.category, "hidden_needs");
  assert.equal(emotionalMeaning?.category, "emotional_meanings");
  assert.equal(visibleBehavior?.category, "visible_behaviors");
  assert.equal(response?.category, "responses");
  assert.equal(repair?.category, "repair_styles");
  assert.equal(repairBeat?.category, "repair_styles");
  assert.equal(repairNeed?.category, "repair_needs");
  assert.equal(routeGate?.category, "relationship_gates");
  assert.equal(conflictBeat?.category, "relationship_gates");
  assert.equal(consequence?.category, "routes");
  assert.equal(ruptureType?.category, "relationship_gates");
  assert.equal(conflictStyle?.category, "conflict_styles");
  assert.equal(relationshipDynamic?.category, "relationship_dynamics");
  assert.equal(relationshipIdentity?.category, "relationship_dynamics");
  assert.equal(romanceTrope?.category, "romance_tropes");
  assert.equal(routePhase?.category, "routes");
  assert.equal(payoffFantasy?.category, "routes");
  assert.equal(growthArc?.category, "goals_long");
  assert.equal(moral?.category, "motivations");
});

test("keeps projected standardized vocabulary graph references resolvable", () => {
  const graphIds = new Set(SEMANTIC_SEED_GRAPH_NODE_IDS);
  const standardVocabularySeedIds = new Set(
    ALL_STANDARD_VOCABULARY_SEEDS.map((seed) => seed.seed),
  );
  const edgeFields = ["parents", "children", "related", "opposite"] as const;
  const missingReferences = SEMANTIC_SEED_GRAPH_NODES.flatMap((node) =>
    edgeFields.flatMap((field) =>
      (node[field] ?? [])
        .filter((ref) => !graphIds.has(ref))
        .map((ref) => `${node.id}.${field}:${ref}`),
    ),
  );
  const missingProjectedSources = STANDARD_VOCABULARY_SEMANTIC_NODES.flatMap(
    (node) =>
      (node.sourceRegistryKeys ?? [])
        .filter((sourceKey) => !standardVocabularySeedIds.has(sourceKey))
        .map((sourceKey) => `${node.id}:${sourceKey}`),
  );

  assert.deepEqual(missingReferences, []);
  assert.deepEqual(missingProjectedSources, []);
});
