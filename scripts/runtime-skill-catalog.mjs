import fs from "node:fs";
import path from "node:path";

export function loadRuntimeSkillCatalog(repoRoot) {
  const failures = [];
  const readJson = (relativePath) => {
    try {
      return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8"));
    } catch {
      throw new Error(`Cannot read valid JSON: ${relativePath}`);
    }
  };
  const manifest = readJson("skills/manifest.json");
  const bodySchema = readJson("skills/skill.schema.json");
  const runtimeMetadataSchema = readJson("skills/runtime-metadata.schema.json");
  const records = [];
  if (!Array.isArray(manifest.entries)) throw new Error("manifest entries must be an array");
  if (manifest.schema_version !== 1) {
    failures.push("skills/manifest.json must use schema_version 1");
  }

  if (manifest.body_schema !== "skills/skill.schema.json") {
    failures.push("manifest body_schema must point to skills/skill.schema.json");
  }

  if (manifest.runtime_metadata_schema !== "skills/runtime-metadata.schema.json") {
    failures.push(
      "manifest runtime_metadata_schema must point to skills/runtime-metadata.schema.json",
    );
  }

  if (bodySchema.schema_version !== 1) {
    failures.push("skills/skill.schema.json must use schema_version 1");
  }

  if (
    runtimeMetadataSchema.$id !== "https://heartwriteai.local/schemas/runtime-skill-metadata.json"
  ) {
    failures.push("runtime metadata schema must keep its stable local $id");
  }

  const nonEmptyStrings = (value) =>
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === "string" && item.trim());
  const uniqueStrings = (value) => nonEmptyStrings(value) && new Set(value).size === value.length;
  const optionalUniqueStrings = (value) =>
    Array.isArray(value) && (value.length === 0 || uniqueStrings(value));
  const metadataScopes = new Set([
    "character_book",
    "user_book",
    "world_book",
    "scenario_book",
    "memory_book",
    "prompt_book",
  ]);
  const metadataSources = new Set(["agents_md", "heartwrite_memory_vault", "source_material"]);
  const metadataStatuses = new Set(["reviewed", "experimental", "disabled"]);
  const metadataActivationModes = new Set(["explicit", "contextual", "manual", "always"]);

  const validateRuntimeMetadata = (metadata, entry) => {
    const prefix = `${entry.slug}: runtime metadata`;
    if (metadata.schema_version !== 1) failures.push(`${prefix} schema_version must be 1`);
    if (metadata.record_type !== "story-runtime-skill-metadata")
      failures.push(`${prefix} record_type is invalid`);
    if (!metadata.identity || typeof metadata.identity !== "object")
      failures.push(`${prefix} identity is required`);
    if (!metadata.provenance || typeof metadata.provenance !== "object")
      failures.push(`${prefix} provenance is required`);
    if (!metadata.runtime || typeof metadata.runtime !== "object")
      failures.push(`${prefix} runtime is required`);
    if (!metadata.activation || typeof metadata.activation !== "object")
      failures.push(`${prefix} activation is required`);
    if (!metadata.state || typeof metadata.state !== "object")
      failures.push(`${prefix} state is required`);
    if (!metadata.routing || typeof metadata.routing !== "object")
      failures.push(`${prefix} routing is required`);
    if (!metadata.safety || typeof metadata.safety !== "object")
      failures.push(`${prefix} safety is required`);

    if (metadata.identity?.slug !== entry.slug) failures.push(`${prefix} slug mismatch`);
    if (metadata.identity?.label !== entry.label) failures.push(`${prefix} label mismatch`);
    if (metadata.identity?.category !== entry.category)
      failures.push(`${prefix} category mismatch`);
    if (typeof metadata.identity?.summary !== "string" || !metadata.identity.summary.trim())
      failures.push(`${prefix} summary is required`);
    if (!metadataSources.has(metadata.provenance?.source))
      failures.push(`${prefix} source is invalid`);
    if (metadata.provenance?.source !== entry.source) failures.push(`${prefix} source mismatch`);
    if (metadata.provenance?.repository_body !== entry.repository_path)
      failures.push(`${prefix} repository body mismatch`);
    if (!nonEmptyStrings(metadata.provenance?.source_links))
      failures.push(`${prefix} source_links must be non-empty`);
    if (!metadataStatuses.has(metadata.runtime?.status))
      failures.push(`${prefix} runtime status is invalid`);
    if (typeof metadata.runtime?.public_safe !== "boolean")
      failures.push(`${prefix} public_safe must be boolean`);
    if (
      !uniqueStrings(metadata.runtime?.scopes) ||
      metadata.runtime.scopes.some((scope) => !metadataScopes.has(scope))
    )
      failures.push(`${prefix} scopes are invalid`);
    if (!metadataActivationModes.has(metadata.activation?.mode))
      failures.push(`${prefix} activation mode is invalid`);
    if (!uniqueStrings(metadata.activation?.tags))
      failures.push(`${prefix} activation tags must be unique and non-empty`);
    if (!uniqueStrings(metadata.activation?.trigger_seeds))
      failures.push(`${prefix} trigger seeds must be unique and non-empty`);
    if (!optionalUniqueStrings(metadata.state?.fields))
      failures.push(`${prefix} state fields must be unique strings`);
    if (!optionalUniqueStrings(metadata.routing?.prompt_compiler_signals))
      failures.push(`${prefix} compiler signals must be unique strings`);
    if (!nonEmptyStrings(metadata.routing?.memory_routing))
      failures.push(`${prefix} memory routing must be non-empty`);
    if (!optionalUniqueStrings(metadata.routing?.continuity_links))
      failures.push(`${prefix} continuity links must be unique strings`);
    if (!nonEmptyStrings(metadata.safety?.guardrails))
      failures.push(`${prefix} guardrails must be non-empty`);
    if (!new Set(["preserve", "not_applicable"]).has(metadata.safety?.user_agency))
      failures.push(`${prefix} user_agency is invalid`);
    if (!new Set(["required", "not_applicable"]).has(metadata.safety?.consent_context))
      failures.push(`${prefix} consent_context is invalid`);
    if (
      !new Set(["exclude_raw_fixtures", "approved_source_only"]).has(
        metadata.safety?.private_data_policy,
      )
    )
      failures.push(`${prefix} private_data_policy is invalid`);
    if (
      !metadata.extensions ||
      typeof metadata.extensions !== "object" ||
      Array.isArray(metadata.extensions)
    )
      failures.push(`${prefix} extensions must be an object`);
  };

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
  for (const entry of manifest.entries) {
    if (!entry.runtime_metadata_path) {
      failures.push(`${entry.slug}: runtime_metadata_path is required`);
    } else {
      const metadata = readJson(entry.runtime_metadata_path);
      if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
        failures.push(`${entry.slug}: runtime metadata must be an object`);
      } else {
        validateRuntimeMetadata(metadata, entry);
        records.push(metadata);
      }
    }
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

  const metadataDirectory = path.join(repoRoot, "skills/runtime-metadata");
  const linkedPaths = new Set(manifest.entries.map((entry) => entry.runtime_metadata_path));
  for (const file of fs.readdirSync(metadataDirectory).filter((file) => file.endsWith(".json"))) {
    const relativePath = `skills/runtime-metadata/${file}`;
    if (!linkedPaths.has(relativePath))
      failures.push(`runtime metadata file is not linked from manifest: ${relativePath}`);
  }
  if (failures.length) throw new Error(failures.join("\n"));
  return { manifest, records };
}
