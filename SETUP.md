# First run

This scaffold was written without a network connection, so **nothing here has
been installed or built yet**. That is the first thing to do, and it is also
Phase 0's done-when.

```bash
cd ~/Developer/Personal/resume_carlos
npm install
npm run verify
```

`verify` runs typecheck, lint, unit tests and a production build of both apps —
the same four steps CI runs.

## If something fails

Expected, and fine. The dependency versions are caret ranges written from
memory rather than resolved against the registry, so a version may not exist or
two may disagree. Paste the error and I will fix it.

The likeliest spots, in order:

1. **A version does not resolve.** `npm install <pkg>@latest --workspace=<ws>`
   and tell me what it picked.
2. **Tailwind v4.** If `@import "@straightedge/ui/styles/tokens.css"` is not
   found, the `exports` map in `packages/ui/package.json` is the thing to look
   at.
3. **`next/font`** needs network at build time to fetch the three families. It
   will work on your Mac and on Vercel; it fails in an offline build.
4. **Jest + SWC in `packages/geometry`.** If the transform complains, the
   config is six lines in `jest.config.mjs`.

## Then

```bash
npm run dev
```

- game → http://localhost:3000 (all ten propositions listed, three marked playable)
- portfolio → http://localhost:3001

## Deploying — Phase 0's real gate

Two Vercel projects from the same repository:

| | Root Directory | Build command | Install command |
|---|---|---|---|
| game | `apps/web` | `cd ../.. && npm run build --workspace=@straightedge/web` | `npm install` (repo root) |
| portfolio | `apps/portfolio` | `cd ../.. && npm run build --workspace=@straightedge/portfolio` | `npm install` (repo root) |

Vercel detects Turborepo and will usually offer the right settings on import —
take them if it does.

Phase 0 is done when a push to `main` deploys, **and a deliberately failing
test blocks that deploy**. Prove the second half; a green pipeline you have
never seen go red tells you nothing.
