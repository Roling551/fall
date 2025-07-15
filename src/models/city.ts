import { computed } from "@angular/core";
import { createForceSignal, ForceSignal } from "../util/force-signal"
import { Coordiante } from "./coordinate"
import { KeyValuePair } from "./key-value-pair"
import { Tile } from "./tile"
import { MapEntity } from "./map-entity";
import { Estate } from "./estate";
import { addExistingNumericalValues } from "../util/map-functions";
import { Extraction } from "./extraction";

export class City extends MapEntity {
    constructor() {
        super("city", 4)
    }

    readonly type = "city"

    ownedTiles = createForceSignal(new Map<string, KeyValuePair<Coordiante, Tile>>());

    extractions = createForceSignal(new Map<string, Extraction>())

    addOwnedTile(tile: KeyValuePair<Coordiante, Tile>) {
        this.ownedTiles.get().set(tile.key.getKey(), tile)
        this.ownedTiles.forceUpdate()
    }

    removeOwnedTile(tile: KeyValuePair<Coordiante, Tile>) {
        this.ownedTiles.get().delete(tile.key.getKey())
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
        const production = new Map(super.baseProduced())
        for (const [key, tile] of this.ownedTiles.get().entries()) {
            const mapEntity = tile.value.mapEntity.get()
            if(!!mapEntity && mapEntity.type === "estate") {
                const estate = mapEntity as Estate
                addExistingNumericalValues(production, estate.produced())
            }
        }
        for (const [name, extraction] of this.extractions.get()) {
            addExistingNumericalValues(production, extraction.produced())
        }
        production.set("authority-need", production.get("authority-need")! + this.ownedTilesNumber())
        production.set("workers", 10)
        return production
    })

    getExtractionRate = computed(()=>{
        
    })

    getOrCreateExtraction(extractionName: string, extractionConstructor: (belongsTo: any)=> Extraction) {
        if(this.extractions.get().has(extractionName)) {
            return this.extractions.get().get(extractionName)!
        } else {
            const extraction = extractionConstructor(self)
            this.extractions.get().set(extractionName, extraction)
            this.extractions.forceUpdate()
            return extraction
        }
    }
}