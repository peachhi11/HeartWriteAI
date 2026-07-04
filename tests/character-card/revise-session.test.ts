import assert from "node:assert/strict";
import test from "node:test";

import {
  applyCharacterCreationRevisionResponse,
  applyLorebookRevisionResponse,
  createCharacterCreationRevisionContext,
  createLorebookRevisionContext,
  formatRevisionContextSections,
  parseRevisionResponse,
} from "../../lib/character-card/reviseSession";
import {
  createEmptyCharacterCreationForm,
} from "../../lib/character-card/characterCreationFormCompiler";
import {
  createLorebookV3Document,
} from "../../features/lorebooks/schema";

test("applies approved character form revision operations and returns a diff", () => {
  const form = createEmptyCharacterCreationForm();

  const result = applyCharacterCreationRevisionResponse(form, {
    operations: [
      {
        action: "replace",
        path: "identity.characterName",
        reason: "Set the editable name.",
        value: "Julian Vale",
      },
      {
        action: "append",
        path: "psychology.coreWound",
        reason: "Add a cause-based wound line.",
        value: "Carries a fear that affection will vanish without warning.",
      },
    ],
    summary: "Named the character and added a core wound.",
  });

  assert.equal(result.next.identity.characterName, "Julian Vale");
  assert.match(result.next.psychology.coreWound, /affection will vanish/);
  assert.deepEqual(
    result.diffs.map((diff) => diff.pathId),
    ["identity.characterName", "psychology.coreWound"],
  );
});

test("rejects character form revision operations outside the approved path list", () => {
  const form = createEmptyCharacterCreationForm();

  assert.throws(
    () =>
      applyCharacterCreationRevisionResponse(form, {
        operations: [
          {
            action: "replace",
            path: "semanticSeedIds",
            value: ["fear_of_abandonment"],
          },
        ],
      }),
    (error) =>
      error instanceof Error &&
      /semanticSeedIds|Invalid option|Invalid input/.test(error.message),
  );
});

test("character revision context exposes semantic labels without raw seed ids", () => {
  const form = {
    ...createEmptyCharacterCreationForm(),
    semanticSeedIds: ["fear_of_abandonment"],
  };

  const { contextSections } = createCharacterCreationRevisionContext(form);
  const rendered = formatRevisionContextSections(contextSections);

  assert.match(rendered, /Fear of abandonment/);
  assert.doesNotMatch(rendered, /fear_of_abandonment/);
});

test("parses the last JSON patch block from a model response", () => {
  const form = createEmptyCharacterCreationForm();
  const { fields } = createCharacterCreationRevisionContext(form);
  const parsed = parseRevisionResponse(
    [
      "Earlier draft:",
      "```json",
      '{"operations":[{"path":"identity.characterName","value":"Wrong"}]}',
      "```",
      "Use this one:",
      "```json",
      '{"operations":[{"path":"identity.characterName","value":"Mara"}],"summary":"Set name."}',
      "```",
    ].join("\n"),
    fields,
  );

  assert.equal(parsed.operations[0]?.path, "identity.characterName");
  assert.equal(parsed.operations[0]?.value, "Mara");
});

test("applies approved lorebook revisions to content and keys", () => {
  const document = createLorebookV3Document({
    entries: [
      {
        constant: false,
        content: "Old relationship canon.",
        enabled: true,
        extensions: {},
        id: "entry-1",
        insertion_order: 0,
        keys: ["old"],
        name: "Relationship",
        use_regex: false,
      },
    ],
    extensions: {},
    name: "Draft Lorebook",
  });

  const result = applyLorebookRevisionResponse(document, {
    operations: [
      {
        action: "replace",
        path: "data.entries[0].content",
        value: "Relationship truth belongs in the lorebook, not the portable character engine.",
      },
      {
        action: "append",
        path: "data.entries[0].keys",
        value: ["relationship_truth", "canon"],
      },
    ],
    summary: "Moved story truth into lorebook language.",
  });

  assert.match(result.next.data.entries[0]?.content ?? "", /portable character engine/);
  assert.deepEqual(result.next.data.entries[0]?.keys, [
    "old",
    "relationship_truth",
    "canon",
  ]);
  assert.deepEqual(
    result.diffs.map((diff) => diff.pathId),
    ["data.entries[0].content", "data.entries[0].keys"],
  );
});

test("lorebook revision context only exposes approved entry paths", () => {
  const document = createLorebookV3Document({
    entries: [
      {
        constant: false,
        content: "Hidden door only opens when the ring is turned twice.",
        enabled: true,
        extensions: { heartwriteai: { hiddenFromUser: true } },
        id: "spoiler",
        insertion_order: 0,
        keys: ["ring"],
        name: "Spoiler entry",
        use_regex: false,
      },
    ],
    extensions: {},
    name: "Spoiler Lore",
  });

  const { fields } = createLorebookRevisionContext(document);

  assert.ok(fields.some((field) => field.pathId === "data.entries[0].content"));
  assert.equal(
    fields.some((field) => field.pathId === "data.entries[0].extensions"),
    false,
  );
});
