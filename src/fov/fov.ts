import { DIRS } from "../util";

export interface FOVOptions {
  topology: 4 | 6 | 8;
}

export type LightPassesCallback = (x: number, y: number) => boolean;

export abstract class FOV {
  protected _lightPasses: LightPassesCallback;
  protected _options: FOVOptions;

  /**
   * @param lightPassesCallback Does the light pass through x,y?
   */
  constructor(
    lightPassesCallback: LightPassesCallback,
    options?: Partial<FOVOptions>
  ) {
    this._lightPasses = lightPassesCallback;
    this._options = {
      topology: 8,
      ...options
    };
  }

  /**
   * Compute visibility for a 360-degree circle
   * @param x
   * @param y
   * @param R Maximum visibility radius
   * @param callback
   */
  abstract compute(x: number, y: number, R: number, callback);

  /**
   * Return all neighbors in a concentric ring
   * @param cx center-x
   * @param cy center-y
   * @param r range
   */
  protected _getCircle(cx: number, cy: number, r: number): [number, number][] {
    // prettier-ignore
    let dirs!: [number, number][];
    // prettier-ignore
    let countFactor!: number;
    // prettier-ignore
    let startOffset!: [number, number];

    switch (this._options.topology) {
      case 4:
        countFactor = 1;
        startOffset = [0, 1];
        dirs = [DIRS[8][7], DIRS[8][1], DIRS[8][3], DIRS[8][5]];
        break;

      case 6:
        dirs = DIRS[6];
        countFactor = 1;
        startOffset = [-1, 1];
        break;

      case 8:
        dirs = DIRS[4];
        countFactor = 2;
        startOffset = [-1, 1];
    }

    const result: [number, number][] = [];

    /* starting neighbor */
    let x = cx + startOffset[0] * r;
    let y = cy + startOffset[1] * r;

    /* circle */
    for (const dir of dirs) {
      for (let j = 0; j < r * countFactor; j++) {
        result.push([x, y]);
        x += dir[0];
        y += dir[1];
      }
    }

    return result;
  }
}
