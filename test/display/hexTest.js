/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// hexTest.coffee
//----------------------------------------------------------------------------

const should = require('should');
const ROT = require('../../lib/rot');

describe('hex', function() {
  it('should export ROT.Display.Hex', function() {
    ROT.should.have.property('Display');
    return ROT.Display.should.have.property('Hex');
  });

  it('should be possible to create a Hex object', function() {
    const hex = new ROT.Display.Hex();
    return hex.should.be.ok;
  });
    
  return describe('Hex', function() {
    it('should cache a reference to the provided context', function() {
      const MOCK_context = document.createElement("canvas").getContext("2d");
      const hex = new ROT.Display.Hex(MOCK_context);
      return hex._context.should.equal(MOCK_context);
    });

    describe('compute', () =>
      it("should allow hexes to be transposed", function() {
        // compute without transposition
        let options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        const hex = new ROT.Display.Hex(MOCK_context);
        hex.compute(options = {
          spacing: 1,
          fontSize: 10,
          transpose: false,
          width: 80,
          height: 25
        }
        );
        hex._options.should.equal(options);
        const xprop = hex._context.canvas.width;
        const yprop = hex._context.canvas.height;
        // compute with transposition
        const MOCK_context2 = document.createElement("canvas").getContext("2d");
        const hex2 = new ROT.Display.Hex(MOCK_context2);
        hex2.compute(options = {
          spacing: 1,
          fontSize: 10,
          transpose: true,
          width: 80,
          height: 25
        }
        );
        // how do they compare?
        hex2._context.canvas.width.should.equal(yprop);
        return hex2._context.canvas.height.should.equal(xprop);
      })
    );

    describe('draw', function() {
      it('should clear the hex if asked to do so', function(done) {
        const MOCK_context = document.createElement("canvas").getContext("2d");
        const hex = new ROT.Display.Hex(MOCK_context);
        hex._fill = () => done();
        return hex.draw([ 3, 5, 'a', '#ccc', '#000' ], true);
      });

      it('should transpose the hex if asked to do so', function() {
        let options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        const hex = new ROT.Display.Hex(MOCK_context);
        hex.compute(options = {
          spacing: 1,
          fontSize: 10,
          transpose: true,
          width: 80,
          height: 25
        }
        );
        return hex.draw([ 3, 5, 'a', '#ccc', '#000' ], true);
      });

      return it('should not draw a character if none is provided', function() {
        const MOCK_context = document.createElement("canvas").getContext("2d");
        MOCK_context.fillText = () => should.fail();
        const hex = new ROT.Display.Hex(MOCK_context);
        return hex.draw([ 3, 5, undefined, '#ccc', '#000' ]);
    });
  });

    describe('computeSize', function() {
      it("should compute width and height for available size and spacing", function() {
        let options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        MOCK_context.measureText = function() {
          let result;
          return result =
            {width: 5};
        };
        const hex = new ROT.Display.Hex(MOCK_context);
        hex.compute(options = {
          spacing: 2,
          fontSize: 5,
          transpose: false
        }
        );
        const [width, height] = Array.from(hex.computeSize(800, 250));
        width.should.equal(130);
        return height.should.equal(23);
      });

      return it("should compute width and height for transposed hexes", function() {
        let options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        MOCK_context.measureText = function() {
          let result;
          return result =
            {width: 5};
        };
        const hex = new ROT.Display.Hex(MOCK_context);
        hex.compute(options = {
          spacing: 2,
          fontSize: 5,
          transpose: true
        }
        );
        const [width, height] = Array.from(hex.computeSize(800, 250));
        width.should.equal(40);
        return height.should.equal(75);
      });
    });

    describe('computeFontSize', function() {
      it("should compute fontSize from physical size / display size", function() {
        let options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        MOCK_context.measureText = function() {
          let result;
          return result =
            {width: 10};
        };
        const hex = new ROT.Display.Hex(MOCK_context);
        hex.compute(options = {
          spacing: 2,
          width: 80,
          height: 25,
          transpose: false
        }
        );
        const fontSize = hex.computeFontSize(800, 250);
        return fontSize.should.equal(6);
      });

      return it("should compute fontSize for transposed hexes", function() {
        let options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        MOCK_context.measureText = function() {
          let result;
          return result =
            {width: 10};
        };
        const hex = new ROT.Display.Hex(MOCK_context);
        hex.compute(options = {
          spacing: 1,
          width: 80,
          height: 25,
          transpose: true
        }
        );
        const fontSize = hex.computeFontSize(800, 250);
        return fontSize.should.equal(5);
      });
    });

    describe('eventToPosition', function() {
      it("should compute the hex for a given event", function() {
        let options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        MOCK_context.canvas.width = 800;
        MOCK_context.canvas.height = 250;
        MOCK_context.measureText = function() {
          let result;
          return result =
            {width: 10};
        };
        const hex = new ROT.Display.Hex(MOCK_context);
        hex.compute(options = {
          fontSize: 10,
          spacing: 1,
          width: 80,
          height: 25,
          transpose: false
        }
        );
        const [x,y] = Array.from(hex.eventToPosition(400, 125));
        x.should.equal(65);
        return y.should.equal(11);
      });

      it("should compute the hex for an event on an odd row", function() {
        let options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        MOCK_context.canvas.width = 800;
        MOCK_context.canvas.height = 250;
        MOCK_context.measureText = function() {
          let result;
          return result =
            {width: 10};
        };
        const hex = new ROT.Display.Hex(MOCK_context);
        hex.compute(options = {
          fontSize: 10,
          spacing: 1,
          width: 80,
          height: 25,
          transpose: false
        }
        );
        const [x,y] = Array.from(hex.eventToPosition(400, 130));
        x.should.equal(64);
        return y.should.equal(12);
      });

      return it("should compute the transposed hex for a given event", function() {
        let options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        MOCK_context.canvas.width = 800;
        MOCK_context.canvas.height = 250;
        MOCK_context.measureText = function() {
          let result;
          return result =
            {width: 10};
        };
        const hex = new ROT.Display.Hex(MOCK_context);
        hex.compute(options = {
          fontSize: 10,
          spacing: 1,
          width: 80,
          height: 25,
          transpose: true
        }
        );
        const [x,y] = Array.from(hex.eventToPosition(400, 125));
        x.should.equal(20);
        return y.should.equal(120);
      });
    });

    return describe('_fill', () =>
      it("should fill non-transposed hexes", function(done) {
        let options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        MOCK_context.canvas.width = 800;
        MOCK_context.canvas.height = 250;
        MOCK_context.fill = () => done();
        MOCK_context.measureText = function() {
          let result;
          return result =
            {width: 10};
        };
        const hex = new ROT.Display.Hex(MOCK_context);
        hex.compute(options = {
          fontSize: 10,
          spacing: 1,
          width: 80,
          height: 25,
          transpose: false
        }
        );
        return hex._fill(2, 2);
      })
    );
  });
});

//----------------------------------------------------------------------------
// end of hexTest.coffee
