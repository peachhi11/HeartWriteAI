# Character Card Compatibility Notes

HeartWriteAI is CCV3-first. The implementation reference for card import/export is the Character Card V3 specification, not the older concepts overview.

## Current Scope

- Read PNG/APNG `tEXt` metadata from `ccv3` first, then fall back to legacy `chara`.
- Decode card metadata as UTF-8 JSON encoded with base64.
- Export fresh `ccv3` metadata and remove stale `chara` / `ccv3` chunks from the target PNG.
- Normalize exports to `spec: "chara_card_v3"` and `spec_version: "3.0"`.
- Preserve unknown/future card fields where possible.
- Use `@risuai/ccardlib` for V1/V2/V3 card version checks and conversion.

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

- Add CHARX support for bundled assets.
- Add lorebook decorator parsing and preview tooling.
- Add multi-character single-card authoring with activation rules and compiled-context preview.
- Consider JanitorAI script-template import/export as a separate compatibility layer if users need it.
- Add warnings for hidden zero-width persistence markers before exporting or displaying user-facing text.
