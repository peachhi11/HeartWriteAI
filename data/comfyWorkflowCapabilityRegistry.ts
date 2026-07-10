import {
  IMAGE_PROMPT_VOCAB_PRESETS,
  type ImagePromptVocabPreset,
  type ImagePromptVocabPresetCategory,
} from "./imagePromptVocabPresets";

export type ComfyCapabilityId =
  | "text_to_image"
  | "character_portrait"
  | "reference_sheet"
  | "reference_identity"
  | "pose_control"
  | "image_edit"
  | "style_transfer"
  | "inpaint_outpaint"
  | "upscale_detail"
  | "prompt_enhance"
  | "negative_prompt_guard";

export type ComfyCapabilityLocalFit =
  | "light"
  | "medium"
  | "heavy"
  | "api_or_remote_only";

export type ComfyOutputKind =
  | "image"
  | "character_portrait"
  | "reference_sheet"
  | "image_edit"
  | "prompt_text";

export interface ComfyLocalHardwarePolicy {
  id: string;
  label: string;
  endpoint: string;
  unifiedMemoryGb: number;
  freeStorageGb: number;
  preferredWorkingStorageBudgetGb: number;
  maxSingleModelDownloadGb: number;
  cautionAboveSingleModelDownloadGb: number;
  allowApiWorkflowsByDefault: boolean;
  allowHeavyLocalWorkflowsByDefault: boolean;
  notes: readonly string[];
}

export interface ComfyWorkflowCapability {
  id: ComfyCapabilityId;
  label: string;
  description: string;
  outputKind: ComfyOutputKind;
  localFit: ComfyCapabilityLocalFit;
  seedCategories: readonly ImagePromptVocabPresetCategory[];
  seedTriggers: readonly string[];
  comfyTemplateSignals: {
    tags: readonly string[];
    blueprints: readonly string[];
    nodeTypes: readonly string[];
    modelFamilies: readonly string[];
  };
  routingNotes: readonly string[];
}

export interface ComfyImagePromptRoutingPlanInput {
  selectedImagePresetIds?: readonly string[];
  selectedImagePromptValues?: readonly string[];
  policy?: Partial<ComfyLocalHardwarePolicy>;
}

export interface ComfyCapabilityRecommendation {
  capability: ComfyWorkflowCapability;
  score: number;
  isRecommendedForLocalPolicy: boolean;
  reasons: readonly string[];
}

export interface ComfyImagePromptRoutingPlan {
  policy: ComfyLocalHardwarePolicy;
  selectedPresets: readonly ImagePromptVocabPreset[];
  unresolvedSelections: readonly string[];
  positivePromptAdditions: readonly string[];
  negativePromptAdditions: readonly string[];
  recommendedCapabilities: readonly ComfyCapabilityRecommendation[];
  warnings: readonly string[];
}

export const HEARTWRITE_DEFAULT_COMFY_POLICY = Object.freeze({
  id: "apple_m4_max_36gb_conservative",
  label: "Apple M4 Max 36 GB conservative local policy",
  endpoint: "http://127.0.0.1:8188",
  unifiedMemoryGb: 36,
  freeStorageGb: 450,
  preferredWorkingStorageBudgetGb: 35,
  maxSingleModelDownloadGb: 12,
  cautionAboveSingleModelDownloadGb: 20,
  allowApiWorkflowsByDefault: false,
  allowHeavyLocalWorkflowsByDefault: false,
  notes: [
    "Route image seeds into prompt and capability plans first; do not download model weights automatically.",
    "Prefer lightweight or medium local workflows and mark heavy model families as explicit opt-in.",
    "Treat API-only Comfy templates as remote/proxy candidates, not default desktop workflows.",
  ],
} as const satisfies ComfyLocalHardwarePolicy);

