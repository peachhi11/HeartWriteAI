import assert from "node:assert/strict";
import test from "node:test";

import {
  buildLorebookActivationGraph,
  entryMatchesLorebookText,
  findLorebookCycles,
  inspectLorebookKeywords,
  matchLorebookEntryKeys,
  runLorebookHealthQc,
  simulateLorebookActivation,
} from "../../features/lorebooks/intelligence";
import { normalizeLorebookV3Document } from "../../features/lorebooks/adapters";

test("matches lorebook entry keys with literal, whole-word, and regex modes", () => {
  const document = normalizeLorebookV3Document({
    data: {
      entries: [
        {
          content: "Archive lore.",
          keys: ["arc"],
          name: "Literal",
        },
        {
          content: "Regex lore.",
          keys: ["arch(?:ive|ives)"],
          name: "Regex",
          use_regex: true,
        },
      ],
    },
    spec: "lorebook_v3",
  });
  const literal = document.data.entries[0];
  const regex = document.data.entries[1];
  assert.ok(literal);
  assert.ok(regex);

  assert.equal(
    matchLorebookEntryKeys(literal, "The archive door opens.").length,
    1,
  );
  assert.equal(
    matchLorebookEntryKeys(literal, "The archive door opens.", "keys", {
      matchWholeWords: true,
    }).length,
    0,
  );
  assert.equal(
    matchLorebookEntryKeys(regex, "The archives were sealed.").length,
    1,
  );
});

test("builds an activation graph from keyword links between lorebook entries", () => {
  const document = createGraphLorebook();
  const graph = buildLorebookActivationGraph(document);

  assert.deepEqual(
    graph.nodes.map((node) => node.name),
    ["House Anchor", "Archive", "Vault", "Cycle A", "Cycle B"],
  );
  assert.ok(
    graph.edges.some(
      (edge) =>
        edge.sourceId.startsWith("anchor#") &&
        edge.targetId.startsWith("archive#") &&
        edge.matchedKeys.includes("archive"),
    ),
  );
  assert.ok(
    graph.edges.some(
      (edge) =>
        edge.sourceId.startsWith("archive#") &&
        edge.targetId.startsWith("vault#"),
    ),
  );
  assert.deepEqual(findLorebookCycles(graph), [["cycle-a#3", "cycle-b#4", "cycle-a#3"]]);
});

test("inspects keyword inventory for duplicates, generic keys, substrings, and invalid regex", () => {
  const document = normalizeLorebookV3Document({
    data: {
      entries: [
        {
          content: "One.",
          keys: ["the", "city", "["],
          name: "First",
          use_regex: true,
        },
        {
          content: "Two.",
          keys: ["city", "city guard"],
          name: "Second",
        },
      ],
    },
    spec: "lorebook_v3",
  });

  const inventory = inspectLorebookKeywords(document);

  assert.ok(inventory.duplicateKeywords.some((item) => item.keyword === "city"));
  assert.ok(inventory.genericKeywords.some((item) => item.keyword === "the"));
  assert.ok(inventory.invalidRegexKeywords.some((item) => item.keyword === "["));
  assert.ok(
    inventory.substringOverlaps.some(
      (overlap) =>
        overlap.keyword === "city" && overlap.containedBy === "city guard",
    ),
  );
});

test("runs deterministic lorebook health QC across structure, config, keywords, recursion, budget, and spoilers", () => {
  const document = normalizeLorebookV3Document({
    data: {
      entries: [
        {
          constant: true,
          content: "Permanent lore ".repeat(500),
          keys: [],
          name: "Large Anchor",
        },
        {
          content: "Missing trigger.",
          keys: [],
          name: "No Keys",
        },
        {
          content: "Selective but no secondary.",
          keys: ["secret"],
          name: "Bad Selective",
          selective: true,
        },
        {
          content: "Hidden reveal.",
          extensions: {
            heartwriteai: {
              hiddenFromUser: true,
              reviewRequired: true,
            },
          },
          keys: ["reveal"],
          name: "Hidden Reveal",
        },
        {
          content: "cycle-b",
          keys: ["cycle-a"],
          name: "Cycle A",
        },
        {
          content: "cycle-a",
          keys: ["cycle-b"],
          name: "Cycle B",
        },
      ],
      recursive_scanning: true,
      token_budget: 100,
    },
    spec: "lorebook_v3",
  });

  const report = runLorebookHealthQc(document);
  const codes = new Set(report.findings.map((finding) => finding.code));

  assert.ok(report.score < 100);
  assert.ok(codes.has("missing_trigger_keys"));
  assert.ok(codes.has("missing_secondary_keys"));
  assert.ok(codes.has("constant_entries_exceed_budget"));
  assert.ok(codes.has("missing_spoiler_preview"));
  assert.ok(codes.has("review_required"));
  assert.ok(codes.has("recursion_cycle"));
});

test("simulates keyword activation, recursive activation, and token budget pressure", () => {
  const document = createGraphLorebook();
  const result = simulateLorebookActivation(
    document,
    ["They entered the archive and searched for the old ledger."],
    { tokenBudget: 200 },
  );

  assert.deepEqual(
    result.activatedEntries.map((entry) => entry.name),
    ["House Anchor", "Archive", "Vault"],
  );
  assert.ok(
    result.recursionTrace.some(
      (step) =>
        step.scannedEntryId === "archive" &&
        step.activatedEntryIds.includes("vault"),
      ),
  );
  assert.equal(result.budgetExhausted, false);

  const constrained = simulateLorebookActivation(
    document,
    ["They entered the archive and searched for the old ledger."],
    { tokenBudget: 30 },
  );

  assert.equal(constrained.budgetExhausted, true);
  assert.ok(constrained.skippedEntries.some((entry) => entry.name === "Vault"));
});

test("requires secondary keys before selective entries activate", () => {
  const document = normalizeLorebookV3Document({
    data: {
      entries: [
        {
          content: "Rivalry rules apply.",
          keys: ["rivalry"],
          name: "Selective Rivalry",
          secondary_keys: ["archive"],
          selective: true,
        },
      ],
    },
    spec: "lorebook_v3",
  });
  const entry = document.data.entries[0];
  assert.ok(entry);

  assert.equal(entryMatchesLorebookText(entry, "The rivalry grows.").length, 0);
  assert.deepEqual(
    entryMatchesLorebookText(entry, "The archive rivalry grows.").map(
      (match) => match.keyword,
    ),
    ["rivalry", "archive"],
  );
});

function createGraphLorebook() {
  return normalizeLorebookV3Document({
    data: {
      entries: [
        {
          constant: true,
          content: "The house anchor always references the archive.",
          id: "anchor",
          keys: [],
          name: "House Anchor",
        },
        {
          content: "The archive entry points toward the vault.",
          id: "archive",
          keys: ["archive"],
          name: "Archive",
        },
        {
          content: "The vault keeps the ledger safe.",
          id: "vault",
          keys: ["vault"],
          name: "Vault",
        },
        {
          content: "cycle-b",
          id: "cycle-a",
          keys: ["cycle-a"],
          name: "Cycle A",
        },
        {
          content: "cycle-a",
          id: "cycle-b",
          keys: ["cycle-b"],
          name: "Cycle B",
        },
      ],
      name: "Graph Runtime",
      recursive_scanning: true,
    },
    spec: "lorebook_v3",
  });
}
