import { Injectable, signal } from '@angular/core';
import { forceSignal } from '../util/force-signal';
import { Tile } from '../models/tile';
import { Coordiante } from '../models/coordinate';
import { KeyValuePair } from '../models/key-value-pair';

@Injectable({
  providedIn: 'root'
})
export class WorldStateService {

  tiles = forceSignal(this.getTiles(0,0,5))

  constructor() { }
  
  public getTiles(x: number, y:number, range: number): Map<string, KeyValuePair<Coordiante, Tile>> {
    let tiles = new Map<string, KeyValuePair<Coordiante, Tile>>()
    for(let i = -range; i <= range; i++) {
      for(let j = -range; j <= range; j++) {
        const tile = {key:new Coordiante(i+x, j+y), value:new Tile("ground")}
        tiles.set(tile.key.getKey(), tile)
      } 
    }
    return tiles
  }
}
