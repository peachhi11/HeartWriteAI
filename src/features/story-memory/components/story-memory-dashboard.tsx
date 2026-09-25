"use client";

import type { ChangeEvent, FormEvent, MouseEvent, ReactNode } from "react";
import { useMemo, useState, useTransition } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  Brain,
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
  getCreateAccountSuccessMessage,
  getFriendlyAuthErrorMessage,
  type AuthAction,
  validateWorkspaceAuthInput,
} from "@/features/story-memory/auth/workspace-auth";
import { CharacterCardIntakePanel } from "@/features/story-memory/components/character-card-intake-panel";
import { JanitorExportPanel } from "@/features/story-memory/components/janitor-export-panel";
import { SectionPanel as Panel } from "@/features/story-memory/components/section-panel";
import {
  emptyUserPersonaDraft,
  formatUserPersonaDraft,
  type UserPersonaDraft,
  UserPersonaBuilderPanel,
} from "@/features/story-memory/components/user-persona-builder-panel";
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
  ContinuityMode,
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
import {
  compactSentence,
  extractCharacterCardSourceFromPng,
  type LoadedCharacterCard,
  parseCharacterCard,
} from "@/features/story-memory/utils/character-card-parser";
import {
  continuityModeLabels,
  getPromptModuleSuggestions,
  getPromptModuleValues,
  povLabels,
  type PromptModuleDrafts,
} from "@/features/story-memory/utils/prompt-module-suggestions";
import {
  buildPlatformPromptSlots,
  formatPromptSlots,
  type PlatformProfile,
  type PromptModuleKey,
  type PromptModuleText,
  type PromptSlot,
} from "@/features/story-memory/utils/prompt-slot-builder";
import { createClient } from "@/lib/supabase/browser";

type WorkspaceSection =
  | "story"
  | "character-card"
  | "user-persona"
  | "participants"
  | "relationships"
  | "secrets"
  | "prompt-packs"
  | "exports";

const navItems: {
  icon: LucideIcon;
  id: WorkspaceSection;
  label: string;
}[] = [
  { id: "story", label: "Story", icon: BookOpenText },
  { id: "character-card", label: "Character Card", icon: BookOpenText },
  { id: "user-persona", label: "User Persona", icon: UsersRound },
  { id: "participants", label: "Participants", icon: UsersRound },
  { id: "relationships", label: "Relationships", icon: Layers3 },
  { id: "secrets", label: "Secrets", icon: LockKeyhole },
  { id: "prompt-packs", label: "Prompt Packs", icon: MessageSquareText },
  { id: "exports", label: "Exports", icon: Download },
];

const heatOptions: HeatLevelLabel[] = ["sweet", "sensual", "spicy", "explicit", "extreme"];
const continuityModeOptions: ContinuityMode[] = ["canon", "alt"];
const platformOptions = ["JanitorAI", "SillyTavern", "MarinaraTavern"];

type PromptModuleExpanded = Record<PromptModuleKey, boolean>;
type WritingStylePreset = {
  description: string;
  id: string;
  label: string;
  modules: Pick<
    PromptModuleText,
    | "styleDialogueVoice"
    | "stylePerspectiveLens"
    | "styleRhythmDensity"
    | "styleSubtextEmotion"
    | "styleToneSensory"
  >;
};

const defaultPromptModuleExpanded: PromptModuleExpanded = {
  activeTags: false,
  activeSecrets: false,
  chapterArc: false,
  continuityBranch: false,
  heatSpice: false,
  latestScene: false,
  povGuardrails: true,
  relationshipPressure: false,
  scenarioSetup: true,
  settingFrame: false,
  styleDialogueVoice: false,
  stylePerspectiveLens: true,
  styleRhythmDensity: false,
  styleSubtextEmotion: false,
  styleToneSensory: false,
};

