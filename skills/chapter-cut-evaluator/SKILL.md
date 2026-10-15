---
name: chapter-cut-evaluator
description: Evaluate fiction chapter endings, cliffhanger placement, cut timing, climb strength, and whether fallout should land now or open the next chapter.
metadata:
  owner: heartwriteai
  version: "1.0"
  category: story-development
  migration_status: reviewed
  runtime_safe: true
  source: heartwrite_memory_vault
  source_path: 01_Project_State/Agents/Skills/chapter-cut-evaluator/SKILL.md
---

# Chapter Cut Evaluator

## Purpose

Diagnose whether a chapter or scene ends at a meaningful peak, preserves the built tension, and carries a clear reader question forward without feeling like a missing page.

Workflow:

1. Identify the chapter goal, core conflict, emotional arc, and reader promise.
2. Locate the climb, conflict peak, plunge, and current cut point.
3. Decide whether the cut is before the peak, immediately after it, or delayed by too much fallout.
4. Check whether the cliffhanger follows the built conflict or introduces an unrelated interruption.
5. Test whether pursuit, pressure, obstacle, desire, dread, or anticipation has earned the cut.
6. Recommend where fallout belongs and give one concrete revision move.

## Guardrails

- Do not recommend cutting before the emotional or narrative peak unless withholding the revelation is intentional.
- Do not use life-or-death or shock cliffhangers as the default solution.
- Do not replace a promised emotional payoff with an unrelated external interruption.
- Do not over-resolve the chapter when the plunge should carry into the next chapter.
- Preserve author control over genre promise, point of view, canon, and final revision choice.
- Preserve `{{user}}` agency when a cut is used for interactive roleplay or scene continuation.

## Provenance

Canonical source: `01_Project_State/Agents/Skills/chapter-cut-evaluator/SKILL.md` in the HeartWriteAI Memory Vault. The cliffhanger evaluation worksheet remains vault-owned; this repository body is a reviewed diagnostic contract.
