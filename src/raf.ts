if (typeof window !== "undefined") {
  window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(cb: (t: number) => void): number {
      return setTimeout(function(): void {
        cb(Date.now());
      }, 1000 / 60);
    };

  window.cancelAnimationFrame =
    window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    function(id: number) {
      return clearTimeout(id);
    };
}
