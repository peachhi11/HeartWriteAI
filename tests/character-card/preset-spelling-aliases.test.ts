import assert from "node:assert/strict";
import test from "node:test";

import {
  expandPresetLookupTokens,
  normalisePresetLookupToken,
} from "../../lib/character-card/presetSpellingAliases";

test("normalises preset lookup tokens before matching", () => {
  assert.equal(
    normalisePresetLookupToken(" Formal Colour Profile "),
    "formal_colour_profile",
  );
  assert.equal(
    normalisePresetLookupToken("standardise-profile"),
    "standardise_profile",
  );
});

test("expands common UK and US spelling variants for seed lookups", () => {
  assert.deepEqual(expandPresetLookupTokens("profile_colour_standardise"), [
    "profile_colour_standardise",
    "profile_colour_standardize",
    "profile_color_standardise",
    "profile_color_standardize",
  ]);

  assert.deepEqual(
    expandPresetLookupTokens("formal_honorific_usage"),
    ["formal_honorific_usage", "formal_honourific_usage"],
  );

  assert.deepEqual(expandPresetLookupTokens("catalog_sanitize_neutralize"), [
    "catalog_sanitize_neutralize",
    "catalog_sanitize_neutralise",
    "catalog_sanitise_neutralize",
    "catalog_sanitise_neutralise",
    "catalogue_sanitize_neutralize",
    "catalogue_sanitize_neutralise",
    "catalogue_sanitise_neutralize",
    "catalogue_sanitise_neutralise",
  ]);
});
