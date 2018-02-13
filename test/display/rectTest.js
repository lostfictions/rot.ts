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
// rectTest.coffee
//----------------------------------------------------------------------------

const should = require('should');
const ROT = require('../../lib/rot');

describe('rect', function() {
  it('should export ROT.Display.Rect', function() {
    ROT.should.have.property('Display');
    return ROT.Display.should.have.property('Rect');
  });

  it('should be possible to create a Rect object', function() {
    const rect = new ROT.Display.Rect();
    return rect.should.be.ok;
  });
    
  return describe('Rect', function() {
    it('should cache a reference to the provided context', function() {
      const MOCK_context = document.createElement("canvas").getContext("2d");
      const rect = new ROT.Display.Rect(MOCK_context);
      return rect._context.should.equal(MOCK_context);
    });

    describe('draw', function() {
      const OLD_cache = ROT.Display.Rect.cache;

      afterEach(() => ROT.Display.Rect.cache = OLD_cache);

      it('should draw without a cache, if configured', function(done) {
        const MOCK_context = document.createElement("canvas").getContext("2d");
        const rect = new ROT.Display.Rect(MOCK_context);
        ROT.Display.Rect.cache = false;
        rect._drawNoCache = () => done();
        return rect.draw([ 6, 5, 'a', '#ccc', '#000' ]);
    });

      return it('should draw using the cache, if configured', function(done) {
        const MOCK_context = document.createElement("canvas").getContext("2d");
        const rect = new ROT.Display.Rect(MOCK_context);
        ROT.Display.Rect.cache = true;
        rect._drawWithCache = () => done();
        return rect.draw([ 6, 5, 'a', '#ccc', '#000' ]);
    });
  });

    describe('_drawWithCache', function() {
      it('should cache the things being drawn', function() {
        const MOCK_context = document.createElement("canvas").getContext("2d");
        const rect = new ROT.Display.Rect(MOCK_context);
        should(rect._canvasCache["a#ccc#000"]).equal(undefined);
        rect._drawWithCache([ 6, 5, 'a', '#ccc', '#000' ]);
        return rect._canvasCache["a#ccc#000"].should.be.ok;
      });

      it('should re-use cached things when drawing', function(done) {
        const CACHED = {};
        const MOCK_context = document.createElement("canvas").getContext("2d");
        MOCK_context.drawImage = function(canvas) { if (canvas === CACHED) { return done(); } };
        const rect = new ROT.Display.Rect(MOCK_context);
        rect._canvasCache["a#ccc#000"] = CACHED;
        return rect._drawWithCache([ 6, 5, 'a', '#ccc', '#000' ]);
    });

      return it('should cache even if a character is not provided', function() {
        const MOCK_context = document.createElement("canvas").getContext("2d");
        const rect = new ROT.Display.Rect(MOCK_context);
        should(rect._canvasCache["undefined#ccc#000"]).equal(undefined);
        rect._drawWithCache([ 6, 5, undefined, '#ccc', '#000' ]);
        return rect._canvasCache["undefined#ccc#000"].should.be.ok;
      });
    });

    describe('_drawNoCache', function() {
      const oldRectCache = ROT.Display.Rect.cache;
      
      beforeEach(() => ROT.Display.Rect.cache = false);

      afterEach(() => ROT.Display.Rect.cache = oldRectCache);

      it("should call fillRect if clearBefore is set", function(done) {
        const MOCK_context = document.createElement("canvas").getContext("2d");
        MOCK_context.fillRect = () => done();
        const rect = new ROT.Display.Rect(MOCK_context);
        return rect._drawNoCache([ 6, 5, '@', '#fff', '#000' ], true);
      });

      it("should return if no character is provided", function() {
        const MOCK_context = document.createElement("canvas").getContext("2d");
        MOCK_context.fillText = function() { throw new Error("AWWW HELL NO!"); };
        const rect = new ROT.Display.Rect(MOCK_context);
        return rect._drawNoCache([ 6, 5, undefined, '#fff', '#000' ], false);
      });

      return it("should call fillText if a character is provided", function(done) {
        const MOCK_context = document.createElement("canvas").getContext("2d");
        MOCK_context.fillRect = function() {};
        MOCK_context.fillText = () => done();
        const rect = new ROT.Display.Rect(MOCK_context);
        return rect._drawNoCache([ 6, 5, '@', '#fff', '#000' ], true);
      });
    });

    describe('computeSize', function() {
      it('should compute width as availWidth / x-spacing', function() {
        let options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        MOCK_context.measureText = function() {
          let result;
          return result =
            {width: 5};
        };
        const rect = new ROT.Display.Rect(MOCK_context);
        rect.compute(options =
          {spacing: 2}
        );
        const [width, height] = Array.from(rect.computeSize(700, 500));
        return width.should.equal(70);
      });

      return it('should compute height as availHeight / y-spacing', function() {
        let options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        const rect = new ROT.Display.Rect(MOCK_context);
        rect.compute(options = {
          fontSize: 5,
          spacing: 2
        }
        );
        const [width, height] = Array.from(rect.computeSize(700, 500));
        return height.should.equal(50);
      });
    });

    return describe('computeFontSize', function() {
      it("should compute fontSize from physical size / display size", function() {
        let options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        const rect = new ROT.Display.Rect(MOCK_context);
        rect.compute(options = {
          width: 70,
          height: 50,
          spacing: 1
        }
        );
        const fontSize = rect.computeFontSize(700, 500);
        return fontSize.should.equal(10);
      });

      it("should not let skewed aspect ratios mess things up", function() {
        let options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        MOCK_context.measureText = function() {
          let result;
          return result =
            {width: 110};
        };
        const rect = new ROT.Display.Rect(MOCK_context);
        rect.compute(options = {
          width: 70,
          height: 50,
          spacing: 1
        }
        );
        const fontSize = rect.computeFontSize(700, 500);
        return fontSize.should.equal(9);
      });

      return it("should allow a square aspect ratio to be forced", function() {
        let options;
        const MOCK_context = document.createElement("canvas").getContext("2d");
        MOCK_context.measureText = function() {
          let result;
          return result =
            {width: 110};
        };
        const rect = new ROT.Display.Rect(MOCK_context);
        rect.compute(options = {
          width: 70,
          height: 50,
          spacing: 1,
          forceSquareRatio: true
        }
        );
        const fontSize = rect.computeFontSize(700, 500);
        return fontSize.should.equal(9);
      });
    });
  });
});

//----------------------------------------------------------------------------
// end of rectTest.coffee
