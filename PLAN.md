# HeartWriteAI Implementation Plan

HeartWriteAI is the Next.js + Tailwind + shadcn + Tauri rebuild of CharacterGen. The app should become a local-first studio for CCV3 character cards, editable personas, lorebooks, scenario arcs, and eventually chat runtime compilation.

## Scope Reset

CharacterGen is now treated as a concept and reference archive, not as code to move wholesale.

The build target is:

- Next.js App Router for screens, stateful editors, and browser-compatible import/export fallbacks.
- Tailwind CSS v4 and shadcn-style primitives for the user-facing interface.
- Tauri v2 for desktop-only file dialogs, local library scanning, SQLite/cache work, asset IO, and packaged app distribution.
- TypeScript for normalized card models, schema validation, prompt/runtime assembly, and UI logic.
- Rust for native file, PNG/CHARX, cache, and filesystem-heavy commands.

Python/PyQt CharacterGen modules should be ported only as distilled behavior, schemas, test cases, prompt maps, or product workflows. Do not copy recovered Python UI code, old migrations, raw PDFs, or prompt source dumps into the app unless they have been deliberately converted into HeartWriteAI docs, fixtures, or implementation tasks.

## Phase 1: Stable Scaffold and Docs Checkpoint

Goal: establish a clean, reproducible base before porting major CharacterGen behavior.

- Keep the current Next.js App Router, Tailwind v4, shadcn/ui, and Tauri v2 scaffold as the primary app foundation.
- Keep README focused on setup, current status, and next milestone.
- Keep this plan as the roadmap for implementation order and handoff.
- Keep updater work parked in [`docs/auto-update-security.md`](docs/auto-update-security.md) until real signing and release infrastructure exists.
- Before committing this checkpoint, verify:
  - `npm run lint`
  - `npm run build`
  - `npm run tauri:build`

Exit criteria:

- README and PLAN are current.
- The app builds as a static frontend for Tauri.
- The desktop shell can be bundled locally.

## Phase 2: CCV3 PNG/JSON Import/Export Codec

Goal: make HeartWriteAI capable of reading and writing character-card metadata across browser and desktop runtimes.

- Add a small app-native character-card codec layer using:
  - `png-chunks-extract`
  - `png-chunks-encode`
  - `png-chunk-text`
- Read PNG `tEXt` chunks and prefer `ccv3` metadata when present.
- Fall back to `chara` metadata for V1/V2 imports and conversion checks.
- Accept raw JSON and base64-encoded JSON metadata.
- Support browser drag/drop and file-picker imports without requiring Tauri APIs.
- Support desktop native dialogs and desktop drag/drop when Tauri APIs are available.
- Write exported PNGs with embedded `ccv3` metadata.
- Keep JSON visible as export/debug infrastructure, not the main editing UI.
- Add focused tests for:
  - PNG with `ccv3`
  - PNG with only `chara`
  - PNG with no supported card metadata
  - write/read round trip

Exit criteria:

- A dragged-in character PNG can be parsed into app data.
- A generated or edited CCV3 card can be embedded back into a PNG.
- Browser mode downloads exported JSON/PNG safely, while desktop mode can use native save dialogs.

Reference signals:

- Use old `character_app/png_metadata_engine.py` only as historical context. HeartWriteAI should keep the current spec-aware PNG codec as the source of truth.
- Use old `card_format_conversion.py` as a list of conversion cases to test, not as the target V3 shape.

## Phase 2.5: CharacterGen Reference Port Map

Goal: turn the old CharacterGen archive into an explicit migration map so the project does not drift or accidentally re-import the old stack.

- Create and maintain `docs/charactergen-reference-port-map.md`.
- Map each old module family to its HeartWriteAI destination:
  - card codecs and schemas
  - local library/cache
  - prompt templates and reference bundles
  - lorebook assets and lore activation
  - trope/route engines
  - chat context compiler
  - runtime state/session saves
  - UI workflows
- Mark each source as one of:
  - port now
  - distill later
  - reference only
  - quarantine
- Prefer extracting tests, data shapes, and product rules over copying implementation.
- Keep explicit/source-heavy material behind distillation and prompt-validation boundaries.

Exit criteria:

- There is a readable porting map from old CharacterGen concepts to new HeartWriteAI modules.
- The roadmap names which CharacterGen ideas are in scope for the Next.js/Tailwind/Tauri rebuild.
- Accidental source drops remain ignored and out of app commits.