const promptModuleOptions: {
  group: "Story state" | "Writing style";
  helper: string;
  key: PromptModuleKey;
  label: string;
  slot: "Global" | "Proxy";
}[] = [
  {
    group: "Story state",
    helper: "Authorship and POV boundary text for the stable global prompt.",
    key: "povGuardrails",
    label: "POV guardrails",
    slot: "Global",
  },
  {
    group: "Story state",
    helper: "Current heat label and censored/uncensored export language.",
    key: "heatSpice",
    label: "Heat / spice state",
    slot: "Global",
  },
  {
    group: "Story state",
    helper: "Selected trope and platform tags that should shape the pack.",
    key: "activeTags",
    label: "Active tags",
    slot: "Global",
  },
  {
    group: "Story state",
    helper: "Current relationship tension for the active session layer.",
    key: "relationshipPressure",
    label: "Relationship pressure",
    slot: "Proxy",
  },
  {
    group: "Story state",
    helper: "The premise or situation the characters are inside.",
    key: "scenarioSetup",
    label: "Scenario setup",
    slot: "Proxy",
  },
  {
    group: "Story state",
    helper: "The location, world context, and situational frame around the scene.",
    key: "settingFrame",
    label: "Setting frame",
    slot: "Proxy",
  },
  {
    group: "Story state",
    helper: "Marks whether this is canon continuity or an Alt branch.",
    key: "continuityBranch",
    label: "Continuity branch",
    slot: "Proxy",
  },
  {
    group: "Story state",
    helper: "Optional opener, chapter, season, or narrative arc guidance.",
    key: "chapterArc",
    label: "Chapter / arc",
    slot: "Proxy",
  },
  {
    group: "Story state",
    helper: "Active secret/reveal policy for the selected POV.",
    key: "activeSecrets",
    label: "Active secrets",
    slot: "Proxy",
  },
  {
    group: "Story state",
    helper: "What is happening right now in the active exchange.",
    key: "latestScene",
    label: "Current scene",
    slot: "Proxy",
  },
  {
    group: "Writing style",
    helper: "Groups POV lens, camera angle, and narrative distance.",
    key: "stylePerspectiveLens",
    label: "POV, lens + narrative distance",
    slot: "Global",
  },
  {
    group: "Writing style",
    helper: "Groups sentence rhythm, paragraph length, pacing, and description density.",
    key: "styleRhythmDensity",
    label: "Sentence rhythm + density",
    slot: "Global",
  },
  {
    group: "Writing style",
    helper: "Groups tonal direction, atmosphere, and sensory texture.",
    key: "styleToneSensory",
    label: "Tone, atmosphere + sensory",
    slot: "Global",
  },
  {
    group: "Writing style",
    helper: "Groups dialogue style, interiority, and character voice pressure.",
    key: "styleDialogueVoice",
    label: "Dialogue, voice + interiority",
    slot: "Global",
  },
  {
    group: "Writing style",
    helper: "Groups subtext, emotional logic, and show-don't-tell behavior.",
    key: "styleSubtextEmotion",
    label: "Subtext + emotional logic",
    slot: "Global",
  },
];

const promptModuleGroups = [
  {
    description: "Facts from the current story memory that can change between sessions.",
    label: "Story state",
  },
  {
    description: "Short prose-mechanics stacks for how the generated writing should feel on the page.",
    label: "Writing style",
  },
] as const;

const promptModuleSectionLabels: Record<PromptModuleKey, string> = {
  activeTags: "Tags",
  activeSecrets: "Secret policy",
  chapterArc: "Chapter and narrative arc",
  continuityBranch: "Continuity branch",
  heatSpice: "Heat and spice state",
  latestScene: "Current scene",
  povGuardrails: "POV policy",
  relationshipPressure: "Relationship pressure",
  scenarioSetup: "Scenario setup",
  settingFrame: "Setting frame",
  styleDialogueVoice: "Dialogue, voice, and interiority",
  stylePerspectiveLens: "POV, lens, and narrative distance",
  styleRhythmDensity: "Sentence rhythm and description density",
  styleSubtextEmotion: "Subtext and emotional logic",
  styleToneSensory: "Tone, atmosphere, and sensory description",
};

