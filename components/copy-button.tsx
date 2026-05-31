"use client";

import type * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Check, Copy, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CopyState = "idle" | "copied" | "failed";

interface CopyButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "children" | "onClick"> {
  copiedLabel?: string;
  failedLabel?: string;
  idleLabel?: string;
  onCopied?: () => void;
  onCopyError?: (error: unknown) => void;
  textToCopy: string;
}

export function CopyButton({
  className,
  copiedLabel = "Copied",
  failedLabel = "Copy failed",
  idleLabel = "Copy",
  onCopied,
  onCopyError,
  textToCopy,
  variant = "outline",
  size = "sm",
  ...props
}: CopyButtonProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    if (!textToCopy) {
      return;
    }

    try {
      await writeClipboardText(textToCopy);
      setCopyState("copied");
      onCopied?.();
    } catch (error) {
      console.error("Failed to copy text payload to clipboard:", error);
      setCopyState("failed");
      onCopyError?.(error);
    }

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = setTimeout(() => {
      setCopyState("idle");
    }, 2000);
  }

  const Icon =
    copyState === "copied"
      ? Check
      : copyState === "failed"
        ? TriangleAlert
        : Copy;
  const label =
    copyState === "copied"
      ? copiedLabel
      : copyState === "failed"
        ? failedLabel
        : idleLabel;

  return (
    <Button
      {...props}
      type="button"
      variant={variant}
      size={size}
      className={cn(
        "font-mono text-[11px] font-bold uppercase tracking-wide",
        copyState === "copied" &&
          "border-emerald-500/40 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/15 hover:text-emerald-500",
        copyState === "failed" &&
          "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/15 hover:text-destructive",
        className,
      )}
      disabled={!textToCopy || props.disabled}
      onClick={handleCopy}
      aria-live="polite"
    >
      <Icon className="size-4" />
      {label}
    </Button>
  );
}

async function writeClipboardText(text: string) {
  let clipboardError: unknown;

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (error) {
      clipboardError = error;
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.dataset.noFieldCopy = "true";
  textarea.setAttribute("readonly", "");
  textarea.style.left = "-9999px";
  textarea.style.opacity = "0";
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    if (!document.execCommand("copy")) {
      throw new Error("Browser rejected the fallback copy command.");
    }
  } catch (error) {
    throw clipboardError ?? error;
  } finally {
    textarea.remove();
  }
}

export default CopyButton;
