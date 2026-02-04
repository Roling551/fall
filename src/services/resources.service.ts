import { computed, Injectable } from "@angular/core";
import { createForceSignal } from "../util/force-signal";
import { isResourcePermanent, Resource, ResourceKeys } from "../models/resource";
import { addNumericalValuesFunctional, mapContainsMap, removeNonPositiveValuesFunctional, substractNumericalValuesFunctional } from "../util/map-functions";

@Injectable({
    providedIn: 'root'
})
export class ResourcesService {
    resources = createForceSignal<Map<Resource,number>>(new Map(ResourceKeys.map(x=>[x,0])))

    canAffordResources(price: Map<Resource, number>) {
        return mapContainsMap(this.resources.get(), price)
    }

    canAffordResourcesExcludeNonPermanent(price: Map<Resource, number>) {
        return mapContainsMap(new Map([...this.resources.get()].map(x=>[x[0],isResourcePermanent(x[0])?x[1]:0])), price)
    }

    getResourcesLeftToAfford(price: Map<Resource, number>) {
        return removeNonPositiveValuesFunctional(substractNumericalValuesFunctional(price, this.resources.get()))
    }

    spendResources(price: Map<Resource, number>) {
        this.resources.set(substractNumericalValuesFunctional(this.resources.get(), price))
        this.resources.forceUpdate()
    }

    addResources(resources: Map<Resource, number>) {
        this.resources.set(addNumericalValuesFunctional(this.resources.get(), resources))
        this.resources.forceUpdate()
    }

    removeNonPermanentResources() {
        const resources = this.resources.get()
        for(const [resource,_] of resources) {
            if(!isResourcePermanent(resource)) {
                resources.set(resource, 0)
            }
        }
        this.resources.forceUpdate()
    }
}
