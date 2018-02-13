import { Map, CreateCallback } from "./map";
import { DEFAULT_WIDTH, DEFAULT_HEIGHT, DIRS } from "../constants";
import { rng } from "../rng";
import { shuffleArray } from "../util";

export interface RogueOptions {
  /** Number of cells to create on the horizontal (number of rooms horizontally) */
  cellWidth: number;

  /** Number of cells to create on the vertical (number of rooms vertically) */
  cellHeight: number;

  /** Room min and max width - normally set auto-magically via the constructor. */
  roomWidth: [number, number];

  /** Room min and max height - normally set auto-magically via the constructor. */
  roomHeight: [number, number];
}

export interface RoomData {
  x: number;
  y: number;
  width: number;
  height: number;
  connections: any[];
  cellx: number;
  celly: number;
}

/**
 * @author hyakugei
 *
 * Dungeon generator which uses the "orginal" Rogue dungeon generation
 * algorithm. See http://kuoi.com/~kamikaze/GameDesign/art07_rogue_dungeon.php
 */
export class Rogue extends Map {
  protected _options: RogueOptions;

  protected map: number[][] = [[]];
  protected rooms: RoomData[][] = [];
  protected connectedCells: [number, number][] = [];

  constructor(
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    options: Partial<RogueOptions>
  ) {
    super(width, height);

    this._options = { cellWidth: 3, cellHeight: 3, ...options } as any;

    /*
     * Set the room sizes according to the over-all width of the map,
     * and the cell sizes.
     */
    if (!this._options.hasOwnProperty("roomWidth")) {
      this._options["roomWidth"] = this._calculateRoomSize(
        this._width,
        this._options["cellWidth"]
      );
    }
    if (!this._options.hasOwnProperty("roomHeight")) {
      this._options["roomHeight"] = this._calculateRoomSize(
        this._height,
        this._options["cellHeight"]
      );
    }
  }

  create(callback: CreateCallback): void {
    this.map = this._fillMap(1);
    this.rooms = [];
    this.connectedCells = [];

    this._initRooms();
    this._connectRooms();
    this._connectUnconnectedRooms();
    // this._createRandomRoomConnections();
    this._createRooms();
    this._createCorridors();

    if (callback) {
      for (let i = 0; i < this._width; i++) {
        for (let j = 0; j < this._height; j++) {
          callback(i, j, this.map[i][j]);
        }
      }
    }
  }

  protected _calculateRoomSize(size: number, cell: number): [number, number] {
    let max = Math.floor(size / cell * 0.8);
    let min = Math.floor(size / cell * 0.25);
    if (min < 2) {
      min = 2;
    }
    if (max < 2) {
      max = 2;
    }
    return [min, max];
  }

  protected _initRooms(): void {
    // create rooms array. This is the "grid" list from the algo.
    for (let i = 0; i < this._options.cellWidth; i++) {
      this.rooms.push([]);
      for (let j = 0; j < this._options.cellHeight; j++) {
        this.rooms[i].push({
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          connections: [],
          cellx: i,
          celly: j
        });
      }
    }
  }

  protected _connectRooms(): void {
    // pick random starting grid
    let cgx = rng.getUniformInt(0, this._options.cellWidth - 1);
    let cgy = rng.getUniformInt(0, this._options.cellHeight - 1);

    let dirToCheck: number[];
    // find unconnected neighbour cells
    do {
      dirToCheck = shuffleArray([0, 2, 4, 6]);

      let found = false;
      do {
        found = false;
        const idx = dirToCheck.pop()!;

        const ncgx = cgx + DIRS[8][idx][0];
        const ncgy = cgy + DIRS[8][idx][1];

        if (ncgx < 0 || ncgx >= this._options.cellWidth) {
          continue;
        }
        if (ncgy < 0 || ncgy >= this._options.cellHeight) {
          continue;
        }

        const room = this.rooms[cgx][cgy];

        if (room["connections"].length > 0) {
          // as long as this room doesn't already coonect to me, we are ok with it.
          if (
            room["connections"][0][0] === ncgx &&
            room["connections"][0][1] === ncgy
          ) {
            break;
          }
        }

        const otherRoom = this.rooms[ncgx][ncgy];

        if (otherRoom["connections"].length === 0) {
          otherRoom["connections"].push([cgx, cgy]);

          this.connectedCells.push([ncgx, ncgy]);
          cgx = ncgx;
          cgy = ncgy;
          found = true;
        }
      } while (dirToCheck.length > 0 && found === false);
    } while (dirToCheck.length > 0);
  }

