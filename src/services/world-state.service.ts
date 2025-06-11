import { Injectable, signal } from '@angular/core';
import { Tile } from '../models/tile';
import { Coordiante } from '../models/coordinate';
import { KeyValuePair } from '../models/key-value-pair';
import { createForceSignal, ForceSignal } from '../util/force-signal';

@Injectable({
  providedIn: 'root'
})
export class WorldStateService {

  tiles = this.getTiles(0,0,5)

  constructor() { }
  
  private getTiles(x: number, y:number, range: number): Map<string, ForceSignal<KeyValuePair<Coordiante, Tile>>> {
    let tiles = new Map<string, ForceSignal<KeyValuePair<Coordiante, Tile>>>()
    for(let i = -range; i <= range; i++) {
      for(let j = -range; j <= range; j++) {
        const tile = {key:new Coordiante(i+x, j+y), value:new Tile("ground")}
        tiles.set(tile.key.getKey(), createForceSignal(tile))
      } 
    }
    return tiles
  }
}
