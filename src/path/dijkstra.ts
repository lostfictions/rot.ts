import { Path, PathOptions, PassableCallback, ComputeCallback } from "./path";

interface PathItem {
  x: number;
  y: number;
  prev: PathItem | null;
}

/**
 * Simplified Dijkstra's algorithm: all edges have a value of 1
 */
export class Dijkstra extends Path {
  private _computed: { [pos: string]: PathItem } = {};
  private _todo: PathItem[] = [];

  constructor(
    toX: number,
    toY: number,
    passableCallback: PassableCallback,
    options: PathOptions
  ) {
    super(toX, toY, passableCallback, options);

    this._add(toX, toY, null);
  }

  /**
   * Compute a path from a given point
   */
  compute(fromX: number, fromY: number, callback: ComputeCallback): void {
    const key = `${fromX},${fromY}`;
    if (!(key in this._computed)) {
      this._compute(fromX, fromY);
    }
    if (!(key in this._computed)) {
      return;
    }

    let item: PathItem | null = this._computed[key];
    while (item) {
      callback(item.x, item.y);
      item = item.prev;
    }
  }

  /**
   * Compute a non-cached value
   */
  private _compute(fromX: number, fromY: number): void {
    while (this._todo.length) {
      const item = this._todo.shift()!;
      if (item.x === fromX && item.y === fromY) {
        return;
      }

      const neighbors = this._getNeighbors(item.x, item.y);

      for (const [x, y] of neighbors) {
        if (`${x},${y}` in this._computed) {
          continue;
        }
        this._add(x, y, item);
      }
    }
  }

  private _add(x: number, y: number, prev: PathItem | null): void {
    const obj = {
      x,
      y,
      prev
    };
    this._computed[x + "," + y] = obj;
    this._todo.push(obj);
  }
}
