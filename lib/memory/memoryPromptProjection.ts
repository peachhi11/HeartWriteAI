import type { MemoryRecord, MemoryRepository } from "./memoryRepository";

export type MemoryPromptPrivacyMode = "local" | "provider_safe";

export interface MemoryPromptProjectionOptions {
  privacyMode: MemoryPromptPrivacyMode;
  storyBookId: string;
}

export interface MemoryPromptEntry {
  content: string;
  id: string;
  kind: MemoryRecord["kind"];
}

export async function readMemoryPromptProjection(
  repository: Pick<MemoryRepository, "list">,
  options: MemoryPromptProjectionOptions,
): Promise<MemoryPromptEntry[]> {
  const records = await repository.list(options.storyBookId);

  return records
    .filter((record) => isPromptEligible(record, options.privacyMode))
    .map(toPromptEntry);
}

function isPromptEligible(record: MemoryRecord, privacyMode: MemoryPromptPrivacyMode): boolean {
  if (record.status !== "active" || record.privacy === "do_not_send") {
    return false;
  }

  return privacyMode === "local" || record.privacy === "project";
}

function toPromptEntry(record: MemoryRecord): MemoryPromptEntry {
  return {
    id: record.id,
    kind: record.kind,
    content: record.content,
  };
}
