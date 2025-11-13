import { Coordinate } from "../../models/coordinate"
import { Estate } from "../../models/estate"
import { KeyValuePair } from "../../models/key-value-pair"
import { createEstate } from "../../models/level/level.functions"
import { MapEntityType } from "../../models/map-entity"
import { Tile } from "../../models/tile/tile"
import { CurrentLevelService } from "../current-level.service"
import { TurnActorsService } from "../turn-actors.service"

export function getCreateEstateAction(
    levelService: CurrentLevelService,
    turnActorsService: TurnActorsService,
    getEstate: (tile: Tile)=>Estate,
    type: MapEntityType,
) {
    return (tile: KeyValuePair<Coordinate, Tile>)=>{
        const level = levelService.level.get()
        if(!level) {
            return false
        }
        return createEstate(turnActorsService, tile, getEstate, type)
    }
}