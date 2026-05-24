"use client";

import { LockKeyhole, Wrench } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRuntimeEngineSettings } from "@/features/settings/runtimeModeStore";
import { RelationshipDashboard } from "./RelationshipDashboard";

export function RuntimeEngineDebugPanel() {
  const { advancedControlsEnabled, hydrated } = useRuntimeEngineSettings();

  if (!advancedControlsEnabled) {
    return (
      <Card className="bg-background/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LockKeyhole data-icon="inline-start" />
            Runtime Engine Hidden
          </CardTitle>
          <CardDescription>
            The engine is powering relationship and emotional tracking, but raw
            controls are hidden in Standard Mode. Enable advanced controls in
            Settings to inspect or test the underlying runtime.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">
            {hydrated ? "Standard Mode" : "Loading mode"}
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="grid gap-4">
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench data-icon="inline-start" />
            Advanced Runtime Engine
          </CardTitle>
          <CardDescription>
            Power-user surface for inspection, test events, deltas, and engine
            controls. This is intentionally separate from the standard authoring
            flow.
          </CardDescription>
        </CardHeader>
      </Card>
      <RelationshipDashboard />
    </section>
  );
}