export const COMFY_WORKFLOW_CAPABILITY_REGISTRY = Object.freeze([
  {
    id: "text_to_image",
    label: "Text to Image",
    description:
      "Generate a new image from assembled HeartWrite visual prompt vocabulary.",
    outputKind: "image",
    localFit: "medium",
    seedCategories: [
      "Image Prompt Preset",
      "Art Style",
      "Lighting",
      "Image Mood",
      "Image Quality",
      "Environment Tag",
      "Material & Texture",
    ],
    seedTriggers: [
      "character_card_portrait",
      "romance portrait",
      "concept art",
      "illustration",
      "portrait",
      "scene",
      "background",
    ],
    comfyTemplateSignals: {
      tags: ["Text to Image", "Image"],
      blueprints: ["text_to_image_flux_1_dev", "text_to_image_z_image_turbo"],
      nodeTypes: ["CLIPTextEncode", "KSampler", "VAEDecode", "SaveImage"],
      modelFamilies: ["SDXL", "Flux", "Z-Image", "Qwen Image"],
    },
    routingNotes: [
      "Use as the default route when the selection contains style, lighting, mood, or setting tags.",
      "Keep model family selection separate from seed selection so creator choices do not imply downloads.",
    ],
  },
  {
    id: "character_portrait",
    label: "Character Portrait",
    description:
      "Create a readable single-character portrait suitable for cards, libraries, and profile previews.",
    outputKind: "character_portrait",
    localFit: "medium",
    seedCategories: [
      "Image Prompt Preset",
      "Appearance Tag",
      "Camera Framing",
      "Lighting",
      "Image Quality",
      "High-Value Image Seed",
    ],
    seedTriggers: [
      "character card portrait",
      "solo_character",
      "bust_portrait",
      "close_up",
      "expressive_face",
      "three_quarter_view",
      "professional_character_art",
      "character_card_ready",
    ],
    comfyTemplateSignals: {
      tags: ["Portrait", "Text to Image", "Character Reference"],
      blueprints: ["text_to_image_flux_1_dev"],
      nodeTypes: ["CLIPTextEncode", "KSampler", "VAEDecode", "SaveImage"],
      modelFamilies: ["SDXL", "Flux", "Z-Image"],
    },
    routingNotes: [
      "Prioritise face readability, gaze, lighting, and card-library cropping.",
      "Avoid routing relationship or scenario meaning into the image prompt unless it is represented by explicit visual seeds.",
    ],
  },
  {
    id: "reference_sheet",
    label: "Reference Sheet",
    description:
      "Assemble full-body, outfit, framing, and quality tags into a reusable visual reference output.",
    outputKind: "reference_sheet",
    localFit: "medium",
    seedCategories: [
      "Appearance Tag",
      "Pose",
      "Camera Framing",
      "Art Style",
      "Image Quality",
      "High-Value Image Seed",
    ],
    seedTriggers: [
      "full_body",
      "full body",
      "full_body_shot",
      "character_sheet_style",
      "tailored_outfit",
      "armour details",
      "jewellery details",
      "front_view",
      "profile_view",
    ],
    comfyTemplateSignals: {
      tags: ["Character Reference", "Image", "Text to Image"],
      blueprints: ["text_to_image_flux_1_dev"],
      nodeTypes: ["CLIPTextEncode", "EmptySD3LatentImage", "KSampler"],
      modelFamilies: ["SDXL", "Flux", "Qwen Image"],
    },
    routingNotes: [
      "Best for creator review and card-library consistency, not live chat memory.",
      "Warn if the user combines reference-sheet seeds with close-crop-only framing.",
    ],
  },
  {
    id: "reference_identity",
    label: "Reference Identity",
    description:
      "Use a source portrait or reference image to preserve character identity across later visual outputs.",
    outputKind: "image_edit",
    localFit: "heavy",
    seedCategories: [
      "Appearance Tag",
      "Camera Framing",
      "Pose",
      "Image Quality",
      "High-Value Image Seed",
    ],
    seedTriggers: [
      "reference",
      "identity",
      "same character",
      "expressive_face",
      "full_body",
      "couple_portrait",
      "duplicate_character",
    ],
    comfyTemplateSignals: {
      tags: ["Character Reference", "Reference Image", "Image Edit"],
      blueprints: ["image_edit", "image_face_detection_mediapipe"],
      nodeTypes: ["LoadImage", "CLIPVisionEncode", "IPAdapter", "SaveImage"],
      modelFamilies: ["IP-Adapter", "InstantID", "Qwen Image Edit"],
    },
    routingNotes: [
      "Mark as opt-in on the default local policy because identity workflows often require extra model weights.",
      "Use only when a reference image exists or the creator explicitly requests identity consistency.",
    ],
  },
  {
    id: "pose_control",
    label: "Pose & Composition Control",
    description:
      "Route pose, camera, and body-readable tags toward ControlNet or pose-map style workflows.",
    outputKind: "image",
    localFit: "medium",
    seedCategories: ["Pose", "Camera Framing", "Appearance Tag"],
    seedTriggers: [
      "pose",
      "protective_stance",
      "standing_pose",
      "seated_pose",
      "dance_pose",
      "over_the_shoulder",
      "three_quarter_view",
      "low_angle",
      "high_angle",
    ],
    comfyTemplateSignals: {
      tags: ["ControlNet", "Pose Map", "Depth Map"],
      blueprints: [
        "controlnet_z_image_turbo",
        "image_to_pose_map_sdpose_ood",
        "depth_to_image_z_image_turbo",
      ],
      nodeTypes: ["ControlNetApply", "OpenPose", "DepthAnything", "LoadImage"],
      modelFamilies: ["ControlNet", "SDPose", "Depth Anything"],
    },
    routingNotes: [
      "Useful when selected seeds need physical staging rather than only descriptive prompt text.",
      "Keep pose constraints flexible so the model can preserve accessibility/body alternatives.",
    ],
  },
  {
    id: "image_edit",
    label: "Image Edit",
    description:
      "Modify an existing image using selected style, lighting, setting, or material seeds.",
    outputKind: "image_edit",
    localFit: "heavy",
    seedCategories: [
      "Art Style",
      "Lighting",
      "Material & Texture",
      "Environment Tag",
      "Image Mood",
    ],
    seedTriggers: [
      "edit",
      "relight",
      "replace",
      "change",
      "rain wet surface",
      "glowing runes",
      "neon lighting",
    ],
    comfyTemplateSignals: {
      tags: ["Image Edit", "Relight", "Replacement"],
      blueprints: ["image_edit", "image_edit_flux_2_klein_4b"],
      nodeTypes: ["LoadImage", "InpaintModelConditioning", "SaveImage"],
      modelFamilies: ["Flux Kontext", "Qwen Image Edit", "Z-Image"],
    },
    routingNotes: [
      "Treat as an edit/export route, not as card truth.",
      "Warn before recommending large edit models under the conservative local policy.",
    ],
  },
  {
    id: "style_transfer",
    label: "Style Transfer",
    description:
      "Apply art-style and mood vocabulary to a generated or imported character image.",
    outputKind: "image_edit",
    localFit: "medium",
    seedCategories: ["Art Style", "Image Mood", "Material & Texture"],
    seedTriggers: [
      "style",
      "painterly",
      "anime",
      "visual novel",
      "noir",
      "gothic",
      "watercolour",
      "oil painting",
    ],
    comfyTemplateSignals: {
      tags: ["Style Transfer", "Image Edit"],
      blueprints: ["image_edit", "image_edit_flux_2_klein_4b"],
      nodeTypes: ["CLIPTextEncode", "KSampler", "VAEDecode"],
      modelFamilies: ["SDXL", "Flux", "Qwen Image Edit"],
    },
    routingNotes: [
      "Allow named medium/style lanes, but avoid copying living artists or locked brand styles.",
      "Prefer prompt-level styling before recommending a separate edit model.",
    ],
  },
  {
    id: "inpaint_outpaint",
    label: "Inpaint & Outpaint",
    description:
      "Route repair, background extension, crop correction, or local image changes toward mask-based workflows.",
    outputKind: "image_edit",
    localFit: "medium",
    seedCategories: [
      "Camera Framing",
      "Environment Tag",
      "Negative Prompt",
      "Image Quality",
    ],
    seedTriggers: [
      "inpaint",
      "outpaint",
      "wide_shot",
      "establishing_shot",
      "busy_background",
      "missing_fingers",
      "distorted_hands",
      "awkward_pose",
    ],
    comfyTemplateSignals: {
      tags: ["Inpainting", "Outpainting", "Image Edit"],
      blueprints: ["flux_fill_inpaint_example"],
      nodeTypes: ["LoadImage", "LoadMask", "InpaintModelConditioning"],
      modelFamilies: ["SDXL Inpaint", "Flux Fill"],
    },
    routingNotes: [
      "Best for fixing or extending images after generation.",
      "Never treat negative prompt seeds as character descriptions.",
    ],
  },
  {
    id: "upscale_detail",
    label: "Upscale & Detail",
    description:
      "Improve resolution, face/detail readability, and card-library polish after generation.",
    outputKind: "image",
    localFit: "medium",
    seedCategories: ["Image Quality", "Appearance Tag", "Negative Prompt"],
    seedTriggers: [
      "high_detail",
      "sharp_focus",
      "cinematic_detail",
      "professional_character_art",
      "polished_render",
      "character_card_ready",
      "distorted_face",
      "low_resolution",
      "blurry",
    ],
    comfyTemplateSignals: {
      tags: ["Image Upscale", "Image"],
      blueprints: ["upscale_image", "image_face_detection_mediapipe"],
      nodeTypes: ["UpscaleModelLoader", "ImageScale", "SaveImage"],
      modelFamilies: ["ESRGAN", "Ultimate SD Upscale", "Face Detailer"],
    },
    routingNotes: [
      "Recommend after a base portrait exists, not as the first route.",
      "Keep face/detail correction opt-in when it requires extra node packs or models.",
    ],
  },
  {
    id: "prompt_enhance",
    label: "Prompt Enhance",
    description:
      "Expand selected visual seeds into concise, model-friendly image prompt text.",
    outputKind: "prompt_text",
    localFit: "light",
    seedCategories: [
      "Image Prompt Preset",
      "Appearance Tag",
      "Lighting",
      "Pose",
      "Camera Framing",
      "Art Style",
      "Material & Texture",
      "Environment Tag",
      "Image Mood",
      "Image Quality",
    ],
    seedTriggers: [
      "prompt",
      "visual routing",
      "character_card_portrait",
      "romantic composition",
      "visual_storytelling",
    ],
    comfyTemplateSignals: {
      tags: ["Text Generation", "Prompt"],
      blueprints: ["prompt_enhance"],
      nodeTypes: ["GeminiNode", "LLM"],
      modelFamilies: ["Local LLM", "OpenAI-compatible LLM", "Gemini"],
    },
    routingNotes: [
      "For HeartWrite, prefer local/proxy LLM prompt enhancement over API-only Comfy prompt nodes.",
      "This route should produce concise image prompt text, not new story truth.",
    ],
  },
  {
    id: "negative_prompt_guard",
    label: "Negative Prompt Guard",
    description:
      "Collect rendering artefact suppressors and image-quality negatives into a separate negative prompt lane.",
    outputKind: "prompt_text",
    localFit: "light",
    seedCategories: ["Negative Prompt", "Image Quality"],
    seedTriggers: [
      "negative",
      "blurry",
      "low_resolution",
      "extra_fingers",
      "watermark",
      "random_text",
      "duplicate_character",
      "inconsistent_style",
    ],
    comfyTemplateSignals: {
      tags: ["Negative Prompt", "Quality"],
      blueprints: [],
      nodeTypes: ["CLIPTextEncode"],
      modelFamilies: [],
    },
    routingNotes: [
      "Always keep negative prompt output separate from positive image prompt output.",
      "Negative prompt seeds are quality controls and should not be written back into character traits.",
    ],
  },
] as const satisfies readonly ComfyWorkflowCapability[]);

