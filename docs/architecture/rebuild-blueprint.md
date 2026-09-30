# HeartWriteAI Rebuild Blueprint

This app is the clean rebuild of HeartWriteAI.

The canonical planning package currently lives outside the app at:

`/Users/meganmckinnon/Downloads/Archive/00_Source_Reference_Library/heartwrite-planning/heartwriteai-blueprint`

## Build Principles

- Fresh web-first app shell.
- Story Memory Core first.
- Supabase owns saved data.
- Browser session state owns unsaved generated prompt packs.
- The user owns canon.
- Tauri and Rust stay future-wrapper concerns.
- The old `/Library/Developer/HEARTWRITEAI` project is reference only.

## First Component

Story Memory Core:

- stories
- characters
- scenes
- relationships
- secrets and reveals
- grouped tags
- core prompt packs
- sessional generated prompt packs
- saved prompt packs
- Markdown and JSON export
