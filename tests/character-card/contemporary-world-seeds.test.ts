import assert from "node:assert/strict";
import test from "node:test";

import {
  ContemporaryWorldVocabularySeed,
  contemporaryWorldVocabularySeeds,
  findContemporaryWorldVocabularySeedsByTag,
  getContemporaryWorldVocabularySeed,
} from "../../lib/character-card/contemporaryWorldSeeds";

function requireSeed(slug: string): ContemporaryWorldVocabularySeed {
  const seed = getContemporaryWorldVocabularySeed(slug);

  assert.ok(seed, `Expected contemporary world seed ${slug}`);

  return seed;
}

test("contemporary world vocabulary seeds have unique stable slugs", () => {
  const slugs = contemporaryWorldVocabularySeeds.map((seed) => seed.slug);

  assert.equal(new Set(slugs).size, slugs.length);
  assert.ok(slugs.length >= 10);

  for (const slug of slugs) {
    assert.match(slug, /^[a-z][a-z0-9_]+$/);
  }
});

test("contemporary world vocabulary seeds include routeable prompt material", () => {
  for (const seed of contemporaryWorldVocabularySeeds) {
    assert.ok(seed.label.trim(), seed.slug);
    assert.ok(seed.scope.length >= 2, seed.slug);
    assert.ok(seed.fictionLabels.length >= 2, seed.slug);
    assert.ok(seed.routeTags.length >= 3, seed.slug);
    assert.ok(seed.vocabularySeeds.length >= 10, seed.slug);
    assert.ok(seed.triggerSeeds.length >= 6, seed.slug);
    assert.ok(seed.compilerHints.length >= 2, seed.slug);
    assert.ok(seed.antiPatterns.length >= 2, seed.slug);
  }
});

test("contemporary world vocabulary seeds preserve the source-routing model", () => {
  const locationPressure = requireSeed("location_pressure");
  const worldCadence = requireSeed("world_intrusion_cadence");
  const digitalVisibility = requireSeed("digital_visibility");

  assert.ok(locationPressure.routeTags.includes("proximity_engine"));
  assert.ok(locationPressure.triggerSeeds.includes("someone could hear"));
  assert.match(locationPressure.compilerHints.join(" "), /pressure engines/);

  assert.ok(worldCadence.routeTags.includes("existing_tension"));
  assert.ok(worldCadence.routeTags.includes("ambient_world_presence"));
  assert.match(worldCadence.compilerHints.join(" "), /Activate existing pressure/);
  assert.match(worldCadence.compilerHints.join(" "), /world present as texture/);

  assert.ok(digitalVisibility.scope.includes("memory_book"));
  assert.ok(digitalVisibility.vocabularySeeds.includes("screenshot"));
});

test("contemporary world vocabulary seeds can be selected by backend route tag", () => {
  const resourceSeeds = findContemporaryWorldVocabularySeedsByTag(
    "resource_constraint",
  );
  const privacySeeds = findContemporaryWorldVocabularySeedsByTag(
    "privacy_exposure_risk",
  );

  assert.deepEqual(
    resourceSeeds.map((seed) => seed.slug),
    ["money_housing_class_pressure"],
  );
  assert.deepEqual(
    privacySeeds.map((seed) => seed.slug),
    ["digital_visibility"],
  );
});
