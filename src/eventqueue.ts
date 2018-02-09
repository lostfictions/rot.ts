/**
 * Generic event queue: stores events and retrieves them based on their time
 */
export class EventQueue<T = any> {
  private _time = 0;
  private _events: T[] = [];
  private _eventTimes: number[] = [];

  /**
   * @returns Elapsed time
   */
  getTime(): number {
    return this._time;
  }

  /**
   * Clear all scheduled events
   */
  clear(): this {
    this._events = [];
    this._eventTimes = [];
    return this;
  }

  add(event: T, time: number): void {
    let index = this._events.length;
    for (let i = 0; i < this._eventTimes.length; i++) {
      if (this._eventTimes[i] > time) {
        index = i;
        break;
      }
    }

    this._events.splice(index, 0, event);
    this._eventTimes.splice(index, 0, time);
  }

  /**
   * Locates the nearest event, advances time if necessary. Returns that event and removes it from the queue.
   * @returns The event previously added by addEvent, null if no event available
   */
  get(): T | null {
    if (!this._events.length) {
      return null;
    }

    const time = this._eventTimes.splice(0, 1)[0];
    if (time > 0) {
      /* advance */
      this._time += time;
      for (let i = 0; i < this._eventTimes.length; i++) {
        this._eventTimes[i] -= time;
      }
    }

    return this._events.splice(0, 1)[0];
  }

  /**
   * Get the time associated with the given event
   */
  getEventTime(event: T): number | null {
    const index = this._events.indexOf(event);
    if (index === -1) {
      return null;
    }
    return this._eventTimes[index];
  }

  /**
   * Remove an event from the queue
   * @returns success?
   */
  remove(event: T): boolean {
    const index = this._events.indexOf(event);
    if (index === -1) {
      return false;
    }
    this._remove(index);
    return true;
  }

  /**
   * Remove an event from the queue
   */
  protected _remove(index: number): void {
    this._events.splice(index, 1);
    this._eventTimes.splice(index, 1);
  }
}
