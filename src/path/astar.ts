import { Path, PathOptions, PassableCallback, ComputeCallback } from "./path";

interface PathItem {
  x: number;
  y: number;
  prev: PathItem | null;
  g: number;
  h: number;
}

/**
 * Simplified A* algorithm: all edges have a value of 1
 */
export class AStar extends Path {
  private _todo: PathItem[] = [];
  private _done: { [pos: string]: PathItem } = {};

  constructor(
    toX: number,
    toY: number,
    passableCallback: PassableCallback,
    options: PathOptions
  ) {
    super(toX, toY, passableCallback, options);
  }

  /**
   * Compute a path from a given point
   */
  compute(fromX: number, fromY: number, callback: ComputeCallback): void {
    this._todo = [];
    this._done = {};
    this._fromX = fromX;
    this._fromY = fromY;
    this._add(this._toX, this._toY, null);

    while (this._todo.length) {
      const current = this._todo.shift()!;
      const currentPos = `${current.x},${current.y}`;
      if (currentPos in this._done) {
        continue;
      }
      this._done[currentPos] = current;
      if (current.x === fromX && current.y === fromY) {
        break;
      }

      const neighbors = this._getNeighbors(current.x, current.y);

      for (const [x, y] of neighbors) {
        if (`${x},${y}` in this._done) {
          continue;
        }
        this._add(x, y, current);
      }
    }

    let item: PathItem | null = this._done[fromX + "," + fromY];
    if (!item) {
      return;
    }

    while (item) {
      callback(item.x, item.y);
      item = item.prev;
    }
  }

  private _add(x: number, y: number, prev: PathItem | null): void {
    const h = this._distance(x, y);
    // prettier-ignore
    const obj = {
      x,
      y,
      prev,
      g: prev ? prev.g + 1 : 0,
      h
    };

    /* insert into priority queue */
    const f = obj.g + obj.h;
    for (let i = 0; i < this._todo.length; i++) {
      const item = this._todo[i];
      const itemF = item.g + item.h;
      if (f < itemF || (f === itemF && h < item.h)) {
        this._todo.splice(i, 0, obj);
        return;
      }
    }

    this._todo.push(obj);
  }

  private _distance(x: number, y: number): number {
    switch (this._options.topology) {
      case 4:
        return Math.abs(x - this._fromX) + Math.abs(y - this._fromY);
      case 6:
        const dx = Math.abs(x - this._fromX);
        const dy = Math.abs(y - this._fromY);
        return dy + Math.max(0, (dx - dy) / 2);
      case 8:
        return Math.max(Math.abs(x - this._fromX), Math.abs(y - this._fromY));
    }
  }
}
