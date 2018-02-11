import { defaultRNG } from "./rng";
import { clamp, lpad } from "./util";

/**
 * Utility class for querying and manpulating color.
 */
export class Color {
  static fromString(str: string): Color {
    const rgb = rgbTupleFromString(str);
    return new Color(rgb[0], rgb[1], rgb[2]);
  }

  static fromRGBTuple(rgb: [number, number, number]): Color {
    return new Color(rgb[0], rgb[1], rgb[2]);
  }

  static fromHSLTuple(hsl: [number, number, number]): Color {
    const c = new Color(0, 0, 0);
    c._h = hsl[0];
    c._s = hsl[1];
    c._l = hsl[2];
    c.recalculateRGB();
    return c;
  }

  private _r: number;
  private _g: number;
  private _b: number;

  /**
   * Do we need to recalculate HSL if we're asked for them?
   */
  private _hslDirty = true;

  /**
   * Do we need to recalculate RGB if we're asked for them?
   */

  private _rgbDirty = true;

  private _h = -1;
  private _s = -1;
  private _l = -1;

  get r(): number {
    if (this._rgbDirty) {
      this.recalculateRGB();
    }
    return this._r;
  }

  set r(val: number) {
    if (val !== this._r) {
      this._r = clamp(val, 0, 255);
      this._hslDirty = true;
    }
  }

  get g(): number {
    if (this._rgbDirty) {
      this.recalculateRGB();
    }
    return this._g;
  }

  set g(val: number) {
    if (val !== this._g) {
      this._g = clamp(val, 0, 255);
      this._hslDirty = true;
    }
  }

  get b(): number {
    if (this._rgbDirty) {
      this.recalculateRGB();
    }
    return this._b;
  }

  set b(val: number) {
    if (val !== this._b) {
      this._b = clamp(val, 0, 255);
      this._hslDirty = true;
    }
  }

  get h(): number {
    if (this._hslDirty) {
      this.recalculateHSL();
    }
    return this._h;
  }

  set h(val: number) {
    if (val !== this._h) {
      this._h = clamp(val);
      this._rgbDirty = true;
    }
  }

  get s(): number {
    if (this._hslDirty) {
      this.recalculateHSL();
    }
    return this._s;
  }

  set s(val: number) {
    if (val !== this._s) {
      this._s = clamp(val);
      this._rgbDirty = true;
    }
  }

  get l(): number {
    if (this._hslDirty) {
      this.recalculateHSL();
    }
    return this._l;
  }

  set l(val: number) {
    if (val !== this._l) {
      this._l = clamp(val);
      this._rgbDirty = true;
    }
  }

  constructor(r: number, g: number, b: number) {
    this._r = r;
    this._g = g;
    this._b = b;
  }

  add(other: Color): Color {
    return new Color(this._r + other.r, this._g + other.g, this._b + other.b);
  }

  addAll(...others: Color[]): Color {
    const [rr, gg, bb] = others.reduce<[number, number, number]>(
      ([r, g, b], col) => [r + col.r, g + col.g, b + col.b],
      [this._r, this._g, this._b]
    );
    return new Color(rr, gg, bb);
  }

  /**
   * Multiply (mix) two colors
   */
  multiply(other: Color): Color {
    return new Color(
      Math.round(this._r * other.r / 255),
      Math.round(this._g * other.g / 255),
      Math.round(this._b * other.b / 255)
    );
  }

  multiplyAll(...others: Color[]): Color {
    const [rr, gg, bb] = others.reduce<[number, number, number]>(
      ([r, g, b], col) => [
        Math.round(r * col.r / 255),
        Math.round(g * col.g / 255),
        Math.round(b * col.b / 255)
      ],
      [this._r, this._g, this._b]
    );
    return new Color(rr, gg, bb);
  }

  /**
   * Interpolate (blend) two colors with a given factor
   */
  lerp(other: Color, factor = 0.5): Color {
    return new Color(
      Math.round(factor * (other.r - this._r)),
      Math.round(factor * (other.g - this._g)),
      Math.round(factor * (other.b - this._b))
    );
  }

  /**
   * Interpolate (blend) two colors with a given factor in HSL mode
   */
  lerpHSL(other: Color, factor = 0.5): Color {
    return Color.fromHSLTuple([
      factor * (other.h - this.h),
      factor * (other.s - this.s),
      factor * (other.l - this.l)
    ]);
  }

