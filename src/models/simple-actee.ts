import { computed, Signal, signal } from "@angular/core";
import { Actee, SkillResult } from "./actee";
import { Skill } from "./skill";
import { Extraction } from "./extraction";

export class SimpleActee implements Actee {

    currentProgress = signal(0)

    constructor(public maxProgress: number) {}
    
    extractionAction(extraction: Extraction): SkillResult {
        const previousProgress = this.currentProgress()
        this.currentProgress.update(x=>Math.min(this.maxProgress, x+Math.max(0, extraction.strength)))
        const isDone = this.currentProgress() >= this.maxProgress
        return {
            progressDone: this.currentProgress() - previousProgress,
            currentProgress: this.currentProgress(),
            isDone,
            justFinished: isDone && previousProgress < this.maxProgress 
        }
    }

    canAttemptExtractionAction(extraction: Extraction): boolean {
        return true
    }

    progressLeft = computed(()=> {
        return this.maxProgress - this.currentProgress()
    })
}