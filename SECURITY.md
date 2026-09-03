# Security Notes

This document tracks secrets, credentials, and security-sensitive configuration
that must be rotated or removed before this codebase is deployed outside of a
local development environment.

## Status

| Item | Where it lives | Risk | Action required |
|------|----------------|------|-----------------|
| `JWT_SECRET` | `backend/.env` line 7 | **CRITICAL** — a placeholder value is currently committed | Rotate before any non-local deployment |
| Gemini API key | Previously `frontend/src/services/geminiService.ts` | **CRITICAL** — was committed in source | Removed; now requires `VITE_GEMINI_API_KEY` env var, with a built-in smart-reply fallback when unset |

## Secrets to rotate

### 1. `JWT_SECRET` (backend)

The `JWT_SECRET` is the secret used to sign every authentication token issued
by the API. If it leaks, an attacker can forge tokens for any user, including
administrators.

**Current value (placeholder):**
```
JWT_SECRET=ROTATE_ME_BEFORE_DEPLOY__node_-e_require_crypto_randomBytes_64_toString_hex
```

**Generate a strong replacement (do this locally, never paste the result into a
chat or commit):**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Replace the value in `backend/.env` with the generated string.**

**Hardening in this codebase** (already in place):
- `backend/server.js` validates `JWT_SECRET` at boot. The process **refuses to
  start** if the value still matches the placeholder above, so a non-rotated
  deployment will crash immediately rather than run with a known secret.
- `backend/middleware/auth.js` and the login flow do not log the secret.
- The previous dev secret is **not** used anywhere in the codebase; only the
  placeholder marker is. If you re-use a real `JWT_SECRET` value from a
  previous project, treat it as compromised and rotate it.

**Rotation steps:**
1. Generate a fresh value (command above).
2. Set it in your production environment (`backend/.env` is for local dev
   only — production should read from a secret manager, e.g. AWS Secrets
   Manager, HashiCorp Vault, or your platform's env-var config).
3. Restart the API. All existing tokens will be invalidated — every signed-in
   user will have to sign in again.
4. Audit logs for any signs of token forgery in the window between
   placeholder use and rotation.

### 2. Gemini API key (frontend)

The previous build hard-coded a Google Gemini API key directly in
`frontend/src/services/geminiService.ts`. That has been removed. The service
now:

- Reads `import.meta.env.VITE_GEMINI_API_KEY`.
- Falls back to a built-in `getSmartReply()` function when the env var is
  missing — the chat still works, just without LLM-generated answers.

**If the previous key has ever been exposed** (it was committed in the repo
history), treat it as compromised:

1. Go to https://aistudio.google.com/app/apikey and revoke the previous key.
2. Create a new key.
3. Set `VITE_GEMINI_API_KEY=<new-key>` in your environment (e.g. a
   `.env.local` file that is **not** committed) before building the frontend.

## Secrets that should never be committed

The following are intentionally **not** in the repo and should be added via
environment variables / secret manager:

- `MONGO_URI` for any non-local database
- `JWT_SECRET` (see above)
- `VITE_GEMINI_API_KEY` (see above)
- Any future third-party API keys (Razorpay, payment gateways, etc.)
- `SESSION_SECRET` if/when sessions are added

## Local dev guidance

For local dev, `backend/.env` is fine. It must be:

- Listed in `.gitignore` once you have a real `JWT_SECRET` (currently the
  committed value is the placeholder, so it has not been ignored yet — add
  the real `.env` to `.gitignore` before your first commit with a real
  secret).
- Never copied to staging or production.

## Reporting a secret leak

If you discover a real secret (not the placeholder) has been committed:

1. Revoke / rotate the secret immediately.
2. Audit access logs for unauthorized use.
3. Open a private security note, not a public issue.
