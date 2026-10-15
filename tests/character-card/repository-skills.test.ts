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
  const schemaPath = path.resolve(process.cwd(), "skills/skill.schema.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
    entries: Array<
      SkillInventoryEntry & {
        migration_status?: string;
        repository_path?: string;
      }
    >;
  };
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8")) as {
    schema_version: number;
    required_frontmatter: string[];
    required_sections: string[];
  };
  const reviewedEntries = manifest.entries.filter((entry) => entry.migration_status === "reviewed");

  assert.deepEqual(
    reviewedEntries.map((entry) => entry.slug),
    [
      "story-idea-generator",
      "narrative-complications-engine",
      "character-gmcs",
      "character-arc-structure",
      "archetypal-character-arcs",
      "flaw-preservation",
      "story-grid-engine",
      "motive-tracker",
      "scene-sequel-structure",
      "trope-world-builder",
      "romance-conflict-outliner",
      "knowledge-boundary-response",
      "modern-real-world-setting",
      "weather-natural-phenomena",
      "explicit-memory-core",
      "emotional-continuity",
      "emotional-escalation",
      "romantic-tension-builder",
      "emotional-subtext-engine",
      "relationship-tracker",
      "escalating-proximity",
    ],
  );
  for (const entry of reviewedEntries) {
    assert.ok(entry.repository_path);
    const body = fs.readFileSync(path.resolve(process.cwd(), entry.repository_path), "utf8");
    assert.match(body, new RegExp(`name: ${entry.slug}`));
    assert.match(body, /runtime_safe: true/);
    assert.match(body, /source: heartwrite_memory_vault/);
    assert.match(body, /^---\n[\s\S]*\n---\n/);
    for (const field of schema.required_frontmatter) {
      assert.match(body, new RegExp(`^\\s*${field}:\\s+.+$`, "m"));
    }
    for (const section of schema.required_sections) {
      assert.match(body, new RegExp(`^## ${section}$`, "m"));
    }
  }
  assert.equal(schema.schema_version, 1);
});
