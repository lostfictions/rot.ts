import { SpeedScheduler, Engine, Display } from "..";

import { Being } from "./being";
import { Player } from "./player";
import { Level } from "./level";
import { TextBuffer } from "./textbuffer";
import { XY } from "./xy";

export class Game {
  // prettier-ignore
  scheduler!: SpeedScheduler<Being>;

  // prettier-ignore
  engine!: Engine;

  // prettier-ignore
  player!: Player;

  // prettier-ignore
  level!: Level;

  // prettier-ignore
  display!: Display;

  // prettier-ignore
  textBuffer!: TextBuffer;

  init(): void {
    window.addEventListener("load", this);
  }

  handleEvent(e: Event): void {
    switch (e.type) {
      case "load":
        window.removeEventListener("load", this);

        this.scheduler = new SpeedScheduler();
        this.engine = new Engine(this.scheduler);
        this.display = new Display({ fontSize: 16 });
        this.textBuffer = new TextBuffer(this.display);
        document.body.appendChild(this.display.getContainer());
        this.player = new Player();

        /* FIXME build a level and position a player */
        const level = new Level();
        const size = level.size;
        this._switchLevel(level);
        this.level.setEntity(
          this.player,
          new XY(Math.round(size.x / 2), Math.round(size.y / 2))
        );

        this.engine.start();
    }
  }

  draw(xy: XY): void {
    const entity = this.level.getEntityAt(xy);
    const visual = entity.visual;
    this.display.draw(xy.x, xy.y, visual.ch, visual.fg, visual.bg);
  }

  over(): void {
    this.engine.lock();
    /* FIXME show something */
  }

  protected _switchLevel(level: Level): void {
    /* remove old beings from the scheduler */
    this.scheduler.clear();

    this.level = level;
    const size = this.level.size;

    const bufferSize = 3;
    this.display.setOptions({ width: size.x, height: size.y + bufferSize });
    this.textBuffer.configure({
      display: this.display,
      position: new XY(0, size.y),
      size: new XY(size.x, bufferSize)
    });
    this.textBuffer.clear();

    /* FIXME draw a level */
    const xy = new XY();
    for (let i = 0; i < size.x; i++) {
      xy.x = i;
      for (let j = 0; j < size.y; j++) {
        xy.y = j;
        this.draw(xy);
      }
    }

    /* add new beings to the scheduler */
    const beings = this.level.getBeings();
    for (const being of Object.values(beings)) {
      this.scheduler.add(being, true);
    }
  }
}

/** Game state singleton */
export const game = new Game();

game.init();
