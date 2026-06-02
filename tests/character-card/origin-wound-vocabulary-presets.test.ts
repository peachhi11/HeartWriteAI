import assert from "node:assert/strict";
import test from "node:test";

import {
  compileOriginWoundPresetAdditions,
  compileOriginWoundPresetSummary,
  findOriginWoundVocabularyPresetById,
  getOriginWoundVocabularyPresetsByCategory,
  ORIGIN_WOUND_CATEGORIES,
  ORIGIN_WOUND_VOCABULARY_PRESETS,
} from "../../data/originWoundVocabularyPresets";

test("loads normalized origin wound presets with stable categories", () => {
  assert.equal(ORIGIN_WOUND_VOCABULARY_PRESETS.length, 5);

  const ids = ORIGIN_WOUND_VOCABULARY_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(ORIGIN_WOUND_CATEGORIES, [
    "Abandonment & Discard",
    "Betrayal & Treason",
    "Helplessness & Failure",
    "Objectification & Ledger",
    "Shame & Defilement",
  ]);
  assert.equal(
    getOriginWoundVocabularyPresetsByCategory("shame & defilement")[0]?.id,
    "wound_shame_defilement",
  );
});

test("renames and repairs malformed shame defilement preset", () => {
  const malformedId = findOriginWoundVocabularyPresetById("wound_shame_definement");
  const repaired = must(findOriginWoundVocabularyPresetById("WOUND_SHAME_DEFILEMENT"));

  assert.equal(malformedId, undefined);
  assert.equal(repaired.category, "Shame & Defilement");
  assert.match(repaired.woundProfile.coreWound, /changed, marked, contaminated/i);
  assert.ok(repaired.lexicalTokens.signatureVerbs.includes("flinch"));
  assert.ok(repaired.lexicalTokens.vulnerabilityNouns.includes("scar"));
  assert.match(repaired.sampleDialogueLine, /stay gentle/i);
});

test("compiles origin wound additions as soft guidance", () => {
  const abandonment = must(findOriginWoundVocabularyPresetById("wound_abandonment_discard"));
  const additions = compileOriginWoundPresetAdditions(abandonment);

  assert.match(additions.backgroundAddition, /Origin wound preset/);
  assert.match(additions.personalityAddition, /Defense pattern/);
  assert.match(additions.systemPromptAddition, /soft characterization guidance/i);
  assert.match(additions.systemPromptAddition, /may surface when relevant/i);
  assert.match(additions.systemPromptAddition, /do not override player agency/i);
  assert.match(additions.systemPromptAddition, /avoid flattening the character into trauma-only behavior/i);
});

test("keeps heated wound vocabulary while blocking code-dump artifacts", () => {
  const allText = ORIGIN_WOUND_VOCABULARY_PRESETS
    .map((preset) =>
      [
        compileOriginWoundPresetSummary(preset),
        compileOriginWoundPresetAdditions(preset).systemPromptAddition,
      ].join(" "),
    )
    .join(" ");

  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.match(allText, /\bsmother/i);
  assert.match(allText, /\bcontaminated\b/i);
  assert.match(allText, /\babomination\b/i);
  assert.match(allText, /\bpollut/i);
});

function must<T>(value: T | undefined): T {
  assert.ok(value);
  return value;
}
