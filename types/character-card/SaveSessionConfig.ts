import { CharacterCardV3 } from "../ccv3";

export interface SaveSessionConfig {
  currentWorkspaceCard: CharacterCardV3;
  sourceImgPath: string;
  targetSavePath: string;
}
