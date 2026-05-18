"use client";

import { Store } from "@tauri-apps/plugin-store";

import { CharacterCardLibraryItem } from "@/types/character-card/CharacterCardLibraryItem";

const characterCardLibraryPath = ".character-cards.bin";

let storePromise: Promise<Store> | null = null;

function loadCharacterCardStore() {
  storePromise ??= Store.load(characterCardLibraryPath, {
    defaults: {},
    autoSave: false,
  });

  return storePromise;
}

export async function saveCardToDesktopLibrary(
  card: CharacterCardLibraryItem,
): Promise<void> {
  const store = await loadCharacterCardStore();

  await store.set(card.id, {
    ...card,
    updatedAt: new Date().toISOString(),
  });
  await store.save();
}

export async function loadDesktopLibrary(): Promise<CharacterCardLibraryItem[]> {
  const store = await loadCharacterCardStore();
  const entries = await store.entries<CharacterCardLibraryItem>();

  return entries
    .map(([, card]) => card)
    .sort((leftCard, rightCard) =>
      rightCard.updatedAt.localeCompare(leftCard.updatedAt),
    );
}

export async function deleteCardFromDesktopLibrary(id: string): Promise<void> {
  const store = await loadCharacterCardStore();

  await store.delete(id);
  await store.save();
}
