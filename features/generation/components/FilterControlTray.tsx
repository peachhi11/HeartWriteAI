"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AXIS_FILTERS, type AxisFilter } from "@/types/studio";

interface FilterControlTrayProps {
  activeAxis: AxisFilter;
  searchQuery: string;
  setActiveAxis: (axis: AxisFilter) => void;
  setSearchQuery: (query: string) => void;
  totalCount: number;
}

export function FilterControlTray(props: FilterControlTrayProps) {
  return (
    <div className="grid gap-3 rounded-md border bg-background/70 p-3 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-9 pl-8 pr-9 text-xs"
            onChange={(event) => props.setSearchQuery(event.currentTarget.value)}
            placeholder="Search personas by name, ID, or tone..."
            value={props.searchQuery}
          />
          {props.searchQuery ? (
            <Button
              aria-label="Clear persona search"
              className="absolute right-1 top-1/2 size-7 -translate-y-1/2 text-muted-foreground"
              onClick={() => props.setSearchQuery("")}
              size="icon"
              type="button"
              variant="ghost"
            >
              <X className="size-3.5" />
            </Button>
          ) : null}
        </div>

        <div className="flex h-9 shrink-0 items-center justify-center rounded-md border bg-background px-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          Matched
          <span className="ml-1 font-mono text-primary">{props.totalCount}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[10px] font-black uppercase tracking-wide text-muted-foreground">
          Filter Axis
        </span>
        {AXIS_FILTERS.map((axis) => {
          const isSelected = props.activeAxis === axis;

          return (
            <Button
              className={cn(
                "h-7 px-2 text-[10px] font-bold",
                isSelected
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "text-muted-foreground",
              )}
              key={axis}
              onClick={() => props.setActiveAxis(axis)}
              size="sm"
              type="button"
              variant="outline"
            >
              {axis}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
