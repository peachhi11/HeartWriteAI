import {
  CHARACTER_TEMPLATE_MODULES,
  compileCharacterTemplateCompactFieldMap,
  type CharacterTemplateFieldTarget,
  type CharacterTemplateModule,
  type CharacterTemplateTruthTier,
} from "./characterTemplateModules";

export const CHARACTER_TEMPLATE_TOKEN_ESTIMATE_CHARS_PER_TOKEN = 4;
export const DEFAULT_CHARACTER_TEMPLATE_TOKEN_BUDGET = 2400;
export const DEFAULT_CHARACTER_TEMPLATE_RESERVE_TOKENS = 400;

export type CharacterTemplateCondensationLevel =
  | "full"
  | "standard"
  | "compact"
  | "runtime_minimal";

export interface CompileCharacterTemplateCondensedOutlineOptions {
  includeAdultModule?: boolean;
  includePromptSafeRules?: boolean;
}

export interface CharacterTemplateTokenBudgetOptions
  extends CompileCharacterTemplateCondensedOutlineOptions {
  maxTokens?: number;
  reserveTokens?: number;
}

export interface CharacterTemplateModuleTokenEstimate {
  moduleNumber: number;
  id: string;
  label: string;
  fieldTarget: CharacterTemplateFieldTarget;
  truthTier: CharacterTemplateTruthTier;
  fullTokens: number;
  standardTokens: number;
  compactTokens: number;
  runtimeMinimalTokens: number;
  budgetShareTokens: number;
  recommendedLevel: CharacterTemplateCondensationLevel;
  included: boolean;
  reason: string;
}

export interface CharacterTemplateTokenBudgetReport {
  maxTokens: number;
  reserveTokens: number;
  usableTokens: number;
  selectedLevel: CharacterTemplateCondensationLevel;
  selectedTokens: number;
  fullTemplateTokens: number;
  standardTemplateTokens: number;
  compactTemplateTokens: number;
  runtimeMinimalTemplateTokens: number;
  moduleEstimates: readonly CharacterTemplateModuleTokenEstimate[];
  warnings: readonly string[];
  condensedOutline: string;
}

interface CharacterTemplateLevelEstimate {
  level: CharacterTemplateCondensationLevel;
  outline: string;
  tokens: number;
}

const CONDENSATION_LEVELS = [
  "full",
  "standard",
  "compact",
  "runtime_minimal",
] as const satisfies readonly CharacterTemplateCondensationLevel[];

export function estimateProfileTemplateTokens(value: string): number {
  const normalized = normalizePromptText(value);

  if (!normalized) {
    return 0;
  }

  return Math.max(
    1,
    Math.ceil(
      normalized.length / CHARACTER_TEMPLATE_TOKEN_ESTIMATE_CHARS_PER_TOKEN,
    ),
  );
}

export function compileCharacterTemplateCondensedOutline(
  level: CharacterTemplateCondensationLevel,
  options: CompileCharacterTemplateCondensedOutlineOptions = {},
): string {
  const modules = getBudgetedTemplateModules(options);

  if (level === "full") {
    return [
      "Character template scaffold: full planning view.",
      "Use this to collect authoring input. Do not paste this entire structure into runtime prompts.",
      ...modules.map((module) =>
        compileCharacterTemplateModuleAtLevel(module, "full", options),
      ),
    ].join("\n\n");
  }

  if (level === "standard") {
    return [
      "Character template scaffold: standard compiler view.",
      "Preserve module routing and truth tiers, then write prompt-facing output as compact natural prose.",
      ...modules.map((module) =>
        compileCharacterTemplateModuleAtLevel(module, "standard", options),
      ),
    ].join("\n\n");
  }

  if (level === "compact") {
    return [
      "Character template scaffold: compact prompt view.",
      "Use the modules as hidden routing. Flatten the output into concise prose.",
      "Route source material by field:",
      compileCharacterTemplateCompactFieldMap(),
      "",
      "Module routing:",
      ...modules.map((module) =>
        compileCharacterTemplateModuleAtLevel(module, "compact", options),
      ),
      "",
      "Generate Module 12 last, then place its compact overview first.",
      "If a rule says the character cannot or does not do something, include the replacement action they use instead.",
    ].join("\n");
  }

  return [
    "Character template scaffold: runtime-minimal guardrail.",
    "Use the twelve-module template as hidden authoring structure only.",
    "Modules 1-7 are portable character truth. Module 8 is runtime context. Module 9 is setting truth. Module 10 is story/NPC infrastructure. Module 11 is arc guidance. Module 12 is generated last and placed first.",
    "Prompt-facing output should be compact natural prose, not raw headings, IDs, or schema labels.",
    "Story-specific truth routes to lorebook/runtime. Setting truth routes to scenario. Character truth routes to card fields.",
    "Any constraint must include an allowed alternative action.",
    "Field map:",
    compileCharacterTemplateCompactFieldMap(),
  ].join("\n");
}

