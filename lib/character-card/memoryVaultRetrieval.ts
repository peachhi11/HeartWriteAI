export type MemoryVaultBookType =
  | "character_book"
  | "memory_book"
  | "prompt_book"
  | "scenario_book"
  | "user_book"
  | "world_book";

export type MemoryVaultLayer =
  | "app_architecture"
  | "generator_pipeline"
  | "memory_core"
  | "prompt_compiler"
  | "qc"
  | "source_material"
  | "taxonomy";

export type MemoryVaultModelVisibility =
  | "blocked"
  | "librarian_only"
  | "local_only"
  | "selectable";

export type MemoryVaultPlatform =
  | "generic"
  | "janitor_ai"
  | "marinara"
  | "sillytavern";

export type MemoryVaultPrivacy =
  | "do_not_send"
  | "private"
  | "project"
  | "source_reference";

export type MemoryVaultSourceKind =
  | "decision"
  | "handoff"
  | "implementation"
  | "qc"
  | "runtime_design"
  | "source_material";

export interface MemoryVaultMarkdownFile {
  content: string;
  path: string;
  modifiedAt?: number;
  sourceVaultId?: string;
}

export interface MemoryVaultFrontmatter {
  aliases: string[];
  bookType?: MemoryVaultBookType;
  bootstrap: boolean;
  cascadeLinks: string[];
  characterId?: string;
  constant: boolean;
  contentHash?: string;
  customFields: Record<string, string | number | boolean | string[]>;
  excludes: string[];
  guideOnly: boolean;
  keys: string[];
  layer?: MemoryVaultLayer;
  modelVisibility: MemoryVaultModelVisibility;
  neverInsert: boolean;
  platform?: MemoryVaultPlatform;
  priority: number;
  privacy: MemoryVaultPrivacy;
  requires: string[];
  seed: boolean;
  sourceKind?: MemoryVaultSourceKind;
  storybookId?: string;
  summary?: string;
  tags: string[];
  title?: string;
  tokenEstimate?: number;
  userId?: string;
}

export interface MemoryVaultIndexEntry extends MemoryVaultFrontmatter {
  body: string;
  headings: string[];
  id: string;
  modifiedAt?: number;
  path: string;
  selectableText: string;
  sourceVaultId: string;
  title: string;
  tokenEstimate: number;
  wikilinks: string[];
}

export interface MemoryVaultIndex {
  buildId: string;
  builtAt: number;
  entries: MemoryVaultIndexEntry[];
  sourceVaultIds: string[];
  stale: boolean;
}

export interface MemoryVaultRetrievalQuery {
  allowGuideOnly?: boolean;
  allowLocalOnly?: boolean;
  bookTypes?: MemoryVaultBookType[];
  includeSourceMaterial?: boolean;
  layers?: MemoryVaultLayer[];
  maxEntries?: number;
  platform?: MemoryVaultPlatform;
  privacyMode?: "local" | "provider_safe";
  storybookId?: string;
  text: string;
  tokenBudget?: number;
}

export interface MemoryVaultRetrievalTrace {
  matched: Array<{
    id: string;
    path: string;
    reason: "alias" | "key" | "tag" | "text" | "title" | "wikilink";
    score: number;
    title: string;
  }>;
  removed: Array<{
    id: string;
    path: string;
    reason:
      | "book_type"
      | "budget"
      | "guide_only"
      | "layer"
      | "model_visibility"
      | "platform"
      | "privacy"
      | "source_material"
      | "storybook";
    title: string;
  }>;
  returned: Array<{
    id: string;
    path: string;
    title: string;
    tokens: number;
  }>;
  staleIndex: boolean;
}

export interface MemoryVaultRetrievalResult {
  entries: MemoryVaultIndexEntry[];
  trace: MemoryVaultRetrievalTrace;
}

interface RawFrontmatterParse {
  body: string;
  data: Record<string, string | number | boolean | string[]>;
}

const DEFAULT_PRIORITY = 50;
const DEFAULT_SOURCE_VAULT_ID = "heartwrite_memory_vault";

