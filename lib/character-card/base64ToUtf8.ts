export function base64ToUtf8(value: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "base64").toString("utf8");
  }

  return decodeURIComponent(
    Array.from(atob(value))
      .map((character) =>
        `%${character.charCodeAt(0).toString(16).padStart(2, "0")}`,
      )
      .join(""),
  );
}
