"use client";

import { useEffect, useState } from "react";

import { formatRelativeTime } from "@/lib/ui/dateFormatter";

type TimestampBadgeProps = {
  isSlotEmpty: boolean;
  rawTimestamp: string;
};

export function TimestampBadge({
  isSlotEmpty,
  rawTimestamp,
}: TimestampBadgeProps) {
  const [refreshTick, setRefreshTick] = useState(0);
  void refreshTick;

  useEffect(() => {
    if (isSlotEmpty) {
      return;
    }

    const intervalTimer = window.setInterval(() => {
      setRefreshTick((current) => current + 1);
    }, 30_000);

    return () => window.clearInterval(intervalTimer);
  }, [isSlotEmpty, rawTimestamp]);

  const displayString = isSlotEmpty
    ? "Empty Profile Slot"
    : formatRelativeTime(rawTimestamp);

  return (
    <span className="flex flex-col items-end">
      <span
        className={`rounded-md border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide ${
          isSlotEmpty
            ? "border-[var(--panel-border)] bg-[var(--surface)] text-[var(--muted)]"
            : "border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)]"
        }`}
      >
        {displayString}
      </span>
      {!isSlotEmpty && (
        <span className="mt-1 block max-w-[11rem] truncate text-[9px] tracking-tight text-[var(--muted)]">
          {rawTimestamp}
        </span>
      )}
    </span>
  );
}
