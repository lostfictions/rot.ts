import { Dungeon } from "./dungeon";
import { Room, Corridor } from "./features";
import { CreateCallback } from "./map";
import { shuffleArray, randomInArray } from "../util";

export interface UniformOptions {
  /** room minimum and maximum width */
  roomWidth: [number, number];

  /** room minimum and maximum height */
  roomHeight: [number, number];

  /** we stop after this percentage of level area has been dug out by rooms */
  roomDugPercentage: number;

  /** we stop after this much time has passed (msec) */
  timeLimit: number;
}

/**
 * Dungeon generator which tries to fill the space evenly. Generates independent
 * rooms and tries to connect them.
 */
export class Uniform extends Dungeon {
  protected readonly _options: UniformOptions;
  protected _map: number[][] = [[]];
  protected _dug = 0;

  /**
   * new room is created N-times until is considered as impossible to generate
   */
  protected _roomAttempts = 20;

  /**
   * corridors are tried N-times until the level is considered as impossible to
   * connect
   */
  protected _corridorAttempts = 20;

  /** list of already connected rooms */
  protected _connected: Room[] = [];

  /** list of remaining unconnected rooms */
  protected _unconnected: Room[] = [];

  constructor(width: number, height: number, options: Partial<UniformOptions>) {
    super(width, height);

    this._options = {
      roomWidth: [3, 9],
      roomHeight: [3, 5],
      roomDugPercentage: 0.1,
      timeLimit: 1000,
      ...options
    };
  }

  /**
   * Create a map. If the time limit has been hit, returns null.
   */
  create(callback: CreateCallback): boolean {
    const t1 = Date.now();
    while (1) {
      const t2 = Date.now();
      if (t2 - t1 > this._options.timeLimit) {
        return false;
      } /* time limit! */

      this._map = this._fillMap(1);
      this._dug = 0;
      this._rooms = [];
      this._unconnected = [];
      this._generateRooms();
      if (this._rooms.length < 2) {
        continue;
      }
      if (this._generateCorridors()) {
        break;
      }
    }

    if (callback) {
      for (let i = 0; i < this._width; i++) {
        for (let j = 0; j < this._height; j++) {
          callback(i, j, this._map[i][j]);
        }
      }
    }

    return true;
  }

  /**
   * Generates a suitable amount of rooms
   */
  protected _generateRooms(): void {
    const w = this._width - 2;
    const h = this._height - 2;

    let room: Room | null;
    do {
      room = this._generateRoom();
      if (this._dug / (w * h) > this._options.roomDugPercentage) {
        break;
      } /* achieved requested amount of free space */
    } while (room);

    /* either enough rooms, or not able to generate more of them :) */
  }

  /**
   * Try to generate one room
   */
  protected _generateRoom(): Room | null {
    let count = 0;
    while (count < this._roomAttempts) {
      count++;

      const room = Room.createRandom(this._width, this._height, this._options);
      if (!room.isValid(this._isWallCallback, this._canBeDugCallback)) {
        continue;
      }

      room.create(this._digCallback);
      this._rooms.push(room);
      return room;
    }

    /* no room was generated in a given number of attempts */
    return null;
  }

  /**
   * Generates connectors beween rooms
   * @returns Was this attempt successfull?
   */
  protected _generateCorridors(): boolean {
    let cnt = 0;
    while (cnt < this._corridorAttempts) {
      cnt++;
      this._corridors = [];

      /* dig rooms into a clear map */
      this._map = this._fillMap(1);
      for (const room of this._rooms) {
        room.clearDoors();
        room.create(this._digCallback);
      }

      this._unconnected = shuffleArray(this._rooms);
      this._connected = [];
      if (this._unconnected.length > 0) {
        /* first one is always connected */
        this._connected.push(this._unconnected.pop()!);
      }

      while (1) {
        /* 1. pick random connected room */
        const connected = randomInArray(this._connected);
        if (!connected) return false;

        /* 2. find closest unconnected */
        const room1 = this._closestRoom(this._unconnected, connected);
        if (!room1) return false;

        /* 3. connect it to closest connected */
        const room2 = this._closestRoom(this._connected, room1);
        if (!room2) return false;

        const ok = this._connectRooms(room1, room2);
        if (!ok) {
          break;
        } /* stop connecting, re-shuffle */

        if (!this._unconnected.length) {
          return true;
        } /* done; no rooms remain */
      }
    }
    return false;
  }

  /**
   * For a given room, find the closest one from the list
   */
  _closestRoom(rooms: Room[], room: Room): Room | null {
    let dist = Infinity;
    let result = null;

    const center = room.center;
    for (const otherRoom of rooms) {
      const otherCenter = otherRoom.center;
      const dx = otherCenter[0] - center[0];
      const dy = otherCenter[1] - center[1];
      const d = dx * dx + dy * dy;

      if (d < dist) {
        dist = d;
        result = otherRoom;
      }
    }

    return result;
  }

