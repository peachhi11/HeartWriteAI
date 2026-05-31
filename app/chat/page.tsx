"use client";

import {
  FormEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import {
  BookOpenText,
  Brain,
  MousePointerClick,
  Route,
  SendHorizontal,
  Sparkles,
} from "lucide-react";

import { CenteredIntentModal } from "@/components/centered-intent-modal";
import { CameraSnapperButton } from "@/components/camera-snapper-button";
import { ChatExporterButton } from "@/components/chat-exporter-button";
import { ChatViewport } from "@/components/chat-viewport";
import { ContextRecallInspector } from "@/components/context-recall-inspector";
import { GlowingConnectionNode } from "@/components/glowing-connection-node";
import { LoreActivationBadge } from "@/components/lore-activation-badge";
import { LorebookControlPanel } from "@/components/lorebook-control-panel";
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
  createRegenerationVariant,
  createRoleplayMessage,
  getMessageText,
  navigateRoleplayMessageVariant,
  RoleplayMessage,
  toOllamaMessages,
  updateRoleplayMessageText,
} from "@/lib/chat/messages";
import { classifyTropeInput } from "@/lib/character-card/tropeMatcher";
import { fetchContextualNpcDialogue } from "@/lib/tauri/contextualDialogue";
import {
  buildLoreRecallMessages,
  createLoreRecallAuditLogs,
  scanActiveLorebookForChatTurn,
} from "@/lib/tauri/loreActivation";
import { streamLocalLlmResponse } from "@/lib/tauri/localLlm";
import {
  appendMessageToHistory,
  replaceDialogueHistory,
} from "@/lib/tauri/tropeInteraction";
import {
  loadInferenceConfig,
  loadInferencePreference,
} from "@/lib/ui/runtimeInference";
import {
  clampSidebarWidth,
  loadUserThemePreference,
  saveUserTheme,
} from "@/lib/ui/runtimeTheme";
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
import type { ActionCardVariant } from "@/types/cards";
import type { SystemSyncStatus } from "@/types/diagnostics";
import type { DockingState, SidePanelType } from "@/types/dock";
import type { GeneratedLorebookArtifact } from "@/features/generation/workflows";
import type { LoreRecallAuditLog } from "@/types/lorebook";

const PREVIEW_CHAT_ID = "preview-chat";
const PREVIEW_CHAT_UPDATED_AT = 0;

const initialMessages: RoleplayMessage[] = [
  {
    detectedTrope: "casual",
    id: "preview-chat-opening",
    parts: [
      {
        text: '*Rain beads against the high-rise windows while {{char}} pauses beside the conference table, one hand still resting on the unsigned contract.* "You came back after all."',
        type: "text",
      },
    ],
    role: "assistant",
    timestamp: "2026-05-29T00:00:00.000Z",
  },
];

