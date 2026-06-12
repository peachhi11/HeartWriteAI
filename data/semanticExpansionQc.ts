export interface SemanticSeedNode {
  seed: string;
  label: string;
  category: string;
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
  field: keyof SemanticSeedNode | "registry";
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
