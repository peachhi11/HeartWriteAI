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

  return createSections([
    createSection("Character Engine", [
      createLine("Core Wound", engine.coreWound),
      createLine("Core Belief", engine.coreBelief),
      createLine("Core Fear", engine.coreFear),
      createLine("Primary Drive", engine.primaryDrive),
    ]),
    createSection(
      "Decision Rules",
      engine.decisionRules
        .map((rule, index) => compileCharacterEngineDecisionRule(rule, index))
        .filter(Boolean),
    ),
    createSection("Defense & Attachment", [
      createLine("Defense Mechanisms", engine.defenseMechanisms),
      createLine("Attachment Style", engine.attachmentStyle),
      createLine("Behavioral Triggers", engine.behavioralTriggers),
    ]),
    createSection("Relationship & Expression", [
      createLine("Relationship Dynamics", engine.relationshipDynamics),
      createLine("Speech Rules", engine.speechRules),
      createLine("Sexuality Rules", engine.sexualityRules),
    ]),
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

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+$/gm, "").trim();
}
