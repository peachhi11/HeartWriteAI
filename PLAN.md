# HeartWriteAI Implementation Plan

HeartWriteAI is a local-first romance creation suite for character cards, personas, persona matching, lorebooks, image assets, character chat, and group chat. It is not a general adventure/RPG engine; every workflow should serve romance-focused character creation, romantic roleplay, or supporting assets for that experience.

The app is CCV3-first. New cards should be authored as Character Card V3, while V1/V2 support exists for import, conversion, compatibility checks, and migration.

## Product Architecture

HeartWriteAI should be built around reusable romance assets rather than one fused card blob:

- Character Library
- Persona Library
- Scenario Library
- World Template Library
- Lorebook Library
- Image Library
- Character Chat Library
- Group Chat Library

The intended runtime stack is:

```text
World Template + Character + Persona + Scenario Override + Active Lorebooks + Chat Runtime
```

Assets can be standalone, linked, defaulted, or locked, but should not be permanently fused unless the user explicitly exports them that way.

## Phase 1: Scaffold, Brand, and Repo Hygiene

Goal: keep the project stable enough to build on without fighting stale names, duplicate generated files, or unclear local setup.

- Keep the Next.js App Router, Tailwind v4, shadcn/ui, and Tauri v2 scaffold as the primary app foundation.
- Keep README focused on setup, current status, and the next milestone.
- Keep this plan as the implementation roadmap and handoff document.
- Keep HeartWriteAI naming consistent across docs, app chrome, package metadata, and Tauri config.
- Keep generated build output out of version control, especially `.next`, `out`, `.tmp-tests`, and `src-tauri/target`.
- Keep updater work parked in [`docs/auto-update-security.md`](docs/auto-update-security.md) until real signing and release infrastructure exists.

Exit criteria:

- README and PLAN describe HeartWriteAI accurately.
- The worktree is free of Finder-style duplicate source/config files.
- Build caches and generated artifacts are ignored.
- The app can still pass the project test suite after cleanup.

## Phase 2: CCV3 Character Card Import, Edit, and Export

Goal: make HeartWriteAI reliable for reading, editing, converting, and exporting character cards.

- Preserve CCV3 as the native authoring format.
- Read PNG `tEXt` chunks and prefer `ccv3` metadata when present.
- Fall back to `chara` metadata for V1/V2 imports and conversion checks.
- Write exported PNGs with embedded `ccv3` metadata.
- Keep JSON visible as export/debug infrastructure, not the main editing UI.
- Maintain focused tests for:
  - PNG with `ccv3`
  - PNG with only `chara`
  - PNG with no supported card metadata
  - write/read round trip
  - macro-extension preservation
- Expand the current editor so generated cards can be adjusted through readable fields before export.

Exit criteria:

- A dragged-in character PNG can be parsed into editable app data.
- A generated or edited CCV3 card can be embedded back into a PNG.
- The user can inspect conversion results before saving.

## Phase 3: Real Studio Sections

Goal: turn the shell/sidebar into an actual studio, not a dashboard with conceptual cards.

- Add dedicated routes and working screens for:
  - Character Cards
  - Persona Studio
  - Persona Matching
  - Lorebooks
  - Image Generation
  - Card Conversion
  - Character Chat
  - Group Chat
  - Settings
- Use the HeartWriteAI brand assets for app chrome, sidebar marks, empty states, and export/watermark branding.
- Keep navigation persistent and predictable.
- Avoid exposing raw JSON as the primary editing experience.

Exit criteria:

- Each sidebar section opens a real workspace with a clear first action.
- Empty states explain what the user can create without becoming a marketing page.
- Existing character-card import/export remains reachable from the Character Cards area.

## Phase 4: Persona Studio and Persona Matching

Goal: support the user persona side of romance roleplay as a first-class workflow.

- Create standalone persona authoring for users who do not want to match a persona to a generated character.
- Create persona matching that reads a character's trope, power dynamic, speech style, boundaries, and romantic pacing.
- Save personas as reusable Persona Cards/files in a Persona Library.
- Store rich internal persona data, but feed/export only the playable persona block:
  - Basic Details
  - Appearance
  - Outfit
  - Personality
  - Behaviour
  - Speech
  - Example Dialogue
  - Intimacy, only as private compatibility data once physical intimacy is contextually relevant
  - Boundaries