export function estimateCharacterTemplateTokenBudget(
  options: CharacterTemplateTokenBudgetOptions = {},
): CharacterTemplateTokenBudgetReport {
  const maxTokens = normalizeBudget(
    options.maxTokens,
    DEFAULT_CHARACTER_TEMPLATE_TOKEN_BUDGET,
  );
  const reserveTokens = normalizeBudget(
    options.reserveTokens,
    DEFAULT_CHARACTER_TEMPLATE_RESERVE_TOKENS,
    0,
  );
  const usableTokens = Math.max(1, maxTokens - reserveTokens);
  const estimates = CONDENSATION_LEVELS.map((level) =>
    estimateTemplateLevel(level, options),
  );
  const selected =
    estimates.find((estimate) => estimate.tokens <= usableTokens) ??
    estimates[estimates.length - 1];

  return {
    maxTokens,
    reserveTokens,
    usableTokens,
    selectedLevel: selected.level,
    selectedTokens: selected.tokens,
    fullTemplateTokens: tokenCountForLevel(estimates, "full"),
    standardTemplateTokens: tokenCountForLevel(estimates, "standard"),
    compactTemplateTokens: tokenCountForLevel(estimates, "compact"),
    runtimeMinimalTemplateTokens: tokenCountForLevel(
      estimates,
      "runtime_minimal",
    ),
    moduleEstimates: estimateTemplateModules(usableTokens, options),
    warnings: createTemplateBudgetWarnings(selected, estimates, usableTokens),
    condensedOutline: selected.outline,
  };
}

export function recommendCharacterTemplateCondensationLevel(
  maxTokens: number,
  options: Omit<CharacterTemplateTokenBudgetOptions, "maxTokens"> = {},
): CharacterTemplateCondensationLevel {
  return estimateCharacterTemplateTokenBudget({
    ...options,
    maxTokens,
  }).selectedLevel;
}

function estimateTemplateLevel(
  level: CharacterTemplateCondensationLevel,
  options: CompileCharacterTemplateCondensedOutlineOptions,
): CharacterTemplateLevelEstimate {
  const outline = compileCharacterTemplateCondensedOutline(level, options);

  return {
    level,
    outline,
    tokens: estimateProfileTemplateTokens(outline),
  };
}

function estimateTemplateModules(
  usableTokens: number,
  options: CompileCharacterTemplateCondensedOutlineOptions,
): readonly CharacterTemplateModuleTokenEstimate[] {
  const modules = getBudgetedTemplateModules(options);
  const budgetShareTokens = Math.max(
    1,
    Math.floor(usableTokens / modules.length),
  );

  return modules.map((module) => {
    const fullTokens = estimateProfileTemplateTokens(
      compileCharacterTemplateModuleAtLevel(module, "full", options),
    );
    const standardTokens = estimateProfileTemplateTokens(
      compileCharacterTemplateModuleAtLevel(module, "standard", options),
    );
    const compactTokens = estimateProfileTemplateTokens(
      compileCharacterTemplateModuleAtLevel(module, "compact", options),
    );
    const runtimeMinimalTokens = estimateProfileTemplateTokens(
      compileCharacterTemplateModuleAtLevel(
        module,
        "runtime_minimal",
        options,
      ),
    );
    const recommendedLevel = selectLevelForTokenCounts(
      {
        full: fullTokens,
        standard: standardTokens,
        compact: compactTokens,
        runtime_minimal: runtimeMinimalTokens,
      },
      budgetShareTokens,
    );

    return {
      moduleNumber: module.moduleNumber,
      id: module.id,
      label: module.label,
      fieldTarget: module.fieldTarget,
      truthTier: module.truthTier,
      fullTokens,
      standardTokens,
      compactTokens,
      runtimeMinimalTokens,
      budgetShareTokens,
      recommendedLevel,
      included: runtimeMinimalTokens <= budgetShareTokens,
      reason: createModuleBudgetReason(recommendedLevel, budgetShareTokens),
    };
  });
}

