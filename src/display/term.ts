import { DisplayBackend } from "./backend";
import { DrawData } from "./draw-data";
import { DisplayOptions } from "./display-options";

import { XtermColor } from "./xterm-color";
import { TermColor } from "./term-color";

/**
 * Terminal backend
 */
export class TermBackend implements DisplayBackend {
  protected _cx = -1;
  protected _cy = -1;
  protected _lastColor = "";
  protected _options = {};
  protected _ox = 0;
  protected _oy = 0;
  protected _termcolor: TermColor;

  protected _context;

  constructor(context) {
    this._context = context;
  }

  compute(options: DisplayOptions): void {
    this._options = options;
    this._ox = Math.floor((process.stdout.columns! - options.width) / 2);
    this._oy = Math.floor((process.stdout.rows! - options.height) / 2);
    this._termcolor = new XtermColor(this._context);
    this._context._termcolor = this._termcolor;
  }

  draw(data: DrawData, clearBefore: boolean): void {
    const [x, y, ch, fg, bg] = data;

    // determine if we need to move the terminal cursor
    const dx = this._ox + x;
    const dy = this._oy + y;
    if (dx < 0 || dx >= process.stdout.columns!) {
      return;
    }
    if (dy < 0 || dy >= process.stdout.rows!) {
      return;
    }
    if (dx !== this._cx || dy !== this._cy) {
      process.stdout.write(this._termcolor.positionToAnsi(dx, dy));
      this._cx = dx;
      this._cy = dy;
    }

    // terminals automatically clear, but if we're clearing when we're
    // not otherwise provided with a character, just use a space instead
    if (clearBefore) {
      if (!ch) {
        ch = " ";
      }
    }

    // if we're not clearing and not provided with a character, do nothing
    if (!ch) {
      return;
    }

    // determine if we need to change colors
    const newColor = this._termcolor.colorToAnsi(fg, bg);
    if (newColor !== this._lastColor) {
      process.stdout.write(newColor);
      this._lastColor = newColor;
    }

    // write the provided symbol to the display
    const chars = ([] as string[]).concat(ch);
    process.stdout.write(chars[0]);

    // update our position, given that we wrote a character
    this._cx++;
    if (this._cx >= process.stdout.columns!) {
      this._cx = 0;
      this._cy++;
    }
  }

  computeSize(): [number, number] {
    return [process.stdout.columns!, process.stdout.rows!];
  }

  computeFontSize(): number {
    return 12;
  }

  eventToPosition(x: number, y: number): [number, number] {
    return [x, y];
  }
}
