import { z } from "zod";

const storyBookIdSchema = z.string().trim().min(1);

export const StoryBookStatusSchema = z.enum(["draft", "active", "archived"]);

export const StoryBookSchema = z
  .object({
    id: storyBookIdSchema,
    title: z.string().trim().min(1),
    summary: z.string().default(""),
    status: StoryBookStatusSchema,
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .strict();

export type StoryBook = z.infer<typeof StoryBookSchema>;
export type StoryBookDraft = Pick<StoryBook, "id" | "title" | "summary" | "status"> &
  Partial<Pick<StoryBook, "createdAt" | "updatedAt">>;

export interface StoryBookStorageAdapter {
  delete(id: string): Promise<void>;
  get(id: string): Promise<unknown | null>;
  list(): Promise<unknown[]>;
  set(id: string, value: StoryBook): Promise<void>;
}

export interface StoryBookRepository {
  delete(id: string): Promise<void>;
  get(id: string): Promise<StoryBook | null>;
  list(): Promise<StoryBook[]>;
  save(input: StoryBookDraft): Promise<StoryBook>;
}

export function createStoryBookRepository(input: {
  now?: () => string;
  storage: StoryBookStorageAdapter;
}): StoryBookRepository {
  const now = input.now ?? (() => new Date().toISOString());

  return {
    async delete(id) {
      await input.storage.delete(storyBookIdSchema.parse(id));
    },
    async get(id) {
      const value = await input.storage.get(storyBookIdSchema.parse(id));

      return value === null ? null : StoryBookSchema.parse(value);
    },
    async list() {
      const books = (await input.storage.list()).map((value) => StoryBookSchema.parse(value));

      return books.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
    },
    async save(draft) {
      const id = storyBookIdSchema.parse(draft.id);
      const existing = await this.get(id);
      const timestamp = now();
      const book = StoryBookSchema.parse({
        ...draft,
        id,
        createdAt: draft.createdAt ?? existing?.createdAt ?? timestamp,
        updatedAt: timestamp,
      });

      await input.storage.set(id, book);
      return book;
    },
  };
}

export function createMemoryStoryBookStorage(seed: StoryBook[] = []): StoryBookStorageAdapter {
  const values = new Map(seed.map((book) => [book.id, book]));

  return {
    async delete(id) {
      values.delete(id);
    },
    async get(id) {
      return values.get(id) ?? null;
    },
    async list() {
      return [...values.values()];
    },
    async set(id, value) {
      values.set(id, value);
    },
  };
}
