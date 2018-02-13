import { Dungeon } from "./dungeon";
import { Room, Corridor, FeatureConstructor } from "./features";
import { CreateCallback } from "./map";
import { randomInArray } from "../util";
import { DIRS } from "../constants";
import { rng } from "../rng";

export interface DiggerOptions {
  /** room minimum and maximum width */
  roomWidth: [number, number];

  /** room minimum and maximum height */
  roomHeight: [number, number];

  /** corridor minimum and maximum length */
  corridorLength: [number, number];

  /** we stop after this percentage of level area has been dug out by rooms */
  dugPercentage: number;

  /** we stop after this much time has passed (msec) */
  timeLimit: number;
}

/**
 * Random dungeon generator using human-like digging patterns.
 *
 * Heavily based on Mike Anderson's ideas from the "Tyrant" algo, mentioned at
 * http://www.roguebasin.roguelikedevelopment.org/index.php?title=Dungeon-Building_Algorithm.
 */
export class Digger extends Dungeon {
  protected readonly _options: DiggerOptions;

  protected _features = { Room: 4, Corridor: 4 };

  /** how many times do we try to create a feature on a suitable wall */
  protected _featureAttempts = 20;

  /** these are available for digging; value = priority */
  protected _walls: { [id: string]: number } = {};

  protected _map: number[][] = [[]];
  protected _dug = 0;

  constructor(width: number, height: number, options: Partial<DiggerOptions>) {
    super(width, height);

    this._options = {
      roomWidth: [3, 9],
      roomHeight: [3, 5],
      corridorLength: [3, 10],
      dugPercentage: 0.2,
      timeLimit: 1000,
      ...options
    };

    this._digCallback = this._digCallback.bind(this);
    this._canBeDugCallback = this._canBeDugCallback.bind(this);
    this._isWallCallback = this._isWallCallback.bind(this);
    this._priorityWallCallback = this._priorityWallCallback.bind(this);
  }

  create(callback: CreateCallback): void {
    this._rooms = [];
    this._corridors = [];
    this._map = this._fillMap(1);
    this._walls = {};
    this._dug = 0;
    const area = (this._width - 2) * (this._height - 2);

    this._firstRoom();

    const t1 = Date.now();

    let priorityWalls = 0;
    do {
      const t2 = Date.now();
      if (t2 - t1 > this._options.timeLimit) {
        break;
      }

      /* find a good wall */
      const candidateWall = this._findWall();
      if (!candidateWall) {
        /* no more walls */
        break;
      }

      const [x, y] = candidateWall.split(",").map(parseInt);
      const dir = this._getDiggingDirection(x, y);
      if (!dir) {
        /* this wall is not suitable */
        continue;
      }

      /* try adding a feature */
      let featureAttempts = 0;
      do {
        featureAttempts++;
        if (this._tryFeature(x, y, dir[0], dir[1])) {
          /* feature added */
          this._removeSurroundingWalls(x, y);
          this._removeSurroundingWalls(x - dir[0], y - dir[1]);
          break;
        }
      } while (featureAttempts < this._featureAttempts);

      priorityWalls = 0;
      for (const wall of Object.values(this._walls)) {
        if (wall > 1) {
          priorityWalls++;
        }
      }
    } while (
      this._dug / area < this._options.dugPercentage ||
      priorityWalls
    ); /* fixme number of priority walls */

    this._addDoors();

    if (callback) {
      for (let i = 0; i < this._width; i++) {
        for (let j = 0; j < this._height; j++) {
          callback(i, j, this._map[i][j]);
        }
      }
    }

    this._walls = {};
    this._map = [[]];
  }

  protected _digCallback = (x: number, y: number, value: number): void => {
    if (value === 0 || value === 2) {
      /* empty */
      this._map[x][y] = 0;
      this._dug++;
    } else {
      /* wall */
      this._walls[`${x},${y}`] = 1;
    }
  };

  protected _isWallCallback = (x: number, y: number): boolean => {
    if (x < 0 || y < 0 || x >= this._width || y >= this._height) {
      return false;
    }
    return this._map[x][y] === 1;
  };

  protected _canBeDugCallback = (x: number, y: number): boolean => {
    if (x < 1 || y < 1 || x + 1 >= this._width || y + 1 >= this._height) {
      return false;
    }
    return this._map[x][y] === 1;
  };

  protected _priorityWallCallback = (x: number, y: number): void => {
    this._walls[`${x},${y}`] = 2;
  };

  protected _firstRoom(): void {
    const cx = Math.floor(this._width / 2);
    const cy = Math.floor(this._height / 2);
    const room = Room.createRandomCenter(cx, cy, this._options);
    this._rooms.push(room);
    room.create(this._digCallback);
  }

  /**
   * Get a suitable wall
   */
  protected _findWall(): string | null {
    const prio1 = [];
    const prio2 = [];
    for (const [id, prio] of Object.entries(this._walls)) {
      if (prio === 2) {
        prio2.push(id);
      } else {
        prio1.push(id);
      }
    }

    const arr = prio2.length > 0 ? prio2 : prio1;
    if (!arr.length) {
      /* no walls :/ */
      return null;
    }

    const foundId = randomInArray(arr.sort())!; // sort to make the order deterministic
    delete this._walls[foundId];

    return foundId;
  }

  /**
   * Tries adding a feature
   *
   * @returns was this a successful try?
   */
  protected _tryFeature(x: number, y: number, dx: number, dy: number): boolean {
    const featureType: FeatureConstructor =
      rng.getWeightedValue(this._features) === "Room" ? Room : Corridor;

    const feature = featureType.createRandomAt(x, y, dx, dy, this._options);

    if (!feature.isValid(this._isWallCallback, this._canBeDugCallback)) {
      return false;
    }

    feature.create(this._digCallback);

    if (feature instanceof Room) {
      this._rooms.push(feature);
    }
    if (feature instanceof Corridor) {
      feature.createPriorityWalls(this._priorityWallCallback);
      this._corridors.push(feature);
    }

    return true;
  }

  protected _removeSurroundingWalls(cx: number, cy: number): void {
    for (const delta of DIRS[4]) {
      const x1 = cx + delta[0];
      const y1 = cy + delta[1];
      delete this._walls[`${x1},${y1}`];

      const x2 = cx + 2 * delta[0];
      const y2 = cy + 2 * delta[1];
      delete this._walls[`${x2},${y2}`];
    }
  }

  /**
   * Returns vector in "digging" direction, or null if this does not exist (or is not unique)
   */
  protected _getDiggingDirection(
    cx: number,
    cy: number
  ): [number, number] | null {
    if (cx <= 0 || cy <= 0 || cx >= this._width - 1 || cy >= this._height - 1) {
      return null;
    }

    let result: [number, number] | null = null;

    for (const delta of DIRS[4]) {
      const x = cx + delta[0];
      const y = cy + delta[1];

      if (!this._map[x][y]) {
        /* there already is another empty neighbor! */
        if (result) {
          return null;
        }
        result = delta;
      }
    }

    /* no empty neighbor */
    if (!result) {
      return null;
    }

    return [-result[0], -result[1]];
  }

  /**
   * Find empty spaces surrounding rooms, and apply doors.
   */
  protected _addDoors(): void {
    const data = this._map;
    const isWallCallback = (x: number, y: number) => data[x][y] === 1;
    for (const room of this._rooms) {
      room.clearDoors();
      room.addDoors(isWallCallback);
    }
  }
}
