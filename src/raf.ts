if (typeof window !== "undefined") {
  const w = window as any;

  w.requestAnimationFrame =
    w.requestAnimationFrame ||
    w.mozRequestAnimationFrame ||
    w.webkitRequestAnimationFrame ||
    w.oRequestAnimationFrame ||
    w.msRequestAnimationFrame ||
    ((cb: (t: number) => void) =>
      setTimeout(() => {
        cb(Date.now());
      }, 1000 / 60));

  w.cancelAnimationFrame =
    w.cancelAnimationFrame ||
    w.mozCancelAnimationFrame ||
    w.webkitCancelAnimationFrame ||
    w.oCancelAnimationFrame ||
    w.msCancelAnimationFrame ||
    clearTimeout;
}
