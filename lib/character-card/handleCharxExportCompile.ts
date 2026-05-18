import { invoke } from "@tauri-apps/api/core";

import { ValidatedCharacterCardV3 } from "@/types/ccv3";

export interface CharxExportCompileConfig {
  destinationCharxPath: string;
  sourceCardFilePath: string;
  currentWorkspaceCard: ValidatedCharacterCardV3;
}

export async function handleCharxExportCompile({
  destinationCharxPath,
  sourceCardFilePath,
  currentWorkspaceCard,
}: CharxExportCompileConfig): Promise<string | null> {
  try {
    return await invoke<string>("export_character_to_charx", {
      currentWorkspaceCard,
      destinationCharxPath,
      sourceCardFilePath,
    });
  } catch (error) {
    console.error("The .charx compression bundle process failed: ", error);
    return null;
  }
}
