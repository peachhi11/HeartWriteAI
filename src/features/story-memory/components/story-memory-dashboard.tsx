"use client";

import type { ChangeEvent, FormEvent, MouseEvent, ReactNode } from "react";
import { Children, useMemo, useState, useTransition } from "react";
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
  Trash2,
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
  mapBookshelfRow,
  mapCharacterRow,
  mapLibraryBookRow,
  mapRelationshipThreadRow,
  mapSavedPromptPackRow,
  mapSceneMemoryRow,
  mapSecretRow,
  mapStoryBookBindingRow,
  mapStoryBookRow,
} from "@/features/story-memory/persistence/mappers";
import { saveGeneratedPromptPack } from "@/features/story-memory/persistence/saved-prompt-packs";
import type { StoryMemoryAuthState } from "@/features/story-memory/persistence/workspace";
import type {
  BookType,
  Bookshelf,
  CategoryTag,
  Character,
  ContinuityMode,
  CorePromptPack,
  GeneratedPromptPack,
  HeatLevelLabel,
  LibraryBook,
  PovMode,
  RelationshipThread,
  SceneMemory,
  SecretOrReveal,
  SpiceVisibility,
  Story,
  StoryBook,
  StoryBookBinding,
} from "@/features/story-memory/types/story-memory";
import type { UserPersonaGender } from "@/features/story-memory/types/user-persona";
import { buildUserPersonaDraftFromCard } from "@/features/story-memory/utils/user-persona-draft";
import {
  buildCharacterBookPayload,
  extractCharacterCardSourceFromPng,
  type LoadedCharacterCard,
  parseCharacterCard,
  readCharacterCardFromBookPayload,
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
import type { Json } from "@/lib/supabase/database.types";

type WorkspaceSection =
  | "story"
  | "library"
  | "character-card"
  | "user-persona"
  | "world-book"
  | "scenario-book"
  | "memory-book"
  | "prompt-book"
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
  { id: "world-book", label: "World Book", icon: Layers3 },
  { id: "participants", label: "Participants", icon: UsersRound },
  { id: "relationships", label: "Relationships", icon: Layers3 },
  { id: "secrets", label: "Secrets", icon: LockKeyhole },
  { id: "scenario-book", label: "Scenario Book", icon: BookOpenText },
  { id: "memory-book", label: "Memory Book", icon: Brain },
  { id: "user-persona", label: "User Persona", icon: UsersRound },
  { id: "prompt-book", label: "Prompt Book", icon: MessageSquareText },
  { id: "prompt-packs", label: "Prompt Packs", icon: MessageSquareText },
  { id: "exports", label: "Exports", icon: Download },
  { id: "library", label: "Library", icon: Layers3 },
];

const heatOptions: HeatLevelLabel[] = ["sweet", "sensual", "spicy", "explicit", "extreme"];
const continuityModeOptions: ContinuityMode[] = ["canon", "alt"];
const platformOptions = ["JanitorAI", "SillyTavern", "MarinaraTavern"];

type PromptModuleExpanded = Record<PromptModuleKey, boolean>;
type ScenarioBookDraft = {
  title: string;
  scenario: string;
  currentScene: string;
  setting: string;
  participants: string;
  povMode: string;
  continuityMode: string;
  chapterArc: string;
  recentContext: string;
  activePressure: string;
  unresolvedHooks: string;
  nextBeat: string;
};
type ScenarioBookDraftField = keyof ScenarioBookDraft;

type WorldBookDraft = {
  title: string;
  worldType: string;
  genreSubgenre: string;
  tone: string;
  loreEntries: string;
  triggerPrecedence: string;
  crossReferences: string;
  rules: string;
  locations: string;
  factions: string;
  items: string;
  events: string;
  socialStructure: string;
  sensoryLogic: string;
  contentBoundaries: string;
  continuityNotes: string;
};
type WorldBookDraftField = keyof WorldBookDraft;

type MemoryBookDraft = {
  title: string;
  relationshipHistories: string;
  secrets: string;
  knowledgeBoundaries: string;
  episodicMemory: string;
  revealedFacts: string;
  suspicions: string;
  falseBeliefs: string;
  emotionalContinuity: string;
  triggerRules: string;
};
type MemoryBookDraftField = keyof MemoryBookDraft;

type PromptBookDraft = {
  title: string;
  globalRules: string;
  proxyRules: string;
  platformStack: string;
  povAgencyRules: string;
  heatSpiceRules: string;
  styleModules: string;
  compilerInstructions: string;
  exportNotes: string;
};
type PromptBookDraftField = keyof PromptBookDraft;

const emptyScenarioBookDraft: ScenarioBookDraft = {
  title: "",
  scenario: "",
  currentScene: "",
  setting: "",
  participants: "",
  povMode: "",
  continuityMode: "",
  chapterArc: "",
  recentContext: "",
  activePressure: "",
  unresolvedHooks: "",
  nextBeat: "",
};

const emptyWorldBookDraft: WorldBookDraft = {
  title: "",
  worldType: "",
  genreSubgenre: "",
  tone: "",
  loreEntries: "",
  triggerPrecedence: "",
  crossReferences: "",
  rules: "",
  locations: "",
  factions: "",
  items: "",
  events: "",
  socialStructure: "",
  sensoryLogic: "",
  contentBoundaries: "",
  continuityNotes: "",
};

const emptyMemoryBookDraft: MemoryBookDraft = {
  title: "",
  relationshipHistories: "",
  secrets: "",
  knowledgeBoundaries: "",
  episodicMemory: "",
  revealedFacts: "",
  suspicions: "",
  falseBeliefs: "",
  emotionalContinuity: "",
  triggerRules: "",
};

const emptyPromptBookDraft: PromptBookDraft = {
  title: "",
  globalRules: "",
  proxyRules: "",
  platformStack: "",
  povAgencyRules: "",
  heatSpiceRules: "",
  styleModules: "",
  compilerInstructions: "",
  exportNotes: "",
};

const scenarioBookFields = [
  { field: "title", label: "Scenario Book title", placeholder: "Kieran / {{user}} Active Scenario", compact: true },
  { field: "scenario", label: "Scenario", placeholder: "The setup or situation the characters are caught inside." },
  { field: "currentScene", label: "Current scene", placeholder: "What is happening right now." },
  { field: "setting", label: "Setting", placeholder: "Location, world context, time, social environment." },
  { field: "participants", label: "Participants", placeholder: "Who is present or directly involved." },
  { field: "povMode", label: "POV mode", placeholder: "{{char}} POV, {{user}} POV, narrator/shared POV." },
  { field: "continuityMode", label: "Continuity mode", placeholder: "Canon, alt, chapter, branch, season, arc." },
  { field: "chapterArc", label: "Chapter / arc", placeholder: "Where this scene sits in the larger storyline." },
  { field: "recentContext", label: "Recent context", placeholder: "Relevant recent facts for runtime memory." },
  { field: "activePressure", label: "Active pressure", placeholder: "The romantic, social, sexual, or practical pressure currently increasing." },
  { field: "unresolvedHooks", label: "Unresolved hooks", placeholder: "Loose threads the compiler should keep available." },
  { field: "nextBeat", label: "Next playable beat", placeholder: "The next scene move suggested by current pressure." },
] satisfies { compact?: boolean; field: ScenarioBookDraftField; label: string; placeholder: string }[];

const memoryBookFields = [
  { field: "title", label: "Memory Book title", placeholder: "Kieran / {{user}} Memory", compact: true },
  { field: "relationshipHistories", label: "Relationship histories", placeholder: "How the relationship has changed, with key turning points." },
  { field: "secrets", label: "Secrets", placeholder: "Who knows, who suspects, who hides it, who pretends not to know." },
  { field: "knowledgeBoundaries", label: "Knowledge boundaries", placeholder: "Known facts, private truths, suspicions, rumors, misreads." },
  { field: "episodicMemory", label: "Episodic memory", placeholder: "Scenes, events, aftermath, changed behavior, emotional residue." },
  { field: "revealedFacts", label: "Revealed facts", placeholder: "Facts that entered play on-page." },
  { field: "suspicions", label: "Suspicions", placeholder: "What characters suspect but cannot yet confirm." },
  { field: "falseBeliefs", label: "False beliefs", placeholder: "What a character is wrong about and why it matters." },
  { field: "emotionalContinuity", label: "Emotional continuity", placeholder: "What hurt, softened, escalated, or changed in the relationship." },
  { field: "triggerRules", label: "Trigger rules", placeholder: "When memories should activate and what takes precedence." },
] satisfies { compact?: boolean; field: MemoryBookDraftField; label: string; placeholder: string }[];

const promptBookFields = [
  { field: "title", label: "Prompt Book title", placeholder: "JanitorAI Prompt Book", compact: true },
  { field: "globalRules", label: "Global rules", placeholder: "Stable writing law, POV boundaries, consent logic, style law." },
  { field: "proxyRules", label: "Proxy rules", placeholder: "How to translate saved books into current scene behavior." },
  { field: "platformStack", label: "Platform stack", placeholder: "JanitorAI, SillyTavern, Marinara stack slots and routing." },
  { field: "povAgencyRules", label: "POV / agency rules", placeholder: "What can and cannot be narrated for {{user}}." },
  { field: "heatSpiceRules", label: "Heat / spice rules", placeholder: "Heat label, censored/uncensored behavior, consent boundaries." },
  { field: "styleModules", label: "Style modules", placeholder: "Writing style, voice, sensory logic, rhythm, tone." },
  { field: "compilerInstructions", label: "Compiler instructions", placeholder: "How Character/User/World/Scenario/Memory Books route into final prompt." },
  { field: "exportNotes", label: "Export notes", placeholder: "Platform-specific copy/export notes." },
] satisfies { compact?: boolean; field: PromptBookDraftField; label: string; placeholder: string }[];

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
  storybookOperationalMode: true,
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
    helper: "Proxy context layer that translates the global prompt into the active scene.",
    key: "storybookOperationalMode",
    label: "StoryBook operational mode",
    slot: "Proxy",
  },
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
  storybookOperationalMode: "StoryBook operational mode",
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

const bookTypeLabels: Record<BookType, string> = {
  character_book: "Character Book",
  memory_book: "Memory Book",
  prompt_book: "Prompt Book",
  scenario_book: "Scenario Book",
  user_book: "User Book",
  world_book: "World Book",
};

const requiredStoryBookTypes: BookType[] = [
  "character_book",
  "world_book",
  "scenario_book",
  "memory_book",
  "user_book",
  "prompt_book",
];
const bookTypeOptions = requiredStoryBookTypes;

type StoryMemoryDashboardProps = {
  auth: StoryMemoryAuthState;
  story: Story;
  initialBookshelves: Bookshelf[];
  initialCharacters: Character[];
  initialLibraryBooks: LibraryBook[];
  initialScenes: SceneMemory[];
  initialRelationships: RelationshipThread[];
  initialSecrets: SecretOrReveal[];
  initialPromptPacks: GeneratedPromptPack[];
  initialSelectedTagSlugs: string[];
  initialStoryBookBindings: StoryBookBinding[];
  initialStoryBooks: StoryBook[];
  isPersisted: boolean;
  categoryTags: CategoryTag[];
  corePromptPacks: CorePromptPack[];
};

