import { invoke } from "@tauri-apps/api/core";

export type TokenCounterModel =
  | "gpt-4o"
  | "gpt-4"
  | "gpt-3.5-turbo"
  | (string & {});

export async function countTokens(
  text: string,
  model: TokenCounterModel = "gpt-4o",
) {
  return invoke<number>("count_tokens", { text, model });
}

export async function countTokensNative(
  text: string,
  model: TokenCounterModel = "gpt-4o",
) {
  return invoke<number>("count_tokens_native", { text, model });
}
