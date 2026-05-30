"use client";

import {
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ActionCardVariant } from "@/types/cards";
import { COMPLETE_TROPE_MATRIX } from "@/types/tropes";

type CenteredIntentModalProps = {
  cardOptions: ActionCardVariant[];
  isOpen: boolean;
  onCloseAbort: () => void;
  onSelectAction: (selected: ActionCardVariant) => void;
  scenePrompt: string;
};

export function CenteredIntentModal({
  cardOptions,
  isOpen,
  onCloseAbort,
  onSelectAction,
  scenePrompt,
}: CenteredIntentModalProps) {
  const titleId = useId();
  const sceneId = useId();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const firstActionRef = useRef<HTMLButtonElement | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previousActiveElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      (firstActionRef.current ?? closeButtonRef.current)?.focus();
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      previousActiveElementRef.current?.focus();
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onCloseAbort();
      return;
    }

    if (event.key !== "Tab" || !modalRef.current) {
      return;
    }

    const focusableElements = Array.from(
      modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );

    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  const modalContent = (
    <div
      aria-describedby={sceneId}
      aria-labelledby={titleId}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4"
      onKeyDown={handleKeyDown}
      role="dialog"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 cursor-default bg-background/80 backdrop-blur-md transition-opacity duration-500 animate-fade-in"
        onMouseDown={onCloseAbort}
      />

      <div
        data-intent-modal-panel
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl select-none flex-col gap-5 overflow-hidden rounded-3xl border border-border/80 bg-card/85 p-5 shadow-2xl backdrop-blur-xl animate-scale-up sm:p-6"
        ref={modalRef}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border/70 pb-4">
          <div className="space-y-1">
            <span className="inline-flex rounded-md border border-primary/25 bg-primary/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.22em] text-primary">
              Story Choice
            </span>
            <h2
              className="text-base font-black uppercase tracking-wide text-foreground"
              id={titleId}
            >
              Choose Your Response
            </h2>
          </div>
          <button
            aria-label="Skip story choice"
            className="inline-flex items-center gap-1 rounded-lg border border-border/70 bg-background/70 px-2.5 py-1 text-xs font-bold text-muted-foreground transition hover:border-border hover:text-foreground active:scale-95"
            onClick={onCloseAbort}
            ref={closeButtonRef}
            type="button"
          >
            Skip
            <X className="size-3.5" />
          </button>
        </header>

        <section
          className="shrink-0 rounded-2xl border border-border/60 bg-background/55 p-4"
          id={sceneId}
        >
          <span className="mb-1 block text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Scene
          </span>
          <p className="text-sm italic leading-relaxed text-foreground/85">
            {scenePrompt}
          </p>
        </section>

        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {cardOptions.map((option, index) => {
            const tropeConfig =
              COMPLETE_TROPE_MATRIX[option.intentClass] ??
              COMPLETE_TROPE_MATRIX.casual;

            return (
              <button
                className={cn(
                  "group relative flex w-full flex-col gap-2 overflow-hidden rounded-2xl border bg-background/55 p-4 text-left shadow-md transition duration-300 hover:-translate-y-0.5 hover:bg-card/80 hover:shadow-xl",
                  tropeConfig.border,
                )}
                key={option.id}
                onClick={() => onSelectAction(option)}
                ref={index === 0 ? firstActionRef : undefined}
                type="button"
              >
                <div className="flex w-full items-start justify-between gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                    {tropeConfig.label}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 rounded-md border bg-card/70 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide transition group-hover:scale-105",
                      option.intensityModifier,
                    )}
                  >
                    Choose
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-primary/90">
                    [{option.actionDescriptor}]
                  </p>
                  <p className="text-sm italic leading-relaxed text-foreground">
                    &ldquo;{option.dialoguePreview}&rdquo;
                  </p>
                </div>

                <div
                  className={cn(
                    "absolute inset-y-0 left-0 w-1 bg-current opacity-50 transition-opacity group-hover:opacity-100",
                    tropeConfig.headerText,
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
