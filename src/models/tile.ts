import { signal } from "@angular/core";
import { createForceSignal, ForceSignal } from "../util/force-signal";
import { MapEntity } from "./map-entity";
import { Unit } from "./unit";
import { Resource } from "./resource";
import { Coordinate } from "./coordinate";
import { Obstacles } from "./obstacles";

export type ResourceSource = {type: Resource, difficulty: number, amount: number}

export class Tile {

    terrainType
    mapEntity = createForceSignal<MapEntity|undefined>(undefined)
    belongsTo = createForceSignal<MapEntity|undefined>(undefined)
    units = createForceSignal(new Set<Unit>())

    resourceSources = createForceSignal<ResourceSource[]>([])
    obstacles = createForceSignal<Obstacles>(new Obstacles())

    constructor(
        public coordinate: Coordinate,
        terrainType: string,
        resourceSources: ResourceSource[] = [],
        obstacles: Obstacles = new Obstacles()
    ) {
        this.terrainType = signal(terrainType)
        this.resourceSources.set(resourceSources)
        this.obstacles.set(obstacles)
    }
}