import { EPSILON } from './epsilon';
import type { Construction, Figure, ObjId } from './types';
import type { Vec2 } from './vec';
import { dist } from './vec';

/** A level is complete when its goal holds. */
export type Goal = (figure: Figure, construction: Construction) => boolean;

/** Snap tolerance for goal checking: generous next to EPSILON, tight next to a pixel. */
const GOAL_TOLERANCE = 1e-6;

function samePoint(a: Vec2, b: Vec2): boolean {
  return dist(a, b) <= GOAL_TOLERANCE;
}

/** Does the figure contain a drawn segment joining these two points? */
export function hasSegment(figure: Figure, p: Vec2, q: Vec2): boolean {
  for (const seg of figure.segments.values()) {
    if (
      (samePoint(seg.a, p) && samePoint(seg.b, q)) ||
      (samePoint(seg.a, q) && samePoint(seg.b, p))
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Book I, Proposition 1 — the reference goal predicate.
 *
 * "To construct an equilateral triangle on a given finite straight line."
 *
 * Note what is NOT being checked: nothing measures whether the drawing looks
 * right. Every point in `figure` arrived there by way of a PointRef, so a
 * point can only exist if a postulate put it there. An apex dragged into
 * roughly the right place is not in the figure at all, and so cannot pass.
 */
export function equilateralOn(aId: ObjId, bId: ObjId): Goal {
  return (figure) => {
    const a = figure.points.get(`given:${aId}`);
    const b = figure.points.get(`given:${bId}`);
    if (!a || !b) return false;

    const base = dist(a, b);
    if (base <= EPSILON) return false;
    if (!hasSegment(figure, a, b)) return false;

    for (const c of figure.points.values()) {
      if (samePoint(c, a) || samePoint(c, b)) continue;
      if (Math.abs(dist(a, c) - base) > GOAL_TOLERANCE) continue;
      if (Math.abs(dist(b, c) - base) > GOAL_TOLERANCE) continue;
      if (hasSegment(figure, a, c) && hasSegment(figure, b, c)) return true;
    }
    return false;
  };
}
