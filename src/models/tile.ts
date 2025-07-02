import { signal } from "@angular/core";
import { createForceSignal, ForceSignal } from "../util/force-signal";
import { MapEntity } from "./map-entity";


export class Tile {

    terrainType
    mapEntity = createForceSignal<MapEntity|undefined>(undefined)
    belongsTo = createForceSignal<MapEntity|undefined>(undefined)

    constructor(
        terrainType: string
    ) {
        this.terrainType = signal(terrainType)
    }

}