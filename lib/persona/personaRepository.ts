import { z } from "zod";

const personaIdSchema = z.string().trim().min(1);

export const PersonaSourceSchema = z.enum(["blank", "authored", "generated", "imported"]);

export const PersonaRecordSchema = z
  .object({
    id: personaIdSchema,
    name: z.string().trim().min(1),
    prompt: z.string().default(""),
    summary: z.string().default(""),
    tags: z.array(z.string().trim().min(1)).max(12).default([]),
    source: PersonaSourceSchema.optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .strict();

export type PersonaRecord = z.infer<typeof PersonaRecordSchema>;
export type PersonaRecordDraft = Omit<PersonaRecord, "createdAt" | "updatedAt"> &
  Partial<Pick<PersonaRecord, "createdAt" | "updatedAt">>;

export interface PersonaRepositoryStorageAdapter {
  get(): Promise<unknown | null>;
  set(records: PersonaRecord[]): Promise<void>;
}

export interface PersonaRepository {
  delete(id: string): Promise<void>;
  get(id: string): Promise<PersonaRecord | null>;
  list(): Promise<PersonaRecord[]>;
  save(draft: PersonaRecordDraft): Promise<PersonaRecord>;
}

export function createPersonaRepository(input: {
  now?: () => string;
  storage?: PersonaRepositoryStorageAdapter;
}): PersonaRepository {
  const now = input.now ?? (() => new Date().toISOString());
  const storage = input.storage ?? createMemoryPersonaStorage();

  return {
    async delete(id) {
      const normalizedId = personaIdSchema.parse(id);
      const records = await readRecords(storage);
      const nextRecords = records.filter((record) => record.id !== normalizedId);

      if (nextRecords.length !== records.length) {
        await storage.set(nextRecords);
      }
    },
    async get(id) {
      const normalizedId = personaIdSchema.parse(id);
      const record = (await readRecords(storage)).find(
        (candidate) => candidate.id === normalizedId,
      );

      return record ? PersonaRecordSchema.parse(record) : null;
    },
    async list() {
      return (await readRecords(storage)).sort((left, right) =>
        right.updatedAt.localeCompare(left.updatedAt),
      );
    },
    async save(draft) {
      const parsedDraft = PersonaRecordSchema.partial({
        createdAt: true,
        updatedAt: true,
      }).parse(draft);
      const timestamp = now();
      const records = await readRecords(storage);
      const existing = records.find((record) => record.id === parsedDraft.id);
      const record = PersonaRecordSchema.parse({
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

export function createMemoryPersonaStorage(
  seed: PersonaRecord[] = [],
): PersonaRepositoryStorageAdapter {
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

async function readRecords(storage: PersonaRepositoryStorageAdapter) {
  return z.array(PersonaRecordSchema).parse((await storage.get()) ?? []);
}
