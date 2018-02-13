/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// featureTest.coffee
//----------------------------------------------------------------------------

const _ = require("underscore");
const should = require("should");
const ROT = require("../../lib/rot");

describe("feature", function() {
  it("should export ROT.Map.Feature", function() {
    ROT.should.have.property("Map");
    return ROT.Map.should.have.property("Feature");
  });

  describe("Feature", function() {
    it("should have a static method to create the feature", () => ROT.Map.Feature.should.have.property("createRandomAt"));

    it("should be possible to create a Feature object", function() {
      const feature = new ROT.Map.Feature();
      return feature.should.have.properties([ "create", "debug", "isValid" ]);
  });
      
    describe("createRandomAt", () =>
      it("should not do anything", function() {
        const result = ROT.Map.Feature.createRandomAt();
        return should(result).equal(undefined);
      })
    );

    describe("create", () =>
      it("should not do anything", function() {
        const feature = new ROT.Map.Feature();
        const result = feature.create();
        return should(result).equal(undefined);
      })
    );

    describe("debug", () =>
      it("should not do anything", function() {
        const feature = new ROT.Map.Feature();
        const result = feature.debug();
        return should(result).equal(undefined);
      })
    );

    return describe("isValid", () =>
      it("should not do anything", function() {
        const feature = new ROT.Map.Feature();
        const result = feature.isValid();
        return should(result).equal(undefined);
      })
    );
  });

  describe("Room", function() {
    it("should extend ROT.Map.Feature", function() {
      const room = new ROT.Map.Feature.Room();
      room.should.be.an.instanceof(ROT.Map.Feature);
      return room.should.be.an.instanceof(ROT.Map.Feature.Room);
    });

    it("should be possible to create a Room object", function() {
      const room = new ROT.Map.Feature.Room();
      room.should.have.properties([ "create", "debug", "isValid" ]);
      return room.should.have.properties([ "getDoors" ]);
  });
      
    describe("createRandomAt", function() {
      it("should have a static method to create the feature", function() {
        ROT.Map.Feature.Room.should.have.property("createRandomAt");
        return ROT.Map.Feature.Room.should.have.property("createRandomCenter");
      });

      return it("should throw an error if dx and dy are 0", function() {
        const x = 0;
        const y = 0;
        const dx = 0;
        const dy = 0;
        const options = {
          roomWidth: [5, 5],
          roomHeight: [5, 5]
        };
        return should.throws(() => ROT.Map.Feature.Room.createRandomAt(x, y, dx, dy, options));
      });
    });

    describe("getDoors", () =>
      it("should provide doors to the callback", function(done) {
        const almostDone = _.after(3, done);
        const room = new ROT.Map.Feature.Room();
        room.addDoor(1, 1);
        room.addDoor(2, 2);
        room.addDoor(3, 3);
        return room.getDoors(function(x,y) {
          if (x === y) { return almostDone(); }
        });
      })
    );

    return describe("debug", () =>
      it("should log if called", function() {
        const room = new ROT.Map.Feature.Room(1, 1, 5, 5);
        return room.debug();
      })
    );
  });

  return describe("Corridor", function() {
    it("should extend ROT.Map.Feature", function() {
      const corridor = new ROT.Map.Feature.Corridor();
      corridor.should.be.an.instanceof(ROT.Map.Feature);
      return corridor.should.be.an.instanceof(ROT.Map.Feature.Corridor);
    });

    it("should be possible to create a Corridor object", function() {
      const corridor = new ROT.Map.Feature.Corridor();
      corridor.should.have.properties([ "create", "debug", "isValid" ]);
      return corridor.should.have.properties([ "createPriorityWalls" ]);
  });
      
    describe("debug", () =>
      it("should log if called", function() {
        const corridor = new ROT.Map.Feature.Corridor(1, 5, 5, 5);
        return corridor.debug();
      })
    );

    return describe("isValid", () =>
      it("should return false if the corridor is length 0", function() {
        const corridor = new ROT.Map.Feature.Corridor(1, 1, 1, 1);
        const isWallCallback = (x,y) => false;
        const canBeDugCallback = (x,y) => false;
        const result = corridor.isValid(isWallCallback, canBeDugCallback);
        return result.should.equal(false);
      })
    );
  });
});

//----------------------------------------------------------------------------
// end of featureTest.coffee
