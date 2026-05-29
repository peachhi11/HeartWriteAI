import type { SpeakerRole } from "@/types/chat";
import { cn } from "@/lib/utils";

const ROLEPLAY_TOKEN_REGEX = /(\*[^*]+\*|\[[^\]]+\])/g;

type TokenFormatterProps = {
  role: SpeakerRole;
  text: string;
};

export function TokenFormatter({ role, text }: TokenFormatterProps) {
  const fragments = text.split(ROLEPLAY_TOKEN_REGEX);
  const isPlayer = role === "Player";

  return (
    <p
      className={cn(
        "whitespace-pre-wrap text-sm leading-relaxed",
        isPlayer
          ? "font-sans text-[var(--foreground)]"
          : "font-serif text-[var(--foreground)]",
      )}
    >
      {fragments.map((fragment, index) => {
        const key = `${fragment}-${index}`;

        if (fragment.startsWith("*") && fragment.endsWith("*")) {
          return (
            <span
              key={key}
              className="mx-0.5 font-sans italic text-rose-300/90 antialiased"
            >
              {fragment.slice(1, -1)}
            </span>
          );
        }

        if (fragment.startsWith("[") && fragment.endsWith("]")) {
          return (
            <span
              key={key}
              className="mx-0.5 rounded-md border border-amber-500/20 bg-amber-950/15 px-1.5 py-0.5 font-sans text-xs font-semibold tracking-wide text-amber-300"
            >
              {fragment.slice(1, -1)}
            </span>
          );
        }

        return <span key={key}>{fragment}</span>;
      })}
    </p>
  );
}
