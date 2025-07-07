import { computed, signal } from "@angular/core";
import { createForceSignal } from "../util/force-signal";
import { Unit } from "./unit";

export class Army {
    units = createForceSignal(new Set<Unit>())
    path? : string[]
}