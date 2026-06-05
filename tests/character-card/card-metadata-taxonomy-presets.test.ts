import assert from "node:assert/strict";
import test from "node:test";

import {
  CARD_METADATA_TAXONOMY_PRESET_CATEGORIES,
  CARD_METADATA_TAXONOMY_PRESETS,
  cardMetadataGates,
  cardMetadataTaxonomyPresets,
  chatStyleSeeds,
  compatibilitySeeds,
  compileCardMetadataTaxonomyPresetAdditions,
  contentWarningSeeds,
  discoverabilityTagSeeds,
  findCardMetadataTaxonomyPresetById,
  getCardMetadataTaxonomyPresetsByCategory,
  highValueCardMetadataSeeds,
  relationshipTypeSeeds,
  scenarioTypeSeeds,
} from "../../data/cardMetadataTaxonomyPresets";

test("loads card metadata taxonomy presets across tags, warnings, compatibility, and routing lanes", () => {
  assert.equal(CARD_METADATA_TAXONOMY_PRESETS.length, 183);
  assert.deepEqual(CARD_METADATA_TAXONOMY_PRESET_CATEGORIES, [
    "Card Taxonomy Preset",
    "Chat Style",
    "Compatibility",
    "Content Warning",
    "Discoverability Tag",
    "High-Value Metadata Seed",
    "Metadata Gate",
    "Relationship Type",
    "Scenario Type",
  ]);

  const ids = CARD_METADATA_TAXONOMY_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(cardMetadataTaxonomyPresets.length, 20);
  assert.equal(discoverabilityTagSeeds.length, 30);
  assert.equal(contentWarningSeeds.length, 24);
  assert.equal(compatibilitySeeds.length, 20);
  assert.equal(relationshipTypeSeeds.length, 20);
  assert.equal(chatStyleSeeds.length, 20);
  assert.equal(scenarioTypeSeeds.length, 20);
  assert.equal(cardMetadataGates.length, 9);
  assert.equal(highValueCardMetadataSeeds.length, 20);
  assert.equal(getCardMetadataTaxonomyPresetsByCategory("Discoverability Tag").length, 30);
  assert.equal(getCardMetadataTaxonomyPresetsByCategory("Content Warning").length, 24);
  assert.equal(getCardMetadataTaxonomyPresetsByCategory("Metadata Gate").length, 9);
});

test("normalises card metadata labels for visible prompt text", () => {
  const cosyCard = findCardMetadataTaxonomyPresetById(
    "card_metadata_taxonomy_cosy_slice_of_life_card",
  );
  const sciFi = findCardMetadataTaxonomyPresetById(
    "card_metadata_discoverability_sci_fi",
  );
  const sfw = findCardMetadataTaxonomyPresetById(
    "card_metadata_compatibility_sfw_compatible",
  );
  const npcLed = findCardMetadataTaxonomyPresetById(
    "card_metadata_compatibility_npc_led_compatible",
  );
  const contentWarning = findCardMetadataTaxonomyPresetById(
    "card_metadata_content_warning_cw_dark_romance",
  );
  const cosyChat = findCardMetadataTaxonomyPresetById(
    "card_metadata_chat_style_cosy_domestic",
  );
  const visibleText = CARD_METADATA_TAXONOMY_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(cosyCard?.value, "Cosy Slice-of-Life Card");
  assert.equal(cosyCard?.triggerKeys.includes("Cozy Slice-of-Life Card"), true);
  assert.equal(sciFi?.value, "sci-fi");
  assert.equal(sciFi?.triggerKeys.includes("sci_fi"), true);
  assert.equal(sfw?.value, "SFW compatible");
  assert.equal(npcLed?.value, "NPC led compatible");
  assert.equal(contentWarning?.value, "CW: dark romance");
  assert.equal(contentWarning?.triggerKeys.includes("cw_dark_romance"), true);
  assert.equal(cosyChat?.value, "cosy domestic");
  assert.doesNotMatch(visibleText, /\bcozy\b|\bsci fi\b|\bsfw compatible\b|\bnpc led\b/);
});

test("finds high-signal card metadata seeds by stable ids", () => {
  assert.equal(
    findCardMetadataTaxonomyPresetById("card_metadata_taxonomy_romance_card")?.value,
    "Romance Card",
  );
  assert.equal(
    findCardMetadataTaxonomyPresetById("card_metadata_discoverability_slow_burn")
      ?.value,
    "slow burn",
  );
  assert.equal(
    findCardMetadataTaxonomyPresetById("card_metadata_content_warning_cw_none")?.value,
    "CW: none",
  );
  assert.equal(
    findCardMetadataTaxonomyPresetById(
      "card_metadata_relationship_type_enemies_to_lovers",
    )?.value,
    "enemies to lovers",
  );
  assert.equal(
    findCardMetadataTaxonomyPresetById("card_metadata_chat_style_novelistic_style")
      ?.value,
    "novelistic style",
  );
  assert.equal(
    findCardMetadataTaxonomyPresetById("card_metadata_scenario_type_safehouse")?.value,
    "safehouse",
  );
  assert.equal(
    findCardMetadataTaxonomyPresetById("card_metadata_gate_library_ready_route")?.value,
    "library ready route",
  );
  assert.equal(
    findCardMetadataTaxonomyPresetById(
      "card_metadata_high_value_content_warning_checked_gate",
    )?.value,
    "content warning checked gate",
  );
});

test("compiles card metadata taxonomy as metadata-only context", () => {
  const preset = findCardMetadataTaxonomyPresetById(
    "card_metadata_content_warning_cw_power_imbalance",
  );
  assert.ok(preset);

  const additions = compileCardMetadataTaxonomyPresetAdditions(preset);

  assert.match(additions.creatorNotesAddition, /Card metadata taxonomy/);
  assert.match(additions.metadataAddition, /discoverability, compatibility checks/i);
  assert.match(additions.metadataAddition, /without changing the card's authored character/i);
  assert.match(additions.systemPromptAddition, /card metadata only/i);
  assert.match(additions.systemPromptAddition, /warning review/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} agency/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose/i);
});

test("keeps warnings, compatibility, and gates from overriding live chat safety", () => {
  const warning = findCardMetadataTaxonomyPresetById(
    "card_metadata_content_warning_cw_mature_themes",
  );
  const compatibility = findCardMetadataTaxonomyPresetById(
    "card_metadata_compatibility_fade_to_black_compatible",
  );
  const gate = findCardMetadataTaxonomyPresetById(
    "card_metadata_gate_content_warning_checked_gate",
  );
  assert.ok(warning);
  assert.ok(compatibility);
  assert.ok(gate);

  assert.match(warning.guidance, /safer, accurate, and opt-in/i);
  assert.match(warning.guidance, /without sensationalising distress/i);
  assert.match(compatibility.guidance, /matching player preferences/i);
  assert.match(gate.guidance, /warning review/i);

  const additions = compileCardMetadataTaxonomyPresetAdditions(gate);
  assert.match(
    additions.systemPromptAddition,
    /Do not let tags, warnings, compatibility labels, gates, or scenario labels override/i,
  );
  assert.match(additions.systemPromptAddition, /safety boundaries/i);
});
