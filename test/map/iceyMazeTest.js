/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// iceyMazeTest.coffee
//----------------------------------------------------------------------------

const _ = require("underscore");
const should = require("should");
const ROT = require("../../lib/rot");

describe("iceymaze", function() {
  it("should export ROT.Map.IceyMaze", function() {
    ROT.should.have.property("Map");
    return ROT.Map.should.have.property("IceyMaze");
  });

  it("should be possible to create a IceyMaze object", function() {
    const maze = new ROT.Map.IceyMaze();
    return maze.should.be.ok;
  });

  return describe("IceyMaze", function() {
    it("should extend ROT.Map", function() {
      const maze = new ROT.Map.IceyMaze();
      maze.should.be.an.instanceof(ROT.Map);
      return maze.should.be.an.instanceof(ROT.Map.IceyMaze);
    });
  
    return describe("create", function() {
      it("should call the callback width x height times", function(done) {
        const almostDone = _.after(11*22, done);
        const maze = new ROT.Map.IceyMaze(11, 22);
        return maze.create((x, y, value) => almostDone());
      });

      it("should create an even sized maze", function(done) {
        const almostDone = _.after(22*11, done);
        const maze = new ROT.Map.IceyMaze(22, 11);
        return maze.create((x, y, value) => almostDone());
      });

      return it("should allow regularity to be specified", function(done) {
        const almostDone = _.after(22*11, done);
        const maze = new ROT.Map.IceyMaze(22, 11, 5);
        return maze.create((x, y, value) => almostDone());
      });
    });
  });
});

//----------------------------------------------------------------------------
// end of iceyMazeTest.coffee
