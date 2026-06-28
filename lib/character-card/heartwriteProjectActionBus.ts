import type { CharacterCreationForm } from "../../types/character-card/CharacterCreationForm";
import type { CharacterCardFormValues } from "../../types/character-card/CharacterCardFormValues";
import {
  CharacterCreationLorebookDraft,
  CharacterCreationScenarioTruthDraft,
  CharacterCreationTruthSeparatedOutputs,
  compileCharacterCreationFormToScenarioTruth,
  compileCharacterCreationFormToStoryLorebook,
  compileCharacterCreationFormToTruthSeparatedOutputs,
  findCharacterTruthLeakIssues,
} from "./characterCreationFormCompiler";

export type HeartWriteProjectActionId =
  | "card.compileTruth"
  | "lorebook.promoteStoryTruth"
  | "scenario.compileSettingTruth"
  | "runtime.auditContinuity"
  | "context.inspectPromptSources"
  | "export.packageCardBundle";

export type HeartWriteProjectActionRole =
  | "card_engineer"
  | "lorebook_compiler"
  | "scenario_architect"
  | "continuity_auditor"
  | "context_inspector"
  | "export_curator";

export type HeartWriteProjectTruthTier =
  | "character_truth"
  | "story_truth"
  | "setting_truth"
  | "runtime_context"
  | "export_bundle";

export type HeartWriteProjectArtifactKind =
  | "character_card_values"
  | "lorebook_v3"
  | "scenario_truth"
  | "continuity_audit"
  | "context_source_report"
  | "export_manifest";

export type HeartWriteProjectActionStatus =
  | "ok"
  | "needs_review"
  | "blocked";

export interface HeartWriteProjectActionSpec {
  id: HeartWriteProjectActionId;
  label: string;
  description: string;
  role: HeartWriteProjectActionRole;
  commandToken: string;
  sourceTiers: readonly HeartWriteProjectTruthTier[];
  outputTiers: readonly HeartWriteProjectTruthTier[];
  reviewRequired: boolean;
}

export interface HeartWriteProjectActionIssue {
  severity: "info" | "warning" | "error";
  message: string;
  source?: string;
}

export interface HeartWriteProjectArtifact<TData = unknown> {
  id: string;
  label: string;
  kind: HeartWriteProjectArtifactKind;
  tier: HeartWriteProjectTruthTier;
  sourceAction: HeartWriteProjectActionId;
  reviewRequired: boolean;
  data: TData;
}

export interface HeartWriteProjectLorebookSource {
  name?: string;
  entries: Array<{
    name?: string;
    content: string;
    keys?: string[];
    hiddenFromUser?: boolean;
    reviewRequired?: boolean;
  }>;
}

export interface HeartWriteProjectActionInput {
  form?: CharacterCreationForm;
  baseValues?: CharacterCardFormValues;
  recentMessages?: string[];
  runtimeNotes?: string[];
  activeLorebooks?: HeartWriteProjectLorebookSource[];
  exportTargets?: string[];
}

export interface HeartWriteContextSourceSummary {
  id: string;
  tier: HeartWriteProjectTruthTier;
  label: string;
  tokenEstimate: number;
  reviewRequired: boolean;
  hiddenFromUser: boolean;
  reason: string;
}

export interface HeartWriteContinuityAudit {
  passed: boolean;
  checkedTiers: HeartWriteProjectTruthTier[];
  issues: HeartWriteProjectActionIssue[];
}

export interface HeartWriteCardBundleManifest {
  targets: Array<{
    id: string;
    label: string;
    tier: HeartWriteProjectTruthTier;
    reviewRequired: boolean;
  }>;
  reviewChecklist: string[];
}

export interface HeartWriteProjectActionResult {
  action: HeartWriteProjectActionSpec;
  status: HeartWriteProjectActionStatus;
  promptSafeSummary: string;
  artifacts: HeartWriteProjectArtifact[];
  issues: HeartWriteProjectActionIssue[];
  nextActions: HeartWriteProjectActionId[];
}

