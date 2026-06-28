import assert from "node:assert/strict";
import test from "node:test";

import {
  createImportedLorebookArtifact,
  generateLorebookArtifact,
} from "../../features/generation/workflows";
import {
  createLorebookV3ExportFileName,
  generatedLorebookArtifactToV3Document,
  importLorebookV3Json,
  normalizeLorebookV3Document,
  serializeLorebookV3Document,
} from "../../features/lorebooks/adapters";
import { getActiveLorebookEntries } from "../../features/lorebooks/processor";
import {
  applyLorebookQuickAction,
  compileLorebookReview,
  getLorebookEntryPreview,
  isLorebookEntryHiddenFromUser,
  readHeartWriteLorebookRuntime,
} from "../../features/lorebooks/runtime";

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

test("imports sillytavern world info maps with empty headers and preserved settings", () => {
  const document = importLorebookV3Json(
    JSON.stringify({
      entries: {
        "0": {
          comment: "*****************  \\ 6_SHARED_CAST_PACK / SX5 ///  ******************",
          constant: true,
          content: "",
          disable: false,
          displayIndex: 0,
          key: [],
          keysecondary: [],
          order: 100,
          probability: 0,
          scanDepth: 12,
          selective: true,
          uid: 0,
        },
        "1": {
          caseSensitive: false,
          comment: "CAST: SEBASTIAN 'BASH' ASTOR",
          constant: true,
          content: "cast_bash.type: shared_npc; cast_bash.name: Sebastian 'Bash' Astor;",
          disable: false,
          displayIndex: 1,
          key: ["bash", "sebastian", "astor"],
          keysecondary: [],
          matchWholeWords: false,
          order: 99,
          probability: 100,
          scanDepth: 10,
          selective: true,
          sticky: 12,
          uid: 1,
        },
      },
    }),
    "6_SHARED_CAST_PACK.json",
  );

  assert.equal(document.data.name, "6_SHARED_CAST_PACK");
  assert.equal(document.data.entries.length, 2);
  assert.equal(
    document.data.entries[0]?.content,
    "cast_bash.type: shared_npc; cast_bash.name: Sebastian 'Bash' Astor;",
  );
  assert.deepEqual(document.data.entries[0]?.keys, ["bash", "sebastian", "astor"]);
  assert.equal(
    document.data.entries[1]?.content,
    "*****************  \\ 6_SHARED_CAST_PACK / SX5 ///  ******************",
  );
  assert.equal(
    document.data.entries[0]?.extensions.sillytavern &&
      typeof document.data.entries[0].extensions.sillytavern,
    "object",
  );
  assert.equal(
    (document.data.extensions.heartwriteai as { sourceFileName?: string })
      .sourceFileName,
    "6_SHARED_CAST_PACK.json",
  );
});

test("creates saveable lorebook artifacts from imported v3 documents", () => {
  const document = normalizeLorebookV3Document({
    data: {
      entries: [
        {
          constant: true,
          content: "Always remember the public reputation rules.",
          keys: ["reputation"],
          name: "Reputation Rules",
        },
      ],
      name: "Imported Reputation Pack",
      token_budget: 400,
    },
    spec: "lorebook_v3",
  });

  const artifact = createImportedLorebookArtifact(
    document,
    "reputation_pack.json",
  );

  assert.match(artifact.id, /^lorebook_/);
  assert.equal(artifact.title, "Imported Reputation Pack");
  assert.equal(artifact.v3Document?.data.name, "Imported Reputation Pack");
  assert.equal(artifact.entries[0]?.title, "Reputation Rules");
  assert.equal(artifact.entries[0]?.insertionPriority, "Constant_Anchor");
  assert.ok(artifact.tags.includes("imported"));
});

