#!/usr/bin/env node

/**
 * Generate deterministic HeartWriteAI test bots as CCV3 JSON cards.
 *
 * Run:
 *   npm run bots:generate -- --count=100 --concurrency=4
 *
 * Reproducible data:
 *   npm run bots:generate -- --count=100 --seed=12345
 */

import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";

import type { CharacterCardPayload } from "../types/character-card/CharacterCardPayload";
import { createCharacterCardFromFormValues } from "../lib/character-card/createCharacterCardFromFormValues";
import { createEmptyCharacterCardFormValues } from "../lib/character-card/createEmptyCharacterCardFormValues";

const FIRST_NAMES = [
  "Alex", "Blake", "Casey", "Drew", "Eden", "Finley", "Gray", "Harley",
  "Ivy", "Jade", "Kai", "Lake", "Morgan", "Nova", "Ocean", "Parker",
  "Quinn", "River", "Sky", "Tatum", "Vale", "Willow", "Xander", "Yuki",
  "Zane",
] as const;

const LAST_NAMES = [
  "Anderson", "Brooks", "Chen", "Davis", "Evans", "Foster", "Gray",
  "Harris", "Ito", "Johnson", "Kim", "Lee", "Martinez", "Nguyen",
  "Ortiz", "Patel", "Quinn", "Rodriguez", "Smith", "Taylor", "Ueda",
  "Valdez", "Wang", "Xu", "Young",
] as const;

const ADJECTIVES = [
  "curious", "brave", "witty", "kind", "creative", "analytical",
  "cheerful", "mysterious", "adventurous", "thoughtful", "energetic",
  "calm", "passionate", "logical", "artistic", "determined",
  "optimistic", "intuitive", "disciplined", "imaginative",
] as const;

const CATEGORIES = [
  "Character",
  "Assistant",
  "Roleplay",
  "Educational",
] as const;

const TAG_GROUPS = [
  ["friendly", "helpful"],
  ["mysterious", "dark"],
  ["funny", "silly"],
  ["serious", "professional"],
  ["kind", "caring"],
  ["bold", "confident"],
  ["smart", "analytical"],
  ["creative", "artistic"],
  ["calm", "peaceful"],
  ["energetic", "enthusiastic"],
  ["romantic", "passionate"],
  ["adventurous", "explorer"],
] as const;

const TAGS = Array.from(new Set(TAG_GROUPS.flat()));
const NAME_POOL = FIRST_NAMES.flatMap((firstName) =>
  LAST_NAMES.map((lastName) => `${firstName} ${lastName}`),
);

type Category = (typeof CATEGORIES)[number];
type RandomGenerator = () => number;

export interface BotProfile {
  name: string;
  displayName: string;
  description: string;
  category: Category;
  tags: string[];
}

export interface GenerateOptions {
  count?: number;
  concurrency?: number;
  seed?: number;
  runId?: string;
  logEvery?: number;
  outputDir?: string;
}

export interface GenerationFailure {
  index: number;
  name: string;
  message: string;
}

export interface GenerationResult {
  attempted: number;
  created: number;
  failed: number;
  seed: number;
  runId: string;
  outputDir: string;
  manifestPath: string;
  files: string[];
  failures: GenerationFailure[];
}

const CATEGORY_NOUNS: Record<Category, string> = {
  Character: "character",
  Assistant: "assistant",
  Roleplay: "roleplay companion",
  Educational: "educational guide",
};

export function createRandomGenerator(seed: number): RandomGenerator {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) | 0;

    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function randomItem<T>(
  items: readonly T[],
  random: RandomGenerator,
): T {
  if (items.length === 0) {
    throw new Error("Cannot select an item from an empty array.");
  }

  return items[Math.floor(random() * items.length)]!;
}

