import type { ReactNode } from "react";
import { Check, Copy, Download, Save, Sparkles } from "lucide-react";

import { SectionPanel } from "@/features/story-memory/components/section-panel";
import type { GeneratedPromptPack } from "@/features/story-memory/types/story-memory";
import type { PromptSlot } from "@/features/story-memory/utils/prompt-slot-builder";

export function JanitorExportPanel({
  copiedSlotId,
  isPending,
  isPersisted,
  latestPromptPack,
  onCopySlot,
  onGenerate,
  onSave,
  slots,
}: {
  copiedSlotId: string | null;
  isPending: boolean;
  isPersisted: boolean;
  latestPromptPack?: GeneratedPromptPack;
  onCopySlot: (slot: PromptSlot) => void;
  onGenerate: () => void;
  onSave: () => void;
  slots: PromptSlot[];
}) {
  const status = latestPromptPack
    ? getPromptPackStatus(latestPromptPack, isPersisted)
    : {
        helper: "Generate a pack to create JanitorAI-ready slots.",
        label: "Not generated",
        saved: false,
      };
  const isJanitorExport = latestPromptPack?.target_platform === "JanitorAI";
  const totalCharacters = slots.reduce((total, slot) => total + slot.body.length, 0);
  const totalWords = slots.reduce((total, slot) => total + countWords(slot.body), 0);

  return (
    <SectionPanel title={isJanitorExport ? "JanitorAI Export" : "Export Preview"} icon={Download}>
      <div className="grid gap-4">
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {isJanitorExport ? "Ready for JanitorAI" : "Latest generated pack"}
              </p>
              <h2 className="mt-1 text-base font-semibold text-zinc-950">
                {latestPromptPack?.title ?? "No prompt pack yet"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {latestPromptPack?.tailoring_goal ??
                  "Generate from the active story memory, then copy each slot into the matching platform field."}
              </p>
            </div>
            <StatusBadge helper={status.helper} saved={status.saved}>
              {status.label}
            </StatusBadge>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <ExportMetric label="Slots" value={slots.length || 0} />
            <ExportMetric label="Words" value={totalWords} />
            <ExportMetric label="Chars" value={totalCharacters} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              className="flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending}
              onClick={onGenerate}
              type="button"
            >
              <Sparkles className="size-4" aria-hidden="true" />
              Generate
            </button>
            <button
              className="flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!latestPromptPack || latestPromptPack.persistence_state === "saved" || isPending}
              onClick={onSave}
              type="button"
            >
              <Save className="size-4" aria-hidden="true" />
              Save
            </button>
          </div>
        </div>

        {latestPromptPack ? (
          <div className="grid gap-3">
            {slots.map((slot) => (
              <PromptSlotCard
                copied={copiedSlotId === slot.id}
                key={slot.id}
                onCopy={() => onCopySlot(slot)}
                slot={slot}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-4 text-sm leading-6 text-zinc-600">
            JanitorAI needs a Global Prompt for broad behavior and a Proxy Prompt for the active
            session layer. Generate when the story memory state looks right.
          </div>
        )}
      </div>
    </SectionPanel>
  );
}

function ExportMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white px-3 py-2">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-950">{value.toLocaleString()}</p>
    </div>
  );
}

function PromptSlotCard({
  copied,
  onCopy,
  slot,
}: {
  copied: boolean;
  onCopy: () => void;
  slot: PromptSlot;
}) {
  const wordCount = countWords(slot.body);

  return (
    <article className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div className="flex items-start justify-between gap-3 border-b border-zinc-200 bg-zinc-50 px-3 py-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-950">{slot.label}</h3>
          <p className="mt-1 text-xs leading-5 text-zinc-500">{slot.helper}</p>
          <p className="mt-1 text-xs leading-5 text-zinc-400">
            {wordCount.toLocaleString()} words · {slot.body.length.toLocaleString()} characters
          </p>
        </div>
        <button
          className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md border border-zinc-300 bg-white px-2.5 text-xs font-medium text-zinc-800 hover:bg-zinc-100"
          onClick={onCopy}
          type="button"
        >
          {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="max-h-64 overflow-auto whitespace-pre-wrap bg-zinc-950 p-3 text-sm leading-6 text-zinc-100">
        {slot.body}
      </pre>
    </article>
  );
}

function StatusBadge({
  children,
  helper,
  saved,
}: {
  children?: ReactNode;
  helper?: string;
  saved: boolean;
}) {
  return (
    <span
      className={`inline-flex max-w-44 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${
        saved ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
      }`}
      title={helper}
    >
      {saved ? <Check className="size-3" aria-hidden="true" /> : null}
      <span className="truncate">{children ?? (saved ? "Saved" : "Session")}</span>
    </span>
  );
}

function getPromptPackStatus(pack: GeneratedPromptPack, isPersisted: boolean) {
  if (pack.persistence_state !== "saved") {
    return {
      helper: "This generated pack will disappear when the session closes unless it is saved.",
      label: "Session draft",
      saved: false,
    };
  }

  if (!isPersisted) {
    return {
      helper: "Saved inside this browser session only. Sign in for Supabase persistence.",
      label: "Session saved",
      saved: true,
    };
  }

  return {
    helper: "Saved to the Supabase workspace.",
    label: "Workspace saved",
    saved: true,
  };
}

function countWords(value: string) {
  const words = value.trim().match(/\S+/g);
  return words?.length ?? 0;
}
