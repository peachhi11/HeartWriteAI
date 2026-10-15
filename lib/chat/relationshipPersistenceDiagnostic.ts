import { createDefaultRelationshipState, type RelationshipState } from "./relationshipState.schema";
import {
  createRelationshipStateRepository,
  type RelationshipStateRepository,
} from "./relationshipStateRepository";

const diagnosticScenarioPrefix = "__private_persistence_diagnostic__";
const diagnosticCharacterAId = "diagnostic-user";
const diagnosticCharacterBId = "diagnostic-character";
const diagnosticMarker = "heartwrite-persistence-diagnostic";

export type RelationshipPersistenceDiagnosticResult = {
  cleanedUp: boolean;
  markerVerified: boolean;
  scenarioId: string;
  updatedAt: string;
};

export async function runRelationshipPersistenceDiagnostic(
  repository: RelationshipStateRepository = createRelationshipStateRepository(),
): Promise<RelationshipPersistenceDiagnosticResult> {
  const scenarioId = `${diagnosticScenarioPrefix}:${createDiagnosticId()}`;
  const state = createDefaultRelationshipState({
    aId: diagnosticCharacterAId,
    bId: diagnosticCharacterBId,
    id: `relationship:${scenarioId}:${diagnosticCharacterBId}:${diagnosticCharacterAId}`,
    scenarioId,
  });
  const diagnosticState: RelationshipState = {
    ...state,
    tags: [...state.tags, diagnosticMarker],
    trust: {
      ...state.trust,
      emotional: 73,
    },
  };

  let result: Omit<RelationshipPersistenceDiagnosticResult, "cleanedUp">;

  try {
    const saved = await repository.save(diagnosticState);
    const reloaded = await repository.get(
      scenarioId,
      diagnosticCharacterAId,
      diagnosticCharacterBId,
    );
    const markerVerified =
      reloaded.tags.includes(diagnosticMarker) && reloaded.trust.emotional === 73;

    if (!markerVerified) {
      throw new Error("PERSISTENCE_DIAGNOSTIC_READBACK_MISMATCH");
    }

    result = {
      markerVerified,
      scenarioId,
      updatedAt: saved.updatedAt ?? reloaded.updatedAt ?? "",
    };
  } finally {
    await repository.delete(scenarioId, diagnosticCharacterAId, diagnosticCharacterBId);
  }

  return {
    ...result,
    cleanedUp: true,
  };
}

function createDiagnosticId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
