/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// astarTest.coffee
//----------------------------------------------------------------------------

const _ = require("underscore");
const should = require("should");
const ROT = require("../../lib/rot");

describe("astar", function() {
  it("should export ROT.Path.AStar", function() {
    ROT.should.have.property("Path");
    return ROT.Path.should.have.property("AStar");
  });

  it("should be possible to create a AStar object", function() {
    const astar = new ROT.Path.AStar();
    return astar.should.be.ok;
  });

  return describe("AStar", function() {
    it("should extend ROT.Path", function() {
      const astar = new ROT.Path.AStar();
      astar.should.be.an.instanceof(ROT.Path);
      return astar.should.be.an.instanceof(ROT.Path.AStar);
    });

    return describe("compute", function() {
      it("should attempt to compute a path", function() {
        const toX = 5;
        const toY = 5;
        const passableCallback = (x,y) => true;
        const options =
          {topology: 8};
        const astar = new ROT.Path.AStar(toX, toY, passableCallback, options);
        return astar.compute(0, 0, function(x,y) {});
      });

      it("should reuse a path it already has", function() {
        const toX = 5;
        const toY = 5;
        const passableCallback = (x,y) => true;
        const options =
          {topology: 8};
        const astar = new ROT.Path.AStar(toX, toY, passableCallback, options);
        astar.compute(0, 0, function(x,y) {});
        return astar.compute(0, 0, function(x,y) {});
      });

      it("should attempt to compute a path on topology 6", function() {
        const toX = 5;
        const toY = 5;
        const passableCallback = (x,y) => true;
        const options =
          {topology: 6};
        const astar = new ROT.Path.AStar(toX, toY, passableCallback, options);
        return astar.compute(0, 0, function(x,y) {});
      });

      it("should attempt to compute a path on topology 4", function() {
        const toX = 5;
        const toY = 5;
        const passableCallback = (x,y) => true;
        const options =
          {topology: 4};
        const astar = new ROT.Path.AStar(toX, toY, passableCallback, options);
        return astar.compute(0, 0, function(x,y) {});
      });

      it("should throw if an illegal topology is specified", function() {
        const toX = 5;
        const toY = 5;
        const passableCallback = (x,y) => true;
        const options =
          {topology: 7};
        const astar = new ROT.Path.AStar(toX, toY, passableCallback, options);
        return should.throws(() => astar.compute(0, 0, function(x,y) {}));
      });

      return it("should bail if it's not possible to find a path", function() {
        const toX = 5;
        const toY = 5;
        const passableCallback = (x,y) => false;
        const options =
          {topology: 8};
        const astar = new ROT.Path.AStar(toX, toY, passableCallback, options);
        return astar.compute(0, 0, function(x,y) {});
      });
    });
  });
});

//----------------------------------------------------------------------------
// end of astarTest.coffee
