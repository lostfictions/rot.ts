export interface FeatureConstructor {
  new (): Feature;
  createRandomAt(
    x: number,
    y: number,
    dx: number,
    dy: number,
    options
  ): Feature;
}

/**
 * Dungeon feature; has own .create() method
 */
export interface Feature {
  isValid(canBeDugCallback): boolean;
  create(digCallback): void;
  debug(): void;
}

export class Room implements Feature {
  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    doorX?: number,
    doorY?: number
  ) {
    this._x1 = x1;
    this._y1 = y1;
    this._x2 = x2;
    this._y2 = y2;
    this._doors = {};
    if (arguments.length > 4) {
      this.addDoor(doorX, doorY);
    }
  }

  /**
   * Room of random size, with a given doors and direction
   */
  static createRandomAt(x, y, dx, dy, options): Room {
    var min = options.roomWidth[0];
    var max = options.roomWidth[1];
    var width = ROT.RNG.getUniformInt(min, max);

    var min = options.roomHeight[0];
    var max = options.roomHeight[1];
    var height = ROT.RNG.getUniformInt(min, max);

    if (dx == 1) {
      /* to the right */
      var y2 = y - Math.floor(ROT.RNG.getUniform() * height);
      return new this(x + 1, y2, x + width, y2 + height - 1, x, y);
    }

    if (dx == -1) {
      /* to the left */
      var y2 = y - Math.floor(ROT.RNG.getUniform() * height);
      return new this(x - width, y2, x - 1, y2 + height - 1, x, y);
    }

    if (dy == 1) {
      /* to the bottom */
      var x2 = x - Math.floor(ROT.RNG.getUniform() * width);
      return new this(x2, y + 1, x2 + width - 1, y + height, x, y);
    }

    if (dy == -1) {
      /* to the top */
      var x2 = x - Math.floor(ROT.RNG.getUniform() * width);
      return new this(x2, y - height, x2 + width - 1, y - 1, x, y);
    }

    throw new Error("dx or dy must be 1 or -1");
  }

  /**
   * Room of random size, positioned around center coords
   */
  static createRandomCenter(cx, cy, options): Room {
    var min = options.roomWidth[0];
    var max = options.roomWidth[1];
    var width = ROT.RNG.getUniformInt(min, max);

    var min = options.roomHeight[0];
    var max = options.roomHeight[1];
    var height = ROT.RNG.getUniformInt(min, max);

    var x1 = cx - Math.floor(ROT.RNG.getUniform() * width);
    var y1 = cy - Math.floor(ROT.RNG.getUniform() * height);
    var x2 = x1 + width - 1;
    var y2 = y1 + height - 1;

    return new this(x1, y1, x2, y2);
  }

  /**
   * Room of random size within a given dimensions
   */
  static createRandom(availWidth, availHeight, options): Room {
    var min = options.roomWidth[0];
    var max = options.roomWidth[1];
    var width = ROT.RNG.getUniformInt(min, max);

    var min = options.roomHeight[0];
    var max = options.roomHeight[1];
    var height = ROT.RNG.getUniformInt(min, max);

    var left = availWidth - width - 1;
    var top = availHeight - height - 1;

    var x1 = 1 + Math.floor(ROT.RNG.getUniform() * left);
    var y1 = 1 + Math.floor(ROT.RNG.getUniform() * top);
    var x2 = x1 + width - 1;
    var y2 = y1 + height - 1;

    return new this(x1, y1, x2, y2);
  }

  addDoor(x, y) {
    this._doors[x + "," + y] = 1;
    return this;
  }

  getDoors(callback) {
    for (var key in this._doors) {
      var parts = key.split(",");
      callback(parseInt(parts[0]), parseInt(parts[1]));
    }
    return this;
  }

  clearDoors() {
    this._doors = {};
    return this;
  }

  addDoors(isWallCallback) {
    var left = this._x1 - 1;
    var right = this._x2 + 1;
    var top = this._y1 - 1;
    var bottom = this._y2 + 1;

    for (var x = left; x <= right; x++) {
      for (var y = top; y <= bottom; y++) {
        if (x != left && x != right && y != top && y != bottom) {
          continue;
        }
        if (isWallCallback(x, y)) {
          continue;
        }

        this.addDoor(x, y);
      }
    }

    return this;
  }

  debug(): void {
    console.log("room", this._x1, this._y1, this._x2, this._y2);
  }

  isValid(isWallCallback, canBeDugCallback): boolean {
    var left = this._x1 - 1;
    var right = this._x2 + 1;
    var top = this._y1 - 1;
    var bottom = this._y2 + 1;

    for (var x = left; x <= right; x++) {
      for (var y = top; y <= bottom; y++) {
        if (x == left || x == right || y == top || y == bottom) {
          if (!isWallCallback(x, y)) {
            return false;
          }
        } else {
          if (!canBeDugCallback(x, y)) {
            return false;
          }
        }
      }
    }

    return true;
  }

  /**
   * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty, 1 = wall, 2 = door. Multiple doors are allowed.
   */
  create(digCallback) {
    var left = this._x1 - 1;
    var right = this._x2 + 1;
    var top = this._y1 - 1;
    var bottom = this._y2 + 1;

    var value = 0;
    for (var x = left; x <= right; x++) {
      for (var y = top; y <= bottom; y++) {
        if (x + "," + y in this._doors) {
          value = 2;
        } else if (x == left || x == right || y == top || y == bottom) {
          value = 1;
        } else {
          value = 0;
        }
        digCallback(x, y, value);
      }
    }
  }

  getCenter() {
    return [
      Math.round((this._x1 + this._x2) / 2),
      Math.round((this._y1 + this._y2) / 2)
    ];
  }

  getLeft() {
    return this._x1;
  }

  getRight() {
    return this._x2;
  }

  getTop() {
    return this._y1;
  }

  getBottom() {
    return this._y2;
  }
}

