import { DisplayBackendConstructor } from "./backend";

export interface DisplayOptions {
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;

  /** See https://developer.mozilla.org/en-US/docs/Web/CSS/font */
  fontStyle: "bold" | "italic" | "" | "bold italic";

  /** Hex color of the foreground (text) */
  fg: string;

  /** Hex color of the background */
  bg: string;

  transpose: boolean;
  spacing: number;
  border: number;
  layout: DisplayBackendConstructor;
  forceSquareRatio: boolean;
  tileWidth: number;
  tileHeight: number;

  /** Maps from a character to a source x and y position in the tileset. */
  tileMap: { readonly [character: string]: [number, number] };

  /** The tileset image. */
  tileSet:
    | HTMLCanvasElement
    | HTMLImageElement
    | HTMLVideoElement
    | ImageBitmap
    | null;

  tileColorize: boolean;
  termColor: string;
}
