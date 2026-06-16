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

export type PromptCardQcChecklistItemId =
  | "negation_alternative_action"
  | "action_over_label_ratio"
  | "field_visibility"
  | "physical_and_rule_constraints"
  | "token_distance_reinforcement"
  | "user_agency_boundary";

export interface PromptCardQcChecklistItem {
  id: PromptCardQcChecklistItemId;
  label: string;
  description: string;
  check: string;
  failureMode: string;
  recommendedFix: string;
  promptLayers: readonly PromptLayer[];
}

export type PromptCompilerRuleId =
  | "foundation_durable_identity"
  | "examples_behavioral_range"
  | "post_history_concrete_reminders"
  | "negative_constraints_need_alternatives";

export interface PromptCompilerRule {
  id: PromptCompilerRuleId;
  label: string;
  description: string;
  sourceLayers: readonly PromptLayer[];
  targetLayers: readonly PromptLayer[];
  compilerBehavior: string;
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

export const PROMPT_CARD_QC_CHECKLIST = Object.freeze([
  {
    id: "negation_alternative_action",
    label: "Negative Constraint Alternative",
    description:
      "Any cannot, does not, refuses, avoids, or never constraint must include what the character does instead.",
    check:
      "Search for hard negative constraints and verify a nearby positive behavior, tool, signal, routine, or replacement action.",
    failureMode:
      "The model attends to the blocked concept and drifts back into the unwanted action or trait.",
    recommendedFix:
      "Rewrite toward observable alternatives: writes, gestures, waits, delegates, verifies, redirects, keeps distance, or asks for help.",
    promptLayers: [
      "character_prompt",
      "main_system_prompt",
      "post_history_instructions",
    ],
  },
  {
    id: "action_over_label_ratio",
    label: "Action Over Labels",
    description:
      "Abstract traits should compile into visible actions, body language, dialogue posture, or decision habits.",
    check:
      "For each important label, look for at least one concrete behavior the model can perform on the next turn.",
    failureMode:
      "The card tells the model what the character is but not how to enact them.",
    recommendedFix:
      "Add physical tells, choices under pressure, repeated routines, speech habits, and scene behaviors.",
    promptLayers: ["character_prompt", "chat_examples_prompt"],
  },
  {
    id: "field_visibility",
    label: "Field Visibility",
    description:
      "Critical persistent facts must live in fields that remain visible for the intended runtime mode.",
    check:
      "Verify solo, group, compact, and export modes keep essential identity, constraints, and current situation in active fields.",
    failureMode:
      "Important traits vanish when a mode excludes personality, scenario, examples, or late notes.",
    recommendedFix:
      "Place durable facts in description for compact/group modes and reserve deeper fields for solo/deep modes.",
    promptLayers: [
      "character_prompt",
      "world_lore_prompt",
      "post_history_instructions",
    ],
  },
  {
    id: "physical_and_rule_constraints",
    label: "Constraint Alternatives",
    description:
      "Body, access, protocol, status, oath, sensory, and setting limits need practical behavior routes.",
    check:
      "When a character cannot or will not do something, confirm the card gives an alternative action path.",
    failureMode:
      "The model treats constraints as obstacles to overcome instead of rules that shape behavior.",
    recommendedFix:
      "Add what they use, how they adapt, who they ask, where they wait, or what procedure they follow.",
    promptLayers: ["character_prompt", "world_lore_prompt"],
  },
  {
    id: "token_distance_reinforcement",
    label: "Token Distance Reinforcement",
    description:
      "Long-running traits need lightweight reinforcement closer to generation when they matter in the current scene.",
    check:
      "Confirm immediate physical tells, route gates, and active constraints can be restated near post-history without full card repetition.",
    failureMode:
      "Foundational traits fade after enough chat history or are overridden by recent scene momentum.",
    recommendedFix:
      "Emit compact PHI reminders for current concrete behaviors, pacing, and constraints.",
    promptLayers: ["post_history_instructions", "chat_history_prompt"],
  },
  {
    id: "user_agency_boundary",
    label: "User Agency Boundary",
    description:
      "Card and runtime prompts must not write {{user}} decisions, feelings, intentions, or dialogue unless an impersonation mode is active.",
    check:
      "Search generated prompts for assumptions about {{user}} reactions or choices.",
    failureMode:
      "The card steals player agency or forces relationship progress.",
    recommendedFix:
      "Frame hooks as invitations, available pressures, or character perceptions instead of user-authored outcomes.",
    promptLayers: [
      "main_system_prompt",
      "character_prompt",
      "post_history_instructions",
      "impersonation_prompt",
    ],
  },
] as const satisfies readonly PromptCardQcChecklistItem[]);

export const CARD_PROMPT_COMPILER_RULES = Object.freeze([
  {
    id: "foundation_durable_identity",
    label: "Foundation Fields Hold Durable Identity",
    description:
      "Identity, stable personality, wound architecture, current situation, and hard constraints belong early in card-facing fields.",
    sourceLayers: ["character_prompt", "world_lore_prompt"],
    targetLayers: ["character_prompt"],
    compilerBehavior:
      "Compile durable facts into description/personality/scenario prose before runtime-only reminders are added.",
  },
  {
    id: "examples_behavioral_range",
    label: "Examples Demonstrate Behavioral Range",
    description:
      "Example dialogue should show voice, restraint, conflict behavior, care behavior, and interaction rhythm rather than repeat biography.",
    sourceLayers: ["chat_examples_prompt", "character_prompt"],
    targetLayers: ["chat_examples_prompt"],
    compilerBehavior:
      "Prefer examples that demonstrate how traits act under pressure, tenderness, refusal, repair, and uncertainty.",
  },
  {
    id: "post_history_concrete_reminders",
    label: "Post-History Carries Immediate Behaviors",
    description:
      "PHI should stay short and concrete: reply length, pacing, active route gate, physical tells, and current constraints.",
    sourceLayers: [
      "character_prompt",
      "chat_history_prompt",
      "post_history_instructions",
    ],
    targetLayers: ["post_history_instructions"],
    compilerBehavior:
      "Move only currently relevant, concrete behaviors near generation; do not paste the whole card into PHI.",
  },
  {
    id: "negative_constraints_need_alternatives",
    label: "Negative Constraints Need Alternative Actions",
    description:
      "A cannot/does not/never/refuses rule must compile with the behavior that replaces the blocked action.",
    sourceLayers: [
      "character_prompt",
      "world_lore_prompt",
      "post_history_instructions",
    ],
    targetLayers: [
      "character_prompt",
      "post_history_instructions",
    ],
    compilerBehavior:
      "When a seed contains a negative constraint, emit a positive route such as Do instead: writes, gestures, waits, delegates, checks, signals, or redirects.",
  },
] as const satisfies readonly PromptCompilerRule[]);
