# Running it

```bash
npm install
npm run verify     # typecheck · lint · test · build — the same four steps CI runs
npm run dev        # game :3000 · portfolio :3001
```

`verify` is 15 tasks across five workspaces. It went green on 2026-09-06.

## Versions

The scaffold was authored offline against Next 15 ranges. `npm audit fix --force`
then moved the repo to Next 16, which is where it now lives:

| | version |
|---|---|
| Next | 16.3.4 |
| React | 19.2.8 |
| Turbo | 2.10.12 |
| TypeScript | 5.9.3 |
| Tailwind | 4.3.3 |
| Jest | 30.5.1 |
| Cypress | 16.0.0 |

Four things that upgrade required, all now done:

1. Turbo 2.10 refuses to resolve a workspace without a declared package
   manager — hence `"packageManager": "npm@10.9.8"` in the root manifest.
2. `next lint` was **removed** in Next 16. Both apps call `eslint .` directly.
3. `audit fix --force` added Cypress to `apps/portfolio` as a *production*
   dependency. Removed — that app has no tests.
4. `eslint-config-next` is deliberately held at 15.5.25, which is what is
   installed and what works with the FlatCompat setup. Bumping it to 16 is a
   follow-up, not a blocker.

A note on `npm audit fix --force`: it crossed two major versions unasked and
injected a wrong dependency, to patch vulnerabilities in dev-only tooling that
never reaches a user. No harm here — Next 16 is the better place to be — but
read what `audit` reports before letting `--force` act on it.

## Deploying — the rest of Phase 0

Two Vercel projects from the same repository:

| | Root Directory | Build command |
|---|---|---|
| game | `apps/web` | `cd ../.. && npm run build --workspace=@straightedge/web` |
| portfolio | `apps/portfolio` | `cd ../.. && npm run build --workspace=@straightedge/portfolio` |

Install command for both: `npm install`, run from the repository root. Vercel
detects Turborepo on import and usually offers the right settings — take them
if it does.

Phase 0 is done when a push to `main` deploys, **and a deliberately failing
test blocks that deploy**. Prove the second half: break an assertion in
`packages/geometry/src/__tests__/prop1.test.ts`, push it, watch CI go red, then
revert. A green pipeline you have never seen go red tells you nothing.

## Known local wrinkle

Git leaves stale `.git/*.lock` files when run through the Claude desktop folder
mount, which cannot unlink. If git ever reports "Unable to create
'.git/index.lock': File exists" and no git process is running, delete that file
and the ones under `.git/_stale/`. From your own terminal `rm` works normally.
