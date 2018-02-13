/* eslint-disable
    no-undef,
    no-unused-vars,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// rogueTest.coffee
//----------------------------------------------------------------------------

const _ = require("underscore");
const should = require("should");
const ROT = require("../../lib/rot");

describe("rogue", function() {
  it("should export ROT.Map.Rogue", function() {
    ROT.should.have.property("Map");
    return ROT.Map.should.have.property("Rogue");
  });

  it("should be possible to create a Rogue object", function() {
    const dungeon = new ROT.Map.Rogue();
    return dungeon.should.be.ok;
  });

  return describe("Rogue", function() {
    xit("should extend ROT.Map.Dungeon", function() {
      const dungeon = new ROT.Map.Rogue();
      dungeon.should.be.an.instanceof(ROT.Map);
      dungeon.should.be.an.instanceof(ROT.Map.Dungeon);
      return dungeon.should.be.an.instanceof(ROT.Map.Rogue);
    });
  
    describe("create", function() {
      it("should call the callback width x height times", function(done) {
        const { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT;
        const almostDone = _.after(DEFAULT_WIDTH*DEFAULT_HEIGHT, done);
        const dungeon = new ROT.Map.Rogue();
        dungeon.create((x, y, value) => almostDone());
        return dungeon._options.should.have.properties([ "roomWidth", "roomHeight" ]);
    });

      it("should accept options", function(done) {
        let MOCK_options;
        const { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT;
        const almostDone = _.after(DEFAULT_WIDTH*DEFAULT_HEIGHT, done);
        const dungeon = new ROT.Map.Rogue(DEFAULT_WIDTH, DEFAULT_HEIGHT, (MOCK_options = {
          cellWidth: 3,
          cellHeight: 3
        })
        );
        return dungeon.create((x, y, value) => almostDone());
      });

      it("should accept extended options", function(done) {
        let MOCK_options;
        const { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT;
        const almostDone = _.after(DEFAULT_WIDTH*DEFAULT_HEIGHT, done);
        const dungeon = new ROT.Map.Rogue(DEFAULT_WIDTH, DEFAULT_HEIGHT, (MOCK_options = {
          cellWidth: 3,
          cellHeight: 3,
          roomHeight: [2, 6],
          roomWidth: [6, 21]
        }));
        return dungeon.create((x, y, value) => almostDone());
      });

      return it("should be OK if no callback is provided", function() {
        const dungeon = new ROT.Map.Rogue();
        return dungeon.create();
      });
    });

    describe("getRooms", () =>
      xit("should not return an empty array", function() {
        const dungeon = new ROT.Map.Rogue();
        dungeon.create();
        const rooms = dungeon.getRooms();
        return rooms.length.should.be.greaterThan(1);
      })
    );

    describe("getCorridors", () =>
      xit("should not return an empty array", function() {
        const dungeon = new ROT.Map.Rogue();
        dungeon.create();
        const corridors = dungeon.getCorridors();
        return corridors.length.should.be.greaterThan(1);
      })
    );

    describe("_calculateRoomSize", () =>
      it("should ensure a minimum size of 2", function() {
        const dungeon = new ROT.Map.Rogue();
        const [min, max] = Array.from(dungeon._calculateRoomSize(1, 1));
        min.should.equal(2);
        return max.should.equal(2);
      })
    );

    describe("_connectUnconnectedRooms", function() {
      it("should keep looping until it finds a valid room", function() {
        const dungeon = new ROT.Map.Rogue();
        dungeon.connectedCells = [];
        const newRoom = function() {
          let room;
          return room =
            {connections: []};
        };
        dungeon.rooms = ([0, 1, 2].map((y) => [0, 1, 2].map((x) => newRoom())));
        return dungeon._connectUnconnectedRooms();
      });

      it("should skip rooms that are already connected to each other", function() {
        let y, x;
        const dungeon = new ROT.Map.Rogue();
        dungeon.connectedCells = [];
        const newRoom = function() {
          let room;
          return room =
            {connections: []};
        };
        dungeon.rooms = ((() => {
          const result = [];
          for (y = 0; y < 3; y++) {
            result.push((() => {
              const result1 = [];
              for (x = 0; x < 3; x++) {
                result1.push(newRoom());
              }
              return result1;
            })());
          }
          return result;
        })());
        for (x = 0; x < 3; x++) {
          for (y = 0; y < 3; y++) {
            if ((x !== 0) && (y !== 0)) {
              for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                  if ((i !== 0) && (j !== 0)) {
                    dungeon.rooms[x][y].connections.push([i,j]);
                  }
                }
              }
            }
          }
        }
        return dungeon._connectUnconnectedRooms();
      });

      return it("should log if it can't connect a room", function() {
        const dungeon = new ROT.Map.Rogue();
        dungeon.connectedCells = [];
        dungeon._options.cellWidth = 1;
        dungeon._options.cellHeight = 1;
        const newRoom = function() {
          let room;
          return room =
            {connections: []};
        };
        dungeon.rooms = ([0].map((y) => [0].map((x) => newRoom())));
        return dungeon._connectUnconnectedRooms();
      });
    });

    describe("_createRooms", function() {
      it("should create some very small rooms", function() {
        const w = 9;
        const h = 9;
        const cw = 3;
        const ch = 3;
        const roomWidth = [2, 6];
        const roomHeight = [2, 6];
        const dungeon = new ROT.Map.Rogue(9, 9);
        dungeon._width = w;
        dungeon._height = h;
        dungeon._options.cellWidth = cw;
        dungeon._options.cellHeight = ch;
        dungeon._options.roomWidth = roomWidth;
        dungeon._options.roomHeight = roomHeight;
        dungeon.rooms = [];
        dungeon.map = dungeon._fillMap(0);
        dungeon._initRooms();
        return dungeon._createRooms();
      });

      return it("should create some small rooms", function() {
        const w = 10;
        const h = 10;
        const cw = 3;
        const ch = 3;
        const roomWidth = [2, 6];
        const roomHeight = [2, 6];
        const dungeon = new ROT.Map.Rogue(10, 10);
        dungeon._width = w;
        dungeon._height = h;
        dungeon._options.cellWidth = cw;
        dungeon._options.cellHeight = ch;
        dungeon._options.roomWidth = roomWidth;
        dungeon._options.roomHeight = roomHeight;
        dungeon.rooms = [];
        dungeon.map = dungeon._fillMap(0);
        dungeon._initRooms();
        return dungeon._createRooms();
      });
    });

    describe("_getWallPosition", () =>
      it("should return [undefined, undefined] with a bad direction", function() {
        const dungeon = new ROT.Map.Rogue();
        const [rx,ry] = Array.from(dungeon._getWallPosition({}, 0));
        should(rx).equal(undefined);
        return should(ry).equal(undefined);
      })
    );

    return describe("_createCorridors", function(done) {
      const almostDone = _.after(3, done);
      return it("should call _drawCorridore badly if given a room connected to itself", function() {
        const dungeon = new ROT.Map.Rogue();
        dungeon._getWallPosition = function(room, dir) {
          if ((room === undefined) && (dir === undefined)) { return almostDone(); }
        };
        dungeon._drawCorridore = () => almostDone();
        dungeon._options.cellWidth = 1;
        dungeon._options.cellHeight = 1;
        const room = {
          connections: [],
          cellx: 0,
          celly: 0
        };
        room.connections.push([0,0]);
        dungeon.rooms = [];
        dungeon.rooms.push([room]);
        return dungeon._createCorridors();
      });
    });
  });
});

//----------------------------------------------------------------------------
// end of rogueTest.coffee
