export type BotWaffleAuthoringLaneId =
  | "authoring_studio_flow"
  | "model_connection_settings"
  | "import_export_bundle"
  | "section_generation"
  | "prompt_template_organization";

export type BotWaffleAuthoringPriority = "now" | "next" | "later";

export interface BotWaffleAuthoringLane {
  id: BotWaffleAuthoringLaneId;
  title: string;
  sourcePattern: string;
  heartwriteAdaptation: string;
  currentSurface: string[];
  nextActions: string[];
  excludedSourcePatterns: string[];
  priority: BotWaffleAuthoringPriority;
}

export interface AuthoringSectionGenerationStep {
  id: string;
  label: string;
  targetField:
    | "description"
    | "personality"
    | "scenario"
    | "first_mes"
    | "mes_example"
    | "creator_notes"
    | "lorebook"
    | "image_prompts";
  selectedContext: string[];
  instruction: string;
  outputRule: string;
}

export interface AuthoringBundleExportItem {
  id: string;
  label: string;
  pathHint: string;
  reviewRule: string;
}

export interface BotWaffleReplacementRule {
  id: string;
  replace: string;
  heartwritePolicy: string;
  reason: string;
  enforcement: string[];
}

export const BOTWAFFLE_AUTHORING_STUDIO_LANES = Object.freeze([
  {
    id: "authoring_studio_flow",
    title: "Character authoring studio flow",
    sourcePattern:
      "BotWaffle keeps the library, editor, preview, character assets, and related resources close together.",
    heartwriteAdaptation:
      "Treat the workspace as the one-stop character studio: library drawer, portrait intake, one-page creator, full CCV3 editor, expression manager, semantic tools, and local save/export actions.",
    currentSurface: [
      "Character Card Studio workspace",
      "Library drawer and compact library panel",
      "Portrait drop zone and PNG metadata choice review",
      "One-page creator plus advanced CCV3 editor",
      "Expression manager and semantic node creator",
    ],
    nextActions: [
      "Keep authoring actions grouped by character instead of scattering them across tools.",
      "Add related-resource sections only when they write into HeartWriteAI card, lorebook, asset, or library formats.",
      "Prefer edit/review/save loops over direct destructive writes.",
    ],
    excludedSourcePatterns: [
      "Do not copy the Electron data model directly.",
      "Do not collapse HeartWriteAI's structured form into a flat comma prompt.",
    ],
    priority: "now",
  },
  {
    id: "model_connection_settings",
    title: "LM Studio connection and settings UI",
    sourcePattern:
      "BotWaffle exposes a local LM Studio endpoint, model choices, generation options, connection status, cancellation, and useful error messages.",
    heartwriteAdaptation:
      "Use the existing OpenAI-compatible inference settings as the generalized version: local LM Studio, LAN endpoint, proxy/API, OpenRouter, context length, temperature, top-p, and max tokens.",
    currentSurface: [
      "Inference settings card",
      "Topbar model-status indicator",
      "Local/proxy/OpenAI-compatible prose paths",
      "Chat fallback behavior when provider calls fail",
    ],
    nextActions: [
      "Keep endpoint presets provider-neutral.",
      "Surface model availability as status, not as a hard app dependency.",
      "Preserve local/native fallback paths for desktop use.",
    ],
    excludedSourcePatterns: [
      "Do not hardcode a preferred local model.",
      "Do not import unsafe provider override prompts.",
      "Do not preserve model-specific Qwen workarounds as the default runtime path.",
    ],
    priority: "now",
  },
  {
    id: "import_export_bundle",
    title: "Import/export bundle concepts",
    sourcePattern:
      "BotWaffle ZIP exports gather character data, character sheets, scripts, saved chats, image prompts, config, and a manifest.",
    heartwriteAdaptation:
      "Bundle CCV3 JSON, PNG/CHARX metadata, portrait assets, lorebooks, prompt templates, image prompts, import review notes, and a manifest through a review-first export pipeline.",
    currentSurface: [
      "PNG/JSON/CHARX import and export",
      "Import review summary",
      "Folder intake review",
      "Lorebook V3 import/export",
      "Local backup controls",
    ],
    nextActions: [
      "Add bundle manifests with explicit source, format, and review-required fields.",
      "Stage imports for conversion and polish before writing into the active library.",
      "Keep saved chats and private notes separate from prompt-safe card exports.",
    ],
    excludedSourcePatterns: [
      "Do not extract imported ZIPs directly into the live library.",
      "Do not merge unreviewed external prose into generated card fields.",
    ],
    priority: "next",
  },
  {
    id: "section_generation",
    title: "Section-by-section generation UX",
    sourcePattern:
      "BotWaffle can generate description, personality, scenario, initial messages, example dialogue, scripts, and full character drafts from selected context.",
    heartwriteAdaptation:
      "Generate and revise individual HeartWriteAI card sections using selected existing fields as context, then require insert/append/review before replacing user-authored text.",
    currentSurface: [
      "Character generation prompt templates",
      "Prose Pixie modal",
      "Scenario generator",
      "Lorebook generator",
      "Persona generator",
      "Structured card editor fields",
    ],
    nextActions: [
      "Expose section generation as small actions near each field.",
      "Use selected context checkboxes for profile, personality, scenario, opener, examples, lore, and creator notes.",
      "Keep generated output staged until the user chooses insert, append, or discard.",
    ],
    excludedSourcePatterns: [
      "Do not overwrite a section without review.",
      "Do not duplicate persistent scenario facts in the opening message.",
      "Do not send one giant generation prompt when a section-scoped prompt can do the job.",
    ],
    priority: "next",
  },
  {
    id: "prompt_template_organization",
    title: "Prompt/template organization",
    sourcePattern:
      "BotWaffle keeps editable generation prompts by purpose and section.",
    heartwriteAdaptation:
      "Store HeartWriteAI templates by role: card generation, scenario, starter message, prose polish, lorebook, semantic expansion, export mapping, and prompt layout.",
    currentSurface: [
      "Character generation prompt templates",
      "Runtime prompt templates",
      "Export preset mapping",
      "Prompt layout types",
      "Semantic seed registry and compiler",
    ],
    nextActions: [
      "Add template metadata for purpose, target field, source context, and prompt-safe boundaries.",
      "Keep templates concise enough for local models.",
      "Version templates so exported cards can note which authoring profile shaped them.",
    ],
    excludedSourcePatterns: [
      "Do not store unsafe provider override language in reusable templates.",
      "Do not make image-prompt snippets stand in for CCV3 personality fields.",
      "Do not copy embedded PromptWaffle implementation code unless license review explicitly approves the exact use.",
    ],
    priority: "later",
  },
] as const satisfies readonly BotWaffleAuthoringLane[]);

