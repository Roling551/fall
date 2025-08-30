import { signal } from "@angular/core";
import { createForceSignal, ForceSignal } from "../util/force-signal";
import { MapEntity } from "./map-entity";
import { Unit } from "./unit";
import { Resource } from "./resource";

export type ResourceSource = {type: Resource, difficulty: number, amount: number}

export class Tile {

    terrainType
    mapEntity = createForceSignal<MapEntity|undefined>(undefined)
    belongsTo = createForceSignal<MapEntity|undefined>(undefined)
    units = createForceSignal(new Set<Unit>())

    constructor(
        terrainType: string,
        resurceSources: ResourceSource[] = []
    ) {
        this.terrainType = signal(terrainType)
    }

}