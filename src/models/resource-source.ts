import { signal } from "@angular/core";
import { Resource } from "./resource";
import { Skill } from "./skill";

export type ResourceSourceActionResult = {
    resources: Map<Resource,number>
    isFinished: boolean
}

export abstract class ResourceSource {
    abstract action(skills: Map<Skill,number>): ResourceSourceActionResult
    abstract canAttempt(skills: Map<Skill,number>): boolean
}

export class RegularResourceSource extends ResourceSource {
    resourceAmount = signal(0)
    constructor(public mainSkill: Skill, public resourceType: Resource, resourceAmount: number) {
        super()
        this.resourceAmount.set(resourceAmount)
    }

    override action(skills: Map<Skill, number>): ResourceSourceActionResult {
        const appliedSkillPoints = skills.get(this.mainSkill) || 0
        const resourceGained = Math.min(this.resourceAmount(), appliedSkillPoints)
        this.resourceAmount.set(this.resourceAmount() - resourceGained)
        return {
            resources: new Map([[this.resourceType, resourceGained]]),
            isFinished: this.resourceAmount() <= 0
        }
    }

    override canAttempt(skills: Map<Skill, number>): boolean {
        return skills.has(this.mainSkill)
    }

}