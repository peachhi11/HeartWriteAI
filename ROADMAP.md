# HeartWriteAI Roadmap

HeartWriteAI is moving from asset-generation scaffolding into a local-first
desktop roleplay suite. This roadmap is the short product view; the detailed
engineering sequence remains in [`PLAN.md`](PLAN.md).

## Recently Landed

- Scenario generation and advanced prompt/payload preview surfaces.
- Context truncation guards that trim oversized histories while preserving
  important protected milestones.
- Milestone memory anchoring so cleanup does not erase major long-running story
  beats.
- Interaction intent modal for centered player intent/action choices during key
  story moments.
- Diagnostics/status node for lore/sync style runtime states.
- AI response regeneration and swiped-variant navigation without deleting prior
  generations.
- Copy actions for chat responses, debug/schema panels, prompt previews, and
  ordinary text inputs/textareas.
- Seed vocabulary ingestion fixes for skinny/thin line semantics and wavy hair
  wording.
- Browser and Tauri build/test cleanup, including verified debug app bundling.

## Current Focus

- Keep Tauri desktop behavior at parity with browser behavior for save/load,
  variants, copy actions, lore panels, and runtime diagnostics.
- Stabilize the chat runtime around deterministic context compilation,
  relationship state, lore activation, context guards, and provider streaming.
- Keep CCV3 PNG import/export reliable as the primary character-card path,
  with CHARX and JSON limited to bundle/archive/debug workflows.
- Continue making generated scenario, persona, lorebook, and relationship state
  assets editable instead of one-shot output.

## Near-Term Priorities

1. **Desktop smoke coverage**
   - Re-run real Tauri shell checks after UI/runtime changes.
   - Verify save/load, variant navigation, copy actions, and lore diagnostics in
     the packaged app shell.

2. **Runtime context hardening**
   - Expand tests for protected milestone trimming, oversized message clamps,
     lore activation, and relationship-state context insertion.
   - Keep debugging panels copyable and inspectable without exposing internal
     matrices as primary UX.

3. **Asset model convergence**
   - Reuse the same normalized model across character-card PNGs, personas,
     scenarios, lorebooks, archives, and chat sessions.
   - Keep JSON as export/debug infrastructure, not the main editing surface.

4. **Local-first persistence**
   - Continue hardening Tauri Store/SQLite/file-backed workflows for sessions,
     card libraries, relationship state, and generated assets.
   - Keep browser fallbacks explicit when native APIs are unavailable.

5. **Release readiness**
   - Keep updater artifacts disabled until signing keys, HTTPS endpoints,
     rollback behavior, and release automation are real.
   - Maintain lint, test, Next build, Cargo test, and Tauri bundle checks before
     release-oriented commits.

## Later Tracks

- Group chat orchestration and per-character response routing.
- Richer lorebook V3 editing, recursive activation, and budget previews.
- Native tokenization and heavier file processing in Rust/Tauri where it keeps
  the UI responsive.
- Optional provider presets for OpenRouter, Ollama, llama.cpp-compatible APIs,
  and other local/proxy endpoints.
- Release packaging and signed auto-update activation once the security plan is
  fully satisfied.
