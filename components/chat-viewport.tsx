"use client";

import { useEffect, useRef } from "react";

import { StreamingBubble } from "@/components/streaming-bubble";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";
import { COMPLETE_TROPE_MATRIX } from "@/types/tropes";

type ChatViewportProps = {
  messages: ChatMessage[];
  isStreaming: boolean;
  runtimeError?: string | null;
};

export function ChatViewport({
  isStreaming,
  messages,
  runtimeError = null,
}: ChatViewportProps) {
  const scrollAnchor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollAnchor.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  return (
    <div className="relative flex-1 overflow-y-auto px-4 py-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        {messages.map((message, index) => {
          const tropeConfig = COMPLETE_TROPE_MATRIX[message.detectedTrope];
          const isPlayer = message.role === "Player";
          const isSystem =
            message.role === "System" || message.role === "Narration";
          const isLatestMessage = index === messages.length - 1;

          return (
            <article
              key={message.id}
              className={cn(
                "flex max-w-[88%] flex-col transition-all duration-500",
                isPlayer && "ml-auto items-end",
                !isPlayer && !isSystem && "mr-auto items-start",
                isSystem && "mx-auto items-center",
              )}
            >
              <div className="mb-1.5 flex items-center gap-2 px-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                <span
                  className={cn(
                    isPlayer ? "text-[var(--muted)]" : "text-[var(--accent)]",
                    message.role === "NPC" && "font-serif",
                  )}
                >
                  {roleLabel(message.role)}
                </span>
                <span aria-hidden="true">/</span>
                <span className={tropeConfig.headerText}>
                  {tropeConfig.label}
                </span>
              </div>

              <StreamingBubble
                message={message}
                isLatestMessage={isLatestMessage}
                className={cn(
                  "w-full rounded-3xl border bg-gradient-to-b p-4 text-left shadow-xl backdrop-blur-md transition-all duration-500 disabled:cursor-default",
                  tropeConfig.border,
                  tropeConfig.bubble,
                  tropeConfig.glow,
                  isLatestMessage &&
                    message.role === "NPC" &&
                    "cursor-pointer hover:border-[var(--accent)]/40",
                  isPlayer
                    ? "rounded-br-lg bg-[var(--panel-soft)]"
                    : "rounded-bl-lg bg-[var(--panel)]",
                  isSystem &&
                    "rounded-3xl border-[var(--panel-border)] bg-[var(--panel-soft)]",
                )}
              />
            </article>
          );
        })}

        {runtimeError ? (
          <p className="rounded-2xl border border-red-500/30 bg-red-950/15 px-4 py-3 text-sm text-red-300">
            {runtimeError}
          </p>
        ) : null}

        {isStreaming && (
          <div className="flex items-center gap-2 px-2 text-xs font-medium italic text-[var(--muted)]">
            <span className="size-1.5 animate-bounce rounded-full bg-[var(--accent)] [animation-delay:75ms]" />
            <span className="size-1.5 animate-bounce rounded-full bg-[var(--accent)] [animation-delay:150ms]" />
            <span className="size-1.5 animate-bounce rounded-full bg-[var(--accent)] [animation-delay:300ms]" />
            Character is drafting response...
          </div>
        )}

        <div ref={scrollAnchor} />
      </div>
    </div>
  );
}

function roleLabel(role: ChatMessage["role"]) {
  switch (role) {
    case "Player":
      return "You";
    case "NPC":
      return "Character";
    case "Narration":
      return "Narration";
    case "System":
      return "System";
  }
}
