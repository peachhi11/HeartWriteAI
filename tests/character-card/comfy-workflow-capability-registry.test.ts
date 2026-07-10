import assert from "node:assert/strict";
import test from "node:test";

import {
  COMFY_WORKFLOW_CAPABILITY_REGISTRY,
  HEARTWRITE_DEFAULT_COMFY_POLICY,
  compileComfyImagePromptRoutingPlan,
  getComfyCapabilityById,
} from "../../data/comfyWorkflowCapabilityRegistry";

test("defines conservative local Comfy policy for the current Apple desktop target", () => {
  assert.equal(HEARTWRITE_DEFAULT_COMFY_POLICY.unifiedMemoryGb, 36);
  assert.equal(HEARTWRITE_DEFAULT_COMFY_POLICY.freeStorageGb, 450);
  assert.equal(HEARTWRITE_DEFAULT_COMFY_POLICY.endpoint, "http://127.0.0.1:8188");
  assert.equal(HEARTWRITE_DEFAULT_COMFY_POLICY.allowApiWorkflowsByDefault, false);
  assert.equal(
    HEARTWRITE_DEFAULT_COMFY_POLICY.allowHeavyLocalWorkflowsByDefault,
    false,
  );
  assert.equal(HEARTWRITE_DEFAULT_COMFY_POLICY.maxSingleModelDownloadGb, 12);
  assert.match(
    HEARTWRITE_DEFAULT_COMFY_POLICY.notes.join(" "),
    /do not download model weights automatically/i,
  );
});

test("keeps Comfy capability ids unique and queryable", () => {
  const ids = COMFY_WORKFLOW_CAPABILITY_REGISTRY.map(
    (capability) => capability.id,
  );

  assert.equal(new Set(ids).size, ids.length);
  assert.ok(getComfyCapabilityById("character_portrait"));
  assert.ok(getComfyCapabilityById("negative_prompt_guard"));
  assert.equal(getComfyCapabilityById("character_portrait")?.localFit, "medium");
});

test("routes portrait image seeds into positive prompt text and local-friendly capabilities", () => {
  const plan = compileComfyImagePromptRoutingPlan({
    selectedImagePresetIds: [
      "image_prompt_preset_character_card_portrait",
      "image_prompt_appearance_expressive_face",
      "image_prompt_camera_three_quarter_view",
      "image_prompt_lighting_golden_hour",
      "image_prompt_art_style_realistic_concept_art",
      "image_prompt_quality_character_card_ready",
      "image_prompt_negative_duplicate_character",
    ],
  });

  assert.deepEqual(plan.unresolvedSelections, []);
  assert.ok(plan.positivePromptAdditions.includes("Character Card Portrait"));
  assert.ok(plan.positivePromptAdditions.includes("expressive face"));
  assert.ok(plan.positivePromptAdditions.includes("three quarter view"));
  assert.ok(plan.positivePromptAdditions.includes("realistic concept art"));
  assert.deepEqual(plan.negativePromptAdditions, ["duplicate character"]);
  assert.equal(
    plan.recommendedCapabilities[0]?.capability.id,
    "character_portrait",
  );
  assert.ok(
    plan.recommendedCapabilities.some(
      (recommendation) => recommendation.capability.id === "negative_prompt_guard",
    ),
  );
  assert.equal(
    plan.recommendedCapabilities.every(
      (recommendation) =>
        recommendation.capability.localFit !== "api_or_remote_only",
    ),
    true,
  );
  assert.match(plan.warnings.join(" "), /no Comfy model weights/i);
});

test("marks reference identity and image edit as opt-in under conservative local policy", () => {
  const plan = compileComfyImagePromptRoutingPlan({
    selectedImagePromptValues: [
      "full body",
      "couple portrait",
      "same character reference identity",
      "neon lighting",
      "rain wet surface",
    ],
  });
  const referenceIdentity = plan.recommendedCapabilities.find(
    (recommendation) => recommendation.capability.id === "reference_identity",
  );
  const imageEdit = plan.recommendedCapabilities.find(
    (recommendation) => recommendation.capability.id === "image_edit",
  );

  assert.ok(referenceIdentity);
  assert.equal(referenceIdentity.isRecommendedForLocalPolicy, false);
  assert.ok(imageEdit);
  assert.equal(imageEdit.isRecommendedForLocalPolicy, false);
  assert.match(plan.warnings.join(" "), /opt-in/i);
  assert.match(plan.warnings.join(" "), /Reference Identity|Image Edit/);
});

test("can allow heavy local capabilities when the creator opts in", () => {
  const plan = compileComfyImagePromptRoutingPlan({
    selectedImagePromptValues: ["same character reference identity"],
    policy: {
      allowHeavyLocalWorkflowsByDefault: true,
    },
  });
  const referenceIdentity = plan.recommendedCapabilities.find(
    (recommendation) => recommendation.capability.id === "reference_identity",
  );

  assert.ok(referenceIdentity);
  assert.equal(referenceIdentity.isRecommendedForLocalPolicy, true);
});
