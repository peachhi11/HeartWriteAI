"use client";

import type * as React from "react";
import { Clipboard, CopyPlus, Download, Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function GeneratorGrid(props: { children: React.ReactNode }) {
  return <div className="grid gap-5 lg:grid-cols-[24rem_1fr]">{props.children}</div>;
}

export function GeneratorFormCard(props: {
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <Card className="h-fit bg-card/85">
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">{props.children}</CardContent>
    </Card>
  );
}

export function GeneratorResultCard(props: {
  children: React.ReactNode;
  description: string;
  onCopy: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onExport: () => void;
  onSave: () => void;
  saveLabel?: string;
  title: string;
}) {
  return (
    <Card className="bg-card/85">
      <CardHeader className="gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1.5">
          <CardTitle>{props.title}</CardTitle>
          <CardDescription>{props.description}</CardDescription>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={props.onCopy}>
            <Clipboard className="size-4" />
            Copy
          </Button>
          {props.onDuplicate ? (
            <Button type="button" variant="outline" onClick={props.onDuplicate}>
              <CopyPlus className="size-4" />
              Duplicate
            </Button>
          ) : null}
          <Button type="button" variant="outline" onClick={props.onExport}>
            <Download className="size-4" />
            Export
          </Button>
          {props.onDelete ? (
            <Button type="button" variant="outline" onClick={props.onDelete}>
              <Trash2 className="size-4" />
              Delete
            </Button>
          ) : null}
          <Button type="button" onClick={props.onSave}>
            <Save className="size-4" />
            {props.saveLabel ?? "Save"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">{props.children}</CardContent>
    </Card>
  );
}

export function Field(props: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      <span>{props.label}</span>
      {props.children}
    </label>
  );
}

export function ArtifactLibraryList<T extends { id: string; title?: string; name?: string; summary?: unknown; tags?: string[] }>(
  props: {
    empty: string;
    items: T[];
    onSelect: (item: T) => void;
  },
) {
  if (props.items.length === 0) {
    return <p className="text-sm text-muted-foreground">{props.empty}</p>;
  }

  return (
    <div className="grid gap-2">
      {props.items.slice(0, 8).map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => props.onSelect(item)}
          className="rounded-md border bg-background/70 p-3 text-left transition hover:bg-muted"
        >
          <p className="font-medium">{item.title ?? item.name}</p>
          {item.tags && item.tags.length > 0 ? (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {item.tags.join(", ")}
            </p>
          ) : null}
        </button>
      ))}
    </div>
  );
}
