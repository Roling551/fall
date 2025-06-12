import { computed } from "@angular/core";
import { createForceSignal, ForceSignal } from "../util/force-signal"
import { Coordiante } from "./coordinate"
import { KeyValuePair } from "./key-value-pair"
import { Tile } from "./tile"

export class City {

    maxTiles = 3

    ownedTiles = createForceSignal(new Map<string, ForceSignal<KeyValuePair<Coordiante, Tile>>>());

    addOwnedTile(tile: ForceSignal<KeyValuePair<Coordiante, Tile>>) {
        this.ownedTiles.get().set(tile.get().key.getKey(), tile)
        this.ownedTiles.forceUpdate()
    }

    removeOwnedTile(tile: ForceSignal<KeyValuePair<Coordiante, Tile>>) {
        this.ownedTiles.get().delete(tile.get().key.getKey())
        this.ownedTiles.forceUpdate()
    }

    ownedTilesNumber = computed(()=>{
        return this.ownedTiles.get().size
    })

    canNextTurn = computed(()=>{
        return this.ownedTilesNumber() <= this.maxTiles
    })
}