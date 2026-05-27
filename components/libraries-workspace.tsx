"use client";

import CardLibraryPanel from "@/components/card-library-panel";
import { useCardLibrary } from "@/hooks/useCardLibrary";

export function LibrariesWorkspace() {
  const library = useCardLibrary(12);

  return (
    <CardLibraryPanel
      className="min-h-[70vh] rounded-[2rem]"
      library={library}
      onCardSelect={() => undefined}
      onPersonaSelect={() => undefined}
    />
  );
}
