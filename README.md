# HeartWriteAI

HeartWriteAI is a local-first romance roleplay creation suite. It is designed to generate and edit character cards, craft standalone or matched user personas, convert V1/V2 cards to Character Card V3, build lorebooks, generate images, and support character chat and group chat workflows.

The current product direction is private-first. The app should run usefully without Supabase, hosted auth, hosted storage, cloud sync, or marketplace infrastructure. An existing Supabase project already holds a cloud StoryBook prototype schema; treat it as a future adapter target and reference model, not as a Phase 1 runtime dependency. Cloud services can be added later behind explicit opt-in repository/storage adapters once the local StoryBook, Memory Book, Prompt Book, and StoryEval contracts are stable.

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
npm run check:agent-setup
npm run lint
npm test
npm run build
npm run tauri:build
```

The Tauri commands require Rust/Cargo. For web-only or docs/process slices, the
current default health gate is `npm run check:agent-setup`, `npm run lint`,
`npm test`, and `npm run build`.

Optional AI-assisted generation and chat use an OpenAI-compatible `/v1/chat/completions` boundary. Chat is disabled unless explicitly enabled for the private app. Choose one provider profile; keys stay server-side:

```bash
HEARTWRITE_CHAT_ENABLED=1
HEARTWRITE_CHAT_PROVIDER=openrouter
HEARTWRITE_CHAT_BASE_URL=https://openrouter.ai/api
HEARTWRITE_CHAT_MODEL=...
OPENROUTER_API_KEY=...
```

For an Ollama-compatible local endpoint:

```bash
HEARTWRITE_CHAT_ENABLED=1
HEARTWRITE_CHAT_PROVIDER=ollama
HEARTWRITE_CHAT_BASE_URL=http://localhost:11434
HEARTWRITE_CHAT_MODEL=llama3
```

For another OpenAI-compatible provider, use `HEARTWRITE_CHAT_PROVIDER=openai-compatible`,
set `HEARTWRITE_CHAT_BASE_URL`, `HEARTWRITE_CHAT_MODEL`, and
`HEARTWRITE_CHAT_API_KEY` as needed. There is no implicit remote-provider
fallback when these values are absent.

Private power-user tools are allowed in the local desktop app but should stay
out of public app surfaces. StoryEval run-history controls are shown in the
desktop shell by default, can be enabled in browser builds with
`NEXT_PUBLIC_HEARTWRITE_PRIVATE_TOOLS=1`, and can be hidden everywhere with
`NEXT_PUBLIC_HEARTWRITE_PUBLIC_APP=1`.

## Current Status

Implemented in the current scaffold:

- Next.js + Tailwind + shadcn app shell.
- Tauri v2 desktop wrapper renamed and configured for HeartWriteAI.
- Workspace-first editor for character card import, editing, and export.
- Temporary `/chat` preview route for provider-neutral streaming shape tests.
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
- Adult legacy/offspring profile generator for generational series planning, with minor-NPC guardrails for family/slice-of-life scenes.
- Tauri bridge helper for frontend/native command calls.
- PNG text-chunk dependencies for CCV3 card import/export:
  - `png-chunks-extract`
  - `png-chunks-encode`
  - `png-chunk-text`
- Auto-update security plan documented but intentionally disabled.

Immediate next milestone:

- Keep the private/local StoryEval and agent-workflow baseline stable while the
  next product slice is chosen. The app currently has a green health gate for
  `check:agent-setup`, lint, tests, and build; folder-intake, CHARX masters,
  lorebook/persona editors, and chat runtime remain product roadmap work rather
  than the only immediate milestone.

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

The phased implementation plan lives in [`PLAN.md`](PLAN.md).

The old CharacterGen project is now treated as a reference archive. The active port map lives in [`docs/charactergen-reference-port-map.md`](docs/charactergen-reference-port-map.md), and the implementation target remains Next.js + Tailwind + Tauri v2 rather than Python/PyQt.

The current priority order is:

1. Keep the private-first/local-first baseline green and documented.
2. Expand StoryEval private run-history review into a useful power-user surface.
3. Continue CCV3 PNG/JSON/CHARX import and export hardening, with CHARX as the native master.
4. Maintain the CharacterGen reference port map.
5. Turn the character page into the editable intake hub.
6. Add editable lorebook/persona/scenario asset editors and attachments.
7. Expand Tauri local file/library management.
8. Build the production chat runtime around the context compiler.

## Auto-Update Safety

Auto-update is intentionally disabled. Do not add updater config with placeholder keys, unsigned artifacts, or non-HTTPS endpoints.

The secure activation plan is tracked in [`docs/auto-update-security.md`](docs/auto-update-security.md).

## Compatibility Notes

CCV3 and JanitorAI compatibility research is tracked in [`docs/character-card-compatibility.md`](docs/character-card-compatibility.md).

## Attribution

HeartWriteAI is a rebuild descended from the local CharacterGen project. CharacterGen is the original application lineage for the roleplay asset workflow, character-generation concepts, and user goals being carried forward here.

The initial Tauri + Next.js + shadcn scaffold used for this rebuild was also adapted from the local checkout of [`nomandhoni-cs/tauri-nextjs-shadcn-boilerplate`](https://github.com/nomandhoni-cs/tauri-nextjs-shadcn-boilerplate), then renamed and adjusted for HeartWriteAI.

Character Card V3 compatibility follows the upstream [`kwaroran/character-card-spec-v3`](https://github.com/kwaroran/character-card-spec-v3) specification, especially `SPEC_V3.md`.
