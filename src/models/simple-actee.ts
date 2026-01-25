import { computed, Signal, signal } from "@angular/core";
import { Actee, SkillResult } from "./actee";
import { Skill } from "./skill";
import { Extraction } from "./extraction";

export type ActeeModifications = "Hardness" | "Fragility"

export type ActeeSettings = {
    maxProgress: number, 
    modifications?: Map<ActeeModifications, number>
}

export class SimpleActee implements Actee {

    currentProgress = signal(0)

    public maxProgress: number
    public modifications: Map<ActeeModifications, number>

    constructor(settings: ActeeSettings) {
        this.maxProgress = settings.maxProgress
        this.modifications = settings.modifications || new Map()
    }
    
    extractionAction(extraction: Extraction): SkillResult {
        const previousProgress = this.currentProgress()
        this.currentProgress.update(x=>Math.min(this.maxProgress, x+Math.max(0, this.extractionStrengthApplied(extraction))))
        const isDone = this.currentProgress() >= this.maxProgress
        return {
            progressDone: this.currentProgress() - previousProgress,
            currentProgress: this.currentProgress(),
            isDone,
            justFinished: isDone && previousProgress < this.maxProgress 
        }
    }

    extractionStrengthApplied(extraction: Extraction) {
        const hardnessEffect = Math.max(0, (this.modifications.get("Hardness") || 0) - (extraction.modyfications.get("Sharpness") || 0))
        return extraction.strength - hardnessEffect
    }

    canAttemptExtractionAction(extraction: Extraction): boolean {
        return true
    }

    progressLeft = computed(()=> {
        return this.maxProgress - this.currentProgress()
    })
}