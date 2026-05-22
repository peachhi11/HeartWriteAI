export type EmotionPolarity = "comfortable" | "uncomfortable";

export type EmotionSignal = {
  readonly cluster: string;
  readonly polarity: EmotionPolarity;
  readonly matches: string[];
};

export type EmotionLexiconAnalysis = {
  readonly signals: EmotionSignal[];
  readonly toneTags: string[];
  readonly microTropes: string[];
};

type EmotionCluster = {
  readonly cluster: string;
  readonly polarity: EmotionPolarity;
  readonly keywords: readonly string[];
  readonly toneTags: readonly string[];
  readonly microTropes?: readonly string[];
};

const EMOTION_CLUSTERS: readonly EmotionCluster[] = [
  {
    cluster: "affection",
    polarity: "comfortable",
    keywords: ["affection", "admire", "caring", "devoted", "gentle", "loving", "tender", "warm"],
    toneTags: ["fluff", "cozy romance"],
  },
  {
    cluster: "confidence",
    polarity: "comfortable",
    keywords: ["assured", "bold", "capable", "grounded", "safe", "secure", "steady", "trusting"],
    toneTags: ["grounded romance"],
  },
  {
    cluster: "courage",
    polarity: "comfortable",
    keywords: ["adventurous", "brave", "daring", "determined", "powerful", "proud", "valiant", "worthy"],
    toneTags: ["high agency"],
  },
  {
    cluster: "engagement",
    polarity: "comfortable",
    keywords: ["alert", "curious", "eager", "focused", "intrigued", "motivated", "responsive"],
    toneTags: ["playful tension"],
  },
  {
    cluster: "curiosity",
    polarity: "comfortable",
    keywords: ["exploring", "fascinated", "interested", "involved", "stimulated"],
    toneTags: ["curious"],
  },
  {
    cluster: "joy",
    polarity: "comfortable",
    keywords: ["amused", "cheerful", "delighted", "happy", "playful", "pleased", "upbeat"],
    toneTags: ["fluff"],
  },
  {
    cluster: "peace",
    polarity: "comfortable",
    keywords: ["accepting", "calm", "comfortable", "content", "easygoing", "relaxed", "serene"],
    toneTags: ["cozy romance"],
  },
  {
    cluster: "gratitude",
    polarity: "comfortable",
    keywords: ["appreciative", "blessed", "grateful", "honored", "moved", "supported", "thankful"],
    toneTags: ["comfort"],
  },
  {
    cluster: "fear",
    polarity: "uncomfortable",
    keywords: ["afraid", "anxious", "dread", "fearful", "frightened", "panicked", "scared", "worried"],
    toneTags: ["angsty"],
    microTropes: ["hurt/comfort"],
  },
  {
    cluster: "anger",
    polarity: "uncomfortable",
    keywords: ["angry", "furious", "irritated", "livid", "mad", "outraged", "resentful", "upset"],
    toneTags: ["angsty"],
    microTropes: ["enemies to lovers"],
  },
  {
    cluster: "aversion",
    polarity: "uncomfortable",
    keywords: ["bitter", "defensive", "disgusted", "hostile", "repulsed", "revenge", "stubborn", "threatened"],
    toneTags: ["dark romance"],
    microTropes: ["enemies to lovers"],
  },
  {
    cluster: "sadness",
    polarity: "uncomfortable",
    keywords: ["alone", "depressed", "despair", "disappointed", "forlorn", "gloomy", "grief", "heartbroken", "lonely", "miserable", "sorrow"],
    toneTags: ["angsty"],
    microTropes: ["hurt/comfort"],
  },
  {
    cluster: "disconnection",
    polarity: "uncomfortable",
    keywords: ["aloof", "distant", "indifferent", "isolated", "numb", "removed", "shut down", "withdrawn"],
    toneTags: ["angsty", "quiet tension"],
    microTropes: ["who hurt you"],
  },
  {
    cluster: "shame",
    polarity: "uncomfortable",
    keywords: ["ashamed", "embarrassed", "guilty", "humiliated", "insulted", "rejected", "remorseful"],
    toneTags: ["angsty"],
    microTropes: ["who hurt you"],
  },
  {
    cluster: "guilt",
    polarity: "uncomfortable",
    keywords: ["regret", "remorse", "sorry"],
    toneTags: ["second chance", "angsty"],
    microTropes: ["hurt/comfort"],
  },
  {
    cluster: "fatigue",
    polarity: "uncomfortable",
    keywords: ["burned out", "crushed", "depleted", "empty", "exhausted", "lethargic", "tired", "worn out"],
    toneTags: ["hurt/comfort"],
    microTropes: ["caretaking"],
  },
  {
    cluster: "tension",
    polarity: "uncomfortable",
    keywords: ["distressed", "fidgety", "frazzled", "nervous", "restless", "stressed", "tense", "uptight"],
    toneTags: ["slow burn", "angsty"],
  },
  {
    cluster: "vulnerability",
    polarity: "uncomfortable",
    keywords: ["fragile", "guarded", "helpless", "hopeless", "insecure", "powerless", "sensitive", "uncertain"],
    toneTags: ["hurt/comfort"],
    microTropes: ["who hurt you"],
  },
  {
    cluster: "yearning",
    polarity: "uncomfortable",
    keywords: ["envious", "jealous", "longing", "nostalgic", "pining", "wistful", "yearning"],
    toneTags: ["slow burn", "angsty"],
    microTropes: ["mutual pining"],
  },
];

export function analyzeEmotionLexicon(source: string): EmotionLexiconAnalysis {
  const normalizedSource = normalizeText(source);
  const signals = EMOTION_CLUSTERS.flatMap((cluster) => {
    const matches = cluster.keywords.filter((keyword) =>
      normalizedSource.includes(normalizeText(keyword)),
    );

    if (matches.length === 0) {
      return [];
    }

    return [
      {
        cluster: cluster.cluster,
        polarity: cluster.polarity,
        matches,
      },
    ];
  });

  const matchingClusters = EMOTION_CLUSTERS.filter((cluster) =>
    signals.some((signal) => signal.cluster === cluster.cluster),
  );

  return {
    signals,
    toneTags: uniqueSorted(matchingClusters.flatMap((cluster) => cluster.toneTags)),
    microTropes: uniqueSorted(
      matchingClusters.flatMap((cluster) => cluster.microTropes ?? []),
    ),
  };
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
}

function uniqueSorted(values: readonly string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}
