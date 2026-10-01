/**
 * Cookaloo typography tokens.
 * Maps to font families loaded via expo-font in the root layout.
 */

export const Typography = {
  brand: {
    fontFamily: 'BricolageGrotesque',
    fontWeight: '800' as const,
    letterSpacing: -0.045,
  },
  heading: {
    fontFamily: 'Newsreader',
    fontWeight: '500' as const,
  },
  body: {
    fontFamily: 'Figtree',
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontFamily: 'Figtree',
    fontWeight: '500' as const,
  },
  bodySemiBold: {
    fontFamily: 'Figtree',
    fontWeight: '600' as const,
  },
  bodyBold: {
    fontFamily: 'Figtree',
    fontWeight: '700' as const,
  },
} as const;
