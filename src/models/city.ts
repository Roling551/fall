import { computed } from "@angular/core";
import { createForceSignal, ForceSignal } from "../util/force-signal"
import { Coordiante } from "./coordinate"
import { KeyValuePair } from "./key-value-pair"
import { Tile } from "./tile"
import { MapEntity } from "./map-entity";
import { Estate } from "./estate";
import { addExistingNumericalValues } from "../util/map-functions";

export class City extends MapEntity {

    constructor() {
        super("city", 4)
    }

    readonly type = "city"

    ownedTiles = createForceSignal(new Map<string, ForceSignal<KeyValuePair<Coordiante, Tile>>>());

    addOwnedTile(tile: ForceSignal<KeyValuePair<Coordiante, Tile>>) {
        this.ownedTiles.get().set(tile.get().key.getKey(), tile)
        this.ownedTiles.forceUpdate()
    }

    removeOwnedTile(tile: ForceSignal<KeyValuePair<Coordiante, Tile>>) {
        this.ownedTiles.get().delete(tile.get().key.getKey())
        this.ownedTiles.forceUpdate()
    }

    clearOwnedTiles() {
        this.ownedTiles.get().clear()
        this.ownedTiles.forceUpdate()
    }

    ownedTilesNumber = computed(()=>{
        return this.ownedTiles.get().size
    })

    canNextTurn = computed(()=>{
        return this.produced().get("authority")! >= this.produced().get("authority-need")! &&
            this.produced().get("food")! >= this.produced().get("food-need")!
    })

    override produced = computed(()=>{
        const production = new Map(super.produced())
        for (const [key, tile] of this.ownedTiles.get().entries()) {
            const mapEntity = tile.get().value.mapEntity
            if(!!mapEntity && mapEntity.type === "estate") {
                const estate = mapEntity as Estate
                addExistingNumericalValues(production, estate.producedList)
            }
        }
        production.set("authority-need", production.get("authority-need")! + this.ownedTilesNumber())
        return production
    })
}