const knownFrontmatterKeys = new Set([
  "aliases",
  "book_type",
  "bookType",
  "bootstrap",
  "cascade_links",
  "cascadeLinks",
  "character_id",
  "characterId",
  "constant",
  "content_hash",
  "contentHash",
  "excludes",
  "guide_only",
  "guideOnly",
  "keys",
  "layer",
  "model_visibility",
  "modelVisibility",
  "never_insert",
  "neverInsert",
  "platform",
  "priority",
  "privacy",
  "requires",
  "seed",
  "source_kind",
  "sourceKind",
  "storybook_id",
  "storybookId",
  "summary",
  "tags",
  "title",
  "token_estimate",
  "tokenEstimate",
  "user_id",
  "userId",
]);

export function buildMemoryVaultIndex(
  files: MemoryVaultMarkdownFile[],
  options: {
    buildId?: string;
    builtAt?: number;
    defaultSourceVaultId?: string;
    stale?: boolean;
  } = {},
): MemoryVaultIndex {
  const defaultSourceVaultId =
    options.defaultSourceVaultId ?? DEFAULT_SOURCE_VAULT_ID;
  const entries = files.map((file) =>
    createMemoryVaultIndexEntry(file, {
      defaultSourceVaultId,
    }),
  );
  const sourceVaultIds = Array.from(
    new Set(entries.map((entry) => entry.sourceVaultId)),
  ).sort();

  return {
    buildId:
      options.buildId ??
      createStableHash(
        entries.map((entry) => `${entry.path}:${entry.contentHash}`).join("|"),
      ),
    builtAt: options.builtAt ?? Date.now(),
    entries,
    sourceVaultIds,
    stale: options.stale ?? false,
  };
}

export function createMemoryVaultIndexEntry(
  file: MemoryVaultMarkdownFile,
  options: { defaultSourceVaultId?: string } = {},
): MemoryVaultIndexEntry {
  const parsed = parseMarkdownFrontmatter(file.content);
  const frontmatter = normalizeMemoryVaultFrontmatter(parsed.data);
  const body = parsed.body.trim();
  const headings = extractMarkdownHeadings(body);
  const title =
    frontmatter.title ??
    headings[0] ??
    titleFromPath(file.path) ??
    "Untitled";
  const sourceVaultId =
    file.sourceVaultId ??
    options.defaultSourceVaultId ??
    DEFAULT_SOURCE_VAULT_ID;
  const wikilinks = extractWikilinks(file.content);
  const contentHash =
    frontmatter.contentHash ?? createStableHash(`${file.path}\n${body}`);
  const tokenEstimate =
    frontmatter.tokenEstimate ?? estimateTokens(`${title}\n${body}`);
  const id = createMemoryVaultEntryId({
    contentHash,
    path: file.path,
    sourceVaultId,
    storybookId: frontmatter.storybookId,
  });
  const selectableText = [
    title,
    frontmatter.summary,
    ...frontmatter.tags,
    ...frontmatter.keys,
    ...frontmatter.aliases,
    ...headings,
    ...wikilinks,
    body,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    ...frontmatter,
    body,
    contentHash,
    headings,
    id,
    modifiedAt: file.modifiedAt,
    path: file.path,
    selectableText,
    sourceVaultId,
    title,
    tokenEstimate,
    wikilinks,
  };
}