## Phase 3: Character Intake Hub

Goal: make the character page the first creation point.

- Treat the first page as the raw intake hub: paste messy notes, scraped text, or imported card data.
- Import existing CharacterGen prompt templates as structured prompt packs only after they are reviewed, deduplicated, and rewritten into user-facing language.
- Route intake into editable output groups:
  - character card
  - persona
  - scenario
  - world/character/persona/scenario lorebooks
- Keep all generated outputs editable through normal fields, not raw JSON.
- Preserve CCV3 as the main new-card format.
- Treat V1/V2 as import/convert/sanity-check paths.
- Add dirty-state protection before switching cards or clearing fields.

Exit criteria:

- A user can paste raw notes and receive editable structured outputs.
- The user can adjust any generated field before export.
- The intake hub can suggest likely tags, route/trope metadata, and lorebook candidates without exposing raw taxonomy noise.

## Phase 4: Editable Lorebook, Persona, and Scenario Assets

Goal: preserve generated content as user-facing assets, not hidden one-shot generation output.

- Add editable lorebook output as nested entries with user-facing fields:
  - name
  - keys/triggers
  - content
  - priority
  - probability
  - gates/tags when implemented
- Support world, character, persona, scenario, and arc lorebook scopes.
- Attach and detach lorebooks from characters, personas, worlds, and scenarios.
- Show which lorebooks are active and whether each active book is direct or inherited.
- Add delete-with-confirmation for unwanted saved assets.
- Feed trope/scenario selections into scenario and arc lorebooks rather than permanently bloating character cards.
- Rebuild the useful parts of CharacterGen `lorebook_context.py` and `lorebook_assets.py` as TypeScript/Rust-friendly concepts:
  - trigger keys
  - priorities
  - probabilities
  - output channels
  - recursion prevention
  - owner attachments
  - active/inherited visibility

Exit criteria:

- Lorebooks can be saved, loaded, attached, detached, edited, and deleted.
- Active lorebook state is visible and understandable.
- Triggered lore can be previewed before it enters chat context.

## Phase 4.5: Tag, Trope, and Route Suggestion Engine

Goal: replace raw technical filters with a friendly suggestion layer inspired by CharacterGen's trope catalogs and the Janitor-style tag ecosystem.

- Build a local suggestion engine for card tags, AU tags, role tags, POV tags, and route/trope tags.
- Use CharacterGen `trope_engine_catalog.py` and `engine_state_card_tropes/` as source taxonomy references, then normalize into readable HeartWriteAI labels.
- Keep tags searchable by aliases such as Dom, Domme, Sub, switch, FemPOV, MalePOV, AnyPOV, enemies to lovers, omegaverse, rockstar AU, esports AU, college AU, mafia AU, and royal AU.
- Add a ForceBary-style action that can suggest tags from card text, scenario, first message, lorebook entries, and creator notes.
- Show suggestions as user-reviewable chips, never as silent hidden metadata.
- Keep safety/content-policy tags separate from romance discovery tags so the UI can explain what each tag is for.

Exit criteria:

- Users can ask the app to suggest tags for imported or generated cards.
- Suggested tags explain themselves in friendly language.
- Tags populate the library filters and exported metadata only after user confirmation.

## Phase 5: Tauri Local Library and File Bridge

Goal: support real local libraries rather than one-file browser demos.

- Add Tauri commands for native open/save dialogs and safe local file reads/writes.
- Add a local card-library scanner for folders containing many character PNGs.
- Use lazy card metadata loading and thumbnail caching so large libraries remain responsive.
- Keep image and card storage local-first.
- Add settings for library paths, cache behavior, and backup behavior.
- Keep library filters friendly and romance-platform familiar: chat style, POV, character role, user role, tropes, and AU tags.
- Rebuild the durable parts of CharacterGen `card_library.py` as Tauri commands and typed frontend hooks.
- Keep browser mode functional with explicit no-desktop fallbacks instead of calling Tauri APIs outside Tauri.

Exit criteria:

- The app can browse and manage a local card library without loading every card fully into memory.
- Users can import/export card PNGs and JSON through native desktop dialogs.
- Desktop-only controls are hidden or clearly downgraded in browser mode.

## Phase 6: Context Compiler and Chat Runtime

