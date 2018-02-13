/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// recursiveShadowcastingTest.coffee
//----------------------------------------------------------------------------

const _ = require("underscore");
const should = require("should");
const ROT = require("../../lib/rot");

const map = mapArray => Array.from(mapArray).map((line) => line.split(""));

describe("recursive-shadowcasting", function() {
  it("should export ROT.FOV.RecursiveShadowcasting", function() {
    ROT.should.have.property("FOV");
    return ROT.FOV.should.have.property("RecursiveShadowcasting");
  });

  it("should be possible to create a RecursiveShadowcasting object", function() {
    const rs = new ROT.FOV.RecursiveShadowcasting();
    return rs.should.have.properties([ "compute", "_getCircle" ]);
});

  return describe("RecursiveShadowcasting", function() {
    it("should extend ROT.FOV", function() {
      const rs = new ROT.FOV.RecursiveShadowcasting();
      rs.should.be.an.instanceof(ROT.FOV);
      return rs.should.be.an.instanceof(ROT.FOV.RecursiveShadowcasting);
    });

    describe("compute", () =>
      it("should shadowcast if we can see stuff", function() {
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
        const rs = new ROT.FOV.RecursiveShadowcasting(lightPasses);
        rs.compute(5, 2, 10, canSee);
        return canSeeCount.should.equal(71);
      })
    );

    describe("compute180", () =>
      it("should shadowcast if we can see stuff", function() {
        const DIR_NORTH = 0;
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
        const rs = new ROT.FOV.RecursiveShadowcasting(lightPasses);
        rs.compute180(5, 2, 10, DIR_NORTH, canSee);
        return canSeeCount.should.equal(36);
      })
    );

    describe("compute90", () =>
      it("should shadowcast if we can see stuff", function() {
        const DIR_NORTH = 0;
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
        const rs = new ROT.FOV.RecursiveShadowcasting(lightPasses);
        rs.compute90(5, 2, 10, DIR_NORTH, canSee);
        return canSeeCount.should.equal(11);
      })
    );

    return describe("_castVisibility", () =>
      it("should consider things out of range as invisible", function() {
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
        const rs = new ROT.FOV.RecursiveShadowcasting(lightPasses);
        rs.compute(5, 2, 1, canSee);
        return canSeeCount.should.equal(17);
      })
    );
  });
});

//----------------------------------------------------------------------------
// end of recursiveShadowcastingTest.coffee
