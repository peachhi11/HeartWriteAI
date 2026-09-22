import type {
  CategoryTag,
  Character,
  CorePromptPack,
  GeneratedPromptPack,
  HeatLevelLabel,
  PovMode,
  RelationshipThread,
  SceneMemory,
  SecretOrReveal,
  Story,
  StoryStatus,
} from "@/features/story-memory/types/story-memory";
import type { Database } from "@/lib/supabase/database.types";

type Tables = Database["public"]["Tables"];

export type StoryRow = Tables["stories"]["Row"];
export type CharacterRow = Tables["characters"]["Row"];
export type SceneMemoryRow = Tables["scene_memories"]["Row"];
export type RelationshipThreadRow = Tables["relationship_threads"]["Row"];
export type SecretRow = Tables["secrets"]["Row"];
export type CategoryTagRow = Tables["category_tags"]["Row"];
export type CorePromptPackRow = Tables["core_prompt_packs"]["Row"];
export type SavedPromptPackRow = Tables["saved_prompt_packs"]["Row"];

export function mapStoryRow(row: StoryRow): Story {
  return {
    ...row,
    active_status: row.active_status as StoryStatus,
    default_pov_mode: row.default_pov_mode as PovMode,
    heat_level: row.heat_level as HeatLevelLabel | undefined,
    supported_pov_modes: row.supported_pov_modes as PovMode[],
    description: row.description ?? undefined,
    genre: row.genre ?? undefined,
    subgenre: row.subgenre ?? undefined,
    default_tense: row.default_tense ?? undefined,
    author_notes: row.author_notes ?? undefined,
    style_notes: row.style_notes ?? undefined,
  };
}

export function mapCharacterRow(row: CharacterRow): Character {
  return {
    ...row,
    role: row.role ?? undefined,
    voice_notes: row.voice_notes ?? undefined,
    current_emotional_state: row.current_emotional_state ?? undefined,
    author_only_notes: row.author_only_notes ?? undefined,
  };
}

export function mapSceneMemoryRow(row: SceneMemoryRow): SceneMemory {
  return {
    ...row,
    canon_status: row.canon_status as SceneMemory["canon_status"],
    pov_mode: row.pov_mode as PovMode,
    title: row.title ?? undefined,
    sequence_index: row.sequence_index ?? undefined,
    scene_date_or_time: row.scene_date_or_time ?? undefined,
    location: row.location ?? undefined,
    emotional_shift: row.emotional_shift ?? undefined,
    relationship_shift: row.relationship_shift ?? undefined,
    intimacy_shift: row.intimacy_shift ?? undefined,
    conflict_shift: row.conflict_shift ?? undefined,
  };
}

export function mapRelationshipThreadRow(row: RelationshipThreadRow): RelationshipThread {
  return {
    ...row,
    current_state: row.current_state ?? undefined,
    attraction_notes: row.attraction_notes ?? undefined,
    trust_notes: row.trust_notes ?? undefined,
    conflict_notes: row.conflict_notes ?? undefined,
    intimacy_history: row.intimacy_history ?? undefined,
    power_dynamic_notes: row.power_dynamic_notes ?? undefined,
    last_major_change: row.last_major_change ?? undefined,
    unresolved_tension: row.unresolved_tension ?? undefined,
    next_pressure_point: row.next_pressure_point ?? undefined,
  };
}

export function mapSecretRow(row: SecretRow): SecretOrReveal {
  return {
    ...row,
    reveal_status: row.reveal_status as SecretOrReveal["reveal_status"],
    title: row.title ?? undefined,
    truth_status: row.truth_status ?? undefined,
    reveal_scene_id: row.reveal_scene_id ?? undefined,
    consequences_if_revealed: row.consequences_if_revealed ?? undefined,
    current_pressure: row.current_pressure ?? undefined,
    author_notes: row.author_notes ?? undefined,
  };
}

export function mapCategoryTagRow(row: CategoryTagRow): CategoryTag {
  return {
    created_at: row.created_at,
    description: row.description ?? undefined,
    group: row.group_name as CategoryTag["group"],
    id: row.id,
    label: row.label,
    slug: row.slug,
    updated_at: row.updated_at,
  };
}

export function mapCorePromptPackRow(row: CorePromptPackRow): CorePromptPack {
  return row;
}

export function mapSavedPromptPackRow(row: SavedPromptPackRow): GeneratedPromptPack {
  return {
    ...row,
    active_pov_mode: row.active_pov_mode as PovMode,
    max_length_preference: row.max_length_preference as GeneratedPromptPack["max_length_preference"],
    persistence_state: "saved",
    selected_secrets_policy: row.selected_secrets_policy as GeneratedPromptPack["selected_secrets_policy"],
    source_core_pack_id: row.source_core_pack_id ?? undefined,
    spice_visibility_snapshot: row.spice_visibility_snapshot as GeneratedPromptPack["spice_visibility_snapshot"],
    tailoring_goal: row.tailoring_goal ?? undefined,
  };
}
