import { Injectable } from "@angular/core";
import { TurnActor } from "../models/turn-actor";

@Injectable({
  providedIn: 'root'
})
export class TurnActorsService {
    actors : TurnActor[] = []
    addActor(actor: TurnActor) {
        this.actors.push(actor)
    }

    nextTurn() {
        for(const actor of this.actors) {
            actor.turnAction()
        }
    }
}