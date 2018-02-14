const g = global as any;

// tslint:disable:typedef no-empty

g.requestAnimationFrame = (cb: any) =>
  setTimeout(() => {
    cb(Date.now());
  }, 1000 / 60);

g.document = {
  body: {
    appendChild() {},
    scrollLeft: 0,
    scrollTop: 0
  },
  createElement() {
    let canvas: any;
    return (canvas = {
      getBoundingClientRect() {
        return {
          left: 0,
          top: 0
        };
      },
      getContext() {
        return {
          _termcolor: null as any,
          beginPath() {},
          canvas,
          clearRect() {
            if (this._termcolor !== null) {
              const clearCmd = this._termcolor.clearToAnsi(this.fillStyle);
              process.stdout.write(clearCmd);
            }
          },
          drawImage() {},
          fill() {},
          fillRect() {
            if (this._termcolor !== null) {
              const clearCmd = this._termcolor.clearToAnsi(this.fillStyle);
              process.stdout.write(clearCmd);
            }
          },
          fillStyle: "#000",
          fillText() {},
          font: "monospace",
          lineTo() {},
          measureText() {
            return {
              width: 12
            };
          },
          moveTo() {},
          textAlign: "center",
          textBaseline: "middle"
        };
      },
      height: 0,
      style: {
        left: "100px",
        position: "absolute",
        top: "100px",
        visibility: "hidden"
      },
      width: 0
    });
  },
  documentElement: {
    scrollLeft: 0,
    scrollTop: 0
  }
};
