import assert from "node:assert/strict";
import test from "node:test";

import {
  STORY_STRUCTURE_ARC_MATCH_STANDARD_SEEDS,
  STORY_STRUCTURE_LENSES,
  canonicalStoryBeatRoles,
  compileStoryStructureMatchGuidance,
  getStoryStructureLensById,
  matchStoryStructureArc,
  storyStructureArcPrinciples,
} from "../../data/storyStructureArcMatchPresets";
import { findSemanticSeedGraphNodeById } from "../../data/semanticSeedRegistry";
import {
  getRichStandardVocabularySeedsBySource,
  searchStandardVocabularySeeds,
} from "../../data/standardVocabularySeedRegistry";

test("defines canonical beat roles for cross-framework story matching", () => {
  assert.deepEqual(canonicalStoryBeatRoles, [
    "setup",
    "inciting_trigger",
    "threshold_choice",
    "complication",
    "midpoint_reversal",
    "escalation",
    "crisis",
    "climax",
    "resolution",
    "new_equilibrium",
  ]);
  assert.equal(
    storyStructureArcPrinciples.includes(
      "Framework-specific beat names should compile into canonical internal beat roles before reaching the runtime.",
    ),
    true,
  );
});

test("stores modern story structure lenses without forcing one template", () => {
  const romance = getStoryStructureLensById("romance_route_structure");
  const kishotenketsu = getStoryStructureLensById("kishotenketsu_structure");
  const heroJourney = getStoryStructureLensById("hero_journey_structure");

  assert.equal(STORY_STRUCTURE_LENSES.length, 10);
  assert.equal(romance?.pacingProfile, "romance_route");
  assert.equal(
    romance?.beatAliases.find((beat) => beat.role === "midpoint_reversal")
      ?.aliases.includes("fake to real"),
    true,
  );
  assert.equal(
    (kishotenketsu?.bestForSignals as readonly string[] | undefined)?.includes(
      "quiet_slice_of_life",
    ),
    true,
  );
  assert.equal(
    heroJourney?.caution.includes("modernize role language"),
    true,
  );
  for (const lens of STORY_STRUCTURE_LENSES) {
    assert.deepEqual(
      lens.beatAliases.map((beat) => beat.role),
      canonicalStoryBeatRoles,
    );
  }
});

test("matches romance stories to relationship-first structure and external plots to linear spines", () => {
  const romanceMatches = matchStoryStructureArc({
    storySignals: [
      "relationship_progression",
      "romance_slow_burn",
      "internal_growth",
    ],
    desiredPacing: "slow",
    hasRelationshipRoute: true,
  });
  const adventureMatches = matchStoryStructureArc({
    storySignals: ["external_adventure", "high_concept_premise"],
    hasExternalPlot: true,
  });

  assert.equal(romanceMatches[0]?.lens.id, "romance_route_structure");
  assert.match(romanceMatches[0]?.compactGuidance ?? "", /canonical beat roles/i);
  assert.equal(adventureMatches[0]?.lens.pacingProfile, "linear");
  assert.equal(
    adventureMatches.some((match) => match.lens.id === "three_act_structure"),
    true,
  );
});

test("selects contrast and investigation structures for quieter or research-led stories", () => {
  const quietMatches = matchStoryStructureArc({
    storySignals: ["quiet_slice_of_life", "internal_growth", "twist_based"],
    needsLowConflictStructure: true,
  });
  const mysteryMatches = matchStoryStructureArc({
    storySignals: ["mystery_research", "internal_growth"],
  });

  assert.equal(quietMatches[0]?.lens.id, "kishotenketsu_structure");
  assert.equal(mysteryMatches[0]?.lens.id, "scientific_method_structure");
  assert.match(
    compileStoryStructureMatchGuidance(mysteryMatches[0].lens),
    /problem-testing beats|canonical beat roles/i,
  );
});

test("projects story structure lenses into vocabulary search and semantic graph nodes", () => {
  const seeds = getRichStandardVocabularySeedsBySource(
    "story-structure-arc-match-vocabulary",
  );
  const searchResults = searchStandardVocabularySeeds("fake to real", {
    sourceIds: ["story-structure-arc-match-vocabulary"],
    limit: 5,
  });
  const graphNode = findSemanticSeedGraphNodeById(
    "story-structure-arc-match-vocabulary:romance_route_structure",
  );

  assert.equal(seeds.length, STORY_STRUCTURE_ARC_MATCH_STANDARD_SEEDS.length);
  assert.equal(searchResults[0]?.label, "Romance Route Structure");
  assert.equal(graphNode?.category, "routes");
  assert.equal(graphNode?.label, "Romance Route Structure");
});
