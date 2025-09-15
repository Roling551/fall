import { createForceSignal } from "../util/force-signal";
import { Resource } from "./resource";
import { RegularResourceSource, ResourceSource } from "./resource-source";
import { Skill } from "./skill";

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

    changeFirstOfType(resource: Resource, change: number) {
        for(const resourceSource of this.sources.get()) {
            if(resourceSource instanceof RegularResourceSource && resourceSource.resourceType === resource) {
                resourceSource.change(resource, change)
                return
            }
        }
        this.addResourceSource("mining", resource, change)
    }
}