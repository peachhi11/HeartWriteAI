---
name: knowledge-boundary-response
description: Keep character knowledge canon-consistent when a character is asked, challenged, or tempted to reveal information they may not plausibly know.
metadata:
  owner: heartwriteai
  version: "1.0"
  category: roleplay-response
  migration_status: reviewed
  runtime_safe: true
  source: heartwrite_memory_vault
  source_path: 01_Project_State/Agents/Skills/knowledge-boundary-response/SKILL.md
---

# Knowledge Boundary Response

## Purpose

Ensure that when a character is asked or challenged about their knowledge, the response respects in-world logic, StoryBook memory, and character canon. This preserves immersion and prevents meta-omniscience.

## Core Principle

A character may only reference knowledge they have reasonably obtained through witnessing, learning, inference, investigation, rumors, records, supernatural access, or being told. Unknowns, mistakes, assumptions, suspicions, and misinformation are valid narrative states.

A fact may be canonically true while remaining unavailable to the current character, narrator, or reader. Always separate truth from disclosure permission.

## Knowledge States

Classify the character's knowledge before responding:

- Known Fact: They directly witnessed it, were told, read it, recorded it, investigated it, or learned it through established powers or access.
- Reasonable Inference: They can deduce it from visible evidence, prior behavior, context, timing, or known motives.
- Suspicion: They have a hunch but no proof.
- Rumor Or Secondhand Claim: They heard it from someone else, with reliability still uncertain.
- Misinformation: They believe something inaccurate because a source lied, misunderstood, omitted context, or was wrong.
- Private Truth: The model, narrator, or another character knows it, but this character does not.
- Unknown: They have no in-world route to the information.
- Reader-Known: The manuscript or roleplay has already clearly disclosed it to the reader.
- Narratively Withheld: The author knows it, but the current story frontier or reveal schedule does not permit disclosure.

## Response Modes

Choose the mode that fits the current knowledge state:

- Affirm And Justify: Confirm the knowledge and give an in-world source.
- Deny Or Admit Ignorance: Let the character plainly state they do not know.
- Deflect: Avoid answering because of pride, fear, secrecy, politics, flirtation, shame, or strategy.
- Speculate Carefully: Offer an inference while marking it as a guess, suspicion, or pattern recognition.
- Challenge The Premise: Push back when another character assumes they know more than they do.
- Reflective Pause: Use hesitation, silence, or body language when the truth matters but cannot be spoken yet.
- Correct A Boundary Error: If a prior response implied impossible knowledge, repair it in-character by reframing it as suspicion, rumor, or mistaken assumption.

## Workflow

1. Detect the knowledge question, challenge, or possible meta-knowledge leak.
2. Check Character Book, Scenario Book, Memory Book, and active scene state for a plausible in-world source.
3. Identify the current story frontier: scene, time, viewpoint, narrator mode, completed events, and allowed reveals.
4. Separate canon truth, narrator knowledge, reader knowledge, and each character's knowledge ledger.
5. Classify the knowledge state.
6. Choose the response mode.
7. Output a concise in-character answer, gesture, deflection, or spoiler-safe narration.
8. Update Memory Book or Scenario Book if the scene establishes a new learned fact, acknowledged ignorance, suspicion, lie, correction, rumor, or reveal boundary.

## Output Shape

Use concise narrative or state output:

```text
Questioned knowledge:
Character knowledge state:
Reader/narrator disclosure state:
In-world source:
Response mode:
In-character response:
Continuity update:
```

For roleplay turns, fold the answer into dialogue and behavior rather than exposing the full object unless the interface asks for structured state.

## HeartWrite Placement

- Character Book: durable experience, education, access, secrets, perception limits, and likely inference style.
- Scenario Book: live participant presence, scene facts, current witnesses, and what has been revealed on-page.
- Memory Book: learned facts, promises, arguments, rumors, misunderstandings, secrets, corrections, and uncertain recall.
- World Book: information systems, surveillance, telepathy, records, rumor networks, magic rules, social access, and knowledge prohibitions.
- Prompt Book: procedural reminder that `{{char}}` cannot use model-only knowledge.

## Guardrails

- Never give a character knowledge they cannot justify in canon.
- Maintain separation between model awareness, narrator knowledge, and character perspective.
- Do not let characters act on private truths they have not learned.
- Do not override `{{user}}` agency or describe their thoughts, motives, consent, or hidden knowledge.
- Allow uncertainty, suspicion, incorrect assumptions, and ignorance to persist when appropriate.
- Keep corrections in-world when possible; avoid breaking immersion with meta commentary.
- Do not use knowledge boundaries to stall a scene. Ignorance should create tension, questions, investigation, conflict, or intimacy.
- If supernatural, technological, or social information access exists, apply its established limits and costs.

## Provenance

Migrated from the HeartWriteAI Memory Vault skill at
`01_Project_State/Agents/Skills/knowledge-boundary-response/SKILL.md`.
Supporting references remain vault-owned until they are separately reviewed.
