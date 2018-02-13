import { Map, CreateCallback } from "./map";
import { randomInArray } from "../util";

/**
 * Recursively divided maze,
 * http://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method
 */
export class DividedMaze extends Map {
  /** [left, top, right, bottom] */
  protected _stack: [number, number, number, number][] = [];

  protected _map: number[][] = [[]];

  create(callback: CreateCallback): void {
    const w = this._width;
    const h = this._height;

    const map: number[][] = [];

    for (let i = 0; i < w; i++) {
      map.push([]);
      for (let j = 0; j < h; j++) {
        const border = i === 0 || j === 0 || i + 1 === w || j + 1 === h;
        map[i].push(border ? 1 : 0);
      }
    }

    this._stack = [[1, 1, w - 2, h - 2]];
    this._process();

    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        callback(i, j, map[i][j]);
      }
    }
  }

  protected _process(): void {
    while (this._stack.length) {
      const room = this._stack.shift()!;
      this._partitionRoom(room);
    }
  }

  protected _partitionRoom(room: [number, number, number, number]): void {
    const availX = [];
    const availY = [];

    for (let i = room[0] + 1; i < room[2]; i++) {
      const top = this._map[i][room[1] - 1];
      const bottom = this._map[i][room[3] + 1];
      if (top && bottom && !(i % 2)) {
        availX.push(i);
      }
    }

    for (let j = room[1] + 1; j < room[3]; j++) {
      const left = this._map[room[0] - 1][j];
      const right = this._map[room[2] + 1][j];
      if (left && right && !(j % 2)) {
        availY.push(j);
      }
    }

    if (!availX.length || !availY.length) {
      return;
    }

    const x = randomInArray(availX)!;
    const y = randomInArray(availY)!;

    this._map[x][y] = 1;

    const walls: [number, number][][] = [];

    const leftWall: [number, number][] = [];
    walls.push(leftWall);
    for (let i = room[0]; i < x; i++) {
      this._map[i][y] = 1;
      leftWall.push([i, y]);
    }

    const rightWall: [number, number][] = [];
    walls.push(rightWall);
    for (let i = x + 1; i <= room[2]; i++) {
      this._map[i][y] = 1;
      rightWall.push([i, y]);
    }

    const topWall: [number, number][] = [];
    walls.push(topWall);
    for (let j = room[1]; j < y; j++) {
      this._map[x][j] = 1;
      topWall.push([x, j]);
    }

    const bottomWall: [number, number][] = [];
    walls.push(bottomWall);
    for (let j = y + 1; j <= room[3]; j++) {
      this._map[x][j] = 1;
      bottomWall.push([x, j]);
    }

    const solid = randomInArray(walls)!;
    for (const wall of walls) {
      if (wall === solid) {
        continue;
      }

      const hole = randomInArray(wall)!;
      this._map[hole[0]][hole[1]] = 0;
    }

    this._stack.push([room[0], room[1], x - 1, y - 1]); /* left top */
    this._stack.push([x + 1, room[1], room[2], y - 1]); /* right top */
    this._stack.push([room[0], y + 1, x - 1, room[3]]); /* left bottom */
    this._stack.push([x + 1, y + 1, room[2], room[3]]); /* right bottom */
  }
}
