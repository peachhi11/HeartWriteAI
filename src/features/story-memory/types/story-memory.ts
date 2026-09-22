export type ISODateString = string;
export type EntityId = string;

export type SpiceVisibility = "censored" | "uncensored";
export type PovMode = "char_pov" | "user_pov" | "narrator_pov";
export type StoryStatus = "active" | "paused" | "archived";
export type CanonStatus = "canon" | "draft" | "contradicted" | "retconned";
export type RevealStatus =
  | "hidden"
  | "suspected"
  | "partially_revealed"
  | "revealed"
  | "misunderstood";
export type PromptPackPersistenceState = "session" | "saved";
export type HeatLevelLabel = "sweet" | "sensual" | "spicy" | "explicit" | "extreme";
export type CategoryTagGroupName =
  | "trope"
  | "relationship_dynamic"
  | "heat_intimacy_mode"
  | "scene_function"
  | "conflict_obstacle"
  | "pov"
  | "writing_style"
  | "platform_export_target"
  | "content_boundary";

export interface TimestampedEntity {
  id: EntityId;
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface AppSettings extends TimestampedEntity {
  global_spice_visibility: SpiceVisibility;
}

export interface Story extends TimestampedEntity {
  title: string;
  description?: string;
  genre?: string;
  subgenre?: string;
  heat_level?: HeatLevelLabel;
  default_pov_mode?: PovMode;
  supported_pov_modes: PovMode[];
  default_tense?: string;
  active_status: StoryStatus;
  author_notes?: string;
  content_boundaries?: string[];
  style_notes?: string;
  export_targets?: string[];
}

export interface Character extends TimestampedEntity {
  story_id: EntityId;
  name: string;
  aliases: string[];
  role?: string;
  public_facts: string[];
  private_truths: string[];
  self_beliefs: string[];
  false_beliefs: string[];
  wants: string[];
  fears: string[];
  boundaries: string[];
  voice_notes?: string;
  current_emotional_state?: string;
  author_only_notes?: string;
}

export interface SceneMemory extends TimestampedEntity {
  story_id: EntityId;
  title?: string;
  sequence_index?: number;
  scene_date_or_time?: string;
  location?: string;
  pov_mode: PovMode;
  participants: EntityId[];
  summary: string;
  key_actions: string[];
  emotional_shift?: string;
  relationship_shift?: string;
  intimacy_shift?: string;
  conflict_shift?: string;
  new_information: string[];
  unresolved_hooks: string[];
  continuity_flags: string[];
  canon_status: CanonStatus;
}

export interface RelationshipThread extends TimestampedEntity {
  story_id: EntityId;
  participants: EntityId[];
  dynamic_label: string;
  current_state?: string;
  attraction_notes?: string;
  trust_notes?: string;
  conflict_notes?: string;
  intimacy_history?: string;
  power_dynamic_notes?: string;
  boundaries: string[];
  linked_secret_ids: EntityId[];
  last_major_change?: string;
  unresolved_tension?: string;
  next_pressure_point?: string;
}

export interface SecretOrReveal extends TimestampedEntity {
  story_id: EntityId;
  title?: string;
  secret_text: string;
  truth_status?: string;
  who_knows: EntityId[];
  who_suspects: EntityId[];
  who_is_wrong: EntityId[];
  who_is_hiding_it: EntityId[];
  who_knows_that_someone_knows: EntityId[];
  who_falsely_believes_they_are_safe: EntityId[];
  who_is_pretending_not_to_know: EntityId[];
  reveal_status: RevealStatus;
  reveal_scene_id?: EntityId;
  related_scene_ids: EntityId[];
  related_relationship_thread_ids: EntityId[];
  consequences_if_revealed?: string;
  current_pressure?: string;
  author_notes?: string;
}

export interface GeneratedPromptPack extends TimestampedEntity {
  story_id: EntityId;
  source_core_pack_id?: EntityId;
  title: string;
  target_platform: string;
  tailoring_goal?: string;
  active_pov_mode: PovMode;
  spice_visibility_snapshot: SpiceVisibility;
  included_sections: string[];
  max_length_preference: "compact" | "balanced" | "detailed";
  selected_tropes: string[];
  selected_characters: EntityId[];
  selected_relationship_threads: EntityId[];
  selected_scene_memories: EntityId[];
  selected_secrets_policy:
    | "active_pov_only"
    | "include_author_only"
    | "exclude_all"
    | "custom";
  generated_text: string;
  persistence_state: PromptPackPersistenceState;
  saved_at?: ISODateString;
}

export interface CategoryTag extends TimestampedEntity {
  group: CategoryTagGroupName;
  label: string;
  slug: string;
  description?: string;
}

export interface CorePromptPack extends TimestampedEntity {
  title: string;
  slug: string;
  category: string;
  description: string;
  base_prompt: string;
  compatible_tag_slugs: string[];
  default_platform_targets: string[];
}
