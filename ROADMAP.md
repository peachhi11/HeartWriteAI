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
- One-form character creation schema/compiler for sectioned input that still
  exports one coherent CCV3 card plus HeartWriteAI extensions.
- Seed preset packs for appearance prose, backstory events, mental/emotional
  patterns, music, NPC networks, scenario openers, world lore, genre settings,
  player-side persona preferences, card metadata taxonomy, and image prompt
  vocabulary.
- Unified seed preset registry for appearance, personality, world, image, and
  metadata seed lanes.
- Semantic seed graph foundation for psychology-first vocabulary nodes,
  including wounds, fears, desires, triggers, responses, relationship dynamics,
  and romance tropes.
- Browser and Tauri build/test cleanup, including verified debug app bundling.

## Current Focus

- Keep Tauri desktop behavior at parity with browser behavior for save/load,
  variants, copy actions, lore panels, and runtime diagnostics.
- Stabilize the chat runtime around deterministic context compilation,
  relationship state, lore activation, context guards, and provider streaming.
- Keep CCV3 PNG import/export reliable as the primary character-card path,
  with CHARX and JSON limited to bundle/archive/debug workflows.
- Wire the unified seed preset registry into character and persona creation so
  large vocabulary packs become searchable combo fields instead of scattered
  module imports.
- Grow the semantic seed graph before broad appearance scale, because wounds,
  fears, desires, triggers, responses, relationship dynamics, and romance
  tropes are the vocabulary layer that will power persona matching, scenario
  routing, lorebooks, route gates, and similarity/recommendation workflows.
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
   - Keep a Lexicon-inspired lore context router on the roadmap: score active
     lore, scenario, relationship, and memory entries as inject, hint, or hold
     decisions with reveal tiers, scene awareness, cooldowns, and resolution
     state. Build this as original HeartWriteAI context-compiler work, not as a
     direct code import.

3. **Asset model convergence**
   - Reuse the same normalized model across character-card PNGs, personas,
     scenarios, lorebooks, archives, and chat sessions.
   - Keep JSON as export/debug infrastructure, not the main editing surface.
   - Use `data/seedPresetRegistry.ts` as the app-facing seed index for
     appearance, personality, world, image, and metadata controls, while
     keeping individual `data/*Presets.ts` files as deterministic source
     modules with focused tests.

4. **Registry-backed creator controls**
   - Add searchable combo seed pickers to the one-form character creator.
   - Connect personality and backstory seed lanes to persona creation and
     persona matching.
   - Use `data/semanticSeedRegistry.ts` when a seed needs graph expansion,
     opposite/related matching, trigger hooks, goal hooks, or route behavior
     beyond flat UI discovery.
   - Route image prompt seeds into later visual prompt output without changing
     authored character data.
   - Keep metadata taxonomy seeds separate from live chat steering so tags,
     warnings, compatibility labels, and library filters remain reviewable.

5. **Local-first persistence**
   - Continue hardening Tauri Store/SQLite/file-backed workflows for sessions,
     card libraries, relationship state, and generated assets.
   - Keep browser fallbacks explicit when native APIs are unavailable.

6. **Release readiness**
   - Keep updater artifacts disabled until signing keys, HTTPS endpoints,
     rollback behavior, and release automation are real.
   - Maintain lint, test, Next build, Cargo test, and Tauri bundle checks before
     release-oriented commits.

## Later Tracks

- Group chat orchestration and per-character response routing.
- Lore context router for paced lore injection, foreshadowing, gated reveals,
  twist suppression, and resolved/dormant lore handling.
- Richer lorebook V3 editing, recursive activation, and budget previews.
- Native tokenization and heavier file processing in Rust/Tauri where it keeps
  the UI responsive.
- Optional provider presets for OpenRouter, Ollama, llama.cpp-compatible APIs,
  and other local/proxy endpoints.
- Dataset-backed vocabulary intake registry for Hugging Face and similar
  sources, keeping taxonomy extraction, rewritten dialogue/style fixtures,
  persona-structure mining, and eval-rubric inspiration separate from raw corpus
  copying.
- Full flat and semantic seed registry expansion across older specialty preset
  modules once the first UI seed-picker pass proves the lane model.
- Release packaging and signed auto-update activation once the security plan is
  fully satisfied.
