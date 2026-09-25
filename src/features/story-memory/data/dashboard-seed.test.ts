import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { corePromptPacks, groupedCategoryTags } from "./dashboard-seed";

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
});
