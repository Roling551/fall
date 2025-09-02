import { City } from "../../models/city"
import { Coordinate } from "../../models/coordinate"
import { Estate } from "../../models/estate"
import { KeyValuePair } from "../../models/key-value-pair"
import { Tile } from "../../models/tile"
import { mapContainsMap, substractNumericalValuesFunctional } from "../../util/map-functions"
import { BenefitsService } from "../benefits.service"
import { TurnActorsService } from "../turn-actors.service"
import { WorldStateService } from "./world-state.service"

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

export function createEstate(
    tile: KeyValuePair<Coordinate, Tile>, 
    cityTile: KeyValuePair<Coordinate, Tile>,
    getEstate: ()=>Estate,
    turnActorsService: TurnActorsService,
) {
    if(!!tile.value.mapEntity.get() || tile.value.belongsTo.get() != cityTile.value.mapEntity.get()) {
        return false
    }
    const estate = getEstate();
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
    getEstate: ()=>Estate,
    turnActorsService: TurnActorsService,
) {
    if(addTileToCityIfAllowed(tile, cityTile)) {
        return createEstate(tile, cityTile, getEstate, turnActorsService)
    }
    return false
}

export function canAffordResources(worldStateService: WorldStateService, price: Map<string, number>) {
    return mapContainsMap(worldStateService.resources.get(), price)
}

export function spendResources(worldStateService: WorldStateService, price: Map<string, number>) {
    worldStateService.resources.set(substractNumericalValuesFunctional(worldStateService.resources.get(), price))
    worldStateService.resources.forceUpdate()
}