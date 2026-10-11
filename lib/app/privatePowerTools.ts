export interface PrivatePowerToolsRuntime {
  isDesktopRuntime?: boolean;
  privateToolsFlag?: string;
  publicAppFlag?: string;
}

export function isPrivatePowerToolsEnabled(
  runtime: PrivatePowerToolsRuntime = {},
) {
  const privateToolsFlag =
    runtime.privateToolsFlag ?? process.env.NEXT_PUBLIC_HEARTWRITE_PRIVATE_TOOLS;
  const publicAppFlag =
    runtime.publicAppFlag ?? process.env.NEXT_PUBLIC_HEARTWRITE_PUBLIC_APP;

  if (isTruthyFeatureFlag(publicAppFlag)) {
    return false;
  }

  if (isTruthyFeatureFlag(privateToolsFlag)) {
    return true;
  }

  return runtime.isDesktopRuntime === true;
}

function isTruthyFeatureFlag(value: string | undefined) {
  return ["1", "true", "yes", "on"].includes(value?.toLowerCase() ?? "");
}
