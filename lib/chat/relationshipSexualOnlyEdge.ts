import { z } from "zod";

const score = z.coerce.number().min(0).max(100);
const signedScore = z.coerce.number().min(-100).max(100);

export const SexualOnlyEdgeKindSchema = z.enum([
  "hookup",
  "casual",
  "friends_with_benefits",
  "secret_sexual",
  "tension_based",
  "avoidant_sexual",
  "attachment_denial",
  "obsessive_sexual",
]);

export const SexualOnlyEdgeEventTypeSchema = z.enum([
  "hookup",
  "repeat_intimacy",
  "aftercare",
  "post_intimacy_withdrawal",
  "jealousy",
  "denies_feelings",
  "asks_what_are_we",
  "sees_char_with_other",
  "exclusivity_talk",
  "romantic_confession",
]);

export const SexualOnlyEdgeSchema = z.object({
  id: z.string().trim().min(3),
  aId: z.string().trim().min(1),
  bId: z.string().trim().min(1),
  kind: SexualOnlyEdgeKindSchema.default("casual"),
  sexualChemistry: score.default(60),
  romanticFeeling: score.default(0),
  emotionalAttachment: score.default(10),
  sexualTrust: score.default(40),
  exclusivityAmbiguity: score.default(70),
  jealousy: score.default(0),
  attachmentDriftRisk: score.default(35),
  definitionAvoidance: score.default(60),
  vulnerabilityLeakage: score.default(0),
  postIntimacyWithdrawal: score.default(0),
  romanticEscalationProbability: score.default(10),
  momentum: z
    .object({
      sexual: signedScore.default(0),
      attachment: signedScore.default(0),
      instability: signedScore.default(0),
      drift: signedScore.default(0),
    })
    .default({
      sexual: 0,
      attachment: 0,
      instability: 0,
      drift: 0,
    }),
  flags: z
    .object({
      sexualIntimacyOccurred: z.boolean().default(false),
      feelingsDenied: z.boolean().default(false),
      exclusivityTalkNeeded: z.boolean().default(false),
      romanticLeakageDetected: z.boolean().default(false),
    })
    .default({
      sexualIntimacyOccurred: false,
      feelingsDenied: false,
      exclusivityTalkNeeded: false,
      romanticLeakageDetected: false,
  }),
  memories: z.array(z.string().trim().min(1)).default([]),
  pinnedMemories: z.array(z.string().trim().min(1)).default([]),
});

export const SexualOnlyEdgeEventSchema = z.object({
  id: z.string().trim().min(1),
  timestamp: z.number(),
  edgeId: z.string().trim().min(3).optional(),
  aId: z.string().trim().min(1),
  bId: z.string().trim().min(1),
  type: SexualOnlyEdgeEventTypeSchema,
  summary: z.string().trim().min(1),
  emotionalWeight: score.default(50),
  tags: z.array(z.string().trim().min(1)).default([]),
});

export type SexualOnlyEdgeKind = z.infer<typeof SexualOnlyEdgeKindSchema>;
export type SexualOnlyEdgeEventType = z.infer<
  typeof SexualOnlyEdgeEventTypeSchema
>;
export type SexualOnlyEdge = z.infer<typeof SexualOnlyEdgeSchema>;
export type SexualOnlyEdgeEvent = z.infer<typeof SexualOnlyEdgeEventSchema>;

type NumericSexualOnlyEdgeKey = {
  [Key in keyof SexualOnlyEdge]: SexualOnlyEdge[Key] extends number ? Key : never;
}[keyof SexualOnlyEdge];

export function sexualOnlyEdgeId(aId: string, bId: string) {
  return [aId, bId].sort().join(":");
}

export function createDefaultSexualOnlyEdge(input: {
  aId: string;
  bId: string;
  kind?: SexualOnlyEdgeKind;
}) {
  return SexualOnlyEdgeSchema.parse({
    id: sexualOnlyEdgeId(input.aId, input.bId),
    aId: input.aId,
    bId: input.bId,
    kind: input.kind ?? "casual",
  });
}

