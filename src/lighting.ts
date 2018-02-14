import { FOV } from "./fov/fov";
import { Color } from "./color";

export interface LightingOptions {
  /**
   * Number of passes. 1 equals to simple FOV of all light sources, > 1 means a
   * *highly simplified* radiosity - like algorithm.
   */
  passes: number;

  /**
   * Cells with emissivity > threshold will be treated as light source in the
   * next pass.
   */
  emissionThreshold: number;

  /**
   * Max light range.
   */
  range: number;
}

/**
 * A callback to retrieve cell reflectivity, in the range (0..1)
 */
export type ReflectivityCallback = (x: number, y: number) => number;

export type LightingCallback = (
  x: number,
  y: number,
  color: [number, number, number]
) => void;

interface LightingMap {
  [position: string]: [number, number, number];
}

/**
 * Lighting computation, based on a traditional FOV for multiple light sources and multiple passes.
 */
export class Lighting {
  private readonly _reflectivityCallback: ReflectivityCallback;
  private _options: LightingOptions;

  private _fov: FOV | null = null;

  private _lights: LightingMap = {};
  private _reflectivityCache: { [pos: string]: number } = {};
  private _fovCache: { [pos: string]: { [pos: string]: number } } = {};

  /**
   * @param reflectivityCallback Callback to retrieve cell reflectivity (0..1)
   */
  constructor(
    reflectivityCallback: ReflectivityCallback,
    options?: Partial<LightingOptions>
  ) {
    this._reflectivityCallback = reflectivityCallback;
    this._options = {
      passes: 1,
      emissionThreshold: 100,
      range: 10,
      ...options
    };
  }

  /**
   * Adjust options at runtime
   */
  setOptions(options: Partial<LightingOptions>): this {
    this._options = { ...this._options, ...options };
    if (options.range) {
      this.reset();
    }
    return this;
  }

  /**
   * Set the used Field-Of-View algo
   */
  setFOV(fov: FOV): this {
    this._fov = fov;
    this._fovCache = {};
    return this;
  }

  /**
   * Set (or remove) a light source
   */
  setLight(
    x: number,
    y: number,
    color?: string | [number, number, number]
  ): void {
    const key = `${x},${y}`;

    if (color) {
      let col: [number, number, number];
      if (Array.isArray(color)) {
        col = color;
      } else {
        const c = Color.fromString(color);
        col = [c.r, c.g, c.b];
      }
      this._lights[key] = col;
    } else {
      delete this._lights[key];
    }
  }

  /**
   * Remove all light sources
   */
  clearLights(): void {
    this._lights = {};
  }

  /**
   * Reset the pre-computed topology values. Call whenever the underlying map changes its light-passability.
   */
  reset(): this {
    this._reflectivityCache = {};
    this._fovCache = {};

    return this;
  }

  /**
   * Compute the lighting
   * @param lightingCallback Will be called with (x, y, color) for every lit cell
   */
  compute(lightingCallback: LightingCallback): this {
    let emittingCells: LightingMap = {};

    for (const [pos, light] of Object.entries(this._lights)) {
      /* prepare emitters for first pass */
      emittingCells[pos] = light;
    }

    const doneCells = new Set<string>();
    const litCells: LightingMap = {};
    for (let i = 0; i < this._options.passes; i++) {
      /* main loop */
      this._emitLight(emittingCells, litCells, doneCells);
      if (i + 1 === this._options.passes) {
        continue;
      } /* not for the last pass */
      emittingCells = this._computeEmitters(litCells, doneCells);
    }

    for (const [pos, color] of Object.entries(litCells)) {
      /* let the user know what and how is lit */
      const [x, y] = pos.split(",").map(parseInt);
      lightingCallback(x, y, color);
    }

    return this;
  }

  /**
   * Compute one iteration from all emitting cells
   * @param emittingCells These emit light
   * @param litCells Add projected light to these
   * @param doneCells These already emitted, forbid them from further calculations
   */
  private _emitLight(
    emittingCells: LightingMap,
    litCells: LightingMap,
    doneCells: Set<string>
  ): void {
    for (const [key, value] of Object.entries(emittingCells)) {
      const [x, y] = key.split(",").map(parseInt);
      this._emitLightFromCell(x, y, value, litCells);
      doneCells.add(key);
    }
  }

  /**
   * Prepare a list of emitters for next pass
   * @param litCells
   * @param doneCells
   */
  private _computeEmitters(
    litCells: LightingMap,
    doneCells: Set<string>
  ): LightingMap {
    const result: LightingMap = {};

    for (const [pos, color] of Object.entries(litCells)) {
      if (doneCells.has(pos)) {
        continue;
      } /* already emitted */

      let reflectivity: number;
      if (pos in this._reflectivityCache) {
        reflectivity = this._reflectivityCache[pos];
      } else {
        const [x, y] = pos.split(",").map(parseInt);
        reflectivity = this._reflectivityCallback(x, y);
        this._reflectivityCache[pos] = reflectivity;
      }

      if (reflectivity === 0) {
        continue;
      } /* will not reflect at all */

      /* compute emission color */
      const emission = [];
      let intensity = 0;
      for (let i = 0; i < 3; i++) {
        const part = Math.round(color[i] * reflectivity);
        emission[i] = part;
        intensity += part;
      }
      if (intensity > this._options.emissionThreshold) {
        result[pos] = emission as [number, number, number];
      }
    }

    return result;
  }

  /**
   * Compute one iteration from one cell
   * @param x
   * @param y
   * @param color
   * @param litCells Cell data to be updated
   */
  private _emitLightFromCell(
    x: number,
    y: number,
    color: [number, number, number],
    litCells: LightingMap
  ): void {
    const key = `${x},${y}`;

    let fov: { [pos: string]: number };
    if (key in this._fovCache) {
      fov = this._fovCache[key];
    } else {
      fov = this._updateFOV(x, y);
    }

    for (const [pos, formFactor] of Object.entries(fov)) {
      let result: [number, number, number];
      if (pos in litCells) {
        /* already lit */
        result = litCells[pos];
      } else {
        /* newly lit */
        result = [0, 0, 0];
        litCells[pos] = result;
      }

      for (let i = 0; i < 3; i++) {
        /* add light color */
        result[i] += Math.round(color[i] * formFactor);
      }
    }
  }

  /**
   * Compute FOV ("form factor") for a potential light source at [x,y]
   */
  private _updateFOV(x: number, y: number): { [pos: string]: number } {
    const key1 = `${x},${y}`;
    const cache: { [pos: string]: number } = {};
    this._fovCache[key1] = cache;

    const range = this._options.range;

    const cb = (xx: number, yy: number, r: number, vis: number) => {
      const key2 = `${xx},${yy}`;
      const formFactor = vis * (1 - r / range);
      if (formFactor === 0) {
        return;
      }
      cache[key2] = formFactor;
    };

    this._fov!.compute(x, y, range, cb);

    return cache;
  }
}
