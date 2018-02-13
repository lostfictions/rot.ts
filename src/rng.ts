/**
 * This code is an implementation of Alea algorithm; (C) 2010 Johannes Baagøe.
 * Alea is licensed according to the http://en.wikipedia.org/wiki/MIT_License.
 */
export class RNG {
  // FIXME: prettier-ignore statements needed until it supports ts 2.7

  // prettier-ignore
  private _seed!: number;
  // prettier-ignore
  private _s0!: number;
  // prettier-ignore
  private _s1!: number;
  // prettier-ignore
  private _s2!: number;
  // prettier-ignore
  private _c!: number;

  private _frac = 2.3283064365386963e-10; /* 2^-32 */

  constructor() {
    this.setSeed(Date.now());
  }

  getSeed(): number {
    return this._seed;
  }

  /**
   * Seed the number generator
   */
  setSeed(seed: number): void {
    let s = seed < 1 ? 1 / seed : seed;

    this._seed = s;
    this._s0 = (s >>> 0) * this._frac;

    s = (s * 69069 + 1) >>> 0;
    this._s1 = s * this._frac;

    s = (s * 69069 + 1) >>> 0;
    this._s2 = s * this._frac;

    this._c = 1;
  }

  /**
   * Pseudorandom value [0,1), uniformly distributed
   */
  getUniform(): number {
    const t = this._s0 * 2091639 + this._c * this._frac;
    this._s0 = this._s1;
    this._s1 = this._s2;
    this._c = t | 0;
    this._s2 = t - this._c;
    return this._s2;
  }

  /**
   * @param lowerBound The lower end of the range to return a value from, inclusive
   * @param upperBound The upper end of the range to return a value from, inclusive
   * @returns Pseudorandom value [lowerBound, upperBound], using RNG.getUniform() to distribute the value
   */
  getUniformInt(lowerBound: number, upperBound: number): number {
    const max = Math.max(lowerBound, upperBound);
    const min = Math.min(lowerBound, upperBound);
    return Math.floor(this.getUniform() * (max - min + 1)) + min;
  }

  /**
   * @param mean Mean value
   * @param stddev Standard deviation. ~95% of the absolute values will be lower than 2*stddev.
   * @returns A normally distributed pseudorandom value
   */
  getNormal(mean = 0, stddev = 1): number {
    let u: number;
    let v: number;
    let r: number;
    do {
      u = 2 * this.getUniform() - 1;
      v = 2 * this.getUniform() - 1;
      r = u * u + v * v;
    } while (r > 1 || r === 0);

    const gauss = u * Math.sqrt(-2 * Math.log(r) / r);
    return (mean || 0) + gauss * (stddev || 1);
  }

  /**
   * @returns Pseudorandom value [1,100] inclusive, uniformly distributed
   */
  getPercentage(): number {
    return 1 + Math.floor(this.getUniform() * 100);
  }

  /**
   * @param data key=whatever, value=weight (relative probability)
   * @returns whatever
   */
  getWeightedValue<T extends { [key: string]: number }, K extends keyof T>(
    data: T
  ): K {
    const entries = Object.entries(data);

    let total = 0;
    for (const [, weight] of entries) {
      total += weight;
    }

    const random = this.getUniform() * total;

    let part = 0;
    for (const [key, weight] of entries) {
      part += weight;
      if (random < part) {
        return key as K;
      }
    }

    // If by some floating-point annoyance we have
    // random >= total, just return the last id.
    return entries[entries.length][0] as K;
  }

  /**
   * Get RNG state. Useful for storing the state and re-setting it via setState.
   * @returns Internal state
   */
  getState(): [number, number, number, number] {
    return [this._s0, this._s1, this._s2, this._c];
  }

  /**
   * Set a previously retrieved state.
   */
  setState(state: [number, number, number, number]): void {
    this._s0 = state[0];
    this._s1 = state[1];
    this._s2 = state[2];
    this._c = state[3];
  }

  /**
   * Returns a cloned RNG
   */
  clone(): RNG {
    const clone = new RNG();
    clone.setSeed(this.getSeed());
    clone.setState(this.getState());
    return clone;
  }
}

export const defaultRNG = new RNG();
