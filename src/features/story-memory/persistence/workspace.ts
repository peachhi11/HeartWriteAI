import {
  activeStory,
  corePromptPacks,
  groupedCategoryTags,
  sampleBookshelves,
  sampleCharacters,
  sampleLibraryBooks,
  samplePromptPacks,
  sampleRelationships,
  sampleScenes,
  sampleSecrets,
  sampleStoryBookBindings,
  sampleStoryBooks,
} from "@/features/story-memory/data/dashboard-seed";
import {
  mapBookshelfRow,
  mapCategoryTagRow,
  mapCharacterRow,
  mapCorePromptPackRow,
  mapLibraryBookRow,
  mapRelationshipThreadRow,
  mapSavedPromptPackRow,
  mapSceneMemoryRow,
  mapSecretRow,
  mapStoryBookBindingRow,
  mapStoryBookRow,
  mapStoryRow,
} from "@/features/story-memory/persistence/mappers";
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
import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;
type LibraryWorkspaceRows = {
  bookshelves: Bookshelf[];
  errorMessage?: string;
  libraryBooks: LibraryBook[];
  storyBookBindings: StoryBookBinding[];
  storyBooks: StoryBook[];
};

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
  initialBookshelves: Bookshelf[];
  initialCharacters: Character[];
  initialLibraryBooks: LibraryBook[];
  initialPromptPacks: GeneratedPromptPack[];
  initialRelationships: RelationshipThread[];
  initialScenes: SceneMemory[];
  initialSecrets: SecretOrReveal[];
  initialSelectedTagSlugs: string[];
  initialStoryBookBindings: StoryBookBinding[];
  initialStoryBooks: StoryBook[];
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
  const libraryWorkspace = await loadOrCreateLibraryWorkspace(supabase, user.id, story);

  if (libraryWorkspace.errorMessage) {
    return createDemoWorkspace(libraryWorkspace.errorMessage);
  }

  return {
    auth: {
      email: user.email,
      status: "signed_in",
      userId: user.id,
    },
    categoryTags,
    corePromptPacks: corePacksResult.data.map(mapCorePromptPackRow),
    initialBookshelves: libraryWorkspace.bookshelves,
    initialCharacters: (charactersResult.data ?? []).map(mapCharacterRow),
    initialLibraryBooks: libraryWorkspace.libraryBooks,
    initialPromptPacks: (promptPacksResult.data ?? []).map(mapSavedPromptPackRow),
    initialRelationships: (relationshipsResult.data ?? []).map(mapRelationshipThreadRow),
    initialScenes: (scenesResult.data ?? []).map(mapSceneMemoryRow),
    initialSecrets: (secretsResult.data ?? []).map(mapSecretRow),
    initialSelectedTagSlugs: categoryTags
      .filter((tag) => selectedTagIds.has(tag.id))
      .map((tag) => tag.slug),
    initialStoryBookBindings: libraryWorkspace.storyBookBindings,
    initialStoryBooks: libraryWorkspace.storyBooks,
    isPersisted: true,
    story,
  };
}

