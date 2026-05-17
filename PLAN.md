# AmourAI Implementation Plan

AmourAI is the working-title Next.js + Tailwind + shadcn + Tauri rebuild of CharacterGen. The app should become a local-first studio for CCV3 character cards, editable personas, lorebooks, scenario arcs, and eventually chat runtime compilation.

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

## Phase 2: CCV3 PNG Import/Export Codec

Goal: make AmourAI capable of reading and writing character-card PNG metadata.

- Add a small app-native character-card codec layer using:
  - `png-chunks-extract`
  - `png-chunks-encode`
  - `png-chunk-text`
- Read PNG `tEXt` chunks and prefer `ccv3` metadata when present.
- Fall back to `chara` metadata for V1/V2 imports and conversion checks.
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

## Phase 3: Character Intake Hub

Goal: make the character page the first creation point.

- Treat the first page as the raw intake hub: paste messy notes, scraped text, or imported card data.
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

Exit criteria:

- Lorebooks can be saved, loaded, attached, detached, edited, and deleted.
- Active lorebook state is visible and understandable.

## Phase 5: Tauri Local Library and File Bridge

Goal: support real local libraries rather than one-file browser demos.

- Add Tauri commands for native open/save dialogs and safe local file reads/writes.
- Add a local card-library scanner for folders containing many character PNGs.
- Use lazy card metadata loading and thumbnail caching so large libraries remain responsive.
- Keep image and card storage local-first.
- Add settings for library paths, cache behavior, and backup behavior.

Exit criteria:

- The app can browse and manage a local card library without loading every card fully into memory.
- Users can import/export card PNGs and JSON through native desktop dialogs.

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

Exit criteria:

- Chat runtime consumes compiled context instead of raw page state.
- Lorebooks and scenario arcs can influence ongoing chat beyond the opening message.

## Defaults and Constraints

- New cards are CCV3-first.
- V1/V2 support exists for import, conversion, and sanity checks.
- User-facing editing should be readable fields and controls, not exposed raw JSON.
- JSON remains necessary for export, embedded PNG metadata, validation, and debugging.
- Tauri is the primary desktop wrapper unless a concrete Electron-only requirement appears.
- Auto-update remains disabled until signing keys, HTTPS releases, updater artifacts, rollback behavior, and staged rollout are real.
