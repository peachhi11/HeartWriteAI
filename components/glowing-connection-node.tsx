"use client";

import {
  DIAGNOSTIC_NODE_MATRIX,
  type SystemSyncStatus,
} from "@/types/diagnostics";
import { cn } from "@/lib/utils";

type GlowingConnectionNodeProps = {
  errorCode?: null | string;
  status: SystemSyncStatus;
};

export function GlowingConnectionNode({
  errorCode = null,
  status,
}: GlowingConnectionNodeProps) {
  const cfg = DIAGNOSTIC_NODE_MATRIX[status];

  return (
    <div className="group relative inline-flex cursor-help select-none items-center">
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border border-border/80 bg-background/70 px-2.5 py-1 shadow-sm backdrop-blur transition duration-500",
          cfg.glowPreset,
        )}
      >
        <span className="relative flex size-1.5 shrink-0">
          {status !== "idle" ? (
            <span
              className={cn(
                "absolute inline-flex size-full rounded-full opacity-70",
                status === "fault" && "animate-ping bg-destructive",
                status === "degraded" && "bg-amber-400",
                status === "syncing" && "bg-cyan-400",
                status === "connected" && "animate-pulse bg-emerald-400",
              )}
            />
          ) : null}
          <span className={cn("relative inline-flex size-1.5 rounded-full", cfg.dotColor)} />
        </span>
        <span
          className={cn(
            "font-mono text-[10px] tracking-tight transition-colors duration-500",
            cfg.textColor,
          )}
        >
          {cfg.label}
        </span>
      </div>

      <div className="pointer-events-none absolute right-0 top-full z-40 mt-2 w-64 space-y-1.5 rounded-xl border border-border/80 bg-popover p-3 text-left opacity-0 shadow-2xl transition-opacity duration-200 group-hover:opacity-100">
        <div className="flex items-center justify-between border-b border-border/70 pb-1">
          <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">
            Lorebook Status
          </span>
        </div>
        <p className="text-[11px] leading-normal text-muted-foreground">
          {cfg.description}
        </p>
        {errorCode ? (
          <div className="break-all rounded-md border border-destructive/30 bg-destructive/10 p-1.5 font-mono text-[9px] leading-tight text-destructive">
            <span className="mb-0.5 block text-[8px] font-bold uppercase tracking-wide">
              Details
            </span>
            {errorCode}
          </div>
        ) : null}
      </div>
    </div>
  );
}
