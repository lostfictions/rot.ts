import { Scheduler } from './scheduler'

/**
 * Speed-based scheduler
 */
export class SpeedScheduler extends Scheduler {
  /**
   * @see ROT.Scheduler#add
   */
  add(item: { getSpeed(): number }, repeat: boolean, time?: number): this {
    this._queue.add(item, time !== undefined ? time : 1 / item.getSpeed())
    return super.add(item, repeat)
  }

  next() {
    if (this._current && this._repeat.indexOf(this._current) != -1) {
      this._queue.add(this._current, 1/this._current.getSpeed());
    }
    return super.next()
  }
}
