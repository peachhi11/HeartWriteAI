"use client";

import { useMemo, useState } from "react";
import {
  Bot,
  CheckCircle2,
  ClipboardList,
  Code2,
  Diff,
  Loader2,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  applyCharacterCreationRevisionResponse,
  applyLorebookRevisionResponse,
  buildRevisionPromptMessages,
  createCharacterCreationRevisionContext,
  createLorebookRevisionContext,
  formatRevisionContextSections,
  parseRevisionResponse,
  type RevisionApplyResult,
  type RevisionContextSection,
  type RevisionFieldDefinition,
  type RevisionTargetKind,
} from "@/lib/character-card/reviseSession";
import {
  streamLlmCompletion,
  type LlmChatMessage,
  type LlmProviderConfig,
} from "@/lib/inference/llmConnector";
import { loadInferenceConfig } from "@/lib/ui/runtimeInference";
import type { LorebookV3Document } from "@/features/lorebooks/schema";
import type { CharacterCreationForm } from "@/types/character-card/CharacterCreationForm";

interface ReviseSessionPanelProps<TTarget> {
  applyRevisionResponse: (
    target: TTarget,
    response: unknown,
  ) => RevisionApplyResult<TTarget>;
  createContext: (target: TTarget) => {
    contextSections: RevisionContextSection[];
    fields: RevisionFieldDefinition[];
  };
  description: string;
  onApply: (target: TTarget) => void;
  target: TTarget;
  targetKind: RevisionTargetKind;
  targetLabel: string;
  title: string;
}

export function CharacterCreationRevisePanel({
  form,
  onApply,
}: {
  form: CharacterCreationForm;
  onApply: (form: CharacterCreationForm) => void;
}) {
  return (
    <ReviseSessionPanel
      applyRevisionResponse={applyCharacterCreationRevisionResponse}
      createContext={createCharacterCreationRevisionContext}
      description="Revise the creator form through approved character, psychology, engine, and writer-bible fields."
      onApply={onApply}
      target={form}
      targetKind="character_creation_form"
      targetLabel={form.identity.characterName || "Untitled character"}
      title="Revise Character Form"
    />
  );
}

export function LorebookRevisePanel({
  document,
  onApply,
}: {
  document: LorebookV3Document;
  onApply: (document: LorebookV3Document) => void;
}) {
  return (
    <ReviseSessionPanel
      applyRevisionResponse={applyLorebookRevisionResponse}
      createContext={createLorebookRevisionContext}
      description="Revise lorebook titles, entry prose, keys, and runtime toggles through a reviewable patch."
      onApply={onApply}
      target={document}
      targetKind="lorebook_v3"
      targetLabel={document.data.name || "Untitled lorebook"}
      title="Revise Lorebook"
    />
  );
}

