import { computed, Injectable, signal } from '@angular/core';
import { Tile } from '../models/tile';
import { Coordiante } from '../models/coordinate';
import { KeyValuePair } from '../models/key-value-pair';
import { createForceSignal, ForceSignal } from '../util/force-signal';
import { City } from '../models/city';

@Injectable({
  providedIn: 'root'
})
export class WorldStateService {

  tiles = this.getTiles(0,0,5)
  turn = signal(0)
  gold = signal(25)
  cities = createForceSignal(new Map<string, ForceSignal<KeyValuePair<Coordiante, Tile>>>());
  canNextTurn = computed(()=>{
    for (const [coordinate, cityTile] of this.cities.get().entries()) {
      const city = (cityTile.get().value.mapEntity) as City
      if(!city.canNextTurn()) {
        return false;
      }
    }
    return true;
  })

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

  public nextTurn() {
    for (const [coordinate, cityTile] of this.cities.get().entries()) {
      const city = (cityTile.get().value.mapEntity) as City
      this.gold.update(x=>x+(city.produced().get("gold")||0))
    }
    this.turn.update(x=>x+1)
  }

  public addCity(tile: ForceSignal<KeyValuePair<Coordiante, Tile>>) {
      this.cities.get().set(tile.get().key.getKey(), tile)
      this.cities.forceUpdate()
  }

  public removeCity(tile: ForceSignal<KeyValuePair<Coordiante, Tile>>) {
      this.cities.get().delete(tile.get().key.getKey())
      this.cities.forceUpdate()
  }
}