- Keep user persona output based on visible traits, behavior, speech, reactions, preferences, and known facts.
- Use psychology internally to shape the persona, but do not export a psychological profile into the user persona block because it overfeeds the bot.
- Treat persona Notes as post-history / impersonation support only, used when the user explicitly asks the AI to impersonate their persona for story-writing help.
- Support optional persona image/avatar slots and route generation through the broader Image Generation system.
- Keep persona text exportable for external roleplay platforms.
- Allow multiple personas to be linked to the same character card.
- Show linked personas from the character card surface as a mini persona library with count, avatar, vibe tags, last-used state, and quick actions.
- Support persona save actions:
  - Save to Persona Library only
  - Save and link to this Character
  - Save, link, and set as Character Default
  - Save, link, and start Chat
  - Save as alternate matched persona

Exit criteria:

- A user can create a persona independently.
- A user can generate a matched persona for an existing HeartWriteAI character card.
- Persona output remains editable before save/export.
- A character can have multiple linked personas, with one optional default.
- Existing chats can lock a specific persona without changing the character's linked persona set.

## Phase 5: Scenario Studio and Scenario Library

Goal: make scenarios reusable, swappable romance context assets instead of permanent card text.

- Create scenarios from scratch, messy notes, trope basics, or selected world templates.
- Let users cycle through generated scenarios until one fits the desired chat setup.
- Save scenarios as reusable Scenario Cards/files in a Scenario Library.
- Attach scenarios to:
  - a character
  - a persona
  - a character/persona pairing
  - a chat
  - a group chat
- Use scenarios as chat overrides without permanently changing the original character card.
- Support one-on-one scenario generation with:
  - location
  - inciting incident
  - starting tension
  - user entry point
  - active constraints
  - sensory details
- Support group scenario generation for chats without group greetings:
  - character roster
  - each character's role in the scene
  - trope target
  - room logic
  - why everyone is present
  - what each character wants
  - what the user can respond to first
- Preserve linked scenario/opening pairs so alternate greetings do not lose their required context.

Exit criteria:

- A user can generate, edit, save, and reuse scenario cards.
- A user can override a chat's scenario without mutating the original card.
- Group chats can start from generated room context even when no group greeting exists.

## Phase 6: World Templates and AU Library

Goal: preload customizable romance AU worlds that give Scenario Studio and Lorebook generation a strong starting structure.

- Add a World Template Library with preloaded, editable romance worlds such as:
  - Modern / Present Day
  - Omegaverse
  - Supernatural
  - Mafia / Underworld
  - Rockstar / Tour Life
  - Actor / Movie Set
  - Holiday / Resort
  - Small Town
  - Elite Academy / University
  - Corporate / Billionaire
  - Regency / High Society
- Let users create custom world templates and edit preloaded worlds.
- Each world template should include:
  - world premise
  - social rules
  - power structures
  - relationship taboos
  - common tropes
  - common roles
  - setting vocabulary
  - lorebook seed entries
  - scenario seeds
  - conflict hooks
  - safety / boundary notes
  - what the AI should remember
  - what the AI should not assume
- Allow Scenario Studio to generate from a selected world template.
- Allow chat and group chat to attach a world template as background context.

Exit criteria:

- The app ships with a starter set of romance AU world templates.
- Users can customize, duplicate, save, and attach world templates.
- World templates can seed scenarios and lorebooks without bloating character cards.

## Phase 7: Lorebook Asset Studio

Goal: preserve world, character, persona, scenario, and arc lore as modular assets instead of bloating the character card.

- Add editable lorebook entries with user-facing fields:
  - name
  - keys/triggers
  - content
  - priority
  - probability
  - scope
  - gates/tags when implemented
- Support world, character, persona, scenario, and arc lorebook scopes.
- Attach and detach lorebooks from characters, personas, worlds, and scenarios.
- Show which lorebooks are active and whether each active book is direct or inherited.
- Feed trope/scenario selections into scenario and arc lorebooks instead of permanently stuffing everything into the card description.
- Support lorebook generation from selected world templates, scenarios, and character/persona pairings.

