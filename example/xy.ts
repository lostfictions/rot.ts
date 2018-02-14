export class XY {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x || 0;
    this.y = y || 0;
  }

  toString(): string {
    return `${this.x},${this.y}`;
  }

  is(xy: XY): boolean {
    return this.x === xy.x && this.y === xy.y;
  }

  /**
   * Get the distance from another position in 8-way topology units (assuming
   * moving diagonally costs the same as moving horizontally).
   */
  dist8(xy: XY): number {
    const dx = xy.x - this.x;
    const dy = xy.y - this.y;
    return Math.max(Math.abs(dx), Math.abs(dy));
  }

  /**
   * Get the distance from another position in 4-way topology units.
   */
  dist4(xy: XY): number {
    const dx = xy.x - this.x;
    const dy = xy.y - this.y;
    return Math.abs(dx) + Math.abs(dy);
  }

  /**
   * Get the euclidean distance from another position.
   */
  dist(xy: XY): number {
    const dx = xy.x - this.x;
    const dy = xy.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  plus(xy: XY): XY {
    return new XY(this.x + xy.x, this.y + xy.y);
  }

  minus(xy: XY): XY {
    return new XY(this.x - xy.x, this.y - xy.y);
  }
}
