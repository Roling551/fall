import { ForceSignal } from "../util/force-signal";
import { LimitedSet } from "../util/limited-set";
import { Building } from "./building";
import { MapEntity, MapEntityType, SkillActionResult } from "./map-entity";
import { ResourcesSources } from "./resources-sources";
import { Skill } from "./skill";

export class EnvironmentMapEntity extends MapEntity {
    readonly type = "environment";

    public resourcesSources: ResourcesSources = new ResourcesSources()


    override skillAction(skills: Map<Skill,number>) {
        for(const source of this.resourcesSources.sources.get()) {
            if(source.canAttempt(skills)) {
                const resourceSourceActionResult = source.action(skills)
                return {
                    resourcesGained: resourceSourceActionResult.resources
                }
            }
        }
        throw Error("Skill action can not be attempted")
    }

    override canAttemptSkillAction(skills: Map<Skill, number>): boolean {
     for(const source of this.resourcesSources.sources.get()) {
        if(source.canAttempt(skills)) {
                return true
            }
        }
        return false
    }
    
}