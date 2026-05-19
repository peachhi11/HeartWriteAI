# HeartWriteAI Implementation Plan

HeartWriteAI is a local-first romance creation suite for character cards, personas, persona matching, lorebooks, image assets, character chat, and group chat. It is not a general adventure/RPG engine; every workflow should serve romance-focused character creation, romantic roleplay, or supporting assets for that experience.

The app is CCV3-first. New cards should be authored as Character Card V3, while V1/V2 support exists for import, conversion, compatibility checks, and migration.

## Phase 1: Scaffold, Brand, and Repo Hygiene

Goal: keep the project stable enough to build on without fighting stale names, duplicate generated files, or unclear local setup.

- Keep the Next.js App Router, Tailwind v4, shadcn/ui, and Tauri v2 scaffold as the primary app foundation.
- Keep README focused on setup, current status, and the next milestone.
- Keep this plan as the implementation roadmap and handoff document.
- Keep HeartWriteAI naming consistent across docs, app chrome, package metadata, and Tauri config.
- Keep generated build output out of version control, especially `.next`, `out`, `.tmp-tests`, and `src-tauri/target`.
- Keep updater work parked in [`docs/auto-update-security.md`](docs/auto-update-security.md) until real signing and release infrastructure exists.

Exit criteria:

- README and PLAN describe HeartWriteAI accurately.
- The worktree is free of Finder-style duplicate source/config files.
- Build caches and generated artifacts are ignored.
- The app can still pass the project test suite after cleanup.

## Phase 2: CCV3 Character Card Import, Edit, and Export

Goal: make HeartWriteAI reliable for reading, editing, converting, and exporting character cards.

- Preserve CCV3 as the native authoring format.
- Read PNG `tEXt` chunks and prefer `ccv3` metadata when present.
- Fall back to `chara` metadata for V1/V2 imports and conversion checks.
- Write exported PNGs with embedded `ccv3` metadata.
- Keep JSON visible as export/debug infrastructure, not the main editing UI.
- Maintain focused tests for:
  - PNG with `ccv3`
  - PNG with only `chara`
  - PNG with no supported card metadata
  - write/read round trip
  - macro-extension preservation
- Expand the current editor so generated cards can be adjusted through readable fields before export.

Exit criteria:

- A dragged-in character PNG can be parsed into editable app data.
- A generated or edited CCV3 card can be embedded back into a PNG.
- The user can inspect conversion results before saving.

## Phase 3: Real Studio Sections

Goal: turn the shell/sidebar into an actual studio, not a dashboard with conceptual cards.

- Add dedicated routes and working screens for:
  - Character Cards
  - Persona Studio
  - Persona Matching
  - Lorebooks
  - Image Generation
  - Card Conversion
  - Character Chat
  - Group Chat
  - Settings
- Use the HeartWriteAI brand assets for app chrome, sidebar marks, empty states, and export/watermark branding.
- Keep navigation persistent and predictable.
- Avoid exposing raw JSON as the primary editing experience.

Exit criteria:

- Each sidebar section opens a real workspace with a clear first action.
- Empty states explain what the user can create without becoming a marketing page.
- Existing character-card import/export remains reachable from the Character Cards area.

## Phase 4: Persona Studio and Persona Matching

Goal: support the user persona side of romance roleplay as a first-class workflow.

- Create standalone persona authoring for users who do not want to match a persona to a generated character.
- Create persona matching that reads a character's trope, power dynamic, speech style, boundaries, and romantic pacing.
- Generate editable persona outputs that support:
  - appearance
  - temperament
  - relationship stance
  - vulnerabilities
  - speech style
  - boundaries
  - roleplay compatibility notes
- Keep persona text exportable for external roleplay platforms.

Exit criteria:

- A user can create a persona independently.
- A user can generate a matched persona for an existing HeartWriteAI character card.
- Persona output remains editable before save/export.

## Phase 5: Lorebook and Scenario Asset Studio

Goal: preserve world, character, persona, scenario, and arc lore as modular assets instead of bloating the character card.

- Add editable lorebook entries with user-facing fields:
  - name
  - keys/triggers
  - content
  - priority
  - probability
  - scope
  - gates/tags when implemented
- Support world, character, persona, scenario, and arc lorebook scopes.
- Attach and detach lorebooks from characters, personas, worlds, and scenarios.
- Show which lorebooks are active and whether each active book is direct or inherited.
- Feed trope/scenario selections into scenario and arc lorebooks instead of permanently stuffing everything into the card description.

Exit criteria:

- Lorebooks can be saved, loaded, attached, detached, edited, and deleted.
- Active lorebook state is visible and understandable.
- Scenario and opening pairs remain linked so alternate greetings do not lose their required background context.

## Phase 6: Image Generation and Visual Asset Pipeline

Goal: support romance character imagery, card art, icons, and export assets without tangling image data into the text compiler.

- Keep browser-side image intake for validation, compression, blurhash, and EXIF date extraction.
- Add image generation workspace scaffolding for character portraits, mood assets, and card imagery.
- Support importing generated images into card export flows.
- Keep brand assets separate from user character art.
- Add image library organization once local storage paths are stable.

Exit criteria:

- A user can import, inspect, and prepare character images for card packaging.
- Generated or imported images can be attached to a card workflow without breaking CCV3 metadata handling.

## Phase 7: Local Library and Tauri File Bridge

Goal: support real local libraries rather than one-file browser demos.

- Add or harden Tauri commands for native open/save dialogs and safe local file reads/writes.
- Add a local card-library scanner for folders containing many character PNGs.
- Use lazy card metadata loading and thumbnail caching so large libraries remain responsive.
- Keep image and card storage local-first.
- Add settings for library paths, cache behavior, and backup behavior.

Exit criteria:

- The app can browse and manage a local card library without loading every card fully into memory.
- Users can import/export card PNGs and JSON through native desktop dialogs.

## Phase 8: Context Compiler and Production Chat Runtime

Goal: integrate chat through compiled HeartWriteAI context instead of a temporary raw model sandbox.

- Replace the temporary chat preview with a formal context compiler that assembles:
  - character
  - persona
  - active scenario
  - active lorebooks
  - recent chat
  - summaries
  - runtime instructions
  - post-history constraints
- Enforce one shared token budget across all prompt channels.
- Add model/proxy/settings UI with configurable provider, endpoint, model, token budget, and stop presets.
- Add turn controls so the model knows whose turn is expected.
- Add hierarchical chat summaries before long-running chat becomes core.
- Support character chat and group chat as separate surfaces.
- Replace internet-RP asterisk-action assumptions with the HeartWriteAI standard prose format:
  - dialogue in quotation marks
  - narration/actions in close third-person prose
  - brief internal thoughts only when useful
  - no writing for `{{user}}`

Exit criteria:

- Chat runtime consumes compiled context instead of raw page state.
- Lorebooks and scenario arcs can influence ongoing chat beyond the opening message.
- Runtime output follows HeartWriteAI's romance prose, POV, consent, and no-user-control constraints.

## Defaults and Constraints

- New cards are CCV3-first.
- V1/V2 support exists for import, conversion, and sanity checks.
- User-facing editing should be readable fields and controls, not exposed raw JSON.
- JSON remains necessary for export, embedded PNG metadata, validation, and debugging.
- Tauri is the primary desktop wrapper unless a concrete Electron-only requirement appears.
- Auto-update remains disabled until signing keys, HTTPS releases, updater artifacts, rollback behavior, and staged rollout are real.
- HeartWriteAI remains romance-focused even when it supports supernatural, dark romance, mafia, academic, workplace, or slice-of-life sub-genres.