export const BOTWAFFLE_REPLACEMENT_RULES = Object.freeze([
  {
    id: "replace_giant_prompt_calls",
    replace: "Giant prompt calls",
    heartwritePolicy:
      "Prefer section-scoped generation with selected context, concise instructions, and review-before-insert behavior.",
    reason:
      "Smaller calls are easier to debug, cheaper for local models, and less likely to overwrite unrelated fields.",
    enforcement: [
      "Keep description, personality, scenario, starter, dialogue, lorebook, and image prompt generation as separate target fields.",
      "Compile only the selected context sections needed for the active generation step.",
      "Stage generated output until the user chooses insert, append, or discard.",
    ],
  },
  {
    id: "replace_no_seed_generation",
    replace: "No-seed generation assumptions",
    heartwritePolicy:
      "Use deterministic seeds, run IDs, and manifest records for generated fixtures and batch-created cards.",
    reason:
      "Reproducibility makes QC, import/export testing, and bug reports traceable.",
    enforcement: [
      "Expose --seed for CLI generators.",
      "Record seed and run ID in generated manifests or creator notes.",
      "Do not use Math.random for durable fixtures when a seeded generator is available.",
    ],
  },
  {
    id: "replace_fragile_qwen_handling",
    replace: "Fragile Qwen-specific handling",
    heartwritePolicy:
      "Keep provider handling OpenAI-compatible and model-neutral, with optional model notes outside the core path.",
    reason:
      "Users may run LM Studio, LAN endpoints, proxies, OpenRouter, Ollama, or another compatible runtime.",
    enforcement: [
      "Do not hardcode a current favorite model.",
      "Keep endpoint presets separate from model presets.",
      "Handle empty responses and reasoning-heavy responses generically where possible.",
    ],
  },
  {
    id: "license_quarantine_promptwaffle",
    replace: "Embedded PromptWaffle code mining",
    heartwritePolicy:
      "Treat PromptWaffle as workflow inspiration only until license review approves exact reuse.",
    reason:
      "The embedded PromptWaffle package declares AGPL-3.0 while the BotWaffle root package declares MIT.",
    enforcement: [
      "Do not copy PromptWaffle source code, UI code, utility functions, or prompt-builder implementation details.",
      "Use independently written HeartWriteAI components and data structures.",
      "Record source-license uncertainty in review notes before adapting anything beyond high-level concepts.",
    ],
  },
] as const satisfies readonly BotWaffleReplacementRule[]);

