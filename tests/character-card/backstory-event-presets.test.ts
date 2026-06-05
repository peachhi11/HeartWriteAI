import assert from "node:assert/strict";
import test from "node:test";

import {
  BACKSTORY_EVENT_PRESET_CATEGORIES,
  BACKSTORY_EVENT_PRESETS,
  achievementSeeds,
  adventureSeeds,
  apprenticeshipSeeds,
  backstoryDialogueSeeds,
  backstoryEventGates,
  backstoryEventPresets,
  backstoryEventSeeds,
  backstoryRomanceHooks,
  careerEventSeeds,
  compileBackstoryEventPresetAdditions,
  educationSeeds,
  findBackstoryEventPresetById,
  firstLoveSeeds,
  foundFamilySeeds,
  getBackstoryEventPresetsByCategory,
  highValueBackstorySeeds,
  migrationSeeds,
  publicFailureSeeds,
  turningPointSeeds,
} from "../../data/backstoryEventPresets";

test("loads backstory event presets across life event, achievement, failure, travel, and romance lanes", () => {
  assert.equal(BACKSTORY_EVENT_PRESETS.length, 312);
  assert.deepEqual(BACKSTORY_EVENT_PRESET_CATEGORIES, [
    "Achievement",
    "Adventure & Exploration",
    "Apprenticeship & Mentorship",
    "Archetype",
    "Backstory Seed",
    "Career & Status Event",
    "Dialogue Seed",
    "Education & Training",
    "First Love & Relationships",
    "Found Family Formation",
    "Gate",
    "High-Value Seed",
    "Migration & Travel",
    "Public Failure & Humiliation",
    "Romance Hook",
    "Turning Point",
  ]);

  const ids = BACKSTORY_EVENT_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(backstoryEventPresets.length, 20);
  assert.equal(backstoryEventSeeds.length, 20);
  assert.equal(achievementSeeds.length, 30);
  assert.equal(turningPointSeeds.length, 20);
  assert.equal(migrationSeeds.length, 20);
  assert.equal(educationSeeds.length, 20);
  assert.equal(apprenticeshipSeeds.length, 20);
  assert.equal(firstLoveSeeds.length, 20);
  assert.equal(publicFailureSeeds.length, 20);
  assert.equal(foundFamilySeeds.length, 20);
  assert.equal(careerEventSeeds.length, 20);
  assert.equal(adventureSeeds.length, 20);
  assert.equal(backstoryRomanceHooks.length, 15);
  assert.equal(backstoryEventGates.length, 15);
  assert.equal(backstoryDialogueSeeds.length, 12);
  assert.equal(highValueBackstorySeeds.length, 20);
  assert.equal(getBackstoryEventPresetsByCategory("Achievement").length, 30);
  assert.equal(getBackstoryEventPresetsByCategory("First Love & Relationships").length, 20);
  assert.equal(getBackstoryEventPresetsByCategory("Dialogue Seed").length, 12);
});

test("normalises backstory event values for visible prompt text", () => {
  const organisation = findBackstoryEventPresetById(
    "backstory_event_achievement_founded_organisation",
  );
  const honour = findBackstoryEventPresetById(
    "backstory_event_achievement_public_honour",
  );
  const dishonourable = findBackstoryEventPresetById(
    "backstory_event_public_failure_dishonourable_discharge",
  );
  const recogniseDialogue = findBackstoryEventPresetById(
    "backstory_event_dialogue_no_people_helped_i_was_just_lucky_enough_to_recognise_them",
  );
  const visibleText = BACKSTORY_EVENT_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(organisation?.value, "founded organisation");
  assert.equal(honour?.value, "public honour");
  assert.equal(dishonourable?.value, "dishonourable discharge");
  assert.equal(
    recogniseDialogue?.value,
    "No. People helped. I was just lucky enough to recognise them.",
  );
  assert.equal(
    recogniseDialogue?.triggerKeys.includes(
      "No. People helped. I was just lucky enough to recognize them.",
    ),
    true,
  );
  assert.doesNotMatch(
    visibleText,
    /\borganization\b|\bhonor\b|\bdishonorable\b|\brecognize\b|\brecognized\b/i,
  );
});

test("finds high-signal backstory event seeds by stable ids", () => {
  assert.equal(
    findBackstoryEventPresetById("backstory_event_seed_turning_point")?.value,
    "turning point",
  );
  assert.equal(
    findBackstoryEventPresetById("backstory_event_migration_new_home_found")?.value,
    "new home found",
  );
  assert.equal(
    findBackstoryEventPresetById("backstory_event_apprenticeship_surpassed_mentor")
      ?.value,
    "surpassed mentor",
  );
  assert.equal(
    findBackstoryEventPresetById("backstory_event_first_love_first_heartbreak")?.value,
    "first heartbreak",
  );
  assert.equal(
    findBackstoryEventPresetById("backstory_event_found_family_home_found_in_people")
      ?.value,
    "home found in people",
  );
  assert.equal(
    findBackstoryEventPresetById("backstory_event_gate_past_meets_present_gate")?.value,
    "past meets present gate",
  );
  assert.equal(
    findBackstoryEventPresetById("backstory_event_high_value_new_chapter_route")?.value,
    "new chapter route",
  );
});

test("compiles backstory event presets as soft life-history context", () => {
  const preset = findBackstoryEventPresetById(
    "backstory_event_romance_partner_helps_rewrite_story",
  );
  assert.ok(preset);

  const additions = compileBackstoryEventPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Backstory event context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft backstory event context/i);
  assert.match(additions.systemPromptAddition, /memory, stakes, identity, and choice/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} autonomy intact/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps first love and childhood memories age-appropriate and non-explicit", () => {
  const childhoodSweetheart = findBackstoryEventPresetById(
    "backstory_event_first_love_childhood_sweetheart",
  );
  const schoolRomance = findBackstoryEventPresetById(
    "backstory_event_first_love_school_romance",
  );
  const firstLoveHook = findBackstoryEventPresetById(
    "backstory_event_romance_first_love_still_matters",
  );
  assert.ok(childhoodSweetheart);
  assert.ok(schoolRomance);
  assert.ok(firstLoveHook);

  assert.match(childhoodSweetheart.guidance, /age-appropriate, non-explicit/i);
  assert.match(schoolRomance.guidance, /Do not sexualise minors/i);
  assert.match(firstLoveHook.guidance, /adult present-day relationships/i);

  const additions = compileBackstoryEventPresetAdditions(childhoodSweetheart);
  assert.match(
    additions.systemPromptAddition,
    /do not sexualise minors, school-aged characters, childhood memories, or early romance memories/i,
  );
});
