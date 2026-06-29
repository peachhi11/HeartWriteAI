import type { SeedPickerEntry } from "../../data/seedPickerRegistry";
import {
  type CharacterCreationForm,
  CharacterCreationFormSchema,
} from "../../types/character-card/CharacterCreationForm";

export type CharacterCreationFormPath = ReadonlyArray<string | number>;

export function applySeedPickerEntryToCharacterCreationForm(
  form: CharacterCreationForm,
  entry: SeedPickerEntry,
): CharacterCreationForm {
  let nextForm = form;

  if (entry.kind === "semantic" || entry.kind === "vocabulary") {
    nextForm = {
      ...nextForm,
      semanticSeedIds: dedupeStrings([...nextForm.semanticSeedIds, entry.id]),
    };
  }

  const targetPath = resolveCharacterCreationSeedTargetPath(entry);
  const currentValue = readCharacterCreationFormTextPath(nextForm, targetPath);
  const seedText = formatCharacterCreationSeedSnippet(entry);

  return updateCharacterCreationFormPath(
    nextForm,
    targetPath,
    appendCharacterCreationSeedText(currentValue, seedText),
  );
}

export function readCharacterCreationFormTextPath(
  source: CharacterCreationForm,
  path: CharacterCreationFormPath,
): string {
  const value = path.reduce<unknown>((currentValue, pathPart) => {
    if (currentValue === undefined || currentValue === null) {
      return undefined;
    }

    return (currentValue as Record<string | number, unknown>)[pathPart];
  }, source);

  return typeof value === "string" ? value : "";
}

export function updateCharacterCreationFormPath<Value extends string | boolean>(
  source: CharacterCreationForm,
  path: CharacterCreationFormPath,
  value: Value,
): CharacterCreationForm {
  return CharacterCreationFormSchema.parse(
    updateNestedValueAtPath(source, [...path], value),
  );
}

function resolveCharacterCreationSeedTargetPath(
  entry: SeedPickerEntry,
): CharacterCreationFormPath {
  if (entry.kind === "vocabulary") {
    return resolveVocabularyCharacterCreationSeedTargetPath(entry);
  }

  if (entry.kind === "semantic") {
    switch (entry.category) {
      case "wounds":
        return ["psychology", "coreWound"];
      case "fears":
        return ["cognitiveDrivers", "fear"];
      case "desires":
      case "motivations":
      case "goals_short":
      case "goals_long":
        return ["cognitiveDrivers", "motivation"];
      case "hidden_needs":
        return ["internalThoughts", "motivationsFears"];
      case "emotional_meanings":
      case "emotions":
      case "moods":
        return ["psychology", "baselineAffect"];
      case "triggers":
        return ["psychology", "triggers"];
      case "responses":
        return ["psychology", "stressResponse"];
      case "visible_behaviors":
        return ["behaviour", "bodyLanguagePosture"];
      case "humor":
        return ["personality", "humor"];
      case "speech_patterns":
        return ["speechCommunication", "toneVocabulary"];
      case "attachment_styles":
        return ["psychology", "attachmentStyle"];
      case "conflict_styles":
        return ["psychology", "conflictStyle"];
      case "repair_styles":
      case "repair_needs":
        return ["relationships", "emotionalBonds", "trustMetric"];
      case "love_languages":
        return ["psychology", "loveLanguages"];
      case "relationship_dynamics":
      case "romance_tropes":
      case "relationship_gates":
      case "routes":
        return ["relationships", "emotionalBonds", "attachmentType"];
      case "archetypes":
      case "traits":
        return ["personality", "archetype"];
      case "appearance":
        return ["appearance", "facialFeatures"];
      case "fashion":
        return ["appearance", "outfit"];
      case "occupations":
        return ["identity", "occupation"];
      case "hobbies":
        return ["lifestyle", "hobbies"];
      case "skills":
      case "intelligence":
        return ["personality", "intelligence"];
      case "world_tags":
      case "scenario_tags":
        return ["lifestyle", "residence"];
      case "npc_roles":
        return ["npcNetwork", "discoveryNotes"];
      case "metadata_tags":
        return ["internalThoughts", "internalMonologues"];
      default:
        return ["personality", "positiveTraits"];
    }
  }

  return resolvePresetCharacterCreationSeedTargetPath(entry);
}

