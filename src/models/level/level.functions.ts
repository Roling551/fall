import { TurnActorsService } from "../../services/turn-actors.service";
import { Coordinate } from "../coordinate";
import { Estate } from "../estate";
import { KeyValuePair } from "../key-value-pair";
import { MapEntityType } from "../map-entity";
import { Tile } from "../tile/tile";

export function createEstate(
    turnActorsService: TurnActorsService,
    tile: KeyValuePair<Coordinate, Tile>,
    getEstate: (tile: Tile)=>Estate,
    type: MapEntityType,
) {
    if(!tile.value.canAddEntity(type)) {
        return false
    }
    const estate = getEstate(tile.value);
    turnActorsService.addActor(estate)
    return tile.value.addMapEntity(estate)
}