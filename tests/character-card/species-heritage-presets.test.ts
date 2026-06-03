import assert from "node:assert/strict";
import test from "node:test";

import {
  SPECIES_HERITAGE_PRESET_CATEGORIES,
  SPECIES_HERITAGE_PRESETS,
  compileSpeciesHeritagePresetAdditions,
  compileSpeciesHeritagePresetSummary,
  findSpeciesHeritagePresetById,
  getSpeciesHeritagePresetsByCategory,
} from "../../data/speciesHeritagePresets";

test("loads species/heritage presets across fantasy, sci-fi, and lore lanes", () => {
  assert.equal(SPECIES_HERITAGE_PRESETS.length, 9517);
  assert.equal(SPECIES_HERITAGE_PRESET_CATEGORIES.length, 393);
  for (const category of [
    "Ancestry Preset",
    "Heritage Preset",
    "Language Preset",
    "Diaspora Preset",
    "Diaspora Note Preset",
    "Family History Preset",
    "Social Context Preset",
    "Community Preset",
    "Naming Culture Preset",
    "Social Custom Preset",
    "Birthplace Preset",
    "City Preset",
    "Academy Preset",
    "Manor Preset",
    "College Preset",
    "Colony Preset",
    "Village Preset",
    "Space Station Preset",
    "Court Preset",
    "Underworld Preset",
    "Setting Preset",
    "Modern Setting Preset",
    "Historical Setting Preset",
    "Fantasy Setting Preset",
    "Dark Fantasy Setting",
    "Sci-Fi Setting Preset",
    "Romance-Focused Setting",
    "Dangerous Romance Setting",
    "Cozy Setting Preset",
    "School Setting Preset",
    "Settlement Type Preset",
    "Setting Environment Preset",
    "Setting Culture Preset",
    "Setting Culture Romance Hook",
    "Setting Technology Preset",
    "Technology Social Impact",
    "Setting Government Preset",
    "Government Power",
    "Government Romance Hook",
    "Setting Economy Preset",
    "Economy Social Impact",
    "Economy Romance Hook",
    "Setting Religion Preset",
    "Religion Social Impact",
    "Religion Romance Hook",
    "Setting Social Structure Preset",
    "Social Structure Power",
    "Social Structure Romance Hook",
    "Environment Threat",
    "Setting Threat Preset",
    "Setting Threat Romance Hook",
    "Setting Romance Norm Preset",
    "Setting Romance Norm Romance Hook",
    "Setting Daily Life Preset",
    "Setting Daily Life Romance Hook",
    "Identity Preset",
    "Ethnicity Preset",
    "Race Preset",
    "Physiology",
    "Lore Hook",
  ] as const) {
    assert.ok(
      SPECIES_HERITAGE_PRESET_CATEGORIES.includes(category),
      `missing ${category}`,
    );
  }

  assert.equal(getSpeciesHeritagePresetsByCategory("physiology").length, 199);
  assert.equal(getSpeciesHeritagePresetsByCategory("physiology preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("race preset").length, 26);
  assert.equal(getSpeciesHeritagePresetsByCategory("race heritage").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("race culture").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("race appearance").length, 25);
  assert.equal(getSpeciesHeritagePresetsByCategory("race social context").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("race lore hook").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("race romance hook").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("race dialogue seed").length, 15);
  assert.equal(getSpeciesHeritagePresetsByCategory("ethnicity preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("ethnicity identity").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("ethnicity culture").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("ethnicity language").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("ethnicity family pressure").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("ethnicity diaspora").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("ethnicity social context").length,
    20,
  );
  assert.equal(
    getSpeciesHeritagePresetsByCategory("ethnicity romance hook").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("ethnicity wound").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("ethnicity dialogue seed").length,
    15,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("identity preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("identity type").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("identity seed").length, 42);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("identity motivation").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("identity trigger").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("identity behaviour").length,
    20,
  );
  assert.equal(
    getSpeciesHeritagePresetsByCategory("identity emotional flavour").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("identity wound").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("identity method").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("identity gate").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("identity trope").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("identity aftermath route").length,
    20,
  );
  assert.equal(
    getSpeciesHeritagePresetsByCategory("identity dialogue seed").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("ancestry preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("ancestry trope").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("heritage type").length,
    30,
  );
  assert.equal(
    getSpeciesHeritagePresetsByCategory("heritage culture").length,
    25,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("language preset").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("language communication style").length,
    30,
  );
  assert.equal(
    getSpeciesHeritagePresetsByCategory("language speech pattern").length,
    30,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("diaspora preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("diaspora trope").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("diaspora note preset").length,
    20,
  );
  assert.equal(
    getSpeciesHeritagePresetsByCategory("diaspora note seed").length,
    100,
  );
  assert.equal(
    getSpeciesHeritagePresetsByCategory("diaspora note dialogue seed").length,
    15,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("social custom preset").length, 15);
  assert.equal(getSpeciesHeritagePresetsByCategory("social custom seed").length, 104);
  assert.equal(getSpeciesHeritagePresetsByCategory("social custom trigger").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("social custom wound").length, 15);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("social custom romance hook").length,
    16,
  );
  assert.equal(
    getSpeciesHeritagePresetsByCategory("social custom dialogue seed").length,
    10,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("birthplace preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("birthplace geography").length, 30);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("birthplace social environment").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("birthplace economy").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("birthplace culture").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("birthplace climate").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("birthplace politics").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("birthplace childhood environment").length,
    20,
  );
  assert.equal(
    getSpeciesHeritagePresetsByCategory("birthplace relationship").length,
    20,
  );
  assert.equal(
    getSpeciesHeritagePresetsByCategory("fantastical birthplace").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("birthplace wound").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("birthplace romance hook").length,
    20,
  );
  assert.equal(
    getSpeciesHeritagePresetsByCategory("birthplace dialogue seed").length,
    16,
  );
  assert.equal(
    getSpeciesHeritagePresetsByCategory("birthplace high value seed").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("city preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("city type").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("city district").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("city atmosphere").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("city lifestyle").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("city social").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("city wound").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("city romance hook").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("city dialogue seed").length, 16);
  assert.equal(getSpeciesHeritagePresetsByCategory("academy preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("academy type").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("academy setting").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("academy social").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("academy academic").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("academy romance hook").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("academy wound").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("academy trigger").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("academy dialogue seed").length, 15);
  assert.equal(getSpeciesHeritagePresetsByCategory("manor preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("manor type").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("manor atmosphere").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("manor room").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("manor grounds").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("manor lore hook").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("manor romance hook").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("manor wound").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("manor trigger").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("manor dialogue seed").length, 15);
  assert.equal(getSpeciesHeritagePresetsByCategory("college preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("college type").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("college status").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("college major").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("college life").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("college social").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("college wound").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("college romance hook").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("college trigger").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("college dialogue seed").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("colony preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("colony type").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("colony environment").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("colony social").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("colony economy").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("colony political").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("colony wound").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("colony romance hook").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("colony trigger").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("colony dialogue seed").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("village preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("village type").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("village atmosphere").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("village landmark").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("village social").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("village custom").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("village wound").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("village romance hook").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("village trigger").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("village behaviour").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("village gate").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("village dialogue seed").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("space station preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("space station type").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("space station environment").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("space station social").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("space station wound").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("space station romance hook").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("space station trigger").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("space station behaviour").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("space station gate").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("space station trope").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("space station aftermath route").length,
    20,
  );
  assert.equal(
    getSpeciesHeritagePresetsByCategory("space station dialogue seed").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("court preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("court type").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("court social").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("court atmosphere").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("court location").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("court role").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("court conflict").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("court romance hook").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("court wound").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("court trigger").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("court behaviour").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("court gate").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("court trope").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("court aftermath route").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("court dialogue seed").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("underworld preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("underworld type").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("underworld atmosphere").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("underworld location").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("underworld role").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("underworld power").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("underworld conflict").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("underworld romance hook").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("underworld wound").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("underworld trigger").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("underworld behaviour").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("underworld gate").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("underworld trope").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("underworld aftermath route").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("underworld dialogue seed").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("settlement type").length, 25);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting environment").length, 25);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting culture").length, 25);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting technology").length, 25);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting government").length, 25);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting economy").length, 25);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting religion").length, 25);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("setting social structure").length,
    25,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("setting threat").length, 30);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting romance norm").length, 25);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting daily life").length, 25);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting romance hook").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting gate").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting dialogue seed").length, 17);
  assert.equal(getSpeciesHeritagePresetsByCategory("modern setting preset").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("historical setting preset").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("fantasy setting preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("dark fantasy setting").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("sci-fi setting preset").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("romance-focused setting").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("dangerous romance setting").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("cozy setting preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("school setting preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("settlement seed").length, 30);
  assert.equal(getSpeciesHeritagePresetsByCategory("high value setting preset").length, 15);
  assert.equal(getSpeciesHeritagePresetsByCategory("settlement type preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("settlement type seed").length, 146);
  assert.equal(getSpeciesHeritagePresetsByCategory("settlement scale").length, 16);
  assert.equal(getSpeciesHeritagePresetsByCategory("settlement romance hook").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("settlement dialogue seed").length, 15);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting environment preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting environment seed").length, 240);
  assert.equal(getSpeciesHeritagePresetsByCategory("environment atmosphere").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("environment threat").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("environment romance hook").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("environment dialogue seed").length, 16);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting culture preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting culture seed").length, 66);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("setting culture romance hook").length,
    20,
  );
  assert.equal(
    getSpeciesHeritagePresetsByCategory("setting culture dialogue seed").length,
    10,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("setting technology preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting technology seed").length, 155);
  assert.equal(getSpeciesHeritagePresetsByCategory("technology social impact").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("setting technology romance hook").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("setting technology trigger").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting technology wound").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("setting technology dialogue seed").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("setting government preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting government seed").length, 55);
  assert.equal(getSpeciesHeritagePresetsByCategory("government power").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("government conflict").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("government romance hook").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("government trigger").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("government wound").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("government gate").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("government dialogue seed").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting economy preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting economy seed").length, 106);
  assert.equal(getSpeciesHeritagePresetsByCategory("economy social impact").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("economy romance hook").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("economy trigger").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("economy wound").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("economy gate").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("economy dialogue seed").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting religion preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting religion seed").length, 100);
  assert.equal(getSpeciesHeritagePresetsByCategory("religion social impact").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("religion romance hook").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("religion trigger").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("religion wound").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("religion gate").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("religion dialogue seed").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting social structure preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting social structure seed").length, 110);
  assert.equal(getSpeciesHeritagePresetsByCategory("social structure power").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("social structure conflict").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("social structure romance hook").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("social structure trigger").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("social structure wound").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("social structure gate").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("social structure dialogue seed").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting threat preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting threat seed").length, 120);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting threat trigger").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting threat romance hook").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting threat dialogue seed").length, 15);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting romance norm preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting romance norm seed").length, 106);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting romance norm trigger").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting romance norm romance hook").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting romance norm wound").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting romance norm gate").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting romance norm dialogue seed").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting daily life preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting daily life seed").length, 120);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting daily life romance hook").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("setting daily life dialogue seed").length, 15);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("family history preset").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("family role").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("social context preset").length,
    20,
  );
  assert.equal(
    getSpeciesHeritagePresetsByCategory("social context trope").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("community preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("community type").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("community role").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("community seed").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("community motivation").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("community trigger").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("community behaviour").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("community wound").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("community method").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("community gate").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("community trope").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("community aftermath route").length,
    20,
  );
  assert.equal(
    getSpeciesHeritagePresetsByCategory("community dialogue seed").length,
    20,
  );
  assert.equal(
    getSpeciesHeritagePresetsByCategory("naming culture preset").length,
    20,
  );
  assert.equal(
    getSpeciesHeritagePresetsByCategory("naming culture type").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("naming structure").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("naming identity").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("naming motivation").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("naming trigger").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("naming behaviour").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("naming wound").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("naming method").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("naming gate").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("naming trope").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("naming aftermath route").length,
    20,
  );
  assert.equal(
    getSpeciesHeritagePresetsByCategory("naming dialogue seed").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("lore hook preset").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("lore hook").length, 180);
  assert.equal(getSpeciesHeritagePresetsByCategory("lore hook trigger").length, 20);
  assert.equal(
    getSpeciesHeritagePresetsByCategory("lore hook aftermath route").length,
    20,
  );
  assert.equal(
    getSpeciesHeritagePresetsByCategory("lore hook dialogue seed").length,
    20,
  );
  assert.equal(getSpeciesHeritagePresetsByCategory("vampire lore hook").length, 20);
  assert.equal(getSpeciesHeritagePresetsByCategory("dialogue seed").length, 20);
});

test("normalises readable species/heritage values and UK spelling", () => {
  const archetype = findSpeciesHeritagePresetById(
    "species_heritage_the_vampire_noble",
  );
  const physiology = findSpeciesHeritagePresetById("species_physiology_slow_ageing");
  const humanBody = findSpeciesHeritagePresetById("species_physiology_human_body");
  const stoppedAgeing = findSpeciesHeritagePresetById(
    "species_physiology_stopped_ageing",
  );
  const syntheticPreset = findSpeciesHeritagePresetById(
    "species_physiology_preset_the_synthetic_human",
  );
  const powerFearPreset = findSpeciesHeritagePresetById(
    "species_physiology_preset_the_body_afraid_of_its_own_power",
  );
  const hiddenHeir = findSpeciesHeritagePresetById(
    "species_lore_hook_hidden_heir",
  );
  const sacredArtefact = findSpeciesHeritagePresetById(
    "species_lore_hook_sacred_artefact",
  );
  const recognisesTrigger = findSpeciesHeritagePresetById(
    "species_lore_hook_trigger_enemy_recognises_character",
  );
  const userPastTrigger = findSpeciesHeritagePresetById(
    "species_lore_hook_trigger_user_asks_about_past",
  );
  const hiddenHeirPreset = findSpeciesHeritagePresetById(
    "species_lore_hook_preset_the_hidden_heir",
  );
  const halfElf = findSpeciesHeritagePresetById("species_race_half_elf");
  const honourCulture = findSpeciesHeritagePresetById(
    "species_race_culture_honour_culture",
  );
  const marginalisedGroup = findSpeciesHeritagePresetById(
    "species_race_social_context_marginalised_group",
  );
  const colonisedHistory = findSpeciesHeritagePresetById(
    "species_race_social_context_colonised_history",
  );
  const traditionLove = findSpeciesHeritagePresetById(
    "species_race_romance_hook_tradition_versus_love",
  );
  const identityDialogue = findSpeciesHeritagePresetById(
    "species_race_dialogue_i_do_not_want_to_be_reduced_to_my_bloodline",
  );
  const ethnicityPreset = findSpeciesHeritagePresetById(
    "species_ethnicity_preset_the_tradition_versus_love_character",
  );
  const familyHonour = findSpeciesHeritagePresetById(
    "species_ethnicity_family_pressure_family_honour",
  );
  const tokenisation = findSpeciesHeritagePresetById(
    "species_ethnicity_social_context_cultural_tokenisation",
  );
  const ethnicityCommunityJudgement = findSpeciesHeritagePresetById(
    "species_ethnicity_wound_community_judgement",
  );
  const ethnicityRomance = findSpeciesHeritagePresetById(
    "species_ethnicity_romance_hook_choosing_love_without_erasure",
  );
  const ethnicityDialogue = findSpeciesHeritagePresetById(
    "species_ethnicity_dialogue_i_do_not_want_love_to_mean_erasing_myself",
  );
  const identityPreset = findSpeciesHeritagePresetById(
    "species_identity_preset_the_one_becoming_real",
  );
  const identityMotivation = findSpeciesHeritagePresetById(
    "species_identity_motivation_honour_family_role",
  );
  const identityTrigger = findSpeciesHeritagePresetById(
    "species_identity_trigger_user_asks_real_name",
  );
  const identityBehaviour = findSpeciesHeritagePresetById(
    "species_identity_behaviour_tests_user_acceptance",
  );
  const identityFlavour = findSpeciesHeritagePresetById(
    "species_identity_emotional_flavour_self_protective",
  );
  const identityTrope = findSpeciesHeritagePresetById(
    "species_identity_trope_known_and_loved",
  );
  const identityChosenNameDialogue = findSpeciesHeritagePresetById(
    "species_identity_dialogue_that_is_not_the_name_i_chose",
  );
  const ancestryHonour = findSpeciesHeritagePresetById(
    "species_ancestry_motivation_honour_family",
  );
  const ancestryUserFamily = findSpeciesHeritagePresetById(
    "species_ancestry_trigger_user_asks_about_family",
  );
  const heritageColonised = findSpeciesHeritagePresetById(
    "species_heritage_type_colonised_heritage",
  );
  const heritageJewellery = findSpeciesHeritagePresetById(
    "species_heritage_culture_heirloom_jewellery",
  );
  const languageUserSpeaks = findSpeciesHeritagePresetById(
    "species_language_trigger_user_speaks_heritage_language",
  );
  const diasporaModernised = findSpeciesHeritagePresetById(
    "species_diaspora_culture_modernised_customs",
  );
  const diasporaJudgement = findSpeciesHeritagePresetById(
    "species_diaspora_wound_community_judgement",
  );
  const diasporaNotePreset = findSpeciesHeritagePresetById(
    "species_diaspora_note_preset_the_community_judgement_note",
  );
  const diasporaNoteJudgement = findSpeciesHeritagePresetById(
    "species_diaspora_note_seed_community_judgement_feared",
  );
  const diasporaNoteExoticise = findSpeciesHeritagePresetById(
    "species_diaspora_note_seed_partner_does_not_exoticise",
  );
  const diasporaNoteFamily = findSpeciesHeritagePresetById(
    "species_diaspora_note_seed_choosing_self_versus_family",
  );
  const diasporaNoteDialogue = findSpeciesHeritagePresetById(
    "species_diaspora_note_dialogue_seed_home_is_not_a_simple_word_for_me",
  );
  const socialCustomHonour = findSpeciesHeritagePresetById(
    "species_social_custom_preset_the_honour_bound_beloved",
  );
  const socialCustomSeat = findSpeciesHeritagePresetById(
    "species_social_custom_seed_seat_of_honour",
  );
  const socialCustomTrigger = findSpeciesHeritagePresetById(
    "species_social_custom_trigger_custom_versus_love_conflict",
  );
  const socialCustomWound = findSpeciesHeritagePresetById(
    "species_social_custom_wound_community_judgement",
  );
  const socialCustomDialogue = findSpeciesHeritagePresetById(
    "species_social_custom_dialogue_seed_you_honoured_my_family_by_remembering",
  );
  const birthplaceHarbour = findSpeciesHeritagePresetById(
    "species_birthplace_preset_the_harbour_child",
  );
  const birthplaceCentre = findSpeciesHeritagePresetById(
    "species_birthplace_economy_trade_centre",
  );
  const birthplaceChildhoodHarbour = findSpeciesHeritagePresetById(
    "species_birthplace_childhood_environment_busy_harbour",
  );
  const cityNeighbourhood = findSpeciesHeritagePresetById(
    "species_city_preset_the_neighbourhood_darling",
  );
  const cityTheatre = findSpeciesHeritagePresetById(
    "species_city_district_theatre_district",
  );
  const academyHonours = findSpeciesHeritagePresetById(
    "species_academy_academic_honours_track",
  );
  const collegeFavourite = findSpeciesHeritagePresetById(
    "species_college_social_professor_favourite",
  );
  const colonyLabour = findSpeciesHeritagePresetById(
    "species_colony_social_labour_hierarchy",
  );
  const colonyDialogue = findSpeciesHeritagePresetById(
    "species_colony_dialogue_seed_i_was_born_under_an_artificial_sky",
  );
  const villageTraveller = findSpeciesHeritagePresetById(
    "species_village_romance_hook_innkeeper_and_traveller",
  );
  const villageNeighbour = findSpeciesHeritagePresetById(
    "species_village_behaviour_repairs_neighbour_roof",
  );
  const stationStars = findSpeciesHeritagePresetById(
    "species_space_station_trope_love_under_artificial_stars",
  );
  const courtFavourite = findSpeciesHeritagePresetById(
    "species_court_social_court_favourites",
  );
  const courtHonour = findSpeciesHeritagePresetById(
    "species_court_wound_family_honour_burden",
  );
  const courtRomanticised = findSpeciesHeritagePresetById(
    "species_court_atmosphere_romanticised",
  );
  const underworldFavour = findSpeciesHeritagePresetById(
    "species_underworld_power_favour_debt",
  );
  const underworldBehaviour = findSpeciesHeritagePresetById(
    "species_underworld_behaviour_pays_in_favours",
  );
  const underworldDialogue = findSpeciesHeritagePresetById(
    "species_underworld_dialogue_seed_you_should_not_have_followed_me_here",
  );
  const settingHonour = findSpeciesHeritagePresetById(
    "species_setting_culture_honour_bound",
  );
  const settingCulturePreset = findSpeciesHeritagePresetById(
    "species_setting_culture_preset_honour_bound_culture",
  );
  const settingCultureModernising = findSpeciesHeritagePresetById(
    "species_setting_culture_seed_modernising",
  );
  const settingCultureHonourLove = findSpeciesHeritagePresetById(
    "species_setting_culture_seed_honour_versus_love",
  );
  const settingCultureReputation = findSpeciesHeritagePresetById(
    "species_setting_culture_romance_hook_reputation_risk_romance",
  );
  const settingCultureDialogue = findSpeciesHeritagePresetById(
    "species_setting_culture_dialogue_seed_you_honoured_my_home_by_remembering",
  );
  const settingAiGovernment = findSpeciesHeritagePresetById(
    "species_setting_government_ai_government",
  );
  const settingLabour = findSpeciesHeritagePresetById(
    "species_setting_economy_corporate_labour",
  );
  const settingAnalogue = findSpeciesHeritagePresetById(
    "species_setting_technology_analogue_tradition",
  );
  const settingTechnologyPreset = findSpeciesHeritagePresetById(
    "species_setting_technology_preset_android_integrated_society",
  );
  const settingTechnologyAnalogue = findSpeciesHeritagePresetById(
    "species_setting_technology_seed_analogue_modern",
  );
  const settingTechnologyLabour = findSpeciesHeritagePresetById(
    "species_setting_technology_seed_golem_labour",
  );
  const settingTechnologyImpact = findSpeciesHeritagePresetById(
    "species_technology_social_impact_tech_replaces_labour",
  );
  const settingTechnologyRomance = findSpeciesHeritagePresetById(
    "species_setting_technology_romance_hook_surveillance_state_secret_romance",
  );
  const settingTechnologyDialogue = findSpeciesHeritagePresetById(
    "species_setting_technology_dialogue_seed_your_heartbeat_is_analogue_i_like_that",
  );
  const settingGovernmentPreset = findSpeciesHeritagePresetById(
    "species_setting_government_preset_ai_governed_city",
  );
  const settingGovernmentSeed = findSpeciesHeritagePresetById(
    "species_setting_government_seed_ai_government",
  );
  const governmentPower = findSpeciesHeritagePresetById(
    "species_government_power_centralised_power",
  );
  const governmentRomance = findSpeciesHeritagePresetById(
    "species_government_romance_hook_heir_and_adviser",
  );
  const governmentTrigger = findSpeciesHeritagePresetById(
    "species_government_trigger_religious_judgement",
  );
  const governmentDialogue = findSpeciesHeritagePresetById(
    "species_government_dialogue_seed_then_let_them_learn_how_loyal_treason_can_be",
  );
  const settingEconomyPreset = findSpeciesHeritagePresetById(
    "species_setting_economy_preset_old_money_estate",
  );
  const settingEconomyLabour = findSpeciesHeritagePresetById(
    "species_setting_economy_seed_industrial_labour",
  );
  const settingEconomyFavour = findSpeciesHeritagePresetById(
    "species_setting_economy_seed_favour_debt",
  );
  const settingEconomyCentre = findSpeciesHeritagePresetById(
    "species_setting_economy_seed_financial_centre",
  );
  const economyImpact = findSpeciesHeritagePresetById(
    "species_economy_social_impact_labour_exploitation",
  );
  const economyRomance = findSpeciesHeritagePresetById(
    "species_economy_romance_hook_shared_ration_romance",
  );
  const economyDialogue = findSpeciesHeritagePresetById(
    "species_economy_dialogue_seed_i_would_rather_be_poor_with_choice_than_rich_in_a_cage",
  );
  const settingReligionPreset = findSpeciesHeritagePresetById(
    "species_setting_religion_preset_prophecy_driven_society",
  );
  const settingReligionJudgement = findSpeciesHeritagePresetById(
    "species_setting_religion_seed_soul_judgement",
  );
  const religionImpact = findSpeciesHeritagePresetById(
    "species_religion_social_impact_faith_restricts_romance",
  );
  const religionRomance = findSpeciesHeritagePresetById(
    "species_religion_romance_hook_sacred_vow_versus_love",
  );
  const religionGate = findSpeciesHeritagePresetById(
    "species_religion_gate_love_versus_dogma_gate",
  );
  const religionDialogue = findSpeciesHeritagePresetById(
    "species_religion_dialogue_seed_if_loving_you_is_heresy_history_can_write_me_guilty",
  );
  const socialStructurePreset = findSpeciesHeritagePresetById(
    "species_setting_social_structure_preset_noble_commoner_divide",
  );
  const socialStructureAiOwner = findSpeciesHeritagePresetById(
    "species_setting_social_structure_seed_ai_owner_class",
  );
  const socialStructureFavourite = findSpeciesHeritagePresetById(
    "species_setting_social_structure_seed_court_favourite_status",
  );
  const socialStructureMarginalisation = findSpeciesHeritagePresetById(
    "species_setting_social_structure_seed_hybrid_marginalisation",
  );
  const socialStructureTrigger = findSpeciesHeritagePresetById(
    "species_social_structure_trigger_public_defence",
  );
  const socialStructureWound = findSpeciesHeritagePresetById(
    "species_social_structure_wound_tokenisation_wound",
  );
  const socialStructureDialogue = findSpeciesHeritagePresetById(
    "species_social_structure_dialogue_seed_then_love_can_be_our_rebellion",
  );
  const settingThreatPreset = findSpeciesHeritagePresetById(
    "species_setting_threat_preset_life_support_failure",
  );
  const settingThreatJudgement = findSpeciesHeritagePresetById(
    "species_setting_threat_seed_divine_judgement",
  );
  const settingThreatHonour = findSpeciesHeritagePresetById(
    "species_setting_threat_seed_family_honour_conflict",
  );
  const settingThreatRomance = findSpeciesHeritagePresetById(
    "species_setting_threat_romance_hook_surveillance_state_secret_love",
  );
  const settingThreatDialogue = findSpeciesHeritagePresetById(
    "species_setting_threat_dialogue_seed_you_are_the_one_thing_i_will_not_surrender",
  );
  const settingRomanceNormPreset = findSpeciesHeritagePresetById(
    "species_setting_romance_norm_preset_soulbond_recognition_culture",
  );
  const settingRomanceNormJewellery = findSpeciesHeritagePresetById(
    "species_setting_romance_norm_seed_courtship_jewellery",
  );
  const settingRomanceNormRecognised = findSpeciesHeritagePresetById(
    "species_setting_romance_norm_seed_mate_bonds_recognised",
  );
  const settingRomanceNormHook = findSpeciesHeritagePresetById(
    "species_setting_romance_norm_romance_hook_fated_mates_versus_free_will",
  );
  const settingRomanceNormWound = findSpeciesHeritagePresetById(
    "species_setting_romance_norm_wound_family_honour_burden",
  );
  const settingRomanceNormDialogue = findSpeciesHeritagePresetById(
    "species_setting_romance_norm_dialogue_seed_then_teach_me_how_to_honour_you_properly",
  );
  const settingDailyLifePreset = findSpeciesHeritagePresetById(
    "species_setting_daily_life_preset_city_commute",
  );
  const settingDailyLifeNeighbour = findSpeciesHeritagePresetById(
    "species_setting_daily_life_seed_neighbour_help",
  );
  const settingDailyLifeTakeout = findSpeciesHeritagePresetById(
    "species_setting_daily_life_seed_late_night_takeout",
  );
  const settingDailyLifeHook = findSpeciesHeritagePresetById(
    "species_setting_daily_life_romance_hook_daily_routine_becomes_love",
  );
  const settingDailyLifeDialogue = findSpeciesHeritagePresetById(
    "species_setting_daily_life_dialogue_seed_the_little_things_are_how_people_become_home",
  );
  const settingRecognised = findSpeciesHeritagePresetById(
    "species_setting_romance_norm_mate_bonds_recognised",
  );
  const settingStigmatised = findSpeciesHeritagePresetById(
    "species_setting_romance_norm_divorce_stigmatised",
  );
  const settingDialogue = findSpeciesHeritagePresetById(
    "species_setting_dialogue_seed_you_honoured_my_home_by_remembering",
  );
  const modernNeighbourhood = findSpeciesHeritagePresetById(
    "species_modern_setting_preset_suburban_neighbourhood",
  );
  const settlementNeighbourhood = findSpeciesHeritagePresetById(
    "species_settlement_type_seed_neighbourhood",
  );
  const settlementNeighbours = findSpeciesHeritagePresetById(
    "species_settlement_romance_hook_neighbours_to_lovers",
  );
  const environmentHarbour = findSpeciesHeritagePresetById(
    "species_setting_environment_seed_harbour",
  );
  const environmentDialogue = findSpeciesHeritagePresetById(
    "species_environment_dialogue_seed_now_i_think_love_is_what_makes_it_liveable",
  );
  const familyRecognised = findSpeciesHeritagePresetById(
    "species_family_trigger_family_name_recognised",
  );
  const familyScapegoat = findSpeciesHeritagePresetById(
    "species_family_role_family_scape_goat",
  );
  const socialMarginalised = findSpeciesHeritagePresetById(
    "species_social_context_preset_the_marginalised_romantic",
  );
  const socialReputation = findSpeciesHeritagePresetById(
    "species_social_reputation_scandalised",
  );
  const socialTokenised = findSpeciesHeritagePresetById(
    "species_social_belonging_tokenised_by_group",
  );
  const socialRumour = findSpeciesHeritagePresetById(
    "species_social_context_trigger_workplace_rumour",
  );
  const socialDefence = findSpeciesHeritagePresetById(
    "species_social_context_method_public_defence",
  );
  const communityNeighbour = findSpeciesHeritagePresetById(
    "species_community_preset_the_beloved_neighbour",
  );
  const communityNeighbourhood = findSpeciesHeritagePresetById(
    "species_community_preset_the_neighbourhood_fixer",
  );
  const communityOrganiser = findSpeciesHeritagePresetById(
    "species_community_preset_the_festival_organiser",
  );
  const communityUrban = findSpeciesHeritagePresetById(
    "species_community_type_urban_neighbourhood",
  );
  const communityServeNeighbours = findSpeciesHeritagePresetById(
    "species_community_motivation_serve_neighbours",
  );
  const communityRecognised = findSpeciesHeritagePresetById(
    "species_community_trigger_family_name_recognised",
  );
  const communityOrganises = findSpeciesHeritagePresetById(
    "species_community_behaviour_organises_events",
  );
  const communityJudgement = findSpeciesHeritagePresetById(
    "species_community_wound_fear_of_judgement",
  );
  const communityDefence = findSpeciesHeritagePresetById(
    "species_community_method_public_defence",
  );
  const communityNeighboursTrope = findSpeciesHeritagePresetById(
    "species_community_trope_neighbours_to_lovers",
  );
  const namingChosen = findSpeciesHeritagePresetById(
    "species_naming_culture_preset_the_chosen_name_romantic",
  );
  const namingHonour = findSpeciesHeritagePresetById(
    "species_naming_structure_honour_name",
  );
  const namingHonourFamily = findSpeciesHeritagePresetById(
    "species_naming_motivation_honour_family_name",
  );
  const namingUserCorrect = findSpeciesHeritagePresetById(
    "species_naming_trigger_user_says_name_correctly",
  );
  const namingRecognised = findSpeciesHeritagePresetById(
    "species_naming_trigger_family_name_recognised",
  );
  const namingUserSoftens = findSpeciesHeritagePresetById(
    "species_naming_behaviour_softens_when_user_says_name",
  );
  const namingDeadNameGate = findSpeciesHeritagePresetById(
    "species_naming_gate_dead_name_boundary_gate",
  );
  const namingDeadNameTrope = findSpeciesHeritagePresetById(
    "species_naming_trope_dead_name_boundary",
  );
  const namingChosenDialogue = findSpeciesHeritagePresetById(
    "species_naming_dialogue_seed_that_is_not_the_name_i_chose",
  );
  const loreDialogue = findSpeciesHeritagePresetById(
    "species_lore_hook_dialogue_now_you_know_why_i_was_afraid",
  );
  const android = findSpeciesHeritagePresetById(
    "species_android_lore_escaped_labour_unit",
  );
  const behaviour = findSpeciesHeritagePresetById(
    "species_behaviour_analyses_emotions_logically",
  );
  const dialogue = findSpeciesHeritagePresetById(
    "species_dialogue_my_instincts_recognise_you_before_my_mind_does",
  );

  assert.equal(archetype?.label, "The Vampire Noble");
  assert.equal(physiology?.value, "slow ageing");
  assert.equal(humanBody?.value, "human body");
  assert.equal(stoppedAgeing?.value, "stopped ageing");
  assert.equal(syntheticPreset?.value, "The Synthetic Human");
  assert.equal(
    powerFearPreset?.value,
    "The Body Afraid of Its Own Power",
  );
  assert.equal(hiddenHeir?.value, "hidden heir");
  assert.equal(sacredArtefact?.value, "sacred artefact");
  assert.equal(recognisesTrigger?.value, "enemy recognises character");
  assert.equal(userPastTrigger?.value, "{{user}} asks about past");
  assert.equal(hiddenHeirPreset?.value, "The Hidden Heir");
  assert.equal(halfElf?.value, "Half-Elf");
  assert.equal(honourCulture?.value, "honour culture");
  assert.equal(marginalisedGroup?.value, "marginalised group");
  assert.equal(colonisedHistory?.value, "colonised history");
  assert.equal(traditionLove?.value, "tradition versus love");
  assert.equal(
    identityDialogue?.value,
    "I do not want to be reduced to my bloodline.",
  );
  assert.equal(ethnicityPreset?.value, "The Tradition-versus-Love Character");
  assert.equal(familyHonour?.value, "family honour");
  assert.equal(tokenisation?.value, "cultural tokenisation");
  assert.equal(ethnicityCommunityJudgement?.value, "community judgement");
  assert.equal(ethnicityRomance?.value, "choosing love without erasure");
  assert.equal(
    ethnicityDialogue?.value,
    "I do not want love to mean erasing myself.",
  );
  assert.equal(identityPreset?.value, "The One Becoming Real");
  assert.equal(identityMotivation?.value, "honour family role");
  assert.equal(identityTrigger?.value, "{{user}} asks real name");
  assert.equal(identityBehaviour?.value, "tests {{user}} acceptance");
  assert.equal(identityFlavour?.value, "self protective");
  assert.equal(identityTrope?.value, "known and loved");
  assert.equal(
    identityChosenNameDialogue?.value,
    "That is not the name I chose.",
  );
  assert.equal(ancestryHonour?.value, "honour family");
  assert.equal(ancestryUserFamily?.value, "{{user}} asks about family");
  assert.equal(heritageColonised?.value, "colonised heritage");
  assert.equal(heritageJewellery?.value, "heirloom jewellery");
  assert.equal(languageUserSpeaks?.value, "{{user}} speaks heritage language");
  assert.equal(diasporaModernised?.value, "modernised customs");
  assert.equal(diasporaJudgement?.value, "community judgement");
  assert.equal(diasporaNotePreset?.value, "The Community Judgement Note");
  assert.equal(diasporaNoteJudgement?.value, "community judgement feared");
  assert.equal(diasporaNoteExoticise?.value, "partner does not exoticise");
  assert.equal(diasporaNoteFamily?.value, "choosing self versus family");
  assert.equal(
    diasporaNoteDialogue?.value,
    "Home is not a simple word for me.",
  );
  assert.equal(socialCustomHonour?.value, "The Honour-Bound Beloved");
  assert.equal(socialCustomSeat?.value, "seat of honour");
  assert.equal(socialCustomTrigger?.value, "custom versus love conflict");
  assert.equal(socialCustomWound?.value, "community judgement");
  assert.equal(
    socialCustomDialogue?.value,
    "You honoured my family by remembering.",
  );
  assert.equal(birthplaceHarbour?.value, "The Harbour Child");
  assert.equal(birthplaceCentre?.value, "trade centre");
  assert.equal(birthplaceChildhoodHarbour?.value, "busy harbour");
  assert.equal(cityNeighbourhood?.value, "The Neighbourhood Darling");
  assert.equal(cityTheatre?.value, "theatre district");
  assert.equal(academyHonours?.value, "honours track");
  assert.equal(collegeFavourite?.value, "professor favourite");
  assert.equal(colonyLabour?.value, "labour hierarchy");
  assert.equal(colonyDialogue?.value, "I was born under an artificial sky.");
  assert.equal(villageTraveller?.value, "innkeeper and traveller");
  assert.equal(villageNeighbour?.value, "repairs neighbour roof");
  assert.equal(stationStars?.value, "love under artificial stars");
  assert.equal(courtFavourite?.value, "court favourites");
  assert.equal(courtHonour?.value, "family honour burden");
  assert.equal(courtRomanticised?.value, "romanticised");
  assert.equal(underworldFavour?.value, "favour debt");
  assert.equal(underworldBehaviour?.value, "pays in favours");
  assert.equal(
    underworldDialogue?.value,
    "You should not have followed me here.",
  );
  assert.equal(settingHonour?.value, "honour bound");
  assert.equal(settingCulturePreset?.value, "Honour-Bound Culture");
  assert.equal(settingCultureModernising?.value, "modernising");
  assert.equal(settingCultureHonourLove?.value, "honour versus love");
  assert.equal(settingCultureReputation?.value, "reputation risk romance");
  assert.equal(
    settingCultureDialogue?.value,
    "You honoured my home by remembering.",
  );
  assert.equal(settingAiGovernment?.value, "AI government");
  assert.equal(settingLabour?.value, "corporate labour");
  assert.equal(settingAnalogue?.value, "analogue tradition");
  assert.equal(settingTechnologyPreset?.value, "Android-Integrated Society");
  assert.equal(settingTechnologyAnalogue?.value, "analogue modern");
  assert.equal(settingTechnologyLabour?.value, "golem labour");
  assert.equal(settingTechnologyImpact?.value, "tech replaces labour");
  assert.equal(
    settingTechnologyRomance?.value,
    "surveillance state secret romance",
  );
  assert.equal(
    settingTechnologyDialogue?.value,
    "Your heartbeat is analogue. I like that.",
  );
  assert.equal(settingGovernmentPreset?.value, "AI-Governed City");
  assert.equal(settingGovernmentSeed?.value, "AI government");
  assert.equal(governmentPower?.value, "centralised power");
  assert.equal(governmentRomance?.value, "heir and adviser");
  assert.equal(governmentTrigger?.value, "religious judgement");
  assert.equal(
    governmentDialogue?.value,
    "Then let them learn how loyal treason can be.",
  );
  assert.equal(settingEconomyPreset?.value, "Old-Money Estate");
  assert.equal(settingEconomyLabour?.value, "industrial labour");
  assert.equal(settingEconomyFavour?.value, "favour debt");
  assert.equal(settingEconomyCentre?.value, "financial centre");
  assert.equal(economyImpact?.value, "labour exploitation");
  assert.equal(economyRomance?.value, "shared ration romance");
  assert.equal(
    economyDialogue?.value,
    "I would rather be poor with choice than rich in a cage.",
  );
  assert.equal(settingReligionPreset?.value, "Prophecy-Driven Society");
  assert.equal(settingReligionJudgement?.value, "soul judgement");
  assert.equal(religionImpact?.value, "faith restricts romance");
  assert.equal(religionRomance?.value, "sacred vow versus love");
  assert.equal(religionGate?.value, "love versus dogma gate");
  assert.equal(
    religionDialogue?.value,
    "If loving you is heresy, history can write me guilty.",
  );
  assert.equal(socialStructurePreset?.value, "Noble/Commoner Divide");
  assert.equal(socialStructureAiOwner?.value, "AI owner class");
  assert.equal(socialStructureFavourite?.value, "court favourite status");
  assert.equal(socialStructureMarginalisation?.value, "hybrid marginalisation");
  assert.equal(socialStructureTrigger?.value, "public defence");
  assert.equal(socialStructureWound?.value, "tokenisation wound");
  assert.equal(
    socialStructureDialogue?.value,
    "Then love can be our rebellion.",
  );
  assert.equal(settingThreatPreset?.value, "Life Support Failure");
  assert.equal(settingThreatJudgement?.value, "divine judgement");
  assert.equal(settingThreatHonour?.value, "family honour conflict");
  assert.equal(
    settingThreatRomance?.value,
    "surveillance state secret love",
  );
  assert.equal(
    settingThreatDialogue?.value,
    "You are the one thing I will not surrender.",
  );
  assert.equal(settingRomanceNormPreset?.value, "Soulbond Recognition Culture");
  assert.equal(settingRomanceNormJewellery?.value, "courtship jewellery");
  assert.equal(settingRomanceNormRecognised?.value, "mate bonds recognised");
  assert.equal(
    settingRomanceNormHook?.value,
    "fated mates versus free will",
  );
  assert.equal(settingRomanceNormWound?.value, "family honour burden");
  assert.equal(
    settingRomanceNormDialogue?.value,
    "Then teach me how to honour you properly.",
  );
  assert.equal(settingDailyLifePreset?.value, "City Commute");
  assert.equal(settingDailyLifeNeighbour?.value, "neighbour help");
  assert.equal(settingDailyLifeTakeout?.value, "late night takeout");
  assert.equal(settingDailyLifeHook?.value, "daily routine becomes love");
  assert.equal(
    settingDailyLifeDialogue?.value,
    "The little things are how people become home.",
  );
  assert.equal(settingRecognised?.value, "mate bonds recognised");
  assert.equal(settingStigmatised?.value, "divorce stigmatised");
  assert.equal(settingDialogue?.value, "You honoured my home by remembering.");
  assert.equal(modernNeighbourhood?.value, "Suburban Neighbourhood");
  assert.equal(settlementNeighbourhood?.value, "neighbourhood");
  assert.equal(settlementNeighbours?.value, "neighbours to lovers");
  assert.equal(environmentHarbour?.value, "harbour");
  assert.equal(
    environmentDialogue?.value,
    "Now I think love is what makes it liveable.",
  );
  assert.equal(familyRecognised?.value, "family name recognised");
  assert.equal(familyScapegoat?.value, "family scape goat");
  assert.equal(socialMarginalised?.value, "The Marginalised Romantic");
  assert.equal(socialReputation?.value, "scandalised");
  assert.equal(socialTokenised?.value, "tokenised by group");
  assert.equal(socialRumour?.value, "workplace rumour");
  assert.equal(socialDefence?.value, "public defence");
  assert.equal(communityNeighbour?.value, "The Beloved Neighbour");
  assert.equal(communityNeighbourhood?.value, "The Neighbourhood Fixer");
  assert.equal(communityOrganiser?.value, "The Festival Organiser");
  assert.equal(communityUrban?.value, "urban neighbourhood");
  assert.equal(communityServeNeighbours?.value, "serve neighbours");
  assert.equal(communityRecognised?.value, "family name recognised");
  assert.equal(communityOrganises?.value, "organises events");
  assert.equal(communityJudgement?.value, "fear of judgement");
  assert.equal(communityDefence?.value, "public defence");
  assert.equal(communityNeighboursTrope?.value, "neighbours to lovers");
  assert.equal(namingChosen?.value, "The Chosen Name Romantic");
  assert.equal(namingHonour?.value, "honour name");
  assert.equal(namingHonourFamily?.value, "honour family name");
  assert.equal(namingUserCorrect?.value, "{{user}} says name correctly");
  assert.equal(namingRecognised?.value, "family name recognised");
  assert.equal(namingUserSoftens?.value, "softens when {{user}} says name");
  assert.equal(namingDeadNameGate?.value, "dead name boundary gate");
  assert.equal(namingDeadNameTrope?.value, "dead name boundary");
  assert.equal(namingChosenDialogue?.value, "That is not the name I chose.");
  assert.equal(loreDialogue?.value, "Now you know why I was afraid.");
  assert.equal(android?.value, "escaped labour unit");
  assert.equal(behaviour?.value, "analyses emotions logically");
  assert.equal(dialogue?.value, "My instincts recognise you before my mind does.");

  const readableText = JSON.stringify(
    SPECIES_HERITAGE_PRESETS.map((preset) => ({
      category: preset.category,
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
    })),
  );
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /gifted_human|slow_aging|human_body/i);
  assert.doesNotMatch(readableText, /stopped_aging|escaped_labor/i);
  assert.doesNotMatch(readableText, /hidden_heir|sacred_artifact|bound_to_user/i);
  assert.doesNotMatch(readableText, /user_asks|user_touches|recognizes/i);
  assert.doesNotMatch(readableText, /analyzes_emotions|recognize you/i);
  assert.doesNotMatch(
    readableText,
    /honor_culture|marginalized|colonized|tradition_vs_love/i,
  );
  assert.doesNotMatch(
    readableText,
    /family_honor|cultural_tokenization|community_judgment|choosing_self_vs_family/i,
  );
  assert.doesNotMatch(
    readableText,
    /self_identified|third_culture|cross_cultural|love_vs_identity/i,
  );
  assert.doesNotMatch(
    readableText,
    /identityBehaviors|identityEmotionalFlavors|honor_family_role/i,
  );
  assert.doesNotMatch(
    readableText,
    /user_asks_real_name|lets_user_know|self_protective|known_and_loved/i,
  );
  assert.doesNotMatch(
    readableText,
    /family_honor|family_name_recognized|honors_dead|house_colors/i,
  );
  assert.doesNotMatch(
    readableText,
    /colonized|modernized|community_judgment|workplace_rumor/i,
  );
  assert.doesNotMatch(
    readableText,
    /marginalized|tokenized|scandalized|idolized|public_defense/i,
  );
  assert.doesNotMatch(
    readableText,
    /neighbor|neighborhood|organizer|organizes|fear_of_judgment/i,
  );
  assert.doesNotMatch(
    readableText,
    /honor_name|honor_family_name|user_says_name|family_name_recognized/i,
  );
  assert.doesNotMatch(
    readableText,
    /softens_when_user|dead_name_boundary|name_pronunciation_scene/i,
  );
  assert.doesNotMatch(
    readableText,
    /community_judgment|exoticize|choosing_self_vs_family|love_vs_expectation/i,
  );
  assert.doesNotMatch(
    readableText,
    /seat_of_honor|honor_pressure|community_judgment|custom_vs_love|honored my family/i,
  );
  assert.doesNotMatch(
    readableText,
    /harbor|theater|trade_center|financial_center|labor_|labor hierarchy|honors_track|professor_favorite|neighborly_block|immigrant_neighborhood/i,
  );
  assert.doesNotMatch(
    readableText,
    /traveling_merchant|traveler|neighbor_help|repairs_neighbor|court_favorites|family_honor|romanticized|favor_debt|pays_in_favors/i,
  );
  assert.doesNotMatch(
    readableText,
    /honor_bound|corporate_labor|analog_tradition|mate_bonds_recognized|divorce_stigmatized|honored my home/i,
  );
});

test("compiles species/heritage presets as soft identity and agency guidance", () => {
  const preset = findSpeciesHeritagePresetById("species_trope_shifter_mate_bond");
  assert.ok(preset);

  const summary = compileSpeciesHeritagePresetSummary(preset);
  const additions = compileSpeciesHeritagePresetAdditions(preset);

  assert.match(summary, /Species\/heritage preset: Romance Trope - Shifter Mate Bond/);
  assert.match(additions.relationshipAddition, /informed choice/i);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.match(additions.systemPromptAddition, /refuse bonds/i);
  assert.match(additions.systemPromptAddition, /reject feeding or ritual framing/i);
  assert.match(additions.systemPromptAddition, /choose humanity, monstrosity/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|override/i);
});
