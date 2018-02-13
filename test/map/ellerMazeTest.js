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
// ellerMazeTest.coffee
//----------------------------------------------------------------------------

const _ = require("underscore");
const should = require("should");
const ROT = require("../../lib/rot");

describe("ellermaze", function() {
  it("should export ROT.Map.EllerMaze", function() {
    ROT.should.have.property("Map");
    return ROT.Map.should.have.property("EllerMaze");
  });

  it("should be possible to create a EllerMaze object", function() {
    const maze = new ROT.Map.EllerMaze();
    return maze.should.be.ok;
  });

  return describe("EllerMaze", function() {
    it("should extend ROT.Map", function() {
      const maze = new ROT.Map.EllerMaze();
      maze.should.be.an.instanceof(ROT.Map);
      return maze.should.be.an.instanceof(ROT.Map.EllerMaze);
    });
  
    return describe("create", () =>
      it("should call the callback width x height times", function(done) {
        const { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT;
        const almostDone = _.after(DEFAULT_WIDTH*DEFAULT_HEIGHT, done);
        const maze = new ROT.Map.EllerMaze(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        return maze.create((x, y, value) => almostDone());
      })
    );
  });
});

//----------------------------------------------------------------------------
// end of ellerMazeTest.coffee
