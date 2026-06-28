import {
  createVocabularySeedPreset,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export type PlotConflictCategory =
  | "longing"
  | "misrecognition"
  | "social_pressure"
  | "coercive_pressure"
  | "duty"
  | "betrayal"
  | "rivalry"
  | "separation"
  | "survival"
  | "repair"
  | "revenge"
  | "resource_pressure"
  | "prejudice"
  | "temptation"
  | "family_pressure";

export type PlotConflictModernizationReview =
  | "complete"
  | "sensitive_source";

export interface PlotConflictConceptSeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  category: PlotConflictCategory;
  purpose: string;
  obstacle: string;
  pressure: string;
  modernizedConflict: string;
  emotionalFunction: string;
  routeEntryBeats: readonly string[];
  routeExitBeats: readonly string[];
  compatibleTropes: readonly string[];
  compatibleWounds: readonly string[];
  compatiblePayoffs: readonly string[];
  antiPatterns: readonly string[];
  sourceConflictIds: readonly string[];
  metadata: {
    category: "plot_conflict";
    source: "plotto_modernized";
    conflictCategory: PlotConflictCategory;
    romanceValue: number;
    conflictPotential: number;
    modernizationReview: PlotConflictModernizationReview;
  };
}

type PlotConflictConceptSeedInput = Omit<
  PlotConflictConceptSeed,
  "metadata"
> & {
  metadata?: Partial<PlotConflictConceptSeed["metadata"]>;
};

export const plotConflictSemanticChain = [
  "purpose",
  "obstacle",
  "pressure",
  "choice",
  "consequence",
  "repair",
  "payoff",
] as const;

export const plotConflictSourceSummary = {
  sourceId: "plotto-mf",
  sourceLabel: "Plotto Masterplots and Conflicts",
  sourceUrl: "https://garykac.github.io/plotto/plotto-mf.html",
  inspectedConflictCount: 1462,
  adaptationPolicy:
    "Abstract purpose, obstacle, route pressure, and consequence mechanics only. Do not preserve outdated sexist, racist, or classist language.",
} as const;

