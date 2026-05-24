import type {
  RelationshipPatchReason,
  RelationshipUpdateMessage,
} from "@/lib/chat/relationshipUpdater";
import type { RelationshipTracking } from "@/lib/chat/relationshipTracking";

export type RelationshipChatMessage = RelationshipUpdateMessage;
export type RelationshipUpdateReason = RelationshipPatchReason;
export type RelationshipTrackingSnapshot = RelationshipTracking;
