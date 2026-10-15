"use client";

import {
  RelationshipStateSchema,
  createDefaultRelationshipState,
  normalizeRelationshipState,
  type RelationshipState,
} from "./relationshipState.schema";
import {
  createLocalPersistenceAdapter,
  createMemoryPersistenceAdapter,
  type LocalPersistenceAdapter,
} from "../storage/localPersistence";

const relationshipStorePath = "relationship-state.json";
export type RelationshipStateStorageAdapter = LocalPersistenceAdapter;

export interface RelationshipStateRepository {
  delete(scenarioId: string, aId: string, bId: string): Promise<void>;
  get(scenarioId: string, aId: string, bId: string): Promise<RelationshipState>;
  patch(
    scenarioId: string,
    aId: string,
    bId: string,
    patch: Partial<RelationshipState>,
  ): Promise<RelationshipState>;
  save(state: RelationshipState): Promise<RelationshipState>;
}

export function relationshipKey(scenarioId: string, aId: string, bId: string) {
  const [leftId, rightId] = [aId, bId].sort();

  return `relationship:${scenarioId}:${leftId}:${rightId}`;
}

export function createRelationshipStateRepository(
  storage = createBrowserRelationshipStateStorage(),
): RelationshipStateRepository {
  return {
    async delete(scenarioId, aId, bId) {
      await storage.delete(relationshipKey(scenarioId, aId, bId));
    },
    async get(scenarioId, aId, bId) {
      const saved = await storage.get(relationshipKey(scenarioId, aId, bId));

      if (saved) {
        return normalizeRelationshipState(saved);
      }

      return createDefaultRelationshipState({
        id: relationshipKey(scenarioId, aId, bId),
        scenarioId,
        aId,
        bId,
      });
    },
    async patch(scenarioId, aId, bId, patch) {
      const current = await this.get(scenarioId, aId, bId);
      const next = normalizeRelationshipState({
        ...current,
        ...patch,
        createdAt: current.createdAt,
        id: current.id,
        scenarioId,
        updatedAt: new Date().toISOString(),
        characters: {
          ...current.characters,
          ...(patch.characters ?? {}),
          aId,
          bId,
        },
      });

      return this.save(next);
    },
    async save(state) {
      const normalized = RelationshipStateSchema.parse({
        ...state,
        updatedAt: new Date().toISOString(),
      });

      await storage.set(
        relationshipKey(
          normalized.scenarioId ?? "default",
          normalized.characters.aId,
          normalized.characters.bId,
        ),
        normalized,
      );

      return normalized;
    },
  };
}

export function createMemoryRelationshipStateStorage(
  seed?: Record<string, RelationshipState>,
): RelationshipStateStorageAdapter {
  return createMemoryPersistenceAdapter(seed);
}

export function getRelationshipState(scenarioId: string, aId: string, bId: string) {
  return defaultRelationshipStateRepository.get(scenarioId, aId, bId);
}

export function saveRelationshipState(state: RelationshipState) {
  return defaultRelationshipStateRepository.save(state);
}

export function patchRelationshipState(
  scenarioId: string,
  aId: string,
  bId: string,
  patch: Partial<RelationshipState>,
) {
  return defaultRelationshipStateRepository.patch(scenarioId, aId, bId, patch);
}

export function deleteRelationshipState(scenarioId: string, aId: string, bId: string) {
  return defaultRelationshipStateRepository.delete(scenarioId, aId, bId);
}

function createBrowserRelationshipStateStorage(): RelationshipStateStorageAdapter {
  return createLocalPersistenceAdapter({ storeFile: relationshipStorePath });
}

const defaultRelationshipStateRepository = createRelationshipStateRepository();
