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
// dijkstraTest.coffee
//----------------------------------------------------------------------------

const _ = require("underscore");
const should = require("should");
const ROT = require("../../lib/rot");

describe("dijkstra", function() {
  it("should export ROT.Path.Dijkstra", function() {
    ROT.should.have.property("Path");
    return ROT.Path.should.have.property("Dijkstra");
  });

  it("should be possible to create a Dijkstra object", function() {
    const dijkstra = new ROT.Path.Dijkstra();
    return dijkstra.should.be.ok;
  });

  return describe("Dijkstra", function() {
    it("should extend ROT.Path", function() {
      const dijkstra = new ROT.Path.Dijkstra();
      dijkstra.should.be.an.instanceof(ROT.Path);
      return dijkstra.should.be.an.instanceof(ROT.Path.Dijkstra);
    });

    return describe("compute", function() {
      it("should bail out if unable to cache a result", function() {
        const dijkstra = new ROT.Path.Dijkstra();
        dijkstra._compute = function() {};
        return dijkstra.compute(0, 0, function(x,y) {});
      });

      it("should attempt to compute a path", function() {
        const toX = 5;
        const toY = 5;
        const passableCallback = (x,y) => true;
        const options =
          {topology: 8};
        const dijkstra = new ROT.Path.Dijkstra(toX, toY, passableCallback, options);
        return dijkstra.compute(0, 0, function(x,y) {});
      });

      return it("should reuse a path it already has", function() {
        const toX = 5;
        const toY = 5;
        const passableCallback = (x,y) => true;
        const options =
          {topology: 8};
        const dijkstra = new ROT.Path.Dijkstra(toX, toY, passableCallback, options);
        dijkstra.compute(0, 0, function(x,y) {});
        return dijkstra.compute(0, 0, function(x,y) {});
      });
    });
  });
});

//----------------------------------------------------------------------------
// end of dijkstraTest.coffee
