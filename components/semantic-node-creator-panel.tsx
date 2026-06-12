"use client";

import { useState } from "react";
import { BrainCircuit, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  SemanticNodeGenerator,
  type SemanticBrainArchetypeSeed,
  type SemanticMathNode,
} from "@/lib/semanticBrain";

const archetypeOptions: Array<{
  label: string;
  value: SemanticBrainArchetypeSeed;
}> = [
  { label: "Guarded and cold", value: "coldness" },
  { label: "Intense and obsessive", value: "obsession" },
  { label: "Openly vulnerable", value: "vulnerability" },
];

export function SemanticNodeCreatorPanel() {
  const [concept, setConcept] = useState("");
  const [archetypeSeed, setArchetypeSeed] =
    useState<SemanticBrainArchetypeSeed>("vulnerability");
  const [generatedNode, setGeneratedNode] = useState<SemanticMathNode | null>(
    null,
  );
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleGenerate() {
    const trimmedConcept = concept.trim();

    if (!trimmedConcept) {
      setStatus("Enter a concept first.");
      return;
    }

    setIsLoading(true);
    setGeneratedNode(null);
    setStatus("Loading local embedding model...");

    try {
      const node = await SemanticNodeGenerator.autoGenerateNode(
        trimmedConcept,
        archetypeSeed,
        {
          onProgress: (progress) => {
            if (progress.status === "progress" && progress.progress !== undefined) {
              setStatus(`Downloading local embedding model: ${progress.progress.toFixed(1)}%`);
              return;
            }

            if (progress.status) {
              setStatus(`Local embedding model: ${progress.status}`);
            }
          },
        },
      );

      setGeneratedNode(node);
      setStatus("Semantic node compiled.");
    } catch (error) {
      setStatus(`Vector creation failed: ${String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="bg-card/85">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BrainCircuit className="size-4" />
          Semantic Node Compiler
        </CardTitle>
        <CardDescription>
          Compile a concept into a local vector-backed semantic math node.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <label className="grid gap-1.5 text-sm font-medium">
          <span>Concept</span>
          <Input
            value={concept}
            onChange={(event) => setConcept(event.currentTarget.value)}
            placeholder="Fear of abandonment"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-medium">
          <span>Archetype</span>
          <select
            value={archetypeSeed}
            onChange={(event) =>
              setArchetypeSeed(event.currentTarget.value as SemanticBrainArchetypeSeed)
            }
            className="h-9 rounded-md border bg-background px-3 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          >
            {archetypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <Button type="button" disabled={isLoading} onClick={handleGenerate}>
          {isLoading ? <Loader2 className="animate-spin" /> : <BrainCircuit />}
          {isLoading ? "Compiling" : "Compile Node"}
        </Button>

        {status ? (
          <p className="text-xs text-muted-foreground">{status}</p>
        ) : null}

        {generatedNode ? (
          <div className="grid gap-2 rounded-lg border bg-background/60 p-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">{generatedNode.concept}</span>
              <span className="rounded-md border px-2 py-0.5 text-muted-foreground">
                {generatedNode.embedding.length} dimensions
              </span>
              <span className="rounded-md border px-2 py-0.5 text-muted-foreground">
                threshold {generatedNode.sensitivityThreshold}
              </span>
            </div>
            <p>
              <span className="font-medium">Somatic:</span>{" "}
              {generatedNode.spokes.somatic.join(", ")}
            </p>
            <p>
              <span className="font-medium">Behavior:</span>{" "}
              {generatedNode.spokes.behavioral.join(", ")}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
