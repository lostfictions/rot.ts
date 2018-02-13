import { Map, CreateCallback } from "./map";
import { rng } from "../rng";
import { DIRS } from "../constants";

export interface CellularOptions {
  /** List of neighbor counts for a new cell to be born in empty space */
  born: number[];

  /** @param List of neighbor counts for an existing  cell to survive */
  survive: number[];

  topology: 4 | 6 | 8;
}

/**
 * Cellular automaton map generator
 */
export class Cellular extends Map {
  protected readonly _options: CellularOptions;
  protected readonly _dirs: ReadonlyArray<[number, number]>;
  protected _map: number[][];

  constructor(
    width: number,
    height: number,
    options: Partial<CellularOptions>
  ) {
    super(width, height);
    this._options = {
      born: [5, 6, 7, 8],
      survive: [4, 5, 6, 7, 8],
      topology: 8,
      ...options
    };

    this._dirs = DIRS[this._options.topology];
    this._map = this._fillMap(0);
  }

  /**
   * Fill the map with random values
   *
   * @param probability Probability for a cell to become alive; 0 = all empty, 1 = all full
   */
  randomize(probability: number): void {
    for (let i = 0; i < this._width; i++) {
      for (let j = 0; j < this._height; j++) {
        this._map[i][j] = rng.getUniform() < probability ? 1 : 0;
      }
    }
  }

  set(x: number, y: number, value: number): void {
    this._map[x][y] = value;
  }

  create(callback: CreateCallback): void {
    const newMap = this._fillMap(0);
    const born = this._options.born;
    const survive = this._options.survive;

    for (let j = 0; j < this._height; j++) {
      let widthStep = 1;
      let widthStart = 0;
      if (this._options.topology === 6) {
        widthStep = 2;
        widthStart = j % 2;
      }

      for (let i = widthStart; i < this._width; i += widthStep) {
        const cur = this._map[i][j];
        const ncount = this._getNeighbors(i, j);

        if (cur && survive.indexOf(ncount) !== -1) {
          /* survive */
          newMap[i][j] = 1;
        } else if (!cur && born.indexOf(ncount) !== -1) {
          /* born */
          newMap[i][j] = 1;
        }
      }
    }

    this._map = newMap;
    if (callback) {
      this._serviceCallback(callback);
    }
  }

  protected _serviceCallback(callback: CreateCallback): void {
    for (let j = 0; j < this._height; j++) {
      let widthStep = 1;
      let widthStart = 0;
      if (this._options.topology === 6) {
        widthStep = 2;
        widthStart = j % 2;
      }

      for (let i = widthStart; i < this._width; i += widthStep) {
        callback(i, j, this._map[i][j]);
      }
    }
  }

  /**
   * Get neighbor count at [i,j] in this._map
   */
  protected _getNeighbors(cx: number, cy: number): number {
    let result = 0;
    for (const dir of this._dirs) {
      const x = cx + dir[0];
      const y = cy + dir[1];

      if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
        continue;
      }
      result += this._map[x][y] === 1 ? 1 : 0;
    }

