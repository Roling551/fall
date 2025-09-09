import { Coordinate } from "../../models/coordinate"
import { Estate } from "../../models/estate"
import { KeyValuePair } from "../../models/key-value-pair"
import { addTileToCityAndCreateEstate } from "../../models/level/level.functions"
import { Tile } from "../../models/tile"
import { BenefitsService } from "../benefits.service"
import { CurrentLevelService } from "../current-level.service"
import { TurnActorsService } from "../turn-actors.service"

export function getCreateEstateAction(
    levelService: CurrentLevelService,
    turnActorsService: TurnActorsService,
    getEstate: (tile: Tile)=>Estate
) {
    return (tile: KeyValuePair<Coordinate, Tile>)=>{
        const level = levelService.level.get()
        if(!level || level.cities.get().size<1) {
            return false
        }
        let city
        for(const city_ of level.cities.get()) {
            city = level.map.tiles.get(city_[0])
            break
        }
        return addTileToCityAndCreateEstate(tile, city!, getEstate, turnActorsService)
    }
}