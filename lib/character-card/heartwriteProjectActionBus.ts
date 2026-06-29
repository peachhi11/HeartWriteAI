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
  parseCharacterCreationForm,
} from "./characterCreationFormCompiler";
import {
  CanonFact,
  CanonHardConstraint,
  CanonMemoryAnchor,
  ContinuityCanonLedger,
  auditContinuityCanonLedger,
  createContinuityCanonLedger,
  createContinuityCanonLedgerFromNarrativeRuntime,
} from "./continuityCanonLedger";
import type { NarrativeRuntimeState } from "./narrativeEngine";

export type HeartWriteProjectActionId =
  | "card.compileTruth"
  | "lorebook.promoteStoryTruth"
  | "scenario.compileSettingTruth"
  | "runtime.auditContinuity"
  | "runtime.compileCanonLedger"
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
  | "continuity_canon_ledger"
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
  narrativeRuntime?: NarrativeRuntimeState;
  continuityLedger?: ContinuityCanonLedger;
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
    id: "runtime.compileCanonLedger",
    label: "Compile Canon Ledger",
    description:
      "Compile character, story, setting, runtime, and memory sources into one prompt-safe continuity canon ledger.",
    role: "continuity_auditor",
    commandToken: "!runtime compile-canon-ledger",
    sourceTiers: [
      "character_truth",
      "story_truth",
      "setting_truth",
      "runtime_context",
    ],
    outputTiers: ["runtime_context"],
    reviewRequired: true,
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
    case "runtime.compileCanonLedger":
      return runRuntimeCompileCanonLedger(action, input);
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

function runRuntimeCompileCanonLedger(
  action: HeartWriteProjectActionSpec,
  input: HeartWriteProjectActionInput,
): HeartWriteProjectActionResult {
  if (!input.form && !input.narrativeRuntime && !input.continuityLedger) {
    return {
      action,
      status: "blocked",
      promptSafeSummary:
        "Action blocked because no creation form, narrative runtime, or existing canon ledger was provided.",
      artifacts: [],
      issues: [
        {
          severity: "error",
          message:
            "A form, narrative runtime, or existing canon ledger is required to compile continuity canon.",
          source: "runtime_context",
        },
      ],
      nextActions: [],
    };
  }

  const ledger = buildContinuityCanonLedgerForActionInput(input);
  const ledgerIssues = auditContinuityCanonLedger(ledger).map((issue) => ({
    severity: issue.severity,
    message: issue.message,
    source: issue.field,
  }));

  return {
    action,
    status: ledgerIssues.some((issue) => issue.severity === "error")
      ? "needs_review"
      : ledgerIssues.length
        ? "needs_review"
        : "ok",
    promptSafeSummary:
      `Compiled continuity canon with ${ledger.facts.length} facts, ` +
      `${ledger.timeline.length} timeline anchors, ` +
      `${ledger.memoryAnchors.length} memory anchors, and ` +
      `${ledger.hardConstraints.length} hard constraints.`,
    artifacts: [
      createArtifact(
        action.id,
        "continuity-canon-ledger",
        "Continuity Canon Ledger",
        "continuity_canon_ledger",
        "runtime_context",
        ledger,
        ledgerIssues.length > 0,
      ),
    ],
    issues: ledgerIssues,
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
  const canonLedger = buildContinuityCanonLedgerForActionInput(input);
  const canonLedgerIssues = auditContinuityCanonLedger(canonLedger);
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
      id: "continuity-canon-ledger",
      label: "Continuity Canon Ledger",
      tier: "runtime_context" as const,
      reviewRequired: canonLedgerIssues.length > 0,
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
      "Review the continuity canon ledger for runtime-only state before export.",
      "Run continuity audit before export.",
    ],
  };

  return {
    action,
    status:
      audit.issues.some((issue) => issue.severity === "error") ||
      canonLedgerIssues.length > 0
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
      createArtifact(
        action.id,
        "card-bundle-continuity-canon-ledger",
        "Bundled Continuity Canon Ledger",
        "continuity_canon_ledger",
        "runtime_context",
        canonLedger,
        canonLedgerIssues.length > 0,
      ),
    ],
    issues: [
      ...audit.issues,
      ...canonLedgerIssues.map((issue) => ({
        severity: issue.severity,
        message: issue.message,
        source: issue.field,
      })),
    ],
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

