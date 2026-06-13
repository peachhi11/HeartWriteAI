export interface PromptLayoutProfile {
  charPrefix: string;
  charSuffix: string;
  description: string;
  id: string;
  profileName: string;
  stopSequences: string[];
  systemPrefix: string;
  systemSuffix: string;
  userPrefix: string;
  userSuffix: string;
}

export type PromptLayer =
  | "main_system_prompt"
  | "character_prompt"
  | "persona_prompt"
  | "world_lore_prompt"
  | "chat_examples_prompt"
  | "chat_history_prompt"
  | "impersonation_prompt"
  | "post_history_instructions"
  | "preset_prompt";

export type PromptStackBlockId =
  | "main_prompt"
  | "char_description"
  | "char_personality"
  | "enhance_definitions"
  | "persona_description"
  | "scenario"
  | "world_info_before"
  | "chat_examples"
  | "world_info_after"
  | "chat_history"
  | "impersonation"
  | "post_history_instructions";

export interface PromptStackBlockDefinition {
  id: PromptStackBlockId;
  label: string;
  layer: PromptLayer;
  order: number;
  usuallyGoes: string;
  mainlyControls: readonly string[];
  meaning: string;
  editableByCreator: boolean;
}

export const PROMPT_LAYOUT_PRESETS: PromptLayoutProfile[] = [
  {
    charPrefix: "<|im_start|>assistant\n",
    charSuffix: "<|im_end|>\n",
    description:
      "General ChatML wrapper used by OpenAI-style and many fine-tuned chat models.",
    id: "chatml",
    profileName: "ChatML",
    stopSequences: ["<|im_end|>", "<|im_start|>"],
    systemPrefix: "<|im_start|>system\n",
    systemSuffix: "<|im_end|>\n",
    userPrefix: "<|im_start|>user\n",
    userSuffix: "<|im_end|>\n",
  },
  {
    charPrefix: "<|start_header_id|>assistant<|end_header_id|>\n\n",
    charSuffix: "<|eot_id|>",
    description: "Llama 3 instruct role headers and end-of-turn tokens.",
    id: "llama_3",
    profileName: "Llama 3 Instruct",
    stopSequences: ["<|eot_id|>", "<|end_of_text|>"],
    systemPrefix: "<|start_header_id|>system<|end_header_id|>\n\n",
    systemSuffix: "<|eot_id|>",
    userPrefix: "<|start_header_id|>user<|end_header_id|>\n\n",
    userSuffix: "<|eot_id|>",
  },
  {
    charPrefix: "",
    charSuffix: "</s><s>[INST] ",
    description: "Bracketed instruction style used by Mistral and Llama 2 variants.",
    id: "mistral_inst",
    profileName: "Mistral / Llama 2",
    stopSequences: ["</s>", "[INST]"],
    systemPrefix: "<s>[INST] <<SYS>>\n",
    systemSuffix: "\n<</SYS>>\n\n",
    userPrefix: "",
    userSuffix: " [/INST] ",
  },
  {
    charPrefix: "{{char}}: ",
    charSuffix: "\n",
    description: "Plain readable transcript layout for narrative or legacy local models.",
    id: "plain_transcript",
    profileName: "Plain Transcript",
    stopSequences: ["\n{{user}}:", "\n{{char}}:"],
    systemPrefix: "--- SYSTEM ---\n",
    systemSuffix: "\n\n",
    userPrefix: "{{user}}: ",
    userSuffix: "\n",
  },
];

