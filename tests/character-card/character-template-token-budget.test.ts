import assert from "node:assert/strict";
import test from "node:test";

import {
  CHARACTER_TEMPLATE_TOKEN_ESTIMATE_CHARS_PER_TOKEN,
  compileCharacterTemplateCondensedOutline,
  estimateCharacterTemplateTokenBudget,
  estimateProfileTemplateTokens,
  recommendCharacterTemplateCondensationLevel,
} from "../../lib/character-card/characterTemplateTokenBudget";

test("estimates profile template tokens with the app's local heuristic", () => {
  assert.equal(CHARACTER_TEMPLATE_TOKEN_ESTIMATE_CHARS_PER_TOKEN, 4);
  assert.equal(estimateProfileTemplateTokens(""), 0);
  assert.equal(estimateProfileTemplateTokens("1234"), 1);
  assert.equal(estimateProfileTemplateTokens("12345"), 2);
});

test("compiles progressively smaller character template outlines", () => {
  const full = compileCharacterTemplateCondensedOutline("full");
  const standard = compileCharacterTemplateCondensedOutline("standard");
  const compact = compileCharacterTemplateCondensedOutline("compact");
  const runtimeMinimal =
    compileCharacterTemplateCondensedOutline("runtime_minimal");

  assert.match(full, /Full Name: Full name; Goes by; Pronouns/);
  assert.match(standard, /Sections: Full Name, Core Identity/);
  assert.match(compact, /Character template scaffold: compact prompt view/);
  assert.match(runtimeMinimal, /runtime-minimal guardrail/);

  assert.ok(
    estimateProfileTemplateTokens(full) >
      estimateProfileTemplateTokens(standard),
  );
  assert.ok(
    estimateProfileTemplateTokens(standard) >
      estimateProfileTemplateTokens(compact),
  );
  assert.ok(
    estimateProfileTemplateTokens(compact) >
      estimateProfileTemplateTokens(runtimeMinimal),
  );
});

test("selects the highest-detail template that fits the usable budget", () => {
  const fullReport = estimateCharacterTemplateTokenBudget({
    maxTokens: 12000,
    reserveTokens: 0,
  });
  const compactReport = estimateCharacterTemplateTokenBudget({
    maxTokens: 1400,
    reserveTokens: 300,
  });
  const minimalReport = estimateCharacterTemplateTokenBudget({
    maxTokens: 500,
    reserveTokens: 100,
  });

  assert.equal(fullReport.selectedLevel, "full");
  assert.equal(compactReport.selectedLevel, "compact");
  assert.equal(minimalReport.selectedLevel, "runtime_minimal");
  assert.match(
    compactReport.warnings.join("\n"),
    /Full template is estimated/,
  );
  assert.match(
    minimalReport.warnings.join("\n"),
    /Template budget is very small/,
  );
});

test("reports per-module token pressure and supports adult-module omission", () => {
  const withAdult = estimateCharacterTemplateTokenBudget({
    maxTokens: 2400,
    reserveTokens: 400,
  });
  const withoutAdult = estimateCharacterTemplateTokenBudget({
    includeAdultModule: false,
    maxTokens: 2400,
    reserveTokens: 400,
  });
  const sexualityEstimate = withAdult.moduleEstimates.find(
    (estimate) => estimate.id === "sexuality",
  );

  assert.equal(withAdult.moduleEstimates.length, 12);
  assert.equal(withoutAdult.moduleEstimates.length, 11);
  assert.equal(sexualityEstimate?.label, "Sexuality");
  assert.equal(
    withoutAdult.moduleEstimates.some((estimate) => estimate.id === "sexuality"),
    false,
  );
  assert.ok(
    withAdult.moduleEstimates.every(
      (estimate) => estimate.runtimeMinimalTokens <= estimate.fullTokens,
    ),
  );
});

test("recommends a condensation level without exposing the full report", () => {
  assert.equal(recommendCharacterTemplateCondensationLevel(12000), "full");
  assert.equal(
    recommendCharacterTemplateCondensationLevel(500),
    "runtime_minimal",
  );
});
