# HeartWriteAI

A clean rebuild of HeartWriteAI, starting with the Story Memory Core.

The first component is a desktop-first web workspace for tracking story state, relationship logic, secrets, POV boundaries, and generated prompt packs for roleplay and fiction-writing exports.

## Current Stack

- Next.js App Router
- React
- Tailwind CSS
- Supabase client libraries
- Supabase SQL schema source
- Lucide icons
- Motion primitives ready for later interface polish

Tauri v2 and Rust are planned as the desktop wrapper layer after the web app foundation is stable.

## First Component Scope

Story Memory Core owns:

- stories
- characters
- scenes
- relationship threads
- secrets and reveals
- grouped category tags
- core prompt packs
- sessional generated prompt packs
- saved generated prompt packs
- export-safe POV rules

Unsaved generated prompt packs should stay sessional. Saved prompt packs belong in persistent storage.

## Supabase Persistence

Supabase setup notes live in [docs/architecture/supabase-persistence.md](/Users/meganmckinnon/Downloads/Archive/heartwriteai-app/docs/architecture/supabase-persistence.md).

Schema source lives in:

- [001_story_memory_core.sql](/Users/meganmckinnon/Downloads/Archive/heartwriteai-app/supabase/schemas/001_story_memory_core.sql)
- [002_seed_core_prompt_packs.sql](/Users/meganmckinnon/Downloads/Archive/heartwriteai-app/supabase/schemas/002_seed_core_prompt_packs.sql)
- [003_seed_character_persona_psychology.sql](/Users/meganmckinnon/Downloads/Archive/heartwriteai-app/supabase/schemas/003_seed_character_persona_psychology.sql)
- [004_seed_dark_relationship_psychology.sql](/Users/meganmckinnon/Downloads/Archive/heartwriteai-app/supabase/schemas/004_seed_dark_relationship_psychology.sql)
- [005_seed_attraction_seduction_psychology.sql](/Users/meganmckinnon/Downloads/Archive/heartwriteai-app/supabase/schemas/005_seed_attraction_seduction_psychology.sql)
- [006_seed_relationship_communication_psychology.sql](/Users/meganmckinnon/Downloads/Archive/heartwriteai-app/supabase/schemas/006_seed_relationship_communication_psychology.sql)
- [007_seed_trope_creative_psychology.sql](/Users/meganmckinnon/Downloads/Archive/heartwriteai-app/supabase/schemas/007_seed_trope_creative_psychology.sql)

## Design Boundaries

- The app is web-first, desktop-first, and responsive.
- Global spice visibility is either censored or uncensored.
- Heat level is a simple label.
- Story memory supports character POV, user POV, and narrator POV.
- The AI never controls the user player in normal roleplay exports.
- Secrets support asymmetric knowledge between characters.
- The old HeartWriteAI project is reference material, not the rebuild base.

## Local Development

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Validation

```bash
npm run lint
npm run build
```
