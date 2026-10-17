# HeartWriteAI Roadmap

This is the active implementation roadmap for the private, local-first rebuild. It is intentionally narrow. Later architecture may exist in the vault or reference material, but it is not active implementation scope until this roadmap advances.

## Current Phase: Local Memory Core Foundation

### Objective

Establish the smallest durable local contract for StoryBook identity and Memory Book records before wiring chat, providers, retrieval automation, or cloud services.

### In Scope

- Inspect and document existing persistence boundaries.
- Define the canonical StoryBook aggregate boundary.
- Define a minimal validated Memory Book record shape.
- Define a local repository seam for memory records.
- Add an in-memory adapter for deterministic tests.
- Prove save, read, update, delete, provenance, privacy, and status behavior through public tests.

### Explicitly Out Of Scope

- Provider requests and successful provider streams.
- Chat route integration or streaming UI work.
- Supabase, Vercel persistence, cloud sync, auth, or hosted storage.
- Retrieval automation, embeddings, semantic ranking, or provider-side selection.
- New StoryBook, Memory Book, or relationship UI.
- Broad artifact-library consolidation unless the Memory Core contract proves it is required.
- Generalized adapter families beyond the concrete local test adapter.

### Required Gate Before Implementation

The implementer must state the public seam, write one failing test, observe the intended failure, and then implement one vertical slice. Do not design the entire Memory Book schema in one pass.

### Phase Done Condition

The phase is complete only when a validated local Memory Core contract can create, read, update, and delete bounded memory records, preserve source/provenance and privacy metadata, reject invalid records, and be consumed without importing provider or UI code.

### Next Allowed Slice

Design two small candidate public seams for the Memory Core, compare them on locality and scope, and wait for the user to select one before writing production code.

### Ranked Follow-Up After The First Slice

1. Add the remaining Memory Core record lifecycle behavior through the selected seam.
2. Add a local file/Tauri-backed adapter only after the in-memory contract is stable.
3. Add a prompt-compiler read projection only after persistence and privacy behavior are proven.

## Phase Advancement Rule

Advance only when the current phase done condition is verified and the user approves the next phase. A passing build does not advance the roadmap by itself.
