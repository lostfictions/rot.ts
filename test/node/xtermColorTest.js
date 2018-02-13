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
// xtermColorTest.coffee
//----------------------------------------------------------------------------

const should = require("should");
const ROT = require("../../lib/rot");

describe("xterm-color", function() {
  it("should export ROT.Display.Term.Xterm", function() {
    ROT.should.have.property("Display");
    ROT.Display.should.have.property("Term");
    return ROT.Display.Term.should.have.property("Xterm");
  });

  it("should be possible to create an Xterm object", function() {
    const term = new ROT.Display.Term.Xterm();
    return term.should.be.ok;
  });

  return describe("Xterm", function() {
    it("should extend ROT.Display.Term.Xterm", function() {
      const xterm = new ROT.Display.Term.Xterm();
      xterm.should.be.an.instanceof(ROT.Display.Term.Xterm);
      return xterm.should.be.an.instanceof(ROT.Display.Term.Xterm);
    });
  
    describe("Xterm", () =>
      it("should cache the provided context", function() {
        const context = {};
        const xterm = new ROT.Display.Term.Xterm(context);
        return xterm._context.should.equal(context);
      })
    );

    describe("clearToAnsi", () =>
      it("should clear the terminal with the specified color", function() {
        const context = {};
        const xterm = new ROT.Display.Term.Xterm(context);
        return xterm.clearToAnsi("#000").should.equal("\u001b[0;48;5;16m\u001b[2J");
      })
    );

    describe("colorToAnsi", () =>
      it("should modify the foreground and background color of the terminal", function() {
        const context = {};
        const xterm = new ROT.Display.Term.Xterm(context);
        return xterm.colorToAnsi("#fff", "#000").should.equal("\u001b[0;38;5;231;48;5;16m");
      })
    );

    return describe("positionToAnsi", () =>
      it("should reposition the cursor on the terminal", function() {
        const context = {};
        const xterm = new ROT.Display.Term.Xterm(context);
        return xterm.positionToAnsi(13, 19).should.equal("\u001b[20;14H");
      })
    );
  });
});

//----------------------------------------------------------------------------
// end of xtermColorTest.coffee
