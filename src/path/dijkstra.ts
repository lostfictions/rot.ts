import { Path, PathOptions } from './path'

/**
 * Simplified Dijkstra's algorithm: all edges have a value of 1
 */
export class Dijkstra extends Path {
  private _computed = {};
  private _todo = [];

  constructor(toX: number, toY: number, passableCallback, options) {
    super(toX, toY, passableCallback, options);

    this._add(toX, toY, null);
  };

  /**
   * Compute a path from a given point
   */
  compute(fromX, fromY, callback): void {
    var key = fromX+","+fromY;
    if (!(key in this._computed)) { this._compute(fromX, fromY); }
    if (!(key in this._computed)) { return; }

    var item = this._computed[key];
    while (item) {
      callback(item.x, item.y);
      item = item.prev;
    }
  }

  /**
   * Compute a non-cached value
   */
  private _compute(fromX, fromY): void {
    while (this._todo.length) {
      var item = this._todo.shift();
      if (item.x == fromX && item.y == fromY) { return; }

      var neighbors = this._getNeighbors(item.x, item.y);

      for (var i=0;i<neighbors.length;i++) {
        var neighbor = neighbors[i];
        var x = neighbor[0];
        var y = neighbor[1];
        var id = x+","+y;
        if (id in this._computed) { continue; } /* already done */
        this._add(x, y, item);
      }
    }
  }

  private _add(x, y, prev): void {
    var obj = {
      x: x,
      y: y,
      prev: prev
    };
    this._computed[x+","+y] = obj;
    this._todo.push(obj);
  }
}