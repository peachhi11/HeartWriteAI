"use client";

import { useEffect } from "react";
import { GitFork, RefreshCcw, Sparkles, UserRoundCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  sexualOnlyEdgeId,
  type SexualOnlyEdgeEventType,
} from "@/lib/chat/relationshipSexualOnlyEdge";
import { StatBar } from "./StatBar";
import { SexualOnlyEdgePanel } from "./SexualOnlyEdgePanel";
import { useRelationshipGraphStore } from "../graphStore";

const exampleEvents = [
  {
    type: "rival_gets_comfort_role" as const,
    label: "Rival Comforts Char",
    summary: "The rival comforted the character before the user could.",
    romanticThreat: 70,
    humiliationImpact: 45,
    replacementThreat: 75,
    tags: ["rivalry", "jealousy", "replacement_fear"],
  },
  {
    type: "rival_gets_kiss" as const,
    label: "Rival Kiss",
    summary: "The rival kissed the character, and the user saw it.",
    romanticThreat: 95,
    humiliationImpact: 85,
    replacementThreat: 95,
    tags: ["rivalry", "kiss", "romantic_threat"],
  },
  {
    type: "user_gets_reassurance" as const,
    label: "Char Reassures User",
    summary: "The character chose to reassure the user after rival tension.",
    romanticThreat: 0,
    humiliationImpact: 0,
    replacementThreat: 40,
    tags: ["reassurance", "rivalry", "repair"],
  },
] as const;

export function RelationshipGraphPanel() {
  const addEvent = useRelationshipGraphStore((state) => state.addEvent);
  const addSexualOnlyEvent = useRelationshipGraphStore(
    (state) => state.addSexualOnlyEvent,
  );
  const error = useRelationshipGraphStore((state) => state.error);
  const events = useRelationshipGraphStore((state) => state.events);
  const graph = useRelationshipGraphStore((state) => state.graph);
  const hydrated = useRelationshipGraphStore((state) => state.hydrated);
  const hydrate = useRelationshipGraphStore((state) => state.hydrate);
  const mainLoveInterestId = useRelationshipGraphStore(
    (state) => state.mainLoveInterestId,
  );
  const reset = useRelationshipGraphStore((state) => state.reset);
  const userId = useRelationshipGraphStore((state) => state.userId);
  const edges = Object.values(graph.edges);
  const sexualOnlyEdge = graph.sexualOnlyEdges[
    sexualOnlyEdgeId(userId, mainLoveInterestId)
  ];

  useEffect(() => {
    if (!hydrated) {
      void hydrate();
    }
  }, [hydrate, hydrated]);

  return (
    <section className="grid gap-4 rounded-md border bg-background/70 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="grid gap-2">
          <h3 className="flex items-center gap-2 font-medium">
            <GitFork className="size-4 text-muted-foreground" />
            Relationship Graph
          </h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{hydrated ? "Persisted" : "Loading Graph"}</Badge>
            <Badge variant="secondary">{edges.length} edges</Badge>
            <Badge variant="outline">{events.length} events</Badge>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => void reset()}>
          <RefreshCcw />
          Reset Graph
        </Button>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {exampleEvents.map((event) => (
          <Button
            key={event.type}
            variant="secondary"
            size="sm"
            onClick={() =>
              void addEvent({
                id: `graph_evt_${Date.now()}_${event.type}`,
                timestamp: Date.now(),
                actorId:
                  event.type === "user_gets_reassurance"
                    ? mainLoveInterestId
                    : "rival",
                targetId:
                  event.type === "user_gets_reassurance"
                    ? userId
                    : mainLoveInterestId,
                observerIds: [userId],
                type: event.type,
                summary: event.summary,
                visibility: "seen",
                emotionalWeight: event.type === "rival_gets_kiss" ? 95 : 80,
                romanticThreat: event.romanticThreat,
                humiliationImpact: event.humiliationImpact,
                replacementThreat: event.replacementThreat,
                tags: [...event.tags],
              })
            }
          >
            {event.type === "user_gets_reassurance" ? (
              <UserRoundCheck />
            ) : (
              <Sparkles />
            )}
            {event.label}
          </Button>
        ))}
      </div>

      <SexualOnlyEdgePanel
        edge={sexualOnlyEdge}
        onEvent={(type) =>
          void addSexualOnlyEvent({
            id: `sexual_only_evt_${Date.now()}_${type}`,
            timestamp: Date.now(),
            aId: userId,
            bId: mainLoveInterestId,
            type,
            summary: getSexualOnlyEventSummary(type),
            emotionalWeight:
              type === "romantic_confession" || type === "sees_char_with_other"
                ? 85
                : 60,
            tags: ["sexual_only", type],
          })
        }
      />

      {edges.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {edges.map((edge) => (
            <section key={edge.id} className="grid gap-3 rounded-md border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="font-medium">
                    {edge.aId} <span className="text-muted-foreground">to</span>{" "}
                    {edge.bId}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {edge.memories.length} promoted memories
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{edge.kind}</Badge>
                  {edge.flags.rivalThreat ? (
                    <Badge variant="destructive">rival threat</Badge>
                  ) : null}
                  {edge.flags.ruptureActive ? (
                    <Badge variant="destructive">rupture</Badge>
                  ) : null}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <StatBar label="Romantic" value={edge.romantic} />
                <StatBar label="Platonic" value={edge.platonic} />
                <StatBar label="Trust" value={edge.trust} tone="good" />
                <StatBar label="Jealousy" value={edge.jealousy} tone="risk" />
                <StatBar label="Tension" value={edge.tension} tone="warm" />
                <StatBar label="Ambiguity" value={edge.ambiguity} />
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Add a graph event to create relationship edges across user, character,
          and NPC participants.
        </p>
      )}
    </section>
  );
}

function getSexualOnlyEventSummary(type: SexualOnlyEdgeEventType) {
  switch (type) {
    case "hookup":
      return "A sexual encounter established erotic connection without relationship definition.";
    case "repeat_intimacy":
      return "Repeated intimacy began creating attachment leakage.";
    case "aftercare":
      return "Aftercare made the sexual-only bond feel safer and more emotionally connected.";
    case "post_intimacy_withdrawal":
      return "Someone withdrew after intimacy to preserve emotional distance.";
    case "jealousy":
      return "Jealousy revealed emotional significance beyond the stated sexual-only structure.";
    case "denies_feelings":
      return "Feelings were denied despite signs of emotional attachment.";
    case "asks_what_are_we":
      return "Someone asked what the relationship means.";
    case "sees_char_with_other":
      return "Seeing the character with someone else activated ambiguity and jealousy.";
    case "exclusivity_talk":
      return "The sexual-only relationship negotiated exclusivity expectations.";
    case "romantic_confession":
      return "A romantic confession pushed the sexual-only bond toward relationship escalation.";
  }
}
