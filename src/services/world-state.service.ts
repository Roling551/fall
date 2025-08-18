import { computed, Injectable, signal } from '@angular/core';
import { Tile } from '../models/tile';
import { Coordiante } from '../models/coordinate';
import { KeyValuePair } from '../models/key-value-pair';
import { createForceSignal, ForceSignal } from '../util/force-signal';
import { City } from '../models/city';
import { addExistingNumericalValues } from '../util/map-functions';
import { Unit } from '../models/unit';
import { dijkstra } from '../util/path-finding';
import { TileDirection } from '../models/tile-direction';
import { Benefit } from '../models/benefit';

@Injectable({
  providedIn: 'root'
})
export class WorldStateService {
  sizeX = 10
  sizeY = 10

  tiles = this.getTiles(this.sizeX, this.sizeY)
  resources = createForceSignal(new Map([["gold",25]]))
  cities = createForceSignal(new Map<string, ForceSignal<City>>());

  findPath(start: KeyValuePair<Coordiante, Tile>, end: KeyValuePair<Coordiante, Tile>) {
    return this.findPathByKey(start.key.getKey(), end.key.getKey())
  }

  doesCoordinateExists(coordinate: Coordiante) {
      return coordinate.x>0 && coordinate.x<this.sizeX-1 && coordinate.y>0 && coordinate.y<this.sizeY-1
  }

  getNeighborTiles(coordinate: Coordiante): Map<TileDirection, KeyValuePair<Coordiante, Tile>> {
    const neighbors = new Map<TileDirection, KeyValuePair<Coordiante, Tile>>()
    return new Map(coordinate.getNeighborsAndDirections(this.sizeX, this.sizeY).map(cd=>[cd.direction, this.tiles.get(cd.coordinate.getKey())!]))
  }

  getEdgeWeight = (from: string, to: string) => 1

  findPathByKey(start: string, end: string) {
    const getNeighbors = (node: string) => {
      return Coordiante.fromKey(node).getNeighbors(this.sizeX, this.sizeY).map(coordiante=>coordiante.getKey())
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
    for (const [coordinate, city] of this.cities.get().entries()) {
      city.get().nextTurn()
    }
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

  benefits = computed<Map<string, Benefit>>(()=>{
      let result = new Map<string, Benefit>();
      for(const [key, value] of this.cities.get()) {
          result = new Map([...result, ...value.get().benefits()])
      }
      return result
  })
}