export function updateSexualOnlyEdgeFromEvent(
  current: SexualOnlyEdge,
  event: SexualOnlyEdgeEvent | SexualOnlyEdgeEventType,
) {
  const edge = SexualOnlyEdgeSchema.parse(structuredClone(current));
  const eventType = typeof event === "string" ? event : event.type;

  switch (eventType) {
    case "hookup":
      edge.flags.sexualIntimacyOccurred = true;
      addEdgeScore(edge, "sexualChemistry", 10);
      addEdgeScore(edge, "sexualTrust", 5);
      addMomentum(edge, "sexual", 12);
      break;
    case "repeat_intimacy":
      addEdgeScore(edge, "emotionalAttachment", 5);
      addEdgeScore(edge, "vulnerabilityLeakage", 4);
      addEdgeScore(edge, "attachmentDriftRisk", 4);
      addEdgeScore(edge, "romanticEscalationProbability", 4);
      addMomentum(edge, "attachment", 6);
      break;
    case "aftercare":
      addEdgeScore(edge, "sexualTrust", 10);
      addEdgeScore(edge, "emotionalAttachment", 8);
      addEdgeScore(edge, "vulnerabilityLeakage", 6);
      addEdgeScore(edge, "attachmentDriftRisk", 6);
      addMomentum(edge, "attachment", 5);
      break;
    case "post_intimacy_withdrawal":
      addEdgeScore(edge, "postIntimacyWithdrawal", 15);
      addEdgeScore(edge, "definitionAvoidance", 8);
      addEdgeScore(edge, "exclusivityAmbiguity", 6);
      addMomentum(edge, "instability", 10);
      break;
    case "jealousy":
      addEdgeScore(edge, "jealousy", 12);
      addEdgeScore(edge, "emotionalAttachment", 5);
      addEdgeScore(edge, "romanticEscalationProbability", 8);
      edge.flags.romanticLeakageDetected = true;
      break;
    case "denies_feelings":
      edge.flags.feelingsDenied = true;
      addEdgeScore(edge, "definitionAvoidance", 12);
      addEdgeScore(edge, "postIntimacyWithdrawal", 6);
      addMomentum(edge, "drift", 8);
      break;
    case "asks_what_are_we":
      edge.flags.exclusivityTalkNeeded = true;
      addEdgeScore(edge, "romanticEscalationProbability", 12);
      addEdgeScore(edge, "exclusivityAmbiguity", -15);
      addMomentum(edge, "attachment", 8);
      break;
    case "sees_char_with_other":
      addEdgeScore(edge, "jealousy", 20);
      addEdgeScore(edge, "attachmentDriftRisk", 10);
      addMomentum(edge, "instability", 18);
      edge.flags.exclusivityTalkNeeded = true;
      break;
    case "exclusivity_talk":
      addEdgeScore(edge, "exclusivityAmbiguity", -30);
      addEdgeScore(edge, "sexualTrust", 10);
      edge.flags.exclusivityTalkNeeded = false;
      addMomentum(edge, "instability", -10);
      break;
    case "romantic_confession":
      addEdgeScore(edge, "romanticFeeling", 30);
      addEdgeScore(edge, "emotionalAttachment", 20);
      addEdgeScore(edge, "romanticEscalationProbability", 25);
      edge.flags.romanticLeakageDetected = true;
      addMomentum(edge, "attachment", 18);
      break;
  }

  if (typeof event !== "string") {
    const pinned = isPinnedSexualOnlyEvent(event);

    if (event.emotionalWeight >= 70 || pinned) {
      if (pinned) {
        edge.pinnedMemories = unique([...edge.pinnedMemories, event.id]);
      }

      edge.memories = compactMemoryIds(edge.memories, event.id, edge.pinnedMemories);
    }
  }

  edge.attachmentDriftRisk = Math.max(
    edge.attachmentDriftRisk,
    calculateAttachmentDriftRisk(edge),
  );
  edge.romanticEscalationProbability = Math.max(
    edge.romanticEscalationProbability,
    calculateRomanticEscalationProbability(edge),
  );
  edge.kind = resolveSexualOnlyEdgeKind(edge);

  return SexualOnlyEdgeSchema.parse(edge);
}

