# Task Completion

- Before commit or handoff, run `git status --short --branch` and inspect changed/untracked files.
- Run `git diff --check` for every code/docs change.
- For app changes, run `npm run lint`, `npm run test`, and usually `npm run build` unless the user asks for a faster docs-only check.
- For markdown/source-mining changes, also check balanced code fences, trailing whitespace, non-ASCII drift when ASCII-only is expected, duplicate headings, and stale warning/moralizing language.
- Report confirmed checks separately from skipped checks.
- Do not commit unless the user explicitly asks for `commit`.
- After Serena memory onboarding or memory edits, tell the user they can run `serena memories check` from the project root.