  protected _connectUnconnectedRooms(): void {
    // While there are unconnected rooms, try to connect them to a random
    // connected neighbor (if a room has no connected neighbors yet, just keep
    // cycling, you'll fill out to it eventually).
    const cw = this._options.cellWidth;
    const ch = this._options.cellHeight;

    this.connectedCells = shuffleArray(this.connectedCells);

    for (let i = 0; i < this._options.cellWidth; i++) {
      for (let j = 0; j < this._options.cellHeight; j++) {
        const room = this.rooms[i][j];

        if (room["connections"].length === 0) {
          const directions = shuffleArray([0, 2, 4, 6]);

          let validRoom = false;
          // prettier-ignore
          let otherRoom!: RoomData
          do {
            const dirIdx = directions.pop()!;
            const newI = i + DIRS[8][dirIdx][0];
            const newJ = j + DIRS[8][dirIdx][1];

            if (newI < 0 || newI >= cw || newJ < 0 || newJ >= ch) {
              continue;
            }

            otherRoom = this.rooms[newI][newJ];

            validRoom = true;

            if (otherRoom["connections"].length === 0) {
              break;
            }

            for (const c of otherRoom["connections"]) {
              if (c[0] === i && c[1] === j) {
                validRoom = false;
                break;
              }
            }

            if (validRoom) {
              break;
            }
          } while (directions.length > 0);

          if (validRoom) {
            room["connections"].push([otherRoom["cellx"], otherRoom["celly"]]);
          } else {
            console.log("-- Unable to connect room.");
          }
        }
      }
    }
  }

  protected _createRandomRoomConnections(_connections?: any): never {
    // Empty for now.
    throw new Error("Not yet implemented");
  }

  protected _createRooms(): void {
    // Create Rooms

    const cw = this._options.cellWidth;
    const ch = this._options.cellHeight;

    const cwp = Math.floor(this._width / cw);
    const chp = Math.floor(this._height / ch);

    for (let i = 0; i < cw; i++) {
      for (let j = 0; j < ch; j++) {
        let sx = cwp * i;
        let sy = chp * j;

        if (sx === 0) {
          sx = 1;
        }
        if (sy === 0) {
          sy = 1;
        }

        const roomWidth = this._options["roomWidth"];
        const roomHeight = this._options["roomHeight"];
        let roomw = rng.getUniformInt(roomWidth[0], roomWidth[1]);
        let roomh = rng.getUniformInt(roomHeight[0], roomHeight[1]);

        if (j > 0) {
          const otherRoom = this.rooms[i][j - 1];
          while (sy - (otherRoom["y"] + otherRoom["height"]) < 3) {
            sy++;
          }
        }

        if (i > 0) {
          const otherRoom = this.rooms[i - 1][j];
          while (sx - (otherRoom["x"] + otherRoom["width"]) < 3) {
            sx++;
          }
        }

        let sxOffset = Math.round(rng.getUniformInt(0, cwp - roomw) / 2);
        let syOffset = Math.round(rng.getUniformInt(0, chp - roomh) / 2);

        while (sx + sxOffset + roomw >= this._width) {
          if (sxOffset) {
            sxOffset--;
          } else {
            roomw--;
          }
        }

        while (sy + syOffset + roomh >= this._height) {
          if (syOffset) {
            syOffset--;
          } else {
            roomh--;
          }
        }

        sx = sx + sxOffset;
        sy = sy + syOffset;

        this.rooms[i][j]["x"] = sx;
        this.rooms[i][j]["y"] = sy;
        this.rooms[i][j]["width"] = roomw;
        this.rooms[i][j]["height"] = roomh;

        for (let ii = sx; ii < sx + roomw; ii++) {
          for (let jj = sy; jj < sy + roomh; jj++) {
            this.map[ii][jj] = 0;
          }
        }
      }
    }
  }

