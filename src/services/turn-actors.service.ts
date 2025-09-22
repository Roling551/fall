import { Injectable } from "@angular/core";
import { TurnActor } from "../models/turn-actor";
import { createForceSignal } from "../util/force-signal";
import { ResourcesService } from "./resources.service";

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