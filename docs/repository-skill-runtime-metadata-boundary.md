# Repository Skill Runtime Metadata Boundary

## Status

Compatibility boundary implemented. Existing internal imports still use
`lib/character-card/storyRuntimeSkills.ts`, which now re-exports the generated
all-record registry. Public surfaces use
`lib/character-card/publicStoryRuntimeSkills.ts`, which imports only the
public generated artifact.

The repository currently has 37 runtime skill entries, all with reviewed `SKILL.md` bodies. The richer mentor-voice and commercial-pattern references remain vault-owned.

## Boundary

Keep three concerns separate:

1. `skills/<slug>/SKILL.md` is the human-readable, provenance-linked contract. It explains purpose, guardrails, and routing behavior.
2. A structured runtime metadata input owns compiler fields: summary, source links, scope, activation tags, trigger seeds, state fields, compiler signals, memory routing, continuity links, and guardrails.
3. A generated TypeScript module is the runtime artifact consumed by the compiler and checked into the repository for deterministic builds.

The current `skills/manifest.json` remains the migration and governance inventory. It should continue to own stable identity and review status, but it should not become a partial duplicate of the runtime registry.

## Proposed Shape

Add a structured metadata file or directory with one complete record per runtime skill, for example:

```text
skills/runtime-metadata/<slug>.json
```

The proof-of-shape contract is now present in
`skills/runtime-metadata.schema.json`, with one linked record at
`skills/runtime-metadata/romantic-erotic-storytelling-generator.json`. The
record is deliberately richer than the current TypeScript interface: it adds
runtime status, activation mode, public-safety status, explicit agency and
consent handling, and a namespaced `extensions` object for future metadata
without forcing an immediate registry migration.

Each record should contain the complete `StoryRuntimeSkill` shape. The generator should:

- validate the slug, label, category, and source against `skills/manifest.json`
- validate every scope value against the existing `MemoryVaultBookType` union
- reject duplicate slugs, empty routing arrays, broken local skill links, and unknown continuity targets when a link is intended to be repository-owned
- preserve explicit source links without copying private fixture text
- emit stable, formatted TypeScript in manifest order
- fail when generated output differs from the checked-in runtime artifact

The generated artifacts are:

- `lib/character-card/generatedRuntimeSkillMetadata.ts` for internal validation
  and private tooling.
- `lib/character-card/generatedPublicRuntimeSkillMetadata.ts` for public-safe
  browser surfaces.
- `lib/character-card/generatedPrivateRuntimeSkillMetadata.ts` for explicit
  private tooling and audits.

`storyRuntimeSkills.ts` is now a thin compatibility export so existing internal
imports continue to work. Public code must import
`publicStoryRuntimeSkills.ts`; importing the all-record registry from a public
surface would make private metadata eligible for the browser bundle.

Both surface entrypoints now instantiate the shared selector core in
`storyRuntimeSkillSelector.ts`. The public entrypoint selects from the
public-only generated artifact, while the private compatibility registry
selects from all records. The selector only filters the already-approved
surface catalog; it does not change prompt selection or expose raw fixture
text.

`compileChatPrompt` is now the first runtime consumer. It defaults to the
public selector and accepts explicit skill slugs, activation modes, tags,
trigger seeds, state fields, and scopes. A private
caller must inject the all-record selector deliberately; private slugs are not
available through the default compiler path. The compiler adds only the
selected records' prompt signals, state fields, and memory-routing hints to a
`Runtime Skill Signals` context section. It does not copy skill bodies,
summaries, source links, guardrails, or fixture text into the prompt, and it
does not change the prompt when no runtime-skill inputs are supplied.

The compiler also accepts bounded active context: an active StoryBook contributes
the `prompt_book` scope, while an active scenario contributes the
`scenario_book` scope and only its explicit runtime tags. Inactive scenarios do
not route their ordinary tags. This bridge does not infer skills from scenario
summaries, free text, or trope prose.

The private `/chat` preview now uses this seam through
`lib/chat/localChatRuntime.ts` before sending its local Ollama request. The
preview passes the selected saved scenario's explicit tags and editable
scenario override into the compiler, then sends the resulting system prompt
and bounded context as one system message. The public `/api/chat` provider
route remains unchanged.

## Migration Sequence

1. Add the structured metadata schema and one complete metadata record as a proof of shape. (Complete.)
2. Add a generator that produces a temporary or checked-in artifact. (Complete; the artifact currently contains the linked proof record.)
3. Compare generated metadata to the current registry for all 37 entries. (Complete.)
4. Add a CI/pre-commit stale-generated-output check. (Complete.)
5. Switch runtime imports only after equivalence is exact and focused compiler tests remain green. (Compatibility export complete; public-surface adoption remains a follow-up.)

The current surface audit is covered by
`tests/character-card/runtime-surface-boundary.test.ts`. It asserts that the
production source tree cannot import the all-record registry, that the public
module resolves exactly the public-safe generated records, and that the private
desktop gate remains disabled for public browser builds. No production route
currently consumes the all-record registry directly. The compiler consumer is
covered by `tests/character-card/prompt-runtime.test.ts`, including the
negative case where a private slug is requested through the public default.

## Non-Goals

- Do not generate runtime behavior from the human-readable Markdown body.
- Do not make `SKILL.md` frontmatter carry all compiler arrays.
- Do not copy the full Memory Vault or external skill catalogue into the app repository.
- Do not make Supabase or cloud persistence part of this boundary.
- Do not change prompt selection as part of the metadata migration.

## Review Questions

- Should complete metadata live as one JSON file or one file per skill? One file per skill keeps diffs scoped and supports privacy review; a generated index can provide fast loading.
- Should continuity links to vault-only skills be validated as opaque references or split into repository and vault link types? The first generator should preserve them as strings and only enforce repository-local targets when explicitly marked local.
- Should the generated artifact be committed? Yes for deterministic local-first builds, with a stale-output check preventing hand edits.
