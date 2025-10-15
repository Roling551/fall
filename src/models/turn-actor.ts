import { Signal } from "@angular/core"
import { MovementBonus, SkillMapActionSkillBonus } from "./bonus"
import { Resource } from "./resource"
import { Skill } from "./skill"

export interface TurnActor {
    turnAction(): void
    getRequiredResources(): Map<Resource, number>
    disable: ()=>void
    enable: ()=>void
    getSkillMapActionSkillBonus: Signal<SkillMapActionSkillBonus|undefined>
    getMovementBonus: Signal<MovementBonus|undefined>
}