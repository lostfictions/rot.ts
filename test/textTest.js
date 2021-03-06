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
// textTest.coffee
//----------------------------------------------------------------------------

const should = require('should');
const ROT = require('../lib/rot');

describe('text', function() {
  it('should exist in the ROT namespace', () => ROT.Text.should.be.ok);
    
  it('should have some text handling methods', () => ROT.Text.should.have.properties(['measure', 'tokenize']));

  return describe('measure', function() {
    it('should throw when measure is called with null', () => (() => ROT.Text.measure(null)).should.throw());
      
    it('should measure simple lines', () =>
      ROT.Text.measure('Hello').should.eql({
        height: 1,
        width: 5
      })
    );

    it('should measure multiple lines', () =>
      ROT.Text.measure('Hello!\nThis is a long line.\nGoodbye').should.eql({
        height: 3,
        width: 20
      })
    );

    it('should measure with embedded color commands', () =>
      ROT.Text.measure('Goodbye %c{red}cr%b{blue}u%b{}el %c{}world').should.eql({
        height: 1,
        width: 19
      })
    );

    it('should measure with adjacent embedded color commands', () =>
      ROT.Text.measure('Goodbye %c{red}cr%c{white}%b{blue}u%b{}el %c{}world').should.eql({
        height: 1,
        width: 19
      })
    );

    it('should measure with only embedded color commands', () =>
      ROT.Text.measure('%c{red}%c{white}%b{blue}%b{}%c{}').should.eql({
        height: 1,
        width: 0
      })
    );

    it('should trim simple lines', () =>
      ROT.Text.measure('  Hello  ').should.eql({
        height: 1,
        width: 5
      })
    );

    it('should trim multiple lines', () =>
      ROT.Text.measure('  Hello!\nThis is a long line.\nGoodbye!  ').should.eql({
        height: 3,
        width: 20
      })
    );

    it('should constrain to a maximum width if specified', () =>
      ROT.Text.measure("This line of text is very long.", 16).should.eql({
        height: 3,
        width: 12
      })
    );

    it('should measure very long lines that are constrained', () =>
      ROT.Text.measure("Thisisaverylongconstrainedlinethatwillbedifficulttobreak", 10).should.eql({
        height: 6,
        width: 10
      })
    );

    it('should measure text with pathological newlines and spaces', () =>
      ROT.Text.measure("  Alice\n  Bob\n\n  Carol\n  \n  Dave  \n\n  \nEve").should.eql({
        height: 9,
        width: 5
      })
    );

    return it('should measure text by breaking breakable tokens', () =>
      ROT.Text.measure("Hungry Hungry %c{red}Hippo", 17).should.eql({
        height: 2,
        width: 13
      })
    );
  });
});

//----------------------------------------------------------------------------
// end of textTest.coffee
