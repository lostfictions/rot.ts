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
// eventQueueTest.coffee
//----------------------------------------------------------------------------

const should = require("should");
const ROT = require("../lib/rot");

describe("eventqueue", function() {
  it("should export ROT.EventQueue", () => ROT.should.have.property("EventQueue"));
    
  it("should be possible to create an EventQueue", function() {
    const eventQueue = new ROT.EventQueue();
    return eventQueue.should.be.ok;
  });
  
  return describe("EventQueue", function() {
    let eventQueue = null;
    
    beforeEach(function() {
      eventQueue = new ROT.EventQueue();
      return eventQueue.should.be.ok;
    });

    describe("getTime", () =>
      it("should return 0, when no time has passed", () => eventQueue.getTime().should.equal(0))
    );

    describe("clear", () =>
      it("should clear the event queue of all events", function() {
        eventQueue.add("Event 1", 10);
        eventQueue.add("Event 2", 20);
        eventQueue.add("Event 3", 30);
        eventQueue.clear();
        return should(eventQueue.get()).equal(null);
      })
    );

    describe("add", function() {
      it("should be able to handle events in time-order", function() {
        eventQueue.add("Event 1", 10);
        eventQueue.add("Event 2", 20);
        eventQueue.add("Event 3", 30);
        eventQueue.get().should.equal("Event 1");
        eventQueue.get().should.equal("Event 2");
        return eventQueue.get().should.equal("Event 3");
      });

      return it("should be able to handle events in reverse time-order", function() {
        eventQueue.add("Event 3", 30);
        eventQueue.add("Event 2", 20);
        eventQueue.add("Event 1", 10);
        eventQueue.get().should.equal("Event 1");
        eventQueue.get().should.equal("Event 2");
        return eventQueue.get().should.equal("Event 3");
      });
    });

    describe("get", function() {
      it("should return nothing, when no events are posted", function() {
        const event = eventQueue.get();
        return should(event).equal(null);
      });

      return it("should not advance time when it is not necessary", function() {
        eventQueue.add("Event 1", 10);
        eventQueue.add("Event 2", 10);
        eventQueue.add("Event 3", 10);
        eventQueue.get().should.equal("Event 1");
        eventQueue.get().should.equal("Event 2");
        return eventQueue.get().should.equal("Event 3");
      });
    });

    return describe("remove", function() {
      it("should be able to remove events", function() {
        eventQueue.add("Event 1", 10);
        eventQueue.add("Event 2", 20);
        eventQueue.add("Event 3", 30);
        eventQueue.remove("Event 2").should.equal(true);
        eventQueue.get().should.equal("Event 1");
        return eventQueue.get().should.equal("Event 3");
      });

      return it("should return false if unable to remove the event", function() {
        eventQueue.add("Event 1", 10);
        eventQueue.add("Event 2", 20);
        eventQueue.add("Event 3", 30);
        eventQueue.remove("Event 7").should.equal(false);
        eventQueue.get().should.equal("Event 1");
        eventQueue.get().should.equal("Event 2");
        return eventQueue.get().should.equal("Event 3");
      });
    });
  });
});

//----------------------------------------------------------------------------
// end of eventQueueTest.coffee
