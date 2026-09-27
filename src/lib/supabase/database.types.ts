export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      stories: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          description: string | null;
          genre: string | null;
          subgenre: string | null;
          heat_level: string | null;
          default_pov_mode: string;
          supported_pov_modes: string[];
          default_tense: string | null;
          active_status: string;
          author_notes: string | null;
          content_boundaries: string[];
          style_notes: string | null;
          export_targets: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          description?: string | null;
          genre?: string | null;
          subgenre?: string | null;
          heat_level?: string | null;
          default_pov_mode?: string;
          supported_pov_modes?: string[];
          default_tense?: string | null;
          active_status?: string;
          author_notes?: string | null;
          content_boundaries?: string[];
          style_notes?: string | null;
          export_targets?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["stories"]["Insert"]>;
        Relationships: [];
      };
      characters: {
        Row: CharacterMemoryRow;
        Insert: CharacterMemoryInsert;
        Update: Partial<CharacterMemoryInsert>;
        Relationships: [];
      };
      bookshelves: {
        Row: BookshelfRow;
        Insert: BookshelfInsert;
        Update: Partial<BookshelfInsert>;
        Relationships: [];
      };
      storybooks: {
        Row: StoryBookRow;
        Insert: StoryBookInsert;
        Update: Partial<StoryBookInsert>;
        Relationships: [];
      };
      library_books: {
        Row: LibraryBookRow;
        Insert: LibraryBookInsert;
        Update: Partial<LibraryBookInsert>;
        Relationships: [];
      };
      storybook_book_bindings: {
        Row: StoryBookBindingRow;
        Insert: StoryBookBindingInsert;
        Update: Partial<StoryBookBindingInsert>;
        Relationships: [];
      };
      scene_memories: {
        Row: SceneMemoryRow;
        Insert: SceneMemoryInsert;
        Update: Partial<SceneMemoryInsert>;
        Relationships: [];
      };
      relationship_threads: {
        Row: RelationshipThreadRow;
        Insert: RelationshipThreadInsert;
        Update: Partial<RelationshipThreadInsert>;
        Relationships: [];
      };
      secrets: {
        Row: SecretRow;
        Insert: SecretInsert;
        Update: Partial<SecretInsert>;
        Relationships: [];
      };
      saved_prompt_packs: {
        Row: SavedPromptPackRow;
        Insert: SavedPromptPackInsert;
        Update: Partial<SavedPromptPackInsert>;
        Relationships: [];
      };
      category_tags: {
        Row: CategoryTagRow;
        Insert: CategoryTagInsert;
        Update: Partial<CategoryTagInsert>;
        Relationships: [];
      };
      core_prompt_packs: {
        Row: CorePromptPackRow;
        Insert: CorePromptPackInsert;
        Update: Partial<CorePromptPackInsert>;
        Relationships: [];
      };
      story_tag_selections: {
        Row: {
          story_id: string;
          tag_id: string;
          owner_id: string;
          created_at: string;
        };
        Insert: {
          story_id: string;
          tag_id: string;
          owner_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["story_tag_selections"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type OwnedTimestampedRow = {
  id: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
};

type OwnedRow = OwnedTimestampedRow & {
  story_id: string;
};

type BookshelfRow = OwnedTimestampedRow & {
  title: string;
  description: string | null;
  sort_order: number;
};

type BookshelfInsert = Omit<BookshelfRow, "id" | "created_at" | "updated_at"> &
  Partial<Pick<BookshelfRow, "id" | "created_at" | "updated_at">>;

type StoryBookRow = OwnedTimestampedRow & {
  bookshelf_id: string;
  title: string;
  description: string | null;
  active_story_id: string | null;
  status: string;
  sort_order: number;
};

type StoryBookInsert = Omit<StoryBookRow, "id" | "created_at" | "updated_at"> &
  Partial<Pick<StoryBookRow, "id" | "created_at" | "updated_at">>;

type LibraryBookRow = OwnedTimestampedRow & {
  bookshelf_id: string;
  title: string;
  book_type: string;
  description: string | null;
  source_entity_id: string | null;
  source_entity_type: string | null;
  payload: Json;
  sort_order: number;
};

type LibraryBookInsert = Omit<LibraryBookRow, "id" | "created_at" | "updated_at"> &
  Partial<Pick<LibraryBookRow, "id" | "created_at" | "updated_at">>;

type StoryBookBindingRow = OwnedTimestampedRow & {
  storybook_id: string;
  book_id: string;
  sort_order: number;
};

type StoryBookBindingInsert = Omit<StoryBookBindingRow, "id" | "created_at" | "updated_at"> &
  Partial<Pick<StoryBookBindingRow, "id" | "created_at" | "updated_at">>;

type CharacterMemoryRow = OwnedRow & {
  name: string;
  aliases: string[];
  role: string | null;
  public_facts: string[];
  private_truths: string[];
  self_beliefs: string[];
  false_beliefs: string[];
  wants: string[];
  fears: string[];
  boundaries: string[];
  voice_notes: string | null;
  current_emotional_state: string | null;
  author_only_notes: string | null;
};

type CharacterMemoryInsert = Omit<CharacterMemoryRow, "id" | "created_at" | "updated_at"> &
  Partial<Pick<CharacterMemoryRow, "id" | "created_at" | "updated_at">>;

type SceneMemoryRow = OwnedRow & {
  title: string | null;
  sequence_index: number | null;
  scene_date_or_time: string | null;
  location: string | null;
  scenario: string | null;
  setting: string | null;
  continuity_mode: string;
  chapter_label: string | null;
  narrative_arc: string | null;
  pov_mode: string;
  participants: string[];
  summary: string;
  key_actions: string[];
  emotional_shift: string | null;
  relationship_shift: string | null;
  intimacy_shift: string | null;
  conflict_shift: string | null;
  new_information: string[];
  unresolved_hooks: string[];
  continuity_flags: string[];
  canon_status: string;
};

type SceneMemoryInsert = Omit<SceneMemoryRow, "id" | "created_at" | "updated_at"> &
  Partial<Pick<SceneMemoryRow, "id" | "created_at" | "updated_at">>;

type RelationshipThreadRow = OwnedRow & {
  participants: string[];
  dynamic_label: string;
  current_state: string | null;
  attraction_notes: string | null;
  trust_notes: string | null;
  conflict_notes: string | null;
  intimacy_history: string | null;
  power_dynamic_notes: string | null;
  boundaries: string[];
  linked_secret_ids: string[];
  last_major_change: string | null;
  unresolved_tension: string | null;
  next_pressure_point: string | null;
};

type RelationshipThreadInsert = Omit<RelationshipThreadRow, "id" | "created_at" | "updated_at"> &
  Partial<Pick<RelationshipThreadRow, "id" | "created_at" | "updated_at">>;

type SecretRow = OwnedRow & {
  title: string | null;
  secret_text: string;
  truth_status: string | null;
  who_knows: string[];
  who_suspects: string[];
  who_is_wrong: string[];
  who_is_hiding_it: string[];
  who_knows_that_someone_knows: string[];
  who_falsely_believes_they_are_safe: string[];
  who_is_pretending_not_to_know: string[];
  reveal_status: string;
  reveal_scene_id: string | null;
  related_scene_ids: string[];
  related_relationship_thread_ids: string[];
  consequences_if_revealed: string | null;
  current_pressure: string | null;
  author_notes: string | null;
};

type SecretInsert = Omit<SecretRow, "id" | "created_at" | "updated_at"> &
  Partial<Pick<SecretRow, "id" | "created_at" | "updated_at">>;

type SavedPromptPackRow = OwnedRow & {
  source_core_pack_id: string | null;
  title: string;
  target_platform: string;
  tailoring_goal: string | null;
  active_pov_mode: string;
  spice_visibility_snapshot: string;
  included_sections: string[];
  max_length_preference: string;
  selected_tropes: string[];
  selected_characters: string[];
  selected_relationship_threads: string[];
  selected_scene_memories: string[];
  selected_secrets_policy: string;
  generated_text: string;
  saved_at: string;
};

type SavedPromptPackInsert = Omit<SavedPromptPackRow, "id" | "created_at" | "updated_at" | "saved_at"> &
  Partial<Pick<SavedPromptPackRow, "id" | "created_at" | "updated_at" | "saved_at">>;

type CategoryTagRow = {
  id: string;
  group_name: string;
  label: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

type CategoryTagInsert = Omit<CategoryTagRow, "id" | "created_at" | "updated_at"> &
  Partial<Pick<CategoryTagRow, "id" | "created_at" | "updated_at">>;

type CorePromptPackRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  base_prompt: string;
  compatible_tag_slugs: string[];
  default_platform_targets: string[];
  created_at: string;
  updated_at: string;
};

type CorePromptPackInsert = Omit<CorePromptPackRow, "id" | "created_at" | "updated_at"> &
  Partial<Pick<CorePromptPackRow, "id" | "created_at" | "updated_at">>;
