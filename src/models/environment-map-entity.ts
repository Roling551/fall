import { computed } from "@angular/core";
import { ForceSignal } from "../util/force-signal";
import { LimitedSet } from "../util/limited-set";
import { multiplyNumericalValues, multiplyNumericalValuesFunctional } from "../util/map-functions";
import { Building } from "./building";
import { MapEntity, MapEntityType, SkillActionResult } from "./map-entity";
import { Resource, resourcesToTextParts } from "./resource";
import { Reward } from "./reward";
import { SimpleActee } from "./simple-actee";
import { getSkillSymbol, Skill } from "./skill";
import { TextPart } from "./text-part";
import { Actee } from "./actee";

export type SkillInstance = {
    skill: Skill,
    difficulty: number,
    maxProgress: number,
}

export class EnvironmentMapEntity extends MapEntity {
    readonly type = "environment";
    actee?: SimpleActee

    constructor(name: string, skillInstance?: SkillInstance, public resourcesGain?: Map<Resource, number>, private onDepletedRewardsGetter?: ()=>Reward[]) {
        super(name);
        if(skillInstance) {
            this.actee = new SimpleActee(skillInstance.skill, skillInstance.maxProgress, skillInstance.difficulty)
        }
        
    }

    override skillAction(skills: Map<Skill,number>): SkillActionResult {
        if(!this.actee) {
            return {}
        }
        const actionResult = this.actee.skillAction(skills)
        if(this.onDepletedRewardsGetter && actionResult.justFinished) {
            this.onDepletedRewardsGetter().forEach(x=>x.claim())
        }
        if(this.onSelfDestroy && actionResult.justFinished) {
            this.onSelfDestroy()
        }
        return {
            ...(this.resourcesGain && {resourcesGained: multiplyNumericalValuesFunctional(this.resourcesGain, actionResult.progressDone)})
        }
    }

    override canAttemptSkillAction(skills: Map<Skill, number>): boolean {
        return !!this.actee && this.actee.canAttemptSkillAction(skills)
    }

    getDescription = computed<TextPart[]>(() => {
        if(!this.actee) {
            return []
        }
        let textParts:TextPart[] =  [    
            getSkillSymbol(this.actee.mainSkill) +
            "[" + this.actee.difficulty + "]" +
            "->"
        ]
        if(this.resourcesGain) {
            textParts = textParts.concat(
                resourcesToTextParts(multiplyNumericalValuesFunctional(this.resourcesGain, this.actee.progressLeft()))
            )
        } else {
            textParts = textParts.concat(this.actee.progressLeft() + "/" + this.actee.maxProgress)
        }
        return textParts
    })
}