export function retrieveFromMemoryVaultIndex(
  index: MemoryVaultIndex,
  query: MemoryVaultRetrievalQuery,
): MemoryVaultRetrievalResult {
  const normalizedQuery = normalizeSearchText(query.text);
  const maxEntries = query.maxEntries ?? 8;
  const tokenBudget = query.tokenBudget ?? Number.POSITIVE_INFINITY;
  const trace: MemoryVaultRetrievalTrace = {
    matched: [],
    removed: [],
    returned: [],
    staleIndex: index.stale,
  };

  const candidates = index.entries
    .map((entry) => ({
      entry,
      match: scoreEntry(entry, normalizedQuery),
    }))
    .filter(({ match }) => match.score > 0)
    .sort((left, right) => {
      if (right.match.score !== left.match.score) {
        return right.match.score - left.match.score;
      }

      if (left.entry.priority !== right.entry.priority) {
        return left.entry.priority - right.entry.priority;
      }

      return left.entry.title.localeCompare(right.entry.title);
    });

  for (const candidate of candidates) {
    trace.matched.push({
      id: candidate.entry.id,
      path: candidate.entry.path,
      reason: candidate.match.reason,
      score: candidate.match.score,
      title: candidate.entry.title,
    });
  }

  const selected: MemoryVaultIndexEntry[] = [];
  let usedTokens = 0;

  for (const { entry } of candidates) {
    const removalReason = getRemovalReason(entry, query, usedTokens, tokenBudget);

    if (removalReason) {
      trace.removed.push({
        id: entry.id,
        path: entry.path,
        reason: removalReason,
        title: entry.title,
      });
      continue;
    }

    selected.push(entry);
    usedTokens += entry.tokenEstimate;
    trace.returned.push({
      id: entry.id,
      path: entry.path,
      title: entry.title,
      tokens: entry.tokenEstimate,
    });

    if (selected.length >= maxEntries) {
      break;
    }
  }

  return {
    entries: selected,
    trace,
  };
}

export function parseMarkdownFrontmatter(markdown: string): RawFrontmatterParse {
  const normalized = markdown.replace(/\r\n?/g, "\n");

  if (!normalized.startsWith("---\n")) {
    return {
      body: normalized,
      data: {},
    };
  }

  const end = normalized.indexOf("\n---", 4);

  if (end === -1) {
    return {
      body: normalized,
      data: {},
    };
  }

  const rawFrontmatter = normalized.slice(4, end);
  const bodyStart = normalized[end + 4] === "\n" ? end + 5 : end + 4;

  return {
    body: normalized.slice(bodyStart),
    data: parseSimpleYaml(rawFrontmatter),
  };
}

export function normalizeMemoryVaultFrontmatter(
  data: Record<string, string | number | boolean | string[]>,
): MemoryVaultFrontmatter {
  return {
    aliases: readStringArray(data, "aliases"),
    bookType: readEnum(data, ["book_type", "bookType"], isBookType),
    bootstrap: readBoolean(data, ["bootstrap"], false),
    cascadeLinks: readStringArray(data, "cascade_links", "cascadeLinks"),
    characterId: readString(data, "character_id", "characterId"),
    constant: readBoolean(data, ["constant"], false),
    contentHash: readString(data, "content_hash", "contentHash"),
    customFields: readCustomFields(data),
    excludes: readStringArray(data, "excludes"),
    guideOnly: readBoolean(data, ["guide_only", "guideOnly"], false),
    keys: readStringArray(data, "keys"),
    layer: readEnum(data, ["layer"], isLayer),
    modelVisibility:
      readEnum(data, ["model_visibility", "modelVisibility"], isVisibility) ??
      "selectable",
    neverInsert: readBoolean(data, ["never_insert", "neverInsert"], false),
    platform: readEnum(data, ["platform"], isPlatform),
    priority: readNumber(data, ["priority"]) ?? DEFAULT_PRIORITY,
    privacy:
      readEnum(data, ["privacy"], isPrivacy) ??
      "project",
    requires: readStringArray(data, "requires"),
    seed: readBoolean(data, ["seed"], false),
    sourceKind: readEnum(data, ["source_kind", "sourceKind"], isSourceKind),
    storybookId: readString(data, "storybook_id", "storybookId"),
    summary: readString(data, "summary"),
    tags: normalizeTags(readStringArray(data, "tags")),
    title: readString(data, "title"),
    tokenEstimate: readNumber(data, ["token_estimate", "tokenEstimate"]),
    userId: readString(data, "user_id", "userId"),
  };
}

export function createMemoryVaultEntryId(input: {
  contentHash: string;
  path: string;
  sourceVaultId: string;
  storybookId?: string;
}): string {
  const storybookSegment = input.storybookId ?? "global";

  return [
    input.sourceVaultId,
    storybookSegment,
    slugify(input.path),
    input.contentHash.slice(0, 10),
  ].join(":");
}