export const HEARTWRITE_PROJECT_ACTIONS = [
  {
    id: "card.compileTruth",
    label: "Compile Character Truth",
    description:
      "Compile sectioned creation input into portable CCv3 card fields while keeping story and setting facts out of the character card.",
    role: "card_engineer",
    commandToken: "!card compile-truth",
    sourceTiers: ["character_truth", "story_truth", "setting_truth"],
    outputTiers: ["character_truth"],
    reviewRequired: false,
  },
  {
    id: "lorebook.promoteStoryTruth",
    label: "Promote Story Truth",
    description:
      "Move relationship, target-specific, shared-history, and runtime facts into review-required lorebook entries.",
    role: "lorebook_compiler",
    commandToken: "!lorebook promote-story-truth",
    sourceTiers: ["story_truth"],
    outputTiers: ["story_truth", "runtime_context"],
    reviewRequired: true,
  },
  {
    id: "scenario.compileSettingTruth",
    label: "Compile Setting Truth",
    description:
      "Compile location, social pressure, lifestyle, and world-facing context into scenario truth instead of card truth.",
    role: "scenario_architect",
    commandToken: "!scenario compile-setting-truth",
    sourceTiers: ["setting_truth"],
    outputTiers: ["setting_truth"],
    reviewRequired: false,
  },
  {
    id: "runtime.auditContinuity",
    label: "Audit Continuity Boundaries",
    description:
      "Check the projected artifacts for truth-tier leaks, missing story/setting outputs, and review-sensitive runtime material.",
    role: "continuity_auditor",
    commandToken: "!runtime audit-continuity",
    sourceTiers: [
      "character_truth",
      "story_truth",
      "setting_truth",
      "runtime_context",
    ],
    outputTiers: ["runtime_context"],
    reviewRequired: false,
  },
  {
    id: "context.inspectPromptSources",
    label: "Inspect Prompt Sources",
    description:
      "Summarize which card, lorebook, scenario, runtime, and recent-chat sources would feed an LLM prompt.",
    role: "context_inspector",
    commandToken: "!context inspect-prompt-sources",
    sourceTiers: [
      "character_truth",
      "story_truth",
      "setting_truth",
      "runtime_context",
    ],
    outputTiers: ["runtime_context"],
    reviewRequired: false,
  },
  {
    id: "export.packageCardBundle",
    label: "Package Card Bundle",
    description:
      "Create a review manifest for exporting card fields, story lorebook, scenario truth, and runtime audit together.",
    role: "export_curator",
    commandToken: "!export package-card-bundle",
    sourceTiers: [
      "character_truth",
      "story_truth",
      "setting_truth",
      "runtime_context",
    ],
    outputTiers: ["export_bundle"],
    reviewRequired: true,
  },
] as const satisfies readonly HeartWriteProjectActionSpec[];

const ACTION_SPECS_BY_ID = new Map(
  HEARTWRITE_PROJECT_ACTIONS.map((action) => [action.id, action]),
);

export function getHeartWriteProjectActionSpec(
  actionId: HeartWriteProjectActionId,
): HeartWriteProjectActionSpec {
  const action = ACTION_SPECS_BY_ID.get(actionId);
  if (!action) {
    throw new Error(`Unknown HeartWriteAI project action: ${actionId}`);
  }

  return action;
}

export function runHeartWriteProjectAction(
  actionId: HeartWriteProjectActionId,
  input: HeartWriteProjectActionInput = {},
): HeartWriteProjectActionResult {
  const action = getHeartWriteProjectActionSpec(actionId);

  switch (actionId) {
    case "card.compileTruth":
      return runCardCompileTruth(action, input);
    case "lorebook.promoteStoryTruth":
      return runLorebookPromoteStoryTruth(action, input);
    case "scenario.compileSettingTruth":
      return runScenarioCompileSettingTruth(action, input);
    case "runtime.auditContinuity":
      return runRuntimeAuditContinuity(action, input);
    case "context.inspectPromptSources":
      return runContextInspectPromptSources(action, input);
    case "export.packageCardBundle":
      return runExportPackageCardBundle(action, input);
  }
}

function runCardCompileTruth(
  action: HeartWriteProjectActionSpec,
  input: HeartWriteProjectActionInput,
): HeartWriteProjectActionResult {
  const separated = compileRequiredForm(action, input);
  if (!separated) return blockedMissingForm(action);

  const issues = separated.leakIssues.map((message) => ({
    severity: "error" as const,
    message,
    source: "character_truth",
  }));

  return {
    action,
    status: issues.length ? "needs_review" : "ok",
    promptSafeSummary: issues.length
      ? "Character truth compiled with leak issues that need review."
      : "Character truth compiled into portable card fields with no detected story or setting leaks.",
    artifacts: [
      createArtifact(
        action.id,
        "character-card-values",
        "Portable CCv3 Card Fields",
        "character_card_values",
        "character_truth",
        separated.characterCardValues,
        issues.length > 0,
      ),
    ],
    issues,
    nextActions: [
      "lorebook.promoteStoryTruth",
      "scenario.compileSettingTruth",
      "runtime.auditContinuity",
    ],
  };
}

