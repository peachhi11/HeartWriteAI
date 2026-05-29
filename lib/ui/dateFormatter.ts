const relativeTimeIntervals = [
  { label: "year", seconds: 31_536_000 },
  { label: "month", seconds: 2_592_000 },
  { label: "week", seconds: 604_800 },
  { label: "day", seconds: 86_400 },
  { label: "hour", seconds: 3_600 },
  { label: "minute", seconds: 60 },
] as const;

export function formatRelativeTime(
  timestampString: string,
  now = new Date(),
): string {
  if (!timestampString || timestampString === "--") {
    return "Never";
  }

  const standardizedString = timestampString.replace(" ", "T");
  const pastDate = new Date(standardizedString);

  if (Number.isNaN(pastDate.getTime())) {
    return "Unknown Date";
  }

  const deltaSeconds = Math.floor(
    (now.getTime() - pastDate.getTime()) / 1_000,
  );

  if (deltaSeconds < 5) {
    return "Just now";
  }

  for (const interval of relativeTimeIntervals) {
    const count = Math.floor(deltaSeconds / interval.seconds);

    if (count >= 1) {
      return `Saved ${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return `Saved ${deltaSeconds} seconds ago`;
}
