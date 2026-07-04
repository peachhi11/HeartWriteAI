"use client";

import {
  BrainCircuit,
  Layers3,
  ListTree,
  RefreshCw,
  Route,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type {
  ContextDigest,
  ContextDigestEntry,
} from "@/lib/character-card/contextDigest";
import { cn } from "@/lib/utils";

export interface ContextDigestInspectorProps {
  contextDigest: ContextDigest;
  className?: string;
}

const DIGEST_LANE_LABELS = {
  episodicMemories: "Episodes",
  semanticFacts: "Facts",
  emotionalTags: "Emotion",
  behaviorPatterns: "Behavior",
  habitSignals: "Habits",
  compressedPlotSummaries: "Plot",
} as const satisfies Record<keyof ContextDigest["lanes"], string>;

export function ContextDigestInspector({
  className,
  contextDigest,
}: ContextDigestInspectorProps) {
  const laneEntries = Object.entries(contextDigest.lanes) as Array<
    [keyof ContextDigest["lanes"], ContextDigestEntry[]]
  >;
  const totalEntries = laneEntries.reduce(
    (sum, [, entries]) => sum + entries.length,
    0,
  );

  return (
    <section
      className={cn(
        "grid gap-3 rounded-xl border border-border/70 bg-background/75 p-3 text-xs shadow-sm",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <BrainCircuit className="size-4 text-primary" />
            <h3 className="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Context Digest
            </h3>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Compact memory lanes, semantic activation, and maintenance status.
          </p>
        </div>
        <span className="rounded-md border border-border/70 bg-card px-2 py-1 font-mono text-[10px]">
          {contextDigest.estimatedTokens.toLocaleString()} /{" "}
          {contextDigest.tokenBudget.toLocaleString()}
        </span>
      </header>

      <div className="grid grid-cols-3 gap-2">
        <DigestMetric icon={Layers3} label="Lanes" value={String(totalEntries)} />
        <DigestMetric
          icon={Route}
          label="Graph"
          value={String(contextDigest.activeSemanticNodes.length)}
        />
        <DigestMetric
          icon={RefreshCw}
          label="Pass"
          value={contextDigest.maintenanceReport.mode}
        />
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {laneEntries.map(([lane, entries]) => (
          <div
            className="rounded-lg border border-border/60 bg-card/65 p-2"
            key={lane}
          >
            <p className="truncate text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
              {DIGEST_LANE_LABELS[lane]}
            </p>
            <p className="mt-1 font-mono text-sm text-foreground">
              {entries.length}
            </p>
          </div>
        ))}
      </div>

      {contextDigest.activeSemanticNodes.length ? (
        <div className="rounded-lg border border-border/60 bg-card/65 p-2">
          <div className="mb-1.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
            <ListTree className="size-3" />
            Active Semantic Concepts
          </div>
          <div className="flex flex-wrap gap-1">
            {contextDigest.activeSemanticNodes.slice(0, 8).map((node) => (
              <span
                className="max-w-full truncate rounded border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[9px] text-primary"
                key={node.seedId}
                title={node.category}
              >
                {node.label}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {contextDigest.promptContext ? (
        <p className="line-clamp-4 rounded-lg border border-border/60 bg-card/65 p-2 text-[11px] leading-4 text-muted-foreground">
          {contextDigest.promptContext}
        </p>
      ) : null}
    </section>
  );
}

function DigestMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/70 p-2">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="size-3" />
        <span className="text-[9px] font-bold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="mt-1 truncate font-mono text-xs text-foreground">{value}</p>
    </div>
  );
}
