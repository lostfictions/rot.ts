import { Scheduler } from './scheduler'

/**
 * Simple fair scheduler (round-robin style)
 */
export class SimpleScheduler extends Scheduler {
  add(item, repeat: boolean): this {
    this._queue.add(item, 0)
    return super.add(item, repeat)
  }

  next() {
    if (this._current && this._repeat.indexOf(this._current) !== -1) {
      this._queue.add(this._current, 0);
    }
    return super.next()
  }
}
