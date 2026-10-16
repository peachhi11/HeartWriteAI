# HeartWrite skills

This directory is the repository-owned index for reviewed, app-relevant skill
contracts.

The Memory Vault remains the canonical project-memory and source-reference
location. The repository does not copy the full vault, external skill
catalogues, or private fixture text. A skill becomes repository-owned only
after its provenance, scope, privacy status, and runtime purpose have been
reviewed.

## Current slice

`manifest.json` inventories the 37 skills represented by the generated runtime
metadata. All 37 now have reviewed repository bodies. The manifest is an
organizational contract, not a second prompt registry and not a source of
runtime behavior.

`skill.schema.json` defines the minimum contract for a reviewed skill body:
frontmatter must carry ownership and provenance, and the body must include
`Purpose`, `Guardrails`, and `Provenance` sections.

`runtime-metadata.schema.json` defines the separate, structured compiler
metadata boundary. It supports stable identity, provenance, runtime status,
activation, state fields, routing, safety, and a namespaced `extensions` object
for future fields. `npm run generate:runtime-skill-metadata` emits all linked
records into an all-record artifact plus separate public and private artifacts.
`npm run check:generated-runtime-skill-metadata` verifies all three outputs are
current. `storyRuntimeSkills.ts` remains an internal compatibility export;
public surfaces should import `publicStoryRuntimeSkills.ts` so private records
are excluded at module-boundary level.

Run `npm run validate:skills` to verify that the manifest and generated runtime
metadata have the same stable slugs, labels, categories, and source
classifications, and that any linked runtime metadata records agree with the
manifest.
Run `npm run check:skill-equivalence` for the focused runtime-metadata check;
this does not change runtime imports or prompt selection.

## Migration rule

Future skill-body migrations should add a directory named after the stable
slug. Each migrated skill should retain a provenance link to the Memory Vault
or approved source note, declare whether it is public-runtime safe, and include
focused tests before the runtime registry is changed to consume it.

The compatibility boundary and public/private import rules are documented in
`docs/repository-skill-runtime-metadata-boundary.md`. Do not import the
all-record registry from a public browser surface.

The focused surface boundary check is
`tests/character-card/runtime-surface-boundary.test.ts`. It currently verifies
the public source tree, private desktop gate, and separate public/private
selector catalogs without changing prompt selection.

The shared selector core is in
`lib/character-card/storyRuntimeSkillSelector.ts`. Public and private entrypoints
instantiate it with their own catalogs, keeping the surface decision at the
import boundary.

`compileChatPrompt` is the first runtime consumer. It uses the public selector
by default and accepts explicit slugs, tags, and scopes. Private callers must
inject the private selector intentionally. The compiler emits only prompt
signals, state fields, and memory-routing hints; it does not embed skill bodies
or private fixture text in the prompt.
