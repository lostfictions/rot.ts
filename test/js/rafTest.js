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
// rafTest.coffee
//----------------------------------------------------------------------------

const should = require('should');
const ROT = require('../../lib/rot');

describe('raf', function() {
  it('should provide a global requestAnimationFrame method', () => global.should.have.property('requestAnimationFrame'));
    
  xit('should provide a global cancelAnimationFrame method', () => global.should.have.property('cancelAnimationFrame'));
    
  it('should call the provided callback', done =>
    global.requestAnimationFrame(() => done())
  );
    
  return xit('should cancel the provided callback', function() {
    const requestId = global.requestAnimationFrame(function() { throw new Error("BAD!"); });
    return global.cancelAnimationFrame(requestId);
  });
});

//----------------------------------------------------------------------------
// end of rafTest.coffee
