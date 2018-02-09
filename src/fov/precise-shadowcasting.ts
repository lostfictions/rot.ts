import { FOV, VisibilityCallback } from "./fov";

/**
 * Precise shadowcasting algorithm
 */
export class PreciseShadowcasting extends FOV {
  compute(x: number, y: number, R: number, callback: VisibilityCallback): void {
    /* this place is always visible */
    callback(x, y, 0, 1);

    /* standing in a dark place. FIXME is this a good idea?  */
    if (!this._lightPasses(x, y)) {
      return;
    }

    /* list of all shadows */
    const SHADOWS: number[][] = [];

    /* analyze surrounding cells in concentric rings, starting from the center */
    for (let r = 1; r <= R; r++) {
      const neighbors = this._getCircle(x, y, r);
      const neighborCount = neighbors.length;

      for (let i = 0; i < neighborCount; i++) {
        const [cx, cy] = neighbors[i];

        /* shift half-an-angle backwards to maintain consistency of 0-th cells */
        const A1: [number, number] = [
          i ? 2 * i - 1 : 2 * neighborCount - 1,
          2 * neighborCount
        ];
        const A2: [number, number] = [2 * i + 1, 2 * neighborCount];

        const blocks = !this._lightPasses(cx, cy);
        const visibility = this._checkVisibility(A1, A2, blocks, SHADOWS);
        if (visibility) {
          callback(cx, cy, r, visibility);
        }

        if (
          SHADOWS.length === 2 &&
          SHADOWS[0][0] === 0 &&
          SHADOWS[1][0] === SHADOWS[1][1]
        ) {
          return;
        } /* cutoff? */
      } /* for all cells in this ring */
    } /* for all rings */
  }

  /**
   * @param A1 arc start
   * @param A2 arc end
   * @param blocks Does current arc block visibility?
   * @param SHADOWS list of active shadows
   */
  protected _checkVisibility(
    A1: [number, number],
    A2: [number, number],
    blocks: boolean,
    SHADOWS: number[][]
  ): number {
    if (A1[0] > A2[0]) {
      /* split into two sub-arcs */
      const v1 = this._checkVisibility(A1, [A1[1], A1[1]], blocks, SHADOWS);
      const v2 = this._checkVisibility([0, 1], A2, blocks, SHADOWS);
      return (v1 + v2) / 2;
    }

    /* index1: first shadow >= A1 */
    let index1 = 0;
    let edge1 = false;
    while (index1 < SHADOWS.length) {
      const old = SHADOWS[index1];
      const diff = old[0] * A1[1] - A1[0] * old[1];
      if (diff >= 0) {
        /* old >= A1 */
        if (diff === 0 && !(index1 % 2)) {
          edge1 = true;
        }
        break;
      }
      index1++;
    }

    /* index2: last shadow <= A2 */
    let index2 = SHADOWS.length;
    let edge2 = false;
    while (index2--) {
      const old = SHADOWS[index2];
      const diff = A2[0] * old[1] - old[0] * A2[1];
      if (diff >= 0) {
        /* old <= A2 */
        if (diff === 0 && index2 % 2) {
          edge2 = true;
        }
        break;
      }
    }

    let visible = true;
    if (index1 === index2 && (edge1 || edge2)) {
      /* subset of existing shadow, one of the edges match */
      visible = false;
    } else if (edge1 && edge2 && index1 + 1 === index2 && index2 % 2) {
      /* completely equivalent with existing shadow */
      visible = false;
    } else if (index1 > index2 && index1 % 2) {
      /* subset of existing shadow, not touching */
      visible = false;
    }

    if (!visible) {
      return 0;
    } /* fast case: not visible */

    let visibleLength: number;

    /* compute the length of visible arc, adjust list of shadows (if blocking) */
    const remove = index2 - index1 + 1;
    if (remove % 2) {
      if (index1 % 2) {
        /* first edge within existing shadow, second outside */
        const P = SHADOWS[index1];
        visibleLength = (A2[0] * P[1] - P[0] * A2[1]) / (P[1] * A2[1]);
        if (blocks) {
          SHADOWS.splice(index1, remove, A2);
        }
      } else {
        /* second edge within existing shadow, first outside */
        const P = SHADOWS[index2];
        visibleLength = (P[0] * A1[1] - A1[0] * P[1]) / (A1[1] * P[1]);
        if (blocks) {
          SHADOWS.splice(index1, remove, A1);
        }
      }
    } else {
      if (index1 % 2) {
        /* both edges within existing shadows */
        const P1 = SHADOWS[index1];
        const P2 = SHADOWS[index2];
        visibleLength = (P2[0] * P1[1] - P1[0] * P2[1]) / (P1[1] * P2[1]);
        if (blocks) {
          SHADOWS.splice(index1, remove);
        }
      } else {
        /* both edges outside existing shadows */
        if (blocks) {
          SHADOWS.splice(index1, remove, A1, A2);
        }
        return 1; /* whole arc visible! */
      }
    }

    const arcLength = (A2[0] * A1[1] - A1[0] * A2[1]) / (A1[1] * A2[1]);

    return visibleLength / arcLength;
  }
}
