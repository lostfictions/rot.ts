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
// dividedMazeTest.coffee
//----------------------------------------------------------------------------

const _ = require("underscore");
const should = require("should");
const ROT = require("../../lib/rot");

describe("dividedmaze", function() {
  it("should export ROT.Map.DividedMaze", function() {
    ROT.should.have.property("Map");
    return ROT.Map.should.have.property("DividedMaze");
  });

  it("should be possible to create a DividedMaze object", function() {
    const maze = new ROT.Map.DividedMaze();
    return maze.should.be.ok;
  });

  return describe("DividedMaze", function() {
    it("should extend ROT.Map", function() {
      const maze = new ROT.Map.DividedMaze();
      maze.should.be.an.instanceof(ROT.Map);
      return maze.should.be.an.instanceof(ROT.Map.DividedMaze);
    });
  
    return describe("create", () =>
      it("should call the callback width x height times", function(done) {
        const { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT;
        const almostDone = _.after(DEFAULT_WIDTH*DEFAULT_HEIGHT, done);
        const maze = new ROT.Map.DividedMaze();
        return maze.create((x, y, value) => almostDone());
      })
    );
  });
});

//----------------------------------------------------------------------------
// end of dividedMazeTest.coffee
