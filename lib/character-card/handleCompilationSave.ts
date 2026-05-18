"use client";

import { invoke } from "@tauri-apps/api/core";

import { SaveSessionConfig } from "../../types/character-card/SaveSessionConfig";

export async function handleCompilationSave({
  currentWorkspaceCard,
  sourceImgPath,
  targetSavePath,
}: SaveSessionConfig): Promise<boolean> {
  try {
    await invoke("write_edited_card_to_png", {
      sourceImgPath,
      targetSavePath,
      updatedCardData: currentWorkspaceCard,
    });

    console.log("PNG metadata extraction target updated and recompiled smoothly.");
    return true;
  } catch (error) {
    console.error("IPC compile invocation pipeline collapsed: ", error);
    return false;
  }
}
