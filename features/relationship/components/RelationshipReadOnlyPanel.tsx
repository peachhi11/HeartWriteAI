"use client";

import type * as React from "react";
import { useEffect } from "react";
import {
  Brain,
  HeartPulse,
  Route,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  buildRelationshipInsights,
  filterRelationshipInsights,
} from "@/lib/chat/relationshipInsights";
import { StatBar } from "./StatBar";
import { useRelationshipStore } from "../store";

export function RelationshipReadOnlyPanel() {
  const hydrated = useRelationshipStore((state) => state.hydrated);
  const hydrate = useRelationshipStore((state) => state.hydrate);
  const state = useRelationshipStore((state) => state.state);
  const tracking = useRelationshipStore((state) => state.tracking);
  const insights = filterRelationshipInsights(
    buildRelationshipInsights(state, tracking),
    "standard",
  );

  useEffect(() => {
    if (!hydrated) {
      void hydrate();
    }
  }, [hydrate, hydrated]);

  return (
    <section className="grid gap-4">
      <Card className="bg-background/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartPulse data-icon="inline-start" />
            Relationship Tracker
          </CardTitle>
          <CardDescription>
            Read-only emotional consequences for the selected character/persona
            storyline. These are outcomes, not user-adjustable controls.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{state.lifecycleState}</Badge>
            <Badge variant="outline">{state.type}</Badge>
            {tracking ? (
              <Badge variant="outline">
                {tracking.trajectory.dominantMomentum}
              </Badge>
            ) : null}
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <StatBar
              label="Emotional Trust"
              value={state.trust.emotional}
              tone="good"
            />
            <StatBar
              label="Bond Depth"
              value={state.attachment.bondDepth}
            />
            <StatBar
              label="Emotional Intimacy"
              value={state.intimacy.emotional}
            />
            <StatBar
              label="Rupture Risk"
              value={tracking?.trajectory.ruptureRisk ?? state.rupture.trustDamage}
              tone="risk"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <InsightCard
          icon={Brain}
          title="Emotional Brain"
          summary={
            insights.find((insight) => insight.id === "emotional_brain")
              ?.summary ?? "Emotional state is still forming."
          }
        />
        <InsightCard
          icon={Route}
          title="Trajectory"
          summary={
            insights.find((insight) => insight.id === "trajectory")?.summary ??
            "Trajectory will appear after the relationship has enough signal."
          }
        />
        <InsightCard
          icon={ShieldCheck}
          title="Attachment Direction"
          summary={
            insights.find((insight) => insight.id === "attachment_direction")
              ?.summary ?? "Attachment is currently stable."
          }
        />
        <InsightCard
          icon={Sparkles}
          title="Current Meaning"
          summary={
            insights.find((insight) => insight.id === "relationship_tracker")
              ?.summary ?? "Relationship meaning is still being established."
          }
        />
      </div>
    </section>
  );
}

function InsightCard(props: {
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  title: string;
}) {
  return (
    <Card className="bg-background/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <props.icon className="size-4 text-muted-foreground" />
          {props.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">
          {props.summary}
        </p>
      </CardContent>
    </Card>
  );
}
