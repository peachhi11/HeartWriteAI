"use client";

import { invoke } from "@tauri-apps/api/core";

import { isTauriRuntime } from "@/lib/tauri/native";
import type { LorebookConfig } from "@/types/lorebook";

export async function importAndCompileLorebook(
  bookId: string,
  rawJsonPayload: string,
): Promise<LorebookConfig | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<LorebookConfig>("import_and_compile_lorebook", {
    bookId,
    rawJsonPayload,
  });
}

export async function toggleLorebookActiveState(
  bookId: string,
  isEnabled: boolean,
): Promise<void> {
  if (!isTauriRuntime()) {
    return;
  }

  await invoke("toggle_lorebook_active_state", {
    bookId,
    isEnabled,
  });
}

export async function removeLorebookFile(bookId: string): Promise<void> {
  if (!isTauriRuntime()) {
    return;
  }

  await invoke("remove_lorebook_file", { bookId });
}
