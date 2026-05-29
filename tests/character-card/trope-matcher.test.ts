import assert from "node:assert/strict";
import test from "node:test";

import {
  classifyTropeInput,
  classifyTropeInputDetailed,
  TROPE_RULES,
} from "../../lib/character-card/tropeMatcher";
import {
  DEFAULT_TROPE_EVALUATION_CORPUS,
  executeTropeMacroEvaluation,
} from "../../lib/character-card/tropeMacroEvaluation";
import { generateMockTropeDataset } from "../../lib/character-card/tropeMockGenerator";
import { formatRelativeTime } from "../../lib/ui/dateFormatter";
import type { RomanceTropeClass } from "../../types/character-card/RomanceTropeClassification";

type TropeMatcherCase = {
  description: string;
  expectedIntent: RomanceTropeClass;
  input: string;
};

const testCases: readonly TropeMatcherCase[] = [
  {
    description: "Should catch direct dialogue threat markers.",
    expectedIntent: "protective",
    input: "Take your hands off them and back off right now.",
  },
  {
    description: "Should catch descriptive behavioral bracket tokens.",
    expectedIntent: "protective",
    input: "[He steps in front of her and clenches fists] Don't move.",
  },
  {
    description: "Should catch classic situational tropes and dialogue stuttering.",
    expectedIntent: "flustered",
    input:
      "Wait, the innkeeper said there's only... one bed? I-I didn't mean to...",
  },
  {
    description: "Should catch combined bracket actions and proximity vocabulary.",
    expectedIntent: "flustered",
    input: "[She blushes deeply] You are standing way too close.",
  },
  {
    description: "Should catch historical duration markers and longing intent.",
    expectedIntent: "yearning",
    input: "I have spent five years waiting for you to look at me.",
  },
  {
    description: "Should catch witty condescension and sparring keywords.",
    expectedIntent: "bantering",
    input: "You wish you could outsmart me, sweetheart. As if.",
  },
  {
    description: "Should catch fated recognition and instant familiarity.",
    expectedIntent: "recognized",
    input: "The moment I met you, it felt like coming home.",
  },
];

test("classifies romance trope rule-based inputs", () => {
  assert.deepEqual(
    TROPE_RULES.map((rule) => rule.intent),
    [
      "protective",
      "flustered",
      "yearning",
      "recognized",
      "antagonistic",
      "bantering",
    ],
  );

  for (const { input, expectedIntent } of testCases) {
    assert.equal(classifyTropeInput(input), expectedIntent);
  }
});

test("resolves romance trope priority conflicts by rule order", () => {
  const conflictingInput =
    "He [smirks], but says 'Back off from her right now.'";
  const result = classifyTropeInputDetailed(conflictingInput);

  assert.equal(result.class, "protective");
  assert.equal(result.matchedKeywords[0], "Back off");
  assert.match(result.reason, /Protective/);
});

test("falls back to casual for non-trope utility turns", () => {
  const result = classifyTropeInputDetailed("Let's go find something to eat.");

  assert.equal(result.class, "casual");
  assert.equal(result.matchedKeywords.length, 0);
});

test("calculates macro-averaged trope evaluation metrics", () => {
  const result = executeTropeMacroEvaluation(DEFAULT_TROPE_EVALUATION_CORPUS);

  assert.equal(result.activeClassesCount, 6);
  assert.equal(result.macroF1, 1);
  assert.deepEqual(
    result.metrics.map((metric) => metric.className),
    [
      "antagonistic",
      "protective",
      "flustered",
      "yearning",
      "bantering",
      "recognized",
    ],
  );
  assert.ok(
    result.metrics.every(
      (metric) =>
        metric.precision === 1 && metric.recall === 1 && metric.f1 === 1,
    ),
  );
});

test("generates deterministic mock trope datasets", () => {
  const distribution = {
    antagonistic: 8,
    bantering: 6,
    protective: 3,
    flustered: 2,
    yearning: 1,
    recognized: 1,
  } satisfies Partial<Record<RomanceTropeClass, number>>;

  const firstDataset = generateMockTropeDataset(distribution, { seed: 42 });
  const secondDataset = generateMockTropeDataset(distribution, { seed: 42 });

  assert.equal(firstDataset.length, 21);
  assert.deepEqual(firstDataset, secondDataset);
  assert.deepEqual(countGroundTruth(firstDataset), distribution);
});

test("macro-evaluates a skewed synthetic trope dataset", () => {
  const dataset = generateMockTropeDataset(
    {
      antagonistic: 50,
      bantering: 35,
      protective: 8,
      flustered: 5,
      yearning: 2,
      recognized: 1,
    },
    { seed: 2026 },
  );
  const result = executeTropeMacroEvaluation(dataset);

  assert.equal(result.activeClassesCount, 6);
  assert.equal(result.macroF1, 1);
  assert.ok(result.metrics.some((metric) => metric.className === "recognized"));
  assert.ok(
    result.metrics.every(
      (metric) =>
        metric.precision === 1 && metric.recall === 1 && metric.f1 === 1,
    ),
  );
});

function countGroundTruth(dataset: readonly { groundTruth: RomanceTropeClass }[]) {
  return dataset.reduce<Partial<Record<RomanceTropeClass, number>>>(
    (counts, sample) => {
      counts[sample.groundTruth] = (counts[sample.groundTruth] ?? 0) + 1;
      return counts;
    },
    {},
  );
}

test("formats save slot timestamps as relative labels", () => {
  const now = new Date("2026-05-29T12:00:00Z");

  assert.equal(formatRelativeTime("--", now), "Never");
  assert.equal(formatRelativeTime("", now), "Never");
  assert.equal(formatRelativeTime("not-a-date", now), "Unknown Date");
  assert.equal(formatRelativeTime("2026-05-29T11:59:58Z", now), "Just now");
  assert.equal(
    formatRelativeTime("2026-05-29T11:57:00Z", now),
    "Saved 3 minutes ago",
  );
  assert.equal(
    formatRelativeTime("2026-05-28 12:00:00Z", now),
    "Saved 1 day ago",
  );
});
