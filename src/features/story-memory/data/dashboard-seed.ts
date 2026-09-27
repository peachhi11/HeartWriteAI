import type {
  Bookshelf,
  CategoryTag,
  Character,
  CorePromptPack,
  GeneratedPromptPack,
  LibraryBook,
  RelationshipThread,
  SceneMemory,
  SecretOrReveal,
  Story,
  StoryBook,
  StoryBookBinding,
} from "@/features/story-memory/types/story-memory";

const now = "2026-09-22T00:00:00.000Z";

export const activeStory: Story = {
  id: "story-demo",
  title: "Untitled Story Memory",
  description: "A clean workspace for testing HeartWriteAI's first component.",
  genre: "Romance",
  subgenre: "Character-driven roleplay",
  heat_level: "spicy",
  default_pov_mode: "narrator_pov",
  supported_pov_modes: ["char_pov", "user_pov", "narrator_pov"],
  active_status: "active",
  content_boundaries: ["Blocked content stays excluded from exports."],
  export_targets: ["JanitorAI", "SillyTavern", "MarinaraTavern"],
  created_at: now,
  updated_at: now,
};

export const sampleCharacters: Character[] = [
  {
    id: "char",
    story_id: activeStory.id,
    name: "{{char}}",
    aliases: ["Character"],
    role: "AI-controlled character",
    public_facts: ["Presents as controlled and unreadable."],
    private_truths: ["Has been keeping one major emotional confession buried."],
    self_beliefs: ["Believes restraint is safer than honesty."],
    false_beliefs: ["Assumes nobody notices the jealousy."],
    wants: ["Control", "closeness without vulnerability"],
    fears: ["Being chosen only when convenient"],
    boundaries: ["{{char}} is controlled by AI, but only knows what the active POV allows."],
    current_emotional_state: "Composed, watchful, under pressure",
    created_at: now,
    updated_at: now,
  },
  {
    id: "user",
    story_id: activeStory.id,
    name: "{{user}}",
    aliases: ["Player", "User player"],
    role: "User player",
    public_facts: ["Acts like the situation is casual."],
    private_truths: ["Knows more than they admit."],
    self_beliefs: ["Believes silence gives them leverage."],
    false_beliefs: [],
    wants: ["Proof", "attention", "the upper hand"],
    fears: ["Looking foolish first"],
    boundaries: ["{{user}} thoughts, dialogue, choices, consent, and body reactions are user-controlled."],
    current_emotional_state: "Amused, suspicious, not as detached as claimed",
    created_at: now,
    updated_at: now,
  },
];

export const sampleScenes: SceneMemory[] = [
  {
    id: "scene-1",
    story_id: activeStory.id,
    title: "After the party",
    sequence_index: 1,
    location: "Kitchen doorway",
    scenario: "{{char}} and {{user}} are circling a secret after a public party left them both with leverage.",
    setting: "A private kitchen doorway after the party, close enough to the crowd that privacy feels temporary.",
    continuity_mode: "canon",
    chapter_label: "Opening pressure point",
    narrative_arc: "Mutual suspicion becomes reluctant intimacy.",
    pov_mode: "narrator_pov",
    participants: ["char", "user"],
    summary:
      "The conversation stayed polite on the surface, but both {{char}} and {{user}} left with new leverage.",
    key_actions: ["{{user}} noticed the contradiction.", "{{char}} avoided a direct answer."],
    emotional_shift: "Attraction sharpened into suspicion.",
    relationship_shift: "The dynamic moved from easy banter to strategic testing.",
    new_information: ["{{user}} may know about the secret."],
    unresolved_hooks: ["Who else overheard the hallway argument?"],
    continuity_flags: ["Do not reveal private motives unless surfaced in-scene."],
    canon_status: "canon",
    created_at: now,
    updated_at: now,
  },
];

