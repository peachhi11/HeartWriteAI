import assert from "node:assert/strict";
import test from "node:test";

import { generateLorebookArtifact } from "../../features/generation/workflows";
import {
  createLorebookV3ExportFileName,
  generatedLorebookArtifactToV3Document,
  normalizeLorebookV3Document,
  serializeLorebookV3Document,
} from "../../features/lorebooks/adapters";
import { getActiveLorebookEntries } from "../../features/lorebooks/processor";

test("converts generated lorebook artifacts into standalone lorebook v3 documents", () => {
  const artifact = generateLorebookArtifact({
    jobTitle: "University Student",
    professionalDomain: "Corporate_Finance",
    speciesType: "Human",
    title: "Campus Canon",
    trope: "Academic rivals forced proximity",
  });

  const document = generatedLorebookArtifactToV3Document(artifact);

  assert.equal(document.spec, "lorebook_v3");
  assert.equal(document.data.name, "Campus Canon");
  assert.equal(document.data.recursive_scanning, true);
  assert.ok(document.data.token_budget && document.data.token_budget > 0);
  assert.ok(document.data.entries.length >= 4);
  assert.ok(document.data.entries.every((entry) => entry.enabled));
  assert.ok(document.data.entries.some((entry) => entry.constant));
  assert.equal(
    document.data.entries[0]?.extensions.heartwriteai &&
      typeof document.data.entries[0].extensions.heartwriteai,
    "object",
  );
});

test("normalizes sillytavern-style world info entries to v3 names", () => {
  const document = normalizeLorebookV3Document({
    entries: {
      "1": {
        caseSensitive: true,
        content: "The archive has strict rules.",
        disable: false,
        key: ["archive", "rules"],
        keysecondary: ["campus"],
        order: 10,
        uid: 1,
        useRegex: false,
      },
    },
    name: "Imported World Info",
  });

  assert.equal(document.spec, "lorebook_v3");
  assert.equal(document.data.entries[0]?.id, 1);
  assert.deepEqual(document.data.entries[0]?.keys, ["archive", "rules"]);
  assert.deepEqual(document.data.entries[0]?.secondary_keys, ["campus"]);
  assert.equal(document.data.entries[0]?.insertion_order, 10);
  assert.equal(document.data.entries[0]?.case_sensitive, true);
});

test("activates v3 lorebook entries by constants, keywords, regex, and budget", () => {
  const document = normalizeLorebookV3Document({
    data: {
      entries: [
        {
          constant: true,
          content: "Always remember public reputation pressure.",
          insertion_order: 0,
          keys: [],
          name: "Constant",
        },
        {
          content: "Archive rivalry rules apply.",
          insertion_order: 1,
          keys: ["archive"],
          name: "Keyword",
        },
        {
          content: "Invalid regex should not activate.",
          insertion_order: 2,
          keys: ["["],
          name: "Bad Regex",
          use_regex: true,
        },
      ],
      name: "Runtime",
      scan_depth: 2,
      token_budget: 30,
    },
    spec: "lorebook_v3",
  });

  const active = getActiveLorebookEntries(document.data, [
    "Earlier message without triggers.",
    "They meet in the archive after class.",
  ]);

  assert.deepEqual(
    active.map((activation) => activation.entry.name),
    ["Constant", "Keyword"],
  );
  assert.deepEqual(active[1]?.matchedKeys, ["archive"]);
});

test("serializes canonical v3 exports and safe filenames", () => {
  const document = normalizeLorebookV3Document({
    data: {
      entries: [{ content: "Lore", keys: ["lore"] }],
      name: "Campus Canon!",
    },
    spec: "lorebook_v3",
  });

  const json = serializeLorebookV3Document(document);
  assert.match(json, /"spec": "lorebook_v3"/);
  assert.equal(
    createLorebookV3ExportFileName(document.data.name),
    "campus-canon.lorebook-v3.json",
  );
});

