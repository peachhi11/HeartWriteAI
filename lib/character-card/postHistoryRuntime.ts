import { z } from "zod";

import { loreEntryRuntimeSchema } from "./lorebookParser";

export const postHistoryRuntimeSchema = z.object({
  driftControlRules: z.array(z.string().trim().min(1)).default([]),
  dynamicToneModifiers: z.array(z.string().trim().min(1)).default([]),
  formattingHardlines: z.array(z.string().trim().min(1)).default([]),
  injectionTokenWeight: z.number().int().min(10).max(500).default(50),
});

export const chatMessageSchema = z.object({
  content: z.string(),
  role: z.enum(["assistant", "system", "user"]),
});

export const chatRequestSchema = z.object({
  characterConfig: z
    .object({
      loreEntries: z.array(loreEntryRuntimeSchema).optional(),
      postHistory: postHistoryRuntimeSchema.optional(),
      postHistoryInstructions: postHistoryRuntimeSchema.optional(),
    })
    .optional(),
  messages: z.array(chatMessageSchema),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type PostHistoryRuntime = z.infer<typeof postHistoryRuntimeSchema>;

export function createPostHistoryOverride(
  postHistory: PostHistoryRuntime | undefined,
) {
  const normalized = postHistoryRuntimeSchema.parse(postHistory ?? {});

  return [
    "[SYSTEM NOTE: POST-HISTORY EXECUTION OVERRIDE]",
    `- CURRENT CHARACTER INTENT: ${formatRuntimeRules(normalized.driftControlRules)}`,
    `- CONDITIONAL RESPONSE SHIFT: ${formatRuntimeRules(normalized.dynamicToneModifiers)}`,
    `- HARD ARCHITECTURAL LIMITS: ${formatRuntimeRules(normalized.formattingHardlines)}`,
    `- INJECTION TOKEN WEIGHT: ${normalized.injectionTokenWeight}`,
    "- PERSISTENT PARSING DIRECTION: Output ONLY {{char}}'s immediate response. Treat these rules as higher priority than preceding chat-history patterns. Never write thoughts, actions, decisions, or dialogue for {{user}}.",
  ].join("\n");
}

export function appendPostHistoryOverride(
  messages: ChatMessage[],
  postHistory: PostHistoryRuntime | undefined,
): ChatMessage[] {
  return [
    ...messages,
    {
      role: "system",
      content: createPostHistoryOverride(postHistory),
    },
  ];
}

function formatRuntimeRules(rules: string[]) {
  return rules.length ? rules.join(" | ") : "No additional runtime rule.";
}