export const sampleRelationships: RelationshipThread[] = [
  {
    id: "rel-1",
    story_id: activeStory.id,
    participants: ["char", "user"],
    dynamic_label: "Situationship with mutual suspicion",
    current_state: "Undefined, charged, and deliberately unclaimed.",
    attraction_notes: "Both use composure as a shield.",
    trust_notes: "Trust is conditional and tested through omissions.",
    conflict_notes: "Each believes the other is withholding the more dangerous truth.",
    boundaries: ["No omniscient narration of hidden motives."],
    linked_secret_ids: ["secret-1"],
    unresolved_tension: "They want confession without being the first to surrender leverage.",
    next_pressure_point: "Force proximity with no easy exit.",
    created_at: now,
    updated_at: now,
  },
];

export const sampleSecrets: SecretOrReveal[] = [
  {
    id: "secret-1",
    story_id: activeStory.id,
    title: "The Secret Leverage",
    secret_text:
      "{{char}} thinks {{user}} does not know about the betrayal; {{user}} knows and is pretending not to.",
    who_knows: ["user"],
    who_suspects: ["char"],
    who_is_wrong: ["char"],
    who_is_hiding_it: ["char"],
    who_knows_that_someone_knows: [],
    who_falsely_believes_they_are_safe: ["char"],
    who_is_pretending_not_to_know: ["user"],
    reveal_status: "suspected",
    related_scene_ids: ["scene-1"],
    related_relationship_thread_ids: ["rel-1"],
    consequences_if_revealed: "The relationship stops being undefined and becomes a negotiation.",
    current_pressure: "Rising",
    created_at: now,
    updated_at: now,
  },
];

export const samplePromptPacks: GeneratedPromptPack[] = [
  {
    id: "prompt-session-1",
    story_id: activeStory.id,
    title: "Situationship pressure pack",
    target_platform: "JanitorAI",
    tailoring_goal: "Keep the next reply close, tense, and knowledge-safe.",
    active_pov_mode: "narrator_pov",
    spice_visibility_snapshot: "censored",
    included_sections: ["Relationship state", "Secrets policy", "POV guardrails"],
    max_length_preference: "compact",
    selected_tropes: ["Situationship", "Mutual Longing"],
    selected_characters: ["char", "user"],
    selected_relationship_threads: ["rel-1"],
    selected_scene_memories: ["scene-1"],
    selected_secrets_policy: "active_pov_only",
    generated_text:
      "Keep the scene in close shared narration. Preserve the secret asymmetry: {{char}} believes they are safer than they are; {{user}} knows more than they admit. Do not write {{user}} thoughts, dialogue, consent, choices, or body reactions.",
    persistence_state: "session",
    created_at: now,
    updated_at: now,
  },
];

export const sampleBookshelves: Bookshelf[] = [
  {
    id: "bookshelf-active-romance",
    title: "Active Romance Builds",
    description: "Working StoryBooks for character/user pairings that should stay packaged together.",
    sort_order: 1,
    created_at: now,
    updated_at: now,
  },
];

export const sampleStoryBooks: StoryBook[] = [
  {
    id: "storybook-demo",
    bookshelf_id: "bookshelf-active-romance",
    title: "{{char}} / {{user}} StoryBook",
    description:
      "A packaged story workspace assembled from the loaded character card, generated user persona, scenario state, world context, memory, and prompt stack.",
    active_story_id: activeStory.id,
    status: "active",
    sort_order: 1,
    created_at: now,
    updated_at: now,
  },
];

