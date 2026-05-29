"use client";

import { useMemo, useState } from "react";
import { HeartHandshake, UsersRound } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ConnectionNode } from "@/types/relationship";
import { COMPLETE_TROPE_MATRIX } from "@/types/tropes";

type RelationshipTreeGraphProps = Partial<{
  nodes: ConnectionNode[];
  playerName: string;
}>;

const sampleNodes: ConnectionNode[] = [
  {
    activeTrope: "protective",
    affinityScore: 78,
    avatarUri: "",
    gridPosition: { x: 35, y: 18 },
    id: "node_lucas",
    name: "Lucas",
    relationshipStatus: "Sworn Shield",
  },
  {
    activeTrope: "bantering",
    affinityScore: 52,
    avatarUri: "",
    gridPosition: { x: 76, y: 50 },
    id: "node_elena",
    name: "Elena",
    relationshipStatus: "Academic Rivals",
  },
  {
    activeTrope: "antagonistic",
    affinityScore: 18,
    avatarUri: "",
    gridPosition: { x: 18, y: 72 },
    id: "node_vance",
    name: "Vance",
    relationshipStatus: "Bitter Friction",
  },
];

export function RelationshipTreeGraph({
  nodes = sampleNodes,
  playerName = "Protagonist",
}: RelationshipTreeGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<ConnectionNode | null>(null);
  const normalizedNodes = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        affinityScore: Math.max(0, Math.min(100, node.affinityScore)),
        gridPosition: {
          x: Math.max(8, Math.min(92, node.gridPosition.x)),
          y: Math.max(10, Math.min(90, node.gridPosition.y)),
        },
      })),
    [nodes],
  );

  return (
    <section className="flex h-[380px] w-full max-w-xl select-none flex-col overflow-hidden rounded-2xl border border-border/80 bg-background/80 p-4 text-foreground shadow-2xl backdrop-blur">
      <header className="mb-3 flex shrink-0 items-center justify-between border-b border-border/70 pb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <HeartHandshake className="size-4 text-user-primary" />
            <h3 className="truncate text-[10px] font-black uppercase tracking-[0.2em] text-user-primary">
              Relationship Map
            </h3>
          </div>
          <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
            Cast chemistry for this story
          </p>
        </div>
        <div className="rounded-md border border-border/70 bg-card/70 px-2 py-0.5 text-[9px] font-bold text-muted-foreground">
          {playerName}
        </div>
      </header>

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-border/70 bg-card/30">
        <svg
          aria-hidden="true"
          className="absolute inset-0 size-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {normalizedNodes.map((node) => {
            const trope = COMPLETE_TROPE_MATRIX[node.activeTrope];

            return (
              <line
                className={cn("stroke-current opacity-50", trope?.headerText)}
                key={node.id}
                strokeDasharray={node.affinityScore < 30 ? "2 2" : undefined}
                strokeWidth={node.affinityScore > 70 ? 0.7 : 0.45}
                x1="50"
                x2={node.gridPosition.x}
                y1="50"
                y2={node.gridPosition.y}
              />
            );
          })}
        </svg>

        <div className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <div className="flex size-12 items-center justify-center rounded-full border border-border bg-background text-[10px] font-black uppercase text-foreground shadow-2xl ring-4 ring-background">
            You
          </div>
          <span className="mt-1 max-w-24 truncate rounded-md border border-border/70 bg-background/90 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-muted-foreground">
            {playerName}
          </span>
        </div>

        {normalizedNodes.map((node) => {
          const trope = COMPLETE_TROPE_MATRIX[node.activeTrope];
          const circumference = 2 * Math.PI * 15.9;
          const dashLength = (node.affinityScore / 100) * circumference;

          return (
            <button
              className="group absolute z-20 flex -translate-x-1/2 -translate-y-1/2 cursor-help flex-col items-center transition-transform hover:scale-105 focus:outline-none focus-visible:scale-105"
              key={node.id}
              onBlur={() => setHoveredNode(null)}
              onFocus={() => setHoveredNode(node)}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{
                left: `${node.gridPosition.x}%`,
                top: `${node.gridPosition.y}%`,
              }}
              type="button"
              aria-label={`${node.name}: ${node.relationshipStatus}, ${node.affinityScore}% bond`}
            >
              <span
                className={cn(
                  "relative flex size-10 items-center justify-center rounded-full border bg-background shadow-xl ring-4 ring-background",
                  trope?.border ?? "border-border",
                )}
              >
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 size-full -rotate-90 p-0.5"
                  viewBox="0 0 36 36"
                >
                  <circle
                    className="text-muted"
                    cx="18"
                    cy="18"
                    fill="none"
                    r="15.9"
                    stroke="currentColor"
                    strokeWidth="2.4"
                  />
                  <circle
                    className={trope?.headerText ?? "text-muted-foreground"}
                    cx="18"
                    cy="18"
                    fill="none"
                    r="15.9"
                    stroke="currentColor"
                    strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                    strokeLinecap="round"
                    strokeWidth="2.4"
                  />
                </svg>
                {node.avatarUri ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt=""
                    className="size-7 rounded-full object-cover"
                    src={node.avatarUri}
                  />
                ) : (
                  <span className="relative text-[11px] font-black uppercase text-foreground">
                    {node.name.charAt(0)}
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "mt-1 max-w-24 truncate rounded-md border border-border/70 bg-background/90 px-1.5 py-0.5 text-[9px] font-bold shadow-md transition group-hover:border-primary/45",
                  trope?.headerText,
                )}
              >
                {node.name}
              </span>
            </button>
          );
        })}

        <div
          className={cn(
            "pointer-events-none absolute inset-x-2.5 bottom-2.5 z-30 flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-background/90 p-3 shadow-xl backdrop-blur transition duration-300",
            hoveredNode ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          {hoveredNode ? (
            <>
              <div className="min-w-0 space-y-0.5">
                <span className="block text-[8px] font-black uppercase tracking-wider text-muted-foreground">
                  Current bond
                </span>
                <h4 className="truncate text-xs font-bold text-foreground">
                  {hoveredNode.name}
                </h4>
                <p className="truncate text-[10px] italic text-muted-foreground">
                  {hoveredNode.relationshipStatus}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <span
                  className={cn(
                    "block text-[9px] font-bold uppercase tracking-wide",
                    COMPLETE_TROPE_MATRIX[hoveredNode.activeTrope]?.headerText,
                  )}
                >
                  {COMPLETE_TROPE_MATRIX[hoveredNode.activeTrope]?.label ??
                    hoveredNode.activeTrope}
                </span>
                <div className="mt-1 flex items-center justify-end gap-1.5">
                  <div className="h-1 w-16 overflow-hidden rounded-full border border-border/60 bg-muted">
                    <div
                      className="h-full rounded-full bg-user-primary transition-all duration-500"
                      style={{ width: `${hoveredNode.affinityScore}%` }}
                    />
                  </div>
                  <span className="font-mono text-[9px] font-bold text-muted-foreground">
                    {hoveredNode.affinityScore}%
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex w-full items-center justify-center gap-2 text-[10px] text-muted-foreground">
              <UsersRound className="size-3" />
              Hover a character to inspect the bond.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
