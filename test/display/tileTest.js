/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// tileTest.coffee
//----------------------------------------------------------------------------

const should = require('should');
const ROT = require('../../lib/rot');

describe('tile', function() {
  it('should export ROT.Display.Tile', function() {
    ROT.should.have.property('Display');
    return ROT.Display.should.have.property('Tile');
  });

  it('should be possible to create a Tile object', function() {
    const tile = new ROT.Display.Tile();
    return tile.should.be.ok;
  });
    
  return describe('Tile', function() {
    it('should cache a reference to the provided context', function() {
      const MOCK_context = document.createElement("canvas").getContext("2d");
      const tile = new ROT.Display.Tile(MOCK_context);
      return tile._context.should.equal(MOCK_context);
    });

    describe('compute', () =>
      it('should cache a reference to the provided options', function() {
        let MOCK_options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        const tile = new ROT.Display.Tile(MOCK_context);
        tile.compute(MOCK_options = {
          tileWidth: 16,
          tileHeight: 16,
          width: 20,
          height: 12
        }
        );
        tile._options.should.equal(MOCK_options);
        tile._context.canvas.width.should.equal(320);
        tile._context.canvas.height.should.equal(192);
        tile._colorCanvas.width.should.equal(16);
        return tile._colorCanvas.height.should.equal(16);
      })
    );

    describe('draw', function() {
      it("should draw nothing when given nothing", function() {
        const MOCK_context = document.createElement("canvas").getContext("2d");
        const tile = new ROT.Display.Tile(MOCK_context);
        tile.draw([ null, null, null, null, null ], false);
        return tile._context.fillStyle.should.equal("#000");
      });

      it('should call clearRect when clearing with tileColorize', function(done) {
        let MOCK_options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        MOCK_context.clearRect = () => done();
        const tile = new ROT.Display.Tile(MOCK_context);
        tile.compute(MOCK_options = {
          tileWidth: 16,
          tileHeight: 16,
          width: 20,
          height: 12,
          tileColorize: true
        }
        );
        return tile.draw([ null, null, null, null, null ], true);
      });

      it('should call fillRect when clearing without tileColorize', function(done) {
        let MOCK_options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        MOCK_context.fillRect = () => done();
        const tile = new ROT.Display.Tile(MOCK_context);
        tile.compute(MOCK_options = {
          tileWidth: 16,
          tileHeight: 16,
          width: 20,
          height: 12,
          tileColorize: false
        }
        );
        return tile.draw([ null, null, null, null, null ], true);
      });

      it("should throw an error if an unmapped tile is used", function() {
        let MOCK_options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        MOCK_context.fillRect = () => done();
        const tile = new ROT.Display.Tile(MOCK_context);
        tile.compute(MOCK_options = {
          tileWidth: 16,
          tileHeight: 16,
          tileMap: {},
          width: 20,
          height: 12
        }
        );
        const x = 3;
        const y = 5;
        const ch = "@";
        const fg = "#000";
        const bg = "transparent";
        return should.throws(() => tile.draw([ x, y, ch, fg, bg ], false));
      });

      it('should call drawImage when drawing without tileColorize', function(done) {
        let MOCK_options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        MOCK_context.drawImage = () => done();
        const tile = new ROT.Display.Tile(MOCK_context);
        tile.compute(MOCK_options = {
          tileWidth: 16,
          tileHeight: 16,
          tileMap: {
            "@": [16,16]
          },
          width: 20,
          height: 12,
          tileColorize: false
        }
        );
        const x = 3;
        const y = 5;
        const ch = "@";
        const fg = "#000";
        const bg = "transparent";
        return tile.draw([ x, y, ch, fg, bg ], false);
      });

      it('should call drawImage when drawing with tileColorize', function(done) {
        let MOCK_options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        MOCK_context.drawImage = () => done();
        const tile = new ROT.Display.Tile(MOCK_context);
        tile.compute(MOCK_options = {
          tileWidth: 16,
          tileHeight: 16,
          tileMap: {
            "@": [16,16]
          },
          width: 20,
          height: 12,
          tileColorize: true
        }
        );
        const x = 3;
        const y = 5;
        const ch = "@";
        const fg = "#000";
        const bg = "transparent";
        return tile.draw([ x, y, ch, fg, bg ], false);
      });

      return it('should handle transparent fg as well', function(done) {
        let MOCK_options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        MOCK_context.drawImage = () => done();
        const tile = new ROT.Display.Tile(MOCK_context);
        tile.compute(MOCK_options = {
          tileWidth: 16,
          tileHeight: 16,
          tileMap: {
            "@": [16,16]
          },
          width: 20,
          height: 12,
          tileColorize: true
        }
        );
        const x = 3;
        const y = 5;
        const ch = "@";
        const fg = "transparent";
        const bg = "#000";
        return tile.draw([ x, y, ch, fg, bg ], false);
      });
    });

    describe("computeSize", () =>
      it("should compute tile count as physical size / tile size", function() {
        let MOCK_options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        const tile = new ROT.Display.Tile(MOCK_context);
        tile.compute(MOCK_options = {
          tileWidth: 16,
          tileHeight: 16,
          tileMap: {
            "@": [16,16]
          },
          width: 20,
          height: 12,
          tileColorize: true
        }
        );
        const [width, height] = Array.from(tile.computeSize(320, 200));
        width.should.equal(20);
        return height.should.equal(12);
      })
    );

    describe("computeFontSize", () =>
      it("should compute tile size as physical size / tile count", function() {
        let MOCK_options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        const tile = new ROT.Display.Tile(MOCK_context);
        tile.compute(MOCK_options = {
          tileWidth: 16,
          tileHeight: 16,
          tileMap: {
            "@": [16,16]
          },
          width: 20,
          height: 12,
          tileColorize: true
        }
        );
        const [tileWidth, tileHeight] = Array.from(tile.computeFontSize(320, 200));
        tileWidth.should.equal(16);
        return tileHeight.should.equal(16);
      })
    );

    return describe("eventToPosition", () =>
      it("should compute logical coordinates from physical ones", function() {
        let MOCK_options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        const tile = new ROT.Display.Tile(MOCK_context);
        tile.compute(MOCK_options = {
          tileWidth: 16,
          tileHeight: 16,
          tileMap: {
            "@": [16,16]
          },
          width: 20,
          height: 12,
          tileColorize: true
        }
        );
        const [x, y] = Array.from(tile.eventToPosition(50, 70));
        x.should.equal(3);
        return y.should.equal(4);
      })
    );
  });
});

//----------------------------------------------------------------------------
// end of tileTest.coffee