const writingStylePresets: WritingStylePreset[] = [
  {
    description: "Close, emotionally present prose with a warm sensory lens.",
    id: "close-intimate",
    label: "Close Intimate",
    modules: {
      styleDialogueVoice:
        "Dialogue should feel private, responsive, and character-specific. Let small admissions, evasions, and half-finished thoughts reveal intimacy before anyone explains it outright.",
      stylePerspectiveLens:
        "Keep the prose close to the active POV's body, attention, and emotional bias. Description should feel filtered through what they notice because it matters to them.",
      styleRhythmDensity:
        "Use a flexible rhythm: clean action beats, longer interior or sensory sentences when vulnerability rises, and shorter paragraphs when tension needs air.",
      styleSubtextEmotion:
        "Let emotional shifts surface through pauses, restraint, physical tells, and choices that cost something. Avoid over-explaining feelings the scene can dramatize.",
      styleToneSensory:
        "Keep the atmosphere intimate and tactile. Prioritize breath, proximity, touch, warmth, texture, and sensory details that make the emotional stakes feel immediate.",
    },
  },
  {
    description: "Modern, punchy, voice-forward prose with crisp pacing.",
    id: "sharp-contemporary",
    label: "Sharp Contemporary",
    modules: {
      styleDialogueVoice:
        "Dialogue should be quick, specific, and voice-led. Use banter, interruption, contradiction, and precise word choice to show power shifts without bloating the scene.",
      stylePerspectiveLens:
        "Keep the lens close but unsentimental. Let the active POV notice concrete details, social pressure, micro-reactions, and contradictions in what people say versus do.",
      styleRhythmDensity:
        "Favor clean paragraphs, varied sentence length, and fast readable movement. Keep description selective: one sharp detail beats a paragraph of static scenery.",
      styleSubtextEmotion:
        "Play emotion through friction: deflection, jokes that land too hard, withheld honesty, and behavior that betrays more than the character intended.",
      styleToneSensory:
        "Use sensory detail like a camera snap: vivid, modern, and immediate. Keep atmosphere grounded in place, body language, and social tension.",
    },
  },
  {
    description: "Moody, atmospheric prose with desire, dread, and texture.",
    id: "atmospheric-gothic",
    label: "Atmospheric Gothic",
    modules: {
      styleDialogueVoice:
        "Dialogue should carry restraint, implication, threat, longing, and old wounds. Let characters say less than they mean and make silence feel consequential.",
      stylePerspectiveLens:
        "Keep the lens close but shadowed by memory, suspicion, and sensory unease. The active POV should interpret setting and gesture through desire, fear, and history.",
      styleRhythmDensity:
        "Use slower, weightier sentences for atmosphere and shorter ruptures when danger, revelation, or intimacy cuts through the scene.",
      styleSubtextEmotion:
        "Let secrets, dread, yearning, and guilt move under the surface. Emotional truth should leak through symbols, avoidance, ritual, setting, and charged misreadings.",
      styleToneSensory:
        "Build atmosphere through weather, darkness, texture, sound, scent, threshold spaces, and the physical sense of being watched, wanted, or trapped.",
    },
  },
  {
    description: "Taut, spare prose for pressure-cooker scenes.",
    id: "high-tension-sparse",
    label: "High Tension / Sparse",
    modules: {
      styleDialogueVoice:
        "Dialogue should be clipped, loaded, and difficult to misread. Use silence, repeated questions, corrections, and direct challenges to keep pressure high.",
      stylePerspectiveLens:
        "Keep the lens narrow and immediate. Focus on what the active POV tracks under pressure: hands, exits, breath, voice changes, distance, and risk.",
      styleRhythmDensity:
        "Use short paragraphs and lean sentences. Cut decorative description unless it increases threat, attraction, urgency, or consequence.",
      styleSubtextEmotion:
        "Let emotion show through control breaking: hesitation, stillness, anger, denial, bad timing, and choices made too quickly.",
      styleToneSensory:
        "Keep sensory details sharp and minimal: pulse, heat, sound, contact, silence, space, and the physical cost of waiting too long.",
    },
  },
  {
    description: "Rich, immersive prose with heavier sensory description.",
    id: "sensory-lush",
    label: "Sensory Lush",
    modules: {
      styleDialogueVoice:
        "Dialogue should remain character-specific, but let pauses, breath, touch, and sensory reaction surround the spoken line so the exchange feels embodied.",
      stylePerspectiveLens:
        "Keep the lens close and immersive. Let the active POV experience setting, body, memory, and attraction as layered sensations rather than distant summary.",
      styleRhythmDensity:
        "Allow longer sentences and fuller paragraphs when sensation, longing, or atmosphere is doing real work. Vary with shorter beats for impact.",
      styleSubtextEmotion:
        "Let emotion gather through sensory accumulation: what the character notices, avoids touching, cannot stop hearing, or remembers at the wrong moment.",
      styleToneSensory:
        "Use lush concrete sensory detail across touch, sound, scent, taste, temperature, texture, light, pressure, and movement. Keep every detail tied to mood or choice.",
    },
  },
  {
    description: "Witty, kinetic prose where banter masks stakes.",
    id: "comedic-banter",
    label: "Comedic Banter",
    modules: {
      styleDialogueVoice:
        "Dialogue should be quick, playful, and character-specific, with jokes revealing attraction, insecurity, competition, or avoidance rather than deflating stakes.",
      stylePerspectiveLens:
        "Keep the lens close to the active POV's timing, embarrassment, desire, and social read of the room. Let observations be witty without becoming detached.",
      styleRhythmDensity:
        "Use brisk paragraphing, fast exchanges, and well-placed beats of physical comedy or awkward logistics. Slow down only when the joke exposes a real feeling.",
      styleSubtextEmotion:
        "Let humor act as cover. The funniest line should often reveal what the character is trying not to confess, want, fear, or notice.",
      styleToneSensory:
        "Keep sensory detail lively and specific: expressions, timing, proximity, accidental contact, environment interruptions, and the bodily comedy of wanting someone.",
    },
  },
];

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
  const [activeWorkspaceSection, setActiveWorkspaceSection] = useState<WorkspaceSection>("story");
  const [characterCardInput, setCharacterCardInput] = useState("");
  const [loadedCharacterCard, setLoadedCharacterCard] = useState<LoadedCharacterCard | null>(null);
  const [userPersonaDraft, setUserPersonaDraft] = useState<UserPersonaDraft>(emptyUserPersonaDraft);
  const [selectedTagSlugs, setSelectedTagSlugs] = useState<string[]>(initialSelectedTagSlugs);
  const [activeCorePackId, setActiveCorePackId] = useState(corePromptPacks[0]?.id ?? "");
  const [activeWritingStylePresetId, setActiveWritingStylePresetId] = useState(writingStylePresets[0].id);
  const [customStyleName, setCustomStyleName] = useState("");
  const [customWritingStylePresets, setCustomWritingStylePresets] = useState<WritingStylePreset[]>([]);
  const [promptModuleDrafts, setPromptModuleDrafts] = useState<PromptModuleDrafts>({});
  const [promptModuleExpanded, setPromptModuleExpanded] = useState<PromptModuleExpanded>(
    defaultPromptModuleExpanded,
  );
  const [copiedSlotId, setCopiedSlotId] = useState<string | null>(null);
  const [copiedPersonaDraft, setCopiedPersonaDraft] = useState(false);
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
  const latestPromptSlots = latestPromptPack ? getPromptPackSlots(latestPromptPack) : [];
  const activeCorePack = corePromptPacks.find((pack) => pack.id === activeCorePackId) ?? corePromptPacks[0];
  const activePlatformProfile = platformProfiles[platform] ?? platformProfiles.JanitorAI;
  const availableWritingStylePresets = useMemo(
    () => [...writingStylePresets, ...customWritingStylePresets],
    [customWritingStylePresets],
  );
  const selectedTagLabels = useMemo(
    () =>
      selectedTagSlugs
        .map((slug) => categoryTags.find((tag) => tag.slug === slug)?.label)
        .filter((label): label is string => Boolean(label)),
    [categoryTags, selectedTagSlugs],
  );
  const promptModuleSuggestions = useMemo(
    () =>
      getPromptModuleSuggestions({
        activeRelationship,
        activeScene,
        activeSecret,
        characters,
        heatLevel,
        povMode,
        selectedTagLabels,
        spiceVisibility,
        story,
      }),
    [
      activeRelationship,
      activeScene,
      activeSecret,
      characters,
      heatLevel,
      povMode,
      selectedTagLabels,
      spiceVisibility,
      story,
    ],
  );
  const promptModuleValues = useMemo(
    () => getPromptModuleValues(promptModuleSuggestions, promptModuleDrafts),
    [promptModuleDrafts, promptModuleSuggestions],
  );

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
    const validationMessage = validateWorkspaceAuthInput({ action, email, password });

    if (validationMessage) {
      setAuthNotice(validationMessage);
      return;
    }

    if (!supabase) {
      setAuthNotice("Saved workspace sign-in is not configured for this local session.");
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

      const message = error
        ? getFriendlyAuthErrorMessage(error.message)
        : "Magic link sent. Check your email.";
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

      const message = error
        ? getFriendlyAuthErrorMessage(error.message)
        : "Password setup link sent. Check your email.";
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
        const message = getFriendlyAuthErrorMessage(error.message);
        setAuthNotice(message);
        setNotice(message);
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
        const message = getFriendlyAuthErrorMessage(error.message);
        setAuthNotice(message);
        setNotice(message);
        return;
      }

      if (data.session) {
        window.location.reload();
        return;
      }

      const message = getCreateAccountSuccessMessage({
        hasSession: Boolean(data.session),
        identitiesCount: data.user?.identities?.length,
      });
      setAuthNotice(message);
      setNotice(message);
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
    const scenario = getFormValue(form, "scenario");
    const setting = getFormValue(form, "setting");
    const continuityMode = (getFormValue(form, "continuityMode") || "canon") as ContinuityMode;
    const chapterLabel = getFormValue(form, "chapterLabel");
    const narrativeArc = getFormValue(form, "narrativeArc");
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
      scenario,
      setting,
      continuity_mode: continuityMode,
      chapter_label: chapterLabel,
      narrative_arc: narrativeArc,
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
          scenario: draft.scenario ?? null,
          setting: draft.setting ?? null,
          continuity_mode: draft.continuity_mode,
          chapter_label: draft.chapter_label ?? null,
          narrative_arc: draft.narrative_arc ?? null,
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

  async function loadCharacterCardFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const source =
        file.type === "image/png" || file.name.toLowerCase().endsWith(".png")
          ? await extractCharacterCardSourceFromPng(file)
          : await file.text();

      if (!source) {
        setNotice("No embedded character card metadata was found in that PNG.");
        event.target.value = "";
        return;
      }

      setCharacterCardInput(source);
      loadCharacterCard(source, file.name);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not load that character card file.");
    } finally {
      event.target.value = "";
    }
  }

  function loadCharacterCard(source = characterCardInput, sourceName?: string) {
    const trimmed = source.trim();

    if (!trimmed) {
      setNotice("Paste or choose a character card first.");
      return;
    }

    const parsedCard = parseCharacterCard(trimmed, sourceName);
    setLoadedCharacterCard(parsedCard);
    setCharacterCardInput(trimmed);
    setUserPersonaDraft(emptyUserPersonaDraft);
    setCopiedPersonaDraft(false);
    setNotice(`Loaded character card${parsedCard.name ? `: ${parsedCard.name}` : ""}.`);
  }

  function clearCharacterCard() {
    setCharacterCardInput("");
    setLoadedCharacterCard(null);
    setUserPersonaDraft(emptyUserPersonaDraft);
    setCopiedPersonaDraft(false);
    setNotice("Cleared character card intake.");
  }

  function updateUserPersonaDraft(field: keyof UserPersonaDraft, value: string) {
    setUserPersonaDraft((current) => ({ ...current, [field]: value }));
  }

  function generateUserPersonaFromCard() {
    if (!loadedCharacterCard) {
      setNotice("Load a character card before generating a user persona draft.");
      return;
    }

    const characterName = loadedCharacterCard.name ?? "{{char}}";
    const scenarioSource =
      loadedCharacterCard.scenario ??
      loadedCharacterCard.firstMessage ??
      loadedCharacterCard.description ??
      "the card's established scenario";
    const tagText = loadedCharacterCard.tags.length
      ? `Relevant card tags: ${loadedCharacterCard.tags.join(", ")}.`
      : "No card tags were imported.";

    setUserPersonaDraft({
      boundaries: [
        "Do not write {{user}}'s thoughts, dialogue, consent, or choices.",
        "{{user}} should reveal personal history through play, not through omniscient preload.",
        `Keep ${characterName}'s established autonomy intact.`,
      ].join("\n"),
      cardFitNotes: [
        `${characterName}'s card already controls: ${compactSentence(
          loadedCharacterCard.description,
          "character definition and behavior",
        )}`,
        loadedCharacterCard.personality
          ? `Personality pressure to fit around: ${loadedCharacterCard.personality}`
          : "",
        tagText,
      ]
        .filter(Boolean)
        .join("\n"),
      connectionToCharacter: `{{user}} belongs in ${characterName}'s orbit because the card scenario gives them a reason to matter without making them automatically special: ${scenarioSource}`,
      displayName: "{{user}}",
      openingAngle: loadedCharacterCard.firstMessage
        ? `Build {{user}} to answer this opener with agency: ${loadedCharacterCard.firstMessage}`
        : `Build {{user}} to enter the scenario with a concrete want, a reason to stay, and a pressure point ${characterName} can notice.`,
      roleInStory: `User player designed to fit ${characterName}'s established card, scenario, and prompt boundaries.`,
      selfConcept:
        "{{user}}'s persona should describe what they believe about themself on page one, not the author's full diagnosis of them.",
      whatUserKnows:
        "List only what {{user}} can honestly know at the start: their own history, what they have observed, what they suspect, and what they are hiding.",
    });
    setNotice(`Generated a user persona draft for ${characterName}.`);
  }

  async function copyUserPersonaDraft() {
    const personaPreview = formatUserPersonaDraft(userPersonaDraft);

    if (!personaPreview.trim()) {
      setNotice("Generate or edit the user persona before copying.");
      return;
    }

    if (!navigator.clipboard) {
      setNotice("Copy is not available in this browser.");
      return;
    }

    try {
      await navigator.clipboard.writeText(personaPreview);
      setCopiedPersonaDraft(true);
      window.setTimeout(() => {
        setCopiedPersonaDraft(false);
      }, 1800);
      setNotice("Copied user persona draft.");
    } catch {
      setNotice("Copy failed. Select the persona preview manually for now.");
    }
  }

  function generatePromptPack() {
    if (!activeCorePack) return;

    const now = new Date().toISOString();
    const promptSlots = buildPlatformPromptSlots({
      activeCorePack,
      platform,
      platformProfile: activePlatformProfile,
      promptModules: promptModuleValues,
    });

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
        included_sections: getIncludedPromptSections(activePlatformProfile, promptModuleValues),
        max_length_preference: "compact",
        selected_tropes: selectedTagLabels,
        selected_characters: characters.map((character) => character.id),
        selected_relationship_threads: activeRelationship ? [activeRelationship.id] : [],
        selected_scene_memories: activeScene ? [activeScene.id] : [],
        selected_secrets_policy: "active_pov_only",
        generated_text: formatPromptSlots({
          platform,
          platformProfile: activePlatformProfile,
          slots: promptSlots,
        }),
        persistence_state: "session",
        created_at: now,
        updated_at: now,
      },
    ]);
    setNotice("Generated a fresh session prompt pack.");
  }

  function clearPromptModule(key: PromptModuleKey) {
    setPromptModuleDrafts((current) => ({ ...current, [key]: "" }));
    setPromptModuleExpanded((current) => ({ ...current, [key]: true }));
  }

  function generatePromptModule(key: PromptModuleKey) {
    setPromptModuleDrafts((current) => ({ ...current, [key]: promptModuleSuggestions[key] }));
    setPromptModuleExpanded((current) => ({ ...current, [key]: true }));
    setNotice(`Generated ${promptModuleSectionLabels[key]}.`);
  }

  function applyWritingStylePreset(presetId: string) {
    const preset =
      availableWritingStylePresets.find((candidate) => candidate.id === presetId) ??
      writingStylePresets[0];

    setActiveWritingStylePresetId(preset.id);
    setPromptModuleDrafts((current) => ({ ...current, ...preset.modules }));
    setPromptModuleExpanded((current) => ({
      ...current,
      styleDialogueVoice: false,
      stylePerspectiveLens: true,
      styleRhythmDensity: false,
      styleSubtextEmotion: false,
      styleToneSensory: false,
    }));
    setNotice(`Applied writing style: ${preset.label}.`);
  }

  function saveCustomWritingStylePreset() {
    const trimmedName = customStyleName.trim();

    if (!trimmedName) {
      setNotice("Name the custom style first.");
      return;
    }

    const preset: WritingStylePreset = {
      description: "Saved for this session from the current writing-style modules.",
      id: `custom-${slugify(trimmedName)}-${Date.now()}`,
      label: trimmedName,
      modules: {
        styleDialogueVoice: promptModuleValues.styleDialogueVoice,
        stylePerspectiveLens: promptModuleValues.stylePerspectiveLens,
        styleRhythmDensity: promptModuleValues.styleRhythmDensity,
        styleSubtextEmotion: promptModuleValues.styleSubtextEmotion,
        styleToneSensory: promptModuleValues.styleToneSensory,
      },
    };

    setCustomWritingStylePresets((current) => [...current, preset]);
    setActiveWritingStylePresetId(preset.id);
    setCustomStyleName("");
    setNotice(`Saved custom style: ${preset.label}.`);
  }

  function setPromptModuleText(key: PromptModuleKey, value: string) {
    setPromptModuleDrafts((current) => ({ ...current, [key]: value }));
  }

  function togglePromptModuleExpanded(key: PromptModuleKey) {
    setPromptModuleExpanded((current) => ({ ...current, [key]: !current[key] }));
  }

  async function copyPromptSlot(slot: PromptSlot) {
    if (!navigator.clipboard) {
      setNotice("Copy is not available in this browser.");
      return;
    }

    try {
      await navigator.clipboard.writeText(slot.body);
      setCopiedSlotId(slot.id);
      setNotice(`Copied ${slot.label}.`);
      window.setTimeout(() => {
        setCopiedSlotId((current) => (current === slot.id ? null : current));
      }, 1800);
    } catch {
      setNotice("Copy failed. Select the text manually for now.");
    }
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
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === activeWorkspaceSection;

                return (
                  <button
                    aria-current={isActive ? "page" : undefined}
                    className={`flex h-10 items-center gap-3 rounded-md px-3 text-left text-sm transition ${
                      isActive
                        ? "bg-zinc-950 text-white"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                    }`}
                    onClick={() => setActiveWorkspaceSection(item.id)}
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

          <div
            className={`grid gap-5 px-5 py-5 xl:px-8 ${
              activeWorkspaceSection === "prompt-packs" || activeWorkspaceSection === "exports"
                ? "xl:grid-cols-1"
                : "xl:grid-cols-[minmax(0,1.25fr)_400px]"
            }`}
          >
            <div className="grid gap-5">
              {activeWorkspaceSection === "character-card" ? (
                <CharacterCardIntakePanel
                  cardInput={characterCardInput}
                  loadedCard={loadedCharacterCard}
                  onChange={setCharacterCardInput}
                  onClear={clearCharacterCard}
                  onFileLoad={(event) => {
                    void loadCharacterCardFile(event);
                  }}
                  onLoad={() => loadCharacterCard()}
                />
              ) : null}

              {activeWorkspaceSection === "user-persona" ? (
                <UserPersonaBuilderPanel
                  copied={copiedPersonaDraft}
                  draft={userPersonaDraft}
                  loadedCard={loadedCharacterCard}
                  onChange={updateUserPersonaDraft}
                  onCopy={() => {
                    void copyUserPersonaDraft();
                  }}
                  onGenerate={generateUserPersonaFromCard}
                />
              ) : null}

              {activeWorkspaceSection === "story" ? (
                <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Story memory counts">
                  {stats.map((stat) => (
                    <article className={`rounded-lg border p-4 ${stat.tone}`} key={stat.label}>
                      <p className="text-sm font-medium">{stat.label}</p>
                      <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
                    </article>
                  ))}
                </section>
              ) : null}

              {activeWorkspaceSection === "participants" || activeWorkspaceSection === "relationships" ? (
                <section className="grid gap-5">
                  {activeWorkspaceSection === "participants" ? (
                    <Panel title="Add Participant" icon={UsersRound}>
                  <form className="grid gap-3" onSubmit={addCharacter}>
                    <Field label="Name" name="name" placeholder="Character name" required />
                    <Field label="Role" name="role" placeholder="AI-controlled character, user player, rival..." />
                    <Field label="Self-belief" name="selfBelief" placeholder="What they believe about themselves" />
                    <TextArea label="Private truth" name="privateTruth" placeholder="Author-known truth, not automatically exported" />
                    <SubmitButton label="Add participant" />
                  </form>
                    </Panel>
                  ) : null}

                  {activeWorkspaceSection === "relationships" ? (
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
                  ) : null}
                </section>
              ) : null}

              {activeWorkspaceSection === "story" || activeWorkspaceSection === "secrets" ? (
                <section className="grid gap-5">
                  {activeWorkspaceSection === "secrets" ? (
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
                  ) : null}

                  {activeWorkspaceSection === "story" ? (
                    <Panel title="Add Current Scene" icon={BookOpenText}>
                  <form className="grid gap-3" onSubmit={addScene}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Title" name="title" placeholder="After the party" />
                      <Field label="Location" name="location" placeholder="Kitchen doorway" />
                    </div>
                    <TextArea label="Scenario" name="scenario" placeholder="The setup or situation the characters are caught inside" />
                    <Field label="Setting" name="setting" placeholder="Location, world context, and situational frame" />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <SelectField
                        label="Continuity"
                        name="continuityMode"
                        optionLabels={continuityModeLabels}
                        options={continuityModeOptions}
                      />
                      <Field label="Chapter" name="chapterLabel" placeholder="Opening, chapter 3, alt opener..." />
                      <Field label="Arc" name="narrativeArc" placeholder="Mutual suspicion, forced proximity..." />
                    </div>
                    <SelectField label="Main participant" name="participant" options={characterOptions(characters)} />
                    <TextArea label="Scene" name="summary" placeholder="What is happening right now" required />
                    <Field label="Continuity flag" name="continuityFlag" placeholder="What must not be forgotten next time" />
                    <SubmitButton label="Add current scene" />
                  </form>
                    </Panel>
                  ) : null}
                </section>
              ) : null}

              {activeWorkspaceSection === "story" ? (
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
              ) : null}

              {activeWorkspaceSection === "story" ||
              activeWorkspaceSection === "participants" ||
              activeWorkspaceSection === "relationships" ||
              activeWorkspaceSection === "secrets" ? (
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
                  <MemoryColumn title="Current scene">
                    <p className="font-semibold text-zinc-950">{activeScene?.title ?? "No scene yet"}</p>
                    <p className="mt-2 leading-6">{activeScene?.summary ?? "Scene tracks what is happening right now in the active exchange."}</p>
                    {activeScene ? (
                      <p className="mt-2 text-xs leading-5 text-zinc-500">
                        {continuityModeLabels[activeScene.continuity_mode]}
                        {activeScene.chapter_label ? ` · ${activeScene.chapter_label}` : ""}
                        {activeScene.narrative_arc ? ` · ${activeScene.narrative_arc}` : ""}
                      </p>
                    ) : null}
                  </MemoryColumn>
                </div>
                </Panel>
              ) : null}
            </div>

            <aside className="grid content-start gap-5">
              {activeWorkspaceSection === "prompt-packs" ? (
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

                  <div className="rounded-md border border-zinc-200 bg-white px-3 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Prompt modules
                    </p>
                    <div className="mt-3 grid gap-5">
                      {promptModuleGroups.map((group) => (
                        <div className="grid gap-3" key={group.label}>
                          <div>
                            <p className="text-sm font-semibold text-zinc-950">{group.label}</p>
                            <p className="mt-1 text-xs leading-5 text-zinc-500">{group.description}</p>
                          </div>
                          {group.label === "Writing style" ? (
                            <div className="grid gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-3">
                              <label className="grid gap-1.5 text-sm">
                                <span className="font-medium text-zinc-700">Style preset</span>
                                <select
                                  className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-zinc-950"
                                  onChange={(event) => setActiveWritingStylePresetId(event.target.value)}
                                  value={activeWritingStylePresetId}
                                >
                                  {availableWritingStylePresets.map((preset) => (
                                    <option key={preset.id} value={preset.id}>
                                      {preset.label}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <p className="text-xs leading-5 text-zinc-500">
                                {
                                  availableWritingStylePresets.find(
                                    (preset) => preset.id === activeWritingStylePresetId,
                                  )?.description
                                }
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  className="flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-800 hover:bg-zinc-100"
                                  onClick={() => applyWritingStylePreset(activeWritingStylePresetId)}
                                  type="button"
                                >
                                  <Sparkles className="size-3.5" aria-hidden="true" />
                                  Apply Style
                                </button>
                                <button
                                  className="flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-800 hover:bg-zinc-100"
                                  onClick={saveCustomWritingStylePreset}
                                  type="button"
                                >
                                  <Save className="size-3.5" aria-hidden="true" />
                                  Save Custom
                                </button>
                              </div>
                              <label className="grid gap-1.5 text-sm">
                                <span className="font-medium text-zinc-700">Custom style name</span>
                                <input
                                  className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-zinc-950"
                                  onChange={(event) => setCustomStyleName(event.target.value)}
                                  placeholder="My smoky slow burn"
                                  value={customStyleName}
                                />
                              </label>
                            </div>
                          ) : null}
                          {promptModuleOptions
                            .filter((option) => option.group === group.label)
                            .map((option) => (
                              <PromptModuleEditor
                                expanded={promptModuleExpanded[option.key]}
                                key={option.key}
                                onChange={(value) => setPromptModuleText(option.key, value)}
                                onClear={() => clearPromptModule(option.key)}
                                onGenerate={() => generatePromptModule(option.key)}
                                onToggle={() => togglePromptModuleExpanded(option.key)}
                                option={option}
                                value={promptModuleValues[option.key]}
                              />
                            ))}
                        </div>
                      ))}
                    </div>
                  </div>

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
              ) : null}

              {activeWorkspaceSection === "exports" ? (
                <JanitorExportPanel
                  copiedSlotId={copiedSlotId}
                  isPending={isPending}
                  isPersisted={isPersisted}
                  latestPromptPack={latestPromptPack}
                  onCopySlot={(slot) => {
                    void copyPromptSlot(slot);
                  }}
                  onGenerate={generatePromptPack}
                  onSave={() => {
                    void saveLatestPromptPack();
                  }}
                  slots={latestPromptSlots}
                />
              ) : null}

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

function getIncludedPromptSections(platformProfile: PlatformProfile, promptModules: PromptModuleText) {
  const optionalSections = new Set(Object.values(promptModuleSectionLabels));
  const baseSections = platformProfile.includedSections.filter((section) => !optionalSections.has(section));
  const enabledSections = promptModuleOptions
    .filter((option) => promptModules[option.key].trim().length > 0)
    .map((option) => promptModuleSectionLabels[option.key]);

  return [...baseSections, ...enabledSections];
}

function getPromptPackSlots(pack: GeneratedPromptPack): PromptSlot[] {
  if (pack.target_platform === "JanitorAI") {
    const globalPrompt = getSectionBody(pack.generated_text, "Global Prompt", "Proxy Prompt");
    const proxyPrompt = getSectionBody(pack.generated_text, "Proxy Prompt");

    if (globalPrompt && proxyPrompt) {
      return [
        {
          id: "janitorai-global-prompt",
          label: "Global Prompt",
          helper: "Paste into JanitorAI's global prompt slot.",
          body: globalPrompt,
        },
        {
          id: "janitorai-proxy-prompt",
          label: "Proxy Prompt",
          helper: "Paste into JanitorAI's proxy prompt slot.",
          body: proxyPrompt,
        },
      ];
    }
  }

  return [
    {
      id: "full-export",
      label: `${pack.target_platform} Export`,
      helper: "Copy the generated pack.",
      body: pack.generated_text,
    },
  ];
}

function getSectionBody(text: string, startLabel: string, endLabel?: string) {
  const startMarker = `[${startLabel}]`;
  const startIndex = text.indexOf(startMarker);
  if (startIndex === -1) return "";

  const bodyStart = startIndex + startMarker.length;
  const endIndex = endLabel ? text.indexOf(`[${endLabel}]`, bodyStart) : -1;
  const rawBody = text.slice(bodyStart, endIndex === -1 ? undefined : endIndex);

  return rawBody.trim();
}

function PromptModuleEditor({
  expanded,
  onChange,
  onClear,
  onGenerate,
  onToggle,
  option,
  value,
}: {
  expanded: boolean;
  onChange: (value: string) => void;
  onClear: () => void;
  onGenerate: () => void;
  onToggle: () => void;
  option: (typeof promptModuleOptions)[number];
  value: string;
}) {
  const isEmpty = value.trim().length === 0;

  return (
    <article className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
      <button
        aria-expanded={expanded}
        className="flex w-full items-start justify-between gap-3 px-3 py-3 text-left"
        onClick={onToggle}
        type="button"
      >
        <span>
          <span className="block text-sm font-semibold text-zinc-950">{option.label}</span>
          <span className="mt-1 block text-xs leading-5 text-zinc-500">
            {option.slot} Prompt · {isEmpty ? "Empty, skipped on export" : option.helper}
          </span>
        </span>
        <span className="rounded bg-white px-2 py-1 text-xs font-medium text-zinc-600">
          {expanded ? "Close" : "Edit"}
        </span>
      </button>

      {expanded ? (
        <div className="grid gap-3 border-t border-zinc-200 bg-white px-3 py-3">
          <textarea
            className="min-h-28 resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 text-zinc-900 outline-none focus:border-zinc-950"
            onChange={(event) => onChange(event.target.value)}
            value={value}
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              className="flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
              onClick={onGenerate}
              type="button"
            >
              <Sparkles className="size-3.5" aria-hidden="true" />
              Generate
            </button>
            <button
              className="flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
              onClick={onClear}
              type="button"
            >
              Clear
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
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
  optionLabels,
  options,
}: {
  label: string;
  name: string;
  optionLabels?: Partial<Record<string, string>>;
  options: { label: string; value: string }[] | string[];
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-zinc-700">{label}</span>
      <select
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-950"
        name={name}
      >
        {options.map((option) => (
          <option
            key={typeof option === "string" ? option : option.value}
            value={typeof option === "string" ? option : option.value}
          >
            {typeof option === "string" ? optionLabels?.[option] ?? displayLabel(option) : option.label}
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

function characterOptions(characters: Character[]) {
  return characters.length
    ? characters.map((character) => ({ label: character.name, value: character.id }))
    : [{ label: "No participants yet", value: "" }];
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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getAuthMessage(auth: StoryMemoryAuthState) {
  return auth.status === "signed_in" ? "Supabase workspace ready." : auth.message;
}
