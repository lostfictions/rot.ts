import { DisplayBackend } from './backend'
import { mod } from '../util/number'

export interface HexBackendOptions {
  transpose: boolean
  width: number
  height: number
  fontFamily: string
  fontSize: number
  border: number
  spacing: number
}

export class HexBackend implements DisplayBackend {
  protected _context

  protected _spacingX = 0;
  protected _spacingY = 0;
  protected _hexSize = 0;
  protected _options: HexBackendOptions;

  constructor(context) {
    this._context = context
  }

  compute(options: HexBackendOptions): void {
    this._options = options;

    /* FIXME char size computation does not respect transposed hexes */
    var charWidth = Math.ceil(this._context.measureText("W").width);
    this._hexSize = Math.floor(options.spacing * (options.fontSize + charWidth/Math.sqrt(3)) / 2);
    this._spacingX = this._hexSize * Math.sqrt(3) / 2;
    this._spacingY = this._hexSize * 1.5;

    if (options.transpose) {
      var xprop = "height";
      var yprop = "width";
    } else {
      var xprop = "width";
      var yprop = "height";
    }
    this._context.canvas[xprop] = Math.ceil( (options.width + 1) * this._spacingX );
    this._context.canvas[yprop] = Math.ceil( (options.height - 1) * this._spacingY + 2*this._hexSize );
  }

  draw(data, clearBefore: boolean): void {
    var x = data[0];
    var y = data[1];
    var ch = data[2];
    var fg = data[3];
    var bg = data[4];

    var px = [
      (x+1) * this._spacingX,
      y * this._spacingY + this._hexSize
    ];
    if (this._options.transpose) { px.reverse(); }

    if (clearBefore) {
      this._context.fillStyle = bg;
      this._fill(px[0], px[1]);
    }

    if (!ch) { return; }

    this._context.fillStyle = fg;

    var chars = [].concat(ch);
    for (var i=0;i<chars.length;i++) {
      this._context.fillText(chars[i], px[0], Math.ceil(px[1]));
    }
  }

  computeSize(availWidth: number, availHeight: number): [number, number] {
    if (this._options.transpose) {
      availWidth += availHeight;
      availHeight = availWidth - availHeight;
      availWidth -= availHeight;
    }

    var width = Math.floor(availWidth / this._spacingX) - 1;
    var height = Math.floor((availHeight - 2*this._hexSize) / this._spacingY + 1);
    return [width, height];
  }

  computeFontSize(availWidth: number, availHeight: number): number {
    if (this._options.transpose) {
      availWidth += availHeight;
      availHeight = availWidth - availHeight;
      availWidth -= availHeight;
    }

    var hexSizeWidth = 2*availWidth / ((this._options.width+1) * Math.sqrt(3)) - 1;
    var hexSizeHeight = availHeight / (2 + 1.5*(this._options.height-1));
    var hexSize = Math.min(hexSizeWidth, hexSizeHeight);

    /* compute char ratio */
    var oldFont = this._context.font;
    this._context.font = "100px " + this._options.fontFamily;
    var width = Math.ceil(this._context.measureText("W").width);
    this._context.font = oldFont;
    var ratio = width / 100;

    hexSize = Math.floor(hexSize)+1; /* closest larger hexSize */

    /* FIXME char size computation does not respect transposed hexes */
    var fontSize = 2*hexSize / (this._options.spacing * (1 + ratio / Math.sqrt(3)));

    /* closest smaller fontSize */
    return Math.ceil(fontSize)-1;
  }

  eventToPosition(x: number, y: number): [number, number] {
    if (this._options.transpose) {
      x += y;
      y = x-y;
      x -= y;
      var nodeSize = this._context.canvas.width;
    } else {
      var nodeSize = this._context.canvas.height;
    }
    var size = nodeSize / this._options.height;
    y = Math.floor(y/size);

    if(mod(y, 2)) { /* odd row */
      x -= this._spacingX;
      x = 1 + 2*Math.floor(x/(2*this._spacingX));
    } else {
      x = 2*Math.floor(x/(2*this._spacingX));
    }

    return [x, y];
  }

  /**
   * Arguments are pixel values. If "transposed" mode is enabled, then these two
   * are already swapped.
   */
  protected _fill(cx: number, cy: number) {
    const a = this._hexSize;
    const b = this._options.border;

    this._context.beginPath();

    if (this._options.transpose) {
      this._context.moveTo(cx-a+b,	cy);
      this._context.lineTo(cx-a/2+b,	cy+this._spacingX-b);
      this._context.lineTo(cx+a/2-b,	cy+this._spacingX-b);
      this._context.lineTo(cx+a-b,	cy);
      this._context.lineTo(cx+a/2-b,	cy-this._spacingX+b);
      this._context.lineTo(cx-a/2+b,	cy-this._spacingX+b);
      this._context.lineTo(cx-a+b,	cy);
    } else {
      this._context.moveTo(cx,					cy-a+b);
      this._context.lineTo(cx+this._spacingX-b,	cy-a/2+b);
      this._context.lineTo(cx+this._spacingX-b,	cy+a/2-b);
      this._context.lineTo(cx,					cy+a-b);
      this._context.lineTo(cx-this._spacingX+b,	cy+a/2-b);
      this._context.lineTo(cx-this._spacingX+b,	cy-a/2+b);
      this._context.lineTo(cx,					cy-a+b);
    }
    this._context.fill();
  }
}
