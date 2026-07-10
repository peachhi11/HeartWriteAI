export type AiWritePolicy = "open" | "review" | "locked";

export type AiWriteDecisionStatus = "applied" | "staged" | "rejected";

export type KnowledgeInjectionStrategy =
  | "constant_context"
  | "semantic_retrieval"
  | "manual_only"
  | "disabled";

export type PortablePackageKind =
  | "character_bundle"
  | "lorebook"
  | "scenario"
  | "runtime_snapshot"
  | "semantic_graph"
  | "workflow";

export interface AiWritableArtifact<TContent = string> {
  id: string;
  label: string;
  policy: AiWritePolicy;
  content: TContent;
  category?: string;
  reviewReason?: string;
  metadata?: Record<string, unknown>;
}

export interface AiWriteProposal<TContent = string> {
  artifactId: string;
  proposedContent: TContent;
  summary: string;
  sourceAction: string;
  createdAt?: string;
}

export interface AiWritePolicyDecision<TContent = string> {
  status: AiWriteDecisionStatus;
  policy: AiWritePolicy;
  artifact: AiWritableArtifact<TContent>;
  stagedProposal?: AiWriteProposal<TContent>;
  promptSafeMessage: string;
}

export interface KnowledgeRoutingRule {
  id: string;
  label: string;
  strategy: KnowledgeInjectionStrategy;
  description: string;
  includeInPrompt: boolean;
  requiresSemanticMatch?: boolean;
  reviewRequired?: boolean;
  hiddenFromUser?: boolean;
}

export interface PortablePackageManifest {
  packageKind: PortablePackageKind;
  name: string;
  version: string;
  createdAt: string;
  includes: readonly string[];
  omits: readonly string[];
  reviewRequired: readonly string[];
  sourceIds: readonly string[];
}

export interface CreatePortablePackageManifestInput {
  packageKind: PortablePackageKind;
  name: string;
  version?: string;
  createdAt?: string;
  includes: readonly string[];
  omits?: readonly string[];
  reviewRequired?: readonly string[];
  sourceIds?: readonly string[];
}

export interface SemanticTagBoostSettings {
  semanticFloor: number;
  denseWeight: number;
  sparseWeight: number;
  tagBoost: number;
  maxScore: number;
}

export interface SemanticTagBoostInput {
  cosineSimilarity: number;
  sparseScore?: number;
  hasTagMatch?: boolean;
  settings?: Partial<SemanticTagBoostSettings>;
}

export interface SemanticTagBoostResult {
  passesSemanticFloor: boolean;
  fusionScore: number;
  reason: string;
}

export const DEFAULT_PORTABLE_PACKAGE_OMITS = [
  "api_keys",
  "local_file_paths",
  "raw_runtime_scores",
  "unreviewed_drafts",
  "private_agent_notes",
] as const;

export const DEFAULT_SEMANTIC_TAG_BOOST_SETTINGS = {
  semanticFloor: 0.42,
  denseWeight: 0.75,
  sparseWeight: 0.15,
  tagBoost: 0.1,
  maxScore: 1,
} as const satisfies SemanticTagBoostSettings;

export function resolveAiWritePolicyDecision<TContent>(
  artifact: AiWritableArtifact<TContent>,
  proposal: AiWriteProposal<TContent>,
): AiWritePolicyDecision<TContent> {
  if (artifact.id !== proposal.artifactId) {
    return {
      status: "rejected",
      policy: artifact.policy,
      artifact,
      promptSafeMessage:
        `${artifact.label} was not changed because the proposal targeted a different source.`,
    };
  }

  if (artifact.policy === "locked") {
    return {
      status: "rejected",
      policy: artifact.policy,
      artifact,
      stagedProposal: proposal,
      promptSafeMessage:
        `${artifact.label} is locked reference material. Read it for context, but keep its approved wording unless a human changes it.`,
    };
  }

  if (artifact.policy === "review") {
    return {
      status: "staged",
      policy: artifact.policy,
      artifact,
      stagedProposal: proposal,
      promptSafeMessage:
        `${artifact.label} has a staged AI proposal. Treat it as draft material until review is complete.`,
    };
  }

  return {
    status: "applied",
    policy: artifact.policy,
    artifact: {
      ...artifact,
      content: proposal.proposedContent,
    },
    promptSafeMessage:
      `${artifact.label} accepted an AI update because the source is open for low-risk maintenance changes.`,
  };
}

