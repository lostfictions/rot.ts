import { DisplayBackend } from "./backend";
import { DrawData } from "./draw-data";
import { DisplayOptions } from "./display-options";
import { mod } from "../util";

export class HexBackend implements DisplayBackend {
  protected _context: CanvasRenderingContext2D;

  protected _spacingX = 0;
  protected _spacingY = 0;
  protected _hexSize = 0;

  // prettier-ignore
  protected _options!: DisplayOptions;

  constructor(context: CanvasRenderingContext2D) {
    this._context = context;
  }

  compute(options: DisplayOptions): void {
    this._options = options;

    /* FIXME char size computation does not respect transposed hexes */
    const charWidth = Math.ceil(this._context.measureText("W").width);
    this._hexSize = Math.floor(
      options.spacing * (options.fontSize + charWidth / Math.sqrt(3)) / 2
    );
    this._spacingX = this._hexSize * Math.sqrt(3) / 2;
    this._spacingY = this._hexSize * 1.5;

    let xprop: "height" | "width";
    let yprop: "height" | "width";
    if (options.transpose) {
      xprop = "height";
      yprop = "width";
    } else {
      xprop = "width";
      yprop = "height";
    }
    this._context.canvas[xprop] = Math.ceil(
      (options.width + 1) * this._spacingX
    );
    this._context.canvas[yprop] = Math.ceil(
      (options.height - 1) * this._spacingY + 2 * this._hexSize
    );
  }

  draw(data: DrawData, clearBefore: boolean): void {
    const [x, y, ch, fg, bg] = data;

    const px = [(x + 1) * this._spacingX, y * this._spacingY + this._hexSize];

    if (this._options.transpose) {
      px.reverse();
    }

    if (clearBefore) {
      if (bg) {
        this._context.fillStyle = bg;
      }
      this._fill(px[0], px[1]);
    }

    if (!ch) {
      return;
    }

    if (fg) {
      this._context.fillStyle = fg;
    }

    const chars = ([] as string[]).concat(ch);
    for (const char of chars) {
      this._context.fillText(char, px[0], Math.ceil(px[1]));
    }
  }

  computeSize(availWidth: number, availHeight: number): [number, number] {
    let w = availWidth;
    let h = availHeight;
    if (this._options.transpose) {
      w += h;
      h = w - h;
      w -= h;
    }

    const width = Math.floor(w / this._spacingX) - 1;
    const height = Math.floor((h - 2 * this._hexSize) / this._spacingY + 1);
    return [width, height];
  }

  computeFontSize(availWidth: number, availHeight: number): number {
    let w = availWidth;
    let h = availHeight;
    if (this._options.transpose) {
      w += h;
      h = w - h;
      w -= h;
    }

    /* compute char ratio */
    const oldFont = this._context.font;
    this._context.font = "100px " + this._options.fontFamily;
    const width = Math.ceil(this._context.measureText("W").width);
    this._context.font = oldFont;
    const ratio = width / 100;

    const hexSizeWidth = 2 * w / ((this._options.width + 1) * Math.sqrt(3)) - 1;
    const hexSizeHeight = h / (2 + 1.5 * (this._options.height - 1));
    /* closest larger hexSize */
    const hexSize = Math.floor(Math.min(hexSizeWidth, hexSizeHeight)) + 1;

    /* FIXME char size computation does not respect transposed hexes */
    const fontSize =
      2 * hexSize / (this._options.spacing * (1 + ratio / Math.sqrt(3)));

    /* closest smaller fontSize */
    return Math.ceil(fontSize) - 1;
  }

  eventToPosition(x: number, y: number): [number, number] {
    // tslint:disable:no-parameter-reassignment
    let nodeSize: number;
    if (this._options.transpose) {
      x += y;
      y = x - y;
      x -= y;
      nodeSize = this._context.canvas.width;
    } else {
      nodeSize = this._context.canvas.height;
    }

    const size = nodeSize / this._options.height;
    y = Math.floor(y / size);

    if (mod(y, 2)) {
      /* odd row */
      x -= this._spacingX;
      x = 1 + 2 * Math.floor(x / (2 * this._spacingX));
    } else {
      x = 2 * Math.floor(x / (2 * this._spacingX));
    }
    // tslint:enable:no-parameter-reassignment

    return [x, y];
  }

  /**
   * Arguments are pixel values. If "transposed" mode is enabled, then these two
   * are already swapped.
   */
  protected _fill(cx: number, cy: number): void {
    const a = this._hexSize;
    const b = this._options.border;

    this._context.beginPath();

    if (this._options.transpose) {
      this._context.moveTo(cx - a + b, cy);
      this._context.lineTo(cx - a / 2 + b, cy + this._spacingX - b);
      this._context.lineTo(cx + a / 2 - b, cy + this._spacingX - b);
      this._context.lineTo(cx + a - b, cy);
      this._context.lineTo(cx + a / 2 - b, cy - this._spacingX + b);
      this._context.lineTo(cx - a / 2 + b, cy - this._spacingX + b);
      this._context.lineTo(cx - a + b, cy);
    } else {
      this._context.moveTo(cx, cy - a + b);
      this._context.lineTo(cx + this._spacingX - b, cy - a / 2 + b);
      this._context.lineTo(cx + this._spacingX - b, cy + a / 2 - b);
      this._context.lineTo(cx, cy + a - b);
      this._context.lineTo(cx - this._spacingX + b, cy + a / 2 - b);
      this._context.lineTo(cx - this._spacingX + b, cy - a / 2 + b);
      this._context.lineTo(cx, cy - a + b);
    }
    this._context.fill();
  }
}
