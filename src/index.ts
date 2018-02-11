import "./raf";

export { Color } from "./color";
export { Actor, Engine } from "./engine";
export { EventQueue } from "./eventqueue";
export { DEFAULT_WIDTH, DEFAULT_HEIGHT, DIRS, KEYS } from "./constants";
export { RNG, defaultRNG } from "./rng";

export { Display } from "./display/display";

export { DiscreteShadowcasting } from "./fov/discrete-shadowcasting";
export { PreciseShadowcasting } from "./fov/precise-shadowcasting";
export { RecursiveShadowcasting } from "./fov/recursive-shadowcasting";

export { Simplex } from "./noise/simplex";

export { AStar } from "./path/astar";
export { Dijkstra } from "./path/dijkstra";

export { SimpleScheduler } from "./scheduler/scheduler-simple";
export { ActionScheduler } from "./scheduler/scheduler-action";
export { SpeedScheduler } from "./scheduler/scheduler-speed";

export {
  randomInArray,
  shuffleArray,
  mod,
  clamp,
  capitalize,
  lpad,
  rpad
} from "./util";
