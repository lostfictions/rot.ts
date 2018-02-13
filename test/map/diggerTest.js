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
// diggerTest.coffee
//----------------------------------------------------------------------------

const _ = require("underscore");
const should = require("should");
const ROT = require("../../lib/rot");

describe("digger", function() {
  it("should export ROT.Map.Digger", function() {
    ROT.should.have.property("Map");
    return ROT.Map.should.have.property("Digger");
  });

  it("should be possible to create a Digger object", function() {
    const dungeon = new ROT.Map.Digger();
    return dungeon.should.be.ok;
  });

  return describe("Digger", function() {
    it("should extend ROT.Map.Dungeon", function() {
      const dungeon = new ROT.Map.Digger();
      dungeon.should.be.an.instanceof(ROT.Map);
      dungeon.should.be.an.instanceof(ROT.Map.Dungeon);
      return dungeon.should.be.an.instanceof(ROT.Map.Digger);
    });
  
    describe("create", function() {
      it("should call the callback width x height times", function(done) {
        const { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT;
        const almostDone = _.after(DEFAULT_WIDTH*DEFAULT_HEIGHT, done);
        const dungeon = new ROT.Map.Digger();
        return dungeon.create((x, y, value) => almostDone());
      });

      it("should accept options like timelimit", function() {
        let MOCK_options;
        const { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT;
        const dungeon = new ROT.Map.Digger(DEFAULT_WIDTH, DEFAULT_HEIGHT, (MOCK_options = {
          roomWidth: [3, 9],
          roomHeight: [3, 5],
          corridorLength: [3, 10],
          dugPercentage: 0.2,
          timeLimit: 1
        })
        );
        return dungeon.create();
      });

      return it("should not dig when it has no walls", function() {
        const dungeon = new ROT.Map.Digger();
        dungeon._findWall = () => null;
        return dungeon.create();
      });
    });

    describe("_findWall", () =>
      it("should return null when it can't find any walls", function() {
        const dungeon = new ROT.Map.Digger();
        dungeon._walls = {};
        const wall = dungeon._findWall();
        return should(wall).equal(null);
      })
    );

    describe("getRooms", () =>
      it("should not return an empty array", function() {
        const dungeon = new ROT.Map.Digger();
        dungeon.create();
        const rooms = dungeon.getRooms();
        return rooms.length.should.be.greaterThan(1);
      })
    );

    return describe("getCorridors", () =>
      it("should not return an empty array", function() {
        const dungeon = new ROT.Map.Digger();
        dungeon.create();
        const corridors = dungeon.getCorridors();
        return corridors.length.should.be.greaterThan(1);
      })
    );
  });
});

//----------------------------------------------------------------------------
// end of diggerTest.coffee
