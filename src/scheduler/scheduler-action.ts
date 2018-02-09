import { Scheduler } from './scheduler'

/**
 * Action-based scheduler
 */
export class ActionScheduler extends Scheduler {
  private _defaultDuration = 1; /* for newly added */
  private _duration = this._defaultDuration; /* for this._current */

  add(item, repeat: boolean, time?: number): this {
    this._queue.add(item, time || this._defaultDuration);
    return super.add(item, repeat);
  }

  clear(): this {
    this._duration = this._defaultDuration;
    return super.clear();
  }

  remove(item): boolean {
    if (item === this._current) { this._duration = this._defaultDuration; }
    return super.remove(item);
  }

  /**
   * @see ROT.Scheduler#next
   */
  next() {
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