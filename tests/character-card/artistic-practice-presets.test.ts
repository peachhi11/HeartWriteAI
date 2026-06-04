import assert from "node:assert/strict";
import test from "node:test";

import {
  ARTISTIC_PRACTICE_PRESET_CATEGORIES,
  ARTISTIC_PRACTICE_PRESETS,
  compileArtisticPracticePresetAdditions,
  findArtisticPracticePresetById,
  getArtisticPracticePresetsByCategory,
} from "../../data/artisticPracticePresets";

test("loads artistic practice presets across practice, medium, process, style, and romance lanes", () => {
  assert.equal(ARTISTIC_PRACTICE_PRESETS.length, 290);
  assert.deepEqual(ARTISTIC_PRACTICE_PRESET_CATEGORIES, [
    "Archetype",
    "Artistic Practice",
    "Dialogue Seed",
    "Gate",
    "High-Value Seed",
    "Mastery",
    "Medium",
    "Process",
    "Romance Hook",
    "Style",
    "Weakness",
  ]);

  const ids = ARTISTIC_PRACTICE_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getArtisticPracticePresetsByCategory("Artistic Practice").length, 91);
  assert.equal(getArtisticPracticePresetsByCategory("Dialogue Seed").length, 19);
  assert.equal(getArtisticPracticePresetsByCategory("High-Value Seed").length, 20);
});

test("normalises artistic practice values for visible prompt text", () => {
  const fibre = findArtisticPracticePresetById("artistic_practice_seed_fibre_art");
  const jewellery = findArtisticPracticePresetById(
    "artistic_practice_seed_jewellery_art",
  );
  const watercolour = findArtisticPracticePresetById(
    "artistic_practice_medium_watercolour",
  );
  const coloured = findArtisticPracticePresetById(
    "artistic_practice_medium_coloured_pencil",
  );
  const colourStudy = findArtisticPracticePresetById(
    "artistic_practice_process_colour_study",
  );
  const favourite = findArtisticPracticePresetById(
    "artistic_practice_mastery_cult_favourite_artist",
  );
  const userPaint = findArtisticPracticePresetById(
    "artistic_practice_romance_artist_paints_user",
  );
  const visibleText = ARTISTIC_PRACTICE_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(fibre?.value, "fibre art");
  assert.equal(jewellery?.value, "jewellery art");
  assert.equal(watercolour?.value, "watercolour");
  assert.equal(coloured?.value, "coloured pencil");
  assert.equal(colourStudy?.value, "colour study");
  assert.equal(favourite?.value, "cult favourite artist");
  assert.equal(userPaint?.value, "artist paints {{user}}");
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|fiber art|jewelry|watercolor|colored pencil|color study|favorite|artist paints user|burned out/i,
  );
});

test("compiles artistic practice presets as soft authorship-aware context", () => {
  const preset = findArtisticPracticePresetById("artistic_practice_process_art_as_confession");
  assert.ok(preset);

  const additions = compileArtisticPracticePresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Artistic practice context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft artistic practice context/i);
  assert.match(additions.systemPromptAddition, /authorship, and \{\{user\}\} autonomy/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
