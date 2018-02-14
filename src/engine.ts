import { Scheduler } from "./scheduler/scheduler";

export interface Actor {
  act(): { then?: (onResolve: () => any) => any } | void;
}

export class Engine<T extends Actor = Actor> {
  private readonly scheduler: Scheduler<T>;
  private _lock = 1;

  constructor(scheduler: Scheduler<T>) {
    this.scheduler = scheduler;
  }

  /**
   * Start the main loop. When this call returns, the loop is locked.
   */
  start(): this {
    return this.unlock();
  }

  /**
   * Interrupt the engine by an asynchronous action
   */
  lock(): this {
    this._lock++;
    return this;
  }

  /**
   * Resume execution (paused by a previous lock)
   */
  unlock(): this {
    if (!this._lock) {
      throw new Error("Cannot unlock unlocked engine");
    }
    this._lock--;

    while (!this._lock) {
      const actor = this.scheduler.next();
      if (!actor) {
        return this.lock();
      } /* no actors */
      const result = actor.act();
      if (result && result.then) {
        /* actor returned a "thenable", looks like a Promise */
        this.lock();
        result.then(this.unlock.bind(this));
      }
    }

    return this;
  }
}
