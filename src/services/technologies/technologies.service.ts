import { Injectable } from "@angular/core";
import { createForceSignal } from "../../util/force-signal";
import { Technology } from "../../models/technology";
import { Cell, createTreeFromPairs } from "../../models/cell";
import { initialTechnologies, initiaTechnologiesParenthood, topTechnologyName } from "./initial-technologies";
import { Benefit } from "../../models/benefit";
import { TechnologyTreeItem } from "../../models/technology-tree-item";

@Injectable({
  providedIn: 'root'
})
export class TechnologiesService {
    technologies_ = createForceSignal(
        createTreeFromPairs(
            topTechnologyName, 
            initialTechnologies, 
            initiaTechnologiesParenthood, 
            (technologyItem: TechnologyTreeItem) => technologyItem.name, 
            (technologyItem: TechnologyTreeItem) => technologyItem.width
        )
    )
    technologies = this.technologies_.get

    benefits = createForceSignal(new Map<string, Benefit>)

    constructor() {
        this.technologies_.get().value.makeAvaliable()
    }

    public discover(technology: Technology) {
        for(const [name, benefit] of technology.benefits) {
            this.benefits.get().set(technology.name+">"+name, benefit)
        }
        this.benefits.forceUpdate()
    }

}