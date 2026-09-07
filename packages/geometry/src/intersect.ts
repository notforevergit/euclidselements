import { EPSILON } from './epsilon';
import type { Vec2 } from './vec';
import { dist } from './vec';

/**
 * Two infinite lines through the given point pairs.
 * Returns null when parallel or coincident.
 */
export function lineLine(a1: Vec2, a2: Vec2, b1: Vec2, b2: Vec2): Vec2 | null {
  const r = { x: a2.x - a1.x, y: a2.y - a1.y };
  const s = { x: b2.x - b1.x, y: b2.y - b1.y };
  const denom = r.x * s.y - r.y * s.x;
  if (Math.abs(denom) < EPSILON) return null;
  const t = ((b1.x - a1.x) * s.y - (b1.y - a1.y) * s.x) / denom;
  return { x: a1.x + t * r.x, y: a1.y + t * r.y };
}

/**
 * The two points where circles (c1,r1) and (c2,r2) cross.
 *
 * BRANCH STABILITY RULE — this is the subtle part, and getting it wrong is
 * what makes a figure flip inside out when a child drags a point.
 *
 * Let u be the unit vector from c1 to c2, and n = u rotated +90 degrees.
 * The two solutions are base +/- h*n. We always return
 * [base + h*n, base - h*n], in that order.
 *
 * That ordering depends only on the ARGUMENT ORDER (c1 before c2), never on
 * the numeric values, so branch 0 stays branch 0 under continuous motion.
 * Callers must therefore keep the two object ids in a fixed order — which
 * `PointRef.of` does, as a tuple.
 *
 * Returns null when the circles are concentric, too far apart, or nested.
 */
export function circleCircle(
  c1: Vec2,
  r1: number,
  c2: Vec2,
  r2: number,
): readonly [Vec2, Vec2] | null {
  const d = dist(c1, c2);
  if (d < EPSILON) return null;
  if (d > r1 + r2 + EPSILON) return null;
  if (d < Math.abs(r1 - r2) - EPSILON) return null;

  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, r1 * r1 - a * a));

  const ux = (c2.x - c1.x) / d;
  const uy = (c2.y - c1.y) / d;
  const bx = c1.x + a * ux;
  const by = c1.y + a * uy;

  // n = (-uy, ux) is u rotated +90 degrees.
  // TEMPORARY: branches deliberately swapped to prove the CI gate. Revert.
  return [
    { x: bx + h * uy, y: by - h * ux },
    { x: bx - h * uy, y: by + h * ux },
  ];
}

/**
 * The two points where the infinite line through p1,p2 crosses circle (c,r).
 * Ordered by increasing parameter along p1 -> p2, which is stable for the
 * same reason as above.
 */
export function lineCircle(
  p1: Vec2,
  p2: Vec2,
  c: Vec2,
  r: number,
): readonly [Vec2, Vec2] | null {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const aa = dx * dx + dy * dy;
  if (aa < EPSILON) return null;

  const fx = p1.x - c.x;
  const fy = p1.y - c.y;
  const bb = 2 * (fx * dx + fy * dy);
  const cc = fx * fx + fy * fy - r * r;

  const disc = bb * bb - 4 * aa * cc;
  if (disc < -EPSILON) return null;

  const sq = Math.sqrt(Math.max(0, disc));
  const t0 = (-bb - sq) / (2 * aa);
  const t1 = (-bb + sq) / (2 * aa);

  return [
    { x: p1.x + t0 * dx, y: p1.y + t0 * dy },
    { x: p1.x + t1 * dx, y: p1.y + t1 * dy },
  ];
}
