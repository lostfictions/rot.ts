import { DisplayOptions } from "./display-options";
import { DrawMap, DrawData } from "./draw-data";
import { DisplayBackend } from "./backend";
import { RectBackend } from "./rect";

import { TokenType, tokenize } from "../text";
import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from "../util";
import { capitalize } from "../util/string";

/**
 * Visual map display
 */
export class Display {
  protected readonly _context: CanvasRenderingContext2D;
  protected _data: DrawMap = {};

  /** false = nothing, true = all, object = dirty cells */
  protected _dirty: boolean | { [pos: string]: boolean } = false;

  protected _options: DisplayOptions;
  protected _backend: DisplayBackend | null = null;

  constructor(options: Partial<DisplayOptions>) {
    const canvas = document.createElement("canvas");
    this._context = canvas.getContext("2d");
    this._data = {};
    this._dirty = false; /* false = nothing, true = all, object = dirty cells */
    this._backend = null;

    const optionsWithDefaults: DisplayOptions = {
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      transpose: false,
      layout: RectBackend,
      fontSize: 15,
      spacing: 1,
      border: 0,
      forceSquareRatio: false,
      fontFamily: "monospace",
      fontStyle: "",
      fg: "#ccc",
      bg: "#000",
      tileWidth: 32,
      tileHeight: 32,
      tileMap: {},
      tileSet: null,
      tileColorize: false,
      termColor: "xterm",
      ...options
    };

    this.setOptions(optionsWithDefaults);

    this._tick = this._tick.bind(this);
    requestAnimationFrame(this._tick);
  }

  /**
   * Debug helper, ideal as a map generator callback. Always bound to this.
   */
  DEBUG = (x: number, y: number, what: number) => {
    const colors = [this._options.bg, this._options.fg];
    this.draw(x, y, null, null, colors[what % colors.length]);
  };

  /**
   * Clear the whole display (cover it with background color)
   */
  clear(): void {
    this._data = {};
    this._dirty = true;
  }

  setOptions(options: Partial<DisplayOptions>): void {
    this._options = { ...this._options, ...options };

    if (
      options.width ||
      options.height ||
      options.fontSize ||
      options.fontFamily ||
      options.spacing ||
      options.layout
    ) {
      if (options.layout) {
        this._backend = new options.layout(this._context);
      }

      const font =
        (this._options.fontStyle ? this._options.fontStyle + " " : "") +
        this._options.fontSize +
        "px " +
        this._options.fontFamily;

      this._context.font = font;
      this._backend.compute(this._options);
      this._context.font = font;
      this._context.textAlign = "center";
      this._context.textBaseline = "middle";
      this._dirty = true;
    }
  }

  /**
   * Returns currently set options
   * @returns Current options object
   */
  getOptions(): Readonly<DisplayOptions> {
    return this._options;
  }

  /**
   * Returns the DOM node of this display
   */
  getContainer(): HTMLCanvasElement {
    return this._context.canvas;
  }

  /**
   * Compute the maximum width/height to fit into a set of given constraints
   * @param availWidth Maximum allowed pixel width
   * @param availHeight Maximum allowed pixel height
   * @returns [cellWidth, cellHeight]
   */
  computeSize(availWidth: number, availHeight: number): [number, number] {
    return this._backend.computeSize(availWidth, availHeight);
  }

  /**
   * Compute the maximum font size to fit into a set of given constraints
   * @param availWidth Maximum allowed pixel width
   * @param availHeight Maximum allowed pixel height
   * @returns fontSize
   */
  computeFontSize(availWidth: number, availHeight: number): number {
    return this._backend.computeFontSize(availWidth, availHeight);
  }

  /**
   * Convert a DOM event (mouse or touch) to map coordinates. Uses first touch for multi-touch.
   * @param e event
   * @returns -1 for values outside of the canvas
   */
  eventToPosition(e: MouseEvent | TouchEvent): [number, number] {
    let x: number;
    let y: number;
    if ("touches" in e) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }

    const rect = this._context.canvas.getBoundingClientRect();
    x -= rect.left;
    y -= rect.top;