function runLorebookPromoteStoryTruth(
  action: HeartWriteProjectActionSpec,
  input: HeartWriteProjectActionInput,
): HeartWriteProjectActionResult {
  if (!input.form) return blockedMissingForm(action);

  const lorebook = compileCharacterCreationFormToStoryLorebook(input.form);
  const issues: HeartWriteProjectActionIssue[] =
    lorebook.data.entries.length === 0
      ? [
          {
            severity: "warning",
            message:
              "No story-specific relationship or target override entries were produced.",
            source: "story_truth",
          },
        ]
      : [];

  return {
    action,
    status: "needs_review",
    promptSafeSummary: `Promoted ${lorebook.data.entries.length} story truth entries into a review-required lorebook draft.`,
    artifacts: [
      createArtifact(
        action.id,
        "story-truth-lorebook",
        "Story Truth Lorebook",
        "lorebook_v3",
        "story_truth",
        lorebook,
        true,
      ),
    ],
    issues,
    nextActions: ["runtime.auditContinuity", "context.inspectPromptSources"],
  };
}

function runScenarioCompileSettingTruth(
  action: HeartWriteProjectActionSpec,
  input: HeartWriteProjectActionInput,
): HeartWriteProjectActionResult {
  if (!input.form) return blockedMissingForm(action);

  const scenario = compileCharacterCreationFormToScenarioTruth(input.form);
  const issues: HeartWriteProjectActionIssue[] =
    scenario.settingTruths.length === 0
      ? [
          {
            severity: "warning",
            message: "No setting truth lines were produced.",
            source: "setting_truth",
          },
        ]
      : [];

  return {
    action,
    status: issues.length ? "needs_review" : "ok",
    promptSafeSummary: `Compiled ${scenario.settingTruths.length} setting truth lines into scenario context.`,
    artifacts: [
      createArtifact(
        action.id,
        "setting-truth-scenario",
        "Setting Truth Scenario",
        "scenario_truth",
        "setting_truth",
        scenario,
        issues.length > 0,
      ),
    ],
    issues,
    nextActions: ["context.inspectPromptSources", "export.packageCardBundle"],
  };
}

function runRuntimeAuditContinuity(
  action: HeartWriteProjectActionSpec,
  input: HeartWriteProjectActionInput,
): HeartWriteProjectActionResult {
  const separated = input.form
    ? compileCharacterCreationFormToTruthSeparatedOutputs(
        input.form,
        input.baseValues,
      )
    : undefined;
  const issues: HeartWriteProjectActionIssue[] = [];

  if (!separated) {
    issues.push({
      severity: "warning",
      message:
        "No creation form was provided, so card/lorebook/scenario boundary checks were skipped.",
      source: "runtime_context",
    });
  } else {
    issues.push(
      ...separated.leakIssues.map((message) => ({
        severity: "error" as const,
        message,
        source: "character_truth",
      })),
    );
    issues.push(
      ...findCharacterTruthLeakIssues(
        JSON.stringify(separated.characterCardValues),
      ).map((message) => ({
        severity: "error" as const,
        message,
        source: "character_truth",
      })),
    );

    if (separated.storyLorebook.data.entries.length === 0) {
      issues.push({
        severity: "warning",
        message:
          "Story truth lorebook has no entries; check whether relationship-specific material was intentionally absent.",
        source: "story_truth",
      });
    }

    if (separated.scenario.settingTruths.length === 0) {
      issues.push({
        severity: "warning",
        message:
          "Scenario truth has no setting lines; check whether setting material was intentionally absent.",
        source: "setting_truth",
      });
    }
  }

  const audit: HeartWriteContinuityAudit = {
    passed: !issues.some((issue) => issue.severity === "error"),
    checkedTiers: [
      "character_truth",
      "story_truth",
      "setting_truth",
      "runtime_context",
    ],
    issues,
  };

  return {
    action,
    status: audit.passed
      ? issues.length
        ? "needs_review"
        : "ok"
      : "needs_review",
    promptSafeSummary: audit.passed
      ? `Continuity audit passed with ${issues.length} review notes.`
      : `Continuity audit found ${issues.length} issues requiring review.`,
    artifacts: [
      createArtifact(
        action.id,
        "continuity-audit",
        "Continuity Boundary Audit",
        "continuity_audit",
        "runtime_context",
        audit,
        issues.length > 0,
      ),
    ],
    issues,
    nextActions: ["context.inspectPromptSources", "export.packageCardBundle"],
  };
}

