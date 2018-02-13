/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// schedulerSimpleTest.coffee
//----------------------------------------------------------------------------

const _ = require("underscore");
const should = require("should");
const ROT = require("../../lib/rot");

describe("scheduler", function() {
  it("should export ROT.Scheduler.Simple", function() {
    ROT.should.have.property("Scheduler");
    return ROT.Scheduler.should.have.property("Simple");
  });
    
  it("should be possible to create a Simple", function() {
    const simple = new ROT.Scheduler.Simple();
    return simple.should.be.ok;
  });
  
  return describe("Simple", function() {
    let simple = null;
    
    beforeEach(function() {
      simple = new ROT.Scheduler.Simple();
      return simple.should.be.ok;
    });

    it("should extend Scheduler", function() {
      simple.should.be.an.instanceof(ROT.Scheduler);
      return simple.should.be.an.instanceof(ROT.Scheduler.Simple);
    });

    describe("add", () =>
      it("should add the item to the backing queue", function(done) {
        simple._queue.add = () => done();
        return simple.add("Non-Repeating Event", false);
      })
    );

    return describe("next", function() {
      it("should return the next item from the backing queue", function() {
        simple.add("Non-Repeating Event", false);
        const event = simple.next();
        return event.should.equal("Non-Repeating Event");
      });

      return it("should return repeating events to the queue", function(done) {
        const almostDone = _.after(2, done);
        simple.add("Repeating Event 1", true);
        simple.add("Repeating Event 2", true);
        simple._queue.add = () => almostDone();
        let event = simple.next();
        event.should.equal("Repeating Event 1");
        event = simple.next();
        event.should.equal("Repeating Event 2");
        return simple.next();
      });
    });
  });
});

//----------------------------------------------------------------------------
// end of schedulerSimpleTest.coffee
