/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// nodeShimTest.coffee
//----------------------------------------------------------------------------

const should = require('should');
require('../../lib/rot');

describe('node-shim', function() {
  it('should not define window', () => should.not.exist(global.window));

  it('should define a document object as a stub DOM', () => document.should.be.ok);

  return describe('document', function() {
    it('should have DOM-like properties', () => document.should.have.properties(['body', 'createElement', 'documentElement']));

    describe('body', function() {
      it('should have DOM-like properties', () => document.body.should.have.properties(['appendChild', 'scrollLeft', 'scrollTop']));
        
      return it('should have an appendChild stub method', function() {
        document.body.should.have.property('appendChild');
        return should(document.body.appendChild()).not.be.ok;
      });
    });

    describe('createElement', function() {
      it('should return a <canvas> stub object', function() {
        const canvas = document.createElement();
        return canvas.should.be.ok;
      });

      return describe('<canvas>', function() {
        const canvas = document.createElement();

        it('should have DOM-like properties', () => canvas.should.have.properties(['getBoundingClientRect', 'getContext', 'height', 'style', 'width']));

        describe('getBoundingClientRect', () =>
          it('should return a rect stub object', function() {
            const rect = canvas.getBoundingClientRect();
            rect.should.be.ok;
            return rect.should.have.properties(['left', 'top']);
        })
      );

        describe('getContext', function() {
          it('should return a CanvasRenderingContext2D stub object', function() {
            const context = canvas.getContext();
            return context.should.be.ok;
          });

          return describe('CanvasRenderingContext2D', function() {
            const context = canvas.getContext();
            
            it('should have DOM-like properties', () =>
              context.should.have.properties([
                '_termcolor', 'beginPath', 'canvas', 'drawImage', 'fill',
                'fillRect', 'fillStyle', 'fillText', 'font', 'lineTo',
                'measureText', 'moveTo', 'textAlign', 'textBaseline' ])
          );

            it('should have a beginPath stub method', () => should(context.beginPath()).not.be.ok);

            it('should have a drawImage stub method', () => should(context.drawImage()).not.be.ok);

            it('should have a fill stub method', () => should(context.fill()).not.be.ok);

            it('should have a fillText stub method', () => should(context.fillText()).not.be.ok);

            it('should have a lineTo stub method', () => should(context.lineTo()).not.be.ok);

            it('should have a moveTo stub method', () => should(context.moveTo()).not.be.ok);

            it('should have a measureText stub method', function() {
              const result = context.measureText();
              return result.should.have.property('width');
            });

            describe('clearRect', function() {
              it('should do nothing when _termcolor is null', function() {
                should(context._termcolor).equal(null);
                return should(context.clearRect()).not.be.ok;
              });

              return it('should call _termcolor.clearToAnsi when _termcolor is defined', function(done) {
                const old_termcolor = context['_termcolor'];
                context['_termcolor'] = {
                  clearToAnsi() {
                    context['_termcolor'] = old_termcolor;
                    done();
                    return "";
                  }
                };
                return should(context.clearRect()).not.be.ok;
              });
            });

            return describe('fillRect', function() {
              it('should do nothing when _termcolor is null', function() {
                should(context._termcolor).equal(null);
                return should(context.fillRect()).not.be.ok;
              });

              return it('should call _termcolor.clearToAnsi when _termcolor is defined', function(done) {
                const old_termcolor = context['_termcolor'];
                context['_termcolor'] = {
                  clearToAnsi() {
                    context['_termcolor'] = old_termcolor;
                    done();
                    return "";
                  }
                };
                return should(context.fillRect()).not.be.ok;
              });
            });
          });
        });

        return describe('style', () =>
          it('should have DOM-like properties', () => canvas.style.should.have.properties(['left', 'position', 'top', 'visibility']))
      );
    });
  });

    return describe('documentElement', () =>
      it('should have DOM-like properties', () => document.documentElement.should.have.properties(['scrollLeft', 'scrollTop']))
  );
});
});

//----------------------------------------------------------------------------
// end of nodeShimTest.coffee