Exit criteria:

- Lorebooks can be saved, loaded, attached, detached, edited, and deleted.
- Active lorebook state is visible and understandable.
- Scenario and opening pairs remain linked so alternate greetings do not lose their required background context.

## Phase 8: Image Generation and Visual Asset Pipeline

Goal: support romance character imagery, card art, icons, and export assets without tangling image data into the text compiler.

- Keep browser-side image intake for validation, compression, blurhash, and EXIF date extraction.
- Add image generation workspace scaffolding for character portraits, mood assets, and card imagery.
- Support importing generated images into character, persona, and scenario asset flows.
- Let Persona Studio and Character Cards expose local "generate/select image" actions while keeping the generation pipeline centralized in Image Generation.
- Keep brand assets separate from user character art.
- Add image library organization once local storage paths are stable.

Exit criteria:

- A user can import, inspect, and prepare character images for card packaging.
- Generated or imported images can be attached to a card workflow without breaking CCV3 metadata handling.

## Phase 9: Local Library and Tauri File Bridge

Goal: support real local libraries rather than one-file browser demos.

- Add or harden Tauri commands for native open/save dialogs and safe local file reads/writes.
- Add a local card-library scanner for folders containing many character PNGs.
- Add local libraries for Persona Cards, Scenario Cards, World Templates, Lorebooks, Images, Chats, and Group Chats.
- Use lazy card metadata loading and thumbnail caching so large libraries remain responsive.
- Keep image, card, persona, scenario, world, lorebook, and chat storage local-first.
- Add settings for library paths, cache behavior, and backup behavior.

Exit criteria:

- The app can browse and manage a local card library without loading every card fully into memory.
- Users can import/export cards, personas, scenarios, worlds, lorebooks, and images through native desktop dialogs.

## Phase 10: Context Compiler and Production Chat Runtime

Goal: integrate chat through compiled HeartWriteAI context instead of a temporary raw model sandbox.

- Replace the temporary chat preview with a formal context compiler that assembles:
  - world template
  - character
  - persona
  - active scenario or scenario override
  - active lorebooks
  - recent chat
  - summaries
  - runtime instructions
  - post-history constraints
- Enforce one shared token budget across all prompt channels.
- Add model/proxy/settings UI with configurable provider, endpoint, model, token budget, and stop presets.
- Add turn controls so the model knows whose turn is expected.
- Add hierarchical chat summaries before long-running chat becomes core.
- Support character chat and group chat as separate surfaces.
- Support persona selection priority:
  - Chat-specific persona lock
  - Character default persona
  - Last-used persona for this character
  - Global active persona
  - No persona selected
- Support scenario selection priority:
  - Chat scenario override
  - Group chat scenario
  - Character/persona pairing scenario
  - Character default scenario
  - Card scenario
- Replace internet-RP asterisk-action assumptions with the HeartWriteAI standard prose format:
  - dialogue in quotation marks
  - narration/actions in close third-person prose
  - brief internal thoughts only when useful
  - no writing for `{{user}}`

Exit criteria:

- Chat runtime consumes compiled context instead of raw page state.
- Lorebooks and scenario arcs can influence ongoing chat beyond the opening message.
- Runtime output follows HeartWriteAI's romance prose, POV, consent, and no-user-control constraints.
- Opening a chat with a locked persona/scenario restores the correct context automatically.

## Defaults and Constraints

- New cards are CCV3-first.
- V1/V2 support exists for import, conversion, and sanity checks.
- User-facing editing should be readable fields and controls, not exposed raw JSON.
- JSON remains necessary for export, embedded PNG metadata, validation, and debugging.
- Persona, scenario, world, and lorebook assets should remain reusable and swappable unless the user explicitly fuses them into an export.
- Tauri is the primary desktop wrapper unless a concrete Electron-only requirement appears.
- Auto-update remains disabled until signing keys, HTTPS releases, updater artifacts, rollback behavior, and staged rollout are real.
- HeartWriteAI remains romance-focused even when it supports supernatural, dark romance, mafia, academic, workplace, or slice-of-life sub-genres.
