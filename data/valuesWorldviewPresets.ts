export type ValuesWorldviewPresetCategory =
  | "Archetype"
  | "Worldview"
  | "Politics & Governance"
  | "Spirituality & Faith"
  | "Ethics in Practice"
  | "Class & Economic Attitudes"
  | "Ambition & Success Ethics"
  | "Relationship Philosophy"
  | "Romance Hook"
  | "High-Value Seed";

export interface ValuesWorldviewPreset {
  id: string;
  category: ValuesWorldviewPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledValuesWorldviewPresetAdditions {
  personalityAddition: string;
  backgroundAddition: string;
  systemPromptAddition: string;
}

interface ValuesWorldviewSeedGroup {
  category: ValuesWorldviewPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const VALUES_WORLDVIEW_GUIDANCE =
  "Use this as values and worldview texture. Beliefs, ethics, politics, spirituality, class attitudes, ambition, and relationship philosophy may shape choices without flattening the character, preaching, or overriding {{user}} agency.";

export const valuesWorldviewPresets = [
  "Idealistic Humanist",
  "Pragmatic Realist",
  "Traditionalist",
  "Progressive Reformer",
  "Libertarian Free Spirit",
  "Communitarian Builder",
  "Duty-Bound Guardian",
  "Compassion-First Caregiver",
  "Justice-Seeking Activist",
  "Honor-Bound Traditionalist",
  "Spiritual Seeker",
  "Secular Rationalist",
  "Ambitious Visionary",
  "Quiet Stoic",
  "Romantic Idealist",
  "Cynical Survivor",
  "Collectivist Thinker",
  "Individualist Thinker",
  "Redemption Believer",
  "Hope Against Odds",
];

export const worldviewSeeds = [
  "idealistic",
  "realistic",
  "pragmatic",
  "optimistic",
  "cynical",
  "hopeful",
  "stoic",
  "romantic",
  "humanistic",
  "collectivist",
  "individualist",
  "communitarian",
  "traditionalist",
  "progressive",
  "reformist",
  "conservative",
  "liberal",
  "centrist",
  "radical",
  "revolutionary",
  "believes_people_can_change",
  "believes_people_reveal_themselves",
  "trusts_human_nature",
  "distrusts_human_nature",
  "justice_oriented",
  "mercy_oriented",
  "duty_oriented",
  "freedom_oriented",
  "order_oriented",
  "equality_oriented",
  "responsibility_oriented",
  "loyalty_oriented",
  "truth_oriented",
  "compassion_oriented",
  "survival_oriented",
  "growth_oriented",
  "legacy_oriented",
  "future_oriented",
  "present_focused",
  "meaning_seeking",
];

export const politicalWorldviewSeeds = [
  "apolitical",
  "politically_engaged",
  "activist",
  "moderate",
  "reformist",
  "revolutionary",
  "institutionalist",
  "anti_authoritarian",
  "pro_authority",
  "community_governance",
  "strong_state_supporter",
  "localist",
  "globalist",
  "nationalist",
  "internationalist",
  "values_personal_freedom",
  "values_social_order",
  "values_equality",
  "values_meritocracy",
  "values_stability",
  "values_change",
  "values_democracy",
  "values_expertise",
  "values_tradition",
  "values_innovation",
  "skeptical_of_power",
  "believes_power_can_do_good",
  "wants_systemic_reform",
  "wants_incremental_change",
  "politically_disillusioned",
  "civically_engaged",
  "community_organizer",
  "institution_builder",
  "grassroots_thinker",
  "public_service_minded",
];

export const spiritualityStyleSeeds = [
  "religious",
  "spiritual",
  "agnostic",
  "atheist",
  "secular",
  "mystical",
  "devotional",
  "ritual_oriented",
  "philosophical",
  "nature_spirituality",
  "ancestor_reverence",
  "organized_religion",
  "personal_faith",
  "questioning_faith",
  "former_believer",
  "interfaith_minded",
  "daily_prayer",
  "meditation_practice",
  "contemplative",
  "pilgrimage_minded",
  "sacred_duty",
  "service_as_faith",
  "ethics_over_dogma",
  "tradition_as_identity",
  "faith_as_comfort",
  "faith_as_struggle",
  "faith_as_community",
  "faith_as_private",
  "believes_in_destiny",
  "believes_in_free_will",
  "believes_in_karma",
  "believes_in_divine_plan",
  "believes_meaning_is_created",
  "believes_in_higher_power",
  "believes_in_human_agency",
  "believes_in_spiritual_growth",
  "seeks_transcendence",
  "seeks_inner_peace",
];

export const ethicsSeeds = [
  "honesty_first",
  "compassion_first",
  "justice_first",
  "loyalty_first",
  "duty_first",
  "mercy_first",
  "truth_first",
  "survival_first",
  "responsibility_first",
  "freedom_first",
  "rule_follower",
  "rule_bender",
  "rule_breaker_for_good_reason",
  "ends_justify_means",
  "means_matter",
  "situational_ethics",
  "principled_ethics",
  "virtue_ethics",
  "consequence_focused",
  "intention_focused",
  "keeps_promises",
  "protects_the_vulnerable",
  "stands_up_to_power",
  "forgives_easily",
  "forgives_slowly",
  "believes_in_redemption",
  "believes_actions_define_people",
  "believes_context_matters",
  "takes_responsibility",
  "holds_grudges",
  "ethical_pragmatist",
  "ethical_idealism",
  "moral_absolutist",
  "moral_relativist",
  "harm_reduction_minded",
  "community_responsibility",
  "personal_accountability",
  "sacrifice_for_others",
  "protective_ethics",
  "care_ethics",
];

export const classAttitudeSeeds = [
  "working_class_pride",
  "middle_class_values",
  "upper_class_background",
  "old_money_attitude",
  "new_money_attitude",
  "class_conscious",
  "class_blind",
  "anti_elitist",
  "respect_for_expertise",
  "respect_for_labor",
  "wealth_as_tool",
  "wealth_as_responsibility",
  "wealth_as_freedom",
  "wealth_as_corruption_risk",
  "wealth_isolation_awareness",
  "economic_equality",
  "economic_opportunity",
  "meritocratic_beliefs",
  "structural_inequality_awareness",
  "self_made_identity",
  "frugal",
  "generous",
  "financially_cautious",
  "financially_ambitious",
  "anti_consumerist",
  "luxury_appreciation",
  "values_security",
  "values_independence",
  "community_resource_sharing",
  "philanthropic_mindset",
  "respects_manual_labor",
  "respects_academic_labor",
  "values_all_work",
  "status_skeptical",
  "status_conscious",
  "anti_class_hierarchy",
  "legacy_conscious",
  "upward_mobility_minded",
  "community_prosperity_minded",
  "economic_realist",
];

export const ambitionEthicsSeeds = [
  "highly_ambitious",
  "quietly_ambitious",
  "contentment_oriented",
  "achievement_oriented",
  "legacy_oriented",
  "purpose_oriented",
  "service_oriented",
  "recognition_oriented",
  "impact_oriented",
  "growth_oriented",
  "success_with_integrity",
  "success_at_any_cost",
  "balance_over_success",
  "family_over_career",
  "career_over_everything",
  "mission_driven",
  "craft_mastery_driven",
  "community_success_driven",
  "personal_freedom_driven",
  "financial_security_driven",
  "workaholic_tendencies",
  "healthy_ambition",
  "competitive_drive",
  "collaborative_success",
  "mentor_mindset",
  "builder_mindset",
  "innovator_mindset",
  "stewardship_mindset",
  "long_term_thinker",
  "present_focused_success",
  "ethical_leadership",
  "responsible_power",
  "ambition_with_compassion",
  "ambition_with_duty",
  "ambition_with_service",
  "fear_of_failure",
  "fear_of_wasted_potential",
  "legacy_pressure",
  "success_as_self_worth_risk",
  "purpose_over_status",
];

export const relationshipPhilosophySeeds = [
  "love_as_choice",
  "love_as_destiny",
  "love_as_partnership",
  "love_as_devotion",
  "love_as_growth",
  "love_as_home",
  "love_as_adventure",
  "love_as_commitment",
  "love_as_friendship",
  "love_as_teamwork",
  "monogamy_oriented",
  "nonmonogamy_oriented",
  "exclusive_bonding",
  "deep_commitment",
  "slow_trust",
  "instant_connection_believer",
  "earned_love",
  "unconditional_love_ideal",
  "conditional_on_respect",
  "mutual_effort_required",
  "communication_first",
  "trust_first",
  "friendship_first",
  "compatibility_first",
  "shared_values_first",
  "chemistry_first",
  "stability_first",
  "growth_first",
  "family_first",
  "independence_within_relationship",
  "believes_people_can_change",
  "believes_love_requires_work",
  "believes_love_should_feel_safe",
  "believes_vulnerability_is_strength",
  "believes_partners_choose_daily",
  "believes_conflict_can_be_healthy",
  "believes_repair_matters",
  "believes_loyalty_is_sacred",
  "believes_mutual_respect_is_foundational",
  "believes_home_is_a_person",
];

export const valuesWorldviewRomanceHooks = [
  "shared_values_create_bond",
  "opposing_worldviews_create_tension",
  "political_rivals_to_lovers",
  "faith_and_doubt_romance",
  "idealist_and_realist_pairing",
  "ambition_vs_relationship_conflict",
  "class_difference_romance",
  "wealth_gap_romance",
  "duty_vs_love_choice",
  "shared_mission_becomes_love",
  "ethics_under_pressure",
  "forgiveness_tests_values",
  "love_changes_worldview",
  "worldview_expands_through_love",
  "shared_future_requires_alignment",
  "respect_despite_difference",
  "values_proven_by_actions",
  "love_as_chosen_philosophy",
  "building_a_life_together",
  "shared_meaning_route",
];

export const highValueValuesWorldviewSeeds = [
  "idealistic",
  "pragmatic",
  "compassion_oriented",
  "justice_oriented",
  "freedom_oriented",
  "responsibility_oriented",
  "believes_people_can_change",
  "spiritual",
  "agnostic",
  "ethics_over_dogma",
  "honesty_first",
  "care_ethics",
  "working_class_pride",
  "wealth_as_responsibility",
  "highly_ambitious",
  "success_with_integrity",
  "love_as_choice",
  "love_as_partnership",
  "communication_first",
  "believes_love_should_feel_safe",
];

const VALUES_WORLDVIEW_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "values_worldview_archetype",
    guidance: VALUES_WORLDVIEW_GUIDANCE,
    values: valuesWorldviewPresets,
  },
  {
    category: "Worldview",
    prefix: "values_worldview_worldview",
    guidance:
      "Use this as general worldview texture. It may shape expectations, trust, hope, suspicion, duty, change, meaning, or social priorities without becoming a lecture.",
    values: worldviewSeeds,
  },
  {
    category: "Politics & Governance",
    prefix: "values_worldview_politics",
    guidance:
      "Use this as politics and governance texture. Treat public values as character context that can create stakes, civic habits, or conflict without endorsing a real-world platform or forcing persuasion.",
    values: politicalWorldviewSeeds,
  },
  {
    category: "Spirituality & Faith",
    prefix: "values_worldview_spirituality",
    guidance:
      "Use this as spirituality and faith texture. Faith, doubt, ritual, secular ethics, or meaning-making may shape private behaviour while preserving respect, nuance, and {{user}} agency.",
    values: spiritualityStyleSeeds,
  },
  {
    category: "Ethics in Practice",
    prefix: "values_worldview_ethics",
    guidance:
      "Use this as practical ethics texture. Values should appear through choices, repair, accountability, boundaries, sacrifice, mercy, or consequences rather than forced moral exposition.",
    values: ethicsSeeds,
  },
  {
    category: "Class & Economic Attitudes",
    prefix: "values_worldview_class",
    guidance:
      "Use this as class and economic attitude texture. Money, labour, status, security, generosity, and mobility may influence habits and conflict without stereotyping the character.",
    values: classAttitudeSeeds,
  },
  {
    category: "Ambition & Success Ethics",
    prefix: "values_worldview_ambition",
    guidance:
      "Use this as ambition and success ethics texture. Achievement, service, legacy, fear, power, recognition, or contentment may guide goals without making success the only character axis.",
    values: ambitionEthicsSeeds,
  },
  {
    category: "Relationship Philosophy",
    prefix: "values_worldview_relationship",
    guidance:
      "Use this as relationship philosophy texture. Love may be framed through choice, destiny, safety, work, loyalty, respect, growth, or independence without overriding consent or relationship pacing.",
    values: relationshipPhilosophySeeds,
  },
  {
    category: "Romance Hook",
    prefix: "values_worldview_romance",
    guidance:
      "Use this as romance-facing worldview texture. Shared or opposing values can create chemistry, tension, alignment, repair, or future-building while keeping conflict choice-safe.",
    values: valuesWorldviewRomanceHooks,
  },
  {
    category: "High-Value Seed",
    prefix: "values_worldview_high_value",
    guidance:
      "Use this as a high-signal values and worldview seed for character creation, matching, and preset search.",
    values: highValueValuesWorldviewSeeds,
  },
] satisfies readonly ValuesWorldviewSeedGroup[]);

