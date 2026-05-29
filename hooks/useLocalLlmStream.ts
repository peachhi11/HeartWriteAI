"use client";

import { useState } from "react";

import {
  LocalLlmPromptPayload,
  streamLocalLlmResponse,
} from "@/lib/tauri/localLlm";

export function useLocalLlmStream(onTokenAppended: (chunk: string) => void) {
  const [isGenerating, setIsGenerating] = useState(false);

  async function requestModelInferenceStream(payload: LocalLlmPromptPayload) {
    setIsGenerating(true);

    try {
      const didUseNativeStream = await streamLocalLlmResponse(payload, {
        onDone: () => setIsGenerating(false),
        onToken: onTokenAppended,
      });

      if (!didUseNativeStream) {
        setIsGenerating(false);
      }

      return didUseNativeStream;
    } catch (error) {
      setIsGenerating(false);
      throw error;
    }
  }

  return { isGenerating, requestModelInferenceStream };
}
