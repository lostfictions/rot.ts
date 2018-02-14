/**
 * Abstract terminal code module
 */
export abstract class TermColor {
  protected _context;
  constructor(context) {
    this._context = context;
  }

  abstract clearToAnsi(bg: string): string;

  abstract colorToAnsi(fg: string, bg: string): string;

  abstract positionToAnsi(x: number, y: number): string;
}
