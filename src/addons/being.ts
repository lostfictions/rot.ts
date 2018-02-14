import { SpeedActor, Actor } from "../";

import { Entity } from "./entity";
import { XY } from "./xy";
import { Level } from "./level";

import { game } from "./game";

export abstract class Being extends Entity implements SpeedActor, Actor {
  protected _speed = 100;
  protected _hp = 10;

  /**
   * Called by the Scheduler
   */
  getSpeed(): number {
    return this._speed;
  }

  damage(damage: number): void {
    this._hp -= damage;
    if (this._hp <= 0) {
      this.die();
    }
  }

  abstract act(): void;

  die(): void {
    game.scheduler.remove(this);
  }

  setPosition(xy: XY, level: Level): void {
    /* came to a currently active level; add self to the scheduler */
    if (level !== this._level && level === game.level) {
      game.scheduler.add(this, true);
    }

    return super.setPosition(xy, level);
  }
}