async function loadOrCreateLibraryWorkspace(
  supabase: SupabaseServerClient,
  userId: string,
  story: Story,
): Promise<LibraryWorkspaceRows> {
  const loaded = await loadLibraryWorkspaceRows(supabase, userId);
  if (loaded.errorMessage) return loaded;

  if (
    loaded.bookshelves.length ||
    loaded.storyBooks.length ||
    loaded.libraryBooks.length ||
    loaded.storyBookBindings.length
  ) {
    return loaded;
  }

  const bookshelfResult = await supabase
    .from("bookshelves")
    .insert({
      description: sampleBookshelves[0]?.description ?? null,
      owner_id: userId,
      sort_order: 1,
      title: sampleBookshelves[0]?.title ?? "Active Romance Builds",
    })
    .select()
    .single();

  if (bookshelfResult.error) {
    return emptyLibraryWorkspace(bookshelfResult.error.message);
  }

  const storyBookResult = await supabase
    .from("storybooks")
    .insert({
      active_story_id: story.id,
      bookshelf_id: bookshelfResult.data.id,
      description: sampleStoryBooks[0]?.description ?? null,
      owner_id: userId,
      sort_order: 1,
      status: "active",
      title: sampleStoryBooks[0]?.title ?? `${story.title} StoryBook`,
    })
    .select()
    .single();

  if (storyBookResult.error) {
    return emptyLibraryWorkspace(storyBookResult.error.message);
  }

  const libraryBooksResult = await supabase
    .from("library_books")
    .insert(
      sampleLibraryBooks.map((book) => ({
        bookshelf_id: bookshelfResult.data.id,
        book_type: book.book_type,
        description: book.description ?? null,
        owner_id: userId,
        payload: {},
        sort_order: book.sort_order,
        source_entity_id: null,
        source_entity_type: book.source_entity_type ?? null,
        title: book.title,
      })),
    )
    .select();

  if (libraryBooksResult.error) {
    return emptyLibraryWorkspace(libraryBooksResult.error.message);
  }

  const bindingResult = await supabase
    .from("storybook_book_bindings")
    .insert(
      (libraryBooksResult.data ?? []).map((book, index) => ({
        book_id: book.id,
        owner_id: userId,
        sort_order: index + 1,
        storybook_id: storyBookResult.data.id,
      })),
    )
    .select();

  if (bindingResult.error) {
    return emptyLibraryWorkspace(bindingResult.error.message);
  }

  return {
    bookshelves: [mapBookshelfRow(bookshelfResult.data)],
    libraryBooks: (libraryBooksResult.data ?? []).map(mapLibraryBookRow),
    storyBookBindings: (bindingResult.data ?? []).map(mapStoryBookBindingRow),
    storyBooks: [mapStoryBookRow(storyBookResult.data)],
  };
}

async function loadLibraryWorkspaceRows(
  supabase: SupabaseServerClient,
  userId: string,
): Promise<LibraryWorkspaceRows> {
  const [bookshelvesResult, storyBooksResult, libraryBooksResult, storyBookBindingsResult] =
    await Promise.all([
      supabase.from("bookshelves").select("*").eq("owner_id", userId).order("sort_order"),
      supabase.from("storybooks").select("*").eq("owner_id", userId).order("sort_order"),
      supabase.from("library_books").select("*").eq("owner_id", userId).order("sort_order"),
      supabase.from("storybook_book_bindings").select("*").eq("owner_id", userId).order("sort_order"),
    ]);

  const error =
    bookshelvesResult.error ??
    storyBooksResult.error ??
    libraryBooksResult.error ??
    storyBookBindingsResult.error;

  if (error) {
    return emptyLibraryWorkspace(error.message);
  }

  return {
    bookshelves: (bookshelvesResult.data ?? []).map(mapBookshelfRow),
    libraryBooks: (libraryBooksResult.data ?? []).map(mapLibraryBookRow),
    storyBookBindings: (storyBookBindingsResult.data ?? []).map(mapStoryBookBindingRow),
    storyBooks: (storyBooksResult.data ?? []).map(mapStoryBookRow),
  };
}

function emptyLibraryWorkspace(errorMessage?: string): LibraryWorkspaceRows {
  return {
    bookshelves: [],
    errorMessage,
    libraryBooks: [],
    storyBookBindings: [],
    storyBooks: [],
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
    initialBookshelves: sampleBookshelves,
    initialCharacters: sampleCharacters,
    initialLibraryBooks: sampleLibraryBooks,
    initialPromptPacks: samplePromptPacks,
    initialRelationships: sampleRelationships,
    initialScenes: sampleScenes,
    initialSecrets: sampleSecrets,
    initialSelectedTagSlugs: ["situationship"],
    initialStoryBookBindings: sampleStoryBookBindings,
    initialStoryBooks: sampleStoryBooks,
    isPersisted: false,
    story: activeStory,
  };
}
