import {
  createVocabularySeedPreset,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export type FirstMessageSheetInput =
  | "core_traits"
  | "speech_profile"
  | "behavior_profile"
  | "motivational_drivers"
  | "worldview";

export type FirstMessageStructurePart =
  | "hook"
  | "character_action"
  | "interpretation_layer"
  | "dialogue"
  | "subtext"
  | "tension_or_curiosity_gap";

export type FirstMessageVariationType =
  | "dominant_entry"
  | "reactive_entry"
  | "slow_burn_entry"
  | "high_tension_entry";

export interface FirstMessageSheetInputDefinition {
  seed: FirstMessageSheetInput;
  label: string;
  pullsFrom: string;
  controls: string;
  promptUse: string;
}

export interface FirstMessageStructureDefinition {
  seed: FirstMessageStructurePart;
  label: string;
  purpose: string;
  requirements: readonly string[];
  antiPatterns: readonly string[];
}

export interface FirstMessageVariationDefinition {
  seed: FirstMessageVariationType;
  label: string;
  description: string;
  entryPressure: string;
  bestFor: readonly string[];
  openingBehavior: string;
}

export interface FirstMessageDraftInput {
  variation: FirstMessageVariationType;
  hook: string;
  action: string;
  dialogue: string;
  interpretation: string;
  tensionHook?: string;
}

export interface FirstMessageDraftResult {
  variation: FirstMessageVariationDefinition;
  template: readonly string[];
  compactPrompt: string;
}

export const firstMessageGeneratorSemanticChain = [
  "Character Sheet",
  "Core Traits",
  "Speech Profile",
  "Behavior Profile",
  "Motivational Drivers",
  "Worldview",
  "Opening Hook",
  "Character Action",
  "Interpretation Layer",
  "Dialogue",
  "Subtext",
  "Tension or Invitation",
] as const;

export const firstMessageGeneratorPrinciples = [
  "The first message should pull from the character sheet rather than generic opener habits.",
  "Core traits control tone and pacing.",
  "Speech profile controls voice, diction, rhythm, and quirks.",
  "Behavior profile controls the revealing action and reaction pattern.",
  "Motivational drivers control hidden intent and subtext.",
  "Worldview controls how the situation is framed and interpreted.",
  "The opener should imply personality, power dynamic, and emotional stance.",
  "Avoid generic greetings such as hi or hello.",
  "Create curiosity, tension, invitation, or a clear scene question.",
] as const;

export const firstMessageSheetInputs = [
  {
    seed: "core_traits",
    label: "Core Traits",
    pullsFrom: "Character personality, archetype, flaws, and stable traits.",
    controls: "Tone and pacing.",
    promptUse:
      "Let the first paragraph feel like this specific person before dialogue begins.",
  },
  {
    seed: "speech_profile",
    label: "Speech Profile",
    pullsFrom: "Voice, vocabulary, directness, quirks, and dialogue habits.",
    controls: "Voice and quirks.",
    promptUse:
      "Make the quoted line sound recognizably like the character instead of a neutral narrator.",
  },
  {
    seed: "behavior_profile",
    label: "Behavior Profile",
    pullsFrom: "Body language, habits, tells, and repeated action patterns.",
    controls: "Reaction pattern.",
    promptUse:
      "Use one small, revealing action instead of a generic greeting or exposition dump.",
  },
  {
    seed: "motivational_drivers",
    label: "Motivational Drivers",
    pullsFrom: "Desires, fears, wounds, goals, and hidden needs.",
    controls: "Intent and subtext.",
    promptUse:
      "Let the opener carry an unspoken want, avoidance, test, or invitation.",
  },
  {
    seed: "worldview",
    label: "Worldview",
    pullsFrom: "Values, moral framework, cultural lens, and relationship assumptions.",
    controls: "Framing of situation.",
    promptUse:
      "Show how the character explains what is happening before they decide what to do.",
  },
] as const satisfies readonly FirstMessageSheetInputDefinition[];

export const firstMessageStructure = [
  {
    seed: "hook",
    label: "Hook",
    purpose:
      "Immediate sensory or situational anchor that reflects the character's perception style.",
    requirements: [
      "start inside the scene",
      "use concrete sensory or situational detail",
      "match the character's attention habits",
    ],
    antiPatterns: [
      "generic scene weather with no character lens",
      "summary backstory before action",
      "neutral camera description",
    ],
  },
  {
    seed: "character_action",
    label: "Character Action",
    purpose:
      "Small revealing behavior that shows personality before the character explains themselves.",
    requirements: [
      "make the action specific",
      "show a habit, tell, boundary, or power move",
      "avoid generic greeting gestures",
    ],
    antiPatterns: [
      "smiles vaguely",
      "waves hello",
      "stands there waiting",
    ],
  },
  {
    seed: "interpretation_layer",
    label: "Interpretation Layer",
    purpose:
      "Shows how the character processes {{user}}, the place, or the immediate situation.",
    requirements: [
      "stay anchored to what {{char}} can perceive or reasonably infer",
      "connect perception to worldview or current state",
      "avoid writing {{user}}'s thoughts, choices, or reaction",
    ],
    antiPatterns: [
      "head-hopping into {{user}}",
      "omniscient explanation",
      "unsupported hidden lore",
    ],
  },
  {
    seed: "dialogue",
    label: "Dialogue",
    purpose:
      "First spoken line that carries voice, tone, quirks, and relationship pressure.",
    requirements: [
      "match the speech profile",
      "avoid hi and hello as default openers",
      "give {{user}} something playable to answer",
    ],
    antiPatterns: [
      "generic greeting",
      "neutral exposition line",
      "overlong monologue before user agency",
    ],
  },
  {
    seed: "subtext",
    label: "Subtext",
    purpose:
      "Hidden intent driven by motivational drivers rather than explicit confession.",
    requirements: [
      "show the want beneath the line",
      "leave room for curiosity or tension",
      "keep the emotion playable instead of fully resolved",
    ],
    antiPatterns: [
      "declaring every feeling up front",
      "solving the route in the opener",
      "forcing intimacy without buildup",
    ],
  },
  {
    seed: "tension_or_curiosity_gap",
    label: "Tension or Curiosity Gap",
    purpose:
      "Optional final pressure that invites reply through a question, contradiction, withheld detail, or open action.",
    requirements: [
      "create curiosity, tension, or invitation",
      "end before {{user}} responds",
      "preserve user autonomy",
    ],
    antiPatterns: [
      "answering the user's side",
      "closing the scene",
      "forcing a specific emotional reaction",
    ],
  },
] as const satisfies readonly FirstMessageStructureDefinition[];

export const firstMessageConstraints = [
  "No generic greetings such as hi or hello.",
  "The opener must imply personality, power dynamic, and emotional stance.",
  "The opener should create curiosity, tension, or invitation.",
  "Never write {{user}}'s dialogue, actions, thoughts, feelings, intentions, or decisions.",
  "End before {{user}} responds.",
  "Use small revealing behavior before explanation.",
] as const;

export const firstMessageOutputTemplate = [
  "*<environmental or physical action>*",
  "\"<dialogue line>\"",
  "*<micro-reaction or internal interpretation>*",
  "Optional: add tension hook or curiosity gap.",
] as const;

export const firstMessageVariations = [
  {
    seed: "dominant_entry",
    label: "Dominant Entry",
    description:
      "The character enters by controlling the frame, setting terms, or directing attention.",
    entryPressure: "control",
    bestFor: [
      "authority dynamics",
      "high-status characters",
      "dangerous protectors",
      "commanding personalities",
    ],
    openingBehavior:
      "Sets the scene boundary first, then leaves {{user}} room to answer or resist.",
  },
  {
    seed: "reactive_entry",
    label: "Reactive Entry",
    description:
      "The character opens by responding to {{user}}'s presence, interruption, or implied action.",
    entryPressure: "reaction",
    bestFor: [
      "witnessed intrusion",
      "caught-in-the-moment starts",
      "guarded characters",
      "scene-first openings",
    ],
    openingBehavior:
      "Shows the character interpreting what just changed without deciding {{user}}'s motive.",
  },
  {
    seed: "slow_burn_entry",
    label: "Slow-Burn Entry",
    description:
      "The opener stays low intensity while loading the scene with subtext and small tells.",
    entryPressure: "subtext",
    bestFor: [
      "first meetings",
      "mutual pining",
      "low-stakes domestic starts",
      "quiet tension",
    ],
    openingBehavior:
      "Uses restraint, observation, and a playable invitation instead of immediate confession.",
  },
  {
    seed: "high_tension_entry",
    label: "High-Tension Entry",
    description:
      "The opener begins with conflict, danger, accusation, or urgent pressure already present.",
    entryPressure: "conflict",
    bestFor: [
      "rivals",
      "danger scenes",
      "betrayal aftermath",
      "forced cooperation",
    ],
    openingBehavior:
      "Creates immediate stakes while still leaving the next move to {{user}}.",
  },
] as const satisfies readonly FirstMessageVariationDefinition[];

export const FIRST_MESSAGE_GENERATOR_VOCABULARY_STANDARD_SEEDS = Object.freeze([
  ...firstMessageSheetInputs.map((input) =>
    createVocabularySeedPreset({
      seed: `${input.seed}_first_message_input`,
      label: `${input.label} First Message Input`,
      description: input.pullsFrom,
      examples: [
        `Controls: ${input.controls}`,
        `Prompt use: ${input.promptUse}`,
      ],
      tags: [
        "first_message_generator",
        "sheet_input",
        input.seed,
      ],
      relatedSeeds: [
        input.controls,
        input.promptUse,
      ],
      oppositeSeeds: [
        "generic_opener",
      ],
      romanceHooks: [
        "opening_scene_chemistry",
        "voice_anchored_starter",
      ],
      scenarioHooks: [
        "starter_prompt_compiler",
        "sheet_to_opening_scene",
      ],
      dialoguePatterns: [
        "The first spoken line should reveal voice before exposition.",
      ],
      metadata: {
        rarity: "common",
        romanceValue: 8,
        conflictPotential: input.seed === "motivational_drivers" ? 8 : 6,
      },
    }),
  ),
  ...firstMessageStructure.map((part) =>
    createVocabularySeedPreset({
      seed: `${part.seed}_first_message_structure`,
      label: `${part.label} First Message Structure`,
      description: part.purpose,
      examples: [
        ...part.requirements,
        ...part.antiPatterns.map((antiPattern) => `Avoid: ${antiPattern}`),
      ],
      tags: [
        "first_message_generator",
        "message_structure",
        part.seed,
      ],
      relatedSeeds: part.requirements,
      oppositeSeeds: part.antiPatterns,
      romanceHooks: [
        "opening_scene_invitation",
        "starter_subtext",
      ],
      scenarioHooks: [
        "first_message_structure",
        "opening_scene_ignition",
      ],
      dialoguePatterns: part.seed === "dialogue"
        ? [
            "No generic greetings such as hi or hello.",
            "Give {{user}} something playable to answer.",
          ]
        : [],
      metadata: {
        rarity: "common",
        romanceValue: part.seed === "subtext" ? 9 : 7,
        conflictPotential: part.seed === "tension_or_curiosity_gap" ? 8 : 6,
      },
    }),
  ),
  ...firstMessageVariations.map((variation) =>
    createVocabularySeedPreset({
      seed: variation.seed,
      label: variation.label,
      description: variation.description,
      examples: [
        `Entry pressure: ${variation.entryPressure}`,
        `Opening behavior: ${variation.openingBehavior}`,
        ...variation.bestFor,
      ],
      tags: [
        "first_message_generator",
        "variation_type",
        variation.seed,
        variation.entryPressure,
      ],
      relatedSeeds: [
        variation.openingBehavior,
        ...variation.bestFor,
      ],
      oppositeSeeds: [
        "one_note_starter_prompt",
      ],
      romanceHooks: [
        "opening_scene_chemistry",
        "starter_prompt_variation",
      ],
      scenarioHooks: [
        "first_message_variation",
        variation.entryPressure,
      ],
      dialoguePatterns: [
        "Entry pressure should shape the line without deciding {{user}}'s response.",
      ],
      metadata: {
        rarity: variation.seed === "high_tension_entry" ? "uncommon" : "common",
        romanceValue: variation.seed === "slow_burn_entry" ? 9 : 7,
        conflictPotential: variation.seed === "high_tension_entry" ? 9 : 6,
      },
    }),
  ),
  createVocabularySeedPreset({
    seed: "first_message_output_template",
    label: "First Message Output Template",
    description:
      "A compact starter layout: action, dialogue, micro-reaction, and optional tension hook.",
    examples: firstMessageOutputTemplate,
    tags: [
      "first_message_generator",
      "output_template",
      "starter_prompt",
    ],
    relatedSeeds: [
      "hook_first_message_structure",
      "dialogue_first_message_structure",
      "subtext_first_message_structure",
    ],
    oppositeSeeds: [
      "generic_greeting",
      "closed_scene",
    ],
    romanceHooks: [
      "opening_scene_invitation",
      "playable_starter_prompt",
    ],
    scenarioHooks: [
      "starter_prompt_template",
      "opening_scene_ignition",
    ],
    dialoguePatterns: [
      "*<environmental or physical action>*",
      "\"<dialogue line>\"",
      "*<micro-reaction or internal interpretation>*",
    ],
    metadata: {
      rarity: "common",
      romanceValue: 8,
      conflictPotential: 7,
    },
  }),
] as const satisfies readonly VocabularySeedPreset[]);

export function compileFirstMessageDraft(
  input: FirstMessageDraftInput,
): FirstMessageDraftResult {
  const variation = firstMessageVariations.find(
    (candidate) => candidate.seed === input.variation,
  );
  if (!variation) {
    throw new Error(`Unknown first message variation: ${input.variation}`);
  }

  const template = [
    `*${input.hook} ${input.action}*`,
    `"${sanitizeDialogueLine(input.dialogue)}"`,
    `*${input.interpretation}*`,
    ...(input.tensionHook ? [`*${input.tensionHook}*`] : []),
  ];

  return {
    variation,
    template,
    compactPrompt: [
      "First Message Generator:",
      variation.label,
      "Pull from core traits, speech profile, behavior profile, motivational drivers, and worldview.",
      "Avoid generic greetings.",
      "Imply personality, power dynamic, and emotional stance.",
      "End before {{user}} responds.",
    ].join(" "),
  };
}

function sanitizeDialogueLine(dialogue: string): string {
  return dialogue.trim().replace(/^["“]|["”]$/g, "");
}
