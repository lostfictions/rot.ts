/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// stringGeneratorTest.coffee
//----------------------------------------------------------------------------

const should = require("should");
const ROT = require("../lib/rot");

describe("stringgenerator", function() {
  it("should export ROT.StringGenerator", () => ROT.should.have.property("StringGenerator"));
    
  it("should be possible to create a StringGenerator", function() {
    let MOCK_options;
    const stringGenerator = new ROT.StringGenerator(MOCK_options =
      {words: false}
    );
  		({
    order: 3,
  		  prior: 0.001
  });
    return stringGenerator.should.be.ok;
  });
  
  return describe("StringGenerator", function() {
    describe("observe", () =>
      it("should build a model based on observations of test data", function() {
        let MOCK_options;
        let j;
        let i;
        const stringGenerator = new ROT.StringGenerator(MOCK_options = {
          words: false,
          order: 3,
          prior: 0.0001
        }
        );
        stringGenerator._data.should.eql({});
        stringGenerator._priorValues.should.eql({ '\u0000': 0.0001 });
        const letters = "abcdefghijklmnopqrstuvwxyz".split('');
        for (j = 1, i = j; j <= 100; j++, i = j) {
          const rndWord = ((() => {
            let asc, end;
            const result = [];
            for (i = 1, end = (Math.floor(Math.random()*10))+3, asc = 1 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
              result.push(letters.random());
            }
            return result;
          })()).join('');
          stringGenerator.observe(rndWord);
        }
        stringGenerator._data.should.not.eql({});
        return stringGenerator._priorValues.should.not.eql({});
    })
  );

    describe("clear", () =>
      it("should clear the model of previous observations of test data", function() {
        let MOCK_options;
        let j;
        let i;
        const stringGenerator = new ROT.StringGenerator(MOCK_options = {
          words: true,
          order: 3,
          prior: 0.0001
        }
        );
        stringGenerator._data.should.eql({});
        stringGenerator._priorValues.should.eql({ '\u0000': 0.0001 });
        const letters = "abcdefghijklmnopqrstuvwxyz     ".split('');
        for (j = 1, i = j; j <= 100; j++, i = j) {
          const rndWord = ((() => {
            let asc, end;
            const result = [];
            for (i = 1, end = (Math.floor(Math.random()*10))+3, asc = 1 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
              result.push(letters.random());
            }
            return result;
          })()).join('');
          stringGenerator.observe(rndWord);
        }
        stringGenerator._data.should.not.eql({});
        stringGenerator._priorValues.should.not.eql({});
        stringGenerator.clear();
        stringGenerator._data.should.eql({});
        return stringGenerator._priorValues.should.eql({});
    })
  );

    describe("generate", function() {
      it("should generate words from the observed model", function() {
        let MOCK_options;
        let j;
        let i;
        const stringGenerator = new ROT.StringGenerator(MOCK_options = {
          words: false,
          order: 3,
          prior: 0.0001
        }
        );
        stringGenerator._data.should.eql({});
        stringGenerator._priorValues.should.eql({ '\u0000': 0.0001 });
        const letters = "abcdefghijklmnopqrstuvwxyz".split('');
        for (j = 1, i = j; j <= 100; j++, i = j) {
          const rndWord = ((() => {
            let asc, end;
            const result = [];
            for (i = 1, end = (Math.floor(Math.random()*10))+3, asc = 1 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
              result.push(letters.random());
            }
            return result;
          })()).join('');
          stringGenerator.observe(rndWord);
        }
        stringGenerator._data.should.not.eql({});
        stringGenerator._priorValues.should.not.eql({});
        return (() => {
          const result1 = [];
          for (i = 1; i <= 100; i++) {
            const word = stringGenerator.generate();
            result1.push(word.should.be.a.String);
          }
          return result1;
        })();
      });

      it("should generate different words without a specified prior", function() {
        let MOCK_options;
        let j;
        let i;
        const stringGenerator = new ROT.StringGenerator(MOCK_options = {
          words: false,
          order: 3,
          prior: null
        }
        );
        stringGenerator._data.should.eql({});
        stringGenerator._priorValues.should.eql({ '\u0000': null });
        const letters = "abcdefghijklmnopqrstuvwxyz".split('');
        for (j = 1, i = j; j <= 100; j++, i = j) {
          const rndWord = ((() => {
            let asc, end;
            const result = [];
            for (i = 1, end = (Math.floor(Math.random()*10))+3, asc = 1 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
              result.push(letters.random());
            }
            return result;
          })()).join('');
          stringGenerator.observe(rndWord);
        }
        stringGenerator._data.should.not.eql({});
        stringGenerator._priorValues.should.not.eql({});
        return (() => {
          const result1 = [];
          for (i = 1; i <= 100; i++) {
            const word = stringGenerator.generate();
            result1.push(word.should.be.a.String);
          }
          return result1;
        })();
      });

      return it("should generate nothing when no observations are made", function() {
        let MOCK_options;
        const stringGenerator = new ROT.StringGenerator(MOCK_options = {
          words: false,
          order: 3,
          prior: 0.0001
        }
        );
        return (() => {
          const result = [];
          for (let i = 1; i <= 100; i++) {
            const word = stringGenerator.generate();
            result.push(word.should.equal(""));
          }
          return result;
        })();
      });
    });

    return describe("getStats", () =>
      it("should generate some statistics for debug purposes", function() {
        let MOCK_options;
        let j;
        let i;
        const stringGenerator = new ROT.StringGenerator(MOCK_options = {
          words: false,
          order: 3,
          prior: 0.0001
        }
        );
        stringGenerator._data.should.eql({});
        stringGenerator._priorValues.should.eql({ '\u0000': 0.0001 });
        const letters = "abcdefghijklmnopqrstuvwxyz".split('');
        for (j = 1, i = j; j <= 100; j++, i = j) {
          const rndWord = ((() => {
            let asc, end;
            const result = [];
            for (i = 1, end = (Math.floor(Math.random()*10))+3, asc = 1 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
              result.push(letters.random());
            }
            return result;
          })()).join('');
          stringGenerator.observe(rndWord);
        }
        stringGenerator._data.should.not.eql({});
        stringGenerator._priorValues.should.not.eql({});
        const stats = stringGenerator.getStats();
        return stats.should.be.a.String;
      })
    );
  });
});

//----------------------------------------------------------------------------
// end of stringGeneratorTest.coffee
