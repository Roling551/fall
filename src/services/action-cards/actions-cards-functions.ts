import { Coordiante } from "../../models/coordinate"
import { Estate } from "../../models/estate"
import { KeyValuePair } from "../../models/key-value-pair"
import { Tile } from "../../models/tile"
import { BenefitsService } from "../benefits.service"
import { addTileToCityAndCreateEstate, createEstate } from "../world-state/functions"
import { WorldStateService } from "../world-state/world-state.service"

export function getCreateEstateAction(
    worldStateService: WorldStateService,
    benefitsService: BenefitsService,
    getEstate: ()=>Estate
) {
    return (tile: KeyValuePair<Coordiante, Tile>)=>{
        console.log("Create estate")
        if(worldStateService.cities.get().size<1) {
            return false
        }
        let city
        for(const city_ of worldStateService.cities.get()) {
            city = worldStateService.tiles.get(city_[0])
            break
        }
        console.log("Create estate 1")
        addTileToCityAndCreateEstate(tile, city!, getEstate, benefitsService)
        return true
    }
}