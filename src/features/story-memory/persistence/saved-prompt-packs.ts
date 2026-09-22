import type { SupabaseClient } from "@supabase/supabase-js";

import type { GeneratedPromptPack } from "@/features/story-memory/types/story-memory";
import type { Database } from "@/lib/supabase/database.types";

type StoryMemoryClient = SupabaseClient<Database>;

export async function listSavedPromptPacks(supabase: StoryMemoryClient, storyId: string) {
  return supabase
    .from("saved_prompt_packs")
    .select("*")
    .eq("story_id", storyId)
    .order("saved_at", { ascending: false });
}

export async function saveGeneratedPromptPack({
  ownerId,
  pack,
  supabase,
}: {
  ownerId: string;
  pack: GeneratedPromptPack;
  supabase: StoryMemoryClient;
}) {
  return supabase
    .from("saved_prompt_packs")
    .insert({
      active_pov_mode: pack.active_pov_mode,
      generated_text: pack.generated_text,
      included_sections: pack.included_sections,
      max_length_preference: pack.max_length_preference,
      owner_id: ownerId,
      selected_characters: pack.selected_characters,
      selected_relationship_threads: pack.selected_relationship_threads,
      selected_scene_memories: pack.selected_scene_memories,
      selected_secrets_policy: pack.selected_secrets_policy,
      selected_tropes: pack.selected_tropes,
      source_core_pack_id: pack.source_core_pack_id ?? null,
      spice_visibility_snapshot: pack.spice_visibility_snapshot,
      story_id: pack.story_id,
      tailoring_goal: pack.tailoring_goal ?? null,
      target_platform: pack.target_platform,
      title: pack.title,
    })
    .select()
    .single();
}
