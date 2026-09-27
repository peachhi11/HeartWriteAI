import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  corePromptPacks,
  groupedCategoryTags,
  sampleBookshelves,
  sampleLibraryBooks,
  sampleStoryBookBindings,
  sampleStoryBooks,
} from "./dashboard-seed";

describe("story memory seed data", () => {
  it("loads the v1 grouped tag set without duplicate slugs", () => {
    const slugs = groupedCategoryTags.map((tag) => tag.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).toEqual(
      expect.arrayContaining([
        "brothers-best-friend",
        "sisters-girlfriend",
        "best-friends-boyfriend",
        "enemies-to-lovers",
        "friends-to-lovers",
        "situationship",
        "dominant-submissive",
        "switch-submissive",
        "polycule",
        "fempov",
        "anypov",
        "janitorai",
        "sillytavern",
        "marinaratavern",
        "blocked",
      ]),
    );
  });

  it("loads the full starting core prompt pack set", () => {
    expect(corePromptPacks.map((pack) => pack.slug)).toEqual([
      "changing-perspectives",
      "second-chance-romance",
      "forbidden-attraction",
      "arranged-marriage",
      "dark-romance",
      "supernatural",
      "bdsm-dynamics",
      "non-traditional-relationships",
      "love-triangles-messy-relationships",
    ]);
  });

  it("keeps every core prompt pack compatible tag backed by a real seed tag", () => {
    const tagSlugs = new Set(groupedCategoryTags.map((tag) => tag.slug));
    const missingCompatibleTags = corePromptPacks.flatMap((pack) =>
      pack.compatible_tag_slugs
        .filter((tagSlug) => !tagSlugs.has(tagSlug))
        .map((tagSlug) => `${pack.slug}:${tagSlug}`),
    );

    expect(missingCompatibleTags).toEqual([]);
  });

  it("keeps the Supabase SQL seed in step with the local tag and core pack seeds", () => {
    const seedSql = readFileSync(resolve(process.cwd(), "supabase/schemas/002_seed_core_prompt_packs.sql"), "utf8");

    for (const tag of groupedCategoryTags) {
      expect(seedSql).toContain(`'${tag.slug}'`);
    }

    for (const pack of corePromptPacks) {
      expect(seedSql).toContain(`'${pack.slug}'`);
    }
  });

  it("seeds every required StoryBook library book type", () => {
    expect(sampleLibraryBooks.map((book) => book.book_type)).toEqual([
      "character_book",
      "user_book",
      "scenario_book",
      "world_book",
      "memory_book",
      "prompt_book",
    ]);
  });

  it("keeps seeded StoryBooks bound to real shelves and books", () => {
    const bookshelfIds = new Set(sampleBookshelves.map((bookshelf) => bookshelf.id));
    const storybookIds = new Set(sampleStoryBooks.map((storybook) => storybook.id));
    const libraryBookIds = new Set(sampleLibraryBooks.map((book) => book.id));

    expect(sampleStoryBooks.every((storybook) => bookshelfIds.has(storybook.bookshelf_id))).toBe(true);
    expect(
      sampleStoryBookBindings.every(
        (binding) => storybookIds.has(binding.storybook_id) && libraryBookIds.has(binding.book_id),
      ),
    ).toBe(true);
  });

  it("keeps the Supabase core schema ready for StoryBook storage", () => {
    const schemaSql = readFileSync(resolve(process.cwd(), "supabase/schemas/001_story_memory_core.sql"), "utf8");

    for (const tableName of [
      "bookshelves",
      "storybooks",
      "library_books",
      "storybook_book_bindings",
    ]) {
      expect(schemaSql).toContain(`public.${tableName}`);
    }

    for (const bookType of sampleLibraryBooks.map((book) => book.book_type)) {
      expect(schemaSql).toContain(`'${bookType}'`);
    }
  });
});
