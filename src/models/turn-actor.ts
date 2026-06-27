import { Signal } from "@angular/core"
import { Resource } from "./resource"
import { Benefit } from "./benefit"

export interface TurnActor {
    mapInteractionAction(): void
    mapGatheringAction(): void
    getRunCost(): Map<Resource, number>
    getProducedResources(): Map<Resource, number> | undefined
    disable: ()=>void
    enable: ()=>void
    benefits: Signal<Benefit[]>
    disabled: Signal<boolean>
}