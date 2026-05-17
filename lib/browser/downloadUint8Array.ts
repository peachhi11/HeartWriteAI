export function downloadUint8Array(
  data: Uint8Array,
  fileName: string,
  mimeType: string,
): void {
  const blob = new Blob([copyToArrayBuffer(data)], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function copyToArrayBuffer(data: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(data.byteLength);
  const bytes = new Uint8Array(buffer);

  bytes.set(data);

  return buffer;
}
