import { City } from "../../models/city"
import { Coordiante } from "../../models/coordinate"
import { Estate } from "../../models/estate"
import { KeyValuePair } from "../../models/key-value-pair"
import { Tile } from "../../models/tile"
import { BenefitsService } from "../benefits.service"

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
        return
    }
    const estate = getEstate();
    estate.bonus = benefitsService.listenForEstateProductionBonuses(estate)
    tile.value.mapEntity.set(estate)
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
        createEstate(tile, cityTile, getEstate, benefitsService)
    }
}