export const sampleLibraryBooks: LibraryBook[] = [
  libraryBook({
    id: "book-character-demo",
    book_type: "character_book",
    title: "Character Book",
    description: "Loaded {{char}} card data and character-facing constraints.",
    source_entity_id: "char",
    source_entity_type: "character",
    sort_order: 1,
  }),
  libraryBook({
    id: "book-user-demo",
    book_type: "user_book",
    title: "User Book",
    description: "Generated {{user}} persona drafts and player-facing identity notes.",
    source_entity_id: "user",
    source_entity_type: "character",
    sort_order: 2,
  }),
  libraryBook({
    id: "book-scenario-demo",
    book_type: "scenario_book",
    title: "Scenario Book",
    description: "The setup, current scene, Alt branches, chapter labels, and narrative arcs.",
    source_entity_id: "scene-1",
    source_entity_type: "scene_memory",
    sort_order: 3,
  }),
  libraryBook({
    id: "book-world-demo",
    book_type: "world_book",
    title: "World Book",
    description: "Setting, genre rules, world context, and reusable location logic.",
    sort_order: 4,
  }),
  libraryBook({
    id: "book-memory-demo",
    book_type: "memory_book",
    title: "Memory Book",
    description: "Relationship threads, secrets, reveals, and continuity pressure.",
    source_entity_id: "rel-1",
    source_entity_type: "relationship_thread",
    sort_order: 5,
  }),
  libraryBook({
    id: "book-prompt-demo",
    book_type: "prompt_book",
    title: "Prompt Book",
    description: "Generated prompt packs, writing-style modules, export settings, and platform targets.",
    source_entity_id: "prompt-session-1",
    source_entity_type: "generated_prompt_pack",
    sort_order: 6,
  }),
];

export const sampleStoryBookBindings: StoryBookBinding[] = sampleLibraryBooks.map((book, index) => ({
  id: `binding-storybook-demo-${book.id}`,
  storybook_id: "storybook-demo",
  book_id: book.id,
  sort_order: index + 1,
  created_at: now,
  updated_at: now,
}));

export const groupedCategoryTags: CategoryTag[] = [
  categoryTag("trope", "Brother's Best Friend", "brothers-best-friend"),
  categoryTag("trope", "Brother's Girlfriend", "brothers-girlfriend"),
  categoryTag("trope", "Brother's Boyfriend", "brothers-boyfriend"),
  categoryTag("trope", "Sister's Best Friend", "sisters-best-friend"),
  categoryTag("trope", "Sister's Girlfriend", "sisters-girlfriend"),
  categoryTag("trope", "Sister's Boyfriend", "sisters-boyfriend"),
  categoryTag("trope", "Best Friend's Best Friend", "best-friends-best-friend"),
  categoryTag("trope", "Best Friend's Girlfriend", "best-friends-girlfriend"),
  categoryTag("trope", "Best Friend's Boyfriend", "best-friends-boyfriend"),
  categoryTag("trope", "Enemies to Lovers", "enemies-to-lovers"),
  categoryTag("trope", "Friends to Lovers", "friends-to-lovers"),
  categoryTag("trope", "Exes", "exes"),
  categoryTag("trope", "Missed Connections", "missed-connections"),
  categoryTag("trope", "Secret Relationship", "secret-relationship"),
  categoryTag("trope", "Step Siblings", "step-siblings"),
  categoryTag("trope", "Age Gap", "age-gap"),
  categoryTag("trope", "Marriage of Convenience", "marriage-of-convenience"),
  categoryTag("trope", "Betrothal", "betrothal"),
  categoryTag("trope", "Fake Dating", "fake-dating"),
  categoryTag("trope", "Omegaverse", "omegaverse"),
  categoryTag("trope", "Vampire", "vampire"),
  categoryTag("trope", "Werewolf", "werewolf"),
  categoryTag("trope", "Sci-Fi", "sci-fi"),
  categoryTag("trope", "Situationship", "situationship", "Undefined relationship with emotional leverage and unclear claims."),
  categoryTag("relationship_dynamic", "Possessive", "possessive"),
  categoryTag("relationship_dynamic", "Obsessive", "obsessive"),
  categoryTag("relationship_dynamic", "Dominant/submissive", "dominant-submissive"),
  categoryTag("relationship_dynamic", "Switch/submissive", "switch-submissive"),
  categoryTag("relationship_dynamic", "Competitive", "competitive"),
  categoryTag("relationship_dynamic", "Menage", "menage"),
  categoryTag("relationship_dynamic", "Polycule", "polycule"),
  categoryTag("relationship_dynamic", "Opposites Attract", "opposites-attract"),
  categoryTag("relationship_dynamic", "Class Disparity", "class-disparity"),
  categoryTag("relationship_dynamic", "Hurt/Comfort", "hurt-comfort"),
  categoryTag("relationship_dynamic", "Grumpy/Sunshine", "grumpy-sunshine"),
  categoryTag("relationship_dynamic", "One Night Stand", "one-night-stand"),
  categoryTag("relationship_dynamic", "FWB", "fwb"),
  categoryTag("relationship_dynamic", "Mutual Longing", "mutual-longing"),
  categoryTag("relationship_dynamic", "One-Sided Pining", "one-sided-pining"),
  categoryTag("relationship_dynamic", "Aro/Ace", "aro-ace"),
  categoryTag("heat_intimacy_mode", "PG13", "pg13"),
  categoryTag("heat_intimacy_mode", "NC17", "nc17"),
  categoryTag("heat_intimacy_mode", "R18+", "r18-plus"),
  categoryTag("pov", "FemPOV", "fempov"),
  categoryTag("pov", "MalePOV", "malepov"),
  categoryTag("pov", "AnyPOV", "anypov"),
  categoryTag("pov", "StoryMode", "storymode"),
  categoryTag("writing_style", "WritingStyle", "writingstyle"),
  categoryTag("platform_export_target", "JanitorAI", "janitorai"),
  categoryTag("platform_export_target", "SillyTavern", "sillytavern"),
  categoryTag("platform_export_target", "MarinaraTavern", "marinaratavern"),
  categoryTag("content_boundary", "Blocked", "blocked"),
];

