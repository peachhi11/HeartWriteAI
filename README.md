# HeartWriteAI

HeartWriteAI is a local-first romance roleplay creation suite. It is designed to generate and edit character cards, craft standalone or matched user personas, convert V1/V2 cards to Character Card V3, build lorebooks, generate images, and support character chat and group chat workflows.

The app is being built CCV3-first. New cards should be authored as Character Card V3, while V1/V2 support exists for import, conversion, and sanity checks rather than as the main creation format.

## What HeartWriteAI Is For

- CCV3-first character card creation, editing, conversion, and PNG/CHARX export.
- Editable persona profiles and persona matching.
- World, character, persona, scenario, and arc lorebooks.
- Scenario and trope routing through lorebooks instead of bloating character cards.
- Local chat runtime with active lorebooks, summaries, shared token budgets, and stop presets.
- Future local inference through Ollama, llama.cpp-compatible APIs, or proxy/model presets.

CHARX is the native master format for saved cards because it can preserve the full card payload and bundled assets. PNG is the compatibility/share format for platforms that still expect image cards. JSON is infrastructure, not the primary user interface: users should edit readable fields and structured controls, while JSON appears mainly as export data, embedded PNG metadata, or advanced debugging.

## Stack

- Frontend: Next.js App Router
- Styling: Tailwind CSS v4
- Components: shadcn/ui
- Desktop wrapper: Tauri v2
- Languages: TypeScript + Rust
- Package manager: npm

Electron is not included in the initial scaffold. It can be reconsidered later only if Tauri cannot cleanly cover required local file, extension, or plugin behavior.

## Local Setup

Install dependencies:

```bash
npm install
```

Run the web app:

```bash
npm run dev
```

Run the Tauri desktop shell:

```bash
npm run tauri:dev
```

Build and verify:

```bash
npm run lint
npm test
npm run build
cargo test --manifest-path src-tauri/Cargo.toml
npm run tauri:build -- --debug --bundles app
npm run tauri:build
```

The Tauri commands require Rust/Cargo.

Optional AI-assisted generation and chat are provider-generic until a runtime endpoint is supplied. Use `YOUR_API_*` environment values when wiring a provider:

```bash
YOUR_API_KEY=...
YOUR_API_CHAT_ENDPOINT=...
YOUR_API_CHAT_MODEL=...
```

## Current Status

Implemented in the current scaffold:

- Next.js + Tailwind + shadcn app shell.
- Tauri v2 desktop wrapper renamed and configured for HeartWriteAI.
- Desktop debug app bundling verified through `npm run tauri:build -- --debug --bundles app`.
- Workspace-first editor for character card import, editing, and export.
- `/chat` runtime workspace for local roleplay sessions, scenario overrides,
  lore diagnostics, relationship state, regeneration, swiped variants, and
  save/load smoke checks.
- `/api/character-card/classify` and `/api/character-card/build` routes for schema-bound macro routing and generated card previews.
- Tauri Store plugin registration and typed desktop-library helper for local
  character-card persistence.
- Browser-side image intake pipeline for validation, compression, blurhash, and EXIF date extraction.
- CCV3 PNG metadata read/write layer with V1/V2 conversion support through `@risuai/ccardlib`.
- Browser and desktop import paths for PNG/APNG and JSON character cards, including browser download fallbacks when Tauri APIs are unavailable.
- CHARX import/export support for full-fidelity card masters.
- Folder intake review in the desktop app for scanning mixed PNG/JSON/CHARX folders, separating ready cards from image-only, lorebook, skipped, and broken files, and saving selected imports as CHARX masters.
- Desktop card-library cache with user-facing filters for chat style, POV, character role, user role, tropes, and AU tags.
- Hidden emotion/feeling lexicon for ForceBary-style tag suggestions, exposed only as friendly story-engine tags rather than classifier internals.
- Prompt runtime compiler that lets a card override the default app system prompt, or extend it with `{{original}}`.
- Context guard logic for trimming oversized chat history while preserving
  protected milestone memory anchors.
