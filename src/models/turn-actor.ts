import { Signal } from "@angular/core"
import { MovementBonus, SkillMapActionSkillBonus } from "./bonus"
import { Resource } from "./resource"
import { Skill } from "./skill"
import { Benefit } from "./benefit"

export interface TurnActor {
    mapInteractionAction(): void
    mapGatheringAction(): void
    getRequiredResources(): Map<Resource, number>
    getProducedResources(): Map<Resource, number> | undefined
    disable: ()=>void
    enable: ()=>void
    benefits: Signal<Benefit[]>
    disabled: Signal<boolean>
}