export const corePromptPacks: CorePromptPack[] = [
  corePromptPack({
    id: "core-changing-perspectives",
    title: "Changing Perspectives",
    slug: "changing-perspectives",
    category: "Trope core",
    description: "For enemies-to-lovers, friends-to-lovers, and shifting emotional read.",
    base_prompt:
      "Track what each character believes, what they refuse to say, and what the active POV is allowed to know. Let changed behavior prove the shift before anyone explains it.",
    compatible_tag_slugs: ["enemies-to-lovers", "friends-to-lovers"],
  }),
  corePromptPack({
    id: "core-second-chance-romance",
    title: "Second Chance Romance",
    slug: "second-chance-romance",
    category: "Trope core",
    description: "For exes, missed connections, and almost-happened relationships with unfinished emotional business.",
    base_prompt:
      "Let the past create pressure without resolving itself too quickly. Keep regret, changed circumstances, and the difference between remembered intimacy and present trust active in the scene.",
    compatible_tag_slugs: ["exes", "missed-connections"],
  }),
  corePromptPack({
    id: "core-forbidden-attraction",
    title: "Forbidden Attraction",
    slug: "forbidden-attraction",
    category: "Boundary core",
    description: "For secret relationships, friend or sibling adjacency, step-sibling tension, and age-gap pressure.",
    base_prompt:
      "Frame the attraction through consequence, secrecy, proximity, and social cost. Preserve consent, agency, and plausible reasons the characters hesitate, hide, deny, or risk exposure.",
    compatible_tag_slugs: [
      "secret-relationship",
      "brothers-best-friend",
      "brothers-girlfriend",
      "brothers-boyfriend",
      "sisters-best-friend",
      "sisters-girlfriend",
      "sisters-boyfriend",
      "best-friends-best-friend",
      "best-friends-girlfriend",
      "best-friends-boyfriend",
      "step-siblings",
      "age-gap",
    ],
  }),
  corePromptPack({
    id: "core-arranged-marriage",
    title: "Arranged Marriage",
    slug: "arranged-marriage",
    category: "Relationship core",
    description: "For marriage of convenience, betrothal, fake dating, and public/private contract pressure.",
    base_prompt:
      "Treat the arrangement as a social machine with private emotional fallout. Track what is performed publicly, what is negotiated privately, and what becomes real before anyone is ready to admit it.",
    compatible_tag_slugs: ["marriage-of-convenience", "betrothal", "fake-dating"],
  }),
  corePromptPack({
    id: "core-dark-romance",
    title: "Dark Romance",
    slug: "dark-romance",
    category: "Intensity core",
    description: "For morally grey, possessive, obsessive, or degradation-compatible dynamics.",
    base_prompt:
      "Keep intensity rooted in character motive, negotiated boundaries, consequence, and power exchange. Do not flatten possessiveness into generic aggression.",
    compatible_tag_slugs: ["possessive", "obsessive"],
  }),
  corePromptPack({
    id: "core-supernatural",
    title: "Supernatural",
    slug: "supernatural",
    category: "World core",
    description: "For omegaverse, vampire, werewolf, and sci-fi premises where biology, world rules, or genre logic shape intimacy.",
    base_prompt:
      "Make the speculative rule matter in-scene through behavior, consequence, social structure, sensory pressure, or power imbalance. Keep world logic readable and character desire specific.",
    compatible_tag_slugs: ["omegaverse", "vampire", "werewolf", "sci-fi"],
  }),
  corePromptPack({
    id: "core-bdsm-dynamics",
    title: "BDSM Dynamics",
    slug: "bdsm-dynamics",
    category: "Dynamic core",
    description: "For dom/sub, switch, praise, daddy, DDLG, and degradation-compatible relationship dynamics.",
    base_prompt:
      "Write power exchange as behavior, trust, consent, correction, reward, restraint, permission, refusal, and aftermath. Match the dynamic to the characters instead of using a generic dominant script.",
    compatible_tag_slugs: ["dominant-submissive", "switch-submissive"],
  }),
  corePromptPack({
    id: "core-non-traditional-relationships",
    title: "Non-Traditional Relationships",
    slug: "non-traditional-relationships",
    category: "Relationship core",
    description: "For aro/ace, polycule, menage, and other relationship structures that need clear expectations and agency.",
    base_prompt:
      "Keep the relationship structure explicit enough to prevent assumptions. Track consent, agreements, jealousy, unmet needs, and how each person defines intimacy, commitment, or distance.",
    compatible_tag_slugs: ["aro-ace", "polycule", "menage"],
  }),
  corePromptPack({
    id: "core-messy-relationships",
    title: "Love Triangles + Messy Relationships",
    slug: "love-triangles-messy-relationships",
    category: "Relationship core",
    description: "For situationships, FWB, mutual longing, one-sided pining, and asymmetric secrets.",
    base_prompt:
      "Treat the relationship as active pressure. Preserve asymmetric knowledge, unresolved longing, and the difference between public behavior and private motive.",
    compatible_tag_slugs: ["situationship", "fwb", "mutual-longing", "one-sided-pining", "one-night-stand"],
  }),
];

function categoryTag(
  group: CategoryTag["group"],
  label: string,
  slug: string,
  description?: string,
): CategoryTag {
  return {
    id: `tag-${slug}`,
    group,
    label,
    slug,
    description,
    created_at: now,
    updated_at: now,
  };
}

function corePromptPack(
  pack: Omit<CorePromptPack, "created_at" | "default_platform_targets" | "updated_at">,
): CorePromptPack {
  return {
    ...pack,
    default_platform_targets: ["JanitorAI", "SillyTavern", "MarinaraTavern"],
    created_at: now,
    updated_at: now,
  };
}

function libraryBook(
  book: Omit<LibraryBook, "bookshelf_id" | "created_at" | "payload" | "updated_at"> & {
    payload?: Record<string, unknown>;
  },
): LibraryBook {
  return {
    ...book,
    bookshelf_id: "bookshelf-active-romance",
    payload: book.payload ?? {},
    created_at: now,
    updated_at: now,
  };
}
