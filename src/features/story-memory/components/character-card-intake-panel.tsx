import type { ChangeEvent } from "react";
import { BookOpenText, Sparkles } from "lucide-react";

import { SectionPanel } from "@/features/story-memory/components/section-panel";
import type { LoadedCharacterCard } from "@/features/story-memory/utils/character-card-parser";

export function CharacterCardIntakePanel({
  cardInput,
  loadedCard,
  onChange,
  onClear,
  onFileLoad,
  onLoad,
}: {
  cardInput: string;
  loadedCard: LoadedCharacterCard | null;
  onChange: (value: string) => void;
  onClear: () => void;
  onFileLoad: (event: ChangeEvent<HTMLInputElement>) => void;
  onLoad: () => void;
}) {
  return (
    <SectionPanel title="Load Character Card" icon={BookOpenText}>
      <div className="grid gap-4">
        <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm leading-6 text-zinc-600">
          Load the established card first, then use its sections to build a user persona that fits
          the character instead of rewriting the character from scratch.
        </div>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-zinc-700">Choose card file</span>
          <input
            accept=".json,.txt,.png,application/json,text/plain,image/png"
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-zinc-950 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
            onChange={onFileLoad}
            type="file"
          />
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-zinc-700">Paste character card JSON or notes</span>
          <textarea
            className="min-h-52 resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-xs leading-5 text-zinc-900 outline-none focus:border-zinc-950"
            onChange={(event) => onChange(event.target.value)}
            placeholder='Paste JanitorAI or SillyTavern card JSON here, e.g. {"name":"...","description":"...","scenario":"..."}'
            value={cardInput}
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <button
            className="flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-800"
            onClick={onLoad}
            type="button"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            Load Card
          </button>
          <button
            className="flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            onClick={onClear}
            type="button"
          >
            Clear
          </button>
        </div>

        {loadedCard ? (
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-zinc-950 px-2 py-1 text-xs font-medium text-white">
                {loadedCard.format}
              </span>
              {loadedCard.name ? (
                <span className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-700">
                  {loadedCard.name}
                </span>
              ) : null}
              {loadedCard.tags.map((tag) => (
                <span
                  className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>

            {loadedCard.warnings.length ? (
              <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-900">
                {loadedCard.warnings.join(" ")}
              </div>
            ) : null}

            <div className="grid gap-3 lg:grid-cols-2">
              <CharacterCardSection
                items={[
                  ["Name", loadedCard.name],
                  ["Tags", loadedCard.tags.join(", ")],
                  ["Creator notes", loadedCard.creatorNotes],
                ]}
                title="Identity + Metadata"
              />
              <CharacterCardSection
                items={[
                  ["Description", loadedCard.description],
                  ["Personality", loadedCard.personality],
                ]}
                title="Character Definition"
              />
              <CharacterCardSection
                items={[
                  ["Scenario", loadedCard.scenario],
                  ["First message", loadedCard.firstMessage],
                  ["Alternate greetings", loadedCard.alternateGreetings.join("\n\n")],
                ]}
                title="Scenario + Openings"
              />
              <CharacterCardSection
                items={[
                  ["Example dialog", loadedCard.exampleDialog],
                  ["System prompt", loadedCard.systemPrompt],
                  ["Post-history instructions", loadedCard.postHistoryInstructions],
                ]}
                title="Prompting + Voice Samples"
              />
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-4 text-sm leading-6 text-zinc-600">
            No card loaded yet. This will become the source snapshot for persona-fit decisions:
            what the card already controls, what {"{{user}}"} should supply, and what the prompt pack
            should avoid overwriting.
          </div>
        )}
      </div>
    </SectionPanel>
  );
}

function CharacterCardSection({
  items,
  title,
}: {
  items: [string, string | undefined][];
  title: string;
}) {
  const visibleItems = items.filter(([, value]) => Boolean(value?.trim()));

  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-zinc-950">{title}</h3>
      {visibleItems.length ? (
        <div className="mt-3 grid gap-3">
          {visibleItems.map(([label, value]) => (
            <div key={label}>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-zinc-700">{value}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm leading-6 text-zinc-500">No imported fields in this section yet.</p>
      )}
    </article>
  );
}
