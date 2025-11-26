import { computed, Injectable } from "@angular/core";
import { createForceSignal } from "../util/force-signal";
import { Resource } from "../models/resource";
import { addNumericalValuesFunctional, mapContainsMap, substractNumericalValuesFunctional } from "../util/map-functions";

@Injectable({
    providedIn: 'root'
})
export class ResourcesService {
    resources = createForceSignal<Map<Resource,number>>(new Map([["oil",25], ["scrap",25], ["water",25]]))

    canAffordResources(price: Map<string, number>) {
    return mapContainsMap(this.resources.get(), price)
}

    spendResources(price: Map<Resource, number>) {
        this.resources.set(substractNumericalValuesFunctional(this.resources.get(), price))
        this.resources.forceUpdate()
    }

    addResources(resources: Map<Resource, number>) {
        this.resources.set(addNumericalValuesFunctional(this.resources.get(), resources))
        this.resources.forceUpdate()
    }

    text = computed(()=>{
        return "Oil:" + this.resources.get().get("oil") + 
        " Scrap: " + this.resources.get().get("scrap") + 
        " Water: " + this.resources.get().get("water")
    })
}
