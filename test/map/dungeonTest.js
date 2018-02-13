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
// dungeonTest.coffee
//----------------------------------------------------------------------------

const _ = require("underscore");
const should = require("should");
const ROT = require("../../lib/rot");

describe("dungeon", function() {
  it("should export ROT.Map.Dungeon", function() {
    ROT.should.have.property("Map");
    return ROT.Map.should.have.property("Dungeon");
  });

  it("should be possible to create a Dungeon object", function() {
    const maze = new ROT.Map.Dungeon();
    return maze.should.be.ok;
  });

  return describe("Dungeon", function() {
    it("should extend ROT.Map", function() {
      const maze = new ROT.Map.Dungeon();
      maze.should.be.an.instanceof(ROT.Map);
      return maze.should.be.an.instanceof(ROT.Map.Dungeon);
    });
  
    describe("create", () =>
      it("should not do anything", function() {
        const maze = new ROT.Map.Dungeon();
        return maze.create();
      })
    );

    describe("getRooms", () =>
      it("should return an empty array", function() {
        const maze = new ROT.Map.Dungeon();
        const rooms = maze.getRooms();
        return rooms.should.be.ok;
      })
    );

    return describe("getCorridors", () =>
      it("should return an empty array", function() {
        const maze = new ROT.Map.Dungeon();
        const corridors = maze.getCorridors();
        return corridors.should.be.ok;
      })
    );
  });
});

//----------------------------------------------------------------------------
// end of dungeonTest.coffee
