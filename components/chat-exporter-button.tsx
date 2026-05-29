"use client";

import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Download, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { downloadChatTranscript } from "@/lib/chat/exportTranscript";
import { isTauriRuntime } from "@/lib/tauri/native";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";

type ExportStatus = {
  isError: boolean;
  text: string;
};

type ChatExporterButtonProps = {
  currentMessages: ChatMessage[];
};

export function ChatExporterButton({
  currentMessages,
}: ChatExporterButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [status, setStatus] = useState<ExportStatus | null>(null);

  async function handleExport() {
    if (currentMessages.length === 0) {
      setStatus({
        isError: true,
        text: "No conversation history exists to export yet.",
      });
      return;
    }

    setIsExporting(true);
    setStatus(null);

    try {
      if (isTauriRuntime()) {
        await invoke<string>("export_chat_log_to_file", {
          messages: currentMessages,
        });
      } else {
        downloadChatTranscript(currentMessages);
      }

      setStatus({ isError: false, text: "Transcript exported." });
      window.setTimeout(() => setStatus(null), 4000);
    } catch (error) {
      setStatus({
        isError: true,
        text: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="relative flex shrink-0 flex-col items-end gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isExporting || currentMessages.length === 0}
        onClick={handleExport}
        className="gap-2 bg-background/70"
      >
        {isExporting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Download className="size-4" />
        )}
        <span className="hidden sm:inline">
          {isExporting ? "Exporting" : "Export Transcript"}
        </span>
      </Button>

      {status ? (
        <div
          className={cn(
            "absolute right-0 top-full z-20 mt-2 w-64 rounded-md border p-2 text-xs shadow-xl backdrop-blur",
            status.isError
              ? "border-destructive/40 bg-destructive/10 text-destructive"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
          )}
        >
          {status.text}
        </div>
      ) : null}
    </div>
  );
}