export function compileComfyImagePromptRoutingPlan(
  input: ComfyImagePromptRoutingPlanInput = {},
): ComfyImagePromptRoutingPlan {
  const policy = {
    ...HEARTWRITE_DEFAULT_COMFY_POLICY,
    ...input.policy,
    notes: input.policy?.notes ?? HEARTWRITE_DEFAULT_COMFY_POLICY.notes,
  };
  const { selectedPresets, unresolvedSelections, routingTextSelections } =
    resolveImagePromptSelections(input);
  const positivePromptAdditions = selectedPresets
    .filter((preset) => preset.category !== "Negative Prompt")
    .map((preset) => preset.value);
  const negativePromptAdditions = selectedPresets
    .filter((preset) => preset.category === "Negative Prompt")
    .map((preset) => preset.value);
  const recommendedCapabilities = COMFY_WORKFLOW_CAPABILITY_REGISTRY
    .map((capability) =>
      scoreComfyCapabilityRecommendation(
        capability,
        selectedPresets,
        routingTextSelections,
        policy,
      ),
    )
    .filter((recommendation) => recommendation.score > 0)
    .sort((first, second) => {
      if (first.isRecommendedForLocalPolicy !== second.isRecommendedForLocalPolicy) {
        return first.isRecommendedForLocalPolicy ? -1 : 1;
      }

      return second.score - first.score;
    });

  return {
    policy,
    selectedPresets,
    unresolvedSelections,
    positivePromptAdditions: Array.from(new Set(positivePromptAdditions)),
    negativePromptAdditions: Array.from(new Set(negativePromptAdditions)),
    recommendedCapabilities,
    warnings: compileComfyRoutingWarnings(policy, recommendedCapabilities),
  };
}

