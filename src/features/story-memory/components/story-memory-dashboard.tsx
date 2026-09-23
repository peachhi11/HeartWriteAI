"use client";

import type { FormEvent, MouseEvent, ReactNode } from "react";
import { useMemo, useState, useTransition } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  Brain,
  Check,
  Copy,
  Download,
  Flame,
  KeyRound,
  Layers3,
  LockKeyhole,
  MessageSquareText,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Tags,
  UsersRound,
} from "lucide-react";

import {
  mapCharacterRow,
  mapRelationshipThreadRow,
  mapSavedPromptPackRow,
  mapSceneMemoryRow,
  mapSecretRow,
} from "@/features/story-memory/persistence/mappers";
import { saveGeneratedPromptPack } from "@/features/story-memory/persistence/saved-prompt-packs";
import type { StoryMemoryAuthState } from "@/features/story-memory/persistence/workspace";
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
  SpiceVisibility,
  Story,
} from "@/features/story-memory/types/story-memory";
import { createClient } from "@/lib/supabase/browser";

const navItems = [
  { label: "Story", icon: BookOpenText },
  { label: "Participants", icon: UsersRound },
  { label: "Relationships", icon: Layers3 },
  { label: "Secrets", icon: LockKeyhole },
  { label: "Prompt Packs", icon: MessageSquareText },
  { label: "Exports", icon: Download },
];

const heatOptions: HeatLevelLabel[] = ["sweet", "sensual", "spicy", "explicit", "extreme"];
const platformOptions = ["JanitorAI", "SillyTavern", "MarinaraTavern"];

type PlatformProfile = {
  builderNote: string;
  generatedFrame: string;
  includedSections: string[];
  promptAreas: string[];
  stackStatus: string;
};

const platformProfiles: Record<string, PlatformProfile> = {
  JanitorAI: {
    builderNote:
      "Best first target. JanitorAI mainly needs a Global Prompt and Proxy Prompt, so this builder can produce a usable preset quickly.",
    generatedFrame:
      "JanitorAI export. Split broad behavior rules into the Global Prompt and active scene control into the Proxy Prompt.",
    includedSections: [
      "Global Prompt",
      "Proxy Prompt",
      "POV policy",
      "Heat and spice state",
      "Tags",
      "Relationship pressure",
      "Secret policy",
    ],
    promptAreas: ["Global Prompt", "Proxy Prompt"],
    stackStatus: "V1 build target",
  },
  SillyTavern: {
    builderNote:
      "Advanced stack. This needs follow-up controls for prompt modules, generation behavior, trackers, and summaries.",
    generatedFrame:
      "SillyTavern planning export. Use this as a stack map until module selection is added.",
    includedSections: [
      "Stack map",
      "Main prompt",
      "AI role",
      "AI guidelines",
      "Prompt modules",
      "Trackers",
      "Generation controls",
    ],
    promptAreas: [
      "Main system prompt",
      "AI role",
      "AI guidelines",
      "Writing style",
      "World style",
      "Character style",
      "Persona style",
      "Impersonation style",
      "Enhance definitions",
      "Scenario",
      "NSFW",
      "Post-history",
      "Auxiliary",
      "Shorten, lengthen, and custom prompts",
      "CFG scales",
      "Trackers and scene trackers",
      "Guided generation prompts",
      "Summary prompts",
    ],
    stackStatus: "Needs advanced module selection",
  },
  MarinaraTavern: {
    builderNote:
      "Advanced agentic stack. It should inherit the SillyTavern-style modules, then add workflow and agent routing choices.",
    generatedFrame:
      "MarinaraTavern planning export. Keep the prompt stack modular and reserve room for agentic workflow routing.",
    includedSections: [
      "Agentic stack map",
      "Prompt modules",
      "Workflow roles",
      "Memory routing",
      "Trackers",
      "Generation controls",
    ],
    promptAreas: [
      "Main system prompt",
      "AI role",
      "AI guidelines",
      "Writing style",
      "World style",
      "Character style",
      "Persona style",
      "Impersonation style",
      "Enhance definitions",
      "Scenario",
      "NSFW",
      "Post-history",
      "Auxiliary",
      "Trackers and scene trackers",
      "Guided generation prompts",
      "Summary prompts",
      "Agentic workflow",
      "Memory routing",
      "Tool or agent handoff rules",
    ],
    stackStatus: "Needs agentic workflow design",
  },
};

const povLabels: Record<PovMode, string> = {
  char_pov: "{{char}} POV",
  user_pov: "{{user}} POV",
  narrator_pov: "Narrator POV",
};

const groupLabels: Record<CategoryTag["group"], string> = {
  trope: "Trope",
  relationship_dynamic: "Relationship dynamic",
  heat_intimacy_mode: "Heat",
  scene_function: "Scene function",
  conflict_obstacle: "Conflict",
  pov: "POV",
  writing_style: "WritingStyle",
  platform_export_target: "Platform",
  content_boundary: "Content boundary",
};

