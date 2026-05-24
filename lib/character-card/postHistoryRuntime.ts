import { z } from "zod";

import { RelationshipStateSchema } from "../chat/relationshipState.schema";
import { loreEntryRuntimeSchema } from "./lorebookParser";
import {
  createSensoryPerceptionContext,
  resolvePhysicalTellGateMatches,
  resolveSensoryGateMatches,
  SensoryEventStateSchema,
  SensoryPerceptionSchema,
} from "./sensoryPerception";

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

export const physicalTellRuntimeStateSchema = z
  .object({
    currentTurn: z.number().int().min(0).optional(),
    lastUsedTurns: z.record(z.string(), z.number().int().min(0)).default({}),
    maxSelected: z.number().int().min(0).max(5).default(2),
  })
  .default({
    lastUsedTurns: {},
    maxSelected: 2,
  });

export const chatRequestSchema = z.object({
  characterConfig: z
    .object({
      loreEntries: z.array(loreEntryRuntimeSchema).optional(),
      postHistory: postHistoryRuntimeSchema.optional(),
      postHistoryInstructions: postHistoryRuntimeSchema.optional(),
      relationshipState: RelationshipStateSchema.optional(),
      sensoryEventState: SensoryEventStateSchema.optional(),
      sensoryPerception: SensoryPerceptionSchema.optional(),
      physicalTellState: physicalTellRuntimeStateSchema.optional(),
    })
    .optional(),
  messages: z.array(chatMessageSchema),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type PostHistoryRuntime = z.infer<typeof postHistoryRuntimeSchema>;
export type SensoryRuntime = z.infer<typeof SensoryPerceptionSchema>;

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
    "- PERSISTENT PARSING DIRECTION: Write {{char}}'s next reply in an immersive, character-driven roleplay with {{user}}. Output ONLY {{char}}'s immediate response as exactly one reply. Treat these rules as higher priority than preceding chat-history patterns. Never write thoughts, actions, decisions, or dialogue for {{user}}. Do not write or simulate {{user}} under any circumstances. Stop immediately before {{user}} would need to respond, narrate, make a choice, or speak.",
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

export function appendSensoryPerceptionContext(
  messages: ChatMessage[],
  sensoryPerception: SensoryRuntime | undefined,
  events: z.infer<typeof SensoryEventStateSchema> = {},
  physicalTellState: z.infer<typeof physicalTellRuntimeStateSchema> = {
    lastUsedTurns: {},
    maxSelected: 2,
  },
): ChatMessage[] {
  if (!sensoryPerception) {
    return messages;
  }

  const latestUserMessage =
    [...messages].reverse().find((message) => message.role === "user")
      ?.content ?? "";
  const matchedGates = resolveSensoryGateMatches(
    latestUserMessage,
    sensoryPerception,
    events,
  );
  const matchedPhysicalTellGates = resolvePhysicalTellGateMatches(
    latestUserMessage,
    sensoryPerception,
    events,
    physicalTellState,
  );
  const content = createSensoryPerceptionContext(
    sensoryPerception,
    matchedGates,
    matchedPhysicalTellGates,
  );

  return [
    ...messages,
    {
      role: "system",
      content,
    },
  ];
}

function formatRuntimeRules(rules: string[]) {
  return rules.length ? rules.join(" | ") : "No additional runtime rule.";
}