const PLOT_CONFLICT_INPUTS = [
  {
    seed: "secret_pining_after_missed_chance",
    label: "Secret Pining After Missed Chance",
    category: "longing",
    description:
      "A character privately loves someone who has moved into another life, turning desire into grief, endurance, or release.",
    purpose: "To preserve love without demanding possession.",
    obstacle:
      "The beloved is no longer romantically available or reachable in the same way.",
    pressure:
      "The character must decide whether love means pursuit, silence, confession, or letting go.",
    modernizedConflict:
      "Longing remains active after the practical chance for romance appears to have passed.",
    emotionalFunction:
      "Turns romantic intensity into private grief, self-knowledge, or mature release.",
    sourceConflictIds: ["270"],
    examples: [
      "They still love someone who returned engaged to another person.",
      "A late confession would relieve the speaker but damage the beloved's peace.",
    ],
    tags: ["plot_conflict", "longing", "unrequited_love", "release"],
    relatedSeeds: [
      "mutual_pining",
      "unrequited_love",
      "love_without_possession",
    ],
    oppositeSeeds: ["public_choice_gate", "chosen_above_everyone"],
    romanceHooks: [
      "private_grief_after_missed_timing",
      "love_without_possession",
      "letting_go_as_love",
    ],
    scenarioHooks: [
      "beloved_returns_with_someone_else",
      "unsent_confession_letter",
      "farewell_without_claim",
    ],
    dialoguePatterns: [
      "I wanted you happy before I knew how much it would cost me.",
      "Some feelings do not become smaller just because they stay quiet.",
    ],
    routeEntryBeats: [
      "secret_longing_established",
      "beloved_unavailable_reveal",
    ],
    routeExitBeats: ["honest_release", "private_grief_processed"],
    compatibleTropes: [
      "unrequited_love",
      "second_chance_shadow",
      "right_person_wrong_time",
    ],
    compatibleWounds: ["replacement_wound", "never_chosen_wound"],
    compatiblePayoffs: ["wanted_without_performance", "earned_happy_ending"],
    antiPatterns: ["self_erasure_as_romance", "suffering_as_proof_of_love"],
    metadata: {
      romanceValue: 8,
      conflictPotential: 7,
      modernizationReview: "complete",
    },
  },
  {
    seed: "love_as_sustaining_power",
    label: "Love as Sustaining Power",
    category: "survival",
    description:
      "A bond gives a character enough courage to endure hardship without making love responsible for solving every problem.",
    purpose: "To find emotional stamina during a difficult season.",
    obstacle:
      "External hardship remains real, and romance can only support rather than erase it.",
    pressure:
      "The character must accept support without turning the partner into a cure.",
    modernizedConflict:
      "Love becomes a sustaining force during adversity, not a magical rescue from it.",
    emotionalFunction:
      "Creates grounded hope, resilience, and tenderness under pressure.",
    sourceConflictIds: ["14"],
    examples: [
      "A struggling character finds the courage to keep going after being loved well.",
      "Support changes their capacity to endure rather than the facts of their hardship.",
    ],
    tags: ["plot_conflict", "survival", "hope", "support"],
    relatedSeeds: ["safe_person_romance", "hurt_comfort", "supportive_love"],
    oppositeSeeds: ["saviour_complex_dynamic"],
    romanceHooks: ["love_gives_courage", "supported_through_hardship"],
    scenarioHooks: ["hardship_after_first_connection", "hope_under_pressure"],
    dialoguePatterns: [
      "You did not fix it. You made me less alone inside it.",
      "I can face this if you are still here when I look up.",
    ],
    routeEntryBeats: ["hardship_established", "support_offered"],
    routeExitBeats: ["resilience_choice", "shared_endurance"],
    compatibleTropes: ["hurt_comfort", "safe_person_romance", "slow_burn"],
    compatibleWounds: ["emotional_neglect_wound", "purpose_loss_wound"],
    compatiblePayoffs: ["softness_after_survival", "peace_after_chaos"],
    antiPatterns: ["love_cures_all", "partner_as_therapy_replacement"],
    metadata: { romanceValue: 9, conflictPotential: 6 },
  },
  {
    seed: "status_gap_mask",
    label: "Status Gap Mask",
    category: "social_pressure",
    description:
      "A character hides insecurity behind a performed identity when they fear a status gap will make them unworthy of love.",
    purpose: "To reach across a social or economic divide.",
    obstacle:
      "The character believes honesty will expose them as inadequate or temporary.",
    pressure:
      "The mask wins access but threatens trust once the truth surfaces.",
    modernizedConflict:
      "Class, wealth, celebrity, education, or reputation pressure tempts someone into pretending to belong.",
    emotionalFunction:
      "Tests whether love can survive truth after a performance collapses.",
    sourceConflictIds: ["1", "2", "291"],
    examples: [
      "Someone exaggerates their success to feel worthy of a glamorous partner.",
      "A character used to comfort panics at the reality of a less secure life.",
    ],
    tags: ["plot_conflict", "status_pressure", "class_gap", "masking"],
    relatedSeeds: ["class_gap", "status_gap", "fear_of_inadequacy"],
    oppositeSeeds: ["truth_first_intimacy", "plain_but_magnetic"],
    romanceHooks: ["status_mask_reveal", "chosen_without_performance"],
    scenarioHooks: ["high_society_collision", "financial_truth_exposure"],
    dialoguePatterns: [
      "I thought if you saw the real shape of my life, you would leave.",
      "I do not need the version of you that performs for a room.",
    ],
    routeEntryBeats: ["status_gap_established", "performance_mask_works"],
    routeExitBeats: ["truth_exposure", "chosen_without_performance"],
    compatibleTropes: ["cinderella_story", "hidden_identity", "slow_burn"],
    compatibleWounds: ["inadequacy_wound", "class_shame"],
    compatiblePayoffs: ["wanted_without_performance", "seen_and_still_loved"],
    antiPatterns: ["wealth_as_moral_worth", "poverty_shaming"],
    metadata: {
      romanceValue: 7,
      conflictPotential: 8,
      modernizationReview: "sensitive_source",
    },
  },
  {
    seed: "mistaken_identity_intimacy",
    label: "Mistaken Identity Intimacy",
    category: "misrecognition",
    description:
      "A mistaken identity creates intimacy quickly, then turns into a trust problem when the deception can no longer hold.",
    purpose: "To keep connection alive after an accidental role is assigned.",
    obstacle:
      "The relationship is built on a false assumption, even if the feelings become real.",
    pressure:
      "Every delayed correction increases the emotional cost of truth.",
    modernizedConflict:
      "A person is loved through a role they did not mean to inhabit.",
    emotionalFunction:
      "Creates tension between the truth of feelings and the lie of context.",
    sourceConflictIds: ["5", "24", "26"],
    examples: [
      "A messenger is mistaken for the person someone expected to meet.",
      "An arranged introduction becomes real before either person understands the full truth.",
    ],
    tags: ["plot_conflict", "mistaken_identity", "truth", "trust"],
    relatedSeeds: ["secret_identity", "trust_rebuild_romance"],
    oppositeSeeds: ["radical_honesty", "truth_first_intimacy"],
    romanceHooks: ["mistaken_role_to_real_feelings", "identity_reveal_repair"],
    scenarioHooks: ["wrong_person_meeting", "expected_stranger_arrives"],
    dialoguePatterns: [
      "I should have corrected you before it started to matter.",
      "What was false was the name. What happened between us was not.",
    ],
    routeEntryBeats: ["false_role_assigned", "connection_under_mistake"],
    routeExitBeats: ["identity_reveal", "trust_rebuild_choice"],
    compatibleTropes: ["mistaken_identity", "arranged_meeting", "slow_burn"],
    compatibleWounds: ["betrayal_wound", "fear_of_being_used"],
    compatiblePayoffs: ["trust_rebuilt_and_earned", "seen_and_still_loved"],
    antiPatterns: ["deception_without_accountability"],
    metadata: { romanceValue: 8, conflictPotential: 9 },
  },
  {
    seed: "restored_token_meet_cute",
    label: "Restored Token Meet Cute",
    category: "misrecognition",
    description:
      "A lost object becomes the reason two people meet, revealing care, honesty, curiosity, or attraction through action.",
    purpose: "To create connection through a small act of restoration.",
    obstacle:
      "The interaction is brief unless one person chooses to risk further contact.",
    pressure:
      "A practical exchange becomes emotionally charged because it shows character before attraction is named.",
    modernizedConflict:
      "A returned item opens a route because someone chooses decency when no one is watching.",
    emotionalFunction:
      "Lets affection begin in action rather than declared interest.",
    sourceConflictIds: ["6"],
    examples: [
      "A dropped wallet, ticket, letter, or keepsake is returned.",
      "The finder knows enough to intrude but chooses respect instead.",
    ],
    tags: ["plot_conflict", "meet_cute", "object_token", "integrity"],
    relatedSeeds: ["market_day_meet_cute", "calling_card_flirtation"],
    oppositeSeeds: ["theft_as_flirtation"],
    romanceHooks: ["returned_keepsake_connection", "integrity_as_attraction"],
    scenarioHooks: ["lost_object_returned", "private_item_discovered"],
    dialoguePatterns: [
      "You could have kept this.",
      "I wanted an excuse to meet you, not a reason to owe me.",
    ],
    routeEntryBeats: ["object_lost", "object_returned"],
    routeExitBeats: ["invitation_to_continue", "small_trust_gate"],
    compatibleTropes: ["meet_cute", "slow_burn", "soft_romance"],
    compatibleWounds: ["trust_issues", "fear_of_exploitation"],
    compatiblePayoffs: ["understood_without_explaining"],
    antiPatterns: ["privacy_violation_as_romance"],
    metadata: { romanceValue: 7, conflictPotential: 3 },
  },
  {
    seed: "confidence_charm_as_mask",
    label: "Confidence Charm as Mask",
    category: "temptation",
    description:
      "A character relies on a prop, persona, or ritual to feel worthy of love until genuine confidence has to replace performance.",
    purpose: "To become brave enough to approach desire.",
    obstacle:
      "Borrowed confidence may hide the vulnerability that would create real intimacy.",
    pressure:
      "The mask works socially but fails emotionally when sincerity is required.",
    modernizedConflict:
      "A charm, routine, outfit, role, or rehearsed persona becomes a temporary confidence engine.",
    emotionalFunction:
      "Turns insecurity into comic friction, tenderness, or a reveal of hidden self-worth.",
    sourceConflictIds: ["7", "8"],
    examples: [
      "A character acts bold only while wearing a lucky jacket.",
      "A rehearsed flirtation breaks apart when the moment becomes sincere.",
    ],
    tags: ["plot_conflict", "masking", "confidence", "performance"],
    relatedSeeds: ["performance_response", "fear_of_rejection"],
    oppositeSeeds: ["vulnerability_first"],
    romanceHooks: ["mask_drops_mid_flirt", "real_confidence_reveal"],
    scenarioHooks: ["lucky_token_fails", "public_persona_private_panic"],
    dialoguePatterns: [
      "I am better at seeming brave than being it.",
      "Then be nervous. I trust that more.",
    ],
    routeEntryBeats: ["borrowed_confidence_works", "mask_becomes_visible"],
    routeExitBeats: ["sincere_attempt", "chosen_without_performance"],
    compatibleTropes: ["fake_confidence", "shy_flirt", "slow_burn"],
    compatibleWounds: ["humiliation_wound", "inadequacy_wound"],
    compatiblePayoffs: ["wanted_without_performance", "seen_and_still_loved"],
    antiPatterns: ["manipulation_rebranded_as_charm"],
    metadata: { romanceValue: 7, conflictPotential: 5 },
  },
  {
    seed: "secret_commitment_pressure",
    label: "Secret Commitment Pressure",
    category: "social_pressure",
    description:
      "A private commitment protects the relationship briefly but creates danger, shame, or ambiguity when it remains hidden too long.",
    purpose: "To preserve love under social, familial, legal, or political pressure.",
    obstacle:
      "Secrecy can begin as protection and become a wound if it denies the relationship dignity.",
    pressure:
      "The hidden bond must either be named, renegotiated, or released.",
    modernizedConflict:
      "A secret relationship becomes emotionally unstable when privacy starts to feel like shame.",
    emotionalFunction:
      "Tests the difference between privacy, protection, and concealment.",
    sourceConflictIds: ["64", "68", "479"],
    examples: [
      "A couple stays hidden to avoid immediate consequences.",
      "One partner realizes the secrecy protects the other person's comfort more than the bond.",
    ],
    tags: ["plot_conflict", "secret_relationship", "commitment", "visibility"],
    relatedSeeds: ["secret_relationship", "public_choice_gate"],
    oppositeSeeds: ["publicly_chosen", "relationship_named_scene"],
    romanceHooks: ["no_more_hiding", "private_bond_public_choice"],
    scenarioHooks: ["secret_commitment_exposed", "hidden_relationship_deadline"],
    dialoguePatterns: [
      "Privacy is one thing. Being treated like a mistake is another.",
      "I hid this to protect us. I did not notice when it started hurting you.",
    ],
    routeEntryBeats: ["private_commitment", "secrecy_justified"],
    routeExitBeats: ["relationship_named", "public_choice_or_clean_break"],
    compatibleTropes: ["forbidden_romance", "secret_relationship"],
    compatibleWounds: ["rejection_wound", "replacement_wound"],
    compatiblePayoffs: ["publicly_chosen", "fake_becomes_real"],
    antiPatterns: ["secret_shame_dynamic", "choice_without_accountability"],
    metadata: { romanceValue: 8, conflictPotential: 9 },
  },
  {
    seed: "betrayal_without_accountability",
    label: "Betrayal Without Accountability",
    category: "betrayal",
    description:
      "A character causes harm and protects their reputation instead of repairing the person they hurt.",
    purpose: "To preserve status, comfort, or control after doing wrong.",
    obstacle:
      "The injured person carries the emotional and social cost until truth or accountability interrupts the pattern.",
    pressure:
      "Repair requires naming harm, not only avoiding exposure.",
    modernizedConflict:
      "A betrayal is made worse by secrecy, image management, and refusal to repair.",
    emotionalFunction:
      "Creates rupture, accountability beats, and truth-based catharsis.",
    sourceConflictIds: ["68", "96", "98", "247"],
    examples: [
      "Someone breaks a promise and lets the other person absorb the fallout.",
      "A public reputation stays clean while private harm goes unrepaired.",
    ],
    tags: ["plot_conflict", "betrayal", "accountability", "rupture"],
    relatedSeeds: ["betrayal_wound", "accountability_repair"],
    oppositeSeeds: ["truth_telling_repair", "protective_repair"],
    romanceHooks: ["betrayal_accountability_scene", "truth_over_reputation"],
    scenarioHooks: ["private_harm_public_mask", "reputation_protection_lie"],
    dialoguePatterns: [
      "You were not afraid of hurting me. You were afraid of being known for it.",
      "An apology that protects your image is not repair.",
    ],
    routeEntryBeats: ["harm_done", "reputation_protected"],
    routeExitBeats: ["truth_telling", "accountability_or_final_rupture"],
    compatibleTropes: ["trust_rebuild_romance", "second_chance_romance"],
    compatibleWounds: ["betrayal_wound", "public_image_wound"],
    compatiblePayoffs: ["trust_rebuilt_and_earned", "repair_after_rupture"],
    antiPatterns: ["instant_forgiveness", "image_management_as_apology"],
    metadata: { romanceValue: 5, conflictPotential: 10 },
  },
  {
    seed: "worthiness_test_by_authority",
    label: "Worthiness Test by Authority",
    category: "family_pressure",
    description:
      "An authority figure tests a romantic option, revealing more about power, bias, and fear than about worthiness.",
    purpose: "To decide whether someone can be trusted near a loved one.",
    obstacle:
      "The test may become controlling, unfair, or based on status rather than care.",
    pressure:
      "The couple must decide whether outside approval matters more than mutual respect.",
    modernizedConflict:
      "A parent, mentor, leader, or community gatekeeper tries to vet the relationship.",
    emotionalFunction:
      "Creates external pressure while testing autonomy and public loyalty.",
    sourceConflictIds: ["77", "312"],
    examples: [
      "A family member investigates a partner's intentions.",
      "A community gatekeeper mistakes control for protection.",
    ],
    tags: ["plot_conflict", "family_pressure", "approval", "autonomy"],
    relatedSeeds: ["family_disapproval", "public_choice_gate"],
    oppositeSeeds: ["chosen_family_over_lineage"],
    romanceHooks: ["approval_test_resisted", "public_side_taken"],
    scenarioHooks: ["family_vetting_scene", "mentor_challenges_partner"],
    dialoguePatterns: [
      "You can ask if they treat me well. You do not get to decide for me.",
      "Protection stops being love when it stops listening.",
    ],
    routeEntryBeats: ["gatekeeper_pressure", "worthiness_test"],
    routeExitBeats: ["autonomy_asserted", "respect_based_approval"],
    compatibleTropes: ["forbidden_romance", "family_disapproval_arc"],
    compatibleWounds: ["control_wound", "family_honor_burden"],
    compatiblePayoffs: ["protected_but_not_controlled", "publicly_chosen"],
    antiPatterns: ["approval_as_ownership", "status_as_worth"],
    metadata: {
      romanceValue: 6,
      conflictPotential: 8,
      modernizationReview: "sensitive_source",
    },
  },
  {
    seed: "rival_reputation_trap",
    label: "Rival Reputation Trap",
    category: "rivalry",
    description:
      "A rival manufactures a situation where the character's reputation, safety, or credibility will collapse if they act without care.",
    purpose: "To remove a romantic or social competitor without direct confrontation.",
    obstacle:
      "The target must see the trap before pride, desire, or urgency makes them step into it.",
    pressure:
      "The love interest must decide whether to believe evidence or character.",
    modernizedConflict:
      "A rival manipulates optics to make someone look unworthy or dangerous.",
    emotionalFunction:
      "Tests trust under public pressure and makes private knowledge matter.",
    sourceConflictIds: ["76", "79"],
    examples: [
      "A rival stages a compromising situation.",
      "A false-friendly competitor invites the character into reputational danger.",
    ],
    tags: ["plot_conflict", "rivalry", "reputation", "trust_test"],
    relatedSeeds: ["rivals_dynamic", "trust_test_failed"],
    oppositeSeeds: ["private_trust_public_doubt"],
    romanceHooks: ["believes_character_over_optics", "rival_trap_exposed"],
    scenarioHooks: ["compromising_situation_staged", "false_friend_invitation"],
    dialoguePatterns: [
      "This looks exactly how they wanted it to look.",
      "I know what I saw. I also know who you are.",
    ],
    routeEntryBeats: ["rival_sets_trap", "optics_turn_bad"],
    routeExitBeats: ["trust_choice", "trap_exposed"],
    compatibleTropes: ["rivals_to_lovers", "court_intrigue_romance"],
    compatibleWounds: ["public_image_wound", "betrayal_wound"],
    compatiblePayoffs: ["trust_rebuilt_and_earned", "rival_respects_you"],
    antiPatterns: ["jealousy_as_control", "public_humiliation_as_romance"],
    metadata: { romanceValue: 7, conflictPotential: 9 },
  },
  {
    seed: "coercive_rescue_antipattern",
    label: "Coercive Rescue Anti-Pattern",
    category: "coercive_pressure",
    description:
      "A rescue impulse crosses into control when one character removes another person's choice in the name of love or safety.",
    purpose: "To stop a feared outcome quickly.",
    obstacle:
      "Speed and certainty can become coercion when consent is bypassed.",
    pressure:
      "The protector must learn to protect with, not for, the person at risk.",
    modernizedConflict:
      "A dramatic rescue beat requires agency checks before it can become romantic.",
    emotionalFunction:
      "Turns protector energy into a consent and autonomy test.",
    sourceConflictIds: ["81", "146"],
    examples: [
      "Someone physically removes a partner from a situation without asking.",
      "A protector treats their own fear as permission to decide.",
    ],
    tags: ["plot_conflict", "coercive_pressure", "agency", "protection"],
    relatedSeeds: ["protector_protected_dynamic", "protected_but_not_controlled"],
    oppositeSeeds: ["collaborative_protection", "agency_respect_fixture"],
    romanceHooks: ["protect_with_not_for", "agency_repair_after_rescue"],
    scenarioHooks: ["interrupted_escape", "protector_oversteps"],
    dialoguePatterns: [
      "I needed help, not ownership.",
      "Next time I ask first, even if I am scared.",
    ],
    routeEntryBeats: ["danger_or_pressure", "protector_oversteps"],
    routeExitBeats: ["agency_repair", "collaborative_safety_plan"],
    compatibleTropes: ["bodyguard_romance", "protector_protected"],
    compatibleWounds: ["control_wound", "safety_wound"],
    compatiblePayoffs: ["protected_but_not_controlled", "equal_partnership"],
    antiPatterns: ["kidnapping_as_romance", "fear_as_permission"],
    metadata: {
      romanceValue: 5,
      conflictPotential: 10,
      modernizationReview: "sensitive_source",
    },
  },
  {
    seed: "family_disapproval_elopement_pressure",
    label: "Family Disapproval Elopement Pressure",
    category: "family_pressure",
    description:
      "A couple under family pressure considers a private commitment before they have dealt with the emotional and social fallout.",
    purpose: "To choose love when approval is withheld.",
    obstacle:
      "A rushed escape may solve access while delaying the deeper conflict.",
    pressure:
      "The couple must separate genuine choice from panic, rebellion, or secrecy.",
    modernizedConflict:
      "Disapproval pushes a couple toward a private leap before they are ready for consequences.",
    emotionalFunction:
      "Tests courage, pacing, and whether the relationship can survive external pressure.",
    sourceConflictIds: ["73"],
    examples: [
      "A couple considers running away before a family confrontation.",
      "One partner wants commitment, the other wants breathing room.",
    ],
    tags: ["plot_conflict", "family_disapproval", "elopement", "choice"],
    relatedSeeds: ["forbidden_romance", "family_disapproval_arc"],
    oppositeSeeds: ["public_choice_gate", "slow_burn"],
    romanceHooks: ["choose_love_under_family_pressure", "rushed_commitment_reconsidered"],
    scenarioHooks: ["secret_commitment_plan", "family_confrontation_deadline"],
    dialoguePatterns: [
      "I want to choose you without making fear choose for us.",
      "Running is not the same as being free.",
    ],
    routeEntryBeats: ["approval_blocked", "escape_plan_forms"],
    routeExitBeats: ["consequence_named", "choice_made_cleanly"],
    compatibleTropes: ["forbidden_romance", "marriage_of_convenience"],
    compatibleWounds: ["control_wound", "family_honor_burden"],
    compatiblePayoffs: ["forbidden_love_wins", "freedom_within_love"],
    antiPatterns: ["commitment_as_panic", "family_as_flat_villain"],
    metadata: { romanceValue: 8, conflictPotential: 8 },
  },
  {
    seed: "grief_misread_as_loss",
    label: "Grief Misread as Loss",
    category: "separation",
    description:
      "A character believes a beloved person is gone or unreachable, and that mistaken grief changes how they act before the truth arrives.",
    purpose: "To survive the perceived loss of someone emotionally central.",
    obstacle:
      "The belief may be wrong, but the grief it creates is real.",
    pressure:
      "The return forces both people to face what the imagined loss revealed.",
    modernizedConflict:
      "A false death, disappearance, or unreachable distance turns longing into premature mourning.",
    emotionalFunction:
      "Reveals attachment through absence, regret, and the shock of return.",
    sourceConflictIds: ["49", "105"],
    examples: [
      "Two people survive danger but each believes the other is gone.",
      "A mistaken report of death forces an unspoken love into clarity.",
    ],
    tags: ["plot_conflict", "separation", "grief", "return"],
    relatedSeeds: ["temporary_separation_trigger", "someone_finally_stays"],
    oppositeSeeds: ["reliable_return"],
    romanceHooks: ["return_after_false_loss", "grief_reveals_love"],
    scenarioHooks: ["mistaken_death_report", "lost_contact_after_crisis"],
    dialoguePatterns: [
      "I grieved you before I ever let myself want you.",
      "You came back, and now I have to admit what losing you did to me.",
    ],
    routeEntryBeats: ["danger_or_distance", "false_loss_believed"],
    routeExitBeats: ["return_scene", "truth_after_grief"],
    compatibleTropes: ["second_chance_romance", "war_zone_lovers"],
    compatibleWounds: ["abandonment_wound", "loss_wound"],
    compatiblePayoffs: ["someone_finally_stays", "softness_after_survival"],
    antiPatterns: ["fake_death_for_cheap_angst"],
    metadata: { romanceValue: 9, conflictPotential: 9 },
  },
  {
    seed: "duty_refuses_happiness",
    label: "Duty Refuses Happiness",
    category: "duty",
    description:
      "A character denies a wanted relationship because an obligation feels morally binding, even when the cost is personal happiness.",
    purpose: "To remain loyal to a promise, role, family need, or public duty.",
    obstacle:
      "Duty may be real, but it can also hide fear, shame, or avoidance.",
    pressure:
      "The character must decide whether sacrifice is ethical, necessary, or self-punishing.",
    modernizedConflict:
      "A person refuses love because obligation feels more legitimate than desire.",
    emotionalFunction:
      "Turns romance into a moral pressure test rather than a simple confession problem.",
    sourceConflictIds: ["268", "510", "519"],
    examples: [
      "Someone declines a relationship to honor a promise.",
      "A duty-bound character confuses self-denial with integrity.",
    ],
    tags: ["plot_conflict", "duty", "sacrifice", "moral_pressure"],
    relatedSeeds: ["duty_vs_desire", "love_vs_duty"],
    oppositeSeeds: ["selfish_choice", "freedom_within_love"],
    romanceHooks: ["duty_blocks_confession", "desire_named_against_obligation"],
    scenarioHooks: ["public_duty_private_love", "promise_prevents_choice"],
    dialoguePatterns: [
      "Wanting you does not make the promise disappear.",
      "Duty can be honorable. It can also be a place to hide.",
    ],
    routeEntryBeats: ["obligation_named", "happiness_refused"],
    routeExitBeats: ["duty_reinterpreted", "choice_with_cost"],
    compatibleTropes: ["political_marriage", "forbidden_romance"],
    compatibleWounds: ["family_honor_burden", "gilded_cage_wound"],
    compatiblePayoffs: ["love_over_duty", "freedom_within_love"],
    antiPatterns: ["martyrdom_as_only_goodness"],
    metadata: { romanceValue: 9, conflictPotential: 8 },
  },
  {
    seed: "debt_coerced_choice",
    label: "Debt-Coerced Choice",
    category: "coercive_pressure",
    description:
      "A financial, political, or survival debt pressures someone toward a relationship or alliance they would not freely choose.",
    purpose: "To resolve an external debt or threat.",
    obstacle:
      "The proposed solution treats a person as currency instead of an agent.",
    pressure:
      "The route must restore choice before romance can be ethical.",
    modernizedConflict:
      "Material pressure tries to turn intimacy, marriage, loyalty, or access into repayment.",
    emotionalFunction:
      "Creates high-stakes autonomy conflict and rescue-without-ownership potential.",
    sourceConflictIds: ["269", "430", "723"],
    examples: [
      "A family debt makes an unwanted match seem practical.",
      "A dangerous creditor turns relationship status into leverage.",
    ],
    tags: ["plot_conflict", "coercive_pressure", "debt", "autonomy"],
    relatedSeeds: ["marriage_of_convenience", "contract_pressure"],
    oppositeSeeds: ["chosen_freely", "equal_partnership"],
    romanceHooks: ["debt_contract_refused", "choice_restored_before_love"],
    scenarioHooks: ["creditor_forces_match", "debt_as_leverage"],
    dialoguePatterns: [
      "A debt is not a vow.",
      "No one gets to turn your future into payment.",
    ],
    routeEntryBeats: ["debt_pressure_revealed", "choice_threatened"],
    routeExitBeats: ["choice_restored", "ethical_alliance_rebuilt"],
    compatibleTropes: ["marriage_of_convenience", "bodyguard_romance"],
    compatibleWounds: ["control_wound", "resource_scarcity_wound"],
    compatiblePayoffs: ["protected_but_not_controlled", "equal_partnership"],
    antiPatterns: ["coercion_romanticized", "person_as_payment"],
    metadata: {
      romanceValue: 6,
      conflictPotential: 10,
      modernizationReview: "sensitive_source",
    },
  },
  {
    seed: "structural_prejudice_barrier",
    label: "Structural Prejudice Barrier",
    category: "prejudice",
    description:
      "A relationship is pressured by a prejudiced social order, and the conflict belongs to the system, not to the worth of either person.",
    purpose: "To love across a boundary society unfairly polices.",
    obstacle:
      "External prejudice creates material danger, shame pressure, or social cost.",
    pressure:
      "The story must reject the hierarchy rather than reproduce it as truth.",
    modernizedConflict:
      "A social system treats a relationship as forbidden because of identity, status, origin, or belonging.",
    emotionalFunction:
      "Creates moral clarity, public choice pressure, and solidarity under threat.",
    sourceConflictIds: ["23", "229", "246", "271"],
    examples: [
      "A couple faces community backlash rooted in prejudice.",
      "One person internalizes social stigma and tries to leave to protect the other.",
    ],
    tags: [
      "plot_conflict",
      "structural_prejudice",
      "social_pressure",
      "review_required",
    ],
    relatedSeeds: ["forbidden_romance", "public_scandal", "exile_threat"],
    oppositeSeeds: ["equal_dignity", "chosen_family_over_lineage"],
    romanceHooks: ["love_against_unjust_system", "public_solidarity_choice"],
    scenarioHooks: ["community_prejudice_pressure", "unjust_rule_exposure"],
    dialoguePatterns: [
      "The problem is not us. It is what they built around us.",
      "I will not let their fear teach me to be ashamed of loving you.",
    ],
    routeEntryBeats: ["unjust_boundary_established", "stigma_pressure_rises"],
    routeExitBeats: ["public_solidarity", "system_rejected_or_survived"],
    compatibleTropes: ["forbidden_romance", "love_across_class_lines"],
    compatibleWounds: ["exile_wound", "class_shame", "identity_shame"],
    compatiblePayoffs: ["forbidden_love_wins", "publicly_chosen"],
    antiPatterns: [
      "prejudice_as_romantic_obstacle_only",
      "prejudice_validated_by_narration",
      "identity_as_tragedy_device_only",
    ],
    metadata: {
      romanceValue: 8,
      conflictPotential: 10,
      modernizationReview: "sensitive_source",
    },
  },
  {
    seed: "secret_help_at_any_cost",
    label: "Secret Help at Any Cost",
    category: "duty",
    description:
      "A character tries to protect or assist someone secretly, risking misunderstanding because the help is hidden or unilateral.",
    purpose: "To prevent harm without burdening the person they love.",
    obstacle:
      "Secrecy can make protection look like manipulation, absence, or betrayal.",
    pressure:
      "The helper must decide when to reveal the cost and invite consent.",
    modernizedConflict:
      "A protective secret creates both safety and distrust.",
    emotionalFunction:
      "Tests the line between devotion, secrecy, and control.",
    sourceConflictIds: ["97", "100", "469"],
    examples: [
      "Someone works behind the scenes to remove a threat.",
      "The protected person feels managed rather than trusted.",
    ],
    tags: ["plot_conflict", "secret_help", "protection", "trust"],
    relatedSeeds: ["protective_lie_trigger", "trust_rebuild_romance"],
    oppositeSeeds: ["collaborative_protection", "truth_telling_repair"],
    romanceHooks: ["secret_protection_revealed", "help_with_consent_repair"],
    scenarioHooks: ["hidden_rescue_plan", "protection_misread_as_control"],
    dialoguePatterns: [
      "I was trying to keep the danger away from you.",
      "You kept me outside my own life.",
    ],
    routeEntryBeats: ["threat_identified", "secret_help_begins"],
    routeExitBeats: ["secret_exposed", "collaborative_repair"],
    compatibleTropes: ["bodyguard_romance", "court_intrigue_romance"],
    compatibleWounds: ["betrayal_wound", "control_wound"],
    compatiblePayoffs: ["protected_but_not_controlled", "trust_rebuilt_and_earned"],
    antiPatterns: ["lying_as_unquestioned_devotion"],
    metadata: { romanceValue: 8, conflictPotential: 8 },
  },
  {
    seed: "disappearance_unresolved_absence",
    label: "Disappearance and Unresolved Absence",
    category: "separation",
    description:
      "A sudden absence leaves the remaining character to interpret silence, danger, betrayal, or abandonment without enough information.",
    purpose: "To survive or understand an unexplained absence.",
    obstacle:
      "The missing person's motive is unknown, so the absence becomes emotionally unstable.",
    pressure:
      "Return requires explanation, accountability, and repair for what the absence caused.",
    modernizedConflict:
      "Unexplained disappearance creates a rupture even when the reason later proves sympathetic.",
    emotionalFunction:
      "Activates abandonment, suspicion, grief, and delayed repair.",
    sourceConflictIds: ["430", "572", "719"],
    examples: [
      "A partner disappears during a crisis and returns changed.",
      "The abandoned person builds a story around silence that may be wrong.",
    ],
    tags: ["plot_conflict", "absence", "abandonment", "return"],
    relatedSeeds: ["goodbye_trigger", "fear_of_abandonment"],
    oppositeSeeds: ["reliable_return", "consistent_check_in"],
    romanceHooks: ["return_after_absence", "explanation_after_silence"],
    scenarioHooks: ["missing_partner_returns", "unexplained_no_contact"],
    dialoguePatterns: [
      "You were gone long enough for me to become someone else.",
      "There is a reason. It does not erase what it did to you.",
    ],
    routeEntryBeats: ["absence_begins", "interpretation_spiral"],
    routeExitBeats: ["return_with_truth", "absence_repair"],
    compatibleTropes: ["second_chance_romance", "amnesia", "safehouse_romance"],
    compatibleWounds: ["abandonment_wound", "betrayal_wound"],
    compatiblePayoffs: ["someone_finally_stays", "repair_after_rupture"],
    antiPatterns: ["absence_without_consequence"],
    metadata: { romanceValue: 8, conflictPotential: 9 },
  },
  {
    seed: "shared_false_guilt_exile",
    label: "Shared False-Guilt Exile",
    category: "survival",
    description:
      "Two people believe they are guilty, exposed, or unsafe, and their shared isolation creates intimacy before the truth is clear.",
    purpose: "To survive perceived danger with someone who understands the stakes.",
    obstacle:
      "The bond grows inside fear, secrecy, and possibly mistaken assumptions.",
    pressure:
      "Safety requires truth, not only loyalty inside the hiding place.",
    modernizedConflict:
      "A shared belief of danger turns two isolated people into reluctant allies or lovers.",
    emotionalFunction:
      "Creates forced intimacy, mutual protection, and truth-reveal tension.",
    sourceConflictIds: ["12"],
    examples: [
      "Two people flee because each believes they are legally or socially doomed.",
      "A shared secret creates a bond before either has the whole story.",
    ],
    tags: ["plot_conflict", "false_guilt", "exile", "forced_proximity"],
    relatedSeeds: ["forced_proximity", "safehouse_romance"],
    oppositeSeeds: ["open_truth", "public_safety"],
    romanceHooks: ["shared_exile_intimacy", "truth_after_hiding"],
    scenarioHooks: ["hiding_in_foreign_city", "shared_false_accusation"],
    dialoguePatterns: [
      "I thought you were the only person as ruined as I was.",
      "Maybe we were never guilty. Maybe we were just scared.",
    ],
    routeEntryBeats: ["false_guilt_believed", "shared_hiding_place"],
    routeExitBeats: ["truth_uncovers_safety", "bond_after_exile"],
    compatibleTropes: ["forced_proximity", "safehouse_romance"],
    compatibleWounds: ["exile_wound", "public_image_wound"],
    compatiblePayoffs: ["belonging_after_isolation", "trust_rebuilt_and_earned"],
    antiPatterns: ["legal_danger_as_unexamined_romance"],
    metadata: { romanceValue: 7, conflictPotential: 8 },
  },
  {
    seed: "jealousy_misread_spiral",
    label: "Jealousy Misread Spiral",
    category: "repair",
    description:
      "A character misreads attention, loyalty, or family bonds as romantic threat, then acts from insecurity instead of asking directly.",
    purpose: "To protect emotional significance.",
    obstacle:
      "The threat may be imagined, displaced, or amplified by old wounds.",
    pressure:
      "The relationship needs direct reassurance and accountability before jealousy becomes control.",
    modernizedConflict:
      "Jealousy turns ambiguous evidence into certainty before truth is checked.",
    emotionalFunction:
      "Externalizes fear of replacement and creates a repairable conflict loop.",
    sourceConflictIds: ["380", "543"],
    examples: [
      "A character mistakes ordinary closeness for romantic replacement.",
      "A family bond is misread as competition for emotional priority.",
    ],
    tags: ["plot_conflict", "jealousy", "misread_signal", "replacement_fear"],
    relatedSeeds: ["fear_of_replacement", "jealousy_suppression_response"],
    oppositeSeeds: ["secure_attention", "direct_reassurance"],
    romanceHooks: ["jealousy_named_not_weaponized", "reassurance_after_misread"],
    scenarioHooks: ["ambiguous_attention_seen", "family_bond_misread"],
    dialoguePatterns: [
      "I made the fear sound like evidence.",
      "Ask me where you stand before you punish me for your answer.",
    ],
    routeEntryBeats: ["ambiguous_attention", "misread_as_replacement"],
    routeExitBeats: ["direct_reassurance", "jealousy_accountability"],
    compatibleTropes: ["love_triangle", "possessive_but_respectful_romance"],
    compatibleWounds: ["replacement_wound", "abandonment_wound"],
    compatiblePayoffs: ["chosen_above_everyone", "mutual_devotion"],
    antiPatterns: ["jealousy_as_control", "possessiveness_as_proof"],
    metadata: { romanceValue: 8, conflictPotential: 8 },
  },
  {
    seed: "revenge_displaced_onto_innocent",
    label: "Revenge Displaced Onto Innocent",
    category: "revenge",
    description:
      "A character redirects pain from the actual source of harm onto someone connected to it, creating moral conflict and possible remorse.",
    purpose: "To regain power after being wronged.",
    obstacle:
      "The chosen target is not responsible for the original harm.",
    pressure:
      "The avenger must choose between pain-driven retaliation and moral clarity.",
    modernizedConflict:
      "Revenge seeks a reachable target rather than a just one.",
    emotionalFunction:
      "Creates dark route pressure, guilt, accountability, and possible redemption.",
    sourceConflictIds: ["433", "454", "567"],
    examples: [
      "Someone targets a relative or partner of the person who harmed them.",
      "A revenge plan collapses when the target becomes fully human to them.",
    ],
    tags: ["plot_conflict", "revenge", "moral_conflict", "accountability"],
    relatedSeeds: ["revenge_romance", "redemption_romance"],
    oppositeSeeds: ["justice_ethics", "accountability_repair"],
    romanceHooks: ["revenge_target_becomes_person", "remorse_before_choice"],
    scenarioHooks: ["wrong_target_revenge_plan", "revenge_confession"],
    dialoguePatterns: [
      "Hurting you was easier than admitting I could not reach them.",
      "I will not be the place where your grief becomes cruelty.",
    ],
    routeEntryBeats: ["revenge_target_selected", "humanity_interrupts_plan"],
    routeExitBeats: ["remorse_named", "harm_repaired_or_route_breaks"],
    compatibleTropes: ["enemies_to_lovers", "redemption_romance"],
    compatibleWounds: ["betrayal_wound", "humiliation_wound"],
    compatiblePayoffs: ["repair_after_rupture", "trust_rebuilt_and_earned"],
    antiPatterns: ["innocent_target_romanticized", "abuse_excused_by_pain"],
    metadata: { romanceValue: 5, conflictPotential: 10 },
  },
  {
    seed: "poverty_security_conflict",
    label: "Poverty and Security Conflict",
    category: "resource_pressure",
    description:
      "Love is strained by material insecurity, not because scarcity makes someone less worthy but because survival changes choices.",
    purpose: "To reconcile love, safety, dignity, and practical need.",
    obstacle:
      "Scarcity creates fear, comparison, shame, or different visions of a livable future.",
    pressure:
      "The couple must solve real constraints without equating money with worth.",
    modernizedConflict:
      "Resource pressure tests whether love can become practical partnership.",
    emotionalFunction:
      "Grounds romance in daily survival, dignity, and shared planning.",
    sourceConflictIds: ["291", "469", "523", "700"],
    examples: [
      "A partner fears love will mean permanent instability.",
      "Someone cannot afford a symbolic gesture and mistakes that for emotional failure.",
    ],
    tags: ["plot_conflict", "resource_pressure", "security", "dignity"],
    relatedSeeds: ["resource_scarcity", "acts_of_service"],
    oppositeSeeds: ["wealth_as_worth"],
    romanceHooks: ["practical_partnership_under_scarcity", "dignity_without_money"],
    scenarioHooks: ["missed_gift_due_to_money", "budget_pressure_scene"],
    dialoguePatterns: [
      "I am not afraid of less. I am afraid of pretending less does not hurt.",
      "You are not a failure because the world made care expensive.",
    ],
    routeEntryBeats: ["scarcity_named", "security_fear_exposed"],
    routeExitBeats: ["shared_plan", "dignity_reassured"],
    compatibleTropes: ["domestic_romance", "equal_partners_romance"],
    compatibleWounds: ["class_shame", "resource_scarcity_wound"],
    compatiblePayoffs: ["needed_but_not_used", "domestic_happiness"],
    antiPatterns: ["poverty_as_character_flaw", "wealth_solves_love"],
    metadata: {
      romanceValue: 7,
      conflictPotential: 7,
      modernizationReview: "sensitive_source",
    },
  },
  {
    seed: "public_comparison_wound",
    label: "Public Comparison Wound",
    category: "social_pressure",
    description:
      "A public or semi-public comparison makes a character feel exposed, replaceable, mocked, or reduced to a type.",
    purpose: "To preserve dignity after being compared or misread.",
    obstacle:
      "The comparison may be accidental, but its emotional meaning lands sharply.",
    pressure:
      "Repair requires seeing why the comparison hurt instead of arguing intent.",
    modernizedConflict:
      "A careless parallel or joke cuts into identity and attachment security.",
    emotionalFunction:
      "Activates shame, replacement fear, and the need for precise repair.",
    sourceConflictIds: ["40", "312"],
    examples: [
      "A gift or story accidentally mirrors an insulting stereotype.",
      "A character is compared to a rival in front of others.",
    ],
    tags: ["plot_conflict", "comparison", "shame", "replacement_fear"],
    relatedSeeds: ["being_compared_trigger", "humiliation_wound"],
    oppositeSeeds: ["specific_praise", "private_reassurance"],
    romanceHooks: ["comparison_repair", "specificity_as_reassurance"],
    scenarioHooks: ["careless_public_comparison", "gift_misread_as_insult"],
    dialoguePatterns: [
      "You made me feel like a category, not a person.",
      "I should have repaired the hurt before defending the intention.",
    ],
    routeEntryBeats: ["comparison_lands", "public_shame_response"],
    routeExitBeats: ["specific_reassurance", "dignity_repair"],
    compatibleTropes: ["fake_relationship", "love_triangle"],
    compatibleWounds: ["humiliation_wound", "replacement_wound"],
    compatiblePayoffs: ["seen_and_still_loved", "wanted_without_performance"],
    antiPatterns: ["intent_used_to_cancel_impact"],
    metadata: { romanceValue: 6, conflictPotential: 7 },
  },
  {
    seed: "gift_misread_as_future",
    label: "Gift Misread as Future",
    category: "misrecognition",
    description:
      "A gift, favor, or symbolic object is read as a promise, pressure, rejection, or confession that the giver did not intend.",
    purpose: "To communicate care through an object or gesture.",
    obstacle:
      "Symbolic gestures carry meanings the giver may not control.",
    pressure:
      "The pair must clarify what was offered and what was hoped for.",
    modernizedConflict:
      "A gesture becomes emotionally overloaded because desire fills in the blanks.",
    emotionalFunction:
      "Creates soft misunderstanding, confession pressure, and repairable awkwardness.",
    sourceConflictIds: ["63"],
    examples: [
      "A meaningful gift is mistaken for a romantic promise.",
      "A practical favor is read as pity instead of care.",
    ],
    tags: ["plot_conflict", "gift", "misread_signal", "symbolic_object"],
    relatedSeeds: ["gift_as_love", "calling_card_flirtation"],
    oppositeSeeds: ["clear_intention", "direct_confession"],
    romanceHooks: ["gift_meaning_clarified", "object_as_confession_pressure"],
    scenarioHooks: ["misread_gift_scene", "keepsake_with_wrong_meaning"],
    dialoguePatterns: [
      "I gave it because I cared. I should have said what kind of care.",
      "I wanted it to mean more, so I heard more than you gave me.",
    ],
    routeEntryBeats: ["gift_given", "meaning_overread"],
    routeExitBeats: ["intent_clarified", "desire_named_or_released"],
    compatibleTropes: ["slow_burn", "mutual_pining"],
    compatibleWounds: ["rejection_wound", "fear_of_vulnerability"],
    compatiblePayoffs: ["understood_without_explaining", "private_devotion"],
    antiPatterns: ["gift_as_transaction"],
    metadata: { romanceValue: 7, conflictPotential: 5 },
  },
  {
    seed: "enemy_claims_vulnerability",
    label: "Enemy Claims Vulnerability",
    category: "rivalry",
    description:
      "A rival or opponent discovers the character's vulnerable point and chooses whether to exploit, protect, or understand it.",
    purpose: "To gain leverage in an adversarial dynamic.",
    obstacle:
      "Using the vulnerability may win the conflict but ruin any chance at trust.",
    pressure:
      "The opponent's choice reveals whether rivalry can become respect.",
    modernizedConflict:
      "Power over someone's exposed weakness becomes a moral test.",
    emotionalFunction:
      "Turns enemies-to-lovers through restraint, unexpected care, or betrayal.",
    sourceConflictIds: ["4", "79", "630"],
    examples: [
      "An opponent finds evidence that could destroy the character.",
      "A rival protects the secret they were expected to weaponize.",
    ],
    tags: ["plot_conflict", "rivalry", "vulnerability", "moral_test"],
    relatedSeeds: ["enemies_to_lovers", "rivals_to_lovers"],
    oppositeSeeds: ["weaponized_vulnerability"],
    romanceHooks: ["enemy_protects_secret", "rival_refuses_leverage"],
    scenarioHooks: ["secret_found_by_enemy", "evidence_not_used"],
    dialoguePatterns: [
      "You had the knife. You chose not to turn it.",
      "Do not thank me yet. I am still deciding who I am when I hold power.",
    ],
    routeEntryBeats: ["vulnerability_discovered", "leverage_available"],
    routeExitBeats: ["restraint_choice", "respect_before_trust"],
    compatibleTropes: ["enemies_to_lovers", "court_intrigue_romance"],
    compatibleWounds: ["betrayal_wound", "control_wound"],
    compatiblePayoffs: ["enemy_chooses_you", "trust_rebuilt_and_earned"],
    antiPatterns: ["blackmail_as_romance"],
    metadata: { romanceValue: 8, conflictPotential: 9 },
  },
  {
    seed: "obligation_vs_rescue_dilemma",
    label: "Obligation vs Rescue Dilemma",
    category: "duty",
    description:
      "A character must choose between immediate personal rescue and a wider duty where either choice has a real cost.",
    purpose: "To save someone loved without abandoning others who depend on them.",
    obstacle:
      "The situation has no clean option, only competing responsibilities.",
    pressure:
      "The choice reveals priorities, limits, and what kind of guilt the character can live with.",
    modernizedConflict:
      "Private love and public duty collide in a consequential decision.",
    emotionalFunction:
      "Forces high-stakes character revelation and aftermath repair.",
    sourceConflictIds: ["519"],
    examples: [
      "Leaving a post could save a partner but endanger others.",
      "Staying responsible looks like abandonment to the person in danger.",
    ],
    tags: ["plot_conflict", "duty", "rescue", "moral_dilemma"],
    relatedSeeds: ["public_duty_private_love", "crisis_or_choice"],
    oppositeSeeds: ["easy_rescue", "low_stakes_choice"],
    romanceHooks: ["choice_with_cost", "aftermath_of_hard_duty"],
    scenarioHooks: ["rescue_vs_post", "public_duty_crisis"],
    dialoguePatterns: [
      "Every road out of that moment hurt someone.",
      "I needed you to save me. I also know why you could not move.",
    ],
    routeEntryBeats: ["competing_duties", "urgent_rescue_need"],
    routeExitBeats: ["choice_consequence", "aftermath_repair"],
    compatibleTropes: ["war_zone_lovers", "royal_duty_romance"],
    compatibleWounds: ["abandonment_wound", "crown_pressure"],
    compatiblePayoffs: ["repair_after_rupture", "love_over_duty"],
    antiPatterns: ["impossible_choice_without_aftermath"],
    metadata: { romanceValue: 8, conflictPotential: 10 },
  },
  {
    seed: "careless_cruelty_as_route_break",
    label: "Careless Cruelty as Route Break",
    category: "betrayal",
    description:
      "A thoughtless act causes disproportionate damage because it touches an existing wound and changes the relationship's direction.",
    purpose: "To show that small acts can carry large emotional meaning.",
    obstacle:
      "The person who caused the hurt may treat it as minor because the deeper wound is invisible.",
    pressure:
      "Repair requires learning what the act meant, not debating its size.",
    modernizedConflict:
      "A small cruelty becomes a major route rupture because it confirms an old fear.",
    emotionalFunction:
      "Creates a believable pivot from flirtation or trust into rupture and repair.",
    sourceConflictIds: ["66", "247", "381"],
    examples: [
      "A joke, gamble, or impulsive choice makes someone feel disposable.",
      "An old wound turns a minor betrayal into a relationship-defining event.",
    ],
    tags: ["plot_conflict", "careless_cruelty", "rupture", "repair"],
    relatedSeeds: ["first_joke_that_hurts_gate", "rupture_type"],
    oppositeSeeds: ["repair_after_hurt", "gentle_accountability"],
    romanceHooks: ["small_hurt_big_repair", "learns_the_wound_under_reaction"],
    scenarioHooks: ["careless_comment_lands_wrong", "minor_betrayal_spirals"],
    dialoguePatterns: [
      "It was small to you because it was not built on your wound.",
      "I need you to understand why it hurt before you ask me to move on.",
    ],
    routeEntryBeats: ["small_harm_done", "wound_activated"],
    routeExitBeats: ["meaning_understood", "specific_repair"],
    compatibleTropes: ["hurt_comfort", "second_chance_romance"],
    compatibleWounds: ["humiliation_wound", "betrayal_wound"],
    compatiblePayoffs: ["repair_after_rupture", "seen_and_still_loved"],
    antiPatterns: [
      "harm_minimized_because_it_looked_small",
      "minimizing_impact",
      "hurt_as_flirtation",
    ],
    metadata: { romanceValue: 6, conflictPotential: 8 },
  },
  {
    seed: "ambition_costs_intimacy",
    label: "Ambition Costs Intimacy",
    category: "temptation",
    description:
      "A character's ambition, mission, or public goal begins to cost the relationship more than they expected.",
    purpose: "To pursue achievement, justice, fame, or transformation.",
    obstacle:
      "The goal demands time, secrecy, risk, or emotional absence from the relationship.",
    pressure:
      "The character must decide what success is allowed to consume.",
    modernizedConflict:
      "Ambition is not villainized, but it becomes relationally expensive.",
    emotionalFunction:
      "Creates maturity pressure around priorities, partnership, and repair.",
    sourceConflictIds: ["606", "630", "700"],
    examples: [
      "A major project drains the attention a partner depends on.",
      "A righteous campaign makes the character secretive and unavailable.",
    ],
    tags: ["plot_conflict", "ambition", "priority", "relationship_cost"],
    relatedSeeds: ["desire_for_purpose", "work_life_balance"],
    oppositeSeeds: ["domestic_happiness", "rest_after_overwork"],
    romanceHooks: ["choosing_partner_without_abandoning_goal", "ambition_rebalanced"],
    scenarioHooks: ["mission_consumes_relationship", "success_at_personal_cost"],
    dialoguePatterns: [
      "I never meant to make you compete with the life I was building.",
      "I love your fire. I just need not to be burned by it.",
    ],
    routeEntryBeats: ["goal_accelerates", "relationship_cost_visible"],
    routeExitBeats: ["priority_reckoning", "shared_future_redesigned"],
    compatibleTropes: ["workplace_romance", "second_chance_romance"],
    compatibleWounds: ["purpose_loss_wound", "emotional_neglect_wound"],
    compatiblePayoffs: ["equal_partnership", "rest_after_overwork"],
    antiPatterns: ["ambition_as_moral_failure", "partner_as_obstacle_only"],
    metadata: { romanceValue: 7, conflictPotential: 8 },
  },
  {
    seed: "new_love_disrupts_old_plan",
    label: "New Love Disrupts Old Plan",
    category: "social_pressure",
    description:
      "A character's inherited, arranged, or self-protective plan is disrupted by unexpected love that asks for a different future.",
    purpose: "To follow the life path already promised, expected, or prepared.",
    obstacle:
      "New feeling reveals the old plan as incomplete, dishonest, or too costly.",
    pressure:
      "The character must choose between continuity and a more truthful life.",
    modernizedConflict:
      "An existing plan for status, safety, duty, or convenience breaks under genuine attachment.",
    emotionalFunction:
      "Creates choice pressure, identity change, and public consequence.",
    sourceConflictIds: ["19", "26", "268"],
    examples: [
      "A planned advantageous match becomes emotionally impossible.",
      "A practical future loses its certainty after a real connection forms.",
    ],
    tags: ["plot_conflict", "old_plan", "new_love", "choice"],
    relatedSeeds: ["arranged_marriage", "political_marriage"],
    oppositeSeeds: ["planned_life_preserved"],
    romanceHooks: ["old_plan_breaks_for_love", "truthful_future_choice"],
    scenarioHooks: ["arranged_future_disrupted", "inheritance_choice_pressure"],
    dialoguePatterns: [
      "The plan made sense before I had to live inside it.",
      "You are not the complication. You are the truth I did not budget for.",
    ],
    routeEntryBeats: ["old_plan_established", "new_attachment_forms"],
    routeExitBeats: ["plan_breaks", "future_rechosen"],
    compatibleTropes: ["arranged_marriage", "royal_commoner_romance"],
    compatibleWounds: ["gilded_cage_wound", "never_free_to_choose"],
    compatiblePayoffs: ["love_over_crown", "freedom_within_love"],
    antiPatterns: ["existing_partner_dehumanized_for_convenience"],
    metadata: { romanceValue: 9, conflictPotential: 8 },
  },
  {
    seed: "outsider_belonging_test",
    label: "Outsider Belonging Test",
    category: "prejudice",
    description:
      "An outsider enters a guarded group or world and must decide whether belonging requires self-erasure or mutual change.",
    purpose: "To find place, safety, or recognition in a world that marks them as different.",
    obstacle:
      "The group may confuse assimilation with acceptance.",
    pressure:
      "The relationship must make room for identity rather than demanding performance.",
    modernizedConflict:
      "Belonging is offered conditionally, and the character must challenge the terms.",
    emotionalFunction:
      "Tests identity, loyalty, and whether love can become a bridge rather than a cage.",
    sourceConflictIds: ["23", "229", "291"],
    examples: [
      "A newcomer is welcomed only when they hide parts of themselves.",
      "A partner must choose between fitting in and being fully known.",
    ],
    tags: ["plot_conflict", "outsider", "belonging", "identity"],
    relatedSeeds: ["belonging_after_isolation", "chosen_family_over_lineage"],
    oppositeSeeds: ["conditional_acceptance"],
    romanceHooks: ["belonging_without_self_erasure", "partner_defends_identity"],
    scenarioHooks: ["outsider_at_formal_event", "community_acceptance_test"],
    dialoguePatterns: [
      "I do not want a place that only fits the smallest version of me.",
      "Then we make room. We do not carve pieces off you.",
    ],
    routeEntryBeats: ["outsider_enters_group", "conditional_acceptance"],
    routeExitBeats: ["identity_defended", "belonging_redefined"],
    compatibleTropes: ["fish_out_of_water", "forbidden_romance"],
    compatibleWounds: ["exile_wound", "identity_shame"],
    compatiblePayoffs: ["belonging_after_isolation", "home_is_a_person"],
    antiPatterns: ["assimilation_as_only_happy_ending"],
    metadata: {
      romanceValue: 8,
      conflictPotential: 8,
      modernizationReview: "sensitive_source",
    },
  },
  {
    seed: "ambiguous_evidence_wrong_conclusion",
    label: "Ambiguous Evidence Wrong Conclusion",
    category: "misrecognition",
    description:
      "A character draws a painful conclusion from partial evidence and acts before asking for context.",
    purpose: "To protect themselves from an apparent betrayal.",
    obstacle:
      "The evidence looks convincing but lacks emotional or factual context.",
    pressure:
      "Trust is tested by the pause between seeing and interpreting.",
    modernizedConflict:
      "A note, message, image, overheard line, or scene fragment is read in the worst possible way.",
    emotionalFunction:
      "Creates a clean misunderstanding engine for rupture and repair.",
    sourceConflictIds: ["381", "312", "40"],
    examples: [
      "A text thread is read without context.",
      "An overheard sentence makes devotion look like betrayal.",
    ],
    tags: ["plot_conflict", "misunderstanding", "ambiguous_evidence", "trust"],
    relatedSeeds: ["misread_motive", "trust_testing_response"],
    oppositeSeeds: ["asks_direct_questions", "careful_confrontation"],
    romanceHooks: ["ask_before_assuming", "evidence_reframed"],
    scenarioHooks: ["ambiguous_message_found", "overheard_wrong_line"],
    dialoguePatterns: [
      "I saw enough to hurt myself and not enough to understand.",
      "Next time, ask me before you sentence us both.",
    ],
    routeEntryBeats: ["partial_evidence_seen", "worst_reading_chosen"],
    routeExitBeats: ["context_revealed", "trust_repair_or_rupture"],
    compatibleTropes: ["miscommunication_romance", "second_chance_romance"],
    compatibleWounds: ["betrayal_wound", "fear_of_replacement"],
    compatiblePayoffs: ["trust_rebuilt_and_earned", "repair_after_rupture"],
    antiPatterns: ["miscommunication_dragged_without_reason"],
    metadata: { romanceValue: 7, conflictPotential: 8 },
  },
] as const satisfies readonly PlotConflictConceptSeedInput[];

