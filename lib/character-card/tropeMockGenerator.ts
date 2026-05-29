import type { RomanceTropeClass } from "../../types/character-card/RomanceTropeClassification";
import type { TropeEvalData } from "./tropeMacroEvaluation";

type SyntheticTropeSeed = {
  readonly actions: readonly string[];
  readonly dialogue: readonly string[];
};

export type TropeMockDistribution = Partial<Record<RomanceTropeClass, number>>;

export type TropeMockGeneratorOptions = {
  readonly seed?: number;
};

export const GENERATIVE_TROPE_SEED_MATRIX: Record<
  Exclude<RomanceTropeClass, "casual">,
  SyntheticTropeSeed
> = {
  protective: {
    actions: [
      "steps in front of them",
      "clenches fists",
      "shields them fiercely",
      "glares at the threat",
      "bars their arm",
    ],
    dialogue: [
      "Back off right now.",
      "Touch them and you die.",
      "Stay behind me.",
      "Don't move a muscle.",
      "Get away from them.",
    ],
  },
  flustered: {
    actions: [
      "blushes deeply",
      "fidgets with their sleeves",
      "stutters awkwardly",
      "turns away quickly",
      "looks down completely",
    ],
    dialogue: [
      "T-Too close...",
      "The innkeeper said there's only... one bed?",
      "I-I didn't mean it like that!",
      "Is it hot in here?",
      "Stop staring at me...",
    ],
  },
  yearning: {
    actions: [
      "watches quietly from afar",
      "traces the old ring",
      "gazes longingly",
      "sighs softly looking at them",
      "lingers by the doorway",
    ],
    dialogue: [
      "I have spent years waiting.",
      "I still remember everything.",
      "It's always been you.",
      "I missed you so much.",
      "If only things were different.",
    ],
  },
  antagonistic: {
    actions: [
      "glares coldly",
      "snaps sharply",
      "sneers with disdain",
      "crosses arms tightly",
      "scowls deeply",
    ],
    dialogue: [
      "I can't stand your face.",
      "Stay out of my way.",
      "You are completely exhausting.",
      "Get lost.",
      "Don't test my patience.",
    ],
  },
  bantering: {
    actions: [
      "smirks playfully",
      "winks slyly",
      "laughs under their breath",
      "nudges their shoulder",
      "raises an eyebrow",
    ],
    dialogue: [
      "You wish, sweetheart.",
      "As if you could outsmart me.",
      "Please, you love the attention.",
      "Is that the best you can do?",
      "Aren't you a clever one.",
    ],
  },
  recognized: {
    actions: [
      "stares spellbound, pupils dilated",
      "freezes like they have found something lost",
      "touches their chest with sudden recognition",
      "looks at them like coming home",
      "steps closer with stunned certainty",
    ],
    dialogue: [
      "The moment I met you, it felt like coming home.",
      "I know you. I don't know how, but I know you.",
      "It feels like I have been searching for you.",
      "Something in me recognized you first.",
      "I thought finding you would feel impossible.",
    ],
  },
  grudging: {
    actions: ["looks away reluctantly"],
    dialogue: ["Fine, I suppose you did okay."],
  },
  thawing: {
    actions: ["softens their gaze"],
    dialogue: ["Maybe I was wrong about you."],
  },
  trucetaking: {
    actions: ["extends a hand stiffly"],
    dialogue: ["Let's put this aside for tonight."],
  },
  performative: {
    actions: ["fake laughs loudly"],
    dialogue: ["Look happy, they are watching us."],
  },
  slipped_mask: {
    actions: ["freezes mid-motion"],
    dialogue: ["Wait... what did you just say?"],
  },
  bound: {
    actions: ["nods rigidly"],
    dialogue: ["We must fulfill the family contract."],
  },
  smothered: {
    actions: ["paces around the small cabin"],
    dialogue: ["I need air. Everywhere I turn, you are there."],
  },
  haunted: {
    actions: ["swallows hard, eyes clouded"],
    dialogue: ["Do you ever think about the night you walked away?"],
  },
  familiar: {
    actions: ["slips into an old inside joke"],
    dialogue: ["You always chew your lip when lying."],
  },
  estranged: {
    actions: ["nods with polite distance"],
    dialogue: ["It has been a long time, old friend."],
  },
  reclaiming: {
    actions: ["steps directly into their space"],
    dialogue: ["I am not losing you a second time."],
  },
  deferential: {
    actions: ["bows neatly"],
    dialogue: ["As you wish, Your Highness."],
  },
  commanding: {
    actions: ["takes up the entire room"],
    dialogue: ["As your sworn protector, I command you to halt."],
  },
  forbidden: {
    actions: ["glances nervously at the door"],
    dialogue: ["I know this is wrong, but I don't care anymore."],
  },
  secretive: {
    actions: ["extinguishes the candle"],
    dialogue: ["Keep your voice down, if they see us together we are ruined."],
  },
  defeating: {
    actions: ["drops their head into hands"],
    dialogue: ["We live in two different worlds. This won't work."],
  },
  grumpy: {
    actions: ["grunts, turning away"],
    dialogue: ["I'm not brooding. Leave me be."],
  },
  sunshine: {
    actions: ["bounces on their heels"],
    dialogue: ["Come on, smile just once! It won't kill you!"],
  },
};

export function generateMockTropeDataset(
  distribution: TropeMockDistribution,
  options: TropeMockGeneratorOptions = {},
): TropeEvalData[] {
  const random = createSeededRandom(options.seed ?? 1337);
  const dataset: TropeEvalData[] = [];

  for (const [trope, count] of Object.entries(distribution)) {
    const groundTruth = trope as RomanceTropeClass;

    if (groundTruth === "casual" || !count || count < 1) {
      continue;
    }

    const seeds =
      GENERATIVE_TROPE_SEED_MATRIX[
        groundTruth as Exclude<RomanceTropeClass, "casual">
      ];

    for (let index = 0; index < count; index += 1) {
      const action = pickSeed(seeds.actions, random);
      const dialogue = pickSeed(seeds.dialogue, random);
      const formattingStyle = Math.floor(random() * 3);

      dataset.push({
        groundTruth,
        text: formatSyntheticTurn(action, dialogue, formattingStyle),
      });
    }
  }

  shuffleInPlace(dataset, random);

  return dataset;
}

function formatSyntheticTurn(action: string, dialogue: string, style: number) {
  if (style === 0) {
    return `[He ${action}] "${dialogue}"`;
  }

  if (style === 1) {
    return `"${dialogue}" [She ${action}]`;
  }

  return `"${dialogue}"`;
}

function pickSeed(values: readonly string[], random: () => number) {
  return values[Math.floor(random() * values.length)];
}

function shuffleInPlace<T>(values: T[], random: () => number) {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [values[index], values[swapIndex]] = [values[swapIndex], values[index]];
  }
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}
