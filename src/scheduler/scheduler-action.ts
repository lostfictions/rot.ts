import { Scheduler } from './scheduler'

/**
 * Action-based scheduler
 */
export class ActionScheduler<T = any> extends Scheduler<T> {
  private _defaultDuration = 1; /* for newly added */
  private _duration = this._defaultDuration; /* for this._current */

  add(item: T, repeat: boolean, time?: number): this {
    this._queue.add(item, time || this._defaultDuration);
    return super.add(item, repeat);
  }

  clear(): this {
    this._duration = this._defaultDuration;
    return super.clear();
  }

  remove(item: T): boolean {
    if (item === this._current) { this._duration = this._defaultDuration; }
    return super.remove(item);
  }


  next(): T | null {
    if (this._current && this._repeat.indexOf(this._current) != -1) {
      this._queue.add(this._current, this._duration || this._defaultDuration);
      this._duration = this._defaultDuration;
    }
    return super.next();
  }

  /**
   * Set duration for the active item
   */
  setDuration(time: number): this {
    if (this._current) { this._duration = time; }
    return this;
  }
}
