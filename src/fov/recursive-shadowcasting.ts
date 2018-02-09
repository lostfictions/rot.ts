import { FOV, VisibilityCallback } from "./fov";

/**
 * Recursive shadowcasting algorithm
 *
 * Currently only supports 4/8 topologies, not hexagonal. Based on Peter
 * Harkins' implementation of Björn Bergström's algorithm described here:
 * http://www.roguebasin.com/index.php?title=FOV_using_recursive_shadowcasting
 */
export class RecursiveShadowcasting extends FOV {
  /** Octants used for translating recursive shadowcasting offsets */
  // prettier-ignore
  static readonly OCTANTS: ReadonlyArray<[number, number, number, number]> = [
    [-1,  0,  0,  1],
    [ 0, -1,  1,  0],
    [ 0, -1, -1,  0],
    [-1,  0,  0, -1],
    [ 1,  0,  0, -1],
    [ 0,  1, -1,  0],
    [ 0,  1,  1,  0],
    [ 1,  0,  0,  1]
  ]

  /**
   * Compute visibility for a 360-degree circle
   */
  compute(x: number, y: number, R: number, callback: VisibilityCallback): void {
    // You can always see your own tile
    callback(x, y, 0, 1);
    for (const octant of RecursiveShadowcasting.OCTANTS) {
      this._renderOctant(x, y, octant, R, callback);
    }
  }

  /**
   * Compute visibility for a 180-degree arc
   * @param x
   * @param y
   * @param R Maximum visibility radius
   * @param dir Direction to look in (expressed in a DIRS value);
   * @param callback
   */
  compute180(
    x: number,
    y: number,
    R: number,
    dir: number,
    callback: VisibilityCallback
  ): void {
    // You can always see your own tile
    callback(x, y, 0, 1);

    // Need to retrieve the previous octant to render a full 180 degrees
    const previousOctant = (dir - 1 + 8) % 8;

    // Need to retrieve the previous two octants to render a full 180 degrees
    const nextPreviousOctant = (dir - 2 + 8) % 8;

    // Need to grab to next octant to render a full 180 degrees
    const nextOctant = (dir + 1 + 8) % 8;

    this._renderOctant(
      x,
      y,
      RecursiveShadowcasting.OCTANTS[nextPreviousOctant],
      R,
      callback
    );
    this._renderOctant(
      x,
      y,
      RecursiveShadowcasting.OCTANTS[previousOctant],
      R,
      callback
    );
    this._renderOctant(x, y, RecursiveShadowcasting.OCTANTS[dir], R, callback);
    this._renderOctant(
      x,
      y,
      RecursiveShadowcasting.OCTANTS[nextOctant],
      R,
      callback
    );
  }

  /**
   * Compute visibility for a 90-degree arc
   * @param x
   * @param y
   * @param R Maximum visibility radius
   * @param dir Direction to look in (expressed in a ROT.DIRS value);
   * @param callback
   */
  compute90(
    x: number,
    y: number,
    R: number,
    dir: number,
    callback: VisibilityCallback
  ): void {
    // You can always see your own tile
    callback(x, y, 0, 1);

    // Need to retrieve the previous octant to render a full 90 degrees
    const previousOctant = (dir - 1 + 8) % 8;
    this._renderOctant(x, y, RecursiveShadowcasting.OCTANTS[dir], R, callback);
    this._renderOctant(
      x,
      y,
      RecursiveShadowcasting.OCTANTS[previousOctant],
      R,
      callback
    );
  }

  /**
   * Render one octant (45-degree arc) of the viewshed
   * @param x
   * @param y
   * @param octant Octant to be rendered
   * @param R Maximum visibility radius
   * @param callback
   */
  protected _renderOctant(
    x: number,
    y: number,
    octant: [number, number, number, number],
    R: number,
    callback: VisibilityCallback
  ): void {
    // Radius incremented by 1 to provide same coverage area as other shadowcasting radiuses
    this._castVisibility(
      x,
      y,
      1,
      1,
      0,
      R + 1,
      octant[0],
      octant[1],
      octant[2],
      octant[3],
      callback
    );
  }

  /**
   * Actually calculates the visibility
   * @param startX The starting X coordinate
   * @param startY The starting Y coordinate
   * @param row The row to render
   * @param visSlopeStart The slope to start at
   * @param visSlopeEnd The slope to end at
   * @param radius The radius to reach out to
   * @param xx
   * @param xy
   * @param yx
   * @param yy
   * @param callback The callback to use when we hit a block that is visible
   */
  protected _castVisibility(
    startX: number,
    startY: number,
    row: number,
    visSlopeStart: number,
    visSlopeEnd: number,
    radius: number,
    xx: number,
    xy: number,
    yx: number,
    yy: number,
    callback: VisibilityCallback
  ): void {
    if (visSlopeStart < visSlopeEnd) {
      return;
    }

    for (let i = row; i <= radius; i++) {
      let dx = -i - 1;
      const dy = -i;

      let blocked = false;
      let newStart = 0;

      // 'Row' could be column, names here assume octant 0 and would be flipped for half the octants
      while (dx <= 0) {
        dx += 1;

        // Translate from relative coordinates to map coordinates
        const mapX = startX + dx * xx + dy * xy;
        const mapY = startY + dx * yx + dy * yy;

        // Range of the row
        const slopeStart = (dx - 0.5) / (dy + 0.5);
        const slopeEnd = (dx + 0.5) / (dy - 0.5);

        // Ignore if not yet at left edge of Octant
        if (slopeEnd > visSlopeStart) {
          continue;
        }

        // Done if past right edge
        if (slopeStart < visSlopeEnd) {
          break;
        }

        // If it's in range, it's visible
        if (dx * dx + dy * dy < radius * radius) {
          callback(mapX, mapY, i, 1);
        }

        if (!blocked) {
          // If tile is a blocking tile, cast around it
          if (!this._lightPasses(mapX, mapY) && i < radius) {
            blocked = true;

            this._castVisibility(
              startX,
              startY,
              i + 1,
              visSlopeStart,
              slopeStart,
              radius,
              xx,
              xy,
              yx,
              yy,
              callback
            );

            newStart = slopeEnd;
          }
        } else {
          // Keep narrowing if scanning across a block
          if (!this._lightPasses(mapX, mapY)) {
            newStart = slopeEnd;
            continue;
          }

          // Block has ended
          blocked = false;

          // tslint:disable-next-line:no-parameter-reassignment
          visSlopeStart = newStart;
        }
      }

      if (blocked) {
        break;
      }
    }
  }
}
