export function utf8ToBase64(value: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf8").toString("base64");
  }

  return btoa(
    encodeURIComponent(value).replace(
      /%([0-9A-F]{2})/g,
      (_match, hexValue: string) =>
        String.fromCharCode(Number.parseInt(hexValue, 16)),
    ),
  );
}
