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

  assert.deepEqual(
    expandPresetLookupTokens("humor_favorite_jewelry_artifact"),
    [
      "humor_favorite_jewelry_artifact",
      "humor_favorite_jewelry_artefact",
      "humor_favorite_jewellery_artifact",
      "humor_favorite_jewellery_artefact",
      "humor_favourite_jewelry_artifact",
      "humor_favourite_jewelry_artefact",
      "humor_favourite_jewellery_artifact",
      "humor_favourite_jewellery_artefact",
      "humour_favorite_jewelry_artifact",
      "humour_favorite_jewelry_artefact",
      "humour_favorite_jewellery_artifact",
      "humour_favorite_jewellery_artefact",
      "humour_favourite_jewelry_artifact",
      "humour_favourite_jewelry_artefact",
      "humour_favourite_jewellery_artifact",
      "humour_favourite_jewellery_artefact",
    ],
  );

  assert.deepEqual(expandPresetLookupTokens("apologize_for_behavior"), [
    "apologize_for_behavior",
    "apologize_for_behaviour",
    "apologise_for_behavior",
    "apologise_for_behaviour",
  ]);

  assert.deepEqual(expandPresetLookupTokens("theatre_neighbourhood_judgement"), [
    "theatre_neighbourhood_judgement",
    "theatre_neighbourhood_judgment",
    "theatre_neighborhood_judgement",
    "theatre_neighborhood_judgment",
    "theater_neighbourhood_judgement",
    "theater_neighbourhood_judgment",
    "theater_neighborhood_judgement",
    "theater_neighborhood_judgment",
  ]);

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
