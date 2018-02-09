import { DisplayOptions } from "./display-options";
import { DrawData } from "./draw-data";

export interface DisplayBackendConstructor {
  new (context: any): DisplayBackend;
}

export interface DisplayBackend {
  compute(options: DisplayOptions): void;
  draw(data: DrawData, clearBefore: boolean): any;
  computeSize(availWidth: number, availHeight: number): [number, number];
  computeFontSize(availWidth: number, availHeight: number): number;
  eventToPosition(x: number, y: number): [number, number];
}
