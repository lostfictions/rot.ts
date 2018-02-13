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
// backendTest.coffee
//----------------------------------------------------------------------------

const should = require('should');
const ROT = require('../../lib/rot');

describe('backend', function() {
  it('should export ROT.Display.Backend', function() {
    ROT.should.have.property('Display');
    return ROT.Display.should.have.property('Backend');
  });

  it('should be possible to create a Backend object', function() {
    const backend = new ROT.Display.Backend();
    return backend.should.be.ok;
  });
    
  return describe('Backend', function() {
    it('should cache a reference to the provided context', function() {
      const MOCK_context = document.createElement("canvas").getContext("2d");
      const backend = new ROT.Display.Backend(MOCK_context);
      return backend._context.should.equal(MOCK_context);
    });

    return it('should have some no-op function properties', function() {
      const MOCK_context = document.createElement("canvas").getContext("2d");
      const backend = new ROT.Display.Backend(MOCK_context);
      backend.should.have.properties([ "compute", "computeFontSize",
        "computeSize", "draw", "eventToPosition" ]);
      backend.compute();
      backend.computeFontSize();
      backend.computeSize();
      backend.draw();
      return backend.eventToPosition();
    });
  });
});

//----------------------------------------------------------------------------
// end of backendTest.coffee