export class Corridor implements Feature {
  constructor(startX: number, startY: number, endX: number, endY: number) {
    this._startX = startX;
    this._startY = startY;
    this._endX = endX;
    this._endY = endY;
    this._endsWithAWall = true;
  }

  static createRandomAt(x, y, dx, dy, options): Corridor {
    var min = options.corridorLength[0];
    var max = options.corridorLength[1];
    var length = ROT.RNG.getUniformInt(min, max);

    return new this(x, y, x + dx * length, y + dy * length);
  }

  debug(): void {
    console.log("corridor", this._startX, this._startY, this._endX, this._endY);
  }

  isValid(isWallCallback, canBeDugCallback): boolean {
    var sx = this._startX;
    var sy = this._startY;
    var dx = this._endX - sx;
    var dy = this._endY - sy;
    var length = 1 + Math.max(Math.abs(dx), Math.abs(dy));

    if (dx) {
      dx = dx / Math.abs(dx);
    }
    if (dy) {
      dy = dy / Math.abs(dy);
    }
    var nx = dy;
    var ny = -dx;

    var ok = true;
    for (var i = 0; i < length; i++) {
      var x = sx + i * dx;
      var y = sy + i * dy;

      if (!canBeDugCallback(x, y)) {
        ok = false;
      }
      if (!isWallCallback(x + nx, y + ny)) {
        ok = false;
      }
      if (!isWallCallback(x - nx, y - ny)) {
        ok = false;
      }

      if (!ok) {
        length = i;
        this._endX = x - dx;
        this._endY = y - dy;
        break;
      }
    }

    /**
     * If the length degenerated, this corridor might be invalid
     */

    /* not supported */
    if (length == 0) {
      return false;
    }

    /* length 1 allowed only if the next space is empty */
    if (length == 1 && isWallCallback(this._endX + dx, this._endY + dy)) {
      return false;
    }

    /**
     * We do not want the corridor to crash into a corner of a room;
     * if any of the ending corners is empty, the N+1th cell of this corridor must be empty too.
     *
     * Situation:
     * #######1
     * .......?
     * #######2
     *
     * The corridor was dug from left to right.
     * 1, 2 - problematic corners, ? = N+1th cell (not dug)
     */
    var firstCornerBad = !isWallCallback(
      this._endX + dx + nx,
      this._endY + dy + ny
    );
    var secondCornerBad = !isWallCallback(
      this._endX + dx - nx,
      this._endY + dy - ny
    );
    this._endsWithAWall = isWallCallback(this._endX + dx, this._endY + dy);
    if ((firstCornerBad || secondCornerBad) && this._endsWithAWall) {
      return false;
    }

    return true;
  }

  /**
   * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty.
   */
  create(digCallback) {
    var sx = this._startX;
    var sy = this._startY;
    var dx = this._endX - sx;
    var dy = this._endY - sy;
    var length = 1 + Math.max(Math.abs(dx), Math.abs(dy));

    if (dx) {
      dx = dx / Math.abs(dx);
    }
    if (dy) {
      dy = dy / Math.abs(dy);
    }
    var nx = dy;
    var ny = -dx;

    for (var i = 0; i < length; i++) {
      var x = sx + i * dx;
      var y = sy + i * dy;
      digCallback(x, y, 0);
    }

    return true;
  }

  createPriorityWalls(priorityWallCallback) {
    if (!this._endsWithAWall) {
      return;
    }

    var sx = this._startX;
    var sy = this._startY;

    var dx = this._endX - sx;
    var dy = this._endY - sy;
    if (dx) {
      dx = dx / Math.abs(dx);
    }
    if (dy) {
      dy = dy / Math.abs(dy);
    }
    var nx = dy;
    var ny = -dx;

    priorityWallCallback(this._endX + dx, this._endY + dy);
    priorityWallCallback(this._endX + nx, this._endY + ny);
    priorityWallCallback(this._endX - nx, this._endY - ny);
  }
}
