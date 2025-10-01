import { Signal, signal } from "@angular/core"
import { createForceSignal } from "../../util/force-signal"
import { MapEntity, SkillActionResult } from "../map-entity"
import { ResourceSourceActionResult } from "../resource-source"
import { ResourcesSources } from "../resources-sources"
import { Skill } from "../skill"
import { Tile } from "./tile"
import { Coordinate } from "../coordinate"
import { Obstacles } from "../obstacles"

export abstract class BaseTile extends Tile {
    terrainType
    abstract mapEntities: Signal<MapEntity[]>

    override skillAction(skills: Map<Skill, number>): SkillActionResult {
        for(const mapEntity of this.mapEntities()) {
            if(mapEntity.canAttemptSkillAction(skills)) {
                return mapEntity.skillAction(skills) 
            }
        }
        throw Error("Skill action can not be attempted")
    }
    override canAttemptSkillAction(skills: Map<Skill, number>): boolean {
        for(const mapEntity of this.mapEntities()) {
            if(mapEntity.canAttemptSkillAction(skills)) {
                return true
            }
        }
        return false
    }

    constructor(
        coordinate: Coordinate,
        terrainType: string,
        obstacles: Obstacles = new Obstacles()
    ) {
        super(coordinate)
        this.terrainType = signal(terrainType)
        this.obstacles.set(obstacles)
    }
}
