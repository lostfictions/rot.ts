/* eslint-disable
    no-mixed-spaces-and-tabs,
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
// fovTest.coffee
//----------------------------------------------------------------------------

const _ = require("underscore");
const should = require("should");
const ROT = require("../../lib/rot");

describe("fov", function() {
  it("should export ROT.FOV", () => ROT.should.have.property("FOV"));

  it("should be possible to create a FOV object", function() {
    const fov = new ROT.FOV();
    return fov.should.have.properties([ "compute", "_getCircle" ]);
});

  return describe("FOV", function() {
    it("should accept options", function() {
      let fov;
      const lightCallback = (x, y) => false;
      const options =
    		{topology: 8};
      return fov = new ROT.FOV(lightCallback, options);
    });
      
    describe("compute", () =>
      it("should not do anything", function() {
        const fov = new ROT.FOV();
        const result = fov.compute();
        return should(result).equal(undefined);
      })
    );

    return describe("_getCircle", function() {
      let fov = null;
      
      describe("topology: 4", function() {
        beforeEach(function() {
          const lightCallback = (x, y) => false;
          const options =
            {topology: 4};
          return fov = new ROT.FOV(lightCallback, options);
        });

        return it("should return top4 neighbors", function() {
          const result = fov._getCircle(0, 0, 1);
          return result.length.should.equal(4);
        });
      });

      describe("topology: 6", function() {
        beforeEach(function() {
          const lightCallback = (x, y) => false;
          const options =
            {topology: 6};
          return fov = new ROT.FOV(lightCallback, options);
        });

        return it("should return top6 neighbors", function() {
          const result = fov._getCircle(0, 0, 1);
          return result.length.should.equal(6);
        });
      });

      return describe("topology: 8", function() {
        beforeEach(function() {
          const lightCallback = (x, y) => false;
          const options =
            {topology: 8};
          return fov = new ROT.FOV(lightCallback, options);
        });

        return it("should return top8 neighbors", function() {
          const result = fov._getCircle(0, 0, 1);
          return result.length.should.equal(8);
        });
      });
    });
  });
});

//----------------------------------------------------------------------------
// end of fovTest.coffee
