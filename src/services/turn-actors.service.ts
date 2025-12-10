import { computed, Injectable } from "@angular/core";
import { TurnActor } from "../models/turn-actor";
import { createForceSignal } from "../util/force-signal";
import { ResourcesService } from "./resources.service";
import { Resource } from "../models/resource";
import { addNumericalValues } from "../util/map-functions";

@Injectable({
  providedIn: 'root'
})
export class TurnActorsService {
    constructor(private resourcesService: ResourcesService) {}

    actors = createForceSignal<TurnActor[]>([])
    addActor(actor: TurnActor) {
        this.actors.get().push(actor)
        this.actors.forceUpdate()
    }

    removeActor(actor: TurnActor) {
        this.actors.set(this.actors.get().filter(x=>x!=actor))
    }

    requiredResources = computed(() => {
        const requiredResources = new Map<Resource, number>() 
        for(const actor of this.actors.get()) {
            addNumericalValues(requiredResources, actor.getRequiredResources())
        }
        return requiredResources
    })

    nextTurn() {
        for(const actor of this.actors.get()) {
            if(this.resourcesService.canAffordResources(actor.getRequiredResources())) {
                this.resourcesService.spendResources(actor.getRequiredResources())
                actor.enable()
            } else {
                actor.disable()
            }
        }
        for(const actor of this.actors.get()) {
            actor.turnAction()
        }
    }

    clear() {
        this.actors.set([])
    }
}