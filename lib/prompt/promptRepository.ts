import { z } from "zod";

const promptIdSchema = z.string().trim().min(1);

export const PromptKindSchema = z.enum([
  "system",
  "writing",
  "feature",
  "safety",
  "compiler",
  "evaluation",
  "provider",
]);

export const PromptScopeSchema = z.enum([
  "global",
  "library",
  "storybook",
  "scene",
  "character",
  "persona",
  "provider",
]);

export const PromptSourceSchema = z.enum(["authored", "imported", "generated", "built_in"]);

export const PromptStatusSchema = z.enum(["draft", "active", "archived"]);

export const PromptRecordSchema = z
  .object({
    id: promptIdSchema,
    title: z.string().trim().min(1),
    body: z.string().trim().min(1),
    kind: PromptKindSchema,
    scope: PromptScopeSchema,
    source: PromptSourceSchema,
    status: PromptStatusSchema,
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .strict();

export type PromptRecord = z.infer<typeof PromptRecordSchema>;
export type PromptRecordDraft = Omit<PromptRecord, "createdAt" | "updatedAt"> &
  Partial<Pick<PromptRecord, "createdAt" | "updatedAt">>;

export interface PromptRepositoryStorageAdapter {
  get(): Promise<unknown | null>;
  set(records: PromptRecord[]): Promise<void>;
}

export interface PromptRepository {
  delete(id: string): Promise<void>;
  get(id: string): Promise<PromptRecord | null>;
  list(): Promise<PromptRecord[]>;
  save(draft: PromptRecordDraft): Promise<PromptRecord>;
}

export function createPromptRepository(input: {
  now?: () => string;
  storage?: PromptRepositoryStorageAdapter;
}): PromptRepository {
  const now = input.now ?? (() => new Date().toISOString());
  const storage = input.storage ?? createMemoryPromptStorage();

  return {
    async delete(id) {
      const normalizedId = promptIdSchema.parse(id);
      const records = await readRecords(storage);
      const nextRecords = records.filter((record) => record.id !== normalizedId);

      if (nextRecords.length !== records.length) {
        await storage.set(nextRecords);
      }
    },
    async get(id) {
      const normalizedId = promptIdSchema.parse(id);
      const record = (await readRecords(storage)).find(
        (candidate) => candidate.id === normalizedId,
      );

      return record ? PromptRecordSchema.parse(record) : null;
    },
    async list() {
      return (await readRecords(storage)).sort((left, right) =>
        right.updatedAt.localeCompare(left.updatedAt),
      );
    },
    async save(draft) {
      const parsedDraft = PromptRecordSchema.partial({
        createdAt: true,
        updatedAt: true,
      }).parse(draft);
      const timestamp = now();
      const records = await readRecords(storage);
      const existing = records.find((record) => record.id === parsedDraft.id);
      const record = PromptRecordSchema.parse({
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

export function createMemoryPromptStorage(
  seed: PromptRecord[] = [],
): PromptRepositoryStorageAdapter {
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

async function readRecords(storage: PromptRepositoryStorageAdapter) {
  return z.array(PromptRecordSchema).parse((await storage.get()) ?? []);
}
