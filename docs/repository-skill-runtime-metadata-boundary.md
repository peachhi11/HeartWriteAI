# Repository Skill Runtime Metadata Boundary

## Status

Design only. Runtime imports still use `lib/character-card/storyRuntimeSkills.ts`.

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

The first generated artifact is `lib/character-card/generatedRuntimeSkillMetadata.ts`.
It is currently a separate checked-in intermediate artifact; runtime imports
still use the existing registry. Only after the comparison is exact should
`storyRuntimeSkills.ts` become a thin compatibility export or be replaced by
the generated module.

## Migration Sequence

1. Add the structured metadata schema and one complete metadata record as a proof of shape. (Complete.)
2. Add a generator that produces a temporary or checked-in artifact. (Complete; the artifact currently contains the linked proof record.)
3. Compare generated metadata to the current registry for all 37 entries.
4. Add a CI/pre-commit stale-generated-output check.
5. Switch runtime imports only after equivalence is exact and focused compiler tests remain green.

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
