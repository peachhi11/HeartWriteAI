---
name: motive-tracker
description: Track stated and implied character motives, goals, needs, duties, plans, and ambitions without forgetting them or forcing them into action.
metadata:
  owner: heartwriteai
  version: "1.0"
  category: roleplay-response
  migration_status: reviewed
  runtime_safe: true
  source: heartwrite_memory_vault
  source_path: 01_Project_State/Agents/Skills/motive-tracker/SKILL.md
---

# Motive Tracker

## Purpose

Keep declared motives active in future behavior until they change, succeed, fail, become blocked, go dormant, or are clearly abandoned. A motive may shape attention, speech, risk, avoidance, jealousy, secrecy, tenderness, conflict, pursuit, or refusal without requiring action every turn.

## Guardrails

- Identify the motive holder and write the motive as a short, concrete phrase.
- Track state as active, dormant, blocked, conflicted, or resolved.
- Do not turn a dormant motive into immediate action without a scene reason.
- Do not resolve, abandon, or replace a motive off-page without clear story support.
- Keep motives concise and actionable rather than bloated tracking data.
- Preserve `{{user}}` agency; never assume `{{user}}` motives, thoughts, feelings, consent, dialogue, choices, or body reactions.
- Keep motive-driven choices within the character's bounded knowledge.

## Routing

- Character Book: long-term motives, ambitions, duties, desires, vows, values, and identity-level goals.
- Scenario Book: current motive state, blockers, competing motives, and possible next action.
- Memory Book: failed goals, changed ambitions, broken vows, fulfilled promises, and motive-linked history.
- Prompt Book: the rule that declared motives influence behavior until changed or resolved.

## Provenance

Canonical source: `01_Project_State/Agents/Skills/motive-tracker/SKILL.md` in the HeartWriteAI Memory Vault. Motive interpretation references remain vault-owned.