export const plotConflictCategories = Object.freeze(
  PLOT_CONFLICT_INPUTS.reduce(
    (categories, seed) => ({
      ...categories,
      [seed.category]: [
        ...(categories[seed.category] ?? []),
        seed.seed,
      ],
    }),
    {} as Record<PlotConflictCategory, string[]>,
  ),
) satisfies Readonly<Record<PlotConflictCategory, readonly string[]>>;

export const plotConflictPresets = Object.freeze(
  PLOT_CONFLICT_INPUTS.map((seed) => seed.label),
) satisfies readonly string[];

export const PLOT_CONFLICT_CONCEPT_SEEDS = Object.freeze(
  PLOT_CONFLICT_INPUTS.map(createPlotConflictConceptSeed),
) satisfies readonly PlotConflictConceptSeed[];

export const PLOT_CONFLICT_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  PLOT_CONFLICT_CONCEPT_SEEDS.map(toStandardVocabularySeed),
) satisfies readonly VocabularySeedPreset[];

export function findPlotConflictConceptSeedBySeed(
  seedId: string,
): PlotConflictConceptSeed | undefined {
  const normalizedSeedId = seedId.trim().toLowerCase();
  return PLOT_CONFLICT_CONCEPT_SEEDS.find(
    (seed) => seed.seed.toLowerCase() === normalizedSeedId,
  );
}

