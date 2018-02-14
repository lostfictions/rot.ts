import { KEYS, DIRS } from "..";
import { Being } from "./being";
import { XY } from "./xy";

import { game } from "./game";

export class Player extends Being {
  protected _keys: { [key: number]: number } = {
    [KEYS.VK_K]: 0,
    [KEYS.VK_UP]: 0,
    [KEYS.VK_NUMPAD8]: 0,
    [KEYS.VK_U]: 1,
    [KEYS.VK_NUMPAD9]: 1,
    [KEYS.VK_L]: 2,
    [KEYS.VK_RIGHT]: 2,
    [KEYS.VK_NUMPAD6]: 2,
    [KEYS.VK_N]: 3,
    [KEYS.VK_NUMPAD3]: 3,
    [KEYS.VK_J]: 4,
    [KEYS.VK_DOWN]: 4,
    [KEYS.VK_NUMPAD2]: 4,
    [KEYS.VK_B]: 5,
    [KEYS.VK_NUMPAD1]: 5,
    [KEYS.VK_H]: 6,
    [KEYS.VK_LEFT]: 6,
    [KEYS.VK_NUMPAD4]: 6,
    [KEYS.VK_Y]: 7,
    [KEYS.VK_NUMPAD7]: 7,

    [KEYS.VK_PERIOD]: -1,
    [KEYS.VK_CLEAR]: -1,
    [KEYS.VK_NUMPAD5]: -1
  };

  constructor() {
    super({ ch: "@", fg: "#fff" });
  }

  act(): void {
    game.textBuffer.write("It is your turn, press any relevant key.");
    game.textBuffer.flush();
    game.engine.lock();
    window.addEventListener("keydown", this);
  }

  die(): void {
    super.die();
    game.over();
  }

  handleEvent(e: KeyboardEvent): void {
    const keyHandled = this._handleKey(e.keyCode);

    if (keyHandled) {
      window.removeEventListener("keydown", this);
      game.engine.unlock();
    }
  }

  _handleKey(code: number): boolean {
    if (code in this._keys) {
      game.textBuffer.clear();

      const direction = this._keys[code];
      if (direction === -1) {
        /* noop */
        /* FIXME show something? */
        return true;
      }

      const dir = DIRS[8][direction];
      const xy = this._xy!.plus(new XY(dir[0], dir[1]));

      this._level!.setEntity(this, xy); /* FIXME collision detection */
      return true;
    }

    /* unknown key */
    return false;
  }
}
