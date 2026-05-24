import { cn } from "@/lib/utils";

export function StatBar(props: {
  label: string;
  value: number;
  tone?: "default" | "good" | "risk" | "warm";
}) {
  const value = Math.max(0, Math.min(100, Math.round(props.value)));

  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="truncate text-muted-foreground">{props.label}</span>
        <span className="tabular-nums text-foreground">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-[width]",
            props.tone === "good"
              ? "bg-emerald-500"
              : props.tone === "risk"
                ? "bg-rose-500"
                : props.tone === "warm"
                  ? "bg-amber-500"
                  : "bg-primary",
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
