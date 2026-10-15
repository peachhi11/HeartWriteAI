import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(repoRoot, "skills", "manifest.json");
const bodySchemaPath = path.join(repoRoot, "skills", "skill.schema.json");
const registryPath = path.join(repoRoot, "lib", "character-card", "storyRuntimeSkills.ts");

const failures = [];
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const bodySchema = JSON.parse(fs.readFileSync(bodySchemaPath, "utf8"));
const registrySource = fs.readFileSync(registryPath, "utf8");
const registryEntries = [];
const entryPattern =
  /\{\n\s+slug: "([^"]+)",\n\s+label: "([^"]+)",\n\s+category: "([^"]+)",[\s\S]*?\n\s+source: "([^"]+)",/g;

for (const match of registrySource.matchAll(entryPattern)) {
  registryEntries.push({
    slug: match[1],
    label: match[2],
    category: match[3],
    source: match[4],
  });
}

if (manifest.schema_version !== 1) {
  failures.push("skills/manifest.json must use schema_version 1");
}

if (manifest.body_schema !== "skills/skill.schema.json") {
  failures.push("manifest body_schema must point to skills/skill.schema.json");
}

if (bodySchema.schema_version !== 1) {
  failures.push("skills/skill.schema.json must use schema_version 1");
}

const frontmatterValue = (frontmatter, key) => {
  const match = frontmatter.match(new RegExp(`^\\s*${key}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim().replace(/^['\"]|['\"]$/g, "");
};

const hasSection = (body, section) => {
  const escapedSection = section.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&");
  return new RegExp(`^##\\s+${escapedSection}\\s*$`, "m").test(body);
};

const checkUniqueSlugs = (name, entries) => {
  const seen = new Set();
  for (const entry of entries) {
    if (seen.has(entry.slug)) failures.push(`${name} has duplicate slug: ${entry.slug}`);
    seen.add(entry.slug);
  }
};

checkUniqueSlugs("manifest", manifest.entries);
checkUniqueSlugs("runtime registry", registryEntries);

const comparable = (entry) =>
  JSON.stringify({
    slug: entry.slug,
    label: entry.label,
    category: entry.category,
    source: entry.source,
  });

const manifestBySlug = new Map(manifest.entries.map((entry) => [entry.slug, entry]));
const registryBySlug = new Map(registryEntries.map((entry) => [entry.slug, entry]));

for (const entry of manifest.entries) {
  const registryEntry = registryBySlug.get(entry.slug);
  if (!registryEntry) {
    failures.push(`manifest entry is missing from runtime registry: ${entry.slug}`);
  } else if (comparable(entry) !== comparable(registryEntry)) {
    failures.push(`manifest metadata drift for: ${entry.slug}`);
  }
}

for (const entry of registryEntries) {
  if (!manifestBySlug.has(entry.slug)) {
    failures.push(`runtime registry entry is missing from manifest: ${entry.slug}`);
  }
}

for (const entry of manifest.entries) {
  if (entry.migration_status !== "reviewed") continue;
  if (!entry.repository_path) {
    failures.push(`reviewed skill has no repository_path: ${entry.slug}`);
    continue;
  }

  const repositoryPath = path.join(repoRoot, entry.repository_path);
  if (!fs.existsSync(repositoryPath)) {
    failures.push(`reviewed skill body is missing: ${entry.repository_path}`);
    continue;
  }

  const body = fs.readFileSync(repositoryPath, "utf8");
  if (!body.includes(`name: ${entry.slug}`)) {
    failures.push(`reviewed skill body has no matching frontmatter name: ${entry.slug}`);
  }

  const frontmatterMatch = body.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatterMatch) {
    failures.push(`reviewed skill body has invalid frontmatter: ${entry.slug}`);
    continue;
  }

  for (const key of bodySchema.required_frontmatter) {
    if (!frontmatterValue(frontmatterMatch[1], key)) {
      failures.push(`${entry.slug}: missing required frontmatter field ${key}`);
    }
  }

  for (const [key, expected] of Object.entries(bodySchema.reviewed_values)) {
    if (frontmatterValue(frontmatterMatch[1], key) !== expected) {
      failures.push(`${entry.slug}: frontmatter ${key} must be ${expected}`);
    }
  }

  if (frontmatterValue(frontmatterMatch[1], "source") !== entry.source) {
    failures.push(`${entry.slug}: frontmatter source must match manifest source ${entry.source}`);
  }

  for (const section of bodySchema.required_sections) {
    if (!hasSection(body, section)) {
      failures.push(`${entry.slug}: missing required section ${section}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Repository skill manifest validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Validated ${manifest.entries.length} repository skill entries against the runtime registry`,
);
