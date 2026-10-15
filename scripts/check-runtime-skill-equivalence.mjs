import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "skills", "manifest.json"), "utf8"),
);
const registrySource = fs.readFileSync(
  path.join(repoRoot, "lib", "character-card", "storyRuntimeSkills.ts"),
  "utf8",
);
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

const projectMetadata = (entry) =>
  JSON.stringify({
    slug: entry.slug,
    label: entry.label,
    category: entry.category,
    source: entry.source,
  });

const manifestBySlug = new Map(manifest.entries.map((entry) => [entry.slug, entry]));
const registryBySlug = new Map(registryEntries.map((entry) => [entry.slug, entry]));
const failures = [];

for (const [slug, registryEntry] of registryBySlug) {
  const manifestEntry = manifestBySlug.get(slug);
  if (!manifestEntry) {
    failures.push(`runtime entry missing from manifest: ${slug}`);
  } else if (projectMetadata(manifestEntry) !== projectMetadata(registryEntry)) {
    failures.push(`runtime metadata differs from manifest: ${slug}`);
  }
}

for (const slug of manifestBySlug.keys()) {
  if (!registryBySlug.has(slug))
    failures.push(`manifest entry missing from runtime registry: ${slug}`);
}

if (failures.length > 0) {
  console.error("Runtime skill equivalence check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Runtime skill metadata matches for ${registryEntries.length} entries`);
