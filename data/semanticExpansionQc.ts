export interface SemanticSeedNode {
  seed: string;
  label: string;
  category: string;
  description?: string;
  internalMeaning?: string;
  emotionalMeaning?: string;
  guidance?: string;
  examples?: readonly unknown[];
  behaviors?: readonly unknown[];
  bodyLanguage?: readonly unknown[];
  dialoguePatterns?: readonly unknown[];
  alternativeActions?: readonly unknown[];
  relatedSeeds?: readonly unknown[];
  oppositeSeeds?: readonly unknown[];
  activatesWounds?: readonly unknown[];
  activatesFears?: readonly unknown[];
  activatesDesires?: readonly unknown[];
  commonTriggers?: readonly unknown[];
  likelyResponses?: readonly unknown[];
  conflictBeats?: readonly unknown[];
  ruptureTypes?: readonly unknown[];
  consequences?: readonly unknown[];
  compatibleRepairStyles?: readonly unknown[];
  growthArcs?: readonly unknown[];
  payoffFantasies?: readonly unknown[];
  relationshipIdentities?: readonly unknown[];
  metadata?: Record<string, unknown>;
}

export interface SemanticQcIssue {
  severity: "error" | "warning";
  seed: string;
  field: keyof SemanticSeedNode | "registry" | "constraintAlternative";
  message: string;
}

const REFERENCE_FIELDS = [
  "relatedSeeds",
  "oppositeSeeds",
  "activatesWounds",
  "activatesFears",
  "activatesDesires",
  "commonTriggers",
  "likelyResponses",
  "conflictBeats",
  "ruptureTypes",
  "consequences",
  "compatibleRepairStyles",
  "growthArcs",
  "payoffFantasies",
  "relationshipIdentities",
] as const satisfies readonly (keyof SemanticSeedNode)[];

const CONSTRAINT_PROSE_FIELDS = [
  "description",
  "internalMeaning",
  "emotionalMeaning",
  "guidance",
  "examples",
  "dialoguePatterns",
] as const satisfies readonly (keyof SemanticSeedNode)[];

const ALTERNATIVE_ACTION_FIELDS = [
  "alternativeActions",
  "behaviors",
  "bodyLanguage",
  "likelyResponses",
  "growthArcs",
  "examples",
  "dialoguePatterns",
] as const satisfies readonly (keyof SemanticSeedNode)[];