export function getComfyCapabilityById(id: ComfyCapabilityId) {
  return COMFY_WORKFLOW_CAPABILITY_REGISTRY.find(
    (capability) => capability.id === id,
  );
}

function resolveImagePromptSelections(input: ComfyImagePromptRoutingPlanInput) {
  const selections = [
    ...(input.selectedImagePresetIds ?? []),
    ...(input.selectedImagePromptValues ?? []),
  ];
  const selectedPresets: ImagePromptVocabPreset[] = [];
  const unresolvedSelections: string[] = [];

  for (const selection of selections) {
    const normalizedSelection = normalizeComfyRoutingText(selection);
    const preset = IMAGE_PROMPT_VOCAB_PRESETS.find((candidate) =>
      [
        candidate.id,
        candidate.value,
        candidate.label,
        ...candidate.triggerKeys,
      ].some((value) => normalizeComfyRoutingText(value) === normalizedSelection),
    );

    if (preset) {
      selectedPresets.push(preset);
    } else {
      unresolvedSelections.push(selection);
    }
  }

  const seen = new Set<string>();
  return {
    selectedPresets: selectedPresets.filter((preset) => {
      if (seen.has(preset.id)) {
        return false;
      }
      seen.add(preset.id);
      return true;
    }),
    unresolvedSelections,
    routingTextSelections: selections,
  };
}

