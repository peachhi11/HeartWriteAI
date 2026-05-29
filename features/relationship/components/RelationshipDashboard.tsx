"use client";

import type * as React from "react";
import { useEffect } from "react";
import {
  Activity,
  HeartHandshake,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Venus,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MessageInput } from "./MessageInput";
import { RelationshipGraphPanel } from "./RelationshipGraphPanel";
import { StatBar } from "./StatBar";
import { useRelationshipStore } from "../store";

export function RelationshipDashboard() {
  const error = useRelationshipStore((state) => state.error);
  const hydrated = useRelationshipStore((state) => state.hydrated);
  const hydrate = useRelationshipStore((state) => state.hydrate);
  const messages = useRelationshipStore((state) => state.messages);
  const reasons = useRelationshipStore((state) => state.reasons);
  const reset = useRelationshipStore((state) => state.reset);
  const state = useRelationshipStore((state) => state.state);
  const tracking = useRelationshipStore((state) => state.tracking);

  useEffect(() => {
    if (!hydrated) {
      void hydrate();
    }
  }, [hydrate, hydrated]);

  return (
    <section className="grid gap-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{state.type}</Badge>
            <Badge variant="secondary">{state.lifecycleState}</Badge>
            <Badge variant="outline">
              {hydrated ? "Saved" : "Loading"}
            </Badge>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Relationship State</h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              A read-only view of how the current chat is changing trust,
              intimacy, conflict, and momentum.
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => void reset()}>
          <RefreshCcw />
          Reset
        </Button>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <RelationshipGraphPanel />

      <div className="grid gap-4 lg:grid-cols-2">
        <MetricPanel icon={ShieldCheck} title="Trust">
          <StatBar label="Emotional" value={state.trust.emotional} tone="good" />
          <StatBar label="Vulnerability" value={state.trust.vulnerability} />
          <StatBar label="Reliability" value={state.trust.reliability} />
          <StatBar label="Conflict" value={state.trust.conflict} tone="warm" />
          <StatBar label="Loyalty" value={state.trust.loyalty} tone="good" />
        </MetricPanel>

        <MetricPanel icon={HeartHandshake} title="Intimacy">
          <StatBar label="Emotional" value={state.intimacy.emotional} />
          <StatBar label="Physical" value={state.intimacy.physical} />
          <StatBar label="Sexual" value={state.intimacy.sexual} />
          <StatBar label="Domestic" value={state.intimacy.domestic} />
          <StatBar label="Vulnerability" value={state.intimacy.vulnerability} />
        </MetricPanel>

        <MetricPanel icon={Sparkles} title="Chemistry">
          <StatBar label="Romantic" value={state.chemistry.romantic} />
          <StatBar label="Sexual" value={state.chemistry.sexual} />
          <StatBar label="Tension" value={state.chemistry.tension} tone="warm" />
          <StatBar label="Devotional" value={state.chemistry.devotional} />
          <StatBar label="Obsessive" value={state.chemistry.obsessive} tone="risk" />
        </MetricPanel>

        <MetricPanel icon={TriangleAlert} title="Rupture">
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Active</span>
              <span>{String(state.rupture.active)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Type</span>
              <span>{state.rupture.type ?? "none"}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Repair Arc</span>
              <span>{state.rupture.repairArc}</span>
            </div>
          </div>
          <StatBar label="Severity" value={state.rupture.severity * 20} tone="risk" />
          <StatBar label="Repair" value={state.rupture.repairProgress} tone="good" />
        </MetricPanel>
      </div>

      <MetricPanel icon={UsersRound} title="Non-Romantic Bond">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{state.nonRomantic.state}</Badge>
          <Badge variant="outline">{state.nonRomantic.romanceOverlap}</Badge>
          {state.nonRomantic.emotionallySignificant ? (
            <Badge variant="outline">emotionally significant</Badge>
          ) : null}
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          <StatBar
            label="Platonic Attachment"
            value={state.nonRomantic.axes.platonicAttachment}
          />
          <StatBar
            label="Emotional Intimacy"
            value={state.nonRomantic.axes.emotionalIntimacy}
          />
          <StatBar
            label="Rivalry"
            value={state.nonRomantic.axes.rivalry}
            tone="warm"
          />
          <StatBar
            label="Ambiguity"
            value={state.nonRomantic.axes.ambiguity}
            tone="risk"
          />
        </div>
      </MetricPanel>

      <MetricPanel icon={Venus} title="Sexual-Only Bond">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{state.sexualOnly.state}</Badge>
          <Badge variant="outline">{state.sexualOnly.statedStructure}</Badge>
          {state.sexualOnly.active ? (
            <Badge variant="outline">active</Badge>
          ) : null}
          {state.sexualOnly.emotionallyComplicated ? (
            <Badge variant="outline">emotionally complicated</Badge>
          ) : null}
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          <StatBar
            label="Sexual Chemistry"
            value={state.sexualOnly.axes.sexualChemistry}
          />
          <StatBar
            label="Emotional Integration"
            value={state.sexualOnly.axes.emotionalIntegration}
          />
          <StatBar
            label="Exclusivity Ambiguity"
            value={state.sexualOnly.axes.exclusivityAmbiguity}
            tone="risk"
          />
          <StatBar
            label="Definition Avoidance"
            value={state.sexualOnly.axes.definitionAvoidance}
            tone="warm"
          />
        </div>
      </MetricPanel>

      {tracking ? (
        <MetricPanel icon={Activity} title="Trajectory">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1">
              <span className="text-xs text-muted-foreground">
                Dominant Momentum
              </span>
              <Badge variant="secondary" className="w-fit">
                {tracking.trajectory.dominantMomentum}
              </Badge>
            </div>
            <div className="grid gap-1">
              <span className="text-xs text-muted-foreground">
                Predicted Next
              </span>
              <div className="flex flex-wrap gap-2">
                {tracking.trajectory.predictedNextStates.map((nextState) => (
                  <Badge key={nextState} variant="outline">
                    {nextState}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            <StatBar
              label="Survivability"
              value={tracking.trajectory.survivability}
              tone="good"
            />
            <StatBar
              label="Rupture Risk"
              value={tracking.trajectory.ruptureRisk}
              tone="risk"
            />
            <StatBar
              label="Intimacy Growth"
              value={tracking.trajectory.intimacyGrowthPotential}
            />
            <StatBar
              label="Trust Recovery"
              value={tracking.trajectory.trustRecoveryPotential}
              tone="warm"
            />
          </div>
        </MetricPanel>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.75fr)]">
        <div className="rounded-md border bg-background/70 p-4">
          <MessageInput />
        </div>

        <MetricPanel icon={Activity} title="Recent Update Reasons">
          {reasons.length ? (
            <div className="grid gap-2">
              {reasons.slice(0, 8).map((reason, index) => (
                <div
                  key={`${reason.key}-${index}`}
                  className="rounded-md border bg-muted/35 p-3 text-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-muted-foreground">
                      {reason.key}
                    </span>
                    <span
                      className={cn(
                        "tabular-nums",
                        reason.delta >= 0 ? "text-emerald-600" : "text-rose-600",
                      )}
                    >
                      {reason.delta >= 0 ? "+" : ""}
                      {reason.delta}
                    </span>
                  </div>
                  <p className="mt-1 text-muted-foreground">{reason.reason}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Process a message to see deterministic state changes here.
            </p>
          )}
        </MetricPanel>
      </div>

      {tracking ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <MetricPanel icon={Activity} title="Recent Events">
            {tracking.recentEvents.length ? (
              <div className="grid gap-2">
                {tracking.recentEvents.slice(0, 6).map((event) => (
                  <div
                    key={event.id}
                    className="rounded-md border bg-muted/35 p-3 text-sm"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{event.type}</Badge>
                      <span className="text-xs text-muted-foreground">
                        importance {event.importance}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        weight {event.emotionalWeight}
                      </span>
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      {event.summary}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Short-term tracked events appear after message processing.
              </p>
            )}
          </MetricPanel>

          <MetricPanel icon={Activity} title="State Deltas">
            {tracking.deltas.length ? (
              <div className="grid gap-2">
                {tracking.deltas.slice(0, 8).map((delta) => (
                  <div
                    key={`${delta.path}-${String(delta.after)}`}
                    className="rounded-md border bg-muted/35 p-3 text-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        {delta.path}
                      </span>
                      {typeof delta.delta === "number" ? (
                        <span
                          className={cn(
                            "tabular-nums",
                            delta.delta >= 0
                              ? "text-emerald-600"
                              : "text-rose-600",
                          )}
                        >
                          {delta.delta >= 0 ? "+" : ""}
                          {delta.delta}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-muted-foreground">
                      {String(delta.before)} to {String(delta.after)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Scalar state changes are listed here after an update.
              </p>
            )}
          </MetricPanel>
        </div>
      ) : null}

      <div className="rounded-md border bg-muted/25 p-3 text-xs text-muted-foreground">
        Stored messages this session: {messages.length}. Persisted state key is
        scoped to the dashboard scenario and character pair.
      </div>
    </section>
  );
}

function MetricPanel(props: {
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <section className="grid gap-4 rounded-md border bg-background/70 p-4">
      <h3 className="flex items-center gap-2 font-medium">
        <props.icon className="size-4 text-muted-foreground" />
        {props.title}
      </h3>
      <div className="grid gap-3">{props.children}</div>
    </section>
  );
}
