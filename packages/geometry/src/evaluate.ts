import type { Construction, Figure, Given, ObjId, PointRef } from './types';
import { pointKey } from './types';
import type { Vec2 } from './vec';
import { dist } from './vec';
import { circleCircle, lineCircle, lineLine } from './intersect';

export class ConstructionError extends Error {
  override name = 'ConstructionError';
}

interface Segment { readonly a: Vec2; readonly b: Vec2 }
interface Circle { readonly center: Vec2; readonly radius: number }

/**
 * Turn a construction into drawable geometry.
 *
 * Steps are evaluated in order, so any object a step refers to is already
 * defined by the time we reach it. That ordering is exactly what makes undo
 * (`steps.slice(0, n)`) and replay free.
 *
 * PHASE 1 — Carlos: this is the naive version. It re-derives everything from
 * scratch on every call, which is correct but O(n) per drag frame. When you
 * add constrained dragging, memoise per-step results keyed on the ids they
 * depend on, and invalidate only the subtree below the point that moved.
 */
export function evaluate(construction: Construction): Figure {
  const points = new Map<string, Vec2>();
  const segments = new Map<ObjId, Segment>();
  const circles = new Map<ObjId, Circle>();

  const givens = new Map<ObjId, Given>();
  for (const g of construction.givens) {
    givens.set(g.id, g);
    points.set(pointKey({ kind: 'given', id: g.id }), g.at);
  }

  function meet(ia: ObjId, ib: ObjId, branch: 0 | 1): Vec2 {
    const segA = segments.get(ia);
    const cirA = circles.get(ia);
    const segB = segments.get(ib);
    const cirB = circles.get(ib);

    if (!segA && !cirA) throw new ConstructionError(`no such object: ${ia}`);
    if (!segB && !cirB) throw new ConstructionError(`no such object: ${ib}`);

    if (segA && segB) {
      const p = lineLine(segA.a, segA.b, segB.a, segB.b);
      if (!p) throw new ConstructionError(`${ia} and ${ib} are parallel`);
      return p;
    }

    if (cirA && cirB) {
      const pair = circleCircle(cirA.center, cirA.radius, cirB.center, cirB.radius);
      if (!pair) throw new ConstructionError(`${ia} and ${ib} do not cross`);
      return pair[branch];
    }

    const seg = (segA ?? segB) as Segment;
    const cir = (cirA ?? cirB) as Circle;
    const pair = lineCircle(seg.a, seg.b, cir.center, cir.radius);
    if (!pair) throw new ConstructionError(`${ia} and ${ib} do not cross`);
    return pair[branch];
  }

  function resolve(ref: PointRef): Vec2 {
    const key = pointKey(ref);
    const cached = points.get(key);
    if (cached !== undefined) return cached;

    if (ref.kind === 'given') {
      throw new ConstructionError(`no such given point: ${ref.id}`);
    }

    const p = meet(ref.of[0], ref.of[1], ref.branch);
    points.set(key, p);
    return p;
  }

  for (const step of construction.steps) {
    switch (step.tool) {
      case 'line': {
        segments.set(step.id, { a: resolve(step.from), b: resolve(step.to) });
        break;
      }
      case 'circle': {
        const center = resolve(step.center);
        const through = resolve(step.through);
        circles.set(step.id, { center, radius: dist(center, through) });
        break;
      }
      case 'extend': {
        // PHASE 1 — Carlos: Postulate 2.
        // Produce the segment beyond one endpoint. Decide first whether an
        // extended line is a new object or a mutation of the original; the
        // rest of the engine is much simpler if it is a NEW object that
        // records its parent, because then undo still just pops a step.
        throw new ConstructionError('extend (Postulate 2) is not implemented yet');
      }
    }
  }

  return { points, segments, circles };
}
