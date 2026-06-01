"use client";

const STORAGE_KEY = "heartwriteai:pending-library-card-path";

export function savePendingLibraryCardPath(filePath: string) {
  const storage = getBrowserLocalStorage();
  if (!storage) {
    return;
  }

  storage.setItem(STORAGE_KEY, filePath);
}

export function consumePendingLibraryCardPath() {
  const storage = getBrowserLocalStorage();
  if (!storage) {
    return null;
  }

  const filePath = storage.getItem(STORAGE_KEY);
  storage.removeItem(STORAGE_KEY);
  return filePath;
}

function getBrowserLocalStorage() {
  return (globalThis as { localStorage?: BrowserStorage }).localStorage ?? null;
}

interface BrowserStorage {
  getItem: (key: string) => string | null;
  removeItem: (key: string) => void;
  setItem: (key: string, value: string) => void;
}