  protected _connectRooms(room1: Room, room2: Room): boolean {
    const center1 = room1.center;
    const center2 = room2.center;

    const diffX = center2[0] - center1[0];
    const diffY = center2[1] - center1[1];

    let dirIndex1: 0 | 1 | 2 | 3;
    let dirIndex2: 0 | 1 | 2 | 3;
    let min: number;
    let max: number;
    let index: number;
    if (Math.abs(diffX) < Math.abs(diffY)) {
      /* first try connecting north-south walls */
      dirIndex1 = diffY > 0 ? 2 : 0;
      dirIndex2 = ((dirIndex1 + 2) % 4) as any;
      min = room2.left;
      max = room2.right;
      index = 0;
    } else {
      /* first try connecting east-west walls */
      dirIndex1 = diffX > 0 ? 1 : 3;
      dirIndex2 = ((dirIndex1 + 2) % 4) as any;
      min = room2.top;
      max = room2.bottom;
      index = 1;
    }

    /* corridor will start here */
    const start = this._placeInWall(room1, dirIndex1);
    if (!start) {
      return false;
    }

    let end: [number, number];
    if (start[index] >= min && start[index] <= max) {
      /* possible to connect with straight line (I-like) */
      end = start.slice() as [number, number];
      let value: number;
      switch (dirIndex2) {
        case 0:
          value = room2.top - 1;
          break;
        case 1:
          value = room2.right + 1;
          break;
        case 2:
          value = room2.bottom + 1;
          break;
        case 3:
          value = room2.left - 1;
          break;
        default:
          throw new Error("Unexpected value!");
      }
      end[(index + 1) % 2] = value;
      this._digLine([start, end]);
    } else if (start[index] < min - 1 || start[index] > max + 1) {
      /* need to switch target wall (L-like) */
      const diff = start[index] - center2[index];
      let rotation: number;
      switch (dirIndex2) {
        case 0:
        case 1:
          rotation = diff < 0 ? 3 : 1;
          break;
        case 2:
        case 3:
          rotation = diff < 0 ? 1 : 3;
          break;
        default:
          throw new Error("Unexpected value!");
      }
      dirIndex2 = ((dirIndex2 + rotation) % 4) as any;

      end = this._placeInWall(room2, dirIndex2)!;
      if (!end) {
        return false;
      }

      const mid: [number, number] = [0, 0];
      mid[index] = start[index];
      const index2 = (index + 1) % 2;
      mid[index2] = end[index2];
      this._digLine([start, mid, end]);
    } else {
      /* use current wall pair, but adjust the line in the middle (S-like) */

      const index2 = (index + 1) % 2;
      end = this._placeInWall(room2, dirIndex2)!;
      if (!end) {
        return false;
      }
      const mid = Math.round((end[index2] + start[index2]) / 2);

      const mid1: [number, number] = [0, 0];
      const mid2: [number, number] = [0, 0];
      mid1[index] = start[index];
      mid1[index2] = mid;
      mid2[index] = end[index];
      mid2[index2] = mid;
      this._digLine([start, mid1, mid2, end]);
    }

    room1.addDoor(start[0], start[1]);
    room2.addDoor(end[0], end[1]);

    const unconnectedIndex1 = this._unconnected.indexOf(room1);
    if (unconnectedIndex1 !== -1) {
      this._unconnected.splice(unconnectedIndex1, 1);
      this._connected.push(room1);
    }

    const unconnectedIndex2 = this._unconnected.indexOf(room2);
    if (unconnectedIndex2 !== -1) {
      this._unconnected.splice(unconnectedIndex2, 1);
      this._connected.push(room2);
    }

    return true;
  }

  protected _placeInWall(
    room: Room,
    dirIndex: 0 | 1 | 2 | 3
  ): [number, number] | null {
    let start: [number, number];
    let dir: [number, number];
    let length: number;

    switch (dirIndex) {
      case 0:
        dir = [1, 0];
        start = [room.left, room.top - 1];
        length = room.right - room.left + 1;
        break;
      case 1:
        dir = [0, 1];
        start = [room.right + 1, room.top];
        length = room.bottom - room.top + 1;
        break;
      case 2:
        dir = [1, 0];
        start = [room.left, room.bottom + 1];
        length = room.right - room.left + 1;
        break;
      case 3:
        dir = [0, 1];
        start = [room.left - 1, room.top];
        length = room.bottom - room.top + 1;
        break;
      default:
        throw new Error("Invalid value!");
    }

    const avail: ([number, number] | null)[] = [];
    let lastBadIndex = -2;

    for (let i = 0; i < length; i++) {
      const x = start[0] + i * dir[0];
      const y = start[1] + i * dir[1];
      avail.push(null);

      const isWall = this._map[x][y] === 1;
      if (isWall) {
        if (lastBadIndex !== i - 1) {
          avail[i] = [x, y];
        }
      } else {
        lastBadIndex = i;
        if (i) {
          avail[i - 1] = null;
        }
      }
    }

    const filtered = avail.filter(pos => pos !== null) as [number, number][];

    return filtered.length > 0 ? randomInArray(filtered) : null;
  }

  /**
   * Dig a polyline.
   */
  protected _digLine(points: [number, number][]): void {
    for (let i = 1; i < points.length; i++) {
      const start = points[i - 1];
      const end = points[i];
      const corridor = new Corridor(start[0], start[1], end[0], end[1]);
      corridor.create(this._digCallback);
      this._corridors.push(corridor);
    }
  }

  protected _digCallback = (x: number, y: number, value: number): void => {
    this._map[x][y] = value;
    if (value === 0) {
      this._dug++;
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
}
