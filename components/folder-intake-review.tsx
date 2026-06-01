"use client";

import { useMemo, useState } from "react";
import { Check, FolderOpen, PackageCheck, RefreshCw } from "lucide-react";

import {
  FolderIntakeItem,
  FolderIntakeScanResult,
  useCharacterLibrary,
} from "@/hooks/character-card/useCharacterLibrary";
import { cn } from "@/lib/utils";

export interface FolderIntakeReviewProps {
  isDesktopRuntime: boolean;
  onChooseFolder: () => Promise<string | null>;
  onImported: () => void;
}

const statusLabels: Record<string, string> = {
  broken: "Needs review",
  empty_image: "Image only",
  lorebook: "Lorebook",
  ready: "Ready",
  ready_convert: "Will convert",
  skipped: "Skipped",
};

const formatLabels: Record<string, string> = {
  ccv3_json: "CCV3 JSON",
  ccv3_png: "CCV3 PNG",
  charx: "CHARX",
  v2_json: "V2 JSON",
  v2_png: "V2 PNG",
};

export function FolderIntakeReview({
  isDesktopRuntime,
  onChooseFolder,
  onImported,
}: FolderIntakeReviewProps) {
  const { importFolderCardsAsCharx, scanCharacterCardFolder } =
    useCharacterLibrary();
  const [scanResult, setScanResult] = useState<FolderIntakeScanResult | null>(
    null,
  );
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const selectedImportableCount = useMemo(() => {
    if (!scanResult) {
      return 0;
    }

    return scanResult.items.filter(
      (item) => item.importable && selectedPaths.has(item.file_path),
    ).length;
  }, [scanResult, selectedPaths]);

  async function handleChooseFolder() {
    const folderPath = await onChooseFolder();
    if (!folderPath) {
      return;
    }

    await scanFolder(folderPath);
  }

  async function scanFolder(folderPath: string) {
    setIsScanning(true);
    setMessage(`Scanning ${folderPath}...`);

    try {
      const result = await scanCharacterCardFolder(folderPath);
      setScanResult(result);
      setSelectedPaths(
        new Set(
          result.items
            .filter((item) => item.importable)
            .map((item) => item.file_path),
        ),
      );
      setMessage(
        `Found ${result.importable_count} importable cards in ${result.total_count} reviewed files.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsScanning(false);
    }
  }

  async function handleImportSelected() {
    if (!scanResult || selectedImportableCount === 0) {
      return;
    }

    const paths = scanResult.items
      .filter((item) => item.importable && selectedPaths.has(item.file_path))
      .map((item) => item.file_path);

    setIsImporting(true);
    setMessage(`Saving ${paths.length} selected cards into the local library...`);

    const result = await importFolderCardsAsCharx(paths);
    setIsImporting(false);

    if (result.ok && result.result) {
      onImported();
      setMessage(
        `Saved ${result.result.imported_count} library cards. ${
          result.result.errors.length
            ? `${result.result.errors.length} files need review.`
            : "Library cache refreshed."
        }`,
      );
      if (scanResult.folder_path) {
        await scanFolder(scanResult.folder_path);
      }
    } else {
      setMessage(result.error ?? "Folder import failed.");
    }
  }

  function togglePath(filePath: string) {
    setSelectedPaths((previous) => {
      const next = new Set(previous);
      if (next.has(filePath)) {
        next.delete(filePath);
      } else {
        next.add(filePath);
      }
      return next;
    });
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-950/70">
      <div className="flex flex-col gap-3 border-b border-zinc-800 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Folder Intake Review
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-zinc-500">
            Scan a folder, review what is ready, then save selected cards into
            the local library. PNG/CCV3 remains the primary card format.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleChooseFolder}
            disabled={!isDesktopRuntime || isScanning || isImporting}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:bg-zinc-800 disabled:opacity-50"
          >
            <FolderOpen className="size-4" />
            Choose folder
          </button>
          <button
            type="button"
            onClick={() => scanResult && void scanFolder(scanResult.folder_path)}
            disabled={!scanResult || isScanning || isImporting}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:bg-zinc-800 disabled:opacity-50"
          >
            <RefreshCw className="size-4" />
            Rescan
          </button>
          <button
            type="button"
            onClick={handleImportSelected}
            disabled={selectedImportableCount === 0 || isScanning || isImporting}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
          >
            <PackageCheck className="size-4" />
            Save {selectedImportableCount || ""} CHARX
          </button>
        </div>
      </div>

      {message ? (
        <p className="border-b border-zinc-800 px-4 py-3 text-sm text-zinc-400">
          {message}
        </p>
      ) : null}

      {!isDesktopRuntime ? (
        <p className="p-4 text-sm text-zinc-500">
          Folder intake needs the desktop app because browsers cannot scan local
          folders directly.
        </p>
      ) : null}

      {scanResult ? (
        <div className="max-h-[28rem] overflow-auto">
          <table className="w-full min-w-[48rem] text-left text-sm">
            <thead className="sticky top-0 bg-zinc-950 text-[10px] uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="w-12 px-4 py-3">Use</th>
                <th className="px-4 py-3">Card</th>
                <th className="px-4 py-3">Format</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tags</th>
              </tr>
            </thead>
            <tbody>
              {scanResult.items.map((item) => (
                <FolderIntakeRow
                  key={item.file_path}
                  item={item}
                  selected={selectedPaths.has(item.file_path)}
                  onToggle={() => togglePath(item.file_path)}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="p-4 text-sm text-zinc-500">
          No folder scanned yet. Choose the inbox folder when you are ready to
          review a batch.
        </p>
      )}
    </section>
  );
}

function FolderIntakeRow({
  item,
  onToggle,
  selected,
}: {
  item: FolderIntakeItem;
  onToggle: () => void;
  selected: boolean;
}) {
  const tagPreview = item.tags.slice(0, 4).join(", ");

  return (
    <tr className="border-t border-zinc-900">
      <td className="px-4 py-3 align-top">
        <button
          type="button"
          onClick={onToggle}
          disabled={!item.importable}
          className={cn(
            "flex size-6 items-center justify-center rounded border border-zinc-700 text-zinc-500 disabled:opacity-30",
            selected && "border-emerald-400 bg-emerald-400/15 text-emerald-300",
          )}
          aria-label={selected ? "Remove from import" : "Add to import"}
        >
          {selected ? <Check className="size-4" /> : null}
        </button>
      </td>
      <td className="max-w-md px-4 py-3 align-top">
        <p className="font-medium text-zinc-100">
          {item.card_name || item.file_name}
        </p>
        <p className="mt-1 truncate font-mono text-[10px] text-zinc-600">
          {item.file_path}
        </p>
        {item.reason ? (
          <p className="mt-1 text-xs text-zinc-500">{item.reason}</p>
        ) : null}
      </td>
      <td className="px-4 py-3 align-top text-xs text-zinc-400">
        {formatLabels[item.format] ?? item.format.toUpperCase()}
      </td>
      <td className="px-4 py-3 align-top">
        <span
          className={cn(
            "rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wide",
            item.importable
              ? "bg-emerald-400/10 text-emerald-300"
              : "bg-zinc-800 text-zinc-400",
          )}
        >
          {statusLabels[item.status] ?? item.status}
        </span>
      </td>
      <td className="max-w-xs px-4 py-3 align-top text-xs text-zinc-500">
        {tagPreview || "No tags"}
        {item.tags.length > 4 ? ` +${item.tags.length - 4}` : ""}
      </td>
    </tr>
  );
}
