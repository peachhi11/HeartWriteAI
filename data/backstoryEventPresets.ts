export type BackstoryEventPresetCategory =
  | "Archetype"
  | "Backstory Seed"
  | "Achievement"
  | "Turning Point"
  | "Migration & Travel"
  | "Education & Training"
  | "Apprenticeship & Mentorship"
  | "First Love & Relationships"
  | "Public Failure & Humiliation"
  | "Found Family Formation"
  | "Career & Status Event"
  | "Adventure & Exploration"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface BackstoryEventPreset {
  id: string;
  category: BackstoryEventPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledBackstoryEventPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface BackstoryEventSeedGroup {
  category: BackstoryEventPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const BACKSTORY_EVENT_GUIDANCE =
  "Use this as backstory event texture. Achievements, failures, migration, education, mentorship, first love, found family, career, adventure, and turning points may shape identity without reducing the character to one past chapter or overriding {{user}} agency.";

const AGE_APPROPRIATE_MEMORY_GUIDANCE =
  "Use early romance, childhood, school, and first-love memories as age-appropriate, non-explicit backstory context only. Do not sexualise minors, school-aged characters, or childhood memories.";

export const backstoryEventPresets = [
  "Childhood Achievement",
  "Life-Changing Failure",
  "Academic Success",
  "Public Humiliation",
  "Migration Journey",
  "New Homeland",
  "Apprenticeship Arc",
  "Mentorship Arc",
  "First Love",
  "First Heartbreak",
  "Found Family Formation",
  "Career Breakthrough",
  "Inheritance Event",
  "Military Service",
  "Religious Calling",
  "Great Adventure",
  "Escape and Reinvention",
  "Rise to Prominence",
  "Fall From Grace",
  "Second Chance Life",
];

export const backstoryEventSeeds = [
  "backstory_event",
  "life_event",
  "formative_experience",
  "turning_point",
  "milestone",
  "defining_moment",
  "identity_shaping_event",
  "past_chapter",
  "life_transition",
  "origin_story",
  "coming_of_age_event",
  "career_event",
  "relationship_event",
  "family_event",
  "community_event",
  "social_mobility_event",
  "migration_event",
  "education_event",
  "achievement_event",
  "failure_event",
];

export const achievementSeeds = [
  "academic_success",
  "graduated_top_of_class",
  "earned_scholarship",
  "published_research",
  "won_competition",
  "won_tournament",
  "earned_title",
  "earned_rank",
  "career_breakthrough",
  "promotion",
  "business_success",
  "founded_organization",
  "saved_lives",
  "community_leadership",
  "artistic_recognition",
  "award_winner",
  "public_honor",
  "heroic_act",
  "mastered_skill",
  "completed_apprenticeship",
  "became_family_provider",
  "built_home",
  "bought_first_property",
  "earned_independence",
  "financial_success",
  "survived_against_odds",
  "proved_everyone_wrong",
  "fulfilled_childhood_dream",
  "became_mentor",
  "legacy_begins",
];

export const turningPointSeeds = [
  "left_home",
  "changed_career",
  "changed_beliefs",
  "changed_identity",
  "public_revelation",
  "secret_discovered",
  "met_life_changing_person",
  "saved_someone",
  "failed_someone",
  "chose_freedom",
  "chose_duty",
  "chose_love",
  "chose_revenge",
  "walked_away",
  "started_over",
  "reinvented_self",
  "accepted_truth",
  "lost_old_life",
  "found_new_purpose",
  "crossed_point_of_no_return",
];

export const migrationSeeds = [
  "immigration",
  "emigration",
  "diaspora_experience",
  "refugee_journey",
  "forced_relocation",
  "voluntary_migration",
  "left_small_town",
  "moved_to_city",
  "moved_to_frontier",
  "crossed_borders",
  "new_country",
  "new_world",
  "new_planet",
  "cultural_adaptation",
  "homesickness",
  "dual_identity",
  "third_culture_identity",
  "language_transition",
  "new_home_found",
  "rootlessness",
];

export const educationSeeds = [
  "formal_education",
  "self_taught",
  "apprenticeship",
  "guild_training",
  "academy_training",
  "military_training",
  "religious_training",
  "court_education",
  "private_tutoring",
  "scholarship_student",
  "boarding_school",
  "university_life",
  "graduate_studies",
  "field_training",
  "mentor_guidance",
  "apprentice_to_master",
  "expelled_from_school",
  "dropout_story",
  "lifelong_learner",
  "earned_mastery",
];

export const apprenticeshipSeeds = [
  "apprentice",
  "journeyman",
  "master_student",
  "craft_apprenticeship",
  "combat_apprenticeship",
  "academic_apprenticeship",
  "magical_apprenticeship",
  "trade_training",
  "mentor_bond",
  "surrogate_parent_mentor",
  "strict_mentor",
  "gentle_mentor",
  "mentor_disappointment",
  "mentor_pride",
  "surpassed_mentor",
  "mentor_loss",
  "mentor_betrayal",
  "carried_on_legacy",
  "inherited_responsibility",
  "became_the_mentor",
];

export const firstLoveSeeds = [
  "first_crush",
  "first_love",
  "childhood_sweetheart",
  "summer_romance",
  "school_romance",
  "forbidden_first_love",
  "unrequited_first_love",
  "mutual_first_love",
  "first_kiss",
  "first_relationship",
  "first_heartbreak",
  "first_betrayal",
  "love_lost_to_distance",
  "love_lost_to_timing",
  "widowed_young",
  "almost_lovers",
  "first_love_returns",
  "learned_about_love",
  "learned_about_loss",
  "still_compares_others_to_first_love",
];

export const publicFailureSeeds = [
  "public_failure",
  "public_humiliation",
  "career_collapse",
  "business_failed",
  "lost_election",
  "failed_exam",
  "lost_competition",
  "public_scandal",
  "social_rejection",
  "expulsion",
  "demotion",
  "dishonorable_discharge",
  "artistic_failure",
  "performance_disaster",
  "betrayed_in_public",
  "reputation_destroyed",
  "lost_everything",
  "became_cautionary_tale",
  "rebuilt_after_failure",
  "failure_became_strength",
];

export const foundFamilySeeds = [
  "found_family",
  "chosen_family",
  "adopted_friend_group",
  "crew_becomes_family",
  "team_becomes_family",
  "survivors_become_family",
  "safehouse_family",
  "community_found",
  "mentor_as_parent",
  "friend_as_sibling",
  "adopted_sibling",
  "informal_guardian",
  "group_of_misfits",
  "outsiders_together",
  "shared_survival_bond",
  "family_built_not_born",
  "earned_belonging",
  "first_place_that_felt_like_home",
  "family_after_loss",
  "home_found_in_people",
];

export const careerEventSeeds = [
  "first_job",
  "dream_job",
  "promotion",
  "career_change",
  "business_founded",
  "business_sold",
  "public_recognition",
  "professional_rivalry",
  "industry_breakthrough",
  "unexpected_success",
  "career_plateau",
  "forced_retirement",
  "career_resurrection",
  "became_leader",
  "became_expert",
  "earned_reputation",
  "lost_status",
  "regained_status",
  "legacy_project",
  "retirement_goal",
];

export const adventureSeeds = [
  "great_journey",
  "expedition",
  "exploration",
  "quest",
  "pilgrimage",
  "military_campaign",
  "space_mission",
  "sea_voyage",
  "road_trip",
  "world_travel",
  "survival_experience",
  "treasure_hunt",
  "discovery",
  "first_adventure",
  "adventure_changed_everything",
  "wanderer_years",
  "returned_home_changed",
  "saw_the_world",
  "crossed_the_unknown",
  "became_storyteller",
];

export const backstoryRomanceHooks = [
  "first_love_still_matters",
  "mentor_sees_new_love",
  "found_family_accepts_partner",
  "old_failure_makes_them_guarded",
  "migration_created_loneliness",
  "career_success_created_distance",
  "public_failure_created_shame",
  "achievement_created_pressure",
  "past_love_influences_present",
  "home_found_in_person_not_place",
  "partner_helps_rewrite_story",
  "past_and_present_collide",
  "old_dream_meets_new_love",
  "legacy_or_love_choice",
  "second_chance_at_happiness",
];

export const backstoryEventGates = [
  "first_past_story_gate",
  "first_achievement_reveal_gate",
  "first_failure_reveal_gate",
  "first_love_reveal_gate",
  "first_mentor_story_gate",
  "first_family_story_gate",
  "first_migration_story_gate",
  "first_turning_point_gate",
  "first_public_shame_gate",
  "first_found_family_gate",
  "first_secret_history_gate",
  "first_old_dream_gate",
  "past_meets_present_gate",
  "history_reframed_gate",
  "new_chapter_route",
];

export const backstoryDialogueSeeds = [
  "Who were you before all this?",
  "Someone who thought they knew where their life was going.",
  "You never talk about your first love.",
  "Some stories stop being about romance and start being about memory.",
  "You built all of this yourself?",
  "No. People helped. I was just lucky enough to recognize them.",
  "Why did you leave home?",
  "Because staying would have cost me who I wanted to become.",
  "You sound proud of that failure.",
  "I hated it at the time. It taught me more than success ever did.",
  "When did this place start feeling like home?",
  "When the people mattered more than the location.",
];

export const highValueBackstorySeeds = [
  "achievement_event",
  "turning_point",
  "migration_event",
  "education_event",
  "apprenticeship",
  "mentor_bond",
  "first_love",
  "first_heartbreak",
  "public_failure",
  "career_breakthrough",
  "found_family",
  "chosen_family",
  "left_home",
  "reinvented_self",
  "new_home_found",
  "surpassed_mentor",
  "failure_became_strength",
  "home_found_in_people",
  "past_meets_present_gate",
  "new_chapter_route",
];

const BACKSTORY_EVENT_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "backstory_event_archetype",
    guidance: BACKSTORY_EVENT_GUIDANCE,
    values: backstoryEventPresets,
  },
  {
    category: "Backstory Seed",
    prefix: "backstory_event_seed",
    guidance:
      "Use this as broad backstory vocabulary. Life events, milestones, origin stories, past chapters, transitions, achievements, failures, and formative experiences can shape identity without scripting the whole life.",
    values: backstoryEventSeeds,
  },
  {
    category: "Achievement",
    prefix: "backstory_event_achievement",
    guidance:
      "Use this as achievement and success texture. Success can create pride, pressure, status, responsibility, independence, legacy, or the need to prove something.",
    values: achievementSeeds,
  },
  {
    category: "Turning Point",
    prefix: "backstory_event_turning_point",
    guidance:
      "Use this as turning-point texture. Choice, revelation, rescue, failure, freedom, duty, revenge, reinvention, truth, loss, and purpose may redirect the character's life.",
    values: turningPointSeeds,
  },
  {
    category: "Migration & Travel",
    prefix: "backstory_event_migration",
    guidance:
      "Use this as migration and travel texture. Movement across homes, borders, worlds, languages, cultures, and identities can create homesickness, adaptation, belonging, or rootlessness.",
    values: migrationSeeds,
  },
  {
    category: "Education & Training",
    prefix: "backstory_event_education",
    guidance:
      "Use this as education and training texture. Schooling, self-teaching, apprenticeship, academies, military or religious training, tutoring, dropout stories, and mastery can shape competence and insecurity.",
    values: educationSeeds,
  },
  {
    category: "Apprenticeship & Mentorship",
    prefix: "backstory_event_apprenticeship",
    guidance:
      "Use this as apprenticeship and mentorship texture. Mentor bonds, strict training, pride, loss, betrayal, legacy, and surpassing a teacher can shape values and skill identity.",
    values: apprenticeshipSeeds,
  },
  {
    category: "First Love & Relationships",
    prefix: "backstory_event_first_love",
    guidance: `${AGE_APPROPRIATE_MEMORY_GUIDANCE} First love can shape memory, trust, comparison, distance, timing, grief, or closure without forcing current romance.`,
    values: firstLoveSeeds,
  },
  {
    category: "Public Failure & Humiliation",
    prefix: "backstory_event_public_failure",
    guidance:
      "Use this as public failure and humiliation texture. Failure can create shame, caution, resilience, changed ambition, fear of visibility, or strength earned through rebuilding.",
    values: publicFailureSeeds,
  },
  {
    category: "Found Family Formation",
    prefix: "backstory_event_found_family",
    guidance:
      "Use this as found-family texture. Belonging can be built through friends, crews, teams, survivors, safehouses, community, misfits, shared survival, and home found in people.",
    values: foundFamilySeeds,
  },
  {
    category: "Career & Status Event",
    prefix: "backstory_event_career",
    guidance:
      "Use this as career and status texture. Work, public recognition, rivalry, success, plateau, retirement, status loss, regained status, and legacy projects can shape ambition and reputation.",
    values: careerEventSeeds,
  },
  {
    category: "Adventure & Exploration",
    prefix: "backstory_event_adventure",
    guidance:
      "Use this as adventure and exploration texture. Journeys, quests, campaigns, voyages, missions, survival, discovery, wandering, and return can reshape worldview and story voice.",
    values: adventureSeeds,
  },
  {
    category: "Romance Hook",
    prefix: "backstory_event_romance",
    guidance: `${AGE_APPROPRIATE_MEMORY_GUIDANCE} Use this as romance-facing backstory texture for adult present-day relationships: old dreams, first love, found family, failure, migration, career, legacy, and rewritten stories can create stakes.`,
    values: backstoryRomanceHooks,
  },
  {
    category: "Gate",
    prefix: "backstory_event_gate",
    guidance:
      "Use this as a backstory event gate. Gates should mark earned reveals, old stories, shame, migration, found family, secrets, reframing, and new chapters without forcing confession.",
    values: backstoryEventGates,
  },
  {
    category: "Dialogue Seed",
    prefix: "backstory_event_dialogue",
    guidance:
      "Use this as optional backstory dialogue inspiration. Dialogue seeds should be adapted to character voice, trust level, and scene context rather than pasted as fixed lines.",
    values: backstoryDialogueSeeds,
  },
  {
    category: "High-Value Seed",
    prefix: "backstory_event_high_value",
    guidance:
      "Use this as a high-signal backstory event seed for character creation, matching, route planning, and preset search.",
    values: highValueBackstorySeeds,
  },
] satisfies readonly BackstoryEventSeedGroup[]);

