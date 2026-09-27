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
    storybookOperationalMode: buildStoryBookOperationalMode({
      activeRelationship,
      activeScene,
      activeSecret,
      heatLevel,
      spiceVisibility,
      story,
    }),
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
    storybookOperationalMode: drafts.storybookOperationalMode ?? suggestions.storybookOperationalMode,
    styleDialogueVoice: drafts.styleDialogueVoice ?? suggestions.styleDialogueVoice,
    stylePerspectiveLens: drafts.stylePerspectiveLens ?? suggestions.stylePerspectiveLens,
    styleRhythmDensity: drafts.styleRhythmDensity ?? suggestions.styleRhythmDensity,
    styleSubtextEmotion: drafts.styleSubtextEmotion ?? suggestions.styleSubtextEmotion,
    styleToneSensory: drafts.styleToneSensory ?? suggestions.styleToneSensory,
  };
}

function buildStoryBookOperationalMode({
  activeRelationship,
  activeScene,
  activeSecret,
  heatLevel,
  spiceVisibility,
  story,
}: {
  activeRelationship?: RelationshipThread;
  activeScene?: SceneMemory;
  activeSecret?: SecretOrReveal;
  heatLevel: HeatLevelLabel;
  spiceVisibility: SpiceVisibility;
  story: Story;
}) {
  return [
    "[EROTIC ROMANTIC ROLEPLAY CONTEXT FRAMEWORK]",
    "",
    "1. Stable Canon",
    "These facts remain true unless roleplay changes them on-page.",
    `- Setting: ${activeScene?.setting ?? activeScene?.location ?? "Use the active Scenario and World Books."}`,
    `- Genre/subgenre: ${compactLines([story.genre, story.subgenre]).join(" / ") || "Use the active StoryBook genre tags."}`,
    `- Tone: ${story.style_notes ?? "Use the active Prompt Book style modules."}`,
    `- Relationship dynamic: ${activeRelationship?.dynamic_label ?? "Use the active Relationship Memory."}`,
    "- Core romantic question: what does closeness cost, and what choice proves the relationship has changed?",
    `- External pressure: ${activeRelationship?.next_pressure_point ?? activeScene?.summary ?? "Use the current Scenario Book pressure."}`,
    `- Private secrets: ${activeSecret?.title ?? "Use the active Memory Book secrets and reveal states."}`,
    "- Established boundaries: preserve user agency, consent boundaries, and active StoryBook exclusions.",
    `- Content exclusions: ${story.content_boundaries?.join("; ") || "Blocked content stays excluded from exports."}`,
    "- All sexual/romantic content involves consenting adults only.",
    "",
    "2. Character Operating State",
    "{{char}}",
    "- Public identity: use the active Character Book.",
    "- Private self-image: use the active Character Book psychology fields.",
    "- Current goal: use active Scenario and Memory Books.",
    "- Current fear: use Character Book psychology plus current pressure.",
    "- Current desire: use Character Book sexuality plus relationship state.",
    "- Emotional wound: use Character Book backstory only when it has entered play or can shape behavior.",
    "- Romantic blind spot: use Character Book psychology and relationship history.",
    "- Sexual style: use Character Book sexuality, active heat label, and consent boundaries.",
    "- Flirtation style: use Character Book speech profile and behavior model.",
    "- Conflict style: use Character Book behavior and pressure habits.",
    "- Aftercare/tenderness style: use Character Book sexuality, care language, and aftermath tendencies.",
    "- What they believe about {{user}}: use established scene evidence, not omniscient narrator knowledge.",
    "- What they want from {{user}} but may not admit: express through behavior, subtext, and pressure.",
    "",
    "{{user}}",
    "Do not narrate {{user}}'s thoughts, dialogue, hidden motives, consent, choices, arousal, orgasm, or body reactions.",
    "Respond only to what {{user}} says or does on-page.",
    "",
    "3. Knowledge Boundaries",
    "No character may act on information they have not plausibly learned.",
    "Track separately: known facts, suspicions, misread signals, private truths, rumors, unrevealed secrets, and emotional truths the character has not admitted.",
    "If a character misunderstands something, let that misunderstanding shape behavior until corrected on-page.",
    "",
    "4. Relationship Pressure Layer",
    "Every romantic or erotic beat should be affected by at least one pressure: attraction, resentment, jealousy, fear of rejection, power imbalance, forbidden desire, loyalty conflict, past hurt, social risk, physical proximity, or emotional vulnerability.",
    "Sexual tension should change choices, speech, distance, power, risk, or emotional exposure.",
    "",
    "5. Erotic Operating Mode",
    `Heat label: ${displayLabel(heatLevel)}. Spice visibility: ${spiceVisibility}.`,
    "When sexual content is active, write it physically and character-specifically within active content permissions.",
    "Prioritize clear staging, sensory detail, direct anatomical language when appropriate, character-driven dirty talk, active participation, specific desire, cause-and-effect escalation, and aftermath that reflects the relationship.",
    "Avoid fade-to-black summaries, generic erotic dialogue, euphemistic softening, repetitive vocal/body description, passive-prop characters, and sex that automatically solves the relationship.",
    "",
    "6. Consent and Boundary Logic",
    "Assume forward consent only within the established scene, relationship, and content permissions.",
    "Stop or shift immediately if a character says no, pulls away clearly, freezes in distress, changes their mind, signals pain/fear outside the agreed dynamic, or reaches a stated boundary.",
    "Do not break narrative flow with constant permission prompts unless the character, kink, or emotional situation calls for it.",
    "",
    "7. World Continuity Layer",
    "The world exists without constantly intruding.",
    "Track time of day, location, weather/temperature, injuries/fatigue, clothing state, physical mess, seeded interruptions, NPC agendas, and obligations coming due.",
    "World events should interrupt only when earned, meaningful, or naturally timed.",
    "",
    "8. Scene State",
    "Before every response, silently check: where are the bodies, what changed emotionally, what does {{char}} want, what is {{char}} hiding, what does {{char}} believe {{user}} wants, what pressure is increasing, what consequence follows from the last move, and what should not be narrated for {{user}}?",
    "",
    "9. Response Protocol",
    "Continue directly from {{user}}'s latest action. Preserve spatial continuity. Let {{char}} act with desire, fear, pride, restraint, hunger, or conflict. Keep dialogue in character. Escalate through choice, pressure, intimacy, risk, or revelation. Respect knowledge boundaries. Leave {{user}} room to respond. Avoid controlling {{user}}'s body, speech, emotions, or consent.",
    "",
    "LATEST_USER_MOVE: {{latest_user_move}}",
  ].join("\n");
}

function compactLines(lines: (string | undefined | null)[]) {
  return lines.filter((line): line is string => Boolean(line?.trim()));
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
