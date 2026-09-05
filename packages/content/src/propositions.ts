/**
 * Euclid, Elements, Book I — Propositions 1 to 10.
 *
 * Statements are Heath's translation. `kind` is the fact that shapes the
 * whole app: five of these are CONSTRUCTIONS the child builds, and five are
 * THEOREMS, which a compass sandbox cannot "play" and which get the
 * conjecture-machine + proof-assembly treatment instead (Phase 5).
 */

export type PropositionKind = 'construction' | 'theorem';

export interface Proposition {
  /** 1-10, and the URL segment: /book-i/1 */
  readonly n: number;
  readonly kind: PropositionKind;
  /** Heath's translation, near enough. Shown to grown-ups. */
  readonly statement: string;
  /** The same thing, for an eight-year-old. Shown in the game. */
  readonly plain: string;
  /** Earlier propositions this one is allowed to lean on. */
  readonly uses: readonly number[];
}

export const PROPOSITIONS: readonly Proposition[] = [
  {
    n: 1,
    kind: 'construction',
    statement: 'To construct an equilateral triangle on a given finite straight line.',
    plain: 'Build a triangle whose three sides are all exactly the same length.',
    uses: [],
  },
  {
    n: 2,
    kind: 'construction',
    statement: 'To place a straight line equal to a given straight line with one end at a given point.',
    plain: 'Copy a line so it starts exactly where you want it to.',
    uses: [1],
  },
  {
    n: 3,
    kind: 'construction',
    statement: 'To cut off from the greater of two given unequal straight lines a straight line equal to the less.',
    plain: 'Take the shorter line and mark off exactly that much of the longer one.',
    uses: [2],
  },
  {
    n: 4,
    kind: 'theorem',
    statement:
      'If two triangles have two sides equal to two sides respectively, and have the angles contained by those sides equal, then the triangles are equal in every respect.',
    plain: 'Two sides and the corner between them: if those match, the whole triangles match.',
    uses: [],
  },
  {
    n: 5,
    kind: 'theorem',
    statement:
      'In isosceles triangles the angles at the base equal one another; and if the equal straight lines are produced further, the angles under the base equal one another.',
    plain: 'If two sides of a triangle are the same length, the two bottom corners are the same size.',
    uses: [3, 4],
  },
  {
    n: 6,
    kind: 'theorem',
    statement:
      'If in a triangle two angles equal one another, then the sides opposite the equal angles also equal one another.',
    plain: 'And it works backwards: two matching corners mean two matching sides.',
    uses: [4],
  },
  {
    n: 7,
    kind: 'theorem',
    statement:
      'Given two straight lines constructed from the ends of a straight line and meeting in a point, there cannot be constructed from the ends of the same straight line, on the same side, two other straight lines equal to the former two but meeting in a different point.',
    plain: 'Two arms of fixed lengths can only reach one place. Try to make them reach somewhere else.',
    uses: [5],
  },
  {
    n: 8,
    kind: 'theorem',
    statement:
      'If two triangles have the two sides equal to two sides respectively, and also have the base equal to the base, then the angles contained by the equal sides are also equal.',
    plain: 'If all three sides match, the triangles are the same shape — there is no other option.',
    uses: [7],
  },
  {
    n: 9,
    kind: 'construction',
    statement: 'To bisect a given rectilinear angle.',
    plain: 'Cut a corner exactly in half — without measuring it.',
    uses: [1, 3, 8],
  },
  {
    n: 10,
    kind: 'construction',
    statement: 'To bisect a given finite straight line.',
    plain: 'Find the exact middle of a line — without a ruler.',
    uses: [1, 4, 9],
  },
] as const;

export function getProposition(n: number): Proposition | undefined {
  return PROPOSITIONS.find((p) => p.n === n);
}

/** The three propositions playable at the Phase 3 ship gate. */
export const SHIPPED = [1, 2, 3] as const;
