import { TurnActorsService } from "../../services/turn-actors.service";
import { Coordinate } from "../coordinate";
import { Estate } from "../estate";
import { KeyValuePair } from "../key-value-pair";
import { Tile } from "../tile/tile";

export function createEstate(
    tile: KeyValuePair<Coordinate, Tile>,
    getEstate: (tile: Tile)=>Estate,
    turnActorsService: TurnActorsService,
) {
    if(!!tile.value.mapEntity.get()) {
        return false
    }
    const estate = getEstate(tile.value);
    tile.value.mapEntity.set(estate)
    turnActorsService.addActor(estate)
    return true
}