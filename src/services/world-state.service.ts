import { computed, Injectable, signal } from '@angular/core';
import { Tile } from '../models/tile';
import { Coordiante } from '../models/coordinate';
import { KeyValuePair } from '../models/key-value-pair';
import { createForceSignal, ForceSignal } from '../util/force-signal';
import { City } from '../models/city';
import { addExistingNumericalValues } from '../util/map-functions';
import { Unit } from '../models/unit';
import { dijkstra } from '../util/path-finding';

@Injectable({
  providedIn: 'root'
})
export class WorldStateService {

  sizeX = 10
  sizeY = 10

  tiles = this.getTiles(this.sizeX, this.sizeY)
  turn = signal(0)
  resources = createForceSignal(new Map([["gold",25]]))
  cities = createForceSignal(new Map<string, ForceSignal<City>>());

  findPath(start: KeyValuePair<Coordiante, Tile>, end: KeyValuePair<Coordiante, Tile>) {
    return this.findPathByKey(start.key.getKey(), end.key.getKey())
  }

  getEdgeWeight = (from: string, to: string) => 1

  findPathByKey(start: string, end: string) {
    const getNeighbors = (node: string) => {
      const [x, y] = Coordiante.getComponents(node)
      const neighbors: string[] = []
      if(x>0) {
        neighbors.push(Coordiante.getKey(x-1, y))
      }
      if(x<this.sizeX-1) {
        neighbors.push(Coordiante.getKey(x+1, y))
      }
      if(y>0) {
        neighbors.push(Coordiante.getKey(x, y-1))
      }
      if(y<this.sizeY-1) {
        neighbors.push(Coordiante.getKey(x, y+1))
      }
      return neighbors
    }
    
    return dijkstra<string>(getNeighbors, this.getEdgeWeight, start, end)
  }

  canNextTurn = computed(()=>{
    for (const [coordinate, city] of this.cities.get().entries()) {
      if(!city.get().canNextTurn()) {
        return false;
      }
    }
    return true;
  })

  constructor() { }
  
  private getTiles(sizeX: number, sizeY: number): Map<string, KeyValuePair<Coordiante, Tile>> {
    let tiles = new Map<string, KeyValuePair<Coordiante, Tile>>()
    for(let i = 0; i < sizeX; i++) {
      for(let j = 0; j < sizeY; j++) {
        const tile = {key:new Coordiante(i, j), value:new Tile("ground")}
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
      tile.value.mapEntity.set(undefined);
      this.cities.get().delete(tile.key.getKey())
      this.cities.forceUpdate()
    }
  }
}