function runContextInspectPromptSources(
  action: HeartWriteProjectActionSpec,
  input: HeartWriteProjectActionInput,
): HeartWriteProjectActionResult {
  const sources = buildContextSourceSummaries(input);
  const issues: HeartWriteProjectActionIssue[] =
    sources.length === 0
      ? [
          {
            severity: "warning",
            message: "No prompt sources were available to inspect.",
            source: "runtime_context",
          },
        ]
      : [];

  return {
    action,
    status: issues.length ? "needs_review" : "ok",
    promptSafeSummary: `Inspected ${sources.length} prompt source groups across truth tiers.`,
    artifacts: [
      createArtifact(
        action.id,
        "prompt-source-report",
        "Prompt Source Report",
        "context_source_report",
        "runtime_context",
        {
          sources,
          totalTokenEstimate: sources.reduce(
            (total, source) => total + source.tokenEstimate,
            0,
          ),
        },
        sources.some((source) => source.reviewRequired),
      ),
    ],
    issues,
    nextActions: ["runtime.auditContinuity", "export.packageCardBundle"],
  };
}

function runExportPackageCardBundle(
  action: HeartWriteProjectActionSpec,
  input: HeartWriteProjectActionInput,
): HeartWriteProjectActionResult {
  const separated = compileRequiredForm(action, input);
  if (!separated) return blockedMissingForm(action);

  const contextSources = buildContextSourceSummaries(input);
  const audit = runRuntimeAuditContinuity(
    getHeartWriteProjectActionSpec("runtime.auditContinuity"),
    input,
  );
  const targets = [
    {
      id: "ccv3-card-fields",
      label: "CCv3 Card Fields",
      tier: "character_truth" as const,
      reviewRequired: separated.leakIssues.length > 0,
    },
    {
      id: "story-lorebook-v3",
      label: "Story Lorebook V3",
      tier: "story_truth" as const,
      reviewRequired: true,
    },
    {
      id: "scenario-truth",
      label: "Scenario Truth",
      tier: "setting_truth" as const,
      reviewRequired: separated.scenario.settingTruths.length === 0,
    },
    {
      id: "continuity-audit",
      label: "Continuity Audit",
      tier: "runtime_context" as const,
      reviewRequired: audit.issues.length > 0,
    },
    {
      id: "prompt-source-report",
      label: "Prompt Source Report",
      tier: "runtime_context" as const,
      reviewRequired: contextSources.some((source) => source.reviewRequired),
    },
  ];
  const manifest: HeartWriteCardBundleManifest = {
    targets,
    reviewChecklist: [
      "Confirm card fields contain only portable character truth.",
      "Review hidden lorebook entries before shipping target-specific overrides.",
      "Confirm scenario truth can be swapped without rewriting the card.",
      "Run continuity audit before export.",
    ],
  };

  return {
    action,
    status: audit.issues.some((issue) => issue.severity === "error")
      ? "needs_review"
      : "ok",
    promptSafeSummary: `Prepared a bundle manifest with ${targets.length} export targets.`,
    artifacts: [
      createArtifact(
        action.id,
        "card-bundle-manifest",
        "Card Bundle Manifest",
        "export_manifest",
        "export_bundle",
        manifest,
        true,
      ),
      createArtifact(
        action.id,
        "card-bundle-card-values",
        "Bundled CCv3 Card Fields",
        "character_card_values",
        "character_truth",
        separated.characterCardValues,
        separated.leakIssues.length > 0,
      ),
      createArtifact(
        action.id,
        "card-bundle-story-lorebook",
        "Bundled Story Lorebook",
        "lorebook_v3",
        "story_truth",
        separated.storyLorebook,
        true,
      ),
      createArtifact(
        action.id,
        "card-bundle-scenario",
        "Bundled Scenario Truth",
        "scenario_truth",
        "setting_truth",
        separated.scenario,
        separated.scenario.settingTruths.length === 0,
      ),
    ],
    issues: audit.issues,
    nextActions: [],
  };
}

function compileRequiredForm(
  action: HeartWriteProjectActionSpec,
  input: HeartWriteProjectActionInput,
): CharacterCreationTruthSeparatedOutputs | undefined {
  if (!input.form) return undefined;

  return compileCharacterCreationFormToTruthSeparatedOutputs(
    input.form,
    input.baseValues,
  );
}

function blockedMissingForm(
  action: HeartWriteProjectActionSpec,
): HeartWriteProjectActionResult {
  const issue = {
    severity: "error" as const,
    message: "A character creation form is required for this project action.",
    source: "character_creation_form",
  };

  return {
    action,
    status: "blocked",
    promptSafeSummary: "Action blocked because no character creation form was provided.",
    artifacts: [],
    issues: [issue],
    nextActions: [],
  };
}

