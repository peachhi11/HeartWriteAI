# Vocabulary Dataset Intake

HeartWriteAI can use external datasets to improve seed coverage, but the intake
boundary is narrow on purpose. Datasets are for taxonomy gaps, fixture design,
and rewritten craft patterns. They are not a shortcut for importing raw prose
into character cards, dialogue examples, or prompt text.

The typed registry lives in
[`data/vocabularyDatasetRegistry.ts`](../data/vocabularyDatasetRegistry.ts).

## Intake Lanes

- `taxonomy`: extract labels, categories, and coverage gaps.
- `dialogue-style`: study conversation structure, then rewrite original
  HeartWriteAI examples.
- `persona-structure`: derive schema and routing fixtures for persona creation
  and matching.
- `relationship-structure`: inspect pair dynamics and relationship mechanics
  after license review.
- `eval-fixtures`: design original QC fixtures and rubrics.
- `reference-only`: inspect, compare, or park; do not ingest into product data.

## Current Candidates

| Dataset | Lane | Boundary |
| --- | --- | --- |
| GoEmotions | taxonomy | Recommended for emotion label maps with attribution. |
| Romance Novel Data 2022 | taxonomy/reference | Review OpenRAIL terms; extract trope labels only. |
| Empathetic Dialogues LLM | dialogue-style/eval | Recommended for rewritten reassurance and repair patterns. |
| EmpatheticDialogues | reference | Noncommercial; keep as reference unless licensing changes. |
| Synthetic Persona Chat | persona/dialogue | Recommended for persona-shape and rewritten behavior fixtures. |
| Persona-Based Chat Messages | persona/dialogue | Useful format reference; quality review required. |
| Processed Narrative Relationship Dataset | relationship/reference | Parked until license/source provenance is clear. |
| Character Profiles Romance Output | taxonomy/persona/reference | Parked; tiny and license unclear. |
| RP-Bench | eval/reference | Noncommercial benchmark reference; design original QC fixtures. |
| Literotica and Reddit Dirty and Writing Prompts | taxonomy/dialogue/eval/reference | Mine high-level adult pacing, prompt format, chunk length, and broad topic taxonomy only; do not import rows or prose. |
| Creative Writing Uncensored | dialogue/eval/reference | Review-required short SFT pair shape for original Prose Pixie and creative-writing prompt-layout fixtures. |

## Adult Writing Structure Notes

The adult/uncensored corpora are structure references, not content sources. The
measured summary and original fixture templates live in
[`data/adultWritingStructureReference.ts`](../data/adultWritingStructureReference.ts).

Current structural findings:

- The Literotica/Reddit sample is mixed prompt/story material, not a clean chat
  corpus. The inspected `sample_k100` had a 176-word median, a 250-word p75, and
  enough dialogue/question presence to justify prompt-vs-story and
  dialogue-preservation fixtures.
- The Creative Writing Uncensored dataset is a tiny two-message SFT corpus. The
  inspected rows all followed `user` then `assistant`, with short user prompts
  and compact assistant replies around a 101-word median.
- Topic taxonomy should stay broad: relationship setup, domestic/slice-of-life,
  social power, speculative/fantasy, sci-fi/technology, quest/adventure,
  horror/thriller, and adult-intimacy context.
- Prose Pixie fixtures derived from these corpora must be original rewrites that
  test shape, pacing, agency, dialogue preservation, and subtext rather than
  source wording.

## Hard Rules

- Do not vendor raw dataset rows into `data/*Presets.ts`.
- Do not paste external dialogue, blurbs, book summaries, or profile prose into
  shipping seed modules.
- Prefer labels, schema shape, and evaluation ideas over corpus copying.
- Run a humaniser pass for any rewritten examples before they become app-facing
  seed text.
- Record attribution and license notes before promoting any dataset-derived
  work beyond local experiments.
