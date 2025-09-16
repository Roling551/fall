import { effect, signal } from "@angular/core";
import { Resource } from "./resource";
import { Skill } from "./skill";

export type ResourceSourceActionResult = {
    resources: Map<Resource,number>
    isFinished: boolean
}

export abstract class ResourceSource {
    abstract action(skills: Map<Skill,number>): ResourceSourceActionResult
    abstract canAttempt(skills: Map<Skill,number>): boolean
    constructor(protected onDepleted: (resourceSource: ResourceSource)=> void) {}
}

export class RegularResourceSource extends ResourceSource {
    resourceAmount = signal(0)
    difficulty = signal(0)
    constructor(
        onDepleted: (resourceSource: ResourceSource)=> void, 
        public mainSkill: Skill, 
        difficulty: number,
        public resourceType: Resource, 
        resourceAmount: number
    ) {
        super(onDepleted)
        this.resourceAmount.set(resourceAmount)
    }
    override action(skills: Map<Skill, number>): ResourceSourceActionResult {
        const appliedSkillPoints = skills.get(this.mainSkill) || 0
        const resourceGained = Math.max(Math.min(this.resourceAmount(), appliedSkillPoints-this.difficulty()),0)
        this.resourceAmount.set(this.resourceAmount() - resourceGained)
        
        if(this.resourceAmount() <= 0) {
            this.onDepleted!(this)
        }
        return {
            resources: new Map([[this.resourceType, resourceGained]]),
            isFinished: this.resourceAmount() <= 0
        }
    }
    override canAttempt(skills: Map<Skill, number>): boolean {
        return skills.has(this.mainSkill)
    }
    change(skill: Skill, difficulty: number, resource: Resource, amount: number) {
        if(this.resourceType == resource && this.mainSkill == skill) {
            this.resourceAmount.set(amount)
            this.difficulty.set(difficulty)
            if(this.resourceAmount() <= 0) {
                this.onDepleted!(this)
            }
            return true
        }
        return false
    }
}