const checkpointIntentOptions: ActionCardVariant[] = [
  {
    actionDescriptor:
      "steps in front of them, shoulders squared against the pressure in the room",
    dialoguePreview:
      "No. If you want to get to them, you go through me first.",
    id: "checkpoint_protective",
    intensityModifier: "border-rose-500/30 text-rose-300",
    intentClass: "protective",
  },
  {
    actionDescriptor:
      "smirks despite the tension, leaning back like the danger is personally entertaining",
    dialoguePreview:
      "That was almost intimidating. Do you practice that glare, or is it a natural gift?",
    id: "checkpoint_bantering",
    intensityModifier: "border-amber-500/30 text-amber-300",
    intentClass: "bantering",
  },
  {
    actionDescriptor:
      "looks away too quickly, heat rising in their face as the silence stretches",
    dialoguePreview:
      "I was not staring. I was just... thinking. Very intensely. In your direction.",
    id: "checkpoint_flustered",
    intensityModifier: "border-pink-500/30 text-pink-300",
    intentClass: "flustered",
  },
  {
    actionDescriptor:
      "holds their ground, chin lifting as restraint turns into open defiance",
    dialoguePreview:
      "You do not get to decide where I belong. Not tonight.",
    id: "checkpoint_antagonistic",
    intensityModifier: "border-red-500/30 text-red-300",
    intentClass: "antagonistic",
  },
  {
    actionDescriptor:
      "softens by a fraction, voice lowering as if the truth is almost too costly to say",
    dialoguePreview:
      "I keep trying to pretend this does not matter. It is starting to feel impossible.",
    id: "checkpoint_yearning",
    intensityModifier: "border-fuchsia-500/30 text-fuchsia-300",
    intentClass: "yearning",
  },
  {
    actionDescriptor:
      "meets their eyes with sudden, quiet certainty, the rest of the room falling away",
    dialoguePreview:
      "I know you. I do not know how yet, but I know you.",
    id: "checkpoint_recognized",
    intensityModifier: "border-violet-500/30 text-violet-300",
    intentClass: "recognized",
  },
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
  const [sessions, setSessions] = useState<ChatSession[]>(() => [
    createPreviewChatSession(),
  ]);
  const [activeSessionId, setActiveSessionId] = useState(PREVIEW_CHAT_ID);
  const [chatStorageHydrated, setChatStorageHydrated] = useState(false);
  const [input, setInput] = useState("");
  const [scenarioId, setScenarioId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [inferenceConfig, setInferenceConfig] = useState(() =>
    loadInferenceConfig(),
  );
  const [intentModalOpen, setIntentModalOpen] = useState(false);
  const [lorebookPanelOpen, setLorebookPanelOpen] = useState(false);
  const [dockingState, setDockingState] = useState<DockingState>({
    activePanel: "Lorebook",
    dockPosition: "right",
    isCollapsed: false,
  });
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [activeLorebook, setActiveLorebook] =
    useState<GeneratedLorebookArtifact | null>(null);
  const [activeLoreFeed, setActiveLoreFeed] = useState("");
  const [loreRecallLogs, setLoreRecallLogs] = useState<LoreRecallAuditLog[]>([]);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const activeThemeRef = useRef<Awaited<ReturnType<typeof loadUserThemePreference>> | null>(
    null,
  );
  const animationFrameRef = useRef<number | null>(null);
  const isResizingDockRef = useRef(false);
  const resizeStartRef = useRef({ pointerX: 0, width: 280 });
  const sidebarWidthRef = useRef(sidebarWidth);
  const activeSession =
    sessions.find((session) => session.id === activeSessionId) ?? sessions[0]!;
  const messages = activeSession.messages;
  const viewportMessages = messages.map(toViewportMessage);
  const activeTrope = getActiveTrope(messages);
  const activeTropeStyle = COMPLETE_TROPE_MATRIX[activeTrope];
  const isLorebookDockVisible =
    dockingState.activePanel === "Lorebook" && !dockingState.isCollapsed;
  const loreDiagnostic = getLorebookDiagnostic(activeLorebook);

  useEffect(() => {
    if (!relationshipHydrated) {
      void hydrateRelationship();
    }
  }, [hydrateRelationship, relationshipHydrated]);

  useEffect(() => {
    let cancelled = false;

    window.queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      const loaded = loadInitialChatSessions();

      setSessions(loaded);
      setActiveSessionId(loaded[0]?.id ?? PREVIEW_CHAT_ID);
      setChatStorageHydrated(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    void loadInferencePreference().then((config) => {
      if (!cancelled) {
        setInferenceConfig(config);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    void loadUserThemePreference().then((theme) => {
      if (cancelled) {
        return;
      }

      activeThemeRef.current = theme;
      const nextWidth = clampSidebarWidth(theme.sidebarWidth);
      sidebarWidthRef.current = nextWidth;
      setSidebarWidth(nextWidth);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    sidebarWidthRef.current = sidebarWidth;
  }, [sidebarWidth]);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      if (!isResizingDockRef.current) {
        return;
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const delta = resizeStartRef.current.pointerX - event.clientX;
        const nextWidth = clampSidebarWidth(resizeStartRef.current.width + delta);
        sidebarWidthRef.current = nextWidth;
        setSidebarWidth(nextWidth);
      });
    }

    function handlePointerUp() {
      if (!isResizingDockRef.current) {
        return;
      }

      isResizingDockRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      if (!activeThemeRef.current) {
        return;
      }

      void saveUserTheme({
        ...activeThemeRef.current,
        sidebarWidth: sidebarWidthRef.current,
      }).then((theme) => {
        activeThemeRef.current = theme;
        const nextWidth = clampSidebarWidth(theme.sidebarWidth);
        sidebarWidthRef.current = nextWidth;
        setSidebarWidth(nextWidth);
      });
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, []);

  useEffect(() => {
    if (!chatStorageHydrated) {
      return;
    }

    try {
      window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      // Chat preview can still run without persistence.
    }
  }, [chatStorageHydrated, sessions]);

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

  function toggleDockPanel(panel: SidePanelType) {
    setDockingState((current) => {
      const isActive = current.activePanel === panel && !current.isCollapsed;

      return {
        ...current,
        activePanel: isActive ? "None" : panel,
        isCollapsed: isActive,
      };
    });
  }

  function startDockResize(event: ReactPointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    isResizingDockRef.current = true;
    resizeStartRef.current = {
      pointerX: event.clientX,
      width: sidebarWidthRef.current,
    };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }

  async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const playerInput = input.trim();

    if (!playerInput || isGenerating) {
      return;
    }

    const detectedTrope = classifyTropeInput(playerInput);
    const userMessage = createRoleplayMessage("user", playerInput, detectedTrope);
    const updatedMessages = [...messages, userMessage];
    const assistantMessage = createRoleplayMessage(
      "assistant",
      "",
      detectedTrope,
    );

    updateActiveSession({
      messages: [...updatedMessages, assistantMessage],
      title: buildSessionTitle(activeSession.title, playerInput),
    });
    setInput("");
    setIsGenerating(true);
    setRuntimeError(null);
    await addRelationshipMessage({
      content: playerInput,
      createdAt: Date.now(),
      role: "user",
    });
    void persistDialogueLine(userMessage, setRuntimeError);

    try {
      const scenarioMessages = compileScenarioOverrideMessages(
        activeSession.scenarioOverride,
      );
      const loreActivation = await scanActiveLorebookForChatTurn(
        activeLorebook,
        playerInput,
      );
      const loreMessages = buildLoreRecallMessages(loreActivation);
      setActiveLoreFeed(loreActivation.loreInjectionChunk);

      if (loreActivation.hasMatches) {
        const recallLogs = createLoreRecallAuditLogs(
          loreActivation,
          activeLorebook,
          userMessage.id,
        );
        setLoreRecallLogs((current) => [...recallLogs, ...current].slice(0, 40));
      }

      const contextMessages = [
        ...scenarioMessages,
        ...loreMessages,
        ...toOllamaMessages(messages),
      ];
      let accumulatedResponse = "";
      const didUseNativeStream = await streamLocalLlmResponse(
        {
          contextMessages,
          promptText: playerInput,
          storyNodeId: "scene_01_alley_encounter",
        },
        {
          onToken: (token) => {
            accumulatedResponse += token;

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
          },
        },
      );

      if (didUseNativeStream) {
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

        return;
      }

      const latestInferenceConfig = loadInferenceConfig();
      const response = await fetch(latestInferenceConfig.localEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: latestInferenceConfig.selectedModel,
          messages: [
            ...scenarioMessages,
            ...loreMessages,
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
          `Could not reach local Ollama at ${loadInferenceConfig().localEndpoint}. ${message} Native dialogue fallback also failed: ${fallbackDetail}`,
        );
        updateActiveSession({ messages: updatedMessages });
      }
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleRegenerateMessage(targetMessageId: string) {
    if (isGenerating) {
      return;
    }

    const targetIndex = messages.findIndex(
      (message) => message.id === targetMessageId,
    );
    const targetMessage = messages[targetIndex];

    if (!targetMessage || targetMessage.role !== "assistant") {
      return;
    }

    const parentUserIndex = findParentUserMessageIndex(messages, targetIndex);

    if (parentUserIndex < 0) {
      setRuntimeError("Cannot regenerate a response without a parent user turn.");
      return;
    }

    const parentUserMessage = messages[parentUserIndex]!;
    const parentPrompt = getMessageText(parentUserMessage);
    const baseMessages = messages.slice(0, targetIndex);
    const contextBeforeParent = messages.slice(0, parentUserIndex);
    const detectedTrope =
      targetMessage.detectedTrope ?? parentUserMessage.detectedTrope ?? "casual";
    const regeneratingMessage = createRegenerationVariant({
      ...targetMessage,
      detectedTrope,
    });
    const rewoundMessages = [...baseMessages, regeneratingMessage];

    updateActiveSession({ messages: rewoundMessages });
    setIsGenerating(true);
    setRuntimeError(null);

    try {
      const scenarioMessages = compileScenarioOverrideMessages(
        activeSession.scenarioOverride,
      );
      const loreActivation = await scanActiveLorebookForChatTurn(
        activeLorebook,
        parentPrompt,
      );
      const loreMessages = buildLoreRecallMessages(loreActivation);
      setActiveLoreFeed(loreActivation.loreInjectionChunk);

      if (loreActivation.hasMatches) {
        const recallLogs = createLoreRecallAuditLogs(
          loreActivation,
          activeLorebook,
          parentUserMessage.id,
        );
        setLoreRecallLogs((current) => [...recallLogs, ...current].slice(0, 40));
      }

      let accumulatedResponse = "";
      const didUseNativeStream = await streamLocalLlmResponse(
        {
          contextMessages: [
            ...scenarioMessages,
            ...loreMessages,
            ...toOllamaMessages(contextBeforeParent),
          ],
          promptText: parentPrompt,
          storyNodeId: "scene_01_alley_encounter",
        },
        {
          onToken: (token) => {
            accumulatedResponse += token;
            updateActiveSession({
              messages: updateMessageById(
                rewoundMessages,
                regeneratingMessage.id,
                (message) => updateRoleplayMessageText(message, accumulatedResponse),
              ),
            });
          },
        },
      );

      if (!didUseNativeStream) {
        const latestInferenceConfig = loadInferenceConfig();
        const response = await fetch(latestInferenceConfig.localEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: latestInferenceConfig.selectedModel,
            messages: [
              ...scenarioMessages,
              ...loreMessages,
              ...toOllamaMessages(baseMessages),
            ],
            stream: true,
          }),
        });

        if (!response.ok || !response.body) {
          throw new Error(`Ollama returned ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
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
                messages: updateMessageById(
                  rewoundMessages,
                  regeneratingMessage.id,
                  (message) =>
                    updateRoleplayMessageText(message, accumulatedResponse),
                ),
              });
            }
          }
        }
      }

      if (accumulatedResponse.trim()) {
        const completedMessages = updateMessageById(
          rewoundMessages,
          regeneratingMessage.id,
          (message) => updateRoleplayMessageText(message, accumulatedResponse),
        );

        updateActiveSession({ messages: completedMessages });
        void persistDialogueHistory(completedMessages, setRuntimeError);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown inference error.";

      try {
        const contextualDialogue = await fetchContextualNpcDialogue(
          "scene_01_alley_encounter",
        );
        const fallbackMessage = updateRoleplayMessageText(
          regeneratingMessage,
          contextualDialogue.transformed_text,
        );
        const fallbackMessages = updateMessageById(
          rewoundMessages,
          regeneratingMessage.id,
          () => fallbackMessage,
        );

        updateActiveSession({
          messages: fallbackMessages,
        });
        void persistDialogueHistory(fallbackMessages, setRuntimeError);
        setRuntimeError(
          `Ollama was unavailable (${message}), so Lucas used the native ${contextualDialogue.applied_archetype} dialogue variant.`,
        );
      } catch (fallbackError) {
        const fallbackDetail =
          fallbackError instanceof Error
            ? fallbackError.message
            : String(fallbackError);
        setRuntimeError(
          `Could not regenerate from local Ollama at ${loadInferenceConfig().localEndpoint}. ${message} Native dialogue fallback also failed: ${fallbackDetail}`,
        );
        updateActiveSession({ messages });
      }
    } finally {
      setIsGenerating(false);
    }
  }

  function handleNavigateMessageVariant(
    messageId: string,
    direction: "next" | "prev",
  ) {
    if (isGenerating) {
      return;
    }

    const nextMessages = messages.map((message) =>
      message.id === messageId
        ? navigateRoleplayMessageVariant(message, direction)
        : message,
    );

    updateActiveSession({ messages: nextMessages });
    void persistDialogueHistory(nextMessages, setRuntimeError);
  }

  async function handleIntentSelection(selected: ActionCardVariant) {
    if (isGenerating) {
      return;
    }

    const committedText = formatIntentSelection(selected);
    const userMessage = createRoleplayMessage(
      "user",
      committedText,
      selected.intentClass,
    );

    updateActiveSession({
      messages: [...messages, userMessage],
      title: buildSessionTitle(activeSession.title, selected.dialoguePreview),
    });
    setIntentModalOpen(false);
    setRuntimeError(null);

    await addRelationshipMessage({
      content: committedText,
      createdAt: Date.now(),
      role: "user",
    });
    void persistDialogueLine(userMessage, setRuntimeError);
  }

  return (
    <StudioShell
      eyebrow="Character Chat"
      title="Chat Preview"
      subtitle="Test character replies, lorebook links, and relationship tone before starting a full playthrough."
      actions={<Badge variant="outline">Ollama: {inferenceConfig.selectedModel}</Badge>}
    >
      <div className="grid min-h-[calc(100vh-9rem)] gap-5 xl:grid-cols-[20rem_minmax(0,1fr)]">
        <section className="flex max-h-none flex-col gap-5 overflow-y-auto pr-1 xl:sticky xl:top-24 xl:max-h-[calc(100vh-9rem)]">
          <Card className="bg-card/85">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles data-icon="inline-start" />
                Active Persona
              </CardTitle>
              <CardDescription>Romance chat preview</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-primary text-lg text-primary-foreground">
                H
              </div>
              <div>
                <p className="text-sm font-medium">HeartWrite Preview</p>
                <p className="text-xs text-muted-foreground">
                  Local model: {inferenceConfig.selectedModel}
                </p>
                <p className="max-w-56 truncate text-[10px] text-muted-foreground">
                  {inferenceConfig.localEndpoint}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/85">
            <CardHeader>
              <CardTitle className="text-base">Chat Notes</CardTitle>
              <CardDescription>
                Full playthroughs use a character card and a {"{{user}}"} persona.
                Scenario overrides are optional because character cards can
                supply their own opening scenario.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card/85">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpenText className="size-4 text-muted-foreground" />
                Active Lorebook
              </CardTitle>
              <CardDescription>
                {activeLorebook
                  ? `${activeLorebook.title} can be recalled when matching story words appear.`
                  : "No lorebook is active for this chat."}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              {activeLorebook ? (
                <div className="rounded-md border bg-background/70 p-3 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">
                    {activeLorebook.title}
                  </p>
                  <p className="mt-1 line-clamp-2">
                    {activeLorebook.summary.aiLoreInstruction}
                  </p>
                  <p className="mt-2">
                    {activeLorebook.entries.length} lore entries ready
                  </p>
                </div>
              ) : null}
              <Button
                type="button"
                variant="outline"
                onClick={() => setLorebookPanelOpen(true)}
              >
                <BookOpenText className="size-4" />
                Manage Lorebooks
              </Button>
            </CardContent>
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
                  Use This Scenario
                </Button>
              </div>
              <Textarea
                value={activeSession.scenarioOverride.context}
                onChange={(event) =>
                  updateScenarioOverride("context", event.currentTarget.value)
                }
                placeholder="What the chat should remember"
              />
              <Textarea
                value={activeSession.scenarioOverride.setting}
                onChange={(event) =>
                  updateScenarioOverride("setting", event.currentTarget.value)
                }
                placeholder="Where the scene takes place"
              />
              <Textarea
                value={activeSession.scenarioOverride.scene}
                onChange={(event) =>
                  updateScenarioOverride("scene", event.currentTarget.value)
                }
                placeholder="What is happening now"
              />
              <Textarea
                value={activeSession.scenarioOverride.dynamic}
                onChange={(event) =>
                  updateScenarioOverride("dynamic", event.currentTarget.value)
                }
                placeholder="Relationship tension"
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

        <div
          className={cn(
            "relative grid min-h-[calc(100vh-9rem)] min-w-0 overflow-hidden rounded-xl border bg-card/70 shadow-xl backdrop-blur",
            isLorebookDockVisible
              ? "lg:grid-cols-[minmax(0,1fr)_var(--lorebook-dock-width)]"
              : "lg:grid-cols-1",
          )}
          id="gameplay-chat-viewport"
          style={
            isLorebookDockVisible
              ? ({
                  "--lorebook-dock-width": `${sidebarWidth}px`,
                } as CSSProperties)
              : undefined
          }
        >
        <section className="relative flex min-w-0 flex-col overflow-hidden">
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-b opacity-50 mix-blend-soft-light transition-all duration-1000",
            activeTropeStyle.screenVignette,
          )}
        />
        <header className="relative z-10 flex items-center justify-between gap-3 border-b bg-card/70 px-5 py-3 backdrop-blur">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Conversation
            </p>
            <p className="text-xs text-muted-foreground">
              Dialogue, action beats, and romance tone are easy to scan.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <GlowingConnectionNode
              errorCode={loreDiagnostic.errorCode}
              status={loreDiagnostic.status}
            />
            <Button
              className="lg:hidden"
              onClick={() => setLorebookPanelOpen(true)}
              size="sm"
              type="button"
              variant="outline"
            >
              <BookOpenText className="size-4" />
              Lorebooks
            </Button>
            <Button
              className="hidden lg:inline-flex"
              onClick={() => toggleDockPanel("Lorebook")}
              size="sm"
              type="button"
              variant={isLorebookDockVisible ? "secondary" : "outline"}
            >
              <BookOpenText className="size-4" />
              Lorebook Panel
            </Button>
            <Button
              disabled={isGenerating}
              onClick={() => setIntentModalOpen(true)}
              size="sm"
              type="button"
              variant="outline"
            >
              <MousePointerClick className="size-4" />
              Story Choice
            </Button>
            <CameraSnapperButton />
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
          onRegenerateMessage={(messageId) =>
            void handleRegenerateMessage(messageId)
          }
          onNavigateMessageVariant={handleNavigateMessageVariant}
          runtimeError={runtimeError}
        />

        <div className="border-t bg-card/80 p-5 backdrop-blur">
          <LoreActivationBadge activeLoreSnippet={activeLoreFeed} />
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
        {isLorebookDockVisible ? (
          <aside className="relative z-10 hidden min-h-0 lg:flex">
            <button
              aria-label="Resize lorebook panel"
              className="group relative z-20 flex w-2 shrink-0 cursor-col-resize touch-none items-stretch justify-center bg-border/40 transition hover:bg-primary/35 active:bg-primary/45"
              onPointerDown={startDockResize}
              title="Drag to resize lorebook panel"
              type="button"
            >
              <span className="my-3 w-px rounded-full bg-muted-foreground/35 transition group-hover:bg-primary" />
            </button>
            <div className="flex min-h-0 w-full flex-col gap-3 border-l border-border/60 bg-card/45 p-3 text-foreground backdrop-blur">
              <div className="min-h-0 flex-1">
                <LorebookControlPanel
                  activeLorebookId={activeLorebook?.id}
                  isOpen
                  onActivateLorebook={(lorebook) => setActiveLorebook(lorebook)}
                  onClose={() => toggleDockPanel("Lorebook")}
                  onDeactivateLorebook={(lorebookId) =>
                    setActiveLorebook((current) =>
                      current?.id === lorebookId ? null : current,
                    )
                  }
                  variant="dock"
                />
              </div>
              <ContextRecallInspector
                onClearAuditLog={() => setLoreRecallLogs([])}
                recallLogs={loreRecallLogs}
              />
            </div>
          </aside>
        ) : null}
        <CenteredIntentModal
          cardOptions={checkpointIntentOptions}
          isOpen={intentModalOpen}
          onCloseAbort={() => setIntentModalOpen(false)}
          onSelectAction={(selected) => void handleIntentSelection(selected)}
          scenePrompt={getIntentScenePrompt(activeSession.scenarioOverride)}
        />
        <LorebookControlPanel
          activeLorebookId={activeLorebook?.id}
          isOpen={lorebookPanelOpen}
          onActivateLorebook={(lorebook) => setActiveLorebook(lorebook)}
          onClose={() => setLorebookPanelOpen(false)}
          onDeactivateLorebook={(lorebookId) =>
            setActiveLorebook((current) =>
              current?.id === lorebookId ? null : current,
            )
          }
        />
      </div>
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

function createPreviewChatSession(): ChatSession {
  return {
    id: PREVIEW_CHAT_ID,
    messages: initialMessages,
    scenarioOverride: emptyScenarioOverride,
    title: "Preview Chat",
    updatedAt: PREVIEW_CHAT_UPDATED_AT,
  };
}

function loadInitialChatSessions() {
  try {
    if (typeof window === "undefined") {
      return [createPreviewChatSession()];
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

  return [createPreviewChatSession()];
}

function buildSessionTitle(currentTitle: string, firstMessage: string) {
  if (!currentTitle.startsWith("Chat ")) {
    return currentTitle;
  }

  return firstMessage.slice(0, 42) || currentTitle;
}

function formatIntentSelection(selected: ActionCardVariant) {
  return `[${selected.actionDescriptor}] "${selected.dialoguePreview}"`;
}

function getIntentScenePrompt(override: ScenarioOverride) {
  return (
    override.scene ||
    override.dynamic ||
    override.context ||
    "A charged pause opens in the scene. The next response will define the emotional direction of the exchange."
  );
}

function getActiveTrope(messages: RoleplayMessage[]): RomanceTropeClass {
  return messages.at(-1)?.detectedTrope ?? "casual";
}

function toViewportMessage(message: RoleplayMessage): ChatMessage {
  return {
    activeVariantIndex: message.activeVariantIndex,
    detectedTrope: message.detectedTrope ?? "casual",
    id: message.id,
    role: message.role === "user" ? "Player" : "NPC",
    swipedVariants: message.swipedVariants,
    text: getMessageText(message),
    timestamp: message.timestamp ?? new Date().toISOString(),
  };
}

function toDialogueLogEntry(message: RoleplayMessage): DialogueLogEntry {
  return {
    activeVariantIndex: message.activeVariantIndex,
    detectedTrope: message.detectedTrope ?? "casual",
    id: message.id,
    role: message.role === "user" ? "Player" : "NPC",
    swipedVariants: message.swipedVariants,
    text: getMessageText(message),
    timestamp: message.timestamp ?? new Date().toISOString(),
  };
}

function dialogueLogEntryToMessage(entry: DialogueLogEntry): RoleplayMessage {
  return {
    activeVariantIndex: entry.activeVariantIndex,
    detectedTrope: entry.detectedTrope,
    id: entry.id,
    parts: [{ type: "text", text: entry.text }],
    role: entry.role === "Player" ? "user" : "assistant",
    swipedVariants: entry.swipedVariants,
    timestamp: entry.timestamp,
  };
}

function findParentUserMessageIndex(
  messages: RoleplayMessage[],
  targetIndex: number,
) {
  for (let index = targetIndex - 1; index >= 0; index -= 1) {
    if (messages[index]?.role === "user") {
      return index;
    }
  }

  return -1;
}

function updateMessageById(
  messages: RoleplayMessage[],
  messageId: string,
  update: (message: RoleplayMessage) => RoleplayMessage,
) {
  return messages.map((message) =>
    message.id === messageId ? update(message) : message,
  );
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

async function persistDialogueHistory(
  messages: RoleplayMessage[],
  setRuntimeError: (message: string | null) => void,
) {
  try {
    await replaceDialogueHistory(messages.map(toDialogueLogEntry));
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

function getLorebookDiagnostic(
  lorebook: GeneratedLorebookArtifact | null,
): { errorCode: null | string; status: SystemSyncStatus } {
  if (!lorebook) {
    return {
      errorCode: null,
      status: "idle",
    };
  }

  const duplicatedKeys = findDuplicateActivationKeys(lorebook);
  if (duplicatedKeys.length > 0) {
    return {
      errorCode: `Duplicate activation keys: ${duplicatedKeys.slice(0, 6).join(", ")}`,
      status: "degraded",
    };
  }

  return {
    errorCode: null,
    status: "connected",
  };
}

function findDuplicateActivationKeys(lorebook: GeneratedLorebookArtifact) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const entry of lorebook.entries) {
    for (const key of entry.activationKeys) {
      const normalized = key.trim().toLowerCase();
      if (!normalized) {
        continue;
      }

      if (seen.has(normalized)) {
        duplicates.add(key.trim());
      } else {
        seen.add(normalized);
      }
    }
  }

  return [...duplicates];
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