  protected _getWallPosition(room: RoomData, dir: number): [number, number] {
    let rx: number;
    let ry: number;
    let door: number;
    switch (dir) {
      case 1:
      case 3:
        rx = rng.getUniformInt(
          room["x"] + 1,
          room["x"] + room["width"] - 2
        );
        if (dir === 1) {
          ry = room["y"] - 2;
          door = ry + 1;
        } else {
          ry = room["y"] + room["height"] + 1;
          door = ry - 1;
        }
        this.map[rx][door] = 0; // i'm not setting a specific 'door' tile value right now, just empty space.
        break;
      case 2:
      case 4:
        ry = rng.getUniformInt(
          room["y"] + 1,
          room["y"] + room["height"] - 2
        );
        if (dir === 2) {
          rx = room["x"] + room["width"] + 1;
          door = rx - 1;
        } else {
          rx = room["x"] - 2;
          door = rx + 1;
        }
        this.map[door][ry] = 0; // i'm not setting a specific 'door' tile value right now, just empty space.
        break;
      default:
        throw new Error("Unexpected value!");
    }
    return [rx, ry];
  }

  protected _drawCorridor(
    startPosition: [number, number],
    endPosition: [number, number]
  ): void {
    const xOffset = endPosition[0] - startPosition[0];
    const yOffset = endPosition[1] - startPosition[1];

    const xAbs = Math.abs(xOffset);
    const yAbs = Math.abs(yOffset);

    const percent = rng.getUniform(); // used to split the move at different places along the long axis
    const firstHalf = percent;
    const secondHalf = 1 - percent;

    const xDir = xOffset > 0 ? 2 : 6;
    const yDir = yOffset > 0 ? 4 : 0;

    // list of tuples: element 0 is the direction, element 1 is the total value
    // to move.
    const moves: [number, number][] = [];
    if (xAbs < yAbs) {
      // move firstHalf of the y offset
      moves.push([yDir, Math.ceil(yAbs * firstHalf)]);
      // move all the x offset
      moves.push([xDir, xAbs]);
      // move sendHalf of the  y offset
      moves.push([yDir, Math.floor(yAbs * secondHalf)]);
    } else {
      //  move firstHalf of the x offset
      moves.push([xDir, Math.ceil(xAbs * firstHalf)]);
      // move all the y offset
      moves.push([yDir, yAbs]);
      // move secondHalf of the x offset.
      moves.push([xDir, Math.floor(xAbs * secondHalf)]);
    }

    let xpos = startPosition[0];
    let ypos = startPosition[1];
    this.map[xpos][ypos] = 0;

    while (moves.length > 0) {
      const move = moves.pop()!;
      while (move[1] > 0) {
        xpos += DIRS[8][move[0]][0];
        ypos += DIRS[8][move[0]][1];
        this.map[xpos][ypos] = 0;
        move[1] = move[1] - 1;
      }
    }
  }

  protected _createCorridors(): void {
    // Draw Corridors between connected rooms

    const cw = this._options.cellWidth;
    const ch = this._options.cellHeight;

    for (let i = 0; i < cw; i++) {
      for (let j = 0; j < ch; j++) {
        const room = this.rooms[i][j];

        for (const connection of room["connections"]) {
          const otherRoom = this.rooms[connection[0]][connection[1]];

          let wall: number;
          let otherWall: number;
          if (otherRoom["cellx"] > room["cellx"]) {
            wall = 2;
            otherWall = 4;
          } else if (otherRoom["cellx"] < room["cellx"]) {
            wall = 4;
            otherWall = 2;
          } else if (otherRoom["celly"] > room["celly"]) {
            wall = 3;
            otherWall = 1;
          } else if (otherRoom["celly"] < room["celly"]) {
            wall = 1;
            otherWall = 3;
          }

          this._drawCorridor(
            this._getWallPosition(room, wall!),
            this._getWallPosition(otherRoom, otherWall!)
          );
        }
      }
    }
  }
}
