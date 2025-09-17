import { signal } from "@angular/core";
import { createForceSignal } from "../util/force-signal";
import { Resource } from "./resource";
import { RegularResourceSource, ResourceSource } from "./resource-source";
import { Skill } from "./skill";

export class EditMapParameters {
    skill = signal<Skill>("mining")
    resource = signal<Resource>("water")
    amount = signal(1)
    difficulty = signal(0)
}

export class ResourcesSources {
    sources = createForceSignal<ResourceSource[]>([])
    
    constructor() {}

    onDepleted = (resourceSource: ResourceSource) => {
        this.sources.set(this.sources.get().filter(x=>x!=resourceSource))
    }

    addResourceSource(skill: Skill, difficulty: number, resource: Resource, change: number) {
        if(change <= 0) {
            return
        }
        this.sources.get().push(new RegularResourceSource(this.onDepleted, skill, difficulty, resource, change))
        this.sources.forceUpdate()
    }

    changeFirstOfType(parameters: EditMapParameters) {
        for(const resourceSource of this.sources.get()) {
            if(
                resourceSource instanceof RegularResourceSource && 
                resourceSource.change(parameters.skill(), parameters.difficulty(), parameters.resource(), parameters.amount())
            ) {
                return
            }
        }
        this.addResourceSource(
            parameters.skill(), 
            parameters.difficulty(),
            parameters.resource(), 
            parameters.amount(),
        )
    }

    static fromJSON(json: any) {
        const resourcesSources = new ResourcesSources()
        resourcesSources.sources.set(json.sources.map((sourceJSON:any)=>
            RegularResourceSource.fromJSON(sourceJSON, resourcesSources.onDepleted))
        )
        return resourcesSources
    }
}