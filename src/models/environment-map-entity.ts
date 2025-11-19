import { computed } from "@angular/core";
import { ForceSignal } from "../util/force-signal";
import { LimitedSet } from "../util/limited-set";
import { multiplyNumericalValues, multiplyNumericalValuesFunctional } from "../util/map-functions";
import { Building } from "./building";
import { MapEntity, MapEntityType, SkillActionResult } from "./map-entity";
import { Resource, resourcesToString } from "./resource";
import { Reward } from "./reward";
import { SimpleActee } from "./simple-actee";
import { getSkillSymbol, Skill } from "./skill";

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

    getDescription = computed(() => {
        let text =  "" +    
            getSkillSymbol(this.actee.mainSkill) +
            "[" + this.actee.difficulty + "]" +
            "->"
        if(this.resourcesGain.size > 0) {
            text += resourcesToString(multiplyNumericalValuesFunctional(this.resourcesGain, this.actee.progressLeft()))
        } else {
            text += this.actee.progressLeft() + "/" + this.actee.maxProgress
        }
        return text
    })
}