export function compileAiWritePolicyPromptLine(
  artifact: AiWritableArtifact,
): string {
  const subject = artifact.category
    ? `${artifact.label} ${artifact.category}`
    : artifact.label;

  if (artifact.policy === "locked") {
    return `${subject} is fixed reference. Use it for context, but do not alter or supersede it.`;
  }

  if (artifact.policy === "review") {
    return `${subject} may receive AI suggestions. Unreviewed proposals stay draft-only and must not become canon.`;
  }

  return `${subject} may be updated by AI only when the new content is explicit, low-risk, and supported by project context.`;
}

export function compileKnowledgeRoutingPrompt(
  rules: readonly KnowledgeRoutingRule[],
): string {
  const lines = rules
    .filter((rule) => rule.includeInPrompt && rule.strategy !== "disabled")
    .map(formatKnowledgeRoutingRule);

  if (!lines.length) return "";

  return [
    "Knowledge routing:",
    ...lines,
    "Use routed knowledge as compact background guidance, not as dialogue or visible diagnostics.",
  ].join("\n");
}

export function createPortablePackageManifest(
  input: CreatePortablePackageManifestInput,
): PortablePackageManifest {
  return {
    packageKind: input.packageKind,
    name: input.name.trim(),
    version: input.version?.trim() || "draft",
    createdAt: input.createdAt?.trim() || "unspecified",
    includes: uniqueText(input.includes),
    omits: uniqueText([
      ...DEFAULT_PORTABLE_PACKAGE_OMITS,
      ...(input.omits ?? []),
    ]),
    reviewRequired: uniqueText(input.reviewRequired ?? []),
    sourceIds: uniqueText(input.sourceIds ?? []),
  };
}

export function compilePortablePackageManifestSummary(
  manifest: PortablePackageManifest,
): string {
  const includes = manifest.includes.length
    ? manifest.includes.join(", ")
    : "no exportable artifacts";
  const omits = manifest.omits.length
    ? manifest.omits.join(", ")
    : "nothing";
  const review = manifest.reviewRequired.length
    ? ` Review before release: ${manifest.reviewRequired.join(", ")}.`
    : " No review blockers are listed.";

  return [
    `${manifest.name} is a ${humanizeId(manifest.packageKind)} package at ${manifest.version}.`,
    `Includes: ${includes}.`,
    `Omits: ${omits}.`,
    review,
  ].join(" ");
}

export function scoreSemanticTagBoost(
  input: SemanticTagBoostInput,
): SemanticTagBoostResult {
  const settings = {
    ...DEFAULT_SEMANTIC_TAG_BOOST_SETTINGS,
    ...(input.settings ?? {}),
  };
  const cosineSimilarity = clamp01(input.cosineSimilarity);
  const sparseScore = clamp01(input.sparseScore ?? 0);

  if (cosineSimilarity < settings.semanticFloor) {
    return {
      passesSemanticFloor: false,
      fusionScore: 0,
      reason: "Semantic floor not met; tags cannot rescue this candidate.",
    };
  }

  const fusionScore = Math.min(
    settings.maxScore,
    cosineSimilarity * settings.denseWeight +
      sparseScore * settings.sparseWeight +
      (input.hasTagMatch ? settings.tagBoost : 0),
  );

  return {
    passesSemanticFloor: true,
    fusionScore: roundToFour(fusionScore),
    reason: input.hasTagMatch
      ? "Semantic floor met; tag match applied as a ranking boost."
      : "Semantic floor met; ranked by semantic and sparse scores.",
  };
}

function formatKnowledgeRoutingRule(rule: KnowledgeRoutingRule): string {
  const strategy = describeKnowledgeStrategy(rule.strategy);
  const review = rule.reviewRequired
    ? " Keep unreviewed output draft-only."
    : "";
  const semantic = rule.requiresSemanticMatch
    ? " Require a meaning match before injection."
    : "";

  return `- ${rule.label}: ${strategy} ${rule.description}${semantic}${review}`;
}

function describeKnowledgeStrategy(
  strategy: KnowledgeInjectionStrategy,
): string {
  if (strategy === "constant_context") {
    return "Keep active in every prompt.";
  }
  if (strategy === "semantic_retrieval") {
    return "Retrieve only when the current scene meaning matches.";
  }
  if (strategy === "manual_only") {
    return "Use only when selected by the writer or workflow.";
  }

  return "Do not inject into prompt context.";
}

function humanizeId(value: string): string {
  return value.replace(/_/g, " ");
}

function uniqueText(values: readonly string[]): readonly string[] {
  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter((value) => value.length > 0),
    ),
  );
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function roundToFour(value: number): number {
  return Math.round(value * 10000) / 10000;
}
