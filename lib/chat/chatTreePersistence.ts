import { invoke } from "@tauri-apps/api/core";

import type {
  ChatNode,
  ChatSessionTree,
  PersistedChatSessionSnapshot,
} from "@/types/chatTree";

const CHAT_STORAGE_KEY = "heartwriteai:chat-sessions";
const MAX_BROWSER_SESSION_COUNT = 50;

type BrowserStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

type BrowserWindowLike = {
  __TAURI_INTERNALS__?: unknown;
  localStorage: BrowserStorage;
};

export function createChatTreeFromMessages(
  session: PersistedChatSessionSnapshot,
): ChatSessionTree {
  const nodes: Record<string, ChatNode> = {};
  let parentId: string | null = null;

  session.messages.forEach((message, index) => {
    const nodeId = message.id || `${session.id}_node_${index}`;
    const timestamp = Date.parse(message.timestamp ?? "") || session.updatedAt;

    nodes[nodeId] = {
      childrenIds: [],
      id: nodeId,
      message: {
        ...message,
        id: nodeId,
      },
      parentId,
      timestamp,
    };

    if (parentId && nodes[parentId]) {
      nodes[parentId].childrenIds = [...nodes[parentId].childrenIds, nodeId];
    }

    parentId = nodeId;
  });

  return {
    activeBranchHeadId: parentId,
    createdTimestamp: session.updatedAt,
    nodes,
    roomName: session.title,
    scenarioOverride: session.scenarioOverride,
    sessionId: session.id,
    updatedTimestamp: session.updatedAt,
  };
}

export function flattenActiveBranch(tree: ChatSessionTree): ChatNode[] {
  const branch: ChatNode[] = [];
  const visited = new Set<string>();
  let currentId = tree.activeBranchHeadId;

  while (currentId && tree.nodes[currentId] && !visited.has(currentId)) {
    visited.add(currentId);
    const node = tree.nodes[currentId];
    branch.unshift(node);
    currentId = node.parentId;
  }

  return branch;
}

export function chatTreeToSessionSnapshot(
  tree: ChatSessionTree,
  fallback?: PersistedChatSessionSnapshot,
): PersistedChatSessionSnapshot {
  const messages = flattenActiveBranch(tree).map((node) => ({
    ...node.message,
    id: node.message.id || node.id,
  }));

  return {
    id: tree.sessionId,
    messages,
    scenarioOverride:
      tree.scenarioOverride ??
      fallback?.scenarioOverride ?? {
        context: "",
        dynamic: "",
        scene: "",
        setting: "",
      },
    title: tree.roomName || fallback?.title || "Saved Chat",
    updatedAt: tree.updatedTimestamp || fallback?.updatedAt || Date.now(),
  };
}

export async function loadPersistedChatSessions(): Promise<
  PersistedChatSessionSnapshot[] | null
> {
  if (!isDesktopRuntime()) {
    return loadBrowserChatSessions();
  }

  try {
    const rawTrees = await invoke<string[]>("list_chat_trees_native");
    const sessions = rawTrees
      .map(readChatTreePayload)
      .filter((tree): tree is ChatSessionTree => Boolean(tree))
      .map((tree) => chatTreeToSessionSnapshot(tree))
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, MAX_BROWSER_SESSION_COUNT);

    return sessions.length > 0 ? sessions : null;
  } catch {
    return loadBrowserChatSessions();
  }
}

export async function persistChatSessions(
  sessions: PersistedChatSessionSnapshot[],
): Promise<void> {
  if (!isDesktopRuntime()) {
    persistBrowserChatSessions(sessions);
    return;
  }

  await Promise.all(
    sessions.map((session) =>
      invoke("save_chat_tree_native", {
        jsonTreePayload: JSON.stringify(createChatTreeFromMessages(session)),
        sessionId: session.id,
      }),
    ),
  );
}

export async function persistChatSession(
  session: PersistedChatSessionSnapshot,
): Promise<void> {
  if (!isDesktopRuntime()) {
    const current = loadBrowserChatSessions() ?? [];
    persistBrowserChatSessions([
      session,
      ...current.filter((existing) => existing.id !== session.id),
    ]);
    return;
  }

  await invoke("save_chat_tree_native", {
    jsonTreePayload: JSON.stringify(createChatTreeFromMessages(session)),
    sessionId: session.id,
  });
}

function loadBrowserChatSessions(): PersistedChatSessionSnapshot[] | null {
  try {
    const browserWindow = getBrowserWindow();

    if (!browserWindow) {
      return null;
    }

    const raw = browserWindow.localStorage.getItem(CHAT_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;

    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed
      .filter(isPersistedSessionSnapshot)
      .slice(0, MAX_BROWSER_SESSION_COUNT);
  } catch {
    return null;
  }
}

function persistBrowserChatSessions(
  sessions: PersistedChatSessionSnapshot[],
): void {
  try {
    const browserWindow = getBrowserWindow();

    if (!browserWindow) {
      return;
    }

    browserWindow.localStorage.setItem(
      CHAT_STORAGE_KEY,
      JSON.stringify(sessions.slice(0, MAX_BROWSER_SESSION_COUNT)),
    );
  } catch {
    // Chat preview can still run without persistence.
  }
}

function isDesktopRuntime(): boolean {
  const browserWindow = getBrowserWindow();
  return Boolean(browserWindow && "__TAURI_INTERNALS__" in browserWindow);
}

function getBrowserWindow(): BrowserWindowLike | null {
  const candidate = (globalThis as { window?: BrowserWindowLike }).window;
  return candidate ?? null;
}

function readChatTreePayload(value: string): ChatSessionTree | null {
  try {
    const parsed = JSON.parse(value);
    return isChatSessionTree(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function isChatSessionTree(value: unknown): value is ChatSessionTree {
  if (!value || typeof value !== "object") {
    return false;
  }

  const tree = value as Partial<ChatSessionTree>;
  return (
    typeof tree.sessionId === "string" &&
    typeof tree.roomName === "string" &&
    typeof tree.nodes === "object" &&
    tree.nodes !== null
  );
}

function isPersistedSessionSnapshot(
  value: unknown,
): value is PersistedChatSessionSnapshot {
  if (!value || typeof value !== "object") {
    return false;
  }

  const session = value as Partial<PersistedChatSessionSnapshot>;
  return (
    typeof session.id === "string" &&
    typeof session.title === "string" &&
    Array.isArray(session.messages)
  );
}
