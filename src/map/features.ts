import { defaultRNG } from "../rng";

export type DigCallback = (x: number, y: number, value: number) => any;
export type TestPositionCallback = (x: number, y: number) => boolean;

export interface FeatureConstructor {
  new (): Feature;
  createRandomAt(
    x: number,
    y: number,
    dx: number,
    dy: number,
    options: { [option: string]: any }
  ): Feature;
}

/**
 * Dungeon feature; has own .create() method
 */
export interface Feature {
  isValid(canBeDugCallback: TestPositionCallback): boolean;
  create(digCallback: DigCallback): void;
  debug(): void;
}

export interface RoomCreateOptions {
  roomWidth: [number, number];
  roomHeight: [number, number];
}

export class Room implements Feature {
  protected readonly _x1: number;
  protected readonly _y1: number;
  protected readonly _x2: number;
  protected readonly _y2: number;
  protected _doors: { [pos: string]: number } = {};

  get center(): [number, number] {
    return [
      Math.round((this._x1 + this._x2) / 2),
      Math.round((this._y1 + this._y2) / 2)
    ];
  }

  get left(): number {
    return this._x1;
  }

  get right(): number {
    return this._x2;
  }

  get top(): number {
    return this._y1;
  }

  get bottom(): number {
    return this._y2;
  }

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
    if (doorX != null && doorY != null) {
      this.addDoor(doorX, doorY);
    }
  }

  /**
   * Room of random size, with a given doors and direction
   */
  static createRandomAt(
    x: number,
    y: number,
    dx: number,
    dy: number,
    options: RoomCreateOptions
  ): Room {
    const [wMin, wMax] = options.roomWidth;
    const [hMin, hMax] = options.roomHeight;
    const width = defaultRNG.getUniformInt(wMin, wMax);
    const height = defaultRNG.getUniformInt(hMin, hMax);

    if (dx === 1) {
      /* to the right */
      const y2 = y - Math.floor(defaultRNG.getUniform() * height);
      return new this(x + 1, y2, x + width, y2 + height - 1, x, y);
    }

    if (dx === -1) {
      /* to the left */
      const y2 = y - Math.floor(defaultRNG.getUniform() * height);
      return new this(x - width, y2, x - 1, y2 + height - 1, x, y);
    }

    if (dy === 1) {
      /* to the bottom */
      const x2 = x - Math.floor(defaultRNG.getUniform() * width);
      return new this(x2, y + 1, x2 + width - 1, y + height, x, y);
    }

    if (dy === -1) {
      /* to the top */
      const x2 = x - Math.floor(defaultRNG.getUniform() * width);
      return new this(x2, y - height, x2 + width - 1, y - 1, x, y);
    }

    throw new Error("dx or dy must be 1 or -1");
  }

  /**
   * Room of random size, positioned around center coords
   */
  static createRandomCenter(
    cx: number,
    cy: number,
    options: RoomCreateOptions
  ): Room {
    const [wMin, wMax] = options.roomWidth;
    const width = defaultRNG.getUniformInt(wMin, wMax);

    const [hMin, hMax] = options.roomHeight;
    const height = defaultRNG.getUniformInt(hMin, hMax);

    const x1 = cx - Math.floor(defaultRNG.getUniform() * width);
    const y1 = cy - Math.floor(defaultRNG.getUniform() * height);
    const x2 = x1 + width - 1;
    const y2 = y1 + height - 1;

    return new this(x1, y1, x2, y2);
  }

  /**
   * Room of random size within a given dimensions
   */
  static createRandom(
    availWidth: number,
    availHeight: number,
    options: RoomCreateOptions
  ): Room {
    const [wMin, wMax] = options.roomWidth;
    const width = defaultRNG.getUniformInt(wMin, wMax);

    const [hMin, hMax] = options.roomHeight;
    const height = defaultRNG.getUniformInt(hMin, hMax);

    const left = availWidth - width - 1;
    const top = availHeight - height - 1;

    const x1 = 1 + Math.floor(defaultRNG.getUniform() * left);
    const y1 = 1 + Math.floor(defaultRNG.getUniform() * top);
    const x2 = x1 + width - 1;
    const y2 = y1 + height - 1;

    return new this(x1, y1, x2, y2);
  }

  addDoor(x: number, y: number): void {
    this._doors[`${x},${y}`] = 1;
  }

  getDoors(cb: (x: number, y: number) => any): void {
    for (const [x, y] of Object.keys(this._doors).map(pos => pos.split(","))) {
      cb(parseInt(x, 10), parseInt(y, 10));
    }
  }

  clearDoors(): void {
    this._doors = {};
  }

  addDoors(isWallCallback: TestPositionCallback): void {
    const left = this._x1 - 1;
    const right = this._x2 + 1;
    const top = this._y1 - 1;
    const bottom = this._y2 + 1;

    for (let x = left; x <= right; x++) {
      for (let y = top; y <= bottom; y++) {
        if (x !== left && x !== right && y !== top && y !== bottom) {
          continue;
        }
        if (isWallCallback(x, y)) {
          continue;
        }

        this.addDoor(x, y);
      }
    }
  }

  debug(): void {
    console.log("room", this._x1, this._y1, this._x2, this._y2);
  }

  isValid(
    isWallCallback: TestPositionCallback,
    canBeDugCallback: TestPositionCallback
  ): boolean {
    const left = this._x1 - 1;
    const right = this._x2 + 1;
    const top = this._y1 - 1;
    const bottom = this._y2 + 1;

    for (let x = left; x <= right; x++) {
      for (let y = top; y <= bottom; y++) {
        if (x === left || x === right || y === top || y === bottom) {
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
   * @param digCallback Dig callback with a signature (x, y, value). Values: 0 =
   *                    empty, 1 = wall, 2 = door. Multiple doors are allowed.
   */
  create(digCallback: DigCallback): void {
    const left = this._x1 - 1;
    const right = this._x2 + 1;
    const top = this._y1 - 1;
    const bottom = this._y2 + 1;

    let value = 0;
    for (let x = left; x <= right; x++) {
      for (let y = top; y <= bottom; y++) {
        if (`${x},${y}` in this._doors) {
          value = 2;
        } else if (x === left || x === right || y === top || y === bottom) {
          value = 1;
        } else {
          value = 0;
        }
        digCallback(x, y, value);
      }
    }
  }
}

//
//
//
//
//
//

export interface CorridorCreateOptions {
  corridorLength: [number, number];
}

export class Corridor implements Feature {
  protected readonly _startX: number;
  protected readonly _startY: number;
  protected readonly _endX: number;
  protected readonly _endY: number;
  protected _endsWithAWall = true;

  constructor(startX: number, startY: number, endX: number, endY: number) {
    this._startX = startX;
    this._startY = startY;
    this._endX = endX;
    this._endY = endY;
    this._endsWithAWall = true;
  }

  static createRandomAt(
    x: number,
    y: number,
    dx: number,
    dy: number,
    options: CorridorCreateOptions
  ): Corridor {
    const [min, max] = options.corridorLength;
    const length = defaultRNG.getUniformInt(min, max);

    return new this(x, y, x + dx * length, y + dy * length);
  }

  debug(): void {
    console.log("corridor", this._startX, this._startY, this._endX, this._endY);
  }

  isValid(
    isWallCallback: TestPositionCallback,
    canBeDugCallback: TestPositionCallback
  ): boolean {
    const sx = this._startX;
    const sy = this._startY;
    let dx = this._endX - sx;
    let dy = this._endY - sy;
    let length = 1 + Math.max(Math.abs(dx), Math.abs(dy));

    if (dx !== 0) {
      dx = dx / Math.abs(dx);
    }
    if (dy !== 0) {
      dy = dy / Math.abs(dy);
    }
    const nx = dy;
    const ny = -dx;

    let ok = true;
    for (let i = 0; i < length; i++) {
      const x = sx + i * dx;
      const y = sy + i * dy;

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
    if (length === 0) {
      return false;
    }

    /* length 1 allowed only if the next space is empty */
    if (length === 1 && isWallCallback(this._endX + dx, this._endY + dy)) {
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
    const firstCornerBad = !isWallCallback(
      this._endX + dx + nx,
      this._endY + dy + ny
    );
    const secondCornerBad = !isWallCallback(
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
   * @param digCallback Dig callback with a signature (x, y, value). Values: 0 =
   *                    empty.
   */
  create(digCallback: DigCallback): void {
    const sx = this._startX;
    const sy = this._startY;
    let dx = this._endX - sx;
    let dy = this._endY - sy;
    const length = 1 + Math.max(Math.abs(dx), Math.abs(dy));

    if (dx !== 0) {
      dx = dx / Math.abs(dx);
    }
    if (dy !== 0) {
      dy = dy / Math.abs(dy);
    }

    for (let i = 0; i < length; i++) {
      const x = sx + i * dx;
      const y = sy + i * dy;
      digCallback(x, y, 0);
    }
  }

  createPriorityWalls(
    priorityWallCallback: (x: number, y: number) => any
  ): void {
    if (!this._endsWithAWall) {
      return;
    }

    const sx = this._startX;
    const sy = this._startY;

    let dx = this._endX - sx;
    let dy = this._endY - sy;
    if (dx) {
      dx = dx / Math.abs(dx);
    }
    if (dy) {
      dy = dy / Math.abs(dy);
    }
    const nx = dy;
    const ny = -dx;

    priorityWallCallback(this._endX + dx, this._endY + dy);
    priorityWallCallback(this._endX + nx, this._endY + ny);
    priorityWallCallback(this._endX - nx, this._endY - ny);
  }
}