  /**
   * Create a new random color based on this one
   * @param diff Standard deviation or triple of standard deviations
   */
  randomize(diff: number | [number, number, number]): Color {
    let rDiff: number;
    let gDiff: number;
    let bDiff: number;

    if (typeof diff === "number") {
      const dev = Math.round(defaultRNG.getNormal(0, diff));
      [rDiff, gDiff, bDiff] = [dev, dev, dev];
    } else {
      [rDiff, gDiff, bDiff] = diff.map(d => defaultRNG.getNormal(0, d));
    }

    return new Color(this.r + rDiff, this.g + gDiff, this.b + bDiff);
  }

  toRGBString(): string {
    return `rgb(${this._r}, ${this._g}, ${this._b})`;
  }

  toHexString(): string {
    // prettier-ignore
    return `#${lpad(this._r.toString(16))}${lpad(this._g.toString(16))}${lpad(this._b.toString(16))}`;
  }

  private recalculateHSL(): void {
    const r = this._r / 255;
    const g = this._g / 255;
    const b = this._b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    this._l = (max + min) / 2;

    if (max === min) {
      // achromatic
      this._h = 0;
      this._s = 0;
    } else {
      const d = max - min;

      // prettier-ignore
      this._s = this._l > 0.5
        ? d / (2 - max - min)
        : d / (max + min);

      switch (max) {
        case r:
          this._h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          this._h = (b - r) / d + 2;
          break;
        case b:
          this._h = (r - g) / d + 4;
          break;
        default:
          throw new Error("Unexpected value when calculating HSL");
      }
      this._h /= 6;
    }

    this._hslDirty = false;
  }

  private recalculateRGB(): void {
    if (this._s === 0) {
      const value = Math.round(this._l * 255);
      this._r = value;
      this._g = value;
      this._b = value;
      return;
    } else {
      const hue2rgb = (pp: number, qq: number, t: number) => {
        const tt = t < 0 ? t + 1 : t > 1 ? t - 1 : t;

        if (tt < 1 / 6) return pp + (qq - pp) * 6 * tt;
        if (tt < 1 / 2) return qq;
        if (tt < 2 / 3) return pp + (qq - pp) * (2 / 3 - tt) * 6;
        return pp;
      };

      const q =
        this._l < 0.5
          ? this._l * (1 + this._s)
          : this._l + this._s - this._l * this._s;

      const p = 2 * this.l - q;
      this._r = hue2rgb(p, q, this._h + 1 / 3);
      this._g = hue2rgb(p, q, this._h);
      this._b = hue2rgb(p, q, this._h - 1 / 3);
    }
  }
}

function rgbTupleFromString(str: string): [number, number, number] {
  if (str in colorCache) {
    return colorCache[str];
  }

  let result: [number, number, number];
  if (str.charAt(0) === "#" && (str.length === 4 || str.length === 7)) {
    /* hex rgb */
    const matches = str.match(/[0-9a-f]/gi);
    if (!matches) {
      throw new Error("Invalid hex string!");
    }

    const values = matches.map(x => parseInt(x, 16));
    if (values.length === 3) {
      result = values.map(x => x * 17) as [number, number, number];
    } else {
      for (let i = 0; i < 3; i++) {
        values[i + 1] += 16 * values[i];
        values.splice(i, 1);
      }
      result = values as [number, number, number];
    }
  } else {
    /* decimal rgb */
    const matches = str.match(/rgb\(([0-9, ]+)\)/i);

    if (!matches) {
      throw new Error("Unrecognized color!");
    }

    // prettier-ignore
    result = matches[1].split(/\s*,\s*/).map(parseInt) as [number, number, number];
    if (result.length !== 3) {
      throw new Error("Invalid RGB string!");
    }
  }

  colorCache[str] = result;
  return result;
}

