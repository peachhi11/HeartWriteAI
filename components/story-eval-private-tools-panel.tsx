"use client";

import { useState } from "react";
import { ClipboardCheck, FileJson, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  exportStoryEvalStoredCiReportCommand,
  listStoryEvalStoredHistoryCommand,
  runStoryEvalFixtureTextStoredCommand,
} from "@/lib/character-card/storyEvalStoredHistory";

export function StoryEvalPrivateToolsPanel() {
  const [fixtureText, setFixtureText] = useState(createDefaultFixtureText());
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [reportText, setReportText] = useState("");

  async function handleRun() {
    setIsLoading(true);
    setMessage("");
    setReportText("");

    try {
      const now = new Date().toISOString();
      const result = await runStoryEvalFixtureTextStoredCommand({
        fixtureText,
        generatedAt: now,
        updatedAt: now,
      });

      setMessage(
        `Saved ${result.run.run_id}: ${result.run.review_label}, ${result.run.sample_count} checks.`,
      );
      setReportText(result.serialized_ci_report);
    } catch (error) {
      setMessage(`StoryEval failed: ${String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRefresh() {
    setIsLoading(true);
    setMessage("");

    try {
      const history = await listStoryEvalStoredHistoryCommand();

      setMessage(
        history.runs.length
          ? `${history.runs.length} aggregate StoryEval runs saved locally. Latest: ${history.runs[0]?.run_id}.`
          : "No local StoryEval runs saved yet.",
      );
    } catch (error) {
      setMessage(`StoryEval history failed: ${String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExportLatest() {
    setIsLoading(true);
    setMessage("");
    setReportText("");

    try {
      const history = await listStoryEvalStoredHistoryCommand();
      const latestRun = history.runs[0];

      if (!latestRun) {
        setMessage("No local StoryEval runs available to export.");
        return;
      }

      const report = await exportStoryEvalStoredCiReportCommand({
        generatedAt: new Date().toISOString(),
        runId: latestRun.run_id,
      });

      setMessage(`Exported CI report for ${latestRun.run_id}.`);
      setReportText(report.serialized_ci_report);
    } catch (error) {
      setMessage(`StoryEval export failed: ${String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="space-y-4 rounded-lg border border-violet-500/25 bg-violet-500/5 p-5 backdrop-blur-sm">
      <div className="space-y-1">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-violet-300">
          <ClipboardCheck className="size-4" />
          StoryEval Run History
        </h2>
        <p className="text-xs text-zinc-400">
          Private power-user tools for aggregate-only StoryEval fixtures.
          Hidden from public app surfaces by default.
        </p>
      </div>

      <Textarea
        value={fixtureText}
        onChange={(event) => setFixtureText(event.target.value)}
        className="min-h-36 font-mono text-xs"
        spellCheck={false}
      />

      <div className="flex flex-wrap gap-3">
        <Button type="button" disabled={isLoading} onClick={handleRun}>
          {isLoading ? <Loader2 className="animate-spin" /> : null}
          Run Fixture
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={handleRefresh}
        >
          Refresh History
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={handleExportLatest}
        >
          <FileJson className="size-4" />
          Export Latest CI
        </Button>
      </div>

      {message ? (
        <p className="rounded border border-zinc-800 bg-zinc-950/60 p-2 font-mono text-xs text-violet-100/85">
          {message}
        </p>
      ) : null}

      {reportText ? (
        <pre className="max-h-52 overflow-auto rounded border border-zinc-800 bg-zinc-950/70 p-3 text-xs text-zinc-200">
          {reportText}
        </pre>
      ) : null}
    </section>
  );
}

function createDefaultFixtureText() {
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
