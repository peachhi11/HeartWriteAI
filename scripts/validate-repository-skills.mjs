import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadRuntimeSkillCatalog } from "./runtime-skill-catalog.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
try {
  const { records } = loadRuntimeSkillCatalog(repoRoot);
  console.log(
    `Validated ${records.length} runtime skill source records against manifest and repository bodies`,
  );
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
