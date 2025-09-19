import { Injectable } from "@angular/core";
import { TurnActor } from "../models/turn-actor";
import { createForceSignal } from "../util/force-signal";

@Injectable({
  providedIn: 'root'
})
export class TurnActorsService {
    actors = createForceSignal<TurnActor[]>([])
    addActor(actor: TurnActor) {
        this.actors.get().push(actor)
        this.actors.forceUpdate()
    }

    nextTurn() {
        for(const actor of this.actors.get()) {
            actor.turnAction()
        }
    }

    clear() {
        this.actors.set([])
    }
}