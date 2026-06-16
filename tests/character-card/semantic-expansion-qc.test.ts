import assert from "node:assert/strict";
import test from "node:test";

import {
  containsNegativeBehaviorConstraint,
  expectSemanticRegistryToPassQc,
  qcSemanticExpansionRegistry,
  type SemanticSeedNode,
} from "../../data/semanticExpansionQc";
import {
  VISIBLE_BEHAVIOR_VOCABULARY_STANDARD_SEEDS,
} from "../../data/visibleBehaviorVocabularyPresets";

test("semantic expansion QC catches hard structural errors", () => {
  const issues = qcSemanticExpansionRegistry([
    {
      seed: "fear_of_replacement",
      label: "Fear of replacement",
      category: "fear",
      relatedSeeds: [
        "fear_of_replacement",
        "jealousy",
        42,
      ],
      oppositeSeeds: ["jealousy"],
    },
    {
      seed: "fear_of_replacement",
      label: "Duplicate fear",
      category: "fear",
    },
    {
      seed: "missing_label",
      label: "",
      category: "",
    },
  ]);
  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warning");

  assert.equal(
    errors.some((issue) => issue.message.includes("Duplicate seed id")),
    true,
  );
  assert.equal(
    errors.some((issue) => issue.message === "Seed cannot reference itself."),
    true,
  );
  assert.equal(
    errors.some((issue) => issue.message === "Reference must be a string."),
    true,
  );
  assert.equal(
    errors.some((issue) => issue.message === "Label is missing."),
    true,
  );
  assert.equal(
    errors.some((issue) => issue.message === "Category is missing."),
    true,
  );
  assert.equal(
    errors.some((issue) =>
      issue.message.includes("both related and opposite"),
    ),
    true,
  );
  assert.equal(
    warnings.some((issue) =>
      issue.message === "Unknown referenced seed: jealousy",
    ),
    true,
  );
});

test("semantic expansion QC allows future-facing references as warnings", () => {
  const issues = expectSemanticRegistryToPassQc([
    {
      seed: "desire_to_be_chosen",
      label: "Desire to Be Chosen",
      category: "desire",
      relatedSeeds: ["future_public_choice_node"],
    },
  ]);

  assert.equal(issues.length, 1);
  assert.equal(issues[0]?.severity, "warning");
  assert.equal(
    issues[0]?.message,
    "Unknown referenced seed: future_public_choice_node",
  );
});

test("semantic expansion QC warns when negative constraints lack alternative actions", () => {
  const issues = qcSemanticExpansionRegistry([
    {
      seed: "silent_constraint",
      label: "Silent Constraint",
      category: "communication",
      description: "Does not speak aloud during tense scenes.",
    },
    {
      seed: "silent_with_alternative",
      label: "Silent With Alternative",
      category: "communication",
      description: "Does not speak aloud during tense scenes.",
      behaviors: ["Writes on a notepad and gestures toward exits."],
    },
    {
      seed: "acceptance_reassurance",
      label: "Acceptance Reassurance",
      category: "repair",
      description: "Needs care that does not have to be earned first.",
    },
  ]);

  assert.equal(
    issues.some(
      (issue) =>
        issue.seed === "silent_constraint" &&
        issue.field === "constraintAlternative" &&
        issue.message ===
          "Negative behavior constraints need a positive alternative action.",
    ),
    true,
  );
  assert.equal(
    issues.some((issue) => issue.seed === "silent_with_alternative"),
    false,
  );
  assert.equal(
    issues.some((issue) => issue.seed === "acceptance_reassurance"),
    false,
  );
  assert.equal(containsNegativeBehaviorConstraint("Does not speak aloud."), true);
  assert.equal(
    containsNegativeBehaviorConstraint("Does not have to earn care."),
    false,
  );
});

test("visible behavior vocabulary seeds pass semantic expansion QC without errors", () => {
  const registry = VISIBLE_BEHAVIOR_VOCABULARY_STANDARD_SEEDS.map(
    (seed): SemanticSeedNode => ({
      seed: seed.seed,
      label: seed.label,
      category: inferCategory(seed.tags),
      relatedSeeds: seed.relatedSeeds,
      oppositeSeeds: seed.oppositeSeeds,
      commonTriggers: seed.scenarioHooks,
      growthArcs: seed.romanceHooks,
      metadata: {
        romanceValue: seed.metadata.romanceValue,
        conflictPotential: seed.metadata.conflictPotential,
      },
    }),
  );
  const issues = qcSemanticExpansionRegistry(registry);
  const errors = issues.filter((issue) => issue.severity === "error");
  const ids = registry.map((node) => node.seed);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

  assert.deepEqual(errors, []);
  assert.deepEqual([...new Set(duplicates)], []);
});

function inferCategory(tags: readonly string[]): string {
  return tags.find((tag) => tag.endsWith("-vocabulary")) ?? tags[0] ?? "unknown";
}
