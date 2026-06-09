import assert from "node:assert/strict";
import test from "node:test";

import {
  compileSampleCardProseStructureAdditions,
  findSampleCardProseStructurePresetById,
  SAMPLE_CARD_PROSE_STRUCTURE_PRESETS,
} from "../../data/sampleCardProseStructurePresets";

test("loads original sample card prose structure presets", () => {
  assert.equal(SAMPLE_CARD_PROSE_STRUCTURE_PRESETS.length, 3);

  const ids = SAMPLE_CARD_PROSE_STRUCTURE_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(
    SAMPLE_CARD_PROSE_STRUCTURE_PRESETS.every(
      (preset) =>
        preset.category === "Card Prose Structure" &&
        preset.compileTargets.includes("description") &&
        preset.compileTargets.includes("scenario") &&
        preset.compileTargets.includes("first_mes") &&
        preset.source === "heartwriteai-figma-reference-mined",
    ),
  );
});

test("finds and compiles sample prose structure as soft drafting guidance", () => {
  const preset = findSampleCardProseStructurePresetById(
    "SAMPLE_CARD_STRUCTURE_ISOLATED_NONHUMAN",
  );

  assert.ok(preset);
  assert.match(preset.descriptionPattern, /nonhuman presence/i);
  assert.match(preset.openingPattern, /precise observation/i);
  assert.match(preset.scenarioPattern, /trust calibration/i);

  const additions = compileSampleCardProseStructureAdditions(preset);

  assert.match(additions.descriptionGuidance, /constraints/i);
  assert.match(additions.openingGuidance, /user's arrival/i);
  assert.match(additions.scenarioGuidance, /attention can become attachment/i);
  assert.match(additions.systemPromptAddition, /concise drafting guidance/i);
  assert.match(additions.systemPromptAddition, /Do not copy it verbatim/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /force|must copy|must override/i,
  );
});
