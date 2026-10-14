"use client";

import { useState } from "react";
import {
  ClipboardCheck,
  Download,
  FileJson,
  GitCompare,
  Loader2,
  RefreshCw,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  createStoryEvalCiReportDownload,
  createStoryEvalDashboardState,
  formatStoryEvalComparisonSummary,
  storyEvalPrivateToolsRenderContract,
  type StoryEvalDashboardState,
} from "@/lib/character-card/storyEvalDashboard";
import type {
  StoryEvalRunComparison,
  StoryEvalRunHistoryFile,
} from "@/lib/character-card/storyEvalRunner";
import {
  compareStoryEvalStoredHistoryCommand,
  exportStoryEvalStoredCiReportCommand,
  listStoryEvalStoredHistoryCommand,
  runStoryEvalFixtureTextStoredCommand,
} from "@/lib/character-card/storyEvalStoredHistory";

export function StoryEvalPrivateToolsPanel() {
  const [fixtureText, setFixtureText] = useState(createDefaultFixtureText());
  const [history, setHistory] = useState<StoryEvalRunHistoryFile | null>(null);
  const [dashboard, setDashboard] = useState<StoryEvalDashboardState>(() =>
    createStoryEvalDashboardState({
      version: 1,
      updated_at: "",
      runs: [],
    }),
  );
  const [comparison, setComparison] = useState<StoryEvalRunComparison | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("Refresh history to load saved aggregate StoryEval runs.");
  const [reportText, setReportText] = useState("");

  async function handleRun() {
    setIsLoading(true);
    setMessage("");
    setReportText("");
    setComparison(null);

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
      updateDashboard(result.history, {
        candidateRunId: result.run.run_id,
        baselineRunId: dashboard.candidateRunId,
      });
    } catch (error) {
      setMessage(`StoryEval failed: ${String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshHistory(selection?: { baselineRunId?: string; candidateRunId?: string }) {
    const nextHistory = await listStoryEvalStoredHistoryCommand();
    const nextDashboard = updateDashboard(nextHistory, selection);

    return nextDashboard;
  }

  async function handleRefresh() {
    setIsLoading(true);
    setMessage("");

    try {
      const nextDashboard = await refreshHistory({
        baselineRunId: dashboard.baselineRunId,
        candidateRunId: dashboard.candidateRunId,
      });

      setMessage(nextDashboard.statusText);
    } catch (error) {
      setMessage(`StoryEval history failed: ${String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCompare() {
    if (!dashboard.canCompare) {
      setMessage("Choose two different saved runs before comparing.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setComparison(null);

    try {
      const result = await compareStoryEvalStoredHistoryCommand({
        baselineRunId: dashboard.baselineRunId,
        candidateRunId: dashboard.candidateRunId,
      });

      setComparison(result);
      setMessage(`Compared ${result.baseline_run_id} against ${result.candidate_run_id}.`);
    } catch (error) {
      setMessage(`StoryEval compare failed: ${String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExportLatest() {
    await handleExportRun(dashboard.candidateRunId || dashboard.latestRun?.run_id || "");
  }

  async function handleExportRun(runId: string) {
    if (!runId) {
      setMessage("No local StoryEval runs available to export.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setReportText("");

    try {
      const report = await exportStoryEvalStoredCiReportCommand({
        baselineRunId: dashboard.canCompare ? dashboard.baselineRunId : undefined,
        generatedAt: new Date().toISOString(),
        runId,
      });
      const download = createStoryEvalCiReportDownload({
        report,
        runId,
      });

      setMessage(`Exported CI report for ${runId}.`);
      setReportText(download.text);
      downloadTextFile(download);
    } catch (error) {
      setMessage(`StoryEval export failed: ${String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectionChange(field: "baselineRunId" | "candidateRunId", runId: string) {
    if (!history) {
      return;
    }

    setComparison(null);
    updateDashboard(history, {
      baselineRunId: field === "baselineRunId" ? runId : dashboard.baselineRunId,
      candidateRunId: field === "candidateRunId" ? runId : dashboard.candidateRunId,
    });
  }

  async function handleFixtureFileLoad(file: File | null) {
    if (!file) {
      return;
    }

    try {
      setFixtureText(await file.text());
      setMessage(`Loaded fixture text from ${file.name}.`);
    } catch (error) {
      setMessage(`Fixture load failed: ${String(error)}`);
    }
  }

  function updateDashboard(
    nextHistory: StoryEvalRunHistoryFile,
    selection?: {
      baselineRunId?: string;
      candidateRunId?: string;
    },
  ) {
    const nextDashboard = createStoryEvalDashboardState(nextHistory, selection);

    setHistory(nextHistory);
    setDashboard(nextDashboard);

    return nextDashboard;
  }

  return (
    <section className="space-y-5 rounded-lg border border-violet-500/25 bg-violet-500/5 p-5 backdrop-blur-sm">
      <div className="space-y-1">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-violet-300">
          <ClipboardCheck className="size-4" />
          {storyEvalPrivateToolsRenderContract.title}
        </h2>
        <p className="text-xs text-zinc-400">
          {storyEvalPrivateToolsRenderContract.privacyDescription}
        </p>
      </div>

      <div className="grid gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4 md:grid-cols-4">
        <SummaryTile label="Saved Runs" value={String(dashboard.runOptions.length)} />
        <SummaryTile label="Latest" value={dashboard.latestRun?.review_label ?? "None"} />
        <SummaryTile label="Checks" value={String(dashboard.latestRun?.sample_count ?? 0)} />
        <SummaryTile
          label="Mitigations"
          value={String(dashboard.latestRun?.mitigation_proposal_count ?? 0)}
        />
      </div>

      <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-950/35 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              {storyEvalPrivateToolsRenderContract.fixtureLoaderTitle}
            </h3>
            <p className="text-xs text-zinc-500">
              Paste JSON/JSONL or load a local fixture file. Only aggregate summaries are saved.
            </p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-900">
            <Upload className="size-4" />
            Load Fixture File
            <input
              type="file"
              accept=".json,.jsonl,.txt,application/json"
              className="sr-only"
              onChange={(event) =>
                void handleFixtureFileLoad(event.currentTarget.files?.[0] ?? null)
              }
            />
          </label>
        </div>

        <Textarea
          value={fixtureText}
          onChange={(event) => setFixtureText(event.target.value)}
          className="min-h-36 font-mono text-xs"
          spellCheck={false}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" disabled={isLoading} onClick={handleRun}>
          {isLoading ? <Loader2 className="animate-spin" /> : null}
          {storyEvalPrivateToolsRenderContract.runAction}
        </Button>
        <Button type="button" variant="outline" disabled={isLoading} onClick={handleRefresh}>
          <RefreshCw className="size-4" />
          {storyEvalPrivateToolsRenderContract.refreshAction}
        </Button>
      </div>

      <div className="grid gap-4 rounded-lg border border-zinc-800 bg-zinc-950/35 p-4 md:grid-cols-[1fr_1fr_auto]">
        <RunSelector
          disabled={isLoading || dashboard.runOptions.length === 0}
          label="Baseline"
          options={dashboard.runOptions}
          value={dashboard.baselineRunId}
          onChange={(runId) => handleSelectionChange("baselineRunId", runId)}
        />
        <RunSelector
          disabled={isLoading || dashboard.runOptions.length === 0}
          label="Candidate"
          options={dashboard.runOptions}
          value={dashboard.candidateRunId}
          onChange={(runId) => handleSelectionChange("candidateRunId", runId)}
        />
        <div className="flex items-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading || !dashboard.canCompare}
            onClick={handleCompare}
          >
            <GitCompare className="size-4" />
            {storyEvalPrivateToolsRenderContract.compareAction}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isLoading || !dashboard.candidateRunId}
          onClick={handleExportLatest}
        >
          <FileJson className="size-4" />
          {storyEvalPrivateToolsRenderContract.exportAction}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!reportText}
          onClick={() =>
            downloadTextFile({
              fileName: `storyeval-${dashboard.candidateRunId || "run"}-ci-report.json`,
              text: reportText,
            })
          }
        >
          <Download className="size-4" />
          Download Again
        </Button>
      </div>

      {message ? (
        <p className="rounded border border-zinc-800 bg-zinc-950/60 p-2 font-mono text-xs text-violet-100/85">
          {message}
        </p>
      ) : null}

      {comparison ? (
        <pre className="max-h-40 overflow-auto rounded border border-zinc-800 bg-zinc-950/70 p-3 text-xs text-zinc-200">
          {formatStoryEvalComparisonSummary(comparison)}
        </pre>
      ) : null}

      {reportText ? (
        <pre className="max-h-52 overflow-auto rounded border border-zinc-800 bg-zinc-950/70 p-3 text-xs text-zinc-200">
          {reportText}
        </pre>
      ) : null}
    </section>
  );
}

function SummaryTile(props: { label: string; value: string }) {
  return (
    <div className="space-y-1 rounded-md border border-zinc-800 bg-zinc-950/50 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        {props.label}
      </p>
      <p className="truncate text-sm font-semibold text-zinc-100">{props.value}</p>
    </div>
  );
}

function RunSelector(props: {
  disabled: boolean;
  label: string;
  onChange: (runId: string) => void;
  options: StoryEvalDashboardState["runOptions"];
  value: string;
}) {
  return (
    <label className="space-y-1 text-xs text-zinc-400">
      <span className="font-semibold uppercase tracking-wider">{props.label}</span>
      <select
        value={props.value}
        disabled={props.disabled}
        onChange={(event) => props.onChange(event.currentTarget.value)}
        className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 disabled:opacity-50"
      >
        <option value="">No run selected</option>
        {props.options.map((option) => (
          <option key={option.run_id} value={option.run_id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function downloadTextFile(input: { fileName: string; text: string }) {
  const blob = new Blob([input.text], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = input.fileName;
  anchor.click();
  URL.revokeObjectURL(url);
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
