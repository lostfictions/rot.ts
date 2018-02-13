/* eslint-disable
    no-undef,
    no-unused-vars,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// engineTest.coffee
//----------------------------------------------------------------------------

const _ = require("underscore");
const should = require("should");
const ROT = require("../lib/rot");

describe("engine", function() {
  it("should export ROT.Engine", () => ROT.should.have.property("Engine"));
    
  it("should be possible to create an Engine", function() {
    const engine = new ROT.Engine();
    return engine.should.be.ok;
  });
  
  return describe("Engine", function() {
    describe("Engine", function() {
      it("should cache the provided scheduler", function() {
        let myScheduler;
        const engine = new ROT.Engine(myScheduler =
          {next() {}}
        );
        return engine._scheduler.should.equal(myScheduler);
      });

      return it("should lock the engine at construction", function() {
        const MOCK_actor =
          {act() {}};
        const MOCK_scheduler =
          {next() { return MOCK_actor; }};
        const engine = new ROT.Engine(MOCK_scheduler);
        return engine._lock.should.be.greaterThan(0);
      });
    });

    describe("start", () =>
      it("should call the unlock method", function(done) {
        const MOCK_actor =
          {act() {}};
        const MOCK_scheduler =
          {next() { return MOCK_actor; }};
        const engine = new ROT.Engine(MOCK_scheduler);
        engine.unlock = () => done();
        return engine.start();
      })
    );

    describe("lock", () =>
      it("should increase the recursive lock count", function() {
        const MOCK_actor =
          {act() {}};
        const MOCK_scheduler =
          {next() { return MOCK_actor; }};
        const engine = new ROT.Engine(MOCK_scheduler);
        engine._lock.should.equal(1);
        engine.lock();
        engine._lock.should.equal(2);
        engine.lock();
        return engine._lock.should.equal(3);
      })
    );

    return describe("unlock", function() {
      it("should throw an error if unlocked beyond recursion", function() {
        const MOCK_actor =
          {act() {}};
        const MOCK_scheduler =
          {next() { return MOCK_actor; }};
        const engine = new ROT.Engine(MOCK_scheduler);
        engine._lock.should.equal(1);
        engine._lock = 0;
        engine._lock.should.equal(0);
        return should.throws(() => engine.unlock());
      });

      it("should re-lock the engine if no actors are provided", function() {
        const MOCK_scheduler =
          {next() { return null; }};
        const engine = new ROT.Engine(MOCK_scheduler);
        engine._lock.should.equal(1);
        engine.unlock();
        return engine._lock.should.equal(1);
      });

      it("should re-lock the engine if an actor returns a Promise", function() {
        const MOCK_actor = {
          act() {
            let promise;
            return promise =
              {"then"(keepPromise, breakPromise) {}};
          }
        };
        const MOCK_scheduler =
          {next() { return MOCK_actor; }};
        const engine = new ROT.Engine(MOCK_scheduler);
        engine._lock.should.equal(1);
        engine.unlock();
        return engine._lock.should.equal(1);
      });

      return it("should keep acting until locked again", function() {
        const MOCK_scheduler =
          {next() {}};
        const engine = new ROT.Engine(MOCK_scheduler);
        const maybeLock = _.after(5, (() => engine.lock()));
        const MOCK_actor = {
          count: 0,
          act() {
            this.count++;
            if (this.count > 10) { throw new Error("Acting too much!"); }
            return maybeLock();
          }
        };
        MOCK_scheduler.next = () => MOCK_actor;
        engine.unlock();
        engine._lock.should.equal(1);
        return MOCK_actor.count.should.equal(5);
      });
    });
  });
});

//----------------------------------------------------------------------------
// end of engineTest.coffee
