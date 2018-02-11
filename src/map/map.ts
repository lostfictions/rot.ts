import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from "../constants";

export type CreateCallback<T = number> = (
  x: number,
  y: number,
  contents: T
) => any;

/**
 * Base map generator
 */
export abstract class Map<T = number> {
  protected _width: number;
  protected _height: number;

  constructor(width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
    this._width = width;
    this._height = height;
  }

  abstract create(callback: CreateCallback): void;

  protected _fillMap(value: T): T[][] {
    const map: T[][] = [];
    for (let i = 0; i < this._width; i++) {
      map.push([]);
      for (let j = 0; j < this._height; j++) {
        map[i].push(value);
      }
    }
    return map;
  }
}
