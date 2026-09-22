# Supabase Persistence

HeartWriteAI persists saved story-memory data in Supabase. Generated prompt packs are session-only until the user explicitly saves them.

## Environment

Use a browser-safe publishable key in client code:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Keep server/admin keys server-only:

```bash
SUPABASE_SERVICE_ROLE_KEY=
```

The app has typed clients in:

- `src/lib/supabase/browser.ts`
- `src/lib/supabase/server.ts`
- `src/proxy.ts`

The proxy refreshes auth cookies before rendering. If the env vars are missing, it quietly skips Supabase so local UI work can continue.

## Schema Source

Schema files live in:

- `supabase/schemas/001_story_memory_core.sql`
- `supabase/schemas/002_seed_core_prompt_packs.sql`

These files are source SQL, not yet applied migrations.

When the Supabase project is ready, apply the schema through the Supabase SQL editor or convert it into a formal migration with the Supabase CLI.

## Ownership Model

User-owned tables include `owner_id uuid references auth.users(id)` and RLS policies keyed to `auth.uid()`.

Global vocabulary tables are readable by authenticated users:

- `category_tags`
- `core_prompt_packs`

They do not expose insert/update/delete policies to normal authenticated users.

## Session vs Saved Prompt Packs

Generated prompt packs begin in browser state.

Only the Save action should write into `saved_prompt_packs`.

This prevents fresh generated prompt variants from filling persistent storage unless the user deliberately keeps them.

## Data API Note

Supabase may require explicit grants for SQL-created tables before they are reachable through the Data API. The schema includes grants for the authenticated role, and every exposed table has RLS enabled.
