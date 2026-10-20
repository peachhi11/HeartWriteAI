import { z } from "zod";

const promptStackIdSchema = z.string().trim().min(1);

export const PromptStackScopeSchema = z.enum(["global", "library", "storybook", "scene"]);
export const PromptStackStatusSchema = z.enum(["draft", "active", "archived"]);
export const PromptStackIntentSchema = z.enum([
  "story_rule",
  "scene_guidance",
  "moment_guidance",
  "output_direction",
]);
export const PromptStackDurationSchema = z.enum([
  "storybook",
  "scene",
  "next_response",
  "until_resolved",
]);
export const PromptStackPlacementSchema = z.enum([
  "foundation",
  "world_before",
  "character",
  "persona",
  "scenario",
  "world_after",
  "examples",
  "history",
  "control",
  "post_history",
]);
export const PromptStackStrengthSchema = z.enum(["inform", "prefer", "require", "protected"]);

export const PromptStackInjectionSchema = z
  .object({
    mode: z.enum(["relative", "absolute"]),
    depth: z.number().int().min(0).optional(),
    order: z.number().int().min(0).optional(),
  })
  .strict()
  .superRefine((injection, context) => {
    if (
      injection.mode === "relative" &&
      (injection.depth !== undefined || injection.order !== undefined)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Relative injections cannot set depth or order",
      });
    }
  });

export const PromptStackEntrySchema = z
  .object({
    promptId: promptStackIdSchema,
    intent: PromptStackIntentSchema,
    duration: PromptStackDurationSchema,
    placement: PromptStackPlacementSchema,
    enabled: z.boolean(),
    order: z.number().int().min(0),
    strength: PromptStackStrengthSchema,
    injection: PromptStackInjectionSchema.optional(),
  })
  .strict();

export const PromptStackRecordSchema = z
  .object({
    id: promptStackIdSchema,
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    scope: PromptStackScopeSchema,
    status: PromptStackStatusSchema,
    entries: z.array(PromptStackEntrySchema).min(1),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .strict();

export type PromptStackEntry = z.infer<typeof PromptStackEntrySchema>;
export type PromptStackRecord = z.infer<typeof PromptStackRecordSchema>;
export type PromptStackRecordDraft = Omit<PromptStackRecord, "createdAt" | "updatedAt"> &
  Partial<Pick<PromptStackRecord, "createdAt" | "updatedAt">>;

export interface PromptStackRepositoryStorageAdapter {
  get(): Promise<unknown | null>;
  set(records: PromptStackRecord[]): Promise<void>;
}

export interface PromptStackRepository {
  delete(id: string): Promise<void>;
  get(id: string): Promise<PromptStackRecord | null>;
  list(): Promise<PromptStackRecord[]>;
  save(draft: PromptStackRecordDraft): Promise<PromptStackRecord>;
}

export function createPromptStackRepository(input: {
  now?: () => string;
  storage?: PromptStackRepositoryStorageAdapter;
}): PromptStackRepository {
  const now = input.now ?? (() => new Date().toISOString());
  const storage = input.storage ?? createMemoryPromptStackStorage();

  return {
    async delete(id) {
      const normalizedId = promptStackIdSchema.parse(id);
      const records = await readRecords(storage);
      const nextRecords = records.filter((record) => record.id !== normalizedId);

      if (nextRecords.length !== records.length) {
        await storage.set(nextRecords);
      }
    },
    async get(id) {
      const normalizedId = promptStackIdSchema.parse(id);
      const record = (await readRecords(storage)).find(
        (candidate) => candidate.id === normalizedId,
      );

      return record ? PromptStackRecordSchema.parse(record) : null;
    },
    async list() {
      return (await readRecords(storage)).sort((left, right) =>
        right.updatedAt.localeCompare(left.updatedAt),
      );
    },
    async save(draft) {
      const parsedDraft = PromptStackRecordSchema.partial({
        createdAt: true,
        updatedAt: true,
      }).parse(draft);
      const timestamp = now();
      const records = await readRecords(storage);
      const existing = records.find((record) => record.id === parsedDraft.id);
      const record = PromptStackRecordSchema.parse({
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

export function createMemoryPromptStackStorage(
  seed: PromptStackRecord[] = [],
): PromptStackRepositoryStorageAdapter {
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

async function readRecords(storage: PromptStackRepositoryStorageAdapter) {
  return z.array(PromptStackRecordSchema).parse((await storage.get()) ?? []);
}
