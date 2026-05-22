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
- Import CHARX packages as full-fidelity card masters when available.
- Treat JSON as an interchange/debug format, not the main editing surface.

## Native Format Policy

HeartWriteAI treats **CHARX as the clean master format**. A saved/imported master should be a `.charx` package whenever the desktop app is available, because CHARX can carry `card.json` plus bundled assets such as icons, backgrounds, expression images, and future card-specific resources.

PNG/APNG remains the **compatibility and sharing copy**. The app should keep importing and exporting PNG metadata cards for platforms that expect image cards, but users should be warned when an export path cannot preserve CHARX-only bundled assets.

JSON remains the **advanced/debug copy**. It is useful for inspection, tests, schema validation, and manual repair, but it should not become the main user-facing save path.

Folder intake follows this policy: scan mixed folders, mark importable card files, identify non-card images/lorebooks/broken files, and save selected ready cards into the local library as CHARX masters.

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
