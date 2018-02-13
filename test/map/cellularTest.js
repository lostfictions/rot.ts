/* eslint-disable
    no-undef,
    no-unused-vars,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// cellularTest.coffee
//----------------------------------------------------------------------------

const _ = require("underscore");
const should = require("should");
const ROT = require("../../lib/rot");

describe("cellular", function() {
  it("should export ROT.Map.Cellular", function() {
    ROT.should.have.property("Map");
    return ROT.Map.should.have.property("Cellular");
  });

  it("should be possible to create a Cellular object", function() {
    const maze = new ROT.Map.Cellular();
    return maze.should.be.ok;
  });

  return describe("Cellular", function() {
    it("should extend ROT.Map", function() {
      const maze = new ROT.Map.Cellular();
      maze.should.be.an.instanceof(ROT.Map);
      return maze.should.be.an.instanceof(ROT.Map.Cellular);
    });
  
    return describe("create", function() {
      it("should call the callback width x height times", function(done) {
        const { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT;
        const almostDone = _.after(DEFAULT_WIDTH*DEFAULT_HEIGHT, done);
        const maze = new ROT.Map.Cellular();
        return maze.create((x, y, value) => almostDone());
      });

      it("should create successive generations", function(done) {
        const NUM_GENERATIONS = 10;
        const { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT;
        const almostDone = _.after(NUM_GENERATIONS*DEFAULT_WIDTH*DEFAULT_HEIGHT, done);
        const maze = new ROT.Map.Cellular();
        maze.randomize(0.5);
        return __range__(0, NUM_GENERATIONS, false).map((i) =>
          maze.create((x, y, value) => almostDone()));
      });

      it("should be able to call connect after creating the map", function(done) {
        const NUM_GENERATIONS = 10;
        const { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT;
        const almostDone = _.after(NUM_GENERATIONS*DEFAULT_WIDTH*DEFAULT_HEIGHT, done);
        const maze = new ROT.Map.Cellular();
        maze.randomize(0.5);
        for (let i = 0, end = NUM_GENERATIONS, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
          maze.create((x, y, value) => almostDone());
        }
        return maze.connect();
      });

      it("should be able to call connect with a callback after creating the map", function(done) {
        const NUM_GENERATIONS = 4;
        const { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT;
        const maze = new ROT.Map.Cellular();
        maze.randomize(0.5);
        for (let i = 0, end = NUM_GENERATIONS, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
          maze.create;
        } 
        const almostDone = _.after(DEFAULT_WIDTH*DEFAULT_HEIGHT, done);          
        return maze.connect((x, y, value) => almostDone());
      });

      it("should be able to call connect with a callback and a value after creating the map", function(done) {
        const NUM_GENERATIONS = 4;
        const { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT;
        const maze = new ROT.Map.Cellular();
        maze.randomize(0.5);
        for (let i = 0, end = NUM_GENERATIONS, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
          maze.create;
        } 
        const almostDone = _.after(DEFAULT_WIDTH*DEFAULT_HEIGHT, done);          
        const callback = (x, y, value) => almostDone();
        return maze.connect(callback, 1);
      });

      it("should be able to call connect with a callback, a value and a per-tunnel callback after creating the map", function(done) {
        const NUM_GENERATIONS = 4;
        const { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT;
        const maze = new ROT.Map.Cellular();
        maze.randomize(0.5);
        for (let i = 0, end = NUM_GENERATIONS, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
          maze.create;
        } 
        const almostDone = _.after(DEFAULT_WIDTH*DEFAULT_HEIGHT, done);          
        const callback = (x, y, value) => almostDone();
        return maze.connect(callback, 1, pos => 1);
      });

      return it("should be able to function without a callback", function() {
        let MOCK_options;
        const NUM_GENERATIONS = 4;
        const { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT;
        const maze = new ROT.Map.Cellular(DEFAULT_WIDTH, DEFAULT_HEIGHT, (MOCK_options = {
          born: [5, 6],
          survive: [4, 5, 6],
          topology: 6,
          connected: true
        })
        );
        maze.randomize(0.5);
        return __range__(0, NUM_GENERATIONS, false).map((i) =>
          maze.create());
      });
    });
  });
});

//----------------------------------------------------------------------------
// end of cellularTest.coffee

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}