"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "heartwriteai:runtime-engine-settings";

type RuntimeEngineSettings = {
  advancedControlsEnabled: boolean;
};

const defaultSettings: RuntimeEngineSettings = {
  advancedControlsEnabled: false,
};

export function useRuntimeEngineSettings() {
  const [settings, setSettings] =
    useState<RuntimeEngineSettings>(defaultSettings);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setSettings(loadRuntimeEngineSettings());
      setHydrated(true);
    });
  }, []);

  const setAdvancedControlsEnabled = useCallback((enabled: boolean) => {
    setSettings((current) => {
      const next = {
        ...current,
        advancedControlsEnabled: enabled,
      };

      saveRuntimeEngineSettings(next);
      return next;
    });
  }, []);

  return {
    advancedControlsEnabled: settings.advancedControlsEnabled,
    hydrated,
    mode: settings.advancedControlsEnabled ? "advanced" : "standard",
    setAdvancedControlsEnabled,
  } as const;
}

function loadRuntimeEngineSettings(): RuntimeEngineSettings {
  try {
    const raw = getLocalStorage()?.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultSettings;
    }

    const parsed = JSON.parse(raw) as Partial<RuntimeEngineSettings>;

    return {
      advancedControlsEnabled:
        typeof parsed.advancedControlsEnabled === "boolean"
          ? parsed.advancedControlsEnabled
          : false,
    };
  } catch {
    return defaultSettings;
  }
}

function saveRuntimeEngineSettings(settings: RuntimeEngineSettings) {
  try {
    getLocalStorage()?.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Settings remain session-local if storage is unavailable.
  }
}

function getLocalStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return typeof window.localStorage === "undefined"
      ? null
      : window.localStorage;
  } catch {
    return null;
  }
}