test("credits the known Kappa Eta Nu lorebook author on import", () => {
  const document = importLorebookV3Json(
    JSON.stringify({
      entries: {
        "0": {
          comment: "Haverford, Setting",
          content: "<setting>Modern Day</setting>",
          key: [],
          order: 100,
          uid: 0,
        },
      },
    }),
    "Kappa Eta Nu.json",
  );

  const attribution = (
    document.data.extensions.heartwriteai as {
      attribution?: {
        authorName?: string;
        authorProfileUrl?: string;
        source?: string;
        title?: string;
      };
    }
  ).attribution;

  assert.equal(attribution?.title, "Kappa Eta Nu");
  assert.equal(attribution?.authorName, "aewin");
  assert.equal(attribution?.source, "janitorai");
  assert.equal(
    attribution?.authorProfileUrl,
    "https://janitorai.com/profiles/1e621c4d-8400-4659-aafc-250ad326c940_profile-of-aewin",
  );
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

test("requires secondary keys for selective lorebook activation", () => {
  const document = normalizeLorebookV3Document({
    data: {
      entries: [
        {
          content: "The rivalry rules should activate only in the archive.",
          insertion_order: 0,
          keys: ["rivalry"],
          name: "Selective Rivalry",
          secondary_keys: ["archive"],
          selective: true,
        },
      ],
      name: "Selective Runtime",
    },
    spec: "lorebook_v3",
  });

  assert.equal(
    getActiveLorebookEntries(document.data, ["The rivalry keeps escalating."])
      .length,
    0,
  );

  const active = getActiveLorebookEntries(document.data, [
    "The rivalry keeps escalating inside the archive.",
  ]);

  assert.equal(active.length, 1);
  assert.deepEqual(active[0]?.matchedKeys, ["rivalry", "archive"]);
});

test("supports spoiler-hidden lore previews without removing compiled content", () => {
  const document = normalizeLorebookV3Document({
    data: {
      entries: [
        {
          content: "The mentor is secretly the lost heir.",
          extensions: {
            heartwriteai: {
              hiddenFromUser: true,
              reviewRequired: true,
              spoilerPreview: "Hidden lineage twist.",
            },
          },
          insertion_order: 0,
          keys: ["mentor"],
          name: "Lineage Reveal",
        },
      ],
      name: "Spoiler Runtime",
    },
    spec: "lorebook_v3",
  });

  const entry = document.data.entries[0];
  assert.ok(entry);
  assert.equal(isLorebookEntryHiddenFromUser(entry), true);
  assert.equal(getLorebookEntryPreview(entry), "Hidden lineage twist.");
  assert.equal(entry.content, "The mentor is secretly the lost heir.");
  assert.equal(readHeartWriteLorebookRuntime(entry).reviewRequired, true);
});

test("applies lorebook quick actions and compiler review metadata", () => {
  const document = normalizeLorebookV3Document({
    data: {
      entries: [
        {
          content: "Spoiler fact about the city.",
          insertion_order: 0,
          keys: ["city", " city ", "CITY"],
          name: "City Secret",
        },
      ],
      name: "Quick Actions",
    },
    spec: "lorebook_v3",
  });

  const original = document.data.entries[0];
  assert.ok(original);

  const cleaned = applyLorebookQuickAction(original, "dedupe_keys");
  assert.deepEqual(cleaned.keys, ["city", "CITY"]);

  const hidden = applyLorebookQuickAction(cleaned, "mark_spoiler_hidden");
  assert.equal(readHeartWriteLorebookRuntime(hidden).hiddenFromUser, true);
  assert.equal(readHeartWriteLorebookRuntime(hidden).reviewRequired, true);
  assert.match(getLorebookEntryPreview(hidden), /Spoiler fact/);

  const selective = applyLorebookQuickAction(hidden, "make_selective");
  assert.equal(selective.selective, true);
  assert.ok(selective.secondary_keys?.length);

  const review = compileLorebookReview({
    ...document,
    data: {
      ...document.data,
      entries: [selective],
    },
  });

  assert.ok(review.some((issue) => issue.code === "hidden_entries_present"));
  assert.ok(review.some((issue) => issue.code === "review_required"));
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
