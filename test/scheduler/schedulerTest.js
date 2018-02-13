/* eslint-disable
    no-undef,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// schedulerTest.coffee
//----------------------------------------------------------------------------

const should = require("should");
const ROT = require("../../lib/rot");

describe("scheduler", function() {
  it("should export ROT.Scheduler", () => ROT.should.have.property("Scheduler"));
    
  it("should be possible to create a Scheduler", function() {
    const scheduler = new ROT.Scheduler();
    return scheduler.should.be.ok;
  });
  
  return describe("Scheduler", function() {
    let scheduler = null;
    
    beforeEach(function() {
      scheduler = new ROT.Scheduler();
      return scheduler.should.be.ok;
    });

    describe("Scheduler", () =>
      it("should initialize some properties", () => scheduler.should.have.properties(["_queue", "_repeat", "_current"]))
  );

    describe("getTime", () =>
      it("should provide the time of the backing queue", function(done) {
        scheduler._queue.getTime = () => done();
        return scheduler.getTime();
      })
    );

    describe("add", function() {
      it("should not add ad-hoc items to the repeat list", function() {
        scheduler.add("One Time Event", false);
        return scheduler._repeat.length.should.equal(0);
      });

      return it("should add repeat items to the repeat list", function() {
        scheduler.add("Repeating Event", true);
        return scheduler._repeat.length.should.equal(1);
      });
    });

    describe("clear", function() {
      it("should call the clear method of the backing queue", function(done) {
        scheduler._queue.clear = () => done();
        return scheduler.clear();
      });

      return it("should remove all items from the repeat list", function() {
        scheduler.add("Repeating Event 1", true);
        scheduler.add("Repeating Event 2", true);
        scheduler.add("Repeating Event 3", true);
        scheduler._repeat.length.should.equal(3);
        scheduler.clear();
        return scheduler._repeat.length.should.equal(0);
      });
    });

    describe("remove", function() {
      it("should remove the item from the backing queue", function(done) {
        scheduler._queue.remove = () => done();
        return scheduler.remove("Item 1");
      });

      it("should remove the item from the repeat list", function() {
        scheduler.add("Repeating Event 1", true);
        scheduler.add("Repeating Event 2", true);
        scheduler.add("Repeating Event 3", true);
        scheduler._repeat.length.should.equal(3);
        scheduler.remove("Repeating Event 2");
        return scheduler._repeat.length.should.equal(2);
      });

      return it("should clear the current item", function() {
        scheduler._current = "Repeating Event 1";
        scheduler.remove("Repeating Event 1");
        return should(scheduler._current).equal(null);
      });
    });

    return describe("remove", () =>
      it("should get the next item from the backing queue", function(done) {
        scheduler._queue.get = () => done();
        return scheduler.next();
      })
    );
  });
});

//----------------------------------------------------------------------------
// end of schedulerTest.coffee
