import { computed, Injectable } from "@angular/core";
import { TurnActor } from "../models/turn-actor";
import { createForceSignal } from "../util/force-signal";
import { ResourcesService } from "./resources.service";
import { Resource } from "../models/resource";
import { addNumericalValues, substractNumericalValues } from "../util/map-functions";
import { HeadquartersService } from "./headquarters.service";

@Injectable({
  providedIn: 'root'
})
export class TurnActorsService {
    constructor(private resourcesService: ResourcesService, private headquartersService: HeadquartersService) {}

    actors = createForceSignal<TurnActor[]>([])
    addActor(actor: TurnActor) {
        this.actors.get().push(actor)
        this.actors.forceUpdate()
    }

    removeActor(actor: TurnActor) {
        this.actors.set(this.actors.get().filter(x=>x!=actor))
    }

    resourcesChange = computed(() => {
        const change = new Map<Resource, number>() 
        for(const actor of this.actors.get()) {
            if(!actor.disabled()) {
                const produced = actor.getProducedResources()
                if(produced) {
                    addNumericalValues(change, produced)
                }
                substractNumericalValues(change, actor.getRequiredResources())
            }
        }
        return change
    })

    enabledActors = computed(()=>{
        return this.actors.get().filter(x=>!x.disabled())
    })

    nextTurn() {
        for(const actor of this.enabledActors()) {
            this.resourcesService.spendResources(actor.getRequiredResources())
            const produced = actor.getProducedResources()
            if(produced) {
                this.resourcesService.addResources(produced)
            }
        }
        for(const actor of this.enabledActors()) {
            actor.mapInteractionAction()
        }
        for(const actor of this.enabledActors()) {
            actor.mapGatheringAction()
        }
    }

    nextLevel() {
        this.clear()
        this.addActor(this.headquartersService.headquarters)
    }

    clear() {
        this.actors.set([])
    }
}