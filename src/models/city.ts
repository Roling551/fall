import { computed } from "@angular/core";
import { createForceSignal, ForceSignal } from "../util/force-signal"
import { Coordiante } from "./coordinate"
import { KeyValuePair } from "./key-value-pair"
import { Tile } from "./tile"
import { MapEntity } from "./map-entity";
import { GenericMapEntity } from "./generic-map-entity";
import { addExistingNumericalValues } from "../util/map-functions";

export class City extends MapEntity {

    constructor() {
        super("city")
    }

    readonly type = "city"

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

    produced = computed(()=>{
        const production = new Map([["food",0]])
        for (const [key, tile] of this.ownedTiles.get().entries()) {
            const mapEntity = tile.get().value.mapEntity
            if(!!mapEntity && mapEntity.type === "genericMapEntity") {
                const genericMapEntity = mapEntity as GenericMapEntity
                addExistingNumericalValues(production, genericMapEntity.produced)
            }
        }
        return production
    })
}