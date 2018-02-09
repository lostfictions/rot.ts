import { DisplayBackend } from "./backend";

export interface RectBackendOptions {
  forceSquareRatio: boolean;
  spacing: number;
  fontSize: number;
  width: number;
  height: number;
  border: number;
  fontFamily: string;
}

export class RectBackend implements DisplayBackend {
  protected _context;
  protected _spacingX = 0;
  protected _spacingY = 0;
  protected _canvasCache = {};
  protected _options: RectBackendOptions;

  static cache = false;

  constructor(context) {
    this._context = context;
  }

  compute(options: RectBackendOptions): void {
    this._canvasCache = {};
    this._options = options;

    var charWidth = Math.ceil(this._context.measureText("W").width);
    this._spacingX = Math.ceil(options.spacing * charWidth);
    this._spacingY = Math.ceil(options.spacing * options.fontSize);

    if (this._options.forceSquareRatio) {
      this._spacingX = this._spacingY = Math.max(
        this._spacingX,
        this._spacingY
      );
    }

    this._context.canvas.width = options.width * this._spacingX;
    this._context.canvas.height = options.height * this._spacingY;
  }

  draw(data, clearBefore: boolean): void {
    if (RectBackend.cache) {
      this._drawWithCache(data, clearBefore);
    } else {
      this._drawNoCache(data, clearBefore);
    }
  }

  computeSize(availWidth: number, availHeight: number): [number, number] {
    var width = Math.floor(availWidth / this._spacingX);
    var height = Math.floor(availHeight / this._spacingY);
    return [width, height];
  }

  computeFontSize(availWidth: number, availHeight: number): number {
    var boxWidth = Math.floor(availWidth / this._options.width);
    var boxHeight = Math.floor(availHeight / this._options.height);

    /* compute char ratio */
    var oldFont = this._context.font;
    this._context.font = "100px " + this._options.fontFamily;
    var width = Math.ceil(this._context.measureText("W").width);
    this._context.font = oldFont;
    var ratio = width / 100;

    var widthFraction = ratio * boxHeight / boxWidth;
    if (widthFraction > 1) {
      /* too wide with current aspect ratio */
      boxHeight = Math.floor(boxHeight / widthFraction);
    }
    return Math.floor(boxHeight / this._options.spacing);
  }

  eventToPosition(x: number, y: number): [number, number] {
    return [Math.floor(x / this._spacingX), Math.floor(y / this._spacingY)];
  }

  protected _drawWithCache(data, clearBefore: boolean): void {
    var x = data[0];
    var y = data[1];
    var ch = data[2];
    var fg = data[3];
    var bg = data[4];

    var hash = "" + ch + fg + bg;
    if (hash in this._canvasCache) {
      var canvas = this._canvasCache[hash];
    } else {
      var b = this._options.border;
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      canvas.width = this._spacingX;
      canvas.height = this._spacingY;
      ctx.fillStyle = bg;
      ctx.fillRect(b, b, canvas.width - b, canvas.height - b);

      if (ch) {
        ctx.fillStyle = fg;
        ctx.font = this._context.font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        var chars = [].concat(ch);
        for (var i = 0; i < chars.length; i++) {
          ctx.fillText(
            chars[i],
            this._spacingX / 2,
            Math.ceil(this._spacingY / 2)
          );
        }
      }
      this._canvasCache[hash] = canvas;
    }

    this._context.drawImage(canvas, x * this._spacingX, y * this._spacingY);
  }

  protected _drawNoCache(data, clearBefore: boolean): void {
    var x = data[0];
    var y = data[1];
    var ch = data[2];
    var fg = data[3];
    var bg = data[4];

    if (clearBefore) {
      var b = this._options.border;
      this._context.fillStyle = bg;
      this._context.fillRect(
        x * this._spacingX + b,
        y * this._spacingY + b,
        this._spacingX - b,
        this._spacingY - b
      );
    }

    if (!ch) {
      return;
    }

    this._context.fillStyle = fg;

    var chars = [].concat(ch);
    for (var i = 0; i < chars.length; i++) {
      this._context.fillText(
        chars[i],
        (x + 0.5) * this._spacingX,
        Math.ceil((y + 0.5) * this._spacingY)
      );
    }
  }
}
