import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(repoRoot, "skills", "manifest.json");
const registryPath = path.join(repoRoot, "lib", "character-card", "storyRuntimeSkills.ts");

const failures = [];
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
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

if (failures.length > 0) {
  console.error("Repository skill manifest validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Validated ${manifest.entries.length} repository skill entries against the runtime registry`,
);
