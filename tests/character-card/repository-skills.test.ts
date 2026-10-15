import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { storyRuntimeSkills } from "../../lib/character-card/storyRuntimeSkills";
import { runtimeSkillMetadataRecords } from "../../lib/character-card/generatedRuntimeSkillMetadata";

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
      "erotic-romance-writing-mentor",
      "romantic-erotic-storytelling-generator",
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
      "crafting-satisfying-ending",
      "chapter-cut-evaluator",
      "romance-conflict-outliner",
      "explicit-tbrp-scene-guidance",
      "roleplay-keyword-discovery",
      "character-persona-creation",
      "knowledge-boundary-response",
      "modern-real-world-setting",
      "weather-natural-phenomena",
      "explicit-memory-core",
      "power-dynamics-scene-writing",
      "erotic-dynamics-prose",
      "erotic-archetypes-engine",
      "emotional-continuity",
      "emotional-escalation",
      "romantic-tension-builder",
      "emotional-subtext-engine",
      "romantic-roleplay-skill-creator",
      "relationship-tracker",
      "dominance-and-intimacy-flow",
      "escalating-proximity",
      "space-distance-blocking",
      "scene-coherence-playfield",
      "multi-character-world-narration",
      "intimacy-shift",
    ],
  );
  for (const entry of reviewedEntries) {
    assert.ok(entry.repository_path);
    const body = fs.readFileSync(path.resolve(process.cwd(), entry.repository_path), "utf8");
    assert.match(body, new RegExp(`name: ${entry.slug}`));
    assert.match(body, /runtime_safe: true/);
    assert.match(body, new RegExp(`source: ${entry.source}`));
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

test("runtime metadata proof record preserves the extensible compiler boundary", () => {
  const manifestPath = path.resolve(process.cwd(), "skills/manifest.json");
  const metadataSchemaPath = path.resolve(process.cwd(), "skills/runtime-metadata.schema.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
    runtime_metadata_schema: string;
    entries: Array<{
      slug: string;
      label: string;
      category: string;
      source: string;
      repository_path?: string;
      runtime_metadata_path?: string;
    }>;
  };
  const schema = JSON.parse(fs.readFileSync(metadataSchemaPath, "utf8")) as {
    $id: string;
    properties: { extensions?: { additionalProperties?: boolean } };
  };
  const entry = manifest.entries.find((candidate) => candidate.runtime_metadata_path);

  assert.equal(manifest.runtime_metadata_schema, "skills/runtime-metadata.schema.json");
  assert.equal(schema.$id, "https://heartwriteai.local/schemas/runtime-skill-metadata.json");
  assert.equal(schema.properties.extensions?.additionalProperties, true);
  assert.ok(entry?.runtime_metadata_path);

  const metadata = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), entry!.runtime_metadata_path!), "utf8"),
  ) as {
    schema_version: number;
    record_type: string;
    identity: { slug: string; label: string; category: string; summary: string };
    provenance: { source: string; repository_body: string };
    runtime: { status: string; public_safe: boolean; scopes: string[] };
    activation: { mode: string; tags: string[]; trigger_seeds: string[] };
    state: { fields: string[] };
    routing: {
      prompt_compiler_signals: string[];
      memory_routing: string[];
      continuity_links: string[];
    };
    safety: {
      guardrails: string[];
      user_agency: string;
      consent_context: string;
      private_data_policy: string;
    };
    extensions: Record<string, unknown>;
  };

  assert.equal(metadata.schema_version, 1);
  assert.equal(metadata.record_type, "story-runtime-skill-metadata");
  assert.deepEqual(metadata.identity, {
    slug: entry!.slug,
    label: entry!.label,
    category: entry!.category,
    summary: metadata.identity.summary,
  });
  assert.equal(metadata.provenance.source, entry!.source);
  assert.equal(metadata.provenance.repository_body, entry!.repository_path);
  assert.equal(metadata.runtime.status, "reviewed");
  assert.equal(metadata.runtime.public_safe, true);
  assert.ok(metadata.runtime.scopes.length > 0);
  assert.equal(metadata.activation.mode, "contextual");
  assert.ok(metadata.activation.tags.length > 0);
  assert.ok(metadata.activation.trigger_seeds.length > 0);
  assert.ok(metadata.state.fields.length > 0);
  assert.ok(metadata.routing.prompt_compiler_signals.length > 0);
  assert.ok(metadata.routing.memory_routing.length > 0);
  assert.ok(metadata.safety.guardrails.length > 0);
  assert.equal(metadata.safety.user_agency, "preserve");
  assert.equal(metadata.safety.consent_context, "required");
  assert.equal(metadata.safety.private_data_policy, "exclude_raw_fixtures");
  assert.equal(typeof metadata.extensions, "object");
});

test("generated runtime metadata follows manifest order and contains only linked records", () => {
  const manifestPath = path.resolve(process.cwd(), "skills/manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
    entries: Array<{ slug: string; runtime_metadata_path?: string }>;
  };
  const linkedSlugs = manifest.entries
    .filter((entry) => entry.runtime_metadata_path)
    .map((entry) => entry.slug);

  assert.deepEqual(
    runtimeSkillMetadataRecords.map((record) => record.identity.slug),
    linkedSlugs,
  );
  assert.equal(
    new Set(runtimeSkillMetadataRecords.map((record) => record.identity.slug)).size,
    linkedSlugs.length,
  );
});
