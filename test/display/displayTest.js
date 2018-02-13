/* eslint-disable
    no-undef,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// displayTest.coffee
//----------------------------------------------------------------------------

const should = require('should');
const ROT = require('../../lib/rot');

const oldRAF = global.requestAnimationFrame;

describe('display', function() {
  beforeEach(() => global.requestAnimationFrame = function() {});
    
  afterEach(() => global.requestAnimationFrame = oldRAF);
    
  it('should export ROT.Display', () => ROT.should.have.property('Display'));

  it('should be possible to create a Display object', function() {
    const display = new ROT.Display();
    return display.should.be.ok;
  });
    
  return describe('Display', function() {
    it('should use provided options', function() {
      const display = new ROT.Display({
        width: 40,
        height: 12,
        layout: "hex"
      });
      const options = display.getOptions();
      options.should.be.ok;
      options.should.have.properties(['width', 'height', 'layout']);
      options.width.should.equal(40);
      options.height.should.equal(12);
      return options.layout.should.equal("hex");
    });

    it('should have some useful methods', function() {
      const display = new ROT.Display();
      return display.should.have.properties([ 'DEBUG', 'clear', 'setOptions',
        'getOptions', 'getContainer', 'computeSize', 'computeFontSize',
        'eventToPosition', 'draw', 'drawText' ]);
  });

    describe('DEBUG', () =>
      it('can be used as a map generator callback', function() {
        const display = new ROT.Display();
        return display.DEBUG(5, 5, 0);
      })
    );

    describe('clear', () =>
      it('should clear the display', function() {
        const display = new ROT.Display();
        display.draw(5,  4, "@");
        display._data.should.not.eql({});
        display.clear();
        display._data.should.eql({});
        return display._dirty.should.equal(true);
      })
    );

    describe('setOptions', function() {
      it('should do nothing if called with an empty object', function() {
        const display = new ROT.Display();
        const options = display.getOptions();
        display.setOptions({});
        return display.getOptions().should.equal(options);
      });

      it('should not change the layout if not provided with a new layout', function() {
        const display = new ROT.Display();
        const backend = display._backend;
        display.setOptions({
          width: 80,
          height: 25
        });
        return display._backend.should.equal(backend);
      });

      it('should use a fontStyle if one is provided in the options', function() {
        const display = new ROT.Display();
        display._context.font.should.equal('15px monospace');
        display.setOptions({
          fontSize: 12,
          fontStyle: 'bold'
        });
        return display._context.font.should.equal('bold 12px monospace');
      });

      return it('should NOT use fontStyle if fontSize and/or fontFamily is not provided in the options', function() {
        const display = new ROT.Display();
        display._context.font.should.equal('15px monospace');
        display.setOptions({
          fontStyle: 'bold'});
        return display._context.font.should.equal('15px monospace');
      });
    });

    describe('getContainer', () =>
      it('should return a shim <canvas> DOM object', function() {
        const display = new ROT.Display();
        const canvas = display.getContainer();
        canvas.should.be.ok;
        const shim = document.createElement('canvas');
        shim.height = 375;
        shim.width = 960;
        return canvas.should.eql(shim);
      })
    );

    describe('computeSize', () =>
      it('should call computeSize in the backend', function(done) {
        const display = new ROT.Display();
        display._backend =
          {computeSize() { return done(); }};
        return display.computeSize();
      })
    );

    describe('computeFontSize', () =>
      it('should call computeFontSize in the backend', function(done) {
        const display = new ROT.Display();
        display._backend =
          {computeFontSize() { return done(); }};
        return display.computeFontSize();
      })
    );

    describe('eventToPosition', function() {
      it('should call eventToPosition in the backend', function(done) {
        const display = new ROT.Display();
        display._backend =
          {eventToPosition() { return done(); }};
        return display.eventToPosition({
          clientX: 20,
          clientY: 20
        });
      });

      it('should use the first touch if provided with touches', function() {
        const display = new ROT.Display();
        const position = display.eventToPosition({
          touches: [ {clientX:5*12, clientY:5*15 }, {clientX:10*12, clientY:10*15} ],
          clientX: 15*12,
          clientY: 15*15
        });
        return position.should.eql([5, 5]);
    });

      it('should return [-1,-1] if off the canvas to the left', function() {
        const display = new ROT.Display();
        const position = display.eventToPosition({
          clientX: -5,
          clientY: 15*15
        });
        return position.should.eql([-1, -1]);
    });

      it('should return [-1,-1] if off the canvas above', function() {
        const display = new ROT.Display();
        const position = display.eventToPosition({
          clientX: 15*12,
          clientY: -5
        });
        return position.should.eql([-1, -1]);
    });

      it('should return [-1,-1] if off the canvas to the right', function() {
        const display = new ROT.Display();
        const position = display.eventToPosition({
          clientX: 965,
          clientY: 15*15
        });
        return position.should.eql([-1, -1]);
    });

      return it('should return [-1,-1] if off the canvas below', function() {
        const display = new ROT.Display();
        const position = display.eventToPosition({
          clientX: 15*12,
          clientY: 380
        });
        return position.should.eql([-1, -1]);
    });
  });

    describe('draw', function() {
      it('should use the default fg if a fg is not provided', function() {
        const display = new ROT.Display({width:40, height:12, fg:'#abc', bg:'#cba'});
        display.draw(3, 5, '@', null, '#000');
        return display._data["3,5"].should.eql([ 3, 5, '@', '#abc', '#000' ]);
    });

      it('should use the default bg if a bg is not provided', function() {
        const display = new ROT.Display({width:40, height:12, fg:'#abc', bg:'#cba'});
        display.draw(3, 5, '@', '#000', null);
        return display._data["3,5"].should.eql([ 3, 5, '@', '#000', '#cba' ]);
    });

      it('should create a dirty map if it does not have one', function() {
        const display = new ROT.Display({width:40, height:12, fg:'#abc', bg:'#cba'});
        delete display._dirty;
        should(display._dirty).not.be.ok;
        display.draw(5, 7, 'X', '#000', '#111');
        display._data["5,7"].should.eql([ 5, 7, 'X', '#000', '#111' ]);
        display._dirty.should.be.ok;
        return display._dirty["5,7"].should.equal(true);
      });

      return it('should use an existing dirty map if it has one', function() {
        const display = new ROT.Display({width:40, height:12, fg:'#abc', bg:'#cba'});
        display._dirty = {};
        display.draw(5, 7, 'X', '#000', '#111');
        display._data["5,7"].should.eql([ 5, 7, 'X', '#000', '#111' ]);
        return display._dirty["5,7"].should.equal(true);
      });
    });

    describe('drawText', function() {
      it('should return 1 when drawing one line', function() {
        const display = new ROT.Display();
        const result = display.drawText(3, 5, "Hello, world!");
        return result.should.equal(1);
      });

      it('should return 3 when drawing three lines', function() {
        const display = new ROT.Display();
        const result = display.drawText(3, 5, "Robots:\nMega Man\nMetal Man");
        return result.should.equal(3);
      });

      it('should change the foreground color with %c{name}', function() {
        const display = new ROT.Display();
        const result = display.drawText(3, 5, "%c{#00f}Hello");
        result.should.equal(1);
        return display._data["3,5"].should.eql([ 3, 5, 'H', '#00f', '#000' ]);
    });

      it('should change the background color with %b{name}', function() {
        const display = new ROT.Display();
        const result = display.drawText(3, 5, "%b{#00f}Hello");
        result.should.equal(1);
        return display._data["3,5"].should.eql([ 3, 5, 'H', '#ccc', '#00f' ]);
    });

      it('should reset the foreground color with %c{}', function() {
        const display = new ROT.Display();
        const result = display.drawText(3, 5, "%c{#00f}He%c{}llo");
        result.should.equal(1);
        return display._data["5,5"].should.eql([ 5, 5, 'l', '#ccc', '#000' ]);
    });

      it('should reset the background color with %b{}', function() {
        const display = new ROT.Display();
        const result = display.drawText(3, 5, "%b{#00f}He%b{}llo");
        result.should.equal(1);
        return display._data["5,5"].should.eql([ 5, 5, 'l', '#ccc', '#000' ]);
    });

      it('should break lines at a specified maximum width', function() {
        const OUTPUT = 'This is the longest sentence in the English language.';
        const display = new ROT.Display();
        const result = display.drawText(3, 5, OUTPUT, 10);
        // 0123456789
        // This is
        // the           
        // longest
        // sentence
        // in the
        // English
        // language.
        return result.should.equal(7);
      });

      it('should add extra spaces for full-width characters', function() {
        const display = new ROT.Display();
        const result = display.drawText(3, 5, "ⅧⅧⅧ");
        result.should.equal(1);
        display._data["4,5"].should.eql([ 4, 5, 'Ⅷ', '#ccc', '#000' ]);
        display._data["6,5"].should.eql([ 6, 5, 'Ⅷ', '#ccc', '#000' ]);
        return display._data["8,5"].should.eql([ 8, 5, 'Ⅷ', '#ccc', '#000' ]);
    });

      it('should not add extra spaces if the previous character was a space', function() {
        const display = new ROT.Display();
        const result = display.drawText(3, 5, "Ⅷ Ⅷ");
        result.should.equal(1);
        display._data["4,5"].should.eql([ 4, 5, 'Ⅷ', '#ccc', '#000' ]);
        display._data["5,5"].should.eql([ 5, 5, ' ', '#ccc', '#000' ]);
        return display._data["6,5"].should.eql([ 6, 5, 'Ⅷ', '#ccc', '#000' ]);
    });

      it('should add extra spaces if the previous character was not a space', function() {
        const display = new ROT.Display();
        const result = display.drawText(3, 5, "ⅧaⅧ");
        result.should.equal(1);
        display._data["4,5"].should.eql([ 4, 5, 'Ⅷ', '#ccc', '#000' ]);
        display._data["6,5"].should.eql([ 6, 5, 'a', '#ccc', '#000' ]);
        return display._data["8,5"].should.eql([ 8, 5, 'Ⅷ', '#ccc', '#000' ]);
    });

      return it('a character between 0xffdc and 0xffe8 should not be considered full-width', function() {
        const display = new ROT.Display();
        const result = display.drawText(3, 5, "\uffe0\uffe0\uffe0");
        result.should.equal(1);
        display._data["3,5"].should.eql([ 3, 5, '￠', '#ccc', '#000' ]);
        display._data["4,5"].should.eql([ 4, 5, '￠', '#ccc', '#000' ]);
        return display._data["5,5"].should.eql([ 5, 5, '￠', '#ccc', '#000' ]);
    });
  });

    describe("_tick", function() {
      it('should call RAF to reschedule itself', function(done) {
        const display = new ROT.Display();
        const prevRAF = global.requestAnimationFrame;
        global.requestAnimationFrame = function() {
          done();
          return global.requestAnimationFrame = prevRAF;
        };
        return display._tick();
      });

      it('should return if nothing is dirty on the display', function() {
        const display = new ROT.Display();
        display._dirty = false;
        return display._tick();
      });

      it('should redraw everything if _dirty is true', function(done) {
        const display = new ROT.Display();
        display._data =
          {"1,1": [ 1, 1, '@', '#fff', '#000' ]};
        display._dirty = true;
        display._draw = () => done();
        return display._tick();
      });

      return it('should redraw only the _dirty stuff', function(done) {
        const display = new ROT.Display();
        display._data = {
          "1,1": [ 1, 1, '@', '#fff', '#000' ],
          "2,2": [ 2, 2, '@', '#fff', '#000' ],
          "3,3": [ 3, 3, '@', '#fff', '#000' ]
        };
        display._dirty = 
          {"2,2": [ 2, 2, '@', '#fff', '#000' ]};
        display._draw = () => done();
        return display._tick();
      });
    });

    return describe("_draw", function() {
      it("should call draw on the backend", function(done) {
        const display = new ROT.Display();
        display._backend =
          {draw() { return done(); }};
        display._data = {
          "1,1": [ 1, 1, '@', '#fff', '#000' ],
          "2,2": [ 2, 2, '@', '#fff', '#000' ],
          "3,3": [ 3, 3, '@', '#fff', '#000' ]
        };
        return display._draw("2,2");
      });

      return it("should set clearBefore if the background doesn't match", function(done) {
        const display = new ROT.Display();
        display._backend =
          {draw(data, clear) { if (clear) { return done(); } }};
        display._data = {
          "1,1": [ 1, 1, '@', '#fff', '#000' ],
          "2,2": [ 2, 2, '@', '#fff', '#888' ],
          "3,3": [ 3, 3, '@', '#fff', '#000' ]
        };
        return display._draw("2,2");
      });
    });
  });
});

//----------------------------------------------------------------------------
// end of displayTest.coffee
