import { FOV } from "./fov/fov";

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

export type LightingCallback = (x: number, y: number, color) => void;

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
  private _fovCache = {};

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
    this._options = {
      ...this._options,
      ...options
    };
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
   * @param {null || string || number[3]} color
   */
  setLight(x: number, y: number, color?: string | [number, number, number]) {
    const key = x + "," + y;

    if (color) {
      this._lights[key] =
        typeof color === "string" ? ROT.Color.fromString(color) : color;
    } else {
      delete this._lights[key];
    }
    return this;
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
      emittingCells[pos] = [0, 0, 0];
      ROT.Color.add_(emittingCells[pos], light);
    }

    const doneCells = new Set<string>();
    const litCells: LightingMap = {};
    for (let i = 0; i < this._options.passes; i++) {
      /* main loop */
      this._emitLight(emittingCells, litCells, doneCells);
      if (i + 1 == this._options.passes) {
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
    for (var key in emittingCells) {
      var parts = key.split(",");
      var x = parseInt(parts[0]);
      var y = parseInt(parts[1]);
      this._emitLightFromCell(x, y, emittingCells[key], litCells);
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
      for (var i = 0; i < 3; i++) {
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
    const key = x + "," + y;
    if (key in this._fovCache) {
      var fov = this._fovCache[key];
    } else {
      var fov = this._updateFOV(x, y);
    }

    for (var fovKey in fov) {
      var formFactor = fov[fovKey];

      if (fovKey in litCells) {
        /* already lit */
        var result = litCells[fovKey];
      } else {
        /* newly lit */
        var result = [0, 0, 0];
        litCells[fovKey] = result;
      }

      for (var i = 0; i < 3; i++) {
        result[i] += Math.round(color[i] * formFactor);
      } /* add light color */
    }
  }

  /**
   * Compute FOV ("form factor") for a potential light source at [x,y]
   */
  private _updateFOV(x: number, y: number) {
    var key1 = x + "," + y;
    var cache = {};
    this._fovCache[key1] = cache;
    var range = this._options.range;
    var cb = function(x, y, r, vis) {
      var key2 = x + "," + y;
      var formFactor = vis * (1 - r / range);
      if (formFactor == 0) {
        return;
      }
      cache[key2] = formFactor;
    };
    this._fov.compute(x, y, range, cb.bind(this));

    return cache;
  }
}
