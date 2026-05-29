import type {
  RomanceTropeClass,
  RomanceTropeClassification,
} from "../../types/character-card/RomanceTropeClassification";
import { RomanceTropeClassificationSchema } from "../../types/character-card/RomanceTropeClassification";

type TropeRule = {
  readonly description: string;
  readonly intent: RomanceTropeClass;
  readonly pattern: RegExp;
};

export const TROPE_RULES: readonly TropeRule[] = [
  {
    description: "Protective threat response, shielding, or defensive intervention.",
    intent: "protective",
    pattern:
      /\b(back off|touch (them|her|him)|die|stay behind|don't move|do not move|get away from (them|her|him))\b|\[.*(shields|steps in front|clenches fists|glares at the threat|bars their arm).*\]/i,
  },
  {
    description: "Flustered proximity, embarrassment, stuttering, or classic one-bed tension.",
    intent: "flustered",
    pattern:
      /\b(one bed|too close|touching me|stutter|stammer|blush|blushed|blushing|hot in here|stop staring|turn away|look down)\b|([a-z])-\2|\[.*(blushes|fidgets|stutters|turns away|looks down).*\]/i,
  },
  {
    description: "Longing, waiting, missed time, or quiet gaze-based yearning.",
    intent: "yearning",
    pattern:
      /\b(always|still|years|waiting|longing|missed|miss you|waited|if only things were different)\b|\[.*(watches quietly|gazes|traces|sighs softly|lingers by the doorway).*\]/i,
  },
  {
    description: "Soulmate recognition, instant familiarity, or fated homecoming.",
    intent: "recognized",
    pattern:
      /\b(coming home|recognized you|recognised you|know you|searching for you|found you|the moment i met you|searching for you)\b|\[.*(stares spellbound|found something lost|sudden recognition|like coming home|stunned certainty).*\]/i,
  },
  {
    description: "Direct rivalry, hostility, rejection, or enemies-to-lovers friction.",
    intent: "antagonistic",
    pattern:
      /\b(can't stand|cannot stand|stay out of my way|hate|get lost|out of my face|move away from me|exhausting|don't test my patience|do not test my patience)\b|\[.*(glares|snaps|sneers|crosses arms|scowls).*\]/i,
  },
  {
    description: "Witty sparring, light condescension, or playful verbal competition.",
    intent: "bantering",
    pattern:
      /\b(you wish|as if|please|clever|outsmart|sweetheart|best you can do|love the attention)\b|\[.*(smirks|winks|laughs under breath|nudges their shoulder|raises an eyebrow).*\]/i,
  },
];

export function classifyTropeInput(text: string): RomanceTropeClass {
  return classifyTropeInputDetailed(text).class;
}

export function classifyTropeInputDetailed(
  text: string,
): RomanceTropeClassification {
  const trimmed = text.trim();

  if (!trimmed) {
    return RomanceTropeClassificationSchema.parse({
      class: "casual",
      confidence: 0,
      matchedKeywords: [],
      reason: "Empty input has no romance trope signal.",
    });
  }

  for (const rule of TROPE_RULES) {
    const matches = collectRuleMatches(trimmed, rule.pattern);

    if (matches.length > 0) {
      return RomanceTropeClassificationSchema.parse({
        class: rule.intent,
        confidence: Math.min(0.98, 0.58 + matches.length * 0.12),
        matchedKeywords: matches,
        reason: rule.description,
      });
    }
  }

  return RomanceTropeClassificationSchema.parse({
    class: "casual",
    confidence: 0.35,
    matchedKeywords: [],
    reason: "No romance trope trigger matched.",
  });
}

function collectRuleMatches(text: string, pattern: RegExp) {
  return uniquePreserveOrder(
    Array.from(text.matchAll(new RegExp(pattern, "gi"))).map((match) =>
      match[0],
    ),
  );
}

function uniquePreserveOrder(values: string[]) {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const value of values) {
    const trimmed = value.trim();
    const key = trimmed.toLowerCase().replace(/\s+/g, " ");

    if (!trimmed || seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(trimmed);
  }

  return unique;
}
