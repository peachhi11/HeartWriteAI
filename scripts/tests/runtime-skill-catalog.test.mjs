import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { loadRuntimeSkillCatalog } from "../runtime-skill-catalog.mjs";

const repoRoot = path.resolve(import.meta.dirname, "../..");

test("validates source records without generated TypeScript", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "heartwrite-catalog-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.cpSync(path.join(repoRoot, "skills"), path.join(root, "skills"), { recursive: true });
  const { manifest, records } = loadRuntimeSkillCatalog(root);
  assert.equal(records.length, manifest.entries.length);
  assert.equal(records.length, 37);
  assert.equal(records.filter((record) => record.runtime.public_safe).length, 30);
});

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "heartwrite-catalog-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.cpSync(path.join(repoRoot, "skills"), path.join(root, "skills"), { recursive: true });
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "skills/manifest.json"), "utf8"));
  const metadataPath = path.join(root, manifest.entries[0].runtime_metadata_path);
  const record = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
  return { root, metadataPath, record };
}

test("rejects identity drift in structured input", (t) => {
  const { root, metadataPath, record } = fixture(t);
  record.identity.label = "Mismatched label";
  fs.writeFileSync(metadataPath, JSON.stringify(record));
  assert.throws(() => loadRuntimeSkillCatalog(root), /label mismatch/);
});

test("rejects invalid public/private classification before generation", (t) => {
  const { root, metadataPath, record } = fixture(t);
  record.runtime.public_safe = "false";
  fs.writeFileSync(metadataPath, JSON.stringify(record));
  assert.throws(() => loadRuntimeSkillCatalog(root), /public_safe must be boolean/);
});

test("rejects empty strings where structured arrays are required", (t) => {
  const { root, metadataPath, record } = fixture(t);
  record.state.fields = "";
  fs.writeFileSync(metadataPath, JSON.stringify(record));
  assert.throws(() => loadRuntimeSkillCatalog(root), /state fields must be unique strings/);
});

test("rejects duplicate manifest identities", (t) => {
  const { root } = fixture(t);
  const manifestPath = path.join(root, "skills/manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  manifest.entries.push(manifest.entries[0]);
  fs.writeFileSync(manifestPath, JSON.stringify(manifest));
  assert.throws(() => loadRuntimeSkillCatalog(root), /duplicate slug/);
});

test("rejects unlinked metadata records", (t) => {
  const { root, record } = fixture(t);
  fs.writeFileSync(
    path.join(root, "skills/runtime-metadata/unlinked.json"),
    JSON.stringify(record),
  );
  assert.throws(() => loadRuntimeSkillCatalog(root), /not linked from manifest/);
});

test("reports malformed JSON by source path without echoing its contents", (t) => {
  const { root, metadataPath } = fixture(t);
  fs.writeFileSync(metadataPath, "private-invalid-source");
  assert.throws(
    () => loadRuntimeSkillCatalog(root),
    (error) => {
      assert.match(error.message, /Cannot read valid JSON: skills\/runtime-metadata\//);
      assert.doesNotMatch(error.message, /private-invalid-source/);
      return true;
    },
  );
});
