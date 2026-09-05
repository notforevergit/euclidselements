import { describe, expect, it } from '@jest/globals';
import type { Construction } from '../types';
import { evaluate, ConstructionError } from '../evaluate';
import { equilateralOn } from '../goals';
import { vec } from '../vec';

/**
 * Book I, Proposition 1, exactly as Euclid gives it:
 *
 *   Let AB be the given finite straight line.
 *   Describe the circle BCD with centre A and radius AB.  [Post. 3]
 *   Describe the circle ACE with centre B and radius BA.  [Post. 3]
 *   From the point C join CA and CB.                       [Post. 1]
 *
 * Nothing here places a point. Every point is a consequence.
 */
const givens = [
  { id: 'A', at: vec(0, 0), label: 'A' },
  { id: 'B', at: vec(100, 0), label: 'B' },
] as const;

const A = { kind: 'given', id: 'A' } as const;
const B = { kind: 'given', id: 'B' } as const;
const C = { kind: 'meet', of: ['cA', 'cB'], branch: 0 } as const;

const complete: Construction = {
  givens,
  steps: [
    { tool: 'line', id: 'AB', from: A, to: B },
    { tool: 'circle', id: 'cA', center: A, through: B },
    { tool: 'circle', id: 'cB', center: B, through: A },
    { tool: 'line', id: 'AC', from: A, to: C },
    { tool: 'line', id: 'BC', from: B, to: C },
  ],
};

const goal = equilateralOn('A', 'B');

describe('Proposition I.1', () => {
  it('places the apex where the two circles cross', () => {
    const figure = evaluate(complete);
    const apex = figure.points.get('meet:cAxcB#0');
    expect(apex).toBeDefined();
    expect(apex!.x).toBeCloseTo(50, 9);
    expect(apex!.y).toBeCloseTo(Math.sqrt(100 * 100 - 50 * 50), 9);
  });

  it('gives all three sides the same length', () => {
    const figure = evaluate(complete);
    const lengths = [...figure.segments.values()].map((s) =>
      Math.hypot(s.a.x - s.b.x, s.a.y - s.b.y),
    );
    expect(lengths).toHaveLength(3);
    for (const l of lengths) expect(l).toBeCloseTo(100, 9);
  });

  it('satisfies the goal', () => {
    expect(goal(evaluate(complete), complete)).toBe(true);
  });

  it('works on a base of any length or orientation', () => {
    const tilted: Construction = {
      givens: [
        { id: 'A', at: vec(-37.5, 12.25), label: 'A' },
        { id: 'B', at: vec(211.75, -88.5), label: 'B' },
      ],
      steps: complete.steps,
    };
    expect(goal(evaluate(tilted), tilted)).toBe(true);
  });

  it('is satisfied by the other branch too — either apex is a valid answer', () => {
    const below: Construction = {
      givens,
      steps: [
        { tool: 'line', id: 'AB', from: A, to: B },
        { tool: 'circle', id: 'cA', center: A, through: B },
        { tool: 'circle', id: 'cB', center: B, through: A },
        { tool: 'line', id: 'AC', from: A, to: { kind: 'meet', of: ['cA', 'cB'], branch: 1 } },
        { tool: 'line', id: 'BC', from: B, to: { kind: 'meet', of: ['cA', 'cB'], branch: 1 } },
      ],
    };
    expect(goal(evaluate(below), below)).toBe(true);
  });
});

describe('Proposition I.1 — what must NOT pass', () => {
  it('rejects an unfinished construction', () => {
    const unfinished: Construction = { givens, steps: complete.steps.slice(0, 3) };
    expect(goal(evaluate(unfinished), unfinished)).toBe(false);
  });

  it('rejects a triangle whose apex was never constructed', () => {
    // The apex is asserted as a third "given" — the shape a player would get
    // if the board let them drop a point by eye. It is the right coordinate
    // to nine decimal places, and it still fails, because no postulate put
    // it there and so no segment can legitimately reach it.
    const eyeballed: Construction = {
      givens: [...givens, { id: 'X', at: vec(50, 86.602540378), label: 'X' }],
      steps: [{ tool: 'line', id: 'AB', from: A, to: B }],
    };
    expect(goal(evaluate(eyeballed), eyeballed)).toBe(false);
  });

  it('rejects a construction missing the base segment', () => {
    const noBase: Construction = { givens, steps: complete.steps.slice(1) };
    expect(goal(evaluate(noBase), noBase)).toBe(false);
  });

  it('reports a clear error when a step names an object that does not exist', () => {
    const broken: Construction = {
      givens,
      steps: [{ tool: 'line', id: 'AC', from: A, to: { kind: 'meet', of: ['nope', 'cB'], branch: 0 } }],
    };
    expect(() => evaluate(broken)).toThrow(ConstructionError);
  });

  it('still reports extend as unimplemented — Phase 1', () => {
    const usesExtend: Construction = {
      givens,
      steps: [
        { tool: 'line', id: 'AB', from: A, to: B },
        { tool: 'extend', id: 'ABx', segment: 'AB', beyond: B },
      ],
    };
    expect(() => evaluate(usesExtend)).toThrow(/not implemented/i);
  });
});
