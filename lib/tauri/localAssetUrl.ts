"use client";

const LOCAL_ASSET_PROTOCOL = "ccv3-asset://localhost/";

export function getLocalAssetUrl(filePath: string | null | undefined) {
  if (!filePath) {
    return null;
  }

  return `${LOCAL_ASSET_PROTOCOL}${percentEncodePath(filePath)}`;
}

function percentEncodePath(path: string) {
  let encoded = "";

  for (const byte of new TextEncoder().encode(path)) {
    const isAsciiAlphaNumeric =
      (byte >= 48 && byte <= 57) ||
      (byte >= 65 && byte <= 90) ||
      (byte >= 97 && byte <= 122);
    const isSafePunctuation =
      byte === 45 || byte === 46 || byte === 95 || byte === 126;

    if (isAsciiAlphaNumeric || isSafePunctuation) {
      encoded += String.fromCharCode(byte);
    } else {
      encoded += `%${byte.toString(16).toUpperCase().padStart(2, "0")}`;
    }
  }

  return encoded;
}
