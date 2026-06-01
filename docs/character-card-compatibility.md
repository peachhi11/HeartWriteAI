# Character Card Compatibility Notes

HeartWriteAI is CCV3-first. The implementation reference for card import/export is the Character Card V3 specification, not the older concepts overview.

## Current Scope

- Read PNG/APNG `tEXt` metadata from `ccv3` first, then fall back to legacy `chara`.
- Decode card metadata from either raw JSON or UTF-8 JSON encoded with base64.
- Export fresh `ccv3` metadata and remove stale `chara` / `ccv3` chunks from the target PNG.
- Normalize exports to `spec: "chara_card_v3"` and `spec_version: "3.0"`.
- Preserve unknown/future card fields where possible.
- Use `@risuai/ccardlib` for V1/V2/V3 card version checks and conversion.
- Support browser imports for PNG/APNG/JSON without calling Tauri APIs, and desktop imports through native dialogs when available.
- Import CHARX packages as bundle/archive packages when adjacent assets need to travel with the card.
- Treat JSON as an interchange/debug format, not the main editing surface.

## Native Format Policy

HeartWriteAI treats **PNG/APNG with embedded CCV3 metadata as the primary card format**. A saved/imported character card should stay portable as a CCV3 PNG wherever possible.

CHARX remains the **bundle/archive copy**. The app should support CHARX when a card needs to carry `card.json` plus bundled assets such as icons, backgrounds, expression images, and future card-specific resources, but it should not replace PNG/CCV3 as the default card artifact.

JSON remains the **advanced/debug copy**. It is useful for inspection, tests, schema validation, and manual repair, but it should not become the main user-facing save path.

HeartWriteAI-only `.hwcard` imports/exports are intentionally out of scope.

Folder intake follows this policy: scan mixed folders, mark importable card files, identify non-card images/lorebooks/broken files, and save selected ready cards into the local library or a CHARX archive when bundled assets are needed.

## CHARX Import Pipeline

For private desktop use, Tauri can parse CHARX locally and store the validated result in the local library. For publishing, sync, marketplace listing, or public sharing, the server must repeat validation before accepting the package.

Recommended private import flow:

```text
user selects or drops .charx
-> Tauri Rust command reads file
-> unzip safely
-> reject unsafe archives
-> validate root card.json
-> parse CCV3 into the internal LocalCharacter shape
-> extract supported assets
-> resolve embedded asset paths
-> copy allowed assets into the app data folder
-> scan text and images for warnings
-> store normalized character in the local database
-> index searchable fields
-> preserve the original .charx as a backup/export artifact
-> open preview/import screen
```

For desktop imports, Rust owns file access, zip validation, asset copying, and local database writes. The Next.js UI owns the import modal, preview screen, library browsing, chat surface, and explicit sync/publish actions.

Recommended local storage shape:

```text
AppData/
  characters/
    {character_id}/
      card.json
      original.charx
      assets/
        avatar.png
        background.webp
      meta.json
  chats/
    {conversation_id}.json
  cache/
```

`meta.json` should contain app-local bookkeeping such as import warnings, source format, original filename, asset mapping, content rating, and timestamps. It should not become a replacement for the canonical `card.json`.

Recommended local SQLite tables:

```sql
CREATE TABLE IF NOT EXISTS local_characters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  source_format TEXT NOT NULL DEFAULT 'charx',
  spec_version TEXT NOT NULL DEFAULT 'ccv3',
  card_json TEXT NOT NULL,
  avatar_path TEXT,
  content_rating TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS local_conversations (
  id TEXT PRIMARY KEY,
  character_id TEXT NOT NULL,
  title TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(character_id) REFERENCES local_characters(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS local_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY(conversation_id) REFERENCES local_conversations(id) ON DELETE CASCADE
);
```

This is the private desktop shape. If HeartWriteAI later adds a hosted platform, the hosted database can use server-native JSON fields, object storage URLs, creator ownership, visibility, moderation state, and public content ratings.

Recommended publishing flow:

