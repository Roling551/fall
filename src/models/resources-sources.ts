import { signal } from "@angular/core";
import { createForceSignal } from "../util/force-signal";
import { Resource } from "./resource";
import { RegularResourceSource, ResourceSource } from "./resource-source";
import { Skill } from "./skill";

export class EditMapParameters {
    skill = signal<Skill>("mining")
    resource = signal<Resource>("water")
    change = signal(1)
}

export class ResourcesSources {
    sources = createForceSignal<ResourceSource[]>([])
    
    constructor() {}

    onDepleted = (resourceSource: ResourceSource) => {
        this.sources.set(this.sources.get().filter(x=>x!=resourceSource))
    }

    addResourceSource(skill: Skill, resource: Resource, change: number) {
        if(change <= 0) {
            return
        }
        this.sources.get().push(new RegularResourceSource(this.onDepleted, skill, resource, change))
        this.sources.forceUpdate()
    }

    changeFirstOfType(parameters: EditMapParameters) {
        for(const resourceSource of this.sources.get()) {
            if(resourceSource instanceof RegularResourceSource && resourceSource.resourceType === parameters.resource()) {
                resourceSource.change(parameters.resource(), parameters.change())
                return
            }
        }
        this.addResourceSource("mining", parameters.resource(), parameters.change())
    }
}