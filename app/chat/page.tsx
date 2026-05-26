"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { SendHorizontal, Sparkles } from "lucide-react";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  createRoleplayMessage,
  getMessageText,
  RoleplayMessage,
  toOllamaMessages,
} from "@/lib/chat/messages";
import { cn } from "@/lib/utils";
import { StudioShell } from "@/components/studio-shell";

const OLLAMA_CHAT_ENDPOINT = "http://localhost:11434/api/chat";
const DEFAULT_MODEL = "llama3";

const initialMessages: RoleplayMessage[] = [
  createRoleplayMessage(
    "assistant",
    "*Rain beads against the high-rise windows while {{char}} pauses beside the conference table, one hand still resting on the unsigned contract.* \"You came back after all.\"",
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

function formatRoleplayText(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g);

  return parts.map((part, index) => {
    const isAction = part.startsWith("*") && part.endsWith("*");

    return (
      <span
        key={`${part}-${index}`}
        className={cn(isAction && "font-medium italic text-primary")}
      >
        {part}
      </span>
    );
  });
}

export default function RoleplayChat() {
  const [sessions, setSessions] =
    useState<ChatSession[]>(loadInitialChatSessions);
  const [activeSessionId, setActiveSessionId] = useState(() => sessions[0]!.id);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const activeSession =
    sessions.find((session) => session.id === activeSessionId) ?? sessions[0]!;
  const messages = activeSession.messages;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!input.trim() || isGenerating) {
      return;
    }

    const userMessage = createRoleplayMessage("user", input.trim());
    const updatedMessages = [...messages, userMessage];
    const assistantMessage = createRoleplayMessage("assistant", "");

    updateActiveSession({
      messages: [...updatedMessages, assistantMessage],
      title: buildSessionTitle(activeSession.title, input.trim()),
    });
    setInput("");
    setIsGenerating(true);
    setRuntimeError(null);

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
                  parts: [{ type: "text", text: accumulatedResponse }],
                },
              ],
            });
          }
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown inference error.";

      setRuntimeError(
        `Could not reach local Ollama at ${OLLAMA_CHAT_ENDPOINT}. ${message}`,
      );
      updateActiveSession({ messages: updatedMessages });
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
        <section className="hidden max-h-[calc(100vh-9rem)] flex-col gap-5 overflow-y-auto pr-1 xl:sticky xl:top-24 xl:flex">
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

          <Card className="bg-card/85">
            <CardHeader>
              <CardTitle className="text-base">Scenario Override</CardTitle>
              <CardDescription>
                Optional. Use this to replace or sharpen the card&apos;s built-in
                scenario for this chat.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
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
        </section>

        <section className="flex min-h-[calc(100vh-9rem)] min-w-0 flex-col overflow-hidden rounded-xl border bg-card/70 shadow-xl backdrop-blur">
        <ScrollArea className="flex-1">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-5 py-8">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-4",
                  message.role === "user" && "flex-row-reverse",
                )}
              >
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    message.role === "user"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-primary text-primary-foreground",
                  )}
                >
                  {message.role === "user" ? "You" : "AI"}
                </div>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-sm",
                    message.role === "user"
                      ? "bg-secondary/70"
                      : "bg-card/90 backdrop-blur",
                  )}
                >
                  {getMessageText(message)
                    ? message.parts.map((part, partIndex) =>
                        part.type === "text" ? (
                          <span key={`${message.id}-${partIndex}`}>
                            {formatRoleplayText(part.text)}
                          </span>
                        ) : null,
                      )
                    : "Thinking..."}
                </div>
              </div>
            ))}
            {runtimeError ? (
              <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {runtimeError}
              </p>
            ) : null}
            <div ref={chatEndRef} />
          </div>
        </ScrollArea>

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
