export type FieldKey =
  | "description"
  | "personality"
  | "scenario"
  | "first_mes"
  | "mes_example"
  | "creator_notes"
  | "tags";

export type FieldDetailLevel = "compact" | "balanced" | "expanded";

export type FieldDetailSettings = {
  level?: FieldDetailLevel;
  overrides?: Partial<Record<FieldKey, string>>;
};

const FIELD_DETAIL_LINES: Record<FieldDetailLevel, Record<FieldKey, string>> = {
  compact: {
    creator_notes:
      "- creator_notes: 2-4 concise notes covering usage, boundaries, tags, and edit intent.",
    description:
      "- description: 1 compact paragraph covering identity, role, presence, and strongest visual/story hooks.",
    first_mes:
      "- first_mes: 2-3 paragraphs, story-opening style, with concrete action, sensory anchor, dialogue, and a response hook.",
    mes_example:
      "- mes_example: 2-3 short exchanges using {{user}} and {{char}} labels, focused on voice and interaction style.",
    personality:
      "- personality: 1-2 paragraphs of executable behavior, values, flaws, defenses, voice, and relationship posture.",
    scenario:
      "- scenario: 1 compact paragraph defining reusable setting, relationship pressure, current situation, and open-ended contact point.",
    tags: "- tags: 6-12 short searchable tags.",
  },
  balanced: {
    creator_notes:
      "- creator_notes: 4-6 short notes covering intended use, content scope, tags, prompt-safe boundaries, and edit hints.",
    description:
      "- description: 2 paragraphs covering identity, appearance, role, atmosphere, and roleplay-relevant hooks without biography bloat.",
    first_mes:
      "- first_mes: 4-6 paragraphs, cinematic grounded prose, active scene start, at least one spoken line, and a clear handoff to {{user}}.",
    mes_example:
      "- mes_example: 3-5 exchanges using {{user}} and {{char}} labels; show voice, banter, conflict, care, and restraint.",
    personality:
      "- personality: 3-5 focused paragraphs or dense bullets covering traits, habits, flaws, fears, desires, defenses, social behavior, humor, conflict style, and speech.",
    scenario:
      "- scenario: 2-3 paragraphs defining durable world context, relationship status, current pressure, daily-life hooks, and what can change through play.",
    tags: "- tags: 8-16 short searchable tags; mix genre, trope, personality, setting, and content-scope terms.",
  },
  expanded: {
    creator_notes:
      "- creator_notes: 6-10 structured notes covering author intent, content scope, export caveats, relationship route, tags, and prompt-safe exclusions.",
    description:
      "- description: 3-5 polished paragraphs covering identity, appearance, social role, emotional presence, lifestyle, and story hooks.",
    first_mes:
      "- first_mes: 5-7 paragraphs, close scene prose, concrete setting pressure, active character behavior, quoted dialogue, subtext, and a strong response hook.",
    mes_example:
      "- mes_example: 5-8 exchanges using {{user}} and {{char}} labels; include ordinary talk, tension, vulnerability, disagreement, repair, and distinctive speech rhythm.",
    personality:
      "- personality: 5-8 rich sections or paragraphs covering behavioral traits, worldview, wounds, desires, defenses, attachment, conflict, humor, social habits, and voice rules.",
    scenario:
      "- scenario: 3-5 paragraphs defining reusable world rules, relationship context, current situation, social pressures, likely conflicts, and flexible opening lanes.",
    tags: "- tags: 12-24 short searchable tags; include high-value compatibility, genre, trope, setting, personality, and content-boundary tags.",
  },
};

export function buildFieldDetailLines(
  settings: FieldDetailSettings | undefined,
  fields: readonly FieldKey[],
): string[] {
  const level = settings?.level ?? "balanced";
  const table = FIELD_DETAIL_LINES[level] ?? FIELD_DETAIL_LINES.balanced;

  return fields.map((field) => settings?.overrides?.[field] ?? table[field]);
}
