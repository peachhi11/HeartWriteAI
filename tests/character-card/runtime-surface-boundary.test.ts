import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import test from "node:test";

import {
  publicStoryRuntimeSkillSelector,
  publicStoryRuntimeSkills,
} from "../../lib/character-card/publicStoryRuntimeSkills";
import { runtimeSkillMetadataRecords } from "../../lib/character-card/generatedRuntimeSkillMetadata";
import { isPrivatePowerToolsEnabled } from "../../lib/app/privatePowerTools";
import { storyRuntimeSkillSelector } from "../../lib/character-card/runtimeSkillRegistry";

const productionSurfaceDirectories = ["app", "components", "features", "hooks"];

function collectSourceFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(entryPath);
    return /\.(ts|tsx|js|jsx)$/.test(entry.name) ? [entryPath] : [];
  });
}

test("public production surfaces cannot import the all-record runtime registry", () => {
  const sourceFiles = productionSurfaceDirectories.flatMap((directory) =>
    collectSourceFiles(path.resolve(process.cwd(), directory)),
  );
  const forbiddenImport =
    /(?:from|import\()\s*["'][^"']*(?:storyRuntimeSkills|runtimeSkillRegistry)["']/;
  const violations = sourceFiles.filter((filePath) =>
    forbiddenImport.test(fs.readFileSync(filePath, "utf8")),
  );

  assert.deepEqual(violations, []);
});

test("public runtime surface contains only public-safe generated records", () => {
  const expectedPublicSlugs = runtimeSkillMetadataRecords
    .filter((record) => record.runtime.public_safe)
    .map((record) => record.identity.slug);

  assert.equal(publicStoryRuntimeSkills.length, expectedPublicSlugs.length);
  assert.deepEqual(
    publicStoryRuntimeSkills.map((skill) => skill.slug),
    expectedPublicSlugs,
  );
  assert.equal(
    publicStoryRuntimeSkills.some((skill) =>
      runtimeSkillMetadataRecords.some(
        (record) => record.identity.slug === skill.slug && !record.runtime.public_safe,
      ),
    ),
    false,
  );
});

test("public and private surface selectors retain separate catalog boundaries", () => {
  assert.equal(publicStoryRuntimeSkillSelector.skills.length, 30);
  assert.equal(storyRuntimeSkillSelector.skills.length, 37);
  assert.equal(publicStoryRuntimeSkillSelector.getBySlug("explicit-memory-core"), undefined);
  assert.equal(
    storyRuntimeSkillSelector.getBySlug("explicit-memory-core")?.slug,
    "explicit-memory-core",
  );
});

test("private desktop surface remains enabled only through the private-tools gate", () => {
  assert.equal(isPrivatePowerToolsEnabled({ isDesktopRuntime: true }), true);
  assert.equal(
    isPrivatePowerToolsEnabled({ isDesktopRuntime: true, publicAppFlag: "true" }),
    false,
  );
  assert.equal(isPrivatePowerToolsEnabled({ isDesktopRuntime: false }), false);
});
