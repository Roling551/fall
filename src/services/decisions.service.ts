import { Injectable } from "@angular/core";
import { createForceSignal } from "../util/force-signal";
import { Decision } from "../models/decision";

@Injectable({
  providedIn: 'root'
})
export class DecisionsService {
    decisions = createForceSignal<Decision[]>([])

    addDecision(decision: Decision) {
        this.decisions.get().push(decision)
        this.decisions.forceUpdate()
    }

    removeFirstDecision() {
        this.decisions.get().shift()
        this.decisions.forceUpdate()
    }

    getFirstDecision() {
        return this.decisions.get()[0]
    }
}