import { EventQueue } from '../eventqueue'

export abstract class Scheduler<T = any> {
  protected _queue = new EventQueue<T>()
  protected _repeat: T[] = []
  protected _current: T | null = null

  getTime(): number {
    return this._queue.getTime()
  }

  add(item: T, repeat: boolean): this {
    if (repeat) { this._repeat.push(item) }
    return this
  }

  /**
   * Get the time the given item is scheduled for
   */
  getTimeOf(item: T): number | null {
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
  remove(item: T): boolean {
    const result = this._queue.remove(item)

    const index = this._repeat.indexOf(item)
    if (index !== -1) { this._repeat.splice(index, 1) }

    if (this._current === item) { this._current = null }

    return result
  }

  /**
   * Schedule next item
   */
  next(): T | null {
    this._current = this._queue.get()
    return this._current
  }
}