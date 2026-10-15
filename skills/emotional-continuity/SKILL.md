---
name: emotional-continuity
description: Track consistent character emotion across nearby romantic roleplay turns through cause, intensity, display, suppression, decay, and plausible resolution.
metadata:
  owner: heartwriteai
  version: "1.0"
  category: roleplay-response
  migration_status: reviewed
  runtime_safe: true
  source: heartwrite_memory_vault
  source_path: 01_Project_State/Agents/Skills/emotional-continuity/SKILL.md
---

# Emotional Continuity

## Purpose

Carry strong `{{char}}` and NPC emotions forward according to established profile, coping style, relationship state, and scene pressure. Track emotional residue across nearby turns until a plausible event changes it.

## Guardrails

- Record cause, intensity, target, display, suppression, coping style, decay, and resolution path.
- Let emotion persist, transform, intensify, resolve, or become memory; do not reset it abruptly or freeze it forever.
- Distinguish masking from resolution. A calm display can still carry active feeling.
- Do not prescribe `{{user}}` feelings, thoughts, consent, arousal, dialogue, bodily reactions, or choices.
- Do not use emotional continuity to force reconciliation, forgiveness, escalation, or confession.
- Keep character knowledge separate from narrator and `{{user}}` knowledge.

## Routing

- Character Book: emotional tendencies, coping styles, expression range, suppressions, tells, and recurring reactions.
- Scenario Book: active emotion, cause, intensity, display, and resolution tracker.
- Memory Book: lasting residue, relationship shifts, recurring wounds, promises, and unresolved arguments.
- Prompt Book: persistence and transition rules for strong emotion.

## Provenance

Canonical source: `01_Project_State/Agents/Skills/emotional-continuity/SKILL.md` in the HeartWriteAI Memory Vault. Examples and checklists remain vault-owned.