function buildContinuityCanonLedgerForActionInput(
  input: HeartWriteProjectActionInput,
): ContinuityCanonLedger {
  const form = input.form ? parseCharacterCreationForm(input.form) : undefined;
  const characterName = form?.identity.characterName.trim() || "Character";
  const characterId = slugProjectId(characterName);
  const baseLedger = input.narrativeRuntime
    ? createContinuityCanonLedgerFromNarrativeRuntime(input.narrativeRuntime, {
        id: input.continuityLedger?.id,
        characterId,
      })
    : createContinuityCanonLedger({
        id:
          input.continuityLedger?.id ??
          `canon-ledger:${characterId || "character"}`,
        characterId,
      });
  const facts: CanonFact[] = [...baseLedger.facts];
  const hardConstraints: CanonHardConstraint[] = [
    ...baseLedger.hardConstraints,
  ];
  const memoryAnchors: CanonMemoryAnchor[] = [
    ...baseLedger.memoryAnchors,
  ];

  if (input.continuityLedger) {
    facts.push(...input.continuityLedger.facts);
    hardConstraints.push(...input.continuityLedger.hardConstraints);
    memoryAnchors.push(...input.continuityLedger.memoryAnchors);
  }

  if (form) {
    const separated = compileCharacterCreationFormToTruthSeparatedOutputs(
      form,
      input.baseValues,
    );
    facts.push(
      ...separated.storyLorebook.data.entries.map((entry, index) =>
        createCanonFact({
          id: `story-lorebook:${index + 1}`,
          category: "relationship",
          scope: entry.extensions.heartwriteai.hiddenFromUser
            ? "runtime_context"
            : "story_truth",
          statement: entry.content,
          sourceLabel: `Story Lorebook: ${entry.name}`,
          reviewRequired: entry.extensions.heartwriteai.reviewRequired,
          hiddenFromUser: entry.extensions.heartwriteai.hiddenFromUser,
          promptVisibility: "review_required",
          tags: entry.keys,
        }),
      ),
      ...separated.scenario.settingTruths.map((truth, index) =>
        createCanonFact({
          id: `setting-truth:${index + 1}`,
          category: "world",
          scope: "setting_truth",
          statement: truth,
          sourceLabel: separated.scenario.title,
          reviewRequired: false,
          hiddenFromUser: false,
          promptVisibility: "prompt_safe",
          tags: ["setting_truth"],
        }),
      ),
    );

    hardConstraints.push(
      ...form.characterEngine.decisionRules
        .filter((rule) => rule.constraints.trim() || rule.question.trim())
        .map((rule, index) => ({
          id: rule.id.trim()
            ? `engine-rule:${slugProjectId(rule.id)}`
            : `engine-rule:${index + 1}`,
          label: rule.drive.trim() || rule.question.trim() || `Decision Rule ${index + 1}`,
          rule: [
            rule.question.trim(),
            rule.constraints.trim(),
          ]
            .filter(Boolean)
            .join(" Constraint: "),
          alternativeAction:
            rule.alternativeAction.trim() ||
            rule.visibleBehaviors.trim() ||
            undefined,
          source: {
            tier: "character_truth" as const,
            label: "Character Engine",
            reviewRequired: false,
            hiddenFromUser: false,
          },
          scope: "character_truth" as const,
          tags: ["character_engine", "decision_rule"],
          promptVisibility: "prompt_safe" as const,
        })),
    );
  }

  for (const [lorebookIndex, lorebook] of (input.activeLorebooks ?? []).entries()) {
    for (const [entryIndex, entry] of lorebook.entries.entries()) {
      facts.push(
        createCanonFact({
          id: `active-lorebook:${lorebookIndex + 1}:${entryIndex + 1}`,
          category: "relationship",
          scope: entry.hiddenFromUser ? "runtime_context" : "story_truth",
          statement: entry.content,
          sourceLabel: `${lorebook.name?.trim() || "Active Lorebook"}: ${
            entry.name?.trim() || `Entry ${entryIndex + 1}`
          }`,
          reviewRequired: entry.reviewRequired ?? false,
          hiddenFromUser: entry.hiddenFromUser ?? false,
          promptVisibility: entry.reviewRequired
            ? "review_required"
            : "prompt_safe",
          tags: entry.keys ?? [],
        }),
      );
    }
  }

  for (const [index, note] of (input.runtimeNotes ?? []).entries()) {
    memoryAnchors.push({
      id: `runtime-note:${index + 1}`,
      tier: "relationship_memory",
      summary: note,
      meaning: "Creator-supplied runtime note.",
      stateImpact: "Use only as private continuity guidance.",
      emotionalWeight: 55,
      turn: baseLedger.currentTurn,
      tags: ["runtime_note"],
      pinned: false,
      promptVisibility: "review_required",
    });
  }

  return createContinuityCanonLedger({
    ...baseLedger,
    currentTurn: input.narrativeRuntime?.turn ?? baseLedger.currentTurn,
    characterStates: [
      ...baseLedger.characterStates,
      ...(form
        ? [
            {
              characterId,
              displayName: characterName,
              location:
                form.lifestyle.residence.trim() ||
                form.identity.birthplace.trim() ||
                undefined,
              mentalState:
                form.psychology.baselineAffect.trim() ||
                form.characterEngine.coreBelief.trim() ||
                undefined,
              currentGoal:
                form.cognitiveDrivers.motivation.trim() ||
                form.behaviour.goalOrientedActions.trim() ||
                undefined,
              knowledge: form.semanticSeedIds,
              constraints: [
                form.relationships.behavioralFriction.boundaries,
                form.characterEngine.behavioralTriggers,
              ]
                .map((value) => value.trim())
                .filter(Boolean),
              updatedAtTurn: baseLedger.currentTurn,
            },
          ]
        : []),
    ],
    relationshipStates: [
      ...baseLedger.relationshipStates,
      ...(form
        ? [
            {
              id: `relationship:${characterId}:primary`,
              participantIds: [characterName, "{{user}}"],
              publicStatus:
                form.relationships.affiliationCore.publicStatus.trim() ||
                undefined,
              privateStatus:
                form.relationships.emotionalBonds.attachmentType.trim() ||
                undefined,
              stage: input.narrativeRuntime?.relationshipStage,
              trustLevel:
                form.relationships.emotionalBonds.trustMetric.trim() ||
                undefined,
              tensionLevel:
                form.relationships.behavioralFriction.ideologicalClash.trim() ||
                undefined,
              openLoops: [
                form.relationships.emotionalBonds.sharedHistoryAnchor,
                form.relationships.behavioralFriction.microAggressionsOrTells,
              ]
                .map((value) => value.trim())
                .filter(Boolean),
              boundaries: [
                form.relationships.behavioralFriction.boundaries,
              ]
                .map((value) => value.trim())
                .filter(Boolean),
              updatedAtTurn: baseLedger.currentTurn,
            },
          ]
        : []),
    ],
    facts,
    memoryAnchors,
    hardConstraints,
    tags: ["continuity_canon", ...baseLedger.tags],
  });
}

