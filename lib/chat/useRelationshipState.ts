"use client";

import { useCallback, useEffect, useState } from "react";

import type { RelationshipState } from "./relationshipState.schema";
import {
  getRelationshipState,
  patchRelationshipState,
  relationshipKey,
  saveRelationshipState,
} from "./relationshipStateRepository";

interface RelationshipStateHookSnapshot {
  error: string | null;
  key: string | null;
  state: RelationshipState | null;
}

export function useRelationshipState(
  scenarioId: string,
  aId: string,
  bId: string,
) {
  const activeKey = relationshipKey(scenarioId, aId, bId);
  const [snapshot, setSnapshot] = useState<RelationshipStateHookSnapshot>({
    error: null,
    key: null,
    state: null,
  });

  useEffect(() => {
    let isCurrent = true;

    getRelationshipState(scenarioId, aId, bId)
      .then((nextState) => {
        if (isCurrent) {
          setSnapshot({
            error: null,
            key: activeKey,
            state: nextState,
          });
        }
      })
      .catch((caughtError) => {
        if (isCurrent) {
          setSnapshot({
            error: String(caughtError),
            key: activeKey,
            state: null,
          });
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [scenarioId, aId, bId, activeKey]);

  const patch = useCallback(
    async (nextPatch: Partial<RelationshipState>) => {
      const nextState = await patchRelationshipState(
        scenarioId,
        aId,
        bId,
        nextPatch,
      );

      setSnapshot({
        error: null,
        key: activeKey,
        state: nextState,
      });
      return nextState;
    },
    [scenarioId, aId, bId, activeKey],
  );

  const save = useCallback(
    async (nextState: RelationshipState) => {
      const savedState = await saveRelationshipState(nextState);

      setSnapshot({
        error: null,
        key: activeKey,
        state: savedState,
      });
      return savedState;
    },
    [activeKey],
  );

  return {
    error: snapshot.key === activeKey ? snapshot.error : null,
    loading: snapshot.key !== activeKey,
    patch,
    save,
    state: snapshot.key === activeKey ? snapshot.state : null,
  };
}
