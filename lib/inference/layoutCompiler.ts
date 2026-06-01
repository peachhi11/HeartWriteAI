import type { LlmChatMessage } from "@/lib/inference/llmConnector";
import type { PromptLayoutProfile } from "@/types/promptLayout";

export interface PromptLayoutMacros {
  char: string;
  user: string;
}

export function compilePromptLayout(
  messages: LlmChatMessage[],
  profile: PromptLayoutProfile,
  macros: PromptLayoutMacros,
) {
  return messages
    .map((message) => compilePromptLayoutMessage(message, profile, macros))
    .join("");
}

export function compilePromptLayoutMessage(
  message: LlmChatMessage,
  profile: PromptLayoutProfile,
  macros: PromptLayoutMacros,
) {
  const content = injectPromptLayoutMacros(message.content, macros);

  if (message.role === "system") {
    return [
      injectPromptLayoutMacros(profile.systemPrefix, macros),
      content,
      injectPromptLayoutMacros(profile.systemSuffix, macros),
    ].join("");
  }

  if (message.role === "user") {
    return [
      injectPromptLayoutMacros(profile.userPrefix, macros),
      content,
      injectPromptLayoutMacros(profile.userSuffix, macros),
    ].join("");
  }

  return [
    injectPromptLayoutMacros(profile.charPrefix, macros),
    content,
    injectPromptLayoutMacros(profile.charSuffix, macros),
  ].join("");
}

export function injectPromptLayoutMacros(text: string, macros: PromptLayoutMacros) {
  return text
    .replaceAll("{{user}}", macros.user)
    .replaceAll("{{char}}", macros.char);
}
