# HeartWrite skills

This directory is the repository-owned index for reviewed, app-relevant skill
contracts.

The Memory Vault remains the canonical project-memory and source-reference
location. The repository does not copy the full vault, external skill
catalogues, or private fixture text. A skill becomes repository-owned only
after its provenance, scope, privacy status, and runtime purpose have been
reviewed.

## Current slice

`manifest.json` inventories the 37 skills already represented by
`lib/character-card/storyRuntimeSkills.ts`. All 37 now have reviewed repository
bodies. The manifest is an organizational contract, not a second prompt
registry and not yet a source of runtime behavior.

`skill.schema.json` defines the minimum contract for a reviewed skill body:
frontmatter must carry ownership and provenance, and the body must include
`Purpose`, `Guardrails`, and `Provenance` sections.

Run `npm run validate:skills` to verify that the manifest and runtime registry
have the same stable slugs, labels, categories, and source classifications.
Run `npm run check:skill-equivalence` for the focused runtime-metadata check;
this does not change runtime imports or prompt selection.

## Migration rule

Future skill-body migrations should add a directory named after the stable
slug. Each migrated skill should retain a provenance link to the Memory Vault
or approved source note, declare whether it is public-runtime safe, and include
focused tests before the runtime registry is changed to consume it.

The proposed boundary for a future generated runtime registry is documented in
`docs/repository-skill-runtime-metadata-boundary.md`. Do not change runtime
imports until generated metadata matches the current registry exactly.
