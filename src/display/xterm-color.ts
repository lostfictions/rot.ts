import { TermColor } from "./term-color";
import { Color } from "../color";

/**
 * xterm terminal code module
 */
export class XtermColor extends TermColor {
  clearToAnsi(bg: string): string {
    return `\x1b[0;48;5;${this._termcolor(bg)}m\x1b[2J`;
  }

  colorToAnsi(fg: string, bg: string): string {
    return `\x1b[0;38;5;${this._termcolor(fg)};48;5;${this._termcolor(bg)}m`;
  }

  positionToAnsi(x: number, y: number): string {
    return `\x1b[${y + 1};${x + 1}H`;
  }

  protected _termcolor(color: string): number {
    const SRC_COLORS = 256.0;
    const DST_COLORS = 6.0;
    const COLOR_RATIO = DST_COLORS / SRC_COLORS;
    const rgb = Color.fromString(color);
    const r = Math.floor(rgb.r * COLOR_RATIO);
    const g = Math.floor(rgb.g * COLOR_RATIO);
    const b = Math.floor(rgb.b * COLOR_RATIO);
    return r * 36 + g * 6 + b * 1 + 16;
  }
}