export function extractMarkdownHeadings(markdown: string): string[] {
  return markdown
    .split("\n")
    .map((line) => line.match(/^#{1,6}\s+(.+?)\s*#*$/)?.[1]?.trim())
    .filter((heading): heading is string => Boolean(heading));
}

export function extractWikilinks(markdown: string): string[] {
  const links = new Set<string>();
  const pattern = /\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(markdown)) !== null) {
    const link = match[1]?.trim();

    if (link) {
      links.add(link);
    }
  }

  return Array.from(links).sort();
}

export function createStableHash(input: string): string {
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function estimateTokens(text: string): number {
  const words = text.trim().match(/\S+/g)?.length ?? 0;

  return Math.max(1, Math.ceil(words * 1.3));
}

function parseSimpleYaml(
  source: string,
): Record<string, string | number | boolean | string[]> {
  const output: Record<string, string | number | boolean | string[]> = {};
  const lines = source.split("\n");

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (!line.trim() || line.trim().startsWith("#")) {
      continue;
    }

    const keyMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (!keyMatch) {
      continue;
    }

    const key = keyMatch[1];
    const rawValue = keyMatch[2].trim();

    if (rawValue === "") {
      const values: string[] = [];

      while (index + 1 < lines.length) {
        const nextLine = lines[index + 1];
        const listItem = nextLine.match(/^\s*-\s*(.+?)\s*$/);

        if (!listItem) {
          break;
        }

        values.push(unquote(listItem[1].trim()));
        index += 1;
      }

      output[key] = values;
      continue;
    }

    output[key] = parseScalarOrInlineArray(rawValue);
  }

  return output;
}

function parseScalarOrInlineArray(
  rawValue: string,
): string | number | boolean | string[] {
  if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
    const inner = rawValue.slice(1, -1).trim();

    if (!inner) {
      return [];
    }

    return inner.split(",").map((value) => unquote(value.trim()));
  }

  if (rawValue === "true") {
    return true;
  }

  if (rawValue === "false") {
    return false;
  }

  if (/^-?\d+(\.\d+)?$/.test(rawValue)) {
    return Number(rawValue);
  }

  return unquote(rawValue);
}