function resolvePresetCharacterCreationSeedTargetPath(
  entry: SeedPickerEntry,
): CharacterCreationFormPath {
  const haystack = createSeedRoutingHaystack(entry);

  switch (entry.lane) {
    case "appearance":
      return /\b(outfit|clothing|fashion|style|fabric|armou?r|jewell?ery)\b/.test(haystack)
        ? ["appearance", "outfit"]
        : ["appearance", "facialFeatures"];
    case "image":
      return /\b(negative prompt|lighting|camera|portrait|render|quality)\b/.test(haystack)
        ? ["appearance", "facialFeatures"]
        : ["appearance", "outfit"];
    case "personality":
      if (/character-archetype|character archetype|archetype/.test(haystack)) {
        return ["personality", "archetype"];
      }
      if (/voice|speech|dialogue|accent|tone|vocabulary/.test(haystack)) {
        return ["speechCommunication", "toneVocabulary"];
      }
      if (/backstory|event|origin|past|history/.test(haystack)) {
        return ["internalThoughts", "motivationsFears"];
      }
      if (/wound|fear|shame|abandonment|betrayal|trigger|stress|response/.test(haystack)) {
        return ["psychology", "coreWound"];
      }
      if (/moral|ethic|justice|mercy|truth|loyalty|honou?r|duty/.test(haystack)) {
        return ["behaviour", "moralityInAction"];
      }
      if (/relationship|romance|dynamic|trope|gate|route|attachment|conflict|repair/.test(haystack)) {
        return ["relationships", "emotionalBonds", "attachmentType"];
      }
      return ["personality", "positiveTraits"];
    case "world":
      if (/routine|daily|workday|domestic|schedule/.test(haystack)) {
        return ["lifestyle", "routines"];
      }
      if (/\b(npc|faction|group|network|family|rival|mentor)\b/.test(haystack)) {
        return /\b(npc|network|family|rival|mentor|friend|ex|exes)\b/.test(haystack)
          ? ["npcNetwork", "discoveryNotes"]
          : ["relationships", "affiliationCore", "factionOrGroup"];
      }
      return ["lifestyle", "residence"];
    case "metadata":
      return ["internalThoughts", "internalMonologues"];
    default:
      return ["personality", "positiveTraits"];
  }
}

function resolveVocabularyCharacterCreationSeedTargetPath(
  entry: SeedPickerEntry,
): CharacterCreationFormPath {
  const haystack = createSeedRoutingHaystack(entry);

  if (/\b(image|portrait|appearance|face|hair|outfit|clothing|body|skin|eyes)\b/.test(haystack)) {
    return /\b(outfit|clothing|fashion|fabric|armou?r|jewell?ery)\b/.test(haystack)
      ? ["appearance", "outfit"]
      : ["appearance", "facialFeatures"];
  }

  if (/voice|speech|dialogue|accent|tone/.test(haystack)) {
    return ["speechCommunication", "toneVocabulary"];
  }

  if (/love language|acts of service|gift|touch|quality time|words of affirmation/.test(haystack)) {
    return ["psychology", "loveLanguages"];
  }

  if (/hidden_need|longing|desire|want|chosen|home|safety/.test(haystack)) {
    return ["cognitiveDrivers", "motivation"];
  }

  if (/trigger|response|stress|panic|shutdown|freeze|fawn|fight|flight/.test(haystack)) {
    return ["psychology", "stressResponse"];
  }

  if (/origin_wound|wound|fear|shame|abandonment|betrayal/.test(haystack)) {
    return ["psychology", "coreWound"];
  }

  if (/moral|ethic|justice|mercy|truth|loyalty|honou?r|duty/.test(haystack)) {
    return ["behaviour", "moralityInAction"];
  }

  if (/\b(npc|network|family|rival|mentor|friend|ex|exes)\b/.test(haystack)) {
    return ["npcNetwork", "discoveryNotes"];
  }

  if (/relationship|romance|dynamic|complement|trope|gate|route|payoff|identity/.test(haystack)) {
    return ["relationships", "emotionalBonds", "attachmentType"];
  }

  return ["personality", "positiveTraits"];
}

