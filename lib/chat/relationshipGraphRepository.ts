"use client";

import {
  RelationshipGraphSchema,
  createDefaultRelationshipGraph,
  normalizeRelationshipGraph,
  type RelationshipGraph,
} from "./relationshipGraph";
import {
  createLocalPersistenceAdapter,
  createMemoryPersistenceAdapter,
  type LocalPersistenceAdapter,
} from "../storage/localPersistence";

const relationshipGraphStorePath = "relationship-graph.json";
export type RelationshipGraphStorageAdapter = LocalPersistenceAdapter;

export interface RelationshipGraphRepository {
  delete(scenarioId: string): Promise<void>;
  get(scenarioId: string): Promise<RelationshipGraph>;
  save(graph: RelationshipGraph): Promise<RelationshipGraph>;
}

export function relationshipGraphKey(scenarioId: string) {
  return `relationship-graph:${scenarioId}`;
}

export function createRelationshipGraphRepository(
  storage = createBrowserRelationshipGraphStorage(),
): RelationshipGraphRepository {
  return {
    async delete(scenarioId) {
      await storage.delete(relationshipGraphKey(scenarioId));
    },
    async get(scenarioId) {
      const saved = await storage.get(relationshipGraphKey(scenarioId));

      if (saved) {
        return normalizeRelationshipGraph(saved);
      }

      return createDefaultRelationshipGraph(scenarioId);
    },
    async save(graph) {
      const normalized = RelationshipGraphSchema.parse({
        ...graph,
        updatedAt: new Date().toISOString(),
      });

      await storage.set(relationshipGraphKey(normalized.scenarioId), normalized);
      return normalized;
    },
  };
}

export function createMemoryRelationshipGraphStorage(
  seed?: Record<string, RelationshipGraph>,
): RelationshipGraphStorageAdapter {
  return createMemoryPersistenceAdapter(seed);
}

export function getRelationshipGraph(scenarioId: string) {
  return defaultRelationshipGraphRepository.get(scenarioId);
}

export function saveRelationshipGraph(graph: RelationshipGraph) {
  return defaultRelationshipGraphRepository.save(graph);
}

export function deleteRelationshipGraph(scenarioId: string) {
  return defaultRelationshipGraphRepository.delete(scenarioId);
}

function createBrowserRelationshipGraphStorage(): RelationshipGraphStorageAdapter {
  return createLocalPersistenceAdapter({ storeFile: relationshipGraphStorePath });
}

const defaultRelationshipGraphRepository = createRelationshipGraphRepository();
