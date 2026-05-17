export interface CharacterCardPayload {
  spec?: string;
  spec_version?: string;
  data?: Record<string, unknown>;
  [key: string]: unknown;
}