function sampleDistinct<T>(
  items: readonly T[],
  requestedCount: number,
  random: RandomGenerator,
): T[] {
  const pool = [...items];
  const count = Math.min(requestedCount, pool.length);

  for (let index = 0; index < count; index += 1) {
    const swapIndex =
      index + Math.floor(random() * (pool.length - index));

    const current = pool[index]!;
    pool[index] = pool[swapIndex]!;
    pool[swapIndex] = current;
  }

  return pool.slice(0, count);
}

function shuffled<T>(
  items: readonly T[],
  random: RandomGenerator,
): T[] {
  return sampleDistinct(items, items.length, random);
}

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function assertPositiveInteger(value: number, name: string): void {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new RangeError(`${name} must be a positive integer.`);
  }
}

export function createProfiles(
  count: number,
  runId: string,
  random: RandomGenerator,
): BotProfile[] {
  const names = shuffled(NAME_POOL, random);
  const normalizedRunId = slugify(runId);

  if (!normalizedRunId) {
    throw new Error("runId must contain at least one letter or number.");
  }

  return Array.from({ length: count }, (_, index) => {
    const baseName = names[index % names.length]!;
    const repetition = Math.floor(index / names.length);
    const displayName =
      repetition === 0
        ? baseName
        : `${baseName} ${repetition + 1}`;
    const adjective = randomItem(ADJECTIVES, random);
    const category = randomItem(CATEGORIES, random);
    const tagCount = 1 + Math.floor(random() * 3);

    return {
      name: [
        slugify(baseName),
        normalizedRunId,
        String(index + 1).padStart(3, "0"),
      ].join("-"),
      displayName,
      description: `${capitalize(adjective)} ${
        CATEGORY_NOUNS[category]
      } created for HeartWriteAI testing.`,
      category,
      tags: sampleDistinct(TAGS, tagCount, random),
    };
  });
}

export function createCardPayloadFromProfile(
  profile: BotProfile,
  seed: number,
  runId: string,
): CharacterCardPayload {
  const values = {
    ...createEmptyCharacterCardFormValues(),
    fullName: profile.displayName,
    aliasesNicknames: profile.name,
    ageBirthdate: "Adult",
    species: "Human",
    description: profile.description,
    personalityPsychology: [
      `${profile.displayName} is a ${profile.category.toLowerCase()} test bot.`,
      `Core tags: ${profile.tags.join(", ")}.`,
      "Generated for fixture, library, import/export, and filtering tests.",
    ].join("\n"),
    backgroundStory:
      "Synthetic BotWaffle-style profile generated locally for HeartWriteAI testing.",
    speechStyle:
      "Clear, compact, and easy to scan in automated test previews.",
    scenario:
      "{{char}} is available as a deterministic test card in the local library.",
    first_mes:
      `"Generated test profile ready. What would you like to verify first?"`,
    creator_notes: [
      `Generated test bot.`,
      `Seed: ${seed}`,
      `Run ID: ${runId}`,
      "Safe synthetic fixture content only.",
    ].join("\n"),
    system_prompt:
      "Stay in character as a synthetic test bot. Keep responses concise and non-explicit.",
    post_history_instructions:
      "Preserve user agency and avoid inventing private user intent.",
    tagsText: [
      "botwaffle",
      "test-bot",
      "generated",
      profile.category.toLowerCase(),
      ...profile.tags,
    ].join(", "),
  };

  return createCharacterCardFromFormValues(
    {
      spec: "chara_card_v3",
      spec_version: "3.0",
      data: {
        name: profile.displayName,
      },
    },
    values,
  );
}

