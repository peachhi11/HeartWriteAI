"use client";

import { TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type DeleteConfirmModalProps = {
  slotIndex: number;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteConfirmModal({
  slotIndex,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [typedConfirmation, setTypedConfirmation] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const targetKey = `DELETE SLOT ${slotIndex}`;
  const canConfirm = typedConfirmation === targetKey;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      aria-modal="true"
      className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl border border-red-500/30 bg-[color-mix(in_srgb,var(--panel)_92%,black)] p-5 shadow-[0_24px_80px_rgba(127,29,29,0.32)] backdrop-blur-xl"
      role="dialog"
    >
      <div className="w-full max-w-xs space-y-3 text-center">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full border border-red-500/30 bg-red-950/30 text-red-300 shadow-lg shadow-red-950/30">
          <TriangleAlert className="size-5" />
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.18em] text-red-300">
            Irreversible action
          </h4>
          <p className="mt-1 text-xs text-[var(--muted)]">
            This permanently wipes Profile Slot {slotIndex} and clears its
            relationship metrics from local disk.
          </p>
        </div>

        <label className="block space-y-2 pt-1 text-left">
          <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            Type{" "}
            <span className="rounded-md border border-[var(--panel-border)] bg-[var(--panel-soft)] px-1.5 py-0.5 font-mono text-[var(--foreground)]">
              {targetKey}
            </span>{" "}
            to confirm
          </span>
          <input
            ref={inputRef}
            autoCapitalize="characters"
            autoComplete="off"
            className="w-full rounded-xl border border-red-500/20 bg-[var(--panel)] px-3 py-2 text-center font-mono text-xs uppercase tracking-wide text-red-300 outline-none transition placeholder:text-[var(--muted)] focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
            onChange={(event) =>
              setTypedConfirmation(event.currentTarget.value.toUpperCase())
            }
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                onCancel();
              }
            }}
            placeholder="DELETE SLOT ..."
            value={typedConfirmation}
          />
        </label>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-soft)] px-3 py-2 text-xs font-bold text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
              canConfirm
                ? "bg-red-500 text-white shadow-lg shadow-red-950/30 hover:bg-red-400"
                : "cursor-not-allowed border border-[var(--panel-border)] bg-[var(--panel-soft)] text-[var(--muted)] opacity-60"
            }`}
            disabled={!canConfirm}
            onClick={onConfirm}
            type="button"
          >
            Purge profile
          </button>
        </div>
      </div>
    </div>
  );
}
