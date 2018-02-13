/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// schedulerActionTest.coffee
//----------------------------------------------------------------------------

const _ = require("underscore");
const should = require("should");
const ROT = require("../../lib/rot");

const NO_REPEAT = false;
const YES_REPEAT = true;

const DEFAULT_DURATION = 42;

describe("scheduler", function() {
  it("should export ROT.Scheduler.Action", function() {
    ROT.should.have.property("Scheduler");
    return ROT.Scheduler.should.have.property("Action");
  });
    
  it("should be possible to create a Action", function() {
    const action = new ROT.Scheduler.Action();
    return action.should.be.ok;
  });
  
  return describe("Action", function() {
    let action = null;
    
    beforeEach(function() {
      action = new ROT.Scheduler.Action();
      return action.should.be.ok;
    });

    it("should extend Scheduler", function() {
      action.should.be.an.instanceof(ROT.Scheduler);
      return action.should.be.an.instanceof(ROT.Scheduler.Action);
    });

    describe("add", function() {
      it("should add the event to the queue with a default time", function(done) {
        action._defaultDuration = DEFAULT_DURATION;
        action._queue.add = function(item, time) {
          if (time === DEFAULT_DURATION) { return done(); }
        };
        return action.add("Event 1", NO_REPEAT);
      });

      return it("should add the event to the queue with a specified time", function(done) {
        action._defaultDuration = DEFAULT_DURATION;
        action._queue.add = function(item, time) {
          if (time === 69) { return done(); }
        };
        return action.add("Event 1", NO_REPEAT, 69);
      });
    });

    describe("clear", () =>
      it("should clear the last duration", function() {
        action._defaultDuration = DEFAULT_DURATION;
        action.setDuration(69);
        action.clear();
        return action._duration.should.equal(DEFAULT_DURATION);
      })
    );

    describe("remove", function() {
      it("should clear the duration when removing the current item", function() {
        action._defaultDuration = DEFAULT_DURATION;
        action.add("Old Faithful", YES_REPEAT, 100);
        let event = action.next();
        event.should.equal("Old Faithful");
        action.setDuration(100);
        event = action.next();
        event.should.equal("Old Faithful");
        action.setDuration(100);
        action._duration.should.equal(100);
        action.remove("Old Faithful");
        return action._duration.should.equal(DEFAULT_DURATION);
      });

      return it("should not clear the duration when not removing the current item", function() {
        action._defaultDuration = DEFAULT_DURATION;
        action.add("Old Faithful", YES_REPEAT, 100);
        action.add("New Unreliable", YES_REPEAT, 100);
        let event = action.next();
        event.should.equal("Old Faithful");
        action.setDuration(100);
        event = action.next();
        event.should.equal("New Unreliable");
        action.setDuration(100);
        action._duration.should.equal(100);
        action.remove("Old Faithful");
        return action._duration.should.equal(100);
      });
    });

    return describe("next", () =>
      it("should use the default duration if given a bad duration", function() {
        action._defaultDuration = DEFAULT_DURATION;
        action.add("Old Faithful", YES_REPEAT, 100);
        let event = action.next();
        event.should.equal("Old Faithful");
        action.setDuration(null);
        event = action.next();
        action._duration.should.equal(DEFAULT_DURATION);
        event.should.equal("Old Faithful");
        action.setDuration(100);
        action._duration.should.equal(100);
        action.remove("Old Faithful");
        return action._duration.should.equal(DEFAULT_DURATION);
      })
    );
  });
});

//----------------------------------------------------------------------------
// end of schedulerActionTest.coffee
