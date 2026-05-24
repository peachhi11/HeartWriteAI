"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import {
  DEFAULT_RELATIONSHIP_B_ID,
  DEFAULT_RELATIONSHIP_SCENARIO_ID,
} from "./defaults";
import {
  createDefaultRelationshipGraph,
  updateRelationshipGraphFromSexualOnlyEvent,
  updateRelationshipGraphFromEvent,
  type RelationshipGraph,
  type RelationshipGraphEvent,
} from "@/lib/chat/relationshipGraph";
import type { SexualOnlyEdgeEvent } from "@/lib/chat/relationshipSexualOnlyEdge";
import {
  deleteRelationshipGraph,
  getRelationshipGraph,
  saveRelationshipGraph,
} from "@/lib/chat/relationshipGraphRepository";

type RelationshipGraphStore = {
  error: string | null;
  events: RelationshipGraphEvent[];
  graph: RelationshipGraph;
  hydrated: boolean;
  mainLoveInterestId: string;
  userId: string;
  addEvent: (event: RelationshipGraphEvent) => Promise<void>;
  addSexualOnlyEvent: (event: SexualOnlyEdgeEvent) => Promise<void>;
  hydrate: () => Promise<void>;
  reset: () => Promise<void>;
};

const initialGraph = createDefaultRelationshipGraph(
  DEFAULT_RELATIONSHIP_SCENARIO_ID,
);

export const useRelationshipGraphStore = create<RelationshipGraphStore>()(
  immer((set, get) => ({
    error: null,
    events: [],
    graph: initialGraph,
    hydrated: false,
    mainLoveInterestId: DEFAULT_RELATIONSHIP_B_ID,
    userId: "user",

    addEvent: async (event) => {
      const graph = updateRelationshipGraphFromEvent({
        graph: get().graph,
        event,
        mainLoveInterestId: get().mainLoveInterestId,
        userId: get().userId,
      });
      const events = [...get().events, event].slice(-100);

      set((draft) => {
        draft.error = null;
        draft.events = events;
        draft.graph = graph;
      });

      try {
        await saveRelationshipGraph(graph);
      } catch (error) {
        set((draft) => {
          draft.error = formatGraphStoreError(error);
        });
      }
    },

    addSexualOnlyEvent: async (event) => {
      const graph = updateRelationshipGraphFromSexualOnlyEvent({
        graph: get().graph,
        event,
      });

      set((draft) => {
        draft.error = null;
        draft.graph = graph;
      });

      try {
        await saveRelationshipGraph(graph);
      } catch (error) {
        set((draft) => {
          draft.error = formatGraphStoreError(error);
        });
      }
    },

    hydrate: async () => {
      try {
        const graph = await getRelationshipGraph(DEFAULT_RELATIONSHIP_SCENARIO_ID);

        set((draft) => {
          draft.error = null;
          draft.events = graph.events;
          draft.graph = graph;
          draft.hydrated = true;
        });
      } catch (error) {
        set((draft) => {
          draft.error = formatGraphStoreError(error);
          draft.hydrated = true;
        });
      }
    },

    reset: async () => {
      const graph = createDefaultRelationshipGraph(
        DEFAULT_RELATIONSHIP_SCENARIO_ID,
      );

      set((draft) => {
        draft.error = null;
        draft.events = [];
        draft.graph = graph;
      });

      try {
        await deleteRelationshipGraph(DEFAULT_RELATIONSHIP_SCENARIO_ID);
        await saveRelationshipGraph(graph);
      } catch (error) {
        set((draft) => {
          draft.error = formatGraphStoreError(error);
        });
      }
    },
  })),
);

function formatGraphStoreError(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Relationship graph persistence failed.";
}
