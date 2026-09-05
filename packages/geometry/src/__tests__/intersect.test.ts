import { describe, expect, it } from '@jest/globals';
import { circleCircle, lineCircle, lineLine } from '../intersect';
import { vec } from '../vec';

describe('lineLine', () => {
  it('finds the crossing of two infinite lines', () => {
    const p = lineLine(vec(0, 0), vec(10, 0), vec(5, -5), vec(5, 5));
    expect(p).not.toBeNull();
    expect(p!.x).toBeCloseTo(5, 9);
    expect(p!.y).toBeCloseTo(0, 9);
  });

  it('extends beyond the given endpoints, as infinite lines do', () => {
    const p = lineLine(vec(0, 0), vec(1, 0), vec(50, -1), vec(50, 1));
    expect(p!.x).toBeCloseTo(50, 9);
  });

  it('returns null for parallel lines', () => {
    expect(lineLine(vec(0, 0), vec(10, 0), vec(0, 3), vec(10, 3))).toBeNull();
  });

  it('returns null for coincident lines', () => {
    expect(lineLine(vec(0, 0), vec(10, 0), vec(2, 0), vec(7, 0))).toBeNull();
  });
});

describe('circleCircle', () => {
  const A = vec(0, 0);
  const B = vec(100, 0);

  it('finds both crossings of two equal overlapping circles', () => {
    const pair = circleCircle(A, 100, B, 100);
    expect(pair).not.toBeNull();
    const [p0, p1] = pair!;
    expect(p0.x).toBeCloseTo(50, 9);
    expect(p1.x).toBeCloseTo(50, 9);
    expect(p0.y).toBeCloseTo(Math.sqrt(100 * 100 - 50 * 50), 9);
    expect(p1.y).toBeCloseTo(-Math.sqrt(100 * 100 - 50 * 50), 9);
  });

  it('puts branch 0 on the +90-degree side of centre-to-centre', () => {
    // Rotating the whole configuration must rotate the branches with it,
    // never swap them.
    const pair = circleCircle(vec(0, 0), 100, vec(0, 100), 100);
    const [p0] = pair!;
    // u points +y, so n = u rotated +90 points -x.
    expect(p0.x).toBeLessThan(0);
  });

  it('keeps branch 0 on the same side through continuous motion', () => {
    // Walk B around A and assert the branch never flips. This is the test
    // that catches the classic "figure turns inside out mid-drag" bug.
    let previous: number | null = null;
    for (let i = 0; i <= 40; i += 1) {
      const t = (i / 40) * Math.PI * 1.5;
      const b = vec(100 * Math.cos(t), 100 * Math.sin(t));
      const pair = circleCircle(vec(0, 0), 100, b, 100);
      expect(pair).not.toBeNull();
      const [p0] = pair!;
      // Cross product of (b - a) with (p0 - a) must keep a constant sign.
      const cross = b.x * p0.y - b.y * p0.x;
      if (previous !== null) expect(Math.sign(cross)).toBe(Math.sign(previous));
      previous = cross;
    }
  });

  it('swapping the arguments swaps which side branch 0 lands on', () => {
    const forward = circleCircle(A, 100, B, 100)!;
    const backward = circleCircle(B, 100, A, 100)!;
    expect(Math.sign(forward[0].y)).toBe(-Math.sign(backward[0].y));
  });

  it('returns null when the circles are too far apart', () => {
    expect(circleCircle(A, 10, B, 10)).toBeNull();
  });

  it('returns null when one circle is nested inside the other', () => {
    expect(circleCircle(A, 100, vec(5, 0), 10)).toBeNull();
  });

  it('returns null for concentric circles', () => {
    expect(circleCircle(A, 100, A, 100)).toBeNull();
  });

  it('handles tangency without producing NaN', () => {
    const pair = circleCircle(A, 50, B, 50);
    expect(pair).not.toBeNull();
    const [p0, p1] = pair!;
    expect(Number.isNaN(p0.y)).toBe(false);
    expect(p0.x).toBeCloseTo(50, 6);
    expect(p1.x).toBeCloseTo(50, 6);
  });
});

describe('lineCircle', () => {
  it('finds both crossings, ordered along the line', () => {
    const pair = lineCircle(vec(-200, 0), vec(200, 0), vec(0, 0), 100);
    expect(pair).not.toBeNull();
    const [p0, p1] = pair!;
    expect(p0.x).toBeCloseTo(-100, 9);
    expect(p1.x).toBeCloseTo(100, 9);
  });

  it('returns null when the line misses the circle', () => {
    expect(lineCircle(vec(-200, 500), vec(200, 500), vec(0, 0), 100)).toBeNull();
  });
});
