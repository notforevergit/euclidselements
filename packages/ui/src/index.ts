/**
 * Shared primitives.
 *
 * Deliberately near-empty for now: components move here only once BOTH apps
 * need them. A shared package that one app uses is just an indirection.
 */

export const TOUCH_TARGET_PX = 44;

/** Byrne's inks, for canvas/SVG code that cannot read CSS custom properties. */
export const BYRNE = {
  vermilion: '#bc3128',
  ultramarine: '#1b47a8',
  ochre: '#b98a06',
  black: '#15181b',
} as const;

export type ByrneInk = keyof typeof BYRNE;
