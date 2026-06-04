import assert from "node:assert/strict";
import test from "node:test";

import {
  HOBBIES_TASTES_PRESET_CATEGORIES,
  HOBBIES_TASTES_PRESETS,
  compileHobbiesTastesPresetAdditions,
  findHobbiesTastesPresetById,
  getHobbiesTastesPresetsByCategory,
} from "../../data/hobbiesTastesPresets";

test("loads hobbies and tastes presets across taste, leisure, collection, romance, and dialogue lanes", () => {
  assert.equal(HOBBIES_TASTES_PRESETS.length, 357);
  assert.deepEqual(HOBBIES_TASTES_PRESET_CATEGORIES, [
    "Archetype",
    "Book Taste",
    "Collection",
    "Dialogue Seed",
    "Fashion Taste",
    "Food Taste",
    "Gate",
    "General Taste",
    "Guilty Pleasure",
    "High-Value Seed",
    "Leisure Style",
    "Music Taste",
    "Romance Hook",
    "Sports Taste",
  ]);

  const ids = HOBBIES_TASTES_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getHobbiesTastesPresetsByCategory("Music Taste").length, 30);
  assert.equal(getHobbiesTastesPresetsByCategory("Guilty Pleasure").length, 25);
  assert.equal(getHobbiesTastesPresetsByCategory("Dialogue Seed").length, 22);
  assert.equal(getHobbiesTastesPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises hobbies and tastes values for visible prompt text", () => {
  const cosy = findHobbiesTastesPresetById("hobbies_tastes_archetype_the_cosy_hobbyist");
  const savoury = findHobbiesTastesPresetById("hobbies_tastes_food_savoury_snacks");
  const favourite = findHobbiesTastesPresetById(
    "hobbies_tastes_book_quotes_favourite_lines",
  );
  const jewellery = findHobbiesTastesPresetById(
    "hobbies_tastes_fashion_delicate_jewellery",
  );
  const armour = findHobbiesTastesPresetById(
    "hobbies_tastes_fashion_clothing_as_armour",
  );
  const order = findHobbiesTastesPresetById("hobbies_tastes_food_knows_user_s_order");
  const meal = findHobbiesTastesPresetById(
    "hobbies_tastes_romance_cooks_user_s_favourite_meal",
  );
  const visibleText = HOBBIES_TASTES_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(cosy?.value, "The Cosy Hobbyist");
  assert.equal(savoury?.value, "savoury snacks");
  assert.equal(favourite?.value, "quotes favourite lines");
  assert.equal(jewellery?.value, "delicate jewellery");
  assert.equal(armour?.value, "clothing as armour");
  assert.equal(order?.value, "knows {{user}}'s order");
  assert.equal(meal?.value, "cooks {{user}}'s favourite meal");
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|cozy|savory|favorite|jewelry|armor|honored|knows users order|cooks users|borrows users|teaches user|user discovers/i,
  );
});

test("compiles hobbies and tastes presets as soft specificity-aware context", () => {
  const preset = findHobbiesTastesPresetById(
    "hobbies_tastes_romance_taste_becomes_love_language",
  );
  assert.ok(preset);

  const additions = compileHobbiesTastesPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Hobbies and tastes context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft hobbies and tastes context/i);
  assert.match(additions.systemPromptAddition, /remembered details shape behaviour/i);
  assert.match(additions.systemPromptAddition, /without turning the character into a single gimmick/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps private hobbies and collections humanising rather than mocking", () => {
  const guilty = findHobbiesTastesPresetById(
    "hobbies_tastes_guilty_pleasure_pretends_not_to_like_cute_things",
  );
  const collection = findHobbiesTastesPresetById(
    "hobbies_tastes_collection_keepsakes_from_user",
  );
  assert.ok(guilty);
  assert.ok(collection);

  assert.match(guilty.guidance, /without mocking or flattening/i);
  assert.equal(collection.value, "keepsakes from {{user}}");
});
