import { effect, Signal, signal, untracked } from "@angular/core";
import { createForceSignal, ForceSignal } from "../../util/force-signal";
import { MapEntity, MapEntityType, SkillActionResult } from "../map-entity";
import { Unit } from "../unit";
import { Resource } from "../resource";
import { Coordinate } from "../coordinate";
import { Obstacles } from "../obstacles";
import { Skill } from "../skill";


export abstract class Tile {
    static count = 0;
    public readonly id: number

    constructor(public coordinate: Coordinate) {
        this.id = Tile.count
        Tile.count += 1
    }

    abstract skillAction(skills: Map<Skill,number>): SkillActionResult
    abstract canAttemptSkillAction(skills: Map<Skill,number>): boolean
    abstract addMapEntity(mapEntity: MapEntity): boolean
    abstract canAddEntity(type: MapEntityType): boolean
    abstract removeMapEntity(): boolean
    abstract getMapEntities(): Signal<MapEntity[]>

    units = createForceSignal(new Set<Unit>())

    obstacles = createForceSignal<Obstacles>(new Obstacles())
}