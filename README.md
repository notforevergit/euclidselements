# Straightedge

A straightedge-and-compass construction game for ages 8–12, built on Euclid's
*Elements*, Book I — and the vehicle for learning Next.js properly.

The toolbar is Euclid's postulates. Draw a line between two points, extend a
line, draw a circle. That is the whole tool set, and it means a player
physically cannot do anything Euclid did not permit: no numbered ruler, no
protractor, no dragging a point until the triangle looks right.

## Layout

```
apps/
  web/          the game            (port 3000)
  portfolio/    the personal site   (port 3001)
packages/
  geometry/     the engine — pure TypeScript, no React, no DOM
  ui/           design tokens (Byrne's 1847 palette) + shared primitives
  content/      proposition definitions, goals, hint trees
```

Workspace packages ship TypeScript source rather than a build. Next compiles
them through `transpilePackages`, so there is no build step in `packages/*` and
no stale `dist/` to get out of sync.

## Running it

```bash
npm install          # once
npm run dev          # both apps
npm run verify       # typecheck · lint · test · build — what CI runs
```

Individual pieces:

```bash
npm run test --workspace=@straightedge/geometry
npm run dev  --workspace=@straightedge/web
npm run e2e  --workspace=@straightedge/web     # Cypress, needs the dev server
```

## The one decision everything rests on

A point is **a record of how it was constructed**, never a coordinate pair.
See `packages/geometry/src/types.ts`. Coordinates are derived by `evaluate`;
they are never authored. Three things follow:

1. **A child cannot cheat.** "Is this equilateral?" is answered from
   provenance, not by measuring pixels. There is a test for exactly this —
   `prop1.test.ts`, "rejects a triangle whose apex was never constructed" —
   which places an apex at the correct coordinate to nine decimal places and
   still fails, because no postulate put it there.
2. **Undo, redo and replay are one feature.** The construction is an ordered
   list of steps; replay is re-evaluating a prefix.
3. **Proof-citation checking reuses the same graph** when the theorem levels
   arrive in Phase 5.

The other standing decision: the board is **SVG, not Canvas**. A level holds
dozens of elements, not thousands, and SVG gives hit-testing, focus, ARIA and
CSS transitions for free. Revisit only if a level passes ~500 elements.

## What is scaffolded and what is yours

Written for you as reference implementations:

- the engine's types, all three intersection routines, and the branch-stability
  rule that stops figures flipping inside out mid-drag
- `evaluate` in its naive form, and Proposition 1's goal predicate
- the test harness — 25 cases across `intersect.test.ts` and `prop1.test.ts`
- the whole toolchain: Turborepo, Next App Router, Tailwind v4, Jest + RTL,
  Cypress, ESLint, GitHub Actions

Left for you, marked `PHASE n — Carlos:` in the source:

- `extend` (Postulate 2) — `evaluate.ts`
- memoised re-evaluation for constrained dragging — `evaluate.ts`
- goal predicates for Propositions 2, 3, 9, 10 — `goals.ts`
- the board, the tools, the routes, and everything after

Search the repo for `PHASE` to find them all.

## Constraints that are not preferences

Written down because they are the first things a deadline erodes.

- **No account, no login, no personal data.** Progress lives in
  `localStorage`. The app is COPPA-safe by construction rather than by policy.
- **No timers, no lives, no streaks.** Nothing punishes a child for putting the
  iPad down.
- **No dead ends.** Undo is always available and always one tap.
- **Touch first**, 44px minimum targets (`--spacing-touch`).
- **Keyboard and screen-reader paths are first-class.** Every construction step
  announced through an ARIA live region.
