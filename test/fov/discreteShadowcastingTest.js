/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// discreteShadowcastingTest.coffee
//----------------------------------------------------------------------------

const _ = require("underscore");
const should = require("should");
const ROT = require("../../lib/rot");

const map = mapArray => Array.from(mapArray).map((line) => line.split(""));

describe("discrete-shadowcasting", function() {
  it("should export ROT.FOV.DiscreteShadowcasting", function() {
    ROT.should.have.property("FOV");
    return ROT.FOV.should.have.property("DiscreteShadowcasting");
  });

  it("should be possible to create a DiscreteShadowcasting object", function() {
    const ds = new ROT.FOV.DiscreteShadowcasting();
    return ds.should.have.properties([ "compute", "_getCircle" ]);
});

  return describe("DiscreteShadowcasting", function() {
    it("should extend ROT.FOV", function() {
      const ds = new ROT.FOV.DiscreteShadowcasting();
      ds.should.be.an.instanceof(ROT.FOV);
      return ds.should.be.an.instanceof(ROT.FOV.DiscreteShadowcasting);
    });

    return describe("compute", function() {
      it("should bail if we're standing in solid earth", function(done) {
        const lightPasses = (x, y) => false;
        const canSee = (x, y, r, visible) => done();
        const ds = new ROT.FOV.DiscreteShadowcasting(lightPasses);
        return ds.compute(0, 0, 10, canSee);
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
        const ds = new ROT.FOV.DiscreteShadowcasting(lightPasses);
        ds.compute(5, 2, 10, canSee);
        return canSeeCount.should.equal(50);
      });
    });
  });
});

//----------------------------------------------------------------------------
// end of discreteShadowcastingTest.coffee
