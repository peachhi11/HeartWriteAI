import assert from "node:assert/strict";
import test from "node:test";

import {
  buildMemoryVaultIndex,
  createMemoryVaultIndexEntry,
  extractWikilinks,
  parseMarkdownFrontmatter,
  retrieveFromMemoryVaultIndex,
} from "../../lib/character-card/memoryVaultRetrieval";

test("parses retrieval frontmatter and indexes markdown notes", () => {
  const entry = createMemoryVaultIndexEntry({
    content: `---
tags:
  - heartwrite
  - retrieval
keys:
  - prompt compiler
  - StoryBook
summary: "Select when routing StoryBook package data into prompt packs."
layer: prompt_compiler
book_type: prompt_book
source_kind: runtime_design
storybook_id: story_alpha
priority: 12
requires: [Character Book, World Book]
guide_only: false
---
# Prompt Compiler Logic

Use [[Obsidian Retrieval Layer]] when compiling prompt packs.
`,
    path: "04_Prompt_Compiler/Prompt Compiler Logic.md",
    sourceVaultId: "heartwrite",
  });

  assert.equal(entry.title, "Prompt Compiler Logic");
  assert.equal(entry.layer, "prompt_compiler");
  assert.equal(entry.bookType, "prompt_book");
  assert.equal(entry.sourceKind, "runtime_design");
  assert.equal(entry.storybookId, "story_alpha");
  assert.equal(entry.priority, 12);
  assert.deepEqual(entry.requires, ["Character Book", "World Book"]);
  assert.deepEqual(entry.wikilinks, ["Obsidian Retrieval Layer"]);
  assert.match(entry.id, /^heartwrite:story_alpha:/);
  assert.ok(entry.tokenEstimate > 0);
});

test("builds a stable local vault index with source vault ids", () => {
  const index = buildMemoryVaultIndex(
    [
      {
        content: "# Character Book\n\nIdentity and voice.",
        path: "03_Memory_Core/Character Book.md",
        sourceVaultId: "heartwrite",
      },
      {
        content: "# World Book\n\nRules and locations.",
        path: "03_Memory_Core/World Book.md",
        sourceVaultId: "heartwrite",
      },
    ],
    {
      buildId: "test-build",
      builtAt: 10,
    },
  );

  assert.equal(index.buildId, "test-build");
  assert.equal(index.builtAt, 10);
  assert.equal(index.stale, false);
  assert.deepEqual(index.sourceVaultIds, ["heartwrite"]);
  assert.equal(index.entries.length, 2);
});

test("retrieves matching notes while respecting storybook and privacy gates", () => {
  const index = buildMemoryVaultIndex(
    [
      {
        content: `---
keys: [prompt compiler, proxy context]
layer: prompt_compiler
book_type: prompt_book
storybook_id: story_alpha
privacy: project
---
# Prompt Compiler Logic

Compile selected StoryBook material into platform prompt packs.
`,
        path: "Prompt Compiler Logic.md",
      },
      {
        content: `---
keys: [prompt compiler]
layer: prompt_compiler
book_type: prompt_book
storybook_id: story_beta
privacy: project
---
# Other Story Compiler

This belongs to another StoryBook.
`,
        path: "Other Story Compiler.md",
      },
      {
        content: `---
keys: [prompt compiler secret]
layer: prompt_compiler
book_type: prompt_book
storybook_id: story_alpha
privacy: do_not_send
---
# Private Compiler Note

Do not send this outside the local machine.
`,
        path: "Private Compiler Note.md",
      },
    ],
    {
      stale: true,
    },
  );

  const result = retrieveFromMemoryVaultIndex(index, {
    bookTypes: ["prompt_book"],
    layers: ["prompt_compiler"],
    privacyMode: "provider_safe",
    storybookId: "story_alpha",
    text: "prompt compiler proxy context",
  });

  assert.equal(result.trace.staleIndex, true);
  assert.deepEqual(
    result.entries.map((entry) => entry.title),
    ["Prompt Compiler Logic"],
  );
  assert.ok(
    result.trace.removed.some(
      (removed) =>
        removed.title === "Other Story Compiler" &&
        removed.reason === "storybook",
    ),
  );
  assert.ok(
    result.trace.removed.some(
      (removed) =>
        removed.title === "Private Compiler Note" &&
        removed.reason === "privacy",
      ),
  );

  const globalQuery = retrieveFromMemoryVaultIndex(index, {
    bookTypes: ["prompt_book"],
    layers: ["prompt_compiler"],
    text: "prompt compiler proxy context",
  });

  assert.deepEqual(globalQuery.entries, []);
  assert.ok(
    globalQuery.trace.removed.some(
      (removed) =>
        removed.title === "Prompt Compiler Logic" &&
        removed.reason === "storybook",
    ),
  );
});

test("keeps guide-only and source material out of runtime retrieval by default", () => {
  const index = buildMemoryVaultIndex([
    {
      content: `---
keys: [world book]
layer: source_material
source_kind: source_material
---
# Worldbuilding Source

Reference material for source mining.
`,
      path: "05_Source_Material/Worldbuilding Source.md",
    },
    {
      content: `---
keys: [world book]
layer: memory_core
book_type: world_book
guide_only: true
---
# World Book Guide

Guide-only architecture.
`,
      path: "03_Memory_Core/World Book Guide.md",
    },
    {
      content: `---
keys: [world book]
layer: memory_core
book_type: world_book
---
# Active World Book

Runtime-safe world rules.
`,
      path: "03_Memory_Core/Active World Book.md",
    },
  ]);

  const runtime = retrieveFromMemoryVaultIndex(index, {
    bookTypes: ["world_book"],
    layers: ["memory_core"],
    text: "world book",
  });

  assert.deepEqual(
    runtime.entries.map((entry) => entry.title),
    ["Active World Book"],
  );
  assert.ok(
    runtime.trace.removed.some(
      (removed) =>
        removed.title === "World Book Guide" &&
        removed.reason === "guide_only",
    ),
  );

  const sourceMining = retrieveFromMemoryVaultIndex(index, {
    allowGuideOnly: true,
    includeSourceMaterial: true,
    text: "world book",
  });

  assert.deepEqual(
    sourceMining.entries.map((entry) => entry.title),
    ["Active World Book", "World Book Guide", "Worldbuilding Source"],
  );
});

test("parses simple frontmatter and wikilinks without a yaml dependency", () => {
  const parsed = parseMarkdownFrontmatter(`---
tags: [heartwrite, retrieval]
constant: true
priority: 4
---
# Note

See [[Prompt Compiler Logic|compiler]] and [[Memory Core Model#StoryBook]].
`);

  assert.deepEqual(parsed.data.tags, ["heartwrite", "retrieval"]);
  assert.equal(parsed.data.constant, true);
  assert.equal(parsed.data.priority, 4);
  assert.match(parsed.body, /# Note/);
  assert.deepEqual(extractWikilinks(parsed.body), [
    "Memory Core Model",
    "Prompt Compiler Logic",
  ]);
});
