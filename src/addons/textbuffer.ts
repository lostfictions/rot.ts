import { Display } from "..";
import { XY } from "./xy";

export interface TextBufferOptions {
  display: Display;
  position: XY;
  size: XY;
}

export class TextBuffer {
  protected _data: string[] = [];
  protected _options: TextBufferOptions;

  constructor(display: Display) {
    this._options = {
      display,
      position: new XY(),
      size: new XY()
    };
  }

  configure(options: Partial<TextBufferOptions>): void {
    this._options = {
      ...this._options,
      ...options
    };
  }

  clear(): void {
    this._data = [];
  }

  write(text: string): void {
    this._data.push(text);
  }

  flush(): void {
    const o = this._options;
    const d = o.display;
    const pos = o.position;
    const size = o.size;

    /* clear */
    for (let i = 0; i < size.x; i++) {
      for (let j = 0; j < size.y; j++) {
        d.draw(pos.x + i, pos.y + j);
      }
    }

    const text = this._data.join(" ");
    d.drawText(pos.x, pos.y, text, size.x);
  }
}
