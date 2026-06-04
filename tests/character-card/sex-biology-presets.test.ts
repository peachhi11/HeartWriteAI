import assert from "node:assert/strict";
import test from "node:test";

import {
  SEX_BIOLOGY_PRESET_CATEGORIES,
  SEX_BIOLOGY_PRESETS,
  compileSexBiologyPresetAdditions,
  findSexBiologyPresetById,
  getSexBiologyPresetsByCategory,
} from "../../data/sexBiologyPresets";

test("loads sex and biology presets across sex, reproductive, fantasy, sci-fi, social, and lineage lanes", () => {
  assert.equal(SEX_BIOLOGY_PRESETS.length, 191);
  assert.deepEqual(SEX_BIOLOGY_PRESET_CATEGORIES, [
    "Archetype",
    "Biological Classification",
    "Dialogue Seed",
    "Fantasy Biology",
    "High-Value Seed",
    "Lineage",
    "Reproductive Type",
    "Sci-Fi Biology",
    "Sex",
    "Social Context",
  ]);

  const ids = SEX_BIOLOGY_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getSexBiologyPresetsByCategory("Sex").length, 20);
  assert.equal(getSexBiologyPresetsByCategory("Biological Classification").length, 20);
  assert.equal(getSexBiologyPresetsByCategory("Dialogue Seed").length, 11);
  assert.equal(getSexBiologyPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises sex and biology values for visible prompt text", () => {
  const parthenogenetic = findSexBiologyPresetById(
    "sex_biology_archetype_parthenogenetic_species",
  );
  const alienMale = findSexBiologyPresetById(
    "sex_biology_classification_alien_male_analogue",
  );
  const alienFemale = findSexBiologyPresetById(
    "sex_biology_classification_alien_female_analogue",
  );
  const separate = findSexBiologyPresetById(
    "sex_biology_social_context_sex_separate_from_gender",
  );
  const visibleText = SEX_BIOLOGY_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(parthenogenetic?.value, "Parthenogenetic Species");
  assert.equal(alienMale?.value, "alien male analogue");
  assert.equal(alienFemale?.value, "alien female analogue");
  assert.equal(separate?.value, "sex separate from gender");
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|parthenogenic|\banalog\b|sex_unknown|sex_undisclosed|breeding role|force prose|SYSTEM PROTOCOL/i,
  );
});

test("compiles sex and biology presets as soft privacy-aware context", () => {
  const preset = findSexBiologyPresetById(
    "sex_biology_social_context_sex_protected_information",
  );
  assert.ok(preset);

  const additions = compileSexBiologyPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Sex and biology context/);
  assert.match(additions.personalityAddition, /without replacing the character's gender identity/i);
  assert.match(additions.systemPromptAddition, /soft sex and biology context/i);
  assert.match(additions.systemPromptAddition, /biology should never be treated as destiny/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps reproductive and lineage lanes personhood-first", () => {
  const reproduction = findSexBiologyPresetById(
    "sex_biology_reproductive_type_conditional_fertility",
  );
  const lineage = findSexBiologyPresetById(
    "sex_biology_lineage_chosen_family_over_lineage",
  );
  assert.ok(reproduction);
  assert.ok(lineage);

  assert.match(reproduction.guidance, /never treated as the character's whole purpose/i);
  assert.match(lineage.guidance, /chosen family, consent, or self-definition/i);
});