export const BOTWAFFLE_SECTION_GENERATION_STEPS = Object.freeze([
  {
    id: "profile_description",
    label: "Description",
    targetField: "description",
    selectedContext: ["name", "tags", "appearance", "role", "core concept"],
    instruction:
      "Write a concise card description that signals identity, presence, and roleplay-relevant hooks.",
    outputRule:
      "Two to four sentences. No scenario events, no private user assumptions, no unsupported lore.",
  },
  {
    id: "personality_engine",
    label: "Personality",
    targetField: "personality",
    selectedContext: [
      "description",
      "archetype",
      "wounds",
      "fears",
      "desires",
      "voice",
    ],
    instruction:
      "Generate behavioral personality instructions: action patterns, defenses, values, contradictions, emotional tells, and speech parameters.",
    outputRule:
      "Use executable behavior. Pair every constraint with an alternative action route.",
  },
  {
    id: "scenario_context",
    label: "Scenario",
    targetField: "scenario",
    selectedContext: ["personality", "setting", "relationship", "route seed"],
    instruction:
      "Define only persistent world, relationship, and current-pressure facts that should remain true across turns.",
    outputRule:
      "Do not write the opening scene here. Keep temporary locations and changeable events out unless the card is single-scenario.",
  },
  {
    id: "starter_message",
    label: "Starter Message",
    targetField: "first_mes",
    selectedContext: ["description", "personality", "scenario", "voice"],
    instruction:
      "Write the first assistant message as a grounded scene hook anchored to {{char}}.",
    outputRule:
      "Use 3rd person past tense narration and 1st person present tense dialogue. Never write {{user}}'s actions, thoughts, or dialogue.",
  },
  {
    id: "example_dialogue",
    label: "Example Dialogue",
    targetField: "mes_example",
    selectedContext: ["personality", "voice", "relationship dynamic"],
    instruction:
      "Create short voice-reference exchanges that show cadence, restraint, humor, conflict, and repair style.",
    outputRule:
      "Examples are voice references only; do not make them required plot outcomes.",
  },
  {
    id: "creator_notes",
    label: "Creator Notes",
    targetField: "creator_notes",
    selectedContext: ["tags", "semantic seeds", "export mode", "review notes"],
    instruction:
      "Summarize tags, intended use, review state, content scope, and authoring notes without exposing internal graph-only fields.",
    outputRule:
      "Expose user-facing tags and creator notes only. Keep semanticSeedIds, private graph links, and storage metadata internal.",
  },
  {
    id: "lorebook",
    label: "Lorebook",
    targetField: "lorebook",
    selectedContext: ["scenario", "world tags", "relationship routes"],
    instruction:
      "Generate lore entries only for facts that should activate in relevant scenes.",
    outputRule:
      "Use trigger keywords and concise content. Avoid dumping lore into every reply.",
  },
  {
    id: "image_prompts",
    label: "Image Prompts",
    targetField: "image_prompts",
    selectedContext: ["appearance", "fashion", "setting", "portrait assets"],
    instruction:
      "Create portrait and reference-image prompts from visual fields, not from personality-only prose.",
    outputRule:
      "Keep image prompts separate from CCV3 personality and scenario fields.",
  },
] as const satisfies readonly AuthoringSectionGenerationStep[]);