export async function generateTestBots(
  options: GenerateOptions = {},
): Promise<GenerationResult> {
  const count = options.count ?? 100;
  const concurrency = options.concurrency ?? 4;
  const logEvery = options.logEvery ?? 10;
  const seed =
    options.seed ?? randomBytes(4).readUInt32LE(0);
  const runId =
    options.runId ??
    `${Date.now().toString(36)}-${seed.toString(36)}`;
  const outputDir = resolve(
    options.outputDir ??
      join(process.cwd(), "local-card-staging", "generated-test-bots", runId),
  );

  assertPositiveInteger(count, "count");
  assertPositiveInteger(concurrency, "concurrency");
  assertPositiveInteger(logEvery, "logEvery");

  const random = createRandomGenerator(seed);
  const profiles = createProfiles(count, runId, random);

  await mkdir(outputDir, { recursive: true });

  console.info(
    `[bots] Generating ${count} bots ` +
      `(concurrency=${concurrency}, seed=${seed}, runId=${runId})`,
  );

  let cursor = 0;
  let completed = 0;
  let created = 0;
  const files: string[] = [];
  const failures: GenerationFailure[] = [];

  async function worker(): Promise<void> {
    while (true) {
      const index = cursor;
      cursor += 1;

      if (index >= profiles.length) {
        return;
      }

      const profile = profiles[index]!;
      const filename = `${profile.name}.json`;

      try {
        const card = createCardPayloadFromProfile(profile, seed, runId);
        await writeFile(
          join(outputDir, filename),
          `${JSON.stringify(card, null, 2)}\n`,
          "utf8",
        );
        files.push(filename);
        created += 1;
      } catch (error) {
        failures.push({
          index: index + 1,
          name: profile.name,
          message: errorMessage(error),
        });
      } finally {
        completed += 1;

        if (
          completed % logEvery === 0 ||
          completed === profiles.length
        ) {
          console.info(
            `[bots] ${completed}/${count} processed ` +
              `(${created} created, ${failures.length} failed)`,
          );
        }
      }
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(concurrency, profiles.length) },
      () => worker(),
    ),
  );

  failures.sort((left, right) => left.index - right.index);
  files.sort((left, right) => left.localeCompare(right));

  for (const failure of failures) {
    console.error(
      `[bots] Bot ${failure.index} (${failure.name}): ` +
        failure.message,
    );
  }

  const manifestPath = join(outputDir, "manifest.json");
  const result: GenerationResult = {
    attempted: count,
    created,
    failed: failures.length,
    seed,
    runId,
    outputDir,
    manifestPath,
    files,
    failures,
  };

  await writeFile(
    manifestPath,
    `${JSON.stringify(result, null, 2)}\n`,
    "utf8",
  );

  console.info(
    `[bots] Complete: ${result.created} created, ` +
      `${result.failed} failed. Output: ${outputDir}`,
  );

  return result;
}

function parsePositiveInteger(
  value: string,
  argumentName: string,
): number {
  const parsed = Number(value);

  assertPositiveInteger(parsed, argumentName);
  return parsed;
}

function parseSeed(value: string): number {
  const parsed = Number(value);

  if (
    !Number.isInteger(parsed) ||
    parsed < 0 ||
    parsed > 0xffff_ffff
  ) {
    throw new RangeError(
      "--seed must be an integer between 0 and 4294967295.",
    );
  }

  return parsed;
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      count: {
        type: "string",
        short: "n",
        default: "100",
      },
      concurrency: {
        type: "string",
        short: "c",
        default: "4",
      },
      seed: {
        type: "string",
      },
      "run-id": {
        type: "string",
      },
      "output-dir": {
        type: "string",
      },
    },
    strict: true,
    allowPositionals: false,
  });

  const seed =
    values.seed === undefined
      ? undefined
      : parseSeed(values.seed);

  const result = await generateTestBots({
    count: parsePositiveInteger(values.count, "--count"),
    concurrency: parsePositiveInteger(
      values.concurrency,
      "--concurrency",
    ),
    ...(seed === undefined ? {} : { seed }),
    ...(values["run-id"]
      ? { runId: values["run-id"] }
      : {}),
    ...(values["output-dir"]
      ? { outputDir: values["output-dir"] }
      : {}),
  });

  if (result.failed > 0) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main().catch((error: unknown) => {
    console.error("[bots] Fatal error:", error);
    process.exitCode = 1;
  });
}
