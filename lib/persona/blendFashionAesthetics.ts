import {
  FashionAestheticBlend,
  FashionSeasonContext,
} from "../../types/persona/FashionAesthetic";
import { getFashionAestheticById } from "./fashionAesthetics";

const knownHybridNames: Record<string, string> = {
  "coquette:grunge": "Dark Coquette",
  "dark_academia:cyber_y2k": "Cyber Academic",
  "coastal_cowgirl:goth_core": "Goth Western",
};

function titleCase(value: string): string {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function createHybridName(dominantId: string, secondaryId: string): string {
  const known = knownHybridNames[`${dominantId}:${secondaryId}`];

  if (known) {
    return known;
  }

  const dominant = getFashionAestheticById(dominantId);
  const secondary = getFashionAestheticById(secondaryId);

  return `${dominant.name} ${titleCase(secondary.tags[0] ?? "Hybrid")}`;
}

function firstTemplate(id: string, season: FashionSeasonContext): string {
  const aesthetic = getFashionAestheticById(id);

  return (
    aesthetic.promptTemplates[season] ??
    Object.values(aesthetic.promptTemplates)[0] ??
    aesthetic.formula
  );
}

export function blendFashionAesthetics({
  dominantAestheticId,
  secondaryAestheticId,
  season,
}: {
  dominantAestheticId: string;
  secondaryAestheticId: string;
  season: FashionSeasonContext;
}): FashionAestheticBlend {
  const dominant = getFashionAestheticById(dominantAestheticId);
  const secondary = getFashionAestheticById(secondaryAestheticId);
  const hybridName = createHybridName(dominant.id, secondary.id);
  const dominantItem = dominant.keyItems[0] ?? dominant.name;
  const secondaryItem = secondary.keyItems[0] ?? secondary.name;
  const dominantTexture = dominant.visualWeights[0] ?? dominant.name;
  const secondaryTexture = secondary.visualWeights[0] ?? secondary.name;
  const dominantPalette = dominant.fabricsPalette.split(";").at(-1)?.trim() ?? dominant.fabricsPalette;
  const secondaryPalette = secondary.fabricsPalette.split(";").at(-1)?.trim() ?? secondary.fabricsPalette;
  const dominantTemplate = firstTemplate(dominant.id, season);
  const secondaryAccent = secondary.keyItems[1] ?? secondaryItem;

  return {
    hybridName,
    dominantAestheticId: dominant.id,
    secondaryAestheticId: secondary.id,
    dominantWeight: 0.65,
    secondaryWeight: 0.35,
    silhouette: `Use ${dominant.name} structure through ${dominantItem}, softened or disrupted by ${secondary.name} fit cues from ${secondaryItem}.`,
    fabrics: `Merge ${dominantTexture} with ${secondaryTexture} so the outfit keeps one signature texture from each style.`,
    palette: `Start with ${dominantPalette} and inject accent colors from ${secondaryPalette}.`,
    hardware: `Layer ${dominant.keyItems.slice(1, 3).join(" and ")} with ${secondary.keyItems.slice(1, 3).join(" and ")}.`,
    streetStylePrompt: `${hybridName} aesthetic, ${dominantTemplate.replace(/^[^,]+,\s*/, "")}, ${secondaryAccent}, ${season.replace("_", "-")} street style`,
    personaAestheticLine: `${hybridName}: ${dominant.name} influence at 65% with ${secondary.name} influence at 35%; ${dominant.tags.join(", ")} roots blended with ${secondary.tags.join(", ")} accents.`,
    personaOutfitLine: `${hybridName} outfit direction: ${dominantItem} styled with ${secondaryItem}, ${dominantTexture} mixed with ${secondaryTexture}, ${dominantPalette} with ${secondaryPalette} accents.`,
  };
}
