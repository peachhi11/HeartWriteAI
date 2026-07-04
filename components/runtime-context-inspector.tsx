"use client";

import { Activity, BookOpenText, Gauge, MessageSquareText } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ContextDigestInspector } from "@/components/context-digest-inspector";
import type { ContextCompilationResult } from "@/lib/character-card/contextCompiler";
import type { ContextDigest } from "@/lib/character-card/contextDigest";
import { cn } from "@/lib/utils";

export interface RuntimeContextInspectorProps {
  compilation: ContextCompilationResult;
  contextDigest?: ContextDigest;
  className?: string;
}

export function RuntimeContextInspector({
  className,
  compilation,
  contextDigest,
}: RuntimeContextInspectorProps) {
  const { diagnostics, messages } = compilation;
  const usagePercent =
    diagnostics.maxTokens > 0
      ? Math.min(
          100,
          Math.round(
            (diagnostics.totalEstimatedTokens / diagnostics.maxTokens) * 100,
          ),
        )
      : 0;
  const systemMessages = messages.filter((message) => message.role === "system");
  const historyMessages = messages.filter((message) => message.role !== "system");
  const loreMessages = systemMessages.filter((message) =>
    message.content.includes("[WORLD LORE"),
  );

  return (
    <section
      className={cn(
        "grid gap-3 rounded-xl border border-border/70 bg-background/75 p-3 text-xs shadow-sm",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-primary" />
            <h3 className="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Context Inspector
            </h3>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Live prompt sections, token budget, and history pruning.
          </p>
        </div>
        <span className="rounded-md border border-border/70 bg-card px-2 py-1 font-mono text-[10px]">
          {diagnostics.totalEstimatedTokens.toLocaleString()} /{" "}
          {diagnostics.maxTokens.toLocaleString()}
        </span>
      </header>

      <div className="grid gap-1.5">
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              usagePercent > 85
                ? "bg-amber-500"
                : usagePercent > 65
                  ? "bg-primary"
                  : "bg-emerald-500",
            )}
            style={{ width: `${usagePercent}%` }}
          />
        </div>
        <div className="flex justify-between font-mono text-[9px] text-muted-foreground">
          <span>{usagePercent}% used</span>
          <span>{diagnostics.reserveTokens.toLocaleString()} reserved</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <ContextMetric
          icon={Gauge}
          label="Static"
          value={diagnostics.staticTokens.toLocaleString()}
        />
        <ContextMetric
          icon={MessageSquareText}
          label="History"
          value={diagnostics.includedHistoryMessages.toLocaleString()}
        />
        <ContextMetric
          icon={BookOpenText}
          label="Lore"
          value={loreMessages.length.toLocaleString()}
        />
      </div>

      <div className="grid gap-1.5">
        {messages.slice(0, 8).map((message, index) => (
          <div
            key={`${message.role}-${index}-${message.content.slice(0, 16)}`}
            className="rounded-lg border border-border/60 bg-card/70 p-2"
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="truncate text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {labelContextMessage(message.content, message.role)}
              </span>
              <span className="font-mono text-[9px] text-muted-foreground">
                {message.role}
              </span>
            </div>
            <p className="line-clamp-2 text-[11px] leading-4 text-muted-foreground">
              {message.content}
            </p>
          </div>
        ))}
      </div>

      {diagnostics.prunedHistoryMessages > 0 ? (
        <p className="rounded-lg border border-amber-400/25 bg-amber-400/10 p-2 text-[11px] text-amber-700 dark:text-amber-200">
          {diagnostics.prunedHistoryMessages} older message
          {diagnostics.prunedHistoryMessages === 1 ? "" : "s"} pruned to keep
          the reply inside the context budget.
        </p>
      ) : (
        <p className="text-[11px] text-muted-foreground">
          {historyMessages.length} chat message
          {historyMessages.length === 1 ? "" : "s"} included. No history is
          currently being pruned.
        </p>
      )}

      {contextDigest ? (
        <ContextDigestInspector contextDigest={contextDigest} />
      ) : null}
    </section>
  );
}

function ContextMetric({
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
      <p className="mt-1 font-mono text-sm text-foreground">{value}</p>
    </div>
  );
}

function labelContextMessage(content: string, role: string) {
  if (content.includes("[WORLD LORE")) {
    return "Active lore";
  }

  if (content.includes("[CURRENT SCENARIO")) {
    return "Scenario";
  }

  if (role === "system") {
    return "System guidance";
  }

  return role === "assistant" ? "Character reply" : "User turn";
}
