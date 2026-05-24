"use client";

import { Flame, MessageCircleQuestion, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  SexualOnlyEdge,
  SexualOnlyEdgeEventType,
} from "@/lib/chat/relationshipSexualOnlyEdge";
import { StatBar } from "./StatBar";

const sexualOnlyEvents = [
  { type: "hookup", label: "Hookup" },
  { type: "repeat_intimacy", label: "Repeat Intimacy" },
  { type: "aftercare", label: "Aftercare" },
  { type: "post_intimacy_withdrawal", label: "Withdrawal" },
  { type: "jealousy", label: "Jealousy" },
  { type: "denies_feelings", label: "Denies Feelings" },
  { type: "asks_what_are_we", label: "What Are We?" },
  { type: "sees_char_with_other", label: "Char With Other" },
  { type: "exclusivity_talk", label: "Exclusivity Talk" },
  { type: "romantic_confession", label: "Confession" },
] satisfies Array<{ type: SexualOnlyEdgeEventType; label: string }>;

export function SexualOnlyEdgePanel(props: {
  edge?: SexualOnlyEdge;
  onEvent: (type: SexualOnlyEdgeEventType) => void;
}) {
  const edge = props.edge;

  return (
    <section className="grid gap-4 rounded-md border bg-background/70 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="grid gap-2">
          <h3 className="flex items-center gap-2 font-medium">
            <Flame className="size-4 text-muted-foreground" />
            Sexual-Only Edge
          </h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{edge?.kind ?? "not started"}</Badge>
            {edge?.flags.exclusivityTalkNeeded ? (
              <Badge variant="destructive">exclusivity talk needed</Badge>
            ) : null}
            {edge?.flags.romanticLeakageDetected ? (
              <Badge variant="outline">romantic leakage</Badge>
            ) : null}
          </div>
        </div>
        <Badge variant="outline" className="w-fit">
          romance optional
        </Badge>
      </div>

      {edge ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <StatBar label="Sexual Chemistry" value={edge.sexualChemistry} />
          <StatBar label="Romantic Feeling" value={edge.romanticFeeling} />
          <StatBar
            label="Attachment Leakage"
            value={edge.emotionalAttachment}
            tone="warm"
          />
          <StatBar label="Sexual Trust" value={edge.sexualTrust} tone="good" />
          <StatBar
            label="Exclusivity Ambiguity"
            value={edge.exclusivityAmbiguity}
            tone="risk"
          />
          <StatBar label="Jealousy" value={edge.jealousy} tone="risk" />
          <StatBar
            label="Definition Avoidance"
            value={edge.definitionAvoidance}
            tone="warm"
          />
          <StatBar
            label="Drift Risk"
            value={edge.attachmentDriftRisk}
            tone="risk"
          />
          <StatBar
            label="Escalation Probability"
            value={edge.romanticEscalationProbability}
          />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Trigger a sexual-only event to create a separate erotic edge for the
          user and character without changing the romantic graph edge.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {sexualOnlyEvents.map((event) => (
          <Button
            key={event.type}
            variant="secondary"
            size="sm"
            onClick={() => props.onEvent(event.type)}
          >
            {event.type === "asks_what_are_we" ? (
              <MessageCircleQuestion />
            ) : event.type === "romantic_confession" ? (
              <Sparkles />
            ) : (
              <Flame />
            )}
            {event.label}
          </Button>
        ))}
      </div>
    </section>
  );
}
