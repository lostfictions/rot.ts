import { EventQueue } from '../eventqueue'

export abstract class Scheduler {
  protected _queue = new EventQueue()
  protected _repeat = []
  protected _current = null

  getTime(): number {
    return this._queue.getTime()
  }

  add(item, repeat: boolean): this {
    if (repeat) { this._repeat.push(item) }
    return this
  }

  /**
   * Get the time the given item is scheduled for
   */
  getTimeOf(item): number {
    return this._queue.getEventTime(item)
  }

  /**
   * Clear all items
   */
  clear(): this {
    this._queue.clear()
    this._repeat = []
    this._current = null
    return this
  }

  /**
   * Remove a previously added item
   */
  remove(item): boolean {
    const result = this._queue.remove(item)

    const index = this._repeat.indexOf(item)
    if (index !== -1) { this._repeat.splice(index, 1) }

    if (this._current === item) { this._current = null }

    return result
  }

  /**
   * Schedule next item
   */
  next() {
    this._current = this._queue.get()
    return this._current
  }
}