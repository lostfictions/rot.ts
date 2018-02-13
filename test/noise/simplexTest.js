/* eslint-disable
    no-undef,
    no-unused-vars,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// simplexTest.coffee
//----------------------------------------------------------------------------

const _ = require("underscore");
const should = require("should");
const ROT = require("../../lib/rot");

describe("simplex", function() {
  it("should export ROT.Noise,Simplex", function() {
    ROT.should.have.property("Noise");
    return ROT.Noise.should.have.property("Simplex");
  });

  it("should be possible to create a Simplex object", function() {
    const simplex = new ROT.Noise.Simplex();
    return simplex.should.have.property("get");
  });

  return describe("Simplex", function() {
    it("should extend ROT.Noise", function() {
      const simplex = new ROT.Noise.Simplex();
      return simplex.should.be.an.instanceof(ROT.Noise);
    });
  
    it("should accept a parameter gradients", function() {
      let simplex;
      return simplex = new ROT.Noise.Simplex(128);
    });

    return describe("get", () =>
      it("should provide some smooth random noise", function() {
        const simplex = new ROT.Noise.Simplex();
        return (() => {
          const result = [];
          for (var x = 0; x < 16; x += 0.25) {
            result.push((() => {
              const result1 = [];
              for (let y = 0; y < 16; y += 0.25) {
                const value = simplex.get(x, y);
                result1.push(value.should.be.within(-1, 1));
              }
              return result1;
            })());
          }
          return result;
        })();
      })
    );
  });
});

//----------------------------------------------------------------------------
// end of simplexTest.coffee
