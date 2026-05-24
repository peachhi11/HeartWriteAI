"use client";

import { Settings2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRuntimeEngineSettings } from "../runtimeModeStore";

export function AdvancedRuntimeSettings() {
  const {
    advancedControlsEnabled,
    hydrated,
    mode,
    setAdvancedControlsEnabled,
  } = useRuntimeEngineSettings();

  return (
    <Card className="bg-background/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 data-icon="inline-start" />
          Runtime Engine Access
        </CardTitle>
        <CardDescription>
          Standard mode keeps engines hidden while showing read-only emotional
          and relationship outcomes. Advanced mode exposes inspection and debug
          controls for power users.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={mode === "advanced" ? "default" : "secondary"}>
            {mode === "advanced" ? "Advanced Mode" : "Standard Mode"}
          </Badge>
          {!hydrated ? <Badge variant="outline">Loading setting</Badge> : null}
        </div>

        <div className="grid gap-2 text-sm text-muted-foreground">
          <p>Standard users can see relationship tracking and emotional brain output.</p>
          <p>Only advanced users can expose raw variables, event controls, and runtime engine panels.</p>
        </div>

        <Button
          type="button"
          variant={advancedControlsEnabled ? "secondary" : "outline"}
          onClick={() => setAdvancedControlsEnabled(!advancedControlsEnabled)}
        >
          {advancedControlsEnabled
            ? "Disable advanced controls"
            : "Enable advanced controls"}
        </Button>
      </CardContent>
    </Card>
  );
}
