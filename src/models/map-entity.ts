import { computed } from "@angular/core"
import { createForceSignal, ForceSignal } from "../util/force-signal"
import { LimitedSet } from "../util/limited-set"
import { Building } from "./building"
import { addExistingNumericalValues } from "../util/map-functions"
import { Skill } from "./skill"
import { Resource } from "./resource"

export type MapEntityType = "estate" | "station" | "environment"

export interface SkillActionResult {
    resourcesGained?: Map<Resource, number>
}

export abstract class MapEntity {
    abstract readonly type: MapEntityType
    public buildings

    constructor(public textureName: string, public buildingsSlots: number = 0){
        this.buildings = createForceSignal(
            new LimitedSet<ForceSignal<Building>>(
                this.buildingsSlots,
                (item)=>{return item.get().size})
    )};

    createBuilding(building: Building) {
        this.buildings.get().add(createForceSignal(building))
        this.buildings.forceUpdate()
    }

    removeBuilding(building: ForceSignal<Building>) {
        this.buildings.get().delete(building)
        this.buildings.forceUpdate()
    }

    abstract skillAction(skills: Map<Skill,number>): SkillActionResult
    abstract canAttemptSkillAction(skills: Map<Skill, number>): boolean
}