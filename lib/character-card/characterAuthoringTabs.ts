import type {
  CharacterCreationForm,
  CharacterEngineDecisionRule,
} from "../../types/character-card/CharacterCreationForm";

export interface WriterBibleAuthoringProjection {
  source: "character_creation_form";
  tier: "writer_reference";
  promptFacing: false;
  compiledReference: string;
  writerBible: CharacterCreationForm["writerBible"];
}

export interface CharacterEngineAuthoringProjection {
  source: "character_creation_form";
  tier: "character_truth";
  promptFacing: true;
  compiledRuntimeGuidance: string;
  decisionRuleIssues: string[];
  characterEngine: CharacterCreationForm["characterEngine"];
}

export function createWriterBibleAuthoringProjection(
  form: CharacterCreationForm,
): WriterBibleAuthoringProjection {
  return {
    source: "character_creation_form",
    tier: "writer_reference",
    promptFacing: false,
    writerBible: form.writerBible,
    compiledReference: compileWriterBibleForHumanReference(form),
  };
}

export function createCharacterEngineAuthoringProjection(
  form: CharacterCreationForm,
): CharacterEngineAuthoringProjection {
  return {
    source: "character_creation_form",
    tier: "character_truth",
    promptFacing: true,
    characterEngine: form.characterEngine,
    compiledRuntimeGuidance: compileCharacterEngineForRuntime(form),
    decisionRuleIssues: findCharacterEngineDecisionRuleIssues(form),
  };
}

export function compileWriterBibleForHumanReference(
  form: CharacterCreationForm,
): string {
  const bible = form.writerBible;

  return createSections([
    createSection("Writer Bible", [
      createLine("Project Title", bible.projectTitle),
      createLine("Human Summary", bible.humanSummary),
      createLine("Themes", bible.themes),
    ]),
    createSection("Reference Context", [
      createLine("World Reference", bible.worldReference),
      createLine("Character Reference", bible.characterReference),
      createLine("Relationship Arc", bible.relationshipArc),
    ]),
    createSection("Writing Notes", [
      createLine("Style Notes", bible.styleNotes),
      createLine("Active Threads", bible.activeThreads),
      createLine("Source Notes", bible.sourceNotes),
    ]),
  ]);
}

export function compileCharacterEngineForRuntime(
  form: CharacterCreationForm,
): string {
  const engine = form.characterEngine;
  const decisionRules = engine.decisionRules
    .map((rule, index) =>
      compileCharacterEngineDecisionRuleForRuntime(rule, index),
    )
    .filter(Boolean);

  return createPromptParagraph([
    createPromptSentence(
      engine.coreWound,
      (value) => `${value} remains part of the character's emotional operating system.`,
    ),
    createPromptSentence(
      engine.coreBelief,
      (value) => `The character believes ${lowercaseFirst(value)}`,
    ),
    createPromptSentence(
      engine.coreFear,
      (value) => `${value} is one of the character's central fears.`,
    ),
    createPromptSentence(
      engine.primaryDrive,
      (value) => `${value} drives the character's choices when pressure rises.`,
    ),
    ...decisionRules,
    createPromptSentence(
      engine.defenseMechanisms,
      (value) => `Under stress, the character tends to use ${lowercaseFirst(value)}`,
    ),
    createPromptSentence(
      engine.attachmentStyle,
      (value) => `Attachment forms through ${lowercaseFirst(value)}`,
    ),
    createPromptSentence(
      engine.behavioralTriggers,
      (value) => `${value} can shift the character's behavior quickly.`,
    ),
    createPromptSentence(
      engine.relationshipDynamics,
      (value) => `Relationships tend to organize around ${lowercaseFirst(value)}`,
    ),
    createPromptSentence(
      engine.speechRules,
      (value) => `Speech follows this rule: ${lowercaseFirst(value)}`,
    ),
    createPromptSentence(
      engine.sexualityRules,
      (value) => `Intimacy follows this rule: ${lowercaseFirst(value)}`,
    ),
  ]);
}

