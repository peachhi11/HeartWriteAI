# AmourAI

AmourAI is the working-title rebuild of CharacterGen as a local-first roleplay asset studio. The goal is to make character creation the main intake point: paste or import messy source material once, then route it into editable character card, persona, scenario, and lorebook outputs.

The app is being built CCV3-first. New cards should be authored as Character Card V3, while V1/V2 support exists for import, conversion, and sanity checks rather than as the main creation format.

## What AmourAI Is For

- CCV3-first character card creation, editing, conversion, and PNG export.
- Editable persona profiles and persona matching.
- World, character, persona, scenario, and arc lorebooks.
- Scenario and trope routing through lorebooks instead of bloating character cards.
- Local chat runtime with active lorebooks, summaries, shared token budgets, and stop presets.
- Future local inference through Ollama, llama.cpp-compatible APIs, or proxy/model presets.

JSON is infrastructure, not the primary user interface. Users should edit readable fields and structured controls; JSON should appear mainly as export data or embedded PNG card metadata.

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
npm run build
npm run tauri:build
```

The Tauri commands require Rust/Cargo.

Optional AI-assisted macro classification uses the Vercel AI SDK with Google
Gemini. To enable `/api/character-card/classify`, set:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=...
```

## Current Status

Implemented in the current scaffold:

- Next.js + Tailwind + shadcn app shell.
- Tauri v2 desktop wrapper renamed and configured for AmourAI.
- Starter landing/workspace page for the intake-first workflow.
- Temporary `/chat` preview route for Ollama streaming shape tests.
- Optional `/api/character-card/classify` route for schema-bound macro and
  library-tag classification with Gemini.
- Tauri Store plugin registration and typed desktop-library helper for local
  character-card persistence.
- Browser-side image intake pipeline for validation, compression, blurhash, and EXIF date extraction.
- CCV3 PNG metadata read/write layer with V1/V2 conversion support through `@risuai/ccardlib`.
- Tauri bridge helper for frontend/native command calls.
- PNG text-chunk dependencies for CCV3 card import/export:
  - `png-chunks-extract`
  - `png-chunks-encode`
  - `png-chunk-text`
- Auto-update security plan documented but intentionally disabled.

Immediate next milestone:

- Build the import/export UI so character-card PNGs can be read, edited through user-facing fields, and exported with embedded `ccv3` metadata.

## Project Shape

```text
app/                  Next.js app routes
components/           shadcn/ui and app-level components
lib/                  shared frontend utilities and client-side pipelines
public/               static web assets
src-tauri/            Tauri Rust shell, capabilities, icons, and native commands
docs/                 focused engineering notes and safety plans
```

## Roadmap

The phased implementation plan lives in [`PLAN.md`](PLAN.md).

The current priority order is:

1. Stabilize the scaffold and documentation checkpoint.
2. Add CCV3 PNG import/export.
3. Turn the character page into the editable intake hub.
4. Add editable lorebook/persona/scenario asset editors and attachments.
5. Add Tauri local file/library management.
6. Build the context compiler and production chat runtime.

## Auto-Update Safety

Auto-update is intentionally disabled. Do not add updater config with placeholder keys, unsigned artifacts, or non-HTTPS endpoints.

The secure activation plan is tracked in [`docs/auto-update-security.md`](docs/auto-update-security.md).

## Compatibility Notes

CCV3 and JanitorAI compatibility research is tracked in [`docs/character-card-compatibility.md`](docs/character-card-compatibility.md).

## Attribution

AmourAI is a rebuild descended from the local CharacterGen project. CharacterGen is the original application lineage for the roleplay asset workflow, character-generation concepts, and user goals being carried forward here.

The initial Tauri + Next.js + shadcn scaffold used for this rebuild was also adapted from the local checkout of [`nomandhoni-cs/tauri-nextjs-shadcn-boilerplate`](https://github.com/nomandhoni-cs/tauri-nextjs-shadcn-boilerplate), then renamed and adjusted for AmourAI.

Character Card V3 compatibility follows the upstream [`kwaroran/character-card-spec-v3`](https://github.com/kwaroran/character-card-spec-v3) specification, especially `SPEC_V3.md`.
