/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// arenaTest.coffee
//----------------------------------------------------------------------------

const _ = require("underscore");
const should = require("should");
const ROT = require("../../lib/rot");

describe("arena", function() {
  it("should export ROT.Map.Arena", function() {
    ROT.should.have.property("Map");
    return ROT.Map.should.have.property("Arena");
  });

  it("should be possible to create an Arena object", function() {
    const arena = new ROT.Map.Arena();
    return arena.should.be.ok;
  });

  return describe("Arena", function() {
    it("should extend ROT.Map", function() {
      const arena = new ROT.Map.Arena();
      arena.should.be.an.instanceof(ROT.Map);
      return arena.should.be.an.instanceof(ROT.Map.Arena);
    });
  
    return describe("create", function() {
      it("should call the callback width x height times", function(done) {
        const { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT;
        const almostDone = _.after(DEFAULT_WIDTH*DEFAULT_HEIGHT, done);
        const arena = new ROT.Map.Arena();
        return arena.create((x, y, value) => almostDone());
      });

      return it("should create a fully dug room", function() {
        const { DEFAULT_WIDTH, DEFAULT_HEIGHT } = ROT;
        const arena = new ROT.Map.Arena();
        return arena.create(function(x, y, value) {
          if (x === 0) {
            if (value !== 1) { throw new Error("bad mojo"); }
          } else if (y === 0) {
            if (value !== 1) { throw new Error("bad mojo"); }
          } else if (x === (DEFAULT_WIDTH-1)) {
            if (value !== 1) { throw new Error("bad mojo"); }
          } else if (y === (DEFAULT_HEIGHT-1)) {
            if (value !== 1) { throw new Error("bad mojo"); }
          } else {
            if (value !== 0) { throw new Error("bad mojo"); }
          }
        });
      });
    });
  });
});

//----------------------------------------------------------------------------
// end of arenaTest.coffee
