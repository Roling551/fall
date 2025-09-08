import { Injectable } from "@angular/core";
import { createForceSignal } from "../util/force-signal";
import { Resource } from "../models/resource";
import { WorldStateService } from "./world-state/world-state.service";
import { mapContainsMap, substractNumericalValuesFunctional } from "../util/map-functions";

@Injectable({
    providedIn: 'root'
})
export class ResourcesService {
    resources = createForceSignal<Map<Resource,number>>(new Map([["oil",25]]))

    canAffordResources(worldStateService: WorldStateService, price: Map<string, number>) {
    return mapContainsMap(this.resources.get(), price)
}

    spendResources(worldStateService: WorldStateService, price: Map<string, number>) {
        this.resources.set(substractNumericalValuesFunctional(this.resources.get(), price))
        this.resources.forceUpdate()
    }
}
