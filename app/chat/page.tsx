"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Brain, Route, SendHorizontal, Sparkles } from "lucide-react";

import { ChatExporterButton } from "@/components/chat-exporter-button";
import { ChatViewport } from "@/components/chat-viewport";
import { SaveSlotModal } from "@/components/save-slot-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createRoleplayMessage,
  getMessageText,
  RoleplayMessage,
  toOllamaMessages,
} from "@/lib/chat/messages";
import { classifyTropeInput } from "@/lib/character-card/tropeMatcher";
import { fetchContextualNpcDialogue } from "@/lib/tauri/contextualDialogue";
import { appendMessageToHistory } from "@/lib/tauri/tropeInteraction";
import { cn } from "@/lib/utils";
import { StudioShell } from "@/components/studio-shell";
import { useScenarioLibrary } from "@/hooks/useScenarioLibrary";
import { useRelationshipStore } from "@/features/relationship/store";
import { StatBar } from "@/features/relationship/components/StatBar";
import type { RelationshipState } from "@/features/relationship/schema";
import type { ChatMessage } from "@/types/chat";
import type { RomanceTropeClass } from "@/types/character-card/RomanceTropeClassification";
import type { DialogueLogEntry } from "@/types/history";
import { COMPLETE_TROPE_MATRIX } from "@/types/tropes";

const OLLAMA_CHAT_ENDPOINT = "http://localhost:11434/api/chat";
const DEFAULT_MODEL = "llama3";

const initialMessages: RoleplayMessage[] = [
  createRoleplayMessage(
    "assistant",
    "*Rain beads against the high-rise windows while {{char}} pauses beside the conference table, one hand still resting on the unsigned contract.* \"You came back after all.\"",
    "casual",
  ),
];

type ScenarioOverride = {
  context: string;
  setting: string;
  scene: string;
  dynamic: string;
};

type ChatSession = {
  id: string;
  title: string;
  messages: RoleplayMessage[];
  scenarioOverride: ScenarioOverride;
  updatedAt: number;
};

const CHAT_STORAGE_KEY = "heartwriteai:chat-sessions";

const emptyScenarioOverride: ScenarioOverride = {
  context: "",
  dynamic: "",
  scene: "",
  setting: "",
};

