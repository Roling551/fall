import { computed } from "@angular/core"
import { createForceSignal, ForceSignal } from "../util/force-signal"
import { LimitedSet } from "../util/limited-set"
import { Building } from "./building"
import { addExistingNumericalValues } from "../util/map-functions"

export type mapEntityType = "city" | "estate" | "extractionSite"

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

    public baseProduced (){
        const production = new Map([["food",0], ["food-need",0], ["authority",0], ["authority-need",0], ["gold",0], ["workers", 0], ["workers-need", 0]])
        for (const building of this.buildings.get().values()) {
            addExistingNumericalValues(production, building.get().produced)
        }
        return production
    }

    public produced = computed(()=>{return this.baseProduced()})
}