function compileCharacterTemplateModuleAtLevel(
  module: CharacterTemplateModule,
  level: CharacterTemplateCondensationLevel,
  options: CompileCharacterTemplateCondensedOutlineOptions,
): string {
  const includeRules = options.includePromptSafeRules ?? true;

  if (level === "full") {
    const sections = module.sections
      .map(
        (section) =>
          `- ${section.title}: ${section.prompts.join("; ")}`,
      )
      .join("\n");
    const rules =
      includeRules && module.promptSafeRules?.length
        ? `\nRules: ${module.promptSafeRules.join(" ")}`
        : "";

    return [
      `Module ${module.moduleNumber} - ${module.label}`,
      module.description,
      `Target: ${module.fieldTarget}; tier: ${module.truthTier}.`,
      `Use: ${module.outputUse}`,
      sections,
      rules,
    ].filter(Boolean).join("\n");
  }

  if (level === "standard") {
    const sectionTitles = module.sections
      .map((section) => section.title)
      .join(", ");
    const rules =
      includeRules && module.promptSafeRules?.length
        ? ` Rules: ${module.promptSafeRules.join(" ")}`
        : "";

    return [
      `Module ${module.moduleNumber} - ${module.label}`,
      `${module.description} ${module.outputUse}`,
      `Target: ${module.fieldTarget}; tier: ${module.truthTier}.`,
      `Sections: ${sectionTitles}.${rules}`,
    ].join("\n");
  }

  if (level === "compact") {
    return `Module ${module.moduleNumber} - ${module.label}: ${module.description} Target ${module.fieldTarget}; tier ${module.truthTier}.`;
  }

  return `Module ${module.moduleNumber} ${module.label} -> ${module.fieldTarget} (${module.truthTier}).`;
}

function getBudgetedTemplateModules(
  options: CompileCharacterTemplateCondensedOutlineOptions,
): readonly CharacterTemplateModule[] {
  if (options.includeAdultModule !== false) {
    return CHARACTER_TEMPLATE_MODULES;
  }

  return CHARACTER_TEMPLATE_MODULES.filter((module) => module.id !== "sexuality");
}

function selectLevelForTokenCounts(
  tokenCounts: Record<CharacterTemplateCondensationLevel, number>,
  usableTokens: number,
): CharacterTemplateCondensationLevel {
  return (
    CONDENSATION_LEVELS.find((level) => tokenCounts[level] <= usableTokens) ??
    "runtime_minimal"
  );
}

function tokenCountForLevel(
  estimates: readonly CharacterTemplateLevelEstimate[],
  level: CharacterTemplateCondensationLevel,
): number {
  return estimates.find((estimate) => estimate.level === level)?.tokens ?? 0;
}

function createTemplateBudgetWarnings(
  selected: CharacterTemplateLevelEstimate,
  estimates: readonly CharacterTemplateLevelEstimate[],
  usableTokens: number,
): readonly string[] {
  const fullTokens = tokenCountForLevel(estimates, "full");
  const runtimeMinimalTokens = tokenCountForLevel(estimates, "runtime_minimal");
  const warnings: string[] = [];

  if (selected.level !== "full") {
    warnings.push(
      `Full template is estimated at ${fullTokens} tokens; selected ${selected.level} to fit ${usableTokens} usable tokens.`,
    );
  }

  if (runtimeMinimalTokens > usableTokens) {
    warnings.push(
      `Runtime-minimal template still estimates at ${runtimeMinimalTokens} tokens, above the ${usableTokens} usable-token budget.`,
    );
  }

  if (usableTokens < 600) {
    warnings.push(
      "Template budget is very small; keep only routing rules and generate detailed prose outside the runtime prompt.",
    );
  }

  return warnings;
}

function createModuleBudgetReason(
  level: CharacterTemplateCondensationLevel,
  budgetShareTokens: number,
): string {
  if (level === "full") {
    return `Full module detail fits its ${budgetShareTokens}-token budget share.`;
  }

  if (level === "standard") {
    return `Use standard module detail for its ${budgetShareTokens}-token budget share.`;
  }

  if (level === "compact") {
    return `Use compact module routing for its ${budgetShareTokens}-token budget share.`;
  }

  return `Use runtime-minimal routing for its ${budgetShareTokens}-token budget share.`;
}

function normalizePromptText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeBudget(
  value: number | undefined,
  fallback: number,
  minimum = 1,
): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(minimum, Math.floor(value ?? fallback));
}
