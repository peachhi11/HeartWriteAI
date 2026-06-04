import assert from "node:assert/strict";
import test from "node:test";

import {
  ADULT_WRITING_STRUCTURE_REFERENCES,
  ORIGINAL_WRITING_STRUCTURE_FIXTURES,
  getAdultWritingStructureReferenceByDataset,
  getOriginalWritingFixturesByLane,
} from "../../data/adultWritingStructureReference";

test("records adult writing corpora as structural references without storing source prose", () => {
  assert.equal(ADULT_WRITING_STRUCTURE_REFERENCES.length, 2);

  const allText = JSON.stringify(ADULT_WRITING_STRUCTURE_REFERENCES);
  assert.doesNotMatch(allText, /"text":|"messages":|"content":/i);
  assert.match(allText, /do not copy story text/i);
  assert.match(allText, /do not copy story text|raw rows should not be copied/i);
});

test("captures high-level Literotica and Reddit corpus structure only", () => {
  const [reference] = getAdultWritingStructureReferenceByDataset(
    "agentlans/literotica-reddit-dirty-writing-prompts",
  );
  assert.ok(reference);

  assert.equal(reference.rowsInspected, 100);
  assert.equal(
    reference.sourceMix?.["nothingiisreal/Reddit-Dirty-And-WritingPrompts"],
    95,
  );
  assert.equal(reference.sourceMix?.["taozi555/literotica-stories"], 5);
  assert.ok(reference.lanes.includes("adult-pacing"));
  assert.ok(reference.lanes.includes("topic-taxonomy"));
  assert.match(reference.chunkLengthFindings.join(" "), /median: 176/i);
  assert.match(reference.usageBoundary, /Reference only/i);
});

test("captures short SFT pair shape for creative-writing prompt layout fixtures", () => {
  const [reference] = getAdultWritingStructureReferenceByDataset(
    "oyi77/creative-writing-uncensored",
  );
  assert.ok(reference);

  assert.equal(reference.rowsInspected, 78);
  assert.ok(reference.lanes.includes("sft-shape"));
  assert.ok(reference.lanes.includes("creative-prompt-layout-fixture"));
  assert.match(reference.promptStructure.join(" "), /two messages/i);
  assert.match(reference.chunkLengthFindings.join(" "), /Assistant response median: 101/i);
  assert.match(reference.usageBoundary, /raw rows should not be copied/i);
});

test("derives original Prose Pixie and prompt-layout fixture shapes", () => {
  assert.equal(ORIGINAL_WRITING_STRUCTURE_FIXTURES.length, 4);
  assert.equal(getOriginalWritingFixturesByLane("prose-pixie-fixture").length, 2);
  assert.equal(
    getOriginalWritingFixturesByLane("creative-prompt-layout-fixture").length,
    2,
  );

  const allFixtureText = JSON.stringify(ORIGINAL_WRITING_STRUCTURE_FIXTURES);
  assert.match(allFixtureText, /Keeps the same scene facts/);
  assert.match(allFixtureText, /two-message user\/assistant layout/);
  assert.doesNotMatch(
    allFixtureText,
    /Literotica|DirtyWritingPrompts|uncensored message|source corpus phrasing as output/i,
  );
});
