import type { RoleplayMessage } from "@/lib/chat/messages";

export interface ChatNode {
  childrenIds: string[];
  id: string;
  message: RoleplayMessage;
  parentId: string | null;
  timestamp: number;
}

export interface ChatSessionTree {
  activeBranchHeadId: string | null;
  createdTimestamp: number;
  nodes: Record<string, ChatNode>;
  roomName: string;
  scenarioOverride: PersistedChatSessionSnapshot["scenarioOverride"];
  sessionId: string;
  updatedTimestamp: number;
}

export interface PersistedChatSessionSnapshot {
  id: string;
  messages: RoleplayMessage[];
  scenarioOverride: {
    context: string;
    dynamic: string;
    scene: string;
    setting: string;
  };
  title: string;
  updatedAt: number;
}