Goal: integrate chat only after character/persona/scenario/lore data has reliable structure.

- Add a formal context compiler that assembles:
  - character
  - persona
  - active scenario
  - active lorebooks
  - recent chat
  - summaries
  - runtime instructions
- Enforce one shared token budget across all prompt channels.
- Add model/proxy/settings UI with configurable provider, endpoint, model, token budget, and stop presets.
- Add turn prefixing so the model knows whose turn is expected.
- Add hierarchical chat summaries before long-running chat becomes core.
- Keep current scenario override editable so users can load a character into a different trope or setting.
- Let CCV3 `system_prompt` replace the app default prompt, or extend it with `{{original}}`.
- Keep `post_history_instructions` as final card-authored steering.
- Enforce minor-NPC safety in runtime context: minor NPCs may appear in SFW family/slice-of-life scenes, but must not participate in or remain present for sexual/NSFW scenes.
- Rebuild CharacterGen `chat_context_compiler.py`, `runtime_chat.py`, and `runtime_state.py` as HeartWriteAI-native modules:
  - TypeScript compiler for previewable prompt assembly
  - Tauri/Rust persistence for local sessions where needed
  - token budgeting and recent-chat pruning
  - summaries and persistent memory blocks
  - stop sequence presets
  - group-chat next-speaker routing

Exit criteria:

- Chat runtime consumes compiled context instead of raw page state.
- Lorebooks and scenario arcs can influence ongoing chat beyond the opening message.
- Users can preview what context will be sent before chat starts.
- Runtime session state remains separate from stable card assets.

## Phase 6.5: Group Chat and Multi-Character Runtime

Goal: bring over the useful CharacterGen chat-workspace concepts without porting the PyQt UI.

- Create a Next.js group-chat workspace with participant roster, active card/persona/lore visibility, and compact session panels.
- Add a next-speaker orchestrator that can choose which character should reply next.
- Format group history explicitly as speaker-labeled turns.
- Support per-character active lorebooks and shared scene state.
- Keep group-only greetings and CCV3 group greeting fields visible in the editor.

Exit criteria:

- A user can stage a multi-character room from imported/generated cards.
- Each character receives only the relevant compiled context plus shared scene state.
- Group sessions can be saved and resumed locally.

## Phase 7: Legacy and Generational Series Tools

Goal: support long-running romance series, families, and adult descendant casts without making unsafe user or NPC assumptions.

- Generate adult-only offspring and legacy profile drafts from parent cards.
- Track inherited names, species/world rules, relationship lineage, and suggested AU/trope tags.
- Keep children as SFW-only NPC context when needed for family realism.
- Promote adult descendants into normal editable character cards only after explicit user review.

Exit criteria:

- Users can plan a generational series without manually rebuilding every inherited trait.
- Generated legacy outputs include safety notes and remain editable before card export.

## Phase 8: Reference Bundle Distillation and Prompt Quality

Goal: move valuable CharacterGen prompt/reference material into HeartWriteAI without importing raw source dumps or bloated wording.

- Convert old base prompts and persona prompts into versioned prompt packs.
- Distill design-reference files into small runtime references:
  - character psychology
  - romance craft
  - setting scaffolds
  - explicit dialogue boundaries
  - prompt validation
  - source quality/quarantine rules
- Keep explicit/BDSM material as consent-forward behavior, safety, role motivation, negotiation, aftercare, and anti-flattening guidance.
- Quarantine weak, unsafe, redundant, or source-dumped material.
- Add regression tests or golden examples for high-risk prompt routing.

Exit criteria:

- Prompt packs are editable, versioned, and explainable.
- Reference material improves output behavior without leaking raw source prose.
- The app can tell users why a reference pack or route suggestion was applied.

## Defaults and Constraints

- New cards are CCV3-first.
- V1/V2 support exists for import, conversion, and sanity checks.
- User-facing editing should be readable fields and controls, not exposed raw JSON.
- JSON remains necessary for export, embedded PNG metadata, validation, and debugging.
- Tauri is the primary desktop wrapper unless a concrete Electron-only requirement appears.
- Auto-update remains disabled until signing keys, HTTPS releases, updater artifacts, rollback behavior, and staged rollout are real.
- CharacterGen Python/PyQt remains a reference archive. HeartWriteAI implementation lives in Next.js, Tailwind, TypeScript, Rust, and Tauri v2.
