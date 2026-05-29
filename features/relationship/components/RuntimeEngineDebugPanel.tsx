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
            Advanced Relationship Tools Hidden
          </CardTitle>
          <CardDescription>
            Relationship and emotion tracking are running, but extra controls are
            hidden in Standard Mode. Enable advanced controls in Settings to
            inspect or test them.
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
            Advanced Relationship Tools
          </CardTitle>
          <CardDescription>
            Power-user tools for inspection, test events, and relationship
            changes. This is intentionally separate from the standard authoring
            flow.
          </CardDescription>
        </CardHeader>
      </Card>
      <RelationshipDashboard />
    </section>
  );
}
