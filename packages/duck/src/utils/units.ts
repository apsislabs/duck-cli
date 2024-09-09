export const PIXELS_PER_INCH = 300;
export const POINTS_PER_INCH = 72;

export const insToPts = (s: number = 0): number => s * POINTS_PER_INCH;
export const ptsToIns = (s: number = 0): number => s / POINTS_PER_INCH;
export const insToPx = (s: number = 0): number => s * PIXELS_PER_INCH;
export const pxToIns = (s: number = 0): number => s / PIXELS_PER_INCH;

export const pxToPts = (s: number = 0): number =>
  (s / PIXELS_PER_INCH) * POINTS_PER_INCH;

export const ptsToPx = (s: number = 0): number =>
  (s / POINTS_PER_INCH) * PIXELS_PER_INCH;
