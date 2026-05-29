"use client";

type SlotStatusBadgeProps = {
  characterName?: string | null;
  hasCharacter: boolean;
};

export function SlotStatusBadge({
  characterName,
  hasCharacter,
}: SlotStatusBadgeProps) {
  if (!hasCharacter) {
    return (
      <span className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-[var(--panel-border)] bg-[var(--surface)] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">
        <span className="block size-1.5 rounded-full bg-zinc-600" />
        Blank Profile Slot
      </span>
    );
  }

  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-emerald-500/35 bg-emerald-950/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300 shadow-sm">
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
      </span>
      <span className="shrink-0">Character Loaded</span>
      {characterName ? (
        <span className="ml-1.5 max-w-24 truncate border-l border-emerald-500/25 pl-1.5 font-normal lowercase text-emerald-300/70">
          {characterName}
        </span>
      ) : null}
    </span>
  );
}
