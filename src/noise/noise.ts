/**
 * Base noise generator
 */
export interface Noise {
  get(x: number, y: number): number;
}