```text
local Tauri import
-> preview card
-> user chooses publish/upload
-> upload original .charx
-> backend repeats archive validation
-> backend stores assets in durable object storage
-> backend stores raw CCV3 plus normalized platform fields
```

Critical CHARX protections:

- reject encrypted zip archives
- reject path traversal such as `../` paths and absolute paths
- require `card.json` at the archive root
- limit max input file size
- limit max decompressed size
- limit file count
- allowlist supported asset MIME types
- never execute bundled code assets
- treat unsupported assets as preserved-but-inactive where possible
- moderate text and images before public listing

The local database should keep both the raw CCV3 JSON and normalized searchable/editable fields. Runtime-only romance state, relationship progress, provider settings, and scenario memory still belong in session/runtime tables, not inside exported card metadata.

Local chat prompt flow:

```text
load character card
-> load recent messages
-> load local memories/summaries
-> compose prompt
-> call local model or explicitly enabled remote provider
-> stream response
-> save message locally
-> update memory summary
```

## User-Facing Labels and Tags

Card controls should use readable platform-familiar language, not raw schema labels. For relationship and role filters, prefer labels such as:

- Character role: Sub, Domme, Dom, Switch.
- User role: user follows, user leads, user switches.
- POV: Any POV, FemPOV, MalePOV.
- Trope/AU tags: Enemies to lovers, slow burn, hurt/comfort, dark romance, dead dove, omegaverse, rockstar AU, esports AU, college AU, mafia AU, royal AU.

The underlying card metadata can still keep normalized tags and aliases for search, filtering, and export.

## Prompt Runtime

CCV3 `data.system_prompt` is allowed to replace the app's default runtime system prompt. If the card prompt contains `{{original}}`, HeartWriteAI treats that as an explicit extension point and inserts the default app prompt there.

`data.post_history_instructions` remains final-turn steering and should be placed after assembled character, persona, world, lore, memory, and recent-chat context.

Runtime romance pacing should be managed outside the static card file. Story-engine tags such as `angsty`, `slow burn`, `hurt/comfort`, or `dark romance` may select an internal route profile, but the detailed relationship tier, trigger state, emotion blend, body cue, and sensory priority data belongs in saved chat/session state. The card should export readable tags and author instructions, not hidden intimacy-score machinery.

## Minor NPC Guardrail

Adult romance cards may mention children or family context in ordinary story narrative. User personas must not be children, and minor NPCs must not be sexualized or participate in NSFW scenes.

When a scene turns sexual or NSFW, minor NPCs should stop being present in the active scene. If a user persistently tries to involve a minor NPC in sexual content, the runtime should refuse briefly and continue without that content.

## Multi-Character Single Cards

Reference: [Tydorius/JanitorAI_Scripts](https://github.com/Tydorius/JanitorAI_Scripts)

These templates are a useful reference for users who want to create a single card that manages multiple characters. They target JanitorAI's Scripts runtime rather than the CCV3 file format directly, so they should inform HeartWriteAI's future multi-character card authoring model instead of being treated as card metadata.

Useful patterns to study:

- Dynamic lorebook activation from recent messages.
- Drop-in/drop-out character context based on who is active or mentioned.
- Shared scene state across several characters in one card.
- Timeline and message-count gated context.
- Priority and token-budget aware lore selection.
- Runtime mutation of `context.character.personality`, `context.character.scenario`, and `context.character.example_dialogs`.
- JanitorAI `context.chat` / `context.character` object shape discovery for script-backed multi-character cards.

Do not mix these runtime scripts into the PNG card codec. For HeartWriteAI, this reference belongs with future multi-character single-card tooling: character rosters, per-character context blocks, activation rules, and previewable compiled prompt output.

## Later Compatibility Work

- Expand CHARX asset preservation and manifest preview tooling.
- Add lorebook decorator parsing and preview tooling.
- Add multi-character single-card authoring with activation rules and compiled-context preview.
- Consider JanitorAI script-template import/export as a separate compatibility layer if users need it.
- Add warnings for hidden zero-width persistence markers before exporting or displaying user-facing text.
