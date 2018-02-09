/**
 * Maps from a string in the format "x,y" to a DrawData tuple.
 */
export interface DrawMap {
  [pos: string]: DrawData;
}

/**
 * Data for drawing at a given position. A tuple containing, in order:
 *
 * - the x-coordinate
 * - the y-coordinate
 * - the character to draw, or an array of overlapping characters to draw
 * - the foreground color as a hex string
 * - the background color as a hex string
 *
 */
export type DrawData = [number, number, string | string[], string, string];
