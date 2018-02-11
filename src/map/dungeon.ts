import { Map } from "./map";
import { Room, Corridor } from "./features";

/**
 * Dungeon map: has rooms and corridors
 * @augments ROT.Map
 */
export abstract class Dungeon extends Map {
  private _rooms: Room[] = []; /* list of all rooms */
  private _corridors: Corridor[] = [];

  /**
   * Get all generated rooms
   */
  getRooms(): Room[] {
    return this._rooms;
  }

  /**
   * Get all generated corridors
   */
  getCorridors(): Corridor[] {
    return this._corridors;
  }
}
