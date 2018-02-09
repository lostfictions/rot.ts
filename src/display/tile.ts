import { DisplayBackend } from "./backend";
import { DrawData } from "./draw-data";
import { DisplayOptions } from "./display-options";
import { RectBackend } from "./rect";

export class TileBackend extends RectBackend implements DisplayBackend {
  protected _options: DisplayOptions | null = null;
  protected _colorCanvas = document.createElement("canvas");

  constructor(context: CanvasRenderingContext2D) {
    super(context);
  }

  compute(options: DisplayOptions): void {
    this._options = options;
    this._context.canvas.width = options.width * options.tileWidth;
    this._context.canvas.height = options.height * options.tileHeight;
    this._colorCanvas.width = options.tileWidth;
    this._colorCanvas.height = options.tileHeight;
  }

  draw(data: DrawData, clearBefore: boolean): void {
    const [x, y, ch, fg, bg] = data;

    const tileWidth = this._options.tileWidth;
    const tileHeight = this._options.tileHeight;

    if (clearBefore) {
      if (this._options.tileColorize) {
        this._context.clearRect(
          x * tileWidth,
          y * tileHeight,
          tileWidth,
          tileHeight
        );
      } else {
        this._context.fillStyle = bg;
        this._context.fillRect(
          x * tileWidth,
          y * tileHeight,
          tileWidth,
          tileHeight
        );
      }
    }

    if (!ch) {
      return;
    }

    var chars = [].concat(ch);
    for (var i = 0; i < chars.length; i++) {
      const tile = this._options.tileMap[chars[i]];
      if (!tile) {
        throw new Error("Char '" + chars[i] + "' not found in tileMap");
      }

      if (this._options.tileColorize) {
        /* apply colorization */
        const canvas = this._colorCanvas;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, tileWidth, tileHeight);

        context.drawImage(
          this._options.tileSet,
          tile[0],
          tile[1],
          tileWidth,
          tileHeight,
          0,
          0,
          tileWidth,
          tileHeight
        );

        if (fg !== "transparent") {
          context.fillStyle = fg;
          context.globalCompositeOperation = "source-atop";
          context.fillRect(0, 0, tileWidth, tileHeight);
        }

        if (bg !== "transparent") {
          context.fillStyle = bg;
          context.globalCompositeOperation = "destination-over";
          context.fillRect(0, 0, tileWidth, tileHeight);
        }

        this._context.drawImage(
          canvas,
          x * tileWidth,
          y * tileHeight,
          tileWidth,
          tileHeight
        );
      } else {
        /* no colorizing, easy */
        this._context.drawImage(
          this._options.tileSet,
          tile[0],
          tile[1],
          tileWidth,
          tileHeight,
          x * tileWidth,
          y * tileHeight,
          tileWidth,
          tileHeight
        );
      }
    }
  }

  computeSize(availWidth: number, availHeight: number): [number, number] {
    var width = Math.floor(availWidth / this._options.tileWidth);
    var height = Math.floor(availHeight / this._options.tileHeight);
    return [width, height];
  }

  computeFontSize(availWidth, availHeight): [number, number] {
    var width = Math.floor(availWidth / this._options.width);
    var height = Math.floor(availHeight / this._options.height);
    return [width, height];
  }

  eventToPosition(x: number, y: number): [number, number] {
    return [
      Math.floor(x / this._options.tileWidth),
      Math.floor(y / this._options.tileHeight)
    ];
  }
}
