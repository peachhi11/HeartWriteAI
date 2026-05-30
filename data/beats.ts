export type ScenarioPhase = "Spark" | "Tension" | "Vulnerability" | "Climax";

export interface Beat {
  phase: ScenarioPhase;
  title: string;
  description: string;
}

export interface RPScenarioPayload {
  id: string;
  metadata: {
    phase: ScenarioPhase;
    tone: string;
  };
  narrative: {
    title: string;
    setting: string;
    sensoryAnchor: string;
    incitingIncident: string;
  };
  llmContext: {
    systemPromptOverride: string;
    startingMessageTemplate: string;
    temporaryLorebookEntry: {
      key: string;
      content: string;
    };
  };
  cardContext: {
    scenarioAppend: string;
    alternateGreeting: string;
  };
}

export const beatsData = {
  actions: [
    "One character has to lean in close to whisper a secret.",
    "An accidental hand brush turns into a lingering hold.",
    "A sarcastic remark falls flat, leaving an intense eye contact.",
    "One character lets down their guard for exactly one sentence.",
  ],
  beats: [
    {
      description:
        "Forced into a minor, annoying situation together like a stalled lift or a missed train.",
      phase: "Spark",
      title: "The Shared Inconvenience",
    },
    {
      description:
        "Placed in a crowded or small physical space where contact cannot be avoided.",
      phase: "Tension",
      title: "The Forced Proximity",
    },
    {
      description:
        "One character tends to the other's minor injury, sudden illness, or physical exhaustion.",
      phase: "Vulnerability",
      title: "The Caretaking Prompt",
    },
    {
      description:
        "An emotional surge where hiding the romantic attraction becomes physically impossible.",
      phase: "Climax",
      title: "The Breaking Point",
    },
  ],
  sensoryAnchors: [
    "The scent of rain on hot asphalt and shared coffee.",
    "A heavy, loaded silence punctuated only by a ticking wall clock.",
    "The warmth of a borrowed jacket that is slightly too large.",
    "Flickering fluorescent lights throwing long, intimate shadows.",
  ],
  settings: [
    "A dimly lit library during a sudden thunderstorm",
    "An overcrowded train carriage on the last route home",
    "A quiet balcony overlooking a chaotic wedding reception",
    "The empty kitchen of a shared house at 3:00 AM",
  ],
  tones: [
    "Slow Burn",
    "Angsty",
    "Soft Tension",
    "Hurt/Comfort",
    "Playful Friction",
  ],
} satisfies {
  actions: string[];
  beats: Beat[];
  sensoryAnchors: string[];
  settings: string[];
  tones: string[];
};

export function rollScenarioPayload(): RPScenarioPayload {
  const beat = randomItem(beatsData.beats);
  const setting = randomItem(beatsData.settings);
  const sensoryAnchor = randomItem(beatsData.sensoryAnchors);
  const action = randomItem(beatsData.actions);
  const tone = randomItem(beatsData.tones);
  const id = `scenario_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  return {
    cardContext: {
      alternateGreeting: buildStartingMessage(beat, setting, sensoryAnchor, action),
      scenarioAppend: [
        `Current scenario beat: ${beat.title}.`,
        `Tone: ${tone}.`,
        `Setting: ${setting}.`,
        `Scene pressure: ${action}`,
      ].join(" "),
    },
    id,
    llmContext: {
      startingMessageTemplate: buildStartingMessage(
        beat,
        setting,
        sensoryAnchor,
        action,
      ),
      systemPromptOverride: buildSystemPromptOverride(beat, tone),
      temporaryLorebookEntry: {
        content: [
          `The active scene is set in ${setting}.`,
          `Sensory details to preserve: ${sensoryAnchor}`,
          `Immediate scene movement: ${action}`,
        ].join(" "),
        key: beat.title,
      },
    },
    metadata: {
      phase: beat.phase,
      tone,
    },
    narrative: {
      incitingIncident: action,
      sensoryAnchor,
      setting,
      title: beat.title,
    },
  };
}

function buildSystemPromptOverride(beat: Beat, tone: string) {
  return [
    `Keep the scene anchored to ${beat.title.toLowerCase()} and ${tone.toLowerCase()} romance pacing.`,
    "Prioritize observable body language, emotional restraint, consent-aware tension, and the immediate environment.",
    "Never write {{user}}'s dialogue, private thoughts, decisions, or consent.",
  ].join(" ");
}

function buildStartingMessage(
  beat: Beat,
  setting: string,
  sensoryAnchor: string,
  action: string,
) {
  return [
    `*${setting}. ${sensoryAnchor} ${action}*`,
    `"We should probably pretend this is normal," *{{char}} says, but their voice is a little too quiet for that to be true.*`,
  ].join(" ");
}

function randomItem<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)];
}
