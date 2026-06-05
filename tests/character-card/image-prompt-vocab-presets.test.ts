import assert from "node:assert/strict";
import test from "node:test";

import {
  IMAGE_PROMPT_VOCAB_PRESET_CATEGORIES,
  IMAGE_PROMPT_VOCAB_PRESETS,
  artStyleSeeds,
  cameraFramingSeeds,
  compileImagePromptVocabPresetAdditions,
  environmentTagSeeds,
  findImagePromptVocabPresetById,
  getImagePromptVocabPresetsByCategory,
  highValueImagePromptSeeds,
  imagePromptMoodSeeds,
  imagePromptQualitySeeds,
  imagePromptVocabPresets,
  lightingSeeds,
  materialTextureSeeds,
  negativePromptSeeds,
  poseSeeds,
  tagStyleAppearanceSeeds,
} from "../../data/imagePromptVocabPresets";

test("loads image prompt vocabulary presets across visual prompt lanes", () => {
  assert.equal(IMAGE_PROMPT_VOCAB_PRESETS.length, 260);
  assert.deepEqual(IMAGE_PROMPT_VOCAB_PRESET_CATEGORIES, [
    "Appearance Tag",
    "Art Style",
    "Camera Framing",
    "Environment Tag",
    "High-Value Image Seed",
    "Image Mood",
    "Image Prompt Preset",
    "Image Quality",
    "Lighting",
    "Material & Texture",
    "Negative Prompt",
    "Pose",
  ]);

  const ids = IMAGE_PROMPT_VOCAB_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(imagePromptVocabPresets.length, 20);
  assert.equal(tagStyleAppearanceSeeds.length, 30);
  assert.equal(lightingSeeds.length, 20);
  assert.equal(poseSeeds.length, 20);
  assert.equal(cameraFramingSeeds.length, 20);
  assert.equal(artStyleSeeds.length, 20);
  assert.equal(materialTextureSeeds.length, 20);
  assert.equal(environmentTagSeeds.length, 30);
  assert.equal(imagePromptMoodSeeds.length, 20);
  assert.equal(imagePromptQualitySeeds.length, 20);
  assert.equal(negativePromptSeeds.length, 20);
  assert.equal(highValueImagePromptSeeds.length, 20);
  assert.equal(getImagePromptVocabPresetsByCategory("Appearance Tag").length, 30);
  assert.equal(getImagePromptVocabPresetsByCategory("Environment Tag").length, 30);
  assert.equal(getImagePromptVocabPresetsByCategory("Negative Prompt").length, 20);
});

test("normalises image prompt values for visible prompt text", () => {
  const cosyPreset = findImagePromptVocabPresetById(
    "image_prompt_preset_cosy_slice_of_life",
  );
  const armour = findImagePromptVocabPresetById("image_prompt_appearance_armour_details");
  const jewellery = findImagePromptVocabPresetById(
    "image_prompt_appearance_jewellery_details",
  );
  const watercolour = findImagePromptVocabPresetById(
    "image_prompt_art_style_watercolour_style",
  );
  const colours = findImagePromptVocabPresetById(
    "image_prompt_quality_rich_colour_palette",
  );
  const centred = findImagePromptVocabPresetById(
    "image_prompt_camera_centred_composition",
  );
  const sciFi = findImagePromptVocabPresetById("image_prompt_mood_sci_fi_isolation");
  const muddyColours = findImagePromptVocabPresetById(
    "image_prompt_negative_muddy_colours",
  );
  const visibleText = IMAGE_PROMPT_VOCAB_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(cosyPreset?.value, "Cosy Slice-of-Life");
  assert.equal(cosyPreset?.triggerKeys.includes("Cozy Slice-of-Life"), true);
  assert.equal(armour?.value, "armour details");
  assert.equal(armour?.triggerKeys.includes("armor_details"), true);
  assert.equal(jewellery?.value, "jewellery details");
  assert.equal(jewellery?.triggerKeys.includes("jewelry_details"), true);
  assert.equal(watercolour?.value, "watercolour style");
  assert.equal(watercolour?.triggerKeys.includes("watercolor_style"), true);
  assert.equal(colours?.value, "rich colour palette");
  assert.equal(centred?.value, "centred composition");
  assert.equal(sciFi?.value, "sci-fi isolation");
  assert.equal(muddyColours?.value, "muddy colours");
  assert.doesNotMatch(
    visibleText,
    /\bcozy\b|\barmor\b|\bjewelry\b|\bwatercolor\b|\bcolors?\b|\bcentered\b|\bsci fi\b/i,
  );
});

test("finds high-signal image prompt seeds by stable ids", () => {
  assert.equal(
    findImagePromptVocabPresetById("image_prompt_preset_character_card_portrait")
      ?.value,
    "Character Card Portrait",
  );
  assert.equal(
    findImagePromptVocabPresetById("image_prompt_appearance_full_body")?.value,
    "full body",
  );
  assert.equal(
    findImagePromptVocabPresetById("image_prompt_lighting_candlelight")?.value,
    "candlelight",
  );
  assert.equal(
    findImagePromptVocabPresetById("image_prompt_pose_almost_touch_pose")?.value,
    "almost touch pose",
  );
  assert.equal(
    findImagePromptVocabPresetById("image_prompt_camera_three_quarter_view")?.value,
    "three quarter view",
  );
  assert.equal(
    findImagePromptVocabPresetById("image_prompt_art_style_realistic_concept_art")
      ?.value,
    "realistic concept art",
  );
  assert.equal(
    findImagePromptVocabPresetById("image_prompt_material_velvet")?.value,
    "velvet",
  );
  assert.equal(
    findImagePromptVocabPresetById("image_prompt_environment_royal_ballroom")?.value,
    "royal ballroom",
  );
  assert.equal(
    findImagePromptVocabPresetById("image_prompt_quality_character_card_ready")?.value,
    "character card ready",
  );
  assert.equal(
    findImagePromptVocabPresetById(
      "image_prompt_high_value_starship_observation_deck",
    )?.value,
    "starship observation deck",
  );
});

test("compiles positive image prompt vocabulary without changing card behaviour", () => {
  const preset = findImagePromptVocabPresetById(
    "image_prompt_environment_starship_observation_deck",
  );
  assert.ok(preset);

  const additions = compileImagePromptVocabPresetAdditions(preset);

  assert.match(additions.imagePromptAddition, /Image prompt vocabulary/);
  assert.match(additions.imagePromptAddition, /starship observation deck/);
  assert.equal(additions.negativePromptAddition, "");
  assert.match(additions.systemPromptAddition, /positive image prompt vocabulary/i);
  assert.match(additions.systemPromptAddition, /visual routing, portrait prompts/i);
  assert.match(additions.systemPromptAddition, /without changing the authored character/i);
  assert.match(additions.systemPromptAddition, /consent-aware, adult-safe/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps negative prompt seeds as quality controls only", () => {
  const preset = findImagePromptVocabPresetById("image_prompt_negative_duplicate_character");
  assert.ok(preset);

  const additions = compileImagePromptVocabPresetAdditions(preset);

  assert.equal(additions.imagePromptAddition, "");
  assert.match(additions.negativePromptAddition, /Negative prompt vocabulary/);
  assert.match(additions.negativePromptAddition, /quality control/i);
  assert.match(additions.negativePromptAddition, /without shaming bodies/i);
  assert.match(additions.systemPromptAddition, /negative image prompt vocabulary/i);
  assert.match(additions.systemPromptAddition, /quality controls, not character traits/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