function unquote(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function readCustomFields(
  data: Record<string, string | number | boolean | string[]>,
): Record<string, string | number | boolean | string[]> {
  const customFields: Record<string, string | number | boolean | string[]> = {};

  for (const [key, value] of Object.entries(data)) {
    if (!knownFrontmatterKeys.has(key)) {
      customFields[key] = value;
    }
  }

  return customFields;
}

function readStringArray(
  data: Record<string, string | number | boolean | string[]>,
  ...keys: string[]
): string[] {
  for (const key of keys) {
    const value = data[key];

    if (Array.isArray(value)) {
      return value.map(String).map((item) => item.trim()).filter(Boolean);
    }

    if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function readString(
  data: Record<string, string | number | boolean | string[]>,
  ...keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = data[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function readNumber(
  data: Record<string, string | number | boolean | string[]>,
  keys: string[],
  fallback?: number,
): number | undefined {
  for (const key of keys) {
    const value = data[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && /^-?\d+(\.\d+)?$/.test(value)) {
      return Number(value);
    }
  }

  return fallback;
}

function readBoolean(
  data: Record<string, string | number | boolean | string[]>,
  keys: string[],
  fallback: boolean,
): boolean {
  for (const key of keys) {
    const value = data[key];

    if (typeof value === "boolean") {
      return value;
    }

    if (value === "true") {
      return true;
    }

    if (value === "false") {
      return false;
    }
  }

  return fallback;
}

function readEnum<T extends string>(
  data: Record<string, string | number | boolean | string[]>,
  keys: string[],
  guard: (value: string) => value is T,
): T | undefined {
  const value = readString(data, ...keys);

  if (value && guard(value)) {
    return value;
  }

  return undefined;
}

function normalizeTags(tags: string[]): string[] {
  return tags
    .flatMap((tag) => tag.split(/\s+/))
    .map((tag) => tag.replace(/^#/, "").trim())
    .filter(Boolean);
}

function scoreEntry(
  entry: MemoryVaultIndexEntry,
  normalizedQuery: string,
): {
  reason: "alias" | "key" | "tag" | "text" | "title" | "wikilink";
  score: number;
} {
  if (!normalizedQuery) {
    return {
      reason: "text",
      score: 1,
    };
  }

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  const title = normalizeSearchText(entry.title);

  if (title.includes(normalizedQuery)) {
    return {
      reason: "title",
      score: 100,
    };
  }

  if (containsAnyNormalized(entry.keys, normalizedQuery)) {
    return {
      reason: "key",
      score: 90,
    };
  }

  if (containsAnyNormalized(entry.aliases, normalizedQuery)) {
    return {
      reason: "alias",
      score: 80,
    };
  }

  if (containsAnyNormalized(entry.tags, normalizedQuery)) {
    return {
      reason: "tag",
      score: 70,
    };
  }

  if (containsAnyNormalized(entry.wikilinks, normalizedQuery)) {
    return {
      reason: "wikilink",
      score: 60,
    };
  }

  const selectableText = normalizeSearchText(entry.selectableText);
  const hits = queryTokens.filter((token) => selectableText.includes(token));

  return {
    reason: "text",
    score: hits.length,
  };
}

function getRemovalReason(
  entry: MemoryVaultIndexEntry,
  query: MemoryVaultRetrievalQuery,
  usedTokens: number,
  tokenBudget: number,
): MemoryVaultRetrievalTrace["removed"][number]["reason"] | undefined {
  if (entry.storybookId && entry.storybookId !== query.storybookId) {
    return "storybook";
  }

  if (query.bookTypes?.length && (!entry.bookType || !query.bookTypes.includes(entry.bookType))) {
    return "book_type";
  }

  if (query.layers?.length && (!entry.layer || !query.layers.includes(entry.layer))) {
    return "layer";
  }

  if (
    query.platform &&
    entry.platform &&
    entry.platform !== "generic" &&
    entry.platform !== query.platform
  ) {
    return "platform";
  }

  if (entry.guideOnly && !query.allowGuideOnly) {
    return "guide_only";
  }

  if (
    entry.modelVisibility === "blocked" ||
    entry.modelVisibility === "librarian_only" ||
    (entry.modelVisibility === "local_only" && !query.allowLocalOnly)
  ) {
    return "model_visibility";
  }

  if (
    query.privacyMode === "provider_safe" &&
    (entry.privacy === "private" || entry.privacy === "do_not_send")
  ) {
    return "privacy";
  }

  if (entry.sourceKind === "source_material" && !query.includeSourceMaterial) {
    return "source_material";
  }

  if (usedTokens + entry.tokenEstimate > tokenBudget) {
    return "budget";
  }

  return undefined;
}

function containsAnyNormalized(values: string[], normalizedQuery: string): boolean {
  return values.some((value) => {
    const normalizedValue = normalizeSearchText(value);

    return (
      normalizedValue.includes(normalizedQuery) ||
      normalizedQuery.includes(normalizedValue)
    );
  });
}

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9{}]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleFromPath(path: string): string | undefined {
  const fileName = path.split(/[\\/]/).pop()?.replace(/\.[^.]+$/, "");

  return fileName?.trim() || undefined;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
}

function isBookType(value: string): value is MemoryVaultBookType {
  return [
    "character_book",
    "memory_book",
    "prompt_book",
    "scenario_book",
    "user_book",
    "world_book",
  ].includes(value);
}

function isLayer(value: string): value is MemoryVaultLayer {
  return [
    "app_architecture",
    "generator_pipeline",
    "memory_core",
    "prompt_compiler",
    "qc",
    "source_material",
    "taxonomy",
  ].includes(value);
}

function isPlatform(value: string): value is MemoryVaultPlatform {
  return ["generic", "janitor_ai", "marinara", "sillytavern"].includes(value);
}

function isPrivacy(value: string): value is MemoryVaultPrivacy {
  return ["do_not_send", "private", "project", "source_reference"].includes(
    value,
  );
}

function isSourceKind(value: string): value is MemoryVaultSourceKind {
  return [
    "decision",
    "handoff",
    "implementation",
    "qc",
    "runtime_design",
    "source_material",
  ].includes(value);
}

function isVisibility(value: string): value is MemoryVaultModelVisibility {
  return ["blocked", "librarian_only", "local_only", "selectable"].includes(
    value,
  );
}
