import type { CorePromptPack } from "@/features/story-memory/types/story-memory";

export type PlatformProfile = {
  builderNote: string;
  generatedFrame: string;
  includedSections: string[];
  promptAreas: string[];
  stackStatus: string;
};

export type PromptModuleKey =
  | "activeTags"
  | "activeSecrets"
  | "chapterArc"
  | "continuityBranch"
  | "heatSpice"
  | "latestScene"
  | "povGuardrails"
  | "relationshipPressure"
  | "scenarioSetup"
  | "settingFrame"
  | "styleDialogueVoice"
  | "stylePerspectiveLens"
  | "styleRhythmDensity"
  | "styleSubtextEmotion"
  | "styleToneSensory";

export type PromptModuleText = Record<PromptModuleKey, string>;

export type PromptSlot = {
  body: string;
  helper: string;
  id: string;
  label: string;
};

export function buildPlatformPromptSlots({
  activeCorePack,
  platform,
  platformProfile,
  promptModules,
}: {
  activeCorePack: CorePromptPack;
  platform: string;
  platformProfile: PlatformProfile;
  promptModules: PromptModuleText;
}): PromptSlot[] {
  const globalLines = compactLines([
    promptModules.povGuardrails,
    promptModules.stylePerspectiveLens,
    promptModules.styleRhythmDensity,
    promptModules.styleToneSensory,
    promptModules.styleDialogueVoice,
    promptModules.styleSubtextEmotion,
    promptModules.heatSpice,
    promptModules.activeTags,
  ]);
  const proxyLines = compactLines([
    promptModules.scenarioSetup,
    promptModules.settingFrame,
    promptModules.continuityBranch,
    promptModules.chapterArc,
    promptModules.relationshipPressure,
    promptModules.activeSecrets,
    promptModules.latestScene,
  ]);
  const currentStoryInputs = compactLines([...globalLines, ...proxyLines]);
  const currentStoryInputText = currentStoryInputs.length
    ? currentStoryInputs.join("\n")
    : "No current story inputs selected.";

  if (platform === "SillyTavern") {
    return [
      {
        id: "sillytavern-stack-map",
        label: "SillyTavern Stack Map",
        helper: "Planning map for the larger SillyTavern prompt stack.",
        body: [
          platformProfile.generatedFrame,
          "",
          "[Core Prompt Source]",
          activeCorePack.base_prompt,
          "",
          "[Prompt Areas To Configure]",
          platformProfile.promptAreas.map((area) => `- ${area}`).join("\n"),
          "",
          "[Current Story Inputs]",
          currentStoryInputText,
        ].join("\n"),
      },
    ];
  }

  if (platform === "MarinaraTavern") {
    return [
      {
        id: "marinaratavern-agentic-stack-map",
        label: "MarinaraTavern Agentic Stack Map",
        helper: "Planning map for Marinara's modular prompt and workflow stack.",
        body: [
          "<agentic-stack-map>",
          platformProfile.generatedFrame,
          "</agentic-stack-map>",
          "",
          "<core-prompt-source>",
          activeCorePack.base_prompt,
          "</core-prompt-source>",
          "",
          "<prompt-areas-to-configure>",
          platformProfile.promptAreas.map((area) => `- ${area}`).join("\n"),
          "</prompt-areas-to-configure>",
          "",
          "<current-story-inputs>",
          currentStoryInputText,
          "</current-story-inputs>",
        ].join("\n"),
      },
    ];
  }

  return [
    {
      id: "janitorai-global-prompt",
      label: "Global Prompt",
      helper: "Paste into JanitorAI's global prompt slot.",
      body: [activeCorePack.base_prompt, ...(globalLines.length ? ["", ...globalLines] : [])].join("\n"),
    },
    {
      id: "janitorai-proxy-prompt",
      label: "Proxy Prompt",
      helper: "Paste into JanitorAI's proxy prompt slot for the active session layer.",
      body: proxyLines.length
        ? [
            "Use this for the active session layer: scenario, setting, continuity branch, current relationship pressure, secrets, and current scene.",
            "",
            ...proxyLines,
          ].join("\n")
        : "No proxy prompt modules selected.",
    },
  ];
}

export function formatPromptSlots({
  platform,
  platformProfile,
  slots,
}: {
  platform: string;
  platformProfile: PlatformProfile;
  slots: PromptSlot[];
}) {
  return [
    `[${platform} Export]`,
    platformProfile.generatedFrame,
    "",
    ...slots.flatMap((slot) => [`[${slot.label}]`, slot.body, ""]),
  ]
    .join("\n")
    .trim();
}

function compactLines(lines: string[]) {
  return lines.filter((line) => line.trim().length > 0);
}
