/* eslint-disable
    no-undef,
    no-unused-vars,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// schedulerSpeedTest.coffee
//----------------------------------------------------------------------------

const _ = require("underscore");
const should = require("should");
const ROT = require("../../lib/rot");

const NO_REPEAT = false;
const YES_REPEAT = true;

describe("scheduler", function() {
  it("should export ROT.Scheduler.Speed", function() {
    ROT.should.have.property("Scheduler");
    return ROT.Scheduler.should.have.property("Speed");
  });
    
  it("should be possible to create a Speed", function() {
    const speed = new ROT.Scheduler.Speed();
    return speed.should.be.ok;
  });
  
  return describe("Speed", function() {
    let speed = null;
    
    beforeEach(function() {
      speed = new ROT.Scheduler.Speed();
      return speed.should.be.ok;
    });

    it("should extend Scheduler", function() {
      speed.should.be.an.instanceof(ROT.Scheduler);
      return speed.should.be.an.instanceof(ROT.Scheduler.Speed);
    });

    describe("add", function() {
      it("should call the getSpeed method on added events", function(done) {
        const MOCK_event = {
          getSpeed() {
            done();
            return 50;
          }
        };
        return speed.add(MOCK_event, NO_REPEAT);
      });

      return it("should add the item to the backing queue", function(done) {
        const MOCK_event =
          {getSpeed() { return 50; }};
        speed._queue.add = () => done();
        return speed.add(MOCK_event, NO_REPEAT);
      });
    });

    return describe("next", function() {
      it("should return the next item from the backing queue", function() {
        const MOCK_event =
          {getSpeed() { return 50; }};
        speed.add(MOCK_event, NO_REPEAT);
        const event = speed.next();
        return event.should.equal(MOCK_event);
      });

      it("should return repeating events to the queue", function(done) {
        const MOCK_event1 =
          {getSpeed() { return 50; }};
        const MOCK_event2 =
          {getSpeed() { return 50; }};
        const almostDone = _.after(2, done);
        speed.add(MOCK_event1, YES_REPEAT);
        speed.add(MOCK_event2, YES_REPEAT);
        speed._queue.add = () => almostDone();
        let event = speed.next();
        event.should.equal(MOCK_event1);
        event = speed.next();
        event.should.equal(MOCK_event2);
        return speed.next();
      });

      return it("should respect the speed of the actors", function() {
        const littleMac = {
          name: "Mac",
          getSpeed() { return 100; }
        };
        const glassJoe = { 
          name: "Joe",
          getSpeed() { return 25; }
        };
        speed.add(littleMac, YES_REPEAT);
        speed.add(glassJoe, YES_REPEAT);
        speed.next().should.eql(littleMac);
        speed.next().should.eql(littleMac);
        speed.next().should.eql(littleMac);
        speed.next().should.eql(glassJoe);
        return (() => {
          const result = [];
          for (let i = 0; i <= 100; i++) {
            speed.next().should.eql(littleMac);
            speed.next().should.eql(littleMac);
            speed.next().should.eql(littleMac);
            speed.next().should.eql(littleMac);
            result.push(speed.next().should.eql(glassJoe));
          }
          return result;
        })();
      });
    });
  });
});

//----------------------------------------------------------------------------
// end of schedulerSpeedTest.coffee
