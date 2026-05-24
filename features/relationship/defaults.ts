import { createDefaultRelationshipState } from "./schema";

export const DEFAULT_RELATIONSHIP_SCENARIO_ID = "studio-dashboard";
export const DEFAULT_RELATIONSHIP_A_ID = "user";
export const DEFAULT_RELATIONSHIP_B_ID = "character";

export function createDefaultDashboardRelationshipState() {
  return createDefaultRelationshipState({
    aId: DEFAULT_RELATIONSHIP_A_ID,
    bId: DEFAULT_RELATIONSHIP_B_ID,
    id: "relationship:studio-dashboard:character:user",
    scenarioId: DEFAULT_RELATIONSHIP_SCENARIO_ID,
    type: "strangers_to_lovers",
  });
}
