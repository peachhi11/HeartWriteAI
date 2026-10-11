"use client";

import { useState } from "react";
import { ClipboardCheck, Database, FileJson, Loader2 } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { isTauriRuntime } from "@/lib/tauri/native";
import {
  exportStoryEvalStoredCiReportCommand,
  listStoryEvalStoredHistoryCommand,
  runStoryEvalFixtureTextStoredCommand,
} from "@/lib/character-card/storyEvalStoredHistory";

export interface DevToolsPanelProps {
  onSeeded?: () => void;
}

export function DevToolsPanel({ onSeeded }: DevToolsPanelProps) {
  const isDesktopRuntime = isTauriRuntime();
  const [loadingTarget, setLoadingTarget] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [storyEvalFixtureText, setStoryEvalFixtureText] = useState(
    createDefaultStoryEvalFixtureText(),
  );
  const [storyEvalLoading, setStoryEvalLoading] = useState(false);
  const [storyEvalMessage, setStoryEvalMessage] = useState("");
  const [storyEvalReportText, setStoryEvalReportText] = useState("");

  async function handleGenerationTrigger(targetSize: number) {
    if (!isDesktopRuntime) {
      setMessage(
        "Sample card seeding is available inside the Tauri desktop app.",
      );
      return;
    }

    setLoadingTarget(targetSize);
    setMessage("");

    try {
      const result = await invoke<string>("seed_mock_library_cache", {
        count: targetSize,
      });
      setMessage(result);
      onSeeded?.();
    } catch (error) {
      setMessage(`Execution failure: ${String(error)}`);
    } finally {
      setLoadingTarget(null);
    }
  }

  async function handleStoryEvalRun() {
    setStoryEvalLoading(true);
    setStoryEvalMessage("");
    setStoryEvalReportText("");

    try {
      const result = await runStoryEvalFixtureTextStoredCommand({
        fixtureText: storyEvalFixtureText,
        generatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setStoryEvalMessage(
        `Saved ${result.run.run_id}: ${result.run.review_label}, ${result.run.sample_count} checks.`,
      );
      setStoryEvalReportText(result.serialized_ci_report);
    } catch (error) {
      setStoryEvalMessage(`StoryEval failed: ${String(error)}`);
    } finally {
      setStoryEvalLoading(false);
    }
  }

  async function handleStoryEvalRefresh() {
    setStoryEvalLoading(true);
    setStoryEvalMessage("");

    try {
      const history = await listStoryEvalStoredHistoryCommand();

      setStoryEvalMessage(
        history.runs.length
          ? `${history.runs.length} aggregate StoryEval runs saved locally. Latest: ${history.runs[0]?.run_id}.`
          : "No local StoryEval runs saved yet.",
      );
    } catch (error) {
      setStoryEvalMessage(`StoryEval history failed: ${String(error)}`);
    } finally {
      setStoryEvalLoading(false);
    }
  }

  async function handleStoryEvalExportLatest() {
    setStoryEvalLoading(true);
    setStoryEvalMessage("");
    setStoryEvalReportText("");

    try {
      const history = await listStoryEvalStoredHistoryCommand();
      const latestRun = history.runs[0];

      if (!latestRun) {
        setStoryEvalMessage("No local StoryEval runs available to export.");
        return;
      }

      const report = await exportStoryEvalStoredCiReportCommand({
        generatedAt: new Date().toISOString(),
        runId: latestRun.run_id,
      });

      setStoryEvalMessage(`Exported CI report for ${latestRun.run_id}.`);
      setStoryEvalReportText(report.serialized_ci_report);
    } catch (error) {
      setStoryEvalMessage(`StoryEval export failed: ${String(error)}`);
    } finally {
      setStoryEvalLoading(false);
    }
  }

  const isLoading = loadingTarget !== null;

  return (
    <div className="space-y-4">
      <section className="space-y-4 rounded-lg border border-amber-500/25 bg-amber-500/5 p-5 backdrop-blur-sm">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-400">
            <Database className="size-4" />
            Test Library Tools
          </h2>
          <p className="text-xs text-zinc-400">
            Adds sample cards to the local library so you can test search,
            filters, and page navigation.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading || !isDesktopRuntime}
            onClick={() => handleGenerationTrigger(10)}
          >
            {loadingTarget === 10 ? <Loader2 className="animate-spin" /> : null}
            {loadingTarget === 10 ? "Adding cards" : "Add 10 sample cards"}
          </Button>
          <Button
            type="button"
            disabled={isLoading || !isDesktopRuntime}
            onClick={() => handleGenerationTrigger(100)}
          >
            {loadingTarget === 100 ? <Loader2 className="animate-spin" /> : null}
            {loadingTarget === 100 ? "Adding cards" : "Add 100 sample cards"}
          </Button>
        </div>

        {message ? (
          <p className="rounded border border-zinc-800 bg-zinc-950/60 p-2 font-mono text-xs text-amber-200/85">
            {message}
          </p>
        ) : null}
      </section>

      <section className="space-y-4 rounded-lg border border-violet-500/25 bg-violet-500/5 p-5 backdrop-blur-sm">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-violet-300">
            <ClipboardCheck className="size-4" />
            StoryEval Run History
          </h2>
          <p className="text-xs text-zinc-400">
            Runs aggregate-only StoryEval fixtures and saves local history
            without fixture text or evidence references.
          </p>
        </div>

        <Textarea
          value={storyEvalFixtureText}
          onChange={(event) => setStoryEvalFixtureText(event.target.value)}
          className="min-h-36 font-mono text-xs"
          spellCheck={false}
        />

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            disabled={storyEvalLoading}
            onClick={handleStoryEvalRun}
          >
            {storyEvalLoading ? <Loader2 className="animate-spin" /> : null}
            Run Fixture
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={storyEvalLoading}
            onClick={handleStoryEvalRefresh}
          >
            Refresh History
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={storyEvalLoading}
            onClick={handleStoryEvalExportLatest}
          >
            <FileJson className="size-4" />
            Export Latest CI
          </Button>
        </div>

        {storyEvalMessage ? (
          <p className="rounded border border-zinc-800 bg-zinc-950/60 p-2 font-mono text-xs text-violet-100/85">
            {storyEvalMessage}
          </p>
        ) : null}

        {storyEvalReportText ? (
          <pre className="max-h-52 overflow-auto rounded border border-zinc-800 bg-zinc-950/70 p-3 text-xs text-zinc-200">
            {storyEvalReportText}
          </pre>
        ) : null}
      </section>
    </div>
  );
}

function createDefaultStoryEvalFixtureText() {
  return JSON.stringify(
    {
      run_id: "manual-storyeval-run",
      created_at: new Date().toISOString(),
      streaming_response_reconstruction: {
        suite_id: "streaming-response-reconstruction",
        fixtures: [
          {
            case_id: "manual_token_stitching",
            evidence_ref: "manual:streaming-fixture",
            expected_text: "Visible only inside this fixture.",
            reconstructed_text: "Visible only inside this fixture.",
            final_buffer_flushed: true,
          },
        ],
      },
    },
    null,
    2,
  );
}
