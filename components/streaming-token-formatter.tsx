import { cn } from "@/lib/utils";

type TokenSegment =
  | { kind: "plain"; value: string }
  | { kind: "action"; value: string }
  | { kind: "bracket"; value: string }
  | { kind: "partial"; value: string };

type StreamingTokenFormatterProps = {
  partialText: string;
  role?: "Player" | "NPC" | "System" | "Narration";
  showCaret?: boolean;
};

export function StreamingTokenFormatter({
  partialText,
  role = "NPC",
  showCaret = true,
}: StreamingTokenFormatterProps) {
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
      {readStreamingSegments(partialText).map((segment, index) => {
        const key = `${segment.kind}-${segment.value}-${index}`;

        if (segment.kind === "action") {
          return (
            <span
              key={key}
              className="mx-0.5 font-sans italic text-rose-300/90 antialiased"
            >
              {segment.value}
            </span>
          );
        }

        if (segment.kind === "bracket") {
          return (
            <span
              key={key}
              className="mx-0.5 rounded-md border border-amber-500/20 bg-amber-950/15 px-1.5 py-0.5 font-sans text-xs font-semibold tracking-wide text-amber-300"
            >
              {segment.value}
            </span>
          );
        }

        if (segment.kind === "partial") {
          return (
            <span
              key={key}
              className="font-sans text-xs italic text-amber-300/80"
            >
              {segment.value}
            </span>
          );
        }

        return <span key={key}>{segment.value}</span>;
      })}
      {showCaret ? (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]/80 align-baseline"
        />
      ) : null}
    </p>
  );
}

function readStreamingSegments(text: string): TokenSegment[] {
  const segments: TokenSegment[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const nextAction = text.indexOf("*", cursor);
    const nextBracket = text.indexOf("[", cursor);
    const nextTokenStart = minPositive(nextAction, nextBracket);

    if (nextTokenStart === -1) {
      pushPlain(segments, text.slice(cursor));
      break;
    }

    pushPlain(segments, text.slice(cursor, nextTokenStart));

    const opener = text.charAt(nextTokenStart);
    const closer = opener === "*" ? "*" : "]";
    const closedAt = text.indexOf(closer, nextTokenStart + 1);

    if (closedAt === -1) {
      segments.push({
        kind: "partial",
        value: text.slice(nextTokenStart + 1).replace(/[*[\]]/g, ""),
      });
      break;
    }

    segments.push({
      kind: opener === "*" ? "action" : "bracket",
      value: text.slice(nextTokenStart + 1, closedAt),
    });
    cursor = closedAt + 1;
  }

  return segments;
}

function minPositive(first: number, second: number) {
  if (first === -1) {
    return second;
  }

  if (second === -1) {
    return first;
  }

  return Math.min(first, second);
}

function pushPlain(segments: TokenSegment[], value: string) {
  if (value) {
    segments.push({ kind: "plain", value });
  }
}
