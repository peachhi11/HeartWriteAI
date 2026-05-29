"use client";

import { StreamingTokenFormatter } from "@/components/streaming-token-formatter";
import { TokenFormatter } from "@/components/token-formatter";
import { useTypewriter } from "@/hooks/useTypewriter";
import type { ChatMessage } from "@/types/chat";

type StreamingBubbleProps = {
  className?: string;
  isLatestMessage: boolean;
  message: ChatMessage;
};

export function StreamingBubble({
  className,
  isLatestMessage,
  message,
}: StreamingBubbleProps) {
  const shouldAnimate =
    isLatestMessage && message.role === "NPC" && message.text.length > 0;

  if (!shouldAnimate) {
    return (
      <div className={className}>
        {message.text ? (
          <TokenFormatter role={message.role} text={message.text} />
        ) : (
          <p className="text-left text-sm italic text-[var(--muted)]">
            Thinking...
          </p>
        )}
      </div>
    );
  }

  return <AnimatedStreamingBubble className={className} message={message} />;
}

function AnimatedStreamingBubble({
  className,
  message,
}: {
  className?: string;
  message: ChatMessage;
}) {
  const { displayedText, forceSkipTypewriter, isTyping } = useTypewriter(
    message.text,
    {
      speedMs: 18,
    },
  );

  return (
    <button
      type="button"
      onClick={forceSkipTypewriter}
      className={className}
      aria-label={isTyping ? "Skip typewriter animation" : undefined}
    >
      {message.text ? (
        <StreamingTokenFormatter
          partialText={displayedText}
          role={message.role}
          showCaret={isTyping}
        />
      ) : (
        <p className="text-left text-sm italic text-[var(--muted)]">
          Thinking...
        </p>
      )}
      {isTyping ? (
        <span className="mt-2 block text-left text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
          Click to skip
        </span>
      ) : null}
    </button>
  );
}
