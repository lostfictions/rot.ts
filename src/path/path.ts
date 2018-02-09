import { DIRS } from '../util'

interface PathOptions {
  topology: number
}

/**
 * Abstract pathfinder
 */
export abstract class Path {
  private _toX: number
  private _toY: number
  private _fromX: number | null
  private _fromY: number | null
  private _passableCallback
  private _options: PathOptions
  private _dirs: [number, number][]

  /**
   * @param toX Target X coord
   * @param toY Target Y coord
   * @param passableCallback Callback to determine map passability
   * @param [options]
   * @param [options.topology=8]
   */
  constructor(toX: number, toY: number, passableCallback, options?: Partial<PathOptions>) {
    this._toX = toX;
    this._toY = toY;
    this._fromX = null;
    this._fromY = null;
    this._passableCallback = passableCallback;
    this._options = {
      topology: 8,
      ...options
    };

    this._dirs = DIRS[this._options.topology]
    if (this._options.topology === 8) { /* reorder dirs for more aesthetic result (vertical/horizontal first) */
      this._dirs = [
        this._dirs[0],
        this._dirs[2],
        this._dirs[4],
        this._dirs[6],
        this._dirs[1],
        this._dirs[3],
        this._dirs[5],
        this._dirs[7]
      ]
    }
  };

  /**
   * Compute a path from a given point
   * @param fromX
   * @param fromY
   * @param callback Will be called for every path item with arguments "x" and "y"
   */
  protected abstract compute(fromX: number, fromY: number, callback)

  protected _getNeighbors(cx: number, cy: number): [number, number][] {
    const result: [number, number][] = [];
    for (const dir of this._dirs) {
      const x = cx + dir[0];
      const y = cy + dir[1];

      if (!this._passableCallback(x, y)) { continue; }
      result.push([x, y]);
    }

    return result;
  }
}