export default function RoleplayChat() {
  const scenarioLibrary = useScenarioLibrary();
  const addRelationshipMessage = useRelationshipStore((state) => state.addMessage);
  const hydrateRelationship = useRelationshipStore((state) => state.hydrate);
  const relationshipHydrated = useRelationshipStore((state) => state.hydrated);
  const relationshipState = useRelationshipStore((state) => state.state);
  const relationshipTracking = useRelationshipStore((state) => state.tracking);
  const [sessions, setSessions] =
    useState<ChatSession[]>(loadInitialChatSessions);
  const [activeSessionId, setActiveSessionId] = useState(() => sessions[0]!.id);
  const [input, setInput] = useState("");
  const [scenarioId, setScenarioId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const activeSession =
    sessions.find((session) => session.id === activeSessionId) ?? sessions[0]!;
  const messages = activeSession.messages;
  const viewportMessages = messages.map(toViewportMessage);
  const activeTrope = getActiveTrope(messages);
  const activeTropeStyle = COMPLETE_TROPE_MATRIX[activeTrope];

  useEffect(() => {
    if (!relationshipHydrated) {
      void hydrateRelationship();
    }
  }, [hydrateRelationship, relationshipHydrated]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      // Chat preview can still run without persistence.
    }
  }, [sessions]);

  function updateActiveSession(patch: Partial<ChatSession>) {
    setSessions((current) =>
      current.map((session) =>
        session.id === activeSession.id
          ? { ...session, ...patch, updatedAt: Date.now() }
          : session,
      ),
    );
  }

  function updateScenarioOverride(
    key: keyof ScenarioOverride,
    value: string,
  ) {
    updateActiveSession({
      scenarioOverride: {
        ...activeSession.scenarioOverride,
        [key]: value,
      },
    });
  }

  function startNewChat() {
    const next = createChatSession(`Chat ${sessions.length + 1}`);
    setSessions((current) => [next, ...current]);
    setActiveSessionId(next.id);
    setInput("");
    setRuntimeError(null);
  }

  function hydrateChatFromHistory(history: DialogueLogEntry[]) {
    const hydratedMessages = history.map(dialogueLogEntryToMessage);

    updateActiveSession({
      messages: hydratedMessages.length > 0 ? hydratedMessages : initialMessages,
      title:
        hydratedMessages.length > 0
          ? "Loaded Profile Chat"
          : activeSession.title,
    });
  }

  function applySavedScenarioToOverride() {
    const scenario = scenarioLibrary.items.find((item) => item.id === scenarioId);

    if (!scenario) {
      return;
    }

    updateActiveSession({
      scenarioOverride: {
        context: scenario.summary,
        dynamic: [
          scenario.trope,
          scenario.scenario.startingTension,
          scenario.firstMessage.aiOutputConstraint,
        ].filter(Boolean).join("\n"),
        scene: scenario.scenario.scenePremiseDescription,
        setting: [
          scenario.scenario.settingType.replaceAll("_", " "),
          scenario.scenario.sensoryDetails.join(", "),
        ].filter(Boolean).join("\n"),
      },
    });
  }

  function handleLaunchSuccess() {
    window.location.hash = "gameplay-chat-viewport";
    document
      .getElementById("gameplay-chat-viewport")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!input.trim() || isGenerating) {
      return;
    }

    const detectedTrope = classifyTropeInput(input.trim());
    const userMessage = createRoleplayMessage("user", input.trim(), detectedTrope);
    const updatedMessages = [...messages, userMessage];
    const assistantMessage = createRoleplayMessage(
      "assistant",
      "",
      detectedTrope,
    );

    updateActiveSession({
      messages: [...updatedMessages, assistantMessage],
      title: buildSessionTitle(activeSession.title, input.trim()),
    });
    setInput("");
    setIsGenerating(true);
    setRuntimeError(null);
    await addRelationshipMessage({
      content: input.trim(),
      createdAt: Date.now(),
      role: "user",
    });
    void persistDialogueLine(userMessage, setRuntimeError);

    try {
      const response = await fetch(OLLAMA_CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages: [
            ...compileScenarioOverrideMessages(activeSession.scenarioOverride),
            ...toOllamaMessages(updatedMessages),
          ],
          stream: true,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Ollama returned ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = "";
      let bufferedChunk = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        bufferedChunk += decoder.decode(value, { stream: true });
        const lines = bufferedChunk.split("\n");
        bufferedChunk = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) {
            continue;
          }

          const parsed = JSON.parse(line) as {
            message?: { content?: string };
          };

          if (parsed.message?.content) {
            accumulatedResponse += parsed.message.content;

            updateActiveSession({
              messages: [
                ...updatedMessages,
                {
                  ...assistantMessage,
                  detectedTrope,
                  parts: [{ type: "text", text: accumulatedResponse }],
                },
              ],
            });
          }
        }
      }

      if (accumulatedResponse.trim()) {
        void persistDialogueLine(
          {
            ...assistantMessage,
            detectedTrope,
            parts: [{ type: "text", text: accumulatedResponse }],
          },
          setRuntimeError,
        );
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown inference error.";

      try {
        const contextualDialogue = await fetchContextualNpcDialogue(
          "scene_01_alley_encounter",
        );
        const contextualMessage = createRoleplayMessage(
          "assistant",
          contextualDialogue.transformed_text,
          detectedTrope,
        );

        updateActiveSession({
          messages: [...updatedMessages, contextualMessage],
        });
        void persistDialogueLine(contextualMessage, setRuntimeError);
        setRuntimeError(
          `Ollama was unavailable (${message}), so Lucas used the native ${contextualDialogue.applied_archetype} dialogue variant.`,
        );
      } catch (fallbackError) {
        const fallbackDetail =
          fallbackError instanceof Error
            ? fallbackError.message
            : String(fallbackError);
        setRuntimeError(
          `Could not reach local Ollama at ${OLLAMA_CHAT_ENDPOINT}. ${message} Native dialogue fallback also failed: ${fallbackDetail}`,
        );
        updateActiveSession({ messages: updatedMessages });
      }
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <StudioShell
      eyebrow="Character Chat"
      title="Chat Preview"
      subtitle="A temporary local-model romance chat surface for testing streaming response shape before the full context compiler lands."
      actions={<Badge variant="outline">Ollama: {DEFAULT_MODEL}</Badge>}
    >
      <div className="grid min-h-[calc(100vh-9rem)] gap-5 xl:grid-cols-[20rem_minmax(0,1fr)]">
        <section className="flex max-h-none flex-col gap-5 overflow-y-auto pr-1 xl:sticky xl:top-24 xl:max-h-[calc(100vh-9rem)]">
          <Card className="bg-card/85">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles data-icon="inline-start" />
                Active Persona
              </CardTitle>
              <CardDescription>Romance runtime sandbox</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-primary text-lg text-primary-foreground">
                H
              </div>
              <div>
                <p className="text-sm font-medium">HeartWrite Preview</p>
                <p className="text-xs text-muted-foreground">
                  Local model: {DEFAULT_MODEL}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/85">
            <CardHeader>
              <CardTitle className="text-base">Runtime Notes</CardTitle>
              <CardDescription>
                Chat requires a character and user persona in the full runtime.
                Scenario overrides are optional because character cards can
                supply their own opening scenario.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card/85">
            <CardHeader>
              <CardTitle className="text-base">Chat Threads</CardTitle>
              <CardDescription>
                Keep separate local chats and return to them later.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button type="button" variant="outline" onClick={startNewChat}>
                New Chat
              </Button>
              {sessions.map((session) => (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => setActiveSessionId(session.id)}
                  className={cn(
                    "rounded-md border p-3 text-left text-sm transition hover:bg-muted",
                    session.id === activeSession.id && "bg-muted",
                  )}
                >
                  <span className="block truncate font-medium">
                    {session.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {session.messages.length} messages
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>

          <SaveSlotModal
            onLaunchSuccess={handleLaunchSuccess}
            onSlotLoaded={(_, profile) =>
              hydrateChatFromHistory(profile?.dialogue_history ?? [])
            }
          />

          <Card className="bg-card/85">
            <CardHeader>
              <CardTitle className="text-base">Scenario Override</CardTitle>
              <CardDescription>
                Optional. Use this to replace or sharpen the card&apos;s built-in
                scenario for this chat.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid gap-2">
                <select
                  value={scenarioId}
                  onChange={(event) => setScenarioId(event.currentTarget.value)}
                  className="h-10 rounded-md border bg-background px-3 text-sm"
                >
                  <option value="">No saved scenario selected</option>
                  {scenarioLibrary.items.map((scenario) => (
                    <option key={scenario.id} value={scenario.id}>
                      {scenario.title}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="outline"
                  disabled={!scenarioId}
                  onClick={applySavedScenarioToOverride}
                >
                  <Route className="size-4" />
                  Apply to Override
                </Button>
              </div>
              <Textarea
                value={activeSession.scenarioOverride.context}
                onChange={(event) =>
                  updateScenarioOverride("context", event.currentTarget.value)
                }
                placeholder="Context"
              />
              <Textarea
                value={activeSession.scenarioOverride.setting}
                onChange={(event) =>
                  updateScenarioOverride("setting", event.currentTarget.value)
                }
                placeholder="Setting"
              />
              <Textarea
                value={activeSession.scenarioOverride.scene}
                onChange={(event) =>
                  updateScenarioOverride("scene", event.currentTarget.value)
                }
                placeholder="Scene"
              />
              <Textarea
                value={activeSession.scenarioOverride.dynamic}
                onChange={(event) =>
                  updateScenarioOverride("dynamic", event.currentTarget.value)
                }
                placeholder="Dynamic"
              />
            </CardContent>
          </Card>

          <Card className="bg-card/85">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="size-4 text-muted-foreground" />
                Emotional Tracker
              </CardTitle>
              <CardDescription>
                Small read-only snapshot of what the current chat is doing
                emotionally.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <SceneTrackerSummary
                override={activeSession.scenarioOverride}
                relationshipState={relationshipState}
              />
              <StatBar
                label="Emotional Trust"
                value={relationshipState.trust.emotional}
                tone="good"
              />
              <StatBar
                label="Bond Depth"
                value={relationshipState.attachment.bondDepth}
              />
              <StatBar
                label="Tension"
                value={relationshipState.chemistry.tension}
                tone="warm"
              />
              <StatBar
                label="Rupture Risk"
                value={relationshipTracking?.trajectory.ruptureRisk ?? 0}
                tone="risk"
              />
              <Button asChild variant="outline">
                <Link href="/relationship-tracker">
                  Open Full Relationship Tracker
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section
          className="relative flex min-h-[calc(100vh-9rem)] min-w-0 flex-col overflow-hidden rounded-xl border bg-card/70 shadow-xl backdrop-blur"
          id="gameplay-chat-viewport"
        >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-b opacity-50 mix-blend-soft-light transition-all duration-1000",
            activeTropeStyle.screenVignette,
          )}
        />
        <header className="relative z-10 flex items-center justify-between gap-3 border-b bg-card/70 px-5 py-3 backdrop-blur">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Conversation Viewport
            </p>
            <p className="text-xs text-muted-foreground">
              Dialogue, action beats, and live macro mood are separated visually.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ChatExporterButton currentMessages={viewportMessages} />
            <Badge
              className={cn(
                "shrink-0 border-current/30 bg-background/70",
                activeTropeStyle.headerText,
              )}
              variant="outline"
            >
              {activeTropeStyle.label}
            </Badge>
          </div>
        </header>

        <ChatViewport
          isStreaming={isGenerating}
          messages={viewportMessages}
          runtimeError={runtimeError}
        />

        <div className="border-t bg-card/80 p-5 backdrop-blur">
          <form
            onSubmit={handleSendMessage}
            className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border bg-background/80 p-2 shadow-lg"
          >
            <Input
              value={input}
              onChange={(event) => setInput(event.currentTarget.value)}
              placeholder="Type your action or dialogue here..."
              disabled={isGenerating}
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <Button type="submit" disabled={isGenerating || !input.trim()}>
              <SendHorizontal data-icon="inline-end" />
              {isGenerating ? "Generating" : "Send"}
            </Button>
          </form>
        </div>
      </section>
      </div>
    </StudioShell>
  );
}

function createChatSession(title: string): ChatSession {
  return {
    id: crypto.randomUUID(),
    messages: initialMessages,
    scenarioOverride: emptyScenarioOverride,
    title,
    updatedAt: Date.now(),
  };
}

function loadInitialChatSessions() {
  try {
    if (typeof window === "undefined") {
      return [createChatSession("Preview Chat")];
    }

    const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;

    if (Array.isArray(parsed) && parsed.length > 0) {
      const loaded = parsed.map(readChatSession).filter(Boolean) as ChatSession[];

      if (loaded.length > 0) {
        return loaded;
      }
    }
  } catch {
    // Keep the in-memory preview chat if browser storage is unavailable.
  }

  return [createChatSession("Preview Chat")];
}

function buildSessionTitle(currentTitle: string, firstMessage: string) {
  if (!currentTitle.startsWith("Chat ")) {
    return currentTitle;
  }

  return firstMessage.slice(0, 42) || currentTitle;
}

function getActiveTrope(messages: RoleplayMessage[]): RomanceTropeClass {
  return messages.at(-1)?.detectedTrope ?? "casual";
}

function toViewportMessage(message: RoleplayMessage): ChatMessage {
  return {
    detectedTrope: message.detectedTrope ?? "casual",
    id: message.id,
    role: message.role === "user" ? "Player" : "NPC",
    text: getMessageText(message),
    timestamp: message.timestamp ?? new Date().toISOString(),
  };
}

function toDialogueLogEntry(message: RoleplayMessage): DialogueLogEntry {
  return {
    detectedTrope: message.detectedTrope ?? "casual",
    id: message.id,
    role: message.role === "user" ? "Player" : "NPC",
    text: getMessageText(message),
    timestamp: message.timestamp ?? new Date().toISOString(),
  };
}

function dialogueLogEntryToMessage(entry: DialogueLogEntry): RoleplayMessage {
  return {
    detectedTrope: entry.detectedTrope,
    id: entry.id,
    parts: [{ type: "text", text: entry.text }],
    role: entry.role === "Player" ? "user" : "assistant",
    timestamp: entry.timestamp,
  };
}

async function persistDialogueLine(
  message: RoleplayMessage,
  setRuntimeError: (message: string | null) => void,
) {
  try {
    await appendMessageToHistory(toDialogueLogEntry(message));
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    setRuntimeError(`Chat history save failed. ${detail}`);
  }
}

function compileScenarioOverrideMessages(override: ScenarioOverride) {
  const content = [
    override.context ? `Context: ${override.context}` : "",
    override.setting ? `Setting: ${override.setting}` : "",
    override.scene ? `Scene: ${override.scene}` : "",
    override.dynamic ? `Dynamic: ${override.dynamic}` : "",
  ].filter(Boolean).join("\n");

  return content
    ? [
        {
          role: "system",
          content: [
            "SCENARIO OVERRIDE FOR THIS CHAT:",
            content,
            "Use this only as scene setup. Do not write {{user}} decisions, private thoughts, dialogue, consent, or actions.",
          ].join("\n"),
        },
      ]
    : [];
}

function SceneTrackerSummary(props: {
  override: ScenarioOverride;
  relationshipState: RelationshipState;
}) {
  const snapshot = {
    arcScene: props.relationshipState.lifecycleState,
    boundariesConsent:
      props.relationshipState.trust.autonomy > 60
        ? "Boundaries feel respected."
        : "Boundary comfort is still being established.",
    charactersPresent: ["{{char}}", "{{user}}"],
    emotionalProgression:
      props.relationshipState.intimacy.vulnerability > 40
        ? "Vulnerability is becoming more emotionally important."
        : "Emotional progression is still early or guarded.",
    emotionalUndercurrent:
      props.relationshipState.attachment.abandonmentSensitivity > 45
        ? "Abandonment sensitivity is shaping subtext."
        : "Attachment signal is present but not highly activated.",
    importantRomanticMemory:
      props.relationshipState.memories[0]?.summary ?? "No major romantic memory yet.",
    physicalIntimacyProgression:
      props.relationshipState.intimacy.physical > 40
        ? "Physical closeness has become meaningful."
        : "Physical intimacy is not a major driver yet.",
    relationshipDynamic: props.relationshipState.type,
    scenario: props.override.scene || "Using character card scenario.",
    sceneAtmosphere: props.override.setting || "Atmosphere is forming from chat.",
    tensionConflict:
      props.relationshipState.rupture.active
        ? props.relationshipState.rupture.type ?? "Active rupture"
        : props.relationshipState.chemistry.tension > 45
          ? "Romantic tension is active."
          : "No major unresolved conflict detected.",
  };

  return (
    <dl className="grid gap-2 text-xs">
      {[
        ["Scene Atmosphere", snapshot.sceneAtmosphere],
        ["Arc Scene", snapshot.arcScene],
        ["Scenario", snapshot.scenario],
        ["Characters Present", snapshot.charactersPresent.join(", ")],
        ["Relationship Dynamic", snapshot.relationshipDynamic],
        ["Emotional Undercurrent", snapshot.emotionalUndercurrent],
        ["Physical Intimacy", snapshot.physicalIntimacyProgression],
        ["Emotional Progression", snapshot.emotionalProgression],
        ["Tension / Conflict", snapshot.tensionConflict],
        ["Boundaries / Consent", snapshot.boundariesConsent],
        ["Important Memory", snapshot.importantRomanticMemory],
      ].map(([label, value]) => (
        <div key={label} className="rounded-md border bg-background/60 p-2">
          <dt className="font-medium text-foreground">{label}</dt>
          <dd className="mt-1 line-clamp-2 text-muted-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function readChatSession(value: unknown): ChatSession | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Partial<ChatSession>;

  if (typeof record.id !== "string" || typeof record.title !== "string") {
    return null;
  }

  return {
    id: record.id,
    messages: Array.isArray(record.messages)
      ? record.messages.filter(isRoleplayMessage)
      : initialMessages,
    scenarioOverride: {
      context: readString(record.scenarioOverride?.context),
      dynamic: readString(record.scenarioOverride?.dynamic),
      scene: readString(record.scenarioOverride?.scene),
      setting: readString(record.scenarioOverride?.setting),
    },
    title: record.title,
    updatedAt: typeof record.updatedAt === "number" ? record.updatedAt : Date.now(),
  };
}

function isRoleplayMessage(value: unknown): value is RoleplayMessage {
  return Boolean(
    value &&
      typeof value === "object" &&
      ((value as RoleplayMessage).role === "user" ||
        (value as RoleplayMessage).role === "assistant") &&
      Array.isArray((value as RoleplayMessage).parts),
  );
}

function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}
