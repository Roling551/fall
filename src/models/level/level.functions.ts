import { TurnActorsService } from "../../services/turn-actors.service";
import { City } from "../city";
import { Coordinate } from "../coordinate";
import { Estate } from "../estate";
import { KeyValuePair } from "../key-value-pair";
import { Tile } from "../tile";

export function createEstate(
    tile: KeyValuePair<Coordinate, Tile>, 
    cityTile: KeyValuePair<Coordinate, Tile>,
    getEstate: (tile: Tile)=>Estate,
    turnActorsService: TurnActorsService,
) {
    if(!!tile.value.mapEntity.get() || tile.value.belongsTo.get() != cityTile.value.mapEntity.get()) {
        return false
    }
    const estate = getEstate(tile.value);
    tile.value.mapEntity.set(estate)
    turnActorsService.addActor(estate)
    return true
}

export function addTileToCityIfAllowed(
    tile: KeyValuePair<Coordinate, Tile>, 
    cityTile: KeyValuePair<Coordinate, Tile>
) {
    if(tile.value.mapEntity.get()) {
        return false
    }
    const mapEntity = cityTile.value.mapEntity.get()!
    const city = mapEntity as City
    tile.value.belongsTo.set(mapEntity)
    city.addOwnedTile(tile)
    return true
}

export function addTileToCityAndCreateEstate(
    tile: KeyValuePair<Coordinate, Tile>, 
    cityTile: KeyValuePair<Coordinate, Tile>,
    getEstate: (tile: Tile)=>Estate,
    turnActorsService: TurnActorsService,
) {
    if(addTileToCityIfAllowed(tile, cityTile)) {
        return createEstate(tile, cityTile, getEstate, turnActorsService)
    }
    return false
}

export function addOrRemoveTileToCity(
    tile: KeyValuePair<Coordinate, Tile>, 
    cityTile: KeyValuePair<Coordinate, Tile>
) {
    if(tile.value.mapEntity.get()?.type === "city") {
        return
    }
    const mapEntity = cityTile.value.mapEntity.get()!
    const city = mapEntity as City
    if(!tile.value.belongsTo.get()) {
        tile.value.belongsTo.set(mapEntity)
        city.addOwnedTile(tile)
        
    } else if(tile.value.belongsTo.get()!==mapEntity) {
        const otherCity = tile.value.belongsTo.get() as City
        otherCity.removeOwnedTile(tile)
        tile.value.belongsTo.set(mapEntity)
        city.addOwnedTile(tile)
    }
    else {
        tile.value.belongsTo.set(undefined)
        city.removeOwnedTile(tile)
    }
    }
