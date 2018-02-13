import { Map, CreateCallback } from "./map";
import { rng } from "../rng";

/**
 * Maze generator - Eller's algorithm
 *
 * See http://homepages.cwi.nl/~tromp/maze.html for explanation
 */
export class EllerMaze extends Map {
  create(callback: CreateCallback): void {
    const map = this._fillMap(1);
    const w = Math.ceil((this._width - 2) / 2);

    const rand = 9 / 24;

    const L: number[] = [];
    const R: number[] = [];

    for (let i = 0; i < w; i++) {
      L.push(i);
      R.push(i);
    }
    L.push(w - 1); /* fake stop-block at the right side */

    let j: number;
    for (j = 1; j + 3 < this._height; j += 2) {
      /* one row */
      for (let i = 0; i < w; i++) {
        /* cell coords (will be always empty) */
        const x = 2 * i + 1;
        const y = j;
        map[x][y] = 0;

        /* right connection */
        if (i !== L[i + 1] && rng.getUniform() > rand) {
          this._addToList(i, L, R);
          map[x + 1][y] = 0;
        }

        /* bottom connection */
        if (i !== L[i] && rng.getUniform() > rand) {
          /* remove connection */
          this._removeFromList(i, L, R);
        } else {
          /* create connection */
          map[x][y + 1] = 0;
        }
      }
    }

    /* last row */
    for (let i = 0; i < w; i++) {
      /* cell coords (will be always empty) */
      const x = 2 * i + 1;
      const y = j;
      map[x][y] = 0;

      /* right connection */
      if (i !== L[i + 1] && (i === L[i] || rng.getUniform() > rand)) {
        /* dig right also if the cell is separated, so it gets connected to the rest of maze */
        this._addToList(i, L, R);
        map[x + 1][y] = 0;
      }

      this._removeFromList(i, L, R);
    }

    for (let i = 0; i < this._width; i++) {
      for (let jj = 0; jj < this._height; jj++) {
        callback(i, jj, map[i][jj]);
      }
    }
  }

  /**
   * Remove "i" from its list
   */
  protected _removeFromList(i: number, L: number[], R: number[]): void {
    R[L[i]] = R[i];
    L[R[i]] = L[i];
    R[i] = i;
    L[i] = i;
  }

  /**
   * Join lists with "i" and "i+1"
   */
  protected _addToList(i: number, L: number[], R: number[]): void {
    R[L[i + 1]] = R[i];
    L[R[i]] = L[i + 1];
    R[i] = i + 1;
    L[i + 1] = i;
  }
}
