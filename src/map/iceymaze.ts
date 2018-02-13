import { Map, CreateCallback } from "./map";
import { defaultRNG } from "../rng";

/**
 * Icey's Maze generator
 *
 * See http://www.roguebasin.roguelikedevelopment.org/index.php?title=Simple_maze
 * for explanation
 */

export class IceyMaze extends Map {
  private _regularity: number;

  constructor(width?: number, height?: number, regularity = 0) {
    super(width, height);
    this._regularity = regularity;
  }

  create(callback: CreateCallback): void {
    const map = this._fillMap(1);

    const width = this._width - this._width % 2 ? 1 : 2;
    const height = this._height - this._height % 2 ? 1 : 2;

    let done = 0;

    const dirs: [number, number][] = [[0, 0], [0, 0], [0, 0], [0, 0]];
    do {
      let cx = 1 + 2 * Math.floor(defaultRNG.getUniform() * (width - 1) / 2);
      let cy = 1 + 2 * Math.floor(defaultRNG.getUniform() * (height - 1) / 2);

      if (!done) {
        map[cx][cy] = 0;
      }

      if (!map[cx][cy]) {
        this._randomize(dirs);

        let blocked = false;
        do {
          if (
            Math.floor(defaultRNG.getUniform() * (this._regularity + 1)) === 0
          ) {
            this._randomize(dirs);
          }
          blocked = true;
          for (let i = 0; i < 4; i++) {
            const nx = cx + dirs[i][0] * 2;
            const ny = cy + dirs[i][1] * 2;
            if (this._isFree(map, nx, ny, width, height)) {
              map[nx][ny] = 0;
              map[cx + dirs[i][0]][cy + dirs[i][1]] = 0;

              cx = nx;
              cy = ny;
              blocked = false;
              done++;
              break;
            }
          }
        } while (!blocked);
      }
    } while (done + 1 < width * height / 4);

    for (let i = 0; i < this._width; i++) {
      for (let j = 0; j < this._height; j++) {
        callback(i, j, map[i][j]);
      }
    }
  }

  protected _randomize(dirs: [number, number][]): void {
    for (let i = 0; i < 4; i++) {
      dirs[i][0] = 0;
      dirs[i][1] = 0;
    }

    switch (Math.floor(defaultRNG.getUniform() * 4)) {
      case 0:
        dirs[0][0] = -1;
        dirs[1][0] = 1;
        dirs[2][1] = -1;
        dirs[3][1] = 1;
        break;
      case 1:
        dirs[3][0] = -1;
        dirs[2][0] = 1;
        dirs[1][1] = -1;
        dirs[0][1] = 1;
        break;
      case 2:
        dirs[2][0] = -1;
        dirs[3][0] = 1;
        dirs[0][1] = -1;
        dirs[1][1] = 1;
        break;
      case 3:
        dirs[1][0] = -1;
        dirs[0][0] = 1;
        dirs[3][1] = -1;
        dirs[2][1] = 1;
        break;
      default:
        throw new Error("Unexpected value!");
    }
  }

  protected _isFree(
    map: number[][],
    x: number,
    y: number,
    width: number,
    height: number
  ): boolean {
    if (x < 1 || y < 1 || x >= width || y >= height) {
      return false;
    }
    return map[x][y] !== 0;
  }
}
