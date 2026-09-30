# Tech Stack

- Next.js 16 App Router with React 19 and TypeScript.
- Tailwind CSS v4 via PostCSS; shared class merging helper in `src/lib/utils.ts`.
- Supabase client libraries: `@supabase/supabase-js` and `@supabase/ssr`.
- Auth and persistence helpers live in `src/lib/supabase` and `src/features/story-memory/persistence`.
- Icons use `lucide-react`; Motion is installed for later interface polish.
- Test runner: Vitest, colocated `.test.ts` files under `src/features/story-memory`.
- Lint: ESLint via `eslint.config.mjs` and `npm run lint`.
- Tauri v2/Rust are planned future desktop-wrapper layers, not part of the current implementation surface.