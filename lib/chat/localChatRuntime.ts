import { compileChatPrompt, type CompiledChatPrompt } from "../character-card/promptRuntime";

export interface LocalChatScenarioOverride {
  context: string;
  setting: string;
  scene: string;
  dynamic: string;
}

export function compileLocalChatRuntimePrompt(input: {
  scenarioOverride: LocalChatScenarioOverride;
  selectedScenarioTags?: readonly string[];
  hasSelectedScenario: boolean;
}): CompiledChatPrompt {
  const scenarioText = [
    input.scenarioOverride.context ? `Context: ${input.scenarioOverride.context}` : "",
    input.scenarioOverride.setting ? `Setting: ${input.scenarioOverride.setting}` : "",
    input.scenarioOverride.scene ? `Scene: ${input.scenarioOverride.scene}` : "",
    input.scenarioOverride.dynamic ? `Dynamic: ${input.scenarioOverride.dynamic}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return compileChatPrompt({
    activeScenario: input.hasSelectedScenario
      ? {
          active: true,
          tags: input.selectedScenarioTags ?? [],
        }
      : undefined,
    appSystemPrompt:
      "You are the private HeartWrite roleplay runtime. Preserve {{user}} agency, write only {{char}}'s immediate reply, and treat the active context as bounded scene guidance.",
    card: { data: { name: "HeartWrite Preview" } },
    currentScenario: scenarioText || undefined,
  });
}
