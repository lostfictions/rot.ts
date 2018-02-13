/* eslint-disable
    no-undef,
    no-unused-vars,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// numberTest.coffee
//----------------------------------------------------------------------------

const should = require('should');
const ROT = require('../../lib/rot');

describe('number', function() {
  it('should have added methods to the Number prototype', () => ((15)).should.have.property('mod'));

  return describe('mod', function() {
    it('should return a positive result on (pos % pos)', () => ((15)).mod(7).should.equal(1));

    return it('should return a positive result on (neg % pos)', () => (-15).mod(7).should.equal(6));
  });
});

//----------------------------------------------------------------------------
// end of numberTest.coffee
