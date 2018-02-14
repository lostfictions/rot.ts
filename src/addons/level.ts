import { XY } from "./xy";
import { Entity } from "./entity";
import { Being } from "./being";

import { game } from "./game";

export class Level {
  /* FIXME data structure for storing entities */
  protected _beings: { [pos: string]: Being } = {};

  /* FIXME map data */
  protected _size = new XY(80, 25);
  protected _map: { [pos: string]: Entity } = {};

  protected _empty = new Entity({ ch: ".", fg: "#888" });

  get size(): XY {
    return this._size;
  }

  setEntity(entity: Entity, xy: XY): void {
    /* FIXME remove from old position, draw */
    if (entity.level === this) {
      const oldXY = entity.xy;
      delete this._beings[oldXY.toString()];
      if (game.level === this) {
        game.draw(oldXY);
      }
    }

    /* propagate position data to the entity itself */
    entity.setPosition(xy, this);

    /* FIXME set new position, draw */
    this._beings[xy.toString()] = entity;
    if (game.level === this) {
      game.draw(xy);
      game.textBuffer.write("An entity moves to " + xy + ".");
    }
  }

  getEntityAt(xy: XY): Entity {
    return (
      this._beings[xy.toString()] || this._map[xy.toString()] || this._empty
    );
  }

  getBeings() {
    /* FIXME list of all beings */
    return this._beings;
  }
}
