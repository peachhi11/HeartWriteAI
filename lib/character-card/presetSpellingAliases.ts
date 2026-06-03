const WORD_ALIASES: Record<string, readonly string[]> = {
  analyse: ["analyze"],
  analyzed: ["analysed"],
  analysing: ["analyzing"],
  catalog: ["catalogue"],
  cataloged: ["catalogued"],
  cataloging: ["cataloguing"],
  color: ["colour"],
  colored: ["coloured"],
  coloring: ["colouring"],
  defense: ["defence"],
  gray: ["grey"],
  honor: ["honour"],
  honored: ["honoured"],
  honoring: ["honouring"],
  honorific: ["honourific"],
  honorifics: ["honourifics"],
  neutralize: ["neutralise"],
  neutralized: ["neutralised"],
  neutralizing: ["neutralising"],
  offense: ["offence"],
  program: ["programme"],
  sanitize: ["sanitise"],
  sanitized: ["sanitised"],
  sanitizing: ["sanitising"],
  standardize: ["standardise"],
  standardized: ["standardised"],
  standardizing: ["standardising"],
  theater: ["theatre"],
};

const REVERSE_WORD_ALIASES = Object.fromEntries(
  Object.entries(WORD_ALIASES).flatMap(([usSpelling, ukSpellings]) =>
    ukSpellings.map((ukSpelling) => [ukSpelling, usSpelling]),
  ),
) as Record<string, string>;

export function normalisePresetLookupToken(rawToken: string): string {
  return rawToken.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

export function expandPresetLookupTokens(rawToken: string): string[] {
  const normalizedToken = normalisePresetLookupToken(rawToken);
  if (!normalizedToken) {
    return [];
  }

  const candidates = new Set<string>();
  const words = normalizedToken.split("_");

  function expandWords(index: number, currentWords: string[]) {
    if (index >= words.length) {
      candidates.add(currentWords.join("_"));
      return;
    }

    const word = words[index];
    const candidateWords = [
      word,
      ...(WORD_ALIASES[word] ?? []),
      ...(REVERSE_WORD_ALIASES[word] ? [REVERSE_WORD_ALIASES[word]] : []),
    ];

    for (const candidateWord of candidateWords) {
      expandWords(index + 1, [...currentWords, candidateWord]);
    }
  }

  expandWords(0, []);

  return Array.from(candidates);
}
