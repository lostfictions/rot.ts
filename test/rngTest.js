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
// rngTest.coffee
//----------------------------------------------------------------------------

const should = require("should");
const ROT = require("../lib/rot");

describe("rng", function() {
  it("should export ROT.RNG", () => ROT.should.have.property("RNG"));
    
  it("should automatically seed the RNG", () => ROT.RNG._seed.should.be.ok);
  
  return describe("RNG", function() {
    describe("getSeed", () =>
      it("should return the seed", function() {
        const seed = ROT.RNG.getSeed();
        return seed.should.equal(ROT.RNG._seed);
      })
    );

    describe("setSeed", function() {
      it("should be able to handle less than 1", function() {
        ROT.RNG.setSeed(0.5);
        ROT.RNG._seed.should.be.a.Number;
        ROT.RNG._s0.should.be.a.Number;
        ROT.RNG._s1.should.be.a.Number;
        ROT.RNG._s2.should.be.a.Number;
        ROT.RNG._c.should.be.a.Number;
        return ROT.RNG._frac.should.be.a.Number;
      });
        
      return it("should be able to handle 0", function() {
        ROT.RNG.setSeed(0);
        ROT.RNG._seed.should.be.a.Number;
        ROT.RNG._s0.should.be.a.Number;
        ROT.RNG._s1.should.be.a.Number;
        ROT.RNG._s2.should.be.a.Number;
        ROT.RNG._c.should.be.a.Number;
        return ROT.RNG._frac.should.be.a.Number;
      });
    });

    describe("getUniform", function() {
      it("should modify the state of the RNG", function() {
        ROT.RNG.setSeed(Date.now());
        const {_seed, _s0, _s1, _s2, _c, _frac} = ROT.RNG;
        const uniform = ROT.RNG.getUniform();
        ROT.RNG._seed.should.equal(_seed);
        ROT.RNG._frac.should.equal(_frac);
        ROT.RNG._s0.should.not.equal(_s0);
        ROT.RNG._s1.should.not.equal(_s1);
        ROT.RNG._s2.should.not.equal(_s2);
        return ROT.RNG._c.should.not.equal(_c);
      });
        
      return it("should return a value between [0,1)", function() {
        ROT.RNG.setSeed(Date.now());
        const uniform = ROT.RNG.getUniform();
        uniform.should.be.within(0.0, 1.0);
        return uniform.should.be.below(1.0);
      });
    });

    describe("getUniformInt", function() {
      it("should modify the state of the RNG", function() {
        ROT.RNG.setSeed(Date.now());
        const {_seed, _s0, _s1, _s2, _c, _frac} = ROT.RNG;
        const uniformInt = ROT.RNG.getUniformInt(1, 6);
        ROT.RNG._seed.should.equal(_seed);
        ROT.RNG._frac.should.equal(_frac);
        ROT.RNG._s0.should.not.equal(_s0);
        ROT.RNG._s1.should.not.equal(_s1);
        ROT.RNG._s2.should.not.equal(_s2);
        return ROT.RNG._c.should.not.equal(_c);
      });
        
      return it("should return a value between [1,6]", function() {
        ROT.RNG.setSeed(Date.now());
        const uniform = ROT.RNG.getUniformInt(1, 6);
        return uniform.should.be.within(1, 6);
      });
    });

    describe("getNormal", function() {
      it("should modify the state of the RNG", function() {
        ROT.RNG.setSeed(Date.now());
        const {_seed, _s0, _s1, _s2, _c, _frac} = ROT.RNG;
        const normal = ROT.RNG.getNormal(250, 100);
        ROT.RNG._seed.should.equal(_seed);
        ROT.RNG._frac.should.equal(_frac);
        ROT.RNG._s0.should.not.equal(_s0);
        ROT.RNG._s1.should.not.equal(_s1);
        ROT.RNG._s2.should.not.equal(_s2);
        return ROT.RNG._c.should.not.equal(_c);
      });

      return it("should work without parameters", function() {
        ROT.RNG.setSeed(Date.now());
        const normal = ROT.RNG.getNormal();
        return normal.should.be.ok;
      });
    });

    describe("getPercentage", function() {
      it("should modify the state of the RNG", function() {
        ROT.RNG.setSeed(Date.now());
        const {_seed, _s0, _s1, _s2, _c, _frac} = ROT.RNG;
        const percentage = ROT.RNG.getPercentage();
        ROT.RNG._seed.should.equal(_seed);
        ROT.RNG._frac.should.equal(_frac);
        ROT.RNG._s0.should.not.equal(_s0);
        ROT.RNG._s1.should.not.equal(_s1);
        ROT.RNG._s2.should.not.equal(_s2);
        return ROT.RNG._c.should.not.equal(_c);
      });
        
      return it("should return a value between [1,100]", function() {
        ROT.RNG.setSeed(Date.now());
        const percentage = ROT.RNG.getPercentage();
        return percentage.should.be.within(1, 100);
      });
    });

    describe("getWeightedValue", function() {
      it("should modify the state of the RNG", function() {
        let MOCK_data;
        ROT.RNG.setSeed(Date.now());
        const {_seed, _s0, _s1, _s2, _c, _frac} = ROT.RNG;
        const value = ROT.RNG.getWeightedValue(MOCK_data = {
          red: 9,
          green: 1
        }
        );
        ROT.RNG._seed.should.equal(_seed);
        ROT.RNG._frac.should.equal(_frac);
        ROT.RNG._s0.should.not.equal(_s0);
        ROT.RNG._s1.should.not.equal(_s1);
        ROT.RNG._s2.should.not.equal(_s2);
        return ROT.RNG._c.should.not.equal(_c);
      });
        
      it("should return one of the values provided", function() {
        let MOCK_data;
        ROT.RNG.setSeed(Date.now());
        const value = ROT.RNG.getWeightedValue(MOCK_data = {
          red: 9,
          green: 1
        }
        );
        return ["red", "green"].should.matchAny(value);
      });

      return it("should return the last value if we go beyond the list", function() {
        let MOCK_data;
        ROT.RNG.setSeed(Date.now());
        const value = ROT.RNG.getWeightedValue(MOCK_data = {
          red: 0,
          green: 0,
          blue: 0
        }
        );
        return value.should.equal("blue");
      });
    });

    describe("getState", () =>
      it("should return the internal state of the RNG", function() {
        ROT.RNG.setSeed(Date.now());
        const {_seed, _s0, _s1, _s2, _c, _frac} = ROT.RNG;
        const [s0, s1, s2, c] = Array.from(ROT.RNG.getState());
        s0.should.equal(_s0);
        s1.should.equal(_s1);
        s2.should.equal(_s2);
        return c.should.equal(_c);
      })
    );

    describe("setState", () =>
      it("should set the internal state of the RNG", function() {
        ROT.RNG.setSeed(Date.now());
        const [_s0, _s1, _s2, _c] = Array.from(ROT.RNG.getState());
        const roll1 = ROT.RNG.getUniformInt(1, 6);
        const roll2 = ROT.RNG.getUniformInt(1, 6);
        const roll3 = ROT.RNG.getUniformInt(1, 6);
        ROT.RNG.setState([_s0, _s1, _s2, _c]);
        const rolla = ROT.RNG.getUniformInt(1, 6);
        const rollb = ROT.RNG.getUniformInt(1, 6);
        const rollc = ROT.RNG.getUniformInt(1, 6);
        roll1.should.equal(rolla);
        roll2.should.equal(rollb);
        return roll3.should.equal(rollc);
      })
    );

    return describe("clone", () =>
      it("should create a perfect clone of the RNG", function() {
        ROT.RNG.setSeed(Date.now());
        const clone = ROT.RNG.clone();
        return __range__(0, 100, false).map((i) =>
          clone.getPercentage().should.equal(ROT.RNG.getPercentage()));
      })
    );
  });
});

//----------------------------------------------------------------------------
// end of rngTest.coffee

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}