export function compileCharacterEngineDecisionRule(
  rule: CharacterEngineDecisionRule,
  index = 0,
): string {
  const label = rule.id.trim() || `decision_rule_${index + 1}`;
  const lines = [
    createLine("Drive", rule.drive),
    createLine("Question", rule.question),
    createLine("YES", rule.yes),
    createLine("NO", rule.no),
    createLine("Constraints", rule.constraints),
    createLine("Visible Behaviors", rule.visibleBehaviors),
    createLine("Alternative Action", rule.alternativeAction),
  ].filter(Boolean);

  return lines.length > 0 ? `${label}:\n${lines.join("\n")}` : "";
}

export function compileCharacterEngineDecisionRuleForRuntime(
  rule: CharacterEngineDecisionRule,
  index = 0,
): string {
  const drive = normalizeWhitespace(rule.drive);
  const question = normalizeWhitespace(rule.question);
  const yes = normalizeWhitespace(rule.yes);
  const no = normalizeWhitespace(rule.no);
  const constraints = normalizeWhitespace(rule.constraints);
  const visibleBehaviors = normalizeWhitespace(rule.visibleBehaviors);
  const alternativeAction = normalizeWhitespace(rule.alternativeAction);
  const label = normalizeWhitespace(rule.id) || `decision rule ${index + 1}`;
  const parts = [
    drive && question
      ? `${drive} asks, "${stripTerminalPunctuation(question)}?"`
      : drive || question,
    yes ? `If the answer is yes, ${lowercaseFirst(yes)}` : "",
    no ? `If the answer is no, ${lowercaseFirst(no)}` : "",
    constraints ? `This is constrained by ${lowercaseFirst(constraints)}` : "",
    visibleBehaviors
      ? `This shows through ${lowercaseFirst(visibleBehaviors)}`
      : "",
    alternativeAction
      ? `When blocked, the character should ${lowercaseFirst(alternativeAction)}`
      : "",
  ].filter(Boolean);

  return parts.length
    ? ensureSentence(parts.join(" "))
    : `${label} is present but needs more behavioral detail.`;
}

export function findCharacterEngineDecisionRuleIssues(
  form: CharacterCreationForm,
): string[] {
  const issues: string[] = [];

  form.characterEngine.decisionRules.forEach((rule, index) => {
    const label = rule.id.trim() || `decision_rule_${index + 1}`;

    if (!rule.question.trim()) {
      issues.push(`${label}: missing decision question.`);
    }
    if (!rule.yes.trim() || !rule.no.trim()) {
      issues.push(`${label}: decision rule needs both YES and NO outcomes.`);
    }
    if (
      hasNegatingConstraint(rule.constraints) &&
      !rule.alternativeAction.trim()
    ) {
      issues.push(
        `${label}: constraints include a cannot/does-not rule but no alternative action.`,
      );
    }
  });

  return issues;
}

function hasNegatingConstraint(value: string): boolean {
  return /\b(cannot|can't|does not|doesn't|never|forbidden|refuses|unable|won't|will not|must not|should not)\b/i.test(
    value,
  );
}

function createSections(sections: string[]): string {
  return sections.filter(Boolean).join("\n\n");
}

function createSection(title: string, lines: string[]): string {
  const content = lines.filter(Boolean).join("\n");

  return content ? `${title}:\n${content}` : "";
}

function createLine(label: string, value: string): string {
  const trimmedValue = normalizeWhitespace(value);

  return trimmedValue ? `- ${label}: ${trimmedValue}` : "";
}

function createPromptParagraph(lines: string[]): string {
  return lines.filter(Boolean).join("\n");
}

function createPromptSentence(
  value: string,
  format: (value: string) => string,
): string {
  const trimmedValue = normalizeWhitespace(value);

  return trimmedValue ? ensureSentence(format(trimmedValue)) : "";
}

function ensureSentence(value: string): string {
  const trimmedValue = normalizeWhitespace(value);

  if (!trimmedValue) return "";
  return /[.!?]"?$/.test(trimmedValue) ? trimmedValue : `${trimmedValue}.`;
}

function lowercaseFirst(value: string): string {
  return value.replace(/^(\s*)([A-Z])/, (_match, prefix, letter: string) =>
    `${prefix}${letter.toLowerCase()}`,
  );
}

function stripTerminalPunctuation(value: string): string {
  return value.replace(/[.!?]+$/g, "").trim();
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+$/gm, "").trim();
}
