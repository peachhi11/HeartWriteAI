"use client";

import { useId } from "react";

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
  const descriptionId = useId();

  return (
    <div
      aria-describedby={descriptionId}
      aria-label={`${cfg.label}. ${cfg.description}${errorCode ? ` Details: ${errorCode}` : ""}`}
      className="group relative inline-flex shrink-0 cursor-help select-none items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      data-diagnostic-node
      role="status"
      tabIndex={0}
    >
      <style>
        {`
          [data-diagnostic-node]:focus-within [data-diagnostic-tooltip],
          [data-diagnostic-node]:hover [data-diagnostic-tooltip] {
            opacity: 1;
          }
        `}
      </style>

      <div
        className={cn(
          "inline-flex h-8 items-center gap-2 rounded-lg border border-border/80 bg-background/70 px-2.5 py-1 shadow-sm backdrop-blur transition duration-500",
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
            "hidden max-w-32 truncate font-mono text-[10px] tracking-tight transition-colors duration-500 sm:inline",
            cfg.textColor,
          )}
        >
          {cfg.label}
        </span>
      </div>

      <div
        className="pointer-events-none absolute right-0 top-full z-40 mt-2 w-64 max-w-[calc(100vw-2rem)] space-y-1.5 rounded-xl border border-border/80 bg-popover p-3 text-left opacity-0 shadow-2xl transition-opacity duration-200"
        data-diagnostic-tooltip
        id={descriptionId}
      >
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