const colorCache: { [color: string]: [number, number, number] } = {
  black: [0, 0, 0],
  navy: [0, 0, 128],
  darkblue: [0, 0, 139],
  mediumblue: [0, 0, 205],
  blue: [0, 0, 255],
  darkgreen: [0, 100, 0],
  green: [0, 128, 0],
  teal: [0, 128, 128],
  darkcyan: [0, 139, 139],
  deepskyblue: [0, 191, 255],
  darkturquoise: [0, 206, 209],
  mediumspringgreen: [0, 250, 154],
  lime: [0, 255, 0],
  springgreen: [0, 255, 127],
  aqua: [0, 255, 255],
  cyan: [0, 255, 255],
  midnightblue: [25, 25, 112],
  dodgerblue: [30, 144, 255],
  forestgreen: [34, 139, 34],
  seagreen: [46, 139, 87],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  limegreen: [50, 205, 50],
  mediumseagreen: [60, 179, 113],
  turquoise: [64, 224, 208],
  royalblue: [65, 105, 225],
  steelblue: [70, 130, 180],
  darkslateblue: [72, 61, 139],
  mediumturquoise: [72, 209, 204],
  indigo: [75, 0, 130],
  darkolivegreen: [85, 107, 47],
  cadetblue: [95, 158, 160],
  cornflowerblue: [100, 149, 237],
  mediumaquamarine: [102, 205, 170],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  slateblue: [106, 90, 205],
  olivedrab: [107, 142, 35],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  mediumslateblue: [123, 104, 238],
  lawngreen: [124, 252, 0],
  chartreuse: [127, 255, 0],
  aquamarine: [127, 255, 212],
  maroon: [128, 0, 0],
  purple: [128, 0, 128],
  olive: [128, 128, 0],
  gray: [128, 128, 128],
  grey: [128, 128, 128],
  skyblue: [135, 206, 235],
  lightskyblue: [135, 206, 250],
  blueviolet: [138, 43, 226],
  darkred: [139, 0, 0],
  darkmagenta: [139, 0, 139],
  saddlebrown: [139, 69, 19],
  darkseagreen: [143, 188, 143],
  lightgreen: [144, 238, 144],
  mediumpurple: [147, 112, 216],
  darkviolet: [148, 0, 211],
  palegreen: [152, 251, 152],
  darkorchid: [153, 50, 204],
  yellowgreen: [154, 205, 50],
  sienna: [160, 82, 45],
  brown: [165, 42, 42],
  darkgray: [169, 169, 169],
  darkgrey: [169, 169, 169],
  lightblue: [173, 216, 230],
  greenyellow: [173, 255, 47],
  paleturquoise: [175, 238, 238],
  lightsteelblue: [176, 196, 222],
  powderblue: [176, 224, 230],
  firebrick: [178, 34, 34],
  darkgoldenrod: [184, 134, 11],
  mediumorchid: [186, 85, 211],
  rosybrown: [188, 143, 143],
  darkkhaki: [189, 183, 107],
  silver: [192, 192, 192],
  mediumvioletred: [199, 21, 133],
  indianred: [205, 92, 92],
  peru: [205, 133, 63],
  chocolate: [210, 105, 30],
  tan: [210, 180, 140],
  lightgray: [211, 211, 211],
  lightgrey: [211, 211, 211],
  palevioletred: [216, 112, 147],
  thistle: [216, 191, 216],
  orchid: [218, 112, 214],
  goldenrod: [218, 165, 32],
  crimson: [220, 20, 60],
  gainsboro: [220, 220, 220],
  plum: [221, 160, 221],
  burlywood: [222, 184, 135],
  lightcyan: [224, 255, 255],
  lavender: [230, 230, 250],
  darksalmon: [233, 150, 122],
  violet: [238, 130, 238],
  palegoldenrod: [238, 232, 170],
  lightcoral: [240, 128, 128],
  khaki: [240, 230, 140],
  aliceblue: [240, 248, 255],
  honeydew: [240, 255, 240],
  azure: [240, 255, 255],
  sandybrown: [244, 164, 96],
  wheat: [245, 222, 179],
  beige: [245, 245, 220],
  whitesmoke: [245, 245, 245],
  mintcream: [245, 255, 250],
  ghostwhite: [248, 248, 255],
  salmon: [250, 128, 114],
  antiquewhite: [250, 235, 215],
  linen: [250, 240, 230],
  lightgoldenrodyellow: [250, 250, 210],
  oldlace: [253, 245, 230],
  red: [255, 0, 0],
  fuchsia: [255, 0, 255],
  magenta: [255, 0, 255],
  deeppink: [255, 20, 147],
  orangered: [255, 69, 0],
  tomato: [255, 99, 71],
  hotpink: [255, 105, 180],
  coral: [255, 127, 80],
  darkorange: [255, 140, 0],
  lightsalmon: [255, 160, 122],
  orange: [255, 165, 0],
  lightpink: [255, 182, 193],
  pink: [255, 192, 203],
  gold: [255, 215, 0],
  peachpuff: [255, 218, 185],
  navajowhite: [255, 222, 173],
  moccasin: [255, 228, 181],
  bisque: [255, 228, 196],
  mistyrose: [255, 228, 225],
  blanchedalmond: [255, 235, 205],
  papayawhip: [255, 239, 213],
  lavenderblush: [255, 240, 245],
  seashell: [255, 245, 238],
  cornsilk: [255, 248, 220],
  lemonchiffon: [255, 250, 205],
  floralwhite: [255, 250, 240],
  snow: [255, 250, 250],
  yellow: [255, 255, 0],
  lightyellow: [255, 255, 224],
  ivory: [255, 255, 240],
  white: [255, 255, 255]
};