type StoryMemoryDashboardProps = {
  auth: StoryMemoryAuthState;
  story: Story;
  initialCharacters: Character[];
  initialScenes: SceneMemory[];
  initialRelationships: RelationshipThread[];
  initialSecrets: SecretOrReveal[];
  initialPromptPacks: GeneratedPromptPack[];
  initialSelectedTagSlugs: string[];
  isPersisted: boolean;
  categoryTags: CategoryTag[];
  corePromptPacks: CorePromptPack[];
};

type AuthAction = "sign-in" | "create-account" | "magic-link" | "reset-password";

export function StoryMemoryDashboard({
  auth,
  story,
  initialCharacters,
  initialScenes,
  initialRelationships,
  initialSecrets,
  initialPromptPacks,
  initialSelectedTagSlugs,
  isPersisted,
  categoryTags,
  corePromptPacks,
}: StoryMemoryDashboardProps) {
  const [isPending, startTransition] = useTransition();
  const [characters, setCharacters] = useState(initialCharacters);
  const [scenes, setScenes] = useState(initialScenes);
  const [relationships, setRelationships] = useState(initialRelationships);
  const [secrets, setSecrets] = useState(initialSecrets);
  const [promptPacks, setPromptPacks] = useState(initialPromptPacks);
  const [heatLevel, setHeatLevel] = useState<HeatLevelLabel>(story.heat_level ?? "spicy");
  const [spiceVisibility, setSpiceVisibility] = useState<SpiceVisibility>("censored");
  const [povMode, setPovMode] = useState<PovMode>(story.default_pov_mode ?? "narrator_pov");
  const [platform, setPlatform] = useState(story.export_targets?.[0] ?? "JanitorAI");
  const [selectedTagSlugs, setSelectedTagSlugs] = useState<string[]>(initialSelectedTagSlugs);
  const [activeCorePackId, setActiveCorePackId] = useState(corePromptPacks[0]?.id ?? "");
  const [notice, setNotice] = useState(
    isPersisted ? "Supabase workspace ready." : getAuthMessage(auth),
  );
  const [authNotice, setAuthNotice] = useState(
    auth.status === "signed_in" ? "Signed in." : "Use your saved workspace login here.",
  );
  const supabase = useMemo(() => (isPersisted || auth.status === "signed_out" ? createClient() : null), [
    auth.status,
    isPersisted,
  ]);
  const userId = auth.status === "signed_in" ? auth.userId : null;

  const activeRelationship = relationships.at(-1);
  const activeSecret = secrets.at(-1);
  const activeScene = scenes.at(-1);
  const latestPromptPack = promptPacks.at(-1);
  const activeCorePack = corePromptPacks.find((pack) => pack.id === activeCorePackId) ?? corePromptPacks[0];
  const activePlatformProfile = platformProfiles[platform] ?? platformProfiles.JanitorAI;

  const groupedTags = useMemo(() => {
    return categoryTags.reduce<Record<string, CategoryTag[]>>((groups, tag) => {
      groups[tag.group] ??= [];
      groups[tag.group].push(tag);
      return groups;
    }, {});
  }, [categoryTags]);

  const stats = [
    { label: "Participants", value: characters.length, tone: "border-teal-200 bg-teal-50 text-teal-900" },
    { label: "Scenes", value: scenes.length, tone: "border-sky-200 bg-sky-50 text-sky-900" },
    {
      label: "Relationships",
      value: relationships.length,
      tone: "border-rose-200 bg-rose-50 text-rose-900",
    },
    { label: "Secrets", value: secrets.length, tone: "border-amber-200 bg-amber-50 text-amber-900" },
  ];

  function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runAuthAction(event.currentTarget, "sign-in");
  }

  function handleAuthButtonClick(event: MouseEvent<HTMLButtonElement>, action: AuthAction) {
    const form = event.currentTarget.form;
    if (!form) return;

    runAuthAction(form, action);
  }

  function runAuthAction(form: HTMLFormElement, action: AuthAction) {
    const email = getFormValue(form, "email");
    const password = getFormValue(form, "password");

    if (!email || !supabase) {
      setAuthNotice("Enter an email address first.");
      return;
    }

    if (action === "magic-link") {
      requestMagicLink(email);
      return;
    }

    if (action === "reset-password") {
      requestPasswordReset(email);
      return;
    }

    if (!password) {
      setAuthNotice("Enter a password to use saved workspace sign-in.");
      return;
    }

    if (action === "create-account") {
      createPasswordAccount(email, password);
      return;
    }

    signInWithPassword(email, password);
  }

  function requestMagicLink(email: string) {
    if (!supabase) return;

    setAuthNotice("Sending magic link...");

    startTransition(async () => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      const message = error ? error.message : "Magic link sent. Check your email.";
      setAuthNotice(message);
      setNotice(message);
    });
  }

  function requestPasswordReset(email: string) {
    if (!supabase) return;

    setAuthNotice("Sending password setup link...");

    startTransition(async () => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
      });

      const message = error ? error.message : "Password setup link sent. Check your email.";
      setAuthNotice(message);
      setNotice(message);
    });
  }

  function signInWithPassword(email: string, password: string) {
    if (!supabase) return;

    setAuthNotice("Signing in...");

    startTransition(async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthNotice(error.message);
        setNotice(error.message);
        return;
      }

      window.location.reload();
    });
  }

  function createPasswordAccount(email: string, password: string) {
    if (!supabase) return;

    setAuthNotice("Creating account...");

    startTransition(async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setAuthNotice(error.message);
        setNotice(error.message);
        return;
      }

      if (data.session) {
        window.location.reload();
        return;
      }

      setAuthNotice("Account created. Check your email if Supabase asks you to confirm it.");
      setNotice("Account created. Check your email if Supabase asks you to confirm it.");
    });
  }

  function signOut() {
    if (!supabase) return;

    startTransition(async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setNotice(error.message);
        return;
      }

      window.location.reload();
    });
  }

  function toggleTag(slug: string) {
    const tag = categoryTags.find((candidate) => candidate.slug === slug);
    const shouldSelect = !selectedTagSlugs.includes(slug);

    setSelectedTagSlugs((current) =>
      shouldSelect ? [...current, slug] : current.filter((tagSlug) => tagSlug !== slug),
    );

    if (!isPersisted || !supabase || !userId || !tag) {
      return;
    }

    startTransition(async () => {
      const result = shouldSelect
        ? await supabase.from("story_tag_selections").upsert(
            {
              owner_id: userId,
              story_id: story.id,
              tag_id: tag.id,
            },
            { onConflict: "story_id,tag_id" },
          )
        : await supabase
            .from("story_tag_selections")
            .delete()
            .eq("story_id", story.id)
            .eq("tag_id", tag.id);

      if (result.error) {
        setSelectedTagSlugs((current) =>
          shouldSelect ? current.filter((tagSlug) => tagSlug !== slug) : [...current, slug],
        );
        setNotice(result.error.message);
        return;
      }

      setNotice(shouldSelect ? `Saved tag: ${tag.label}.` : `Removed tag: ${tag.label}.`);
    });
  }

  function updateHeatLevel(value: HeatLevelLabel) {
    setHeatLevel(value);
    void persistStoryPatch({ heat_level: value });
  }

  function updatePovMode(value: PovMode) {
    setPovMode(value);
    void persistStoryPatch({ default_pov_mode: value });
  }

  function updatePlatform(value: string) {
    setPlatform(value);
    void persistStoryPatch({ export_targets: [value] });
  }

  async function persistStoryPatch(patch: {
    default_pov_mode?: PovMode;
    export_targets?: string[];
    heat_level?: HeatLevelLabel;
  }) {
    if (!isPersisted || !supabase || !userId) return;

    const { error } = await supabase
      .from("stories")
      .update({
        ...patch,
        updated_at: new Date().toISOString(),
      })
      .eq("id", story.id);

    setNotice(error ? error.message : "Saved story setting.");
  }

  async function addCharacter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const name = getFormValue(form, "name");
    const role = getFormValue(form, "role");
    const privateTruth = getFormValue(form, "privateTruth");
    const selfBelief = getFormValue(form, "selfBelief");

    if (!name) return;

    const now = new Date().toISOString();
    const draft: Character = {
      id: makeId("char"),
      story_id: story.id,
      name,
      aliases: [],
      role,
      public_facts: role ? [`Known role: ${role}`] : [],
      private_truths: privateTruth ? [privateTruth] : [],
      self_beliefs: selfBelief ? [selfBelief] : [],
      false_beliefs: [],
      wants: [],
      fears: [],
      boundaries: ["Do not write this participant with omniscient knowledge."],
      created_at: now,
      updated_at: now,
    };

    if (isPersisted && supabase && userId) {
      const { data, error } = await supabase
        .from("characters")
        .insert({
          ...draft,
          owner_id: userId,
          role: draft.role ?? null,
          voice_notes: draft.voice_notes ?? null,
          current_emotional_state: draft.current_emotional_state ?? null,
          author_only_notes: draft.author_only_notes ?? null,
        })
        .select()
        .single();

      if (error) {
        setNotice(error.message);
        return;
      }

      setCharacters((current) => [...current, mapCharacterRow(data)]);
    } else {
      setCharacters((current) => [...current, draft]);
    }

    form.reset();
    setNotice(`Added ${name} to story memory${isPersisted ? " and saved it" : ""}.`);
  }

  async function addRelationship(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const first = getFormValue(form, "participantA") || characters[0]?.id;
    const second = getFormValue(form, "participantB") || characters[1]?.id || first;
    const dynamic = getFormValue(form, "dynamic") || "Undefined dynamic";
    const state = getFormValue(form, "state");
    const conflict = getFormValue(form, "conflict");
    const nextPressure = getFormValue(form, "nextPressure");
    const now = new Date().toISOString();
    const draft: RelationshipThread = {
      id: makeId("rel"),
      story_id: story.id,
      participants: [first, second].filter(Boolean),
      dynamic_label: dynamic,
      current_state: state,
      conflict_notes: conflict,
      attraction_notes: "Attraction notes pending.",
      boundaries: ["Export only what the active POV can know."],
      linked_secret_ids: [],
      next_pressure_point: nextPressure,
      created_at: now,
      updated_at: now,
    };

    if (isPersisted && supabase && userId) {
      const { data, error } = await supabase
        .from("relationship_threads")
        .insert({
          ...draft,
          owner_id: userId,
          current_state: draft.current_state ?? null,
          attraction_notes: draft.attraction_notes ?? null,
          trust_notes: draft.trust_notes ?? null,
          conflict_notes: draft.conflict_notes ?? null,
          intimacy_history: draft.intimacy_history ?? null,
          power_dynamic_notes: draft.power_dynamic_notes ?? null,
          last_major_change: draft.last_major_change ?? null,
          unresolved_tension: draft.unresolved_tension ?? null,
          next_pressure_point: draft.next_pressure_point ?? null,
        })
        .select()
        .single();

      if (error) {
        setNotice(error.message);
        return;
      }

      setRelationships((current) => [...current, mapRelationshipThreadRow(data)]);
    } else {
      setRelationships((current) => [...current, draft]);
    }

    form.reset();
    setNotice(`Added relationship thread: ${dynamic}${isPersisted ? " and saved it" : ""}.`);
  }

  async function addSecret(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const title = getFormValue(form, "title") || "Untitled secret";
    const secretText = getFormValue(form, "secretText");
    const whoKnows = getFormValue(form, "whoKnows");
    const whoHides = getFormValue(form, "whoHides");
    const whoPretends = getFormValue(form, "whoPretends");
    const pressure = getFormValue(form, "pressure");

    if (!secretText) return;

    const now = new Date().toISOString();
    const draft: SecretOrReveal = {
      id: makeId("secret"),
      story_id: story.id,
      title,
      secret_text: secretText,
      who_knows: whoKnows ? [whoKnows] : [],
      who_suspects: [],
      who_is_wrong: [],
      who_is_hiding_it: whoHides ? [whoHides] : [],
      who_knows_that_someone_knows: [],
      who_falsely_believes_they_are_safe: whoHides ? [whoHides] : [],
      who_is_pretending_not_to_know: whoPretends ? [whoPretends] : [],
      reveal_status: "hidden",
      related_scene_ids: [],
      related_relationship_thread_ids: activeRelationship ? [activeRelationship.id] : [],
      current_pressure: pressure || "Dormant",
      created_at: now,
      updated_at: now,
    };

    if (isPersisted && supabase && userId) {
      const { data, error } = await supabase
        .from("secrets")
        .insert({
          ...draft,
          owner_id: userId,
          title: draft.title ?? null,
          truth_status: draft.truth_status ?? null,
          reveal_scene_id: draft.reveal_scene_id ?? null,
          consequences_if_revealed: draft.consequences_if_revealed ?? null,
          current_pressure: draft.current_pressure ?? null,
          author_notes: draft.author_notes ?? null,
        })
        .select()
        .single();

      if (error) {
        setNotice(error.message);
        return;
      }

      setSecrets((current) => [...current, mapSecretRow(data)]);
    } else {
      setSecrets((current) => [...current, draft]);
    }

    form.reset();
    setNotice(`Added secret: ${title}${isPersisted ? " and saved it" : ""}.`);
  }

  async function addScene(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const title = getFormValue(form, "title") || "Untitled scene";
    const location = getFormValue(form, "location");
    const summary = getFormValue(form, "summary");
    const participant = getFormValue(form, "participant");
    const continuityFlag = getFormValue(form, "continuityFlag");

    if (!summary) return;

    const now = new Date().toISOString();
    const draft: SceneMemory = {
      id: makeId("scene"),
      story_id: story.id,
      title,
      sequence_index: scenes.length + 1,
      location,
      pov_mode: povMode,
      participants: participant ? [participant] : [],
      summary,
      key_actions: [],
      new_information: [],
      unresolved_hooks: [],
      continuity_flags: continuityFlag ? [continuityFlag] : ["Respect active POV knowledge."],
      canon_status: "draft",
      created_at: now,
      updated_at: now,
    };

    if (isPersisted && supabase && userId) {
      const { data, error } = await supabase
        .from("scene_memories")
        .insert({
          ...draft,
          owner_id: userId,
          title: draft.title ?? null,
          sequence_index: draft.sequence_index ?? null,
          scene_date_or_time: draft.scene_date_or_time ?? null,
          location: draft.location ?? null,
          emotional_shift: draft.emotional_shift ?? null,
          relationship_shift: draft.relationship_shift ?? null,
          intimacy_shift: draft.intimacy_shift ?? null,
          conflict_shift: draft.conflict_shift ?? null,
        })
        .select()
        .single();

      if (error) {
        setNotice(error.message);
        return;
      }

      setScenes((current) => [...current, mapSceneMemoryRow(data)]);
    } else {
      setScenes((current) => [...current, draft]);
    }

    form.reset();
    setNotice(`Added scene memory: ${title}${isPersisted ? " and saved it" : ""}.`);
  }

  function generatePromptPack() {
    if (!activeCorePack) return;

    const now = new Date().toISOString();
    const selectedLabels = selectedTagSlugs
      .map((slug) => categoryTags.find((tag) => tag.slug === slug)?.label)
      .filter((label): label is string => Boolean(label));
    const secretLine = activeSecret
      ? `Secret policy: ${activeSecret.title ?? "Active secret"} stays ${activeSecret.reveal_status}; known by ${formatNames(activeSecret.who_knows, characters) || "no one listed"}.`
      : "Secret policy: no active secrets selected.";
    const relationshipLine = activeRelationship
      ? `Relationship pressure: ${activeRelationship.dynamic_label}. ${activeRelationship.next_pressure_point ?? ""}`.trim()
      : "Relationship pressure: not selected.";
    const sceneLine = activeScene ? `Latest scene: ${activeScene.summary}` : "Latest scene: no scene memory yet.";
    const spiceLine =
      spiceVisibility === "censored"
        ? "Spice visibility: censored language for exports."
        : "Spice visibility: uncensored language is allowed where the target platform and story boundaries allow it.";
    const povLine = `POV: ${povLabels[povMode]}. Do not write {{user}} thoughts, dialogue, consent, or choices.`;
    const heatLine = `Heat label: ${displayLabel(heatLevel)}. ${spiceLine}`;
    const tagLine = selectedLabels.length
      ? `Active tags: ${selectedLabels.join(", ")}.`
      : "Active tags: none selected.";

    setPromptPacks((current) => [
      ...current,
      {
        id: makeId("prompt"),
        story_id: story.id,
        source_core_pack_id: activeCorePack.id,
        title: `${activeCorePack.title} for ${platform}`,
        target_platform: platform,
        tailoring_goal: "Freshly generated from the active story memory session.",
        active_pov_mode: povMode,
        spice_visibility_snapshot: spiceVisibility,
        included_sections: activePlatformProfile.includedSections,
        max_length_preference: "compact",
        selected_tropes: selectedLabels,
        selected_characters: characters.map((character) => character.id),
        selected_relationship_threads: activeRelationship ? [activeRelationship.id] : [],
        selected_scene_memories: activeScene ? [activeScene.id] : [],
        selected_secrets_policy: "active_pov_only",
        generated_text: buildPlatformPromptText({
          activeCorePack,
          heatLine,
          platform,
          platformProfile: activePlatformProfile,
          povLine,
          relationshipLine,
          sceneLine,
          secretLine,
          tagLine,
        }),
        persistence_state: "session",
        created_at: now,
        updated_at: now,
      },
    ]);
    setNotice("Generated a fresh session prompt pack.");
  }

  async function saveLatestPromptPack() {
    if (!latestPromptPack) return;
    const now = new Date().toISOString();

    if (isPersisted && supabase && userId) {
      const { data, error } = await saveGeneratedPromptPack({
        ownerId: userId,
        pack: latestPromptPack,
        supabase,
      });

      if (error) {
        setNotice(error.message);
        return;
      }

      setPromptPacks((current) =>
        current.map((pack) =>
          pack.id === latestPromptPack.id ? mapSavedPromptPackRow(data) : pack,
        ),
      );
      setNotice(`Saved prompt pack: ${latestPromptPack.title}.`);
      return;
    }

    setPromptPacks((current) =>
      current.map((pack) =>
        pack.id === latestPromptPack.id
          ? { ...pack, persistence_state: "saved", saved_at: now, updated_at: now }
          : pack,
      ),
    );
    setNotice(`Saved prompt pack: ${latestPromptPack.title}.`);
  }

  return (
    <main className="min-h-screen bg-stone-50 text-zinc-950">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-zinc-200 bg-white lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-zinc-950 text-white">
                <Brain className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-wide">HeartWriteAI</p>
                <p className="text-xs text-zinc-500">Story Memory Core</p>
              </div>
            </div>

            <nav className="mt-8 grid gap-1" aria-label="Workspace">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = index === 0;

                return (
                  <button
                    className={`flex h-10 items-center gap-3 rounded-md px-3 text-left text-sm transition ${
                      isActive
                        ? "bg-zinc-950 text-white"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                    }`}
                    key={item.label}
                    type="button"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Workspace
              </div>
              {auth.status === "signed_in" ? (
                <div className="mt-3 grid gap-3">
                  <p className="truncate text-sm font-medium text-zinc-900">
                    {auth.email ?? "Signed in"}
                  </p>
                  <button
                    className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isPending}
                    onClick={signOut}
                    type="button"
                  >
                    Sign out
                  </button>
                  <p className="text-xs leading-5 text-zinc-500">{authNotice}</p>
                </div>
              ) : (
                <form className="mt-3 grid gap-2" onSubmit={handleAuthSubmit}>
                  <input
                    aria-label="Email"
                    autoComplete="email"
                    className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-950"
                    name="email"
                    placeholder="Email"
                    type="email"
                  />
                  <input
                    aria-label="Password"
                    autoComplete="current-password"
                    className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-950"
                    name="password"
                    placeholder="Password"
                    type="password"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={(event) => handleAuthButtonClick(event, "sign-in")}
                      className="h-9 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isPending || !supabase}
                      type="button"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={(event) => handleAuthButtonClick(event, "create-account")}
                      className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isPending || !supabase}
                      type="button"
                    >
                      Create
                    </button>
                  </div>
                  <button
                    onClick={(event) => handleAuthButtonClick(event, "magic-link")}
                    className="h-9 rounded-md border border-transparent px-3 text-sm font-medium text-zinc-600 hover:bg-white hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isPending || !supabase}
                    type="button"
                  >
                    Email me a link instead
                  </button>
                  <button
                    onClick={(event) => handleAuthButtonClick(event, "reset-password")}
                    className="h-9 rounded-md border border-transparent px-3 text-sm font-medium text-zinc-600 hover:bg-white hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isPending || !supabase}
                    type="button"
                  >
                    Set or reset password
                  </button>
                  <p className="text-xs leading-5 text-zinc-500" aria-live="polite">
                    {authNotice}
                  </p>
                </form>
              )}
              <p className="mt-3 text-xs leading-5 text-zinc-500">
                {isPersisted ? "Changes save to Supabase." : "Demo changes stay in this session."}
              </p>
            </div>

            <div className="mt-auto hidden text-sm text-zinc-600 lg:block">
              <p className="font-medium text-zinc-900">V1 boundary</p>
              <p className="mt-2 leading-6">
                Unsaved generated prompt packs are sessional until deliberately saved.
              </p>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="border-b border-zinc-200 bg-white">
            <div className="flex flex-col gap-5 px-5 py-5 xl:flex-row xl:items-center xl:justify-between xl:px-8">
              <div>
                <p className="text-sm font-medium text-zinc-500">Active story</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-normal text-zinc-950">
                  {story.title}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
                  {story.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <ControlSelect
                  icon={Flame}
                  label="Heat"
                  value={heatLevel}
                  options={heatOptions}
                  onChange={(value) => updateHeatLevel(value as HeatLevelLabel)}
                />
                <ControlSegment
                  icon={ShieldCheck}
                  label="Spice"
                  value={spiceVisibility}
                  options={["censored", "uncensored"]}
                  onChange={(value) => setSpiceVisibility(value as SpiceVisibility)}
                />
                <ControlSelect
                  icon={BookOpenText}
                  label="POV"
                  value={povMode}
                  options={story.supported_pov_modes}
                  optionLabels={povLabels}
                  onChange={(value) => updatePovMode(value as PovMode)}
                />
              </div>
            </div>
          </header>

          <div className="grid gap-5 px-5 py-5 xl:grid-cols-[minmax(0,1.25fr)_400px] xl:px-8">
            <div className="grid gap-5">
              <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Story memory counts">
                {stats.map((stat) => (
                  <article className={`rounded-lg border p-4 ${stat.tone}`} key={stat.label}>
                    <p className="text-sm font-medium">{stat.label}</p>
                    <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
                  </article>
                ))}
              </section>

              <section className="grid gap-5 2xl:grid-cols-2">
                <Panel title="Add Participant" icon={UsersRound}>
                  <form className="grid gap-3" onSubmit={addCharacter}>
                    <Field label="Name" name="name" placeholder="Character name" required />
                    <Field label="Role" name="role" placeholder="AI-controlled character, user player, rival..." />
                    <Field label="Self-belief" name="selfBelief" placeholder="What they believe about themselves" />
                    <TextArea label="Private truth" name="privateTruth" placeholder="Author-known truth, not automatically exported" />
                    <SubmitButton label="Add participant" />
                  </form>
                </Panel>

                <Panel title="Add Relationship" icon={Layers3}>
                  <form className="grid gap-3" onSubmit={addRelationship}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <SelectField label="First participant" name="participantA" options={characterOptions(characters)} />
                      <SelectField label="Second participant" name="participantB" options={characterOptions(characters)} />
                    </div>
                    <Field label="Dynamic" name="dynamic" placeholder="Situationship, FWB, enemies to lovers..." required />
                    <TextArea label="Current state" name="state" placeholder="What is true between them right now" />
                    <TextArea label="Conflict" name="conflict" placeholder="What keeps them from being honest" />
                    <Field label="Next pressure point" name="nextPressure" placeholder="Force proximity, overheard secret..." />
                    <SubmitButton label="Add relationship" />
                  </form>
                </Panel>
              </section>

              <section className="grid gap-5 2xl:grid-cols-2">
                <Panel title="Add Secret" icon={KeyRound}>
                  <form className="grid gap-3" onSubmit={addSecret}>
                    <Field label="Title" name="title" placeholder="The secret leverage" />
                    <TextArea label="Secret" name="secretText" placeholder="Who believes what, who is wrong, who is pretending" required />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <SelectField label="Knows" name="whoKnows" options={characterOptions(characters)} />
                      <SelectField label="Hiding it" name="whoHides" options={characterOptions(characters)} />
                      <SelectField label="Pretending" name="whoPretends" options={characterOptions(characters)} />
                    </div>
                    <Field label="Pressure" name="pressure" placeholder="Dormant, rising, dangerous..." />
                    <SubmitButton label="Add secret" />
                  </form>
                </Panel>

                <Panel title="Add Scene Memory" icon={BookOpenText}>
                  <form className="grid gap-3" onSubmit={addScene}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Title" name="title" placeholder="After the party" />
                      <Field label="Location" name="location" placeholder="Kitchen doorway" />
                    </div>
                    <SelectField label="Main participant" name="participant" options={characterOptions(characters)} />
                    <TextArea label="Summary" name="summary" placeholder="What changed on the page" required />
                    <Field label="Continuity flag" name="continuityFlag" placeholder="What must not be forgotten next time" />
                    <SubmitButton label="Add scene memory" />
                  </form>
                </Panel>
              </section>

              <Panel title="Grouped Tags" icon={Tags}>
                <div className="grid gap-5 lg:grid-cols-2">
                  {Object.entries(groupedTags).map(([group, tags]) => (
                    <div key={group}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        {groupLabels[group as CategoryTag["group"]]}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {tags.map((tag) => {
                          const selected = selectedTagSlugs.includes(tag.slug);
                          return (
                            <button
                              className={`rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                                selected
                                  ? "border-zinc-950 bg-zinc-950 text-white"
                                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                              }`}
                              key={tag.id}
                              onClick={() => toggleTag(tag.slug)}
                              type="button"
                            >
                              {tag.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Current Story State" icon={Brain}>
                <div className="grid gap-6 lg:grid-cols-3">
                  <MemoryColumn title="Latest relationship">
                    <p className="font-semibold text-zinc-950">
                      {activeRelationship?.dynamic_label ?? "No relationship yet"}
                    </p>
                    <p className="mt-2 leading-6">{activeRelationship?.current_state ?? "Add a relationship thread to start tracking tension."}</p>
                  </MemoryColumn>
                  <MemoryColumn title="Latest secret">
                    <p className="font-semibold text-zinc-950">{activeSecret?.title ?? "No secret yet"}</p>
                    <p className="mt-2 leading-6">{activeSecret?.secret_text ?? "Secrets can track who knows, who suspects, and who is pretending."}</p>
                  </MemoryColumn>
                  <MemoryColumn title="Latest scene">
                    <p className="font-semibold text-zinc-950">{activeScene?.title ?? "No scene yet"}</p>
                    <p className="mt-2 leading-6">{activeScene?.summary ?? "Scene memory keeps continuity visible between writing sessions."}</p>
                  </MemoryColumn>
                </div>
              </Panel>
            </div>

            <aside className="grid content-start gap-5">
              <Panel title="Prompt Pack Builder" icon={MessageSquareText}>
                <div className="grid gap-4">
                  <label className="grid gap-1.5 text-sm">
                    <span className="font-medium text-zinc-700">Platform</span>
                    <select
                      className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-zinc-950"
                      onChange={(event) => updatePlatform(event.target.value)}
                      value={platform}
                    >
                      {platformOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <p className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm leading-6 text-zinc-600">
                    {activePlatformProfile.builderNote}
                  </p>

                  <div className="rounded-md border border-zinc-200 bg-white px-3 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        Export shape
                      </p>
                      <span className="rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                        {activePlatformProfile.stackStatus}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {activePlatformProfile.promptAreas.map((area) => (
                        <span
                          className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700"
                          key={area}
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <label className="grid gap-1.5 text-sm">
                    <span className="font-medium text-zinc-700">Core pack</span>
                    <select
                      className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-zinc-950"
                      onChange={(event) => setActiveCorePackId(event.target.value)}
                      value={activeCorePackId}
                    >
                      {corePromptPacks.map((pack) => (
                        <option key={pack.id} value={pack.id}>
                          {pack.title}
                        </option>
                      ))}
                    </select>
                  </label>

                  <p className="text-sm leading-6 text-zinc-600">{activeCorePack?.description}</p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-800"
                      disabled={isPending}
                      onClick={generatePromptPack}
                      type="button"
                    >
                      <Sparkles className="size-4" aria-hidden="true" />
                      Generate
                    </button>
                    <button
                      className="flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                      disabled={!latestPromptPack || latestPromptPack.persistence_state === "saved" || isPending}
                      onClick={saveLatestPromptPack}
                      type="button"
                    >
                      <Save className="size-4" aria-hidden="true" />
                      Save
                    </button>
                  </div>

                  <p className="text-xs font-medium text-zinc-500">{notice}</p>
                </div>
              </Panel>

              <Panel title="Latest Prompt Pack" icon={Copy}>
                {latestPromptPack ? (
                  <div className="grid gap-4">
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-zinc-950">{latestPromptPack.title}</p>
                        <StatusBadge saved={latestPromptPack.persistence_state === "saved"} />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-zinc-600">{latestPromptPack.tailoring_goal}</p>
                    </div>

                    <pre className="max-h-[360px] overflow-auto whitespace-pre-wrap rounded-lg bg-zinc-950 p-4 text-sm leading-6 text-zinc-100">
                      {latestPromptPack.generated_text}
                    </pre>
                  </div>
                ) : (
                  <p className="text-sm leading-6 text-zinc-600">
                    Generate a session pack from the current story memory state.
                  </p>
                )}
              </Panel>

              <Panel title="Authorship Guardrails" icon={ShieldCheck}>
                <ul className="space-y-3 text-sm leading-6 text-zinc-600">
                  <li>No omniscient leakage by default.</li>
                  <li>Secrets export through the active POV policy.</li>
                  <li>The AI does not write user thoughts, dialogue, consent, or choices.</li>
                  <li>Narrator POV is shared authorship, not permission to seize the user player.</li>
                </ul>
              </Panel>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function buildPlatformPromptText({
  activeCorePack,
  heatLine,
  platform,
  platformProfile,
  povLine,
  relationshipLine,
  sceneLine,
  secretLine,
  tagLine,
}: {
  activeCorePack: CorePromptPack;
  heatLine: string;
  platform: string;
  platformProfile: PlatformProfile;
  povLine: string;
  relationshipLine: string;
  sceneLine: string;
  secretLine: string;
  tagLine: string;
}) {
  if (platform === "SillyTavern") {
    return [
      "[SillyTavern Stack Map]",
      platformProfile.generatedFrame,
      "",
      "[Core Prompt Source]",
      activeCorePack.base_prompt,
      "",
      "[Prompt Areas To Configure]",
      platformProfile.promptAreas.map((area) => `- ${area}`).join("\n"),
      "",
      "[Current Story Inputs]",
      povLine,
      heatLine,
      tagLine,
      relationshipLine,
      secretLine,
      sceneLine,
    ].join("\n");
  }

  if (platform === "MarinaraTavern") {
    return [
      "<agentic-stack-map>",
      platformProfile.generatedFrame,
      "</agentic-stack-map>",
      "",
      "<core-prompt-source>",
      activeCorePack.base_prompt,
      "</core-prompt-source>",
      "",
      "<prompt-areas-to-configure>",
      platformProfile.promptAreas.map((area) => `- ${area}`).join("\n"),
      "</prompt-areas-to-configure>",
      "",
      "<current-story-inputs>",
      povLine,
      heatLine,
      tagLine,
      relationshipLine,
      secretLine,
      sceneLine,
      "</current-story-inputs>",
    ].join("\n");
  }

  return [
    "[JanitorAI Export]",
    platformProfile.generatedFrame,
    "",
    "[Global Prompt]",
    activeCorePack.base_prompt,
    "",
    povLine,
    heatLine,
    tagLine,
    "",
    "[Proxy Prompt]",
    "Use this for the active session layer: immediate POV control, current relationship pressure, secrets, and latest continuity.",
    "",
    relationshipLine,
    secretLine,
    sceneLine,
  ].join("\n");
}

function ControlSelect({
  icon: Icon,
  label,
  onChange,
  optionLabels,
  options,
  value,
}: {
  icon: LucideIcon;
  label: string;
  onChange: (value: string) => void;
  optionLabels?: Partial<Record<string, string>>;
  options: string[];
  value: string;
}) {
  return (
    <label className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
      <span className="flex items-center gap-2 text-xs font-medium text-zinc-500">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </span>
      <select
        className="mt-1 w-full bg-transparent text-sm font-semibold text-zinc-950 outline-none"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabels?.[option] ?? displayLabel(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

function ControlSegment({
  icon: Icon,
  label,
  onChange,
  options,
  value,
}: {
  icon: LucideIcon;
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
      <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </div>
      <div className="mt-1 grid grid-cols-2 gap-1">
        {options.map((option) => (
          <button
            className={`rounded px-1.5 py-1 text-xs font-semibold transition ${
              value === option ? "bg-zinc-950 text-white" : "text-zinc-600 hover:bg-white"
            }`}
            key={option}
            onClick={() => onChange(option)}
            type="button"
          >
            {displayLabel(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

function Panel({ children, icon: Icon, title }: { children: ReactNode; icon: LucideIcon; title: string }) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="size-4 text-zinc-500" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-zinc-950">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  name,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-zinc-700">{label}</span>
      <input
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-950"
        name={name}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-zinc-700">{label}</span>
      <textarea
        className="min-h-24 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-zinc-950"
        name={name}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: { label: string; value: string }[];
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-zinc-700">{label}</span>
      <select
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-950"
        name={name}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function SubmitButton({ label }: { label: string }) {
  return (
    <button
      className="mt-1 flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-800"
      type="submit"
    >
      <Plus className="size-4" aria-hidden="true" />
      {label}
    </button>
  );
}

function MemoryColumn({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="text-sm text-zinc-600">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function StatusBadge({ saved }: { saved: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${
        saved ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
      }`}
    >
      {saved ? <Check className="size-3" aria-hidden="true" /> : null}
      {saved ? "Saved" : "Session"}
    </span>
  );
}

function characterOptions(characters: Character[]) {
  return characters.length
    ? characters.map((character) => ({ label: character.name, value: character.id }))
    : [{ label: "No participants yet", value: "" }];
}

function formatNames(ids: string[], characters: Character[]) {
  return ids
    .map((id) => characters.find((character) => character.id === id)?.name)
    .filter(Boolean)
    .join(", ");
}

function getFormValue(form: HTMLFormElement, name: string) {
  const field = form.elements.namedItem(name);
  if (!field || !("value" in field)) return "";
  return String(field.value).trim();
}

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}`;
}

function displayLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getAuthMessage(auth: StoryMemoryAuthState) {
  return auth.status === "signed_in" ? "Supabase workspace ready." : auth.message;
}