function createCanonFact(input: {
  id: string;
  category: CanonFact["category"];
  scope: CanonFact["scope"];
  statement: string;
  sourceLabel: string;
  reviewRequired: boolean;
  hiddenFromUser: boolean;
  promptVisibility: CanonFact["promptVisibility"];
  tags: readonly string[];
}): CanonFact {
  return {
    id: input.id,
    category: input.category,
    scope: input.scope,
    statement: input.statement,
    source: {
      tier: input.scope,
      label: input.sourceLabel,
      reviewRequired: input.reviewRequired,
      hiddenFromUser: input.hiddenFromUser,
    },
    evidence: [],
    tags: [...input.tags],
    active: input.statement.trim().length > 0,
    confidence: 80,
    promptVisibility: input.promptVisibility,
    hiddenFromUser: input.hiddenFromUser,
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

  if (input.continuityLedger) {
    sources.push({
      id: "continuity-canon-ledger",
      tier: "runtime_context",
      label: "Continuity Canon Ledger",
      tokenEstimate: estimateTokens(JSON.stringify(input.continuityLedger)),
      reviewRequired:
        auditContinuityCanonLedger(input.continuityLedger).length > 0,
      hiddenFromUser: true,
      reason:
        "Compiled continuity canon for character state, relationship history, timeline anchors, facts, and constraints.",
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

function slugProjectId(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9{}]+/g, "-")
    .replace(/^-+|-+$/g, "") || "character";
}
