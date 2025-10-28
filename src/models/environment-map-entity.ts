import { ForceSignal } from "../util/force-signal";
import { LimitedSet } from "../util/limited-set";
import { multiplyNumericalValues, multiplyNumericalValuesFunctional } from "../util/map-functions";
import { Building } from "./building";
import { MapEntity, MapEntityType, SkillActionResult } from "./map-entity";
import { Resource } from "./resource";
import { Reward } from "./reward";
import { SimpleActee } from "./simple-actee";
import { Skill } from "./skill";

export class EnvironmentMapEntity extends MapEntity {
    readonly type = "environment";
    actee

    constructor(name: string, maxProgress: number, public resourcesGain: Map<Resource, number>,private onDepletedRewards?: Reward[]) {
        super(name);
        this.actee = new SimpleActee("mining", maxProgress, 0)
    }

    override skillAction(skills: Map<Skill,number>): SkillActionResult {
        const actionResult = this.actee.skillAction(skills)
        if(this.onDepletedRewards && actionResult.justFinished) {
            this.onDepletedRewards.forEach(x=>x.claim())
        }
        return {
            resourcesGained: multiplyNumericalValuesFunctional(this.resourcesGain, actionResult.progressDone)
        }
    }

    override canAttemptSkillAction(skills: Map<Skill, number>): boolean {
        return this.actee.canAttemptSkillAction(skills)
    }   
}