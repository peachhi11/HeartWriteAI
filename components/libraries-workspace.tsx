"use client";

import CardLibraryPanel from "@/components/card-library-panel";
import { CharacterCarouselBrowser } from "@/components/character-carousel-browser";
import { useCardLibrary } from "@/hooks/useCardLibrary";
import { savePendingLibraryCardPath } from "@/lib/character-card/librarySelectionHandoff";
import { useRouter } from "next/navigation";

export function LibrariesWorkspace() {
  const library = useCardLibrary(12);
  const router = useRouter();

  function handleCardSelect(filePath: string) {
    savePendingLibraryCardPath(filePath);
    router.push("/workspace");
  }

  return (
    <div className="grid gap-6">
      <CharacterCarouselBrowser
        library={library}
        onCardSelect={handleCardSelect}
      />
      <CardLibraryPanel
        className="min-h-[70vh] rounded-[2rem]"
        library={library}
        onCardSelect={handleCardSelect}
        onPersonaSelect={() => undefined}
      />
    </div>
  );
}
