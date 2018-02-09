/**
 * Generic event queue: stores events and retrieves them based on their time
 */
export class EventQueue {
  private _time = 0;
  private _events = [];
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

  add(event, time: number): void {
    var index = this._events.length;
    for (var i=0;i<this._eventTimes.length;i++) {
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
  get(): object | null {
    if (!this._events.length) { return null; }

    const time = this._eventTimes.splice(0, 1)[0]
    if (time > 0) { /* advance */
      this._time += time;
      for (let i = 0; i < this._eventTimes.length; i++) { this._eventTimes[i] -= time }
    }

    return this._events.splice(0, 1)[0];
  }

  /**
   * Get the time associated with the given event
   */
  getEventTime(event): number {
    var index = this._events.indexOf(event);
    if (index == -1) { return undefined }
    return this._eventTimes[index];
  }

  /**
   * Remove an event from the queue
   * @returns success?
   */
  remove(event): boolean {
    var index = this._events.indexOf(event);
    if (index == -1) { return false }
    this._remove(index);
    return true;
  }

  /**
   * Remove an event from the queue
   */
  _remove(index: number): void {
    this._events.splice(index, 1);
    this._eventTimes.splice(index, 1);
  }
}
