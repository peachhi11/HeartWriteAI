import { z } from "zod";

const memoryIdSchema = z.string().trim().min(1);
const storyBookIdSchema = z.string().trim().min(1);
const nullableStoryBookIdSchema = storyBookIdSchema.nullable();

export const MemoryRecordKindSchema = z.enum([
  "episodic",
  "relationship",
  "knowledge",
  "secret",
  "residue",
]);

export const MemoryRecordSourceSchema = z.enum(["authored", "imported", "derived", "runtime"]);

export const MemoryRecordPrivacySchema = z.enum(["private", "project", "do_not_send"]);

export const MemoryRecordStatusSchema = z.enum(["active", "superseded", "retired"]);

export const MemoryRecordSchema = z
  .object({
    id: memoryIdSchema,
    storyBookId: nullableStoryBookIdSchema,
    originalMemoryId: memoryIdSchema.optional(),
    kind: MemoryRecordKindSchema,
    content: z.string().trim().min(1),
    source: MemoryRecordSourceSchema,
    sourceReference: z.string().trim().min(1).optional(),
    privacy: MemoryRecordPrivacySchema,
    status: MemoryRecordStatusSchema,
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .strict();

export type MemoryRecord = z.infer<typeof MemoryRecordSchema>;
export type MemoryRecordDraft = Omit<MemoryRecord, "createdAt" | "updatedAt"> &
  Partial<Pick<MemoryRecord, "createdAt" | "updatedAt">>;
const MemoryRecordUpdateSchema = MemoryRecordSchema.omit({
  id: true,
  storyBookId: true,
  originalMemoryId: true,
  createdAt: true,
  updatedAt: true,
}).partial();
export type MemoryRecordUpdate = z.infer<typeof MemoryRecordUpdateSchema>;

export interface MemoryRepositoryStorageAdapter {
  get(): Promise<unknown | null>;
  set(records: MemoryRecord[]): Promise<void>;
}

export interface MemoryRepository {
  delete(storyBookId: string, memoryId: string): Promise<void>;
  get(storyBookId: string, memoryId: string): Promise<MemoryRecord | null>;
  listNeedsStoryBook(): Promise<MemoryRecord[]>;
  reassign(memoryId: string, storyBookId: string): Promise<MemoryRecord>;
  revise(storyBookId: string, memoryId: string, changes: MemoryRecordUpdate): Promise<MemoryRecord>;
  save(draft: MemoryRecordDraft): Promise<MemoryRecord>;
  unassign(storyBookId: string, memoryId: string): Promise<MemoryRecord>;
  update(storyBookId: string, memoryId: string, changes: MemoryRecordUpdate): Promise<MemoryRecord>;
}

export function createMemoryRepository(input: {
  createRevisionId?: (record: MemoryRecord) => string;
  now?: () => string;
  storage?: MemoryRepositoryStorageAdapter;
  storyBookExists: (storyBookId: string) => Promise<boolean>;
}): MemoryRepository {
  const now = input.now ?? (() => new Date().toISOString());
  const storage = input.storage ?? createMemoryRepositoryStorage();
  let revisionSequence = 0;

  return {
    async delete(storyBookId, memoryId) {
      const records = await readRecords(storage);
      const key = memoryRecordKey(
        storyBookIdSchema.parse(storyBookId),
        memoryIdSchema.parse(memoryId),
      );
      const nextRecords = records.filter(
        (record) => memoryRecordKey(record.storyBookId, record.id) !== key,
      );

      if (nextRecords.length !== records.length) {
        await storage.set(nextRecords);
      }
    },
    async get(storyBookId, memoryId) {
      const key = memoryRecordKey(
        storyBookIdSchema.parse(storyBookId),
        memoryIdSchema.parse(memoryId),
      );
      const record = (await readRecords(storage)).find(
        (candidate) => memoryRecordKey(candidate.storyBookId, candidate.id) === key,
      );

      return record ? MemoryRecordSchema.parse(record) : null;
    },
    async listNeedsStoryBook() {
      return (await readRecords(storage))
        .filter((record) => record.storyBookId === null)
        .map((record) => MemoryRecordSchema.parse(record));
    },
    async reassign(memoryId, storyBookId) {
      const normalizedMemoryId = memoryIdSchema.parse(memoryId);
      const normalizedStoryBookId = storyBookIdSchema.parse(storyBookId);
      await assertStoryBookExists(normalizedStoryBookId, input.storyBookExists);
      const records = await readRecords(storage);
      const existingIndex = records.findIndex(
        (record) => record.id === normalizedMemoryId && record.storyBookId === null,
      );
      const existing = existingIndex === -1 ? undefined : records[existingIndex];

      if (!existing) {
        throw new Error(`Unassigned memory record not found: ${normalizedMemoryId}`);
      }

      if (
        records.some(
          (record, index) =>
            index !== existingIndex &&
            record.storyBookId === normalizedStoryBookId &&
            record.id === normalizedMemoryId,
        )
      ) {
        throw new Error(
          `Memory record already exists in StoryBook: ${normalizedStoryBookId}/${normalizedMemoryId}`,
        );
      }

      const reassigned = MemoryRecordSchema.parse({
        ...existing,
        storyBookId: normalizedStoryBookId,
        updatedAt: now(),
      });
      records[existingIndex] = reassigned;
      await storage.set(records);
      return reassigned;
    },
    async revise(storyBookId, memoryId, changes) {
      const normalizedStoryBookId = storyBookIdSchema.parse(storyBookId);
      const normalizedMemoryId = memoryIdSchema.parse(memoryId);
      const key = memoryRecordKey(normalizedStoryBookId, normalizedMemoryId);
      await assertStoryBookExists(normalizedStoryBookId, input.storyBookExists);
      const records = await readRecords(storage);
      const existingIndex = records.findIndex(
        (record) => memoryRecordKey(record.storyBookId, record.id) === key,
      );
      const existing = existingIndex === -1 ? undefined : records[existingIndex];

      if (!existing) {
        throw new Error(`Memory record not found: ${normalizedStoryBookId}/${normalizedMemoryId}`);
      }

      const parsedChanges = MemoryRecordUpdateSchema.parse(changes);
      const originalMemoryId = existing.originalMemoryId ?? existing.id;
      const revisionId =
        input.createRevisionId?.(existing) ?? `${existing.id}:revision:${++revisionSequence}`;
      const revisionTimestamp = now();
      const revision = MemoryRecordSchema.parse({
        ...existing,
        ...parsedChanges,
        id: revisionId,
        originalMemoryId,
        status: "active",
        createdAt: revisionTimestamp,
        updatedAt: revisionTimestamp,
      });

      records[existingIndex] = { ...existing, status: "superseded", updatedAt: now() };
      records.push(revision);
      await storage.set(records);
      return revision;
    },
    async save(draft) {
      const parsedDraft = MemoryRecordSchema.partial({
        createdAt: true,
        updatedAt: true,
      }).parse(draft);
      const timestamp = now();
      const record = MemoryRecordSchema.parse({
        ...parsedDraft,
        createdAt: parsedDraft.createdAt ?? timestamp,
        updatedAt: parsedDraft.updatedAt ?? timestamp,
      });

      if (record.storyBookId) {
        await assertStoryBookExists(record.storyBookId, input.storyBookExists);
      }

      const records = await readRecords(storage);
      const existingIndex = records.findIndex(
        (candidate) =>
          memoryRecordKey(candidate.storyBookId, candidate.id) ===
          memoryRecordKey(record.storyBookId, record.id),
      );

      if (existingIndex === -1) {
        records.push(record);
      } else {
        records[existingIndex] = record;
      }
      await storage.set(records);
      return record;
    },
    async unassign(storyBookId, memoryId) {
      const normalizedStoryBookId = storyBookIdSchema.parse(storyBookId);
      const normalizedMemoryId = memoryIdSchema.parse(memoryId);
      const key = memoryRecordKey(normalizedStoryBookId, normalizedMemoryId);
      const records = await readRecords(storage);
      const existingIndex = records.findIndex(
        (record) => memoryRecordKey(record.storyBookId, record.id) === key,
      );
      const existing = existingIndex === -1 ? undefined : records[existingIndex];

      if (!existing) {
        throw new Error(`Memory record not found: ${normalizedStoryBookId}/${normalizedMemoryId}`);
      }

      if (
        records.some((record) => record.storyBookId === null && record.id === normalizedMemoryId)
      ) {
        throw new Error(`Memory record already needs a StoryBook: ${normalizedMemoryId}`);
      }

      const unassigned = MemoryRecordSchema.parse({
        ...existing,
        storyBookId: null,
        updatedAt: now(),
      });
      records[existingIndex] = unassigned;
      await storage.set(records);
      return unassigned;
    },
    async update(storyBookId, memoryId, changes) {
      const normalizedStoryBookId = storyBookIdSchema.parse(storyBookId);
      const normalizedMemoryId = memoryIdSchema.parse(memoryId);
      const key = memoryRecordKey(normalizedStoryBookId, normalizedMemoryId);
      await assertStoryBookExists(normalizedStoryBookId, input.storyBookExists);
      const records = await readRecords(storage);
      const existingIndex = records.findIndex(
        (record) => memoryRecordKey(record.storyBookId, record.id) === key,
      );
      const existing = existingIndex === -1 ? undefined : records[existingIndex];

      if (!existing) {
        throw new Error(`Memory record not found: ${normalizedStoryBookId}/${normalizedMemoryId}`);
      }

      if (Object.hasOwn(changes, "content")) {
        throw new Error("Use revise() to edit memory content without overwriting its original");
      }
      const parsedChanges = MemoryRecordUpdateSchema.parse(changes);
      const updated = MemoryRecordSchema.parse({
        ...existing,
        ...parsedChanges,
        updatedAt: now(),
      });

      records[existingIndex] = updated;
      await storage.set(records);
      return updated;
    },
  };
}

export function createMemoryRepositoryStorage(
  seed: MemoryRecord[] = [],
): MemoryRepositoryStorageAdapter & { readRawStoredValue(): unknown } {
  let records = [...seed];

  return {
    async get() {
      return records;
    },
    async set(nextRecords) {
      records = [...nextRecords];
    },
    readRawStoredValue() {
      return records;
    },
  };
}

async function readRecords(storage: MemoryRepositoryStorageAdapter): Promise<MemoryRecord[]> {
  const stored = await storage.get();

  return z.array(MemoryRecordSchema).parse(stored ?? []);
}

async function assertStoryBookExists(
  storyBookId: string,
  storyBookExists: (storyBookId: string) => Promise<boolean>,
) {
  if (!(await storyBookExists(storyBookId))) {
    throw new Error(`StoryBook not found: ${storyBookId}`);
  }
}

function memoryRecordKey(storyBookId: string | null, memoryId: string) {
  return `${storyBookId ?? "needs-storybook"}:${memoryId}`;
}
