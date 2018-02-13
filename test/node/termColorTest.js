/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// termColorTest.coffee
//----------------------------------------------------------------------------

const should = require("should");
const ROT = require("../../lib/rot");

describe("term-color", function() {
  it("should export ROT.Display.Term.Color", function() {
    ROT.should.have.property("Display");
    ROT.Display.should.have.property("Term");
    return ROT.Display.Term.should.have.property("Color");
  });

  it("should be possible to create a Color object", function() {
    const term = new ROT.Display.Term.Color();
    return term.should.be.ok;
  });

  return describe("Color", function() {
    describe("Color", () =>
      it("should cache the provided context", function() {
        const context = {};
        const color = new ROT.Display.Term.Color(context);
        return color._context.should.equal(context);
      })
    );

    describe("clearToAnsi", () =>
      it("should do nothing", function() {
        const context = {};
        const color = new ROT.Display.Term.Color(context);
        return color.clearToAnsi();
      })
    );

    describe("colorToAnsi", () =>
      it("should do nothing", function() {
        const context = {};
        const color = new ROT.Display.Term.Color(context);
        return color.colorToAnsi();
      })
    );

    return describe("positionToAnsi", () =>
      it("should do nothing", function() {
        const context = {};
        const color = new ROT.Display.Term.Color(context);
        return color.positionToAnsi();
      })
    );
  });
});

//----------------------------------------------------------------------------
// end of termColorTest.coffee
