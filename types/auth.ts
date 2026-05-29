export interface AuthSessionState {
  isProcessing: boolean;
  mfaRequired: boolean;
  tokenPayload: string | null;
  validationError: string | null;
}

export type AuthGatekeeperResponse = {
  message?: string;
  mfaStep?: boolean;
  token?: string;
};
