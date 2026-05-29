import { Channel, invoke } from "@tauri-apps/api/core";

import { isTauriRuntime } from "@/lib/tauri/native";

export interface LocalLlmContextMessage {
  role: string;
  content: string;
}

export interface LocalLlmPromptPayload {
  promptText: string;
  storyNodeId: string;
  model?: string;
  contextMessages?: LocalLlmContextMessage[];
}

export interface TokenStreamFragment {
  token: string;
  done: boolean;
}

export interface LocalLlmStreamHandlers {
  onDone?: () => void;
  onToken: (token: string) => void;
}

export async function streamLocalLlmResponse(
  payload: LocalLlmPromptPayload,
  handlers: LocalLlmStreamHandlers,
) {
  if (!isTauriRuntime()) {
    return false;
  }

  const tokenChannel = new Channel<TokenStreamFragment>((message) => {
    if (message.token) {
      handlers.onToken(message.token);
    }

    if (message.done) {
      handlers.onDone?.();
    }
  });

  await invoke("stream_local_llm_response", {
    onToken: tokenChannel,
    payload,
  });

  return true;
}
