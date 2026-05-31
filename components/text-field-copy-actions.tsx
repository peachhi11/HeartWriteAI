"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

type CopyState = "copied" | "failed" | "idle";
type CopyableField = HTMLInputElement | HTMLTextAreaElement;

const COPYABLE_INPUT_TYPES = new Set([
  "",
  "email",
  "number",
  "search",
  "tel",
  "text",
  "url",
]);

export function TextFieldCopyActions() {
  const activeFieldRef = useRef<CopyableField | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [buttonRect, setButtonRect] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const [hasText, setHasText] = useState(false);

  useEffect(() => {
    const clearResetTimer = () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    };

    const updatePosition = () => {
      const field = activeFieldRef.current;
      if (!field || !document.contains(field)) {
        setButtonRect(null);
        activeFieldRef.current = null;
        return;
      }

      const rect = field.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        setButtonRect(null);
        return;
      }

      const buttonSize = 28;
      const inset = 6;
      setButtonRect({
        left: Math.max(
          8,
          Math.min(window.innerWidth - buttonSize - 8, rect.right - buttonSize - inset),
        ),
        top: Math.max(
          8,
          Math.min(window.innerHeight - buttonSize - 8, rect.top + inset),
        ),
      });
      setHasText(field.value.length > 0);
    };

    const activateField = (target: EventTarget | null) => {
      const field = getCopyableField(target);
      if (!field) {
        return;
      }

      activeFieldRef.current = field;
      setCopyState("idle");
      clearResetTimer();
      updatePosition();
    };

    const deactivateIfOutside = (event: FocusEvent) => {
      if (
        activeFieldRef.current &&
        event.relatedTarget instanceof HTMLElement &&
        event.relatedTarget.dataset.textFieldCopyAction === "true"
      ) {
        return;
      }

      window.setTimeout(() => {
        if (
          document.activeElement !== activeFieldRef.current &&
          document.activeElement instanceof HTMLElement &&
          document.activeElement.dataset.textFieldCopyAction !== "true"
        ) {
          activeFieldRef.current = null;
          setButtonRect(null);
        }
      }, 120);
    };

    const handleInput = (event: Event) => {
      const activeField = activeFieldRef.current;
      if (activeField && event.target === activeField) {
        setHasText(activeField.value.length > 0);
        updatePosition();
      }
    };

    const handleFocusIn = (event: FocusEvent) => activateField(event.target);
    const handlePointerOver = (event: PointerEvent) => activateField(event.target);

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", deactivateIfOutside);
    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("input", handleInput);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      clearResetTimer();
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", deactivateIfOutside);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("input", handleInput);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, []);

  async function handleCopy() {
    const field = activeFieldRef.current;
    if (!field?.value) {
      return;
    }

    try {
      await writeClipboardText(field.value);
      setCopyState("copied");
    } catch (error) {
      console.error("Failed to copy text field value:", error);
      setCopyState("failed");
    }

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = setTimeout(() => setCopyState("idle"), 1600);
  }

  if (!buttonRect) {
    return null;
  }

  const Icon =
    copyState === "copied"
      ? Check
      : copyState === "failed"
        ? TriangleAlert
        : Copy;
  const label =
    copyState === "copied"
      ? "Copied"
      : copyState === "failed"
        ? "Copy failed"
        : "Copy field";

  return (
    <button
      aria-label={label}
      className={cn(
        "fixed z-50 inline-flex size-7 items-center justify-center rounded-md border border-border/80 bg-background/95 text-muted-foreground shadow-lg backdrop-blur transition hover:border-primary/50 hover:text-foreground disabled:pointer-events-none disabled:opacity-45",
        copyState === "copied" &&
          "border-emerald-500/40 bg-emerald-500/10 text-emerald-500",
        copyState === "failed" &&
          "border-destructive/40 bg-destructive/10 text-destructive",
      )}
      data-text-field-copy-action="true"
      disabled={!hasText}
      onClick={() => void handleCopy()}
      onPointerDown={(event) => event.preventDefault()}
      style={{
        left: buttonRect.left,
        top: buttonRect.top,
      }}
      title={label}
      type="button"
    >
      <Icon className="size-3.5" />
    </button>
  );
}

function getCopyableField(target: EventTarget | null): CopyableField | null {
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
    return null;
  }

  if (target.disabled || target.dataset.noFieldCopy === "true") {
    return null;
  }

  if (target instanceof HTMLInputElement) {
    const type = target.type.toLowerCase();
    if (!COPYABLE_INPUT_TYPES.has(type)) {
      return null;
    }
  }

  return target;
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