function scoreComfyCapabilityRecommendation(
  capability: ComfyWorkflowCapability,
  selectedPresets: readonly ImagePromptVocabPreset[],
  routingTextSelections: readonly string[],
  policy: ComfyLocalHardwarePolicy,
): ComfyCapabilityRecommendation {
  const selectedText = selectedPresets
    .flatMap((preset) => [
      preset.id,
      preset.category,
      preset.label,
      preset.value,
      ...preset.triggerKeys,
      ...preset.systemPromptTags,
    ])
    .concat(routingTextSelections)
    .map(normalizeComfyRoutingText)
    .join(" ");
  const reasons: string[] = [];
  let score = 0;

  for (const preset of selectedPresets) {
    if (capability.seedCategories.includes(preset.category)) {
      score += 10;
      reasons.push(`Matches ${preset.category}: ${preset.value}.`);
    }
  }

  for (const trigger of capability.seedTriggers) {
    if (selectedText.includes(normalizeComfyRoutingText(trigger))) {
      score += 25;
      reasons.push(`Triggered by ${trigger}.`);
    }
  }

  if (capability.id === "prompt_enhance" && selectedPresets.length > 0) {
    score += 8;
    reasons.push("Selected visual seeds can be compiled into prompt text.");
  }

  if (capability.id === "negative_prompt_guard") {
    const negativeCount = selectedPresets.filter(
      (preset) => preset.category === "Negative Prompt",
    ).length;
    score += negativeCount * 30;
    if (negativeCount > 0) {
      reasons.push("Negative prompt seeds must stay in a separate guard lane.");
    }
  }

  return {
    capability,
    score,
    isRecommendedForLocalPolicy: isCapabilityAllowedByPolicy(capability, policy),
    reasons: Array.from(new Set(reasons)),
  };
}

function isCapabilityAllowedByPolicy(
  capability: ComfyWorkflowCapability,
  policy: ComfyLocalHardwarePolicy,
) {
  if (capability.localFit === "api_or_remote_only") {
    return policy.allowApiWorkflowsByDefault;
  }

  if (capability.localFit === "heavy") {
    return policy.allowHeavyLocalWorkflowsByDefault;
  }

  return true;
}

function compileComfyRoutingWarnings(
  policy: ComfyLocalHardwarePolicy,
  recommendations: readonly ComfyCapabilityRecommendation[],
) {
  const warnings = [
    `Using ${policy.label}: no Comfy model weights or workflow assets are downloaded automatically.`,
    `Default endpoint is ${policy.endpoint}; remote/proxy endpoints should be user configured.`,
    `Warn before a single model download exceeds ${policy.maxSingleModelDownloadGb} GB, and require explicit confirmation above ${policy.cautionAboveSingleModelDownloadGb} GB.`,
  ];
  const blocked = recommendations.filter(
    (recommendation) => !recommendation.isRecommendedForLocalPolicy,
  );

  if (blocked.length > 0) {
    warnings.push(
      `Some matching capabilities are marked opt-in for this local policy: ${blocked.map((item) => item.capability.label).join(", ")}.`,
    );
  }

  return warnings;
}

function normalizeComfyRoutingText(value: string) {
  return value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[_-]+/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
