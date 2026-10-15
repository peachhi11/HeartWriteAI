---
name: roleplay-keyword-discovery
description: Choose precise lorebook, skill, persona, and prompt-trigger keywords that activate entries in relevant roleplay contexts without broad false positives.
metadata:
  owner: heartwriteai
  version: "1.0"
  category: keyword-discovery
  migration_status: reviewed
  runtime_safe: true
  source: agents_md
  source_path: AGENTS.md
---

# Roleplay Keyword Discovery

## Purpose

Build small, testable activation sets for an entry. Prefer names, nicknames, titles, locations, distinctive phrases, and realistic user questions over generic vocabulary.

Workflow:

1. Identify the entry subject and the retrieval context it should activate.
2. Select one to eight precise keywords or phrases.
3. Include meaningful variants only when they improve recall without broadening the subject.
4. Add likely user questions when they directly request the entry's information.
5. Test missed activations, false positives, common-word collisions, and nearby context requirements.
6. Revise the set from observed activation evidence rather than intuition alone.

## Guardrails

- Keywords must align directly with the entry subject and retrieval intent.
- Avoid filler words, pronouns, broad common nouns, and terms users are unlikely to type.
- Do not use keyword activation to bypass spoiler, source, visibility, safety, or user-agency boundaries.
- Keep accepted keywords attached to their entry; do not turn them into general prose guidance.

## Provenance

Canonical source: the Keyword and Discovery for AI Roleplay Generation guidance in the repository-level `AGENTS.md`. This repository body is a reviewed retrieval-precision contract.
