import { effect, Signal, signal, untracked } from "@angular/core";
import { createForceSignal, ForceSignal } from "../../util/force-signal";
import { MapEntity, MapEntityType, SkillActionResult } from "../map-entity";
import { Unit } from "../unit";
import { Resource } from "../resource";
import { Coordinate } from "../coordinate";
import { Obstacles } from "../obstacles";
import { Extraction } from "../extraction";


export abstract class Tile {
    static count = 0;
    public readonly id: number

    constructor(public coordinate: Coordinate) {
        this.id = Tile.count
        Tile.count += 1
    }

    abstract extractionAction(extraction: Extraction): SkillActionResult
    abstract canAttemptExtractionAction(extraction: Extraction): boolean
    abstract addMapEntity(mapEntity: MapEntity): boolean
    abstract canAddEntity(type: MapEntityType): boolean
    abstract removeMapEntity(mapEntity: MapEntity): boolean
    abstract getMapEntities(): Signal<MapEntity[]>
    abstract getVisibleMapEntities(): Signal<MapEntity[]>
    abstract getExtractedResources(): Map<Resource, number>
    abstract changeExtractedResources(change: Map<Resource, number>, remove?: number): void
    abstract clearExtractedResources(): void

    units = createForceSignal(new Set<Unit>())

    obstacles = createForceSignal<Obstacles>(new Obstacles())
}