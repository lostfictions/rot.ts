export interface DisplayBackend {
  compute(options): void;
  draw(data, clearBefore: boolean): any;
  computeSize(availWidth: number, availHeight: number): [number, number];
  computeFontSize(availWidth: number, availHeight: number): number;
  eventToPosition(x: number, y: number): [number, number];
}
