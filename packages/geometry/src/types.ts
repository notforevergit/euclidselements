import type { Vec2 } from './vec';

export type ObjId = string;

/**
 * A point is a RECORD OF HOW IT WAS CONSTRUCTED, never a bare coordinate.
 *
 * This is the load-bearing decision of the whole engine. Coordinates are
 * derived from this record by `evaluate`; they are never authored. Because of
 * it:
 *
 *   1. A child cannot cheat. "Is this equilateral?" is answered from
 *      provenance, not by measuring pixels. A triangle that merely LOOKS
 *      equilateral fails, correctly.
 *   2. Undo, redo and replay are the same feature — the construction is an
 *      ordered list, and replay is re-evaluating a prefix of it.
 *   3. Proof-citation checking (Phase 5) walks this same dependency graph.
 */
export type PointRef =
  /** A point handed to the player by the level. */
  | { readonly kind: 'given'; readonly id: ObjId }
  /**
   * Where two constructed objects cross. `branch` selects which of the two
   * crossings; see `circleCircle` for the rule that keeps that choice stable
   * as the figure is dragged.
   */
  | { readonly kind: 'meet'; readonly of: readonly [ObjId, ObjId]; readonly branch: 0 | 1 };

/** The three tools. One per usable postulate — the toolbar IS Euclid's postulates. */
export type Step =
  /** Postulate 1: to draw a straight line from any point to any point. */
  | { readonly tool: 'line'; readonly id: ObjId; readonly from: PointRef; readonly to: PointRef }
  /** Postulate 3: to describe a circle with any centre and radius. */
  | { readonly tool: 'circle'; readonly id: ObjId; readonly center: PointRef; readonly through: PointRef }
  /**
   * Postulate 2: to produce a finite straight line continuously in a straight line.
   * PHASE 1 — Carlos implements this. See evaluate.ts.
   */
  | { readonly tool: 'extend'; readonly id: ObjId; readonly segment: ObjId; readonly beyond: PointRef };

export interface Given {
  readonly id: ObjId;
  readonly at: Vec2;
  readonly label: string;
}

export interface Construction {
  readonly givens: readonly Given[];
  readonly steps: readonly Step[];
}

/** A construction evaluated into drawable geometry. */
export interface Figure {
  readonly points: ReadonlyMap<string, Vec2>;
  readonly segments: ReadonlyMap<ObjId, { readonly a: Vec2; readonly b: Vec2 }>;
  readonly circles: ReadonlyMap<ObjId, { readonly center: Vec2; readonly radius: number }>;
}

/** Stable string key for a PointRef, so equal refs resolve to one point. */
export function pointKey(ref: PointRef): string {
  return ref.kind === 'given'
    ? `given:${ref.id}`
    : `meet:${ref.of[0]}x${ref.of[1]}#${ref.branch}`;
}