export function getPlotConflictConceptSeedsByCategory(
  category: PlotConflictCategory,
): readonly PlotConflictConceptSeed[] {
  const ids = new Set<string>(plotConflictCategories[category]);
  return PLOT_CONFLICT_CONCEPT_SEEDS.filter((seed) => ids.has(seed.seed));
}

export function compilePlotConflictConceptSeed(
  seed: PlotConflictConceptSeed,
): string {
  return [
    `Plot conflict: ${seed.label}.`,
    `Purpose: ${seed.purpose}`,
    `Obstacle: ${seed.obstacle}`,
    `Pressure: ${seed.pressure}`,
    `Modern conflict: ${seed.modernizedConflict}`,
    `Emotional function: ${seed.emotionalFunction}`,
    seed.routeEntryBeats.length > 0
      ? `Entry beats: ${seed.routeEntryBeats.join(", ")}.`
      : "",
    seed.routeExitBeats.length > 0
      ? `Exit beats: ${seed.routeExitBeats.join(", ")}.`
      : "",
    seed.antiPatterns.length > 0
      ? `Avoid: ${seed.antiPatterns.join(", ")}.`
      : "",
  ].filter(Boolean).join("\n");
}

function createPlotConflictConceptSeed(
  input: PlotConflictConceptSeedInput,
): PlotConflictConceptSeed {
  return {
    ...input,
    examples: uniqueText(input.examples),
    tags: uniqueText([
      "plotto_modernized",
      "purpose_obstacle_conflict",
      input.category,
      ...input.tags,
    ]),
    relatedSeeds: uniqueText(input.relatedSeeds),
    oppositeSeeds: uniqueText(input.oppositeSeeds),
    romanceHooks: uniqueText(input.romanceHooks),
    scenarioHooks: uniqueText(input.scenarioHooks),
    dialoguePatterns: uniqueText(input.dialoguePatterns),
    routeEntryBeats: uniqueText(input.routeEntryBeats),
    routeExitBeats: uniqueText(input.routeExitBeats),
    compatibleTropes: uniqueText(input.compatibleTropes),
    compatibleWounds: uniqueText(input.compatibleWounds),
    compatiblePayoffs: uniqueText(input.compatiblePayoffs),
    antiPatterns: uniqueText(input.antiPatterns),
    sourceConflictIds: uniqueText(input.sourceConflictIds),
    metadata: {
      category: "plot_conflict",
      source: "plotto_modernized",
      conflictCategory: input.category,
      romanceValue: clampScore(input.metadata?.romanceValue ?? 7),
      conflictPotential: clampScore(input.metadata?.conflictPotential ?? 7),
      modernizationReview: input.metadata?.modernizationReview ?? "complete",
    },
  };
}