export function resolveSexualOnlyEdgeKind(edge: SexualOnlyEdge): SexualOnlyEdgeKind {
  if (edge.romanticFeeling >= 70 || edge.romanticEscalationProbability >= 80) {
    return "attachment_denial";
  }

  if (edge.jealousy >= 70 || edge.momentum.instability >= 70) {
    return "obsessive_sexual";
  }

  if (edge.postIntimacyWithdrawal >= 60 && edge.definitionAvoidance >= 55) {
    return "avoidant_sexual";
  }

  if (edge.exclusivityAmbiguity >= 75 && edge.vulnerabilityLeakage >= 45) {
    return "secret_sexual";
  }

  if (edge.sexualChemistry >= 75 && edge.romanticFeeling < 25) {
    return "tension_based";
  }

  if (
    edge.emotionalAttachment >= 22 &&
    edge.vulnerabilityLeakage >= 8 &&
    edge.sexualChemistry >= 45
  ) {
    return "friends_with_benefits";
  }

  if (edge.flags.sexualIntimacyOccurred && edge.emotionalAttachment < 25) {
    return "hookup";
  }

  return edge.kind === "hookup" ? "casual" : edge.kind;
}

function calculateAttachmentDriftRisk(edge: SexualOnlyEdge) {
  return clamp(
    edge.emotionalAttachment * 0.3 +
      edge.vulnerabilityLeakage * 0.25 +
      edge.jealousy * 0.2 +
      edge.exclusivityAmbiguity * 0.1 +
      edge.definitionAvoidance * 0.1 +
      Math.max(0, edge.momentum.attachment) * 0.15,
  );
}

function calculateRomanticEscalationProbability(edge: SexualOnlyEdge) {
  return clamp(
    edge.romanticFeeling * 0.35 +
      edge.emotionalAttachment * 0.25 +
      edge.vulnerabilityLeakage * 0.2 +
      edge.jealousy * 0.1 +
      edge.attachmentDriftRisk * 0.1,
  );
}

function addEdgeScore(
  edge: SexualOnlyEdge,
  key: NumericSexualOnlyEdgeKey,
  delta: number,
) {
  edge[key] = clamp(edge[key] + delta) as never;
}

function addMomentum(
  edge: SexualOnlyEdge,
  key: keyof SexualOnlyEdge["momentum"],
  delta: number,
) {
  edge.momentum[key] = clamp(edge.momentum[key] + delta, -100, 100);
}

function compactMemoryIds(
  currentIds: string[],
  nextId: string,
  pinnedIds: string[],
  maxMemories = 80,
) {
  const pinned = new Set(pinnedIds);
  const ids = unique([...currentIds, nextId]);
  const pinnedCurrent = ids.filter((id) => pinned.has(id));
  const regular = ids
    .filter((id) => !pinned.has(id))
    .slice(-(Math.max(0, maxMemories - pinnedCurrent.length)));

  return unique([...pinnedCurrent, ...regular]);
}

function isPinnedSexualOnlyEvent(event: SexualOnlyEdgeEvent) {
  return (
    event.type === "romantic_confession" ||
    event.type === "exclusivity_talk" ||
    event.tags.some((tag) => isPinnedMemoryTag(tag))
  );
}

function isPinnedMemoryTag(tag: string) {
  return [
    "anchor",
    "anchored",
    "important",
    "memory_anchor",
    "milestone",
    "permanent",
    "pinned",
    "story_beat",
  ].includes(tag.trim().toLowerCase());
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}