export function StoryMemoryDashboard({
  auth,
  story,
  initialBookshelves,
  initialCharacters,
  initialLibraryBooks,
  initialScenes,
  initialRelationships,
  initialSecrets,
  initialPromptPacks,
  initialSelectedTagSlugs,
  initialStoryBookBindings,
  initialStoryBooks,
  isPersisted,
  categoryTags,
  corePromptPacks,
}: StoryMemoryDashboardProps) {
  const [isPending, startTransition] = useTransition();
  const initialCharacterCard = getInitialLoadedCharacterCard({
    initialLibraryBooks,
    initialStoryBookBindings,
    initialStoryBooks,
  });
  const initialScenarioBookDraft = getInitialScenarioBookDraft({
    initialLibraryBooks,
    initialStoryBookBindings,
    initialStoryBooks,
  });
  const initialWorldBookDraft = getInitialWorldBookDraft({
    initialLibraryBooks,
    initialStoryBookBindings,
    initialStoryBooks,
  });
  const initialMemoryBookDraft = getInitialMemoryBookDraft({
    initialLibraryBooks,
    initialStoryBookBindings,
    initialStoryBooks,
  });
  const initialPromptBookDraft = getInitialPromptBookDraft({
    initialLibraryBooks,
    initialStoryBookBindings,
    initialStoryBooks,
  });
  const [bookshelves, setBookshelves] = useState(initialBookshelves);
  const [characters, setCharacters] = useState(initialCharacters);
  const [libraryBooks, setLibraryBooks] = useState(initialLibraryBooks);
  const [scenes, setScenes] = useState(initialScenes);
  const [relationships, setRelationships] = useState(initialRelationships);
  const [secrets, setSecrets] = useState(initialSecrets);
  const [storyBookBindings, setStoryBookBindings] = useState(initialStoryBookBindings);
  const [storyBooks, setStoryBooks] = useState(initialStoryBooks);
  const [promptPacks, setPromptPacks] = useState(initialPromptPacks);
  const [heatLevel, setHeatLevel] = useState<HeatLevelLabel>(story.heat_level ?? "spicy");
  const [spiceVisibility, setSpiceVisibility] = useState<SpiceVisibility>("censored");
  const [povMode, setPovMode] = useState<PovMode>(story.default_pov_mode ?? "narrator_pov");
  const [platform, setPlatform] = useState(story.export_targets?.[0] ?? "JanitorAI");
  const [activeWorkspaceSection, setActiveWorkspaceSection] = useState<WorkspaceSection>("story");
  const [characterCardInput, setCharacterCardInput] = useState(initialCharacterCard?.rawText ?? "");
  const [loadedCharacterCard, setLoadedCharacterCard] = useState<LoadedCharacterCard | null>(
    initialCharacterCard,
  );
  const [userPersonaDraft, setUserPersonaDraft] = useState<UserPersonaDraft>(emptyUserPersonaDraft);
  const [userPersonaGender, setUserPersonaGender] = useState<UserPersonaGender>("female");
  const [scenarioBookDraft, setScenarioBookDraft] = useState<ScenarioBookDraft>(initialScenarioBookDraft);
  const [worldBookDraft, setWorldBookDraft] = useState<WorldBookDraft>(initialWorldBookDraft);
  const [memoryBookDraft, setMemoryBookDraft] = useState<MemoryBookDraft>(initialMemoryBookDraft);
  const [promptBookDraft, setPromptBookDraft] = useState<PromptBookDraft>(initialPromptBookDraft);
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

  const activeStoryBook = storyBooks[0];
  const activeStoryBookBookIds = useMemo(
    () =>
      new Set(
        storyBookBindings
          .filter((binding) => binding.storybook_id === activeStoryBook?.id)
          .sort((first, second) => first.sort_order - second.sort_order)
          .map((binding) => binding.book_id),
      ),
    [activeStoryBook?.id, storyBookBindings],
  );
  const activeStoryBookBooks = useMemo(
    () =>
      libraryBooks
        .filter((book) => activeStoryBookBookIds.has(book.id))
        .sort((first, second) => first.sort_order - second.sort_order),
    [activeStoryBookBookIds, libraryBooks],
  );
  const activeStoryBookTypes = new Set(activeStoryBookBooks.map((book) => book.book_type));
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
        storybookPackage: {
          books: activeStoryBookBooks,
          storybook: activeStoryBook,
        },
      }),
    [
      activeRelationship,
      activeScene,
      activeSecret,
      activeStoryBook,
      activeStoryBookBooks,
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

  function signInWithGoogle() {
    if (!supabase) return;

    setAuthNotice("Opening Google sign-in...");

    startTransition(async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        const message = getFriendlyAuthErrorMessage(error.message);
        setAuthNotice(message);
        setNotice(message);
      }
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
    const participants = getSceneParticipantIds(form);
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
      participants,
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

  async function saveCharacterEntry(event: FormEvent<HTMLFormElement>, characterId: string) {
    event.preventDefault();
    const form = event.currentTarget;
    const existing = characters.find((character) => character.id === characterId);
    if (!existing) return;

    const name = getFormValue(form, "name") || existing.name;
    const role = getFormValue(form, "role");
    const selfBelief = getFormValue(form, "selfBelief");
    const privateTruth = getFormValue(form, "privateTruth");
    const updated: Character = {
      ...existing,
      name,
      role,
      public_facts: role ? [`Known role: ${role}`] : [],
      private_truths: privateTruth ? [privateTruth] : [],
      self_beliefs: selfBelief ? [selfBelief] : [],
      updated_at: new Date().toISOString(),
    };

    if (isPersisted && supabase && userId) {
      const { data, error } = await supabase
        .from("characters")
        .update({
          name: updated.name,
          role: updated.role || null,
          public_facts: updated.public_facts,
          private_truths: updated.private_truths,
          self_beliefs: updated.self_beliefs,
          updated_at: updated.updated_at,
        })
        .eq("id", characterId)
        .select()
        .single();

      if (error) {
        setNotice(error.message);
        return;
      }

      setCharacters((current) => replaceById(current, characterId, mapCharacterRow(data)));
    } else {
      setCharacters((current) => replaceById(current, characterId, updated));
    }

    setNotice(`Updated participant: ${name}.`);
  }

  async function deleteCharacterEntry(characterId: string) {
    const character = characters.find((candidate) => candidate.id === characterId);
    if (!character || !window.confirm(`Delete participant "${character.name}"?`)) return;

    if (isPersisted && supabase && userId) {
      const { error } = await supabase.from("characters").delete().eq("id", characterId);
      if (error) {
        setNotice(error.message);
        return;
      }
    }

    setCharacters((current) => removeById(current, characterId));
    setNotice(`Deleted participant: ${character.name}.`);
  }

  async function saveRelationshipEntry(event: FormEvent<HTMLFormElement>, relationshipId: string) {
    event.preventDefault();
    const form = event.currentTarget;
    const existing = relationships.find((relationship) => relationship.id === relationshipId);
    if (!existing) return;

    const first = getFormValue(form, "participantA");
    const second = getFormValue(form, "participantB");
    const dynamic = getFormValue(form, "dynamic") || existing.dynamic_label;
    const updated: RelationshipThread = {
      ...existing,
      participants: [first, second].filter(Boolean),
      dynamic_label: dynamic,
      current_state: getFormValue(form, "state"),
      conflict_notes: getFormValue(form, "conflict"),
      next_pressure_point: getFormValue(form, "nextPressure"),
      updated_at: new Date().toISOString(),
    };

    if (isPersisted && supabase && userId) {
      const { data, error } = await supabase
        .from("relationship_threads")
        .update({
          participants: updated.participants,
          dynamic_label: updated.dynamic_label,
          current_state: updated.current_state || null,
          conflict_notes: updated.conflict_notes || null,
          next_pressure_point: updated.next_pressure_point || null,
          updated_at: updated.updated_at,
        })
        .eq("id", relationshipId)
        .select()
        .single();

      if (error) {
        setNotice(error.message);
        return;
      }

      setRelationships((current) => replaceById(current, relationshipId, mapRelationshipThreadRow(data)));
    } else {
      setRelationships((current) => replaceById(current, relationshipId, updated));
    }

    setNotice(`Updated relationship: ${dynamic}.`);
  }

  async function deleteRelationshipEntry(relationshipId: string) {
    const relationship = relationships.find((candidate) => candidate.id === relationshipId);
    if (!relationship || !window.confirm(`Delete relationship "${relationship.dynamic_label}"?`)) return;

    if (isPersisted && supabase && userId) {
      const { error } = await supabase.from("relationship_threads").delete().eq("id", relationshipId);
      if (error) {
        setNotice(error.message);
        return;
      }
    }

    setRelationships((current) => removeById(current, relationshipId));
    setNotice(`Deleted relationship: ${relationship.dynamic_label}.`);
  }

  async function saveSecretEntry(event: FormEvent<HTMLFormElement>, secretId: string) {
    event.preventDefault();
    const form = event.currentTarget;
    const existing = secrets.find((secret) => secret.id === secretId);
    if (!existing) return;

    const title = getFormValue(form, "title") || "Untitled secret";
    const updated: SecretOrReveal = {
      ...existing,
      title,
      secret_text: getFormValue(form, "secretText") || existing.secret_text,
      who_knows: compactIds([getFormValue(form, "whoKnows")]),
      who_is_hiding_it: compactIds([getFormValue(form, "whoHides")]),
      who_falsely_believes_they_are_safe: compactIds([getFormValue(form, "whoHides")]),
      who_is_pretending_not_to_know: compactIds([getFormValue(form, "whoPretends")]),
      current_pressure: getFormValue(form, "pressure") || "Dormant",
      updated_at: new Date().toISOString(),
    };

    if (isPersisted && supabase && userId) {
      const { data, error } = await supabase
        .from("secrets")
        .update({
          title: updated.title ?? null,
          secret_text: updated.secret_text,
          who_knows: updated.who_knows,
          who_is_hiding_it: updated.who_is_hiding_it,
          who_falsely_believes_they_are_safe: updated.who_falsely_believes_they_are_safe,
          who_is_pretending_not_to_know: updated.who_is_pretending_not_to_know,
          current_pressure: updated.current_pressure ?? null,
          updated_at: updated.updated_at,
        })
        .eq("id", secretId)
        .select()
        .single();

      if (error) {
        setNotice(error.message);
        return;
      }

      setSecrets((current) => replaceById(current, secretId, mapSecretRow(data)));
    } else {
      setSecrets((current) => replaceById(current, secretId, updated));
    }

    setNotice(`Updated secret: ${title}.`);
  }

  async function deleteSecretEntry(secretId: string) {
    const secret = secrets.find((candidate) => candidate.id === secretId);
    if (!secret || !window.confirm(`Delete secret "${secret.title ?? "Untitled secret"}"?`)) return;

    if (isPersisted && supabase && userId) {
      const { error } = await supabase.from("secrets").delete().eq("id", secretId);
      if (error) {
        setNotice(error.message);
        return;
      }
    }

    setSecrets((current) => removeById(current, secretId));
    setNotice(`Deleted secret: ${secret.title ?? "Untitled secret"}.`);
  }

  async function saveSceneEntry(event: FormEvent<HTMLFormElement>, sceneId: string) {
    event.preventDefault();
    const form = event.currentTarget;
    const existing = scenes.find((scene) => scene.id === sceneId);
    if (!existing) return;

    const title = getFormValue(form, "title") || "Untitled scene";
    const updated: SceneMemory = {
      ...existing,
      title,
      location: getFormValue(form, "location"),
      scenario: getFormValue(form, "scenario"),
      setting: getFormValue(form, "setting"),
      continuity_mode: (getFormValue(form, "continuityMode") || "canon") as ContinuityMode,
      chapter_label: getFormValue(form, "chapterLabel"),
      narrative_arc: getFormValue(form, "narrativeArc"),
      participants: getSceneParticipantIds(form),
      summary: getFormValue(form, "summary") || existing.summary,
      continuity_flags: compactIds([getFormValue(form, "continuityFlag")]),
      updated_at: new Date().toISOString(),
    };

    if (isPersisted && supabase && userId) {
      const { data, error } = await supabase
        .from("scene_memories")
        .update({
          title: updated.title ?? null,
          location: updated.location ?? null,
          scenario: updated.scenario ?? null,
          setting: updated.setting ?? null,
          continuity_mode: updated.continuity_mode,
          chapter_label: updated.chapter_label ?? null,
          narrative_arc: updated.narrative_arc ?? null,
          participants: updated.participants,
          summary: updated.summary,
          continuity_flags: updated.continuity_flags,
          updated_at: updated.updated_at,
        })
        .eq("id", sceneId)
        .select()
        .single();

      if (error) {
        setNotice(error.message);
        return;
      }

      setScenes((current) => replaceById(current, sceneId, mapSceneMemoryRow(data)));
    } else {
      setScenes((current) => replaceById(current, sceneId, updated));
    }

    setNotice(`Updated scene: ${title}.`);
  }

  async function deleteSceneEntry(sceneId: string) {
    const scene = scenes.find((candidate) => candidate.id === sceneId);
    if (!scene || !window.confirm(`Delete scene "${scene.title ?? "Untitled scene"}"?`)) return;

    if (isPersisted && supabase && userId) {
      const { error } = await supabase.from("scene_memories").delete().eq("id", sceneId);
      if (error) {
        setNotice(error.message);
        return;
      }
    }

    setScenes((current) => removeById(current, sceneId));
    setNotice(`Deleted scene: ${scene.title ?? "Untitled scene"}.`);
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

  function updateScenarioBookDraft(field: ScenarioBookDraftField, value: string) {
    setScenarioBookDraft((current) => ({ ...current, [field]: value }));
  }

  function updateWorldBookDraft(field: WorldBookDraftField, value: string) {
    setWorldBookDraft((current) => ({ ...current, [field]: value }));
  }

  function updateMemoryBookDraft(field: MemoryBookDraftField, value: string) {
    setMemoryBookDraft((current) => ({ ...current, [field]: value }));
  }

  function updatePromptBookDraft(field: PromptBookDraftField, value: string) {
    setPromptBookDraft((current) => ({ ...current, [field]: value }));
  }

  function generateUserPersonaFromCard() {
    if (!loadedCharacterCard) {
      setNotice("Load a character card before generating a user persona draft.");
      return;
    }

    setUserPersonaDraft(
      buildUserPersonaDraftFromCard(loadedCharacterCard, userPersonaGender, {
        activeCorePack,
        activeRelationship,
        activeScene,
        activeSecret,
        characters,
        selectedTagLabels,
        selectedTagSlugs,
      }),
    );
    setNotice(`Generated a user persona draft for ${loadedCharacterCard.name ?? "{{char}}"}.`);
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

  async function saveLoadedCardAsCharacterBook() {
    if (!loadedCharacterCard) {
      setNotice("Load a character card before saving a Character Book.");
      return;
    }

    await saveActiveStoryBookSourceBook({
      bookType: "character_book",
      description: [
        loadedCharacterCard.format,
        loadedCharacterCard.tags.length ? `Tags: ${loadedCharacterCard.tags.join(", ")}` : "",
        "Raw card snapshot plus parsed character fields.",
      ]
        .filter(Boolean)
        .join(" · "),
      payload: {
        ...buildCharacterBookPayload(loadedCharacterCard),
      },
      sourceEntityId: loadedCharacterCard.name ?? undefined,
      sourceEntityType: "loaded_character_card",
      title: `${loadedCharacterCard.name ?? "{{char}}"} Character Book`,
    });
  }

  async function saveUserPersonaDraftAsUserBook() {
    const personaPreview = formatUserPersonaDraft(userPersonaDraft);

    if (!personaPreview.trim()) {
      setNotice("Generate or edit the user persona before saving a User Book.");
      return;
    }

    await saveActiveStoryBookSourceBook({
      bookType: "user_book",
      description: [
        "Lightweight {{user}} persona model for player-aware prompts and occasional impersonation.",
        loadedCharacterCard?.name ? `Built around ${loadedCharacterCard.name}.` : "",
      ]
        .filter(Boolean)
        .join(" "),
      payload: {
        draft: userPersonaDraft,
        formattedPersona: personaPreview,
        personaGender: userPersonaGender,
        sourceStoryContext: {
          activeRelationshipId: activeRelationship?.id ?? null,
          activeSceneId: activeScene?.id ?? null,
          activeSecretId: activeSecret?.id ?? null,
          participantIds: characters.map((character) => character.id),
          selectedTagLabels,
        },
        sourceCardName: loadedCharacterCard?.name ?? null,
      },
      sourceEntityId: userPersonaDraft.displayName || "{{user}}",
      sourceEntityType: "user_persona_draft",
      title: `${userPersonaDraft.displayName || "{{user}}"} User Book`,
    });
  }

  function generateScenarioBookFromContext() {
    setScenarioBookDraft(
      buildScenarioBookDraftFromContext({
        activeRelationship,
        activeScene,
        activeSecret,
        characters,
        loadedCharacterCard,
        povMode,
        story,
      }),
    );
    setNotice("Generated a Scenario Book draft from the active scene and story context.");
  }

  async function saveScenarioBookDraftAsScenarioBook() {
    const formattedScenarioBook = formatScenarioBookDraft(scenarioBookDraft);

    if (!formattedScenarioBook.trim()) {
      setNotice("Generate or edit the Scenario Book before saving.");
      return;
    }

    await saveActiveStoryBookSourceBook({
      bookType: "scenario_book",
      description: [
        scenarioBookDraft.scenario ? "Scenario setup and current scene context." : "Runtime scenario memory.",
        scenarioBookDraft.chapterArc ? `Arc: ${scenarioBookDraft.chapterArc}.` : "",
      ]
        .filter(Boolean)
        .join(" "),
      payload: {
        draft: scenarioBookDraft,
        formattedScenarioBook,
        sourceStoryContext: {
          activeRelationshipId: activeRelationship?.id ?? null,
          activeSceneId: activeScene?.id ?? null,
          activeSecretId: activeSecret?.id ?? null,
          sourceCardName: loadedCharacterCard?.name ?? null,
        },
      },
      sourceEntityId: activeScene?.id ?? story.id,
      sourceEntityType: "scenario_book_draft",
      title: `${scenarioBookDraft.title || activeStoryBook?.title || "Story"} Scenario Book`,
    });
  }

  function generateWorldBookFromContext() {
    setWorldBookDraft(
      buildWorldBookDraftFromContext({
        activeCorePack,
        activeRelationship,
        activeScene,
        activeSecret,
        characterCard: loadedCharacterCard,
        selectedTagLabels,
        story,
      }),
    );
    setNotice("Generated a World Book draft from the active card and story context.");
  }

  async function saveWorldBookDraftAsWorldBook() {
    const formattedWorldBook = formatWorldBookDraft(worldBookDraft);

    if (!formattedWorldBook.trim()) {
      setNotice("Generate or edit the World Book before saving.");
      return;
    }

    await saveActiveStoryBookSourceBook({
      bookType: "world_book",
      description: [
        worldBookDraft.worldType ? `World type: ${worldBookDraft.worldType}.` : "Semantic world memory.",
        worldBookDraft.genreSubgenre ? `Genre: ${worldBookDraft.genreSubgenre}.` : "",
      ]
        .filter(Boolean)
        .join(" "),
      payload: {
        draft: worldBookDraft,
        formattedWorldBook,
        sourceStoryContext: {
          activeRelationshipId: activeRelationship?.id ?? null,
          activeSceneId: activeScene?.id ?? null,
          activeSecretId: activeSecret?.id ?? null,
          selectedTagLabels,
          sourceCardName: loadedCharacterCard?.name ?? null,
        },
      },
      sourceEntityId: worldBookDraft.title || activeStoryBook?.id || story.id,
      sourceEntityType: "world_book_draft",
      title: `${worldBookDraft.title || activeStoryBook?.title || "Story"} World Book`,
    });
  }

  function generateMemoryBookFromContext() {
    setMemoryBookDraft(
      buildMemoryBookDraftFromContext({
        activeRelationship,
        activeScene,
        activeSecret,
        characters,
        relationships,
        scenes,
        secrets,
        story,
      }),
    );
    setNotice("Generated a Memory Book draft from relationships, secrets, and scenes.");
  }

  async function saveMemoryBookDraftAsMemoryBook() {
    const formattedMemoryBook = formatMemoryBookDraft(memoryBookDraft);

    if (!formattedMemoryBook.trim()) {
      setNotice("Generate or edit the Memory Book before saving.");
      return;
    }

    await saveActiveStoryBookSourceBook({
      bookType: "memory_book",
      description: "Secrets, relationship history, knowledge boundaries, and episodic continuity.",
      payload: {
        draft: memoryBookDraft,
        formattedMemoryBook,
        sourceStoryContext: {
          relationshipIds: relationships.map((relationship) => relationship.id),
          sceneIds: scenes.map((scene) => scene.id),
          secretIds: secrets.map((secret) => secret.id),
        },
      },
      sourceEntityId: activeRelationship?.id ?? activeSecret?.id ?? story.id,
      sourceEntityType: "memory_book_draft",
      title: `${memoryBookDraft.title || activeStoryBook?.title || "Story"} Memory Book`,
    });
  }

  function generatePromptBookFromContext() {
    setPromptBookDraft(
      buildPromptBookDraftFromContext({
        activeCorePack,
        heatLevel,
        platform,
        promptModuleValues,
        spiceVisibility,
        story,
      }),
    );
    setNotice("Generated a Prompt Book draft from platform, POV, heat, and prompt module rules.");
  }

  async function savePromptBookDraftAsPromptBook() {
    const formattedPromptBook = formatPromptBookDraft(promptBookDraft);

    if (!formattedPromptBook.trim()) {
      setNotice("Generate or edit the Prompt Book before saving.");
      return;
    }

    await saveActiveStoryBookSourceBook({
      bookType: "prompt_book",
      description: [
        "Procedural memory for prompt compilation.",
        promptBookDraft.platformStack ? `Platform: ${platform}.` : "",
      ]
        .filter(Boolean)
        .join(" "),
      payload: {
        draft: promptBookDraft,
        formattedPromptBook,
        sourceStoryContext: {
          activeCorePackId: activeCorePack?.id ?? null,
          heatLevel,
          platform,
          spiceVisibility,
        },
      },
      sourceEntityId: activeCorePack?.id ?? story.id,
      sourceEntityType: "prompt_book_draft",
      title: `${promptBookDraft.title || activeStoryBook?.title || "Story"} Prompt Book`,
    });
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
        tailoring_goal: activeStoryBook
          ? `Freshly generated from the active StoryBook package: ${activeStoryBook.title}.`
          : "Freshly generated from the active story memory session.",
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

  async function addBookshelf(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const title = getFormValue(form, "title");
    const description = getFormValue(form, "description");

    if (!title) return;

    const now = new Date().toISOString();
    const draft: Bookshelf = {
      created_at: now,
      description,
      id: makeId("bookshelf"),
      sort_order: bookshelves.length + 1,
      title,
      updated_at: now,
    };

    if (isPersisted && supabase && userId) {
      const { data, error } = await supabase
        .from("bookshelves")
        .insert({
          description: draft.description || null,
          owner_id: userId,
          sort_order: draft.sort_order,
          title: draft.title,
        })
        .select()
        .single();

      if (error) {
        setNotice(error.message);
        return;
      }

      setBookshelves((current) => [...current, mapBookshelfRow(data)]);
    } else {
      setBookshelves((current) => [...current, draft]);
    }

    form.reset();
    setNotice(`Added bookshelf: ${title}.`);
  }

  async function saveBookshelfEntry(event: FormEvent<HTMLFormElement>, bookshelfId: string) {
    event.preventDefault();
    const form = event.currentTarget;
    const existing = bookshelves.find((bookshelf) => bookshelf.id === bookshelfId);
    if (!existing) return;

    const updated: Bookshelf = {
      ...existing,
      description: getFormValue(form, "description"),
      title: getFormValue(form, "title") || existing.title,
      updated_at: new Date().toISOString(),
    };

    if (isPersisted && supabase && userId) {
      const { data, error } = await supabase
        .from("bookshelves")
        .update({
          description: updated.description || null,
          title: updated.title,
          updated_at: updated.updated_at,
        })
        .eq("id", bookshelfId)
        .select()
        .single();

      if (error) {
        setNotice(error.message);
        return;
      }

      setBookshelves((current) => replaceById(current, bookshelfId, mapBookshelfRow(data)));
    } else {
      setBookshelves((current) => replaceById(current, bookshelfId, updated));
    }

    setNotice(`Updated bookshelf: ${updated.title}.`);
  }

  async function deleteBookshelfEntry(bookshelfId: string) {
    const bookshelf = bookshelves.find((candidate) => candidate.id === bookshelfId);
    if (!bookshelf || !window.confirm(`Delete bookshelf "${bookshelf.title}"?`)) return;

    const storyBookIds = new Set(
      storyBooks.filter((storybook) => storybook.bookshelf_id === bookshelfId).map((storybook) => storybook.id),
    );
    const bookIds = new Set(
      libraryBooks.filter((book) => book.bookshelf_id === bookshelfId).map((book) => book.id),
    );

    if (isPersisted && supabase && userId) {
      const { error } = await supabase.from("bookshelves").delete().eq("id", bookshelfId);
      if (error) {
        setNotice(error.message);
        return;
      }
    }

    setBookshelves((current) => removeById(current, bookshelfId));
    setStoryBooks((current) => current.filter((storybook) => storybook.bookshelf_id !== bookshelfId));
    setLibraryBooks((current) => current.filter((book) => book.bookshelf_id !== bookshelfId));
    setStoryBookBindings((current) =>
      current.filter((binding) => !storyBookIds.has(binding.storybook_id) && !bookIds.has(binding.book_id)),
    );
    setNotice(`Deleted bookshelf: ${bookshelf.title}.`);
  }

  async function addStoryBook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const bookshelfId = getFormValue(form, "bookshelfId") || bookshelves[0]?.id;
    const title = getFormValue(form, "title");
    const description = getFormValue(form, "description");

    if (!bookshelfId || !title) return;

    const now = new Date().toISOString();
    const draft: StoryBook = {
      active_story_id: story.id,
      bookshelf_id: bookshelfId,
      created_at: now,
      description,
      id: makeId("storybook"),
      sort_order: storyBooks.length + 1,
      status: "active",
      title,
      updated_at: now,
    };

    if (isPersisted && supabase && userId) {
      const { data, error } = await supabase
        .from("storybooks")
        .insert({
          active_story_id: story.id,
          bookshelf_id: bookshelfId,
          description: draft.description || null,
          owner_id: userId,
          sort_order: draft.sort_order,
          status: draft.status,
          title: draft.title,
        })
        .select()
        .single();

      if (error) {
        setNotice(error.message);
        return;
      }

      setStoryBooks((current) => [...current, mapStoryBookRow(data)]);
    } else {
      setStoryBooks((current) => [...current, draft]);
    }

    form.reset();
    setNotice(`Added StoryBook: ${title}.`);
  }

  async function saveStoryBookEntry(event: FormEvent<HTMLFormElement>, storyBookId: string) {
    event.preventDefault();
    const form = event.currentTarget;
    const existing = storyBooks.find((storybook) => storybook.id === storyBookId);
    if (!existing) return;

    const updated: StoryBook = {
      ...existing,
      bookshelf_id: getFormValue(form, "bookshelfId") || existing.bookshelf_id,
      description: getFormValue(form, "description"),
      title: getFormValue(form, "title") || existing.title,
      updated_at: new Date().toISOString(),
    };

    if (isPersisted && supabase && userId) {
      const { data, error } = await supabase
        .from("storybooks")
        .update({
          bookshelf_id: updated.bookshelf_id,
          description: updated.description || null,
          title: updated.title,
          updated_at: updated.updated_at,
        })
        .eq("id", storyBookId)
        .select()
        .single();

      if (error) {
        setNotice(error.message);
        return;
      }

      setStoryBooks((current) => replaceById(current, storyBookId, mapStoryBookRow(data)));
    } else {
      setStoryBooks((current) => replaceById(current, storyBookId, updated));
    }

    setNotice(`Updated StoryBook: ${updated.title}.`);
  }

  async function deleteStoryBookEntry(storyBookId: string) {
    const storybook = storyBooks.find((candidate) => candidate.id === storyBookId);
    if (!storybook || !window.confirm(`Delete StoryBook "${storybook.title}"?`)) return;

    if (isPersisted && supabase && userId) {
      const { error } = await supabase.from("storybooks").delete().eq("id", storyBookId);
      if (error) {
        setNotice(error.message);
        return;
      }
    }

    setStoryBooks((current) => removeById(current, storyBookId));
    setStoryBookBindings((current) => current.filter((binding) => binding.storybook_id !== storyBookId));
    setNotice(`Deleted StoryBook: ${storybook.title}.`);
  }

  async function saveActiveStoryBookSourceBook({
    bookType,
    description,
    payload,
    sourceEntityId,
    sourceEntityType,
    title,
  }: {
    bookType: BookType;
    description: string;
    payload: Record<string, unknown>;
    sourceEntityId?: string;
    sourceEntityType: string;
    title: string;
  }) {
    if (!activeStoryBook) {
      setNotice("Create a StoryBook before saving a book into it.");
      return;
    }

    const bookshelfId = activeStoryBook.bookshelf_id || bookshelves[0]?.id;
    if (!bookshelfId) {
      setNotice("Create a Bookshelf before saving a book.");
      return;
    }

    const now = new Date().toISOString();
    const jsonPayload = toJsonPayload(payload);
    const existingBook = activeStoryBookBooks.find((book) => book.book_type === bookType);

    if (existingBook) {
      const updated: LibraryBook = {
        ...existingBook,
        bookshelf_id: bookshelfId,
        description,
        payload: jsonPayload,
        source_entity_id: sourceEntityId,
        source_entity_type: sourceEntityType,
        title,
        updated_at: now,
      };

      if (isPersisted && supabase && userId) {
        const { data, error } = await supabase
          .from("library_books")
          .update({
            bookshelf_id: updated.bookshelf_id,
            description: updated.description || null,
            payload: jsonPayload as Json,
            source_entity_id: updated.source_entity_id ?? null,
            source_entity_type: updated.source_entity_type ?? null,
            title: updated.title,
            updated_at: updated.updated_at,
          })
          .eq("id", existingBook.id)
          .select()
          .single();

        if (error) {
          setNotice(error.message);
          return;
        }

        setLibraryBooks((current) => replaceById(current, existingBook.id, mapLibraryBookRow(data)));
      } else {
        setLibraryBooks((current) => replaceById(current, existingBook.id, updated));
      }

      setNotice(`Updated ${bookTypeLabels[bookType]}: ${title}.`);
      return;
    }

    const draft: LibraryBook = {
      book_type: bookType,
      bookshelf_id: bookshelfId,
      created_at: now,
      description,
      id: makeId("book"),
      payload: jsonPayload,
      sort_order: libraryBooks.length + 1,
      source_entity_id: sourceEntityId,
      source_entity_type: sourceEntityType,
      title,
      updated_at: now,
    };

    if (isPersisted && supabase && userId) {
      const { data, error } = await supabase
        .from("library_books")
        .insert({
          book_type: draft.book_type,
          bookshelf_id: draft.bookshelf_id,
          description: draft.description || null,
          owner_id: userId,
          payload: jsonPayload as Json,
          sort_order: draft.sort_order,
          source_entity_id: draft.source_entity_id ?? null,
          source_entity_type: draft.source_entity_type ?? null,
          title: draft.title,
        })
        .select()
        .single();

      if (error) {
        setNotice(error.message);
        return;
      }

      const mappedBook = mapLibraryBookRow(data);
      setLibraryBooks((current) => [...current, mappedBook]);
      await linkLibraryBookToStoryBook(mappedBook);
    } else {
      setLibraryBooks((current) => [...current, draft]);
      await linkLibraryBookToStoryBook(draft);
    }

    setNotice(`Saved ${bookTypeLabels[bookType]}: ${title}.`);
  }

  async function addLibraryBook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const bookshelfId = getFormValue(form, "bookshelfId") || bookshelves[0]?.id;
    const bookType = (getFormValue(form, "bookType") || "memory_book") as BookType;
    const title = getFormValue(form, "title");
    const description = getFormValue(form, "description");

    if (!bookshelfId || !title) return;

    const now = new Date().toISOString();
    const draft: LibraryBook = {
      book_type: bookType,
      bookshelf_id: bookshelfId,
      created_at: now,
      description,
      id: makeId("book"),
      payload: {},
      sort_order: libraryBooks.length + 1,
      title,
      updated_at: now,
    };

    if (isPersisted && supabase && userId) {
      const { data, error } = await supabase
        .from("library_books")
        .insert({
          book_type: draft.book_type,
          bookshelf_id: draft.bookshelf_id,
          description: draft.description || null,
          owner_id: userId,
          payload: {},
          sort_order: draft.sort_order,
          source_entity_id: null,
          source_entity_type: null,
          title: draft.title,
        })
        .select()
        .single();

      if (error) {
        setNotice(error.message);
        return;
      }

      const mappedBook = mapLibraryBookRow(data);
      setLibraryBooks((current) => [...current, mappedBook]);
      await linkLibraryBookToStoryBook(mappedBook);
    } else {
      setLibraryBooks((current) => [...current, draft]);
      void linkLibraryBookToStoryBook(draft);
    }

    form.reset();
    setNotice(`Added ${bookTypeLabels[bookType]}: ${title}.`);
  }

  async function saveLibraryBookEntry(event: FormEvent<HTMLFormElement>, bookId: string) {
    event.preventDefault();
    const form = event.currentTarget;
    const existing = libraryBooks.find((book) => book.id === bookId);
    if (!existing) return;

    const updated: LibraryBook = {
      ...existing,
      book_type: (getFormValue(form, "bookType") || existing.book_type) as BookType,
      bookshelf_id: getFormValue(form, "bookshelfId") || existing.bookshelf_id,
      description: getFormValue(form, "description"),
      title: getFormValue(form, "title") || existing.title,
      updated_at: new Date().toISOString(),
    };

    if (isPersisted && supabase && userId) {
      const { data, error } = await supabase
        .from("library_books")
        .update({
          book_type: updated.book_type,
          bookshelf_id: updated.bookshelf_id,
          description: updated.description || null,
          title: updated.title,
          updated_at: updated.updated_at,
        })
        .eq("id", bookId)
        .select()
        .single();

      if (error) {
        setNotice(error.message);
        return;
      }

      setLibraryBooks((current) => replaceById(current, bookId, mapLibraryBookRow(data)));
    } else {
      setLibraryBooks((current) => replaceById(current, bookId, updated));
    }

    setNotice(`Updated book: ${updated.title}.`);
  }

  async function deleteLibraryBookEntry(bookId: string) {
    const book = libraryBooks.find((candidate) => candidate.id === bookId);
    if (!book || !window.confirm(`Delete book "${book.title}"?`)) return;

    if (isPersisted && supabase && userId) {
      const { error } = await supabase.from("library_books").delete().eq("id", bookId);
      if (error) {
        setNotice(error.message);
        return;
      }
    }

    setLibraryBooks((current) => removeById(current, bookId));
    setStoryBookBindings((current) => current.filter((binding) => binding.book_id !== bookId));
    setNotice(`Deleted book: ${book.title}.`);
  }

  async function linkLibraryBookToStoryBook(book: LibraryBook) {
    if (!activeStoryBook) {
      setNotice("Create a StoryBook before linking books.");
      return;
    }

    const existing = storyBookBindings.find(
      (binding) => binding.storybook_id === activeStoryBook.id && binding.book_id === book.id,
    );
    if (existing) return;

    const now = new Date().toISOString();
    const draft: StoryBookBinding = {
      book_id: book.id,
      created_at: now,
      id: makeId("binding"),
      sort_order: storyBookBindings.length + 1,
      storybook_id: activeStoryBook.id,
      updated_at: now,
    };

    if (isPersisted && supabase && userId) {
      const { data, error } = await supabase
        .from("storybook_book_bindings")
        .insert({
          book_id: book.id,
          owner_id: userId,
          sort_order: draft.sort_order,
          storybook_id: activeStoryBook.id,
        })
        .select()
        .single();

      if (error) {
        setNotice(error.message);
        return;
      }

      setStoryBookBindings((current) => [...current, mapStoryBookBindingRow(data)]);
    } else {
      setStoryBookBindings((current) => [...current, draft]);
    }

    setNotice(`Linked ${book.title} to ${activeStoryBook.title}.`);
  }

  async function unlinkLibraryBookFromStoryBook(bookId: string) {
    if (!activeStoryBook) return;

    const binding = storyBookBindings.find(
      (candidate) => candidate.storybook_id === activeStoryBook.id && candidate.book_id === bookId,
    );
    const book = libraryBooks.find((candidate) => candidate.id === bookId);
    if (!binding) return;

    if (isPersisted && supabase && userId) {
      const { error } = await supabase.from("storybook_book_bindings").delete().eq("id", binding.id);
      if (error) {
        setNotice(error.message);
        return;
      }
    }

    setStoryBookBindings((current) => removeById(current, binding.id));
    setNotice(`Unlinked ${book?.title ?? "book"} from ${activeStoryBook.title}.`);
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
                  <button
                    onClick={signInWithGoogle}
                    className="h-9 rounded-md bg-white px-3 text-sm font-medium text-zinc-800 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isPending || !supabase}
                    type="button"
                  >
                    Continue with Google
                  </button>
                  <div className="flex items-center gap-2 py-1">
                    <span className="h-px flex-1 bg-zinc-200" />
                    <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                      or email
                    </span>
                    <span className="h-px flex-1 bg-zinc-200" />
                  </div>
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
              activeWorkspaceSection === "prompt-packs" ||
              activeWorkspaceSection === "exports" ||
              activeWorkspaceSection === "library"
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
                  onSaveToCharacterBook={() => {
                    void saveLoadedCardAsCharacterBook();
                  }}
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
                  onPersonaGenderChange={setUserPersonaGender}
                  onSaveToUserBook={() => {
                    void saveUserPersonaDraftAsUserBook();
                  }}
                  personaGender={userPersonaGender}
                />
              ) : null}

              {activeWorkspaceSection === "world-book" ? (
                <WorldBookBuilderPanel
                  draft={worldBookDraft}
                  onChange={(field, value) => updateWorldBookDraft(field as WorldBookDraftField, value)}
                  onGenerate={generateWorldBookFromContext}
                  onSave={() => {
                    void saveWorldBookDraftAsWorldBook();
                  }}
                />
              ) : null}

              {activeWorkspaceSection === "scenario-book" ? (
                <StructuredBookBuilderPanel
                  description="Runtime context for the active setup, current scene, chapter or alt branch, active pressure, and next playable beat."
                  draft={scenarioBookDraft}
                  fields={scenarioBookFields}
                  icon={BookOpenText}
                  onChange={(field, value) => updateScenarioBookDraft(field as ScenarioBookDraftField, value)}
                  onGenerate={generateScenarioBookFromContext}
                  onSave={() => {
                    void saveScenarioBookDraftAsScenarioBook();
                  }}
                  preview={formatScenarioBookDraft(scenarioBookDraft)}
                  saveLabel="Save as Scenario Book"
                  title="Scenario Book Builder"
                />
              ) : null}

              {activeWorkspaceSection === "memory-book" ? (
                <StructuredBookBuilderPanel
                  description="Continuity memory for relationship history, secrets, knowledge boundaries, suspected facts, false beliefs, and episodic memory."
                  draft={memoryBookDraft}
                  fields={memoryBookFields}
                  icon={Brain}
                  onChange={(field, value) => updateMemoryBookDraft(field as MemoryBookDraftField, value)}
                  onGenerate={generateMemoryBookFromContext}
                  onSave={() => {
                    void saveMemoryBookDraftAsMemoryBook();
                  }}
                  preview={formatMemoryBookDraft(memoryBookDraft)}
                  saveLabel="Save as Memory Book"
                  title="Memory Book Builder"
                />
              ) : null}

              {activeWorkspaceSection === "prompt-book" ? (
                <StructuredBookBuilderPanel
                  description="Procedural memory for how the compiler should route StoryBook data into platform-aware prompt stacks."
                  draft={promptBookDraft}
                  fields={promptBookFields}
                  icon={MessageSquareText}
                  onChange={(field, value) => updatePromptBookDraft(field as PromptBookDraftField, value)}
                  onGenerate={generatePromptBookFromContext}
                  onSave={() => {
                    void savePromptBookDraftAsPromptBook();
                  }}
                  preview={formatPromptBookDraft(promptBookDraft)}
                  saveLabel="Save as Prompt Book"
                  title="Prompt Book Builder"
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

              {activeWorkspaceSection === "library" ? (
                <section className="grid gap-5">
                  <Panel title="Bookshelves" icon={BookOpenText}>
                    <div className="grid gap-4">
                      <form className="grid gap-3" onSubmit={addBookshelf}>
                        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
                          <Field label="Shelf name" name="title" placeholder="Active Romance Builds" required />
                          <Field
                            label="Description"
                            name="description"
                            placeholder="Working StoryBooks that should stay packaged together"
                          />
                        </div>
                        <SubmitButton label="Add bookshelf" />
                      </form>

                      <EditableList emptyText="No bookshelves yet.">
                        {bookshelves.map((bookshelf) => {
                          const shelfStoryBooks = storyBooks.filter(
                            (candidate) => candidate.bookshelf_id === bookshelf.id,
                          );
                          const shelfBooks = libraryBooks.filter(
                            (book) => book.bookshelf_id === bookshelf.id,
                          );

                          return (
                            <EditableItem
                              key={bookshelf.id}
                              onDelete={() => {
                                void deleteBookshelfEntry(bookshelf.id);
                              }}
                              title={`${bookshelf.title} · ${shelfStoryBooks.length} StoryBooks · ${shelfBooks.length} Books`}
                            >
                              <form
                                className="grid gap-3"
                                onSubmit={(event) => void saveBookshelfEntry(event, bookshelf.id)}
                              >
                                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
                                  <Field
                                    defaultValue={bookshelf.title}
                                    label="Shelf name"
                                    name="title"
                                    placeholder="Active Romance Builds"
                                    required
                                  />
                                  <Field
                                    defaultValue={bookshelf.description ?? ""}
                                    label="Description"
                                    name="description"
                                    placeholder="Working StoryBooks that should stay packaged together"
                                  />
                                </div>
                                <SaveInlineButton label="Save bookshelf" />
                              </form>
                            </EditableItem>
                          );
                        })}
                      </EditableList>
                    </div>
                  </Panel>

                  <Panel title="StoryBooks" icon={Layers3}>
                    <div className="grid gap-4">
                      <form className="grid gap-3" onSubmit={addStoryBook}>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <SelectField
                            label="Bookshelf"
                            name="bookshelfId"
                            options={bookshelfOptions(bookshelves)}
                          />
                          <Field label="StoryBook name" name="title" placeholder="{{char}} / {{user}} StoryBook" required />
                        </div>
                        <Field
                          label="Description"
                          name="description"
                          placeholder="The character/user/scenario package for this storyline"
                        />
                        <SubmitButton label="Add StoryBook" />
                      </form>

                      <EditableList emptyText="No StoryBooks yet.">
                        {storyBooks.map((storybook) => {
                          const boundBooks = storyBookBindings.filter(
                            (binding) => binding.storybook_id === storybook.id,
                          );

                          return (
                            <EditableItem
                              key={storybook.id}
                              onDelete={() => {
                                void deleteStoryBookEntry(storybook.id);
                              }}
                              title={`${storybook.title} · ${boundBooks.length} linked books`}
                            >
                              <form
                                className="grid gap-3"
                                onSubmit={(event) => void saveStoryBookEntry(event, storybook.id)}
                              >
                                <div className="grid gap-3 sm:grid-cols-2">
                                  <SelectField
                                    defaultValue={storybook.bookshelf_id}
                                    label="Bookshelf"
                                    name="bookshelfId"
                                    options={bookshelfOptions(bookshelves)}
                                  />
                                  <Field
                                    defaultValue={storybook.title}
                                    label="StoryBook name"
                                    name="title"
                                    placeholder="{{char}} / {{user}} StoryBook"
                                    required
                                  />
                                </div>
                                <Field
                                  defaultValue={storybook.description ?? ""}
                                  label="Description"
                                  name="description"
                                  placeholder="The character/user/scenario package for this storyline"
                                />
                                <SaveInlineButton label="Save StoryBook" />
                              </form>
                            </EditableItem>
                          );
                        })}
                      </EditableList>
                    </div>
                  </Panel>

                  <Panel title="Book Library" icon={BookOpenText}>
                    <div className="grid gap-4">
                      <form className="grid gap-3" onSubmit={addLibraryBook}>
                        <div className="grid gap-3 sm:grid-cols-3">
                          <SelectField
                            label="Bookshelf"
                            name="bookshelfId"
                            options={bookshelfOptions(bookshelves)}
                          />
                          <SelectField
                            label="Book type"
                            name="bookType"
                            optionLabels={bookTypeLabels}
                            options={bookTypeOptions}
                          />
                          <Field label="Book name" name="title" placeholder="Character Book" required />
                        </div>
                        <Field
                          label="Description"
                          name="description"
                          placeholder="What this book stores for the StoryBook"
                        />
                        <SubmitButton label="Add book" />
                      </form>

                      <EditableList emptyText="No books yet.">
                        {libraryBooks.map((book) => {
                          const isLinked = Boolean(
                            activeStoryBookBookIds.has(book.id) && activeStoryBook,
                          );

                          return (
                            <EditableItem
                              key={book.id}
                              onDelete={() => {
                                void deleteLibraryBookEntry(book.id);
                              }}
                              title={`${book.title} · ${bookTypeLabels[book.book_type]}`}
                            >
                              <form
                                className="grid gap-3"
                                onSubmit={(event) => void saveLibraryBookEntry(event, book.id)}
                              >
                                <div className="grid gap-3 sm:grid-cols-3">
                                  <SelectField
                                    defaultValue={book.bookshelf_id}
                                    label="Bookshelf"
                                    name="bookshelfId"
                                    options={bookshelfOptions(bookshelves)}
                                  />
                                  <SelectField
                                    defaultValue={book.book_type}
                                    label="Book type"
                                    name="bookType"
                                    optionLabels={bookTypeLabels}
                                    options={bookTypeOptions}
                                  />
                                  <Field
                                    defaultValue={book.title}
                                    label="Book name"
                                    name="title"
                                    placeholder="Character Book"
                                    required
                                  />
                                </div>
                                <Field
                                  defaultValue={book.description ?? ""}
                                  label="Description"
                                  name="description"
                                  placeholder="What this book stores for the StoryBook"
                                />
                                <div className="grid gap-2 sm:grid-cols-2">
                                  <SaveInlineButton label="Save book" />
                                  <button
                                    className="flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                                    disabled={!activeStoryBook}
                                    onClick={() => {
                                      if (isLinked) {
                                        void unlinkLibraryBookFromStoryBook(book.id);
                                      } else {
                                        void linkLibraryBookToStoryBook(book);
                                      }
                                    }}
                                    type="button"
                                  >
                                    {isLinked ? "Unlink from active StoryBook" : "Link to active StoryBook"}
                                  </button>
                                </div>
                              </form>
                            </EditableItem>
                          );
                        })}
                      </EditableList>
                    </div>
                  </Panel>

                  <Panel title="StoryBook Stack" icon={BookOpenText}>
                    <div className="grid gap-4">
                      <div>
                        <p className="text-sm font-semibold text-zinc-950">
                          {activeStoryBook?.title ?? "No StoryBook selected"}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-zinc-600">
                          Character Books, User Books, Scenario Books, World Books, Memory Books,
                          and Prompt Books combine into one isolated story package.
                        </p>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        {requiredStoryBookTypes.map((bookType) => {
                          const book = activeStoryBookBooks.find(
                            (candidate) => candidate.book_type === bookType,
                          );

                          return (
                            <LibraryBookCard
                              book={book}
                              isPresent={activeStoryBookTypes.has(bookType)}
                              key={bookType}
                              label={bookTypeLabels[bookType]}
                              onUnlink={
                                book
                                  ? () => {
                                      void unlinkLibraryBookFromStoryBook(book.id);
                                    }
                                  : undefined
                              }
                            />
                          );
                        })}
                      </div>
                    </div>
                  </Panel>
                </section>
              ) : null}

              {activeWorkspaceSection === "participants" || activeWorkspaceSection === "relationships" ? (
                <section className="grid gap-5">
                  {activeWorkspaceSection === "participants" ? (
                    <Panel title="Add Participant" icon={UsersRound}>
                  <form className="grid gap-3" onSubmit={addCharacter}>
                    <Field label="Name" name="name" placeholder="Character name" required />
                    <Field label="Role" name="role" placeholder="AI-controlled character, NPC, user player, rival..." />
                    <Field label="Self-belief" name="selfBelief" placeholder="What they believe about themselves" />
                    <TextArea label="Private truth" name="privateTruth" placeholder="Author-known truth, not automatically exported" />
                    <SubmitButton label="Add participant" />
                  </form>
                    </Panel>
                  ) : null}

                  {activeWorkspaceSection === "participants" ? (
                    <Panel title="Participants" icon={UsersRound}>
                      <EditableList emptyText="No participants yet.">
                        {characters.map((character) => (
                          <EditableItem
                            key={character.id}
                            title={character.name}
                            onDelete={() => {
                              void deleteCharacterEntry(character.id);
                            }}
                          >
                            <form className="grid gap-3" onSubmit={(event) => void saveCharacterEntry(event, character.id)}>
                              <div className="grid gap-3 sm:grid-cols-2">
                                <Field defaultValue={character.name} label="Name" name="name" placeholder="Character name" required />
                                <Field defaultValue={character.role ?? ""} label="Role" name="role" placeholder="AI-controlled character, NPC, user player, rival..." />
                              </div>
                              <Field
                                defaultValue={character.self_beliefs[0] ?? ""}
                                label="Self-belief"
                                name="selfBelief"
                                placeholder="What they believe about themselves"
                              />
                              <TextArea
                                defaultValue={character.private_truths[0] ?? ""}
                                label="Private truth"
                                name="privateTruth"
                                placeholder="Author-known truth, not automatically exported"
                              />
                              <SaveInlineButton label="Save participant" />
                            </form>
                          </EditableItem>
                        ))}
                      </EditableList>
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

                  {activeWorkspaceSection === "relationships" ? (
                    <Panel title="Relationships" icon={Layers3}>
                      <EditableList emptyText="No relationship threads yet.">
                        {relationships.map((relationship) => (
                          <EditableItem
                            key={relationship.id}
                            title={relationship.dynamic_label}
                            onDelete={() => {
                              void deleteRelationshipEntry(relationship.id);
                            }}
                          >
                            <form className="grid gap-3" onSubmit={(event) => void saveRelationshipEntry(event, relationship.id)}>
                              <div className="grid gap-3 sm:grid-cols-2">
                                <SelectField
                                  defaultValue={relationship.participants[0] ?? ""}
                                  label="First participant"
                                  name="participantA"
                                  options={characterOptions(characters)}
                                />
                                <SelectField
                                  defaultValue={relationship.participants[1] ?? ""}
                                  label="Second participant"
                                  name="participantB"
                                  options={characterOptions(characters)}
                                />
                              </div>
                              <Field defaultValue={relationship.dynamic_label} label="Dynamic" name="dynamic" placeholder="Situationship, FWB, enemies to lovers..." required />
                              <TextArea defaultValue={relationship.current_state ?? ""} label="Current state" name="state" placeholder="What is true between them right now" />
                              <TextArea defaultValue={relationship.conflict_notes ?? ""} label="Conflict" name="conflict" placeholder="What keeps them from being honest" />
                              <Field defaultValue={relationship.next_pressure_point ?? ""} label="Next pressure point" name="nextPressure" placeholder="Force proximity, overheard secret..." />
                              <SaveInlineButton label="Save relationship" />
                            </form>
                          </EditableItem>
                        ))}
                      </EditableList>
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

                  {activeWorkspaceSection === "secrets" ? (
                    <Panel title="Secrets" icon={KeyRound}>
                      <EditableList emptyText="No secrets yet.">
                        {secrets.map((secret) => (
                          <EditableItem
                            key={secret.id}
                            title={secret.title ?? "Untitled secret"}
                            onDelete={() => {
                              void deleteSecretEntry(secret.id);
                            }}
                          >
                            <form className="grid gap-3" onSubmit={(event) => void saveSecretEntry(event, secret.id)}>
                              <Field defaultValue={secret.title ?? ""} label="Title" name="title" placeholder="The secret leverage" />
                              <TextArea defaultValue={secret.secret_text} label="Secret" name="secretText" placeholder="Who believes what, who is wrong, who is pretending" required />
                              <div className="grid gap-3 sm:grid-cols-3">
                                <SelectField defaultValue={secret.who_knows[0] ?? ""} label="Knows" name="whoKnows" options={characterOptions(characters)} />
                                <SelectField defaultValue={secret.who_is_hiding_it[0] ?? ""} label="Hiding it" name="whoHides" options={characterOptions(characters)} />
                                <SelectField defaultValue={secret.who_is_pretending_not_to_know[0] ?? ""} label="Pretending" name="whoPretends" options={characterOptions(characters)} />
                              </div>
                              <Field defaultValue={secret.current_pressure ?? ""} label="Pressure" name="pressure" placeholder="Dormant, rising, dangerous..." />
                              <SaveInlineButton label="Save secret" />
                            </form>
                          </EditableItem>
                        ))}
                      </EditableList>
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
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <SelectField label="Primary participant" name="participantPrimary" options={characterOptions(characters)} />
                      <SelectField label="NPC / extra 1" name="participantExtraA" options={optionalCharacterOptions(characters)} />
                      <SelectField label="NPC / extra 2" name="participantExtraB" options={optionalCharacterOptions(characters)} />
                      <SelectField label="NPC / extra 3" name="participantExtraC" options={optionalCharacterOptions(characters)} />
                    </div>
                    <TextArea label="Scene" name="summary" placeholder="What is happening right now" required />
                    <Field label="Continuity flag" name="continuityFlag" placeholder="What must not be forgotten next time" />
                    <SubmitButton label="Add current scene" />
                  </form>
                    </Panel>
                  ) : null}

                  {activeWorkspaceSection === "story" ? (
                    <Panel title="Scenes" icon={BookOpenText}>
                      <EditableList emptyText="No scenes yet.">
                        {scenes.map((scene) => (
                          <EditableItem
                            key={scene.id}
                            title={scene.title ?? "Untitled scene"}
                            onDelete={() => {
                              void deleteSceneEntry(scene.id);
                            }}
                          >
                            <form className="grid gap-3" onSubmit={(event) => void saveSceneEntry(event, scene.id)}>
                              <div className="grid gap-3 sm:grid-cols-2">
                                <Field defaultValue={scene.title ?? ""} label="Title" name="title" placeholder="After the party" />
                                <Field defaultValue={scene.location ?? ""} label="Location" name="location" placeholder="Kitchen doorway" />
                              </div>
                              <TextArea defaultValue={scene.scenario ?? ""} label="Scenario" name="scenario" placeholder="The setup or situation the characters are caught inside" />
                              <Field defaultValue={scene.setting ?? ""} label="Setting" name="setting" placeholder="Location, world context, and situational frame" />
                              <div className="grid gap-3 sm:grid-cols-3">
                                <SelectField
                                  defaultValue={scene.continuity_mode}
                                  label="Continuity"
                                  name="continuityMode"
                                  optionLabels={continuityModeLabels}
                                  options={continuityModeOptions}
                                />
                                <Field defaultValue={scene.chapter_label ?? ""} label="Chapter" name="chapterLabel" placeholder="Opening, chapter 3, alt opener..." />
                                <Field defaultValue={scene.narrative_arc ?? ""} label="Arc" name="narrativeArc" placeholder="Mutual suspicion, forced proximity..." />
                              </div>
                              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                <SelectField
                                  defaultValue={scene.participants[0] ?? ""}
                                  label="Primary participant"
                                  name="participantPrimary"
                                  options={characterOptions(characters)}
                                />
                                <SelectField
                                  defaultValue={scene.participants[1] ?? ""}
                                  label="NPC / extra 1"
                                  name="participantExtraA"
                                  options={optionalCharacterOptions(characters)}
                                />
                                <SelectField
                                  defaultValue={scene.participants[2] ?? ""}
                                  label="NPC / extra 2"
                                  name="participantExtraB"
                                  options={optionalCharacterOptions(characters)}
                                />
                                <SelectField
                                  defaultValue={scene.participants[3] ?? ""}
                                  label="NPC / extra 3"
                                  name="participantExtraC"
                                  options={optionalCharacterOptions(characters)}
                                />
                              </div>
                              <TextArea defaultValue={scene.summary} label="Scene" name="summary" placeholder="What is happening right now" required />
                              <Field defaultValue={scene.continuity_flags[0] ?? ""} label="Continuity flag" name="continuityFlag" placeholder="What must not be forgotten next time" />
                              <SaveInlineButton label="Save scene" />
                            </form>
                          </EditableItem>
                        ))}
                      </EditableList>
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
              activeWorkspaceSection === "user-persona" ||
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
                      <div className="mt-2 grid gap-1 text-xs leading-5 text-zinc-500">
                        <p>
                          {continuityModeLabels[activeScene.continuity_mode]}
                          {activeScene.chapter_label ? ` · ${activeScene.chapter_label}` : ""}
                          {activeScene.narrative_arc ? ` · ${activeScene.narrative_arc}` : ""}
                        </p>
                        {activeScene.participants.length ? (
                          <p>Participants: {formatParticipantNames(activeScene.participants, characters)}</p>
                        ) : null}
                      </div>
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

function StructuredBookBuilderPanel({
  description,
  draft,
  fields,
  icon,
  onChange,
  onGenerate,
  onSave,
  preview,
  saveLabel,
  title,
}: {
  description: string;
  draft: Record<string, string>;
  fields: { compact?: boolean; field: string; label: string; placeholder: string }[];
  icon: LucideIcon;
  onChange: (field: string, value: string) => void;
  onGenerate: () => void;
  onSave: () => void;
  preview: string;
  saveLabel: string;
  title: string;
}) {
  return (
    <Panel title={title} icon={icon}>
      <div className="grid gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-2xl text-sm leading-6 text-zinc-600">{description}</p>
          <div className="flex gap-2">
            <button
              className="flex h-9 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              onClick={onGenerate}
              type="button"
            >
              <Sparkles className="size-4" aria-hidden="true" />
              Generate
            </button>
            <button
              className="flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-800"
              onClick={onSave}
              type="button"
            >
              <Save className="size-4" aria-hidden="true" />
              {saveLabel}
            </button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {fields.map((field) =>
            field.compact ? (
              <WorldBookInput
                field={field.field}
                key={field.field}
                label={field.label}
                onChange={onChange}
                placeholder={field.placeholder}
                value={draft[field.field] ?? ""}
              />
            ) : (
              <WorldBookTextArea
                field={field.field}
                key={field.field}
                label={field.label}
                onChange={onChange}
                placeholder={field.placeholder}
                value={draft[field.field] ?? ""}
              />
            ),
          )}
        </div>

        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-sm font-semibold text-zinc-950">Preview</p>
          <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded-md bg-white p-3 text-xs leading-5 text-zinc-700">
            {preview || `[${title}]`}
          </pre>
        </div>
      </div>
    </Panel>
  );
}

function WorldBookBuilderPanel({
  draft,
  onChange,
  onGenerate,
  onSave,
}: {
  draft: WorldBookDraft;
  onChange: (field: string, value: string) => void;
  onGenerate: () => void;
  onSave: () => void;
}) {
  const preview = formatWorldBookDraft(draft);

  return (
    <Panel title="World Book Builder" icon={Layers3}>
      <div className="grid gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-2xl text-sm leading-6 text-zinc-600">
            Build semantic memory for the StoryBook: world type, rules, locations, factions,
            objects, events, and genre logic that should remain stable across scenes.
          </p>
          <div className="flex gap-2">
            <button
              className="flex h-9 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              onClick={onGenerate}
              type="button"
            >
              <Sparkles className="size-4" aria-hidden="true" />
              Generate
            </button>
            <button
              className="flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-800"
              onClick={onSave}
              type="button"
            >
              <Save className="size-4" aria-hidden="true" />
              Save as World Book
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <WorldBookInput
            field="title"
            label="World Book title"
            onChange={onChange}
            placeholder="Kieran Omegaverse Household"
            value={draft.title}
          />
          <WorldBookInput
            field="worldType"
            label="World type"
            onChange={onChange}
            placeholder="Omegaverse, contemporary university, supernatural court..."
            value={draft.worldType}
          />
          <WorldBookInput
            field="genreSubgenre"
            label="Genre / subgenre"
            onChange={onChange}
            placeholder="Forbidden omegaverse romance, dark academia, mafia romance..."
            value={draft.genreSubgenre}
          />
          <WorldBookInput
            field="tone"
            label="Tone"
            onChange={onChange}
            placeholder="Tense, intimate, domestic, taboo-aware, emotionally restrained..."
            value={draft.tone}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <WorldBookTextArea
            field="loreEntries"
            label="Modular lore entries"
            onChange={onChange}
            placeholder="Section/type, keys, content, metadata, and linked entities for each meaningful world entity."
            value={draft.loreEntries}
          />
          <WorldBookTextArea
            field="triggerPrecedence"
            label="Trigger precedence"
            onChange={onChange}
            placeholder="Which entries win when multiple triggers activate; priority, frequency, cooldown, conditions."
            value={draft.triggerPrecedence}
          />
          <WorldBookTextArea
            field="crossReferences"
            label="Cross-references"
            onChange={onChange}
            placeholder="How characters, locations, factions, items, events, emotional states, and triggers link."
            value={draft.crossReferences}
          />
          <WorldBookTextArea
            field="rules"
            label="Rules"
            onChange={onChange}
            placeholder="Biology, magic, social laws, household rules, what can and cannot happen casually."
            value={draft.rules}
          />
          <WorldBookTextArea
            field="locations"
            label="Locations"
            onChange={onChange}
            placeholder="Home, campus, bedrooms, kitchen, pack clinic, lecture hall, neutral ground."
            value={draft.locations}
          />
          <WorldBookTextArea
            field="factions"
            label="Factions"
            onChange={onChange}
            placeholder="Family, university peers, pack structure, rivals, authority figures, friend groups."
            value={draft.factions}
          />
          <WorldBookTextArea
            field="items"
            label="Items"
            onChange={onChange}
            placeholder="Suppressants, scent blockers, shared keys, class notes, keepsakes, phones."
            value={draft.items}
          />
          <WorldBookTextArea
            field="events"
            label="Events"
            onChange={onChange}
            placeholder="Heat cycles, semester deadlines, family dinners, parties, exposure risks."
            value={draft.events}
          />
          <WorldBookTextArea
            field="socialStructure"
            label="Social structure"
            onChange={onChange}
            placeholder="Status, family expectations, hierarchy, taboo pressure, reputation stakes."
            value={draft.socialStructure}
          />
          <WorldBookTextArea
            field="sensoryLogic"
            label="Sensory logic"
            onChange={onChange}
            placeholder="Scent, proximity, privacy, weather, texture, sound bleed, biological tells."
            value={draft.sensoryLogic}
          />
          <WorldBookTextArea
            field="contentBoundaries"
            label="Content boundaries"
            onChange={onChange}
            placeholder="Consenting adults only, no omniscient leakage, rules for taboo/social consequence."
            value={draft.contentBoundaries}
          />
        </div>

        <WorldBookTextArea
          field="continuityNotes"
          label="Continuity notes"
          onChange={onChange}
          placeholder="What must remain true unless changed on-page."
          value={draft.continuityNotes}
        />

        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-sm font-semibold text-zinc-950">World Book Preview</p>
          <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded-md bg-white p-3 text-xs leading-5 text-zinc-700">
            {preview || "[World Book]"}
          </pre>
        </div>
      </div>
    </Panel>
  );
}

function WorldBookInput({
  field,
  label,
  onChange,
  placeholder,
  value,
}: {
  field: string;
  label: string;
  onChange: (field: string, value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-zinc-700">{label}</span>
      <input
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-950"
        onChange={(event) => onChange(field, event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}

function WorldBookTextArea({
  field,
  label,
  onChange,
  placeholder,
  value,
}: {
  field: string;
  label: string;
  onChange: (field: string, value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-zinc-700">{label}</span>
      <textarea
        className="min-h-28 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-zinc-950"
        onChange={(event) => onChange(field, event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
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

function LibraryBookCard({
  book,
  isPresent,
  label,
  onUnlink,
}: {
  book?: LibraryBook;
  isPresent: boolean;
  label: string;
  onUnlink?: () => void;
}) {
  return (
    <article
      className={`rounded-lg border p-4 ${
        isPresent ? "border-zinc-200 bg-zinc-50" : "border-dashed border-zinc-300 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-zinc-950">{book?.title ?? label}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
        </div>
        <span
          className={`rounded px-2 py-1 text-xs font-medium ${
            isPresent ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"
          }`}
        >
          {isPresent ? "Linked" : "Empty"}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        {book?.description ?? "Ready for this StoryBook, but no saved book has been linked yet."}
      </p>
      {book && onUnlink ? (
        <button
          className="mt-3 h-8 rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
          onClick={onUnlink}
          type="button"
        >
          Unlink
        </button>
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
  defaultValue,
  label,
  name,
  placeholder,
  required,
}: {
  defaultValue?: string;
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
        defaultValue={defaultValue}
        name={name}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

function TextArea({
  defaultValue,
  label,
  name,
  placeholder,
  required,
}: {
  defaultValue?: string;
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
        defaultValue={defaultValue}
        name={name}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

function SelectField({
  defaultValue,
  label,
  name,
  optionLabels,
  options,
}: {
  defaultValue?: string;
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
        defaultValue={defaultValue}
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

function EditableList({ children, emptyText }: { children: ReactNode; emptyText: string }) {
  return (
    <div className="grid gap-3">
      {Children.count(children) ? children : <p className="text-sm text-zinc-500">{emptyText}</p>}
    </div>
  );
}

function EditableItem({
  children,
  onDelete,
  title,
}: {
  children: ReactNode;
  onDelete: () => void;
  title: string;
}) {
  return (
    <article className="grid gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-zinc-950">{title}</p>
        <button
          className="flex h-8 items-center gap-1.5 rounded-md border border-red-200 bg-white px-2 text-xs font-medium text-red-700 hover:bg-red-50"
          onClick={onDelete}
          type="button"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
          Delete
        </button>
      </div>
      {children}
    </article>
  );
}

function SaveInlineButton({ label }: { label: string }) {
  return (
    <button
      className="flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-100"
      type="submit"
    >
      <Save className="size-4" aria-hidden="true" />
      {label}
    </button>
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

function optionalCharacterOptions(characters: Character[]) {
  return [{ label: "None", value: "" }, ...characterOptions(characters)];
}

function getSceneParticipantIds(form: HTMLFormElement) {
  return uniqueText(
    compactIds([
      getFormValue(form, "participantPrimary"),
      getFormValue(form, "participantExtraA"),
      getFormValue(form, "participantExtraB"),
      getFormValue(form, "participantExtraC"),
    ]),
  );
}

function bookshelfOptions(bookshelves: Bookshelf[]) {
  return bookshelves.length
    ? bookshelves.map((bookshelf) => ({ label: bookshelf.title, value: bookshelf.id }))
    : [{ label: "Create a bookshelf first", value: "" }];
}

function buildScenarioBookDraftFromContext({
  activeRelationship,
  activeScene,
  activeSecret,
  characters,
  loadedCharacterCard,
  povMode,
  story,
}: {
  activeRelationship?: RelationshipThread;
  activeScene?: SceneMemory;
  activeSecret?: SecretOrReveal;
  characters: Character[];
  loadedCharacterCard: LoadedCharacterCard | null;
  povMode: PovMode;
  story: Story;
}): ScenarioBookDraft {
  const participantNames = formatParticipantNames(activeScene?.participants ?? [], characters);
  const fallbackParticipantNames = uniqueText([
    loadedCharacterCard?.name ?? "{{char}}",
    "{{user}}",
    ...characters.map((character) => character.name),
  ]).join(", ");

  return {
    title: `${story.title} Scenario`,
    scenario:
      activeScene?.scenario ??
      loadedCharacterCard?.scenario ??
      story.description ??
      "Define the setup or situation the characters are caught inside.",
    currentScene:
      activeScene?.summary ??
      loadedCharacterCard?.firstMessage ??
      "Use the latest scene state and latest user move as the current playable moment.",
    setting: compactTextLines([
      activeScene?.setting,
      activeScene?.location ? `Location: ${activeScene.location}.` : "",
      story.genre || story.subgenre ? `Genre frame: ${compactTextLines([story.genre, story.subgenre]).join(" / ")}.` : "",
    ]).join("\n"),
    participants: participantNames || fallbackParticipantNames,
    povMode: povLabels[povMode] ?? displayLabel(povMode),
    continuityMode: activeScene ? continuityModeLabels[activeScene.continuity_mode] : "Canon",
    chapterArc: compactTextLines([activeScene?.chapter_label, activeScene?.narrative_arc]).join(" · "),
    recentContext: compactTextLines([
      ...(activeScene?.key_actions ?? []).map((action) => `- ${action}`),
      ...(activeScene?.new_information ?? []).map((fact) => `- New information: ${fact}`),
      activeScene?.relationship_shift ? `- Relationship shift: ${activeScene.relationship_shift}` : "",
      activeScene?.emotional_shift ? `- Emotional shift: ${activeScene.emotional_shift}` : "",
    ]).join("\n"),
    activePressure: compactTextLines([
      activeRelationship?.dynamic_label ? `Relationship: ${activeRelationship.dynamic_label}.` : "",
      activeRelationship?.next_pressure_point ? `Next pressure: ${activeRelationship.next_pressure_point}` : "",
      activeSecret?.current_pressure ? `Secret pressure: ${activeSecret.current_pressure}` : "",
      activeSecret?.title ? `Active secret: ${activeSecret.title}` : "",
    ]).join("\n"),
    unresolvedHooks: compactTextLines(activeScene?.unresolved_hooks ?? []).map((hook) => `- ${hook}`).join("\n"),
    nextBeat:
      activeRelationship?.next_pressure_point ??
      activeSecret?.current_pressure ??
      activeScene?.unresolved_hooks?.[0] ??
      "Continue from the latest user move without resetting the scene.",
  };
}

function buildMemoryBookDraftFromContext({
  activeRelationship,
  activeScene,
  activeSecret,
  characters,
  relationships,
  scenes,
  secrets,
  story,
}: {
  activeRelationship?: RelationshipThread;
  activeScene?: SceneMemory;
  activeSecret?: SecretOrReveal;
  characters: Character[];
  relationships: RelationshipThread[];
  scenes: SceneMemory[];
  secrets: SecretOrReveal[];
  story: Story;
}): MemoryBookDraft {
  const secretRows = secrets.map((secret) =>
    compactTextLines([
      `${secret.title || "Untitled secret"} (${displayLabel(secret.reveal_status)}): ${secret.secret_text}`,
      `Known by: ${formatParticipantNames(secret.who_knows, characters) || "No one listed"}.`,
      `Suspected by: ${formatParticipantNames(secret.who_suspects, characters) || "No one listed"}.`,
      `Hidden by: ${formatParticipantNames(secret.who_is_hiding_it, characters) || "No one listed"}.`,
      `Pretending not to know: ${formatParticipantNames(secret.who_is_pretending_not_to_know, characters) || "No one listed"}.`,
      secret.current_pressure ? `Current pressure: ${secret.current_pressure}` : "",
      secret.consequences_if_revealed ? `Consequences if revealed: ${secret.consequences_if_revealed}` : "",
    ]).join("\n"),
  );

  return {
    title: `${story.title} Memory`,
    relationshipHistories:
      relationships
        .map((relationship) =>
          compactTextLines([
            `${relationship.dynamic_label}: ${formatParticipantNames(relationship.participants, characters) || "participants not listed"}`,
            relationship.current_state ? `Current state: ${relationship.current_state}` : "",
            relationship.last_major_change ? `Last major change: ${relationship.last_major_change}` : "",
            relationship.attraction_notes ? `Attraction: ${relationship.attraction_notes}` : "",
            relationship.conflict_notes ? `Conflict: ${relationship.conflict_notes}` : "",
            relationship.unresolved_tension ? `Unresolved tension: ${relationship.unresolved_tension}` : "",
            relationship.next_pressure_point ? `Next pressure: ${relationship.next_pressure_point}` : "",
          ]).join("\n"),
        )
        .join("\n\n") ||
      (activeRelationship ? `${activeRelationship.dynamic_label}: ${activeRelationship.current_state ?? "active relationship pressure."}` : ""),
    secrets: secretRows.join("\n\n") || (activeSecret ? `${activeSecret.title}: ${activeSecret.secret_text}` : ""),
    knowledgeBoundaries:
      "No character may act on information they have not plausibly learned. Track known facts, suspicions, misread signals, private truths, rumors, unrevealed secrets, and emotional truths separately.",
    episodicMemory:
      scenes
        .map((scene) =>
          compactTextLines([
            scene.chapter_label ? `${scene.chapter_label}: ${scene.summary}` : scene.summary,
            scene.location ? `Location: ${scene.location}` : "",
            scene.emotional_shift ? `Emotional shift: ${scene.emotional_shift}` : "",
            scene.relationship_shift ? `Relationship shift: ${scene.relationship_shift}` : "",
            scene.unresolved_hooks.length ? `Unresolved: ${scene.unresolved_hooks.join("; ")}` : "",
          ]).join("\n"),
        )
        .join("\n\n") || activeScene?.summary || "",
    revealedFacts: secrets
      .filter((secret) => secret.reveal_status === "revealed" || secret.reveal_status === "partially_revealed")
      .map((secret) => `${secret.title || "Secret"}: ${secret.secret_text}`)
      .join("\n"),
    suspicions: secrets
      .filter((secret) => secret.who_suspects.length || secret.reveal_status === "suspected")
      .map((secret) => `${secret.title || "Secret"} is suspected by ${formatParticipantNames(secret.who_suspects, characters) || "someone unspecified"}.`)
      .join("\n"),
    falseBeliefs: secrets
      .filter((secret) => secret.who_is_wrong.length || secret.who_falsely_believes_they_are_safe.length)
      .map((secret) =>
        compactTextLines([
          `${secret.title || "Secret"}:`,
          secret.who_is_wrong.length ? `Wrong about it: ${formatParticipantNames(secret.who_is_wrong, characters)}.` : "",
          secret.who_falsely_believes_they_are_safe.length
            ? `Falsely believes they are safe: ${formatParticipantNames(secret.who_falsely_believes_they_are_safe, characters)}.`
            : "",
        ]).join(" "),
      )
      .join("\n"),
    emotionalContinuity: compactTextLines([
      activeRelationship?.attraction_notes ? `Attraction: ${activeRelationship.attraction_notes}` : "",
      activeRelationship?.trust_notes ? `Trust: ${activeRelationship.trust_notes}` : "",
      activeRelationship?.conflict_notes ? `Conflict: ${activeRelationship.conflict_notes}` : "",
      activeScene?.emotional_shift ? `Current emotional shift: ${activeScene.emotional_shift}` : "",
      activeScene?.intimacy_shift ? `Current intimacy shift: ${activeScene.intimacy_shift}` : "",
    ]).join("\n"),
    triggerRules: [
      "Highest priority: current scene state, direct {{user}} action, active secrets, then relationship history.",
      "Do not reveal hidden memory unless the active POV can know, infer, suspect, or misread it on-page.",
      "Episodic memory should alter behavior, choices, hesitation, tone, and consequence rather than dumping exposition.",
    ].join("\n"),
  };
}

function buildPromptBookDraftFromContext({
  activeCorePack,
  heatLevel,
  platform,
  promptModuleValues,
  spiceVisibility,
  story,
}: {
  activeCorePack?: CorePromptPack;
  heatLevel: HeatLevelLabel;
  platform: string;
  promptModuleValues: PromptModuleText;
  spiceVisibility: SpiceVisibility;
  story: Story;
}): PromptBookDraft {
  const platformProfile = platformProfiles[platform] ?? platformProfiles.JanitorAI;

  return {
    title: `${platform} Prompt Book`,
    globalRules: compactTextLines([
      activeCorePack?.base_prompt,
      "Write collaborative narrative roleplay for {{char}}. Preserve {{user}} agency, bounded POV, consent logic, and continuity.",
      "All sexual/romantic content involves consenting adults only.",
      story.content_boundaries?.length ? `Content exclusions: ${story.content_boundaries.join("; ")}` : "",
    ]).join("\n\n"),
    proxyRules: promptModuleValues.storybookOperationalMode,
    platformStack: [
      `Target platform: ${platform}.`,
      `Primary prompt areas: ${platformProfile.promptAreas.join(", ")}.`,
      `Included compiler modules: ${getIncludedPromptSections(platformProfile, promptModuleValues).join(", ")}.`,
      platformProfile.stackStatus ? `Stack status: ${platformProfile.stackStatus}.` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    povAgencyRules: promptModuleValues.povGuardrails,
    heatSpiceRules: compactTextLines([
      `Heat label: ${displayLabel(heatLevel)}.`,
      `Spice visibility: ${displayLabel(spiceVisibility)}.`,
      promptModuleValues.heatSpice,
    ]).join("\n"),
    styleModules: compactTextLines([
      promptModuleValues.stylePerspectiveLens,
      promptModuleValues.styleRhythmDensity,
      promptModuleValues.styleToneSensory,
      promptModuleValues.styleDialogueVoice,
      promptModuleValues.styleSubtextEmotion,
    ]).join("\n\n"),
    compilerInstructions: [
      "Compile in order: Prompt Book -> Character Book -> World Book -> User Book -> Scenario Book -> Memory Book -> Latest User Move.",
      "World Book supplies semantic memory. Scenario Book supplies active runtime context. Memory Book supplies secrets, relationship history, episodic continuity, and knowledge boundaries.",
      "Scenario and Memory may update current pressure, but they should not silently rewrite stable Character or World canon.",
      "The final prompt must leave {{user}} room to act.",
    ].join("\n"),
    exportNotes:
      "Generated prompt packs remain sessional until saved. Saved Library Books become the active StoryBook package source for later exports.",
  };
}

function buildWorldBookDraftFromContext({
  activeCorePack,
  activeRelationship,
  activeScene,
  activeSecret,
  characterCard,
  selectedTagLabels,
  story,
}: {
  activeCorePack?: CorePromptPack;
  activeRelationship?: RelationshipThread;
  activeScene?: SceneMemory;
  activeSecret?: SecretOrReveal;
  characterCard: LoadedCharacterCard | null;
  selectedTagLabels: string[];
  story: Story;
}): WorldBookDraft {
  const sourceText = [
    characterCard?.tags.join(" "),
    characterCard?.description,
    characterCard?.personality,
    characterCard?.scenario,
    characterCard?.firstMessage,
    characterCard?.creatorNotes,
    activeScene?.setting,
    activeScene?.location,
    activeScene?.scenario,
    story.description,
    story.style_notes,
    selectedTagLabels.join(" "),
    activeCorePack?.title,
    activeCorePack?.base_prompt,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const characterName = characterCard?.name ?? "{{char}}";
  const worldType = inferWorldType(sourceText);
  const title = [characterName === "{{char}}" ? story.title : characterName, worldType].filter(Boolean).join(" · ");

  return {
    title: title || "Active Story World",
    worldType,
    genreSubgenre: inferGenreSubgenre(sourceText, selectedTagLabels),
    tone: [
      story.style_notes ?? "",
      activeCorePack?.category ? `${activeCorePack.category} pressure` : "",
      activeRelationship?.dynamic_label ? `${activeRelationship.dynamic_label} relationship pressure` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    loreEntries: buildWorldLoreEntries({ activeRelationship, activeScene, activeSecret, characterCard, sourceText }),
    triggerPrecedence: buildWorldTriggerPrecedence(sourceText),
    crossReferences: buildWorldCrossReferences({ activeRelationship, activeScene, activeSecret, characterCard, sourceText }),
    rules: buildWorldRules(sourceText),
    locations: buildWorldLocations({ activeScene, characterCard, sourceText }),
    factions: buildWorldFactions(sourceText),
    items: buildWorldItems(sourceText),
    events: [
      activeScene?.scenario ? `Scenario setup: ${activeScene.scenario}.` : "",
      activeScene?.summary ? `Current scene pressure: ${activeScene.summary}.` : "",
      activeRelationship?.next_pressure_point ? `Coming pressure: ${activeRelationship.next_pressure_point}.` : "",
      activeSecret?.title ? `Secret pressure: ${activeSecret.title}.` : "",
      inferWorldEvents(sourceText),
    ]
      .filter(Boolean)
      .join("\n"),
    socialStructure: buildSocialStructure(sourceText),
    sensoryLogic: buildSensoryLogic(sourceText),
    contentBoundaries: [
      "All romantic or sexual content involves consenting adults only.",
      "World rules create pressure and consequence; they do not override {{user}} agency, consent, or authored choices.",
      /step[-\s]?sibling|sibling|age[-\s]?gap|forbidden/.test(sourceText)
        ? "Forbidden or family-adjacent pressure must stay grounded in social consequence, secrecy, restraint, and adult consent."
        : "",
    ]
      .filter(Boolean)
      .join("\n"),
    continuityNotes: [
      "World facts remain stable unless changed on-page.",
      "Characters only know world facts they could plausibly know.",
      "World events interrupt only when seeded, meaningful, or naturally timed.",
      activeScene?.continuity_mode ? `Current continuity mode: ${activeScene.continuity_mode}.` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  };
}

function buildWorldLoreEntries({
  activeRelationship,
  activeScene,
  activeSecret,
  characterCard,
  sourceText,
}: {
  activeRelationship?: RelationshipThread;
  activeScene?: SceneMemory;
  activeSecret?: SecretOrReveal;
  characterCard: LoadedCharacterCard | null;
  sourceText: string;
}) {
  const characterName = characterCard?.name ?? "{{char}}";
  const entries = [
    characterCard
      ? [
          `Section/type: character`,
          `Keys: ${uniqueText([characterName, "{{char}}", ...(characterCard.tags ?? [])]).join(", ")}`,
          `Content: ${compactTextLines([characterCard.description, characterCard.personality]).join(" ") || "Primary character card source."}`,
          "Metadata: priority high; activates when the character, relationship, or direct roleplay interaction is in focus.",
          "Links: Character Book, User Book, Scenario Book, Memory Book.",
        ].join("\n")
      : "",
    activeScene
      ? [
          "Section/type: scene",
          `Keys: ${uniqueText([activeScene.title ?? "", activeScene.location ?? "", activeScene.setting ?? "", activeScene.chapter_label ?? ""]).join(", ")}`,
          `Content: ${compactTextLines([activeScene.scenario, activeScene.summary]).join(" ")}`,
          "Metadata: priority highest during active runtime; refreshes as Scenario Book changes.",
          "Links: Scenario Book, Memory Book, latest user move.",
        ].join("\n")
      : "",
    activeRelationship
      ? [
          "Section/type: relationship",
          `Keys: ${uniqueText([activeRelationship.dynamic_label, activeRelationship.current_state ?? "", activeRelationship.unresolved_tension ?? ""]).join(", ")}`,
          `Content: ${compactTextLines([
            activeRelationship.current_state,
            activeRelationship.attraction_notes,
            activeRelationship.conflict_notes,
            activeRelationship.next_pressure_point,
          ]).join(" ")}`,
          "Metadata: priority high; activates for intimacy, conflict, secrets, jealousy, boundaries, and emotional escalation.",
          "Links: Character Book, User Book, Memory Book, Scenario Book.",
        ].join("\n")
      : "",
    activeSecret
      ? [
          "Section/type: secret",
          `Keys: ${uniqueText([activeSecret.title ?? "", activeSecret.reveal_status, activeSecret.truth_status ?? ""]).join(", ")}`,
          `Content: ${compactTextLines([activeSecret.secret_text, activeSecret.current_pressure, activeSecret.consequences_if_revealed]).join(" ")}`,
          "Metadata: priority high but gated by knowledge boundaries; do not leak to a POV that cannot know it.",
          "Links: Memory Book, Relationship history, active scene pressure.",
        ].join("\n")
      : "",
    /omegaverse|alpha|omega|heat|rut|pack/.test(sourceText)
      ? [
          "Section/type: world_rule",
          "Keys: omegaverse, alpha, omega, heat, rut, scent, pack, suppressant",
          "Content: Designation biology, scent, heat/rut timing, privacy, suppressants, and status norms shape social risk and physical proximity.",
          "Metadata: priority medium-high; activates when biology, scent, status, or forced proximity matters.",
          "Links: World rules, sensory logic, social structure, relationship pressure.",
        ].join("\n")
      : "",
  ].filter(Boolean);

  return entries.join("\n\n") || "Extract each meaningful character, place, faction, item, event, rule, document, or ability as a modular lore entry with keys, content, metadata, and links.";
}

function buildWorldTriggerPrecedence(sourceText: string) {
  return [
    "1. Active Scenario Book and Latest User Move override broad world entries for the current turn.",
    "2. Character/User/Relationship entries override generic trope or world-type entries when behavior is character-specific.",
    "3. Secret and Memory entries activate only when the active POV can know, suspect, misread, or plausibly be affected by them.",
    "4. World rules activate when location, status, biology, faction, item, event, or social consequence is directly relevant.",
    "5. Background lore stays quiet unless it changes choices, access, pressure, interruption, risk, or continuity.",
    /omegaverse|alpha|omega|heat|rut|pack/.test(sourceText)
      ? "Omegaverse biology and scent cues can outrank ordinary social reads, but they do not override {{user}} agency."
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildWorldCrossReferences({
  activeRelationship,
  activeScene,
  activeSecret,
  characterCard,
  sourceText,
}: {
  activeRelationship?: RelationshipThread;
  activeScene?: SceneMemory;
  activeSecret?: SecretOrReveal;
  characterCard: LoadedCharacterCard | null;
  sourceText: string;
}) {
  return compactTextLines([
    characterCard?.name ? `${characterCard.name} -> Character Book -> relationship dynamics -> active Scenario Book pressure.` : "",
    activeRelationship?.dynamic_label
      ? `${activeRelationship.dynamic_label} -> Memory Book relationship history -> Scenario Book next beat.`
      : "",
    activeSecret?.title ? `${activeSecret.title} -> Memory Book secret state -> knowledge boundaries -> reveal consequences.` : "",
    activeScene?.location ? `${activeScene.location} -> World Book location -> active scene staging -> interruptions and privacy.` : "",
    /college|university|campus/.test(sourceText)
      ? "University/campus -> locations, schedules, peers, gossip, deadlines, and social exposure."
      : "",
    /omegaverse|alpha|omega|heat|rut|pack/.test(sourceText)
      ? "Omegaverse designation -> scent logic, social hierarchy, biological events, boundary logic, and intimacy pressure."
      : "",
    /family|step[-\s]?sibling|sibling/.test(sourceText)
      ? "Family/household role -> forbidden pressure, secrecy, domestic proximity, and public reputation."
      : "",
  ]).join("\n");
}

function inferWorldType(sourceText: string) {
  if (/omegaverse|alpha|omega|beta|heat|rut|pack/.test(sourceText)) return "Omegaverse";
  if (/vampire|werewolf|witch|fae|demon|angel|supernatural/.test(sourceText)) return "Supernatural";
  if (/mafia|gang|cartel|underworld|crime/.test(sourceText)) return "Dark romance underworld";
  if (/spaceship|android|alien|cyberpunk|sci[-\s]?fi|science fiction/.test(sourceText)) return "Science fiction";
  if (/kingdom|duke|lord|lady|historical|regency|court/.test(sourceText)) return "Historical or courtly";
  if (/celebrity|rock star|band|idol|actor|tour/.test(sourceText)) return "Celebrity / entertainment";
  if (/college|university|campus|dorm|class|professor/.test(sourceText)) return "Contemporary university";
  if (/office|company|boss|coworker|co-worker|workplace/.test(sourceText)) return "Workplace contemporary";
  return "Contemporary reality";
}

function inferGenreSubgenre(sourceText: string, selectedTagLabels: string[]) {
  const signals = [
    /forbidden|step[-\s]?sibling|sibling|age[-\s]?gap/.test(sourceText) ? "forbidden attraction" : "",
    /omegaverse|alpha|omega|heat|rut|pack/.test(sourceText) ? "omegaverse romance" : "",
    /possessive|obsessive|morally grey|dark romance/.test(sourceText) ? "dark romance" : "",
    /friends?\s*to\s*lovers|best friend|longtime/.test(sourceText) ? "friends-to-lovers" : "",
    /enemies?\s*to\s*lovers|rival|competitive/.test(sourceText) ? "rivals-to-lovers" : "",
    ...selectedTagLabels,
  ].filter(Boolean);

  return uniqueText(signals).join(", ") || "character-driven romantic roleplay";
}

function buildWorldRules(sourceText: string) {
  const rules = [
    /omegaverse|alpha|omega|heat|rut|pack/.test(sourceText)
      ? "Omegaverse biology, scent, designation, heat/rut timing, suppressants, social expectation, and status language can affect behavior and scene pressure."
      : "",
    /step[-\s]?sibling|sibling|family/.test(sourceText)
      ? "Family-adjacent labels create social risk, secrecy, household consequence, and public/private tension."
      : "",
    /age[-\s]?gap|older|younger/.test(sourceText)
      ? "Age-gap or older-protector framing creates imbalance, restraint, and reputational risk without removing adult agency."
      : "",
    /college|university|campus|dorm|class/.test(sourceText)
      ? "University life creates schedules, deadlines, campus peers, classes, parties, and obligations outside romance."
      : "",
    /living together|live together|same roof|shared house|shared home|roommates?/.test(sourceText)
      ? "Shared living space makes privacy scarce and turns ordinary routines into continuity anchors."
      : "",
  ].filter(Boolean);

  return rules.join("\n") || "World rules should shape behavior through consequence, access, social pressure, and plausible limits.";
}

function buildWorldLocations({
  activeScene,
  characterCard,
  sourceText,
}: {
  activeScene?: SceneMemory;
  characterCard: LoadedCharacterCard | null;
  sourceText: string;
}) {
  const locations = [
    activeScene?.setting ? `Current setting: ${activeScene.setting}.` : "",
    activeScene?.location ? `Current location: ${activeScene.location}.` : "",
    /living together|live together|same roof|shared house|shared home|roommates?/.test(sourceText)
      ? "Shared home: bedroom doors, kitchen, hallway, bathroom, laundry, late-night common areas, and overheard private moments."
      : "",
    /college|university|campus|dorm|class/.test(sourceText)
      ? "University: lecture halls, library, campus paths, dorms, parties, study spaces, and places where peers can observe tension."
      : "",
    characterCard?.scenario ? `Scenario location logic: ${characterCard.scenario}.` : "",
  ].filter(Boolean);

  return locations.join("\n") || "Define the recurring locations that can carry pressure, interruption, privacy, and routine.";
}

function buildWorldFactions(sourceText: string) {
  const factions = [
    /family|step[-\s]?sibling|sibling|brother|sister/.test(sourceText)
      ? "Family/household: people with expectations, judgment, access to private routines, and power to create consequence."
      : "",
    /college|university|campus|class/.test(sourceText)
      ? "University circle: classmates, friends, rivals, professors, roommates, and people who can witness or misread proximity."
      : "",
    /omegaverse|alpha|omega|pack/.test(sourceText)
      ? "Omegaverse social groups: designation expectations, pack/family authority, medical support, gossip, and status pressure."
      : "",
  ].filter(Boolean);

  return factions.join("\n") || "List recurring groups, institutions, rivals, families, or authority figures.";
}

function buildWorldItems(sourceText: string) {
  const items = [
    /omegaverse|alpha|omega|heat|rut/.test(sourceText)
      ? "Omegaverse items: suppressants, scent blockers, heat supplies, spare clothes, bedding, medical records, and privacy tools."
      : "",
    /college|university|campus|class/.test(sourceText)
      ? "University items: notebooks, laptops, class schedules, bags, textbooks, keys, phones, and assignment deadlines."
      : "",
    /living together|live together|same roof|shared/.test(sourceText)
      ? "Household items: shared keys, laundry, mugs, towels, bedroom doors, spare blankets, and objects left in the wrong room."
      : "",
  ].filter(Boolean);

  return items.join("\n") || "List objects that can become scene anchors, secrets, evidence, comfort items, or logistical pressure.";
}

function inferWorldEvents(sourceText: string) {
  const events = [
    /omegaverse|alpha|omega|heat|rut/.test(sourceText)
      ? "Biological events: heat/rut risk, scent spikes, suppressant failure, medical appointments, and accidental scent exposure."
      : "",
    /college|university|campus|class/.test(sourceText)
      ? "University events: deadlines, exams, parties, lectures, campus gossip, late study nights, and schedule conflicts."
      : "",
    /family|step[-\s]?sibling|sibling/.test(sourceText)
      ? "Household/family events: dinners, family visits, overheard arguments, shared obligations, and moments where the family label matters."
      : "",
  ].filter(Boolean);

  return events.join("\n");
}

function buildSocialStructure(sourceText: string) {
  const structure = [
    /omegaverse|alpha|omega|pack/.test(sourceText)
      ? "Designation affects how people read power, vulnerability, scent, propriety, and acceptable closeness."
      : "",
    /step[-\s]?sibling|sibling|family/.test(sourceText)
      ? "Family structure makes public perception matter; what looks domestic can become scandalous when desire enters it."
      : "",
    /college|university|campus/.test(sourceText)
      ? "Campus life gives {{user}} an independent social world that can complicate secrecy and proximity."
      : "",
  ].filter(Boolean);

  return structure.join("\n") || "Define status, reputation, hierarchy, family roles, legal/social rules, and who notices what.";
}

function buildSensoryLogic(sourceText: string) {
  const sensory = [
    /omegaverse|alpha|omega|scent/.test(sourceText)
      ? "Scent is readable, intimate, and socially meaningful; changes in scent can betray stress, desire, fear, illness, or proximity."
      : "",
    /living together|live together|same roof|shared/.test(sourceText)
      ? "Domestic sensory continuity matters: thin walls, familiar footsteps, detergent, shower steam, bedding, kitchen sounds, and late-night silence."
      : "",
    /college|university|campus/.test(sourceText)
      ? "Campus sensory texture includes crowded halls, fluorescent classrooms, library quiet, party noise, weather between buildings, and shared transport."
      : "",
  ].filter(Boolean);

  return sensory.join("\n") || "Define the sensory rules that make the world feel consistent: weather, sound, smell, privacy, touch, and recurring textures.";
}

function compactTextLines(lines: (string | undefined | null)[]) {
  return lines.filter((line): line is string => Boolean(line?.trim()));
}

function formatParticipantNames(ids: string[], characters: Character[]) {
  return ids
    .map((id) => characters.find((character) => character.id === id)?.name ?? id)
    .filter(Boolean)
    .join(", ");
}

function formatWorldBookDraft(draft: WorldBookDraft) {
  return formatStructuredBookDraft(draft.title || "World Book", [
    ["World Type", draft.worldType],
    ["Genre / Subgenre", draft.genreSubgenre],
    ["Tone", draft.tone],
    ["Modular Lore Entries", draft.loreEntries],
    ["Trigger Precedence", draft.triggerPrecedence],
    ["Cross-References", draft.crossReferences],
    ["Rules", draft.rules],
    ["Locations", draft.locations],
    ["Factions", draft.factions],
    ["Items", draft.items],
    ["Events", draft.events],
    ["Social Structure", draft.socialStructure],
    ["Sensory Logic", draft.sensoryLogic],
    ["Content Boundaries", draft.contentBoundaries],
    ["Continuity Notes", draft.continuityNotes],
  ]);
}

function formatScenarioBookDraft(draft: ScenarioBookDraft) {
  return formatStructuredBookDraft(draft.title || "Scenario Book", [
    ["Scenario", draft.scenario],
    ["Current Scene", draft.currentScene],
    ["Setting", draft.setting],
    ["Participants", draft.participants],
    ["POV Mode", draft.povMode],
    ["Continuity Mode", draft.continuityMode],
    ["Chapter / Arc", draft.chapterArc],
    ["Recent Context", draft.recentContext],
    ["Active Pressure", draft.activePressure],
    ["Unresolved Hooks", draft.unresolvedHooks],
    ["Next Playable Beat", draft.nextBeat],
  ]);
}

function formatMemoryBookDraft(draft: MemoryBookDraft) {
  return formatStructuredBookDraft(draft.title || "Memory Book", [
    ["Relationship Histories", draft.relationshipHistories],
    ["Secrets", draft.secrets],
    ["Knowledge Boundaries", draft.knowledgeBoundaries],
    ["Episodic Memory", draft.episodicMemory],
    ["Revealed Facts", draft.revealedFacts],
    ["Suspicions", draft.suspicions],
    ["False Beliefs", draft.falseBeliefs],
    ["Emotional Continuity", draft.emotionalContinuity],
    ["Trigger Rules", draft.triggerRules],
  ]);
}

function formatPromptBookDraft(draft: PromptBookDraft) {
  return formatStructuredBookDraft(draft.title || "Prompt Book", [
    ["Global Rules", draft.globalRules],
    ["Proxy Rules", draft.proxyRules],
    ["Platform Stack", draft.platformStack],
    ["POV / Agency Rules", draft.povAgencyRules],
    ["Heat / Spice Rules", draft.heatSpiceRules],
    ["Style Modules", draft.styleModules],
    ["Compiler Instructions", draft.compilerInstructions],
    ["Export Notes", draft.exportNotes],
  ]);
}

function formatStructuredBookDraft(title: string, sections: readonly (readonly [string, string])[]) {
  const body = sections
    .filter(([, value]) => value.trim().length > 0)
    .map(([label, value]) => `## ${label}\n${value.trim()}`)
    .join("\n\n");

  return [`# ${title}`, body].filter(Boolean).join("\n\n").trim();
}

function readWorldBookDraftFromPayload(payload: Record<string, unknown>): WorldBookDraft {
  const draft = payload.draft;
  if (!draft || typeof draft !== "object") return emptyWorldBookDraft;
  const record = draft as Partial<Record<WorldBookDraftField, unknown>>;

  return {
    title: readString(record.title),
    worldType: readString(record.worldType),
    genreSubgenre: readString(record.genreSubgenre),
    tone: readString(record.tone),
    loreEntries: readString(record.loreEntries),
    triggerPrecedence: readString(record.triggerPrecedence),
    crossReferences: readString(record.crossReferences),
    rules: readString(record.rules),
    locations: readString(record.locations),
    factions: readString(record.factions),
    items: readString(record.items),
    events: readString(record.events),
    socialStructure: readString(record.socialStructure),
    sensoryLogic: readString(record.sensoryLogic),
    contentBoundaries: readString(record.contentBoundaries),
    continuityNotes: readString(record.continuityNotes),
  };
}

function readScenarioBookDraftFromPayload(payload: Record<string, unknown>): ScenarioBookDraft {
  const draft = payload.draft;
  if (!draft || typeof draft !== "object") return emptyScenarioBookDraft;
  const record = draft as Partial<Record<ScenarioBookDraftField, unknown>>;

  return {
    title: readString(record.title),
    scenario: readString(record.scenario),
    currentScene: readString(record.currentScene),
    setting: readString(record.setting),
    participants: readString(record.participants),
    povMode: readString(record.povMode),
    continuityMode: readString(record.continuityMode),
    chapterArc: readString(record.chapterArc),
    recentContext: readString(record.recentContext),
    activePressure: readString(record.activePressure),
    unresolvedHooks: readString(record.unresolvedHooks),
    nextBeat: readString(record.nextBeat),
  };
}

function readMemoryBookDraftFromPayload(payload: Record<string, unknown>): MemoryBookDraft {
  const draft = payload.draft;
  if (!draft || typeof draft !== "object") return emptyMemoryBookDraft;
  const record = draft as Partial<Record<MemoryBookDraftField, unknown>>;

  return {
    title: readString(record.title),
    relationshipHistories: readString(record.relationshipHistories),
    secrets: readString(record.secrets),
    knowledgeBoundaries: readString(record.knowledgeBoundaries),
    episodicMemory: readString(record.episodicMemory),
    revealedFacts: readString(record.revealedFacts),
    suspicions: readString(record.suspicions),
    falseBeliefs: readString(record.falseBeliefs),
    emotionalContinuity: readString(record.emotionalContinuity),
    triggerRules: readString(record.triggerRules),
  };
}

function readPromptBookDraftFromPayload(payload: Record<string, unknown>): PromptBookDraft {
  const draft = payload.draft;
  if (!draft || typeof draft !== "object") return emptyPromptBookDraft;
  const record = draft as Partial<Record<PromptBookDraftField, unknown>>;

  return {
    title: readString(record.title),
    globalRules: readString(record.globalRules),
    proxyRules: readString(record.proxyRules),
    platformStack: readString(record.platformStack),
    povAgencyRules: readString(record.povAgencyRules),
    heatSpiceRules: readString(record.heatSpiceRules),
    styleModules: readString(record.styleModules),
    compilerInstructions: readString(record.compilerInstructions),
    exportNotes: readString(record.exportNotes),
  };
}

function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function uniqueText(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function getInitialLoadedCharacterCard({
  initialLibraryBooks,
  initialStoryBookBindings,
  initialStoryBooks,
}: {
  initialLibraryBooks: LibraryBook[];
  initialStoryBookBindings: StoryBookBinding[];
  initialStoryBooks: StoryBook[];
}) {
  const activeStoryBook = initialStoryBooks[0];
  if (!activeStoryBook) return null;

  const linkedBookIds = new Set(
    initialStoryBookBindings
      .filter((binding) => binding.storybook_id === activeStoryBook.id)
      .map((binding) => binding.book_id),
  );
  const characterBook = initialLibraryBooks.find(
    (book) => linkedBookIds.has(book.id) && book.book_type === "character_book",
  );

  return characterBook ? readCharacterCardFromBookPayload(characterBook.payload) : null;
}

function getInitialScenarioBookDraft({
  initialLibraryBooks,
  initialStoryBookBindings,
  initialStoryBooks,
}: {
  initialLibraryBooks: LibraryBook[];
  initialStoryBookBindings: StoryBookBinding[];
  initialStoryBooks: StoryBook[];
}) {
  const scenarioBook = getInitialLibraryBookByType({
    bookType: "scenario_book",
    initialLibraryBooks,
    initialStoryBookBindings,
    initialStoryBooks,
  });

  return scenarioBook ? readScenarioBookDraftFromPayload(scenarioBook.payload) : emptyScenarioBookDraft;
}

function getInitialWorldBookDraft({
  initialLibraryBooks,
  initialStoryBookBindings,
  initialStoryBooks,
}: {
  initialLibraryBooks: LibraryBook[];
  initialStoryBookBindings: StoryBookBinding[];
  initialStoryBooks: StoryBook[];
}) {
  const worldBook = getInitialLibraryBookByType({
    bookType: "world_book",
    initialLibraryBooks,
    initialStoryBookBindings,
    initialStoryBooks,
  });

  return worldBook ? readWorldBookDraftFromPayload(worldBook.payload) : emptyWorldBookDraft;
}

function getInitialMemoryBookDraft({
  initialLibraryBooks,
  initialStoryBookBindings,
  initialStoryBooks,
}: {
  initialLibraryBooks: LibraryBook[];
  initialStoryBookBindings: StoryBookBinding[];
  initialStoryBooks: StoryBook[];
}) {
  const memoryBook = getInitialLibraryBookByType({
    bookType: "memory_book",
    initialLibraryBooks,
    initialStoryBookBindings,
    initialStoryBooks,
  });

  return memoryBook ? readMemoryBookDraftFromPayload(memoryBook.payload) : emptyMemoryBookDraft;
}

function getInitialPromptBookDraft({
  initialLibraryBooks,
  initialStoryBookBindings,
  initialStoryBooks,
}: {
  initialLibraryBooks: LibraryBook[];
  initialStoryBookBindings: StoryBookBinding[];
  initialStoryBooks: StoryBook[];
}) {
  const promptBook = getInitialLibraryBookByType({
    bookType: "prompt_book",
    initialLibraryBooks,
    initialStoryBookBindings,
    initialStoryBooks,
  });

  return promptBook ? readPromptBookDraftFromPayload(promptBook.payload) : emptyPromptBookDraft;
}

function getInitialLibraryBookByType({
  bookType,
  initialLibraryBooks,
  initialStoryBookBindings,
  initialStoryBooks,
}: {
  bookType: BookType;
  initialLibraryBooks: LibraryBook[];
  initialStoryBookBindings: StoryBookBinding[];
  initialStoryBooks: StoryBook[];
}) {
  const activeStoryBook = initialStoryBooks[0];
  if (!activeStoryBook) return null;

  const linkedBookIds = new Set(
    initialStoryBookBindings
      .filter((binding) => binding.storybook_id === activeStoryBook.id)
      .map((binding) => binding.book_id),
  );

  return initialLibraryBooks.find((book) => linkedBookIds.has(book.id) && book.book_type === bookType) ?? null;
}

function getFormValue(form: HTMLFormElement, name: string) {
  const field = form.elements.namedItem(name);
  if (!field || !("value" in field)) return "";
  return String(field.value).trim();
}

function toJsonPayload(payload: Record<string, unknown>) {
  return JSON.parse(JSON.stringify(payload)) as Record<string, unknown>;
}

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}`;
}

function replaceById<TItem extends { id: string }>(items: TItem[], id: string, replacement: TItem) {
  return items.map((item) => (item.id === id ? replacement : item));
}

function removeById<TItem extends { id: string }>(items: TItem[], id: string) {
  return items.filter((item) => item.id !== id);
}

function compactIds(values: string[]) {
  return values.filter((value) => value.trim().length > 0);
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