function formatCharacterCreationSeedSnippet(entry: SeedPickerEntry) {
  if (entry.vocabularySeed) {
    const seed = entry.vocabularySeed;
    return [
      `${seed.label}: ${seed.description}`,
      seed.examples.length > 0 ? `Examples: ${seed.examples.slice(0, 2).join(" ")}` : "",
      seed.romanceHooks.length > 0
        ? `Romance hooks: ${seed.romanceHooks.slice(0, 3).join(", ")}.`
        : "",
      seed.scenarioHooks.length > 0
        ? `Scenario hooks: ${seed.scenarioHooks.slice(0, 3).join(", ")}.`
        : "",
      seed.dialoguePatterns.length > 0
        ? `Dialogue patterns: ${seed.dialoguePatterns.slice(0, 2).join(" ")}`
        : "",
    ].filter(Boolean).join("\n");
  }

  if (entry.semanticNode) {
    const node = entry.semanticNode;
    return [
      `${node.label}: ${firstNonEmpty([
        node.description,
        node.internalMeaning,
        node.emotionalMeaning,
        node.guidance,
        node.visual,
        node.impression,
      ])}`,
      node.internalMeaning ? `Internal meaning: ${node.internalMeaning}` : "",
      node.emotionalMeaning ? `Emotional meaning: ${node.emotionalMeaning}` : "",
      takeJoined("Behaviors", node.behaviors, 3),
      takeJoined("Body language", node.bodyLanguage, 3),
      takeJoined("Triggers", node.commonTriggers ?? node.triggers, 3),
      takeJoined("Dialogue", node.dialogueExamples, 2),
      takeJoined("Growth", node.growthPath, 2),
    ].filter(Boolean).join("\n");
  }

  const prefix = entry.kind === "semantic" ? entry.label : entry.value;
  const detail = entry.description || entry.guidance;

  return detail ? `${prefix}: ${detail}` : prefix;
}

function appendCharacterCreationSeedText(currentValue: string, nextValue: string) {
  const trimmedCurrent = currentValue.trim();
  const trimmedNext = nextValue.trim();

  if (!trimmedNext) {
    return trimmedCurrent;
  }

  if (trimmedCurrent.toLowerCase().includes(trimmedNext.toLowerCase())) {
    return trimmedCurrent;
  }

  return [trimmedCurrent, trimmedNext].filter(Boolean).join("\n");
}

function updateNestedValueAtPath<Value extends string | boolean>(
  source: unknown,
  path: Array<string | number>,
  value: Value,
): unknown {
  if (path.length === 0) {
    return value;
  }

  const [pathPart, ...remainingPath] = path;
  const currentValue =
    isRecord(source) || Array.isArray(source)
      ? (source as Record<string | number, unknown>)[pathPart]
      : undefined;
  const nextValue = updateNestedValueAtPath(
    currentValue,
    remainingPath,
    value,
  );

  if (Array.isArray(source)) {
    return source.map((item, index) =>
      index === pathPart ? nextValue : item,
    );
  }

  return {
    ...(isRecord(source) ? source : {}),
    [pathPart]: nextValue,
  };
}

function createSeedRoutingHaystack(entry: SeedPickerEntry) {
  const seed = entry.vocabularySeed;

  return [
    entry.registryKey,
    entry.category,
    entry.label,
    entry.description,
    entry.guidance,
    entry.sourceLabel,
    entry.value,
    ...entry.tags,
    ...(seed?.examples ?? []),
    ...(seed?.romanceHooks ?? []),
    ...(seed?.scenarioHooks ?? []),
    ...(seed?.dialoguePatterns ?? []),
  ].join(" ").toLowerCase();
}

function firstNonEmpty(values: readonly (string | undefined)[]) {
  return values.find((value) => value?.trim())?.trim() ?? "";
}

function takeJoined(
  label: string,
  values: readonly string[] | undefined,
  count: number,
) {
  const taken = (values ?? []).slice(0, count);
  return taken.length > 0 ? `${label}: ${taken.join("; ")}.` : "";
}

function dedupeStrings(values: readonly string[]) {
  const seen = new Set<string>();
  return values.filter((value) => {
    const normalized = value.trim().toLowerCase();

    if (!normalized || seen.has(normalized)) {
      return false;
    }

    seen.add(normalized);
    return true;
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
