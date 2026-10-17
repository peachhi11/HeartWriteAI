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

export interface MemoryRepository {
  get(storyBookId: string, memoryId: string): Promise<MemoryRecord | null>;
  save(draft: MemoryRecordDraft): Promise<MemoryRecord>;
}

export function createMemoryRepository(input: { now?: () => string } = {}): MemoryRepository {
  const now = input.now ?? (() => new Date().toISOString());
  const records = new Map<string, MemoryRecord>();

  return {
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
  };
}

function memoryRecordKey(storyBookId: string, memoryId: string) {
  return `${storyBookId}:${memoryId}`;
}
