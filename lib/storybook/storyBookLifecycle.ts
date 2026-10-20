import type { MemoryRepository } from "../memory/memoryRepository";
import type { StoryBook, StoryBookRepository } from "./storyBookRepository";

export interface StoryBookLifecycle {
  archive(storyBookId: string): Promise<StoryBook>;
  delete(storyBookId: string): Promise<void>;
}

export function createStoryBookLifecycle(input: {
  memoryRepository: MemoryRepository;
  storyBookRepository: StoryBookRepository;
}): StoryBookLifecycle {
  async function detachMemories(storyBookId: string) {
    const memories = await input.memoryRepository.list(storyBookId);

    for (const memory of memories) {
      await input.memoryRepository.unassign(storyBookId, memory.id);
    }
  }

  async function requireStoryBook(storyBookId: string) {
    const storyBook = await input.storyBookRepository.get(storyBookId);

    if (!storyBook) {
      throw new Error(`StoryBook not found: ${storyBookId}`);
    }

    return storyBook;
  }

  return {
    async archive(storyBookId) {
      const storyBook = await requireStoryBook(storyBookId);

      await detachMemories(storyBook.id);
      return input.storyBookRepository.save({
        ...storyBook,
        status: "archived",
      });
    },
    async delete(storyBookId) {
      const storyBook = await requireStoryBook(storyBookId);

      await detachMemories(storyBook.id);
      await input.storyBookRepository.delete(storyBook.id);
    },
  };
}