export const BOTWAFFLE_EXPORT_BUNDLE_ITEMS = Object.freeze([
  {
    id: "card_json",
    label: "CCV3 JSON",
    pathHint: "card/{{card_id}}.json",
    reviewRule: "Always include the prompt-safe compiled card payload.",
  },
  {
    id: "card_png_or_charx",
    label: "PNG / CHARX",
    pathHint: "exports/{{card_id}}.{png|charx}",
    reviewRule: "Include when a source portrait or CHARX master is available.",
  },
  {
    id: "portrait_assets",
    label: "Portrait Assets",
    pathHint: "assets/portraits/",
    reviewRule: "Keep original image provenance and generated prompt notes nearby.",
  },
  {
    id: "lorebooks",
    label: "Lorebooks",
    pathHint: "lorebooks/*.json",
    reviewRule: "Export V3 lorebook documents separately from the core card.",
  },
  {
    id: "prompt_templates",
    label: "Prompt Templates",
    pathHint: "templates/*.txt",
    reviewRule: "Include template purpose and version metadata.",
  },
  {
    id: "import_review",
    label: "Import Review",
    pathHint: "review/import-summary.json",
    reviewRule: "Preserve conversion notes and unresolved review warnings.",
  },
  {
    id: "manifest",
    label: "Manifest",
    pathHint: "manifest.json",
    reviewRule: "Record app version, export date, included files, and review state.",
  },
] as const satisfies readonly AuthoringBundleExportItem[]);

export function getBotWaffleAuthoringLane(
  id: BotWaffleAuthoringLaneId,
): BotWaffleAuthoringLane | undefined {
  return BOTWAFFLE_AUTHORING_STUDIO_LANES.find((lane) => lane.id === id);
}

export function getSectionGenerationStepsForField(
  targetField: AuthoringSectionGenerationStep["targetField"],
): AuthoringSectionGenerationStep[] {
  return BOTWAFFLE_SECTION_GENERATION_STEPS.filter(
    (step) => step.targetField === targetField,
  );
}

export function compileBotWaffleAuthoringStudioBrief(): string {
  return BOTWAFFLE_AUTHORING_STUDIO_LANES.map((lane) =>
    [
      `## ${lane.title}`,
      `Source pattern: ${lane.sourcePattern}`,
      `HeartWriteAI adaptation: ${lane.heartwriteAdaptation}`,
      `Priority: ${lane.priority}`,
      `Current surface: ${lane.currentSurface.join("; ")}`,
      `Next actions: ${lane.nextActions.join("; ")}`,
      `Excluded: ${lane.excludedSourcePatterns.join("; ")}`,
    ].join("\n"),
  ).join("\n\n");
}

export function compileBotWaffleReplacementPolicyBrief(): string {
  return BOTWAFFLE_REPLACEMENT_RULES.map((rule) =>
    [
      `## Replace: ${rule.replace}`,
      `HeartWriteAI policy: ${rule.heartwritePolicy}`,
      `Reason: ${rule.reason}`,
      `Enforcement: ${rule.enforcement.join("; ")}`,
    ].join("\n"),
  ).join("\n\n");
}
