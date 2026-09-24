import type {
  Character,
  ContinuityMode,
  HeatLevelLabel,
  PovMode,
  RelationshipThread,
  SceneMemory,
  SecretOrReveal,
  SpiceVisibility,
  Story,
} from "@/features/story-memory/types/story-memory";
import type { PromptModuleText } from "@/features/story-memory/utils/prompt-slot-builder";

export type PromptModuleDrafts = Partial<Record<keyof PromptModuleText, string>>;

export const povLabels: Record<PovMode, string> = {
  char_pov: "{{char}} POV",
  user_pov: "{{user}} POV",
  narrator_pov: "Narrator POV",
};

export const continuityModeLabels: Record<ContinuityMode, string> = {
  canon: "Canon",
  alt: "Alt",
};

export function getPromptModuleSuggestions({
  activeRelationship,
  activeScene,
  activeSecret,
  characters,
  heatLevel,
  povMode,
  selectedTagLabels,
  spiceVisibility,
  story,
}: {
  activeRelationship?: RelationshipThread;
  activeScene?: SceneMemory;
  activeSecret?: SecretOrReveal;
  characters: Character[];
  heatLevel: HeatLevelLabel;
  povMode: PovMode;
  selectedTagLabels: string[];
  spiceVisibility: SpiceVisibility;
  story: Story;
}): PromptModuleText {
  const spiceLine =
    spiceVisibility === "censored"
      ? "Spice visibility: censored language for exports."
      : "Spice visibility: uncensored language is allowed where the target platform and story boundaries allow it.";

  return {
    activeTags: selectedTagLabels.length
      ? `Active tags: ${selectedTagLabels.join(", ")}.`
      : "Active tags: none selected.",
    activeSecrets: activeSecret
      ? `Secret policy: ${activeSecret.title ?? "Active secret"} stays ${activeSecret.reveal_status}; known by ${formatNames(activeSecret.who_knows, characters) || "no one listed"}.`
      : "Secret policy: no active secrets selected.",
    chapterArc:
      compactLines([
        activeScene?.chapter_label ? `Chapter: ${withTerminalPunctuation(activeScene.chapter_label)}` : "",
        activeScene?.narrative_arc ? `Arc: ${withTerminalPunctuation(activeScene.narrative_arc)}` : "",
      ]).join(" ") ||
      "Chapter / arc: treat this as the active opener or phase of the larger story. Do not reset the relationship history unless the prompt explicitly marks a new branch.",
    continuityBranch: activeScene
      ? `Continuity: ${continuityModeLabels[activeScene.continuity_mode]}. ${
          activeScene.continuity_mode === "alt"
            ? "Keep branch-specific changes separate from the main canon instead of overwriting established memory."
            : "Treat this as the main continuity unless a later scene explicitly branches into an Alt."
        }`
      : "Continuity: canon by default. If this is marked as an Alt, keep branch-specific changes separate from the main canon instead of overwriting established memory.",
    heatSpice: `Heat label: ${displayLabel(heatLevel)}. ${spiceLine}`,
    latestScene: activeScene ? `Current scene: ${activeScene.summary}` : "Current scene: no active scene memory yet.",
    povGuardrails: `POV: ${povLabels[povMode]}. Do not write {{user}} thoughts, dialogue, consent, or choices.`,
    relationshipPressure: activeRelationship
      ? `Relationship pressure: ${activeRelationship.dynamic_label}. ${activeRelationship.next_pressure_point ?? ""}`.trim()
      : "Relationship pressure: not selected.",
    scenarioSetup: activeScene?.scenario
      ? `Scenario: ${activeScene.scenario}`
      : story.description
        ? `Scenario: ${story.description}`
        : "Scenario: define the setup, situation, or premise the characters are currently caught inside.",
    settingFrame: activeScene?.setting
      ? `Setting: ${activeScene.setting}`
      : activeScene?.location
        ? `Setting: ${activeScene.location}. Use setting as the combined location, world context, and situation frame.`
        : "Setting: define the location, world context, and situational frame around the scene.",
    styleDialogueVoice:
      "Dialogue should carry pressure, avoidance, desire, and character-specific voice. Use interiority sparingly and keep it tied to what the active POV can actually perceive or admit.",
    stylePerspectiveLens:
      "Keep the prose in a close, limited lens. Filter description through the active POV's attention, bias, and emotional stakes instead of using distant omniscient summary.",
    styleRhythmDensity:
      "Use varied sentence and paragraph length. Keep action beats clean, let high-tension moments breathe, and increase description density only when it sharpens mood, attraction, threat, or consequence.",
    styleSubtextEmotion:
      "Let emotions surface through choices, pauses, misdirection, physical tells, and what characters refuse to say. Avoid explaining the whole feeling when behavior can carry it.",
    styleToneSensory:
      "Maintain an intimate, charged atmosphere with concrete sensory details. Prioritize touch, breath, sound, proximity, temperature, texture, and setting details that affect the characters' choices.",
  };
}

export function getPromptModuleValues(
  suggestions: PromptModuleText,
  drafts: PromptModuleDrafts,
): PromptModuleText {
  return {
    activeTags: drafts.activeTags ?? suggestions.activeTags,
    activeSecrets: drafts.activeSecrets ?? suggestions.activeSecrets,
    chapterArc: drafts.chapterArc ?? suggestions.chapterArc,
    continuityBranch: drafts.continuityBranch ?? suggestions.continuityBranch,
    heatSpice: drafts.heatSpice ?? suggestions.heatSpice,
    latestScene: drafts.latestScene ?? suggestions.latestScene,
    povGuardrails: drafts.povGuardrails ?? suggestions.povGuardrails,
    relationshipPressure: drafts.relationshipPressure ?? suggestions.relationshipPressure,
    scenarioSetup: drafts.scenarioSetup ?? suggestions.scenarioSetup,
    settingFrame: drafts.settingFrame ?? suggestions.settingFrame,
    styleDialogueVoice: drafts.styleDialogueVoice ?? suggestions.styleDialogueVoice,
    stylePerspectiveLens: drafts.stylePerspectiveLens ?? suggestions.stylePerspectiveLens,
    styleRhythmDensity: drafts.styleRhythmDensity ?? suggestions.styleRhythmDensity,
    styleSubtextEmotion: drafts.styleSubtextEmotion ?? suggestions.styleSubtextEmotion,
    styleToneSensory: drafts.styleToneSensory ?? suggestions.styleToneSensory,
  };
}

function compactLines(lines: string[]) {
  return lines.filter((line) => line.trim().length > 0);
}

function displayLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatNames(ids: string[], characters: Character[]) {
  return ids
    .map((id) => characters.find((character) => character.id === id)?.name)
    .filter(Boolean)
    .join(", ");
}

function withTerminalPunctuation(text: string) {
  const trimmed = text.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}
