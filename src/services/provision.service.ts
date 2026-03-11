import { computed, Injectable, signal } from "@angular/core";
import { ResourcesService } from "./resources.service";
import { Resource } from "../models/resource";
import { capFunctional, divideNumericalValuesFunctional, multiplyNumericalValuesFunctional, roundUpFunctional, sumMapValues } from "../util/map-functions";

export interface ProvisionValue {
    resources: Map<Resource, number>
}

export interface MaxProvisionPick {
    resources: Map<Resource, number>
}

export interface ProvisionPick {
    resources: Map<Resource, number>
}

export interface PickProvisionSettings {
    capacity: number,
    resourcesPerCapacity: number
}

export function provisionPickToValues(pick: ProvisionPick, provision: ProvisionValue, settings: PickProvisionSettings): ProvisionValue {
    return {
        resources: capFunctional(multiplyNumericalValuesFunctional(pick.resources, settings.resourcesPerCapacity), provision.resources)
    }
}

export function getProvisionPickAllocation(provisionPick: ProvisionPick) {
    return sumMapValues(provisionPick.resources)
}

@Injectable({
  providedIn: 'root'
})
export class ProvisionService {
    constructor(private resourcesService: ResourcesService) {}

    currentProvision = signal<ProvisionValue|undefined>(undefined)
    currentPickProvisionSettings = computed(()=>{
        return {
            capacity: 10,
            resourcesPerCapacity: 5
        }
    })
    maxProvisonPick = computed<MaxProvisionPick>(()=>{
       return {
            resources: roundUpFunctional(divideNumericalValuesFunctional(this.currentProvision()!.resources, this.currentPickProvisionSettings().resourcesPerCapacity))
        }
    })

    public changeIntoProvision() {
        const resources = new Map(this.resourcesService.resources.get())
        this.resourcesService.removeAllResources()
        this.resourcesService.removeNonPermanentResources(resources)
        this.currentProvision.set({
            resources
        })
    }

    public useProvision(pick: ProvisionPick) {
        const values = provisionPickToValues(pick, this.currentProvision()!,this.currentPickProvisionSettings())
        this.resourcesService.addResources(values.resources)
    }
}