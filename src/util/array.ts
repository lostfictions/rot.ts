import { defaultRNG } from "../rng";

/**
 * Return a random item in an array.
 * @returns A randomly picked item, or null if the array's length is 0
 */
export function random<T>(arr: T[]): T | null {
  if (!arr.length) {
    return null;
  }
  return arr[Math.floor(defaultRNG.getUniform() * arr.length)];
}

/**
 * Shuffle an array
 * @returns New array with randomized items
 */
export function randomize<T>(arr: T[]): T[] {
  const result: T[] = [];
  if (arr.length === 0) return result;
  const clone = arr.slice();
  while (clone.length) {
    const index = clone.indexOf(random(clone)!);
    result.push(clone.splice(index, 1)[0]);
  }
  return result;
}
