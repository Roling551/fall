import { computed, signal } from "@angular/core";
import { createForceSignal } from "../util/force-signal";
import { Unit } from "./unit";

export class Army {
    units = createForceSignal(new Set<Unit>())
    path? : string[]
    speed = computed(()=> {
        let speed_ = Infinity
        for(const unit of this.units.get()) {
            speed_ = Math.min(speed_, unit.speed)
        }
        return speed_
    })
    movesLeft = signal(0)
    startBattleTurn() {
        this.movesLeft.set(this.speed())
    }
}