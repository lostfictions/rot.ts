import { Path, PathOptions } from "./path";

/**
 * Simplified A* algorithm: all edges have a value of 1
 */
export class AStar extends Path {
  private _todo = [];
  private _done = {};

  constructor(
    toX: number,
    toY: number,
    passableCallback,
    options: PathOptions
  ) {
    super(toX, toY, passableCallback, options);
  }

  /**
   * Compute a path from a given point
   */
  compute(fromX: number, fromY: number, callback) {
    this._todo = [];
    this._done = {};
    this._fromX = fromX;
    this._fromY = fromY;
    this._add(this._toX, this._toY, null);

    while (this._todo.length) {
      var item = this._todo.shift();
      var id = item.x + "," + item.y;
      if (id in this._done) {
        continue;
      }
      this._done[id] = item;
      if (item.x == fromX && item.y == fromY) {
        break;
      }

      var neighbors = this._getNeighbors(item.x, item.y);

      for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];
        var x = neighbor[0];
        var y = neighbor[1];
        var id = x + "," + y;
        if (id in this._done) {
          continue;
        }
        this._add(x, y, item);
      }
    }

    var item = this._done[fromX + "," + fromY];
    if (!item) {
      return;
    }

    while (item) {
      callback(item.x, item.y);
      item = item.prev;
    }
  }

  private _add(x, y, prev) {
    var h = this._distance(x, y);
    var obj = {
      x: x,
      y: y,
      prev: prev,
      g: prev ? prev.g + 1 : 0,
      h: h
    };

    /* insert into priority queue */

    var f = obj.g + obj.h;
    for (var i = 0; i < this._todo.length; i++) {
      var item = this._todo[i];
      var itemF = item.g + item.h;
      if (f < itemF || (f == itemF && h < item.h)) {
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
        break;

      case 6:
        var dx = Math.abs(x - this._fromX);
        var dy = Math.abs(y - this._fromY);
        return dy + Math.max(0, (dx - dy) / 2);
        break;

      case 8:
        return Math.max(Math.abs(x - this._fromX), Math.abs(y - this._fromY));
        break;
    }

    throw new Error("Illegal topology");
  }
}
