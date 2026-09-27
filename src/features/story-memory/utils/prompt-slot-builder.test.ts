import { describe, expect, it } from "vitest";

import { globalPromptStackV1 } from "@/features/story-memory/data/global-prompt-stack";
import type { CorePromptPack } from "@/features/story-memory/types/story-memory";

import {
  buildPlatformPromptSlots,
  formatPromptSlots,
  type PlatformProfile,
  type PromptModuleText,
} from "./prompt-slot-builder";

describe("buildPlatformPromptSlots", () => {
  it("builds exactly Global Prompt and Proxy Prompt slots for JanitorAI", () => {
    const slots = buildPlatformPromptSlots({
      activeCorePack: corePack,
      platform: "JanitorAI",
      platformProfile,
      promptModules: {
        ...emptyPromptModules,
        povGuardrails: "POV: Narrator POV. Do not write {{user}} thoughts, dialogue, consent, or choices.",
        scenarioSetup: "Scenario: {{char}} and {{user}} are trapped in the same stalled lift.",
      },
    });

    expect(slots).toHaveLength(2);
    expect(slots.map((slot) => slot.label)).toEqual(["Global Prompt", "Proxy Prompt"]);
    expect(slots.map((slot) => slot.id)).toEqual([
      "janitorai-global-prompt",
      "janitorai-proxy-prompt",
    ]);
  });

  it("routes global modules to the Global Prompt and proxy modules to the Proxy Prompt", () => {
    const slots = buildPlatformPromptSlots({
      activeCorePack: corePack,
      platform: "JanitorAI",
      platformProfile,
      promptModules: {
        ...emptyPromptModules,
        heatSpice: "Heat label: Spicy. Spice visibility: censored language for exports.",
        latestScene: "Current scene: {{char}} notices {{user}} hiding the envelope.",
        relationshipPressure: "Relationship pressure: mutual suspicion with no easy exit.",
        scenarioSetup: "Scenario: a public party left both of them with leverage.",
        settingFrame: "Setting: a private kitchen doorway after the party.",
        storybookOperationalMode: "StoryBook operational mode.",
        stylePerspectiveLens: "Keep the prose in a close, limited lens.",
      },
    });

    const globalPrompt = slots[0].body;
    const proxyPrompt = slots[1].body;

    expect(globalPrompt).toContain("# GLOBAL PROMPT STACK");
    expect(globalPrompt).toContain("Do not write {{user}}'s dialogue");
    expect(globalPrompt).toContain("## Additional Guideline Diagnostics");
    expect(globalPrompt).toContain("Failure: writing that {{user}} blushes");
    expect(globalPrompt).toContain("Success: erotic action is physically clear");
    expect(globalPrompt).toContain(corePack.base_prompt);
    expect(globalPrompt).toContain("[Selected Core Prompt Pack: Changing Perspectives]");
    expect(globalPrompt).toContain("Heat label: Spicy.");
    expect(globalPrompt).toContain("censored language");
    expect(globalPrompt).toContain("close, limited lens");
    expect(globalPrompt).not.toContain("StoryBook operational mode.");
    expect(globalPrompt).not.toContain("Current scene:");
    expect(globalPrompt).not.toContain("Scenario:");

    expect(proxyPrompt).toContain("StoryBook operational mode.");
    expect(proxyPrompt).toContain("Scenario:");
    expect(proxyPrompt).toContain("Setting:");
    expect(proxyPrompt).toContain("Current scene:");
    expect(proxyPrompt).toContain("Relationship pressure:");
    expect(proxyPrompt).not.toContain("Heat label:");
    expect(proxyPrompt).not.toContain("close, limited lens");
  });

  it("skips empty modules instead of creating blank prompt lines", () => {
    const slots = buildPlatformPromptSlots({
      activeCorePack: corePack,
      platform: "JanitorAI",
      platformProfile,
      promptModules: {
        ...emptyPromptModules,
        activeTags: "   ",
        povGuardrails: "POV guardrail.",
        scenarioSetup: "Scenario: focused setup.",
      },
    });

    expect(slots[0].body).toBe(
      [
        globalPromptStackV1,
        `[Selected Core Prompt Pack: ${corePack.title}]\n${corePack.base_prompt}`,
        "POV guardrail.",
      ].join("\n\n"),
    );
    expect(slots[1].body).toBe(
      [
        "Use this for the active session layer: scenario, setting, continuity branch, current relationship pressure, secrets, and current scene.",
        "",
        "Scenario: focused setup.",
      ].join("\n"),
    );
  });

  it("keeps uncensored spice state in the Global Prompt when selected", () => {
    const slots = buildPlatformPromptSlots({
      activeCorePack: corePack,
      platform: "JanitorAI",
      platformProfile,
      promptModules: {
        ...emptyPromptModules,
        heatSpice:
          "Heat label: Explicit. Spice visibility: uncensored language is allowed where the target platform and story boundaries allow it.",
      },
    });

    expect(slots[0].body).toContain("Heat label: Explicit.");
    expect(slots[0].body).toContain("uncensored language is allowed");
    expect(slots[1].body).toBe("No proxy prompt modules selected.");
  });
});

describe("formatPromptSlots", () => {
  it("wraps JanitorAI slots in labeled export sections", () => {
    const slots = buildPlatformPromptSlots({
      activeCorePack: corePack,
      platform: "JanitorAI",
      platformProfile,
      promptModules: {
        ...emptyPromptModules,
        povGuardrails: "POV guardrail.",
        scenarioSetup: "Scenario: focused setup.",
      },
    });

    expect(formatPromptSlots({ platform: "JanitorAI", platformProfile, slots })).toBe(
      [
        "[JanitorAI Export]",
        platformProfile.generatedFrame,
        "",
        "[Global Prompt]",
        [
          globalPromptStackV1,
          `[Selected Core Prompt Pack: ${corePack.title}]\n${corePack.base_prompt}`,
          "POV guardrail.",
        ].join("\n\n"),
        "",
        "[Proxy Prompt]",
        [
          "Use this for the active session layer: scenario, setting, continuity branch, current relationship pressure, secrets, and current scene.",
          "",
          "Scenario: focused setup.",
        ].join("\n"),
      ].join("\n"),
    );
  });
});

const corePack: CorePromptPack = {
  base_prompt: "Core relationship pressure prompt.",
  category: "Changing Perspectives",
  compatible_tag_slugs: ["enemies-to-lovers"],
  created_at: "2026-09-25T00:00:00.000Z",
  default_platform_targets: ["JanitorAI"],
  description: "Tests shifting emotional read.",
  id: "core-changing-perspectives",
  slug: "changing-perspectives",
  title: "Changing Perspectives",
  updated_at: "2026-09-25T00:00:00.000Z",
};

const platformProfile: PlatformProfile = {
  builderNote: "JanitorAI first.",
  generatedFrame: "V1 build target Global Prompt Proxy Prompt",
  includedSections: ["Global Prompt", "Proxy Prompt"],
  promptAreas: ["Global Prompt", "Proxy Prompt"],
  stackStatus: "Ready",
};

const emptyPromptModules: PromptModuleText = {
  activeSecrets: "",
  activeTags: "",
  chapterArc: "",
  continuityBranch: "",
  heatSpice: "",
  latestScene: "",
  povGuardrails: "",
  relationshipPressure: "",
  scenarioSetup: "",
  settingFrame: "",
  storybookOperationalMode: "",
  styleDialogueVoice: "",
  stylePerspectiveLens: "",
  styleRhythmDensity: "",
  styleSubtextEmotion: "",
  styleToneSensory: "",
};
