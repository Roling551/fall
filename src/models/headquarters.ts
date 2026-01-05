import { signal, Signal } from "@angular/core";
import { Benefit } from "./benefit";
import { Resource } from "./resource";
import { TurnActor } from "./turn-actor";

export class Headquarters implements TurnActor {
    turnAction(): void {
    }
    getRequiredResources(): Map<Resource, number> {
        return new Map([["water", 5]])
    }
    getProducedResources(): Map<Resource, number> | undefined {
        return undefined
    }

    disable() {
    };
    enable() {
    };

    benefits = signal([]);
    disabled = signal(false);

}