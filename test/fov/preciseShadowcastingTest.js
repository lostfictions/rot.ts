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
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// preciseShadowcastingTest.coffee
//----------------------------------------------------------------------------

const _ = require("underscore");
const should = require("should");
const ROT = require("../../lib/rot");

const map = mapArray => Array.from(mapArray).map((line) => line.split(""));

describe("precise-shadowcasting", function() {
  it("should export ROT.FOV.PreciseShadowcasting", function() {
    ROT.should.have.property("FOV");
    return ROT.FOV.should.have.property("PreciseShadowcasting");
  });

  it("should be possible to create a PreciseShadowcasting object", function() {
    const ps = new ROT.FOV.PreciseShadowcasting();
    return ps.should.have.properties([ "compute", "_getCircle" ]);
});

  return describe("PreciseShadowcasting", function() {
    it("should extend ROT.FOV", function() {
      const ps = new ROT.FOV.PreciseShadowcasting();
      ps.should.be.an.instanceof(ROT.FOV);
      return ps.should.be.an.instanceof(ROT.FOV.PreciseShadowcasting);
    });

    describe("compute", function() {
      it("should bail if we're standing in solid earth", function(done) {
        const lightPasses = (x, y) => false;
        const canSee = (x, y, r, visible) => done();
        const ps = new ROT.FOV.PreciseShadowcasting(lightPasses);
        return ps.compute(0, 0, 10, canSee);
      });

      return it("should shadowcast if we can see stuff", function() {
        let canSeeCount = 0;
        const testMap = map([
        //  0123456789
          "XXXXXXXXXX", // 0
          "X........X", // 1
          "X........X", // 2
          "X........X", // 3
          "XXXXXXXXXX" ]); // 4
        const lightPasses = function(x, y) {
          if (x < 0) { return false; }
          if (y < 0) { return false; }
          if (x >= testMap[0].length) { return false; }
          if (y >= testMap.length) { return false; }
          return testMap[y][x] === ".";
        };
        const canSee = function(x, y, r, visible) { if (visible === 1) { return canSeeCount++; } };
        const ps = new ROT.FOV.PreciseShadowcasting(lightPasses);
        ps.compute(5, 2, 10, canSee);
        return canSeeCount.should.equal(40);
      });
    });

    return describe("_checkVisibility", function() {
      it("should return 0 when completely equivalent with existing shadow", function() {
        const lightPasses = (x,y) => false;
        const ps = new ROT.FOV.PreciseShadowcasting(lightPasses);
        const A1 = [0, 0];
        const A2 = [0, 0];
        const blocks = false;
        const SHADOWS = [[0,0], [0,0]];
        return ps._checkVisibility(A1, A2, blocks, SHADOWS).should.equal(0);
      });

      it("should - second edge within existing shadow, first outside", function() {
        const lightPasses = (x,y) => false;
        const ps = new ROT.FOV.PreciseShadowcasting(lightPasses);
        const A1 = [0, 5];
        const A2 = [10, 5];
        const blocks = false;
        const SHADOWS = [[8,12]];
        return ps._checkVisibility(A1, A2, blocks, SHADOWS).should.be.within(0.3, 0.34);
      });

      return it("should - both edges within existing shadows", function() {
        const lightPasses = (x,y) => false;
        const ps = new ROT.FOV.PreciseShadowcasting(lightPasses);
        const A1 = [4, 5];
        const A2 = [8, 5];
        const blocks = false;
        const SHADOWS = [[3,4],[4,5],[5,6],[6,8],[11,13]];
        return ps._checkVisibility(A1, A2, blocks, SHADOWS).should.be.within(0.05, 0.06);
      });
    });
  });
});

//----------------------------------------------------------------------------
// end of preciseShadowcastingTest.coffee
