/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// mapTest.coffee
//----------------------------------------------------------------------------

const should = require('should');
const ROT = require('../../lib/rot');

describe('map', function() {
  it('should export ROT.Map', () => ROT.should.have.property('Map'));

  it('should be possible to create a Map object', function() {
    const map = new ROT.Map();
    return map.should.be.ok;
  });
    
  return describe('Map', function() {
    describe('Map', function() {
      it("should use default size if not provided", function() {
        const map = new ROT.Map();
        map._width.should.equal(ROT.DEFAULT_WIDTH);
        return map._height.should.equal(ROT.DEFAULT_HEIGHT);
      });

      return it("should use size if provided", function() {
        const map = new ROT.Map(42, 69);
        map._width.should.equal(42);
        return map._height.should.equal(69);
      });
    });

    describe('create', () =>
      it("should do nothing", function() {
        const map = new ROT.Map();
        return map.create();
      })
    );

    return describe('_fillMap', () =>
      it("should return a row-major two-dimensional array of the map", function() {
        const map = new ROT.Map(5, 7);
        const array = map._fillMap("X");
        array.length.should.equal(5);
        array[0].length.should.equal(7);
        return array[0][0].should.equal("X");
      })
    );
  });
});

//----------------------------------------------------------------------------
// end of mapTest.coffee
