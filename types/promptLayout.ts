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