function ReviseSessionPanel<TTarget>({
  applyRevisionResponse,
  createContext,
  description,
  onApply,
  target,
  targetKind,
  targetLabel,
  title,
}: ReviseSessionPanelProps<TTarget>) {
  const revisionContext = useMemo(
    () => createContext(target),
    [createContext, target],
  );
  const contextPreview = useMemo(
    () => formatRevisionContextSections(revisionContext.contextSections),
    [revisionContext.contextSections],
  );
  const targetRevisionKey = useMemo(() => JSON.stringify(target), [target]);
  const [instruction, setInstruction] = useState("");
  const [rawResponse, setRawResponse] = useState("");
  const [draftResult, setDraftResult] =
    useState<{
      result: RevisionApplyResult<TTarget>;
      targetRevisionKey: string;
    } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const canGenerate = Boolean(instruction.trim()) && !isGenerating;
  const canPreview = Boolean(rawResponse.trim()) && !isGenerating;
  const activeDraftResult =
    draftResult?.targetRevisionKey === targetRevisionKey
      ? draftResult.result
      : null;

  async function generatePatch() {
    if (!instruction.trim()) {
      return;
    }

    setIsGenerating(true);
    setDraftResult(null);
    setStatus(null);
    setRawResponse("");

    try {
      const messages = buildRevisionPromptMessages({
        contextSections: revisionContext.contextSections,
        fields: revisionContext.fields,
        targetKind,
        targetLabel,
        userInstruction: instruction,
      });
      let streamed = "";

      await streamLlmCompletion(
        messages as LlmChatMessage[],
        createLlmProviderConfig(),
        {
          onToken: (token) => {
            streamed += token;
            setRawResponse(streamed);
          },
        },
      );

      previewPatch(streamed);
    } catch (error) {
      setStatus(formatError(error));
    } finally {
      setIsGenerating(false);
    }
  }

  function previewPatch(raw = rawResponse) {
    try {
      const parsed = parseRevisionResponse(raw, revisionContext.fields);
      const result = applyRevisionResponse(target, parsed);
      setDraftResult({ result, targetRevisionKey });
      setStatus(
        result.diffs.length
          ? `Preview ready: ${result.diffs.length} field${result.diffs.length === 1 ? "" : "s"} changed.`
          : "Preview ready: no field changes.",
      );
    } catch (error) {
      setDraftResult(null);
      setStatus(formatError(error));
    }
  }

  function applyPreview() {
    if (!activeDraftResult) {
      return;
    }

    onApply(activeDraftResult.next);
    setDraftResult(null);
    setStatus("Applied revision patch.");
  }

  return (
    <details className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-3">
      <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-widest text-sky-200">
        {title}
      </summary>
      <div className="mt-4 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-2xl space-y-1">
            <p className="text-xs leading-5 text-muted-foreground">
              {description}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{revisionContext.fields.length} paths</Badge>
              <Badge variant="outline">{targetLabel}</Badge>
            </div>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Bot className="size-3" />
            Review patch
          </Badge>
        </div>

        <Textarea
          className="min-h-24 text-xs leading-5"
          placeholder="Ask for a scoped revision, e.g. make the character engine more cause-based, polish the lorebook keys, or add alternative actions for physical constraints."
          value={instruction}
          onChange={(event) => setInstruction(event.currentTarget.value)}
        />

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            onClick={generatePatch}
            disabled={!canGenerate}
          >
            {isGenerating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <WandSparkles className="size-4" />
            )}
            Generate Patch
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => previewPatch()}
            disabled={!canPreview}
          >
            <Diff className="size-4" />
            Preview Patch
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={applyPreview}
            disabled={!activeDraftResult}
          >
            <CheckCircle2 className="size-4" />
            Apply Diff
          </Button>
        </div>

        <details className="rounded-md border bg-background/70 p-3">
          <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <ClipboardList className="mr-1 inline size-3.5" />
            Context Inspector
          </summary>
          <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-md bg-muted/40 p-3 text-[11px] leading-5 text-muted-foreground">
            {contextPreview}
          </pre>
        </details>

        <details className="rounded-md border bg-background/70 p-3">
          <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <Code2 className="mr-1 inline size-3.5" />
            Patch JSON
          </summary>
          <Textarea
            className="mt-3 min-h-44 font-mono text-[11px] leading-5"
            placeholder='{"operations":[{"path":"identity.characterName","action":"replace","value":"..."}],"summary":"..."}'
            value={rawResponse}
            onChange={(event) => setRawResponse(event.currentTarget.value)}
          />
        </details>

        {status ? (
          <p className="rounded-md border bg-background/70 px-3 py-2 text-xs text-muted-foreground">
            {status}
          </p>
        ) : null}

        {activeDraftResult ? (
          <section className="space-y-3 rounded-md border bg-background/70 p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-sky-400" />
              <h4 className="text-sm font-semibold">Before / After Diff</h4>
            </div>
            {activeDraftResult.diffs.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Patch parsed successfully but did not change any approved fields.
              </p>
            ) : (
              <div className="space-y-3">
                {activeDraftResult.diffs.map((diff) => (
                  <article
                    key={diff.pathId}
                    className="grid gap-2 rounded-md border bg-card/60 p-3"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{diff.group}</Badge>
                      <span className="text-xs font-semibold">{diff.label}</span>
                      <code className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {diff.pathId}
                      </code>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      <DiffBlock label="Before" value={diff.before} />
                      <DiffBlock label="After" value={diff.after} />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : null}
      </div>
    </details>
  );
}

function DiffBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background/70 p-2">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="max-h-48 overflow-auto whitespace-pre-wrap text-xs leading-5 text-muted-foreground">
        {value || "(empty)"}
      </p>
    </div>
  );
}

function createLlmProviderConfig(): LlmProviderConfig {
  const config = loadInferenceConfig();

  return {
    apiKey: config.openRouterApiKey,
    baseUrl: config.provider === "openrouter" ? undefined : config.localEndpoint,
    maxTokens: config.maxTokens,
    model:
      config.provider === "openrouter"
        ? config.openRouterModel
        : config.selectedModel,
    provider: config.provider,
    temperature: config.temperature,
    topP: config.topP,
  };
}

function formatError(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
