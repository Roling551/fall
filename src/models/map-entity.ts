import { createForceSignal, ForceSignal } from "../util/force-signal"
import { LimitedSet } from "../util/limited-set"
import { Building } from "./building"

export type mapEntityType = "city" | "estate"

export abstract class MapEntity {
    abstract readonly type: mapEntityType
    public buildings

    constructor(public textureName: string, public buildingsSlots: number){
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
}