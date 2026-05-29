import type { RomanceTropeClass } from "@/types/character-card/RomanceTropeClassification";

export type DynamicArchetype =
  | "Soulmate Mirror"
  | "Magnetic Opposites"
  | "Volatile Friction"
  | "Unrequited Distance";

export interface PersonaTraits {
  name: string;
  primaryBias: RomanceTropeClass;
  secondaryBias: RomanceTropeClass;
  stats: {
    charm: number;
    vulnerability: number;
    willpower: number;
  };
}

export interface CompatibilityReport {
  description: string;
  dynamicArchetype: DynamicArchetype;
  resonanceScore: number;
  uiGlow: string;
}

export function calculatePsychologicalResonance(
  player: PersonaTraits,
  npcForbiddenTones: RomanceTropeClass[],
  npcPreferredTones: RomanceTropeClass[],
): CompatibilityReport {
  let score = 50;

  if (npcPreferredTones.includes(player.primaryBias)) {
    score += 25;
  }
  if (npcPreferredTones.includes(player.secondaryBias)) {
    score += 10;
  }

  const primaryIsForbidden = npcForbiddenTones.includes(player.primaryBias);
  const secondaryIsForbidden = npcForbiddenTones.includes(player.secondaryBias);

  if (primaryIsForbidden) {
    score -= 25;
  }
  if (secondaryIsForbidden) {
    score -= 10;
  }

  const vulnerabilityDistance = Math.abs(player.stats.vulnerability - 50);
  score += vulnerabilityDistance > 30 ? 5 : -5;
  score += player.stats.charm >= 65 ? 5 : 0;
  score += player.stats.willpower >= 70 && primaryIsForbidden ? 5 : 0;

  score = Math.max(0, Math.min(100, score));

  if (score >= 75) {
    return {
      description:
        "This persona mirrors the target's preferred emotional lanes. Expect quick trust, easy intimacy, and fast progression tracking.",
      dynamicArchetype: "Soulmate Mirror",
      resonanceScore: score,
      uiGlow:
        "border-emerald-500/40 bg-emerald-950/10 text-emerald-400 shadow-emerald-950/20",
    };
  }

  if (score >= 45 && primaryIsForbidden) {
    return {
      description:
        "This match starts with resistance rather than rejection. It is tuned for rivals, slow-burn pressure, and enemies-to-lovers escalation.",
      dynamicArchetype: "Volatile Friction",
      resonanceScore: score,
      uiGlow:
        "border-amber-500/40 bg-amber-950/10 text-amber-400 shadow-amber-950/20",
    };
  }

  if (score >= 45) {
    return {
      description:
        "This persona complements the target without perfectly matching them. Expect balanced friction, growth beats, and flexible story routes.",
      dynamicArchetype: "Magnetic Opposites",
      resonanceScore: score,
      uiGlow:
        "border-blue-500/40 bg-blue-950/10 text-blue-400 shadow-blue-950/20",
    };
  }

  return {
    description:
      "This is a difficult emotional route. The target will misread or guard against the persona early, creating a high-angst uphill path.",
    dynamicArchetype: "Unrequited Distance",
    resonanceScore: score,
    uiGlow:
      "border-purple-500/40 bg-purple-950/10 text-purple-400 shadow-purple-950/20",
  };
}
