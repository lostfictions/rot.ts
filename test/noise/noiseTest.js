/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// noiseTest.coffee
//----------------------------------------------------------------------------

const _ = require("underscore");
const should = require("should");
const ROT = require("../../lib/rot");

describe("noise", function() {
  it("should export ROT.Noise", () => ROT.should.have.property("Noise"));

  it("should be possible to create a Noise object", function() {
    const noise = new ROT.Noise();
    return noise.should.have.property("get");
  });

  return describe("Noise", () =>
    describe("get", () =>
      it("should not do anything", function() {
        const noise = new ROT.Noise();
        const result = noise.get(5, 5);
        return should(result).equal(undefined);
      })
    )
  );
});

//----------------------------------------------------------------------------
// end of noiseTest.coffee
