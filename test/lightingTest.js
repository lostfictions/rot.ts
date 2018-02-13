/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// lightingTest.coffee
//----------------------------------------------------------------------------

const _ = require("underscore");
const should = require("should");
const ROT = require("../lib/rot");

describe("lighting", function() {
  it("should export ROT.Lighting", () => ROT.should.have.property("Lighting"));
  
  it("should be possible to create a Lighting object without options", function() {
    const lighting = new ROT.Lighting();
    return lighting.should.be.ok;
  });
  
  return describe("Lighting", function() {
    describe("Lighting", () =>
      it("should be possible to create a Lighting object with options", function() {
        const reflectivityCallback = function() {};
        const options = {
          passes: 1,
          emissionThreshold: 100,
          range: 10          
        };
        const lighting = new ROT.Lighting(reflectivityCallback, options);
        return lighting.should.be.ok;
      })
    );
        
    describe("setOptions", function() {
      it("should call reset() if a new range is provided", function(done) {
        const reflectivityCallback = function() {};
        const options = {
          passes: 1,
          emissionThreshold: 100,
          range: 10          
        };
        const lighting = new ROT.Lighting(reflectivityCallback, options);
        lighting.reset = () => done();
        return lighting.setOptions(options).should.equal(lighting);
      });

      return it("should not call reset() if a new range is not provided", function() {
        const reflectivityCallback = function() {};
        const options = {
          passes: 1,
          emissionThreshold: 100,
          range: 10          
        };
        const lighting = new ROT.Lighting(reflectivityCallback, options);
        lighting.reset = function() { throw new Error("I will not be reset!"); };
        const newOptions = {
          passes: 2,
          emissionThreshold: 50
        };
        return lighting.setOptions(newOptions).should.equal(lighting);
      });
    });

    describe("setFOV", function() {
      it("should cache the provided fov object", function() {
        const reflectivityCallback = function() {};
        const options = {
          passes: 1,
          emissionThreshold: 100,
          range: 10          
        };
        const lighting = new ROT.Lighting(reflectivityCallback, options);
        const MOCK_fov =
          {name: "I am FOV!"};
        should(lighting._fov).equal(null);
        lighting.setFOV(MOCK_fov);
        return lighting._fov.should.equal(MOCK_fov);
      });

      return it("should clear the FOV cache when provided a new fov object", function() {
        const reflectivityCallback = function() {};
        const options = {
          passes: 1,
          emissionThreshold: 100,
          range: 10          
        };
        const lighting = new ROT.Lighting(reflectivityCallback, options);
        lighting._fovCache =
          {name: "I am FOV cache!"};
        const MOCK_fov =
          {name: "I am FOV!"};
        lighting._fovCache.should.not.eql({});
        lighting.setFOV(MOCK_fov);
        return lighting._fovCache.should.eql({});
    });
  });

    describe("setLight", function() {
      it("should add a light to the light sources", function() {
        const reflectivityCallback = function() {};
        const options = {
          passes: 1,
          emissionThreshold: 100,
          range: 10          
        };
        const lighting = new ROT.Lighting(reflectivityCallback, options);
        should(lighting._lights["5,5"]).equal(undefined);
        lighting.setLight(5, 5, "blue");
        return lighting._lights["5,5"].should.be.ok;
      });

      it("should add a light to the light sources", function() {
        const reflectivityCallback = function() {};
        const options = {
          passes: 1,
          emissionThreshold: 100,
          range: 10          
        };
        const lighting = new ROT.Lighting(reflectivityCallback, options);
        should(lighting._lights["7,7"]).equal(undefined);
        lighting.setLight(7, 7, [123, 45, 67]);
        return lighting._lights["7,7"].should.be.ok;
      });

      return it("should remove lights when provided null", function() {
        const reflectivityCallback = function() {};
        const options = {
          passes: 1,
          emissionThreshold: 100,
          range: 10          
        };
        const lighting = new ROT.Lighting(reflectivityCallback, options);
        should(lighting._lights["5,5"]).equal(undefined);
        should(lighting._lights["7,7"]).equal(undefined);
        lighting.setLight(5, 5, "blue");
        lighting.setLight(7, 7, [123, 45, 67]);
        lighting._lights["5,5"].should.be.ok;
        lighting._lights["7,7"].should.be.ok;
        lighting.setLight(5, 5, null);
        should(lighting._lights["5,5"]).equal(undefined);
        return lighting._lights["7,7"].should.be.ok;
      });
    });

    describe("clearLights", () =>
      it("should remove all lights", function() {
        const reflectivityCallback = function() {};
        const options = {
          passes: 1,
          emissionThreshold: 100,
          range: 10          
        };
        const lighting = new ROT.Lighting(reflectivityCallback, options);
        lighting._lights.should.eql({});
        should(lighting._lights["5,5"]).equal(undefined);
        should(lighting._lights["7,7"]).equal(undefined);
        lighting.setLight(5, 5, "blue");
        lighting.setLight(7, 7, [123, 45, 67]);
        lighting._lights["5,5"].should.be.ok;
        lighting._lights["7,7"].should.be.ok;
        lighting.clearLights();
        should(lighting._lights["5,5"]).equal(undefined);
        should(lighting._lights["7,7"]).equal(undefined);
        return lighting._lights.should.eql({});
    })
  );

    return describe("compute", function() {
      it("should light some stuff up", function() {
        // based on the code example from the Interactive Manual
        ROT.RNG.setSeed(12345);
        const mapData = {};
        const lightData = {};

        // build a map
        const map = new ROT.Map.Cellular(60,40).randomize(0.5);
        const createCallback = (x, y, value) => mapData[`${x},${y}`] = value;
        for (let i = 0; i < 4; i++) {
          map.create(createCallback);
        }

        // prepare a FOV algorithm
        const lightPasses = (x, y) => mapData[`${x},${y}`] === 1;
        const fov = new ROT.FOV.PreciseShadowcasting(lightPasses, { topology:4 });

        // prepare a lighting algorithm
        const reflectivity = function(x, y) {
          if (mapData[`${x},${y}`] === 1) { return 0.3; } else { return 0; }
        };
        const lighting = new ROT.Lighting(reflectivity, { range:12, passes:3 });
        lighting.setFOV(fov);
        lighting.setLight(12, 12, [240, 240, 30]);
        lighting.setLight(20, 20, [240, 60, 60]);
        lighting.setLight(45, 25, [200, 200, 200]);

        const lightingCallback = (x, y, color) => lightData[`${x},${y}`] = color;
        return lighting.compute(lightingCallback);
      });

      return it("should re-light some stuff up, if a light goes out", function() {
        // based on the code example from the Interactive Manual
        ROT.RNG.setSeed(12345);
        const mapData = {};
        const lightData = {};

        // build a map
        const map = new ROT.Map.Cellular(60,40).randomize(0.5);
        const createCallback = (x, y, value) => mapData[`${x},${y}`] = value;
        for (let i = 0; i < 4; i++) {
          map.create(createCallback);
        }

        // prepare a FOV algorithm
        const lightPasses = (x, y) => mapData[`${x},${y}`] === 1;
        const fov = new ROT.FOV.PreciseShadowcasting(lightPasses, { topology:4 });

        // prepare a lighting algorithm
        const reflectivity = function(x, y) {
          if (mapData[`${x},${y}`] === 1) { return 0.3; } else { return 0; }
        };
        const lighting = new ROT.Lighting(reflectivity, { range:12, passes:3 });
        lighting.setFOV(fov);
        lighting.setLight(12, 12, [240, 240, 30]);
        lighting.setLight(20, 20, [240, 60, 60]);
        lighting.setLight(45, 25, [200, 200, 200]);

        const lightingCallback = (x, y, color) => lightData[`${x},${y}`] = color;
        lighting.compute(lightingCallback);
        
        // remove the second light and recompute
        lighting.setLight(20, 20, null);
        return lighting.compute(lightingCallback);
      });
    });
  });
});

//----------------------------------------------------------------------------
// end of lightingTest.coffee
