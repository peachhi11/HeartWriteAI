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
              className="my-1 block max-w-full rounded-xl border border-border/70 bg-background/45 px-2.5 py-1.5 font-sans text-xs font-semibold leading-relaxed tracking-wide text-foreground/80"
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
