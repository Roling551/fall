import { signal } from "@angular/core"
import { createForceSignal } from "../../util/force-signal"
import { MapEntity } from "../map-entity"
import { ResourceSourceActionResult } from "../resource-source"
import { ResourcesSources } from "../resources-sources"
import { Skill } from "../skill"
import { Tile } from "./tile"
import { Coordinate } from "../coordinate"
import { Obstacles } from "../obstacles"

export class BasicTile extends Tile {
    terrainType
    mapEntity = createForceSignal<MapEntity|undefined>(undefined)
    public resourcesSources: ResourcesSources = new ResourcesSources()

    override skillAction(skills: Map<Skill, number>): ResourceSourceActionResult {
        for(const source of this.resourcesSources.sources.get()) {
            if(source.canAttempt(skills)) {
                return source.action(skills) 
            }
        }
        throw Error("Skill action can not be attempted")
    }
    override canAttemptSkillAction(skills: Map<Skill, number>): boolean {
        for(const source of this.resourcesSources.sources.get()) {
            if(source.canAttempt(skills)) {
                return true
            }
        }
        return false
    }
    override addMapEntity(mapEntity: MapEntity): boolean {
        if(!!this.mapEntity.get()) {
            return false
        }
        this.mapEntity.set(mapEntity)
        return true
    }
    override removeMapEntity(): boolean {
        this.mapEntity.set(undefined)
        return true
    }
    override canAddEntity(): boolean {
        return !this.mapEntity.get()
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
