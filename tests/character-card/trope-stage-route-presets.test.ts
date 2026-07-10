import assert from "node:assert/strict";
import test from "node:test";

import {
  TROPE_STAGE_ROUTE_TEMPLATES,
  TROPE_STAGE_ROUTE_VOCABULARY_STANDARD_SEEDS,
  compileTropeStageRouteGuidance,
  getTropeStageRouteById,
  getTropeStageRouteStep,
  matchTropeStageRouteForSeeds,
  romanceStructuralBeats,
  tropeStageRoutePromptControls,
} from "../../data/tropeStageRoutePresets";
import { findSemanticSeedGraphNodeById } from "../../data/semanticSeedRegistry";
import {
  getRichStandardVocabularySeedsBySource,
  searchStandardVocabularySeeds,
} from "../../data/standardVocabularySeedRegistry";

test("stores five-stage trope route templates with prompt controls", () => {
  const enemies = getTropeStageRouteById("enemies_to_lovers_stage_route");
  const generic = getTropeStageRouteById("generic_relationship_story_stages");

  assert.equal(TROPE_STAGE_ROUTE_TEMPLATES.length, 4);
  assert.equal(generic?.routeStages.length, 5);
  assert.equal(enemies?.routeStages.length, 5);
  assert.equal(enemies?.routeStages[0]?.stageLabel, "Genuine Antagonism");
  assert.equal(enemies?.routeStages[4]?.stageLabel, "Fiercely Protective Devotion");
  assert.equal(
    tropeStageRoutePromptControls.some((control) =>
      control.includes("Do not jump to the final stage"),
    ),
    true,
  );
});

test("links trope route stages to generic relationship states and canonical beat roles", () => {
  const friendsStageTwo = getTropeStageRouteStep("friends_to_lovers_stage_route", 2);
  const grumpyStageThree = getTropeStageRouteStep("grumpy_sunshine_stage_route", 3);

  assert.equal(friendsStageTwo?.stageLabel, "Awakening");
  assert.deepEqual(friendsStageTwo?.genericStageLinks, [
    "unspoken_attraction",
    "mutual_longing",
  ]);
  assert.deepEqual(friendsStageTwo?.canonicalBeatRoles, [
    "threshold_choice",
    "complication",
  ]);
  assert.equal(
    grumpyStageThree?.behaviorModifiers.includes("Cares before naming care"),
    true,
  );
  assert.equal(
    grumpyStageThree?.genericStageLinks.includes("unspoken_attraction"),
    true,
  );
});

test("captures common romance structural beats for route matching", () => {
  const meetCute = romanceStructuralBeats.find(
    (beat) => beat.seed === "meet_cute_meet_ugly_meet_crazy",
  );
  const hea = romanceStructuralBeats.find(
    (beat) => beat.seed === "hea_hfn_resolution",
  );

  assert.equal(romanceStructuralBeats.length, 8);
  assert.equal(meetCute?.canonicalBeatRole, "inciting_trigger");
  assert.equal(hea?.canonicalBeatRole, "new_equilibrium");
  assert.match(hea?.description ?? "", /optimistic future/i);
});

test("matches route templates from selected trope seeds", () => {
  const enemies = matchTropeStageRouteForSeeds(["forced_alliance"]);
  const friends = matchTropeStageRouteForSeeds(["mutual_pining"]);
  const fallback = matchTropeStageRouteForSeeds(["unmapped_custom_trope"]);

  assert.equal(enemies.id, "enemies_to_lovers_stage_route");
  assert.equal(friends.id, "friends_to_lovers_stage_route");
  assert.equal(fallback.id, "generic_relationship_story_stages");
});

test("compiles concise active-stage guidance without forcing final-stage intimacy", () => {
  const route = getTropeStageRouteById("grumpy_sunshine_stage_route");
  assert.ok(route);

  const stageOneGuidance = compileTropeStageRouteGuidance(route, 1);

  assert.match(stageOneGuidance, /Stage 1: Stoic Resistance/);
  assert.match(stageOneGuidance, /Advance only after: consistent showing up/);
  assert.doesNotMatch(stageOneGuidance, /Stage 5: The Embers/);
  assert.match(stageOneGuidance, /Do not jump to the final stage/);
});

test("projects trope stage routes into vocabulary search and semantic graph nodes", () => {
  const seeds = getRichStandardVocabularySeedsBySource(
    "trope-stage-route-vocabulary",
  );
  const searchResults = searchStandardVocabularySeeds("cracked armour", {
    sourceIds: ["trope-stage-route-vocabulary"],
    limit: 5,
  });
  const graphNode = findSemanticSeedGraphNodeById(
    "trope-stage-route-vocabulary:grumpy_sunshine_stage_route",
  );

  assert.equal(seeds.length, TROPE_STAGE_ROUTE_VOCABULARY_STANDARD_SEEDS.length);
  assert.equal(searchResults[0]?.label, "Grumpy x Sunshine Stage Route");
  assert.equal(graphNode?.category, "routes");
  assert.equal(graphNode?.label, "Grumpy x Sunshine Stage Route");
});
