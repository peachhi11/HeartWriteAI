import assert from "node:assert/strict";
import test from "node:test";

import {
  VOCABULARY_DATASET_CANDIDATES,
  VOCABULARY_DATASET_LANES,
  compileVocabularyDatasetIntakeSummary,
  findVocabularyDatasetCandidateById,
  getVocabularyDatasetCandidatesByLane,
  getVocabularyDatasetCandidatesByStatus,
} from "../../data/vocabularyDatasetRegistry";

test("tracks Hugging Face dataset candidates with stable ids and intake lanes", () => {
  assert.equal(VOCABULARY_DATASET_CANDIDATES.length, 11);
  assert.deepEqual(VOCABULARY_DATASET_LANES, [
    "dialogue-style",
    "eval-fixtures",
    "persona-structure",
    "reference-only",
    "relationship-structure",
    "taxonomy",
  ]);

  const ids = VOCABULARY_DATASET_CANDIDATES.map((candidate) => candidate.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getVocabularyDatasetCandidatesByLane("taxonomy").length, 4);
  assert.equal(getVocabularyDatasetCandidatesByLane("dialogue-style").length, 6);
  assert.equal(getVocabularyDatasetCandidatesByLane("persona-structure").length, 3);
  assert.equal(getVocabularyDatasetCandidatesByLane("eval-fixtures").length, 4);
});

test("keeps noncommercial and unknown-license datasets out of direct ingestion", () => {
  const referenceOnly = getVocabularyDatasetCandidatesByStatus("reference-only");
  const parked = getVocabularyDatasetCandidatesByStatus("parked");

  assert.ok(
    referenceOnly.every(
      (candidate) =>
        candidate.licenseUse === "noncommercial-reference-only" ||
        candidate.licenseUse === "unknown-license-review-required",
    ),
  );
  assert.ok(
    parked.every(
      (candidate) => candidate.licenseUse === "unknown-license-review-required",
    ),
  );

  for (const candidate of [...referenceOnly, ...parked]) {
    assert.match(candidate.blockedUse, /Do not (import|vendor)/i);
  }
});

test("prioritizes permissive sources for reusable seed and fixture work", () => {
  const recommended = getVocabularyDatasetCandidatesByStatus("recommended");
  const ids = recommended.map((candidate) => candidate.id);

  assert.deepEqual(ids, [
    "google-research-datasets/go_emotions",
    "Estwld/empathetic_dialogues_llm",
    "google/Synthetic-Persona-Chat",
  ]);

  assert.ok(
    recommended.every(
      (candidate) => candidate.licenseUse === "permissive-with-attribution",
    ),
  );
});

test("summarizes dataset intake without encouraging raw corpus copying", () => {
  const candidate = findVocabularyDatasetCandidateById(
    "diltdicker/romance_novel_data-2022",
  );
  assert.ok(candidate);

  const summary = compileVocabularyDatasetIntakeSummary(candidate);

  assert.match(summary, /Dataset candidate: Romance Novel Data 2022/);
  assert.match(summary, /Allowed use: Extract normalized trope labels/i);
  assert.match(summary, /Blocked use: Do not import book descriptions/i);
  assert.doesNotMatch(summary, /force prose|SYSTEM PROTOCOL|copy raw/i);
});

test("tracks adult and uncensored writing corpora as review-bound structure sources", () => {
  const adult = findVocabularyDatasetCandidateById(
    "agentlans/literotica-reddit-dirty-writing-prompts",
  );
  const creative = findVocabularyDatasetCandidateById(
    "oyi77/creative-writing-uncensored",
  );

  assert.ok(adult);
  assert.ok(creative);
  assert.equal(adult.status, "reference-only");
  assert.equal(adult.licenseUse, "unknown-license-review-required");
  assert.match(adult.allowedUse, /Mine structural statistics/i);
  assert.match(adult.blockedUse, /Do not import explicit prose/i);

  assert.equal(creative.status, "use-with-review");
  assert.equal(creative.licenseUse, "permissive-with-attribution");
  assert.match(creative.allowedUse, /Prose Pixie/i);
  assert.match(creative.blockedUse, /Do not copy raw uncensored messages/i);
});
