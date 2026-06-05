export type NpcNetworkPresetCategory =
  | "Archetype"
  | "Network Seed"
  | "Friend"
  | "Rival"
  | "Ex"
  | "Mentor"
  | "Dependant"
  | "Family Member"
  | "Enemy"
  | "Patron"
  | "Employer"
  | "Conflict"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface NpcNetworkPreset {
  id: string;
  category: NpcNetworkPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledNpcNetworkPresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  systemPromptAddition: string;
}

interface NpcNetworkSeedGroup {
  category: NpcNetworkPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const NPC_NETWORK_GUIDANCE =
  "Use this as NPC network texture. Friends, rivals, exes, mentors, dependants, family, enemies, patrons, employers, and social circles may create stakes, support, pressure, loyalty tests, and community without overriding {{user}} agency.";

const NON_ROMANTIC_CARE_GUIDANCE =
  "Dependants, children, wards, students, patients, siblings, parents, and family roles are non-romantic and non-sexual context only. Use them for care, duty, boundaries, stakes, vulnerability, and community responsibility.";

export const npcNetworkPresets = [
  "Found Family Network",
  "Rival Circle",
  "Messy Exes Network",
  "Mentor Lineage",
  "Dependent Household",
  "Powerful Family Web",
  "Enemy Web",
  "Patronage Network",
  "Workplace Network",
  "Underworld Contacts",
  "Court Connections",
  "Academy Circle",
  "Small Town Everyone Knows Everyone",
  "Old Friends and Old Wounds",
  "Protective Inner Circle",
  "Dangerous Allies",
  "Estranged Family",
  "Secret Support Network",
  "Romantic Complication Network",
  "Loyalty-Test Network",
];

export const npcNetworkSeeds = [
  "npc_network",
  "social_network",
  "relationship_web",
  "support_network",
  "found_family",
  "inner_circle",
  "outer_circle",
  "trusted_contacts",
  "dangerous_contacts",
  "old_connections",
  "new_connections",
  "hidden_connections",
  "public_relationships",
  "private_relationships",
  "messy_relationship_web",
  "loyalty_network",
  "obligation_network",
  "patronage_network",
  "enemy_network",
  "community_network",
];

export const friendSeeds = [
  "best_friend",
  "childhood_friend",
  "old_friend",
  "new_friend",
  "work_friend",
  "school_friend",
  "found_family_friend",
  "protective_friend",
  "chaotic_friend",
  "honest_friend",
  "flirtatious_friend",
  "quiet_friend",
  "ride_or_die_friend",
  "friend_who_knows_too_much",
  "friend_with_unspoken_history",
  "friend_with_secret_crush",
  "friend_as_confidant",
  "friend_as_anchor",
  "friend_as_bad_influence",
  "friend_as_safe_place",
];

export const rivalSeeds = [
  "professional_rival",
  "academic_rival",
  "romantic_rival",
  "childhood_rival",
  "political_rival",
  "court_rival",
  "business_rival",
  "combat_rival",
  "creative_rival",
  "family_rival",
  "friendly_rival",
  "bitter_rival",
  "obsessed_rival",
  "jealous_rival",
  "respectful_rival",
  "rival_who_understands_them",
  "rival_with_history",
  "rival_to_ally",
  "rival_to_love_interest",
  "rival_as_mirror",
];

export const exSeeds = [
  "ex_partner",
  "first_love",
  "almost_lover",
  "former_fiance",
  "former_spouse",
  "right_person_wrong_time_ex",
  "betrayed_ex",
  "amicable_ex",
  "bitter_ex",
  "clingy_ex",
  "jealous_ex",
  "protective_ex",
  "dangerous_ex",
  "unfinished_business_ex",
  "ex_who_knows_weaknesses",
  "ex_who_returns",
  "ex_as_temptation",
  "ex_as_wound",
  "ex_as_warning",
  "ex_as_closure_arc",
];

export const mentorSeeds = [
  "mentor",
  "teacher",
  "master",
  "trainer",
  "advisor",
  "elder",
  "guild_master",
  "court_tutor",
  "combat_instructor",
  "academic_advisor",
  "spiritual_guide",
  "former_boss_mentor",
  "surrogate_parent_mentor",
  "harsh_mentor",
  "gentle_mentor",
  "disappointed_mentor",
  "fallen_mentor",
  "secretive_mentor",
  "mentor_with_hidden_agenda",
  "mentor_who_must_be_surpassed",
];

export const dependantSeeds = [
  "younger_sibling",
  "child",
  "ward",
  "apprentice",
  "student",
  "patient",
  "elderly_parent",
  "disabled_relative",
  "orphan_under_care",
  "found_family_dependent",
  "pet_companion",
  "familiar",
  "crew_member_under_care",
  "citizens_under_protection",
  "servant_under_protection",
  "dependent_who_hides_need",
  "dependent_who_tests_patience",
  "dependent_as_responsibility",
  "dependent_as_soft_spot",
  "dependent_as_vulnerability",
];

export const familyMemberSeeds = [
  "mother",
  "father",
  "parent",
  "sibling",
  "older_sibling",
  "younger_sibling",
  "twin",
  "half_sibling",
  "step_sibling",
  "cousin",
  "aunt",
  "uncle",
  "grandparent",
  "child",
  "adoptive_parent",
  "adoptive_sibling",
  "estranged_family",
  "chosen_family",
  "family_matriarch",
  "family_patriarch",
];

export const enemySeeds = [
  "personal_enemy",
  "family_enemy",
  "political_enemy",
  "professional_enemy",
  "romantic_enemy",
  "enemy_from_past",
  "betrayer_enemy",
  "hunter_enemy",
  "criminal_enemy",
  "rival_house_enemy",
  "enemy_agent",
  "enemy_commander",
  "enemy_lover",
  "enemy_who_knows_secret",
  "enemy_with_leverage",
  "enemy_who_once_cared",
  "enemy_as_shadow_self",
  "enemy_to_ally",
  "enemy_to_lovers",
  "enemy_who_forces_growth",
];

export const patronSeeds = [
  "patron",
  "benefactor",
  "sponsor",
  "wealthy_supporter",
  "noble_patron",
  "royal_patron",
  "art_patron",
  "academic_patron",
  "political_patron",
  "criminal_patron",
  "divine_patron",
  "magical_patron",
  "corporate_sponsor",
  "secret_benefactor",
  "patron_with_conditions",
  "patron_with_hidden_motive",
  "protective_patron",
  "controlling_patron",
  "patron_debt",
  "patronage_as_cage",
];

export const employerSeeds = [
  "employer",
  "boss",
  "manager",
  "ceo",
  "guild_leader",
  "crime_boss",
  "royal_employer",
  "military_commander",
  "household_head",
  "academy_headmaster",
  "patron_employer",
  "client_employer",
  "contract_holder",
  "mission_handler",
  "captain",
  "director",
  "employer_with_power_gap",
  "employer_with_secret_agenda",
  "employer_as_romantic_complication",
  "employer_as_antagonist",
];

export const npcNetworkConflictSeeds = [
  "loyalty_conflict",
  "family_vs_love",
  "friend_vs_romance",
  "ex_returns",
  "rival_interferes",
  "mentor_disapproves",
  "dependent_needs_protection",
  "enemy_targets_loved_one",
  "patron_calls_in_debt",
  "employer_forbids_relationship",
  "family_secret_revealed",
  "friend_betrayal",
  "rival_becomes_ally",
  "enemy_offers_help",
  "found_family_tests_partner",
  "social_circle_takes_sides",
  "public_reputation_at_risk",
  "old_connection_returns",
  "relationship_web_exposes_secret",
  "choosing_love_costs_network",
];

export const npcNetworkRomanceHooks = [
  "best_friend_notices_feelings_first",
  "rival_gets_jealous",
  "ex_returns_at_worst_time",
  "mentor_warns_against_love",
  "dependent_bonds_with_user",
  "family_disapproves",
  "enemy_uses_loved_one_as_leverage",
  "patron_demands_separation",
  "employer_discovers_relationship",
  "found_family_adopts_user",
  "friend_group_forced_proximity",
  "family_dinner_tension",
  "rival_defends_user_publicly",
  "ex_gives_closure",
  "mentor_sees_growth",
  "enemy_becomes_reluctant_ally",
  "inner_circle_tests_trust",
  "network_forces_public_choice",
  "love_reorders_loyalties",
  "chosen_family_route",
];

export const npcNetworkGates = [
  "first_friend_introduction_gate",
  "first_rival_scene_gate",
  "first_ex_reveal_gate",
  "first_mentor_scene_gate",
  "first_dependent_care_gate",
  "first_family_scene_gate",
  "first_enemy_threat_gate",
  "first_patron_debt_gate",
  "first_employer_conflict_gate",
  "first_network_secret_gate",
  "first_loyalty_test_gate",
  "first_public_side_taken_gate",
  "first_found_family_acceptance_gate",
  "first_network_betrayal_gate",
  "first_network_repair_gate",
  "loyalty_reordered_gate",
  "chosen_family_gate",
  "love_survives_network_gate",
  "community_acceptance_gate",
  "shared_life_network_route",
];

export const npcNetworkDialogueSeeds = [
  "They know you better than I do.",
  "They know who I was. You know who I am becoming.",
  "Your friend hates me.",
  "My friend hates everyone before breakfast.",
  "Your ex still loves you.",
  "Maybe. But I am not still living there.",
  "Your mentor does not approve.",
  "My mentor trained me to choose wisely. Now they are upset I did.",
  "You have people depending on you.",
  "I know.",
  "Then let me help carry them too.",
  "Your enemies know my name now.",
  "Then they will learn what happens when they use it.",
  "I do not want to come between you and your family.",
  "You are not between us. You are beside me while I face them.",
  "Everyone has an opinion about us.",
  "Good. Let them choke on it while we choose each other.",
];

export const highValueNpcNetworkSeeds = [
  "found_family",
  "inner_circle",
  "best_friend",
  "childhood_friend",
  "professional_rival",
  "romantic_rival",
  "ex_partner",
  "first_love",
  "mentor",
  "surrogate_parent_mentor",
  "ward",
  "younger_sibling",
  "estranged_family",
  "personal_enemy",
  "enemy_with_leverage",
  "secret_benefactor",
  "employer_with_power_gap",
  "loyalty_conflict",
  "chosen_family_gate",
  "shared_life_network_route",
];

const NPC_NETWORK_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "npc_network_archetype",
    guidance: NPC_NETWORK_GUIDANCE,
    values: npcNetworkPresets,
  },
  {
    category: "Network Seed",
    prefix: "npc_network_seed",
    guidance:
      "Use this as broad social web texture. Networks can define public reputation, private loyalties, support, pressure, danger, obligations, and community memory.",
    values: npcNetworkSeeds,
  },
  {
    category: "Friend",
    prefix: "npc_network_friend",
    guidance:
      "Use this as friend-role texture. Friends can provide support, honesty, chaos, bad influence, safety, history, or conflict without replacing the primary relationship.",
    values: friendSeeds,
  },
  {
    category: "Rival",
    prefix: "npc_network_rival",
    guidance:
      "Use this as rival-role texture. Rivals can create pressure, jealousy, respect, mirrors, competition, or reluctant alliance while keeping agency and consequences intact.",
    values: rivalSeeds,
  },
  {
    category: "Ex",
    prefix: "npc_network_ex",
    guidance:
      "Use this as ex-role texture. Exes can reveal old wounds, closure, temptation, unfinished business, jealousy, warning signs, or past growth without forcing reunion.",
    values: exSeeds,
  },
  {
    category: "Mentor",
    prefix: "npc_network_mentor",
    guidance:
      "Use this as mentor-role texture. Mentors can provide guidance, disapproval, lineage, pressure, secrets, standards, or growth thresholds without taking control of the character.",
    values: mentorSeeds,
  },
  {
    category: "Dependant",
    prefix: "npc_network_dependant",
    guidance: `${NON_ROMANTIC_CARE_GUIDANCE} Dependant roles can show responsibility, soft spots, patience, protection, exhaustion, and chosen duty.`,
    values: dependantSeeds,
  },
  {
    category: "Family Member",
    prefix: "npc_network_family",
    guidance: `${NON_ROMANTIC_CARE_GUIDANCE} Family roles can create belonging, estrangement, approval pressure, inherited wounds, chosen-family contrast, or community stakes.`,
    values: familyMemberSeeds,
  },
  {
    category: "Enemy",
    prefix: "npc_network_enemy",
    guidance:
      "Use this as enemy-role texture. Enemies can create danger, leverage, history, shadow-self pressure, reluctant aid, or growth tests while preserving consent and escape routes.",
    values: enemySeeds,
  },
  {
    category: "Patron",
    prefix: "npc_network_patron",
    guidance:
      "Use this as patron-role texture. Patrons can bring resources, debt, conditions, status, hidden motives, protection, control, or cage-like obligations.",
    values: patronSeeds,
  },
  {
    category: "Employer",
    prefix: "npc_network_employer",
    guidance:
      "Use this as employer-role texture. Employers can create hierarchy, duty, secrets, contracts, rank pressure, power gaps, workplace stakes, or antagonistic constraints.",
    values: employerSeeds,
  },
  {
    category: "Conflict",
    prefix: "npc_network_conflict",
    guidance:
      "Use this as NPC network conflict texture. Loyalty, family, friends, exes, rivals, mentors, dependants, enemies, patrons, employers, reputation, and secrets can pressure choices without forcing outcomes.",
    values: npcNetworkConflictSeeds,
  },
  {
    category: "Romance Hook",
    prefix: "npc_network_romance",
    guidance: `${NON_ROMANTIC_CARE_GUIDANCE} Use this as romance-facing network texture around the adult relationship: introductions, approval, jealousy, closure, public choices, loyalties, and found family can shape stakes without making every NPC romantic.`,
    values: npcNetworkRomanceHooks,
  },
  {
    category: "Gate",
    prefix: "npc_network_gate",
    guidance:
      "Use this as an NPC network event gate. Gates should mark introductions, reveals, threats, debts, side-taking, betrayal, repair, acceptance, and reordered loyalties only when earned.",
    values: npcNetworkGates,
  },
  {
    category: "Dialogue Seed",
    prefix: "npc_network_dialogue",
    guidance:
      "Use this as optional NPC network dialogue inspiration. Dialogue seeds should be adapted to character voice, social stakes, and relationship context rather than pasted as fixed lines.",
    values: npcNetworkDialogueSeeds,
  },
  {
    category: "High-Value Seed",
    prefix: "npc_network_high_value",
    guidance:
      "Use this as a high-signal NPC network seed for character creation, matching, route planning, and preset search.",
    values: highValueNpcNetworkSeeds,
  },
] satisfies readonly NpcNetworkSeedGroup[]);

