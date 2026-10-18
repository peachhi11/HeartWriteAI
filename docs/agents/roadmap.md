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
- Add a local Tauri Store/browser fallback adapter and prove reload behavior.
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

### Phase Gate Result

Verified on 2026-10-18: the local Memory Core contract now covers validated create, read, metadata update, revision, delete, provenance, privacy, status, StoryBook ownership, original preservation, and reload through the local adapter. It remains provider- and UI-independent.

### Next Allowed Slice

Define the narrow reassignment operation for preserved memories that are in `Needs a StoryBook` state. Keep permanent deletion explicit and preserve the original record during reassignment.

### Ranked Follow-Up After The First Slice

1. Add the remaining Memory Core record lifecycle behavior through the selected seam.
2. Add a prompt-compiler read projection that excludes superseded originals by default and respects privacy.
3. Add a private recovery/reassignment surface only after the reassignment contract is explicit.

## Phase Advancement Rule

Advance only when the current phase done condition is verified and the user approves the next phase. A passing build does not advance the roadmap by itself.

## 2026-10-18 Approved Metadata Maintenance Exception

The user explicitly prioritized a bounded metadata-validation fix. Consolidate
manifest, Markdown body, and runtime JSON reading/validation into one source path;
treat generated TypeScript as output with a separate freshness check. Keep runtime
selection, providers, UI, cloud, and Memory Core behavior outside this slice.
After verification, return to the existing Memory Core reassignment decision.
