import { computed, Injectable, signal } from '@angular/core';
import { Tile } from '../models/tile';
import { Coordiante } from '../models/coordinate';
import { KeyValuePair } from '../models/key-value-pair';
import { createForceSignal, ForceSignal } from '../util/force-signal';
import { City } from '../models/city';
import { addExistingNumericalValues } from '../util/map-functions';
import { Unit } from '../models/unit';

@Injectable({
  providedIn: 'root'
})
export class WorldStateService {

  tiles = this.getTiles(0,0,5)
  turn = signal(0)
  resources = createForceSignal(new Map([["gold",25]]))
  cities = createForceSignal(new Map<string, ForceSignal<City>>());

  canNextTurn = computed(()=>{
    for (const [coordinate, city] of this.cities.get().entries()) {
      if(!city.get().canNextTurn()) {
        return false;
      }
    }
    return true;
  })

  constructor() { }
  
  private getTiles(x: number, y:number, range: number): Map<string, KeyValuePair<Coordiante, Tile>> {
    let tiles = new Map<string, KeyValuePair<Coordiante, Tile>>()
    for(let i = -range; i <= range; i++) {
      for(let j = -range; j <= range; j++) {
        const tile = {key:new Coordiante(i+x, j+y), value:new Tile("ground")}
        tiles.set(tile.key.getKey(), tile)
      } 
    }
    return tiles
  }

  public nextTurn() {
    for (const [coordinate, city] of this.cities.get().entries()) {
      addExistingNumericalValues(this.resources.get(), city.get().produced());
      this.resources.forceUpdate();
    }
    this.turn.update(x=>x+1)
  }

  public addCity(coordinate:string, city: ForceSignal<City>) {
    this.cities.get().set(coordinate, city)
    this.cities.forceUpdate()
  }

  public removeCity(tile: KeyValuePair<Coordiante, Tile>) {
    if(tile.value.mapEntity && tile.value.mapEntity.get()?.type === "city") {
      const city = tile.value.mapEntity.get() as City
      for(const [key, value] of city.ownedTiles.get().entries()) {
        value.value.belongsTo.set(undefined);
      }
      city.clearOwnedTiles()
      this.cities.get().delete(tile.key.getKey())
      this.cities.forceUpdate()
    }
  }
}
