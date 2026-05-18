# Auto-Update Security Plan

HeartWriteAI should not enable automatic updates until the signing, release, and rollback path is real. Auto-update can ship executable code to every user, so a placeholder key or HTTP endpoint is worse than no updater.

## Current Decision

Auto-update is intentionally disabled for now.

Required before enabling:

- Generate a Tauri updater signing key pair.
- Store the private key only in CI secrets, never in the repository.
- Embed only the public key in `src-tauri/tauri.conf.json`.
- Publish update manifests and artifacts from HTTPS endpoints only.
- Produce Tauri updater artifacts during release builds.
- Test invalid-signature, missing-signature, network-failure, and downgrade cases.
- Define rollback and staged rollout procedures.

## Key Generation

Generate keys locally only when the release process is ready:

```bash
npm run tauri signer generate -- -w ~/.tauri/heartwriteai.key
```

The generated private key and key password must be moved into CI secrets:

- `TAURI_PRIVATE_KEY`
- `TAURI_KEY_PASSWORD`

Do not commit either value. Do not paste either value into docs, configs, examples, issue comments, or logs.

## Tauri Config Shape

When update infrastructure exists, add updater config similar to this with the real public key and real HTTPS endpoint:

```json
{
  "plugins": {
    "updater": {
      "pubkey": "REAL_PUBLIC_KEY_HERE",
      "endpoints": [
        "https://releases.example.com/heartwriteai/{{target}}/{{arch}}/{{current_version}}"
      ]
    }
  },
  "bundle": {
    "createUpdaterArtifacts": true
  }
}
```

Rules:

- Endpoints must use `https://`.
- Update manifests must contain signatures for every platform artifact.
- The app must never install unsigned artifacts.
- The release server must not have access to the signing private key.

## Rollout Policy

Default rollout should be staged:

- `1%` first wave for smoke validation.
- `10%` after 24 hours with no critical failures.
- `50%` after 48 hours with no critical failures.
- `100%` after 72 hours with no critical failures.

Emergency releases may bypass staging only for critical security fixes, and they still require valid signatures.

## Rollback Policy

The app must preserve user data across update failures. Before enabling auto-update, define and test:

- What files are part of application install state.
- What files are user data and must never be overwritten.
- How a failed install returns the user to the prior working version.
- How release distribution is halted if failure rates spike.

## Verification Checklist

Before turning updater on:

```bash
npm run lint
npm run build
npm run tauri:build
```

Manual/security checks:

- Confirm update artifacts are generated.
- Confirm signatures exist in the manifest.
- Confirm tampered artifacts are rejected.
- Confirm missing signatures are rejected.
- Confirm older versions are not offered as updates.
- Confirm app still launches when update checks fail.
- Confirm private key is absent from `git grep -n "TAURI_PRIVATE_KEY\\|TAURI_KEY_PASSWORD\\|heartwriteai.key"`.

## Future UI

The settings UI should eventually expose:

- Update channel: `stable`, `beta`, or disabled.
- Manual “check for updates” action.
- Update details before install.
- Clear error state if update check fails.
- No forced install without user-visible context.