- Relationship milestone anchoring so important story beats can survive cleanup
  in long-running sessions.
- Centered interaction-intent modal for key story moments.
- Diagnostics/status node coverage for lore/sync style states without treating
  unrelated runtime errors as lorebook faults.
- Regeneration and swiped-variant navigation for AI responses without deleting
  previous responses.
- Copy actions on chat responses, schema/debug panels, prompt previews, and
  ordinary text inputs/textareas through a global field-copy overlay.
- Adult legacy/offspring profile generator for generational series planning, with minor-NPC guardrails for family/slice-of-life scenes.
- Seed vocabulary ingestion fixes for skinny/thin body-line semantics and wavy
  hair wording.
- Tauri bridge helper for frontend/native command calls.
- PNG text-chunk dependencies for CCV3 card import/export:
  - `png-chunks-extract`
  - `png-chunks-encode`
  - `png-chunk-text`
- Auto-update security plan documented; updater artifacts remain disabled until
  signing, HTTPS endpoints, rollback behavior, and release infrastructure are
  real.

Immediate next milestone:

- Keep hardening the chat runtime with Tauri desktop smoke tests and move the
  same normalized asset model across persona, scenario, lorebook, and card
  workflows.

## Project Shape

```text
app/                  Next.js app routes
components/           shadcn/ui and app-level components
lib/                  shared frontend utilities and client-side pipelines
public/               static web assets
src-tauri/            Tauri Rust shell, capabilities, icons, and native commands
docs/                 focused engineering notes and safety plans
```

Recovered prototype folders, copied reference migrations, loose research PDFs, and other one-off source materials should stay outside normal commits unless they are deliberately promoted into `docs/` or app code.

## Roadmap

The concise product roadmap lives in [`ROADMAP.md`](ROADMAP.md). The detailed
engineering implementation plan lives in [`PLAN.md`](PLAN.md).

The old CharacterGen project is now treated as a reference archive. The active port map lives in [`docs/charactergen-reference-port-map.md`](docs/charactergen-reference-port-map.md), and the implementation target remains Next.js + Tailwind + Tauri v2 rather than Python/PyQt.

The current priority order is:

1. Harden desktop runtime smoke tests for save/load, variants, copy actions,
   lore diagnostics, and Tauri shell parity.
2. Continue CCV3 PNG/JSON/CHARX import/export stabilization, with CHARX as the
   native master.
3. Mature persona, scenario, lorebook, and relationship workflows around the
   shared normalized asset model.
4. Expand Tauri local file/library management.
5. Build the production chat runtime around deterministic context compilation,
   memory guards, lore injection, relationship state, and provider streaming.

## Auto-Update Safety

Auto-update is intentionally inactive for release purposes. Debug bundles do not
create updater artifacts, and empty updater endpoint/key values must not be
treated as production release configuration.

The secure activation plan is tracked in [`docs/auto-update-security.md`](docs/auto-update-security.md).

## Compatibility Notes

CCV3 and JanitorAI compatibility research is tracked in [`docs/character-card-compatibility.md`](docs/character-card-compatibility.md).

## Attribution

HeartWriteAI is a rebuild descended from the local CharacterGen project. CharacterGen is the original application lineage for the roleplay asset workflow, character-generation concepts, and user goals being carried forward here.

The initial Tauri + Next.js + shadcn scaffold used for this rebuild was also adapted from the local checkout of [`nomandhoni-cs/tauri-nextjs-shadcn-boilerplate`](https://github.com/nomandhoni-cs/tauri-nextjs-shadcn-boilerplate), then renamed and adjusted for HeartWriteAI.

Character Card V3 compatibility follows the upstream [`kwaroran/character-card-spec-v3`](https://github.com/kwaroran/character-card-spec-v3) specification, especially `SPEC_V3.md`.
