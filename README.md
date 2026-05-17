# AmourAI

Working-title rebuild of CharacterGen as a local-first desktop/web app.

AmourAI is intended to become a one-stop studio for:

- CCV3-first character card creation, editing, conversion, and PNG export
- Persona matching and editable persona profiles
- World, character, persona, and scenario/arc lorebooks
- Scenario/trope routing that feeds lore and opening setup without bloating cards
- Local chat runtime with active lorebooks, summaries, stop presets, and shared token budgets
- Future local inference through Ollama, llama.cpp-compatible APIs, or proxy/model presets

## Stack

- Frontend: Next.js App Router
- Styling: Tailwind CSS v4
- Components: shadcn/ui
- Desktop wrapper: Tauri v2
- Language: TypeScript + Rust
- Package manager: npm

Electron is not included in the initial scaffold. It can be added later if the app needs Electron-specific local file, extension, or plugin behavior that Tauri cannot cover cleanly.

## Local Setup

Install JavaScript dependencies:

```bash
npm install
```

Run the web app:

```bash
npm run dev
```

Build the static frontend:

```bash
npm run build
```

Run the Tauri desktop shell:

```bash
npm run tauri:dev
```

Tauri commands require Rust/Cargo. On this machine, Node/npm are available but Rust was not detected during the initial scaffold pass.

## Project Shape

```text
app/                  Next.js app routes
components/           shadcn/ui components and app-level components
lib/                  shared frontend utilities
public/               static web assets
src-tauri/            Tauri Rust shell, capabilities, icons, and native commands
```

## Current Status

Implemented in this initial scaffold:

- Next.js + Tailwind + shadcn initialized
- Tauri v2 wrapper copied from the local boilerplate and renamed to AmourAI
- npm-first scripts configured
- Static export config for Tauri builds
- Starter AmourAI landing/workspace page
- Local git repository initialized

Still pending:

- Rust toolchain install and `npm run tauri:dev` verification
- CharacterGen data-model migration plan
- CCV3 editor routes/components
- Lorebook editor and attachment registry port
- Runtime context compiler and chat shell
- Persistent local asset storage strategy

## Attribution

Initial Tauri + Next.js + shadcn structure was adapted from the local checkout of [`nomandhoni-cs/tauri-nextjs-shadcn-boilerplate`](https://github.com/nomandhoni-cs/tauri-nextjs-shadcn-boilerplate), then renamed and adjusted for AmourAI.
