import { City } from "../../models/city"
import { Coordiante } from "../../models/coordinate"
import { Estate } from "../../models/estate"
import { KeyValuePair } from "../../models/key-value-pair"
import { Tile } from "../../models/tile"
import { mapContainsMap, substractNumericalValuesFunctional } from "../../util/map-functions"
import { BenefitsService } from "../benefits.service"
import { WorldStateService } from "./world-state.service"

export function addOrRemoveTileToCity(
    tile: KeyValuePair<Coordiante, Tile>, 
    cityTile: KeyValuePair<Coordiante, Tile>
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
    tile: KeyValuePair<Coordiante, Tile>, 
    cityTile: KeyValuePair<Coordiante, Tile>,
    getEstate: ()=>Estate,
    benefitsService: BenefitsService,
) {
    if(!!tile.value.mapEntity.get() || tile.value.belongsTo.get() != cityTile.value.mapEntity.get()) {
        return false
    }
    const estate = getEstate();
    estate.bonus = benefitsService.listenForEstateProductionBonuses(estate)
    tile.value.mapEntity.set(estate)
    return true
}

export function addTileToCityIfAllowed(
    tile: KeyValuePair<Coordiante, Tile>, 
    cityTile: KeyValuePair<Coordiante, Tile>
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
    tile: KeyValuePair<Coordiante, Tile>, 
    cityTile: KeyValuePair<Coordiante, Tile>,
    getEstate: ()=>Estate,
    benefitsService: BenefitsService,
) {
    if(addTileToCityIfAllowed(tile, cityTile)) {
        return createEstate(tile, cityTile, getEstate, benefitsService)
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