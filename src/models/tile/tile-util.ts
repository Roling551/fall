import { Estate } from "../estate";
import { SimpleTile } from "./simple-tile";
import { Tile } from "./tile";

export function getPlayersEstate(tile: Tile): (Estate | undefined) {
    if(!(tile instanceof SimpleTile)) {
        return undefined    
    }
    const mapEntity = tile.playersMapEntity.get()
    if(mapEntity instanceof Estate) {
        return mapEntity
    }
    return undefined
}