import { computed, Signal, signal } from "@angular/core";
import { Actee, SkillResult } from "./actee";
import { Skill } from "./skill";

export class SimpleActee implements Actee {

    currentProgress = signal(0)

    constructor(public mainSkill: Skill, public maxProgress: number, public difficulty: number) {}
    
    skillAction(skills: Map<Skill,number>): SkillResult {
        const relevantsSkill = skills.get(this.mainSkill)
        if(relevantsSkill == undefined) {
            throw Error("No matching skill")
        }
        const previousProgress = this.currentProgress()
        this.currentProgress.update(x=>Math.min(this.maxProgress, x+Math.max(0, relevantsSkill)))
        const isDone = this.currentProgress() >= this.maxProgress
        return {
            progressDone: this.currentProgress() - previousProgress,
            currentProgress: this.currentProgress(),
            isDone,
            justFinished: isDone && previousProgress < this.maxProgress 
        }
    }

    canAttemptSkillAction(skills: Map<Skill,number>): boolean {
        return skills.has(this.mainSkill)
    }

    progressLeft = computed(()=> {
        return this.maxProgress - this.currentProgress()
    })
}