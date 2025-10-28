import { Signal } from "@angular/core"
import { SkillActionResult } from "./map-entity"
import { Skill } from "./skill"

export interface SkillResult {
    progressDone: number,
    currentProgress: number,
    isDone: boolean,
    justFinished: boolean,
}

export interface Actee {
    skillAction(skills: Map<Skill,number>): SkillResult
    canAttemptSkillAction(skills: Map<Skill,number>): boolean
    maxProgress: number
    currentProgress: Signal<number>
    progressLeft: Signal<number>
}