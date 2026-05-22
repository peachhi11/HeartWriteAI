# CharacterGen Reference Port Map

This document keeps the old CharacterGen project useful without letting it define the new implementation stack.

HeartWriteAI is the active app. The target stack is Next.js, Tailwind CSS, TypeScript, Rust, and Tauri v2. The old Python/PyQt CharacterGen codebase is a reference archive for workflows, schemas, prompt strategy, tests, and taxonomy.

## Porting Rule

Do not copy old CharacterGen modules wholesale.

For each old module, decide whether to:

- `port now`: rebuild the idea directly in HeartWriteAI.
- `distill later`: extract the product rule, schema, or test shape after the current milestone.
- `reference only`: keep it as background context.
- `quarantine`: do not use except as an example of what to avoid.

## Module Map

| CharacterGen source | HeartWriteAI destination | Decision |
| --- | --- | --- |
| `png_metadata_engine.py` | `lib/character-card/*`, `src-tauri/src/codecs/png_card.rs` | reference only |
| `card_format_conversion.py` | CCV3 conversion tests and normalized card model | distill later |
| `card_schema_validation.py` | Zod schemas and TS validation helpers | distill later |
| `card_library.py` | Tauri local library commands, SQLite/cache layer, frontend hooks | port now |
| `chat_context_compiler.py` | TypeScript prompt/runtime compiler | port now |
| `runtime_chat.py` | chat runtime service and provider adapter plan | distill later |
| `runtime_state.py` | local session state model and save/resume flow | port now |
| `lorebook_context.py` | lore trigger engine and compiled-context preview | port now |
| `lorebook_assets.py` | lorebook asset editor, attachments, active/inherited status | port now |
| `lorebook_health.py` | lorebook QC and token-weight warnings | distill later |
| `trope_engine_catalog.py` | tag/trope suggestion engine and route presets | distill later |
| `engine_state_card_tropes/` | AU/trope packs and friendly suggestion labels | distill later |
| `prompt_mapper.py` | prompt-pack compiler and reference insertion rules | distill later |
| `response_humanizer.py` | chat output cleanup rules | reference only |
| `drag_drop_zone.py` / `drag_drop_listener.py` | browser and Tauri drag/drop test cases | reference only |
| `chat_workspace.py` | Next.js chat/group-chat workflow design | distill later |
| `ui.py` | workflow archaeology only | reference only |

## Design Reference Map

| Reference source | HeartWriteAI use |
| --- | --- |
| `character_card_intro_engine_architecture.md` | route-state model, trope weights, intro/greeting phases |
| `charactergen_reference_module_plan.md` | reference bundle ownership and prompt-pack roadmap |
| `explicit_dialogue_bundle_architecture.md` | prompt boundaries for explicit dialogue references |
| `grounded_bdsm_source_routing.md` | consent-forward source routing and anti-flattening rules |
| `bdsm_handbook_batch_keep_distill_quarantine.md` | keep/distill/quarantine source governance |
| `data/base_prompts/Default.json` | character prompt-pack seed after rewrite and dedupe |
| `data/persona_prompts/Default.json` | persona prompt-pack seed after rewrite and dedupe |

## Near-Term Port Queue

1. Local library cache and folder workflow.
2. Lorebook asset editor and active lore preview.
3. ForceBary-style tag/trope suggestion action.
   - Seeded with an app-owned emotion lexicon in `lib/character-card/emotionLexicon.ts`.
   - Use external emotion wheels/posters as reference only; do not transcribe copyrighted lists wholesale.
   - Route detected emotional language into friendly tone tags such as `angsty`, `hurt/comfort`, `slow burn`, `fluff`, `cozy romance`, `comfort`, `curious`, `high agency`, and `quiet tension`.
   - Keep body-signal, feeling, and classifier analysis hidden. The user should see only friendly story-engine selectors and reviewable tags; the prompt compiler can quietly translate those tags into the deeper route behavior.
4. Runtime context preview using the current TypeScript prompt compiler.
5. Session state separation for chat and group chat.
6. Prompt-pack editor for character and persona generation.

## Quarantine Rules

- Keep raw PDFs and source-heavy research outside the app.
- Keep old migrations outside the app unless converted into a specific SQLite/Tauri migration.
- Keep Python/PyQt UI code out of the Next.js frontend.
- Do not add explicit or BDSM source prose directly to runtime prompts. Distill into behavior, consent, safety, negotiation, aftercare, and prompt-validation rules.
