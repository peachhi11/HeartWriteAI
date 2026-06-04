const WORD_ALIASES: Record<string, readonly string[]> = {
  analyse: ["analyze"],
  analyzed: ["analysed"],
  analysing: ["analyzing"],
  apologise: ["apologize"],
  apologised: ["apologized"],
  apologises: ["apologizes"],
  apologising: ["apologizing"],
  artefact: ["artifact"],
  behaviour: ["behavior"],
  behaviours: ["behaviors"],
  catalog: ["catalogue"],
  cataloged: ["catalogued"],
  cataloging: ["cataloguing"],
  centre: ["center"],
  color: ["colour"],
  colored: ["coloured"],
  coloring: ["colouring"],
  defense: ["defence"],
  favorite: ["favourite"],
  favorites: ["favourites"],
  flavor: ["flavour"],
  flavors: ["flavours"],
  gray: ["grey"],
  honor: ["honour"],
  honored: ["honoured"],
  honoring: ["honouring"],
  honorific: ["honourific"],
  honorifics: ["honourifics"],
  humor: ["humour"],
  humorist: ["humourist"],
  jewelry: ["jewellery"],
  judgment: ["judgement"],
  judgments: ["judgements"],
  labor: ["labour"],
  labored: ["laboured"],
  laboring: ["labouring"],
  labors: ["labours"],
  maneuver: ["manoeuvre", "manoeuver"],
  maneuvered: ["manoeuvred", "manoeuvered"],
  maneuvering: ["manoeuvring", "manoeuvering"],
  maneuvers: ["manoeuvres", "manoeuvers"],
  neutralize: ["neutralise"],
  neutralized: ["neutralised"],
  neutralizing: ["neutralising"],
  neighbor: ["neighbour"],
  neighborhood: ["neighbourhood"],
  neighboring: ["neighbouring"],
  neighbors: ["neighbours"],
  offense: ["offence"],
  organize: ["organise"],
  organized: ["organised"],
  organizer: ["organiser"],
  organizers: ["organisers"],
  organizes: ["organises"],
  organizing: ["organising"],
  prioritize: ["prioritise"],
  prioritized: ["prioritised"],
  prioritizes: ["prioritises"],
  prioritizing: ["prioritising"],
  program: ["programme"],
  realize: ["realise"],
  realized: ["realised"],
  realizes: ["realises"],
  realizing: ["realising"],
  recognize: ["recognise"],
  recognized: ["recognised"],
  recognizes: ["recognises"],
  recognizing: ["recognising"],
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