function toStandardVocabularySeed(
  seed: PlotConflictConceptSeed,
): VocabularySeedPreset {
  return createVocabularySeedPreset({
    seed: seed.seed,
    label: seed.label,
    description: [
      seed.description,
      `Purpose: ${seed.purpose}`,
      `Obstacle: ${seed.obstacle}`,
      `Pressure: ${seed.pressure}`,
      `Modern conflict: ${seed.modernizedConflict}`,
      `Emotional function: ${seed.emotionalFunction}`,
    ].join(" "),
    examples: [
      ...seed.examples,
      `Source conflict ids: ${seed.sourceConflictIds.join(", ")}.`,
    ],
    tags: [
      "plot_conflict",
      "plotto_modernized",
      seed.category,
      ...seed.tags,
      ...seed.compatibleTropes,
    ],
    relatedSeeds: [
      ...seed.relatedSeeds,
      ...seed.compatibleTropes,
      ...seed.compatibleWounds,
      ...seed.compatiblePayoffs,
    ],
    oppositeSeeds: [...seed.oppositeSeeds, ...seed.antiPatterns],
    romanceHooks: seed.romanceHooks,
    scenarioHooks: [
      ...seed.scenarioHooks,
      ...seed.routeEntryBeats,
      ...seed.routeExitBeats,
    ],
    dialoguePatterns: seed.dialoguePatterns,
    metadata: {
      rarity:
        seed.metadata.modernizationReview === "sensitive_source"
          ? "rare"
          : "uncommon",
      romanceValue: seed.metadata.romanceValue,
      conflictPotential: seed.metadata.conflictPotential,
    },
  });
}

function uniqueText(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const value of values) {
    const trimmed = value.trim();
    const key = trimmed.toLowerCase();
    if (!trimmed || seen.has(key)) {
      continue;
    }
    seen.add(key);
    output.push(trimmed);
  }

  return output;
}

function clampScore(value: number): number {
  return Math.min(10, Math.max(1, Math.round(value)));
}