function createArtifact<TData>(
  sourceAction: HeartWriteProjectActionId,
  id: string,
  label: string,
  kind: HeartWriteProjectArtifactKind,
  tier: HeartWriteProjectTruthTier,
  data: TData,
  reviewRequired: boolean,
): HeartWriteProjectArtifact<TData> {
  return {
    id,
    label,
    kind,
    tier,
    sourceAction,
    reviewRequired,
    data,
  };
}

function buildContextSourceSummaries(
  input: HeartWriteProjectActionInput,
): HeartWriteContextSourceSummary[] {
  const sources: HeartWriteContextSourceSummary[] = [];

  if (input.form) {
    const separated = compileCharacterCreationFormToTruthSeparatedOutputs(
      input.form,
      input.baseValues,
    );
    addSeparatedOutputSources(sources, separated);
  }

  for (const [lorebookIndex, lorebook] of (input.activeLorebooks ?? []).entries()) {
    for (const [entryIndex, entry] of lorebook.entries.entries()) {
      const label = entry.name?.trim() || `Lorebook Entry ${entryIndex + 1}`;
      sources.push({
        id: `active-lorebook-${lorebookIndex + 1}-entry-${entryIndex + 1}`,
        tier: entry.hiddenFromUser ? "runtime_context" : "story_truth",
        label: `${lorebook.name?.trim() || "Active Lorebook"}: ${label}`,
        tokenEstimate: estimateTokens(entry.content),
        reviewRequired: entry.reviewRequired ?? false,
        hiddenFromUser: entry.hiddenFromUser ?? false,
        reason: entry.keys?.length
          ? `Active through keys: ${entry.keys.join(", ")}`
          : "Active lorebook source.",
      });
    }
  }

  if (input.recentMessages?.length) {
    sources.push({
      id: "recent-messages",
      tier: "runtime_context",
      label: "Recent Messages",
      tokenEstimate: estimateTokens(input.recentMessages.join("\n")),
      reviewRequired: false,
      hiddenFromUser: true,
      reason: "Short-term chat context.",
    });
  }

  if (input.runtimeNotes?.length) {
    sources.push({
      id: "runtime-notes",
      tier: "runtime_context",
      label: "Runtime Notes",
      tokenEstimate: estimateTokens(input.runtimeNotes.join("\n")),
      reviewRequired: true,
      hiddenFromUser: true,
      reason: "Internal runtime notes need review before export.",
    });
  }

  return sources;
}

function addSeparatedOutputSources(
  sources: HeartWriteContextSourceSummary[],
  separated: CharacterCreationTruthSeparatedOutputs,
) {
  sources.push({
    id: "compiled-character-truth",
    tier: "character_truth",
    label: "Compiled Character Truth",
    tokenEstimate: estimateTokens(
      [
        separated.characterCardValues.description,
        separated.characterCardValues.personalityPsychology,
        separated.characterCardValues.relationshipsConnections,
        separated.characterCardValues.speechStyle,
      ].join("\n"),
    ),
    reviewRequired: separated.leakIssues.length > 0,
    hiddenFromUser: false,
    reason: "Portable CCv3 fields.",
  });

  addLorebookSources(sources, separated.storyLorebook);
  addScenarioSource(sources, separated.scenario);
}

function addLorebookSources(
  sources: HeartWriteContextSourceSummary[],
  lorebook: CharacterCreationLorebookDraft,
) {
  for (const [index, entry] of lorebook.data.entries.entries()) {
    sources.push({
      id: `story-lorebook-entry-${index + 1}`,
      tier: entry.extensions.heartwriteai.hiddenFromUser
        ? "runtime_context"
        : "story_truth",
      label: `Story Lorebook: ${entry.name}`,
      tokenEstimate: estimateTokens(entry.content),
      reviewRequired: entry.extensions.heartwriteai.reviewRequired,
      hiddenFromUser: entry.extensions.heartwriteai.hiddenFromUser,
      reason: entry.extensions.heartwriteai.hiddenFromUser
        ? "Target-specific runtime override."
        : "Scenario-specific relationship truth.",
    });
  }
}

function addScenarioSource(
  sources: HeartWriteContextSourceSummary[],
  scenario: CharacterCreationScenarioTruthDraft,
) {
  if (!scenario.content.trim()) {
    return;
  }

  sources.push({
    id: "scenario-setting-truth",
    tier: "setting_truth",
    label: scenario.title,
    tokenEstimate: estimateTokens(scenario.content),
    reviewRequired: false,
    hiddenFromUser: false,
    reason: "Scenario and setting context.",
  });
}

function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.trim().length / 4));
}
