import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  CHARACTER_VOCAB_TOKENS,
  buildCharacterVocabYamlExports,
  exportCharacterVocabJson,
} from "../data/characterVocabTokenDatabase";

export interface CharacterVocabularySeedExportResult {
  outputDir: string;
  files: string[];
  tokenCount: number;
}

export function exportCharacterVocabularySeeds(
  outputDir = join(process.cwd(), "vocab"),
): CharacterVocabularySeedExportResult {
  mkdirSync(outputDir, { recursive: true });

  const files: string[] = [];
  const jsonFilename = "heartwrite.character-vocab.json";
  writeFileSync(join(outputDir, jsonFilename), exportCharacterVocabJson(), "utf8");
  files.push(jsonFilename);

  const yamlExports = buildCharacterVocabYamlExports();
  for (const [filename, content] of Object.entries(yamlExports).sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    writeFileSync(join(outputDir, filename), content, "utf8");
    files.push(filename);
  }

  return {
    outputDir,
    files,
    tokenCount: CHARACTER_VOCAB_TOKENS.length,
  };
}

if (require.main === module) {
  const result = exportCharacterVocabularySeeds(process.argv[2]);
  console.log(
    `Exported ${result.tokenCount} character vocabulary tokens to ${result.outputDir} across ${result.files.length} files.`,
  );
}
