import assert from "node:assert/strict";
import test from "node:test";

import {
  GENRE_SETTING_PACK_PRESET_CATEGORIES,
  GENRE_SETTING_PACK_PRESETS,
  compileGenreSettingPackPresetAdditions,
  cyberpunkSettingSeeds,
  findGenreSettingPackPresetById,
  genreSettingPackPresets,
  getGenreSettingPackPresetsByCategory,
  gothicSettingSeeds,
  highValueGenreSettingSeeds,
  mafiaSettingSeeds,
  militarySciFiSettingSeeds,
  monsterHunterSettingSeeds,
  noirSettingSeeds,
  postApocalypticSettingSeeds,
  regencySettingSeeds,
  solarpunkSettingSeeds,
  westernSettingSeeds,
} from "../../data/genreSettingPackPresets";

test("loads genre setting packs across major genre lanes", () => {
  assert.equal(GENRE_SETTING_PACK_PRESETS.length, 230);
  assert.deepEqual(GENRE_SETTING_PACK_PRESET_CATEGORIES, [
    "Cyberpunk Setting",
    "Genre Pack",
    "Gothic Setting",
    "High-Value Genre Seed",
    "Mafia Setting",
    "Military Sci-Fi Setting",
    "Monster Hunter Setting",
    "Noir Setting",
    "Post-Apocalyptic Setting",
    "Regency Setting",
    "Solarpunk Setting",
    "Western Setting",
  ]);

  const ids = GENRE_SETTING_PACK_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(genreSettingPackPresets.length, 10);
  assert.equal(gothicSettingSeeds.length, 20);
  assert.equal(westernSettingSeeds.length, 20);
  assert.equal(noirSettingSeeds.length, 20);
  assert.equal(cyberpunkSettingSeeds.length, 20);
  assert.equal(solarpunkSettingSeeds.length, 20);
  assert.equal(regencySettingSeeds.length, 20);
  assert.equal(mafiaSettingSeeds.length, 20);
  assert.equal(monsterHunterSettingSeeds.length, 20);
  assert.equal(militarySciFiSettingSeeds.length, 20);
  assert.equal(postApocalypticSettingSeeds.length, 20);
  assert.equal(highValueGenreSettingSeeds.length, 20);
  assert.equal(getGenreSettingPackPresetsByCategory("Gothic Setting").length, 20);
  assert.equal(getGenreSettingPackPresetsByCategory("Cyberpunk Setting").length, 20);
  assert.equal(getGenreSettingPackPresetsByCategory("High-Value Genre Seed").length, 20);
});

test("normalises genre setting values for visible prompt text", () => {
  const organisedCrime = findGenreSettingPackPresetById(
    "genre_setting_noir_organised_crime",
  );
  const defence = findGenreSettingPackPresetById(
    "genre_setting_military_sci_fi_planetary_defence",
  );
  const favours = findGenreSettingPackPresetById("genre_setting_mafia_debt_and_favours");
  const travellingHunters = findGenreSettingPackPresetById(
    "genre_setting_monster_hunter_travelling_hunters",
  );
  const civilisation = findGenreSettingPackPresetById(
    "genre_setting_post_apocalyptic_rebuilding_civilisation",
  );
  const visibleText = GENRE_SETTING_PACK_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(organisedCrime?.value, "organised crime");
  assert.equal(organisedCrime?.triggerKeys.includes("organized_crime"), true);
  assert.equal(defence?.value, "planetary defence");
  assert.equal(defence?.triggerKeys.includes("planetary_defense"), true);
  assert.equal(favours?.value, "debt and favours");
  assert.equal(favours?.triggerKeys.includes("debt_and_favors"), true);
  assert.equal(travellingHunters?.value, "travelling hunters");
  assert.equal(civilisation?.value, "rebuilding civilisation");
  assert.doesNotMatch(
    visibleText,
    /\borganized\b|\bdefense\b|\bfavors\b|\btraveling\b|\bcivilization\b/i,
  );
});

test("finds high-signal genre setting seeds by stable ids", () => {
  assert.equal(
    findGenreSettingPackPresetById("genre_setting_pack_gothic_horror")?.value,
    "Gothic Horror",
  );
  assert.equal(
    findGenreSettingPackPresetById("genre_setting_gothic_gothic_manor")?.value,
    "gothic manor",
  );
  assert.equal(
    findGenreSettingPackPresetById("genre_setting_cyberpunk_corporate_dystopia")
      ?.value,
    "corporate dystopia",
  );
  assert.equal(
    findGenreSettingPackPresetById("genre_setting_solarpunk_hopeful_future")?.value,
    "hopeful future",
  );
  assert.equal(
    findGenreSettingPackPresetById("genre_setting_regency_marriage_market")?.value,
    "marriage market",
  );
  assert.equal(
    findGenreSettingPackPresetById("genre_setting_mafia_loyalty_vs_love")?.value,
    "loyalty vs love",
  );
  assert.equal(
    findGenreSettingPackPresetById("genre_setting_monster_hunter_dangerous_creatures")
      ?.value,
    "dangerous creatures",
  );
  assert.equal(
    findGenreSettingPackPresetById("genre_setting_military_sci_fi_chain_of_command")
      ?.value,
    "chain of command",
  );
  assert.equal(
    findGenreSettingPackPresetById(
      "genre_setting_post_apocalyptic_survival_communities",
    )?.value,
    "survival communities",
  );
  assert.equal(
    findGenreSettingPackPresetById("genre_setting_high_value_rebuilding_civilisation")
      ?.value,
    "rebuilding civilisation",
  );
});

test("compiles genre setting packs as soft genre context", () => {
  const preset = findGenreSettingPackPresetById(
    "genre_setting_cyberpunk_surveillance_state",
  );
  assert.ok(preset);

  const additions = compileGenreSettingPackPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Genre setting context/);
  assert.match(additions.scenarioAddition, /without locking the scene/i);
  assert.match(additions.systemPromptAddition, /soft genre-setting context/i);
  assert.match(additions.systemPromptAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} agency/i);
  assert.match(additions.systemPromptAddition, /avoid infodumps/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps risky genre lanes fictional and consequence-aware", () => {
  const mafia = findGenreSettingPackPresetById("genre_setting_mafia_crime_family");
  const military = findGenreSettingPackPresetById(
    "genre_setting_military_sci_fi_frontline_warfare",
  );
  const survival = findGenreSettingPackPresetById(
    "genre_setting_post_apocalyptic_scarce_resources",
  );
  assert.ok(mafia);
  assert.ok(military);
  assert.ok(survival);

  assert.match(mafia.guidance, /fictional underworld/i);
  assert.match(mafia.guidance, /never endorse criminal harm/i);
  assert.match(military.guidance, /without glorifying violence/i);
  assert.match(survival.guidance, /without tactical real-world instruction/i);

  const additions = compileGenreSettingPackPresetAdditions(mafia);
  assert.match(
    additions.systemPromptAddition,
    /criminal, violent, war, surveillance, and survival systems fictional, consequence-aware, and non-instructional/i,
  );
});
