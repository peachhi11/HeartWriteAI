"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, SendHorizontal, Sparkles } from "lucide-react";

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
import {
  createRoleplayMessage,
  getMessageText,
  RoleplayMessage,
  toOllamaMessages,
} from "@/lib/chat/messages";
import { cn } from "@/lib/utils";

const OLLAMA_CHAT_ENDPOINT = "http://localhost:11434/api/chat";
const DEFAULT_MODEL = "llama3";

const initialMessages: RoleplayMessage[] = [
  createRoleplayMessage(
    "assistant",
    "*The tavern door creaks open, letting in a gust of cold mountain air.* What brings a traveler like you to the edge of the realm?",
  ),
];

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
  const [messages, setMessages] = useState<RoleplayMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!input.trim() || isGenerating) {
      return;
    }

    const userMessage = createRoleplayMessage("user", input.trim());
    const updatedMessages = [...messages, userMessage];
    const assistantMessage = createRoleplayMessage("assistant", "");

    setMessages([...updatedMessages, assistantMessage]);
    setInput("");
    setIsGenerating(true);
    setRuntimeError(null);

    try {
      const response = await fetch(OLLAMA_CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages: toOllamaMessages(updatedMessages),
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

            setMessages((currentMessages) => [
              ...currentMessages.slice(0, -1),
              {
                ...assistantMessage,
                parts: [{ type: "text", text: accumulatedResponse }],
              },
            ]);
          }
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown inference error.";

      setRuntimeError(
        `Could not reach local Ollama at ${OLLAMA_CHAT_ENDPOINT}. ${message}`,
      );
      setMessages((currentMessages) => currentMessages.slice(0, -1));
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="flex h-screen overflow-hidden bg-background text-foreground">
      <section className="hidden w-80 flex-col gap-5 border-r bg-card/80 p-6 shadow-xl backdrop-blur md:flex">
        <Button asChild variant="ghost" className="w-fit">
          <Link href="/">
            <ArrowLeft data-icon="inline-start" />
            Back to studio
          </Link>
        </Button>

        <div className="flex flex-col gap-2">
          <Badge variant="secondary" className="w-fit">
            Runtime sandbox
          </Badge>
          <h1 className="text-2xl font-semibold tracking-tight">Chat Preview</h1>
          <p className="text-sm text-muted-foreground">
            A temporary local-model chat surface for testing streaming response
            shape before the full context compiler lands.
          </p>
        </div>

        <Card className="bg-background/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles data-icon="inline-start" />
              Active Persona
            </CardTitle>
            <CardDescription>Fantasy interactive fiction</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary text-lg text-primary-foreground">
              M
            </div>
            <div>
              <p className="text-sm font-medium">The Storyteller</p>
              <p className="text-xs text-muted-foreground">
                Ollama model: {DEFAULT_MODEL}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-card/60 px-5 py-4 backdrop-blur md:hidden">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft data-icon="inline-start" />
              Studio
            </Link>
          </Button>
          <Badge variant="secondary">Chat Preview</Badge>
        </header>

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
    </main>
  );
}
