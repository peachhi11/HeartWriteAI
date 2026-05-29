"use client";

import { useEffect } from "react";
import { Brain, Flag, HeartPulse, Route, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RelationshipReadOnlyPanel } from "./RelationshipReadOnlyPanel";
import { StatBar } from "./StatBar";
import { useRelationshipStore } from "../store";

export function RelationshipTrackerWorkspace() {
  const hydrated = useRelationshipStore((state) => state.hydrated);
  const hydrate = useRelationshipStore((state) => state.hydrate);
  const reasons = useRelationshipStore((state) => state.reasons);
  const state = useRelationshipStore((state) => state.state);
  const tracking = useRelationshipStore((state) => state.tracking);

  useEffect(() => {
    if (!hydrated) {
      void hydrate();
    }
  }, [hydrate, hydrated]);

  return (
    <div className="grid gap-5">
      <RelationshipReadOnlyPanel />

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="bg-background/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="size-5 text-muted-foreground" />
              Emotional Brain Metrics
            </CardTitle>
            <CardDescription>
              Read-only relationship signals drawn from chat choices, scenario
              pressure, repair, intimacy, and emotional momentum.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 lg:grid-cols-2">
            <MetricGroup title="Trust" values={state.trust} />
            <MetricGroup title="Intimacy" values={state.intimacy} />
            <MetricGroup title="Chemistry" values={state.chemistry} />
            <MetricGroup title="Compatibility" values={state.compatibility} />
            <MetricGroup title="Needs" values={state.needs} />
            <MetricGroup title="Wounds" values={state.wounds} tone="risk" />
            <MetricGroup title="Momentum" values={state.momentum} signed />
            <MetricGroup
              title="Non-Romantic Axes"
              values={state.nonRomantic.axes}
            />
            <MetricGroup
              title="Sexual-Only Axes"
              values={state.sexualOnly.axes}
            />
          </CardContent>
        </Card>

        <div className="grid content-start gap-4">
          <Card className="bg-background/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="size-5 text-muted-foreground" />
                Trajectory
              </CardTitle>
              <CardDescription>
                Where the relationship appears to be heading.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{state.lifecycleState}</Badge>
                <Badge variant="outline">{state.nonRomantic.state}</Badge>
                <Badge variant="outline">{state.sexualOnly.state}</Badge>
                {tracking ? (
                  <Badge variant="outline">
                    {tracking.trajectory.dominantMomentum}
                  </Badge>
                ) : null}
              </div>
              <StatBar
                label="Survivability"
                value={tracking?.trajectory.survivability ?? 0}
                tone="good"
              />
              <StatBar
                label="Rupture Risk"
                value={tracking?.trajectory.ruptureRisk ?? 0}
                tone="risk"
              />
              <StatBar
                label="Intimacy Growth Potential"
                value={tracking?.trajectory.intimacyGrowthPotential ?? 0}
              />
              <StatBar
                label="Trust Recovery Potential"
                value={tracking?.trajectory.trustRecoveryPotential ?? 0}
                tone="warm"
              />
              {tracking?.trajectory.predictedNextStates.length ? (
                <div className="grid gap-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Predicted Next States
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tracking.trajectory.predictedNextStates.map((item) => (
                      <Badge key={item} variant="outline">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="bg-background/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-muted-foreground" />
                Rupture & Repair
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <StatBar
                label="Severity"
                value={state.rupture.severity * 20}
                tone="risk"
              />
              <StatBar
                label="Repair Progress"
                value={state.rupture.repairProgress}
                tone="good"
              />
              <StatBar
                label="Accountability"
                value={state.rupture.accountabilityLevel}
              />
              <StatBar
                label="Changed Behavior Evidence"
                value={state.rupture.changedBehaviorEvidence}
              />
              <p className="rounded-md border bg-background/70 p-3 text-sm text-muted-foreground">
                {state.rupture.active
                  ? `Active rupture: ${state.rupture.type ?? "unspecified"} via ${state.rupture.repairArc}.`
                  : "No active rupture currently detected."}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartPulse className="size-5 text-muted-foreground" />
                Emotional Role Ownership
              </CardTitle>
              <CardDescription>
                Important relational roles that can drive jealousy, safety,
                displacement, or rival pressure.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              {Object.entries(state.npcDynamics.roleOwnership).map(
                ([role, owner]) => (
                  <div
                    key={role}
                    className="flex items-center justify-between gap-3 rounded-md border bg-background/70 px-3 py-2"
                  >
                    <span className="text-muted-foreground">
                      {formatMetricLabel(role)}
                    </span>
                    <span className="font-medium">{owner ?? "unclaimed"}</span>
                  </div>
                ),
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-background/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="size-5 text-muted-foreground" />
              Recent Deltas
            </CardTitle>
            <CardDescription>
              What changed most recently and why.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {reasons.length ? (
              reasons.map((reason, index) => (
                <div
                  key={`${reason.key}-${index}`}
                  className="rounded-md border bg-background/70 p-3 text-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-muted-foreground">
                      {reason.key}
                    </span>
                    <span
                      className={
                        reason.delta >= 0 ? "text-emerald-600" : "text-rose-600"
                      }
                    >
                      {reason.delta >= 0 ? "+" : ""}
                      {reason.delta}
                    </span>
                  </div>
                  <p className="mt-1 text-muted-foreground">{reason.reason}</p>
                </div>
              ))
            ) : (
              <p className="rounded-md border bg-background/70 p-3 text-sm text-muted-foreground">
                No update deltas yet. Chat choices will populate this section.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-background/70">
          <CardHeader>
            <CardTitle>Important Memories</CardTitle>
            <CardDescription>
              Promoted moments that are likely to matter later.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {state.memories.length ? (
              state.memories.slice(0, 8).map((memory) => (
                <div
                  key={memory.id}
                  className="rounded-md border bg-background/70 p-3 text-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="outline">{memory.type}</Badge>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {memory.emotionalWeight}
                    </span>
                  </div>
                  <p className="mt-2 text-muted-foreground">{memory.summary}</p>
                </div>
              ))
            ) : (
              <p className="rounded-md border bg-background/70 p-3 text-sm text-muted-foreground">
                No promoted romantic memories yet.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function MetricGroup(props: {
  signed?: boolean;
  title: string;
  tone?: "default" | "good" | "risk" | "warm";
  values: object;
}) {
  const values = Object.entries(props.values).filter(
    (entry): entry is [string, number] => typeof entry[1] === "number",
  );

  return (
    <div className="grid gap-3 rounded-md border bg-background/70 p-4">
      <h2 className="text-sm font-semibold">{props.title}</h2>
      {values.map(([key, value]) => (
        <StatBar
          key={key}
          label={formatMetricLabel(key)}
          value={props.signed ? (value + 100) / 2 : value}
          tone={props.tone ?? (value < 0 ? "risk" : "default")}
        />
      ))}
    </div>
  );
}

function formatMetricLabel(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replaceAll("_", " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}
