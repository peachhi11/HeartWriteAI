"use client";

import { useState } from "react";

import { countTokens } from "@/lib/tauri/tokenCounter";

const MODEL_OPTIONS = ["gpt-4o", "gpt-4", "gpt-3.5-turbo"] as const;

export default function TokenCounter() {
  const [text, setText] = useState("");
  const [model, setModel] = useState<(typeof MODEL_OPTIONS)[number]>("gpt-4o");
  const [tokens, setTokens] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCounting, setIsCounting] = useState(false);

  const handleTokenCount = async () => {
    setIsCounting(true);
    setError(null);

    try {
      setTokens(await countTokens(text, model));
    } catch (caughtError) {
      setTokens(null);
      setError(caughtError instanceof Error ? caughtError.message : String(caughtError));
    } finally {
      setIsCounting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 rounded-xl border border-slate-800 bg-slate-950 p-5 text-slate-100 shadow-xl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-bold tracking-tight">Native Token Counter</h2>
          <p className="text-xs text-slate-400">
            Counts prompt text through the Tauri Rust tokenizer bridge.
          </p>
        </div>
        <select
          className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 outline-none focus:border-pink-500"
          onChange={(event) => setModel(event.currentTarget.value as typeof model)}
          value={model}
        >
          {MODEL_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <textarea
        className="h-32 w-full resize-none rounded-lg border border-slate-800 bg-slate-900 p-3 text-sm text-slate-100 outline-none transition focus:border-pink-500"
        onChange={(event) => setText(event.currentTarget.value)}
        placeholder="Type or paste prompt text here..."
        value={text}
      />

      <button
        className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-500 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isCounting}
        onClick={handleTokenCount}
        type="button"
      >
        {isCounting ? "Counting..." : "Count Tokens"}
      </button>

      {tokens !== null && (
        <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-center text-sm text-emerald-300">
          Token Count: <span className="font-bold">{tokens}</span>
        </p>
      )}

      {error && (
        <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}