const NEGATIVE_BEHAVIOR_CONSTRAINT_PATTERN =
  /\b(?:can't|cannot|can not|couldn't|could not|doesn't|does not|don't|do not|won't|will not|never|unable to|refuses to|avoids?)\s+(?!be\b|mean\b|have\b|need\b|require\b|demand\b|erase\b|undo\b|excuse\b|answer\b|survive\b|matter\b)[a-z]/i;

const INLINE_ALTERNATIVE_ACTION_PATTERN =
  /\b(?:instead|rather|uses?|writes?|gestures?|signals?|delegates?|waits?|asks?|chooses?|responds?|communicates?|relies?|redirects?|shows?|turns?|routes?|offers?|moves?|checks?|keeps?|lets?)\b/i;

export function qcSemanticExpansionRegistry(
  nodes: readonly SemanticSeedNode[],
): SemanticQcIssue[] {
  const issues: SemanticQcIssue[] = [];
  const seedIds = nodes.map((node) => node.seed);
  const seedSet = new Set(seedIds);
  const duplicateSeedIds = seedIds.filter(
    (seed, index) => seedIds.indexOf(seed) !== index,
  );

  for (const duplicate of new Set(duplicateSeedIds)) {
    issues.push({
      severity: "error",
      seed: duplicate || "(missing)",
      field: "registry",
      message: `Duplicate seed id: ${duplicate}`,
    });
  }

  for (const node of nodes) {
    if (!node.seed) {
      issues.push({
        severity: "error",
        seed: node.seed || "(missing)",
        field: "seed",
        message: "Seed is missing.",
      });
    }

    if (!node.label) {
      issues.push({
        severity: "error",
        seed: node.seed || "(missing)",
        field: "label",
        message: "Label is missing.",
      });
    }

    if (!node.category) {
      issues.push({
        severity: "error",
        seed: node.seed || "(missing)",
        field: "category",
        message: "Category is missing.",
      });
    }

    for (const field of REFERENCE_FIELDS) {
      const refs = node[field];

      if (!Array.isArray(refs)) {
        continue;
      }

      for (const ref of refs) {
        if (typeof ref !== "string") {
          issues.push({
            severity: "error",
            seed: node.seed || "(missing)",
            field,
            message: "Reference must be a string.",
          });
          continue;
        }

        if (ref === node.seed) {
          issues.push({
            severity: "error",
            seed: node.seed || "(missing)",
            field,
            message: "Seed cannot reference itself.",
          });
          continue;
        }

        if (!seedSet.has(ref)) {
          issues.push({
            severity: "warning",
            seed: node.seed || "(missing)",
            field,
            message: `Unknown referenced seed: ${ref}`,
          });
        }
      }

      const duplicateRefs = refs.filter(
        (ref, index) => refs.indexOf(ref) !== index,
      );

      for (const duplicate of new Set(duplicateRefs)) {
        issues.push({
          severity: "warning",
          seed: node.seed || "(missing)",
          field,
          message: `Duplicate reference: ${String(duplicate)}`,
        });
      }
    }

    for (const opposite of node.oppositeSeeds ?? []) {
      if (
        typeof opposite === "string" &&
        node.relatedSeeds?.includes(opposite)
      ) {
        issues.push({
          severity: "error",
          seed: node.seed || "(missing)",
          field: "oppositeSeeds",
          message: `Seed cannot be both related and opposite: ${opposite}`,
        });
      }
    }

    if (
      nodeHasNegativeBehaviorConstraint(node) &&
      !nodeHasConstraintAlternative(node)
    ) {
      issues.push({
        severity: "warning",
        seed: node.seed || "(missing)",
        field: "constraintAlternative",
        message:
          "Negative behavior constraints need a positive alternative action.",
      });
    }
  }

  return issues;
}

export function expectSemanticRegistryToPassQc(
  nodes: readonly SemanticSeedNode[],
): SemanticQcIssue[] {
  const issues = qcSemanticExpansionRegistry(nodes);
  const errors = issues.filter((issue) => issue.severity === "error");

  if (errors.length > 0) {
    throw new Error(
      errors
        .map((issue) =>
          `[${issue.seed}] ${String(issue.field)}: ${issue.message}`,
        )
        .join("\n"),
    );
  }

  return issues;
}

export function containsNegativeBehaviorConstraint(text: string): boolean {
  return NEGATIVE_BEHAVIOR_CONSTRAINT_PATTERN.test(text);
}

export function containsInlineAlternativeAction(text: string): boolean {
  return INLINE_ALTERNATIVE_ACTION_PATTERN.test(text);
}

function nodeHasNegativeBehaviorConstraint(node: SemanticSeedNode): boolean {
  return CONSTRAINT_PROSE_FIELDS.some((field) =>
    getStringValues(node[field]).some(containsNegativeBehaviorConstraint),
  );
}

function nodeHasConstraintAlternative(node: SemanticSeedNode): boolean {
  const proseValues = CONSTRAINT_PROSE_FIELDS.flatMap((field) =>
    getStringValues(node[field]),
  );

  if (proseValues.some(containsInlineAlternativeAction)) {
    return true;
  }

  return ALTERNATIVE_ACTION_FIELDS.some(
    (field) => getStringValues(node[field]).length > 0,
  );
}

function getStringValues(value: unknown): readonly string[] {
  if (typeof value === "string") {
    return value.trim() ? [value] : [];
  }
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string =>
    typeof item === "string" && item.trim().length > 0,
  );
}
