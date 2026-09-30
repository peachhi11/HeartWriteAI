# Semantic Context Mapping

- Reference clone: `/Users/meganmckinnon/Downloads/Archive/00_Source_Reference_Library/reference-repos/Semantic-Programming-Language-for-JetBrains`.
- The reference repo is a JetBrains syntax-highlighting plugin for `.se` and `.sp`, not a full runtime. Its push URL is disabled as `DISABLED_NO_PUSH`.
- HeartWrite should borrow its compact notation shape (`program`, `object`, `scope`, `node`, `relations`, `@` refs, `%` refs) for semantic mapping between vocabulary seeds, tags, book fields, context routes, and prompt modules.
- Source note: `docs/source-material/semantic-programming-language-jetbrains-reference.md`.
- Architecture note: `docs/architecture/semantic-context-mapping.md`.
- Example design map: `docs/semantic-maps/storybook-vocabulary-context.se`.
- This layer should keep user-facing labels fiction-friendly while backend routes can track heavier semantics.
- Core purpose: prevent vocabulary seeds from becoming loose word piles. Seeds should know their aliases, compatible tags, blocked routes, required context, book targets, prompt targets, platform routes, and `{{user}}` agency limits.
- Context routes to preserve: affirming, welcomed, playful, dark-romance pressure, conflicted, hesitant, wounding, repair-needed, boundary, blocked.
- Do not build a full parser yet. Next implementation step is a TypeScript seed graph and tests that borrow this node/edge model.
