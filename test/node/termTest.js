/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// termTest.coffee
//----------------------------------------------------------------------------

const should = require("should");
const ROT = require("../../lib/rot");

describe("term", function() {
  it("should export ROT.Display.Term", function() {
    ROT.should.have.property("Display");
    return ROT.Display.should.have.property("Term");
  });

  it("should be possible to create a Term object", function() {
    const term = new ROT.Display.Term();
    return term.should.be.ok;
  });

  return describe("Term", function() {
    const TERM_WIDTH = 80;
    const TERM_HEIGHT = 25;
    
    const oldColumns = process.stdout.columns;
    const oldRows = process.stdout.rows;
    
    beforeEach(function() {
      process.stdout.columns = TERM_WIDTH;
      return process.stdout.rows = TERM_HEIGHT;
    });

    afterEach(function() {
      process.stdout.columns = oldColumns;
      return process.stdout.rows = oldRows;
    });

    it("should extend ROT.Display.Backend", function() {
      const term = new ROT.Display.Term();
      term.should.be.an.instanceof(ROT.Display.Backend);
      return term.should.be.an.instanceof(ROT.Display.Term);
    });

    describe("compute", () =>
      it("should cache the provided options", function() {
        const context = {};
        const options = {
          width: TERM_WIDTH,
          height: TERM_HEIGHT,
          termColor: "xterm"
        };
        const term = new ROT.Display.Term(context);
        term.compute(options);
        return term._options.should.equal(options);
      })
    );

    describe("draw", function() {
      it("should draw at the appropriate location", function() {
        const context = {};
        const options = {
          width: TERM_WIDTH,
          height: TERM_HEIGHT,
          termColor: "xterm"
        };
        const term = new ROT.Display.Term(context);
        term.compute(options);
        return term.draw([5, 5, "@", "#fff", "#000"]);
    });

      it("should bail if off the left side", function() {
        const context = {};
        const options = {
          width: TERM_WIDTH,
          height: TERM_HEIGHT,
          termColor: "xterm"
        };
        const term = new ROT.Display.Term(context);
        term.compute(options);
        return term.draw([-2, 5, "@", "#fff", "#000"]);
    });

      it("should bail if off the right side", function() {
        const context = {};
        const options = {
          width: TERM_WIDTH,
          height: TERM_HEIGHT,
          termColor: "xterm"
        };
        const term = new ROT.Display.Term(context);
        term.compute(options);
        return term.draw([(TERM_WIDTH + 2), 5, "@", "#fff", "#000"]);
    });

      it("should bail if off the top side", function() {
        const context = {};
        const options = {
          width: TERM_WIDTH,
          height: TERM_HEIGHT,
          termColor: "xterm"
        };
        const term = new ROT.Display.Term(context);
        term.compute(options);
        return term.draw([5, -5, "@", "#fff", "#000"]);
    });

      it("should bail if off the bottom side", function() {
        const context = {};
        const options = {
          width: TERM_WIDTH,
          height: TERM_HEIGHT,
          termColor: "xterm"
        };
        const term = new ROT.Display.Term(context);
        term.compute(options);
        return term.draw([5, (TERM_HEIGHT + 5), "@", "#fff", "#000"]);
    });

      it("should not move the cursor if it doesn't need to", function() {
        const context = {};
        const options = {
          width: TERM_WIDTH,
          height: TERM_HEIGHT,
          termColor: "xterm"
        };
        const term = new ROT.Display.Term(context);
        term.compute(options);
        term.draw([5, 5, "@", "#fff", "#000"]);
        return term.draw([6, 5, "@", "#fff", "#000"]);
    });

      it("should provide a space if we're clearing", function() {
        const context = {};
        const options = {
          width: TERM_WIDTH,
          height: TERM_HEIGHT,
          termColor: "xterm"
        };
        const term = new ROT.Display.Term(context);
        term.compute(options);
        return term.draw([5, 5, undefined, "#fff", "#000"], true);
      });

      it("should use a character when clearing, if provided", function() {
        const context = {};
        const options = {
          width: TERM_WIDTH,
          height: TERM_HEIGHT,
          termColor: "xterm"
        };
        const term = new ROT.Display.Term(context);
        term.compute(options);
        return term.draw([5, 5, "#", "#fff", "#000"], true);
      });

      it("should bail if not provided with a character and not clearing", function() {
        const context = {};
        const options = {
          width: TERM_WIDTH,
          height: TERM_HEIGHT,
          termColor: "xterm"
        };
        const term = new ROT.Display.Term(context);
        term.compute(options);
        return term.draw([5, 5, undefined, "#fff", "#000"], false);
      });

      return it("should wrap to the next line, if needed", function() {
        const context = {};
        const options = {
          width: TERM_WIDTH,
          height: TERM_HEIGHT,
          termColor: "xterm"
        };
        const term = new ROT.Display.Term(context);
        term.compute(options);
        term.draw([79, 5, "@", "#fff", "#000"], true);
        term._cx.should.equal(0);
        return term._cy.should.equal(6);
      });
    });

    describe("computeSize", () =>
      it("should wrap to the next line, if needed", function() {
        const context = {};
        const options = {
          width: TERM_WIDTH,
          height: TERM_HEIGHT,
          termColor: "xterm"
        };
        const term = new ROT.Display.Term(context);
        term.compute(options);
        const [width, height] = Array.from(term.computeSize());
        width.should.equal(TERM_WIDTH);
        return height.should.equal(TERM_HEIGHT);
      })
    );

    describe("computeFontSize", () =>
      it("should always return 12", function() {
        const context = {};
        const options = {
          width: TERM_WIDTH,
          height: TERM_HEIGHT,
          termColor: "xterm"
        };
        const term = new ROT.Display.Term(context);
        term.compute(options);
        return term.computeFontSize().should.equal(12);
      })
    );

    return describe("eventToPosition", () =>
      it("should always return what it was given", function() {
        const context = {};
        const options = {
          width: TERM_WIDTH,
          height: TERM_HEIGHT,
          termColor: "xterm"
        };
        const term = new ROT.Display.Term(context);
        term.compute(options);
        return term.eventToPosition(13,19).should.eql([13, 19]);
    })
  );
});
});

//----------------------------------------------------------------------------
// end of termTest.coffee
