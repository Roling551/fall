import { Coordinate } from "../../models/coordinate"
import { Estate } from "../../models/estate"
import { KeyValuePair } from "../../models/key-value-pair"
import { Tile } from "../../models/tile"
import { BenefitsService } from "../benefits.service"
import { TurnActorsService } from "../turn-actors.service"
import { addTileToCityAndCreateEstate, createEstate } from "../world-state/functions"
import { WorldStateService } from "../world-state/world-state.service"

export function getCreateEstateAction(
    worldStateService: WorldStateService,
    turnActorsService: TurnActorsService,
    getEstate: (tile: Tile)=>Estate
) {
    return (tile: KeyValuePair<Coordinate, Tile>)=>{
        if(worldStateService.cities.get().size<1) {
            return false
        }
        let city
        for(const city_ of worldStateService.cities.get()) {
            city = worldStateService.tiles.get(city_[0])
            break
        }
        return addTileToCityAndCreateEstate(tile, city!, getEstate, turnActorsService)
    }
}