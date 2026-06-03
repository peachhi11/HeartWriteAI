import assert from "node:assert/strict";
import test from "node:test";

import {
  findRomanceTropeCombinationPresetById,
  getMostIntenseRomanceTropeCombinationPresets,
  getTopRomanceTropeCombinationPresets,
  ROMANCE_TROPE_COMBINATION_PRESETS,
} from "../../data/romanceTropeCombinationPresets";

test("loads ranked romance trope combination presets with stable ids", () => {
  assert.equal(ROMANCE_TROPE_COMBINATION_PRESETS.length, 10);

  const ids = ROMANCE_TROPE_COMBINATION_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(
    ROMANCE_TROPE_COMBINATION_PRESETS.map((preset) => preset.rank),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  );
  assert.ok(
    ROMANCE_TROPE_COMBINATION_PRESETS.every(
      (preset) => preset.popularity >= 1 && preset.popularity <= 5,
    ),
  );
  assert.ok(
    ROMANCE_TROPE_COMBINATION_PRESETS.every(
      (preset) => preset.emotionalIntensity >= 1 && preset.emotionalIntensity <= 5,
    ),
  );
});

test("finds and filters high-intensity trope combinations", () => {
  const top = getTopRomanceTropeCombinationPresets(3);
  const bodyguard = findRomanceTropeCombinationPresetById(
    "combo_008_bodyguard_protected_slow_burn",
  );
  const mostIntense = getMostIntenseRomanceTropeCombinationPresets();

  assert.deepEqual(
    top.map((preset) => preset.combination),
    [
      "Enemies to Lovers + Slow Burn + Mutual Pining",
      "Grumpy x Sunshine + Slow Burn",
      "Rivals to Lovers + Forced Proximity",
    ],
  );
  assert.equal(bodyguard?.popularity, 5);
  assert.equal(bodyguard?.emotionalIntensity, 5);
  assert.ok(mostIntense.every((preset) => preset.emotionalIntensity === 5));
  assert.equal(mostIntense.at(0)?.rank, 1);
});