export const SILLYTAVERN_STYLE_PROMPT_STACK = Object.freeze([
  {
    id: "main_prompt",
    label: "Main Prompt",
    layer: "main_system_prompt",
    order: 10,
    usuallyGoes: "Prompt manager or advanced formatting",
    mainlyControls: ["tone", "structure", "behaviour", "user autonomy"],
    meaning: "Global rules for how the roleplay should run.",
    editableByCreator: true,
  },
  {
    id: "char_description",
    label: "Char Description",
    layer: "character_prompt",
    order: 20,
    usuallyGoes: "Character card description field",
    mainlyControls: ["identity", "appearance", "background", "scenario texture"],
    meaning: "Who the character is, what they look like, and the concrete context the model should recognise.",
    editableByCreator: true,
  },
  {
    id: "char_personality",
    label: "Char Personality",
    layer: "character_prompt",
    order: 30,
    usuallyGoes: "Character card personality field",
    mainlyControls: ["personality", "psychology", "voice", "relationship behavior"],
    meaning: "The character's stable traits, internal logic, emotional defaults, and speech habits.",
    editableByCreator: true,
  },
  {
    id: "enhance_definitions",
    label: "Enhance Definitions",
    layer: "main_system_prompt",
    order: 40,
    usuallyGoes: "Prompt manager or system prompt extension",
    mainlyControls: ["continuity", "character development", "roleplay protocol"],
    meaning: "Additional global definitions that tell the runtime how to treat the card and preserve believable growth.",
    editableByCreator: true,
  },
  {
    id: "persona_description",
    label: "Persona Description",
    layer: "persona_prompt",
    order: 50,
    usuallyGoes: "User persona profile",
    mainlyControls: ["user persona context", "relationship matching", "personal continuity"],
    meaning: "The user's selected persona context, kept separate from the character's authored identity.",
    editableByCreator: false,
  },
  {
    id: "scenario",
    label: "Scenario",
    layer: "character_prompt",
    order: 60,
    usuallyGoes: "Character card scenario field",
    mainlyControls: ["scene premise", "opening tension", "current relationship status"],
    meaning: "The immediate roleplay setup and active context for the first scene or current scenario.",
    editableByCreator: true,
  },
  {
    id: "world_info_before",
    label: "World Info (before)",
    layer: "world_lore_prompt",
    order: 70,
    usuallyGoes: "Lorebook entries before examples and history",
    mainlyControls: ["lore priority", "setting rules", "early context grounding"],
    meaning: "High-priority lore injected before examples or recent chat so the model frames the scene correctly.",
    editableByCreator: true,
  },
  {
    id: "chat_examples",
    label: "Chat Examples",
    layer: "chat_examples_prompt",
    order: 80,
    usuallyGoes: "Character card example dialogue",
    mainlyControls: ["voice examples", "formatting examples", "interaction pattern"],
    meaning: "Sample exchanges that demonstrate tone, voice, and expected dialogue rhythm.",
    editableByCreator: true,
  },
  {
    id: "world_info_after",
    label: "World Info (after)",
    layer: "world_lore_prompt",
    order: 90,
    usuallyGoes: "Lorebook entries after examples",
    mainlyControls: ["late lore reminders", "active facts", "scene-specific context"],
    meaning: "Contextual lore injected closer to chat history for active facts and scene-specific reminders.",
    editableByCreator: true,
  },
  {
    id: "chat_history",
    label: "Chat History",
    layer: "chat_history_prompt",
    order: 100,
    usuallyGoes: "Recent messages and retrieved memories",
    mainlyControls: ["continuity", "recent events", "relationship state"],
    meaning: "The recent conversation, protected milestones, and retrieved memory context.",
    editableByCreator: false,
  },
  {
    id: "impersonation",
    label: "Impersonation",
    layer: "impersonation_prompt",
    order: 110,
    usuallyGoes: "Runtime prompt override for user-perspective turns",
    mainlyControls: ["user-perspective writing", "temporary role inversion"],
    meaning: "A special runtime-only prompt used when intentionally writing a {{user}} turn.",
    editableByCreator: false,
  },
  {
    id: "post_history_instructions",
    label: "Post-History Instructions",
    layer: "post_history_instructions",
    order: 120,
    usuallyGoes: "Post-history instructions field",
    mainlyControls: ["reply length", "pacing", "ending style", "last-step reminders"],
    meaning: "The final instructions sent right before reply generation, after character, lore, memory, and chat context.",
    editableByCreator: true,
  },
] as const satisfies readonly PromptStackBlockDefinition[]);
