import { Scheduler } from './scheduler'

export interface SpeedActor {
  getSpeed(): number
}

/**
 * Speed-based scheduler
 */
export class SpeedScheduler<T extends SpeedActor> extends Scheduler<T> {
  add(item: T, repeat: boolean, time?: number): this {
    this._queue.add(item, time !== undefined ? time : 1 / item.getSpeed())
    return super.add(item, repeat)
  }

  next(): T | null {
    if (this._current && this._repeat.indexOf(this._current) !== -1) {
      this._queue.add(this._current, 1/this._current.getSpeed());
    }
    return super.next()
  }
}
