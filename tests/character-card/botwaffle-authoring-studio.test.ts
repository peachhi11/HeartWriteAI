import assert from "node:assert/strict";
import test from "node:test";

import {
  BOTWAFFLE_AUTHORING_STUDIO_LANES,
  BOTWAFFLE_EXPORT_BUNDLE_ITEMS,
  BOTWAFFLE_REPLACEMENT_RULES,
  BOTWAFFLE_SECTION_GENERATION_STEPS,
  compileBotWaffleAuthoringStudioBrief,
  compileBotWaffleReplacementPolicyBrief,
  getBotWaffleAuthoringLane,
  getSectionGenerationStepsForField,
} from "../../data/botWaffleAuthoringStudio";

test("captures the five BotWaffle-inspired authoring lanes", () => {
  assert.deepEqual(
    BOTWAFFLE_AUTHORING_STUDIO_LANES.map((lane) => lane.id),
    [
      "authoring_studio_flow",
      "model_connection_settings",
      "import_export_bundle",
      "section_generation",
      "prompt_template_organization",
    ],
  );

  assert.ok(getBotWaffleAuthoringLane("section_generation"));
  assert.ok(
    BOTWAFFLE_AUTHORING_STUDIO_LANES.every(
      (lane) =>
        lane.currentSurface.length >= 3 &&
        lane.nextActions.length >= 3 &&
        lane.excludedSourcePatterns.length >= 2,
    ),
  );
});

test("keeps section generation mapped to concrete CCV3 and HeartWriteAI targets", () => {
  const targets = new Set(
    BOTWAFFLE_SECTION_GENERATION_STEPS.map((step) => step.targetField),
  );

  const expectedTargets = [
    "description",
    "personality",
    "scenario",
    "first_mes",
    "mes_example",
    "creator_notes",
    "lorebook",
    "image_prompts",
  ] as const;

  for (const target of expectedTargets) {
    assert.equal(targets.has(target), true, `Missing target ${target}`);
  }

  const openerSteps = getSectionGenerationStepsForField("first_mes");
  assert.equal(openerSteps.length, 1);
  assert.match(openerSteps[0]?.outputRule ?? "", /Never write \{\{user\}\}/);
});

test("defines review-first bundle exports without direct overwrite behavior", () => {
  assert.ok(
    BOTWAFFLE_EXPORT_BUNDLE_ITEMS.some((item) => item.id === "manifest"),
  );
  assert.ok(
    BOTWAFFLE_EXPORT_BUNDLE_ITEMS.some((item) => item.id === "import_review"),
  );
  assert.ok(
    BOTWAFFLE_EXPORT_BUNDLE_ITEMS.every(
      (item) => item.pathHint && item.reviewRule.length >= 24,
    ),
  );
  assert.ok(
    BOTWAFFLE_EXPORT_BUNDLE_ITEMS.some((item) =>
      /review warnings/i.test(item.reviewRule),
    ),
  );
});

test("brief excludes unsafe source prompt language while documenting adaptations", () => {
  const brief = compileBotWaffleAuthoringStudioBrief();

  assert.match(brief, /Character authoring studio flow/);
  assert.match(brief, /LM Studio connection and settings UI/);
  assert.match(brief, /Do not import unsafe/);
  assert.doesNotMatch(brief, /no censorship/i);
  assert.doesNotMatch(brief, /no guardrails/i);
});

test("records BotWaffle replacement rules for generation and license risk", () => {
  assert.deepEqual(
    BOTWAFFLE_REPLACEMENT_RULES.map((rule) => rule.id),
    [
      "replace_giant_prompt_calls",
      "replace_no_seed_generation",
      "replace_fragile_qwen_handling",
      "license_quarantine_promptwaffle",
    ],
  );

  assert.ok(
    BOTWAFFLE_REPLACEMENT_RULES.every(
      (rule) => rule.enforcement.length >= 3,
    ),
  );
});

test("replacement policy stays seeded, model-neutral, and PromptWaffle-quarantined", () => {
  const brief = compileBotWaffleReplacementPolicyBrief();

  assert.match(brief, /section-scoped generation/i);
  assert.match(brief, /deterministic seeds/i);
  assert.match(brief, /model-neutral/i);
  assert.match(brief, /AGPL-3\.0/);
  assert.match(brief, /workflow inspiration only/i);
  assert.doesNotMatch(brief, /Qwen-specific handling.*default runtime path/i);
});
