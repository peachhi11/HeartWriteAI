import { CharacterCardPayload } from "@/types/character-card/CharacterCardPayload";

const BEHAVIOR_SECTION_LABELS = new Set([
  "appearance",
  "backstory",
  "background",
  "behavior",
  "behaviour",
  "core personality",
  "dialogue style",
  "dynamic with user",
  "dynamic with {{user}}",
  "intimacy",
  "kinks",
  "likes",
  "mannerisms",
  "personality",
  "quirks",
  "relationships",
  "sexual behavior",
  "sexual behaviour",
  "speech",
  "speech style",
]);

const DESCRIPTION_SECTION_LABELS = new Set([
  "basic information",
  "character profile",
  "profile",
]);

const SCENARIO_SECTION_LABELS = new Set([
  "scenario",
  "setting",
]);

export function repairImportedCardLayout<T extends CharacterCardPayload>(card: T): T {
  if (!card.data || typeof card.data.description !== "string") {
    return card;
  }

  if (typeof card.data.personality === "string" && card.data.personality.trim()) {
    return card;
  }

  const repaired = splitImportedDescription(card.data.description);
  if (!repaired) {
    return card;
  }

  return {
    ...card,
    data: {
      ...card.data,
      description: repaired.description,
      personality: joinBlocks(card.data.personality, repaired.personality),
      scenario:
        typeof card.data.scenario === "string" && card.data.scenario.trim()
          ? card.data.scenario
          : repaired.scenario || card.data.scenario,
    },
  };
}

function splitImportedDescription(description: string) {
  const sections = collectSections(description);
  if (sections.length < 2) {
    return null;
  }

  const descriptionBlocks: string[] = [];
  const personalityBlocks: string[] = [];
  const scenarioBlocks: string[] = [];
  let movedAnySection = false;

  for (const section of sections) {
    if (!section.label) {
      descriptionBlocks.push(section.content);
      continue;
    }

    if (BEHAVIOR_SECTION_LABELS.has(section.label)) {
      personalityBlocks.push(section.content);
      movedAnySection = true;
    } else if (SCENARIO_SECTION_LABELS.has(section.label)) {
      scenarioBlocks.push(section.content);
      movedAnySection = true;
    } else {
      descriptionBlocks.push(section.content);
    }
  }

  if (!movedAnySection || !personalityBlocks.length) {
    return null;
  }

  return {
    description: joinBlocks(...descriptionBlocks) || description,
    personality: joinBlocks(...personalityBlocks),
    scenario: joinBlocks(...scenarioBlocks),
  };
}

function collectSections(input: string) {
  const sections: Array<{ label: string | null; content: string }> = [];
  let currentLabel: string | null = null;
  let currentLines: string[] = [];

  for (const line of input.replace(/\r\n/g, "\n").split("\n")) {
    const heading = readSectionHeading(line);
    if (heading) {
      pushCurrentSection();
      currentLabel = heading;
      currentLines = [line.trim()];
    } else {
      currentLines.push(line);
    }
  }

  pushCurrentSection();

  return sections.filter((section) => section.content.trim());

  function pushCurrentSection() {
    const content = currentLines.join("\n").trim();
    if (content) {
      sections.push({ label: currentLabel, content });
    }
  }
}

function readSectionHeading(line: string): string | null {
  const normalized = line
    .trim()
    .replace(/^[#*\s[(]+/, "")
    .replace(/[)\]]+$/, "")
    .replace(/[:：]+$/, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

  if (!normalized || normalized.length > 48) {
    return null;
  }

  if (
    BEHAVIOR_SECTION_LABELS.has(normalized) ||
    DESCRIPTION_SECTION_LABELS.has(normalized) ||
    SCENARIO_SECTION_LABELS.has(normalized)
  ) {
    return normalized;
  }

  return null;
}

function joinBlocks(...blocks: unknown[]) {
  return blocks
    .filter((block): block is string => typeof block === "string" && block.trim().length > 0)
    .map((block) => block.trim())
    .join("\n\n");
}
