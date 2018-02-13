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
// uniformTest.coffee
//----------------------------------------------------------------------------

const _ = require("underscore");
const should = require("should");
const ROT = require("../../lib/rot");

describe("uniform", function() {
  it("should export ROT.Map.Uniform", function() {
    ROT.should.have.property("Map");
    return ROT.Map.should.have.property("Uniform");
  });

  it("should be possible to create a Uniform object", function() {
    const dungeon = new ROT.Map.Uniform();
    return dungeon.should.be.ok;
  });

  return describe("Uniform", function() {
    it("should extend ROT.Map.Dungeon", function() {
      const dungeon = new ROT.Map.Uniform();
      dungeon.should.be.an.instanceof(ROT.Map);
      dungeon.should.be.an.instanceof(ROT.Map.Dungeon);
      return dungeon.should.be.an.instanceof(ROT.Map.Uniform);
    });
  
    describe("create", function() {
      it("should call the callback width x height times", function(done) {
        const { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT;
        const almostDone = _.after(DEFAULT_WIDTH*DEFAULT_HEIGHT, done);
        const dungeon = new ROT.Map.Uniform();
        return dungeon.create((x, y, value) => almostDone());
      });

      it("should accept options, like timeLimit", function(done) {
        let MOCK_options;
        const { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT;
        const almostDone = _.after(DEFAULT_WIDTH*DEFAULT_HEIGHT, done);
        const dungeon = new ROT.Map.Uniform(DEFAULT_WIDTH, DEFAULT_HEIGHT, (MOCK_options =
          {timeLimit: 10})
        );
        return dungeon.create((x, y, value) => almostDone());
      });

      it("should not call the callback if given no time", function() {
        let MOCK_options;
        const { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT;
        const almostDone = function() { throw new Error("bad mojo"); };
        const dungeon = new ROT.Map.Uniform(DEFAULT_WIDTH, DEFAULT_HEIGHT, (MOCK_options =
          {timeLimit: -1})
        );
        return dungeon.create((x, y, value) => almostDone());
      });

      it("should keep trying to create rooms if there are less than two", function() {
        const firstTime = true;
        const { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT;
        const dungeon = new ROT.Map.Uniform();
        const oldGenerateRooms = dungeon._generateRooms;
        dungeon._generateRooms = function() {
          dungeon._generateRooms = oldGenerateRooms;
        };
        return dungeon.create();
      });

      return it("should keep trying to create corridors if not successful", function() {
        const firstTime = true;
        const { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT;
        const dungeon = new ROT.Map.Uniform();
        const oldGenerateCorridors = dungeon._generateCorridors;
        dungeon._generateCorridors = function() {
          dungeon._generateCorridors = oldGenerateCorridors;
          return false;
        };
        return dungeon.create();
      });
    });

    describe("getRooms", () =>
      it("should not return an empty array", function() {
        const dungeon = new ROT.Map.Uniform();
        dungeon.create();
        const rooms = dungeon.getRooms();
        return rooms.length.should.be.greaterThan(1);
      })
    );

    describe("getCorridors", () =>
      it("should not return an empty array", function() {
        const dungeon = new ROT.Map.Uniform();
        dungeon.create();
        const corridors = dungeon.getCorridors();
        return corridors.length.should.be.greaterThan(1);
      })
    );

    describe("_generateRoom", () =>
      it("should respect the limit on the number of attempts", function() {
        const dungeon = new ROT.Map.Uniform();
        dungeon._roomAttempts = 0;
        const room = dungeon._generateRoom();
        return should(room).equal(null);
      })
    );

    describe("_generateCorridors", function() {
      it("should respect the limit on the number of attempts", function() {
        const dungeon = new ROT.Map.Uniform();
        dungeon._corridorAttempts = 0;
        const corridor = dungeon._generateCorridors();
        return corridor.should.equal(false);
      });

      return it("should not try to connect a room it doesn't have", function() {
        const dungeon = new ROT.Map.Uniform();
        dungeon._closestRoom = function() {};
        dungeon._connectRooms = function() {};
        const corridor = dungeon._generateCorridors();
        return corridor.should.equal(false);
      });
    });

    describe("_connectRooms", function() {
      it("should return if it can't find a place to start", function() {
        const dungeon = new ROT.Map.Uniform();
        dungeon._placeInWall = () => null;
        const room1 = {
          getCenter() { return [42, 42]; },
          getTop() { return 40; },
          getBottom() { return 44; }
        };
        const room2 = {
          getCenter() { return [69, 69]; },
          getTop() { return 67; },
          getBottom() { return 71; }
        };
        const success = dungeon._connectRooms(room1, room2);
        return success.should.equal(false);
      });

      it("should try connecting east-west if closer left-right than up-down", function() {
        const dungeon = new ROT.Map.Uniform();
        dungeon._placeInWall = () => null;
        const room1 = {
          getCenter() { return [52, 42]; },
          getLeft() { return 50; },
          getRight() { return 54; }
        };
        const room2 = {
          getCenter() { return [59, 69]; },
          getLeft() { return 57; },
          getRight() { return 61; }
        };
        const success = dungeon._connectRooms(room1, room2);
        return success.should.equal(false);
      });

      it("should return if it can't find a place to end (L-shape)", function() {
        let nextTime = [42, 44];
        const dungeon = new ROT.Map.Uniform();
        dungeon._placeInWall = function() {
          const returnThis = nextTime;
          nextTime = null;
          return returnThis;
        };
        const room1 = {
          getCenter() { return [42, 42]; },
          getTop() { return 40; },
          getBottom() { return 44; }
        };
        const room2 = {
          getCenter() { return [69, 69]; },
          getTop() { return 67; },
          getBottom() { return 71; }
        };
        const success = dungeon._connectRooms(room1, room2);
        return success.should.equal(false);
      });

      it("should return if it can't find a place to end (S-shape)", function() {
        let nextTime = [14, 10];
        const dungeon = new ROT.Map.Uniform();
        dungeon._digLine = function(array) {
          if (array.length === 2) { throw new Error("First Case"); }
          if (array.length === 3) { throw new Error("Second Case"); }
          if (array.length === 4) { throw new Error("Proper Case"); }
          throw new Error("WTF???");
        };
        dungeon._placeInWall = function() {
          const returnThis = nextTime;
          nextTime = null;
          return returnThis;
        };
        const room1 = {
          getCenter() { return [10, 5]; },
          getLeft() { return 5; },
          getRight() { return 15; },
          getTop() { return 0; },
          getBottom() { return 10; }
        };
        const room2 = {
          getCenter() { return [20, 500]; },
          getLeft() { return 15; },
          getRight() { return 25; },
          getTop() { return 495; },
          getBottom() { return 505; }
        };
        const success = dungeon._connectRooms(room1, room2);
        return success.should.equal(false);
      });

      return it("should add room1 and room2 to the connected list if they aren't", function() {
        const room1 = {
          getCenter() { return [10, 5]; },
          getLeft() { return 5; },
          getRight() { return 15; },
          getTop() { return 0; },
          getBottom() { return 10; },
          addDoor() {}
        };
        const room2 = {
          getCenter() { return [20, 500]; },
          getLeft() { return 15; },
          getRight() { return 25; },
          getTop() { return 495; },
          getBottom() { return 505; },
          addDoor() {}
        };
        const dungeon = new ROT.Map.Uniform();
        dungeon._placeInWall = () => [10, 10];
        dungeon._digLine = function() {};
        dungeon._connected = [ room1 ];
        dungeon._unconnected = [ room2 ];
        const success = dungeon._connectRooms(room1, room2);
        return success.should.equal(true);
      });
    });

    describe("_placeInWall", () =>
      it("should return null if there are no available walls", function() {
        const TOP_WALL = 0;
        const dungeon = new ROT.Map.Uniform(20, 20);
        dungeon._map = dungeon._fillMap(0);
        const room = {
          addDoor() {},
          getCenter() { return [10, 10]; },
          getLeft() { return 5; },
          getRight() { return 15; },
          getTop() { return 5; },
          getBottom() { return 15; }
        };
        const wall = dungeon._placeInWall(room, TOP_WALL);
        return should(wall).equal(null);
      })
    );

    describe("_isWallCallback", () =>
      it("should return false if coordinates are out of bounds", function() {
        const dungeon = new ROT.Map.Uniform(20, 20);
        dungeon._isWallCallback(-1, 5).should.equal(false); 
        dungeon._isWallCallback(5, -1).should.equal(false); 
        dungeon._isWallCallback(25, 5).should.equal(false); 
        return dungeon._isWallCallback(5, 25).should.equal(false);
      })
    ); 

    return describe("_canBeDugCallback", () =>
      it("should return false if coordinates are out of bounds", function() {
        const dungeon = new ROT.Map.Uniform(20, 20);
        dungeon._canBeDugCallback(-1, 5).should.equal(false); 
        dungeon._canBeDugCallback(5, -1).should.equal(false); 
        dungeon._canBeDugCallback(25, 5).should.equal(false); 
        return dungeon._canBeDugCallback(5, 25).should.equal(false);
      })
    );
  });
});

//----------------------------------------------------------------------------
// end of uniformTest.coffee
