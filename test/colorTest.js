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
// colorTest.coffee
//----------------------------------------------------------------------------

const _ = require("underscore");
const should = require("should");
const ROT = require("../lib/rot");

describe("color", function() {
  it("should export ROT.Color", () => ROT.should.have.property("Color"));
  
  it("should have several methods for handling color", () =>
    ROT.Color.should.have.properties([ "fromString", "add", "add_",
      "multiply", "multiply_", "interpolate", "interpolateHSL", "randomize",
      "rgb2hsl", "hsl2rgb", "toRGB", "toHex", "_clamp", "_cache" ])
);
  
  return describe("Color", function() {
    describe("fromString", function() {
      it("should use named colors from the cache", function() {
        const aqua = ROT.Color.fromString("mediumaquamarine");
        return aqua.should.eql([102, 205, 170]);
    });

      it("should accept #rgb style colors", function() {
        const color = ROT.Color.fromString("#abc");
        return color.should.eql([170, 187, 204]);
    });

      it("should accept #rrggbb style colors", function() {
        const color = ROT.Color.fromString("#a7b7c7");
        return color.should.eql([167, 183, 199]);
    });

      it("should accept rgb(rrr,ggg,bbb) style colors", function() {
        const color = ROT.Color.fromString("rgb(123, 45, 67)");
        return color.should.eql([123, 45, 67]);
    });

      return it("should return black #000 when the input is unknown", function() {
        const color = ROT.Color.fromString("elven mage");
        return color.should.eql([0, 0, 0]);
    });
  });

    describe("add", () =>
      it("should add two colors together", function() {
        const a = [50, 100, 150];
        const b = [3, 5, 7];
        const color = ROT.Color.add(a, b);
        color.should.eql([53, 105, 157]);
        a.should.eql([50, 100, 150]);
        return b.should.eql([3, 5, 7]);
    })
  );

    describe("add_", () =>
      it("should add two colors together, modifying the first", function() {
        const a = [50, 100, 150];
        const b = [3, 5, 7];
        const color = ROT.Color.add_(a, b);
        color.should.eql([53, 105, 157]);
        a.should.eql([53, 105, 157]);
        return b.should.eql([3, 5, 7]);
    })
  );

    describe("multiply", () =>
      it("should mix (multiply) two colors together", function() {
        const a = [50, 100, 150];
        const b = [13, 234, 69];
        const color = ROT.Color.multiply(a, b);
        color.should.eql([3, 92, 41]);
        a.should.eql([50, 100, 150]);
        return b.should.eql([13, 234, 69]);
    })
  );

    describe("multiply_", () =>
      it("should mix (multiply) two colors together, modifying the first", function() {
        const a = [50, 100, 150];
        const b = [13, 234, 69];
        const color = ROT.Color.multiply_(a, b);
        color.should.eql([3, 92, 41]);
        a.should.eql([3, 92, 41]);
        return b.should.eql([13, 234, 69]);
    })
  );

    describe("interpolate", function() {
      it("should interpolate between two colors", function() {
        const a = [255, 0, 0];
        const b = [0, 0, 255];
        const color = ROT.Color.interpolate(a, b);
        color.should.eql([128, 0, 128]);
        a.should.eql([255, 0, 0]);
        return b.should.eql([0, 0, 255]);
    });

      return it("should interpolate between two colors by percentage", function() {
        const a = [255, 0, 0];
        const b = [0, 0, 255];
        const color = ROT.Color.interpolate(a, b, 0.75);
        color.should.eql([64, 0, 191]);
        a.should.eql([255, 0, 0]);
        return b.should.eql([0, 0, 255]);
    });
  });

    describe("rgb2hsl", function() {
      it("should treat black as achromatic", function() {
        const hsl = ROT.Color.rgb2hsl([0, 0, 0]);
        return hsl.should.eql([0, 0, 0]);
    });

      it("should treat white as achromatic", function() {
        const hsl = ROT.Color.rgb2hsl([255, 255, 255]);
        return hsl.should.eql([0, 0, 1.0]);
    });

      it("should treat grey as achromatic", function() {
        const hsl = ROT.Color.rgb2hsl([128, 128, 128]);
        hsl[0].should.equal(0);
        hsl[1].should.equal(0);
        return hsl[2].should.be.within(0.50, 0.51);
      });

      it("should return HSL for really red colors", function() {
        const hsl = ROT.Color.rgb2hsl([234, 13, 27]);
        hsl[0].should.be.within(0.98, 0.99);
        hsl[1].should.be.within(0.89, 0.90);
        return hsl[2].should.be.within(0.48, 0.49);
      });

      it("should return HSL for really green colors", function() {
        const hsl = ROT.Color.rgb2hsl([13, 234, 27]);
        hsl[0].should.be.within(0.34, 0.35);
        hsl[1].should.be.within(0.89, 0.90);
        return hsl[2].should.be.within(0.48, 0.49);
      });

      it("should return HSL for really blue colors", function() {
        const hsl = ROT.Color.rgb2hsl([27, 13, 234]);
        hsl[0].should.be.within(0.67, 0.68);
        hsl[1].should.be.within(0.89, 0.90);
        return hsl[2].should.be.within(0.48, 0.49);
      });

      it("should return HSL for dark colors", function() {
        const hsl = ROT.Color.rgb2hsl([16, 32, 48]);
        hsl[0].should.be.within(0.58, 0.59);
        hsl[1].should.be.within(0.49, 0.51);
        return hsl[2].should.be.within(0.12, 0.13);
      });

      it("should return HSL for bright colors", function() {
        const hsl = ROT.Color.rgb2hsl([216, 232, 248]);
        hsl[0].should.be.within(0.58, 0.59);
        hsl[1].should.be.within(0.69, 0.70);
        return hsl[2].should.be.within(0.90, 0.91);
      });

      return it("should return HSL for bright yellow", function() {
        const hsl = ROT.Color.rgb2hsl([255, 255, 0]);
        hsl[0].should.be.within(0.16, 0.17);
        hsl[1].should.be.within(0.99, 1.01);
        return hsl[2].should.be.within(0.49, 0.51);
      });
    });

    describe("hsl2rgb", () =>
      it("should round-trip to rgb2hsl", () =>
        (() => {
          const result = [];
          for (var r = 0; r <= 255; r += 16) {
            result.push((() => {
              const result1 = [];
              for (var g = 0; g <= 255; g += 16) {
                result1.push((() => {
                  const result2 = [];
                  for (let b = 0; b <= 255; b += 16) {
                    const hsl = ROT.Color.rgb2hsl([r,g,b]);
                    const rgb = ROT.Color.hsl2rgb([hsl[0], hsl[1], hsl[2]]);
                    rgb[0].should.equal(r);
                    rgb[1].should.equal(g);
                    result2.push(rgb[2].should.equal(b));
                  }
                  return result2;
                })());
              }
              return result1;
            })());
          }
          return result;
        })()
      )
    );

    describe("interpolateHSL", function() {
      it("should interpolate between two colors", function() {
        const a = [135, 206, 235]; // skyblue
        const b = [ 34, 139,  34]; // forestgreen
        const color = ROT.Color.interpolateHSL(a, b);
        color.should.eql([57, 215, 159]);
        a.should.eql([135, 206, 235]);
        return b.should.eql([ 34, 139,  34]);
    });

      return it("should interpolate between two colors by percentage", function() {
        const a = [135, 206, 235]; // skyblue
        const b = [ 34, 139,  34]; // forestgreen
        const color = ROT.Color.interpolateHSL(a, b, 0.75);
        color.should.eql([41, 182, 86]);
        a.should.eql([135, 206, 235]);
        return b.should.eql([ 34, 139,  34]);
    });
  });

    describe("randomize", function() {
      it("should give us some random colors", function() {
        const color = ROT.Color.randomize([100, 128, 230], [30, 10, 20]);
        color.should.be.ok;
        return color.length.should.equal(3);
      });

      return it("should give us some random colors with one stddev", function() {
        const color = ROT.Color.randomize([100, 128, 230], 10);
        color.should.be.ok;
        return color.length.should.equal(3);
      });
    });

    describe("_clamp", function() {
      it("should bring negative numbers up to 0", function() {
        ROT.Color._clamp(-500).should.equal(0);
        ROT.Color._clamp(-50).should.equal(0);
        return ROT.Color._clamp(-5).should.equal(0);
      });

      it("should bring positive numbers down to 255", function() {
        ROT.Color._clamp(256).should.equal(255);
        ROT.Color._clamp(2560).should.equal(255);
        return ROT.Color._clamp(25600).should.equal(255);
      });

      return it("should leave 0 to 255 alone", () =>
        __range__(0, 255, true).map((i) =>
          ROT.Color._clamp(i).should.equal(i))
      );
    });

    describe("toRGB", () =>
      it("should clamp colors in rgb(rrr,ggg,bbb) form", function() {
        const rgb = ROT.Color.toRGB([-5, 270, 99]);
        return rgb.should.equal("rgb(0,255,99)");
      })
    );

    return describe("toHex", () =>
      it("should clamp colors in #rrggbb form", function() {
        const hex = ROT.Color.toHex([-5, 270, 99]);
        return hex.should.equal("#00ff63");
      })
    );
  });
});

//----------------------------------------------------------------------------
// end of colorTest.coffee

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}