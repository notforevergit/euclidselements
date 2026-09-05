/**
 * One tolerance, defined once.
 *
 * The engine works in a normalized model space where the board is roughly
 * 1000 units across, so 1e-9 is far below anything a construction can
 * meaningfully distinguish, and far above accumulated float error from the
 * handful of operations any single point passes through.
 *
 * Screen-pixel tolerances (snap radius, hit targets) are a UI concern and are
 * converted to model units at the board boundary — never here.
 */
export const EPSILON = 1e-9;

export function approx(a: number, b: number, eps: number = EPSILON): boolean {
  return Math.abs(a - b) <= eps;
}
