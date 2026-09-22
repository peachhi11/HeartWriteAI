import {
  activeStory,
  corePromptPacks,
  groupedCategoryTags,
  sampleCharacters,
  samplePromptPacks,
  sampleRelationships,
  sampleScenes,
  sampleSecrets,
} from "@/features/story-memory/data/dashboard-seed";
import {
  mapCategoryTagRow,
  mapCharacterRow,
  mapCorePromptPackRow,
  mapRelationshipThreadRow,
  mapSavedPromptPackRow,
  mapSceneMemoryRow,
  mapSecretRow,
  mapStoryRow,
} from "@/features/story-memory/persistence/mappers";
import type {
  CategoryTag,
  Character,
  CorePromptPack,
  GeneratedPromptPack,
  RelationshipThread,
  SceneMemory,
  SecretOrReveal,
  Story,
} from "@/features/story-memory/types/story-memory";
import { createClient } from "@/lib/supabase/server";

export type StoryMemoryAuthState =
  | {
      status: "demo";
      message: string;
    }
  | {
      status: "signed_out";
      message: string;
    }
  | {
      email?: string;
      status: "signed_in";
      userId: string;
    };

export type StoryMemoryWorkspace = {
  auth: StoryMemoryAuthState;
  categoryTags: CategoryTag[];
  corePromptPacks: CorePromptPack[];
  initialCharacters: Character[];
  initialPromptPacks: GeneratedPromptPack[];
  initialRelationships: RelationshipThread[];
  initialScenes: SceneMemory[];
  initialSecrets: SecretOrReveal[];
  initialSelectedTagSlugs: string[];
  isPersisted: boolean;
  story: Story;
};

export async function loadStoryMemoryWorkspace(): Promise<StoryMemoryWorkspace> {
  let supabase;

  try {
    supabase = await createClient();
  } catch (error) {
    return createDemoWorkspace(
      error instanceof Error ? error.message : "Supabase is not configured for this local session.",
    );
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ...createDemoWorkspace("Sign in to save this workspace to Supabase."),
      auth: {
        status: "signed_out",
        message: "Sign in to save this workspace to Supabase.",
      },
    };
  }

  const [tagsResult, corePacksResult, storyResult] = await Promise.all([
    supabase.from("category_tags").select("*").order("group_name").order("label"),
    supabase.from("core_prompt_packs").select("*").order("title"),
    supabase
      .from("stories")
      .select("*")
      .eq("active_status", "active")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (tagsResult.error || corePacksResult.error || storyResult.error) {
    return createDemoWorkspace(
      tagsResult.error?.message ??
        corePacksResult.error?.message ??
        storyResult.error?.message ??
        "Could not load the Supabase workspace.",
    );
  }

  const storyRow =
    storyResult.data ??
    (
      await supabase
        .from("stories")
        .insert({
          active_status: activeStory.active_status,
          author_notes: activeStory.author_notes ?? null,
          content_boundaries: activeStory.content_boundaries ?? [],
          default_pov_mode: activeStory.default_pov_mode ?? "narrator_pov",
          description: activeStory.description ?? null,
          export_targets: activeStory.export_targets ?? [],
          genre: activeStory.genre ?? null,
          heat_level: activeStory.heat_level ?? null,
          owner_id: user.id,
          style_notes: activeStory.style_notes ?? null,
          subgenre: activeStory.subgenre ?? null,
          supported_pov_modes: activeStory.supported_pov_modes,
          title: activeStory.title,
        })
        .select()
        .single()
    ).data;

  if (!storyRow) {
    return createDemoWorkspace("Could not create a Supabase story workspace.");
  }

  const story = mapStoryRow(storyRow);

  const [
    charactersResult,
    scenesResult,
    relationshipsResult,
    secretsResult,
    promptPacksResult,
    tagSelectionsResult,
  ] = await Promise.all([
    supabase.from("characters").select("*").eq("story_id", story.id).order("created_at"),
    supabase.from("scene_memories").select("*").eq("story_id", story.id).order("sequence_index"),
    supabase.from("relationship_threads").select("*").eq("story_id", story.id).order("created_at"),
    supabase.from("secrets").select("*").eq("story_id", story.id).order("created_at"),
    supabase.from("saved_prompt_packs").select("*").eq("story_id", story.id).order("saved_at"),
    supabase.from("story_tag_selections").select("tag_id").eq("story_id", story.id),
  ]);

  const loadError =
    charactersResult.error ??
    scenesResult.error ??
    relationshipsResult.error ??
    secretsResult.error ??
    promptPacksResult.error ??
    tagSelectionsResult.error;

  if (loadError) {
    return createDemoWorkspace(loadError.message);
  }

  const categoryTags = tagsResult.data.map(mapCategoryTagRow);
  const selectedTagIds = new Set((tagSelectionsResult.data ?? []).map((selection) => selection.tag_id));

  return {
    auth: {
      email: user.email,
      status: "signed_in",
      userId: user.id,
    },
    categoryTags,
    corePromptPacks: corePacksResult.data.map(mapCorePromptPackRow),
    initialCharacters: (charactersResult.data ?? []).map(mapCharacterRow),
    initialPromptPacks: (promptPacksResult.data ?? []).map(mapSavedPromptPackRow),
    initialRelationships: (relationshipsResult.data ?? []).map(mapRelationshipThreadRow),
    initialScenes: (scenesResult.data ?? []).map(mapSceneMemoryRow),
    initialSecrets: (secretsResult.data ?? []).map(mapSecretRow),
    initialSelectedTagSlugs: categoryTags
      .filter((tag) => selectedTagIds.has(tag.id))
      .map((tag) => tag.slug),
    isPersisted: true,
    story,
  };
}

function createDemoWorkspace(message: string): StoryMemoryWorkspace {
  return {
    auth: {
      message,
      status: "demo",
    },
    categoryTags: groupedCategoryTags,
    corePromptPacks,
    initialCharacters: sampleCharacters,
    initialPromptPacks: samplePromptPacks,
    initialRelationships: sampleRelationships,
    initialScenes: sampleScenes,
    initialSecrets: sampleSecrets,
    initialSelectedTagSlugs: ["situationship"],
    isPersisted: false,
    story: activeStory,
  };
}