    x *= this._context.canvas.width / this._context.canvas.clientWidth;
    y *= this._context.canvas.height / this._context.canvas.clientHeight;

    if (
      x < 0 ||
      y < 0 ||
      x >= this._context.canvas.width ||
      y >= this._context.canvas.height
    ) {
      return [-1, -1];
    }

    return this._backend.eventToPosition(x, y);
  }

  /**
   * @param x
   * @param y
   * @param ch One or more chars (will be overlapping themselves)
   * @param fg foreground color
   * @param bg background color
   */
  draw(
    x: number,
    y: number,
    ch: string | string[],
    fg?: string,
    bg?: string
  ): void {
    this._data[x + "," + y] = [
      x,
      y,
      ch,
      fg || this._options.fg,
      bg || this._options.bg
    ];

    if (this._dirty === true) {
      /* will already redraw everything */
      return;
    }

    if (!this._dirty) {
      this._dirty = {};
    }
    this._dirty[x + "," + y] = true;
  }

  /**
   * Draws a text at given position. Optionally wraps at a maximum length.
   * Currently does not work with hex layout.
   *
   * @param x
   * @param y
   * @param text May contain color/background format specifiers,
   *             %c{name}/%b{name}, both optional. %c{}/%b{} resets to default.
   * @param maxWidth wrap at what width?
   * @returns number of lines drawn
   */
  drawText(x: number, y: number, text: string, maxWidth?: number): number {
    var fg = null;
    var bg = null;
    var cx = x;
    var cy = y;
    var lines = 1;
    if (!maxWidth) {
      maxWidth = this._options.width - x;
    }

    const tokens = tokenize(text, maxWidth);

    while (tokens.length) {
      /* interpret tokenized opcode stream */
      const token = tokens.shift();
      switch (token.type) {
        case TokenType.Text:
          let isPrevSpace = false;
          let isPrevFullWidth = false;
          for (let i = 0; i < token.value.length; i++) {
            const cc = token.value.charCodeAt(i);
            const c = token.value.charAt(i);

            // Assign to `true` when the current char is full-width.
            const isFullWidth =
              (cc > 0xff00 && cc < 0xff61) ||
              (cc > 0xffdc && cc < 0xffe8) ||
              cc > 0xffee;

            // Current char is space, whatever full-width or half-width both are OK.
            const isSpace =
              c.charCodeAt(0) === 0x20 || c.charCodeAt(0) === 0x3000;

            // The previous char is full-width and
            // current char is nether half-width nor a space.
            if (isPrevFullWidth && !isFullWidth && !isSpace) {
              // add an extra position
              cx++;
            }

            // The current char is full-width and
            // the previous char is not a space.
            if (isFullWidth && !isPrevSpace) {
              // add an extra position
              cx++;
            }

            this.draw(cx++, cy, c, fg, bg);
            isPrevSpace = isSpace;
            isPrevFullWidth = isFullWidth;
          }
          break;

        case TokenType.FG:
          fg = token.value || null;
          break;

        case TokenType.BG:
          bg = token.value || null;
          break;

        case TokenType.Newline:
          cx = x;
          cy++;
          lines++;
      }
    }

    return lines;
  }

  /**
   * Timer tick: update dirty parts
   */
  protected _tick(): void {
    requestAnimationFrame(this._tick);

    if (!this._dirty) {
      return;
    }

    if (this._dirty === true) {
      /* draw all */
      this._context.fillStyle = this._options.bg;
      this._context.fillRect(
        0,
        0,
        this._context.canvas.width,
        this._context.canvas.height
      );

      for (var id in this._data) {
        /* redraw cached data */
        this._draw(id, false);
      }
    } else {
      /* draw only dirty */
      for (var key in this._dirty) {
        this._draw(key, true);
      }
    }

    this._dirty = false;
  }

  /**
   * @param key What to draw
   * @param clearBefore Is it necessary to clean before?
   */
  protected _draw(key: string, clearBefore: boolean): void {
    const data = this._data[key];
    this._backend.draw(data, clearBefore || data[4] !== this._options.bg);
  }
}
