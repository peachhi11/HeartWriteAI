"use client";

import { invoke } from "@tauri-apps/api/core";

import { isTauriRuntime } from "@/lib/tauri/native";

export interface NativeRegexRule {
  flags?: string;
  pattern: string;
  replacement?: string;
}

export interface NativeRegexExecutionResult {
  matches: string[];
  output: string;
}

export async function executeRegexNative(
  pattern: string,
  text: string,
  flags?: string,
) {
  if (!isTauriRuntime()) {
    return findRegexMatchesInBrowser(pattern, text, flags);
  }

  return invoke<string[]>("execute_regex_native", { flags, pattern, text });
}

export async function applyRegexNative(
  rule: NativeRegexRule,
  text: string,
): Promise<NativeRegexExecutionResult> {
  if (!isTauriRuntime()) {
    return applyRegexInBrowser(rule, text);
  }

  return invoke<NativeRegexExecutionResult>("apply_regex_native", { rule, text });
}

function findRegexMatchesInBrowser(
  pattern: string,
  text: string,
  flags = "g",
) {
  const regex = new RegExp(pattern, normalizeBrowserFlags(flags));
  return Array.from(text.matchAll(regex)).map((match) => match[0]);
}

function applyRegexInBrowser(
  rule: NativeRegexRule,
  text: string,
): NativeRegexExecutionResult {
  const regex = new RegExp(rule.pattern, normalizeBrowserFlags(rule.flags ?? "g"));
  const matches = Array.from(text.matchAll(regex)).map((match) => match[0]);
  const output = text.replace(regex, rule.replacement ?? "");

  return { matches, output };
}

function normalizeBrowserFlags(flags: string) {
  const selected = new Set(flags);
  selected.add("g");
  return Array.from(selected)
    .filter((flag) => /[dgimsuvy]/.test(flag))
    .join("");
}
