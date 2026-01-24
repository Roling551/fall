import { Signal } from "@angular/core"
import { Skill } from "./skill"
import { Extraction } from "./extraction"

export interface SkillResult {
    progressDone: number,
    currentProgress: number,
    isDone: boolean,
    justFinished: boolean,
}

export interface Actee {
    extractionAction(extraction: Extraction): SkillResult
    canAttemptExtractionAction(extraction: Extraction): boolean
    maxProgress: number
    currentProgress: Signal<number>
    progressLeft: Signal<number>
}