import { invoke } from "@tauri-apps/api/core";
import { emit, listen, UnlistenFn } from "@tauri-apps/api/event";

export function isTauriRuntime() {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export async function greetNative(name: string) {
  if (!isTauriRuntime()) {
    return "Running in browser preview. Tauri bridge will respond inside the desktop shell.";
  }

  return invoke<string>("greet", { name });
}

export async function getNativeAppVersion() {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<string>("get_app_version");
}

export async function emitNativeEvent<TPayload>(
  eventName: string,
  payload: TPayload,
) {
  if (!isTauriRuntime()) {
    return;
  }

  await emit(eventName, payload);
}

export async function listenToNativeEvent<TPayload>(
  eventName: string,
  handler: (payload: TPayload) => void,
): Promise<UnlistenFn | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return listen<TPayload>(eventName, (event) => {
    handler(event.payload);
  });
}
