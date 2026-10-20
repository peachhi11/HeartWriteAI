import { z } from "zod";

const characterIdSchema = z.string().trim().min(1);

const CharacterCardFormValuesSchema = z
  .object({
    fullName: z.string(),
    aliasesNicknames: z.string(),
    ageBirthdate: z.string(),
    raceEthnicity: z.string(),
    species: z.string(),
    birthplace: z.string(),
    height: z.string(),
    description: z.string(),
    relationshipsConnections: z.string(),
    physicalAppearance: z.string(),
    personalityPsychology: z.string(),
    backgroundStory: z.string(),
    speechStyle: z.string(),
    intimacyProfile: z.string(),
    scenario: z.string(),
    first_mes: z.string(),
    mes_example: z.string(),
    creator_notes: z.string(),
    system_prompt: z.string(),
    post_history_instructions: z.string(),
    tagsText: z.string(),
    alternateOpenings: z.array(z.unknown()),
    groupOnlyGreetings: z.array(z.string()),
  })
  .strict();

export const CharacterRecordSchema = z
  .object({
    id: characterIdSchema,
    title: z.string().trim().min(1),
    values: CharacterCardFormValuesSchema,
    card: z.record(z.string(), z.unknown()).optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .strict();

export type CharacterRecord = z.infer<typeof CharacterRecordSchema>;
export type CharacterRecordDraft = Omit<CharacterRecord, "createdAt" | "updatedAt"> &
  Partial<Pick<CharacterRecord, "createdAt" | "updatedAt">>;

export interface CharacterRepositoryStorageAdapter {
  get(): Promise<unknown | null>;
  set(records: CharacterRecord[]): Promise<void>;
}

export interface CharacterRepository {
  delete(id: string): Promise<void>;
  get(id: string): Promise<CharacterRecord | null>;
  list(): Promise<CharacterRecord[]>;
  save(draft: CharacterRecordDraft): Promise<CharacterRecord>;
}

export function createCharacterRepository(input: {
  now?: () => string;
  storage?: CharacterRepositoryStorageAdapter;
}): CharacterRepository {
  const now = input.now ?? (() => new Date().toISOString());
  const storage = input.storage ?? createMemoryCharacterStorage();

  return {
    async delete(id) {
      const normalizedId = characterIdSchema.parse(id);
      const records = await readRecords(storage);
      const nextRecords = records.filter((record) => record.id !== normalizedId);

      if (nextRecords.length !== records.length) {
        await storage.set(nextRecords);
      }
    },
    async get(id) {
      const normalizedId = characterIdSchema.parse(id);
      const record = (await readRecords(storage)).find(
        (candidate) => candidate.id === normalizedId,
      );

      return record ? CharacterRecordSchema.parse(record) : null;
    },
    async list() {
      return (await readRecords(storage)).sort((left, right) =>
        right.updatedAt.localeCompare(left.updatedAt),
      );
    },
    async save(draft) {
      const parsedDraft = CharacterRecordSchema.partial({
        createdAt: true,
        updatedAt: true,
      }).parse(draft);
      const timestamp = now();
      const records = await readRecords(storage);
      const existing = records.find((record) => record.id === parsedDraft.id);
      const record = CharacterRecordSchema.parse({
        ...parsedDraft,
        createdAt: parsedDraft.createdAt ?? existing?.createdAt ?? timestamp,
        updatedAt: parsedDraft.updatedAt ?? timestamp,
      });
      const existingIndex = records.findIndex((candidate) => candidate.id === record.id);

      if (existingIndex === -1) {
        records.push(record);
      } else {
        records[existingIndex] = record;
      }

      await storage.set(records);
      return record;
    },
  };
}

export function createMemoryCharacterStorage(
  seed: CharacterRecord[] = [],
): CharacterRepositoryStorageAdapter {
  let records = [...seed];

  return {
    async get() {
      return records;
    },
    async set(nextRecords) {
      records = [...nextRecords];
    },
  };
}

async function readRecords(storage: CharacterRepositoryStorageAdapter) {
  return z.array(CharacterRecordSchema).parse((await storage.get()) ?? []);
}
