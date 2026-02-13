import { signal, Signal } from "@angular/core";
import { Benefit } from "./benefit";
import { Resource } from "./resource";
import { TurnActor } from "./turn-actor";
import { ForceSignal } from "../util/force-signal";
import { LevelAttribute } from "./level-attributes";

export class Headquarters implements TurnActor {
    constructor(private levelAttributes: Signal<Map<LevelAttribute, number>>) {}

    mapInteractionAction(): void {
    }
    mapGatheringAction(): void {
    }
    getRequiredResources(): Map<Resource, number> {
        return new Map([["water", this.levelAttributes().get("heat")||0]])
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