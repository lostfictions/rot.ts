/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// arrayTest.coffee
//----------------------------------------------------------------------------

const should = require('should');
const ROT = require('../../lib/rot');

const NUM_RANDOM_CALLS = 100;

describe('array', function() {
  it('should have added methods to the Array prototype', () => [].should.have.properties(['random', 'randomize']));

  describe('random', function() {
    it('should return null when the array is empty', () => should([].random()).equal(null));

    return it('should return a random element from the array', function() {
      const names = [ 'Alice', 'Bob', 'Carol', 'Dave' ];
      return (() => {
        const result = [];
        for (let i = 1, end = NUM_RANDOM_CALLS, asc = 1 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
          const randomName = names.random();
          result.push((Array.from(names).includes(randomName)).should.equal(true));
        }
        return result;
      })();
    });
  });

  return describe('randomize', function() {
    it('should return an empty array if provided an empty array', () => ([].randomize()).should.eql([]));

    return it('should return an randomized array when provided with an array', function() {
      const names = [ 'Alice', 'Bob', 'Carol', 'Dave' ];
      const numNames = names.length;
      const randomizedNames = names.randomize();
      randomizedNames.length.should.equal(numNames);
      return names.length.should.equal(0);
    });
  });
});

//----------------------------------------------------------------------------
// end of arrayTest.coffee
