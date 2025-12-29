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

export class EnvironmentMapEntity extends MapEntity {
    readonly type = "environment";
    actee

    constructor(name: string, maxProgress: number, public resourcesGain: Map<Resource, number>,private onDepletedRewardsGetter?: ()=>Reward[]) {
        super(name);
        this.actee = new SimpleActee("mining", maxProgress, 0)
    }

    override skillAction(skills: Map<Skill,number>): SkillActionResult {
        const actionResult = this.actee.skillAction(skills)
        if(this.onDepletedRewardsGetter && actionResult.justFinished) {
            this.onDepletedRewardsGetter().forEach(x=>x.claim())
        }
        return {
            resourcesGained: multiplyNumericalValuesFunctional(this.resourcesGain, actionResult.progressDone)
        }
    }

    override canAttemptSkillAction(skills: Map<Skill, number>): boolean {
        return this.actee.canAttemptSkillAction(skills)
    }

    getDescription = computed<TextPart[]>(() => {
        let textParts:TextPart[] =  [    
            getSkillSymbol(this.actee.mainSkill) +
            "[" + this.actee.difficulty + "]" +
            "->"
        ]
        if(this.resourcesGain.size > 0) {
            textParts = textParts.concat(
                resourcesToTextParts(multiplyNumericalValuesFunctional(this.resourcesGain, this.actee.progressLeft()))
            )
        } else {
            textParts = textParts.concat(this.actee.progressLeft() + "/" + this.actee.maxProgress)
        }
        return textParts
    })
}