function normalizeReadableValuesWorldviewValue(value: string): string {
  const readable = value.includes("_") ? value.replace(/_/g, " ") : value;

  return readable
    .replace(/\b[Hh]onor\b/g, (match) => (match === "Honor" ? "Honour" : "honour"))
    .replace(/\b[Ll]abor\b/g, (match) => (match === "Labor" ? "Labour" : "labour"))
    .replace(/\b[Oo]rganized\b/g, (match) =>
      match === "Organized" ? "Organised" : "organised",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyValuesWorldview(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function makeValuesWorldviewPreset(
  group: ValuesWorldviewSeedGroup,
  rawValue: string,
): ValuesWorldviewPreset {
  const value = normalizeReadableValuesWorldviewValue(rawValue);

  return {
    id: `${group.prefix}_${slugifyValuesWorldview(value)}`,
    category: group.category,
    label: value,
    value,
    triggerKeys: Array.from(
      new Set([
        rawValue,
        value,
        slugifyValuesWorldview(value),
        ...value
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter((part) => part.length > 2),
      ]),
    ),
    guidance: group.guidance,
    systemPromptTags: [group.category, value],
  };
}

export const VALUES_WORLDVIEW_PRESETS = VALUES_WORLDVIEW_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makeValuesWorldviewPreset(group, value)),
);

export const VALUES_WORLDVIEW_PRESET_CATEGORIES = Array.from(
  new Set(VALUES_WORLDVIEW_PRESETS.map((preset) => preset.category)),
).sort();

export const getValuesWorldviewPresetsByCategory = (
  category: ValuesWorldviewPresetCategory,
) => VALUES_WORLDVIEW_PRESETS.filter((preset) => preset.category === category);

export const findValuesWorldviewPresetById = (id: string) =>
  VALUES_WORLDVIEW_PRESETS.find((preset) => preset.id === id);

export const compileValuesWorldviewPresetAdditions = (
  preset: ValuesWorldviewPreset,
): CompiledValuesWorldviewPresetAdditions => ({
  backgroundAddition: `Values and worldview context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Values and worldview texture may include ${preset.value} without replacing the character's full personality, contradictions, responsibilities, flaws, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft values and worldview context.`,
    "Let beliefs, ethics, class attitudes, spirituality, ambition, and relationship philosophy shape behaviour through choices, boundaries, repair, and consequences when relevant.",
    "Keep nuance, consent, privacy, and {{user}} autonomy intact; values should add human specificity without turning the character into a single ideology or sermon.",
  ].join(" "),
});