function normalizeReadableBackstoryEventValue(value: string): string {
  const readable = value.includes("_") ? value.replace(/_/g, " ") : value;

  return readable
    .replace(/\b[Hh]onor\b/g, (match) => (match === "Honor" ? "Honour" : "honour"))
    .replace(/\b[Dd]ishonorable\b/g, (match) =>
      match === "Dishonorable" ? "Dishonourable" : "dishonourable",
    )
    .replace(/\b[Oo]rganization\b/g, (match) =>
      match === "Organization" ? "Organisation" : "organisation",
    )
    .replace(/\b[Rr]ecognize\b/g, (match) =>
      match === "Recognize" ? "Recognise" : "recognise",
    )
    .replace(/\b[Rr]ecognized\b/g, (match) =>
      match === "Recognized" ? "Recognised" : "recognised",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyBackstoryEvent(value: string) {
  return value
    .toLowerCase()
    .replace(/\{\{user\}\}'s/g, "user_s")
    .replace(/\{\{user\}\}/g, "user")
    .replace(/&/g, " and ")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function makeBackstoryEventPreset(
  group: BackstoryEventSeedGroup,
  rawValue: string,
): BackstoryEventPreset {
  const value = normalizeReadableBackstoryEventValue(rawValue);

  return {
    id: `${group.prefix}_${slugifyBackstoryEvent(value)}`,
    category: group.category,
    label: value,
    value,
    triggerKeys: Array.from(
      new Set([
        rawValue,
        value,
        slugifyBackstoryEvent(value),
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

export const BACKSTORY_EVENT_PRESETS = BACKSTORY_EVENT_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makeBackstoryEventPreset(group, value)),
);

export const BACKSTORY_EVENT_PRESET_CATEGORIES = Array.from(
  new Set(BACKSTORY_EVENT_PRESETS.map((preset) => preset.category)),
).sort();

export const getBackstoryEventPresetsByCategory = (
  category: BackstoryEventPresetCategory,
) => BACKSTORY_EVENT_PRESETS.filter((preset) => preset.category === category);

export const findBackstoryEventPresetById = (id: string) =>
  BACKSTORY_EVENT_PRESETS.find((preset) => preset.id === id);

export const compileBackstoryEventPresetAdditions = (
  preset: BackstoryEventPreset,
): CompiledBackstoryEventPresetAdditions => ({
  backgroundAddition: `Backstory event context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Backstory event texture may include ${preset.value} without replacing the character's full personality, contradictions, responsibilities, flaws, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft backstory event context.`,
    "Let achievements, failures, migration, education, mentorship, first love, found family, career, adventure, and turning points shape memory, stakes, identity, and choice when relevant.",
    "Keep consent, privacy, age-appropriate memory framing, and {{user}} autonomy intact; do not sexualise minors, school-aged characters, childhood memories, or early romance memories.",
  ].join(" "),
});
