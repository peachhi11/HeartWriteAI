import type {
  CharacterCreationForm,
  CharacterEngineDecisionRule,
} from "../../types/character-card/CharacterCreationForm";
import { parseCharacterCreationForm } from "./characterCreationFormCompiler";

export interface CharacterCauseChainInput {
  id?: string;
  whatHappened: string;
  createdBelief: string;
  decisionEffect: string;
  visibleSignals?: string;
  recoveryPath?: string;
}

export interface CharacterCauseChainRoutingPreview {
  biography: string;
  psychology: string;
  characterEngineRule: CharacterEngineDecisionRule | null;
}

export function compileCharacterCauseChainRouting(
  input: CharacterCauseChainInput,
): CharacterCauseChainRoutingPreview {
  const whatHappened = normalizeText(input.whatHappened);
  const createdBelief = normalizeText(input.createdBelief);
  const decisionEffect = normalizeText(input.decisionEffect);
  const visibleSignals = normalizeText(input.visibleSignals ?? "");
  const recoveryPath = normalizeText(input.recoveryPath ?? "");

  return {
    biography: whatHappened,
    psychology: createdBelief,
    characterEngineRule:
      createdBelief || decisionEffect
        ? {
            id:
              normalizeText(input.id ?? "") ||
              `cause_chain_${slugText(createdBelief || whatHappened || "belief")}`,
            drive: "Belief-driven decision",
            question: createdBelief
              ? `Does the current situation activate the belief that ${lowercaseFirst(stripTerminalPunctuation(createdBelief))}?`
              : "Does the current situation activate this formative pattern?",
            yes:
              decisionEffect ||
              "Let the belief affect attention, restraint, and choices without explaining the biography directly.",
            no:
              "Use baseline character laws without escalating this cause chain.",
            constraints:
              "Do not repeat the biography as exposition unless it is directly relevant on page.",
            visibleBehaviors:
              visibleSignals ||
              "Show the effect through choices, restraint, attention, posture, and small behavioral tells.",
            alternativeAction:
              recoveryPath ||
              "Let the character act from the belief while preserving present-scene agency and continuity.",
          }
        : null,
  };
}

export function applyCharacterCauseChainToCharacterCreationForm(
  rawForm: CharacterCreationForm,
  input: CharacterCauseChainInput,
): CharacterCreationForm {
  const form = parseCharacterCreationForm(rawForm);
  const routing = compileCharacterCauseChainRouting(input);

  return parseCharacterCreationForm({
    ...form,
    writerBible: {
      ...form.writerBible,
      characterReference: appendUniqueParagraph(
        form.writerBible.characterReference,
        routing.biography,
      ),
    },
    psychology: {
      ...form.psychology,
      beliefs: appendUniqueParagraph(form.psychology.beliefs, routing.psychology),
    },
    characterEngine: {
      ...form.characterEngine,
      decisionRules: routing.characterEngineRule
        ? upsertDecisionRule(
            form.characterEngine.decisionRules,
            routing.characterEngineRule,
          )
        : form.characterEngine.decisionRules,
    },
  });
}

function upsertDecisionRule(
  rules: readonly CharacterEngineDecisionRule[],
  nextRule: CharacterEngineDecisionRule,
): CharacterEngineDecisionRule[] {
  const nextId = nextRule.id.trim();
  const existingIndex = rules.findIndex((rule) => rule.id.trim() === nextId);

  if (existingIndex === -1) {
    return [...rules, nextRule];
  }

  return rules.map((rule, index) =>
    index === existingIndex ? { ...rule, ...nextRule } : rule,
  );
}

function appendUniqueParagraph(current: string, addition: string): string {
  const currentValue = normalizeText(current);
  const additionValue = normalizeText(addition);

  if (!additionValue) return currentValue;
  if (!currentValue) return additionValue;
  if (currentValue.includes(additionValue)) return currentValue;

  return `${currentValue}\n\n${additionValue}`;
}

function normalizeText(value: string): string {
  return value.replace(/[ \t]+\n/g, "\n").replace(/\s+$/gm, "").trim();
}

function lowercaseFirst(value: string): string {
  return value.replace(/^(\s*)([A-Z])/, (_match, prefix, letter: string) =>
    `${prefix}${letter.toLowerCase()}`,
  );
}

function stripTerminalPunctuation(value: string): string {
  return value.replace(/[.!?]+$/g, "").trim();
}

function slugText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9{}]+/g, "_")
    .replace(/^_+|_+$/g, "") || "belief";
}