    return result;
  }

  /**
   * Make sure every non-wall space is accessible.
   *
   * @param callback Callback to call to display map when done
   * @param value Value to consider empty space - defaults to 0
   * @param connectionCallback Callback to call when a new connection is made
   */
  connect(
    callback: CreateCallback,
    value = 0,
    connectionCallback: (from: [number, number], to: [number, number]) => any
  ): void {
    const allFreeSpace: [number, number][] = [];
    const notConnected: { [point: string]: [number, number] } = {};

    // find all free space
    let widthStep = 1;
    let widthStarts = [0, 0];
    if (this._options.topology === 6) {
      widthStep = 2;
      widthStarts = [0, 1];
    }

    for (let y = 0; y < this._height; y++) {
      for (let x = widthStarts[y % 2]; x < this._width; x += widthStep) {
        if (this._freeSpace(x, y, value)) {
          const p: [number, number] = [x, y];
          notConnected[this._pointKey(p)] = p;
          allFreeSpace.push([x, y]);
        }
      }
    }

    const start =
      allFreeSpace[rng.getUniformInt(0, allFreeSpace.length - 1)];

    const key = this._pointKey(start);
    const connected: { [point: string]: [number, number] } = {};
    connected[key] = start;
    delete notConnected[key];

    // find what's connected to the starting point
    this._findConnected(connected, notConnected, [start], false, value);

    while (Object.keys(notConnected).length > 0) {
      // find two points from notConnected to connected
      const [from, to] = this._getFromTo(connected, notConnected);

      // find everything connected to the starting point
      const local: { [point: string]: [number, number] } = {};
      local[this._pointKey(from)] = from;
      this._findConnected(local, notConnected, [from], true, value);

      // connect to a connected cell
      const tunnelFn =
        this._options.topology === 6
          ? this._tunnelToConnected6
          : this._tunnelToConnected;

      tunnelFn.call(
        this,
        to,
        from,
        connected,
        notConnected,
        value,
        connectionCallback
      );

      // now all of local is connected
      for (const [k, pp] of Object.entries(local)) {
        this._map[pp[0]][pp[1]] = value;
        connected[k] = pp;
        delete notConnected[k];
      }
    }

    if (callback) {
      this._serviceCallback(callback);
    }
  }

  /**
   * Find random points to connect. Search for the closest point in the larger space.
   * This is to minimize the length of the passage while maintaining good performance.
   */
  protected _getFromTo(
    connected: { [point: string]: [number, number] },
    notConnected: { [point: string]: [number, number] }
  ): [[number, number], [number, number]] {
    const connectedKeys = Object.keys(connected);
    const notConnectedKeys = Object.keys(notConnected);

    let from: [number, number];
    let to: [number, number];
    for (let i = 0; i < 5; i++) {
      if (connectedKeys.length < notConnectedKeys.length) {
        const keys = connectedKeys;
        to = connected[keys[rng.getUniformInt(0, keys.length - 1)]];
        from = this._getClosest(to, notConnected);
      } else {
        const keys = notConnectedKeys;
        from = notConnected[keys[rng.getUniformInt(0, keys.length - 1)]];
        to = this._getClosest(from, connected);
      }

      const d =
        (from[0] - to[0]) * (from[0] - to[0]) +
        (from[1] - to[1]) * (from[1] - to[1]);

      if (d < 64) {
        break;
      }
    }

    return [from!, to!];
  }

  protected _getClosest(
    point: [number, number],
    space: { [point: string]: [number, number] }
  ): [number, number] {
    let minPoint = null;
    let minDist = null;
    for (const p of Object.values(space)) {
      const d =
        (p[0] - point[0]) * (p[0] - point[0]) +
        (p[1] - point[1]) * (p[1] - point[1]);
      if (minDist == null || d < minDist) {
        minDist = d;
        minPoint = p;
      }
    }
    return minPoint!;
  }

  protected _findConnected(
    connected: { [point: string]: [number, number] },
    notConnected: { [point: string]: [number, number] },
    stack: [number, number][],
    keepNotConnected: boolean,
    value: number
  ): void {
    while (stack.length > 0) {
      const p = stack.splice(0, 1)[0];

      let tests: [number, number][];
      if (this._options.topology === 6) {
        tests = [
          [p[0] + 2, p[1]],
          [p[0] + 1, p[1] - 1],
          [p[0] - 1, p[1] - 1],
          [p[0] - 2, p[1]],
          [p[0] - 1, p[1] + 1],
          [p[0] + 1, p[1] + 1]
        ];
      } else {
        tests = [
          [p[0] + 1, p[1]],
          [p[0] - 1, p[1]],
          [p[0], p[1] + 1],
          [p[0], p[1] - 1]
        ];
      }

      for (const test of tests) {
        const key = this._pointKey(test);
        if (
          connected[key] == null &&
          this._freeSpace(test[0], test[1], value)
        ) {
          connected[key] = test;
          if (!keepNotConnected) {
            delete notConnected[key];
          }
          stack.push(test);
        }
      }
    }
  }

  protected _tunnelToConnected(
    to: [number, number],
    from: [number, number],
    connected: { [point: string]: [number, number] },
    notConnected: { [point: string]: [number, number] },
    value: number,
    connectionCallback: (from: [number, number], to: [number, number]) => any
  ): void {
    let a: [number, number];
    let b: [number, number];

    if (from[0] < to[0]) {
      a = from;
      b = to;
    } else {
      a = to;
      b = from;
    }

    for (let xx = a[0]; xx <= b[0]; xx++) {
      this._map[xx][a[1]] = value;
      const p: [number, number] = [xx, a[1]];
      const pkey = this._pointKey(p);
      connected[pkey] = p;
      delete notConnected[pkey];
    }
    if (connectionCallback && a[0] < b[0]) {
      connectionCallback(a, [b[0], a[1]]);
    }

    // x is now fixed
    const x = b[0];

    if (from[1] < to[1]) {
      a = from;
      b = to;
    } else {
      a = to;
      b = from;
    }

    for (let yy = a[1]; yy < b[1]; yy++) {
      this._map[x][yy] = value;
      const p: [number, number] = [x, yy];
      const pkey = this._pointKey(p);
      connected[pkey] = p;
      delete notConnected[pkey];
    }
    if (connectionCallback && a[1] < b[1]) {
      connectionCallback([b[0], a[1]], [b[0], b[1]]);
    }
  }

  protected _tunnelToConnected6(
    to: [number, number],
    from: [number, number],
    connected: { [point: string]: [number, number] },
    notConnected: { [point: string]: [number, number] },
    value: number,
    connectionCallback: (from: [number, number], to: [number, number]) => any
  ): void {
    let a: [number, number];
    let b: [number, number];
    if (from[0] < to[0]) {
      a = from;
      b = to;
    } else {
      a = to;
      b = from;
    }

    // tunnel diagonally until horizontally level
    let [xx, yy] = a;
    while (!(xx === b[0] && yy === b[1])) {
      let stepWidth = 2;
      if (yy < b[1]) {
        yy++;
        stepWidth = 1;
      } else if (yy > b[1]) {
        yy--;
        stepWidth = 1;
      }

      if (xx < b[0]) {
        xx += stepWidth;
      } else if (xx > b[0]) {
        xx -= stepWidth;
      } else if (b[1] % 2) {
        // Won't step outside map if destination on is map's right edge
        xx -= stepWidth;
      } else {
        // ditto for left edge
        xx += stepWidth;
      }

      this._map[xx][yy] = value;
      const p: [number, number] = [xx, yy];
      const pkey = this._pointKey(p);
      connected[pkey] = p;
      delete notConnected[pkey];
    }

    if (connectionCallback) {
      connectionCallback(from, to);
    }
  }

  protected _freeSpace(x: number, y: number, value: number): boolean {
    return (
      x >= 0 &&
      x < this._width &&
      y >= 0 &&
      y < this._height &&
      this._map[x][y] === value
    );
  }

  protected _pointKey(p: [number, number]): string {
    return `${p[0]}.${p[1]}`;
  }
}
