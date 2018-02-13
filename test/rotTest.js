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
// rotTest.coffee
//----------------------------------------------------------------------------

const should = require('should');
const ROT = require('../lib/rot');

describe('rot', function() {
  it('should export the ROT namespace', () => ROT.should.be.ok);

  it('should have an isSupported method', () => ROT.should.have.property('isSupported'));

  return it('should be supported on Node.js', () => ROT.isSupported().should.equal(true));
});

//----------------------------------------------------------------------------
// end of rotTest.coffee
