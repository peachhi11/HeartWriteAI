import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { storyRuntimeSkills } from "../../lib/character-card/storyRuntimeSkills";

type SkillInventoryEntry = {
  slug: string;
  label: string;
  category: string;
  source: string;
};

test("repository skill manifest mirrors the runtime skill registry", () => {
  const manifestPath = path.resolve(process.cwd(), "skills/manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
    schema_version: number;
    entries: SkillInventoryEntry[];
  };

  assert.equal(manifest.schema_version, 1);
  assert.equal(manifest.entries.length, storyRuntimeSkills.length);

  const manifestBySlug = new Map(manifest.entries.map((entry) => [entry.slug, entry]));
  for (const skill of storyRuntimeSkills) {
    const manifestEntry = manifestBySlug.get(skill.slug);
    assert.deepEqual(
      manifestEntry && {
        slug: manifestEntry.slug,
        label: manifestEntry.label,
        category: manifestEntry.category,
        source: manifestEntry.source,
      },
      {
        slug: skill.slug,
        label: skill.label,
        category: skill.category,
        source: skill.source,
      },
    );
  }
});

test("repository skill manifest has unique stable slugs", () => {
  const manifestPath = path.resolve(process.cwd(), "skills/manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
    entries: SkillInventoryEntry[];
  };
  const slugs = manifest.entries.map((entry) => entry.slug);

  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
});

test("reviewed skill entries point to repository-owned bodies", () => {
  const manifestPath = path.resolve(process.cwd(), "skills/manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
    entries: Array<
      SkillInventoryEntry & {
        migration_status?: string;
        repository_path?: string;
      }
    >;
  };
  const reviewedEntries = manifest.entries.filter((entry) => entry.migration_status === "reviewed");

  assert.deepEqual(
    reviewedEntries.map((entry) => entry.slug),
    ["knowledge-boundary-response"],
  );
  for (const entry of reviewedEntries) {
    assert.ok(entry.repository_path);
    const body = fs.readFileSync(path.resolve(process.cwd(), entry.repository_path), "utf8");
    assert.match(body, new RegExp(`name: ${entry.slug}`));
    assert.match(body, /runtime_safe: true/);
    assert.match(body, /source: heartwrite_memory_vault/);
  }
});
