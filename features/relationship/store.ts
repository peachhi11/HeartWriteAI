"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import {
  DEFAULT_RELATIONSHIP_A_ID,
  DEFAULT_RELATIONSHIP_B_ID,
  DEFAULT_RELATIONSHIP_SCENARIO_ID,
  createDefaultDashboardRelationshipState,
} from "./defaults";
import type { RelationshipState } from "./schema";
import type {
  RelationshipChatMessage,
  RelationshipTrackingSnapshot,
  RelationshipUpdateReason,
} from "./types";
import { updateRelationshipFromMessages } from "./updater";
import {
  deleteRelationshipState,
  getRelationshipState,
  saveRelationshipState,
} from "@/lib/chat/relationshipStateRepository";
import {
  createRelationshipTrackingFromUpdate,
  trackRelationshipUpdate,
} from "@/lib/chat/relationshipTracking";

type RelationshipStore = {
  error: string | null;
  hydrated: boolean;
  messages: RelationshipChatMessage[];
  reasons: RelationshipUpdateReason[];
  state: RelationshipState;
  tracking: RelationshipTrackingSnapshot | null;
  addMessage: (message: RelationshipChatMessage) => Promise<void>;
  hydrate: () => Promise<void>;
  reset: () => Promise<void>;
};

const initial = createDefaultDashboardRelationshipState();

export const useRelationshipStore = create<RelationshipStore>()(
  immer((set, get) => ({
    error: null,
    hydrated: false,
    messages: [],
    reasons: [],
    state: initial,
    tracking: null,

    addMessage: async (message) => {
      const messages = [...get().messages, message];
      const previousState = get().state;
      const result = updateRelationshipFromMessages(
        previousState,
        messages.slice(-12),
      );
      const tracking = createRelationshipTrackingFromUpdate(
        previousState,
        result,
        message.createdAt ?? Date.now(),
      );

      set((draft) => {
        draft.error = null;
        draft.messages = messages;
        draft.reasons = result.reasons;
        draft.state = result.state;
        draft.tracking = tracking;
      });

      try {
        await saveRelationshipState(result.state);
      } catch (error) {
        set((draft) => {
          draft.error = formatStoreError(error);
        });
      }
    },

    hydrate: async () => {
      try {
        const state = await getRelationshipState(
          DEFAULT_RELATIONSHIP_SCENARIO_ID,
          DEFAULT_RELATIONSHIP_A_ID,
          DEFAULT_RELATIONSHIP_B_ID,
        );

        set((draft) => {
          draft.error = null;
          draft.hydrated = true;
          draft.state = state;
          draft.tracking = trackRelationshipUpdate(state, state, []);
        });
      } catch (error) {
        set((draft) => {
          draft.error = formatStoreError(error);
          draft.hydrated = true;
        });
      }
    },

    reset: async () => {
      const state = createDefaultDashboardRelationshipState();

      set((draft) => {
        draft.error = null;
        draft.messages = [];
        draft.reasons = [];
        draft.state = state;
        draft.tracking = trackRelationshipUpdate(state, state, []);
      });

      try {
        await deleteRelationshipState(
          DEFAULT_RELATIONSHIP_SCENARIO_ID,
          DEFAULT_RELATIONSHIP_A_ID,
          DEFAULT_RELATIONSHIP_B_ID,
        );
        await saveRelationshipState(state);
      } catch (error) {
        set((draft) => {
          draft.error = formatStoreError(error);
        });
      }
    },
  })),
);

function formatStoreError(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Relationship state persistence failed.";
}
