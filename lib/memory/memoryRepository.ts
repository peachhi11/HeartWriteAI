import { z } from "zod";

const memoryIdSchema = z.string().trim().min(1);
const storyBookIdSchema = z.string().trim().min(1);

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
    storyBookId: storyBookIdSchema,
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
  createdAt: true,
  updatedAt: true,
}).partial();
export type MemoryRecordUpdate = z.infer<typeof MemoryRecordUpdateSchema>;

export interface MemoryRepository {
  delete(storyBookId: string, memoryId: string): Promise<void>;
  get(storyBookId: string, memoryId: string): Promise<MemoryRecord | null>;
  save(draft: MemoryRecordDraft): Promise<MemoryRecord>;
  update(storyBookId: string, memoryId: string, changes: MemoryRecordUpdate): Promise<MemoryRecord>;
}

export function createMemoryRepository(input: { now?: () => string } = {}): MemoryRepository {
  const now = input.now ?? (() => new Date().toISOString());
  const records = new Map<string, MemoryRecord>();

  return {
    async delete(storyBookId, memoryId) {
      records.delete(
        memoryRecordKey(storyBookIdSchema.parse(storyBookId), memoryIdSchema.parse(memoryId)),
      );
    },
    async get(storyBookId, memoryId) {
      const key = memoryRecordKey(
        storyBookIdSchema.parse(storyBookId),
        memoryIdSchema.parse(memoryId),
      );
      const record = records.get(key);

      return record ? MemoryRecordSchema.parse(record) : null;
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

      records.set(memoryRecordKey(record.storyBookId, record.id), record);
      return record;
    },
    async update(storyBookId, memoryId, changes) {
      const normalizedStoryBookId = storyBookIdSchema.parse(storyBookId);
      const normalizedMemoryId = memoryIdSchema.parse(memoryId);
      const key = memoryRecordKey(normalizedStoryBookId, normalizedMemoryId);
      const existing = records.get(key);

      if (!existing) {
        throw new Error(`Memory record not found: ${normalizedStoryBookId}/${normalizedMemoryId}`);
      }

      const parsedChanges = MemoryRecordUpdateSchema.parse(changes);
      const updated = MemoryRecordSchema.parse({
        ...existing,
        ...parsedChanges,
        updatedAt: now(),
      });

      records.set(key, updated);
      return updated;
    },
  };
}

function memoryRecordKey(storyBookId: string, memoryId: string) {
  return `${storyBookId}:${memoryId}`;
}