function normalizeReadableNpcNetworkValue(value: string): string {
  const readable = value.includes("_")
    ? value
        .replace(/users_/g, "{{user}}_s_")
        .replace(/_for_user\b/g, "_for_{{user}}")
        .replace(/_with_user\b/g, "_with_{{user}}")
        .replace(/_user_/g, "_{{user}}_")
        .replace(/\buser_/g, "{{user}}_")
        .replace(/_user\b/g, "_{{user}}")
        .replace(/_/g, " ")
        .replace(/\{\{user\}\} s/g, "{{user}}'s")
    : value;

  return readable.replace(/\s+/g, " ").trim();
}

function slugifyNpcNetwork(value: string) {
  return value
    .toLowerCase()
    .replace(/\{\{user\}\}'s/g, "user_s")
    .replace(/\{\{user\}\}/g, "user")
    .replace(/&/g, " and ")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function makeNpcNetworkPreset(group: NpcNetworkSeedGroup, rawValue: string): NpcNetworkPreset {
  const value = normalizeReadableNpcNetworkValue(rawValue);
  const normalizedTriggerValue = value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user");

  return {
    id: `${group.prefix}_${slugifyNpcNetwork(value)}`,
    category: group.category,
    label: value,
    value,
    triggerKeys: Array.from(
      new Set([
        rawValue,
        value,
        slugifyNpcNetwork(value),
        ...normalizedTriggerValue
          .split(/[^a-z0-9]+/)
          .filter((part) => part.length > 2),
      ]),
    ),
    guidance: group.guidance,
    systemPromptTags: [group.category, value],
  };
}

export const NPC_NETWORK_PRESETS = NPC_NETWORK_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makeNpcNetworkPreset(group, value)),
);

export const NPC_NETWORK_PRESET_CATEGORIES = Array.from(
  new Set(NPC_NETWORK_PRESETS.map((preset) => preset.category)),
).sort();

export const getNpcNetworkPresetsByCategory = (category: NpcNetworkPresetCategory) =>
  NPC_NETWORK_PRESETS.filter((preset) => preset.category === category);

export const findNpcNetworkPresetById = (id: string) =>
  NPC_NETWORK_PRESETS.find((preset) => preset.id === id);

export const compileNpcNetworkPresetAdditions = (
  preset: NpcNetworkPreset,
): CompiledNpcNetworkPresetAdditions => ({
  backgroundAddition: `NPC network context: ${preset.value}. ${preset.guidance}`,
  relationshipAddition: `NPC network texture may include ${preset.value} without replacing the main relationship, the character's private agency, or the value of non-romantic ties.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft NPC network context.`,
    "Let friends, rivals, exes, mentors, dependants, family, enemies, patrons, employers, reputation, and community shape stakes, obligations, support, and conflict when relevant.",
    "Keep consent, privacy, boundaries, non-romantic care roles, and {{user}} autonomy intact; do not sexualize dependants, children, wards, students, patients, siblings, parents, or family roles.",
  ].join(" "),
});
