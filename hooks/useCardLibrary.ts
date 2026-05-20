"use client";

import { useCallback, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import { isTauriRuntime } from "@/lib/tauri/native";

export interface SearchFilters {
  query?: string;
  framework?: string;
  relationship?: string;
  tag?: string;
  tags?: string[];
  page: number;
  limit: number;
}

export interface CacheItemSummary {
  id: string;
  file_path: string;
  name: string;
  framework: string;
  relationship: string;
  tags: string[];
  updated_at: number;
}

export interface PaginatedResponse {
  items: CacheItemSummary[];
  total_count: number;
  total_pages: number;
  current_page: number;
}

export interface CardLibraryMetadata {
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export function useCardLibrary(initialLimit = 12) {
  const isDesktopRuntime = isTauriRuntime();
  const [items, setItems] = useState<CacheItemSummary[]>([]);
  const [metadata, setMetadata] = useState<CardLibraryMetadata>({
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    page: 1,
    limit: initialLimit,
  });

  const fetchPage = useCallback(async (currentFilters: SearchFilters) => {
    if (!isDesktopRuntime) {
      setItems([]);
      setMetadata({
        totalCount: 0,
        totalPages: 1,
        currentPage: currentFilters.page,
      });
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await invoke<PaginatedResponse>("search_library_cache", {
        filter: currentFilters,
      });
      setItems(response.items);
      setMetadata({
        totalCount: response.total_count,
        totalPages: response.total_pages,
        currentPage: response.current_page,
      });
    } catch (caughtError) {
      const message = String(caughtError);
      console.error("Failed querying desktop engine cache partition: ", caughtError);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [isDesktopRuntime]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchPage(filters);
    });
  }, [fetchPage, filters]);

  const setPage = useCallback((newPage: number) => {
    setFilters((previous) => ({
      ...previous,
      page: Math.max(1, newPage),
    }));
  }, []);

  const updateSearchQuery = useCallback((text: string) => {
    const query = text.trim();
    setFilters((previous) => ({
      ...previous,
      query: query || undefined,
      page: 1,
    }));
  }, []);

  const refresh = useCallback(() => {
    void fetchPage(filters);
  }, [fetchPage, filters]);

  return {
    items,
    metadata,
    loading,
    error,
    filters,
    fetchPage,
    refresh,
    setPage,
    updateSearchQuery,
    setFilters,
    isDesktopRuntime,
  };
}
