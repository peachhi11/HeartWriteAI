import assert from "node:assert/strict";
import test from "node:test";

import {
  WORLD_LORE_EXPANSION_PRESET_CATEGORIES,
  WORLD_LORE_EXPANSION_PRESETS,
  clothingNormSeeds,
  communicationSystemSeeds,
  compileWorldLoreExpansionPresetAdditions,
  educationSystemSeeds,
  findWorldLoreExpansionPresetById,
  foodCultureSeeds,
  getWorldLoreExpansionPresetsByCategory,
  healthMedicineSeeds,
  highValueWorldLoreSeeds,
  legalSystemSeeds,
  magicSystemSeeds,
  transportSystemSeeds,
  worldLoreConflictSeeds,
  worldLoreExpansionPresets,
  worldLoreSeeds,
} from "../../data/worldLoreExpansionPresets";

test("loads world lore expansion presets across systems, customs, infrastructure, and conflict lanes", () => {
  assert.equal(WORLD_LORE_EXPANSION_PRESETS.length, 335);
  assert.deepEqual(WORLD_LORE_EXPANSION_PRESET_CATEGORIES, [
    "Archetype",
    "Clothing Norm",
    "Education System",
    "Food Culture",
    "Health & Medicine",
    "High-Value Seed",
    "Law & Legal System",
    "Lore Conflict",
    "Magic System",
    "Media & Communication",
    "Transport System",
    "World Lore Seed",
  ]);

  const ids = WORLD_LORE_EXPANSION_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(worldLoreExpansionPresets.length, 20);
  assert.equal(worldLoreSeeds.length, 20);
  assert.equal(magicSystemSeeds.length, 40);
  assert.equal(legalSystemSeeds.length, 38);
  assert.equal(healthMedicineSeeds.length, 28);
  assert.equal(transportSystemSeeds.length, 28);
  assert.equal(communicationSystemSeeds.length, 29);
  assert.equal(educationSystemSeeds.length, 29);
  assert.equal(foodCultureSeeds.length, 31);
  assert.equal(clothingNormSeeds.length, 32);
  assert.equal(worldLoreConflictSeeds.length, 20);
  assert.equal(highValueWorldLoreSeeds.length, 20);
  assert.equal(getWorldLoreExpansionPresetsByCategory("Magic System").length, 40);
  assert.equal(getWorldLoreExpansionPresetsByCategory("Law & Legal System").length, 38);
  assert.equal(getWorldLoreExpansionPresetsByCategory("Media & Communication").length, 29);
});

test("normalises world lore values for visible prompt text", () => {
  const civilisation = findWorldLoreExpansionPresetById(
    "world_lore_archetype_interstellar_civilisation",
  );
  const labour = findWorldLoreExpansionPresetById("world_lore_seed_labour_system");
  const artefact = findWorldLoreExpansionPresetById("world_lore_magic_artefact_magic");
  const centre = findWorldLoreExpansionPresetById(
    "world_lore_health_medical_research_centres",
  );
  const aiAssistants = findWorldLoreExpansionPresetById(
    "world_lore_communication_ai_assistants",
  );
  const specialised = findWorldLoreExpansionPresetById(
    "world_lore_education_specialised_training",
  );
  const colours = findWorldLoreExpansionPresetById(
    "world_lore_clothing_symbolic_colours",
  );
  const visibleText = WORLD_LORE_EXPANSION_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(civilisation?.value, "Interstellar Civilisation");
  assert.equal(labour?.value, "labour system");
  assert.equal(labour?.triggerKeys.includes("labor_system"), true);
  assert.equal(artefact?.value, "artefact magic");
  assert.equal(artefact?.triggerKeys.includes("artifact_magic"), true);
  assert.equal(centre?.value, "medical research centres");
  assert.equal(aiAssistants?.value, "AI assistants");
  assert.equal(specialised?.value, "specialised training");
  assert.equal(colours?.value, "symbolic colours");
  assert.doesNotMatch(
    visibleText,
    /\bartifact\b|\blabor\b|\bcenters?\b|\bcolors?\b|\bspecialized\b|\bcivilization\b/i,
  );
});

test("finds high-signal world lore seeds by stable ids", () => {
  assert.equal(
    findWorldLoreExpansionPresetById("world_lore_magic_hard_magic_system")?.value,
    "hard magic system",
  );
  assert.equal(
    findWorldLoreExpansionPresetById("world_lore_magic_bloodline_magic")?.value,
    "bloodline magic",
  );
  assert.equal(
    findWorldLoreExpansionPresetById("world_lore_legal_restorative_justice")?.value,
    "restorative justice",
  );
  assert.equal(
    findWorldLoreExpansionPresetById("world_lore_health_universal_healthcare")?.value,
    "universal healthcare",
  );
  assert.equal(
    findWorldLoreExpansionPresetById("world_lore_transport_teleportation_network")
      ?.value,
    "teleportation network",
  );
  assert.equal(
    findWorldLoreExpansionPresetById("world_lore_food_street_food_culture")?.value,
    "street food culture",
  );
  assert.equal(
    findWorldLoreExpansionPresetById("world_lore_conflict_tradition_vs_progress")
      ?.value,
    "tradition vs progress",
  );
  assert.equal(
    findWorldLoreExpansionPresetById("world_lore_high_value_class_conflict")?.value,
    "class conflict",
  );
});

test("compiles world lore expansion presets as soft setting context", () => {
  const preset = findWorldLoreExpansionPresetById(
    "world_lore_conflict_public_good_vs_private_power",
  );
  assert.ok(preset);

  const additions = compileWorldLoreExpansionPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /World lore context/);
  assert.match(additions.scenarioAddition, /without replacing character agency/i);
  assert.match(additions.systemPromptAddition, /soft world lore context/i);
  assert.match(additions.systemPromptAddition, /setting pressure only when relevant/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} agency/i);
  assert.match(additions.systemPromptAddition, /avoid infodumps/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("frames legal and health systems as fictional worldbuilding only", () => {
  const legal = findWorldLoreExpansionPresetById("world_lore_legal_common_law");
  const health = findWorldLoreExpansionPresetById(
    "world_lore_health_universal_healthcare",
  );
  const surveillance = findWorldLoreExpansionPresetById(
    "world_lore_legal_surveillance_state",
  );
  assert.ok(legal);
  assert.ok(health);
  assert.ok(surveillance);

  assert.match(legal.guidance, /not real legal advice/i);
  assert.match(legal.guidance, /without endorsing any system/i);
  assert.match(health.guidance, /not real medical advice/i);

  const additions = compileWorldLoreExpansionPresetAdditions(surveillance);
  assert.match(
    additions.systemPromptAddition,
    /do not treat fictional law, medicine, politics, scarcity, surveillance, or inequality as real-world advice or endorsement/i,
  );
});
