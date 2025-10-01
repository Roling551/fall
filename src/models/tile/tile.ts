import { effect, signal, untracked } from "@angular/core";
import { createForceSignal, ForceSignal } from "../../util/force-signal";
import { MapEntity, SkillActionResult } from "../map-entity";
import { Unit } from "../unit";
import { Resource } from "../resource";
import { Coordinate } from "../coordinate";
import { Obstacles } from "../obstacles";
import { ResourceSource, ResourceSourceActionResult } from "../resource-source";
import { ResourcesSources } from "../resources-sources";
import { Skill } from "../skill";


export abstract class Tile {
    constructor(public coordinate: Coordinate) {}

    abstract skillAction(skills: Map<Skill,number>): SkillActionResult
    abstract canAttemptSkillAction(skills: Map<Skill,number>): boolean
    abstract addMapEntity(mapEntity: MapEntity): boolean
    abstract canAddEntity(): boolean
    abstract removeMapEntity(): boolean

    units = createForceSignal(new Set<Unit>())

    obstacles = createForceSignal<Obstacles>(new Obstacles())
}