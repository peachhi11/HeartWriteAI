import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(scriptPath), "..");
const registryPath = path.join(
  repoRoot,
  "lib",
  "character-card",
  "storyRuntimeSkills.ts",
);
const defaultVaultPath = path.resolve(
  repoRoot,
  "..",
  "00_Source_Reference_Library",
  "obsidian-tools",
  "HeartWriteAI Memory Vault",
);
const vaultPath =
  process.env.HEARTWRITE_MEMORY_VAULT_PATH || defaultVaultPath;
const skillRoot = path.join(vaultPath, "01_Project_State", "Agents", "Skills");

function fail(message) {
  failures.push(message);
}

function walkFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function titleToSlug(title) {
  return title
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findVaultNote(title) {
  const target = `${title}.md`.toLowerCase();
  return vaultMarkdownFiles.find((file) => path.basename(file).toLowerCase() === target);
}

function resolveWikilinkTarget(title) {
  const note = findVaultNote(title);
  if (note) {
    return note;
  }

  const skillDir = path.join(skillRoot, titleToSlug(title));
  const skillFile = path.join(skillDir, "SKILL.md");
  if (fs.existsSync(skillFile)) {
    return skillFile;
  }

  return null;
}

function parseRegistryEntries(source) {
  const entries = [];
  const entryPattern =
    /\{\n\s+slug: "([^"]+)",[\s\S]*?source: "([^"]+)",[\s\S]*?sourceVaultLinks: \[([\s\S]*?)\],/g;

  for (const match of source.matchAll(entryPattern)) {
    entries.push({
      slug: match[1],
      source: match[2],
      sourceVaultLinks: [...match[3].matchAll(/"([^"]+)"/g)].map((link) => link[1]),
    });
  }

  return entries;
}

const failures = [];

if (!fs.existsSync(registryPath)) {
  fail(`Registry file does not exist: ${registryPath}`);
}

if (!fs.existsSync(vaultPath)) {
  fail(`Memory Vault path does not exist: ${vaultPath}`);
}

if (!fs.existsSync(skillRoot)) {
  fail(`Memory Vault skill root does not exist: ${skillRoot}`);
}

const registrySource = fs.existsSync(registryPath)
  ? fs.readFileSync(registryPath, "utf8")
  : "";
const vaultMarkdownFiles = fs.existsSync(vaultPath)
  ? walkFiles(vaultPath).filter((file) => file.endsWith(".md"))
  : [];
const entries = parseRegistryEntries(registrySource);

if (entries.length === 0) {
  fail("No story runtime skill entries were parsed from the registry.");
}

for (const entry of entries) {
  const hasResolvableVaultSource = entry.sourceVaultLinks.some((link) => {
    if (link.startsWith("AGENTS.md:")) {
      return entry.source === "agents_md";
    }

    const wikiMatch = link.match(/^\[\[([^\]]+)\]\]$/);
    if (wikiMatch) {
      return Boolean(resolveWikilinkTarget(wikiMatch[1]));
    }

    if (/^[a-z0-9-]+\//.test(link)) {
      return fs.existsSync(path.join(skillRoot, link));
    }

    return false;
  });

  for (const link of entry.sourceVaultLinks) {
    if (link.startsWith("AGENTS.md:")) {
      continue;
    }

    const wikiMatch = link.match(/^\[\[([^\]]+)\]\]$/);
    if (wikiMatch) {
      if (!resolveWikilinkTarget(wikiMatch[1])) {
        fail(`${entry.slug}: wikilink did not resolve in vault: ${link}`);
      }
      continue;
    }

    if (/^[a-z0-9-]+\//.test(link)) {
      const resolved = path.join(skillRoot, link);
      if (!fs.existsSync(resolved)) {
        fail(`${entry.slug}: sourceVaultLinks path is missing: ${link}`);
      }
      continue;
    }
  }

  if (entry.source === "heartwrite_memory_vault" && !hasResolvableVaultSource) {
    fail(`${entry.slug}: heartwrite_memory_vault entry has no resolvable vault source`);
  }
}

if (failures.length > 0) {
  console.error("Vault skill registry validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `Validated ${entries.length} story runtime skill registry entries against ${vaultPath}`,
);
