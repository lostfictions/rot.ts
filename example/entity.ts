import { XY } from "./xy";
import { Level } from "./level";

export interface EntityVisual {
  /** The character representation of the entity. */
  ch: string;
  /** The color of the entity, as a hex string. */
  fg: string;
  bg?: string;
}

export class Entity {
  protected _visual: EntityVisual;
  protected _xy: XY | null = null;
  protected _level: Level | null = null;

  get visual(): EntityVisual {
    return this._visual;
  }
  get xy(): XY | null {
    return this._xy;
  }

  get level(): Level | null {
    return this._level;
  }

  constructor(visual: EntityVisual) {
    this._visual = visual;
  }

  setPosition(xy: XY, level: Level): void {
    this._xy = xy;
    this._level = level;
  }
}
