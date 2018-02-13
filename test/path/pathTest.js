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
// pathTest.coffee
//----------------------------------------------------------------------------

const should = require("should");
const ROT = require("../../lib/rot");

describe("path", function() {
  it("should export ROT.Path", () => ROT.should.have.property("Path"));

  it("should be possible to create a Path object", function() {
    const path = new ROT.Path();
    return path.should.be.ok;
  });
    
  return describe("Path", function() {
    describe("Path", () =>
      it("should be possible to create a Path object with options", function() {
        const toX = 0;
        const toY = 0;
        const passableCallback = (x,y) => true;
        const options =
          {topology: 6};
        const path = new ROT.Path(toX, toY, passableCallback, options);
        return path.should.be.ok;
      })
    );

    describe("compute", () =>
      it("should not do anything", function() {
        const toX = 0;
        const toY = 0;
        const passableCallback = (x,y) => true;
        const options =
          {topology: 6};
        const path = new ROT.Path(toX, toY, passableCallback, options);
        const result = path.compute();
        return should(result).equal(undefined);
      })
    );

    return describe("_getNeighbors", function() {
      it("should provide topology neighbors when passable", function() {
        const TOPOLOGY = 6;
        const toX = 0;
        const toY = 0;
        const passableCallback = (x,y) => true;
        const options =
          {topology: TOPOLOGY};
        const path = new ROT.Path(toX, toY, passableCallback, options);
        const neighbors = path._getNeighbors();
        return neighbors.length.should.equal(TOPOLOGY);
      });

      return it("should provide zero neighbors when not passable", function() {
        const TOPOLOGY = 6;
        const toX = 0;
        const toY = 0;
        const passableCallback = (x,y) => false;
        const options =
          {topology: TOPOLOGY};
        const path = new ROT.Path(toX, toY, passableCallback, options);
        const neighbors = path._getNeighbors();
        return neighbors.length.should.equal(0);
      });
    });
  });
});

//----------------------------------------------------------------------------
// end of pathTest.coffee
